import { ButtonLink } from "@/components/ButtonLink";
import { JsonLd } from "@/components/JsonLd";
import { HeroLede, PageHero } from "@/components/PageHero";
import { UnderlineLink } from "@/components/UnderlineLink";
import { CONTACT_STEPS } from "@/lib/contact";
import { breadcrumbJsonLd, graph, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/contact/thank-you/");

/**
 * Where the contact form lands after a successful send.
 *
 * A page rather than a line of text under the button: the address changes, so the visitor can
 * see something happened, the back button does not resubmit, and analytics has a URL to count
 * as a conversion. It is noindex, so it stays out of search while still being reachable.
 */
export default function ContactThankYouPage() {
  return (
    <>
      <JsonLd data={graph(breadcrumbJsonLd("/contact/thank-you/"))} />

      <PageHero
        id="ty-hero"
        eyebrow="Message sent"
        title="Thank you. Your message is with us."
        width={820}
        gap="gap-5"
        bottom="pb-[110px]"
      >
        <HeroLede width="max-w-[700px]">
          A person will read it and reply within one working day, to the address you gave us. No sequence of nurture emails, and
          nobody phoning your switchboard.
        </HeroLede>
      </PageHero>

      <section aria-labelledby="ty-next-h" className="px-10 pt-0 pb-[150px] max-tab:!px-5 max-tab:!py-[86px]">
        <div className="mx-auto grid max-w-content grid-cols-[minmax(0,1.25fr)_minmax(0,.82fr)] items-start gap-16 max-desk:grid-cols-1 max-desk:gap-12">
          <div data-rise="" className="flex flex-col gap-1.5 rounded-3xl bg-surface p-10 shadow-subtle">
            <div className="flex flex-col gap-2 pb-1.5">
              <h2 id="ty-next-h" className="text-[26px] font-semibold tracking-[-0.02em] text-ink">
                What happens next
              </h2>
              <p className="text-[16px] text-pretty text-ink-muted">The same four things, whatever you asked about.</p>
            </div>
            <ol className="flex flex-col gap-1.5">
              {CONTACT_STEPS.map((s, i) => (
                <li key={s.title} className="grid grid-cols-[34px_1fr] gap-4 border-t border-border py-5">
                  <span
                    aria-hidden="true"
                    className="flex size-[34px] items-center justify-center rounded-full bg-surface-tint text-[15px] font-semibold text-ink"
                  >
                    {i + 1}
                  </span>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-[17px] font-semibold tracking-[-0.015em] text-ink">{s.title}</h3>
                    <p className="text-[15.5px] leading-[1.55] text-pretty text-ink-muted">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div data-rise="" className="sticky top-[110px] flex flex-col gap-5 rounded-3xl bg-surface-tint p-[34px]">
            <div className="flex flex-col gap-2">
              <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-ink">While you wait</h2>
              <p className="text-[16px] text-pretty text-ink-muted">
                You do not have to wait for us to start. A trial takes a few minutes, and your clients join as free guests.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/pricing" size="md">
                See the plans
              </ButtonLink>
              <ButtonLink href="/product/channels" variant="secondary" size="md">
                How a channel works
              </ButtonLink>
            </div>
            <p className="text-[15.5px] leading-[1.55] text-pretty text-ink-muted">
              Sent it to the wrong place, or forgot something? <UnderlineLink href="/contact">Write to us again</UnderlineLink> and
              mention it. We would rather have two messages than a wrong one.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
