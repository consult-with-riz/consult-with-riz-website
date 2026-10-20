# consultwithriz.com

Rizwan Mahmood's site as a Fractional COO for Seed to Series B founders running operations-heavy companies. It explains the offer (a free fit call, a $1,500 Ops & AI Diagnostic, then fractional COO or Chief of Staff work), shows the track record and client testimonials, and lets visitors book a call.

Built with Next.js (App Router), React, TypeScript and Tailwind. Deployed on Vercel: every push to `main` goes live.

## Pages

| Page | Link | Status |
|---|---|---|
| Home (operating system colour-coded) | [consultwithriz.com](https://www.consultwithriz.com) | Not hidden |
| Case studies | [consultwithriz.com/case-studies](https://www.consultwithriz.com/case-studies) | Not hidden |
| CV (with PDF download) | [consultwithriz.com/cv](https://www.consultwithriz.com/cv) | Not hidden |
| AI summary of the site | [consultwithriz.com/llms.txt](https://www.consultwithriz.com/llms.txt) | Not hidden |
| Services | [consultwithriz.com/services](https://www.consultwithriz.com/services) | Hidden |
| Home V2 (original homepage) | [consultwithriz.com/home-v2](https://www.consultwithriz.com/home-v2) | Hidden |
| Home V3 (first merged homepage) | [consultwithriz.com/home-v3](https://www.consultwithriz.com/home-v3) | Hidden |
| Home V4 (merged homepage with "Hi, I'm Riz") | [consultwithriz.com/home-v4](https://www.consultwithriz.com/home-v4) | Hidden |
| Next 1 (operating system as bold cards) | [consultwithriz.com/next-1](https://www.consultwithriz.com/next-1) | Hidden |
| Next 2 (operating system as spotlight) | [consultwithriz.com/next-2](https://www.consultwithriz.com/next-2) | Hidden |
| Next 3 (operating system as plain cards, the previous homepage design) | [consultwithriz.com/next-3](https://www.consultwithriz.com/next-3) | Hidden |
| Next 6 (operating system as lighter spotlight) | [consultwithriz.com/next-6](https://www.consultwithriz.com/next-6) | Hidden |
| Next 7 (operating system as colour with meaning: COO, Chief of Staff, Automation) | [consultwithriz.com/next-7](https://www.consultwithriz.com/next-7) | Hidden |
| Next 8 (operating system as powering up) | [consultwithriz.com/next-8](https://www.consultwithriz.com/next-8) | Hidden |
| Next 9 (operating system as click to trace) | [consultwithriz.com/next-9](https://www.consultwithriz.com/next-9) | Hidden |
| Next 10 (operating system as assembles as you scroll) | [consultwithriz.com/next-10](https://www.consultwithriz.com/next-10) | Hidden |
| Next 11 (operating system rewritten for Fractional COO: rhythm, process, owners, off your desk, cost, automation) | [consultwithriz.com/next-11](https://www.consultwithriz.com/next-11) | Hidden |

Hidden pages open by URL but are not linked anywhere on the site and are kept out of search (`noindex`, not in the sitemap).

## Reverting

Every push to `main` goes live, so going back is also a push. Three ways, from fastest to most precise:

**1. Emergency: roll back the live site in Vercel (no code).**
Vercel → the project → Deployments → pick the last good deployment → **Instant Rollback**. The site switches back in seconds. The code in GitHub stays as it is, so fix or revert it before the next push.

**2. Undo one change.** Each change below is its own commit, so one command undoes it and the push redeploys:

| Change | Date | Commit(s) | Undo |
|---|---|---|---|
| Positioning: Fractional COO (was COO / Chief of Staff) | 20 Oct 2026 | [`0a36a8a`](https://github.com/consult-with-riz/consult-with-riz-website/commit/0a36a8a6344d3bd3730b04b8c65800016f1e4748), [`c69fa66`](https://github.com/consult-with-riz/consult-with-riz-website/commit/c69fa66ebd63cea49857d4cccd646ad1e29421f2) | `git revert --no-edit eede030 && git revert --no-edit c69fa66 && git revert --no-edit 0a36a8a` (also undoes the automation wording, see below) |
| Automation only where it earns its place | 20 Oct 2026 | [`eede030`](https://github.com/consult-with-riz/consult-with-riz-website/commit/eede030531ff46d5bfa008f83695fc628e1dba4f) | `git revert --no-edit eede030` |
| Next 11 page, level card rows in the operating system | 20 Oct 2026 | [`2f9e964`](https://github.com/consult-with-riz/consult-with-riz-website/commit/2f9e9647b0cb0905978263ad9853c99874f4c2d8) | `git revert --no-edit 2f9e964` |
| By the numbers line, slower full-time bar in the race | 20 Oct 2026 | [`6044763`](https://github.com/consult-with-riz/consult-with-riz-website/commit/6044763f3a0cd902cc5b29c32c256ff491e69926) | `git revert --no-edit 6044763` |
| Homepage hero without the pill and "four stops" line; hub and cards book a call | 20 Oct 2026 | [`c79f830`](https://github.com/consult-with-riz/consult-with-riz-website/commit/c79f83016074c00a39835ac09759ee05fd52c9d5) | `git revert --no-edit c79f830` |
| Only the Riz hub books a call (cards plain, no label) | 20 Oct 2026 | [`7a6c176`](https://github.com/consult-with-riz/consult-with-riz-website/commit/7a6c176ddddbba35aaff1c381b74a5de526aba97) | `git revert --no-edit 7a6c176` |
| Case studies: split view, filters, four client cases | 20 Oct 2026 | [`e0f7bf6`](https://github.com/consult-with-riz/consult-with-riz-website/commit/e0f7bf6ef24a2aca3ca05711dc935d2240d77a2f) | `git revert --no-edit e0f7bf6` |

Then `git push origin main`. Run the commands exactly as written: one `git revert` per commit, newest first.

The positioning and the automation wording touched some of the same sentences (the Google description, `llms.txt`, the AI-chat prompt), so undoing the positioning means undoing the automation wording first. To keep "only where it earns its place" afterwards, re-apply it to the old wording. The CV PDF is inside the positioning commit, so reverting it brings the old PDF back too. [POSITIONING-CHANGE.md](POSITIONING-CHANGE.md) lists every line those two copy changes touched, before and after.

**3. Go back to a snapshot.** Tags mark the site at key points:

| Tag | The site as it was |
|---|---|
| [`positioning-coo-and-cos`](https://github.com/consult-with-riz/consult-with-riz-website/tree/positioning-coo-and-cos) | Before the Fractional COO positioning |
| [`before-automation-wording`](https://github.com/consult-with-riz/consult-with-riz-website/tree/before-automation-wording) | Before the automation wording, Next 11, level rows, numbers line and race speed |
| [`before-case-studies-redesign`](https://github.com/consult-with-riz/consult-with-riz-website/tree/before-case-studies-redesign) | Case studies as seven stacked cards, before the split view |

To return to a tag, undo everything after it in one go (this keeps history, nothing is deleted):

```bash
git revert --no-edit before-automation-wording..HEAD
git push origin main
```

Before any future change you might want to undo, tag first: `git tag -a <name> -m "<what it was>" && git push origin <name>`.

## Structure

```
app/                  one folder per page
  page.tsx            homepage
  case-studies/       case studies
  cv/                 CV page
  services/           services (hidden)
  home-v2/ … home-v4/ earlier homepages (hidden)
  next-1/ … next-11/  homepage with design options for the operating system (hidden;
                      4 and 5 were not published)
  llms.txt/           plain-text summary for AI tools
  sitemap.ts, robots.ts
components/           page sections, shared across pages
  HomeNext.tsx        the homepage, section by section
  blocks/             homepage blocks (the operating system, the numbers, ways to work together);
                      whatidoVariants.ts holds the operating-system design options
  cv/                 CV layout and the CV data (cvData.ts)
lib/                  SEO helpers, UI sounds, confetti
public/               photos, logos, testimonial photos, the CV PDF
scripts/cv-pdf.mjs    prints /cv to public/Rizwan-Mahmood-CV.pdf
```

Where to change things:

- **Testimonials:** `components/Testimonials.tsx`. Each client also has a direct link, e.g. `/#brian-portnoy`.
- **Case studies:** `lib/caseStudies.ts` (one entry per case; `testimonialId` links a case to its testimonial). The page is `components/CaseStudiesPage.tsx`, the split view `components/cases/CasesD.tsx`. Filters and the counts at the top update on their own. Link to one case with `/case-studies?case=cs-08`.
- **Booking link:** `components/CalModal.tsx`. Every "Book a call" button uses it.
- **CV:** `components/cv/cvData.ts`, then run `npm run cv:pdf` to refresh the PDF.
- **Navigation and footer:** `components/Navbar.tsx`, `components/Footer.tsx`.

## Running it

```bash
npm install
npm run dev -- -p 3005   # http://localhost:3005
npm run build            # production build
npm run cv:pdf           # regenerate the CV PDF (reads localhost:3005/cv)
```
