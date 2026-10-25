/**
 * "Support the channel": the Stripe Payment Links behind each button.
 *
 * Create them in Stripe (Payment Links), paste each URL here and push.
 * Fixed amounts make for one-tap Apple Pay / Google Pay; "custom" is a
 * pay-what-you-want link. In each link's settings, set "After payment" to
 * redirect to https://www.consultwithriz.com/support/thanks. These links are
 * for consultwithriz.com only; aiwithriz.com has its own set.
 * A button with no link yet shows as "coming soon" instead of breaking.
 */
export const SUPPORT_CURRENCY = "$";

export const SUPPORT_OPTIONS: { id: string; cups: number; amount: number | null; label: string; link: string }[] = [
  { id: "one", cups: 1, amount: 5, label: "A coffee", link: "" },
  { id: "two", cups: 2, amount: 10, label: "Two coffees", link: "" },
  { id: "three", cups: 3, amount: 25, label: "A round for the team", link: "" },
  { id: "custom", cups: 0, amount: null, label: "Your amount", link: "" },
];

/** Free ways to help, for anyone who'd rather not pay. */
export const SUPPORT_FREE: { label: string; note: string; href: string }[] = [
  { label: "Subscribe on YouTube", note: "It's free and it helps more than you'd think.", href: "https://www.youtube.com/@VibeWithRiz?sub_confirmation=1" },
  { label: "Read the newsletter", note: "Conversations with Riz, on Substack.", href: "https://conversationswithriz.substack.com/" },
  { label: "Share a video", note: "Send one to a founder who needs it.", href: "https://www.youtube.com/@VibeWithRiz/videos" },
];
