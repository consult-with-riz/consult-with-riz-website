"use client";
import { useEffect, useRef, useState } from "react";
import { caseRows, LOGOS, splitTag, areaLabel } from "@/lib/caseStudies";
import { testimonials } from "@/components/Testimonials";

const AREAS = Array.from(new Set(caseRows.map((r) => r.area)));

/**
 * Cases · variation D, "split view". The seven cases as a list on the left;
 * the chosen one told in full on the right, in the order the heading
 * promises: the problem, what I did, what moved. One case on screen at a
 * time, so the section is a screen tall instead of a wall of cards.
 * Below 960px the list becomes a scrollable row of chips above the story.
 * Filter chips above narrow the list by problem; they earn more as cases
 * are added. A case with a client testimonial links to it.
 */
export default function CasesD() {
  const [sel, setSel] = useState(0);
  const [filter, setFilter] = useState<string | null>(null);
  const rows = filter ? caseRows.filter((r) => r.area === filter) : caseRows;
  const sectionRef = useRef<HTMLElement>(null);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // ?case=cs-0X opens that case and brings the section into view. Read once
  // in the browser, so the server can still render every case.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("case");
    if (!id) return;
    const i = caseRows.findIndex((r) => r.id === id);
    if (i === -1) return;
    setFilter(null);
    setSel(i);
    requestAnimationFrame(() => sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }, []);

  const pick = (i: number, focus = false) => {
    const n = (i + rows.length) % rows.length;
    setSel(n);
    if (focus) tabsRef.current[n]?.focus();
    // keep a chosen chip visible in the phone row; never move the page
    const tab = tabsRef.current[n], list = tab?.parentElement;
    if (tab && list && list.scrollWidth > list.clientWidth) {
      const gap = tab.getBoundingClientRect().left - list.getBoundingClientRect().left - 24;
      list.scrollBy({ left: gap, behavior: "smooth" });
    }
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); pick(sel + 1, true); }
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); pick(sel - 1, true); }
    if (e.key === "Home") { e.preventDefault(); pick(0, true); }
    if (e.key === "End") { e.preventDefault(); pick(rows.length - 1, true); }
  };

  const choose = (area: string | null) => { setFilter(area); setSel(0); };
  const row = rows[Math.min(sel, rows.length - 1)];
  const quote = row.testimonialId ? testimonials.find((t) => t.id === row.testimonialId) : undefined;
  const { company } = splitTag(row.tag);
  const [lead, ...rest] = row.details.outcomes;

  return (
    <section ref={sectionRef} className="cd-section" style={{ scrollMarginTop: 80 }}>
      <style>{`
        .cd-section { padding: var(--section-pad) 0; background: var(--paper); border-top: 1px solid var(--line); }
        .cd-anchors { position: relative; height: 0; }
        .cd-anchors span { position: absolute; top: 0; left: 0; scroll-margin-top: 230px; }
        .cd-wrap { display: grid; grid-template-columns: 340px minmax(0, 1fr); gap: 28px; align-items: start; margin-top: var(--heading-gap); }

        /* ── filter chips ── */
        .cd-chips { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-top: 28px; }
        .cd-chip {
          padding: 8px 16px; border-radius: 999px; border: 1px solid var(--line); background: #fff;
          font: inherit; font-size: 0.92rem; font-weight: 500; color: var(--ink); cursor: pointer;
          transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
        }
        .cd-chip:hover { border-color: var(--ink); }
        .cd-chip[aria-pressed="true"] { background: var(--ink); border-color: var(--ink); color: #fff; }
        .cd-chip:focus-visible { outline: 2px solid var(--coral); outline-offset: 2px; }
        .cd-count { margin: 14px 0 0; text-align: center; font-family: var(--font-geist-mono), monospace; font-size: 12px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); }
        .cd-quote-link {
          display: inline-flex; align-items: center; gap: 6px; margin-top: 16px;
          font-size: 0.92rem; font-weight: 600; color: var(--coral); text-decoration: none;
        }
        .cd-quote-link:hover { text-decoration: underline; }
        .cd-quote-link span { transition: transform 0.2s ease; }
        .cd-quote-link:hover span { transform: translateX(3px); }

        /* ── the list ── */
        .cd-list { position: relative; display: flex; flex-direction: column; gap: 6px; }
        .cd-tab {
          position: relative; display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 2px 12px; align-items: center;
          width: 100%; padding: 14px 16px 14px 20px; text-align: left; cursor: pointer;
          font: inherit; color: var(--ink); background: transparent; border: 1px solid transparent; border-radius: 14px;
          transition: background 0.2s ease, border-color 0.2s ease;
        }
        .cd-tab::before {
          content: ""; position: absolute; left: 0; top: 12px; bottom: 12px; width: 3px; border-radius: 3px;
          background: var(--coral); transform: scaleY(0); transition: transform 0.25s var(--ease);
        }
        .cd-tab:hover { background: rgba(255,255,255,0.6); }
        .cd-tab[aria-selected="true"] { background: #fff; border-color: var(--line); box-shadow: 0 10px 26px -18px rgba(34,51,44,0.35); }
        .cd-tab[aria-selected="true"]::before { transform: scaleY(1); }
        .cd-tab:focus-visible { outline: 2px solid var(--coral); outline-offset: 2px; }
        .cd-tab-co { display: flex; align-items: center; gap: 8px; min-width: 0; }
        .cd-tab-co img { height: 16px; width: auto; max-width: 64px; object-fit: contain; display: block; }
        .cd-tab-coname { font-size: 13px; font-weight: 600; color: var(--ink); }
        .cd-tab-area { font-family: var(--font-geist-mono), monospace; font-size: 10.5px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .cd-tab-num { grid-row: span 2; align-self: center; font-size: 1.05rem; font-weight: 600; color: var(--coral); white-space: nowrap; }
        .cd-tab-title { grid-column: 1; font-size: 0.95rem; font-weight: 500; line-height: 1.3; color: var(--ink); }

        /* ── the story ── */
        .cd-panel {
          position: sticky; top: 96px;
          background: #fff; border: 1px solid var(--line); border-radius: 24px;
          padding: 34px 38px 30px; box-shadow: 0 24px 60px -34px rgba(34,51,44,0.35);
        }
        .cd-swap { animation: cd-in 0.4s var(--ease); }
        @keyframes cd-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        .cd-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
        .cd-head-co { display: flex; align-items: center; gap: 10px; }
        .cd-head-co img { height: 22px; width: auto; max-width: 90px; object-fit: contain; display: block; }
        .cd-head-co b { font-size: 15px; color: var(--ink); }
        .cd-where { font-family: var(--font-geist-mono), monospace; font-size: 12px; color: var(--muted); }
        .cd-lead { display: flex; align-items: baseline; gap: 14px; flex-wrap: wrap; margin-top: 18px; }
        .cd-lead-num { font-size: clamp(2.6rem, 1.8rem + 2.4vw, 3.8rem); font-weight: 600; line-height: 1; letter-spacing: -0.03em; color: var(--ink); }
        .cd-lead-label { font-size: 1rem; color: var(--body); }
        .cd-title { margin: 12px 0 0; font-size: clamp(1.3rem, 1.1rem + 0.6vw, 1.6rem); font-weight: 600; line-height: 1.2; color: var(--ink); }

        /* the three steps, linked by a thin line */
        .cd-steps { list-style: none; margin: 26px 0 0; padding: 0; position: relative; }
        .cd-steps::before { content: ""; position: absolute; left: 13px; top: 14px; bottom: 14px; width: 2px; background: linear-gradient(var(--line), rgba(255,92,53,0.5)); }
        .cd-step { position: relative; display: grid; grid-template-columns: 28px minmax(0, 1fr); gap: 0 16px; padding-bottom: 22px; }
        .cd-step:last-child { padding-bottom: 0; }
        .cd-marker {
          position: relative; z-index: 1; width: 28px; height: 28px; border-radius: 50%;
          display: inline-flex; align-items: center; justify-content: center;
          font-family: var(--font-geist-mono), monospace; font-size: 12px; font-weight: 700;
          background: #fff; color: var(--ink); border: 2px solid var(--line);
        }
        .cd-step.is-moved .cd-marker { background: var(--coral); border-color: var(--coral); color: #fff; }
        .cd-label { margin: 3px 0 8px; font-family: var(--font-geist-mono), monospace; font-size: 12.5px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink); }
        .cd-step.is-moved .cd-label { color: var(--coral); }
        .cd-problem { margin: 0; font-size: 1rem; line-height: 1.6; color: var(--body); }
        .cd-did { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
        .cd-did li { display: flex; gap: 10px; font-size: 1rem; line-height: 1.5; color: var(--ink); }
        .cd-did li::before { content: "→"; color: var(--coral); flex-shrink: 0; }
        .cd-moved { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; }
        .cd-metric { background: var(--cream); border-radius: 14px; padding: 14px 16px; }
        .cd-metric b { display: block; font-size: 1.7rem; font-weight: 600; line-height: 1.05; letter-spacing: -0.02em; color: var(--ink); }
        .cd-metric span { display: block; margin-top: 4px; font-size: 0.86rem; line-height: 1.4; color: var(--body); }
        .cd-take { margin: 24px 0 0; padding: 14px 18px; border-radius: 14px; background: var(--peach); font-size: 0.98rem; line-height: 1.55; color: var(--ink); }
        .cd-take strong { color: var(--coral); font-weight: 600; margin-right: 6px; }

        @media (max-width: 959px) {
          .cd-wrap { grid-template-columns: minmax(0, 1fr); gap: 16px; }
          .cd-list {
            flex-direction: row; gap: 8px; overflow-x: auto; scroll-snap-type: x proximity; scroll-padding-inline: var(--gutter, 24px);
            margin: 0 calc(var(--gutter, 24px) * -1); padding: 4px var(--gutter, 24px) 10px; scrollbar-width: none;
          }
          .cd-list::-webkit-scrollbar { display: none; }
          .cd-tab {
            flex: 0 0 auto; width: auto; max-width: 230px; scroll-snap-align: start;
            grid-template-columns: auto; padding: 10px 14px; border-color: var(--line); background: rgba(255,255,255,0.55);
          }
          .cd-tab::before { left: 14px; right: 14px; top: auto; bottom: 0; width: auto; height: 3px; transform: scaleX(0); }
          .cd-tab[aria-selected="true"]::before { transform: scaleX(1); }
          .cd-tab-num { grid-row: auto; font-size: 0.95rem; }
          .cd-tab-title { display: none; }
          .cd-panel { position: static; padding: 26px 20px 22px; border-radius: 20px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cd-swap { animation: none; }
          .cd-tab, .cd-tab::before { transition: none; }
        }
      `}</style>

      <div className="max-w-site">
        <div className="block-head is-center">
          <h2 className="block-title">
            The metrics, and <span className="text-ramp">things I moved.</span>
          </h2>
        </div>

        <div className="cd-chips" role="group" aria-label="Filter cases by problem">
          <button type="button" className="cd-chip" aria-pressed={filter === null} onClick={() => choose(null)}>All</button>
          {AREAS.map((a) => (
            <button key={a} type="button" className="cd-chip" aria-pressed={filter === a} onClick={() => choose(a)}>
              {areaLabel(a)}
            </button>
          ))}
        </div>
        <p className="cd-count" aria-live="polite">
          {rows.length} {rows.length === 1 ? "case" : "cases"}
          {filter ? ` · ${areaLabel(filter)}` : ""}
        </p>

        {/* ?case= links scroll to the case's id; every id sits here, at the
            top of the cases, so the heading and the story land in view */}
        <div className="cd-anchors" aria-hidden="true">
          {caseRows.map((r) => <span key={r.id} id={r.id} />)}
        </div>
        <div className="cd-wrap">
          <div className="cd-list" role="tablist" aria-label="Case studies" aria-orientation="vertical" onKeyDown={onKey}>
            {rows.map((r, i) => {
              const { company: co } = splitTag(r.tag);
              const on = r.id === row.id;
              return (
                <button
                  key={r.id}
                  id={`${r.id}-tab`}
                  ref={(el) => { tabsRef.current[i] = el; }}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  aria-controls="cd-panel"
                  tabIndex={on ? 0 : -1}
                  className="cd-tab"
                  onClick={() => pick(i)}
                >
                  <span className="cd-tab-co">
                    {LOGOS[co] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={LOGOS[co]} alt={co} />
                    ) : (
                      <span className="cd-tab-coname">{co}</span>
                    )}
                    <span className="cd-tab-area">{areaLabel(r.area)}</span>
                  </span>
                  <span className="cd-tab-num">{r.details.outcomes[0].number}</span>
                  <span className="cd-tab-title">{r.title}</span>
                </button>
              );
            })}
          </div>

          <div id="cd-panel" className="cd-panel" role="tabpanel" aria-labelledby={`${row.id}-tab`} aria-live="polite">
            <div key={row.id} className="cd-swap">
              <div className="cd-head">
                <span className="cd-head-co">
                  {LOGOS[company] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={LOGOS[company]} alt={company} />
                  ) : (
                    <b>{company}</b>
                  )}
                </span>
                <span className="cd-where">{row.details.where.split("·").pop()?.trim()}</span>
              </div>

              <div className="cd-lead">
                <span className="cd-lead-num">{lead.number}</span>
                <span className="cd-lead-label">{lead.label}</span>
              </div>
              <h3 className="cd-title">{row.title}</h3>

              <ol className="cd-steps">
                <li className="cd-step">
                  <span className="cd-marker" aria-hidden="true">1</span>
                  <div>
                    <p className="cd-label">The problem</p>
                    <p className="cd-problem">{row.details.situation.join(". ")}.</p>
                  </div>
                </li>
                <li className="cd-step">
                  <span className="cd-marker" aria-hidden="true">2</span>
                  <div>
                    <p className="cd-label">What I did</p>
                    <ul className="cd-did">
                      {row.details.did.map((d) => <li key={d}>{d}</li>)}
                    </ul>
                  </div>
                </li>
                <li className="cd-step is-moved">
                  <span className="cd-marker" aria-hidden="true">3</span>
                  <div>
                    <p className="cd-label">What moved</p>
                    <div className="cd-moved">
                      {/* the lead figure is already the headline; this shows what else moved */}
                      {(rest.length ? rest : [lead]).map((m) => (
                        <div key={m.label} className="cd-metric">
                          <b>{m.number}</b>
                          <span>{m.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </li>
              </ol>

              <p className="cd-take">
                <strong>For a founder:</strong>
                {row.details.takeaway}
              </p>
              {quote && (
                <a className="cd-quote-link" href={`#${quote.id}`}>
                  Read {quote.name.split(" ")[0]}&apos;s testimonial <span aria-hidden="true">→</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
