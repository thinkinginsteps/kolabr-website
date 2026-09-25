import "server-only";
import { mkdir, readFile, readdir, rename, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { STATE_DIR } from "./config";

/**
 * Every message the contact form receives, kept on the server as well as emailed.
 *
 * The record is written BEFORE the email is attempted, and the outcome written back afterwards.
 * That ordering is the point of this file: if Resend is misconfigured, rate limited or simply
 * down, the enquiry is still here rather than lost with the failed send.
 *
 * One file per message, in a directory outside the app so a deploy cannot delete them. A file
 * each (rather than one growing log) means a delete never rewrites anyone else's message.
 */

const DIR = () => path.join(STATE_DIR, "messages");

export type Delivery = "pending" | "sent" | "failed";

export type ContactMessage = {
  id: string;
  receivedAt: string;
  name: string;
  email: string;
  company: string;
  size: string;
  topic: string;
  message: string;
  delivery: Delivery;
  /** Why the email did not send, for the back office to show. Never shown to the visitor. */
  deliveryError?: string;
};

const isId = (id: string) => /^[0-9TZ:.-]{20,32}-[0-9a-f-]{36}$/.test(id);
const fileFor = (id: string) => path.join(DIR(), `${id}.json`);

async function write(message: ContactMessage): Promise<void> {
  await mkdir(DIR(), { recursive: true });
  const file = fileFor(message.id);
  const tmp = `${file}.${process.pid}.tmp`;
  await writeFile(tmp, JSON.stringify(message, null, 2), { mode: 0o600 });
  await rename(tmp, file);
}

/** Records the message and returns its id. Called before the email is attempted. */
export async function saveMessage(
  input: Omit<ContactMessage, "id" | "receivedAt" | "delivery" | "deliveryError">,
): Promise<string> {
  const id = `${new Date().toISOString().replace(/[:.]/g, "-")}-${randomUUID()}`;
  await write({ ...input, id, receivedAt: new Date().toISOString(), delivery: "pending" });
  return id;
}

export async function setDelivery(id: string, delivery: Delivery, deliveryError?: string): Promise<void> {
  const existing = await getMessage(id);
  if (!existing) return;
  await write({ ...existing, delivery, ...(deliveryError ? { deliveryError } : {}) });
}

export async function getMessage(id: string): Promise<ContactMessage | null> {
  if (!isId(id)) return null;
  try {
    const parsed: unknown = JSON.parse(await readFile(fileFor(id), "utf8"));
    return parsed && typeof parsed === "object" ? (parsed as ContactMessage) : null;
  } catch {
    return null;
  }
}

/** Newest first. Capped: the back office is for reading recent enquiries, not archaeology. */
export async function listMessages(limit = 200): Promise<ContactMessage[]> {
  let files: string[];
  try {
    files = (await readdir(DIR())).filter((f) => f.endsWith(".json"));
  } catch {
    return [];
  }
  const messages = await Promise.all(files.map((f) => getMessage(f.replace(/\.json$/, ""))));
  return messages
    .filter((m): m is ContactMessage => m !== null)
    .sort((a, b) => b.receivedAt.localeCompare(a.receivedAt))
    .slice(0, limit);
}

export async function deleteMessage(id: string): Promise<void> {
  if (!isId(id)) return;
  await unlink(fileFor(id)).catch(() => {});
}

/** Used by the header to show how many are waiting, and whether any failed to send. */
export async function messageSummary(): Promise<{ total: number; failed: number }> {
  const messages = await listMessages(500);
  return { total: messages.length, failed: messages.filter((m) => m.delivery === "failed").length };
}

/** Whether the store is writable, so the contact form can log a clear warning if it is not. */
export async function messagesWritable(): Promise<boolean> {
  try {
    await mkdir(DIR(), { recursive: true });
    await stat(DIR());
    return true;
  } catch {
    return false;
  }
}
