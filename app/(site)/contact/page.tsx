import { ContactForm } from "@/components/contact/ContactForm";
import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { HeroLede, PageHero } from "@/components/PageHero";
import { breadcrumbJsonLd, graph, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/contact/");

const steps = [
  {
    title: "A person reads it",
    body: "Someone who knows the product answers, usually the same day. If your question is one line, so is the reply.",
  },
  {
    title: "A call only if it helps",
    body: "Thirty minutes, screen shared, your actual clients on the whiteboard. We will not book one just to have booked one.",
  },
  {
    title: "A straight answer on fit",
    body: "If you need a contact centre, a planning tool or a company wiki, we will tell you and point you somewhere sensible.",
  },
  {
    title: "Help with the first channel",
    body: "Categories, response targets and the wiki pages worth writing first, set up with you rather than left as homework.",
  },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd data={graph(breadcrumbJsonLd("/contact/"))} />
      <PageHero id="ct-hero" eyebrow="Contact us" title="Talk to someone who has set this up before." width={820} gap="gap-5" bottom="pb-[110px]">
        <HeroLede width="max-w-[700px]">
          Tell us how you work with people outside your company and we will tell you honestly whether Kolabr fits. If it does not, we
          will say so.
        </HeroLede>
      </PageHero>

      <section id="form" aria-labelledby="ct-form-h" className="px-10 pt-0 pb-[150px] max-tab:!px-5 max-tab:!py-[86px]">
        <div className="mx-auto grid max-w-content grid-cols-[minmax(0,1.25fr)_minmax(0,.82fr)] items-start gap-16 max-desk:grid-cols-1 max-desk:gap-12">
          <div data-rise="" className="flex flex-col gap-[22px] rounded-3xl bg-surface p-10 text-ink shadow-subtle">
            <div className="flex flex-col gap-2">
              <h2 id="ct-form-h" className="text-[26px] font-semibold tracking-[-0.02em]">
                Send us a message
              </h2>
              <p className="text-[16px] text-ink-muted">We reply within one working day, usually sooner.</p>
            </div>
            <ContactForm />
          </div>

          <div data-rise="" className="sticky top-[110px] flex flex-col gap-1.5 rounded-3xl bg-surface-tint p-[34px]">
            <div className="flex flex-col gap-2 pb-1.5">
              <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-ink">What happens after you send it</h2>
              <p className="text-[16px] text-pretty text-ink-muted">No sequence of nurture emails, and nobody phoning your switchboard.</p>
            </div>
            <ol className="flex flex-col gap-1.5">
              {steps.map((s, i) => (
                <li key={s.title} className="grid grid-cols-[34px_1fr] gap-4 border-t border-border py-5">
                  <span
                    aria-hidden="true"
                    className="flex size-[34px] items-center justify-center rounded-[11px] bg-surface text-[14px] font-semibold text-ink shadow-subtle"
                  >
                    {i + 1}
                  </span>
                  <div className="flex flex-col gap-[5px]">
                    <h3 className="text-[17.5px] font-semibold tracking-[-0.015em] text-ink">{s.title}</h3>
                    <p className="text-[15.5px] leading-normal text-ink-muted">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <CtaBand
        width={680}
        title="Or skip the conversation."
        body="Fourteen days free on Max, every option included, no card. Open a channel for one client and see it working this afternoon."
        secondary={{ label: "See pricing", href: "/pricing" }}
      />
    </>
  );
}
