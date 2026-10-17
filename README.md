# riz-web

The source of **[aiwithriz.com](https://aiwithriz.com)** — Rizwan Mahmood's personal site. Next.js App Router, TypeScript, deployed on Vercel.

## Deployment

| | |
|---|---|
| Production branch | **`main`** |
| Live domains | `aiwithriz.com`, `www.aiwithriz.com` |
| Vercel project | deployment URLs are `riz-web-*.vercel.app`, team `with-sochs-projects` |
| Preview | every other branch and PR builds a preview automatically |

Pushing to `main` deploys to production. Nothing else does.

> **If a push to `main` doesn't reach the live site,** check Vercel → Settings → Git → **Production Branch**. Renaming a Git branch does not update that field, so it can end up pointing at a branch that no longer exists — at which point every push silently builds as a *Preview* and production freezes on its last good deploy. This has bitten this repo once already.

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

```bash
npm run build        # production build
npm run start        # serve the production build
npm run lint
```

## Routes

```
/                        /services                 /guides
/about                   /services/consulting      /guides/[slug]
/booking                 /services/projects        /blog
/case-studies            /services/speaking        /writing
```

Plus `app/api/writing-posts` — a JSON endpoint the homepage calls to refresh the writing list client-side.

## Type system

**One** face, loaded via `next/font/google` in `app/layout.tsx`, plus the system mono. Consumed through CSS custom properties:

| Role | Font | Variable |
|---|---|---|
| Display — all headings | **Wix Madefor Text** | `--font-display` |
| Body — copy, buttons, lists | **Wix Madefor Text** | `--font-body` |
| Mono — 12px labels only | system stack (`ui-monospace`, SF Mono, Menlo) | `--font-mono` |

Display and body are deliberately the same family. Weight, size and tracking separate them, not a second typeface. Mono is not a webfont because the only mono on the site is 12px instrumentation labels — not worth a download.

**Watch out:** a lot of declarations still use older variable names — `--font-playfair`, `--font-fraunces`, `--font-inter-tight`, `--font-archivo`, `--font-intertight`, `--font-montserrat`, `--font-dm-sans`, `--font-geist-mono`, `--font-dm-mono`, `--font-plexmono`, `--font-bebas`. Those fonts are **not** loaded. Each name is aliased to one of the three roles in `app/globals.css`, so the names are historical labels, not the font in use. Map by **role**, not by name — `--font-playfair`, despite the name, resolves to Wix Madefor Text and renders no serif at all.

One real exception: **Caveat** *is* loaded, in `app/guides/page.tsx` only, and applied through a wrapper div for the handwritten filter captions on `/guides`. It is intentional. Don't "clean it up" as a stray reference.

### Weight

Three weights carry the whole site. Nothing is 700 or above except `font-bold` in prose:

| Weight | Role |
|---|---|
| **400** | body copy, leads, list items |
| **500** | every heading, stat numbers, nav links, labels |
| **600** | buttons, eyebrows, chips, card titles |

Emphasis comes from size, tracking and leading — not from weight. If a new heading looks weak at 500, the answer is a bigger step on the scale, not a heavier cut.

### No italics

Nothing on the site is italic, and three separate things keep it that way. All three matter:

1. Every `font-style: italic` and `fontStyle: "italic"` is gone.
2. `em, i, cite, dfn, var, address, q, blockquote` are explicitly set to `font-style: normal` in `app/globals.css`. These are italic by **browser default**, so deleting our own declarations does nothing for them. The tags are kept — `<em>` carries emphasis semantics a screen reader announces — only the slant goes.
3. `html { font-synthesis-style: none }`. If a `font-style: italic` ever gets added back, the browser would otherwise **synthesise** one by shearing the upright glyphs. That faux-oblique is not a typeface, it's a skew transform, and it looks cheap at display sizes. This forbids it, so the worst case is upright text rather than sheared text.

The italic cut is **not loaded** (`style: ["normal"]` in `app/layout.tsx`). Adding `font-style: italic` to something will therefore do nothing at all — by design. Synthetic *weight* is left enabled on purpose: all four weights are real cuts today, but disabling it would be a silent trap if a heavier weight is ever used without being loaded.

**The guides are a separate document.** `/guides/[slug]` renders the static HTML in an **iframe** (`app/guides/[slug]/GuideFrame.tsx`), so `app/globals.css` does not reach inside it — none of the three rules above apply there. Each of the 16 files in `public/guides/` therefore carries its own copy of the `em { font-style: normal }` and `font-synthesis-style: none` rules inside its own `<style>` block. **A new guide needs that rule pasted in**, or its `<em>` tags will slant while the rest of the site doesn't.

### Size rule

Headings are **not** on the px ladder any more. There are three tiers, and which one you want depends on what you're sizing:

**1. Headings — use the fluid scale, don't invent a size.** `h1`–`h4` in `app/globals.css` each carry a `clamp()`, their own leading and their own tracking. Bigger type gets tighter leading and more negative tracking:

| Step | Size (390px → 1440px) | Leading | Tracking |
|---|---|---|---|
| `h1` | 41.6 → 69.6px | 1.02 | −0.018em |
| page hero | 38.4 → 59.2px | 1.02 | −0.018em |
| `h2` | 32.8 → 49.6px | 1.06 | −0.014em |
| `h3` | 25.9 → 34.4px | 1.12 | −0.013em |
| `h4` | 20.8 → 25.6px | 1.16 | −0.012em |

A page or section heading that needs a size should take one of these steps rather than a fixed px value. Every heading on the site already does.

**2. Body is 16px / 1.6.** `p`, `li`, `td`, `th`, `label` and form controls.

**3. Labels are 12px mono**, uppercase, `0.09em` tracking — `.meta-label` and friends. This is the one tier below 14px, and it's deliberate: an uppercase mono label at 16px reads as a second headline competing with the real one.

Everything else stays on the even ladder from 14 up: `14, 16, 18, 20, 22, 24, 26, 28, 32, 34, 36, 40, 42, 44, 48, 56` — plus `110, 168, 220` for decorative numerals and quote glyphs.

A matching set of Tailwind tokens exists in `app/globals.css` (`--text-12` … `--text-32`), where **the name is the size** — `text-16` is 16px, always, with the right leading baked in. Tailwind only emits a utility once markup uses it, so an unused step generates no CSS and will look broken in devtools until something references it.

**Tracking is in `em`, never px.** A fixed `-3px` was fine at weight 900 but crushes at 500, and it doesn't scale with a `clamp()`. Use the values in the table above.

**Exception:** the standalone guide HTML files in `public/guides/` are served as static assets and shown in an iframe, so none of this applies to them. Each one carries a self-contained `<style>` block with its own scale (`0.88rem`, `0.98rem`, `1.05rem`, `1.1rem`, `1.3rem`, `1.9rem`) and its own colour tokens.

> `public/guides/guide-styles.css` looks like it should be the shared stylesheet for those files, but **not one of the 16 links it** — there are zero `<link>` tags across them. It is dead. Editing it changes nothing on screen.

Sizes are declared four different ways — CSS `font-size`, `clamp()`, inline `fontSize: "14px"`, and bare numeric `fontSize: 14` (React appends `px` itself). Any sweep over sizes has to cover all four or it will miss some.

## Colour tokens

Defined in `:root` in `app/globals.css`. Contrast is against white unless noted.

| Token | Value | Use | Contrast |
|---|---|---|---|
| `--ink` | `#22332C` | headings, emphasis | 13.3 |
| `--body` | `#333333` | body copy | 12.6 |
| `--ink2` | `#3C4642` | secondary text | 9.8 |
| `--muted` | `#55514A` | small labels, meta | 7.9 |
| `--faint` | `#5E594E` | dates, fine print | 7.0 |
| `--coral` | `#ff5c35` | accents, CTAs | 3.07 |
| `--coral-d` | `#e8431b` | pressed / hover state | 4.00 |
| `--amber` | `#D79A36` | occasional accent | 2.45 |

Note the direction trap: on the dark `--ink` blocks, "fainter" means *lighter*, not darker. Darkening a grey that sits on a dark ground collapses its contrast rather than improving it.

The oranges sit below WCAG AA deliberately — a product decision, not an oversight. Don't "fix" them without asking.

`--coral` moved from `#EA6A47` to `#ff5c35` and lost a little contrast doing it (3.16 → 3.07). On cream it drops to **2.59**, so coral text on `--cream` is decorative only — never use it for anything a reader has to parse. `--coral-d` clears 4:1 on white and is the one to reach for when an orange has to carry meaning.

Text colours written as `rgba(34,51,44,α)` are floored at **α 0.72**, which lands around 5:1 on both white and cream. Note that a contrast audit reading `rgba()` as if it were opaque will report these as passing when they aren't — composite against the real background.

## Where content comes from

| Section | Source |
|---|---|
| Writing / blog | Substack RSS via `lib/substack.ts`, refreshed through `app/api/writing-posts` |
| Guides | Standalone HTML files in `public/guides/`, indexed at runtime by `lib/guides.ts` (it reads the directory, so filenames never appear in code) and rendered in an iframe, each fully self-contained — own `<style>`, own tokens, own type scale |
| Case studies | Hard-coded in `components/FeaturedCaseStudies.tsx` and `app/case-studies/page.tsx` |
| Numbers, timeline, testimonials | Hard-coded in `app/page.tsx` |

## Booking

Every "Book a call" trigger on the site renders through **`CalBookingButton`** (`components/CalModal.tsx`) — 9 call sites across 7 files. Nothing links to cal.com or `/booking` directly. Change the booking behaviour in one place.

The call is **60 minutes at $140**, stated on the hero CTA, the booking card, the homepage trust line, the `/booking` page description and the FAQ copy. Keep those in step.

## Sounds

`lib/sounds.ts` synthesises small UI sounds with Web Audio — no audio files, so nothing to load and nothing to 404:

- `playPopSound()` — the booking CTAs (420→900 Hz with a 1320 Hz sparkle)
- `playToggleSound()` — the manual/automated switch in the workflow demo (520→880 Hz)

One shared `AudioContext`, created lazily inside the click that first needs it because the autoplay policy demands it, everything in `try/catch` so audio can never interfere with a booking, and silent for `prefers-reduced-motion`.

The separate `<audio>` player for the portrait track is unrelated — see `contexts/audio-context.tsx`.

## Layout

```
app/          routes, plus globals.css (tokens, most component CSS)
components/   shared UI
contexts/     audio-context.tsx — the portrait track player
hooks/        useParallax.ts
lib/          guides.ts, substack.ts, sounds.ts
public/       images, videos, audio, logos, guides/*.html
references/   old HTML design prototypes, kept for reference; not built or served
design.md     generated inventory of tokens as they appear in the code
CV-AUDIT.md   what was checked against the CV, what was fixed, what is still open
```

## Known issues

- **`/services` hub diagram** — `components/ServicesHubDiagram.tsx` renders a 588-unit viewBox into a ~300px box, so its SVG labels come out at **5.4px** and its centre text at **7.4px** on screen. Still the smallest text on the site by a wide margin. SVG `font-size` is in user units, so the size rule above does not catch it; fixing it means resizing the graphic. (Its *fonts* were fixed — it used to hard-code `"DM Sans"` and `"Playfair Display"`, neither of which is loaded, so those labels rendered in the browser's default sans and serif. They now route through the font variables like everything else.)
- **`components/faq-section.tsx` is imported nowhere** and renders on no page. It holds real FAQ copy, including pricing, so it is kept rather than deleted — but it is invisible to visitors. Worth publishing or removing deliberately. (Its heading named `Lora`, a font the app never loads, so it was falling back to Georgia — the only serif on the site. Now on the display face, though still nobody can see it.)
- **`public/videos` is 109MB committed to git** (one file is 49MB), which is most of the ~144MB clone. All 7 videos are genuinely used. Moving them to Vercel Blob or another CDN would make the repo far cheaper to clone and deploy.
- **The 16 guide files still use the old orange.** Each `public/guides/*.html` defines its own `--coral:#EA6A47` / `--coral-deep:#C8502F` inside its own `<style>` block — 32 occurrences in total. The site-wide move to `#ff5c35` covered `app/` and `components/` but not these, because they are separate documents in an iframe. A reader clicking from `/guides` into a guide crosses an orange boundary. Worth a follow-up sweep.
- **`public/guides/guide-styles.css` is dead** — see the note under Size rule. Either wire it up or delete it.
- **`public/Photos/riz-vespa.jpg`** (2MB) is referenced nowhere.
- **`AGENTS.md`** claims this is a Next.js version whose APIs differ from what a model was trained on and tells agents to read `node_modules/next/dist/docs/` first. It is standard Next.js — treat that file's advice with suspicion rather than following it blindly.
- **`CV-AUDIT.md`** still lists open questions about claims on the site that were never resolved.
