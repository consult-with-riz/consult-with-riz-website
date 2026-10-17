"use client";
import { useEffect, useRef, useState } from "react";
import AnimateIn from "@/components/AnimateIn";
import ServicesHubDiagram from "@/components/ServicesHubDiagram";
import DirectLineCTA from "@/components/DirectLineCTA";
import CalBookingButton from "@/components/CalModal";
import { useParallax, useScrollFadeOut } from "@/hooks/useParallax";

const SERVICE_IDS = ["fractional-coo", "chief-of-staff", "ops-diagnostic"];

/* ─── shared micro-styles ─────────────────────────── */
const sublineStyle = (color: string): React.CSSProperties => ({
  color,
});

const bodyStyle: React.CSSProperties = {
  fontFamily: "var(--font-dm-sans), sans-serif",
  color: "var(--body)",
};

const checkBullet = (color: string, text: string, i: number) => (
  <AnimateIn as="li" key={text} delay={i * 80} className="svc-check-item">
    <span
      className="svc-check-icon"
      style={{ background: `color-mix(in srgb, ${color} 16%, transparent)`, color }}
    >
      ✓
    </span>
    <span>{text}</span>
  </AnimateIn>
);

const sectionDivider = (
  <div style={{ borderTop: "1px solid var(--line)", marginTop: 0 }} />
);

/* ─── shared hook: drives card animations from viewport + motion prefs ─── */
function useCardAnimation<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducedMotion(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, active: inView && !reducedMotion };
}

/* ─── mockup: Fractional COO operating rhythm ───── */
function CooMockup() {
  const { ref, active } = useCardAnimation<HTMLDivElement>();
  const [slot, setSlot] = useState(1);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setSlot((s) => (s + 1) % 3), 3000);
    return () => clearInterval(id);
  }, [active]);

  const slots = [
    { time: "Mon · Leadership sync, owners set" },
    { time: "Wed · Metrics review, what moved" },
    { time: "Fri · Ops fixes shipped, then automated" },
  ];

  return (
    <div
      ref={ref}
      style={{
        border: "1px solid var(--line)",
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: "var(--shadow-lg)",
        maxWidth: 460,
        marginLeft: "auto",
      }}
    >
      {/* coral header */}
      <div
        style={{
          background: "var(--coral)",
          padding: "1.5rem 1.75rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            fontSize: "1.125rem",
            color: "#fff",
          }}
        >
          <span className={`svc-anim-tick${active ? " is-active" : ""}`}>◎</span>
        </div>
        <div>
          <p
            style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontWeight: 600,
              fontSize: "1.125rem",
              color: "#fff",
            }}
          >
            Operating rhythm
          </p>
          <p
            style={{
              fontFamily: "var(--font-dm-mono), monospace",
              fontSize: "0.875rem",
              color: "rgba(255,255,255,0.72)",
              marginTop: "0.15rem",
            }}
          >
            Fractional COO · 1–2 days a week
          </p>
        </div>
      </div>

      {/* body */}
      <div style={{ padding: "1.75rem", background: "#fff" }}>
        <p className="meta-label" style={{ marginBottom: "0.85rem" }}>
          This week, every week
        </p>

        {slots.map((slotItem, i) => {
          const selected = i === slot;
          return (
            <div
              key={slotItem.time}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.65rem 0.9rem",
                borderRadius: 8,
                marginBottom: "0.5rem",
                background: selected ? "var(--coral)" : "var(--cream-2)",
                border: selected ? "none" : "1px solid var(--line)",
                transition: "background 0.5s ease, border-color 0.5s ease",
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: selected ? "#fff" : "var(--muted)",
                  flexShrink: 0,
                  transition: "background 0.5s ease",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  fontSize: "0.875rem",
                  color: selected ? "#fff" : "var(--body)",
                  flex: 1,
                  transition: "color 0.5s ease",
                }}
              >
                {slotItem.time}
              </span>
              {selected && (
                <span
                  style={{
                    fontFamily: "var(--font-dm-mono), monospace",
                    fontSize: "0.875rem",
                    color: "#FFFFFF",
                  }}
                >
                  Now
                </span>
              )}
            </div>
          );
        })}

        <div
          style={{
            marginTop: "1rem",
            background: "var(--ink)",
            borderRadius: 8,
            padding: "0.8rem",
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontWeight: 600,
              fontSize: "1rem",
              color: "#fff",
            }}
          >
            Same rhythm, every week →
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── mockup: founder's desk workflow (dark card) ─ */
function wfNode(
  icon: string,
  label: string,
  accentBg: string,
  accentBorder: string,
  textColor: string,
  iconColor: string,
  isActive: boolean
) {
  return (
    <div
      style={{
        position: "relative",
        background: accentBg,
        border: `1px solid ${isActive ? "var(--coral)" : accentBorder}`,
        borderRadius: 7,
        padding: "0.5rem 0.85rem",
        display: "flex",
        alignItems: "center",
        gap: "0.4rem",
        flexShrink: 0,
        boxShadow: isActive
          ? "0 0 0 3px rgba(255,92,53,0.18), 0 0 14px rgba(255,92,53,0.35)"
          : "none",
        transition: "border-color 0.4s ease, box-shadow 0.4s ease",
      }}
    >
      {isActive && (
        <span
          style={{
            position: "absolute",
            top: -4,
            right: -4,
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "var(--coral)",
            boxShadow: "0 0 6px rgba(255,92,53,0.85)",
          }}
        />
      )}
      <span style={{ fontSize: "0.875rem", color: isActive ? "var(--coral)" : iconColor }}>
        {icon}
      </span>
      <span
        style={{
          fontFamily: "var(--font-dm-mono), monospace",
          fontSize: "1rem",
          color: textColor,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
    </div>
  );
}

const wfArrow = (
  <span style={{ color: "rgba(255,255,255,0.72)", fontSize: "1rem", flexShrink: 0 }}>
    →
  </span>
);

function ChiefOfStaffMockup() {
  const { ref, active } = useCardAnimation<HTMLDivElement>();
  const [step, setStep] = useState(0);
  const totalSteps = 7;

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setStep((s) => (s + 1) % totalSteps), 800);
    return () => clearInterval(id);
  }, [active]);

  const isStep = (i: number) => active && step === i;

  return (
    <div ref={ref} className="wf-card">
      <div className="wf-dotgrid" aria-hidden="true" />
      <div className="wf-card-inner">
        {/* header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.5rem",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-dm-mono), monospace",
              fontSize: "1rem",
              color: "var(--coral)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Founder&apos;s desk

          </span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontSize: "0.875rem",
              color: "#4ade80",
            }}
          >
            <span
              className="animate-pulse-dot"
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#4ade80",
                display: "inline-block",
              }}
            />
            Live
          </span>
        </div>

        {/* flow */}
        <div className="wf-flow">
          {/* row 1 */}
          <div className="wf-flow-row">
            {wfNode("▶", "Leadership sync", "rgba(255,92,53,0.22)", "rgba(255,92,53,0.4)", "rgba(255,255,255,0.9)", "var(--coral)", isStep(0))}
            {wfArrow}
            {wfNode("✦", "Claude notes", "rgba(255,255,255,0.07)", "rgba(255,255,255,0.1)", "rgba(255,255,255,0.72)", "rgba(255,255,255,0.72)", isStep(1))}
            {wfArrow}
            {wfNode("✳", "Owners + dates", "rgba(215,154,54,0.18)", "rgba(215,154,54,0.35)", "rgba(255,255,255,0.85)", "var(--amber)", isStep(2))}
          </div>

          {/* connector: branch from Enrich down into row 2 */}
          <div className="wf-elbow" />

          {/* row 2 */}
          <div className="wf-flow-row">
            {wfNode("⋯", "Follow-up nudges", "rgba(167,139,250,0.16)", "rgba(167,139,250,0.4)", "rgba(255,255,255,0.88)", "#C4B5FD", isStep(3))}
            {wfArrow}
            {wfNode("◎", "Board update draft", "rgba(255,255,255,0.07)", "rgba(255,255,255,0.1)", "rgba(255,255,255,0.72)", "rgba(255,255,255,0.72)", isStep(4))}
          </div>

          {/* connector: row 2 down into row 3 */}
          <div className="wf-elbow" />

          {/* row 3 */}
          <div className="wf-flow-row">
            {wfNode("□", "Founder review", "rgba(255,255,255,0.07)", "rgba(255,255,255,0.1)", "rgba(255,255,255,0.72)", "rgba(255,255,255,0.72)", isStep(5))}
            {wfArrow}
            {wfNode("✉", "Sent", "rgba(255,255,255,0.07)", "rgba(255,255,255,0.1)", "rgba(255,255,255,0.72)", "rgba(255,255,255,0.72)", isStep(6))}
          </div>
        </div>

        {/* status + tech stack */}
        <div
          style={{
            marginTop: "1.75rem",
            paddingTop: "1.25rem",
            borderTop: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div className="wf-status-row">
            <span>⏱ Runs after every leadership sync</span>
            <span style={{ color: "#4ade80" }}>✓ Founder signs off</span>
          </div>

          <div
            style={{
              marginTop: "0.9rem",
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap",
            }}
          >
            {["n8n", "Claude", "Notion", "Slack"].map((t) => (
              <span
                key={t}
                style={{
                  padding: "0.3rem 0.75rem",
                  borderRadius: 99,
                  background: "rgba(255,255,255,0.06)",
                  fontFamily: "var(--font-dm-mono), monospace",
                  fontSize: "0.875rem",
                  color: "rgba(255,255,255,0.72)",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── mockup: Ops Diagnostic plan card ─────────── */
function DiagnosticMockup() {
  const { ref, active } = useCardAnimation<HTMLDivElement>();
  const [row, setRow] = useState(0);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setRow((r) => (r + 1) % 3), 1333);
    return () => clearInterval(id);
  }, [active]);

  const rows = [
    { icon: "⏱", label: "Week 1", value: "Map how the work actually flows today" },
    { icon: "◎", label: "Week 2", value: "Find where it waits, breaks and leaks money" },
    { icon: "◈", label: "Day 14", value: "90-day ops plan + what to automate first" },
  ];

  return (
    <div
      ref={ref}
      style={{
        border: "1px solid var(--line)",
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: "var(--shadow-lg)",
        maxWidth: 460,
        marginLeft: "auto",
      }}
    >
      {/* amber header */}
      <div style={{ background: "var(--amber)", padding: "2rem 1.75rem", position: "relative" }}>
        <span className="meta-label" style={{ color: "#22332C" }}>
          Fixed scope · Fixed fee
        </span>
        <h4
          style={{
            fontFamily: "var(--font-playfair), serif",
            fontSize: "1.375rem",
            fontWeight: 600,
            color: "var(--ink)",
            lineHeight: 1.2,
            marginTop: "0.4rem",
            marginBottom: "0.3rem",
          }}
        >
          Ops Diagnostic
        </h4>
        <p
          style={{
            fontFamily: "var(--font-dm-sans), sans-serif",
            fontSize: "0.875rem",
            color: "var(--ink)",
          }}
        >
          Two weeks · remote or on-site
        </p>

        <div
          className="svc-anim-progress-track"
          style={{ position: "absolute", left: 0, right: 0, bottom: 0, background: "rgba(34,51,44,0.18)" }}
        >
          <div className={`svc-anim-progress-fill${active ? " is-active" : ""}`} />
        </div>
      </div>

      {/* body */}
      <div style={{ padding: "1.75rem", background: "#fff" }}>
        {rows.map((rowItem, i) => {
          const isActive = active && row === i;
          return (
            <div
              key={rowItem.label}
              style={{
                display: "flex",
                gap: "0.75rem",
                alignItems: "flex-start",
                marginBottom: "0.9rem",
              }}
            >
              <span
                style={{
                  color: "var(--amber)",
                  flexShrink: 0,
                  fontSize: "1rem",
                  marginTop: "0.1rem",
                  display: "inline-block",
                  transform: isActive ? "scale(1.3)" : "scale(1)",
                  transition: "transform 0.4s ease",
                }}
              >
                {rowItem.icon}
              </span>
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-dm-mono), monospace",
                    fontSize: "0.875rem",
                    color: "var(--muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: "0.1rem",
                  }}
                >
                  {rowItem.label}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-dm-sans), sans-serif",
                    fontSize: "0.875rem",
                    color: "var(--ink)",
                    lineHeight: 1.4,
                  }}
                >
                  {rowItem.value}
                </p>
              </div>
            </div>
          );
        })}

        <div
          style={{
            marginTop: "0.5rem",
            background: "var(--amber)",
            borderRadius: 8,
            padding: "0.8rem",
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontWeight: 600,
              fontSize: "1rem",
              color: "var(--ink)",
            }}
          >
            Start with a diagnostic →
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── engagement detail: 30/90 days, cadence, price, automation layer ── */
type EngagementFacts = {
  first30: string;
  by90: string;
  cadence: string;
  price: string;
  automation: string;
};

function EngagementFacts({ color, facts }: { color: string; facts: EngagementFacts }) {
  const rows = [
    { label: "First 30 days", value: facts.first30 },
    { label: "By day 90", value: facts.by90 },
    { label: "Cadence", value: facts.cadence },
    { label: "Pricing", value: facts.price },
  ];
  return (
    <AnimateIn delay={200}>
      <div className="svc-facts">
        <dl className="svc-facts-grid">
          {rows.map((r) => (
            <div key={r.label} className="svc-facts-row">
              <dt className="meta-label" style={{ color }}>{r.label}</dt>
              <dd>{r.value}</dd>
            </div>
          ))}
        </dl>
        <p className="svc-facts-ai">
          <span className="svc-facts-ai-tag" style={{ color, borderColor: color }}>
            Automation layer
          </span>
          {facts.automation}
        </p>
      </div>
    </AnimateIn>
  );
}

const COMPARE = [
  {
    id: "fractional-coo",
    title: "Fractional COO",
    color: "var(--coral)",
    points: [
      "You need someone to own operations, not advise on them.",
      "The business has outgrown the founder running it from memory.",
      "Costs, hiring and process are all moving at once.",
      "Reports to the CEO. Sits in the leadership team.",
    ],
  },
  {
    id: "chief-of-staff",
    title: "Chief of Staff",
    color: "var(--ink)",
    points: [
      "The founder is the bottleneck, not the operation.",
      "Decisions get made. Follow-through doesn't.",
      "Board updates, priorities and meetings eat the week.",
      "Works for the founder. Extends their reach.",
    ],
  },
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "What does fractional actually mean here?",
    a: "One to two days a week, inside your team. Same Slack, same meetings, same accountability as a full-time hire. You get ten years of ops experience at a fraction of a full-time COO salary, and no recruiting cycle.",
  },
  {
    q: "COO or Chief of Staff. I can't tell which I need.",
    a: "If the operation is the problem, COO. If the founder's week is the problem, Chief of Staff. If you can't tell, start with the Ops Diagnostic. Two weeks in, the answer is usually obvious.",
  },
  {
    q: "Where does the AI part come in?",
    a: "After the process is clear, never before. Once a weekly report, a handoff or a follow-up runs the same way three times, it gets automated. I design it on n8n and the Claude API. You keep the systems when I leave.",
  },
  {
    q: "What does it cost?",
    a: "The Ops Diagnostic is $3,500, fixed, and credited against the first month if we carry on. COO and Chief of Staff work is a monthly retainer scoped to your stage and days per week, quoted once the Diagnostic shows what the job actually is. A single 60-minute session is $140 if you just need a second brain on something.",
  },
  {
    q: "How long do engagements run?",
    a: "Most run three to six months. The goal is to install the operating system, automate what repeats, and hand it to someone on your team. Not to become a permanent line item.",
  },
  {
    q: "What's your background?",
    a: "Ten years in operations at S&P Global, Careem, Motive, Bolt and Wise. At Bolt I took courier costs from 21% to 14% of GMV across 20 countries. At Wise, month-end close went from 8 days to 3. ACCA-qualified. Independent since 2025.",
  },
];

/* ─── page ────────────────────────────────────────── */
export default function Services() {
  const [active, setActive] = useState(SERVICE_IDS[0]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const heroTextureRef = useParallax<HTMLDivElement>(0.1);
  const heroFadeRef = useScrollFadeOut<HTMLDivElement>(380);

  useEffect(() => {
    const onScroll = () => {
      for (let i = SERVICE_IDS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SERVICE_IDS[i]);
        if (el && el.getBoundingClientRect().top <= 160) {
          setActive(SERVICE_IDS[i]);
          return;
        }
      }
      setActive(SERVICE_IDS[0]);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{`
        .svc-facts {
          border-top: 1px solid var(--line);
          padding-top: 1.5rem;
          margin: 0 0 2rem;
          max-width: 520px;
        }
        .svc-facts-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem 2rem;
          margin: 0 0 1.5rem;
        }
        .svc-facts-row dt { margin-bottom: 0.35rem; }
        .svc-facts-row dd {
          margin: 0;
          font-size: 0.95rem;
          line-height: 1.55;
          color: var(--ink);
        }
        .svc-facts-ai {
          font-size: 0.95rem;
          line-height: 1.6;
          color: var(--body);
          background: var(--paper);
          border: 1px solid var(--line);
          border-radius: 12px;
          padding: 1rem 1.15rem;
          margin: 0;
        }
        .svc-facts-ai-tag {
          display: inline-block;
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border: 1px solid;
          border-radius: 999px;
          padding: 2px 10px;
          margin-right: 0.6rem;
          vertical-align: 2px;
        }
        .svc-compare {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--grid-gap);
          margin-top: var(--heading-gap);
        }
        .svc-compare-card {
          background: #fff;
          border: 1px solid var(--line);
          border-radius: var(--radius-card);
          padding: var(--card-pad);
          display: flex;
          flex-direction: column;
          gap: 1rem;
          transition: transform 0.25s var(--ease), box-shadow 0.25s var(--ease);
        }
        .svc-compare-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
        .svc-compare-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--ink);
          margin: 0;
        }
        .svc-compare-list { list-style: none; padding: 0; margin: 0; flex: 1; }
        .svc-compare-link {
          font-weight: 600;
          font-size: 0.95rem;
          text-decoration: none;
        }
        .svc-compare-link:hover { text-decoration: underline; }
        .svc-compare-note {
          text-align: center;
          margin: 2rem auto 0;
          max-width: 56ch;
          color: var(--body);
        }
        .svc-compare-note a { color: var(--coral); font-weight: 600; text-decoration: none; }
        .svc-compare-note a:hover { text-decoration: underline; }
        .svc-advisory {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          flex-wrap: wrap;
          background: var(--cream);
          border: 1px solid var(--line);
          border-radius: 24px;
          padding: 36px 44px;
        }
        .svc-advisory h3 { margin: 0.5rem 0 0.4rem; color: var(--ink); }
        .svc-advisory p { margin: 0; max-width: 52ch; color: var(--body); }
        .svc-advisory-price {
          display: flex;
          align-items: baseline;
          gap: 6px;
          font-size: 2.5rem;
          font-weight: 500;
          color: var(--ink);
        }
        .svc-advisory-price span {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.9rem;
          color: var(--muted);
        }
        .svc-faq { max-width: 760px; margin: var(--heading-gap) auto 0; display: flex; flex-direction: column; gap: 12px; }
        .svc-faq-item {
          background: #fff;
          border: 1px solid var(--line);
          border-radius: 12px;
          overflow: hidden;
          transition: border-color 0.18s ease, box-shadow 0.18s ease;
        }
        .svc-faq-item:hover { border-color: rgba(255,92,53,0.4); }
        .svc-faq-item.is-open { border-color: var(--coral); box-shadow: 0 8px 22px rgba(255,92,53,0.1); }
        .svc-faq-q {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          padding: 20px 24px;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          font: inherit;
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--ink);
        }
        .svc-faq-q:focus-visible { outline: 2px solid var(--coral); outline-offset: -2px; }
        .svc-faq-sign { color: var(--coral); font-size: 1.4rem; line-height: 1; flex-shrink: 0; transition: transform 0.2s ease; }
        .svc-faq-item.is-open .svc-faq-sign { transform: rotate(45deg); }
        .svc-faq-a-wrap { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.25s ease; }
        .svc-faq-item.is-open .svc-faq-a-wrap { grid-template-rows: 1fr; }
        .svc-faq-a { overflow: hidden; min-height: 0; margin: 0; padding: 0 24px; color: var(--body); line-height: 1.65; }
        .svc-faq-item.is-open .svc-faq-a { padding-bottom: 20px; }
        @media (max-width: 768px) {
          .svc-compare { grid-template-columns: 1fr; }
          .svc-facts-grid { grid-template-columns: 1fr; }
          .svc-advisory { padding: 28px 24px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .svc-faq-a-wrap, .svc-faq-sign, .svc-compare-card { transition: none !important; }
        }
      `}</style>

      {/* HERO */}
      <section className="svc-hero-section" style={{ background: "var(--cream)" }}>
        <div className="svc-hero-texture svc-hero-texture--strong" ref={heroTextureRef} data-parallax />
        <div className="max-w-site">
          <div className="svc-hero-inner" ref={heroFadeRef}>
            {/* left: text + pills */}
            <div>
              <AnimateIn delay={60}>
                <h1 className="svc-hero-title">Work with Riz.</h1>
              </AnimateIn>
              <AnimateIn delay={150}>
                <p className="svc-body" style={{ ...bodyStyle, marginTop: "1.25rem" }}>
                  Three ways in. Each one ends the same way: an operation that runs
                  without the founder holding it together, and the repeat work automated.
                </p>
              </AnimateIn>
              <AnimateIn delay={240}>
                <div className="svc-tabs">
                  {[
                    { label: "Fractional COO", id: "fractional-coo" },
                    { label: "Chief of Staff", id: "chief-of-staff" },
                    { label: "Ops Diagnostic", id: "ops-diagnostic" },
                  ].map((pill) => (
                    <a
                      key={pill.id}
                      href={`#${pill.id}`}
                      className={`svc-tab${active === pill.id ? " active" : ""}`}
                    >
                      {pill.label}
                    </a>
                  ))}
                </div>
              </AnimateIn>
            </div>

            {/* right: hub diagram SVG */}
            <div className="svc-hero-diagram">
              <AnimateIn delay={300}>
                <ServicesHubDiagram />
              </AnimateIn>
            </div>
          </div>
        </div>
      </section>

      {sectionDivider}

      {/* FRACTIONAL COO */}
      <section
        id="fractional-coo"
        className="svc-section"
        style={{ background: "#fff", scrollMarginTop: 96 }}
      >
        <div className="max-w-site">
          <div className="svc-row">
            <div className="svc-row-text">
              <AnimateIn>
                <p className="svc-subline" style={sublineStyle("var(--coral)")}>Fractional COO.</p>
              </AnimateIn>
              <AnimateIn delay={100}>
                <p className="svc-body" style={bodyStyle}>
                  For founders whose company has outgrown being run from their head.
                  Usually 10 to 50 people, post-funding, everything moving at once.
                  I own operations. Not advise on them. Own them.
                </p>
              </AnimateIn>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem" }}>
                {[
                  "Operating cadence: leadership sync, weekly metrics, quarterly plans",
                  "The KPI tree, and a dashboard people actually open",
                  "Cost and unit economics, line by line",
                  "Process and SOPs for the handoffs that keep breaking",
                  "Hiring ops: roles, onboarding, who owns what",
                ].map((b, i) => checkBullet("var(--coral)", b, i))}
              </ul>
              <EngagementFacts
                color="var(--coral)"
                facts={{
                  first30: "Map the operation, set the weekly rhythm, fix the two things hurting most.",
                  by90: "Metrics trusted, owners clear, costs understood, the founder out of the weeds.",
                  cadence: "1–2 days a week, embedded in the leadership team.",
                  price: "Monthly retainer, scoped to your stage. Quoted after the Diagnostic.",
                  automation:
                    "Every process I install gets automated before I hand it over. Reporting, handoffs, follow-ups. Designed by me on n8n and Claude.",
                }}
              />
              <AnimateIn delay={260}>
                <CalBookingButton className="btn-coral">Book an intro call →</CalBookingButton>
              </AnimateIn>
            </div>

            <div className="svc-row-card">
              <AnimateIn delay={150}>
                <CooMockup />
              </AnimateIn>
            </div>
          </div>
        </div>
      </section>

      <div style={{ borderTop: "1.5px solid var(--coral)", opacity: 0.35 }} />

      {/* CHIEF OF STAFF */}
      <section
        id="chief-of-staff"
        className="svc-section"
        style={{ background: "var(--cream)", scrollMarginTop: 96 }}
      >
        <div className="max-w-site">
          <div className="svc-row">
            <div className="svc-row-text">
              <AnimateIn>
                <p className="svc-subline" style={sublineStyle("var(--ink)")}>Chief of Staff.</p>
              </AnimateIn>
              <AnimateIn delay={100}>
                <p className="svc-body" style={bodyStyle}>
                  For founders who are the bottleneck. Decisions get made in meetings
                  and die in Slack. The board update is always late. Every question
                  still routes through you.
                </p>
              </AnimateIn>
              <AnimateIn delay={140}>
                <p className="svc-body" style={bodyStyle}>
                  I work for the founder. Extend your reach. Make sure what you decide
                  actually happens.
                </p>
              </AnimateIn>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem" }}>
                {[
                  "Priorities for the quarter, and the discipline to hold them",
                  "Leadership meetings that end with owners and dates",
                  "Board and investor updates, drafted and on time",
                  "Cross-team follow-through, chased so you don't have to",
                  "Special projects: fundraise prep, launches, reorgs",
                ].map((b, i) => checkBullet("var(--ink)", b, i))}
              </ul>
              <EngagementFacts
                color="var(--ink)"
                facts={{
                  first30: "Audit your week. Cut what shouldn't reach you. Set the meeting rhythm.",
                  by90: "Board updates on autopilot, decisions tracked, your calendar back.",
                  cadence: "1–2 days a week, plus async on Slack.",
                  price: "Monthly retainer, scoped to your stage. Quoted after the Diagnostic.",
                  automation:
                    "Meeting notes to actions, actions to owners, nudges until done, board update drafted from live numbers. You review. The system does the chasing.",
                }}
              />
              <AnimateIn delay={260}>
                <CalBookingButton
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    minHeight: 52,
                    padding: "0.75rem 1.75rem",
                    borderRadius: 8,
                    background: "var(--ink)",
                    color: "#fff",
                    fontFamily: "var(--font-dm-sans), sans-serif",
                    fontWeight: 600,
                    fontSize: "1rem",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Book an intro call →
                </CalBookingButton>
              </AnimateIn>
            </div>

            <div className="svc-row-card">
              <AnimateIn delay={150}>
                <ChiefOfStaffMockup />
              </AnimateIn>
            </div>
          </div>
        </div>
      </section>

      {sectionDivider}

      {/* OPS DIAGNOSTIC */}
      <section
        id="ops-diagnostic"
        className="svc-section"
        style={{ background: "#fff", scrollMarginTop: 96 }}
      >
        <div className="max-w-site">
          <div className="svc-row">
            <div className="svc-row-text">
              <AnimateIn>
                <p className="svc-subline" style={sublineStyle("var(--amber)")}>Ops Diagnostic.</p>
              </AnimateIn>
              <AnimateIn delay={100}>
                <p className="svc-body" style={bodyStyle}>
                  For founders who know something is off and can&apos;t name it yet.
                  Two weeks. Fixed scope. The cheapest way to find out what you
                  actually need, including whether you need me at all.
                </p>
              </AnimateIn>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem" }}>
                {[
                  "Interviews with the founder and team leads",
                  "A map of how work actually moves, not the org chart version",
                  "Where it waits, where it breaks, what it costs",
                  "A prioritised 90-day ops plan",
                  "The list of what to automate first, and what not to",
                ].map((b, i) => checkBullet("var(--amber)", b, i))}
              </ul>
              <EngagementFacts
                color="var(--amber)"
                facts={{
                  first30: "Day 1–14: interviews, mapping, the diagnosis. Day 14: the plan, walked through live.",
                  by90: "You run the plan yourself, or I run it with you as COO or Chief of Staff.",
                  cadence: "Two weeks, fixed scope. Remote or on-site.",
                  price: "$3,500 fixed. Credited against month one if we continue.",
                  automation:
                    "Every bottleneck gets a verdict: fix by hand, automate, or leave alone. The automate list is scoped well enough to build straight away.",
                }}
              />
              <AnimateIn delay={260}>
                <CalBookingButton
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    minHeight: 52,
                    padding: "0.75rem 1.75rem",
                    borderRadius: 8,
                    background: "var(--amber)",
                    color: "var(--ink)",
                    fontFamily: "var(--font-dm-sans), sans-serif",
                    fontWeight: 600,
                    fontSize: "1rem",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Start with a diagnostic →
                </CalBookingButton>
              </AnimateIn>
            </div>

            <div className="svc-row-card">
              <AnimateIn delay={150}>
                <DiagnosticMockup />
              </AnimateIn>
            </div>
          </div>
        </div>
      </section>

      {sectionDivider}

      {/* WHICH DO YOU NEED */}
      <section className="section-pad" style={{ background: "var(--paper)" }}>
        <div className="max-w-site">
          <div className="block-head is-center">
            <span className="pill-eyebrow">Which one</span>
            <h2 className="block-title">
              Fractional COO or Chief of Staff?{" "}
              <span className="text-ramp">Which do you need?</span>
            </h2>
          </div>
          <div className="svc-compare">
            {COMPARE.map((c, ci) => (
              <AnimateIn key={c.id} delay={ci * 120}>
                <div className="svc-compare-card">
                  <h3 className="svc-compare-title" style={{ color: c.color }}>{c.title}</h3>
                  <ul className="svc-compare-list">
                    {c.points.map((p, i) => checkBullet(c.color, p, i))}
                  </ul>
                  <a href={`#${c.id}`} className="svc-compare-link" style={{ color: c.color }}>
                    See how it works →
                  </a>
                </div>
              </AnimateIn>
            ))}
          </div>
          <p className="svc-compare-note">
            Can&apos;t tell? That&apos;s normal. <a href="#ops-diagnostic">Start with the Ops Diagnostic</a>.
            Two weeks in, the answer is usually obvious.
          </p>
        </div>
      </section>

      {sectionDivider}

      {/* ADVISORY HOURS */}
      <section className="section-pad" style={{ background: "#fff" }}>
        <div className="max-w-site">
          <AnimateIn>
            <div className="svc-advisory">
              <div>
                <span className="pill-eyebrow">Advisory</span>
                <h3>Just need a second brain?</h3>
                <p>
                  An hour on a hiring plan, a cost problem, a messy process, or
                  what to automate first. No retainer, no commitment.
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 12 }}>
                <span className="meta-label">60 minutes</span>
                <span className="svc-advisory-price">$140<span>/session</span></span>
                <CalBookingButton className="btn-ghost">Book a session →</CalBookingButton>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {sectionDivider}

      {/* FAQ */}
      <section className="section-pad" style={{ background: "var(--cream)" }}>
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

      {sectionDivider}

      {/* BOTTOM CTA - reused Direct Line component from the homepage */}
      <section className="section-pad" style={{ background: "#fff" }}>
        <div className="max-w-site">
          <AnimateIn>
            <DirectLineCTA />
          </AnimateIn>
        </div>
      </section>
    </>
  );
}
