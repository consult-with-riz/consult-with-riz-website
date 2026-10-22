"use client";
import { useEffect, useMemo, useState } from "react";
import CalBookingButton from "@/components/CalModal";
import { AREAS, QUESTIONS, ADVICE, MAX_PER_AREA, MAX_TOTAL, verdict, type AreaId } from "@/lib/opsCheck";

/**
 * The Ops Health Check. Intro → twelve questions, one at a time → results.
 *
 * Results show straight away, no email needed: a score out of 100, one bar
 * per part of the operating system, and the three weakest parts with what
 * to do next. The email box only sends the plan (not connected yet), and
 * every result has its own link (?a=…) so it can be shared or sent to Riz.
 */

type Stage = "intro" | "questions" | "results";

// The email step switches on once the newsletter is connected
// (NEXT_PUBLIC_OPS_EMAIL=on). Until then the results link straight to the
// full roadmap, so no visitor is shown a form that goes nowhere.
const EMAIL_ON = process.env.NEXT_PUBLIC_OPS_EMAIL === "on";

const encode = (a: number[]) => a.join("");
const decode = (s: string | null): number[] | null => {
  if (!s || s.length !== QUESTIONS.length || !/^[0-3]+$/.test(s)) return null;
  return s.split("").map(Number);
};

export default function OpsCheck() {
  const [stage, setStage] = useState<Stage>("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(QUESTIONS.length).fill(-1));
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState<null | "connected" | "not-connected" | "error">(null);
  const [sending, setSending] = useState(false);

  // a shared result link opens straight on the results
  useEffect(() => {
    const a = decode(new URLSearchParams(window.location.search).get("a"));
    if (a) { setAnswers(a); setStage("results"); }
  }, []);

  const scores = useMemo(() => {
    const byArea = Object.fromEntries(AREAS.map((a) => [a.id, 0])) as Record<AreaId, number>;
    QUESTIONS.forEach((q, i) => { if (answers[i] >= 0) byArea[q.area] += q.options[answers[i]].score; });
    const raw = Object.values(byArea).reduce((s, n) => s + n, 0);
    return { byArea, total: Math.round((raw / MAX_TOTAL) * 100) };
  }, [answers]);

  const weakest = useMemo(
    () => [...AREAS].sort((a, b) => scores.byArea[a.id] - scores.byArea[b.id]).slice(0, 3),
    [scores],
  );

  const choose = (opt: number) => {
    const next = [...answers]; next[step] = opt; setAnswers(next);
    setTimeout(() => {
      if (step < QUESTIONS.length - 1) setStep(step + 1);
      else {
        setStage("results");
        const url = new URL(window.location.href); url.searchParams.set("a", encode(next));
        window.history.replaceState(null, "", url);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 220);
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
        body: JSON.stringify({ email, answers: encode(answers), total: scores.total, byArea: scores.byArea, weakest: weakest[0].id }),
      });
      const data = await res.json();
      setSent(res.ok ? (data.connected ? "connected" : "not-connected") : "error");
    } catch { setSent("error"); }
    setSending(false);
  };

  const q = QUESTIONS[step];
  const area = AREAS.find((a) => a.id === q.area)!;
  const v = verdict(scores.total);

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
        @media (prefers-reduced-motion: reduce) { .oc-swap { animation: none; } .oc-bar i, .oc-track i, .oc-opt { transition: none; } }
      `}</style>

      <div className="oc-wrap">
        {stage === "intro" && (
          <div className="oc-swap">
            <span className="oc-eyebrow">Ops Health Check · free · 3 minutes</span>
            <h1 className="oc-h1">Where is your operation <em>leaking?</em></h1>
            <p className="oc-lede">
              Twelve questions across the six parts of a company&apos;s operating system. You get a
              score for each, and the three things to fix first. No email needed to see your result.
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
            <div key={step} className="oc-swap">
              <p className="oc-eyebrow oc-area">{area.name}</p>
              <h1 className="oc-q">{q.q}</h1>
              <div className="oc-opts" role="group" aria-label="Answers">
                {q.options.map((o, i) => (
                  <button key={o.label} type="button" className="oc-opt" aria-pressed={answers[step] === i} onClick={() => choose(i)}>
                    <span className="oc-key" aria-hidden="true">{i + 1}</span>
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
            {step > 0 && <button type="button" className="oc-back" onClick={() => setStep(step - 1)}>← Back</button>}
          </div>
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
                  const band = s <= 2 ? "low" : s <= 4 ? "mid" : "high";
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

            <div className="oc-cta">
              <div>
                <h2>Want help fixing &ldquo;{weakest[0].name.toLowerCase()}&rdquo;?</h2>
                <p>Thirty minutes, free. Bring this result and you&apos;ll leave with a straight answer on what to do next. No pitch.</p>
              </div>
              <CalBookingButton className="btn-coral">Book a free 30-min fit call →</CalBookingButton>
            </div>

            {!EMAIL_ON ? (
              <div className="oc-card">
                <h2>Your full Ops Roadmap</h2>
                <p className="oc-mail-note" style={{ marginTop: 0, marginBottom: 16 }}>
                  What each of the six parts means, where you stand, your first step for each, and the order I&apos;d fix them in over 90 days. You can save it as a PDF.
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
