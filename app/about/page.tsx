"use client";
import { Fragment, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import AnimateIn from "@/components/AnimateIn";
import Link from "next/link";
import { Mic, Globe, Languages, Handshake, BadgeCheck } from "lucide-react";
import { useParallax, useScrollFadeOut } from "@/hooks/useParallax";

const pills = [
  { label: "Careem", logo: "/logos/careem.png" },
  { label: "Bolt", logo: "/logos/bolt.png" },
  { label: "Wise", logo: "/logos/wise.svg" },
];

const timeline = [
  {
    year: "2014",
    company: "AIESEC",
    body: "Ran business development for a student organisation. First time owning a number someone else depended on.",
    quote: "People rarely lack information. They lack a system for using it.",
  },
  {
    year: "2015",
    company: "Perbal Clothing",
    body: "Started a clothing brand in Pakistan and ran it for two years. Sourcing, cash, stock, people. All of it, badly at first.",
    quote: "A good product with bad operations is just an expensive hobby.",
  },
  {
    year: "2016",
    company: "ACCA",
    body: "Qualified in accounting. The reason I read a P&L before I read a roadmap.",
    quote: "Every number has a story. Someone is usually telling the wrong one.",
  },
  {
    year: "2017",
    company: "S&P Global",
    body: "Insurance operations at a Fortune 500 data firm. 2,000+ client cases worked across Product, Support and Content.",
    quote: "Two years watching how large organisations actually run. Slowly, and on top of somebody's undocumented spreadsheet.",
  },
  {
    year: "2019",
    company: "Careem",
    body: "Operations at the Middle East's ride-hailing company. Built emergency dispatch with the KPK Ministry of Health.",
    quote: "Dispatch time went from three minutes to twenty seconds. In that job, the process was the product.",
  },
  {
    year: "2020",
    company: "Motive",
    body: "Corporate strategy at a US fleet-tech company. Took a certified ELD product into Canada.",
    quote: "‘Launch a market’ is thirty unglamorous tasks wearing one word.",
  },
  {
    year: "2021",
    company: "Bolt, and Tallinn",
    body: "Moved to Estonia to run courier operations for Bolt Food.",
    quote: "Landed in Tallinn in November and never left.",
  },
  {
    year: "2022",
    company: "Bolt, under pressure",
    body: "Courier cost became the most urgent number in the business. I owned it.",
    quote: "Six months later: 21% to 14% of GMV across 20 countries. $3.9M saved. Constraint is the best operator I've worked with.",
  },
  {
    year: "2023",
    company: "Bolt, at scale",
    body: "Courier reporting frameworks in 15 countries. Worked across policy and legal on the EU Platform Workers' Directive.",
    quote: "80%+ compliance without stopping the business. Two microservices cut the manual effort by 70%.",
  },
  {
    year: "2025",
    company: "Wise",
    body: "Finance operations. Month-end close from eight days to three. ~92% straight-through reconciliation.",
    quote: "Manual journals down 65%. The fastest close is the one nobody has to chase.",
  },
  {
    year: "2025",
    company: "Independent",
    body: "Went independent. Designing AI workflow automations for founder-led teams: 20+ workflows live across 7+ clients.",
    quote: "Around 40 hours a week of manual work removed per engagement. Fix the process, then automate it.",
  },
  {
    year: "Now",
    company: "Fractional COO",
    body: "Sitting next to founders as a fractional COO or Chief of Staff. I run the operations so the founder can run the company.",
    quote: "And whatever repeats gets automated before I leave.",
  },
];

const trackRecordStats = [
  {
    target: 3.9,
    prefix: "$",
    suffix: "M",
    decimals: 1,
    label: "COURIER COSTS SAVED",
    context: "Bolt · 6 months · 20 countries",
    delay: "0s",
  },
  {
    target: 92,
    prefix: "",
    suffix: "%",
    decimals: 0,
    label: "STRAIGHT-THROUGH PROCESSING",
    context: "Wise · Finance",
    delay: "0.5s",
  },
  {
    target: 20,
    prefix: "",
    suffix: "s",
    decimals: 0,
    label: "DISPATCH TIME (WAS 3 MIN)",
    context: "Careem · Logistics",
    delay: "1s",
  },
  {
    target: 3,
    prefix: "",
    suffix: " days",
    decimals: 0,
    label: "MONTH-END CLOSE (WAS 8)",
    context: "Wise · Finance ops",
    delay: "1.5s",
  },
];

type BeyondFact = {
  icon: typeof Mic;
  title: string;
  body: string;
  extra?: string;
  linkText?: string;
  linkHref?: string;
};

const beyondFacts: BeyondFact[] = [
  {
    icon: Mic,
    title: "Stand-up",
    body: "I do stand-up in Tallinn. Same skill as a leadership meeting: read the room, cut what isn't landing.",
  },
  {
    icon: Globe,
    title: "Remote, from Tallinn",
    body: "Pakistan, the Gulf, Europe. Base is Estonia since 2021.",
    extra: "I work with founders across Europe, the UK and the Middle East.",
  },
  {
    icon: Languages,
    title: "Estonian, slowly",
    body: "Wrestling it into submission. It’s winning.",
    extra: "B1 by end of 2027. Probably.",
  },
  {
    icon: Handshake,
    title: "Fractional, already",
    body: "Product Manager at Shaping Wealth, working on Lydia, an AI coaching platform for financial advisors.",
    extra: "Embedded part-time in someone else's team. The same model I offer you.",
  },
];

const lessons = [
  {
    title: "Cadence beats heroics.",
    body: "A weekly rhythm that runs without the founder does more than any all-nighter.",
    accent: "#e8431b",
    rotate: -1.5,
    offsetY: 0,
  },
  {
    title: "The bottleneck is usually the process.",
    body: "Not the people. Not the tools. The process nobody wants to admit is broken.",
    accent: "#5E7145",
    rotate: 1.2,
    offsetY: 18,
  },
  {
    title: "One owner per number.",
    body: "If two people own a metric, nobody does. Name the person, then the dashboard.",
    accent: "#2E7C74",
    rotate: -1,
    offsetY: -8,
  },
  {
    title: "Document everything.",
    body: "If it lives in one person's head, it isn't a process. It's a risk. Write it down.",
    accent: "#8C6A1E",
    rotate: 1.6,
    offsetY: 6,
  },
  {
    title: "Automation amplifies what's already there.",
    body: "Good thinking gets better. Muddled thinking gets louder. Choose which one to scale.",
    accent: "#B5576B",
    rotate: -1.8,
    offsetY: 20,
  },
  {
    title: "Fix it, then automate it.",
    body: "Automate a broken process and you get the same mess, faster. Order matters.",
    accent: "#3E6B4F",
    rotate: 1,
    offsetY: -4,
  },
];

function ParallaxLayer({
  children,
  speed,
  className = "",
}: {
  children: ReactNode;
  speed: number;
  className?: string;
}) {
  const ref = useParallax<HTMLDivElement>(speed);

  return (
    <div ref={ref} className={className} data-parallax>
      {children}
    </div>
  );
}

function StatRow({
  stat,
  trigger,
}: {
  stat: (typeof trackRecordStats)[number];
  trigger: boolean;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    const duration = 2000;
    let start: number | undefined;
    let raf: number;

    function tick(ts: number) {
      if (start === undefined) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(stat.target * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [trigger, stat.target]);

  return (
    <div
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        padding: "20px 0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span
        style={{
          fontSize: 32,
          fontWeight: 500,
          color: "var(--coral)",
        }}
      >
        {stat.prefix}
        {display.toFixed(stat.decimals)}
        {stat.suffix}
      </span>
      <span style={{ textAlign: "right" }}>
        <span
          className="meta-label meta-label--inverse"
          style={{ display: "block", lineHeight: 1.4 }}
        >
          {stat.label}
        </span>
        <span
          style={{
            display: "block",
            fontSize: 14,
            color: "rgba(243,236,221,0.75)",
            letterSpacing: "0.08em",
            marginTop: 2,
          }}
        >
          {stat.context}
        </span>
      </span>
    </div>
  );
}

function TrackRecordPanel() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        background: "#22332C",
        borderRadius: 20,
        padding: "40px 36px",
      }}
    >
      <p
        style={{
          fontSize: 14,
          color: "#ff5c35",
          letterSpacing: "0.12em",
          marginBottom: 32,
        }}
      >
        TRACK RECORD
      </p>

      {trackRecordStats.map((stat) => (
        <StatRow key={stat.label} stat={stat} trigger={inView} />
      ))}

      <div
        style={{
          marginTop: 28,
          paddingTop: 20,
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <p
          style={{
            fontSize: 14,
            color: "rgba(243,236,221,0.72)",
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          Ten years inside high-growth operations. The numbers moved because the operating system did.
        </p>
      </div>
    </div>
  );
}

export default function About() {
  const heroFadeRef = useScrollFadeOut<HTMLDivElement>(380);
  const [openTimelineIndexes, setOpenTimelineIndexes] = useState<Set<number>>(
    new Set()
  );

  const toggleTimelineItem = (index: number) => {
    setOpenTimelineIndexes((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const openEverything = () => {
    setOpenTimelineIndexes((prev) =>
      prev.size === timeline.length
        ? new Set()
        : new Set(timeline.map((_, i) => i))
    );
  };

  return (
    <>
      {/* HERO */}
      <section
        className="about-hero-section"
        style={{
          background: "#FFFFFF",
          padding: "112px 0",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <div
          ref={heroFadeRef}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 64,
            alignItems: "center",
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 60px",
          }}
          className="about-hero-grid"
        >
          {/* Photo */}
          <AnimateIn>
            <div className="about-photo-single">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/Photos/riz-lake.jpg"
                alt="Rizwan Mahmood on a boat, sunglasses on, with the city skyline behind him"
                style={{ objectPosition: "center 20%" }}
              />
            </div>
          </AnimateIn>

          {/* Text */}
          <div>
            <AnimateIn delay={60}>
              <h1
                style={{
                  fontSize: "clamp(3rem, 5vw, 4.25rem)",
                  fontWeight: 500,
                  color: "#22332C",
                  lineHeight: 1.05,
                  marginBottom: 4,
                }}
              >
                Operator. Second-in-command.
              </h1>
            </AnimateIn>

            <AnimateIn delay={120}>
              <p
                style={{
                  fontSize: 24,
                  fontWeight: 600,
                  color: "#ff5c35",
                  marginBottom: 28,
                }}
              >
                Fractional COO and Chief of Staff.
              </p>
            </AnimateIn>

            <AnimateIn delay={180}>
              <p
                style={{
                  fontSize: 18,
                  color: "rgba(34,51,44,0.75)",
                  lineHeight: 1.7,
                  marginBottom: 12,
                }}
              >
                Ten years inside high-growth operations. ACCA. S&amp;P Global. Careem. Motive. Bolt. Wise.
              </p>
            </AnimateIn>

            <AnimateIn delay={240}>
              <p
                style={{
                  fontSize: 18,
                  color: "rgba(34,51,44,0.75)",
                  lineHeight: 1.7,
                  marginBottom: 12,
                }}
              >
                Now I sit next to founders and run the parts of the company they shouldn&apos;t be running. Cadence. Metrics. Cost. Process.
              </p>
            </AnimateIn>

            <AnimateIn delay={300}>
              <p
                style={{
                  fontSize: 18,
                  color: "rgba(34,51,44,0.75)",
                  lineHeight: 1.7,
                  marginBottom: 12,
                }}
              >
                The difference: whatever repeats gets automated before I leave. I design those systems myself, on n8n and Claude. You keep systems that run, not a deck.
              </p>
            </AnimateIn>

            <AnimateIn delay={360}>
              <div className="about-credentials">
                <p className="about-credentials-label">TRACK RECORD</p>
                <div className="about-credentials-row">
                  {pills.map((pill, i) => {
                    const featured = pill.label === "Anthropic Partner";
                    return (
                      <Fragment key={pill.label}>
                        {i > 0 && (
                          <span aria-hidden="true" className="about-credentials-dot">
                            &middot;
                          </span>
                        )}
                        <span className={featured ? "about-pill about-pill-featured" : "about-pill"}>
                          {pill.logo && (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={pill.logo}
                              alt={pill.label}
                              className="about-pill-logo"
                            />
                          )}
                          {featured && (
                            <BadgeCheck
                              size={14}
                              strokeWidth={2.25}
                              className="about-pill-icon"
                            />
                          )}
                          {featured || !pill.logo ? pill.label : null}
                        </span>
                      </Fragment>
                    );
                  })}
                </div>
              </div>
            </AnimateIn>

            <AnimateIn delay={420}>
              <Link href="/services" className="about-cta">
                How I work with founders
              </Link>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 80,
          alignItems: "start",
          padding: "112px 60px",
          background: "white",
          maxWidth: 1200,
          margin: "0 auto",
        }}
        className="longer-version-grid"
      >
        {/* LEFT - timeline */}
        <div>
          <AnimateIn>
            <h2
              style={{
                fontSize: 36,
                fontWeight: 500,
                color: "#22332C",
                opacity: 1,
                marginBottom: 12,
              }}
            >
              How I got here.
            </h2>
          </AnimateIn>

          <AnimateIn delay={40}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                marginBottom: 32,
              }}
            >
              <p
                style={{
                  fontSize: 14,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--ink)",
                  opacity: 0.55,
                  margin: 0,
                }}
              >
                From owning one number to owning the operation
              </p>
              <button
                type="button"
                onClick={openEverything}
                className="open-everything-btn"
              >
                {openTimelineIndexes.size === timeline.length
                  ? "Close everything"
                  : "Open everything"}
              </button>
            </div>
          </AnimateIn>

          {timeline.map((item, i) => {
            const isOpen = openTimelineIndexes.has(i);
            return (
              <AnimateIn key={`${item.year}-${item.company}`} delay={i * 60}>
                <div
                  className={`timeline-item${isOpen ? " is-open" : ""}`}
                  style={{
                    borderLeft: "2px solid var(--line)",
                    paddingLeft: 28,
                    marginBottom: 8,
                    position: "relative",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: -5,
                      top: 6,
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: isOpen ? "#ff5c35" : "var(--line)",
                    }}
                  />
                  <button
                    type="button"
                    className="timeline-toggle"
                    onClick={() => toggleTimelineItem(i)}
                    aria-expanded={isOpen}
                    aria-controls={`timeline-panel-${i}`}
                  >
                    <span className="timeline-toggle-label">
                      <span
                        style={{
                          fontSize: 14,
                          color: "#ff5c35",
                          letterSpacing: "0.12em",
                        }}
                      >
                        {item.year}
                      </span>
                      <span
                        style={{
                          fontSize: 18,
                          fontWeight: 600,
                          color: "#22332C",
                        }}
                      >
                        {item.company}
                      </span>
                    </span>
                    <span className="timeline-caret" aria-hidden="true">
                      ▾
                    </span>
                  </button>

                  <div id={`timeline-panel-${i}`} className="timeline-panel">
                    <div className="timeline-panel-inner">
                      <p
                        style={{
                          fontSize: 14,
                          fontWeight: 400,
                          color: "var(--ink)",
                          opacity: 1,
                          lineHeight: 1.65,
                          margin: "0 0 8px",
                        }}
                      >
                        {item.body}
                      </p>
                      {item.quote && (
                        <p
                          style={{
                            fontSize: 14,
                            color: "var(--ink)",
                            opacity: 0.65,
                            lineHeight: 1.6,
                            margin: 0,
                            paddingLeft: 16,
                            borderLeft: "2px solid rgba(255,92,53, 0.35)",
                          }}
                        >
                          {item.quote}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </AnimateIn>
            );
          })}
        </div>

        {/* RIGHT - animated stats panel */}
        <div style={{ position: "sticky", top: 100 }} className="track-record-sticky">
          <TrackRecordPanel />
        </div>
      </section>

      {/* SECTION - OPERATOR NOTES */}
      <section className="lessons-section" style={{ background: "var(--cream)", padding: "112px 60px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <AnimateIn delay={60}>
            <h2
              style={{
                fontSize: 36,
                fontWeight: 500,
                color: "#22332C",
                marginBottom: 48,
              }}
            >
              How I run operations.
            </h2>
          </AnimateIn>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 28,
            }}
            className="lessons-grid"
          >
            {lessons.map((lesson, i) => (
              <AnimateIn key={lesson.title} delay={i * 90}>
                <div
                  className="lesson-card"
                  style={
                    {
                      "--lesson-rotate": `${lesson.rotate}deg`,
                      "--lesson-offset": `${lesson.offsetY}px`,
                      "--lesson-accent": lesson.accent,
                    } as CSSProperties
                  }
                >
                  <p className="lesson-card-number">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: "#22332C",
                      marginBottom: 8,
                    }}
                  >
                    {lesson.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 14,
                      color: "rgba(34,51,44,0.72)",
                      lineHeight: 1.7,
                      margin: 0,
                    }}
                  >
                    {lesson.body}
                  </p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION - BEYOND THE WORK */}
      <section
        className="beyond-section"
        style={{
          background: "var(--cream)",
          backgroundImage: "radial-gradient(rgba(34,51,44,0.12) 1px, transparent 1.6px)",
          backgroundSize: "22px 22px",
          padding: "112px 60px",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <AnimateIn delay={60}>
            <h2 className="beyond-heading">
              The parts that <em className="beyond-heading-accent">don&apos;t fit</em> a CV.
            </h2>
          </AnimateIn>

          <AnimateIn delay={90}>
            <div className="beyond-quote">
              <span className="beyond-quote-bar" aria-hidden="true" />
            
            </div>
          </AnimateIn>

          <div className="beyond-grid">
            {/* LEFT - editorial photo */}
            <div className="beyond-photos">
              <AnimateIn className="beyond-photo-anim beyond-photo-slot-mussels">
                <ParallaxLayer speed={0.04}>
                  <figure className="beyond-photo beyond-photo-mussels">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/about/riz-italy-mussels.jpg"
                      alt="Rizwan Mahmood in Italy, holding two bowls of fresh mussels on a rooftop terrace"
                      style={{ objectPosition: "center 20%" }}
                    />
                  </figure>
                  <p className="beyond-photo-caption">
                    Mussels in Italy. Research.
                  </p>
                </ParallaxLayer>
              </AnimateIn>
            </div>

            {/* RIGHT - boxless editorial list */}
            <div className="beyond-list">
              {beyondFacts.map((fact, i) => {
                const Icon = fact.icon;
                return (
                  <AnimateIn key={fact.title} delay={i * 80} className="beyond-row-anim">
                    <div className="beyond-row">
                      <Icon className="beyond-row-icon" size={20} strokeWidth={2} />
                      <div className="beyond-row-content">
                        <h3>{fact.title}</h3>
                        <p>{fact.body}</p>
                        {(fact.extra || (fact.linkText && fact.linkHref)) && (
                          <p className="beyond-row-extra">
                            {fact.extra}
                            {fact.linkText && fact.linkHref && (
                              <a
                                href={fact.linkHref}
                                className="beyond-row-link"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {" "}
                                {fact.linkText}
                              </a>
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  </AnimateIn>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .about-credentials {
          margin: 18px 0;
          padding-top: 16px;
          border-top: 1px solid var(--line);
        }
        .about-credentials-label {
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          color: var(--coral);
          margin: 0 0 8px;
        }
        .about-credentials-row {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }
        .about-credentials-dot {
          color: #ff5c35;
          font-size: 14px;
        }
        .about-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: transparent;
          border: none;
          color: #22332C;
          padding: 0;
          font-size: 1rem;
          font-weight: 500;
          font-variant: small-caps;
          letter-spacing: 0.02em;
          cursor: default;
        }
        .about-pill-featured {
          color: #ff5c35;
        }
        .about-pill-icon {
          color: #ff5c35;
          flex-shrink: 0;
        }
        .about-pill-logo {
          display: block;
          height: 40px;
          width: auto;
          max-width: 120px;
          object-fit: contain;
        }
        .about-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #22332C;
          color: var(--cream);
          padding: 18px 40px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          letter-spacing: 0.02em;
          text-decoration: none;
          width: fit-content;
          transition: all 0.22s ease;
        }
        .about-cta:hover {
          background: #ff5c35;
          transform: translateY(-2px);
        }
        @media (max-width: 860px) {
          .about-hero-grid {
            grid-template-columns: 1fr !important;
            padding: 0 24px !important;
          }
        }
        .about-photo-single {
          width: 100%;
          aspect-ratio: 3 / 4;
          max-height: 640px;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: var(--shadow-lg);
        }
        .about-photo-single img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .beyond-heading {
          font-size: clamp(1.6rem, 1.35rem + 1.1vw, 2.15rem);
          line-height: 1.12;
          letter-spacing: -0.013em;
          font-weight: 500;
          color: #22332C;
          max-width: 640px;
          margin: 0 0 56px;
        }
        .beyond-heading-accent {
          color: #ff5c35;
          font-weight: 600;
        }
        .beyond-quote {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 0 0 48px;
        }
        .beyond-quote-bar {
          width: 3px;
          height: 30px;
          flex-shrink: 0;
          background: #ff5c35;
          border-radius: 2px;
        }
        .beyond-quote p {
          font-size: 18px;
          color: rgba(34,51,44,0.72);
          margin: 0;
          text-align: left;
        }
        .beyond-grid {
          display: grid;
          grid-template-columns: 0.9fr 1fr;
          gap: 64px;
          align-items: start;
        }
        .beyond-photos {
          display: flex;
          flex-direction: column;
          gap: 20px;
          width: 100%;
        }
        .beyond-photo {
          position: relative;
          display: block;
          margin: 0;
          width: 100%;
          height: 580px;
          overflow: hidden;
          border-radius: 120px 24px 24px 24px;
          box-shadow: var(--shadow-lg);
        }
        .beyond-photo img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .beyond-photo-caption {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin: 12px 0 0;
          font-size: 14px;
          color: rgba(34,51,44,0.72);
        }
        .beyond-caption-dash {
          color: #ff5c35;
          font-style: normal;
          font-weight: 600;
        }
        .beyond-list {
          display: flex;
          flex-direction: column;
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
        }
        .beyond-row-anim + .beyond-row-anim {
          border-top: 1px solid var(--line);
        }
        .beyond-row {
          position: relative;
          display: flex;
          gap: 20px;
          padding: 30px 8px;
          transition: padding-left 0.25s ease;
        }
        .beyond-row::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 0;
          background: #ff5c35;
          transition: width 0.25s ease;
        }
        .beyond-row:hover {
          padding-left: 20px;
        }
        .beyond-row:hover::before {
          width: 2px;
        }
        .beyond-row-icon {
          flex-shrink: 0;
          color: #ff5c35;
          margin-top: 4px;
          transition: transform 0.25s ease;
        }
        .beyond-row:hover .beyond-row-icon {
          transform: scale(1.15);
        }
        .beyond-row-content h3 {
          font-size: 1.375rem;
          font-weight: 600;
          color: #22332C;
          margin: 0 0 8px;
          transition: color 0.25s ease;
        }
        .beyond-row:hover .beyond-row-content h3 {
          color: #ff5c35;
        }
        .beyond-row-content p {
          font-size: 16px;
          color: rgba(34,51,44,0.72);
          line-height: 1.7;
          margin: 0;
        }
        .beyond-row-extra {
          margin-top: 6px !important;
          color: rgba(34,51,44,0.72) !important;
        }
        .beyond-row-link {
          color: #ff5c35;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
        }
        .beyond-row-link:hover {
          text-decoration: underline;
        }
        @media (max-width: 900px) {
          .beyond-grid {
            grid-template-columns: 1fr;
            gap: 44px;
          }
        }
        @media (max-width: 700px) {
          .about-hero-section {
            padding: 64px 0 !important;
          }
          .lessons-section {
            padding: 64px 24px !important;
          }
          .beyond-section {
            padding: 64px 24px !important;
          }
          .beyond-row {
            padding: 24px 4px;
          }
          .beyond-photo {
            height: 420px;
          }
        }
        .lesson-card {
          background: #ffffff;
          border: 1px solid rgba(34,51,44,0.1);
          border-radius: 18px;
          padding: 28px 24px;
          height: 100%;
          transform: rotate(var(--lesson-rotate, 0deg)) translateY(var(--lesson-offset, 0px));
          box-shadow: 0 2px 8px rgba(34,51,44,0.06);
          transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
        }
        .lesson-card:hover {
          background: #fdfaf3;
          transform: rotate(0deg) translateY(calc(var(--lesson-offset, 0px) - 8px));
          box-shadow: 0 18px 32px rgba(34,51,44,0.14);
        }
        .lesson-card-number {
          font-size: 14px;
          color: var(--lesson-accent, #ff5c35);
          opacity: 0.55;
          margin: 0 0 12px;
          display: inline-block;
          transition: transform 0.3s ease, opacity 0.3s ease;
          transform-origin: left center;
        }
        .lesson-card:hover .lesson-card-number {
          opacity: 1;
          transform: scale(1.5);
        }
        @media (max-width: 860px) {
          .lessons-grid {
            grid-template-columns: 1fr !important;
          }
          .lesson-card {
            transform: none !important;
          }
          .lesson-card:hover {
            transform: translateY(-4px) !important;
          }
        }
        @media (max-width: 860px) {
          .longer-version-grid {
            grid-template-columns: 1fr !important;
            padding: 60px 24px !important;
            gap: 48px !important;
          }
          .track-record-sticky {
            position: static !important;
            top: auto !important;
          }
        }

        .open-everything-btn {
          flex-shrink: 0;
          background: none;
          border: 1px solid var(--line);
          border-radius: 999px;
          padding: 6px 16px;
          font-size: 14px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #ff5c35;
          cursor: pointer;
          transition:
            border-color 0.18s ease,
            background 0.18s ease;
        }
        .open-everything-btn:hover {
          border-color: #ff5c35;
          background: rgba(255,92,53, 0.06);
        }

        .timeline-item {
          padding-top: 4px;
          padding-bottom: 4px;
        }
        .timeline-toggle {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          background: none;
          border: none;
          margin: 0;
          padding: 10px 0;
          cursor: pointer;
          text-align: left;
        }
        .timeline-toggle:focus-visible {
          outline: 2px solid #ff5c35;
          outline-offset: 2px;
        }
        .timeline-toggle-label {
          display: flex;
          align-items: baseline;
          gap: 12px;
        }
        .timeline-caret {
          flex-shrink: 0;
          color: #ff5c35;
          font-size: 14px;
          transition: transform 0.2s ease;
        }
        .timeline-item.is-open .timeline-caret {
          transform: rotate(-180deg);
        }
        .timeline-panel {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.25s ease;
        }
        .timeline-item.is-open .timeline-panel {
          grid-template-rows: 1fr;
        }
        .timeline-panel > .timeline-panel-inner {
          overflow: hidden;
          min-height: 0;
          min-width: 0;
        }
        .timeline-panel-inner {
          padding-bottom: 16px;
        }
        .timeline-panel-inner p {
          overflow-wrap: break-word;
        }

        @media (prefers-reduced-motion: reduce) {
          .timeline-panel,
          .timeline-caret {
            transition: none !important;
          }
        }
      `}</style>
    </>
  );
}
