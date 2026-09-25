import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { UnderlineLink } from "@/components/UnderlineLink";
import { PlanComparison } from "@/components/PlanComparison";
import { PricingPlans } from "@/components/PricingPlans";
import { Container, Eyebrow, Section } from "@/components/Section";
import { TrialBanner, TrialButton } from "@/components/TrialBanner";
import { breadcrumbJsonLd, graph, pageMetadata, softwareApplicationJsonLd } from "@/lib/seo";

export const metadata = pageMetadata("/pricing/");

export default function PricingPage() {
  return (
    <>
      <JsonLd data={graph(softwareApplicationJsonLd, breadcrumbJsonLd("/pricing/"))} />

      <Section id="pricing" aria-labelledby="pricing-h" className="pt-[176px] pb-[130px]">
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
              Start with 14 days free on Max, every option included, no card needed. Then pick the size that fits your
              team, and change it whenever.
            </p>
          </div>
          {/* Plan names are h2 here: they sit directly under the page h1. */}
          <PricingPlans headingLevel={2} />
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
              Every account starts with 14 days free on Max, every option included, no card needed. Each channel has a
              set number of seats on your plan, and your own team and your guests share them: 30 seats on Starter, 100 on
              Pro, unlimited on Max.
            </p>
          </div>

          <div data-rise="">
            <PlanComparison />
          </div>

          <p id="guest-note" data-rise="" className="mt-4 max-w-[720px] text-[14.5px] leading-normal text-pretty text-ink-muted">
            <span className="font-extrabold text-accent-ink">*</span> Guests are never billed, and there is no limit on
            how many you invite across the org. Inside a channel, though, team members and guests draw on the same pool of
            seats: a Starter channel with 29 of your own people has one seat left for a guest, and the other way round.
            Max channels have no seat limit.
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
