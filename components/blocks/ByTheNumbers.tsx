"use client";

import { useEffect, useRef, useState } from "react";

/**
 * BY THE NUMBERS — the board
 *
 * A departure board rather than a list: strict columns with rules between
 * them, a status chip per line, and the reading in the last column where
 * the time would be. One row per company, chronological by start date, so
 * the When column reads as a career rather than as six unrelated dates.
 *
 * Replaces the previous version, which had six evenly spaced rows and a
 * click-to-filter-by-employer control. The filter went with it: it answered
 * a question only Riz has ("which job was this?"), and chronological order
 * already groups the rows the way the filter was grouping them.
 */

type Status = "Shipped" | "Ongoing";

type Row = {
  when: string;
  company: string;
  moved: string;
  status: Status;
  reading: string;
};

/* From the September 2026 CV, one entry per company, earliest first.
   Figures are lifted verbatim; nothing here is inferred. Motive and
   Shaping Wealth carry a non-numeric reading because the CV records no
   metric for them, which is better than inventing one.

   S&P Global's two roles (Associate then Analyst, Insurance) are one row:
   2,000+ cases is the larger of its two figures — the other is ~20
   projects assisted on the product-operations side. */
const ROWS: Row[] = [
  {
    when: "2017–19",
    company: "S&P Global",
    moved: "Insurance client cases, with Product, Support and Content",
    status: "Shipped",
    reading: "2,000+",
  },
  {
    when: "2019–20",
    company: "Careem",
    moved: "Dispatch time, down from 3 minutes",
    status: "Shipped",
    reading: "20s",
  },
  {
    when: "2020–21",
    company: "Motive",
    moved: "Certified ELD solution, market opened",
    status: "Shipped",
    reading: "Canada",
  },
  {
    when: "2021–25",
    company: "Bolt",
    moved: "Courier costs, 21% → 14% of GMV",
    status: "Shipped",
    reading: "$3.9M",
  },
  {
    when: "2025",
    company: "Wise",
    moved: "Straight-through reconciliation",
    status: "Shipped",
    reading: "92%",
  },
  {
    when: "2025–26",
    company: "Shaping Wealth",
    moved: "Lydia taken from concept to working build",
    status: "Shipped",
    reading: "0 → 1",
  },
  {
    when: "2025–",
    company: "Fractional COO\u00A0/\nChief of Staff",
    moved: "Founder-led clients, run as COO or Chief of Staff, repeat work automated",
    status: "Ongoing",
    reading: "7+",
  },
];

/* The career line on the left. Shaping Wealth runs alongside the other
   fractional work rather than after it, so it is not a stop of its own. */
const STOPS = ROWS.filter((r) => r.company !== "Shaping Wealth");

/* A company with a logo shows it; one without falls back to its name set
   at a weight that holds its own beside the marks. Motive, the fractional work and
   Shaping Wealth have no asset in public/logos, and neither does S&P
   Global yet — drop the file in and add the line here, nothing else. */
const LOGOS: Record<string, string> = {
  Careem: "/logos/careem.png",
  Bolt: "/logos/bolt.png",
  Wise: "/logos/wise.svg",
};

export default function ByTheNumbers() {
  const ref = useRef<HTMLElement | null>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    if (typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: "-12% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen]);

  return (
    <section
      ref={ref}
      className="section-pad bnum"
      data-seen={seen}
      style={{
        background: "var(--cream)",
        borderTop: "1px solid var(--line)",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <div className="max-w-site bnum-grid">
        {/* LEFT — heading, career line, standfirst */}
        <div className="bnum-left">
          <h2 className="bnum-h2">
            <span>By the</span>
            <span className="bnum-h2-coral">numbers.</span>
          </h2>

          <div className="bnum-tl">
            <span className="bnum-tl-track" aria-hidden="true" />
            {STOPS.map((s) => (
              <div className="bnum-tl-row" key={s.company}>
                <span
                  className={`bnum-tl-node${s.status === "Ongoing" ? " is-live" : ""}`}
                  aria-hidden="true"
                />
                {/* fixed-width slot, so the years line up whatever the mark's width */}
                <span className="bnum-tl-mark">
                  {LOGOS[s.company] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      className="bnum-tl-logo"
                      data-logo={s.company.toLowerCase()}
                      src={LOGOS[s.company]}
                      alt={s.company}
                    />
                  ) : (
                    <span className="bnum-tl-name">{s.company}</span>
                  )}
                </span>
                <span className="bnum-tl-year">{s.when}</span>
              </div>
            ))}
          </div>

          <p className="bnum-lede">
            Ten years running operations inside companies that were scaling fast.
            Same job I'd do in yours, at a smaller size.
          </p>
        </div>

        {/* RIGHT — the board */}
        <div className="bnum-board">
          <div className="bnum-head">
            <span>When</span>
            <span>Where</span>
            <span>What moved</span>
            <span>Status</span>
            <span className="bnum-r">Reading</span>
          </div>

          {ROWS.map((r, i) => (
            <div
              className="bnum-row"
              key={r.company}
              style={{ ["--d" as string]: `${i * 80}ms` }}
            >
              <span className="bnum-when">{r.when}</span>
              <span className="bnum-where">{r.company}</span>
              <span className="bnum-what">{r.moved}</span>
              <span className="bnum-status">
                <span className="bnum-chip" data-kind={r.status.toLowerCase()}>
                  {r.status}
                </span>
              </span>
              <span className="bnum-read">{r.reading}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
