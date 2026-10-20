"use client";
import { useState, useEffect, Suspense, CSSProperties } from "react";
import { useSearchParams } from "next/navigation";
import AnimateIn from "@/components/AnimateIn";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import TestimonialsSection from "@/components/Testimonials";
import { STAT_CARDS, caseRows, LOGOS, splitTag } from "@/lib/caseStudies";

/* counted from the cases, so they stay right as cases are added; the
   general "Fractional COO" row is not a company */
const COMPANY_COUNT = new Set(
  caseRows.map((r) => splitTag(r.tag).company).filter((c) => c !== "Fractional COO"),
).size;

/* ─── page ───────────────────────────────────────────────────────────────────── */

function CaseStudiesContent({ cases }: { cases?: React.ReactNode }) {
  const [activeCase, setActiveCase] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const caseParam = searchParams.get("case");
    if (!caseParam) return;
    setActiveCase(caseParam);
    requestAnimationFrame(() => {
      document.getElementById(caseParam)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [searchParams]);

  // Seven cases read fine as one list; filter tabs were one more decision.
  const visibleRows = caseRows;

  return (
    <main style={{ background: "var(--bg)" }}>
      <style>{`
        .case-hero-band {
          background: var(--cream);
          border-bottom: 1px solid var(--line);
        }
        .case-hero-section {
          padding: 112px 60px;
          max-width: 1360px;
          margin: 0 auto;
        }
        .case-hero-section.case-hero-section--list {
          padding: 52px 60px 0;
        }
        .case-hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }
        .case-hero-heading {
          font-family: inherit;
          font-size: clamp(2.4rem, 1.5rem + 3vw, 3.7rem);
          line-height: 1.02;
          letter-spacing: -0.018em;
          font-weight: 500;
          color: #22332C;
          margin-bottom: 20px;
        }
        .case-hero-heading .outline-num {
          color: #22332C;
          -webkit-text-fill-color: #22332C;
        }
        .case-hero-subtitle {
          font-family: inherit;
          font-size: 16px;
          color: rgba(34,51,44,0.72);
          margin-bottom: 36px;
        }
        .case-hero-inline-stats {
          display: flex;
          gap: 40px;
        }
        .case-hero-inline-stat {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .case-hero-inline-stat-number {
          font-size: 28px;
          font-weight: 500;
          color: #ff5c35;
          font-family: inherit;
        }
        .case-hero-inline-stat-label {
          font-family: var(--font-geist-mono), 'Geist Mono', monospace;
          font-size: 1rem;
          font-weight: 600;
          color: #ff5c35;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .case-stats-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .case-stat-card {
          background: #FFFFFF;
          border: 1px solid var(--line);
          border-radius: 16px;
          padding: 28px 24px;
          transition: all 0.25s ease;
        }
        .case-stat-card:hover {
          transform: translateY(-5px);
          border-color: #ff5c35;
          box-shadow: 0 8px 32px rgba(255,92,53,0.1);
        }
        .case-stat-card-label {
          font-family: var(--font-geist-mono), 'Geist Mono', monospace;
          font-size: 1rem;
          font-weight: 600;
          color: #ff5c35;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .case-stat-card-number {
          font-size: 40px;
          font-weight: 500;
          line-height: 1;
          background: linear-gradient(135deg, #22332C 0%, #ff5c35 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: cardStat 4s ease infinite alternate;
        }
        @keyframes cardStat {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        .case-stat-card-divider {
          width: 24px;
          height: 2px;
          background: #ff5c35;
          border-radius: 2px;
          margin: 8px 0;
        }
        .case-stat-card-desc {
          font-size: 14px;
          color: rgba(34,51,44,0.72);
          line-height: 1.4;
        }

        @media (max-width: 768px) {
          .case-hero-section {
            padding: 64px 24px;
          }
          .case-hero-section.case-hero-section--list {
            padding: 32px 24px 0;
          }
          .case-hero-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }

        @media (max-width: 640px) {
          .proof-row {
            grid-template-columns: 32px 1fr auto;
            row-gap: 6px;
          }
          .proof-row-tag,
          .proof-row-result {
            grid-column: 1 / -1;
          }
        }

        /* ===== CASE CARDS ===== */
        .cases-section { padding: var(--section-pad) 0; background: var(--paper); border-top: 1px solid var(--line); }
        .cases-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--grid-gap);
          margin-top: var(--heading-gap);
        }
        .case-card {
          position: relative;
          background: #fff;
          border: 1px solid var(--line);
          border-radius: var(--radius-card);
          padding: 32px 32px 28px;
          display: flex;
          flex-direction: column;
          gap: 18px;
          transition: transform 0.25s var(--ease), box-shadow 0.25s var(--ease), border-color 0.25s var(--ease);
        }
        .case-anchor { position: absolute; top: -96px; }
        .case-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); border-color: var(--line-2); }
        .case-card.is-target { border-color: var(--coral); box-shadow: 0 18px 44px rgba(255,92,53,0.14); }
        .case-card.is-wide { grid-column: 1 / -1; }
        .case-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .case-card-co { display: flex; align-items: center; gap: 12px; min-width: 0; }
        .case-card-logo { height: 24px; width: auto; max-width: 92px; object-fit: contain; display: block; }
        .case-card-coname { font-weight: 700; font-size: 17px; color: var(--ink); }
        .case-card-years {
          font-family: var(--font-geist-mono), monospace;
          font-size: 13px;
          color: var(--muted);
          white-space: nowrap;
        }
        .case-card-area {
          font-family: var(--font-geist-mono), monospace;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--coral);
          background: rgba(255,92,53,0.08);
          padding: 4px 10px;
          border-radius: 999px;
          white-space: nowrap;
        }
        .case-card-hero { display: flex; align-items: baseline; flex-wrap: wrap; gap: 4px 14px; }
        .case-card-num {
          font-size: clamp(2.6rem, 2rem + 2vw, 3.4rem);
          font-weight: 500;
          line-height: 1;
          letter-spacing: -0.02em;
          color: var(--ink);
        }
        .case-card-numlabel { font-size: 15px; color: var(--body); max-width: 26ch; line-height: 1.4; }
        .case-card-title { font-size: 1.3rem; font-weight: 600; color: var(--ink); line-height: 1.3; margin: 0; }
        .case-card-label {
          font-family: var(--font-geist-mono), monospace;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 8px;
        }
        .case-card-problem { margin: 0; font-size: 15px; line-height: 1.6; color: var(--body); }
        .case-card-did { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; }
        .case-card-did li { display: flex; gap: 10px; font-size: 15px; line-height: 1.5; color: var(--ink); }
        .case-card-did li::before { content: "→"; color: var(--coral); flex-shrink: 0; }
        .case-card-metrics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 12px;
          padding: 16px 0 0;
          border-top: 1px solid var(--line);
        }
        .case-card-metric b { display: block; font-size: 1.35rem; font-weight: 600; color: var(--ink); line-height: 1.1; }
        .case-card-metric span { display: block; font-size: 13px; line-height: 1.4; color: var(--muted); margin-top: 4px; }
        .case-card-take {
          margin-top: auto;
          background: var(--cream);
          border-radius: 12px;
          padding: 14px 16px;
          font-size: 15px;
          line-height: 1.55;
          color: var(--ink);
        }
        .case-card-take strong { color: var(--coral); font-weight: 600; margin-right: 6px; }
        .cases-foot { text-align: center; margin-top: 40px; }
        @media (max-width: 860px) {
          .cases-grid { grid-template-columns: 1fr; }
          .case-card { padding: 26px 22px 22px; }
        }
      `}</style>

      <ScrollProgressBar />

      <div className="case-hero-band">
        <section className="case-hero-section">
          <div className="case-hero-grid">
            <div>
              <AnimateIn>
                <h1 className="case-hero-heading">
                  <span className="outline-num">10</span> years.
                  <br />
                  Real operations.
                  <br />
                  On the record.
                </h1>
                <div className="case-hero-inline-stats">
                  <div className="case-hero-inline-stat">
                    <span className="case-hero-inline-stat-number">{COMPANY_COUNT}</span>
                    <span className="case-hero-inline-stat-label">COMPANIES</span>
                  </div>
                  <div className="case-hero-inline-stat">
                    <span className="case-hero-inline-stat-number">{caseRows.length}</span>
                    <span className="case-hero-inline-stat-label">CASES</span>
                  </div>
                </div>
              </AnimateIn>
            </div>

            <div className="case-stats-cards">
              {STAT_CARDS.map((stat, i) => (
                <AnimateIn as="div" className="case-stat-card" key={stat.label} delay={i * 80}>
                  <div className="case-stat-card-label">{stat.label}</div>
                  <div
                    className="case-stat-card-number"
                    style={{ animationDelay: `${i * 0.5}s` }}
                  >
                    {stat.number}
                  </div>
                  <div className="case-stat-card-divider" />
                  <div className="case-stat-card-desc">{stat.desc}</div>
                </AnimateIn>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* IN THEIR WORDS */}
      <TestimonialsSection
        heading={
          <>
            Founders I&apos;ve <span style={{ color: "var(--coral)" }}>worked with.</span>
          </>
        }
      />

      {cases ?? (
        <>
      {/* THE CASES */}
      <section className="cases-section">
        <div className="max-w-site">
          <div className="block-head is-center">
            <span className="pill-eyebrow">Inside scaling companies</span>
            <h2 className="block-title">
              The problem, what I did,{" "}
              <span className="text-ramp">what moved.</span>
            </h2>
          </div>

          <div className="cases-grid">
            {caseRows.map((row, i) => {
              const { company, area } = splitTag(row.tag);
              const [lead, ...rest] = row.details.outcomes;
              const years = row.details.where.split("·").pop()?.trim();
              const wide = i === caseRows.length - 1 && caseRows.length % 2 === 1;
              return (
                <AnimateIn
                  key={row.id}
                  as="article"
                  delay={(i % 2) * 100}
                  className={`case-card${wide ? " is-wide" : ""}${activeCase === row.id ? " is-target" : ""}`}
                >
                    <span id={row.id} className="case-anchor" aria-hidden="true" />
                    <div className="case-card-top">
                      <div className="case-card-co">
                        {LOGOS[company] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img className="case-card-logo" src={LOGOS[company]} alt={company} />
                        ) : (
                          <span className="case-card-coname">{company}</span>
                        )}
                        <span className="case-card-years">{years}</span>
                      </div>
                      <span className="case-card-area">{area}</span>
                    </div>

                    <div className="case-card-hero">
                      <span className="case-card-num">{lead.number}</span>
                      <span className="case-card-numlabel">{lead.label}</span>
                    </div>

                    <h3 className="case-card-title">{row.title}</h3>

                    <div>
                      <p className="case-card-label">The problem</p>
                      <p className="case-card-problem">{row.details.situation.join(". ")}.</p>
                    </div>

                    <div>
                      <p className="case-card-label">What I did</p>
                      <ul className="case-card-did">
                        {row.details.did.map((d) => (
                          <li key={d}>{d}</li>
                        ))}
                      </ul>
                    </div>

                    {rest.length > 0 && (
                      <div className="case-card-metrics">
                        {rest.map((m) => (
                          <div key={m.label} className="case-card-metric">
                            <b>{m.number}</b>
                            <span>{m.label}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <p className="case-card-take">
                      <strong>For a founder:</strong>
                      {row.details.takeaway}
                    </p>
                </AnimateIn>
              );
            })}
          </div>
        </div>
      </section>
        </>
      )}
    </main>
  );
}

/**
 * The case studies page. `cases` swaps in a different design for the cases
 * section (used by the local previews); without it the page is as live.
 */
export default function CaseStudiesPage({ cases }: { cases?: React.ReactNode } = {}) {
  return (
    <Suspense fallback={null}>
      <CaseStudiesContent cases={cases} />
    </Suspense>
  );
}
