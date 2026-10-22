"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import CalBookingButton from "@/components/CalModal";
import { AREAS, QUESTIONS, ADVICE, MAX_PER_AREA, BANDS, outcome, scoreAnswers, bandOf, type AreaId } from "@/lib/opsCheck";

/**
 * The Ops Health Check. Intro → twelve questions, one at a time → results.
 *
 * Results show straight away, no email needed: a score out of 100, one bar
 * per part of the operating system, and the three weakest parts with what
 * to do next. The email box only sends the plan (not connected yet), and
 * every result has its own link (?a=…) so it can be shared or sent to Riz.
 */

type Stage = "intro" | "questions" | "building" | "results";

// The email step switches on once the newsletter is connected
// (NEXT_PUBLIC_OPS_EMAIL=on). Until then the results link straight to the
// full roadmap, so no visitor is shown a form that goes nowhere.
const EMAIL_ON = process.env.NEXT_PUBLIC_OPS_EMAIL === "on";

const encode = (a: number[]) => a.join("");
const decode = (s: string | null): number[] | null => {
  if (!s || s.length !== QUESTIONS.length || !/^[0-3]+$/.test(s)) return null;
  return s.split("").map(Number);
};

const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * The reveal between the last answer and the results, about ten seconds,
 * five beats, then straight on to the full roadmap:
 *   1. reading your answers: the hub appears; their own answers flash past
 *   2. scoring: each part fills and shows Leaking / Holding / Strong; the
 *      score counts up
 *   3. comparing with what good looks like: a dashed target ring draws round
 *   4. finding the three biggest leaks: the weakest three step forward, 1-2-3
 *   5. mapping the 90 days: the roadmap bar draws in under the dial
 * Skipped entirely for reduced motion.
 */
const REVEAL_STEPS = ["Reading your answers", "Scoring the six parts", "Comparing with what good looks like", "Finding your three biggest leaks", "Mapping your 90 days"];
const REVEAL_AT = [0, 1200, 3600, 5600, 7600]; // ms each beat starts
const REVEAL_MS = 10000;

function Reveal({ byArea, total, weakest, quotes, onDone }: {
  byArea: Record<AreaId, number>;
  total: number;
  weakest: AreaId[];
  quotes: string[];
  onDone: () => void;
}) {
  const [phase, setPhase] = useState(0);
  const [count, setCount] = useState(0);
  const [quote, setQuote] = useState(0);
  useEffect(() => {
    const ts = REVEAL_AT.slice(1).map((ms, k) => setTimeout(() => setPhase(k + 1), ms));
    ts.push(setTimeout(onDone, REVEAL_MS));
    // their answers flash past during the first two beats
    const q = setInterval(() => setQuote((n) => Math.min(n + 1, quotes.length - 1)), 1200);
    ts.push(setTimeout(() => clearInterval(q), REVEAL_AT[2]));
    // the score counts up while the parts fill
    let raf = 0;
    const startAt = performance.now() + REVEAL_AT[1];
    const tick = (now: number) => {
      const f = Math.min(Math.max((now - startAt) / 2300, 0), 1);
      setCount(Math.round(total * (1 - Math.pow(1 - f, 3))));
      if (f < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { ts.forEach(clearTimeout); clearInterval(q); cancelAnimationFrame(raf); };
  }, [total, onDone, quotes.length]);

  const C = 140, R = 104, SW = 20;
  const polar = (deg: number, r: number) => [C + r * Math.cos((deg * Math.PI) / 180), C + r * Math.sin((deg * Math.PI) / 180)];
  const arc = (i: number, r: number) => {
    const [x0, y0] = polar(-90 + i * 60 + 10, r), [x1, y1] = polar(-90 + i * 60 + 50, r);
    return `M ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1}`;
  };
  const mid = (i: number, r: number) => polar(-90 + i * 60 + 30, r);
  const order = weakest; // weakest first
  const plan = [
    { days: "Days 1–14", what: "Diagnose" },
    { days: "Days 15–45", what: `Fix: ${AREAS.find((a) => a.id === order[0])!.short}` },
    { days: "Days 46–75", what: `Fix: ${AREAS.find((a) => a.id === order[1])!.short}` },
    { days: "Days 76–90", what: `Fix: ${AREAS.find((a) => a.id === order[2])!.short}` },
  ];

  return (
    <div className={`oc-reveal phase-${phase}`} role="status" aria-live="polite">
      <svg viewBox="-40 -24 360 330" className="oc-dial" aria-hidden="true">
        <circle cx={C} cy={C} r={R + SW} className="oc-dial-halo" />
        {AREAS.map((a, i) => {
          const s = byArea[a.id];
          const band = bandOf(s);
          const f = phase >= 1 ? Math.max(0.04, s / MAX_PER_AREA) : 0;
          const [lx, ly] = mid(i, R + 38);
          const anchor = lx < C - 6 ? "end" : lx > C + 6 ? "start" : "middle";
          const rank = order.indexOf(a.id);
          const [bx, by] = mid(i, R - 34);
          return (
            <g key={a.id} className={`oc-seg${rank >= 0 ? " is-weak" : ""}`} style={{ ["--d" as string]: `${i * 0.36}s`, ["--r" as string]: `${Math.max(rank, 0) * 0.45}s` }}>
              <path d={arc(i, R)} className="oc-dial-track" strokeWidth={SW} pathLength={1} />
              <path d={arc(i, R)} className="oc-dial-fill" strokeWidth={SW} pathLength={1}
                style={{ stroke: BANDS[band].color, strokeDasharray: `${f} 1`, opacity: f > 0 ? 1 : 0 }} />
              <path d={arc(i, R + SW / 2 + 7)} className="oc-dial-goal" pathLength={1} />
              <text x={lx} y={ly - 7} textAnchor={anchor} dominantBaseline="middle" className="oc-dial-label">{a.short}</text>
              <text x={lx} y={ly + 9} textAnchor={anchor} dominantBaseline="middle" className="oc-dial-band" style={{ fill: BANDS[band].color }}>{BANDS[band].label}</text>
              {rank >= 0 && (
                <g className="oc-rank" style={{ transformOrigin: `${bx}px ${by}px` }}>
                  <circle cx={bx} cy={by} r={11} />
                  <text x={bx} y={by + 1} textAnchor="middle" dominantBaseline="middle">{rank + 1}</text>
                </g>
              )}
            </g>
          );
        })}
        <circle cx={C} cy={C} r={58} className="oc-dial-hub" />
        <text x={C} y={C - 4} textAnchor="middle" className="oc-dial-big">{phase >= 1 ? count : "·"}</text>
        <text x={C} y={C + 22} textAnchor="middle" className="oc-dial-small">{phase >= 1 ? "out of 100" : "reading"}</text>
      </svg>

      {/* under the dial: their answers flashing past, then the 90 days drawing in */}
      <div className="oc-under">
        {phase < 2 ? (
          <div key={quote} className="oc-said">
            <small>You said</small>
            <p className="oc-quote">&ldquo;{quotes[quote]}&rdquo;</p>
          </div>
        ) : phase >= 4 ? (
          <div className="oc-mini-plan">
            {plan.map((p, k) => (
              <div key={p.days} style={{ ["--k" as string]: `${k * 0.42}s` }}>
                <i /><small>{p.days}</small><b>{p.what}</b>
              </div>
            ))}
          </div>
        ) : (
          <p className="oc-quote is-calm">{phase === 2 ? "Measuring the gap to good…" : "Ranking what to fix first…"}</p>
        )}
      </div>

      <ol className="oc-steps">
        {REVEAL_STEPS.map((t, k) => (
          <li key={t} className={k < phase ? "is-done" : k === phase ? "is-on" : ""}>
            <span className="oc-steps-mark" aria-hidden="true">{k < phase ? "✓" : ""}</span>{t}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function OpsCheck() {
  const [stage, setStage] = useState<Stage>("intro");
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [answers, setAnswers] = useState<number[]>(Array(QUESTIONS.length).fill(-1));
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState<null | "connected" | "not-connected" | "error">(null);
  const [sending, setSending] = useState(false);

  const router = useRouter();
  const roadmapUrl = useRef("");

  // an older shared result link (?a=…) opens the full roadmap
  useEffect(() => {
    const a = decode(new URLSearchParams(window.location.search).get("a"));
    if (a) router.replace(`/ops-check/report?a=${encode(a)}`);
  }, [router]);

  const scores = useMemo(() => scoreAnswers(answers), [answers]);


  const weakest = useMemo(
    () => [...AREAS].sort((a, b) => scores.byArea[a.id] - scores.byArea[b.id]).slice(0, 3),
    [scores],
  );

  // the reveal ends on the full roadmap, not a short results page
  const showResults = useCallback(() => { router.push(roadmapUrl.current); }, [router]);

  const choose = (opt: number) => {
    const next = [...answers]; next[step] = opt; setAnswers(next);
    setTimeout(() => {
      if (step < QUESTIONS.length - 1) { setDir(1); setStep(step + 1); return; }
      roadmapUrl.current = `/ops-check/report?a=${encode(next)}`;
      if (reducedMotion()) { showResults(); return; }
      setStage("building");
      window.scrollTo({ top: 0 });
    }, 280);
  };

  // keys 1-4 pick an answer
  useEffect(() => {
    if (stage !== "questions") return;
    const onKey = (e: KeyboardEvent) => {
      const n = Number(e.key);
      if (n >= 1 && n <= 4) choose(n - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const restart = () => {
    setAnswers(Array(QUESTIONS.length).fill(-1)); setStep(0); setStage("questions"); setSent(null);
    const url = new URL(window.location.href); url.searchParams.delete("a");
    window.history.replaceState(null, "", url);
  };

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2500); } catch {}
  };

  const sendPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch("/api/ops-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, answers: encode(answers), total: scores.total, byArea: scores.byArea, weakest: weakest[0].id, tier: v.tier }),
      });
      const data = await res.json();
      setSent(res.ok ? (data.connected ? "connected" : "not-connected") : "error");
    } catch { setSent("error"); }
    setSending(false);
  };

  const q = QUESTIONS[step];
  const area = AREAS.find((a) => a.id === q.area)!;
  const v = outcome(scores.total, scores.byArea);

  return (
    <section className="oc">
      <style>{`
        .oc { background: var(--cream); min-height: 100vh; padding: 128px 0 88px; }
        .oc-wrap { max-width: 760px; margin: 0 auto; padding: 0 24px; }
        .oc-eyebrow { font-family: var(--font-geist-mono), monospace; font-size: 12px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--coral); }
        .oc-h1 { margin: 14px 0 0; font-size: clamp(2.3rem, 1.5rem + 2.8vw, 3.4rem); font-weight: 500; line-height: 1.06; letter-spacing: -0.02em; color: var(--ink); }
        .oc-h1 em { font-style: normal; color: var(--coral); }
        .oc-lede { margin: 18px 0 0; font-size: 1.12rem; line-height: 1.65; color: var(--body); max-width: 56ch; }
        .oc-parts { display: flex; flex-wrap: wrap; gap: 8px; margin: 26px 0 0; padding: 0; list-style: none; }
        .oc-parts li { padding: 6px 12px; border-radius: 999px; background: #fff; border: 1px solid var(--line); font-size: 0.88rem; color: var(--ink); }
        .oc-start { margin-top: 32px; }
        .oc-note { margin: 14px 0 0; font-size: 0.9rem; color: var(--muted); }

        /* questions */
        .oc-progress { display: flex; align-items: center; gap: 14px; }
        .oc-bar { flex: 1; height: 6px; border-radius: 999px; background: rgba(34,51,44,0.1); overflow: hidden; }
        .oc-bar i { display: block; height: 100%; background: var(--coral); border-radius: 999px; transition: width 0.35s var(--ease); }
        .oc-count { font-family: var(--font-geist-mono), monospace; font-size: 12px; font-weight: 600; color: var(--muted); white-space: nowrap; }
        .oc-area { margin: 30px 0 0; }
        .oc-q { margin: 10px 0 0; font-size: clamp(1.5rem, 1.15rem + 1.2vw, 2.05rem); font-weight: 500; line-height: 1.2; letter-spacing: -0.015em; color: var(--ink); }
        .oc-opts { display: flex; flex-direction: column; gap: 10px; margin-top: 26px; }
        .oc-opt {
          display: flex; align-items: center; gap: 14px; width: 100%; text-align: left; cursor: pointer;
          padding: 16px 18px; border-radius: 14px; border: 1.5px solid var(--line); background: #fff;
          font: inherit; font-size: 1.02rem; line-height: 1.45; color: var(--ink);
          transition: border-color 0.2s ease, transform 0.2s var(--ease), box-shadow 0.2s ease;
        }
        .oc-opt:hover { border-color: var(--coral); transform: translateY(-2px); box-shadow: 0 10px 24px -14px rgba(255,92,53,0.45); }
        .oc-opt:focus-visible { outline: 2px solid var(--coral); outline-offset: 2px; }
        .oc-opt[aria-pressed="true"] { border-color: var(--coral); background: #FFF6F2; }
        .oc-key { flex-shrink: 0; width: 28px; height: 28px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; background: var(--cream); font-family: var(--font-geist-mono), monospace; font-size: 13px; font-weight: 700; color: var(--muted); }
        .oc-opt[aria-pressed="true"] .oc-key { background: var(--coral); color: #fff; }
        .oc-back { margin-top: 22px; padding: 0; border: 0; background: none; cursor: pointer; font: inherit; font-size: 0.92rem; font-weight: 600; color: var(--muted); }
        .oc-back:hover { color: var(--ink); }
        .oc-swap { animation: oc-in 0.35s var(--ease); }
        @keyframes oc-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        /* questions slide in from the direction you're going */
        .oc-slide-1 { animation: oc-from-right 0.38s var(--ease); }
        .oc-slide--1 { animation: oc-from-left 0.38s var(--ease); }
        @keyframes oc-from-right { from { opacity: 0; transform: translateX(28px); } to { opacity: 1; transform: none; } }
        @keyframes oc-from-left { from { opacity: 0; transform: translateX(-28px); } to { opacity: 1; transform: none; } }
        .oc-tick { display: none; }
        .oc-opt[aria-pressed="true"] .oc-num { display: none; }
        .oc-opt[aria-pressed="true"] .oc-tick { display: inline; }

        /* the reveal */
        .oc-reveal { min-height: 64vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
        .oc-reveal .oc-dial { display: block; width: 100%; max-width: 360px; overflow: visible; }
        .oc-dial-halo { fill: none; stroke: rgba(255,92,53,0.12); stroke-width: 2; transform-origin: 140px 140px; animation: oc-halo 1.6s ease-out infinite; }
        @keyframes oc-halo { from { transform: scale(0.82); opacity: 1; } to { transform: scale(1.18); opacity: 0; } }
        .oc-dial-track { fill: none; stroke: rgba(34,51,44,0.09); stroke-linecap: round; }
        .oc-dial-fill { fill: none; stroke-linecap: round; transition: stroke-dasharray 0.9s cubic-bezier(.3,.8,.3,1) var(--d), opacity 0.2s ease var(--d); }
        .oc-dial-label { font-family: var(--font-geist-mono), monospace; font-size: 11px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; fill: var(--muted); opacity: 0; transition: opacity 0.4s ease var(--d), fill 0.3s ease; }
        .oc-dial-hub { fill: var(--ink); transform-origin: 140px 140px; animation: oc-hub-in 0.6s cubic-bezier(.3,1.5,.5,1); }
        @keyframes oc-hub-in { from { transform: scale(0.4); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .oc-dial-small { font-family: var(--font-geist-mono), monospace; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; fill: rgba(255,255,255,0.65); }
        .oc-dial-big { font-size: 40px; font-weight: 600; fill: #fff; letter-spacing: -0.03em; font-variant-numeric: tabular-nums; }
        .oc-seg { transform-origin: 140px 140px; transition: opacity 0.5s ease, transform 0.5s cubic-bezier(.3,1.4,.5,1); }
        /* 1 · parts fade in */
        .oc-reveal .oc-dial-label { opacity: 1; }
        /* 3 · the weakest three step forward, the rest step back */
        .phase-3 .oc-seg:not(.is-weak), .phase-4 .oc-seg:not(.is-weak) { opacity: 0.28; }
        .phase-3 .oc-seg.is-weak, .phase-4 .oc-seg.is-weak { transform: scale(1.07); }
        .phase-3 .oc-seg.is-weak .oc-dial-label, .phase-4 .oc-seg.is-weak .oc-dial-label { fill: var(--coral); }
        .phase-3 .oc-seg.is-weak .oc-dial-fill { animation: oc-pulse 0.9s ease-in-out 2; }
        @keyframes oc-pulse { 50% { stroke-width: 26px; } }
        .oc-dial-fill { transition: stroke-dasharray 1.1s cubic-bezier(.3,.8,.3,1) var(--d), opacity 0.2s ease var(--d); }
        .oc-dial-band { font-family: var(--font-geist-mono), monospace; font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; opacity: 0; transition: opacity 0.35s ease calc(var(--d) + 0.9s); }
        .phase-1 .oc-dial-band, .phase-2 .oc-dial-band, .phase-3 .oc-dial-band, .phase-4 .oc-dial-band { opacity: 1; }
        /* 3 · the target ring draws round */
        .oc-dial-goal { fill: none; stroke: var(--ink); stroke-width: 1.5; stroke-dasharray: 0.02 0.03; opacity: 0; }
        .phase-2 .oc-dial-goal, .phase-3 .oc-dial-goal, .phase-4 .oc-dial-goal { opacity: 0.45; animation: oc-goal 1.2s ease-out both; animation-delay: calc(var(--d) * 0.4); }
        @keyframes oc-goal { from { stroke-dashoffset: 1; opacity: 0; } to { stroke-dashoffset: 0; opacity: 0.45; } }
        /* 4 · numbered badges on the weakest three */
        .oc-rank { opacity: 0; transform: scale(0.3); transition: opacity 0.3s ease var(--r), transform 0.45s cubic-bezier(.3,1.7,.5,1) var(--r); }
        .oc-rank circle { fill: var(--coral); stroke: #fff; stroke-width: 2.5; }
        .oc-rank text { fill: #fff; font-size: 12px; font-weight: 700; }
        .phase-3 .oc-rank, .phase-4 .oc-rank { opacity: 1; transform: scale(1); }
        /* under the dial */
        .oc-under { min-height: 76px; display: flex; align-items: center; justify-content: center; width: 100%; max-width: 560px; margin-top: 6px; }
        .oc-said { text-align: center; animation: oc-quote 0.6s ease; }
        .oc-said small { display: block; margin-bottom: 4px; font-family: var(--font-geist-mono), monospace; font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--coral); }
        .oc-quote { margin: 0; font-size: 1.2rem; font-style: italic; color: var(--ink); }
        .oc-quote.is-calm { font-style: normal; color: var(--muted); font-size: 1rem; animation: oc-in 0.4s ease; }
        @keyframes oc-quote { from { opacity: 0; transform: translateY(6px); filter: blur(3px); } to { opacity: 1; transform: none; filter: none; } }
        .oc-mini-plan { display: grid; grid-template-columns: 1.3fr 2fr 2fr 1.5fr; gap: 6px; width: 100%; text-align: left; }
        .oc-mini-plan i { display: block; height: 8px; border-radius: 999px; transform-origin: left; transform: scaleX(0); animation: oc-bar-in 0.6s var(--ease) forwards; animation-delay: var(--k); }
        .oc-mini-plan div:nth-child(1) i { background: linear-gradient(90deg, #FFB199, var(--coral)); }
        .oc-mini-plan div:nth-child(2) i { background: linear-gradient(90deg, #F7C9A0, #F5C518); }
        .oc-mini-plan div:nth-child(3) i { background: linear-gradient(90deg, #FCEBB0, #BDEBC8); }
        .oc-mini-plan div:nth-child(4) i { background: linear-gradient(90deg, #BDEBC8, #16C45B); }
        .oc-mini-plan small, .oc-mini-plan b { display: block; opacity: 0; animation: oc-in 0.4s ease forwards; animation-delay: calc(var(--k) + 0.3s); }
        .oc-mini-plan small { margin-top: 7px; font-family: var(--font-geist-mono), monospace; font-size: 10.5px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted); }
        .oc-mini-plan b { margin-top: 2px; font-size: 0.9rem; color: var(--ink); }
        @keyframes oc-bar-in { to { transform: scaleX(1); } }
        @media (max-width: 520px) {
          .oc-mini-plan { grid-template-columns: 1fr 1fr; row-gap: 12px; }
          .oc-quote { font-size: 1.02rem; padding: 0 8px; }
        }

        /* the checklist */
        .oc-steps { list-style: none; margin: 18px 0 0; padding: 0; display: flex; flex-direction: column; gap: 8px; text-align: left; min-width: 290px; }
        .oc-steps li { display: flex; align-items: center; gap: 10px; font-size: 0.98rem; color: var(--muted); opacity: 0.45; transition: opacity 0.3s ease, color 0.3s ease; }
        .oc-steps li.is-on { opacity: 1; color: var(--ink); font-weight: 600; }
        .oc-steps li.is-done { opacity: 1; color: var(--body); }
        .oc-steps-mark { width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; border: 1.5px solid var(--line); }
        .oc-steps li.is-on .oc-steps-mark { border-color: var(--coral); border-top-color: transparent; animation: oc-spin 0.8s linear infinite; }
        .oc-steps li.is-done .oc-steps-mark { background: var(--coral); border-color: var(--coral); color: #fff; animation: oc-pop 0.3s cubic-bezier(.3,1.6,.5,1); }
        @keyframes oc-spin { to { transform: rotate(360deg); } }
        @keyframes oc-pop { from { transform: scale(0.4); } to { transform: scale(1); } }

        /* results */
        .oc-score { display: flex; align-items: baseline; gap: 12px; margin-top: 20px; }
        .oc-score b { font-size: clamp(4rem, 3rem + 4vw, 6rem); font-weight: 600; line-height: 0.9; letter-spacing: -0.04em; color: var(--coral); }
        .oc-score span { font-size: 1.1rem; color: var(--muted); }
        .oc-card { margin-top: 28px; background: #fff; border: 1px solid var(--line); border-radius: 20px; padding: 26px 28px; }
        .oc-card h2 { margin: 0 0 16px; font-size: 1.25rem; font-weight: 600; color: var(--ink); }
        .oc-row { display: grid; grid-template-columns: 170px minmax(0, 1fr) 44px; align-items: center; gap: 14px; padding: 9px 0; }
        .oc-row-name { font-size: 0.95rem; color: var(--ink); }
        .oc-row.is-weak .oc-row-name { font-weight: 600; }
        .oc-track { height: 10px; border-radius: 999px; background: var(--cream); overflow: hidden; }
        .oc-track i { display: block; height: 100%; border-radius: 999px; background: var(--ink); transition: width 0.8s var(--ease); }
        .oc-row.is-weak .oc-track i { background: var(--coral); }
        .oc-row-n { text-align: right; font-family: var(--font-geist-mono), monospace; font-size: 13px; font-weight: 600; color: var(--muted); }
        .oc-pri { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 18px; }
        .oc-pri li { display: grid; grid-template-columns: 34px minmax(0, 1fr); gap: 4px 14px; }
        .oc-pri-n { grid-row: span 2; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: var(--coral); color: #fff; font-weight: 700; }
        .oc-pri b { font-size: 1.05rem; color: var(--ink); }
        .oc-pri p { margin: 0; font-size: 1rem; line-height: 1.6; color: var(--body); }
        .oc-cta { margin-top: 28px; background: var(--ink); color: #fff; border-radius: 20px; padding: 30px 30px; display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 20px 32px; align-items: center; }
        .oc-cta h2 { margin: 0; font-size: 1.5rem; font-weight: 500; line-height: 1.25; color: #fff; }
        .oc-cta p { margin: 8px 0 0; color: rgba(255,255,255,0.78); line-height: 1.6; }
        .oc-cta.is-soft { background: #fff; color: var(--ink); border: 1px solid var(--line); }
        .oc-cta.is-soft h2 { color: var(--ink); }
        .oc-cta.is-soft p { color: var(--body); }
        .oc-mail { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 4px; }
        .oc-mail input { flex: 1; min-width: 220px; padding: 13px 16px; border-radius: 10px; border: 1.5px solid var(--line); font: inherit; font-size: 1rem; background: #fff; color: var(--ink); }
        .oc-mail input:focus { outline: none; border-color: var(--coral); }
        .oc-mail-note { margin: 12px 0 0; font-size: 0.92rem; color: var(--body); }
        .oc-mail-note.is-warn { color: #9a5b00; }
        .oc-tools { display: flex; flex-wrap: wrap; gap: 10px 22px; margin-top: 26px; }
        .oc-link { padding: 0; border: 0; background: none; cursor: pointer; font: inherit; font-size: 0.95rem; font-weight: 600; color: var(--ink); border-bottom: 1.5px solid var(--coral); }
        .oc-link:hover { color: var(--coral); }
        @media (max-width: 640px) {
          .oc { padding: 104px 0 56px; }
          .oc-row { grid-template-columns: 1fr 40px; row-gap: 6px; }
          .oc-row-name { grid-column: 1 / -1; }
          .oc-card { padding: 22px 20px; }
          .oc-cta { grid-template-columns: 1fr; padding: 26px 22px; }
        }
        @media (prefers-reduced-motion: reduce) { .oc-swap, .oc-slide-1, .oc-slide--1 { animation: none; } .oc-bar i, .oc-track i, .oc-opt { transition: none; } }
      `}</style>

      <div className="oc-wrap">
        {stage === "intro" && (
          <div className="oc-swap">
            <span className="oc-eyebrow">Ops Health Check · free · 2 minutes</span>
            <h1 className="oc-h1">Where is your operation <em>leaking?</em></h1>
            <p className="oc-lede">
              Nine questions on the six parts of your operating system. You get a score for each,
              and the three things to fix first. No email needed.
            </p>
            <ul className="oc-parts">
              {AREAS.map((a) => <li key={a.id}>{a.name}</li>)}
            </ul>
            <button type="button" className="btn-coral oc-start" onClick={() => setStage("questions")}>
              Start the check →
            </button>
            <p className="oc-note">Built from the same method I use in a paid Diagnostic.</p>
          </div>
        )}

        {stage === "questions" && (
          <div>
            <div className="oc-progress" aria-label={`Question ${step + 1} of ${QUESTIONS.length}`}>
              <div className="oc-bar"><i style={{ width: `${(step / QUESTIONS.length) * 100}%` }} /></div>
              <span className="oc-count">{step + 1} / {QUESTIONS.length}</span>
            </div>
            <div key={step} className={`oc-slide-${dir}`}>
              <p className="oc-eyebrow oc-area">{area.name}</p>
              <h1 className="oc-q">{q.q}</h1>
              <div className="oc-opts" role="group" aria-label="Answers">
                {q.options.map((o, i) => (
                  <button key={o.label} type="button" className="oc-opt" aria-pressed={answers[step] === i} onClick={() => choose(i)}>
                    <span className="oc-key" aria-hidden="true"><span className="oc-num">{i + 1}</span><span className="oc-tick">✓</span></span>
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
            {step > 0 && <button type="button" className="oc-back" onClick={() => { setDir(-1); setStep(step - 1); }}>← Back</button>}
          </div>
        )}

        {stage === "building" && (
          <Reveal
            byArea={scores.byArea}
            total={scores.total}
            weakest={weakest.map((w) => w.id)}
            quotes={QUESTIONS.map((q, i) => ({ label: q.options[answers[i]]?.label, score: q.options[answers[i]]?.score ?? 3, i }))
              .filter((x) => x.label)
              .sort((a, b) => a.score - b.score || a.i - b.i)
              .slice(0, 3)
              .map((x) => x.label as string)}
            onDone={showResults}
          />
        )}

        {stage === "results" && (
          <div className="oc-swap">
            <span className="oc-eyebrow">Your Ops Health Check</span>
            <div className="oc-score"><b>{scores.total}</b><span>out of 100</span></div>
            <h1 className="oc-h1" style={{ marginTop: 18 }}>{v.title}</h1>
            <p className="oc-lede">{v.line}</p>

            <div className="oc-card">
              <h2>The six parts</h2>
              {AREAS.map((a) => {
                const s = scores.byArea[a.id];
                const weak = weakest.some((w) => w.id === a.id);
                return (
                  <div key={a.id} className={`oc-row${weak ? " is-weak" : ""}`}>
                    <span className="oc-row-name">{a.name}</span>
                    <span className="oc-track"><i style={{ width: `${Math.max(4, (s / MAX_PER_AREA) * 100)}%` }} /></span>
                    <span className="oc-row-n">{s}/{MAX_PER_AREA}</span>
                  </div>
                );
              })}
            </div>

            <div className="oc-card">
              <h2>Fix these first</h2>
              <ol className="oc-pri">
                {weakest.map((a, i) => {
                  const s = scores.byArea[a.id];
                  const band = bandOf(s);
                  return (
                    <li key={a.id}>
                      <span className="oc-pri-n" aria-hidden="true">{i + 1}</span>
                      <b>{a.name}</b>
                      <p>{ADVICE[a.id][band]}</p>
                    </li>
                  );
                })}
              </ol>
            </div>

            {/* the level decides the message and how hard we ask (lib/opsCheck.ts) */}
            <div className={`oc-cta${v.cta.tone === "soft" ? " is-soft" : ""}`}>
              <div>
                <h2>{v.cta.heading}</h2>
                <p>{v.cta.body}</p>
              </div>
              <CalBookingButton className={v.cta.tone === "soft" ? "btn-ghost" : "btn-coral"}>{v.cta.button}</CalBookingButton>
            </div>

            {!EMAIL_ON ? (
              <div className="oc-card">
                <h2>Your full Ops Roadmap</h2>
                <p className="oc-mail-note" style={{ marginTop: 0, marginBottom: 16 }}>
                  Where you stand on all six parts, your first step for each, and the order I&apos;d fix them in. Save it as a PDF.
                </p>
                <a className="btn-coral" href={`/ops-check/report?a=${encode(answers)}`}>Open my full roadmap →</a>
              </div>
            ) : (
            <div className="oc-card">
              <h2>Email me this plan</h2>
              {sent === "connected" ? (
                <p className="oc-mail-note">Sent. Check your inbox for your plan.</p>
              ) : (
                <form className="oc-mail" onSubmit={sendPlan}>
                  <input type="email" required placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Your email" />
                  <button type="submit" className="btn-coral" disabled={sending}>{sending ? "Sending…" : "Send my plan"}</button>
                </form>
              )}
              {sent === "not-connected" && <p className="oc-mail-note is-warn">Email isn&apos;t connected yet (preview). Nothing was sent or saved.</p>}
              {sent === "error" && <p className="oc-mail-note is-warn">That didn&apos;t go through. Please try again.</p>}
              {sent === null && <p className="oc-mail-note">Your scores and the three fixes, plus a short note from me now and then. Unsubscribe anytime.</p>}
            </div>
            )}

            <div className="oc-tools">
              <button type="button" className="oc-link" onClick={copyLink}>{copied ? "Link copied" : "Copy a link to this result"}</button>
              <button type="button" className="oc-link" onClick={restart}>Take it again</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
