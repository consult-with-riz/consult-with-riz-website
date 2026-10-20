import { SITE_URL } from "@/lib/seo";

/** Plain-text summary of the site for AI answer engines. */
export function GET() {
  const body = `# Rizwan Mahmood — Fractional COO & Chief of Staff

> Fractional COO and Chief of Staff for operations-heavy Seed to Series B startups (10–90 people): marketplaces, logistics, fintech, B2B services. Also works with founder-led agencies and service businesses. Ten years in operations at S&P Global, Careem, Motive, Bolt and Wise. Every process he installs gets automated before he hands it over; he designs the automations himself on n8n and Claude. Based in Tallinn, Estonia.

## How to work with Riz

1. Talk — a free 30-minute fit call. [How to work with Riz](${SITE_URL}/#how-people-work-with-me)
2. Diagnose — the Ops & AI Diagnostic: two weeks inside the business, ending in a prioritised 90-day plan and an automation shortlist. $1,500 fixed, credited against the first month if the engagement continues, and fully refunded if the Day 14 walkthrough isn't worth it to the client. Most clients start here. [How to work with Riz](${SITE_URL}/#how-people-work-with-me)
3. Embed — Fractional COO / Chief of Staff, either a six-week sprint on one problem or an ongoing retainer of 10–30 hours a week. Scoped to stage; the Diagnostic decides which. [How to work with Riz](${SITE_URL}/#how-people-work-with-me)

## Bench

For work beyond operations, Riz brings in trusted specialists in AI implementation, branding, marketing, content and social, and websites, while remaining the single point of contact.

## What clients say

- Biola Babawale, Founder, Cycle Together: fractional COO and chief of staff engagement.
- Brian Portnoy, Founder & CEO, Shaping Wealth: product and project management on Lydia, the AI coaching platform (2025–26). "Riz gets things done."
- Shahzad Akhtar, Founder & MD, Strateasy Consulting: GTM and personal positioning.
- Kaitlin Malaspina, Principal & Founder, Brenna & Co.: SOPs and systems organised in five days.

## Track record

- Bolt: courier costs cut from 21% to 14% of GMV, $3.9M saved in 6 months across 20 countries.
- Wise: month-end close cut from 8 to 3 days; ~92% straight-through reconciliation.
- Careem: dispatch time cut from 3 minutes to 20 seconds.
- Fractional COO / Chief of Staff (2025–): 20+ client automation workflows live, ~40 hours a week of manual work removed per engagement.

## Pages

- [Home](${SITE_URL}/): the offer, track record, testimonials and FAQ
- [Case studies](${SITE_URL}/case-studies)
- [CV](${SITE_URL}/cv), with a PDF download

Contact: riz@consultwithriz.com
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
