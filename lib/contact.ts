// Choices on the contact form, shared by the form and the /api/contact route handler so the
// server accepts exactly what the form offers.

export const CONTACT_SIZES = ["1 to 5", "6 to 20", "21 to 60", "61 to 200", "More than 200"] as const;
export const CONTACT_TOPICS = ["A trial", "Pricing or plans", "Security review", "Something else"] as const;

export type ContactSize = (typeof CONTACT_SIZES)[number];
export type ContactTopic = (typeof CONTACT_TOPICS)[number];
