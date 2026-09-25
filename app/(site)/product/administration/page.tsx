import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { Chips, RoleList, TintRows, Toggles } from "@/components/product/Illustrations";
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

import uiAdminAudit from "@/assets/images/ui-admin-audit.webp";
import uiAdminChannels from "@/assets/images/ui-admin-channels.webp";
import uiAdminConfig from "@/assets/images/ui-admin-config.webp";
import uiAdminUsers from "@/assets/images/ui-admin-users.webp";

export const metadata = pageMetadata("/product/administration/");

export default function AdministrationPage() {
  return (
    <>
      <JsonLd data={graph(breadcrumbJsonLd("/product/administration/"))} />

      <ProductHero
        title="Run it all from one place"
        lede="Channels, people, roles, SLA profiles, routing and playbooks: the settings that decide how work reaches your team, in one admin area rather than scattered through each channel."
      >
        <Screenshot
          preload
          className="mt-16"
          image={uiAdminChannels}
          alt="Channel management: thirteen channel cards with their category, purpose, member count and SLA profile, each with Members and Edit actions"
        />
      </ProductHero>

      <SplitFeature
        id="users"
        title="Who is in, and what they can do"
        lede="One list of everyone with access, your staff and the customers you invited, with the channel they belong to, their role and whether the account is still active."
        points={[
          { title: "Staff and customers, one view", body: "Filter to staff or customers, search any column, export the lot. You can see at a glance who is a guest and which channel they were invited into." },
          // "Agent" is the product role name. Held as designed until Dom confirms (see report).
          { title: "Roles, not guesswork", body: "Admin, agent or participant: set per person, applied per channel. Changing someone’s role takes effect everywhere they are a member." },
          { title: "Disable without deleting", body: "Someone leaves, an account goes quiet: switch it off and the history stays intact, including everything they wrote in the channel." },
        ]}
        figure={
          <SplitFigure align="start" wide>
            <FramedImage
              plainShadow
              width="min(1040px,138%)"
              sizes="(max-width: 1080px) 100vw, 1040px"
              image={uiAdminUsers}
              alt="The Users admin list: email, name, type, channel, role, active state and created date, with filters for staff and customers and an Invite user button"
            />
          </SplitFigure>
        }
      />

      <ShotSection
        id="configuration"
        title="Set the rules once"
        lede="Categories, SLA profiles, routing, rules, playbooks, custom fields and service notices: the configuration behind every request, on tabs instead of buried in menus."
        image={uiAdminConfig}
        alt="The Configuration area: tabs for platform, categories, SLA profiles, rules, routing, playbooks, custom fields, knowledge base and service notices, showing appearance and general platform settings"
      />

      <ShotSection
        id="audit"
        first={false}
        title="Everything that happened, with a name on it"
        lede="Logins, role changes, members added, requests reassigned, every email the system sent, with the user, the entity, the ID and the IP. Retained for 24 months and exportable as CSV."
        image={uiAdminAudit}
        alt="The audit log: timestamped platform activity with the user, the action, the entity type, entity ID and IP address, filterable by email, user, request or channel"
      />

      <BentoSection
        id="admin-details"
        title="The controls that matter as you grow"
        lede={
          <>
            Enough control to run a real operation, without a week of setup.
            <LedeLink href="/product/requests">See what it does to requests</LedeLink>
          </>
        }
      >
        <WideCard
          title="Channels, created and retired"
          body="Spin up a channel for a new client, give it a category, an SLA profile and members, and archive it when the work ends. Cards or a list, whichever you prefer."
          link={{ label: "How a channel fits together", href: "/product/channels" }}
          aside={
            <CardPanel className="px-[22px] py-5 text-[14px]">
              <RoleList
                roles={[
                  { name: "Admin", body: "Configuration, users, channels, audit log", pill: "Staff" },
                  { name: "Agent", body: "Works requests in the channels they are in", pill: "Staff" },
                  { name: "Participant", body: "Raises and follows their own requests", pill: "Guest ok", guest: true },
                ]}
              />
            </CardPanel>
          }
        />
        <DeepCard
          alignStart
          title="SLA profiles and routing"
          body="Attach a profile to a channel, Standard, Enhanced, Priority, and let rules route new requests to the right team by category, keyword or client."
        >
          <DeepRows
            rows={[
              { label: "Priority", value: "1h / 4h" },
              { label: "Enhanced", value: "4h / 1d", highlight: true },
              { label: "Standard", value: "1d / 3d" },
              { label: "Routing", value: "by category or client" },
            ]}
          />
        </DeepCard>
        <PlainCard
          title="Seats you can see"
          body="Usage sits in the sidebar: staff seats and channels against your plan, so a limit never arrives as a surprise mid-week."
        >
          <TintRows
            rows={[
              { label: "Staff seats", value: "7 / 10" },
              { label: "Channels", value: "4 / 5" },
            ]}
          />
        </PlainCard>
        <PlainCard
          title="Playbooks and custom fields"
          body="Standardise the work that repeats, and capture the one extra field your sector needs on every request."
        >
          <Chips items={["Playbooks", "Custom fields", "Service notices"]} />
        </PlainCard>
        <PlainCard
          title="Maintenance and branding"
          body="Set the platform name on the login screen and outbound email, choose the default theme, and put the place in maintenance mode when you need to."
        >
          <Toggles
            items={[
              { label: "Light and dark mode switching", on: true },
              { label: "Accent colour picker", on: true },
              { label: "Maintenance mode", on: false },
            ]}
          />
        </PlainCard>
      </BentoSection>

      <QuestionSection
        title="Is this a lot to set up?"
        lede="No. The defaults work on day one: create a channel, invite people, start. The rest is there when your operation is big enough to need it."
        items={[
          { title: "Start with the defaults", body: "One SLA profile, one category set, no routing rules. Add a profile the first time a client needs a tighter promise than the rest." },
          { title: "Guests stay out of it", body: "Administration is yours. The people you invite see their channels and their requests, and nothing about how the place is configured." },
          { title: "Answers for auditors", body: "Who had access, who changed what, when a request was reassigned. Exportable, so the annual review takes an afternoon rather than a fortnight." },
        ]}
      />

      <CtaBand
        title="Set it up once."
        body="Create a channel, invite your team, and tune the rest when the work asks for it."
        primary={{ label: "Get started", href: SIGNUP_PATH }}
      />
    </>
  );
}
