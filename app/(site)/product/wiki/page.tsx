import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { BadgeList, Chips, SectionList, TintRows } from "@/components/product/Illustrations";
import {
  BentoSection,
  CardPanel,
  DeepCard,
  DeepRows,
  FramedImage,
  LedeLink,
  PlainCard,
  ProductHero,
  QuestionSection,
  Screenshot,
  ShotSection,
  SplitFeature,
  SplitFigure,
  WideCard,
} from "@/components/product/ProductSections";
import { breadcrumbJsonLd, graph, pageMetadata } from "@/lib/seo";
import { SIGNUP_PATH } from "@/lib/site";

import uiWikiArticle from "@/assets/images/ui-wiki-article.webp";
import uiWikiKbCrop from "@/assets/images/ui-wiki-kb-crop.webp";
import uiWikiNew from "@/assets/images/ui-wiki-new.webp";

export const metadata = pageMetadata("/product/wiki/");

export default function WikiPage() {
  return (
    <>
      <JsonLd data={graph(breadcrumbJsonLd("/product/wiki/"))} />

      <ProductHero
        title="The answers, written down where the work happens"
        lede="Each channel has its own wiki: the runbooks your team follows, the checklists a client keeps asking for, the reasons behind decisions taken months ago. Sectioned, searchable and reviewed on a date, not whenever someone remembers."
      >
        <Screenshot
          preload
          className="mt-16"
          image={uiWikiArticle}
          alt="A wiki article, Failed debit-order mandates: section navigation on the left, the runbook steps in the middle with a notice and a checklist, and on-this-page links, tags and attachments on the right"
        />
      </ProductHero>

      <SplitFeature
        id="authoring"
        title="Writing one takes a minute"
        lede="A title, a one-line summary and the body. Tags, category and keywords are there when you want the article to be found in more than one way."
        points={[
          { title: "Draft, then publish", body: "Save it half-written and come back. Nothing is visible to the channel until you say so, and a published article can go back to draft." },
          { title: "Written like a document", body: "Headings, lists, quotes, code blocks, links, images and tables. Attach the PDF or the CSV people actually need beside it." },
          { title: "Tagged so it surfaces", body: "Category, tags and alternative search terms decide where it shows up, including as a suggestion while someone is raising a request." },
        ]}
        figure={
          <SplitFigure>
            <FramedImage
              width="min(470px,92%)"
              image={uiWikiNew}
              alt="The New article dialog: title, summary, a formatted body editor, service type, category, tags, keywords and a draft or published status"
            />
          </SplitFigure>
        }
      />

      <ShotSection
        id="suggestions"
        title="It answers the question before it becomes a request"
        lede="Published articles are offered as suggestions while a person is writing a request: client or colleague. The ones that answer the question end the thread before your team ever sees it."
        image={uiWikiKbCrop}
        alt="The knowledge base view: “Articles surfaced as suggestions while users create requests”, with search, a status filter and a New article button"
      />

      <BentoSection
        id="inside-wiki"
        title="Keeping it worth reading"
        lede={
          <>
            A wiki is only useful if someone owns it.
            <LedeLink href="/product/requests">See how requests feed it</LedeLink>
          </>
        }
      >
        <WideCard
          title="Sections, not a folder of files"
          body="Group articles the way the channel thinks: Getting started, one section per service line, Onboarding, Runbooks. New members read the first section and are useful by lunchtime."
          link={{ label: "How a channel fits together", href: "/product/channels" }}
          aside={
            <CardPanel className="gap-3.5 px-6 py-[22px] text-[14px]">
              <SectionList
                sections={[
                  { title: "Getting started", items: ["How this channel works", "Who to contact, and when"] },
                  { title: "Runbooks", items: ["Gateway timeout triage", "Reconciliation feed stalled", "Incident comms template"] },
                ]}
              />
            </CardPanel>
          }
        />
        <DeepCard
          alignStart
          title="Reviewed on a date"
          body="Every article carries an author, a version, when it was last updated and when it is next due for review, so nobody follows a runbook that stopped being true in March."
        >
          <DeepRows
            rows={[
              { label: "Reviewed", value: "v14 · 2 days ago" },
              { label: "Next review", value: "12 Oct 2026", highlight: true },
              { label: "418 views", value: "this quarter" },
              { label: "Notices", value: "for what changed" },
            ]}
          />
        </DeepCard>
        <PlainCard
          title="Search that reaches the body"
          body="Search titles, summaries and the text itself, filtered by status. Keywords catch the words people actually type instead of the ones you titled it with."
        >
          <TintRows
            rows={[
              { label: "“mandate rejected”", value: "4 articles" },
              { label: "“cut off time”", value: "2 articles" },
            ]}
          />
        </PlainCard>
        <PlainCard
          title="Attachments where you need them"
          body="The rejection-code PDF and the cut-off CSV hang off the article, not off an email from last year."
        >
          <Chips items={["Mandate rejection codes.pdf", "Batch cut-off times.csv"]} />
        </PlainCard>
        <PlainCard
          title="Fed by the work itself"
          body="The third time a request repeats, write the article. Link it from the request, and the next agent stops asking the same question in the channel."
        >
          <BadgeList
            items={[
              { badge: "W", text: "Payout incident: what we changed" },
              { badge: "W", text: "Replay steps for the MUR 50 floor" },
              { badge: "#", text: "Asked 3 times → article written", accent: true },
            ]}
          />
        </PlainCard>
      </BentoSection>

      <QuestionSection
        title="Is this a documentation tool?"
        lede="Not the kind you migrate a company into. It is the wiki for one channel, read by the people in that channel, which is why it stays short enough to be true."
        items={[
          { title: "One wiki per channel", body: "No company-wide tree nobody prunes. Each channel keeps the pages its own work needs, and they are the pages its members see." },
          { title: "Guests read it too", body: "Publish the articles a client should have, the checklist, the cut-off times, the escalation ladder, and stop sending them as attachments." },
          { title: "Included in the plan", body: "The wiki comes with the channel. No separate knowledge-base subscription, and no per-reader charge." },
        ]}
      />

      <CtaBand
        title="Write down the thing you explain twice a week."
        body="One article, in the channel it belongs to. See how many requests stop arriving."
        primary={{ label: "Get started", href: SIGNUP_PATH }}
      />
    </>
  );
}
