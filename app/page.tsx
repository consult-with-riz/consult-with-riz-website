"use client";
import Link from "next/link";
import AnimateIn from "@/components/AnimateIn";
import HeroSection from "@/components/hero-section";
import CalBookingButton from "@/components/CalModal";
import WhatIDo from "@/components/blocks/WhatIDo";
import ByTheNumbers from "@/components/blocks/ByTheNumbers";
import TestimonialsSection from "@/components/Testimonials";

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
  },
  {
    num: "02",
    verb: "Diagnose",
    title: "Ops & AI Diagnostic",
    body: "Two weeks inside the business. Where it waits, breaks and leaks money, what to automate first, and a 90-day plan to fix it.",
    price: "$1,500",
    priceNote: "credited if we continue · refunded if it isn't worth it",
    featured: true,
    cta: { label: "See details", href: "/services#ops-diagnostic" },
  },
  {
    num: "03",
    verb: "Embed",
    title: "Fractional COO / Chief of Staff",
    body: "I fix the one thing in a six-week sprint, or stay and run operations 1–2 days a week. The Diagnostic tells us which.",
    price: "Scoped",
    priceNote: "sprint or retainer",
    cta: { label: "See details", href: "/services#fractional-coo" },
  },
];

export default function Home() {
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
        @media (max-width: 900px) {
          .path-row { grid-template-columns: 1fr; gap: 28px; }
        }
      `}</style>

      <HeroSection />

      <WhatIDo />

      <ByTheNumbers />

      {/* THE PATH */}
      <section id="how-people-work-with-me" className="section-pad path-section" style={{ background: "var(--paper)" }}>
        <div className="max-w-site">
          <div className="block-head is-center">
            <h2 className="block-title">
              How it <span className="text-ramp">works.</span>
            </h2>
          </div>

          <div className="path-row">
            {PATH.map((step, i) => (
              <AnimateIn key={step.num} delay={i * 100}>
                <article className={`path-card${step.featured ? " is-featured" : ""}`}>
                  {step.featured && <span className="path-badge">Most start here</span>}
                  <span className="path-step"><b>{step.num}</b>{step.verb}</span>
                  <h3 className="path-title">{step.title}</h3>
                  <p className="path-body">{step.body}</p>
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

      {/* IN THEIR WORDS */}
      <TestimonialsSection
        heading={
          <>
            Founders I&apos;ve <span style={{ color: "var(--coral)" }}>worked with.</span>
          </>
        }
      />
    </>
  );
}
