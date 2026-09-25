import { Resend } from "resend";
import { z } from "zod";
import { CONTACT_SIZES, CONTACT_TOPICS } from "@/lib/contact";
import { saveMessage, setDelivery } from "@/lib/admin/messages";
import { SITE_URL } from "@/lib/site";

// Backend for the contact form. POST only: Next answers any other method with 405.

export const runtime = "nodejs";

const oneLine = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .regex(/^[^\r\n]*$/, "Single line only");

const ContactSchema = z.object({
  name: oneLine(120).min(1),
  email: z.string().trim().max(254).pipe(z.email()),
  company: oneLine(160).optional().default(""),
  size: z.enum(CONTACT_SIZES),
  topic: z.enum(CONTACT_TOPICS),
  message: z.string().trim().max(5000).optional().default(""),
  // Honeypot. People never see it, so anything here means a bot.
  website: z.string().max(500).optional().default(""),
});

const MAX_BODY_BYTES = 20_000;

/* ---------- Rate limit ---------- */

// In memory, per process: fine for the single standalone instance this site runs as. Running
// more than one instance (or restarting often) would need a shared store such as Redis.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string, now = Date.now()) {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  // Keep the map from growing without bound.
  if (hits.size > 5000) {
    for (const [key, times] of hits) if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
  }
  return false;
}

/** nginx sets X-Real-IP / X-Forwarded-For (see deploy/nginx/snippets/kolabr-proxy.conf); the app is not exposed directly. */
function clientIp(req: Request) {
  return req.headers.get("x-real-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

/* ---------- Origin check ---------- */

/**
 * Accept only requests sent by a page on this site: the canonical origin, or whatever host is
 * serving the request (so a staging box or `npm start` on localhost works too). A browser
 * posting from any other site sends its own Origin, which fails both tests.
 */
function sameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  let url: URL;
  try {
    url = new URL(origin);
  } catch {
    return false;
  }
  if (url.origin === new URL(SITE_URL).origin) return true;
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  return host !== null && url.host === host;
}

/* ---------- Handler ---------- */

const reply = (status: number, body: { ok: true } | { ok: false; error: string }) => Response.json(body, { status });

const ERRORS = {
  origin: "This request was not accepted.",
  invalid: "Please check your name and email address and try again.",
  limited: "Too many messages from this address. Please try again in a few minutes.",
  failed: "Your message did not send. Please try again in a moment.",
};

export async function POST(req: Request) {
  if (!sameOrigin(req)) return reply(403, { ok: false, error: ERRORS.origin });
  if (rateLimited(clientIp(req))) return reply(429, { ok: false, error: ERRORS.limited });

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) return reply(413, { ok: false, error: ERRORS.invalid });

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return reply(400, { ok: false, error: ERRORS.invalid });
  }
  const parsed = ContactSchema.safeParse(json);
  if (!parsed.success) return reply(400, { ok: false, error: ERRORS.invalid });
  const data = parsed.data;

  // A filled honeypot gets the same answer as a real send, so bots learn nothing.
  if (data.website) return reply(200, { ok: true });

  // Kept on the server before anything else is attempted, so an enquiry survives a broken
  // mail configuration, a Resend outage, or a crash between here and the send. The back
  // office lists these, and shows which ones failed to send.
  let messageId: string | null = null;
  try {
    messageId = await saveMessage({
      name: data.name,
      email: data.email,
      company: data.company,
      size: data.size,
      topic: data.topic,
      message: data.message,
    });
  } catch (err) {
    // Losing the copy is bad but not a reason to refuse the enquiry: the email may still work.
    console.error("[contact] could not record the message:", err instanceof Error ? err.message : err);
  }

  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) {
    console.error("[contact] RESEND_API_KEY, CONTACT_TO_EMAIL and CONTACT_FROM_EMAIL must all be set");
    if (messageId) await setDelivery(messageId, "failed", "Mail is not configured on this server.");
    return reply(500, { ok: false, error: ERRORS.failed });
  }

  const text = [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Company: ${data.company || "(not given)"}`,
    `Team size: ${data.size}`,
    `About: ${data.topic}`,
    "",
    data.message || "(no message)",
  ].join("\n");

  try {
    const { error } = await new Resend(RESEND_API_KEY).emails.send({
      from: CONTACT_FROM_EMAIL,
      to: CONTACT_TO_EMAIL,
      replyTo: data.email,
      subject: `Website enquiry: ${data.topic}, from ${data.name}`,
      text,
    });
    if (error) {
      console.error("[contact] Resend rejected the email:", error.name, error.message);
      if (messageId) await setDelivery(messageId, "failed", `${error.name}: ${error.message}`);
      return reply(502, { ok: false, error: ERRORS.failed });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[contact] Sending failed:", message);
    if (messageId) await setDelivery(messageId, "failed", message);
    return reply(502, { ok: false, error: ERRORS.failed });
  }

  if (messageId) await setDelivery(messageId, "sent");
  return reply(200, { ok: true });
}
