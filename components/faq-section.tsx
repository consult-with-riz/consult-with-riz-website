"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "How is this different from just using ChatGPT ourselves?",
    answer:
      "Nothing stops you from opening ChatGPT tomorrow. But AI doesn't think for you — it thinks like you, just faster. Feed it a messy process and you get messy output at scale, not less mess. Most of what I do happens before any tool gets touched: getting the actual process clear enough that automating it doesn't just automate the chaos.",
  },
  {
    question: "What if our process isn't \"automation-ready\" yet?",
    answer:
      "Then we're not automating yet — we're fixing that first. This is the most common reason automation projects fail, and it's usually not a tool problem. Step one is always: get clear on what's actually happening today, on paper, before anything gets built.",
  },
  {
    question: "What does this actually cost?",
    answer:
      "Advisory starts at $140/hr, no retainer required. A single 1:1 strategy session is a flat $140. Full custom builds go through Soch and get scoped per project, since \"build me an automation\" can mean a two-week fix or a much bigger system — you'll get a real number before anything starts, not a guess.",
  },
  {
    question: "How long does a build actually take?",
    answer:
      "Depends on the system, but the case studies on this site run from about two weeks for a focused build. You'll know the real timeline after we've mapped the actual workflow — not before.",
  },
  {
    question: "Do we need a technical team already in place?",
    answer:
      "No. Most of the people I work with don't have one. The systems are built to be handed over with documentation and training, not left as something only an engineer can touch.",
  },
  {
    question: "What happens after it's built — are we locked into you?",
    answer:
      "No lock-in, by design. You get the documentation, the training, and you own the system outright. If something breaks in year two, you shouldn't need me to fix it.",
  },
  {
    question: "What if it just doesn't work for our specific situation?",
    answer:
      "Then I'll tell you that before you spend anything — not after. Part of the job is being honest about what won't work, not just saying yes to keep the call going.",
  },
  {
    question: "What's the difference between working with you directly vs. Soch?",
    answer:
      "Working with me directly is advisory — thinking, strategy, coaching, workshops. Soch is where the heavy build work actually happens — the end-to-end automation systems get delivered there, not here.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="faq-section">
      <div className="faq-wrap">
        <p className="faq-eyebrow">Questions</p>
        <h2 className="faq-heading">Questions before you book.</h2>

        <div className="faq-list">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.question}
                className={`faq-item${isOpen ? " is-open" : ""}`}
              >
                <button
                  type="button"
                  className="faq-question"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span>{item.question}</span>
                  <span className="faq-icon" aria-hidden="true" />
                </button>
                <div
                  id={`faq-answer-${index}`}
                  className="faq-answer-wrap"
                  role="region"
                >
                  <p className="faq-answer">{item.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .faq-section {
          background: #f5efe0;
          padding: 88px 24px;
        }
        .faq-wrap {
          max-width: 760px;
          margin: 0 auto;
        }
        .faq-eyebrow {
          font-family: "SF Mono", SFMono-Regular, ui-monospace, Menlo, Consolas,
            monospace;
          font-size: 14px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #ff5c35;
          font-weight: 600;
          margin: 0 0 12px;
          text-align: center;
        }
        .faq-heading {
          font-family: var(--font-display), sans-serif;
          font-size: clamp(2.05rem, 1.4rem + 2.3vw, 3.1rem);
          line-height: 1.06;
          letter-spacing: -0.014em;
          font-weight: 500;
          color: #3d3d3d;
          text-align: center;
          margin: 0 0 48px;
          letter-spacing: -0.01em;
        }
        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .faq-item {
          background: #fbf7ee;
          border: 1px solid #e4dcc9;
          border-radius: 12px;
          overflow: hidden;
          transition:
            box-shadow 0.18s ease,
            border-color 0.18s ease,
            transform 0.18s ease;
        }
        .faq-item:hover {
          border-color: rgba(255,92,53, 0.4);
          box-shadow: 0 6px 18px rgba(61, 61, 61, 0.06);
          transform: translateY(-1px);
        }
        .faq-item.is-open {
          border-color: #ff5c35;
          box-shadow: 0 8px 22px rgba(255,92,53, 0.1);
        }
        .faq-question {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 20px 24px;
          background: none;
          border: none;
          margin: 0;
          cursor: pointer;
          text-align: left;
          font-family: Lora, Georgia, serif;
          font-size: 18px;
          font-weight: 600;
          color: #3d3d3d;
        }
        .faq-question:focus-visible {
          outline: 2px solid #ff5c35;
          outline-offset: -2px;
        }
        .faq-icon {
          flex-shrink: 0;
          position: relative;
          width: 18px;
          height: 18px;
        }
        .faq-icon::before,
        .faq-icon::after {
          content: "";
          position: absolute;
          background: #ff5c35;
          border-radius: 2px;
          transition:
            transform 0.2s ease,
            opacity 0.2s ease;
        }
        .faq-icon::before {
          top: 50%;
          left: 0;
          width: 100%;
          height: 2px;
          transform: translateY(-50%);
        }
        .faq-icon::after {
          top: 0;
          left: 50%;
          width: 2px;
          height: 100%;
          transform: translateX(-50%);
        }
        .faq-item.is-open .faq-icon::after {
          opacity: 0;
          transform: translateX(-50%) rotate(90deg);
        }
        .faq-answer-wrap {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.25s ease;
        }
        .faq-item.is-open .faq-answer-wrap {
          grid-template-rows: 1fr;
        }
        .faq-answer-wrap > .faq-answer {
          overflow: hidden;
          min-height: 0;
        }
        .faq-answer {
          margin: 0;
          padding: 0 24px 20px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Helvetica, Arial, sans-serif;
          font-size: 16px;
          line-height: 1.65;
          color: #5a5754;
        }

        @media (prefers-reduced-motion: reduce) {
          .faq-item,
          .faq-answer-wrap,
          .faq-icon::before,
          .faq-icon::after {
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}
