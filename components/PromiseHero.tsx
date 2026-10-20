"use client";
import AnimateIn from "@/components/AnimateIn";
import CalBookingButton from "@/components/CalModal";

/**
 * The promise: "You will be out of day-to-day operations in 90 days…",
 * with the 90 days at a glance underneath. On /services the glance links
 * jump to each stop; elsewhere `anchor` sends them all to one section.
 */

const GLANCE = [
  { id: "fit-call", day: "Day 0", name: "Free fit call" },
  { id: "ops-diagnostic", day: "Days 1–14", name: "Ops & AI Diagnostic" },
  { id: "fractional-coo", day: "Days 15–90", name: "Fractional COO" },
  { id: "handover", day: "Day 90", name: "You're out of day-to-day ops" },
];

export default function PromiseHero({
  linkBase = "",
  anchor,
  photo = false,
  aside,
}: {
  linkBase?: string;
  /** send every glance link and the guarantee link here instead */
  anchor?: string;
  /** Riz's portrait on the right of the promise */
  photo?: boolean;
  /** or any other element there, e.g. a client quote card */
  aside?: React.ReactNode;
}) {
  return (
    <>
      <style>{`
        /* ── 1 · hero ── */
        .sa-hero { background: var(--cream); padding: 128px 0 64px; }
        .sa-hero-h1 {
          margin: 1.25rem 0 0;
          max-width: 22ch;
          font-size: clamp(2.3rem, 1.4rem + 2.6vw, 3.6rem);
          font-weight: 500; line-height: 1.06; letter-spacing: -0.02em; color: var(--ink);
        }
        .sa-hero-h1 em { font-style: normal; color: var(--coral); }
        .sa-nowrap { white-space: nowrap; }
        .sa-hero-sub { margin: 1.25rem 0 0; max-width: 52ch; font-size: 1.125rem; line-height: 1.65; color: var(--body); }
        .sa-hero-ctas { display: flex; align-items: center; gap: 14px 24px; flex-wrap: wrap; margin-top: 2rem; }
        .sa-text-link {
          color: var(--ink); font-weight: 600; text-decoration: none;
          border-bottom: 1.5px solid var(--coral); padding-bottom: 2px;
          transition: color 0.2s ease;
        }
        .sa-text-link:hover { color: var(--coral); }

        /* the 90 days at a glance: four segments sized by how long each lasts */
        .sa-glance { margin-top: 3.25rem; }
        .sa-glance-bar { display: grid; grid-template-columns: 0.6fr 2fr 4fr 0.9fr; gap: 6px; }
        .sa-glance-seg {
          display: flex; flex-direction: column; gap: 8px; min-width: 0;
          text-decoration: none; color: var(--ink);
        }
        .sa-glance-seg > i {
          display: block; height: 8px; border-radius: 999px; background: var(--line);
          transition: background 0.25s ease, transform 0.25s ease;
          transform-origin: left;
        }
        .sa-glance-seg:nth-child(1) > i { background: #FFB199; }
        .sa-glance-seg:nth-child(2) > i { background: var(--coral); }
        .sa-glance-seg:nth-child(3) > i { background: linear-gradient(90deg, #FCEBB0, #F5C518); }
        .sa-glance-seg:nth-child(4) > i { background: linear-gradient(90deg, #BDEBC8, #16C45B); }
        .sa-glance-seg:hover > i { transform: scaleY(1.5); }
        .sa-glance-day {
          font-family: var(--font-geist-mono), monospace; font-size: 11.5px; font-weight: 600;
          letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); white-space: nowrap;
        }
        .sa-glance-name { font-size: 14px; font-weight: 600; line-height: 1.3; }

        /* with a photo: text left, the portrait right, the glance bar under both */
        .sa-hero-grid { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr); gap: 56px; align-items: center; }
        .sa-hero-photo {
          border-radius: 20px; overflow: hidden; aspect-ratio: 4 / 5; max-height: 520px; margin-left: auto;
          box-shadow: 0 28px 72px -16px rgba(14,14,13,0.32);
        }
        .sa-hero-photo img { width: 100%; height: 100%; object-fit: cover; object-position: top center; display: block; }
        @media (max-width: 960px) {
          .sa-hero-grid { grid-template-columns: minmax(0, 1fr); gap: 36px; }
          .sa-hero-photo { max-width: 420px; max-height: none; margin-left: 0; }
        }
        @media (max-width: 767px) {
          .sa-hero { padding: 104px 0 44px; }
          .sa-glance-bar { grid-template-columns: 1fr 1fr; row-gap: 18px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .sa-glance-seg > i { transition: none !important; }
        }
      `}</style>

      {/* 1 · HERO */}
      <section className="sa-hero">
        <div className="max-w-site">
          {photo || aside ? (
            <div className="sa-hero-grid">
              <div>
              <AnimateIn>
                <span className="pill-eyebrow">Fractional COO</span>
              </AnimateIn>
              <AnimateIn delay={80}>
                <h1 className="sa-hero-h1">
                  You will be out of <span className="sa-nowrap">day-to-day</span> operations in <em className="sa-nowrap">90 days</em>, without hiring a <span className="sa-nowrap">full-time COO.</span>
                </h1>
              </AnimateIn>
              <AnimateIn delay={160}>
                <p className="sa-hero-sub">
                  For Seed to Series B founders running operations-heavy companies, 10–90 people.
                  Four stops. You only commit to the first, and it&apos;s free.
                </p>
              </AnimateIn>
              <AnimateIn delay={240}>
                <div className="sa-hero-ctas">
                  <CalBookingButton className="btn-coral">Book a free 30-min fit call →</CalBookingButton>
                  <a href={anchor ?? `${linkBase}#guarantee`} className="sa-text-link">See the Diagnostic guarantee ↓</a>
                </div>
              </AnimateIn>
              </div>
              <AnimateIn delay={200}>
                {aside ?? (
                  <div className="sa-hero-photo">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/riz-photo-new.jpg" alt="Rizwan Mahmood" />
                  </div>
                )}
              </AnimateIn>
            </div>
          ) : (
            <>
            <AnimateIn>
              <span className="pill-eyebrow">Fractional COO</span>
            </AnimateIn>
            <AnimateIn delay={80}>
              <h1 className="sa-hero-h1">
                You will be out of <span className="sa-nowrap">day-to-day</span> operations in <em className="sa-nowrap">90 days</em>, without hiring a <span className="sa-nowrap">full-time COO.</span>
              </h1>
            </AnimateIn>
            <AnimateIn delay={160}>
              <p className="sa-hero-sub">
                For Seed to Series B founders running operations-heavy companies, 10–90 people.
                Four stops. You only commit to the first, and it&apos;s free.
              </p>
            </AnimateIn>
            <AnimateIn delay={240}>
              <div className="sa-hero-ctas">
                <CalBookingButton className="btn-coral">Book a free 30-min fit call →</CalBookingButton>
                <a href={anchor ?? `${linkBase}#guarantee`} className="sa-text-link">See the Diagnostic guarantee ↓</a>
              </div>
            </AnimateIn>
            </>
          )}

          <AnimateIn delay={320}>
            <nav className="sa-glance" aria-label="The 90 days at a glance">
              <div className="sa-glance-bar">
                {GLANCE.map((s) => (
                  <a key={s.id} href={anchor ?? `${linkBase}#${s.id}`} className="sa-glance-seg">
                    <i aria-hidden="true" />
                    <span className="sa-glance-day">{s.day}</span>
                    <span className="sa-glance-name">{s.name}</span>
                  </a>
                ))}
              </div>
            </nav>
          </AnimateIn>
        </div>
      </section>
    </>
  );
}
