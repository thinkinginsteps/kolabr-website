import Link from "next/link";
import { Rich } from "../Rich";
import type { LegalBlock, LegalPage as LegalContent } from "@/lib/legal";
import type { Rich as RichText } from "@/lib/use-cases";

// The four legal pages share this layout. All text comes from lib/legal.ts.

const BODY = "text-[17px] leading-[1.62] text-pretty text-ink-muted";

function Block({ block }: { block: LegalBlock }) {
  if ("p" in block) {
    return (
      <p className={BODY}>
        <Rich text={block.p} />
      </p>
    );
  }
  if ("h4" in block) {
    return <h4 className="text-[18.5px] font-semibold tracking-[-0.015em] text-ink">{block.h4}</h4>;
  }
  if ("ul" in block) {
    return (
      <ul className="flex list-disc flex-col gap-[9px] pl-[22px]">
        {block.ul.map((item, i) => (
          <li key={i} className="text-[17px] leading-[1.6] text-pretty text-ink-muted">
            <Rich text={item} />
          </li>
        ))}
      </ul>
    );
  }
  const { head, rows } = block.table;
  const cell = (last: boolean) => `px-5 py-[15px] text-left align-top leading-normal ${last ? "" : "border-b border-border"}`;
  return (
    <div className="overflow-x-auto rounded-2xl bg-surface-tint">
      <table className="w-full min-w-[520px] border-collapse text-[15.5px]">
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h} scope="col" className="border-b border-border px-5 py-[15px] text-left font-semibold whitespace-nowrap text-ink">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => {
            const last = r === rows.length - 1;
            return (
              <tr key={r}>
                {row.map((c, i) =>
                  i === 0 ? (
                    <th key={i} scope="row" className={`${cell(last)} font-semibold text-ink`}>
                      <Rich text={c} />
                    </th>
                  ) : (
                    <td key={i} className={`${cell(last)} text-ink-muted`}>
                      <Rich text={c} />
                    </td>
                  ),
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/** Text on the deep closing panel: links keep the accent underline but turn white. */
function OnDeep({ text }: { text: RichText }) {
  if (typeof text === "string") return <>{text}</>;
  return (
    <>
      {text.map((part, i) =>
        typeof part === "string" ? (
          part
        ) : (
          <Link key={i} href={part.href} className="border-b-2 border-accent pb-px text-on-deep hover:text-accent">
            {part.label}
          </Link>
        ),
      )}
    </>
  );
}

export function LegalPage({ content: c }: { content: LegalContent }) {
  return (
    <>
      <section aria-labelledby="lg-hero" className="relative bg-legal-glow px-10 pt-[186px] pb-[72px] max-tab:!px-5 max-tab:!pt-[124px] max-tab:!pb-0">
        <div className="mx-auto max-w-content">
          <div data-rise="" className="flex max-w-[820px] flex-col gap-[18px]">
            <span className="text-[12px] font-semibold tracking-[0.12em] text-accent-ink uppercase">{c.eyebrow}</span>
            <h1 id="lg-hero" className="text-[clamp(36px,4.2vw,60px)] leading-[1.02] font-extrabold tracking-[-0.04em] text-balance text-ink">
              {c.title}
            </h1>
            <p className="max-w-[700px] text-[19.5px] leading-normal text-pretty text-ink-muted">
              <Rich text={c.lede} />
            </p>
            <div className="flex flex-wrap gap-2.5 pt-1.5">
              {c.chips.map((chip) => (
                <span key={chip} className="rounded-full bg-surface-tint px-4 py-2 text-[14px] font-semibold text-ink">
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-10 pt-0 pb-[140px] max-tab:!px-5 max-tab:!py-[86px]">
        <div className="mx-auto grid max-w-content grid-cols-[minmax(150px,.22fr)_minmax(0,1fr)] items-start gap-[clamp(28px,4vw,72px)] max-[760px]:grid-cols-1 max-[760px]:gap-0">
          <nav aria-label="On this page" className="sticky top-[110px] flex flex-col gap-0.5 border-l border-border pl-[22px] max-[760px]:hidden">
            <span className="pb-2 text-[11.5px] font-semibold tracking-[0.1em] text-ink-muted uppercase">On this page</span>
            {c.nav.map((n) => (
              <a key={n.id} href={`#${n.id}`} className="block py-[7px] text-[14.5px] leading-[1.4] text-ink-muted hover:text-ink">
                {n.label}
              </a>
            ))}
          </nav>
          <div data-rise-group="" className="flex max-w-[780px] flex-col gap-[52px]">
            <div data-rise="" className="flex flex-col gap-2 rounded-[20px] bg-surface-tint px-[30px] py-[26px]">
              <h2 className="text-[17.5px] font-semibold tracking-[-0.015em] text-ink">{c.short.title}</h2>
              <p className="text-[16.5px] leading-[1.55] text-pretty text-ink-muted">
                <Rich text={c.short.body} />
              </p>
            </div>
            {c.sections.map((s) => (
              <section key={s.id} id={s.id} data-rise="" className="flex scroll-mt-[110px] flex-col gap-4">
                <h3 className="text-[clamp(23px,2.2vw,30px)] font-semibold tracking-[-0.025em] text-balance text-ink">
                  <span className="text-accent-ink">{s.num}.</span> {s.title}
                </h3>
                {s.blocks.map((b, i) => (
                  <Block key={i} block={b} />
                ))}
              </section>
            ))}
            <div data-rise="" className="flex flex-col gap-2.5 rounded-[20px] bg-deep p-[30px] text-on-deep-muted">
              <h2 className="text-[19px] font-semibold tracking-[-0.02em] text-on-deep">{c.closing.title}</h2>
              <p className="text-[16px] leading-[1.55]">
                <OnDeep text={c.closing.body} />
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
