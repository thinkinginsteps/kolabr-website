import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { UnderlineLink } from "@/components/UnderlineLink";
import { PlanComparison } from "@/components/PlanComparison";
import { PricingPlans } from "@/components/PricingPlans";
import { Container, Eyebrow, Section } from "@/components/Section";
import { TeamCostEstimate } from "@/components/TeamCostEstimate";
import { TrialBanner, TrialButton } from "@/components/TrialBanner";
import { breadcrumbJsonLd, graph, pageMetadata, softwareApplicationJsonLd } from "@/lib/seo";

export const metadata = pageMetadata("/pricing/");

export default function PricingPage() {
  return (
    <>
      <JsonLd data={graph(softwareApplicationJsonLd, breadcrumbJsonLd("/pricing/"))} />

      <Section id="pricing" aria-labelledby="pricing-h" className="relative bg-hero-glow pt-[176px] pb-[130px]">
        <Container>
          <div data-rise="" className="mb-[22px] flex max-w-[820px] flex-col gap-[18px]">
            <Eyebrow>Pricing</Eyebrow>
            <h1
              id="pricing-h"
              className="text-[clamp(38px,4.4vw,64px)] leading-none font-extrabold tracking-[-0.04em] text-balance text-ink"
            >
              Pay for your team, invite everyone else
            </h1>
            <p className="text-[20px] leading-normal text-pretty text-ink-muted">
              Free for one channel, for as long as you like. Pro and Business are priced per user, and the clients,
              partners and suppliers you invite join as guests, free on every plan, however many channels they sit in.
            </p>
          </div>
          {/* Plan names are h2 here: they sit directly under the page h1. */}
          <PricingPlans headingLevel={2} />
          <div data-rise="" className="mx-auto mt-[26px] w-full max-w-[720px]">
            <TeamCostEstimate />
          </div>
          <TrialBanner />
        </Container>
      </Section>

      <Section tint id="compare-plans" aria-labelledby="cmp-h" className="py-[120px]">
        <div className="mx-auto max-w-[1100px]">
          <div data-rise="" className="mb-10 flex max-w-[720px] flex-col gap-4">
            <h2 id="cmp-h" className="text-[clamp(30px,3.2vw,46px)] leading-[1.05] font-semibold tracking-[-0.03em] text-balance text-ink">
              Full feature comparison
            </h2>
            <p className="text-[19px] text-pretty text-ink-muted">
              Free covers one channel with one of your people in it. Pro and Business have no limit on channels, so what
              you pay never depends on how many clients you have. Try either free for seven days, no card needed.
            </p>
          </div>

          <div data-rise="">
            <PlanComparison />
          </div>

          <p id="guest-note" data-rise="" className="mt-4 max-w-[720px] text-[14.5px] leading-normal text-pretty text-ink-muted">
            <span className="font-extrabold text-accent-ink">*</span> A guest is someone you work with rather than
            someone you employ: they post, raise requests, read the wiki and join calls, in as many channels as you put
            them in, and they are never billed. What they cannot do is own a request, create a channel, administer
            anything, or see past the channels they are in. That is what a user is for, and it is the only thing you pay
            for. Free is the exception to the count: it allows 30 guests.
          </p>

          <div data-rise="" className="mt-[34px] flex flex-wrap items-center gap-3.5">
            <TrialButton />
            <UnderlineLink href="/pricing#pricing" className="text-[16px]">
              Back to plans
            </UnderlineLink>
          </div>
        </div>
      </Section>

      <CtaBand
        title="Start with one channel."
        body="Pick one project, invite the people involved, and see how it feels when everything is in one place."
      />
    </>
  );
}
