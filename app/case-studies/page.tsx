"use client";
import { useState, useEffect, Suspense, CSSProperties } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import AnimateIn from "@/components/AnimateIn";
import ScrollProgressBar from "@/components/ScrollProgressBar";

/* ─── data ──────────────────────────────────────────────────────────────────── */

/* Every figure below comes from the September 2026 CV, as verified in
   CV-AUDIT.md and listed in POSITIONING.md. Nothing is inferred. Where the
   CV records a result but not the method, "what I did" stays general on
   purpose. TODOs mark the places Riz should add specifics in his own words. */

const AREAS = [
  "All",
  "Cost",
  "Finance ops",
  "Compliance",
  "Growth",
  "Launches",
  "Service ops",
  "Automation",
];

const STAT_CARDS = [
  { label: "SAVED", number: "$3.9M", desc: "courier cost, 6 months, Bolt" },
  { label: "CLOSE", number: "8→3", desc: "days to month-end close, Wise" },
  { label: "DISPATCH", number: "20s", desc: "down from 3 minutes, Careem" },
  { label: "AUTOMATED", number: "~40h", desc: "manual work removed weekly, Soch" },
];

const CASE_IMAGES: Record<string, string> = {
  logistics: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&q=80",
  accounting: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=400&q=80",
  finance: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80",
  healthcare: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80",
  saas: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&q=80",
  property: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80",
  ecommerce: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80",
};

const ACCENT_PALETTE = [
  "#e8431b", // coral (brand-derived, darkened for AA contrast)
  "#B8562F", // rust
  "#5E7145", // olive / sage
  "#C2410C", // deep coral / burnt orange
  "#2E7C74", // teal
  "#8C6A1E", // muted gold
  "#B5576B", // dusty rose
  "#3E6B4F", // forest green
];

type CaseRow = {
  id: string;
  num: string;
  tag: string;
  title: string;
  result: string;
  area: string;
  imageKey: string;
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
    imageKey: "logistics",
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
    imageKey: "ecommerce",
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
    imageKey: "property",
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
    imageKey: "accounting",
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
    imageKey: "finance",
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
    imageKey: "healthcare",
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
    tag: "SOCH · AUTOMATION",
    title: "The layer underneath: AI that runs the process",
    result: "20+ workflows live · ~40 hrs/week removed",
    area: "Automation",
    imageKey: "saas",
    details: {
      situation: [
        "Founder-led teams of a handful of people",
        "Repetitive work held together by whoever remembers",
      ],
      did: [
        "Fixed the process first, then automated it",
        "Built on n8n and the Claude API, through Soch",
        "Handed over systems that run without me",
      ],
      outcomes: [
        { number: "20+", label: "workflows live" },
        { number: "7+", label: "clients" },
        { number: "~40h", label: "manual work removed per week, per engagement" },
      ],
      takeaway:
        "This is what a fractional COO should leave behind. Not a deck. A process that runs on its own.",
      where: "Soch · 2025–",
    },
  },
];

const caseRows = caseRowsBase.map((row, i) => ({
  ...row,
  accent: ACCENT_PALETTE[i % ACCENT_PALETTE.length],
}));

/* ─── page ───────────────────────────────────────────────────────────────────── */

function CaseStudiesContent() {
  const [activeFilter, setActiveFilter] = useState("All");
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

  const visibleRows =
    activeFilter === "All"
      ? caseRows
      : caseRows.filter((row) => row.area === activeFilter);

  return (
    <main style={{ background: "var(--bg)" }}>
      <style>{`
        .proof-row {
          display: grid;
          grid-template-columns: 60px 180px 1fr 1fr auto;
          gap: 24px;
          align-items: center;
          padding: 28px 0;
          border-bottom: 1px solid var(--line);
          border-left: 3px solid transparent;
          padding-left: 0;
          transition: background-color 0.22s ease, border-left-color 0.22s ease, border-left-width 0.22s ease, padding-left 0.22s ease;
          cursor: pointer;
          text-decoration: none;
        }
        .proof-row:hover {
          background-color: var(--row-accent-bg-hover, rgba(255,92,53,0.02));
          border-left-color: var(--row-accent, #ff5c35);
          padding-left: 20px;
        }
        .proof-row.active {
          background-color: var(--row-accent-bg-active, rgba(255,92,53,0.06));
          border-left-color: var(--row-accent, #ff5c35);
          border-left-width: 4px;
          padding-left: 20px;
        }
        .proof-row-num {
          font-family: var(--font-geist-mono), 'Geist Mono', monospace;
          font-size: 14px;
          color: var(--row-accent, #ff5c35);
          letter-spacing: 0.1em;
        }
        .proof-row-tag {
          font-family: var(--font-geist-mono), 'Geist Mono', monospace;
          font-size: 1rem;
          font-weight: 600;
          color: var(--row-accent, #ff5c35);
          letter-spacing: 0.08em;
          line-height: 1.4;
          text-transform: uppercase;
        }
        .proof-row-title {
          font-size: 20px;
          font-weight: 600;
          color: #22332C;
          font-family: var(--font-fraunces), serif;
        }
        .proof-row-result {
          font-size: 14px;
          color: rgba(34,51,44,0.72);
          line-height: 1.5;
        }
        .proof-row-arrow {
          display: inline-flex;
          color: #5E594E;
          transition: color 0.2s ease-out, transform 0.2s ease-out;
          justify-self: end;
        }
        .proof-row:hover .proof-row-arrow {
          color: var(--row-accent, #ff5c35);
        }
        .proof-row.active .proof-row-arrow {
          color: var(--row-accent, #ff5c35);
          transform: rotate(180deg);
        }

        /* filter tabs */
        .filter-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 0;
          border-bottom: 1px solid var(--line);
          margin-bottom: 48px;
          padding-bottom: 0;
        }
        .filter-tab {
          display: inline-flex;
          align-items: center;
          padding: 8px 4px;
          margin-right: 24px;
          font-size: 1rem;
          font-weight: 500;
          color: #4A4A45;
          cursor: pointer;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          border-radius: 0;
          white-space: nowrap;
          transition: all 0.25s ease;
        }
        .filter-tab:hover {
          color: #22332C;
          border-bottom-color: rgba(34,51,44,0.2);
        }
        .filter-tab.active {
          color: #22332C;
          font-weight: 600;
          border-bottom: 2px solid #ff5c35;
        }

        /* hero section */
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

        .case-row-wrap {
          transition: opacity 0.2s ease;
        }
        .case-row-wrap.dimmed {
          opacity: 0.7;
        }
        .case-row-wrap.dimmed:hover {
          opacity: 1;
        }

        /* expanded case panel */
        .case-panel {
          position: relative;
          box-sizing: border-box;
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          background: white;
          border: 1.5px solid transparent;
          border-top: none;
          border-radius: 0 0 20px 20px;
          transition: max-height 0.4s ease, opacity 0.3s ease;
        }
        .case-panel.active {
          max-height: 900px;
          opacity: 1;
          border-color: var(--line);
          box-shadow: inset 0 3px 0 0 var(--row-accent, #ff5c35);
        }
        .case-panel-header {
          background: #22332C;
          padding: 20px 36px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .case-panel-header-title {
          font-size: 16px;
          font-weight: 600;
          color: var(--cream);
          font-family: var(--font-fraunces), serif;
        }
        .case-panel-close {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.15);
          color: var(--cream);
          font-family: var(--font-geist-mono), 'Geist Mono', monospace;
          font-size: 14px;
          padding: 6px 14px;
          border-radius: 100px;
          cursor: pointer;
          transition: background 0.25s ease;
        }
        .case-panel-close:hover {
          background: rgba(255,255,255,0.2);
        }
        .case-panel-content {
          display: grid;
          grid-template-columns: 280px 1fr 1fr;
          gap: 0;
        }
        .case-panel-image {
          width: 280px;
          min-height: 340px;
          overflow: hidden;
          position: relative;
        }
        .case-panel-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.85);
          display: block;
        }
        .case-panel-image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,92,53,0.3) 0%, transparent 60%);
        }
        .case-panel-col-ba {
          padding: 32px 28px;
          border-right: 1px solid var(--line);
        }
        .case-panel-label-sm {
          font-family: var(--font-geist-mono), 'Geist Mono', monospace;
          font-size: 1rem;
          font-weight: 600;
          color: #ff5c35;
          letter-spacing: 0.08em;
          margin-bottom: 12px;
        }
        .case-panel-label-sm.after {
          color: #ff5c35;
        }
        .case-panel-list-v2 {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .case-panel-list-v2 li {
          font-size: 14px;
          color: #22332C;
          font-weight: 500;
          line-height: 1.7;
        }
        .case-panel-list-v2.after li {
          color: #22332C;
          font-weight: 500;
        }
        .case-panel-divider-v2 {
          height: 1px;
          background: linear-gradient(90deg, #ff5c35, var(--line));
          margin: 16px 0;
        }
        .case-panel-col-outcomes {
          padding: 32px 28px;
        }
        .case-stat-v2 {
          border-left: 3px solid #ff5c35;
          padding-left: 14px;
          margin-bottom: 20px;
        }
        .case-stat-v2-number {
          font-size: 26px;
          font-weight: 500;
          color: #22332C;
          background: linear-gradient(90deg, #22332C, #ff5c35);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .case-stat-v2-desc {
          font-family: var(--font-geist-mono), 'Geist Mono', monospace;
          font-size: 14px;
          color: #5E594E;
          letter-spacing: 0.04em;
          margin-top: 2px;
        }
        .case-delivered-v2-label {
          margin-top: 16px;
        }
        .case-delivered-v2-value {
          font-size: 16px;
          font-weight: 600;
          color: #22332C;
        }
        .case-takeaway {
          font-size: 15px;
          line-height: 1.6;
          color: #22332C;
          margin: 0;
        }
        @media (max-width: 768px) {
          .case-panel-content {
            grid-template-columns: 1fr;
          }
          .case-panel-image {
            width: 100%;
            min-height: 200px;
          }
          .case-panel-col-ba {
            border-right: none;
            border-bottom: 1px solid var(--line);
          }
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

      <section className="case-hero-section case-hero-section--list">
        <div>
          <nav className="filter-tabs">
            {AREAS.map((area) => (
              <button
                key={area}
                onClick={() => setActiveFilter(area)}
                className={`filter-tab${activeFilter === area ? " active" : ""}`}
              >
                {area}
              </button>
            ))}
          </nav>

          {visibleRows.map((row, i) => {
            const isActive = activeCase === row.id;
            const isDimmed = activeCase !== null && !isActive;
            const rowAccentStyle = {
              "--row-accent": row.accent,
              "--row-accent-bg-hover": `${row.accent}05`,
              "--row-accent-bg-active": `${row.accent}0F`,
            } as CSSProperties;
            return (
              <AnimateIn
                as="div"
                key={row.id}
                delay={Math.min(i, 6) * 80}
                className={`case-row-wrap${isDimmed ? " dimmed" : ""}`}
                style={rowAccentStyle}
              >
                <div
                  id={row.id}
                  className={`proof-row${isActive ? " active" : ""}`}
                  onClick={() => setActiveCase(isActive ? null : row.id)}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isActive}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActiveCase(isActive ? null : row.id);
                    }
                  }}
                >
                  <span className="proof-row-num">{row.num}</span>
                  <span className="proof-row-tag">{row.tag}</span>
                  <span className="proof-row-title">{row.title}</span>
                  <span className="proof-row-result">{row.result}</span>
                  <span className="proof-row-arrow" aria-hidden="true">
                    <ChevronDown size={18} strokeWidth={2} />
                  </span>
                </div>

                <div className={`case-panel${isActive ? " active" : ""}`}>
                  <div className="case-panel-header">
                    <span className="case-panel-header-title">{row.title}</span>
                    <button
                      className="case-panel-close"
                      onClick={() => setActiveCase(null)}
                    >
                      ✕ CLOSE
                    </button>
                  </div>

                  <div className="case-panel-content">
                    <div className="case-panel-image">
                      <img src={CASE_IMAGES[row.imageKey]} alt={row.title} />
                      <div className="case-panel-image-overlay" />
                    </div>

                    <div className="case-panel-col-ba">
                      <div className="case-panel-label-sm">THE SITUATION</div>
                      <ul className="case-panel-list-v2">
                        {row.details.situation.map((item, i) => (
                          <li key={i}>
                            <span style={{ color: "rgba(34,51,44,0.72)" }}>→ </span>
                            {item}
                          </li>
                        ))}
                      </ul>
                      <div className="case-panel-divider-v2" />
                      <div className="case-panel-label-sm after">WHAT I DID</div>
                      <ul className="case-panel-list-v2 after">
                        {row.details.did.map((item, i) => (
                          <li key={i}>
                            <span style={{ color: "#ff5c35" }}>→ </span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="case-panel-col-outcomes">
                      <div className="case-panel-label-sm">RESULT</div>
                      {row.details.outcomes.map((stat, i) => (
                        <div className="case-stat-v2" key={i}>
                          <div className="case-stat-v2-number">{stat.number}</div>
                          <div className="case-stat-v2-desc">{stat.label}</div>
                        </div>
                      ))}

                      <div className="case-panel-label-sm" style={{ marginTop: 24, marginBottom: 10 }}>
                        FOR A FOUNDER
                      </div>
                      <p className="case-takeaway">{row.details.takeaway}</p>

                      <div className="case-panel-label-sm case-delivered-v2-label">
                        WHERE
                      </div>
                      <div className="case-delivered-v2-value">{row.details.where}</div>
                    </div>
                  </div>
                </div>
              </AnimateIn>
            );
          })}
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
