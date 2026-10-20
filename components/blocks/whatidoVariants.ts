/**
 * Five treatments for "The operating system a growing company runs on",
 * each scoped to `.wid-vN` on the section so the default look is untouched.
 * The diagram (hub, connectors, mosaic) stays the same in all of them;
 * what changes is how hard the six cards pop.
 */
export const WID_VARIANT_CSS: Record<number, string> = {
  /* 1 · Bold cards: white, a coral top bar, a numbered corner, a solid
     coral icon, a bigger title; lift on hover. */
  1: `
    .wid-v1 .wid-card {
      background: #fff; border: 1px solid var(--line); overflow: hidden;
      box-shadow: 0 16px 36px -18px rgba(34,51,44,0.28);
      transition: transform 0.3s var(--ease), box-shadow 0.3s var(--ease), border-color 0.3s ease;
    }
    .wid-v1 .wid-card::before { content: ""; position: absolute; left: 0; right: 0; top: 0; height: 4px; background: var(--coral); }
    .wid-v1 .wid-card:hover { background: #fff; transform: translateY(-6px); border-color: var(--coral); box-shadow: 0 26px 50px -18px rgba(255,92,53,0.35); }
    .wid-v1 .wid-num { display: block; position: absolute; top: 20px; right: 22px; font-family: var(--font-geist-mono), monospace; font-size: 13px; font-weight: 700; letter-spacing: 0.08em; color: var(--coral); }
    .wid-v1 .wid-icon { width: 54px; height: 54px; border-radius: 15px; background: var(--coral); color: #fff; box-shadow: 0 10px 22px -8px rgba(255,92,53,0.6); }
    .wid-v1 .wid-title { font-size: clamp(1.25rem, 1.05rem + 0.5vw, 1.5rem); font-weight: 600; }
  `,

  /* 2 · Spotlight: one card at a time turns dark, and its connector lights
     up and flows from the hub. Hover takes over the spotlight. */
  2: `
    .wid-v2 .wid-card {
      background: #fff; border: 1px solid var(--line);
      transition: background-color 0.5s ease, transform 0.5s var(--ease), box-shadow 0.5s ease, border-color 0.5s ease;
    }
    .wid-v2 .wid-card:hover { background: #fff; }
    .wid-v2 .wid-card .wid-title, .wid-v2 .wid-card .wid-body { transition: color 0.5s ease; }
    .wid-v2 .wid-card.is-active {
      background: var(--ink); border-color: var(--ink); transform: translateY(-4px);
      box-shadow: 0 26px 50px -20px rgba(34,51,44,0.55);
    }
    .wid-v2 .wid-card.is-active .wid-title { color: #fff; }
    .wid-v2 .wid-card.is-active .wid-body { color: rgba(255,255,255,0.78); }
    .wid-v2 .wid-card.is-active .wid-icon { background: var(--coral); color: #fff; }
    .wid-v2 .wid-spokes .spoke-line { stroke: rgba(34,51,44,0.18); transition: stroke 0.5s ease, stroke-width 0.5s ease; }
    .wid-v2 .wid-spokes .spoke-head { fill: rgba(34,51,44,0.25); transition: fill 0.5s ease; }
    .wid-v2 .wid-spokes .spoke-port { stroke: rgba(34,51,44,0.25); transition: stroke 0.5s ease; }
    .wid-v2 .wid-spokes .is-active .spoke-line { stroke: var(--coral); stroke-width: 3; stroke-dasharray: 8 7; animation: wid-flow 0.9s linear infinite; }
    .wid-v2 .wid-spokes .is-active .spoke-head { fill: var(--coral); }
    .wid-v2 .wid-spokes .is-active .spoke-port { stroke: var(--coral); }
    @keyframes wid-flow { to { stroke-dashoffset: -15; } }
    @media (prefers-reduced-motion: reduce) { .wid-v2 .wid-spokes .is-active .spoke-line { animation: none; stroke-dasharray: none; } }
  `,

  /* 3 · Colour-coded: each item its own accent, in the same family as the
     90-day bar, with its connector in that colour. */
  3: `
    .wid-v3 .wid-n0 { --acc: #FF5C35; } .wid-v3 .spoke-i0 { --acc: #FF5C35; }
    .wid-v3 .wid-n1 { --acc: #E8890C; } .wid-v3 .spoke-i1 { --acc: #E8890C; }
    .wid-v3 .wid-n2 { --acc: #C9A100; } .wid-v3 .spoke-i2 { --acc: #C9A100; }
    .wid-v3 .wid-n3 { --acc: #16A34A; } .wid-v3 .spoke-i3 { --acc: #16A34A; }
    .wid-v3 .wid-n4 { --acc: #0E9384; } .wid-v3 .spoke-i4 { --acc: #0E9384; }
    .wid-v3 .wid-n5 { --acc: #3E63DD; } .wid-v3 .spoke-i5 { --acc: #3E63DD; }
    .wid-v3 .wid-card {
      background: color-mix(in srgb, var(--acc) 7%, #fff);
      border: 1px solid color-mix(in srgb, var(--acc) 22%, transparent);
      border-top: 4px solid var(--acc);
      transition: transform 0.3s var(--ease), box-shadow 0.3s ease;
    }
    .wid-v3 .wid-card:hover { background: color-mix(in srgb, var(--acc) 11%, #fff); transform: translateY(-4px); box-shadow: 0 20px 40px -20px color-mix(in srgb, var(--acc) 60%, transparent); }
    .wid-v3 .wid-icon { background: var(--acc); color: #fff; }
    .wid-v3 .wid-card:hover .wid-icon { background: var(--acc); }
    .wid-v3 .wid-num { display: block; position: absolute; top: 18px; right: 20px; font-family: var(--font-geist-mono), monospace; font-size: 13px; font-weight: 700; color: var(--acc); }
    .wid-v3 .wid-title { font-weight: 600; }
    .wid-v3 .wid-spokes .spoke-line { stroke: var(--acc); }
    .wid-v3 .wid-spokes .spoke-head { fill: var(--acc); }
    .wid-v3 .wid-spokes .spoke-port { stroke: var(--acc); }
    .wid-v3 .wid-hub { background: var(--ink); box-shadow: 0 0 0 10px var(--cream); }
  `,

  /* 4 · Dark cards: deep green cards with white type, so the six items jump
     off the white section; the coral hub and wiring stay as they are. */
  4: `
    .wid-v4 .wid-card {
      background: var(--ink); color: #fff;
      box-shadow: 0 22px 44px -22px rgba(34,51,44,0.6);
      transition: transform 0.3s var(--ease), background-color 0.3s ease;
    }
    .wid-v4 .wid-card:hover { background: #2B4239; transform: translateY(-5px); }
    .wid-v4 .wid-title { color: #fff; font-weight: 600; }
    .wid-v4 .wid-body { color: rgba(255,255,255,0.76); }
    .wid-v4 .wid-icon { background: rgba(255,92,53,0.16); color: #FF8A6B; }
    .wid-v4 .wid-card:hover .wid-icon { background: var(--coral); color: #fff; }
    .wid-v4 .wid-num { display: block; position: absolute; top: 20px; right: 22px; font-family: var(--font-geist-mono), monospace; font-size: 13px; font-weight: 700; color: rgba(255,255,255,0.35); }
  `,

  /* 5 · Highlighter: a coral marker stroke is drawn across each title, one
     after another, as the section scrolls into view. */
  5: `
    .wid-v5 .wid-card { background: #fff; border: 1px solid var(--line); }
    .wid-v5 .wid-card:hover { background: #fff; border-color: rgba(255,92,53,0.45); }
    .wid-v5 .wid-icon { background: var(--coral); color: #fff; }
    .wid-v5 .wid-num { display: block; margin-bottom: 0.35rem; font-family: var(--font-geist-mono), monospace; font-size: 12.5px; font-weight: 700; letter-spacing: 0.1em; color: var(--coral); }
    .wid-v5 .wid-title { font-size: clamp(1.25rem, 1.05rem + 0.5vw, 1.5rem); font-weight: 600; }
    .wid-v5 .wid-mark {
      background-image: linear-gradient(transparent 58%, rgba(255,92,53,0.32) 58%, rgba(255,92,53,0.32) 92%, transparent 92%);
      background-repeat: no-repeat; background-size: 0% 100%;
      box-decoration-break: clone; -webkit-box-decoration-break: clone;
      transition: background-size 0.9s cubic-bezier(.6,.05,.3,1);
      transition-delay: var(--mark-delay, 0s);
    }
    .wid-v5.is-in .wid-mark { background-size: 100% 100%; }
    @media (prefers-reduced-motion: reduce) { .wid-v5 .wid-mark { transition: none; background-size: 100% 100%; } }
  `,
};

/* ── Second round, after feedback: keep cards light, colour restrained,
   motion that focuses attention rather than decorates. ── */

/** Short names for the hub label in variant 9. */
export const WID_SHORT = ["Cadence", "Metrics", "Handoffs", "Founder's desk", "Cost", "Automation"];

/** Which hat each item is (variant 7). */
export const WID_ROLE: { label: string; tone: "coo" | "cos" | "auto" }[] = [
  { label: "COO", tone: "coo" },
  { label: "COO", tone: "coo" },
  { label: "COO", tone: "coo" },
  { label: "Chief of Staff", tone: "cos" },
  { label: "COO", tone: "coo" },
  { label: "Automation", tone: "auto" },
];

/* shared by the focus variants (6, 9): a focused card, the rest stepped back */
const FOCUS = (n: number) => `
  .wid-v${n} .wid-card {
    background: #fff; border: 1px solid var(--line);
    transition: opacity 0.45s ease, filter 0.45s ease, transform 0.45s var(--ease), box-shadow 0.45s ease, border-color 0.45s ease;
  }
  .wid-v${n} .wid-card:hover { background: #fff; }
  .wid-v${n}.has-active .wid-card:not(.is-active) { opacity: 0.42; filter: grayscale(1); }
  .wid-v${n} .wid-card.is-active {
    border-color: var(--coral); transform: translateY(-4px);
    box-shadow: 0 0 0 4px rgba(255,92,53,0.12), 0 24px 48px -20px rgba(255,92,53,0.45);
  }
  .wid-v${n} .wid-card.is-active .wid-icon { background: var(--coral); color: #fff; }
  .wid-v${n} .wid-spokes .spoke-line, .wid-v${n} .wid-spokes .spoke-head, .wid-v${n} .wid-spokes .spoke-port { transition: stroke 0.45s ease, fill 0.45s ease, opacity 0.45s ease; }
  .wid-v${n}.has-active .wid-spokes g:not(.is-active) { opacity: 0.25; }
  .wid-v${n}.has-active .wid-spokes g:not(.is-active) .spoke-line { stroke: rgba(34,51,44,0.6); }
  .wid-v${n} .wid-spokes .is-active .spoke-line { stroke-width: 3; stroke-dasharray: 8 7; animation: wid-flow 0.9s linear infinite; }
  @keyframes wid-flow { to { stroke-dashoffset: -15; } }
  @media (prefers-reduced-motion: reduce) { .wid-v${n} .wid-spokes .is-active .spoke-line { animation: none; stroke-dasharray: none; } }
`;

Object.assign(WID_VARIANT_CSS, {
  /* 6 · Spotlight, lighter: Next 2's rhythm, but the active card stays white
     with a coral outline; the rest grey out; a thin bar counts down to the
     next card. */
  6: FOCUS(6) + `
    .wid-v6 .wid-progress { position: absolute; left: 0; bottom: 0; height: 3px; width: 0; background: var(--coral); border-radius: 0 3px 3px 0; }
    .wid-v6 .wid-card { overflow: hidden; }
    .wid-v6 .wid-card.is-active .wid-progress { animation: wid-count 2.8s linear forwards; }
    .wid-v6.is-paused .wid-card.is-active .wid-progress { animation: none; width: 100%; }
    @keyframes wid-count { from { width: 0; } to { width: 100%; } }
    @media (prefers-reduced-motion: reduce) { .wid-v6 .wid-card.is-active .wid-progress { animation: none; width: 100%; } }
  `,

  /* 7 · Colour with meaning: three colours, one per hat, each card tagged. */
  7: `
    .wid-v7 .tone-coo { --acc: #FF5C35; } .wid-v7 .tone-cos { --acc: #22332C; } .wid-v7 .tone-auto { --acc: #4A5D73; }
    .wid-v7 .wid-card {
      background: #fff; border: 1px solid var(--line); border-left: 4px solid var(--acc);
      transition: transform 0.3s var(--ease), box-shadow 0.3s ease;
    }
    .wid-v7 .wid-card:hover { background: #fff; transform: translateY(-4px); box-shadow: 0 20px 40px -22px rgba(34,51,44,0.4); }
    .wid-v7 .wid-icon { background: color-mix(in srgb, var(--acc) 12%, #fff); color: var(--acc); }
    .wid-v7 .wid-card:hover .wid-icon { background: var(--acc); color: #fff; }
    .wid-v7 .wid-title { font-weight: 600; }
    .wid-v7 .wid-role {
      display: inline-block; position: absolute; top: 20px; right: 20px;
      padding: 4px 10px; border-radius: 999px;
      font-family: var(--font-geist-mono), monospace; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
      color: var(--acc); background: color-mix(in srgb, var(--acc) 10%, #fff); border: 1px solid color-mix(in srgb, var(--acc) 25%, transparent);
    }
    .wid-v7 .wid-spokes .spoke-line { stroke: var(--acc); }
    .wid-v7 .wid-spokes .spoke-head { fill: var(--acc); }
    .wid-v7 .wid-spokes .spoke-port { stroke: var(--acc); }
    .wid-v7 .wid-legend { display: flex; justify-content: center; flex-wrap: wrap; gap: 10px 22px; margin-top: 18px; font-size: 0.92rem; color: var(--body); }
    .wid-v7 .wid-legend span { display: inline-flex; align-items: center; gap: 8px; }
    .wid-v7 .wid-legend i { width: 10px; height: 10px; border-radius: 3px; background: var(--acc); }
  `,

  /* 8 · Powering up: pulses run out from the hub along each line, and each
     card glows as its pulse lands. */
  8: `
    .wid-v8 .wid-card { background: #fff; border: 1px solid var(--line); }
    .wid-v8 .wid-card:hover { background: #fff; border-color: rgba(255,92,53,0.5); }
    .wid-v8 .spoke-pulse { fill: var(--coral); filter: drop-shadow(0 0 6px rgba(255,92,53,0.9)); }
    .wid-v8.is-in .wid-card { animation: wid-land 4.8s ease-out infinite; animation-delay: calc(var(--pulse-delay) + 0.9s); }
    .wid-v8.is-in .wid-card .wid-icon { animation: wid-land-icon 4.8s ease-out infinite; animation-delay: calc(var(--pulse-delay) + 0.9s); }
    @keyframes wid-land {
      0% { box-shadow: 0 0 0 0 rgba(255,92,53,0); border-color: var(--line); }
      6% { box-shadow: 0 0 0 5px rgba(255,92,53,0.18), 0 18px 40px -18px rgba(255,92,53,0.55); border-color: var(--coral); }
      30%, 100% { box-shadow: 0 0 0 0 rgba(255,92,53,0); border-color: var(--line); }
    }
    @keyframes wid-land-icon {
      0%, 30%, 100% { background: var(--peach); color: var(--coral-d); }
      6% { background: var(--coral); color: #fff; }
    }
    @media (prefers-reduced-motion: reduce) { .wid-v8 .spoke-pulse { display: none; } .wid-v8.is-in .wid-card, .wid-v8.is-in .wid-card .wid-icon { animation: none; } }
  `,

  /* 9 · Click to trace: nothing moves until the visitor picks a card. */
  9: FOCUS(9) + `
    .wid-v9 .wid-card { cursor: pointer; }
    .wid-v9 .wid-card:focus-visible { outline: 2px solid var(--coral); outline-offset: 3px; }
    .wid-v9 .wid-hub .wid-hub-name { transition: opacity 0.25s ease; text-align: center; padding: 0 10px; }
    .wid-v9.has-active .wid-hub .wid-hub-name { font-size: clamp(1rem, 0.85rem + 0.5vw, 1.25rem); line-height: 1.15; }
    .wid-v9 .wid-hint { margin: 14px auto 0; text-align: center; font-size: 0.95rem; color: var(--muted); }
    .wid-v9 .wid-hint b { color: var(--coral); font-weight: 600; }
  `,

  /* 10 · Assembles as you scroll: lines draw from the hub and cards come
     alive one by one, the way the 90-day timeline fills. */
  10: `
    .wid-v10 .wid-card {
      background: #fff; border: 1px solid var(--line);
      opacity: 0.35; filter: grayscale(1); transform: translateY(10px);
      transition: opacity 0.6s ease, filter 0.6s ease, transform 0.6s var(--ease), border-color 0.6s ease, box-shadow 0.6s ease;
    }
    .wid-v10 .wid-card:hover { background: #fff; }
    .wid-v10 .wid-card.is-lit { opacity: 1; filter: none; transform: none; border-color: rgba(255,92,53,0.45); box-shadow: 0 18px 40px -22px rgba(255,92,53,0.45); }
    .wid-v10 .wid-card.is-lit .wid-icon { background: var(--coral); color: #fff; }
    .wid-v10 .wid-spokes .spoke-line { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 0.8s ease; }
    .wid-v10 .wid-spokes .spoke-head, .wid-v10 .wid-spokes .spoke-port { opacity: 0; transition: opacity 0.3s ease 0.6s; }
    .wid-v10 .wid-spokes .is-lit .spoke-line { stroke-dashoffset: 0; }
    .wid-v10 .wid-spokes .is-lit .spoke-head, .wid-v10 .wid-spokes .is-lit .spoke-port { opacity: 1; }
    @media (prefers-reduced-motion: reduce) {
      .wid-v10 .wid-card { opacity: 1; filter: none; transform: none; transition: none; }
      .wid-v10 .wid-spokes .spoke-line { stroke-dashoffset: 0; transition: none; }
      .wid-v10 .wid-spokes .spoke-head, .wid-v10 .wid-spokes .spoke-port { opacity: 1; }
    }
  `,
});
