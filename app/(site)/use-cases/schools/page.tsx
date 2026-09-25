import { JsonLd } from "@/components/JsonLd";
import {
  ChannelsSection,
  FramedShot,
  OversightSection,
  PhoneFigure,
  ShotBand,
  SmallCards,
  SplitBand,
  SplitPoints,
  StagesSection,
  UseCaseCta,
  UseCaseFaq,
  UseCaseHero,
} from "@/components/use-case/UseCasePage";
import { breadcrumbJsonLd, faqJsonLdFromPairs, graph, pageMetadata } from "@/lib/seo";
import { useCaseFaqs } from "@/lib/use-case-faqs";
import { schoolsContent as c } from "@/lib/use-cases";

export const metadata = pageMetadata("/use-cases/schools/");

// Schools uses the same sections as the other use cases, in its own order.
export default function SchoolsPage() {
  return (
    <>
      <JsonLd data={graph(breadcrumbJsonLd("/use-cases/schools/"), faqJsonLdFromPairs(useCaseFaqs.schools))} />
      <UseCaseHero hero={c.hero} />
      <ChannelsSection data={c.channels} headWidth={760} />
      <SplitBand id={c.parents.id} title={c.parents.title} lede={c.parents.lede} media={<PhoneFigure image={c.parents.image} />}>
        <SplitPoints points={c.parents.points} />
      </SplitBand>
      <ShotBand id={c.requests.id} title={c.requests.title} lede={c.requests.lede} image={c.requests.image} cards={c.requests.cards} headWidth={780} />
      <SplitBand id={c.calendar.id} title={c.calendar.title} lede={c.calendar.lede} media={<FramedShot image={c.calendar.image} />} mediaFirst>
        <SmallCards cards={c.calendar.cards} />
      </SplitBand>
      <ShotBand id={c.wiki.id} title={c.wiki.title} lede={c.wiki.lede} image={c.wiki.image} headWidth={780} />
      <OversightSection data={c.oversight} headWidth={760} />
      <StagesSection data={c.stages} />
      <UseCaseFaq items={useCaseFaqs.schools} />
      <UseCaseCta data={c.cta} />
    </>
  );
}
