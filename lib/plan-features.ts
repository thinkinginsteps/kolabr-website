// Full feature comparison on /pricing, parsed from design/Pricing.dc.html. Pricing is not final.
// icon: "yes" / "no" are labelled Included / Not included; "tick" is a decorative tick before a qualifier.

export type Cell = { icon?: "yes" | "no" | "tick"; text?: string };
export type FeatureRow = { name: string; note?: boolean; values: [Cell, Cell, Cell] };
export type FeatureGroup = { title: string; rows: FeatureRow[] };

export const featureGroups: FeatureGroup[] = [
  {
    title: "Channels and workspace",
    rows: [
      { name: "Channels included", values: [{ text: "3" }, { text: "30" }, { text: "Unlimited" }] },
      { name: "Guest users", note: true, values: [{ text: "Unlimited, free" }, { text: "Unlimited, free" }, { text: "Unlimited, free" }] },
      { name: "Seats per channel (team + guests)", values: [{ text: "30" }, { text: "100" }, { text: "Unlimited" }] },
      { name: "Channel templates", values: [{ icon: "no" }, { icon: "yes" }, { icon: "yes" }] },
      { name: "Cross-channel request views (org-wide)", values: [{ icon: "no" }, { icon: "yes" }, { icon: "yes" }] },
      { name: "Channel archiving and export", values: [{ icon: "no" }, { icon: "yes" }, { icon: "yes" }] },
    ],
  },
  {
    title: "Chat",
    rows: [
      { name: "Channel chat, threads, mentions, presence", values: [{ icon: "yes" }, { icon: "yes" }, { icon: "yes" }] },
      { name: "Private and group direct messages", values: [{ icon: "yes" }, { icon: "yes" }, { icon: "yes" }] },
      { name: "File sharing and storage", values: [{ text: "1 GB per org" }, { text: "20 GB per org" }, { text: "500 GB per org, expandable" }] },
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
      { name: "SLA profiles", values: [{ icon: "no" }, { text: "Up to 30" }, { text: "Unlimited, with escalation paths" }] },
      { name: "Routing rules", values: [{ icon: "no" }, { icon: "yes" }, { icon: "tick", text: "conditional and multi-level" }] },
      { name: "Automation rules", values: [{ icon: "no" }, { text: "Up to 30 active" }, { text: "Unlimited" }] },
      { name: "Playbooks and workflows", values: [{ icon: "no" }, { icon: "yes" }, { icon: "tick", text: "with approval steps" }] },
      { name: "Custom fields on requests", values: [{ icon: "no" }, { icon: "yes" }, { icon: "yes" }] },
      { name: "Bulk request management", values: [{ icon: "no" }, { icon: "yes" }, { icon: "yes" }] },
      { name: "Service notices and status broadcasts", values: [{ icon: "no" }, { icon: "yes" }, { icon: "yes" }] },
    ],
  },
  {
    title: "Meetings",
    rows: [
      { name: "Video call from a channel", values: [{ icon: "tick", text: "capped at 45 mins" }, { icon: "tick", text: "unlimited" }, { icon: "tick", text: "unlimited" }] },
      { name: "Screen sharing", values: [{ icon: "yes" }, { icon: "yes" }, { icon: "yes" }] },
      { name: "Whiteboard overlay on shared screen", values: [{ icon: "no" }, { icon: "yes" }, { icon: "yes" }] },
      { name: "Call recording", values: [{ icon: "no" }, { icon: "tick", text: "30 day retention" }, { icon: "tick", text: "custom retention" }] },
      { name: "Meeting linked to a request", values: [{ icon: "no" }, { icon: "yes" }, { icon: "yes" }] },
      { name: "Scheduled events in channel", values: [{ icon: "yes" }, { icon: "tick", text: "recurring available" }, { icon: "tick", text: "recurring available" }] },
      { name: "Calendar with sync capability (Google, Outlook)", values: [{ icon: "no" }, { icon: "yes" }, { icon: "yes" }] },
    ],
  },
  {
    title: "Wiki",
    rows: [
      { name: "Channel wiki", values: [{ icon: "no" }, { text: "1 per channel" }, { text: "Unlimited" }] },
      { name: "Page version history", values: [{ icon: "no" }, { text: "Unlimited" }, { text: "Unlimited" }] },
      { name: "Page ownership, review cycles and approvals", values: [{ icon: "no" }, { icon: "no" }, { icon: "yes" }] },
    ],
  },
  {
    title: "Analytics",
    rows: [
      { name: "Channel status dashboard", values: [{ icon: "yes" }, { icon: "yes" }, { icon: "yes" }] },
      { name: "Worker performance analytics", values: [{ icon: "no" }, { icon: "yes" }, { icon: "yes" }] },
      { name: "Department performance tracking", values: [{ icon: "no" }, { icon: "yes" }, { icon: "yes" }] },
      { name: "Service quality tracking (SLA attainment, CSAT)", values: [{ icon: "no" }, { icon: "yes" }, { icon: "yes" }] },
      { name: "Client timeline", values: [{ icon: "no" }, { icon: "yes" }, { icon: "yes" }] },
      { name: "Client onboarding flows", values: [{ icon: "no" }, { icon: "yes" }, { icon: "yes" }] },
      { name: "Customer journey tracking", values: [{ icon: "no" }, { icon: "no" }, { icon: "yes" }] },
      { name: "Custom reports", values: [{ icon: "no" }, { icon: "no" }, { icon: "yes" }] },
      { name: "Client reporting (branded, scheduled to counterparts)", values: [{ icon: "no" }, { icon: "no" }, { icon: "yes" }] },
      { name: "Executive business health dashboard", values: [{ icon: "no" }, { icon: "no" }, { icon: "yes" }] },
      { name: "Data export", values: [{ text: "CSV" }, { text: "CSV" }, { text: "CSV, API and warehouse sync" }] },
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
      { name: "Data residency and BYO retention policy", values: [{ icon: "no" }, { icon: "no" }, { icon: "yes" }] },
      { name: "Onboarding and migration assistance", values: [{ icon: "no" }, { text: "Self-serve guides" }, { text: "Guided, with a named CSM" }] },
      { name: "Uptime SLA", values: [{ icon: "no" }, { icon: "no" }, { text: "99.9%, contractual" }] },
    ],
  },
];
