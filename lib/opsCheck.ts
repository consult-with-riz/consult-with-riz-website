/**
 * The Ops Health Check: twelve questions across the six parts of the
 * operating system Riz installs, two per part. Each answer scores 0-3,
 * so a part scores 0-6 and the whole check 0-36 (shown out of 100).
 *
 * Edit the wording here; the page reads everything from this file.
 * Copy is a first draft in Riz's voice, for him to sharpen.
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
  /** worst to best; the score is listed per option so it can be uneven */
  options: { label: string; score: number }[];
};

export const QUESTIONS: Question[] = [
  {
    area: "rhythm",
    q: "How does your leadership team review the week?",
    options: [
      { label: "We don't, really. Things come up when they come up.", score: 0 },
      { label: "We meet, but it's mostly updates.", score: 1 },
      { label: "There's a weekly meeting, and some decisions get made.", score: 2 },
      { label: "One weekly review, the same numbers every week, and it ends in decisions with owners.", score: 3 },
    ],
  },
  {
    area: "rhythm",
    q: "How many numbers does your whole team read the same way, every week?",
    options: [
      { label: "None. The numbers live in five different spreadsheets.", score: 0 },
      { label: "A few, but someone builds them by hand each week.", score: 1 },
      { label: "A handful, reported weekly and mostly reliable.", score: 2 },
      { label: "A handful, the same every week, without anyone building them by hand.", score: 3 },
    ],
  },
  {
    area: "process",
    q: "When work moves between people (sale to delivery, hire to onboarded), what happens?",
    options: [
      { label: "It waits. Someone has to chase it.", score: 0 },
      { label: "It moves, but something falls through most weeks.", score: 1 },
      { label: "Mostly smooth. The big handoffs are written down.", score: 2 },
      { label: "Mapped, owned, and nobody chases.", score: 3 },
    ],
  },
  {
    area: "process",
    q: "Pick the process you run most often: onboarding, approvals or month-end. Is it written down?",
    options: [
      { label: "No. It lives in people's heads.", score: 0 },
      { label: "Partly, but it's out of date.", score: 1 },
      { label: "Yes, and it's mostly followed.", score: 2 },
      { label: "Yes, it's followed, and someone owns keeping it current.", score: 3 },
    ],
  },
  {
    area: "owners",
    q: "Ask your team who owns each key outcome. What do you hear?",
    options: [
      { label: "Silence, or my name.", score: 0 },
      { label: "Different answers from different people.", score: 1 },
      { label: "Mostly clear, with a few gaps.", score: 2 },
      { label: "One clear owner each, and it's written down.", score: 3 },
    ],
  },
  {
    area: "owners",
    q: "What happened after your last few hires?",
    options: [
      { label: "Nothing got faster. Some things got slower.", score: 0 },
      { label: "They're busy, but decisions still route through me.", score: 1 },
      { label: "Mostly working, with some hand-holding.", score: 2 },
      { label: "Scoped, onboarded, and owning their area.", score: 3 },
    ],
  },
  {
    area: "desk",
    q: "How much of your week goes on operational firefighting?",
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
      { label: "Roughly, from a model that's out of date.", score: 1 },
      { label: "Yes, checked every month or so.", score: 2 },
      { label: "Yes, every week, and someone owns each cost line.", score: 3 },
    ],
  },
  {
    area: "cost",
    q: "Where is money leaking?",
    options: [
      { label: "I can feel it, but I can't say where.", score: 0 },
      { label: "I have suspicions, but no numbers.", score: 1 },
      { label: "I know the top one or two.", score: 2 },
      { label: "We track it, and it's coming down.", score: 3 },
    ],
  },
  {
    area: "automation",
    q: "How much repeat work is still done by hand: reports, follow-ups, data entry?",
    options: [
      { label: "A lot. It eats whole days.", score: 0 },
      { label: "A fair amount, a few hours a week each.", score: 1 },
      { label: "Some. We've automated the obvious ones.", score: 2 },
      { label: "Very little. The repeat work runs on its own.", score: 3 },
    ],
  },
  {
    area: "automation",
    q: "When you've tried automating something, what happened?",
    options: [
      { label: "We bought tools nobody really uses.", score: 0 },
      { label: "We haven't tried yet.", score: 1 },
      { label: "A few automations, but only one person understands them.", score: 2 },
      { label: "They work, they're written down, and the team owns them.", score: 3 },
    ],
  },
];

/** What to do next, per part, by how it scored (0-2 low, 3-4 middle, 5-6 strong). */
export const ADVICE: Record<AreaId, { low: string; mid: string; high: string }> = {
  rhythm: {
    low: "Start with one weekly review. Same day, same handful of numbers, and it ends in decisions with a name next to each. Everything else gets easier once the week has a shape.",
    mid: "The meeting exists. Make it decide. Cut the updates, keep five numbers, and end every review with owners and dates.",
    high: "Your week has a rhythm. Protect it: the numbers should arrive without anyone building them by hand.",
  },
  process: {
    low: "Find the handoff where work waits longest and write it down: who passes what to whom, and when. Most delay lives between steps, not inside them.",
    mid: "The big handoffs work. Now map the one that still breaks most weeks, give it an owner, and stop chasing.",
    high: "Your processes hold. Keep them current: every written process needs someone who owns updating it.",
  },
  owners: {
    low: "Write down every key outcome and put one name next to each. If the name is yours too often, that's the problem to fix first.",
    mid: "Close the gaps. Wherever two people think they own something, nobody does. Pick one.",
    high: "Ownership is clear. The next step is making sure new hires inherit it on day one.",
  },
  desk: {
    low: "You're still the ops team. Pick the three things that only reach you because nobody else owns them, and hand them over this month.",
    mid: "You've got some time back. Now get the board update off your desk: the team prepares it, you add the story.",
    high: "You're out of the weeds. Keep it that way with a weekly rhythm that doesn't need you to run it.",
  },
  cost: {
    low: "You can't cut what you can't see. Build one cost view per order, client or job, and look at it every week. Reporting first, cuts second.",
    mid: "You know the big leaks. Give each cost line an owner and a weekly number, and the leaks start closing on their own.",
    high: "You know your numbers. Keep them weekly and owned, and use them to decide where to grow.",
  },
  automation: {
    low: "Fix the process before you automate it. Then pick the one task that runs the same way every week and costs the most hours. Automate that, only if it earns its place.",
    mid: "You've started. Now write down what each automation does and who owns it, or it becomes a dependency on one person.",
    high: "Your repeat work runs itself. Keep the bar high: automate only what saves real time or cuts mistakes.",
  },
};

/** Headline for the whole result, out of 100. */
export function verdict(total: number): { title: string; line: string } {
  if (total < 40)
    return {
      title: "You're still the ops team.",
      line: "Most of the operation runs through you. That's normal at this stage, and it's fixable in 90 days.",
    };
  if (total < 70)
    return {
      title: "The basics are there. You're still the glue.",
      line: "Some parts run on their own. The rest still need you to hold them together.",
    };
  return {
    title: "Solid. Now get it off your desk for good.",
    line: "The operation mostly runs. The work now is making it run without you in every thread.",
  };
}

export const MAX_PER_AREA = 6;
export const MAX_TOTAL = QUESTIONS.length * 3;

/* ── The full report: what each part means, what good looks like, and one
   real case as proof (ids from lib/caseStudies.ts). First draft in Riz's
   voice, for him to sharpen. ── */

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
    meaning:
      "The weekly rhythm is how the business decides. One review, a handful of numbers, and decisions with owners. Without it, decisions happen in corridors and DMs, and everything routes back to the founder.",
    good: [
      "One weekly review, same day, same agenda",
      "Five or so numbers everyone reads the same way",
      "Every review ends in decisions, each with an owner and a date",
    ],
    proof: { caseId: "cs-04", figure: "8 → 3 days", line: "Month-end close at Wise. A slow close is a founder flying blind for a week every month." },
  },
  process: {
    meaning:
      "Process and handoffs are where work moves between people. Most delay doesn't live inside a step. It lives between steps, where nobody owns the wait.",
    good: [
      "Your most repeated processes are written down and followed",
      "Every handoff has a sender, a receiver and a definition of done",
      "Nobody has to chase work to keep it moving",
    ],
    proof: { caseId: "cs-06", figure: "3 min → 20s", line: "Dispatch at Careem. Took the waiting out of the handoffs, and the speed followed." },
  },
  owners: {
    meaning:
      "Owners, not heroes, means every key outcome has one name next to it, written down. When nobody owns something, the person who cares most ends up doing it. Usually that's you.",
    good: [
      "One owner for every key outcome, written down",
      "New hires are scoped and onboarded into a clear area",
      "Decisions get made at the level where the work happens",
    ],
    proof: { caseId: "cs-08", figure: "8 roles", line: "Cycle Together. Covered the missing roles, then built it so the team runs it without me." },
  },
  desk: {
    meaning:
      "Off your desk is the Chief of Staff side of the job: priorities, follow-through, board updates, the projects nobody owns. If these all land on you, you're the bottleneck, however good the team is.",
    good: [
      "Firefighting takes a day a week, not most of it",
      "The board update is prepared by the team. You add the story",
      "The projects nobody owned have an owner and a date",
    ],
    proof: { caseId: "cs-09", figure: "0 → 1", line: "Lydia at Shaping Wealth. Turned decisions stuck in conversation into a plan the team could build." },
  },
  cost: {
    meaning:
      "Cost and unit economics is knowing what each order, client or job really costs you, and watching it every week. You can't cut what you can't see.",
    good: [
      "One cost view per order, client or job",
      "Checked every week, in the same shape",
      "Every cost line has an owner who watches it",
    ],
    proof: { caseId: "cs-01", figure: "$3.9M", line: "Courier cost at Bolt, from 21% to 14% of GMV in 6 months. Reporting first. Cuts second." },
  },
  automation: {
    meaning:
      "The automation layer is the repeat work running without a person: reports, follow-ups, data entry. Only where it earns its place. Fix the process first, then automate what saves real time or mistakes.",
    good: [
      "Repeat work runs on its own, and it's written down",
      "Every automation has an owner on your team",
      "Nothing is automated just because it could be",
    ],
    proof: { caseId: "cs-07", figure: "~40h", line: "Manual work removed per week, per client engagement, on n8n and Claude." },
  },
};
