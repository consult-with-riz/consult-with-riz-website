"use client";
import { useEffect, useRef, useState } from "react";
import AnimateIn from "@/components/AnimateIn";
import ServicesHubDiagram from "@/components/ServicesHubDiagram";
import CalBookingButton from "@/components/CalModal";
import { useParallax, useScrollFadeOut } from "@/hooks/useParallax";

const SERVICE_IDS = ["ops-diagnostic", "fractional-coo", "session"];

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

type Step = { icon: string; label: string; value: string };

function StepsMockup({
  color,
  ink = "var(--ink)",
  eyebrow,
  title,
  sub,
  rows,
  cta,
}: {
  color: string;
  ink?: string;
  eyebrow: string;
  title: string;
  sub: string;
  rows: Step[];
  cta: string;
}) {
  const { ref, active } = useCardAnimation<HTMLDivElement>();
  const [row, setRow] = useState(0);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setRow((r) => (r + 1) % rows.length), 1333);
    return () => clearInterval(id);
  }, [active, rows.length]);


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
      {/* coloured header */}
      <div style={{ background: color, padding: "2rem 1.75rem", position: "relative" }}>
        <span className="meta-label" style={{ color: ink }}>
          {eyebrow}
        </span>
        <h4
          style={{
            fontFamily: "var(--font-playfair), serif",
            fontSize: "1.375rem",
            fontWeight: 600,
            color: ink,
            lineHeight: 1.2,
            marginTop: "0.4rem",
            marginBottom: "0.3rem",
          }}
        >
          {title}
        </h4>
        <p
          style={{
            fontFamily: "var(--font-dm-sans), sans-serif",
            fontSize: "0.875rem",
            color: ink,
          }}
        >
          {sub}
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
                  color,
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

        <CalBookingButton className="btn-coral" style={{ width: "100%", marginTop: "0.5rem" }}>
          {cta}
        </CalBookingButton>
      </div>
    </div>
  );
}

function DiagnosticMockup() {
  return (
    <StepsMockup
      color="var(--coral)"
      ink="#fff"
      eyebrow="Fixed scope · Fixed fee"
      title="Ops Diagnostic"
      sub="Two weeks · remote or on-site"
      rows={[
        { icon: "⏱", label: "Week 1", value: "Map how the work actually flows today" },
        { icon: "◎", label: "Week 2", value: "Find where it waits, breaks and leaks money" },
        { icon: "◈", label: "Day 14", value: "90-day ops plan + what to automate first" },
      ]}
      cta="Start with a diagnostic →"
    />
  );
}

const FAQ: { q: string; a: string }[] = [
  {
    q: "Why start with the Diagnostic?",
    a: "Because most founders can name the symptom, not the problem. Two weeks inside the business tells us whether you need a six-week fix, an ongoing COO or Chief of Staff, or neither. If it's neither, you still leave with the 90-day plan.",
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
        /* Page rhythm. The default 112px section padding plus the 70vh hero
           left a screen of empty cream on desktop; these keep the same
           structure at a tighter pace. */
        .svc-hero-section { min-height: 0; padding: 112px 0 48px; }
        .svc-hero-diagram { width: 100%; }
        .svc-hero-diagram > * { width: 100%; }
        .svc-section,
        .svc-tight { padding: 72px 0; }
        .svc-row { gap: 3rem; }
        @media (max-width: 767px) {
          .svc-hero-section { padding: 96px 0 32px; }
          .svc-section,
          .svc-tight { padding: 48px 0; }
        }
        .svc-step {
          display: block;
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }
        .svc-price-line {
          margin: 0 0 1.5rem;
          color: var(--body);
          font-size: 1rem;
        }
        .svc-price-line strong { color: var(--ink); font-size: 1.35rem; font-weight: 600; margin-right: 4px; }
        .svc-shapes {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          max-width: 520px;
          margin-bottom: 1rem;
        }
        .svc-shape {
          background: #fff;
          border: 1px solid var(--line);
          border-radius: 14px;
          padding: 16px 18px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .svc-shape-name { font-weight: 600; color: var(--ink); }
        .svc-shape-body { font-size: 0.9rem; line-height: 1.5; color: var(--body); }
        .svc-bench-line {
          margin: 2rem 0 0;
          padding-top: 1.5rem;
          border-top: 1px solid var(--line-2);
          color: var(--body);
          max-width: 70ch;
        }
        .svc-bench-line strong { color: var(--ink); font-weight: 600; }
        @media (max-width: 520px) {
          .svc-shapes { grid-template-columns: 1fr; }
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
          .svc-advisory { padding: 28px 24px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .svc-faq-a-wrap, .svc-faq-sign { transition: none !important; }
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
                  Three steps. You only choose the first. Most founders start with
                  the Diagnostic, and it tells us what the job actually is.
                </p>
              </AnimateIn>
              <AnimateIn delay={240}>
                <div className="svc-tabs">
                  {[
                    { label: "Ops Diagnostic", id: "ops-diagnostic" },
                    { label: "Fractional COO / CoS", id: "fractional-coo" },
                    { label: "1:1 session", id: "session" },
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

      {/* 01 · OPS DIAGNOSTIC */}
      <section
        id="ops-diagnostic"
        className="svc-section"
        style={{ background: "#fff", scrollMarginTop: 96 }}
      >
        <div className="max-w-site">
          <div className="svc-row">
            <div className="svc-row-text">
              <AnimateIn>
                <span className="svc-step" style={{ color: "var(--coral)" }}>01 · Start here</span>
                <p className="svc-subline" style={sublineStyle("var(--coral)")}>Ops Diagnostic.</p>
              </AnimateIn>
              <AnimateIn delay={100}>
                <p className="svc-body" style={bodyStyle}>
                  Two weeks inside the business. I find where work waits, breaks and
                  leaks money, and hand you a 90-day plan to fix it, including what to
                  automate first and what to leave alone.
                </p>
              </AnimateIn>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem" }}>
                {[
                  "Interviews with the founder and team leads",
                  "A map of how work actually moves",
                  "A prioritised 90-day plan, walked through live",
                ].map((b, i) => checkBullet("var(--coral)", b, i))}
              </ul>
              <AnimateIn delay={200}>
                <p className="svc-price-line">
                  <strong>$3,500</strong> fixed · credited against month one if we continue
                </p>
              </AnimateIn>
              <AnimateIn delay={260}>
<CalBookingButton className="btn-coral">Start with a diagnostic →</CalBookingButton>
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

      <div style={{ borderTop: "1.5px solid var(--coral)", opacity: 0.35 }} />

      {/* 02 · FRACTIONAL COO / CHIEF OF STAFF */}
      <section
        id="fractional-coo"
        className="svc-section"
        style={{ background: "var(--cream)", scrollMarginTop: 96 }}
      >
        <div className="max-w-site">
          <div className="svc-row">
            <div className="svc-row-text">
              <AnimateIn>
                <span className="svc-step" style={{ color: "var(--coral)" }}>02 · Then</span>
                <p className="svc-subline" style={sublineStyle("var(--coral)")}>
                  Fractional COO or Chief of Staff.
                </p>
              </AnimateIn>
              <AnimateIn delay={100}>
                <p className="svc-body" style={bodyStyle}>
                  I join the team and own the operation. COO when the operation is the
                  problem, Chief of Staff when your week is. Usually a bit of both.
                </p>
              </AnimateIn>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem" }}>
                {[
                  "Operating cadence and the metrics people trust",
                  "Cost, process and the handoffs that keep breaking",
                  "Priorities, board updates and follow-through",
                  "The repeat work automated before I hand it over",
                ].map((b, i) => checkBullet("var(--coral)", b, i))}
              </ul>
              <AnimateIn delay={200}>
                <div className="svc-shapes">
                  <div className="svc-shape">
                    <span className="svc-shape-name">Sprint</span>
                    <span className="svc-shape-body">One problem, six weeks, fixed and handed over.</span>
                  </div>
                  <div className="svc-shape">
                    <span className="svc-shape-name">Ongoing</span>
                    <span className="svc-shape-body">1–2 days a week inside your leadership team.</span>
                  </div>
                </div>
                <p className="svc-price-line">
                  Scoped to your stage. The Diagnostic tells us which shape.
                </p>
              </AnimateIn>
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

          <AnimateIn delay={120}>
            <p className="svc-bench-line">
              <strong>Need more than ops?</strong> I bring in a bench I trust for AI
              implementation, branding, marketing, content and websites. You still
              deal with me.
            </p>
          </AnimateIn>
        </div>
      </section>

      {sectionDivider}

      {/* 1:1 SESSION */}
      <section id="session" className="svc-tight" style={{ background: "#fff", scrollMarginTop: 96 }}>
        <div className="max-w-site">
          <AnimateIn>
            <div className="svc-advisory">
              <div>
                <span className="pill-eyebrow">Not ready yet?</span>
                <h3>Start with an hour.</h3>
                <p>
                  One problem, sixty minutes. You leave with a plan, whether or not
                  we work together.
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
      <section className="svc-tight" style={{ background: "var(--cream)" }}>
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
