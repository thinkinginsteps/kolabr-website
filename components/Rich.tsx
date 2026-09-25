import type { Rich as RichText } from "@/lib/use-cases";
import { UnderlineLink } from "./UnderlineLink";

/** Renders copy that may contain inline links ({label, href}) with the site's underline style. */
export function Rich({ text }: { text: RichText }) {
  if (typeof text === "string") return <>{text}</>;
  return (
    <>
      {text.map((part, i) =>
        typeof part === "string" ? (
          part
        ) : (
          <UnderlineLink key={i} href={part.href} inline>
            {part.label}
          </UnderlineLink>
        ),
      )}
    </>
  );
}
