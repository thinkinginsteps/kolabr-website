// Choices on the contact form, shared by the form and the /api/contact route handler so the
// server accepts exactly what the form offers.

export const CONTACT_SIZES = ["1 to 5", "6 to 20", "21 to 60", "61 to 200", "More than 200"] as const;
export const CONTACT_TOPICS = ["A trial", "Pricing or plans", "Security review", "Something else"] as const;

export type ContactSize = (typeof CONTACT_SIZES)[number];
export type ContactTopic = (typeof CONTACT_TOPICS)[number];

/**
 * What happens after someone sends the form. Shown on the contact page as a promise, and again
 * on the thank-you page as a reminder, which is the whole reason it lives here rather than in
 * either page.
 */
export const CONTACT_STEPS = [
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
] as const;
