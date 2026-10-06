// Full feature comparison on /pricing. Agreed 30 September 2026, 43 rows.
// icon: "yes" / "no" are labelled Included / Not included; "tick" is a decorative tick before a qualifier.
//
// Nothing here is capped by the number of clients a customer has. Channels are unlimited on both
// paid plans on purpose: charging for them would bill the very thing this product is for.
// Storage is the volume meter instead, because it tracks what actually costs us money.

export type Cell = { icon?: "yes" | "no" | "tick"; text?: string };
export type FeatureRow = { name: string; note?: boolean; values: [Cell, Cell, Cell] };
export type FeatureGroup = { title: string; rows: FeatureRow[] };

export const featureGroups: FeatureGroup[] = [
  {
    title: "Channels and workspace",
    rows: [
      { name: "Channels included", values: [{ text: "1" }, { text: "Unlimited" }, { text: "Unlimited" }] },
      { name: "Users", values: [{ text: "1" }, { text: "Unlimited" }, { text: "Unlimited" }] },
      // Always present on a paid account and outside the channel count. A guest cannot be added
      // to it, which is the point: it is where the internal conversation lives, so Kolabr is not
      // only the place clients come into.
      {
        name: "Internal Team channel",
        values: [{ icon: "no" }, { icon: "tick", text: "guests cannot be added" }, { icon: "tick", text: "guests cannot be added" }],
      },
      { name: "Guests", note: true, values: [{ text: "30, free" }, { text: "Unlimited, free" }, { text: "Unlimited, free" }] },
      { name: "Channel archiving and export", values: [{ icon: "no" }, { icon: "yes" }, { icon: "yes" }] },
    ],
  },
  {
    title: "Chat",
    rows: [
      { name: "Channel chat, threads, mentions, presence", values: [{ icon: "yes" }, { icon: "yes" }, { icon: "yes" }] },
      { name: "Voice notes", values: [{ icon: "yes" }, { icon: "yes" }, { icon: "yes" }] },
      { name: "Private and group direct messages", values: [{ icon: "yes" }, { icon: "yes" }, { icon: "yes" }] },
      { name: "File sharing and storage", values: [{ text: "1 GB total" }, { text: "10 GB per user" }, { text: "50 GB per user" }] },
      { name: "Message history", values: [{ text: "30 days" }, { text: "Unlimited" }, { text: "Unlimited" }] },
      { name: "Announcements", values: [{ icon: "no" }, { icon: "yes" }, { icon: "yes" }] },
      { name: "Message and file retention policies", values: [{ icon: "no" }, { icon: "no" }, { icon: "yes" }] },
    ],
  },
  {
    title: "Requests",
    rows: [
      { name: "Requests with owner, category, status", values: [{ icon: "yes" }, { icon: "yes" }, { icon: "yes" }] },
      { name: "Convert a message into a request", values: [{ icon: "yes" }, { icon: "yes" }, { icon: "yes" }] },
      { name: "Tasks inside a request (close with it)", values: [{ icon: "yes" }, { icon: "yes" }, { icon: "yes" }] },
      { name: "Custom categories", values: [{ text: "5" }, { text: "Unlimited" }, { text: "Unlimited" }] },
      { name: "SLA profiles", values: [{ icon: "no" }, { icon: "yes" }, { icon: "tick", text: "with escalation paths" }] },
      { name: "Routing rules", values: [{ icon: "no" }, { icon: "yes" }, { icon: "yes" }] },
      { name: "Automation rules", values: [{ icon: "no" }, { text: "Up to 30 active" }, { text: "Unlimited" }] },
      { name: "Playbooks", values: [{ icon: "no" }, { icon: "yes" }, { icon: "tick", text: "with approval steps" }] },
      { name: "Custom fields on requests", values: [{ icon: "no" }, { icon: "yes" }, { icon: "yes" }] },
      { name: "Bulk request management", values: [{ icon: "no" }, { icon: "yes" }, { icon: "yes" }] },
      { name: "Service notices and status broadcasts", values: [{ icon: "no" }, { icon: "yes" }, { icon: "yes" }] },
    ],
  },
  {
    title: "Meetings",
    rows: [
      { name: "Video calls", values: [{ icon: "no" }, { icon: "tick", text: "unlimited" }, { icon: "tick", text: "unlimited" }] },
      { name: "Voice calls", values: [{ icon: "yes" }, { icon: "yes" }, { icon: "yes" }] },
      { name: "Screen sharing", values: [{ icon: "no" }, { icon: "yes" }, { icon: "yes" }] },
      { name: "Whiteboard overlay on shared screen", values: [{ icon: "no" }, { icon: "yes" }, { icon: "yes" }] },
      { name: "Call recording", values: [{ icon: "no" }, { icon: "tick", text: "30 day retention" }, { icon: "tick", text: "custom retention" }] },
      { name: "Meeting linked to a request", values: [{ icon: "yes" }, { icon: "yes" }, { icon: "yes" }] },
      { name: "Scheduled events in channel", values: [{ icon: "yes" }, { icon: "tick", text: "recurring available" }, { icon: "tick", text: "recurring available" }] },
    ],
  },
  {
    title: "Wiki",
    rows: [
      { name: "Channel wiki", values: [{ text: "1, up to 5 pages" }, { text: "1 per channel" }, { text: "Unlimited" }] },
      { name: "Page version history", values: [{ icon: "no" }, { text: "Unlimited" }, { text: "Unlimited" }] },
      { name: "Page ownership, review cycles and approvals", values: [{ icon: "no" }, { icon: "no" }, { icon: "yes" }] },
    ],
  },
  {
    title: "Analytics",
    rows: [
      { name: "Channel status dashboard", values: [{ icon: "yes" }, { icon: "yes" }, { icon: "yes" }] },
      { name: "Data export", values: [{ text: "CSV" }, { text: "CSV and XLS" }, { text: "CSV, XLS, API and warehouse sync" }] },
    ],
  },
  {
    title: "Administration and security",
    rows: [
      { name: "Roles and permissions", values: [{ text: "Standard roles" }, { text: "Standard roles" }, { text: "Custom roles, granular permissions" }] },
      { name: "Two-factor authentication and passkeys", values: [{ icon: "yes" }, { icon: "yes" }, { icon: "yes" }] },
      { name: "Enforced 2FA and session policies", values: [{ icon: "no" }, { icon: "yes" }, { icon: "yes" }] },
      { name: "SAML SSO and SCIM provisioning", values: [{ icon: "no" }, { icon: "no" }, { icon: "yes" }] },
      { name: "Audit log", values: [{ text: "30 days" }, { text: "1 year" }, { text: "Unlimited, exportable" }] },
      { name: "Webhooks", values: [{ icon: "no" }, { icon: "tick", text: "outbound" }, { icon: "tick", text: "inbound and outbound" }] },
      { name: "Public API", values: [{ icon: "no" }, { icon: "tick", text: "rate limited" }, { icon: "tick", text: "higher limits" }] },
      { name: "Custom integrations and private connectors", values: [{ icon: "no" }, { icon: "no" }, { icon: "yes" }] },
      { name: "Onboarding and migration assistance", values: [{ icon: "no" }, { text: "Self-serve guides" }, { text: "Guided" }] },
    ],
  },
];
