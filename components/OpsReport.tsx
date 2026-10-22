"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import CalBookingButton from "@/components/CalModal";
import { caseRows, splitTag } from "@/lib/caseStudies";
import {
  AREAS, QUESTIONS, ADVICE, REPORT, BANDS, bandOf, MAX_PER_AREA, MAX_TOTAL, verdict, type AreaId,
} from "@/lib/opsCheck";

/**
 * The full Ops Health Check report, rebuilt from the answers in the link
 * (?a=…). Score ring and a six-sided chart of the operating system, the
 * 90 days mapped to the three weakest parts, then one chapter per part,
 * weakest first: what it means, what good looks like, the founder's own
 * answers quoted back, the first step, and a real case as proof.
 * "Download as PDF" prints it without the site chrome.
 */

const decode = (s: string | null): number[] | null => {
  if (!s || s.length !== QUESTIONS.length || !/^[0-3]+$/.test(s)) return null;
  return s.split("").map(Number);
};

/* six-sided chart: one axis per part, score as distance from the centre */
function Radar({ byArea, drawn }: { byArea: Record<AreaId, number>; drawn: boolean }) {
  const size = 320, c = size / 2, R = 112;
  const pt = (i: number, f: number) => {
    const a = (Math.PI * 2 * i) / AREAS.length - Math.PI / 2;
    return [c + Math.cos(a) * R * f, c + Math.sin(a) * R * f];
  };
  const ring = (f: number) => AREAS.map((_, i) => pt(i, f).join(",")).join(" ");
  const shape = AREAS.map((a, i) => pt(i, Math.max(0.06, byArea[a.id] / MAX_PER_AREA)).join(",")).join(" ");
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="or-radar" role="img"
      aria-label={"Scores by part: " + AREAS.map((a) => `${a.name} ${byArea[a.id]} of ${MAX_PER_AREA}`).join(", ")}>
      {[1, 2 / 3, 1 / 3].map((f) => <polygon key={f} points={ring(f)} className="or-radar-ring" />)}
      {AREAS.map((_, i) => { const [x, y] = pt(i, 1); return <line key={i} x1={c} y1={c} x2={x} y2={y} className="or-radar-axis" />; })}
      <polygon points={shape} className={`or-radar-shape${drawn ? " is-drawn" : ""}`} style={{ transformOrigin: `${c}px ${c}px` }} />
      {AREAS.map((a, i) => {
        const [x, y] = pt(i, Math.max(0.06, byArea[a.id] / MAX_PER_AREA));
        return <circle key={a.id} cx={x} cy={y} r="5" fill={BANDS[bandOf(byArea[a.id])].color} className={`or-radar-dot${drawn ? " is-drawn" : ""}`} />;
      })}
      {AREAS.map((a, i) => {
        const [x, y] = pt(i, 1.24);
        return <text key={a.id} x={x} y={y} textAnchor={x < c - 4 ? "end" : x > c + 4 ? "start" : "middle"} dominantBaseline="middle" className="or-radar-label">{a.short}</text>;
      })}
    </svg>
  );
}

export default function OpsReport() {
  const [answers, setAnswers] = useState<number[] | null>(null);
  const [ready, setReady] = useState(false);
  const [drawn, setDrawn] = useState(false);
  const [current, setCurrent] = useState<AreaId | null>(null);
  const chapterRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    setAnswers(decode(new URLSearchParams(window.location.search).get("a")));
    setReady(true);
    const t = setTimeout(() => setDrawn(true), 250);
    return () => clearTimeout(t);
  }, []);

  const data = useMemo(() => {
    if (!answers) return null;
    const byArea = Object.fromEntries(AREAS.map((a) => [a.id, 0])) as Record<AreaId, number>;
    QUESTIONS.forEach((q, i) => { byArea[q.area] += q.options[answers[i]].score; });
    const raw = Object.values(byArea).reduce((s, n) => s + n, 0);
    const order = [...AREAS].sort((a, b) => byArea[a.id] - byArea[b.id]);
    return { byArea, total: Math.round((raw / MAX_TOTAL) * 100), order };
  }, [answers]);

  // the side index follows the chapter in view
  useEffect(() => {
    if (!data) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setCurrent(e.target.getAttribute("data-area") as AreaId); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.values(chapterRefs.current).forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [data]);

  if (!ready) return <section className="or" style={{ minHeight: "100vh", background: "var(--cream)" }} />;

  if (!data) {
    return (
      <section style={{ background: "var(--cream)", minHeight: "70vh", padding: "160px 24px 80px", textAlign: "center" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 500, color: "var(--ink)" }}>This roadmap link is incomplete.</h1>
        <p style={{ marginTop: 12, color: "var(--body)" }}>Take the check to get your roadmap. It takes about three minutes.</p>
        <a href="/ops-check" className="btn-coral" style={{ marginTop: 24, display: "inline-flex" }}>Take the Ops Health Check →</a>
      </section>
    );
  }

  const v = verdict(data.total);
  const [w1, w2, w3] = data.order;
  const ringR = 54, ringC = 2 * Math.PI * ringR;
  const date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <section className="or">
      <style>{`
        .or { background: var(--cream); padding: 120px 0 0; }
        .or-wrap { max-width: 1120px; margin: 0 auto; padding: 0 24px; }
        .or-eyebrow { font-family: var(--font-geist-mono), monospace; font-size: 12px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--coral); }

        /* ── cover ── */
        .or-cover { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr); gap: 40px; align-items: center; }
        .or-h1 { margin: 14px 0 0; font-size: clamp(2.3rem, 1.5rem + 2.8vw, 3.5rem); font-weight: 500; line-height: 1.05; letter-spacing: -0.02em; color: var(--ink); }
        .or-lede { margin: 16px 0 0; font-size: 1.12rem; line-height: 1.65; color: var(--body); max-width: 52ch; }
        .or-meta { margin-top: 22px; display: flex; flex-wrap: wrap; gap: 8px 18px; font-family: var(--font-geist-mono), monospace; font-size: 12px; color: var(--muted); }
        .or-actions { display: flex; flex-wrap: wrap; gap: 12px 20px; align-items: center; margin-top: 26px; }
        .or-textbtn { padding: 0; border: 0; background: none; cursor: pointer; font: inherit; font-size: 0.95rem; font-weight: 600; color: var(--ink); border-bottom: 1.5px solid var(--coral); }
        .or-textbtn:hover { color: var(--coral); }
        .or-visual { position: relative; background: #fff; border: 1px solid var(--line); border-radius: 24px; padding: 24px; box-shadow: 0 30px 60px -36px rgba(34,51,44,0.4); }
        .or-ring { position: absolute; top: 18px; left: 18px; width: 128px; height: 128px; }
        .or-ring circle { fill: none; stroke-width: 10; }
        .or-ring .bg { stroke: var(--cream); }
        .or-ring .fg { stroke: var(--coral); stroke-linecap: round; transform: rotate(-90deg); transform-origin: 64px 64px; transition: stroke-dashoffset 1.4s cubic-bezier(.3,.7,.2,1); }
        .or-ring-n { position: absolute; top: 18px; left: 18px; width: 128px; height: 128px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .or-ring-n b { font-size: 2.4rem; font-weight: 600; line-height: 1; letter-spacing: -0.03em; color: var(--ink); }
        .or-ring-n span { font-family: var(--font-geist-mono), monospace; font-size: 11px; color: var(--muted); margin-top: 4px; }
        .or-radar { display: block; width: 100%; max-width: 360px; margin: 34px auto 0; overflow: visible; }
        .or-radar-ring { fill: none; stroke: var(--line); stroke-width: 1; }
        .or-radar-axis { stroke: var(--line); stroke-width: 1; }
        .or-radar-shape { fill: rgba(255,92,53,0.16); stroke: var(--coral); stroke-width: 2.5; stroke-linejoin: round; transform: scale(0); transition: transform 1.1s cubic-bezier(.3,1.25,.4,1) 0.2s; }
        .or-radar-shape.is-drawn { transform: scale(1); }
        .or-radar-dot { opacity: 0; transition: opacity 0.4s ease 1.1s; stroke: #fff; stroke-width: 2; }
        .or-radar-dot.is-drawn { opacity: 1; }
        .or-radar-label { font-family: var(--font-geist-mono), monospace; font-size: 11px; font-weight: 600; letter-spacing: 0.04em; fill: var(--ink); text-transform: uppercase; }
        .or-legend { display: flex; justify-content: center; gap: 16px; margin-top: 10px; font-size: 0.82rem; color: var(--body); }
        .or-legend i { display: inline-block; width: 9px; height: 9px; border-radius: 50%; margin-right: 6px; }

        /* ── your 90 days ── */
        .or-plan { margin-top: 64px; }
        .or-h2 { margin: 10px 0 0; font-size: clamp(1.7rem, 1.2rem + 1.6vw, 2.4rem); font-weight: 500; line-height: 1.12; letter-spacing: -0.015em; color: var(--ink); }
        .or-days { display: grid; grid-template-columns: 1.4fr 3fr 3fr 1.6fr; gap: 6px; margin-top: 26px; }
        .or-day > i { display: block; height: 10px; border-radius: 999px; transform-origin: left; transform: scaleX(0); transition: transform 0.7s var(--ease); }
        .or-days.is-drawn .or-day > i { transform: scaleX(1); }
        .or-day:nth-child(1) > i { background: linear-gradient(90deg, #FFB199, var(--coral)); transition-delay: 0.1s; }
        .or-day:nth-child(2) > i { background: linear-gradient(90deg, #F7C9A0, #F5C518); transition-delay: 0.4s; }
        .or-day:nth-child(3) > i { background: linear-gradient(90deg, #FCEBB0, #BDEBC8); transition-delay: 0.7s; }
        .or-day:nth-child(4) > i { background: linear-gradient(90deg, #BDEBC8, #16C45B); transition-delay: 1s; }
        .or-day small { display: block; margin-top: 10px; font-family: var(--font-geist-mono), monospace; font-size: 11.5px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); }
        .or-day b { display: block; margin-top: 4px; font-size: 0.98rem; line-height: 1.35; color: var(--ink); }

        /* ── chapters ── */
        .or-body { display: grid; grid-template-columns: 220px minmax(0, 1fr); gap: 48px; margin-top: 72px; align-items: start; }
        .or-index { position: sticky; top: 100px; display: flex; flex-direction: column; gap: 4px; }
        .or-index p { margin: 0 0 10px; }
        .or-index a { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 10px; text-decoration: none; color: var(--body); font-size: 0.92rem; transition: background 0.2s ease, color 0.2s ease; }
        .or-index a i { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .or-index a.is-on { background: #fff; color: var(--ink); font-weight: 600; box-shadow: 0 8px 20px -14px rgba(34,51,44,0.4); }
        .or-chapters { display: flex; flex-direction: column; gap: 28px; }
        .or-ch { background: #fff; border: 1px solid var(--line); border-radius: 24px; padding: 34px 36px; scroll-margin-top: 100px; }
        .or-ch-top { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
        .or-ch-rank { font-family: var(--font-geist-mono), monospace; font-size: 12px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); }
        .or-band { display: inline-flex; align-items: center; gap: 8px; padding: 6px 12px; border-radius: 999px; font-size: 0.85rem; font-weight: 600; }
        .or-band i { width: 7px; height: 7px; border-radius: 50%; }
        .or-ch h3 { margin: 12px 0 0; font-size: clamp(1.5rem, 1.2rem + 1vw, 2rem); font-weight: 500; letter-spacing: -0.015em; color: var(--ink); }
        .or-meter { display: flex; align-items: center; gap: 14px; margin-top: 14px; }
        .or-meter-track { flex: 1; height: 8px; border-radius: 999px; background: var(--cream); overflow: hidden; }
        .or-meter-track i { display: block; height: 100%; border-radius: 999px; }
        .or-meter b { font-family: var(--font-geist-mono), monospace; font-size: 13px; color: var(--muted); }
        .or-meaning { margin: 20px 0 0; font-size: 1.06rem; line-height: 1.7; color: var(--body); }
        .or-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 22px; }
        .or-box { border-radius: 16px; padding: 18px 20px; }
        .or-box.good { background: #F2F8F3; }
        .or-box.you { background: var(--cream); }
        .or-box h4 { margin: 0 0 10px; font-family: var(--font-geist-mono), monospace; font-size: 11.5px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink); }
        .or-box ul { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 8px; }
        .or-box.good li { display: flex; gap: 10px; font-size: 0.96rem; line-height: 1.45; color: var(--ink); }
        .or-box.good li::before { content: "✓"; color: #16A34A; font-weight: 700; }
        .or-box.you li { font-size: 0.96rem; line-height: 1.45; color: var(--ink); }
        .or-box.you li q { quotes: "“" "”"; font-style: italic; }
        .or-box.you li small { display: block; color: var(--muted); font-size: 0.82rem; margin-bottom: 2px; }
        .or-step { margin-top: 18px; border-left: 3px solid var(--coral); padding: 4px 0 4px 18px; }
        .or-step h4 { margin: 0; font-family: var(--font-geist-mono), monospace; font-size: 11.5px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--coral); }
        .or-step p { margin: 6px 0 0; font-size: 1.04rem; line-height: 1.6; color: var(--ink); }
        .or-proof { display: flex; align-items: center; gap: 18px; margin-top: 22px; padding: 16px 18px; border: 1px dashed rgba(34,51,44,0.2); border-radius: 16px; text-decoration: none; color: inherit; transition: border-color 0.2s ease, background 0.2s ease; }
        .or-proof:hover { border-color: var(--coral); background: #FFF8F5; }
        .or-proof b { flex-shrink: 0; font-size: 1.6rem; font-weight: 600; letter-spacing: -0.02em; color: var(--coral); white-space: nowrap; }
        .or-proof span { font-size: 0.94rem; line-height: 1.45; color: var(--body); }
        .or-proof em { font-style: normal; display: block; font-weight: 600; color: var(--ink); }

        /* ── close ── */
        .or-close { margin-top: 72px; background: var(--ink); color: #fff; border-radius: 28px; padding: 48px 52px; display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 28px 40px; align-items: center; position: relative; overflow: hidden; }
        .or-close::after { content: ""; position: absolute; right: -90px; top: -90px; width: 300px; height: 300px; border-radius: 50%; background: radial-gradient(circle, rgba(255,92,53,0.35), transparent 70%); pointer-events: none; }
        .or-close h2 { margin: 0; font-size: clamp(1.7rem, 1.2rem + 1.6vw, 2.4rem); font-weight: 500; line-height: 1.15; color: #fff; }
        .or-close p { margin: 12px 0 0; color: rgba(255,255,255,0.78); line-height: 1.65; max-width: 56ch; }
        .or-close .btn-coral { position: relative; z-index: 1; }
        .or-foot { padding: 28px 0 88px; text-align: center; font-size: 0.9rem; color: var(--muted); }
        .or-foot a { color: var(--ink); font-weight: 600; }

        @media (max-width: 960px) {
          .or-cover { grid-template-columns: 1fr; }
          .or-body { grid-template-columns: 1fr; }
          .or-index { display: none; }
          .or-close { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .or { padding-top: 100px; }
          .or-days { grid-template-columns: 1fr 1fr; row-gap: 18px; }
          .or-ch { padding: 26px 20px; }
          .or-grid2 { grid-template-columns: 1fr; }
          .or-close { padding: 34px 24px; }
          .or-proof { flex-direction: column; align-items: flex-start; gap: 6px; }
          .or-ring { width: 104px; height: 104px; } .or-ring-n { width: 104px; height: 104px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .or-radar-shape, .or-radar-dot, .or-ring .fg, .or-day > i { transition: none !important; }
        }

        /* ── PDF: the report alone, colours kept ── */
        @media print {
          header, footer, .ftr-root, .or-actions, .or-index, nextjs-portal { display: none !important; }
          html, body, .or { background: #fff !important; }
          .or { padding-top: 0; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .or-body { grid-template-columns: 1fr; margin-top: 36px; }
          .or-ch, .or-close, .or-visual, .or-plan { break-inside: avoid; }
          .or-radar-shape { transform: scale(1) !important; } .or-radar-dot { opacity: 1 !important; }
          .or-day > i { transform: scaleX(1) !important; }
          .or-close::after { display: none; }
        }
      `}</style>

      <div className="or-wrap">
        {/* cover */}
        <div className="or-cover">
          <div>
            <span className="or-eyebrow">Your Ops Roadmap</span>
            <h1 className="or-h1">{v.title}</h1>
            <p className="or-lede">
              {v.line} Below: what each of the six parts means, where you stand, and what to do first. Weakest first.
            </p>
            <div className="or-meta">
              <span>{date}</span>
              <span>12 answers</span>
              <span>Weakest: {w1.name}</span>
            </div>
            <div className="or-actions">
              <button type="button" className="btn-coral" onClick={() => window.print()}>Download as PDF</button>
              <a href="#or-chapters" className="or-textbtn">Read the roadmap ↓</a>
            </div>
          </div>

          <div className="or-visual">
            <svg className="or-ring" viewBox="0 0 128 128" aria-hidden="true">
              <circle className="bg" cx="64" cy="64" r={ringR} />
              <circle className="fg" cx="64" cy="64" r={ringR} strokeDasharray={ringC} strokeDashoffset={drawn ? ringC * (1 - data.total / 100) : ringC} />
            </svg>
            <div className="or-ring-n"><b>{data.total}</b><span>out of 100</span></div>
            <Radar byArea={data.byArea} drawn={drawn} />
            <div className="or-legend" aria-hidden="true">
              {(Object.keys(BANDS) as (keyof typeof BANDS)[]).map((k) => <span key={k}><i style={{ background: BANDS[k].color }} />{BANDS[k].label}</span>)}
            </div>
          </div>
        </div>

        {/* your 90 days */}
        <div className="or-plan">
          <span className="or-eyebrow">Your 90 days</span>
          <h2 className="or-h2">The order I&apos;d fix it in.</h2>
          <div className={`or-days${drawn ? " is-drawn" : ""}`}>
            <div className="or-day"><i /><small>Days 1–14</small><b>Diagnose: map how work really moves</b></div>
            <div className="or-day"><i /><small>Days 15–45</small><b>Fix: {w1.name}</b></div>
            <div className="or-day"><i /><small>Days 46–75</small><b>Fix: {w2.name}</b></div>
            <div className="or-day"><i /><small>Days 76–90</small><b>Fix: {w3.name}, then hand over</b></div>
          </div>
        </div>

        {/* chapters */}
        <div className="or-body" id="or-chapters">
          <nav className="or-index" aria-label="Report sections">
            <p className="or-eyebrow">In this roadmap</p>
            {data.order.map((a) => (
              <a key={a.id} href={`#part-${a.id}`} className={current === a.id ? "is-on" : ""}>
                <i style={{ background: BANDS[bandOf(data.byArea[a.id])].color }} />{a.name}
              </a>
            ))}
          </nav>

          <div className="or-chapters">
            {data.order.map((a, rank) => {
              const s = data.byArea[a.id];
              const band = bandOf(s);
              const rep = REPORT[a.id];
              const proof = caseRows.find((r) => r.id === rep.proof.caseId);
              const mine = QUESTIONS.map((q, i) => ({ q, i })).filter(({ q }) => q.area === a.id);
              return (
                <article key={a.id} id={`part-${a.id}`} data-area={a.id} className="or-ch" ref={(el) => { chapterRefs.current[a.id] = el; }}>
                  <div className="or-ch-top">
                    <span className="or-ch-rank">Part {rank + 1} of 6{rank < 3 ? " · fix first" : ""}</span>
                    <span className="or-band" style={{ background: `${BANDS[band].color}1A`, color: BANDS[band].color }}>
                      <i style={{ background: BANDS[band].color }} />{BANDS[band].label}
                    </span>
                  </div>
                  <h3>{a.name}</h3>
                  <div className="or-meter">
                    <span className="or-meter-track"><i style={{ width: `${Math.max(4, (s / MAX_PER_AREA) * 100)}%`, background: BANDS[band].color }} /></span>
                    <b>{s}/{MAX_PER_AREA}</b>
                  </div>
                  <p className="or-meaning">{rep.meaning}</p>

                  <div className="or-grid2">
                    <div className="or-box good">
                      <h4>What good looks like</h4>
                      <ul>{rep.good.map((g) => <li key={g}>{g}</li>)}</ul>
                    </div>
                    <div className="or-box you">
                      <h4>Where you are</h4>
                      <ul>
                        {mine.map(({ q, i }) => (
                          <li key={i}><small>{q.q}</small><q>{q.options[answers![i]].label}</q></li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="or-step">
                    <h4>Your first step this week</h4>
                    <p>{ADVICE[a.id][band]}</p>
                  </div>

                  {proof && (
                    <a className="or-proof" href={`/case-studies?case=${proof.id}`}>
                      <b>{rep.proof.figure}</b>
                      <span><em>{proof.title} · {splitTag(proof.tag).company}</em>{rep.proof.line}</span>
                    </a>
                  )}
                </article>
              );
            })}
          </div>
        </div>

        {/* close */}
        <div className="or-close">
          <div>
            <span className="or-eyebrow" style={{ color: "#FFB199" }}>Your next step</span>
            <h2 style={{ marginTop: 10 }}>Start with &ldquo;{w1.name.toLowerCase()}&rdquo;. I can help.</h2>
            <p>
              Thirty minutes, free. Bring this roadmap and you&apos;ll leave with a straight answer on what to
              do next. If it makes sense, the next step is a two-week Ops &amp; AI Diagnostic: $1,500, and if
              the Day 14 walkthrough isn&apos;t worth it to you, I refund it in full.
            </p>
          </div>
          <CalBookingButton className="btn-coral">Book a free 30-min fit call →</CalBookingButton>
        </div>
        <p className="or-foot">
          Rizwan Mahmood · Fractional COO · <a href="/">consultwithriz.com</a> · <a href="/ops-check">Take the check again</a>
        </p>
      </div>
    </section>
  );
}
