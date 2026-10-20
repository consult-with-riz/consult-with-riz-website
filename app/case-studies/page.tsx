"use client";
import { useState, useEffect, Suspense, CSSProperties } from "react";
import { useSearchParams } from "next/navigation";
import AnimateIn from "@/components/AnimateIn";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import TestimonialsSection from "@/components/Testimonials";

/* ─── data ──────────────────────────────────────────────────────────────────── */

/* Every figure below comes from the September 2026 CV, as verified in
   CV-AUDIT.md and listed in POSITIONING.md. Nothing is inferred. Where the
   CV records a result but not the method, "what I did" stays general on
   purpose. TODOs mark the places Riz should add specifics in his own words. */


const STAT_CARDS = [
  { label: "SAVED", number: "$3.9M", desc: "courier cost, 6 months, Bolt" },
  { label: "CLOSE", number: "8→3", desc: "days to month-end close, Wise" },
  { label: "DISPATCH", number: "20s", desc: "down from 3 minutes, Careem" },
  { label: "AUTOMATED", number: "~40h", desc: "manual work removed weekly, per client" },
];

type CaseRow = {
  id: string;
  num: string;
  tag: string;
  title: string;
  result: string;
  area: string;
  details: {
    situation: string[];
    did: string[];
    outcomes: { number: string; label: string }[];
    takeaway: string;
    where: string;
  };
};

const caseRowsBase: CaseRow[] = [
  {
    id: "cs-01",
    num: "01",
    tag: "BOLT · COST",
    title: "Courier cost, cut by a third",
    result: "21% → 14% of GMV · $3.9M saved",
    area: "Cost",
    details: {
      // TODO(Riz): name the two or three levers that actually moved the number.
      situation: [
        "Courier cost running at 21% of GMV",
        "20 countries across Europe and Africa",
        "No shared way of reporting courier performance",
      ],
      did: [
        "Took the cost line apart market by market",
        "Introduced courier reporting frameworks in 15 countries",
        "Ran the reduction as an operating rhythm, not a one-off cut",
      ],
      outcomes: [
        { number: "$3.9M", label: "saved in 6 months" },
        { number: "14%", label: "courier cost of GMV / was 21%" },
        { number: "15", label: "countries on one reporting framework" },
      ],
      takeaway:
        "Cost comes down when the number is visible every week, in the same shape, in every market. Reporting first. Cuts second.",
      where: "Bolt · 2021–25",
    },
  },
  {
    id: "cs-02",
    num: "02",
    tag: "BOLT · GROWTH",
    title: "Delivery economics, tested not guessed",
    result: "+$2.1M from fee A/B tests in 6 months",
    area: "Growth",
    details: {
      // TODO(Riz): one line on how the tests were set up and who ran them.
      situation: [
        "Delivery fees set by judgement",
        "Courier segmentation and assignment left room on the table",
      ],
      did: [
        "Ran delivery fees as A/B experiments",
        "Reworked courier segmentation",
        "Improved how deliveries were assigned",
      ],
      outcomes: [
        { number: "+$2.1M", label: "from delivery fee A/B tests, 6 months" },
        { number: "−1.3%", label: "of GMV from courier segmentation" },
        { number: "+12%", label: "delivery assignment efficiency" },
      ],
      takeaway:
        "Pricing is an operations question. If you are not testing it, you are leaving money in a spreadsheet nobody opens.",
      where: "Bolt · 2021–25",
    },
  },
  {
    id: "cs-03",
    num: "03",
    tag: "BOLT · COMPLIANCE",
    title: "EU Platform Workers' Directive, built in",
    result: "80%+ compliance · −70% manual effort",
    area: "Compliance",
    details: {
      // TODO(Riz): what the two microservices did, in one plain sentence each.
      situation: [
        "New EU regulation for platform workers",
        "Compliance work landing on people, by hand",
      ],
      did: [
        "Turned the regulation into operating requirements",
        "Worked with engineering on two microservices to carry the load",
        "Moved compliance from a manual task to a system",
      ],
      outcomes: [
        { number: "80%+", label: "EU Platform Workers' Directive compliance" },
        { number: "−70%", label: "manual effort" },
        { number: "2", label: "microservices doing the work" },
      ],
      takeaway:
        "Regulation is a process problem before it is a legal one. If compliance needs a person to remember, it will fail on a busy week.",
      where: "Bolt · 2021–25",
    },
  },
  {
    id: "cs-04",
    num: "04",
    tag: "WISE · FINANCE OPS",
    title: "Month-end close, from 8 days to 3",
    result: "3-day close · ~92% straight-through",
    area: "Finance ops",
    details: {
      // TODO(Riz): what made the close slow before — the one bottleneck worth naming.
      situation: [
        "Month-end close taking 8 days",
        "Reconciliation and journals done largely by hand",
        "VAT/GST work eating analyst time",
      ],
      did: [
        "Mapped the close step by step",
        "Pushed reconciliation to straight-through matching",
        "Cut the manual journals out of the path",
      ],
      outcomes: [
        { number: "3 days", label: "month-end close / was 8" },
        { number: "~92%", label: "straight-through reconciliation" },
        { number: "−65%", label: "manual journals" },
        { number: "−30%", label: "VAT/GST analyst time" },
      ],
      takeaway:
        "A slow close is not a finance problem. It is a founder flying blind for a week every month.",
      where: "Wise · 2025",
    },
  },
  {
    id: "cs-05",
    num: "05",
    tag: "WISE · LAUNCHES",
    title: "Products and markets, shipped faster",
    result: "12+ products · 13+ launches · 70+ countries",
    area: "Launches",
    details: {
      // TODO(Riz): what his role was on launches — the ops checklist, the sign-off, the owner?
      situation: [
        "Products launching into 70+ countries",
        "Every launch carrying finance and reporting work",
      ],
      did: [
        "Owned the operational side of launches",
        "Made launch readiness repeatable instead of bespoke",
      ],
      outcomes: [
        { number: "12+", label: "products launched" },
        { number: "13+", label: "market launches into 70+ countries" },
        { number: "−9%", label: "time to market" },
      ],
      takeaway:
        "The second launch should be faster than the first. If it is not, nobody wrote the first one down.",
      where: "Wise · 2025",
    },
  },
  {
    id: "cs-06",
    num: "06",
    tag: "CAREEM · SERVICE OPS",
    title: "Dispatch, from 3 minutes to 20 seconds",
    result: "20s dispatch · was 3 min",
    area: "Service ops",
    details: {
      // TODO(Riz): one line on what the service was and what changed in the flow.
      situation: [
        "Dispatch run with the Ministry of Health, Khyber Pakhtunkhwa",
        "3 minutes from request to dispatch",
      ],
      did: [
        "Reworked the dispatch flow end to end",
        "Took the waiting out of the hand-offs",
      ],
      outcomes: [
        { number: "20s", label: "dispatch time / was 3 minutes" },
        { number: "9×", label: "faster" },
      ],
      takeaway:
        "Most delay lives between steps, not inside them. Find the hand-offs and the speed follows.",
      where: "Careem · 2019–20",
    },
  },
  {
    id: "cs-07",
    num: "07",
    tag: "FRACTIONAL COO · AUTOMATION",
    title: "The layer underneath: AI that runs the process",
    result: "20+ workflows live · ~40 hrs/week removed",
    area: "Automation",
    details: {
      situation: [
        "Founder-led teams of a handful of people",
        "Repetitive work held together by whoever remembers",
      ],
      did: [
        "Fixed the process first, then automated it",
        "Designed the automations on n8n and the Claude API",
        "Handed over systems that run without me",
      ],
      outcomes: [
        { number: "20+", label: "workflows live" },
        { number: "7+", label: "clients" },
        { number: "~40h", label: "manual work removed per week, per engagement" },
      ],
      takeaway:
        "This is what a fractional COO should leave behind. Not a deck. A process that runs on its own.",
      where: "Client work · 2025–",
    },
  },
];

const caseRows = caseRowsBase;

/* Logos for the companies that have one in public/logos. Anything else
   (client work) falls back to its name. */
const LOGOS: Record<string, string> = {
  Bolt: "/logos/bolt.png",
  Wise: "/logos/wise.svg",
  Careem: "/logos/careem.png",
};

/** "BOLT · COST" → { company: "Bolt", area: "Cost" } */
function splitTag(tag: string) {
  const [co, ...rest] = tag.split("·").map((t) => t.trim());
  const title = (w: string) => w.charAt(0) + w.slice(1).toLowerCase();
  const company = co.startsWith("FRACTIONAL") ? "Fractional COO" : title(co);
  return { company, area: rest.join(" · ").toLowerCase() };
}

/* ─── page ───────────────────────────────────────────────────────────────────── */

function CaseStudiesContent() {
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
                    <span className="case-hero-inline-stat-number">5</span>
                    <span className="case-hero-inline-stat-label">COMPANIES</span>
                  </div>
                  <div className="case-hero-inline-stat">
                    <span className="case-hero-inline-stat-number">7</span>
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
    </main>
  );
}

export default function CaseStudies() {
  return (
    <Suspense fallback={null}>
      <CaseStudiesContent />
    </Suspense>
  );
}
