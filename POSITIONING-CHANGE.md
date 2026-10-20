# Positioning change: Fractional COO

**Date:** 20 October 2026
**Change:** the site positions Riz as a **Fractional COO**, not "Fractional COO / Chief of Staff".
**Commit:** [`0a36a8a`](https://github.com/consult-with-riz/consult-with-riz-website/commit/0a36a8a6344d3bd3730b04b8c65800016f1e4748)
**Before the change:** tag [`positioning-coo-and-cos`](https://github.com/consult-with-riz/consult-with-riz-website/tree/positioning-coo-and-cos)

## Why

- "Fractional COO" is the category founders already search for and budget for.
- It matches the promise on the homepage: "…without hiring a full-time COO."
- COO anchors a higher price than Chief of Staff.

Chief of Staff work stays, as part of the COO role rather than a second title:

- "The founder's desk: Chief of Staff work…" stays as one of the six operating-system items.
- The FAQ asks "Do you also do Chief of Staff work?" and answers yes, as part of the role.
- The CV's first bullet for the current role mentions it.
- Clients' own words are unchanged (Biola's testimonial and role tags).

## How to revert

Everything is in one commit, so one command undoes it:

```bash
git revert 0a36a8a
git push origin main
```

The site redeploys on push. The revert also brings back the old CV PDF, since it is part of the same commit.

To see the site exactly as it was before the change, browse the tag `positioning-coo-and-cos` on GitHub.

## Every line changed

| Where | File | Before | After |
|---|---|---|---|
| Structured data: job title | `app/layout.tsx` | jobTitle: "Fractional COO and Chief of Staff", | jobTitle: "Fractional COO", |
| Structured data: description | `app/layout.tsx` | Rizwan Mahmood is a fractional COO and Chief of Staff for operations-heavy | Rizwan Mahmood is a fractional COO for operations-heavy |
| Browser tab and Google title | `app/layout.tsx` | title: "Rizwan Mahmood · Fractional COO & Chief of Staff", | title: "Rizwan Mahmood · Fractional COO", |
| Google description | `app/layout.tsx` | "Fractional COO and Chief of Staff for Seed to Series B startups. I run | "Fractional COO for Seed to Series B startups. I run |
| llms.txt heading | `app/llms.txt/route.ts` | # Rizwan Mahmood — Fractional COO & Chief of Staff | # Rizwan Mahmood — Fractional COO |
| llms.txt summary | `app/llms.txt/route.ts` | > Fractional COO and Chief of Staff for operations-heavy | > Fractional COO for operations-heavy |
| llms.txt step 3 | `app/llms.txt/route.ts` | 3. Embed — Fractional COO / Chief of Staff, either | 3. Embed — Fractional COO, either |
| llms.txt track record | `app/llms.txt/route.ts` | - Fractional COO / Chief of Staff (2025–): | - Fractional COO (2025–): |
| CV page description | `app/cv/page.tsx` | Rizwan Mahmood's CV. Fractional COO and Chief of Staff, 10+ years | Rizwan Mahmood's CV. Fractional COO, 10+ years |
| CV data comment | `components/cv/cvData.ts` | * carried over unchanged; the framing is Fractional COO / Chief of Staff | * carried over unchanged; the framing is Fractional COO |
| CV header role | `components/cv/cvData.ts` | role: "Fractional COO / Chief of Staff", | role: "Fractional COO", |
| CV summary | `components/cv/cvData.ts` | "Fractional COO and Chief of Staff for Seed to Series B founders. 10+ | "Fractional COO for Seed to Series B founders. 10+ |
| CV current role (company line) | `components/cv/cvData.ts` | company: "Fractional COO / Chief of Staff", | company: "Fractional COO", |
| CV current role (title) | `components/cv/cvData.ts` | title: "Fractional COO / Chief of Staff, Ops & AI Transformation", | title: "Fractional COO, Ops & AI Transformation", |
| CV current role (first bullet) | `components/cv/cvData.ts` | Embedded with founders and leadership teams as fractional COO and Chief of Staff: operating cadence, metrics, process design and follow-through. | Embedded with founders and leadership teams as fractional COO, including the Chief of Staff work on the founder's side: operating cadence, metrics, process design and follow-through. |
| Case studies company label | `app/case-studies/page.tsx` | ? "Fractional COO / Chief of Staff" : | ? "Fractional COO" : |
| 90-days bar, third stage | `components/PromiseHero.tsx` | name: "Fractional COO or Chief of Staff" } | name: "Fractional COO" } |
| Footer link | `components/Footer.tsx` | { label: "Fractional COO / Chief of Staff", href: | { label: "Fractional COO", href: |
| Footer tagline | `components/Footer.tsx` | <p className="ftr-tagline">Fractional COO. Chief of Staff. Tallinn.</p> | <p className="ftr-tagline">Fractional COO. Tallinn.</p> |
| How we can work together, card 3 | `components/blocks/WorkTogether.tsx` | title: "Fractional COO / Chief of Staff", | title: "Fractional COO", |
| By the numbers, Now row (label) | `components/blocks/ByTheNumbers.tsx` | company: "Fractional COO /\nChief of Staff", | company: "Fractional COO", |
| By the numbers, Now row (text) | `components/blocks/ByTheNumbers.tsx` | moved: "Your Fractional COO or Chief of Staff. Keeping Ops running. Served", | moved: "Your Fractional COO. Keeping Ops running. Served", |
| By the numbers, Now badge | `components/blocks/ByTheNumbers.tsx` | <span>{"Fractional COO\u00A0/\nChief of Staff"}</span> | <span>Fractional COO</span> |
| "Hi, I'm Riz" bullet (Home V2, V4) | `components/hero-section.tsx` | Fractional COO or Chief of Staff, 10–30 hours a week</li> | Fractional COO, 10–30 hours a week</li> |
| AI chat prompt (who Riz is) | `components/DirectLineCTA.tsx` | a fractional COO and Chief of Staff who ran operations | a fractional COO who ran operations |
| AI chat prompt (question) | `components/DirectLineCTA.tsx` | whether my startup needs a fractional COO, a Chief of Staff, or neither yet. | whether my startup needs a fractional COO yet. |
| FAQ: Why start with the Diagnostic? | `components/ServicesFAQ.tsx` | an ongoing COO or Chief of Staff, or neither. | an ongoing fractional COO, or neither. |
| FAQ question | `components/ServicesFAQ.tsx` | q: "COO or Chief of Staff. What's the difference?", | q: "Do you also do Chief of Staff work?", |
| FAQ answer | `components/ServicesFAQ.tsx` | a: "A COO owns the operation: cadence, metrics, cost, process. A Chief of Staff works for the founder: priorities, follow-through, board updates. Most early-stage companies need a mix. The Diagnostic tells us which, so you don't have to decide up front.", | a: "Yes, as part of the role. A COO owns the operation: cadence, metrics, cost, process. At your stage the founder usually needs the Chief of Staff side too: priorities, follow-through, board updates. I cover both, so you don't have to choose.", |
| FAQ: What's your background? | `components/ServicesFAQ.tsx` | ACCA-qualified. Fractional COO and Chief of Staff since 2025. | ACCA-qualified. Fractional COO since 2025. |
| Services: fit call item | `app/services/page.tsx` | { text: "Whether you need a COO, a Chief of Staff, or neither" }, | { text: "Whether you need a fractional COO yet, or not" }, |
| Services: timeline stop title | `app/services/page.tsx` | title: "Fractional COO or Chief of Staff.", | title: "Fractional COO.", |
| Services: timeline stop text | `app/services/page.tsx` | body: "I join the team and own the operation. COO when the operation is the problem, Chief of Staff when your week is. Usually a bit of both.", | body: "I join the team and own the operation, including the Chief of Staff work on the founder's side: priorities, follow-through, board updates.", |
| Services: card 3 title | `app/services/page.tsx` | <h3>Fractional COO / Chief of Staff</h3> | <h3>Fractional COO</h3> |
| Services: card 3 text | `app/services/page.tsx` | <p className="sb-card-sub">I join the team and own the operation. COO when the operation is the problem, Chief of Staff when your week is.</p> | <p className="sb-card-sub">I join the team and own the operation, including the Chief of Staff work on the founder's side.</p> |
| Services: code comment | `app/services/page.tsx` | {/* 03 · fractional COO / CoS */} | {/* 03 · fractional COO */} |
| README intro | `README.md` | Rizwan Mahmood's site as a Fractional COO / Chief of Staff for | Rizwan Mahmood's site as a Fractional COO for |
| Homepage hero pill (both layouts) | `components/PromiseHero.tsx` | <span className="pill-eyebrow">Fractional COO / Chief of Staff</span> | <span className="pill-eyebrow">Fractional COO</span> |
| CV PDF | `public/Rizwan-Mahmood-CV.pdf` | Regenerated from the old CV text | Regenerated from the new CV text |
