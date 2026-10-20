"use client";
import { useState } from "react";
import Link from "next/link";
import AnimateIn from "@/components/AnimateIn";
import CalBookingButton from "@/components/CalModal";

/**
 * The path. Three steps, and the founder only chooses the first: most start
 * with the Diagnostic, which decides whether step three is a sprint or a
 * retainer. Kept to three on purpose; every extra option here is a decision
 * the visitor has to make before they have talked to anyone.
 */
type PathStep = {
  num: string;
  verb: string;
  title: string;
  body: string;
  price: string;
  priceNote: string;
  featured?: boolean;
  cta: { label: string; href?: string };
  /** the detail for this step, shown when the cards are opened */
  more: { items: string[]; note?: { label: string; text: string }[] };
};

const PATH: PathStep[] = [
  {
    num: "01",
    verb: "Talk",
    title: "A free fit call",
    body: "Thirty minutes. Your questions, and a straight answer on whether the Diagnostic makes sense. No pitch.",
    price: "Free",
    priceNote: "30 minutes",
    cta: { label: "Book a call" },
    more: {
      items: ["Your questions, answered", "Where the operation is leaking", "Whether we're a fit, either way"],
    },
  },
  {
    num: "02",
    verb: "Diagnose",
    title: "Ops & AI Diagnostic",
    body: "Two weeks inside the business. Where it waits, breaks and leaks money, what to automate first, and a 90-day plan to fix it.",
    price: "$1,500",
    priceNote: "credited if we continue · refunded if it isn't worth it",
    featured: true,
    cta: { label: "Start with a diagnostic" },
    more: {
      items: [
        "Interviews with the founder and team leads",
        "A map of how work actually moves",
        "A prioritised 90-day plan, walked through live",
        "What to automate first, and what to leave alone",
      ],
      note: [{ label: "Guaranteed.", text: "Full refund if Day 14 isn't worth it. Credited to month one if we continue." }],
    },
  },
  {
    num: "03",
    verb: "Embed",
    title: "Fractional COO / Chief of Staff",
    body: "I fix the one thing in a six-week sprint, or stay and run operations 10–30 hours a week. The Diagnostic tells us which.",
    price: "Scoped",
    priceNote: "sprint or retainer",
    cta: { label: "Book an intro call" },
    more: {
      items: [
        "Operating cadence and the metrics people trust",
        "Cost, process and the handoffs that keep breaking",
        "Priorities, board updates and follow-through",
        "The repeat work automated before I hand it over",
      ],
      note: [
        { label: "Sprint.", text: "One problem, six weeks, fixed and handed over." },
        { label: "Ongoing.", text: "10–30 hours a week inside your leadership team." },
      ],
    },
  },
];

/**
 * `expandable` adds a "What's included" arrow to each card. Opening one
 * opens all three, so the cards stay level with each other.
 */
export default function WorkTogether({ expandable = false }: { expandable?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <style>{`
        /* Tighter top than the default section padding: the numbers board
           above already closes on its own padding, so the full 112px read
           as dead space between the two. */
        .path-section { padding-top: 64px; }
        @media (max-width: 767px) {
          .path-section { padding-top: 40px; }
        }
        .path-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-top: var(--heading-gap);
          align-items: stretch;
        }
        .path-card {
          position: relative;
          height: 100%;
          background: #fff;
          border: 1px solid var(--line);
          border-radius: 20px;
          padding: 30px 28px 28px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: transform 0.25s var(--ease), box-shadow 0.25s var(--ease), border-color 0.25s var(--ease);
        }
        .path-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 36px rgba(34,51,44,0.1);
          border-color: #22332C;
        }
        .path-card.is-featured {
          border: 1.5px solid #ff5c35;
          box-shadow: 0 18px 44px rgba(255,92,53,0.14);
        }
        .path-badge {
          position: absolute;
          top: -13px;
          left: 28px;
          background: #ff5c35;
          color: #fff;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 5px 12px;
          border-radius: 999px;
        }
        .path-step {
          font-family: var(--font-geist-mono), monospace;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(34,51,44,0.6);
        }
        .path-step b { color: #ff5c35; font-weight: 600; margin-right: 6px; }
        .path-title {
          font-size: 22px;
          font-weight: 600;
          color: #22332C;
          line-height: 1.25;
        }
        .path-body {
          font-size: 15px;
          line-height: 1.6;
          color: rgba(34,51,44,0.78);
          flex-grow: 1;
        }
        .path-price {
          display: flex;
          align-items: baseline;
          flex-wrap: wrap;
          gap: 4px 10px;
          padding-top: 14px;
          border-top: 1px solid var(--line);
        }
        .path-price-amount { font-size: 30px; font-weight: 500; color: #22332C; line-height: 1; }
        .path-price-note {
          font-family: var(--font-geist-mono), monospace;
          font-size: 13px;
          color: rgba(34,51,44,0.65);
        }
        .path-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          min-height: 46px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          text-decoration: none;
          border: 1px solid var(--line);
          background: transparent;
          color: #22332C;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.22s ease, border-color 0.22s ease, color 0.22s ease;
        }
        .path-cta:hover { border-color: #22332C; background: rgba(34,51,44,0.04); }
        .path-card.is-featured .path-cta { background: #ff5c35; border-color: #ff5c35; color: #fff; }
        .path-card.is-featured .path-cta:hover { background: #e8431b; border-color: #e8431b; }
        .path-note {
          margin: 28px auto 0;
          max-width: 64ch;
          text-align: center;
          font-size: 15px;
          color: rgba(34,51,44,0.72);
        }
        .path-note strong { color: #22332C; font-weight: 600; }
        /* ── expandable cards ──
           The cards share one set of rows (subgrid): step, title, body,
           toggle, details, price, button. So the toggles, prices and buttons
           line up across the three, open or closed. */
        @media (min-width: 901px) {
          .path-row.is-expandable { grid-template-rows: repeat(7, auto); row-gap: 0; }
          .path-row.is-expandable > div { display: grid; grid-row: span 7; grid-template-rows: subgrid; }
          .path-row.is-expandable .path-card { grid-row: span 7; display: grid; grid-template-rows: subgrid; row-gap: 12px; height: auto; }
          .path-row.is-expandable .path-body { flex-grow: 0; }
          .path-row.is-expandable .path-price { align-self: start; }
          .path-row.is-expandable .path-cta { align-self: end; }
        }
        .path-more-toggle {
          display: inline-flex; align-items: center; gap: 8px; align-self: flex-start;
          margin-top: 2px; padding: 0; border: 0; background: none; cursor: pointer;
          font: inherit; font-size: 14px; font-weight: 600; color: #ff5c35;
        }
        .path-more-toggle:focus-visible { outline: 2px solid #ff5c35; outline-offset: 4px; border-radius: 6px; }
        .path-more-arrow {
          width: 26px; height: 26px; border-radius: 50%;
          display: inline-flex; align-items: center; justify-content: center;
          background: rgba(255,92,53,0.12); color: #ff5c35;
          transition: transform 0.35s var(--ease), background 0.2s ease;
        }
        .path-more-toggle:hover .path-more-arrow { background: rgba(255,92,53,0.2); }
        .path-row.is-open .path-more-arrow { transform: rotate(180deg); }
        .path-more { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.45s var(--ease); }
        .path-row.is-open .path-more { grid-template-rows: 1fr; }
        .path-more-inner { min-height: 0; overflow: hidden; }
        .path-more-list {
          list-style: none; margin: 0; padding: 14px 0 4px; display: flex; flex-direction: column; gap: 10px;
          opacity: 0; transform: translateY(-6px); transition: opacity 0.3s ease, transform 0.35s var(--ease);
        }
        .path-row.is-open .path-more-list { opacity: 1; transform: none; transition-delay: 0.12s; }
        .path-more-list li { display: flex; gap: 10px; align-items: flex-start; font-size: 14.5px; line-height: 1.45; color: #22332C; }
        .path-tick {
          flex-shrink: 0; width: 20px; height: 20px; border-radius: 50%; margin-top: 1px;
          display: inline-flex; align-items: center; justify-content: center;
          background: rgba(255,92,53,0.14); color: #ff5c35;
        }
        .path-more-note {
          margin: 12px 0 6px; padding: 10px 12px; border-radius: 12px;
          background: var(--peach); font-size: 13.5px; line-height: 1.45; color: #22332C;
          opacity: 0; transition: opacity 0.3s ease;
        }
        .path-row.is-open .path-more-note { opacity: 1; transition-delay: 0.2s; }
        .path-more-note p { margin: 0; }
        .path-more-note p + p { margin-top: 6px; }
        .path-more-note b { font-weight: 600; }
        @media (max-width: 900px) {
          .path-row { grid-template-columns: 1fr; gap: 28px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .path-more, .path-more-list, .path-more-note, .path-more-arrow { transition: none !important; }
        }
      `}</style>

      {/* THE PATH */}
      <section id="how-people-work-with-me" className="section-pad path-section" style={{ background: "var(--paper)" }}>
        <div className="max-w-site">
          <div className="block-head is-center">
            <h2 className="block-title">
              How we can <span className="text-ramp">work together.</span>
            </h2>
          </div>

          <div className={`path-row${expandable ? " is-expandable" : ""}${open ? " is-open" : ""}`}>
            {PATH.map((step, i) => (
              <AnimateIn key={step.num} delay={i * 100}>
                <article className={`path-card${step.featured ? " is-featured" : ""}`}>
                  {step.featured && <span className="path-badge">Most start here</span>}
                  <span className="path-step"><b>{step.num}</b>{step.verb}</span>
                  <h3 className="path-title">{step.title}</h3>
                  <p className="path-body">{step.body}</p>
                  {expandable && (
                    <>
                      <button
                        type="button"
                        className="path-more-toggle"
                        aria-expanded={open}
                        aria-controls={`path-more-${step.num}`}
                        onClick={() => setOpen((o) => !o)}
                      >
                        {open ? "Show less" : "What's included"}
                        <span className="path-more-arrow" aria-hidden="true">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M3 4.5 6 7.5l3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      </button>
                      <div className="path-more" id={`path-more-${step.num}`} aria-hidden={!open}>
                        <div className="path-more-inner">
                          <ul className="path-more-list">
                            {step.more.items.map((t) => (
                              <li key={t}>
                                <span className="path-tick" aria-hidden="true">
                                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                                    <path d="M2.5 6.2 5 8.5l4.5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                </span>
                                {t}
                              </li>
                            ))}
                          </ul>
                          {step.more.note && (
                            <div className="path-more-note">
                              {step.more.note.map((n) => (
                                <p key={n.label}><b>{n.label}</b> {n.text}</p>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                  <div className="path-price">
                    <span className="path-price-amount">{step.price}</span>
                    <span className="path-price-note">{step.priceNote}</span>
                  </div>
                  {step.cta.href ? (
                    <Link href={step.cta.href} className="path-cta">
                      {step.cta.label} →
                    </Link>
                  ) : (
                    <CalBookingButton className="path-cta">{step.cta.label} →</CalBookingButton>
                  )}
                </article>
              </AnimateIn>
            ))}
          </div>

          <p className="path-note">
            <strong>Need more than ops?</strong> I bring in a bench I trust for AI,
            branding and marketing. You still deal with me.
          </p>
        </div>
      </section>
    </>
  );
}
