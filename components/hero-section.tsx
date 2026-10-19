"use client";
import Link from "next/link";
import CalBookingButton from "@/components/CalModal";
import { useParallax, useScrollFadeOut } from "@/hooks/useParallax";

const PHOTO_URL = "/riz-photo-new.jpg";

/* The About hero's track record marks, at the same heights. */
const HERO_LOGOS = [
  { src: "/logos/spglobal.svg", alt: "S&P Global", h: 22 },
  { src: "/logos/careem.png", alt: "Careem", h: 26 },
  { src: "/logos/bolt.png", alt: "Bolt", h: 30 },
  { src: "/logos/wise.svg", alt: "Wise", h: 24 },
];

export default function HeroSection({
  rightSlot,
  hideTrust = false,
}: {
  /** replaces the photo on the right */
  rightSlot?: React.ReactNode;
  /** drop the 10+ years and logo row from the left, when the right side carries them */
  hideTrust?: boolean;
} = {}) {
  const dotGridRef = useParallax<HTMLDivElement>(0.1);
  const fadeRef = useScrollFadeOut<HTMLDivElement>(420);

  return (
    <>
      <style>{`
        .hz-root {
          --hz-cream: var(--cream);
          --hz-forest: #22332C;
          --hz-black: #0E0E0D;
          --hz-coral: #ff5c35;
          --hz-amber: #D79A36;
          --hz-muted: #5E594E;
          --hz-line: var(--line);
        }

        @keyframes nameFlow {
          0%, 100% { background-position: 0% center; }
          50% { background-position: 100% center; }
        }
        @keyframes accentFlow {
          0% { background-position: 0%; }
          100% { background-position: 250%; }
        }
        @keyframes marqScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        .hz-section {
          padding: 0;
          background: var(--hz-cream);
        }
        .hz-wrap {
          max-width: var(--maxw);
          margin: 0 auto;
          padding: 0 40px;
          position: relative;
          z-index: 1;
        }

        .hz-hero { padding: 112px 0 64px; position: relative; }

        .hz-dotgrid-wrap {
          position: absolute;
          inset: 0;
          overflow: hidden;
          z-index: -1;
          pointer-events: none;
        }
        .hz-dotgrid {
          position: absolute;
          inset: -80px;
          background-image: radial-gradient(rgba(34,51,44,0.08) 1.5px, transparent 1.5px);
          background-size: 26px 26px;
          opacity: 0.6;
          -webkit-mask-image: linear-gradient(to bottom, black, transparent);
          mask-image: linear-gradient(to bottom, black, transparent);
        }

        .hz-eyebrow {
          font-family: var(--font-montserrat), sans-serif;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--hz-muted);
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 32px;
          margin-bottom: 32px;
        }
        .hz-eyebrow::before {
          content: '';
          width: 20px;
          height: 1.5px;
          background: var(--hz-coral);
          border-radius: 2px;
        }

        .hz-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 56px;
          align-items: center;
        }

        /* LEFT */
        .hz-intro {
          font-size: 28px;
          font-weight: 600;
          color: var(--hz-forest);
          margin-bottom: 14px;
          font-family: var(--font-inter-tight), 'Inter Tight', sans-serif;
        }
        .hz-intro-name {
          font-weight: 600;
          background: linear-gradient(110deg, #ff5c35, #D79A36, #E8527A, #ff5c35);
          background-size: 300% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: nameFlow 7s ease-in-out infinite;
        }

        .hz-headline {
          font-size: clamp(2.3rem, 1.4rem + 2.6vw, 3.6rem);
          font-weight: 500;
          line-height: 1.06;
          letter-spacing: -0.02em;
          margin-bottom: 0;
          color: var(--hz-forest);
          font-family: var(--font-inter-tight), 'Inter Tight', sans-serif;
        }
        .hz-accent {
          background: linear-gradient(90deg, #9B59B6, #ff5c35, #E8527A, #D79A36, #9B59B6);
          background-size: 250% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: accentFlow 4.5s linear infinite;
        }

        .hz-rule {
          width: 52px;
          height: 3px;
          background: #ff5c35;
          border-radius: 4px;
          margin: 20px 0 18px;
        }

        .hz-value-prop {
          font-size: 18px;
          line-height: 1.55;
          color: var(--hz-forest);
          max-width: 490px;
          margin-bottom: 22px;
          font-family: var(--font-inter-tight), 'Inter Tight', sans-serif;
        }

        .hz-role-list {
          list-style: none;
          margin-bottom: 26px;
          padding: 0;
        }
        .hz-role-list li {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 11px 0;
          border-bottom: 1px solid var(--hz-line);
          font-size: 16px;
          font-weight: 600;
          transition: color 0.2s;
          color: var(--hz-forest);
          font-family: var(--font-inter-tight), 'Inter Tight', sans-serif;
        }
        .hz-role-list li:first-child { border-top: 1px solid var(--hz-line); }
        .hz-role-list li:hover { color: #ff5c35; }
        .hz-role-arrow {
          color: #ff5c35;
          transition: transform 0.2s;
          flex-shrink: 0;
        }
        .hz-role-list li:hover .hz-role-arrow { transform: translateX(4px); }

        .hz-cta-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 22px;
          flex-wrap: wrap;
        }
        .hz-btn-primary {
          background: #0E0E0D;
          color: var(--cream);
          text-decoration: none;
          padding: 0 1.75rem;
          min-height: var(--btn-height);
          border-radius: var(--btn-radius);
          font-size: 16px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.22s, transform 0.22s;
          font-family: var(--font-inter-tight), 'Inter Tight', sans-serif;
        }
        .hz-btn-primary:hover {
          background: #ff5c35;
          transform: translateY(-2px);
        }
        .hz-btn-secondary {
          color: var(--hz-forest);
          text-decoration: none;
          padding: 0 1.75rem;
          min-height: var(--btn-height);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--btn-radius);
          border: 1.5px solid var(--hz-line);
          font-size: 16px;
          font-weight: 500;
          transition: border-color 0.22s, color 0.22s;
          font-family: var(--font-inter-tight), 'Inter Tight', sans-serif;
        }
        .hz-btn-secondary:hover {
          border-color: #ff5c35;
          color: #ff5c35;
        }

        .hz-ops-heading {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
        }
        .hz-ops-num {
          font-size: 42px;
          font-weight: 500;
          letter-spacing: -0.020em;
          color: var(--hz-forest);
          line-height: 1;
          font-family: var(--font-inter-tight), 'Inter Tight', sans-serif;
        }
        .hz-ops-label {
          font-size: 14px;
          font-weight: 600;
          max-width: 220px;
          line-height: 1.35;
          font-family: var(--font-inter-tight), 'Inter Tight', sans-serif;
        }
        .hz-ops-static { color: var(--hz-muted); }
        .hz-ops-animated {
          background: linear-gradient(90deg, #9B59B6, #ff5c35, #E8527A, #D79A36, #9B59B6);
          background-size: 250% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: accentFlow 4.5s linear infinite;
          display: inline;
        }

        .hz-social-strip {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 14px;
          width: fit-content;
        }
        /* Same marks and sizes as the About hero's track record row: each
           logo has its own height so they read at one weight, and none is
           squeezed into a fixed-width box. */
        .hz-logo-row {
          display: flex;
          align-items: center;
          gap: 18px 30px;
          flex-wrap: wrap;
        }
        .hz-logo-row img {
          width: auto;
          object-fit: contain;
          display: block;
        }

        /* RIGHT */
        .hz-right-col {
          position: relative;
        }

        /* Identical to the About hero photo: no filter, no dark backing
           (that showed through the rounded corners as a thin black edge). */
        .hz-photo-card {
          border-radius: 20px;
          overflow: hidden;
          aspect-ratio: 4 / 5;
          box-shadow: 0 28px 72px -16px rgba(14,14,13,0.32);
        }
        .hz-photo-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          display: block;
        }

        .hz-trust-row {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 14px;
        }

        @media (max-width: 960px) {
          .hz-wrap { padding-left: 24px; padding-right: 24px; }
          .hz-grid { grid-template-columns: 1fr; gap: 36px; }
          .hz-headline { font-size: clamp(2.15rem, 1.2rem + 3.4vw, 2.75rem); }
          /* min-height must be killed here: with aspect-ratio it transfers
             a 560px min-width and blows the grid track past the viewport */
          .hz-photo-card { max-width: 420px; }
        }

        @media (max-width: 640px) {
          .hz-hero { padding: 96px 0 48px; }
          .hz-eyebrow { margin-top: 16px; margin-bottom: 24px; }
          .hz-intro { font-size: clamp(20px, 5.8vw, 24px); margin-bottom: 10px; }
          .hz-value-prop { font-size: 16px; margin-bottom: 24px; }
          .hz-role-list { margin-bottom: 24px; }
          .hz-role-list li { font-size: 16px; padding: 11px 0; }
          .hz-cta-row { margin-bottom: 24px; }
          .hz-btn-primary, .hz-btn-secondary { flex: 1 1 auto; }
          .hz-ops-num { font-size: 32px; }
          .hz-ops-label { font-size: 14px; max-width: 190px; }
        }
      `}</style>

      <div className="hz-root hz-section">
        <div className="hz-wrap">
          <div className="hz-hero">
            <div className="hz-dotgrid-wrap" aria-hidden="true">
              <div className="hz-dotgrid" ref={dotGridRef} data-parallax />
            </div>

            <div className="hz-grid" ref={fadeRef}>
              {/* LEFT */}
              <div>
                <p className="hz-intro">Hi, I&apos;m <span className="hz-intro-name">Riz</span>.</p>

                <h1 className="hz-headline">
                  I run the operations <br />
                  so you can run <br />
                  <span className="hz-accent">the company.</span>
                </h1>

                <div className="hz-rule" />

                <p className="hz-value-prop">
                  I help Seed to Series B founders get out of day-to-day operations in
                  90 days, without hiring a full-time COO.{" "}
                  <b>Ten years inside Careem, Bolt and Wise.</b> Every process I fix
                  gets automated before I hand it back.
                </p>

                <ul className="hz-role-list">
                  <li><span className="hz-role-arrow">→</span>Fractional COO or Chief of Staff, 10–30 hours a week</li>
                  <li><span className="hz-role-arrow">→</span>Most founders start with a two-week Ops &amp; AI Diagnostic</li>
                </ul>

                <div className="hz-cta-row">
                  <CalBookingButton className="hz-btn-primary">Book a free 30-min call →</CalBookingButton>
                  <Link href="/case-studies" className="hz-btn-secondary">See the track record</Link>
                </div>

                {!hideTrust && (
                <div className="hz-trust-row">
                <div className="hz-ops-heading">
                  <span className="hz-ops-num">10+</span>
                  <span className="hz-ops-label">
                    <span className="hz-ops-static">years inside </span>
                    <span className="hz-ops-animated">high‑growth operations</span>
                  </span>
                </div>

                <div className="hz-social-strip">
                  <div className="hz-logo-row">
                    {HERO_LOGOS.map((l) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={l.alt} src={l.src} alt={l.alt} style={{ height: l.h }} />
                    ))}
                  </div>
                </div>
                </div>
                )}
              </div>

              {/* RIGHT */}
              <div className="hz-right-col">
                {rightSlot ?? (
                  <div className="hz-photo-card">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={PHOTO_URL} alt="Rizwan Mahmood" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
