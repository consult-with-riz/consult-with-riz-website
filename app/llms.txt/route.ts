import { SITE_URL } from "@/lib/seo";

/** Plain-text summary of the site for AI answer engines. */
export function GET() {
  const body = `# Rizwan Mahmood — Fractional COO & Chief of Staff

> Fractional COO and Chief of Staff for founder-led startups (pre-seed to Series B, 5–50 people). Ten years in operations at S&P Global, Careem, Motive, Bolt and Wise. Every process he installs gets automated before he hands it over; he designs the automations himself on n8n and Claude. Based in Tallinn, Estonia.

## How to work with Riz

1. Talk — a 60-minute 1:1 session, $140. ${SITE_URL}/services#session
2. Diagnose — the Ops Diagnostic: two weeks inside the business, ending in a prioritised 90-day plan and an automation shortlist. $3,500 fixed, credited against the first month if the engagement continues. Most clients start here. ${SITE_URL}/services#ops-diagnostic
3. Embed — Fractional COO / Chief of Staff, either a six-week sprint on one problem or an ongoing retainer of 1–2 days a week. Scoped to stage; the Diagnostic decides which. ${SITE_URL}/services#fractional-coo

## Bench

For work beyond operations, Riz brings in trusted specialists in AI implementation, branding, marketing, content and social, and websites, while remaining the single point of contact.

## Track record

- Bolt: courier costs cut from 21% to 14% of GMV, $3.9M saved in 6 months across 20 countries.
- Wise: month-end close cut from 8 to 3 days; ~92% straight-through reconciliation.
- Careem: dispatch time cut from 3 minutes to 20 seconds.
- Independent (2025–): 20+ client automation workflows live, ~40 hours a week of manual work removed per engagement.

## Pages

- ${SITE_URL}/services
- ${SITE_URL}/case-studies
- ${SITE_URL}/about
- ${SITE_URL}/booking

Contact: riz@consultwithriz.com
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
