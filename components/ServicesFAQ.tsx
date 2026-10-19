"use client";
import { useState } from "react";

/* The FAQ from /services, also used on the homepage preview. */

const FAQ: { q: string; a: string }[] = [
  {
    q: "Why start with the Diagnostic?",
    a: "Because most founders can name the symptom, not the problem. Two weeks inside the business tells us whether you need a six-week fix, an ongoing COO or Chief of Staff, or neither. If it's neither, you still leave with the 90-day plan.",
  },
  {
    q: "What if the Diagnostic isn't worth it?",
    a: "Then you don't pay for it. If the Day 14 walkthrough isn't worth $1,500 to you, say so and I refund you in full. If we carry on working together, the $1,500 is credited against your first month.",
  },
  {
    q: "Who do you work with?",
    a: "Mostly operations-heavy Seed to Series B startups, roughly 10 to 90 people: lots of people, handoffs and moving parts. Marketplaces, logistics, fintech, B2B services with real delivery. Founder-led agencies and service businesses too, usually starting with the Diagnostic.",
  },
  {
    q: "COO or Chief of Staff. What's the difference?",
    a: "A COO owns the operation: cadence, metrics, cost, process. A Chief of Staff works for the founder: priorities, follow-through, board updates. Most early-stage companies need a mix. The Diagnostic tells us which, so you don't have to decide up front.",
  },
  {
    q: "Where does the AI part come in?",
    a: "After the process is clear, never before. Once a report, a handoff or a follow-up runs the same way three times, it gets automated on n8n and the Claude API. You keep the systems when I leave.",
  },
  {
    q: "What if we need more than operations?",
    a: "I have a bench of specialists I trust for AI implementation, branding, marketing, content and websites. I bring them in when the work needs them. You still deal with one person: me.",
  },
  {
    q: "What's your background?",
    a: "Ten years in operations at S&P Global, Careem, Motive, Bolt and Wise. At Bolt I took courier costs from 21% to 14% of GMV across 20 countries. At Wise, month-end close went from 8 days to 3. ACCA-qualified. Fractional COO and Chief of Staff since 2025.",
  },
];

export default function ServicesFAQ() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  return (
    <>
      <style>{`
        /* ── 6 · FAQ ── */
        .sa-faq-section { background: var(--cream); padding: 88px 0; border-top: 1px solid var(--line); }
        .svc-faq { max-width: 760px; margin: var(--heading-gap) auto 0; display: flex; flex-direction: column; gap: 12px; }
        .svc-faq-item { background: #fff; border: 1px solid var(--line); border-radius: 12px; overflow: hidden; transition: border-color 0.18s ease, box-shadow 0.18s ease; }
        .svc-faq-item:hover { border-color: rgba(255,92,53,0.4); }
        .svc-faq-item.is-open { border-color: var(--coral); box-shadow: 0 8px 22px rgba(255,92,53,0.1); }
        .svc-faq-q { width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 20px 24px; background: none; border: none; cursor: pointer; text-align: left; font: inherit; font-size: 1.05rem; font-weight: 600; color: var(--ink); }
        .svc-faq-q:focus-visible { outline: 2px solid var(--coral); outline-offset: -2px; }
        .svc-faq-sign { color: var(--coral); font-size: 1.4rem; line-height: 1; flex-shrink: 0; transition: transform 0.2s ease; }
        .svc-faq-item.is-open .svc-faq-sign { transform: rotate(45deg); }
        .svc-faq-a-wrap { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.25s ease; }
        .svc-faq-item.is-open .svc-faq-a-wrap { grid-template-rows: 1fr; }
        .svc-faq-a { overflow: hidden; min-height: 0; margin: 0; padding: 0 24px; color: var(--body); line-height: 1.65; }
        .svc-faq-item.is-open .svc-faq-a { padding-bottom: 20px; }

        @media (max-width: 767px) {
          .sa-faq-section { padding: 56px 0; }
          .svc-faq-q { padding: 18px 18px; font-size: 1rem; }
          .svc-faq-a { padding: 0 18px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .svc-faq-a-wrap, .svc-faq-sign { transition: none !important; }
        }
      `}</style>

      {/* 6 · FAQ */}
      <section className="sa-faq-section">
        <div className="max-w-site">
          <div className="block-head is-center">
            <span className="pill-eyebrow">Questions</span>
            <h2 className="block-title">Questions before you book.</h2>
          </div>
          <div className="svc-faq">
            {FAQ.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={item.q} className={`svc-faq-item${isOpen ? " is-open" : ""}`}>
                  <button
                    type="button"
                    className="svc-faq-q"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`svc-faq-${i}`}
                  >
                    <span>{item.q}</span>
                    <span className="svc-faq-sign" aria-hidden="true">+</span>
                  </button>
                  <div id={`svc-faq-${i}`} className="svc-faq-a-wrap" role="region">
                    <p className="svc-faq-a">{item.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
