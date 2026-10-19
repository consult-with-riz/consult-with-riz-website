"use client";
import { useEffect, useRef, useState } from "react";
import AnimateIn from "@/components/AnimateIn";
import CalBookingButton from "@/components/CalModal";
import HireComparison from "@/components/HireComparison";
import { testimonials, TestimonialDialog, type Testimonial } from "@/components/Testimonials";

/**
 * SERVICES — the founder's 90 days.
 *
 *   1. Hero: the promise, and the 90 days at a glance.
 *   2. The menu: the three ways in, side by side, so price and scope are
 *      visible together.
 *   3. The path: one timeline in the order it actually happens. A coral
 *      line fills as you scroll; each stop carries one real figure from the
 *      CV and a client quote that opens the full testimonial.
 *   4. The guarantee, then fractional vs a full-time COO, then the FAQ.
 *
 * The stop ids (fit-call, ops-diagnostic, fractional-coo) are linked from
 * the footer, the homepage and llms.txt, so keep them.
 */

/* ─── data ───────────────────────────────────────── */

type Stop = {
  id: string;
  day: string;
  title: string;
  price: string;
  priceNote?: string;
  body: string;
  items: { label?: string; text: string }[];
  proof: { figure: string; text: string };
  /** a line lifted verbatim from that client's testimonial */
  quote: { text: string; testimonialId: string };
  cta?: string;
};

const STOPS: Stop[] = [
  {
    id: "fit-call",
    day: "Day 0",
    title: "Free fit call.",
    price: "Free",
    priceNote: "30 minutes",
    body: "Your questions, and a straight answer on whether the Diagnostic makes sense for you. No pitch.",
    items: [
      { text: "Where the operation is costing you time right now" },
      { text: "Whether you need a COO, a Chief of Staff, or neither" },
      { text: "A clear yes or no on the next step" },
    ],
    proof: { figure: "3 min → 20s", text: "Emergency dispatch time at Careem" },
    quote: {
      text: "Hiring Rizwan was one of the best decisions we made for our operations.",
      testimonialId: "kaitlin-malaspina",
    },
    cta: "Book a free 30-min fit call →",
  },
  {
    id: "ops-diagnostic",
    day: "Days 1–14",
    title: "Ops & AI Diagnostic.",
    price: "$1,500",
    priceNote: "fixed · credited against month one",
    body: "Two weeks inside the business. I find where work waits, breaks and leaks money, and hand you a 90-day plan to fix it, including what to automate first and what to leave alone.",
    items: [
      { label: "Week 1", text: "Interviews with the founder and team leads. A map of how work actually moves." },
      { label: "Week 2", text: "Where it waits, breaks and leaks money, priced and ranked." },
      { label: "Day 14", text: "A prioritised 90-day plan and an automation shortlist, walked through live." },
    ],
    proof: { figure: "8 → 3 days", text: "Month-end close at Wise" },
    quote: {
      text: "He brought in a level of structure, clarity, and confidence that I didn’t realize we were missing.",
      testimonialId: "biola-babawale",
    },
    cta: "Start with a diagnostic →",
  },
  {
    id: "fractional-coo",
    day: "Days 15–90",
    title: "Fractional COO or Chief of Staff.",
    price: "Scoped",
    priceNote: "to your stage · the Diagnostic decides the shape",
    body: "I join the team and own the operation. COO when the operation is the problem, Chief of Staff when your week is. Usually a bit of both.",
    items: [
      { text: "Operating cadence and the metrics people trust" },
      { text: "Cost, process and the handoffs that keep breaking" },
      { text: "Priorities, board updates and follow-through" },
      { text: "The repeat work automated before I hand it over" },
    ],
    proof: { figure: "$3.9M", text: "Saved at Bolt, courier costs cut from 21% to 14% of GMV" },
    quote: {
      text: "Riz gets things done. If you're a founder with more priorities than people, he's the person you want next to you.",
      testimonialId: "brian-portnoy",
    },
    cta: "Book an intro call →",
  },
  {
    id: "handover",
    day: "Day 90",
    title: "You're out of day-to-day ops.",
    price: "Yours",
    priceNote: "everything stays when I step back",
    body: "The operation runs without you in every thread. You keep the cadence, the metrics and the automations, and a team that knows why each one exists.",
    items: [
      { text: "The weekly cadence, run by your team" },
      { text: "Dashboards and metrics people actually check" },
      { text: "Automations on n8n and the Claude API, in your accounts" },
    ],
    proof: { figure: "~92%", text: "Straight-through reconciliation matching shipped at Wise" },
    quote: {
      text: "Riz has completely transformed the way I look at my business and how we operate day-to-day.",
      testimonialId: "biola-babawale",
    },
  },
];

type Shape = "sprint" | "ongoing";

const SHAPES: Record<Shape, { label: string; line: string; timeline: string; detail: string }> = {
  sprint: {
    label: "Sprint",
    line: "One problem, six weeks, fixed and handed over.",
    timeline: "6 weeks",
    detail: "Best when the Diagnostic finds one thing that's costing you most.",
  },
  ongoing: {
    label: "Ongoing",
    line: "10–30 hours a week inside your leadership team.",
    timeline: "Monthly",
    detail: "Best when the operation itself needs an owner, week in, week out.",
  },
};

const FAQ: { q: string; a: string }[] = [
  {
    q: "Why start with the Diagnostic?",
    a: "Because most founders can name the symptom, not the problem. Two weeks inside the business tells us whether you need a six-week fix, an ongoing COO or Chief of Staff, or neither. If it's neither, you still leave with the 90-day plan.",
  },
  {
    q: "What if the Diagnostic isn't worth it?",
    a: "Then you don't pay for it. If the Day 14 walkthrough isn't worth $1,500 to you, say so and I refund you in full. If we carry on working together, the $1,500 is credited against your first month.",
  },
  {
    q: "Who do you work with?",
    a: "Mostly operations-heavy Seed to Series B startups, roughly 10 to 90 people: lots of people, handoffs and moving parts. Marketplaces, logistics, fintech, B2B services with real delivery. Founder-led agencies and service businesses too, usually starting with the Diagnostic.",
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

/* ─── small pieces ───────────────────────────────── */

function Check() {
  return (
    <span className="sb-check" aria-hidden="true">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M2.5 6.2 5 8.5l4.5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function ShapeToggle({ shape, onChange }: { shape: Shape; onChange: (s: Shape) => void }) {
  return (
    <div className="sb-toggle" role="tablist" aria-label="Engagement shape">
      <span className={`sb-toggle-pill${shape === "ongoing" ? " is-right" : ""}`} aria-hidden="true" />
      {(Object.keys(SHAPES) as Shape[]).map((s) => (
        <button
          key={s}
          type="button"
          role="tab"
          aria-selected={shape === s}
          className={`sb-toggle-btn${shape === s ? " is-on" : ""}`}
          onClick={() => onChange(s)}
        >
          {SHAPES[s].label}
        </button>
      ))}
    </div>
  );
}

/* A pull quote on the path. The whole card is a button that opens the
   full testimonial in the same reading panel the homepage uses. */
function QuoteCard({ text, t, onOpen }: { text: string; t: Testimonial; onOpen: () => void }) {
  const [imgFailed, setImgFailed] = useState(false);
  return (
    <button type="button" className="sa-quote" onClick={onOpen} aria-haspopup="dialog">
      <span className="sa-quote-text">“{text}”</span>
      <span className="sa-quote-foot">
        <span className="sa-quote-avatar" style={{ background: t.accent }}>
          {t.image && !imgFailed ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={t.image} alt="" onError={() => setImgFailed(true)} />
          ) : (
            t.initials
          )}
        </span>
        <span className="sa-quote-who">
          <b>{t.name}</b>
          <small>{t.company}</small>
        </span>
        <span className="sa-quote-more">
          Read in full <span aria-hidden="true">→</span>
        </span>
      </span>
    </button>
  );
}

/* ─── the scroll-linked timeline ─────────────────────────────────────────
   Progress is written straight to a CSS variable on the list (no React
   render per scroll event), throttled to one update per animation frame.
   Only the "how many stops are lit" number goes through state, and only
   when it changes. Reduced motion: the line is drawn full, every stop lit. */
function useTimelineProgress(count: number) {
  const listRef = useRef<HTMLOListElement | null>(null);
  const [reached, setReached] = useState(0);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      list.style.setProperty("--fill", "1");
      setReached(count);
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = list.getBoundingClientRect();
      const marker = window.innerHeight * 0.55;
      const progress = Math.min(Math.max((marker - rect.top) / rect.height, 0), 1);
      list.style.setProperty("--fill", progress.toFixed(4));

      const nodes = list.querySelectorAll<HTMLElement>("[data-node]");
      let lit = 0;
      nodes.forEach((n) => {
        if (n.getBoundingClientRect().top + 11 <= marker) lit++;
      });
      setReached((prev) => (prev === lit ? prev : lit));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [count]);

  return { listRef, reached };
}

/* ─── page ────────────────────────────────────────── */

export default function Services() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [shape, setShape] = useState<Shape>("ongoing");
  const [openTestimonial, setOpenTestimonial] = useState<string | null>(null);
  const { listRef, reached } = useTimelineProgress(STOPS.length);
  const current = SHAPES[shape];

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

        /* ── 2 · the menu ── */
        .sb-menu { background: #fff; padding: 96px 0; border-top: 1px solid var(--line); }
        .sb-menu-head { text-align: center; margin-bottom: 56px; }
        .sb-menu-head h2 {
          margin: 0 auto; max-width: 18ch;
          font-size: clamp(2.3rem, 1.5rem + 2.8vw, 3.5rem); line-height: 1.04;
          letter-spacing: -0.02em; font-weight: 500; color: var(--ink);
        }
        .sb-menu-head h2 span { color: var(--coral); }
        .sb-menu-head p { margin: 1.1rem auto 0; max-width: 56ch; font-size: 1.1rem; line-height: 1.6; color: var(--body); }
        /* The three cards share one set of rows (subgrid): step, title, sub,
           price, time, ticks, extra, button. Each part lines up across the
           cards however many lines the title or sub runs to. */
        .sb-cards {
          display: grid; grid-template-columns: 1fr 1.08fr 1fr;
          grid-template-rows: repeat(8, auto); column-gap: 20px; row-gap: 0;
        }
        .sb-card-wrap { display: grid; grid-row: span 8; grid-template-rows: subgrid; }
        .sb-card-wrap > .sb-card { grid-row: span 8; display: grid; grid-template-rows: subgrid; }
        .sb-card {
          position: relative; width: 100%;
          background: #fff; border: 1px solid var(--line); border-radius: 22px;
          padding: 30px 28px 28px;
          box-shadow: var(--shadow);
          transition: transform 0.35s var(--ease), box-shadow 0.35s var(--ease);
        }
        .sb-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-lg); }

        /* the highlighted card: a coral gradient that slowly travels round its border */
        .sb-card.is-featured { border-color: transparent; box-shadow: 0 24px 60px rgba(255,92,53,0.16); isolation: isolate; background: transparent; }
        .sb-card.is-featured::before {
          content: ""; position: absolute; inset: -2px; border-radius: 24px; z-index: -1;
          background: linear-gradient(115deg, #ff5c35, #FFB199, #F4C95D, #ff5c35, #e8431b, #ff5c35);
          background-size: 300% 300%;
          animation: sb-glide 7s ease-in-out infinite;
        }
        .sb-card.is-featured::after {
          content: ""; position: absolute; inset: 0; border-radius: 22px; z-index: -1; background: #fff;
        }
        .sb-glow {
          position: absolute; inset: -18px -14px -26px; z-index: -2; border-radius: 40px; pointer-events: none;
          background: radial-gradient(closest-side, rgba(255,92,53,0.22), transparent);
          filter: blur(18px); animation: sb-breathe 5s ease-in-out infinite;
        }
        @keyframes sb-glide { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        @keyframes sb-breathe { 0%, 100% { opacity: 0.55; } 50% { opacity: 1; } }

        .sb-flag {
          position: absolute; top: -13px; left: 50%; transform: translateX(-50%);
          white-space: nowrap; padding: 6px 14px; border-radius: 999px;
          background: var(--coral); color: #fff; font-size: 12.5px; font-weight: 600; letter-spacing: 0.01em;
        }
        .sb-step {
          font-family: var(--font-geist-mono), monospace; font-size: 12px; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase; color: var(--coral);
        }
        .sb-card h3 { margin: 10px 0 6px; font-size: 1.45rem; line-height: 1.15; font-weight: 600; color: var(--ink); }
        .sb-card-sub { margin: 0; font-size: 0.95rem; line-height: 1.5; color: var(--body); }
        .sb-price { display: flex; align-items: baseline; gap: 8px; margin: 20px 0 4px; }
        .sb-price strong { font-size: 2.6rem; font-weight: 600; letter-spacing: -0.025em; line-height: 1; color: var(--ink); }
        .sb-price span { font-family: var(--font-geist-mono), monospace; font-size: 12.5px; letter-spacing: 0.04em; color: var(--muted); }
        .sb-time {
          display: inline-flex; align-items: center; gap: 8px; margin: 8px 0 18px;
          font-family: var(--font-geist-mono), monospace; font-size: 12.5px; color: var(--muted);
        }
        .sb-time i { width: 6px; height: 6px; border-radius: 50%; background: var(--coral); }
        .sb-extra { grid-row: 7; margin: 0 0 20px; align-self: start; }
        .sb-badge {
          display: flex; gap: 10px; align-items: flex-start;
          padding: 10px 12px; border-radius: 12px;
          background: var(--peach); color: var(--ink); font-size: 0.86rem; line-height: 1.45;
        }
        .sb-badge b { font-weight: 600; }
        .sb-badge svg { flex-shrink: 0; margin-top: 1px; color: var(--coral); }
        .sb-list { list-style: none; margin: 0 0 24px; padding: 18px 0 0; border-top: 1px solid var(--line); display: flex; flex-direction: column; gap: 11px; }
        .sb-list li { display: flex; gap: 10px; align-items: flex-start; font-size: 0.95rem; line-height: 1.45; color: var(--ink); }
        .sb-check {
          flex-shrink: 0; width: 20px; height: 20px; border-radius: 50%;
          display: inline-flex; align-items: center; justify-content: center;
          background: rgba(255,92,53,0.14); color: var(--coral); margin-top: 1px;
        }
        .sb-cta { grid-row: 8; align-self: end; }
        .sb-cta .btn-coral, .sb-cta .btn-ghost { width: 100%; }

        /* Sprint / Ongoing: a pill that slides under the chosen label */
        .sb-toggle {
          position: relative; display: grid; grid-template-columns: 1fr 1fr;
          margin: 0 0 12px; padding: 4px; border-radius: 999px;
          background: var(--cream); border: 1px solid var(--line);
        }
        .sb-toggle-pill {
          position: absolute; top: 4px; bottom: 4px; left: 4px; width: calc(50% - 4px);
          border-radius: 999px; background: var(--ink);
          transition: transform 0.38s cubic-bezier(.3,1.4,.5,1);
        }
        .sb-toggle-pill.is-right { transform: translateX(100%); }
        .sb-toggle-btn {
          position: relative; z-index: 1; border: 0; background: none; cursor: pointer;
          padding: 8px 0; font: inherit; font-size: 0.9rem; font-weight: 600; color: var(--muted);
          transition: color 0.25s ease;
        }
        .sb-toggle-btn.is-on { color: #fff; }
        .sb-toggle-btn:focus-visible { outline: 2px solid var(--coral); outline-offset: 2px; border-radius: 999px; }
        .sb-shape-line { margin: 0; font-size: 0.95rem; line-height: 1.5; color: var(--ink); }
        .sb-shape-line b { font-weight: 600; }
        .sb-shape-detail { margin: 4px 0 0; font-size: 0.86rem; line-height: 1.5; color: var(--muted); }
        .sb-swap { animation: sb-swap 0.35s var(--ease); }
        @keyframes sb-swap { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }

        /* ── 3 · the path ── */
        .sa-path { background: var(--cream); padding: 96px 0 72px; border-top: 1px solid var(--line); }
        .sa-path-head { margin-bottom: 56px; }
        .sa-list { --fill: 0; --rail-x: 23px; position: relative; list-style: none; margin: 0; padding: 0; }
        .sa-list::before, .sa-list::after {
          content: ""; position: absolute; left: calc(var(--rail-x) - 1.5px); top: 12px; bottom: 12px; width: 3px; border-radius: 3px;
        }
        .sa-list::before { background: var(--line); }
        .sa-list::after {
          background: linear-gradient(to bottom, #FFB199, var(--coral));
          transform: scaleY(var(--fill)); transform-origin: top;
        }
        .sa-stop { position: relative; padding: 0 0 72px 76px; }
        .sa-stop:last-child { padding-bottom: 0; }
        .sa-node {
          position: absolute; left: var(--rail-x); top: 2px; z-index: 1;
          width: 22px; height: 22px; border-radius: 50%; transform: translateX(-50%);
          background: var(--cream); border: 3px solid var(--line);
          transition: border-color 0.35s ease, background 0.35s ease, box-shadow 0.35s ease;
        }
        .sa-stop.is-lit .sa-node {
          border-color: var(--coral); background: var(--coral);
          box-shadow: 0 0 0 6px rgba(255,92,53,0.14);
        }
        .sa-stop-grid { display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr); gap: 32px 56px; align-items: start; }
        .sa-day {
          display: inline-block;
          font-family: var(--font-geist-mono), monospace; font-size: 13px; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted);
          transition: color 0.35s ease;
        }
        .sa-stop.is-lit .sa-day { color: var(--coral); }
        .sa-title { margin: 0.4rem 0 0; font-size: clamp(1.7rem, 1.2rem + 1.6vw, 2.5rem); font-weight: 500; line-height: 1.12; letter-spacing: -0.015em; color: var(--ink); }
        .sa-price { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; margin: 0.9rem 0 0; }
        .sa-price strong { font-size: 1.5rem; font-weight: 600; color: var(--ink); }
        .sa-price span { font-size: 0.95rem; color: var(--muted); }
        .sa-body { margin: 1rem 0 0; max-width: 56ch; font-size: 1.07rem; line-height: 1.7; color: var(--body); }
        .sa-items { list-style: none; margin: 1.25rem 0 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
        .sa-items li { display: flex; gap: 12px; align-items: baseline; font-size: 1rem; line-height: 1.55; color: var(--body); }
        .sa-items li::before {
          content: ""; flex-shrink: 0; width: 7px; height: 7px; border-radius: 50%;
          background: var(--coral); transform: translateY(-2px);
        }
        .sa-items li b {
          font-family: var(--font-geist-mono), monospace; font-size: 12px; font-weight: 600;
          letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink); margin-right: 6px;
        }
        .sa-stop-cta { margin-top: 1.75rem; }

        /* proof column: the figure, then the client's own words */
        .sa-proof { display: flex; flex-direction: column; gap: 14px; padding-top: 2.1rem; }
        .sa-chip {
          display: flex; align-items: center; gap: 16px;
          background: #fff; border: 1px solid var(--line); border-radius: 16px; padding: 18px 20px;
        }
        .sa-chip-fig { font-size: 1.85rem; font-weight: 600; line-height: 1; letter-spacing: -0.02em; color: var(--coral); white-space: nowrap; }
        .sa-chip-text { font-size: 0.92rem; line-height: 1.4; color: var(--ink); }

        /* the quote opens the full testimonial */
        .sa-quote {
          display: flex; flex-direction: column; gap: 14px; width: 100%;
          margin: 0; padding: 18px 20px; text-align: left; cursor: pointer;
          font: inherit; color: inherit;
          background: #fff; border: 0; border-left: 3px solid var(--coral);
          border-radius: 0 14px 14px 0; box-shadow: var(--shadow);
          transition: transform 0.25s var(--ease), box-shadow 0.25s var(--ease);
        }
        .sa-quote:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); }
        .sa-quote:focus-visible { outline: 2px solid var(--coral); outline-offset: 3px; }
        .sa-quote-text { font-size: 1rem; line-height: 1.55; color: var(--ink); }
        .sa-quote-foot { display: flex; align-items: center; gap: 10px; }
        .sa-quote-avatar {
          flex-shrink: 0; width: 36px; height: 36px; border-radius: 50%; overflow: hidden;
          display: inline-flex; align-items: center; justify-content: center;
          color: #fff; font-size: 12px; font-weight: 600;
        }
        .sa-quote-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .sa-quote-who { display: flex; flex-direction: column; min-width: 0; line-height: 1.3; }
        .sa-quote-who b { font-size: 0.9rem; font-weight: 600; color: var(--ink); }
        .sa-quote-who small { font-size: 0.8rem; color: var(--muted); }
        .sa-quote-more {
          margin-left: auto; flex-shrink: 0; white-space: nowrap;
          font-size: 0.82rem; font-weight: 600; color: var(--coral);
        }
        .sa-quote-more span { display: inline-block; transition: transform 0.25s ease; }
        .sa-quote:hover .sa-quote-more span { transform: translateX(3px); }

        /* the two shapes of the embed */
        .sa-shapes { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 1.25rem; max-width: 520px; }
        .sa-shape { border: 1px solid var(--line); border-radius: 14px; padding: 14px 16px; background: #fff; }
        .sa-shape b { display: block; color: var(--ink); font-weight: 600; }
        .sa-shape span { font-size: 0.9rem; line-height: 1.5; color: var(--body); }

        /* ── 4 · guarantee ── */
        .sa-guarantee-wrap { background: var(--cream); padding: 0 0 88px; scroll-margin-top: 96px; }
        .sa-guarantee {
          position: relative; overflow: hidden;
          display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 28px 48px; align-items: center;
          background: var(--ink); color: #fff; border-radius: 24px; padding: 48px 52px;
        }
        .sa-guarantee::after {
          content: ""; position: absolute; right: -80px; top: -80px; width: 280px; height: 280px; border-radius: 50%;
          background: radial-gradient(circle, rgba(255,92,53,0.35), transparent 70%); pointer-events: none;
        }
        .sa-g-eyebrow {
          font-family: var(--font-geist-mono), monospace; font-size: 12.5px; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase; color: #FFB199;
        }
        .sa-g-line { margin: 0.75rem 0 0; max-width: 30ch; font-size: clamp(1.6rem, 1.1rem + 1.7vw, 2.4rem); font-weight: 500; line-height: 1.18; letter-spacing: -0.015em; }
        .sa-g-line em { font-style: normal; color: var(--coral); }
        .sa-g-sub { margin: 1rem 0 0; max-width: 52ch; color: rgba(255,255,255,0.78); line-height: 1.6; }
        .sa-guarantee .btn-coral { position: relative; z-index: 1; }

        .sa-bench {
          margin: 56px 0 0; padding-top: 1.5rem; border-top: 1px solid var(--line);
          max-width: 70ch; color: var(--body); line-height: 1.65;
        }
        .sa-bench strong { color: var(--ink); font-weight: 600; }

        /* ── 6 · FAQ ── */
        .sa-faq-section { background: var(--cream); padding: 88px 0; border-top: 1px solid var(--line); }
        .svc-faq { max-width: 760px; margin: var(--heading-gap) auto 0; display: flex; flex-direction: column; gap: 12px; }
        .svc-faq-item { background: #fff; border: 1px solid var(--line); border-radius: 12px; overflow: hidden; transition: border-color 0.18s ease, box-shadow 0.18s ease; }
        .svc-faq-item:hover { border-color: rgba(255,92,53,0.4); }
        .svc-faq-item.is-open { border-color: var(--coral); box-shadow: 0 8px 22px rgba(255,92,53,0.1); }
        .svc-faq-q { width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 20px 24px; background: none; border: none; cursor: pointer; text-align: left; font: inherit; font-size: 1.05rem; font-weight: 600; color: var(--ink); }
        .svc-faq-q:focus-visible { outline: 2px solid var(--coral); outline-offset: -2px; }
        .svc-faq-sign { color: var(--coral); font-size: 1.4rem; line-height: 1; flex-shrink: 0; transition: transform 0.2s ease; }
        .svc-faq-item.is-open .svc-faq-sign { transform: rotate(45deg); }
        .svc-faq-a-wrap { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.25s ease; }
        .svc-faq-item.is-open .svc-faq-a-wrap { grid-template-rows: 1fr; }
        .svc-faq-a { overflow: hidden; min-height: 0; margin: 0; padding: 0 24px; color: var(--body); line-height: 1.65; }
        .svc-faq-item.is-open .svc-faq-a { padding-bottom: 20px; }

        @media (max-width: 1023px) {
          .sb-cards { display: flex; flex-direction: column; max-width: 520px; margin: 0 auto; gap: 28px; }
          .sb-card-wrap { display: flex; }
          .sb-card-wrap > .sb-card { display: flex; flex-direction: column; }
          .sb-cta { margin-top: auto; }
          /* on a stack, the card most founders want goes first */
          .sb-card-wrap.is-featured-wrap { order: -1; }
        }
        @media (max-width: 960px) {
          .sa-stop-grid { grid-template-columns: minmax(0, 1fr); gap: 0; }
          .sa-proof { padding-top: 1.5rem; }
          .sa-guarantee { grid-template-columns: minmax(0, 1fr); }
        }
        @media (max-width: 767px) {
          .sa-hero { padding: 104px 0 44px; }
          .sa-glance-bar { grid-template-columns: 1fr 1fr; row-gap: 18px; }
          .sb-menu { padding: 64px 0; }
          .sb-menu-head { margin-bottom: 40px; }
          .sb-card { padding: 28px 22px 24px; }
          .sa-path { padding: 64px 0 56px; }
          .sa-path-head { margin-bottom: 40px; }
          .sa-list { --rail-x: 11px; }
          .sa-stop { padding: 0 0 56px 40px; }
          .sa-node { width: 20px; height: 20px; }
          .sa-chip { padding: 16px; }
          .sa-chip-fig { font-size: 1.55rem; }
          .sa-quote-foot { flex-wrap: wrap; row-gap: 8px; }
          .sa-quote-more { flex-basis: 100%; margin-left: 46px; font-size: 0.8rem; }
          .sa-shapes { grid-template-columns: 1fr; }
          .sa-guarantee { padding: 32px 24px; border-radius: 20px; }
          .sa-guarantee-wrap { padding-bottom: 56px; }
          .sa-faq-section { padding: 56px 0; }
          .svc-faq-q { padding: 18px 18px; font-size: 1rem; }
          .svc-faq-a { padding: 0 18px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .sb-card, .sb-toggle-pill, .sa-quote, .sa-node, .sa-day, .sa-glance-seg > i, .svc-faq-a-wrap, .svc-faq-sign { transition: none !important; }
          .sb-card.is-featured::before, .sb-glow, .sb-swap { animation: none !important; }
          .sb-card:hover, .sa-quote:hover { transform: none; }
        }
      `}</style>

      {/* 1 · HERO */}
      <section className="sa-hero">
        <div className="max-w-site">
          <AnimateIn>
            <span className="pill-eyebrow">Fractional COO / Chief of Staff</span>
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
              <a href="#guarantee" className="sa-text-link">See the Diagnostic guarantee ↓</a>
            </div>
          </AnimateIn>

          <AnimateIn delay={320}>
            <nav className="sa-glance" aria-label="The 90 days at a glance">
              <div className="sa-glance-bar">
                {STOPS.map((s) => (
                  <a key={s.id} href={`#${s.id}`} className="sa-glance-seg">
                    <i aria-hidden="true" />
                    <span className="sa-glance-day">{s.day}</span>
                    <span className="sa-glance-name">{s.title.replace(/\.$/, "")}</span>
                  </a>
                ))}
              </div>
            </nav>
          </AnimateIn>
        </div>
      </section>

      {/* 2 · THE MENU */}
      <section className="sb-menu" id="menu">
        <div className="max-w-site">
          <div className="sb-menu-head">
            <AnimateIn>
              <h2>
                Work with Riz. <span>Pick your first step.</span>
              </h2>
            </AnimateIn>
            <AnimateIn delay={100}>
              <p>
                Three ways in. Most founders start in the middle.
              </p>
            </AnimateIn>
          </div>

          <div className="sb-cards">
            {/* 01 · free fit call */}
            <AnimateIn className="sb-card-wrap" delay={0}>
              <div className="sb-card">
                <span className="sb-step">01 · Talk</span>
                <h3>Free fit call</h3>
                <p className="sb-card-sub">A straight answer on whether the Diagnostic makes sense for you. No pitch.</p>
                <div className="sb-price">
                  <strong>Free</strong>
                </div>
                <span className="sb-time"><i />30 minutes</span>
                <ul className="sb-list">
                  {["Your questions, answered", "Where the operation is leaking", "Whether we're a fit, either way"].map((t) => (
                    <li key={t}><Check />{t}</li>
                  ))}
                </ul>
                <div className="sb-cta">
                  <CalBookingButton className="btn-ghost">Book a free call →</CalBookingButton>
                </div>
              </div>
            </AnimateIn>

            {/* 02 · diagnostic (featured) */}
            <AnimateIn className="sb-card-wrap is-featured-wrap" delay={120}>
              <div className="sb-card is-featured">
                <span className="sb-glow" aria-hidden="true" />
                <span className="sb-flag">Most founders start here</span>
                <span className="sb-step">02 · Diagnose</span>
                <h3>Ops &amp; AI Diagnostic</h3>
                <p className="sb-card-sub">Two weeks inside the business. Where work waits, breaks and leaks money, and a plan to fix it.</p>
                <div className="sb-price">
                  <strong>$1,500</strong>
                  <span>fixed</span>
                </div>
                <span className="sb-time"><i />2 weeks · remote or on-site</span>
                <ul className="sb-list">
                  {[
                    "Interviews with the founder and team leads",
                    "A map of how work actually moves",
                    "A prioritised 90-day plan, walked through live",
                    "What to automate first, and what to leave alone",
                  ].map((t) => (
                    <li key={t}><Check />{t}</li>
                  ))}
                </ul>
                <div className="sb-extra sb-badge">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M8 1.5 2.5 3.6v4c0 3.2 2.3 5.6 5.5 6.9 3.2-1.3 5.5-3.7 5.5-6.9v-4L8 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="m5.6 8 1.7 1.6 3.1-3.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span><b>Guaranteed.</b> Full refund if Day 14 isn&apos;t worth it. Credited to month one if we continue.</span>
                </div>
                <div className="sb-cta">
                  <CalBookingButton className="btn-coral">Start with a diagnostic →</CalBookingButton>
                </div>
              </div>
            </AnimateIn>

            {/* 03 · fractional COO / CoS */}
            <AnimateIn className="sb-card-wrap" delay={240}>
              <div className="sb-card">
                <span className="sb-step">03 · Embed</span>
                <h3>Fractional COO / Chief of Staff</h3>
                <p className="sb-card-sub">I join the team and own the operation. COO when the operation is the problem, Chief of Staff when your week is.</p>
                <div className="sb-price">
                  <strong>Scoped</strong>
                  <span>to your stage</span>
                </div>
                <span className="sb-time"><i />6-week sprint or ongoing</span>
                <ul className="sb-list">
                  {[
                    "Operating cadence and the metrics people trust",
                    "Cost, process and the handoffs that keep breaking",
                    "Priorities, board updates and follow-through",
                    "The repeat work automated before I hand it over",
                  ].map((t) => (
                    <li key={t}><Check />{t}</li>
                  ))}
                </ul>
                <div className="sb-extra">
                  <ShapeToggle shape={shape} onChange={setShape} />
                  <div key={shape} className="sb-swap" aria-live="polite">
                    <p className="sb-shape-line"><b>{current.timeline}.</b> {current.line}</p>
                    <p className="sb-shape-detail">{current.detail}</p>
                  </div>
                </div>
                <div className="sb-cta">
                  <CalBookingButton className="btn-ghost">Book an intro call →</CalBookingButton>
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* 3 · THE PATH */}
      <section className="sa-path">
        <div className="max-w-site">
          <div className="block-head sa-path-head">
            <span className="pill-eyebrow">How the 90 days run</span>
            <h2 className="block-title">One path. You decide at every stop.</h2>
          </div>

          <ol className="sa-list" ref={listRef}>
            {STOPS.map((s, i) => {
              const t = testimonials.find((x) => x.id === s.quote.testimonialId);
              return (
                <li
                  key={s.id}
                  id={s.id}
                  className={`sa-stop${i < reached ? " is-lit" : ""}`}
                  style={{ scrollMarginTop: 110 }}
                >
                  <span className="sa-node" data-node aria-hidden="true" />
                  <div className="sa-stop-grid">
                    <div>
                      <AnimateIn>
                        <span className="sa-day">{s.day}</span>
                        <h3 className="sa-title">{s.title}</h3>
                        <p className="sa-price">
                          <strong>{s.price}</strong>
                          {s.priceNote && <span>{s.priceNote}</span>}
                        </p>
                      </AnimateIn>
                      <AnimateIn delay={80}>
                        <p className="sa-body">{s.body}</p>
                        <ul className="sa-items">
                          {s.items.map((it) => (
                            <li key={it.text}>
                              <span>
                                {it.label && <b>{it.label}</b>}
                                {it.text}
                              </span>
                            </li>
                          ))}
                        </ul>
                        {s.id === "fractional-coo" && (
                          <div className="sa-shapes">
                            <div className="sa-shape">
                              <b>Sprint</b>
                              <span>One problem, six weeks, fixed and handed over.</span>
                            </div>
                            <div className="sa-shape">
                              <b>Ongoing</b>
                              <span>10–30 hours a week inside your leadership team.</span>
                            </div>
                          </div>
                        )}
                        {s.cta && (
                          <div className="sa-stop-cta">
                            <CalBookingButton className="btn-coral">{s.cta}</CalBookingButton>
                          </div>
                        )}
                      </AnimateIn>
                    </div>

                    <AnimateIn delay={160} className="sa-proof">
                      <div className="sa-chip">
                        <span className="sa-chip-fig">{s.proof.figure}</span>
                        <span className="sa-chip-text">{s.proof.text}</span>
                      </div>
                      {t && <QuoteCard text={s.quote.text} t={t} onOpen={() => setOpenTestimonial(t.id)} />}
                    </AnimateIn>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* 4 · GUARANTEE */}
      <section id="guarantee" className="sa-guarantee-wrap">
        <div className="max-w-site">
          <AnimateIn>
            <div className="sa-guarantee">
              <div>
                <span className="sa-g-eyebrow">The Diagnostic guarantee</span>
                <p className="sa-g-line">
                  If the Day 14 walkthrough isn&apos;t worth <em>$1,500</em> to you, I refund it in full.
                </p>
                <p className="sa-g-sub">
                  Say so and you get it back. And if we carry on working together, the $1,500
                  is credited against your first month.
                </p>
              </div>
              <CalBookingButton className="btn-coral">Start with a free fit call →</CalBookingButton>
            </div>
          </AnimateIn>

          <AnimateIn delay={100}>
            <p className="sa-bench">
              <strong>Need more than ops?</strong> I bring in a bench I trust for AI
              implementation, branding, marketing, content and websites. You still deal with me.
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* 5 · FRACTIONAL VS FULL-TIME */}
      <HireComparison />

      {/* 6 · FAQ */}
      <section className="sa-faq-section">
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

      <TestimonialDialog
        t={testimonials.find((x) => x.id === openTestimonial) ?? null}
        onClose={() => setOpenTestimonial(null)}
      />
    </>
  );
}
