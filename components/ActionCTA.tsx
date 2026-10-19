"use client";
import AnimateIn from "@/components/AnimateIn";
import CalBookingButton from "@/components/CalModal";

/**
 * The closing nudge: the same dark card as the Diagnostic guarantee on
 * /services, pointed at the free fit call instead of the guarantee.
 */
export default function ActionCTA() {
  return (
    <section className="ac-wrap">
      <style>{`
        .ac-wrap { background: var(--cream); padding: 0 0 96px; }
        .ac-card {
          position: relative; overflow: hidden;
          display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 28px 48px; align-items: center;
          background: var(--ink); color: #fff; border-radius: 24px; padding: 52px 56px;
        }
        .ac-card::after {
          content: ""; position: absolute; right: -80px; top: -80px; width: 300px; height: 300px; border-radius: 50%;
          background: radial-gradient(circle, rgba(255,92,53,0.38), transparent 70%); pointer-events: none;
          animation: ac-breathe 6s ease-in-out infinite;
        }
        @keyframes ac-breathe { 0%, 100% { opacity: 0.7; transform: scale(1); } 50% { opacity: 1; transform: scale(1.12); } }
        .ac-eyebrow {
          font-family: var(--font-geist-mono), monospace; font-size: 12.5px; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase; color: #FFB199;
        }
        .ac-line { margin: 0.75rem 0 0; max-width: 26ch; font-size: clamp(1.7rem, 1.1rem + 2vw, 2.6rem); font-weight: 500; line-height: 1.15; letter-spacing: -0.015em; }
        .ac-line em { font-style: normal; color: var(--coral); }
        .ac-sub { margin: 1rem 0 0; max-width: 52ch; color: rgba(255,255,255,0.78); line-height: 1.6; }
        .ac-card .btn-coral { position: relative; z-index: 1; }
        @media (max-width: 960px) { .ac-card { grid-template-columns: minmax(0, 1fr); } }
        @media (max-width: 767px) {
          .ac-wrap { padding-bottom: 64px; }
          .ac-card { padding: 34px 24px; border-radius: 20px; }
        }
        @media (prefers-reduced-motion: reduce) { .ac-card::after { animation: none; } }
      `}</style>
      <div className="max-w-site">
        <AnimateIn>
          <div className="ac-card">
            <div>
              <span className="ac-eyebrow">Your first step is free</span>
              <p className="ac-line">
                The ops won&apos;t fix themselves. <em>Thirty minutes</em> gets you moving.
              </p>
              <p className="ac-sub">
                Book the free fit call. You leave knowing what to fix first, and whether
                I&apos;m the right person to fix it. No pitch.
              </p>
            </div>
            <CalBookingButton className="btn-coral">Book a free 30-min fit call →</CalBookingButton>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
