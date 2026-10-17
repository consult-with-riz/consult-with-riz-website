import { SITE_URL } from "@/lib/seo";

/** Plain-text summary of the site for AI answer engines. */
export function GET() {
  const body = `# Rizwan Mahmood — Fractional COO & Chief of Staff

> Fractional COO and Chief of Staff for founder-led startups (pre-seed to Series B, 5–50 people). Ten years in operations at S&P Global, Careem, Motive, Bolt and Wise. Every process he installs gets automated before he hands it over, built through his AI automation studio Soch. Based in Tallinn, Estonia.

## Engagements

- Fractional COO — 1–2 days a week inside the leadership team. Operating cadence, metrics, cost, process, hiring ops. Retainers from $2,400/mo. ${SITE_URL}/services#fractional-coo
- Chief of Staff — the founder's right hand. Priorities, leadership rhythm, board and investor updates, follow-through. Retainers from $2,400/mo. ${SITE_URL}/services#chief-of-staff
- Ops Diagnostic — 2-week fixed-scope review ending in a prioritised 90-day ops plan and an automation shortlist. Fixed fee, quoted on a call. ${SITE_URL}/services#ops-diagnostic
- Advisory — from $140/hr. Standalone 60-minute session: $200. ${SITE_URL}/booking

## Track record

- Bolt: courier costs cut from 21% to 14% of GMV, $3.9M saved in 6 months across 20 countries.
- Wise: month-end close cut from 8 to 3 days; ~92% straight-through reconciliation.
- Careem: dispatch time cut from 3 minutes to 20 seconds.
- Soch: 20+ workflows live, ~40 hours a week of manual work removed per engagement. Anthropic Claude Partner Network member.

## Pages

- ${SITE_URL}/services
- ${SITE_URL}/case-studies
- ${SITE_URL}/about
- ${SITE_URL}/booking

Contact: riz@withsoch.com
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
