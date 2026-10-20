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

Hidden pages open by URL but are not linked anywhere on the site and are kept out of search (`noindex`, not in the sitemap).

Positioning changes are logged in [POSITIONING-CHANGE.md](POSITIONING-CHANGE.md), with how to revert each one.

## Structure

```
app/                  one folder per page
  page.tsx            homepage
  case-studies/       case studies
  cv/                 CV page
  services/           services (hidden)
  home-v2/ … home-v4/ earlier homepages (hidden)
  next-1/ … next-10/  homepage with design options for the operating system (hidden;
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
