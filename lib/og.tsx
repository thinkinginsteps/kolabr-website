import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { pageMeta, type MetaRoute } from "./page-meta";
import { SITE_NAME } from "./site";

/**
 * The social share image every page generates at build time (one per route, from that route's
 * own title). Satori draws these outside the browser, so it cannot read our CSS variables or
 * WOFF2 files: the tokens below mirror app/globals.css and the fonts come from the OTFs that
 * `npm run assets` writes. Keep the two in step.
 */

const INK = "#33505B";
const INK_MUTED = "#5D7380";
const ACCENT = "#15C0E8";
const SURFACE = "#FFFFFF";
const SURFACE_TINT = "#F2F6FA";
const BORDER = "#DDE6ED";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const font = async (weight: "Semibold" | "Extrabold") =>
  readFile(path.join(process.cwd(), "assets", "fonts-og", `Switzer-${weight}.otf`));

/** Long titles get a smaller line so they never overflow the card. */
const titleSize = (title: string) => (title.length > 62 ? 58 : title.length > 46 ? 66 : 74);

export async function ogImage(route: MetaRoute) {
  const { title, description } = pageMeta[route];
  return ogCard(title, description);
}

/** The card itself. Blog posts pass their own title and description. */
export async function ogCard(title: string, description: string) {
  // Titles are written for search results ("Kolabr pricing | Pay for your team..."). The card
  // already carries the mark, so it shows the descriptive half on its own.
  const parts = title.split("|").map((t) => t.trim());
  const heading = parts.length > 1 && /kolabr/i.test(parts[0]) ? parts.slice(1).join(" | ") : parts.join(" | ");
  const [semibold, extrabold] = await Promise.all([font("Semibold"), font("Extrabold")]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: SURFACE,
          backgroundImage: `radial-gradient(1000px 620px at 82% 0%, rgba(21,192,232,0.20), rgba(255,255,255,0)), radial-gradient(680px 460px at 0% 60%, rgba(51,80,91,0.06), rgba(255,255,255,0))`,
          fontFamily: "Switzer",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-end", gap: 7 }}>
          <span style={{ fontSize: 44, fontWeight: 800, letterSpacing: "-0.045em", color: INK, lineHeight: 1 }}>
            {SITE_NAME.toLowerCase()}
          </span>
          <span style={{ width: 11, height: 11, borderRadius: 999, background: ACCENT, marginBottom: 2 }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 26, maxWidth: 940 }}>
          <div style={{ fontSize: titleSize(heading), fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.03, color: INK }}>
            {heading}
          </div>
          <div style={{ fontSize: 28, lineHeight: 1.45, color: INK_MUTED, maxWidth: 880 }}>{description}</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: INK,
              background: SURFACE_TINT,
              border: `1px solid ${BORDER}`,
              borderRadius: 999,
              padding: "10px 22px",
            }}
          >
            kolabr.com
          </span>
          <span style={{ fontSize: 22, color: INK_MUTED }}>Guests are always free</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Switzer", data: semibold, weight: 600, style: "normal" },
        { name: "Switzer", data: extrabold, weight: 800, style: "normal" },
      ],
    },
  );
}
