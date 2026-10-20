# Copy changes log

Two positioning changes, each with every line it touched and how to undo it.

# 1 · Positioning: Fractional COO

**Date:** 20 October 2026
**Change:** the site positions Riz as a **Fractional COO**, not "Fractional COO / Chief of Staff".
**Commits:** [`0a36a8a`](https://github.com/consult-with-riz/consult-with-riz-website/commit/0a36a8a6344d3bd3730b04b8c65800016f1e4748), plus [`c69fa66`](https://github.com/consult-with-riz/consult-with-riz-website/commit/c69fa66ebd63cea49857d4cccd646ad1e29421f2) for two lines the first pass missed
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

The automation wording (section 2) later edited some of the same sentences, so it has to be undone first. One `git revert` per commit, newest first:

```bash
git revert --no-edit eede030
git revert --no-edit c69fa66
git revert --no-edit 0a36a8a
git push origin main
```

This also removes the automation wording. To keep "only where it earns its place" with the old positioning, re-apply it afterwards.

The site redeploys on push. The revert also brings back the old CV PDF, since it is part of the first commit.

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
| Case studies: engagement tag (added in c69fa66) | `app/case-studies/page.tsx` | tag: "FRACTIONAL COO / CHIEF OF STAFF · AUTOMATION", | tag: "FRACTIONAL COO · AUTOMATION", |
| llms.txt: Biola's engagement (added in c69fa66) | `app/llms.txt/route.ts` | Cycle Together: fractional COO and chief of staff engagement. | Cycle Together: fractional COO engagement, including the Chief of Staff side. |
| CV PDF | `public/Rizwan-Mahmood-CV.pdf` | Regenerated from the old CV text | Regenerated from the new CV text |

# 2 · Automation only where it earns its place

**Date:** 20 October 2026
**Change:** no line implies everything gets automated. Automation happens only where it earns its place: work that repeats, where it saves real time or cuts mistakes. If a clear owner and a checklist do the job, that is what the client gets.
**Commit:** [`eede030`](https://github.com/consult-with-riz/consult-with-riz-website/commit/eede030531ff46d5bfa008f83695fc628e1dba4f)
**Before the change:** tag [`before-automation-wording`](https://github.com/consult-with-riz/consult-with-riz-website/tree/before-automation-wording)

The CV and the case studies were left as they are: they describe automations already built, which are facts, not promises. The Diagnostic's "What to automate first, and what to leave alone" already said this. The Next 11 automation card was written with the new wording from the start (commit [`2f9e964`](https://github.com/consult-with-riz/consult-with-riz-website/commit/2f9e9647b0cb0905978263ad9853c99874f4c2d8)).

## How to revert

```bash
git revert --no-edit eede030
git push origin main
```

## Every line changed

| Where | File | Before | After |
|---|---|---|---|
| Structured data: description | `app/layout.tsx` | Every process he installs gets automated before he hands it over. | He automates only where it earns its place. |
| Google description | `app/layout.tsx` | and I automate what shouldn't need a person. | and I automate only where it earns its place. |
| llms.txt summary | `app/llms.txt/route.ts` | Every process he installs gets automated before he hands it over; he designs the automations himself on n8n and Claude. | He automates only where it earns its place: the process gets fixed first, and automated only if that saves real time or cuts errors. He designs the automations himself on n8n and Claude. |
| Homepage: automation layer card | `components/blocks/WhatIDo.tsx` | body: "Anything repeatable gets automated before I leave. I design it on n8n and Claude. You keep the system, not a dependency on me.", | body: "Only where it earns its place: work that repeats, where a machine saves real time or mistakes. Built on n8n and Claude. You keep the system, not a dependency on me.", |
| How we can work together: COO card, opened | `components/blocks/WorkTogether.tsx` | "The repeat work automated before I hand it over", | "Repeat work automated where it earns its place", |
| FAQ: Where does the AI part come in? | `components/ServicesFAQ.tsx` | Once a report, a handoff or a follow-up runs the same way three times, it gets automated on n8n and the Claude API. You keep the systems when I leave. | Once a report, a handoff or a follow-up runs the same way three times, I look at automating it, and only do it if it earns its place: real time saved or mistakes cut. If a clear owner and a checklist do the job, that's what you get. Anything I build on n8n and the Claude API stays with you. |
| "Hi, I'm Riz" intro (Home V2, V4) | `components/hero-section.tsx` | Every process I fix                   gets automated before I hand it back. | Every process I fix                   is written down, and automated where it earns its place. |
| AI chat prompt | `components/DirectLineCTA.tsx` | and automates the processes he installs, using n8n and Claude. | and automates only where it earns its place, using n8n and Claude. |
| Services: timeline COO stop | `app/services/page.tsx` | { text: "The repeat work automated before I hand it over" }, | { text: "Repeat work automated where it earns its place" }, |
| Services: COO card | `app/services/page.tsx` | "The repeat work automated before I hand it over", | "Repeat work automated where it earns its place", |
| Services: Day 90 text | `app/services/page.tsx` | body: "The operation runs without you in every thread. You keep the cadence, the metrics and the automations, and a team that knows why each one exists.", | body: "The operation runs without you in every thread. You keep the cadence, the metrics, any automations that earned their place, and a team that knows why each one exists.", |
| Services: Day 90 item | `app/services/page.tsx` | { text: "Automations on n8n and the Claude API, in your accounts" }, | { text: "Automations, where they earned it, in your accounts" }, |
