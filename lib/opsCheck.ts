/**
 * The Ops Health Check: nine questions across the six parts of the
 * operating system Riz installs. Rhythm, process and the founder's desk
 * get two questions each; owners, cost and automation get one.
 *
 * Each answer scores 0-3. Every part is scaled to 0-6 so a one-question
 * part isn't penalised, and the total is the average across parts, out of 100.
 *
 * Edit the wording here; the check and the roadmap read everything from this file.
 */

export type AreaId = "rhythm" | "process" | "owners" | "desk" | "cost" | "automation";

export const AREAS: { id: AreaId; name: string; short: string }[] = [
  { id: "rhythm", name: "A weekly rhythm", short: "Rhythm" },
  { id: "process", name: "Process and handoffs", short: "Process" },
  { id: "owners", name: "Owners, not heroes", short: "Owners" },
  { id: "desk", name: "Off your desk", short: "Your desk" },
  { id: "cost", name: "Cost and unit economics", short: "Cost" },
  { id: "automation", name: "The automation layer", short: "Automation" },
];

export type Question = {
  area: AreaId;
  q: string;
  /** worst to best */
  options: { label: string; score: number }[];
};

export const QUESTIONS: Question[] = [
  {
    area: "rhythm",
    q: "How does your leadership team review the week?",
    options: [
      { label: "We don't, really.", score: 0 },
      { label: "We meet, but it's mostly updates.", score: 1 },
      { label: "Weekly, and some decisions get made.", score: 2 },
      { label: "Weekly, same numbers, ends in decisions with owners.", score: 3 },
    ],
  },
  {
    area: "rhythm",
    q: "How many numbers does your team read the same way, every week?",
    options: [
      { label: "None. They live in five spreadsheets.", score: 0 },
      { label: "A few, built by hand each week.", score: 1 },
      { label: "A handful, mostly reliable.", score: 2 },
      { label: "A handful, and nobody builds them by hand.", score: 3 },
    ],
  },
  {
    area: "process",
    q: "When work moves between people, what happens?",
    options: [
      { label: "It waits until someone chases it.", score: 0 },
      { label: "Something falls through most weeks.", score: 1 },
      { label: "Mostly smooth. The big handoffs are written down.", score: 2 },
      { label: "Mapped, owned, nobody chases.", score: 3 },
    ],
  },
  {
    area: "process",
    q: "Is your most repeated process (onboarding, approvals, month-end) written down?",
    options: [
      { label: "No. It lives in people's heads.", score: 0 },
      { label: "Partly, and it's out of date.", score: 1 },
      { label: "Yes, and mostly followed.", score: 2 },
      { label: "Yes, followed, and someone keeps it current.", score: 3 },
    ],
  },
  {
    area: "owners",
    q: "Ask your team who owns each key outcome. What do you hear?",
    options: [
      { label: "Silence, or my name.", score: 0 },
      { label: "Different answers from different people.", score: 1 },
      { label: "Mostly clear, a few gaps.", score: 2 },
      { label: "One owner each, written down.", score: 3 },
    ],
  },
  {
    area: "desk",
    q: "How much of your week goes on firefighting?",
    options: [
      { label: "Most of it.", score: 0 },
      { label: "About half.", score: 1 },
      { label: "A day or so.", score: 2 },
      { label: "Barely any.", score: 3 },
    ],
  },
  {
    area: "desk",
    q: "Your next board or investor update gets…",
    options: [
      { label: "Written at midnight, from scratch.", score: 0 },
      { label: "Pulled together last minute from five places.", score: 1 },
      { label: "Mostly ready. I polish it.", score: 2 },
      { label: "Prepared by the team. I add the story.", score: 3 },
    ],
  },
  {
    area: "cost",
    q: "Do you know your unit economics, per order, client or job?",
    options: [
      { label: "Not really.", score: 0 },
      { label: "Roughly, from an old model.", score: 1 },
      { label: "Yes, checked monthly.", score: 2 },
      { label: "Yes, weekly, and each cost line has an owner.", score: 3 },
    ],
  },
  {
    area: "automation",
    q: "How much repeat work is still done by hand?",
    options: [
      { label: "A lot. It eats whole days.", score: 0 },
      { label: "A few hours a week, each.", score: 1 },
      { label: "Some. The obvious ones are automated.", score: 2 },
      { label: "Very little. It runs on its own.", score: 3 },
    ],
  },
];

/** The first step, per part, by how it scored. */
export const ADVICE: Record<AreaId, { low: string; mid: string; high: string }> = {
  rhythm: {
    low: "Start one weekly review. Same day, five numbers, and every decision gets a name.",
    mid: "Make the meeting decide. Cut the updates, keep five numbers, end with owners and dates.",
    high: "Protect it. The numbers should arrive without anyone building them.",
  },
  process: {
    low: "Find the handoff where work waits longest. Write down who passes what, to whom, by when.",
    mid: "Map the one handoff that still breaks most weeks. Give it an owner.",
    high: "Keep it current. Every written process needs someone who updates it.",
  },
  owners: {
    low: "List your key outcomes and put one name on each. Wherever it's yours, fix that first.",
    mid: "Close the gaps. If two people own it, nobody does. Pick one.",
    high: "Make sure every new hire inherits a clear area on day one.",
  },
  desk: {
    low: "Pick three things that only reach you because nobody owns them. Hand them over this month.",
    mid: "Get the board update off your desk. The team prepares it, you add the story.",
    high: "Keep it that way: a weekly rhythm that runs without you.",
  },
  cost: {
    low: "Build one cost view per order, client or job. Look at it every week. Reporting first, cuts second.",
    mid: "Give each cost line an owner and a weekly number.",
    high: "Use the numbers to decide where to grow, not just where to cut.",
  },
  automation: {
    low: "Fix the process first. Then automate the one weekly task that costs the most hours, if it earns its place.",
    mid: "Write down what each automation does and who owns it.",
    high: "Keep the bar high. Automate only what saves real time or mistakes.",
  },
};

/* ── Scoring tiers: what each result is told, and how hard it's asked to
   book. Four levels by total score, plus one safety rule: in the two upper
   levels, any part at 1/6 or lower is called out, and the call to action
   points at it. Edit thresholds and copy here; the results page and the
   roadmap both read from this. {weakest} and {flagged} are filled in with
   part names. ── */

export type TierId = "leaking" | "holding" | "running" | "strong";

export type Tier = {
  id: TierId;
  /** lowest total (out of 100) for this level */
  min: number;
  title: string;
  line: string;
  cta: {
    /** "strong": dark card, bold push. "soft": light card, low-key. */
    tone: "strong" | "soft";
    heading: string;
    body: string;
    button: string;
  };
};

export const TIERS: Tier[] = [
  {
    id: "leaking", min: 0,
    title: "You're still the ops team.",
    line: "Most of it runs through you. Normal at this stage, and fixable in 90 days.",
    cta: {
      tone: "strong",
      heading: "Let's get it off your desk.",
      body: "Thirty minutes, free. We pick the first fix together. If it makes sense, the next step is a two-week Diagnostic: $1,500, refunded in full if it isn't worth it.",
      button: "Book a free 30-min fit call →",
    },
  },
  {
    id: "holding", min: 40,
    title: "The basics are there. You're still the glue.",
    line: "Some parts run on their own. The rest still lean on you.",
    cta: {
      tone: "strong",
      heading: "Fix \u201c{weakest}\u201d first.",
      body: "Thirty minutes, free. Bring this roadmap and we'll see if it's a six-week sprint or a bigger job.",
      button: "Book a free 30-min fit call →",
    },
  },
  {
    id: "running", min: 65,
    title: "Solid. A couple of gaps.",
    line: "Most of the operation runs without you. One or two parts still don't.",
    cta: {
      tone: "soft",
      heading: "You may not need a COO. You might need six weeks.",
      body: "If \u201c{weakest}\u201d is costing you, a six-week sprint can fix it and hand it over. Happy to talk it through.",
      button: "Talk it through →",
    },
  },
  {
    id: "strong", min: 85,
    title: "This runs well. Honestly, you may not need me.",
    line: "Keep this roadmap and check again in a quarter.",
    cta: {
      tone: "soft",
      heading: "Want a second pair of eyes anyway?",
      body: "No pitch. If you'd like someone to pressure-test it, I'm happy to look.",
      button: "Book a call anyway →",
    },
  },
];

/** A part this low is never waved through, however good the total. */
export const FLAG_AT_OR_BELOW = 1;

/** The level, its message and its call to action, for one result. */
export function outcome(total: number, byArea: Record<AreaId, number>) {
  const tier = [...TIERS].reverse().find((t) => total >= t.min)!;
  const ordered = [...AREAS].sort((a, b) => byArea[a.id] - byArea[b.id]);
  const weakest = ordered[0];
  // safety rule: in the upper levels, a part at 1/6 or below gets named
  const flagged = (tier.id === "running" || tier.id === "strong") && byArea[weakest.id] <= FLAG_AT_OR_BELOW ? weakest : null;
  const fill = (t: string) => t.replaceAll("{weakest}", weakest.name.toLowerCase()).replaceAll("{flagged}", flagged?.name.toLowerCase() ?? "");
  const cta = flagged
    ? {
        tone: "strong" as const,
        heading: `Overall this runs well. But \u201c${flagged.name.toLowerCase()}\u201d scored ${byArea[flagged.id]}/6.`,
        body: "That one's worth fixing before it spreads. Usually a six-week sprint. Thirty minutes, free, to see if it fits.",
        button: "Book a free 30-min fit call →",
      }
    : { ...tier.cta, heading: fill(tier.cta.heading), body: fill(tier.cta.body) };
  return { tier: tier.id, title: tier.title, line: tier.line, cta, flagged: flagged?.id ?? null };
}

/** Headline for the whole result (kept for older callers). */
export function verdict(total: number): { title: string; line: string } {
  const tier = [...TIERS].reverse().find((t) => total >= t.min)!;
  return { title: tier.title, line: tier.line };
}

export const MAX_PER_AREA = 6;

/** Per-part scores out of 6 and a total out of 100, from the answers. */
export function scoreAnswers(answers: number[]) {
  const raw = Object.fromEntries(AREAS.map((a) => [a.id, 0])) as Record<AreaId, number>;
  const count = Object.fromEntries(AREAS.map((a) => [a.id, 0])) as Record<AreaId, number>;
  QUESTIONS.forEach((q, i) => {
    count[q.area] += 1;
    if (answers[i] >= 0) raw[q.area] += q.options[answers[i]].score;
  });
  const byArea = Object.fromEntries(
    AREAS.map((a) => [a.id, Math.round((raw[a.id] / (count[a.id] * 3)) * MAX_PER_AREA)]),
  ) as Record<AreaId, number>;
  const total = Math.round((AREAS.reduce((s, a) => s + byArea[a.id], 0) / (AREAS.length * MAX_PER_AREA)) * 100);
  return { byArea, total };
}

/* ── The roadmap: what each part means, what good looks like, and one real
   case as proof (ids from lib/caseStudies.ts). ── */

export const BANDS = {
  low: { label: "Leaking", color: "#FF5C35" },
  mid: { label: "Holding", color: "#D9A21B" },
  high: { label: "Strong", color: "#16A34A" },
} as const;
export type Band = keyof typeof BANDS;
export const bandOf = (score: number): Band => (score <= 2 ? "low" : score <= 4 ? "mid" : "high");

export const REPORT: Record<AreaId, {
  meaning: string;
  good: string[];
  proof: { caseId: string; figure: string; line: string };
}> = {
  rhythm: {
    meaning: "How the business decides. Without a weekly rhythm, decisions happen in DMs and everything routes back to you.",
    good: ["One weekly review", "Five numbers, read the same way", "Every decision has an owner"],
    proof: { caseId: "cs-04", figure: "8 → 3 days", line: "Month-end close, every month." },
  },
  process: {
    meaning: "Where work moves between people. Most delay lives between steps, where nobody owns the wait.",
    good: ["Repeat processes written down", "Every handoff has an owner", "Nobody chases work"],
    proof: { caseId: "cs-06", figure: "3 min → 20s", line: "Dispatch time, by fixing the handoffs." },
  },
  owners: {
    meaning: "One name on every key outcome. When nobody owns it, whoever cares most does it. Usually you.",
    good: ["One owner per outcome", "Hires start with a clear area", "Decisions made where the work is"],
    proof: { caseId: "cs-08", figure: "8 roles", line: "Roles covered, then handed to the team." },
  },
  desk: {
    meaning: "Priorities, follow-through, board updates, the projects nobody owns. If they all land on you, you're the bottleneck.",
    good: ["Firefighting: a day a week, max", "The team prepares the board update", "Orphan projects have owners"],
    proof: { caseId: "cs-09", figure: "0 → 1", line: "Lydia, from stuck decisions to a working build." },
  },
  cost: {
    meaning: "Knowing what each order, client or job really costs, every week. You can't cut what you can't see.",
    good: ["One cost view per unit", "Checked weekly", "Every cost line owned"],
    proof: { caseId: "cs-01", figure: "$3.9M", line: "Courier cost saved in 6 months." },
  },
  automation: {
    meaning: "Repeat work running without a person. Only where it earns its place, and only after the process is fixed.",
    good: ["Repeat work runs itself", "Every automation has an owner", "Nothing automated for its own sake"],
    proof: { caseId: "cs-07", figure: "~40h", line: "Manual work removed per week, per client." },
  },
};
