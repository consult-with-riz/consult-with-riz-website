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
    company: "Fractional COO /\nChief of Staff",
    moved: "Operations run as COO or Chief of Staff, repeat work automated, for",
    reading: "7+",
    unit: "clients",
    live: true,
  },
];

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
          grid-template-columns: 88px 116px 172px minmax(0, 1fr) 170px;
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
        .pb-self { display: inline-flex; align-items: center; gap: 7px; font-size: 24px; font-weight: 600; color: var(--ink); letter-spacing: -0.02em; }
        .pb-self-dot { width: 7px; height: 7px; border-radius: 50%; background: #ff5c35; }
        .pb-where { white-space: pre-line; line-height: 1.3; font-size: 15.5px; font-weight: 600; color: var(--board-ink); }
        .pb-row.is-live .pb-where { color: var(--coral); }
        .pb-moved { font-size: 15px; font-weight: 500; line-height: 1.5; color: var(--board-ink); }
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
          grid-template-columns: 44px 80px 116px 172px minmax(0, 1fr) 170px;
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
          .pb-head, .pb-row { grid-template-columns: 76px 108px 150px minmax(0, 1fr) 140px; }
          .pb-gutter .pb-head, .pb-gutter .pb-row { grid-template-columns: 40px 72px 108px 150px minmax(0, 1fr) 140px; }
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
          .pb-where { grid-column: 1 / -1; grid-row: 2; white-space: normal; }
          .pb-moved { grid-column: 1 / -1; grid-row: 3; }
          .pb-row > .pb-read { grid-column: 1 / -1; grid-row: 4; align-items: flex-start; text-align: left; }
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
            Ten years running operations inside companies that were scaling fast. Same
            job I&apos;d do in yours, at a smaller size.
          </p>
        </div>

        <div role="table" aria-label="Results by company">
          <div className="pb-head" role="row">
            <span aria-hidden="true" />
            <span role="columnheader">When</span>
            <span role="columnheader" aria-label="Logo" />
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
                    <span className="pb-self">
                      <span className="pb-self-dot" aria-hidden="true" />
                      Riz
                    </span>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={r.logo} alt="" className={r.logoClass} />
                  )}
                </span>
                <span className="pb-where" role="cell">{r.company}</span>
                <span className="pb-moved" role="cell">{r.moved}</span>
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
