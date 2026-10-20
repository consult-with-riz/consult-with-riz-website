"use client";

import AnimateIn from "@/components/AnimateIn";



/**
 * BY THE NUMBERS — the proof board.
 *
 * Same bones as the About page's career board (logo in the row, no
 * filler columns) so the two read as one system. Different job: this one
 * is proof, so the last column is the number.
 *
 * Each "moved" line is written to run straight into its reading, so a row
 * reads as one sentence: "Courier costs cut from 21% to 14% of GMV,
 * saving $3.9M." Figures are from the September 2026 CV (CV-AUDIT.md).
 * The career runs down a timeline spine on the left, carried over from
 * the earlier board's side timeline.
 */

type Row = {
  when: string;
  company: string;
  logo?: string;
  /** a wide logo that can run taller than the default */
  logoClass?: "is-wide";
  moved: string;
  reading: string;
  /** small word under the number, when the sentence needs it */
  unit?: string;
  live?: boolean;
};

const ROWS: Row[] = [
  {
    when: "2017–19",
    company: "S&P Global",
    logo: "/logos/spglobal.svg",
    moved: "Insurance client cases with Product, Support and Content, solving",
    reading: "2,000+",
    unit: "cases",
  },
  {
    when: "2019–20",
    company: "Careem",
    logo: "/logos/careem.png",
    moved: "Emergency dispatch time, cut from 3 minutes to",
    reading: "20s",
  },
  {
    when: "2020–21",
    company: "Motive",
    logo: "/logos/motive.svg",
    moved: "A certified ELD product, taken into",
    reading: "Canada",
  },
  {
    when: "2021–25",
    company: "Bolt",
    logo: "/logos/bolt.png",
    moved: "Courier costs cut from 21% to 14% of GMV, saving",
    reading: "$3.9M",
  },
  {
    when: "2025",
    company: "Wise",
    logo: "/logos/wise.svg",
    moved: "Reconciliation moved to straight-through matching at",
    reading: "92%",
  },
  {
    when: "2025–26",
    company: "Shaping Wealth",
    logo: "/logos/shapingwealth.png",
    logoClass: "is-wide",
    moved: "Lydia, an AI coaching platform, taken from",
    reading: "0 → 1",
  },
  {
    when: "Now",
    company: "Fractional COO",
    moved: "Your Fractional COO. Keeping Ops running. Served",
    reading: "7+",
    unit: "clients",
    live: true,
  },
];

/* The "Now" row has no company logo, so its Where cell is the offer
   itself: a coral badge that links to the three ways to work together. */
function NowBadge() {
  return (
    <a href="#how-people-work-with-me" className="pb-now-pill">
      <span className="pb-now-pill-dot" aria-hidden="true" />
      <span>Fractional COO</span>
    </a>
  );
}

export default function ByTheNumbers() {
  return (
    <section className="section-pad pb-section">
      <style>{`
        .pb-section { background: var(--cream); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
        .pb { --board-ink: #1C1B19; }
        .pb-top { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px 48px; flex-wrap: wrap; margin-bottom: var(--heading-gap); }
        .pb-h2 { margin: 0; font-size: clamp(2.4rem, 4.4vw, 3.5rem); font-weight: 600; line-height: 1; letter-spacing: -0.02em; color: #22332C; }
        .pb-h2 span { color: var(--coral); }
        .pb-lede { margin: 0; max-width: 44ch; font-size: 1.1rem; line-height: 1.6; color: var(--board-ink); }

        .pb-head, .pb-row {
          display: grid;
          grid-template-columns: 88px 200px minmax(0, 1fr) 170px;
          align-items: stretch;
        }
        .pb-head {
          padding-bottom: 10px;
          border-bottom: 1.5px solid var(--board-ink);
          font-family: var(--font-geist-mono), monospace;
          font-size: 12px; font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--board-ink);
        }
        .pb-head > span, .pb-row > span { padding: 0 16px; display: flex; align-items: center; }
        .pb-head > span:first-child, .pb-row > span:first-child { padding-left: 0; }
        .pb-head > span + span, .pb-row > span + span { border-left: 1px solid var(--line-2); }
        .pb-r { justify-content: flex-end; text-align: right; }
        .pb-row { padding: 20px 0; border-bottom: 1px solid var(--line-2); transition: background 0.25s ease; }
        .pb-row:hover { background: #F0E8DC; }

        .pb-when {
          gap: 8px;
          font-family: var(--font-geist-mono), monospace;
          font-size: 13.5px; font-weight: 500; color: var(--board-ink); white-space: nowrap;
        }
        .pb-logo img { display: block; max-width: 92px; max-height: 26px; width: auto; height: auto; object-fit: contain; }
        .pb-logo img.is-wide { max-height: 36px; }
        .pb-now-pill {
          display: inline-flex; align-items: center; gap: 8px;
          white-space: pre-line; line-height: 1.25; font-size: 13px; font-weight: 600;
          color: #fff; background: var(--coral); border-radius: 10px; padding: 7px 12px;
          text-decoration: none; transition: background 0.2s ease, transform 0.2s ease;
        }
        .pb-now-pill:hover { background: #e8431b; transform: translateY(-1px); }
        .pb-now-pill:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
        .pb-now-pill-dot { width: 6px; height: 6px; border-radius: 50%; background: #fff; flex-shrink: 0; }
        .pb-now-pill:hover
        .pb-moved { gap: 14px; font-size: 15px; font-weight: 500; line-height: 1.5; color: var(--board-ink); }
        /* the line carries on into its number */
        .pb-arrow { margin-left: auto; flex-shrink: 0; color: var(--coral); font-size: 18px; font-weight: 600; line-height: 1; transition: transform 0.25s ease; }
        .pb-row:hover .pb-arrow { transform: translateX(4px); }
        .pb-row > .pb-read {
          flex-direction: column; align-items: flex-end; justify-content: center; text-align: right;
        }
        .pb-num {
          font-size: 32px; font-weight: 600; line-height: 1; letter-spacing: -0.025em;
          color: var(--coral); white-space: nowrap; font-variant-numeric: tabular-nums lining-nums;
        }
        .pb-unit {
          margin-top: 4px;
          font-family: var(--font-geist-mono), monospace;
          font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--board-ink);
        }

        /* ── Timeline: hollow nodes on a fading line, the "Now" node live ── */
        .pb-row { position: relative; }
        .pb-gutter .pb-head, .pb-gutter .pb-row {
          grid-template-columns: 44px 80px 200px minmax(0, 1fr) 170px;
        }
        .pb-gutter .pb-head > span:nth-child(2), .pb-gutter .pb-row > .pb-when { border-left: 0; padding-left: 0; }
        .pb-line .pb-row { --x: 21px; }
        .pb-line .pb-row::before {
          content: ""; position: absolute; left: calc(var(--x) - 1px); top: 0; bottom: 0; width: 2px;
          background: linear-gradient(to bottom, rgba(193,122,90,var(--a1)), rgba(193,122,90,var(--a2)));
        }
        .pb-line .pb-row.is-first::before { top: 50%; }
        .pb-line .pb-row.is-last::before { bottom: 50%; }
        .pb-node {
          position: absolute; left: var(--x); top: 50%; transform: translate(-50%, -50%);
          width: 22px; height: 22px; border-radius: 50%;
          border: 2px solid #C17A5A; background: var(--cream); z-index: 1;
          transition: background 0.4s ease, border-color 0.4s ease, transform 0.25s ease;
        }
        .pb-row:hover .pb-node { transform: translate(-50%, -50%) scale(1.15); }
        .pb-row.is-live .pb-node {
          border-color: var(--coral); background: var(--coral);
          animation: pb-pulse 2.2s ease-in-out infinite;
        }
        @keyframes pb-pulse {
          0%, 100% { box-shadow: 0 0 0 5px rgba(255,92,53,0.18); }
          50% { box-shadow: 0 0 0 11px rgba(255,92,53,0.06); }
        }

        @media (max-width: 1100px) {
          .pb-head, .pb-row { grid-template-columns: 76px 180px minmax(0, 1fr) 140px; }
          .pb-gutter .pb-head, .pb-gutter .pb-row { grid-template-columns: 40px 72px 180px minmax(0, 1fr) 140px; }
          .pb-gutter .pb-row { --x: 19px; }
          .pb-head > span, .pb-row > span { padding: 0 12px; }
          .pb-num { font-size: 27px; }
        }
        /* Five columns can't survive a phone: each row becomes a stacked
           record, the sentence on its own line and the number beneath it. */
        @media (max-width: 767px) {
          .pb-head { display: none; }
          .pb-row { grid-template-columns: 1fr auto; row-gap: 8px; padding: 18px 0; }
          .pb-row > span, .pb-row > span + span { border-left: 0; padding: 0; }
          .pb-when { grid-column: 1; grid-row: 1; }
          .pb-logo { grid-column: 2; grid-row: 1; justify-content: flex-end; }
          .pb-logo { text-align: right; }
          .pb-moved { grid-column: 1 / -1; grid-row: 2; }
          /* on a phone the number sits below, so the arrow points down */
          .pb-arrow { transform: rotate(90deg); margin-left: 0; }
          .pb-row:hover .pb-arrow { transform: rotate(90deg) translateX(3px); }
          .pb-row > .pb-read { grid-column: 1 / -1; grid-row: 3; align-items: flex-start; text-align: left; }
          .pb-num { font-size: 30px; }
          .pb-gutter .pb-row { grid-template-columns: 1fr auto; }
          .pb-line .pb-row { padding-left: 40px; --x: 13px; }
          .pb-gutter .pb-row > .pb-gut { display: none; }
        }
      `}</style>

      <div className="max-w-site pb pb-line pb-gutter">
        <div className="pb-top">
          <h2 className="pb-h2">
            By the <span>numbers.</span>
          </h2>
          <p className="pb-lede">
            10+ years running ops inside companies that were scaling fast.
          </p>
        </div>

        <div role="table" aria-label="Results by company">
          <div className="pb-head" role="row">
            <span aria-hidden="true" />
            <span role="columnheader">When</span>
            <span role="columnheader">Where</span>
            <span role="columnheader">What moved</span>
            <span role="columnheader" className="pb-r">Reading</span>
          </div>

          {ROWS.map((r, i) => (
            <AnimateIn key={r.when + r.company} delay={i * 60}>
              <div
                className={`pb-row${r.live ? " is-live" : ""}${i === 0 ? " is-first" : ""}${i === ROWS.length - 1 ? " is-last" : ""}`}
                role="row"
                style={{
                  // the line fades from strong to faint down the career, like the original
                  ["--a1" as string]: (1 - (i / ROWS.length) * 0.85).toFixed(2),
                  ["--a2" as string]: (1 - ((i + 1) / ROWS.length) * 0.85).toFixed(2),
                }}
              >
                <i className="pb-node" aria-hidden="true" />
                <span className="pb-gut" aria-hidden="true" />
                <span className="pb-when" role="cell">
                  {r.when}
                </span>
                <span className="pb-logo" role="cell">
                  {r.live ? (
                    <NowBadge />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={r.logo} alt={r.company} className={r.logoClass} />
                  )}
                </span>
                <span className="pb-moved" role="cell">
                  <span>{r.moved}</span>
                  <span className="pb-arrow" aria-hidden="true">→</span>
                </span>
                <span className="pb-read" role="cell">
                  <span className="pb-num">{r.reading}</span>
                  {r.unit && <span className="pb-unit">{r.unit}</span>}
                </span>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
