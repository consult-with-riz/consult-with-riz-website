"use client";
import { useEffect, useRef, useState } from "react";

/**
 * "Fractional, or a full-time COO?" — told in two moves instead of a table.
 *
 *   1. The race to start: two lanes over six months. The fractional lane
 *      fills almost at once and is working by the end of week two; the
 *      full-time lane is still a striped "searching" bar for the first
 *      three to six months.
 *   2. Versus cards: what you get with Riz (coral, ticks pop in) against a
 *      full-time hire (muted, each line struck through as it arrives).
 *
 * Claims stay qualitative: no salary figures, only the 3–6 month search
 * the page already states. Everything animates once, on scroll into view;
 * with reduced motion it renders in its finished state.
 */

const VERSUS: { label: string; us: string; them: string }[] = [
  { label: "Commitment", us: "Scoped, month to month", them: "Permanent hire, plus equity" },
  { label: "Cost", us: "Part-time, scoped to your stage", them: "Full salary, plus equity" },
  { label: "Senior from day one", us: "Ten years at Bolt, Wise, Careem", them: "Depends on the hire" },
  { label: "Left behind", us: "Automations you keep", them: "Not usually" },
];

const MONTHS = ["Today", "M1", "M2", "M3", "M4", "M5", "M6"];

function useInView<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, inView };
}

export default function HireComparison() {
  const race = useInView<HTMLDivElement>();
  const vs = useInView<HTMLDivElement>();

  return (
    <section className="hc">
      <style>{`
        .hc { background: #fff; padding: 96px 0; border-top: 1px solid var(--line); overflow: hidden; }
        .hc-head { text-align: center; }
        .hc-lede { margin: 1rem auto 0; max-width: 54ch; font-size: 1.08rem; line-height: 1.6; color: var(--body); }

        /* ── 1 · the race to start ── */
        .hc-race {
          margin-top: var(--heading-gap);
          background: var(--cream); border: 1px solid var(--line); border-radius: 24px;
          padding: 32px 36px 28px;
        }
        .hc-race-title {
          margin: 0 0 22px; font-family: var(--font-geist-mono), monospace; font-size: 12px; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted);
        }
        .hc-grid { display: grid; grid-template-columns: 170px minmax(0, 1fr); column-gap: 20px; row-gap: 18px; align-items: center; }
        .hc-who { font-weight: 600; color: var(--ink); line-height: 1.3; }
        .hc-who small { display: block; font-weight: 400; font-size: 0.85rem; color: var(--muted); }
        .hc-who.is-us { color: var(--coral); }
        .hc-track { position: relative; height: 44px; border-radius: 12px; background: rgba(34,51,44,0.05); }
        /* faint month gridlines behind both lanes */
        .hc-track::before {
          content: ""; position: absolute; inset: 0; border-radius: 12px; pointer-events: none;
          background: repeating-linear-gradient(to right, transparent 0, transparent calc(100% / 6 - 1px), rgba(34,51,44,0.08) calc(100% / 6 - 1px), rgba(34,51,44,0.08) calc(100% / 6));
        }
        .hc-bar {
          position: absolute; top: 6px; bottom: 6px; border-radius: 8px;
          display: flex; align-items: center; padding: 0 12px; overflow: hidden;
          font-size: 0.82rem; font-weight: 600; white-space: nowrap;
          /* revealed with a left-to-right wipe, not a stretch, so each colour stays on its month */
          clip-path: inset(0 100% 0 0 round 8px);
        }
        .hc-race.is-in .hc-bar { clip-path: inset(0 0 0 0 round 8px); }
        .hc-bar > span { opacity: 0; transition: opacity 0.4s ease; }
        .hc-race.is-in .hc-bar > span { opacity: 1; }

        /* fractional: call, Diagnostic, then embedded, almost at once */
        .hc-bar.call { left: 0; width: 2.5%; background: linear-gradient(90deg, #FFC9B3, #FFB199); padding: 0; transition: clip-path 0.6s var(--ease) 0.2s; }
        .hc-bar.diag { left: 2.5%; width: 6%; background: linear-gradient(90deg, var(--coral), #D9381A); padding: 0; transition: clip-path 0.8s var(--ease) 0.7s; }
        .hc-bar.embed {
          left: 8.5%; right: 0; color: var(--ink);
          /* orange hands over to yellow, then green: the operation coming good */
          background: linear-gradient(90deg, #FCEBB0 0%, #F5C518 42%, #BDEBC8 64%, #16C45B 100%);
          transition: clip-path 3.2s cubic-bezier(.33,0,.2,1) 1.4s;
        }
        .hc-race.is-in .hc-bar.embed > span { transition: opacity 0.8s ease 2.6s; }
        /* full-time: a striped "searching" bar for months, fading out where the start date could land */
        .hc-bar.search {
          left: 0; width: 100%; color: var(--ink);
          background:
            repeating-linear-gradient(-45deg, rgba(34,51,44,0.14) 0 8px, rgba(34,51,44,0.05) 8px 16px);
          -webkit-mask-image: linear-gradient(90deg, #000 45%, rgba(0,0,0,0.35) 75%, transparent 100%);
                  mask-image: linear-gradient(90deg, #000 45%, rgba(0,0,0,0.35) 75%, transparent 100%);
          transition: clip-path 5s cubic-bezier(.25,.1,.25,1) 0.4s;
          background-size: 200% 100%;
        }
        .hc-race.is-in .hc-bar.search { animation: hc-crawl 1.6s linear infinite; }
        @keyframes hc-crawl { to { background-position: 45px 0; } }
        .hc-race.is-in .hc-bar.search > span { transition-delay: 0.8s; }

        /* the window where a full-time hire might actually start */
        .hc-window {
          position: absolute; top: -10px; bottom: -10px; left: 50%; width: 50%;
          border: 1.5px dashed rgba(34,51,44,0.35); border-radius: 12px; pointer-events: none;
          opacity: 0; transition: opacity 0.5s ease 2.2s;
        }
        .hc-race.is-in .hc-window { opacity: 1; }
        .hc-window b {
          position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
          font-size: 0.78rem; font-weight: 600; color: var(--ink); background: var(--cream);
          padding: 2px 8px; border-radius: 999px; white-space: nowrap;
        }
        .hc-flag {
          position: absolute; left: 2.5%; top: -30px; transform: translateX(-12px);
          font-size: 0.75rem; font-weight: 600; color: var(--coral); white-space: nowrap;
          opacity: 0; transition: opacity 0.5s ease 1.3s;
        }
        .hc-flag::after { content: ""; position: absolute; left: 12px; top: 100%; width: 1.5px; height: 12px; background: var(--coral); }
        .hc-race.is-in .hc-flag { opacity: 1; }
        .hc-axis { display: grid; grid-template-columns: repeat(6, 1fr) 0; margin-top: 2px; }
        .hc-axis span {
          font-family: var(--font-geist-mono), monospace; font-size: 11px; color: var(--muted);
          justify-self: start; transform: translateX(-50%); white-space: nowrap;
        }
        .hc-axis span:first-child { transform: none; }
        .hc-axis span:last-child { transform: translateX(-100%); }

        /* ── 2 · versus ── */
        .hc-vs { position: relative; display: grid; grid-template-columns: 1fr 1fr; gap: 28px; margin-top: 28px; }
        .hc-card { border-radius: 24px; padding: 30px 32px; }
        .hc-card.us {
          background: #fff; border: 1.5px solid var(--coral);
          box-shadow: 0 24px 60px rgba(255,92,53,0.14);
        }
        .hc-card.them { background: var(--cream); border: 1.5px dashed rgba(34,51,44,0.25); }
        .hc-card-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding-bottom: 18px; border-bottom: 1px solid var(--line); }
        .hc-card-head h3 { margin: 0; font-size: 1.3rem; font-weight: 600; color: var(--ink); }
        .hc-card.us .hc-card-head h3 { color: var(--coral); }
        .hc-tag {
          font-family: var(--font-geist-mono), monospace; font-size: 11px; font-weight: 600; letter-spacing: 0.1em;
          text-transform: uppercase; padding: 5px 10px; border-radius: 999px; white-space: nowrap;
        }
        .hc-card.us .hc-tag { background: var(--coral); color: #fff; }
        .hc-card.them .hc-tag { background: rgba(34,51,44,0.08); color: var(--muted); }
        .hc-rows { list-style: none; margin: 0; padding: 0; }
        .hc-rows li { display: grid; grid-template-columns: 26px minmax(0, 1fr); gap: 4px 12px; padding: 16px 0; border-bottom: 1px solid var(--line); }
        .hc-rows li:last-child { border-bottom: 0; padding-bottom: 0; }
        .hc-rows small {
          grid-column: 2; font-family: var(--font-geist-mono), monospace; font-size: 11px; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted);
        }
        .hc-mark {
          grid-row: span 2; align-self: center; width: 26px; height: 26px; border-radius: 50%;
          display: inline-flex; align-items: center; justify-content: center;
          transform: scale(0); transition: transform 0.45s cubic-bezier(.3,1.6,.5,1);
        }
        .hc-card.us .hc-mark { background: var(--coral); color: #fff; }
        .hc-card.them .hc-mark { background: rgba(34,51,44,0.1); color: var(--muted); }
        .hc-vs.is-in .hc-mark { transform: scale(1); }
        .hc-val { grid-column: 2; font-size: 1.02rem; line-height: 1.4; }
        .hc-card.us .hc-val { color: var(--ink); font-weight: 500; }
        .hc-card.them .hc-val { color: var(--muted); }
        /* a line drawn through each full-time answer as the cards arrive */
        .hc-strike { position: relative; display: inline; }
        .hc-strike::after {
          content: ""; position: absolute; left: 0; right: 0; top: 55%; height: 1.5px; background: rgba(34,51,44,0.45);
          transform: scaleX(0); transform-origin: left; transition: transform 0.5s var(--ease);
          transition-delay: calc(700ms + var(--d) * 150ms);
        }
        .hc-vs.is-in .hc-strike::after { transform: scaleX(1); }

        .hc-vs-badge {
          position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); z-index: 2;
          width: 56px; height: 56px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          background: var(--ink); color: #fff; font-weight: 700; font-size: 0.95rem; letter-spacing: 0.04em;
          box-shadow: 0 0 0 8px #fff;
        }
        .hc-vs.is-in .hc-vs-badge { animation: hc-pulse 2.4s ease-in-out infinite; }
        @keyframes hc-pulse {
          0%, 100% { box-shadow: 0 0 0 8px #fff, 0 0 0 10px rgba(255,92,53,0.0); }
          50% { box-shadow: 0 0 0 8px #fff, 0 0 0 16px rgba(255,92,53,0.18); }
        }

        @media (max-width: 860px) {
          .hc-grid { grid-template-columns: minmax(0, 1fr); row-gap: 8px; }
          .hc-grid .hc-who:not(:first-child) { margin-top: 18px; }
          .hc-axis-pad { display: none; }
          .hc-vs { grid-template-columns: minmax(0, 1fr); gap: 40px; }
        }
        @media (max-width: 767px) {
          .hc { padding: 64px 0; }
          .hc-race { padding: 24px 18px 20px; border-radius: 20px; }
          .hc-bar { font-size: 0.74rem; padding: 0 8px; }
          .hc-flag { display: none; }
          .hc-window b { font-size: 0.7rem; right: 6px; }
          .hc-card { padding: 24px 20px; border-radius: 20px; }
          .hc-axis span:nth-child(even) { visibility: hidden; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hc-bar, .hc-bar > span, .hc-window, .hc-flag, .hc-mark, .hc-strike::after { transition: none !important; }
          .hc-bar.search, .hc-vs-badge { animation: none !important; }
        }
      `}</style>

      <div className="max-w-site">
        <div className="block-head is-center hc-head">
          <span className="pill-eyebrow">The hire you&apos;re not making</span>
          <h2 className="block-title">Fractional, or a full-time COO?</h2>
          <p className="hc-lede">
            One of them is inside your business within days. The other is still in interviews.
          </p>
        </div>

        {/* 1 · the race to start */}
        <div ref={race.ref} className={`hc-race${race.inView ? " is-in" : ""}`}>
          <p className="hc-race-title">The first six months</p>
          <div className="hc-grid">
            <div className="hc-who is-us">
              Fractional, with Riz
              <small>Call, Diagnostic, then in</small>
            </div>
            <div className="hc-track" aria-label="Fractional: a fit call, a two-week Diagnostic, then embedded from week three">
              <span className="hc-flag">In the business within days</span>
              <span className="hc-bar call" />
              <span className="hc-bar diag" />
              <span className="hc-bar embed"><span>Embedded, running the operation</span></span>
            </div>

            <div className="hc-who">
              Full-time COO
              <small>Search, interviews, notice period</small>
            </div>
            <div className="hc-track" aria-label="Full-time COO: a three to six month search before they start">
              <span className="hc-bar search"><span>Searching…</span></span>
              <span className="hc-window"><b>Starts somewhere in here</b></span>
            </div>

            <span className="hc-axis-pad" aria-hidden="true" />
            <div className="hc-axis" aria-hidden="true">
              {MONTHS.map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
          </div>
        </div>

        {/* 2 · versus */}
        <div ref={vs.ref} className={`hc-vs${vs.inView ? " is-in" : ""}`}>
          <div className="hc-card us">
            <div className="hc-card-head">
              <h3>Fractional, with Riz</h3>
              <span className="hc-tag">Live in days</span>
            </div>
            <ul className="hc-rows">
              {VERSUS.map((r, i) => (
                <li key={r.label}>
                  <span className="hc-mark" aria-hidden="true" style={{ transitionDelay: `${150 + i * 120}ms` }}>
                    <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
                      <path d="M2.5 6.2 5 8.5l4.5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <small>{r.label}</small>
                  <span className="hc-val">{r.us}</span>
                </li>
              ))}
            </ul>
          </div>

          <span className="hc-vs-badge" aria-hidden="true">VS</span>

          <div className="hc-card them">
            <div className="hc-card-head">
              <h3>Full-time COO</h3>
              <span className="hc-tag">3–6 month search</span>
            </div>
            <ul className="hc-rows">
              {VERSUS.map((r, i) => (
                <li key={r.label}>
                  <span className="hc-mark" aria-hidden="true" style={{ transitionDelay: `${450 + i * 120}ms` }}>
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                      <path d="M3 6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </span>
                  <small>{r.label}</small>
                  <span className="hc-val">
                    <span className="hc-strike" style={{ ["--d" as string]: `${i}` }}>{r.them}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
