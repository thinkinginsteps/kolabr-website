import localFont from "next/font/local";

// Switzer, self-hosted. The WOFF2 files are copied into app/fonts/ from design/assets/fonts/
// by `npm run assets`. Three weights, as the design uses them: 400 body, 600 UI and
// subheads, 800 display headings (the design's few 700s render as 800, as they did there).
export const switzer = localFont({
  src: [
    { path: "../app/fonts/Switzer-Regular.woff2", weight: "400", style: "normal" },
    { path: "../app/fonts/Switzer-Semibold.woff2", weight: "600", style: "normal" },
    { path: "../app/fonts/Switzer-Extrabold.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-switzer",
  display: "swap",
  preload: true,
  adjustFontFallback: "Arial",
});
