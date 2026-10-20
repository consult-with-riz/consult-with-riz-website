# consultwithriz.com

Rizwan Mahmood's site as a Fractional COO / Chief of Staff for Seed to Series B founders running operations-heavy companies. It explains the offer (a free fit call, a $1,500 Ops & AI Diagnostic, then fractional COO or Chief of Staff work), shows the track record and client testimonials, and lets visitors book a call.

Built with Next.js (App Router), React, TypeScript and Tailwind. Deployed on Vercel: every push to `main` goes live.

## Pages

| Page | Link | Status |
|---|---|---|
| Home | [consultwithriz.com](https://www.consultwithriz.com) | Not hidden |
| Case studies | [consultwithriz.com/case-studies](https://www.consultwithriz.com/case-studies) | Not hidden |
| CV (with PDF download) | [consultwithriz.com/cv](https://www.consultwithriz.com/cv) | Not hidden |
| Services | [consultwithriz.com/services](https://www.consultwithriz.com/services) | Hidden |
| Home V2 (previous homepage) | [consultwithriz.com/home-v2](https://www.consultwithriz.com/home-v2) | Hidden |
| Home V3 (first merged homepage) | [consultwithriz.com/home-v3](https://www.consultwithriz.com/home-v3) | Hidden |
| AI summary of the site | [consultwithriz.com/llms.txt](https://www.consultwithriz.com/llms.txt) | Not hidden |

Hidden pages open by URL but are not linked anywhere on the site and are kept out of search (`noindex`, not in the sitemap).

## Structure

```
app/                  one folder per page
  page.tsx            homepage
  case-studies/       case studies
  cv/                 CV page
  services/           services (hidden)
  home-v2/, home-v3/  earlier homepages (hidden)
  llms.txt/           plain-text summary for AI tools
  sitemap.ts, robots.ts
components/           page sections, shared across pages
  blocks/             homepage blocks (what I do, the numbers, ways to work together)
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
