/* Case studies data, shared by /case-studies and its design previews. */

/* ─── data ──────────────────────────────────────────────────────────────────── */

/* Every figure below comes from the September 2026 CV, as verified in
   CV-AUDIT.md and listed in POSITIONING.md. Nothing is inferred. Where the
   CV records a result but not the method, "what I did" stays general on
   purpose. TODOs mark the places Riz should add specifics in his own words. */


export const STAT_CARDS = [
  { label: "SAVED", number: "$3.9M", desc: "courier cost, 6 months, Bolt" },
  { label: "CLOSE", number: "8→3", desc: "days to month-end close, Wise" },
  { label: "DISPATCH", number: "20s", desc: "down from 3 minutes, Careem" },
  { label: "AUTOMATED", number: "~40h", desc: "manual work removed weekly, per client" },
];

export type CaseRow = {
  id: string;
  num: string;
  tag: string;
  title: string;
  result: string;
  area: string;
  details: {
    situation: string[];
    did: string[];
    outcomes: { number: string; label: string }[];
    takeaway: string;
    where: string;
  };
  /** the client's testimonial id (components/Testimonials.tsx), when there is one */
  testimonialId?: string;
};

const caseRowsBase: CaseRow[] = [
  {
    id: "cs-01",
    num: "01",
    tag: "BOLT · COST",
    title: "Courier cost, cut by a third",
    result: "21% → 14% of GMV · $3.9M saved",
    area: "Cost",
    details: {
      // TODO(Riz): name the two or three levers that actually moved the number.
      situation: [
        "Courier cost running at 21% of GMV",
        "20 countries across Europe and Africa",
        "No shared way of reporting courier performance",
      ],
      did: [
        "Took the cost line apart market by market",
        "Introduced courier reporting frameworks in 15 countries",
        "Ran the reduction as an operating rhythm, not a one-off cut",
      ],
      outcomes: [
        { number: "$3.9M", label: "saved in 6 months" },
        { number: "14%", label: "courier cost of GMV / was 21%" },
        { number: "15", label: "countries on one reporting framework" },
      ],
      takeaway:
        "Cost comes down when the number is visible every week, in the same shape, in every market. Reporting first. Cuts second.",
      where: "Bolt · 2021–25",
    },
  },
  {
    id: "cs-02",
    num: "02",
    tag: "BOLT · GROWTH",
    title: "Delivery economics, tested not guessed",
    result: "+$2.1M from fee A/B tests in 6 months",
    area: "Growth",
    details: {
      // TODO(Riz): one line on how the tests were set up and who ran them.
      situation: [
        "Delivery fees set by judgement",
        "Courier segmentation and assignment left room on the table",
      ],
      did: [
        "Ran delivery fees as A/B experiments",
        "Reworked courier segmentation",
        "Improved how deliveries were assigned",
      ],
      outcomes: [
        { number: "+$2.1M", label: "from delivery fee A/B tests, 6 months" },
        { number: "−1.3%", label: "of GMV from courier segmentation" },
        { number: "+12%", label: "delivery assignment efficiency" },
      ],
      takeaway:
        "Pricing is an operations question. If you are not testing it, you are leaving money in a spreadsheet nobody opens.",
      where: "Bolt · 2021–25",
    },
  },
  {
    id: "cs-03",
    num: "03",
    tag: "BOLT · COMPLIANCE",
    title: "EU Platform Workers' Directive, built in",
    result: "80%+ compliance · −70% manual effort",
    area: "Compliance",
    details: {
      // TODO(Riz): what the two microservices did, in one plain sentence each.
      situation: [
        "New EU regulation for platform workers",
        "Compliance work landing on people, by hand",
      ],
      did: [
        "Turned the regulation into operating requirements",
        "Worked with engineering on two microservices to carry the load",
        "Moved compliance from a manual task to a system",
      ],
      outcomes: [
        { number: "80%+", label: "EU Platform Workers' Directive compliance" },
        { number: "−70%", label: "manual effort" },
        { number: "2", label: "microservices doing the work" },
      ],
      takeaway:
        "Regulation is a process problem before it is a legal one. If compliance needs a person to remember, it will fail on a busy week.",
      where: "Bolt · 2021–25",
    },
  },
  {
    id: "cs-04",
    num: "04",
    tag: "WISE · FINANCE OPS",
    title: "Month-end close, from 8 days to 3",
    result: "3-day close · ~92% straight-through",
    area: "Finance ops",
    details: {
      // TODO(Riz): what made the close slow before — the one bottleneck worth naming.
      situation: [
        "Month-end close taking 8 days",
        "Reconciliation and journals done largely by hand",
        "VAT/GST work eating analyst time",
      ],
      did: [
        "Mapped the close step by step",
        "Pushed reconciliation to straight-through matching",
        "Cut the manual journals out of the path",
      ],
      outcomes: [
        { number: "3 days", label: "month-end close / was 8" },
        { number: "~92%", label: "straight-through reconciliation" },
        { number: "−65%", label: "manual journals" },
        { number: "−30%", label: "VAT/GST analyst time" },
      ],
      takeaway:
        "A slow close is not a finance problem. It is a founder flying blind for a week every month.",
      where: "Wise · 2025",
    },
  },
  {
    id: "cs-05",
    num: "05",
    tag: "WISE · LAUNCHES",
    title: "Products and markets, shipped faster",
    result: "12+ products · 13+ launches · 70+ countries",
    area: "Launches",
    details: {
      // TODO(Riz): what his role was on launches — the ops checklist, the sign-off, the owner?
      situation: [
        "Products launching into 70+ countries",
        "Every launch carrying finance and reporting work",
      ],
      did: [
        "Owned the operational side of launches",
        "Made launch readiness repeatable instead of bespoke",
      ],
      outcomes: [
        { number: "12+", label: "products launched" },
        { number: "13+", label: "market launches into 70+ countries" },
        { number: "−9%", label: "time to market" },
      ],
      takeaway:
        "The second launch should be faster than the first. If it is not, nobody wrote the first one down.",
      where: "Wise · 2025",
    },
  },
  {
    id: "cs-06",
    num: "06",
    tag: "CAREEM · SERVICE OPS",
    title: "Dispatch, from 3 minutes to 20 seconds",
    result: "20s dispatch · was 3 min",
    area: "Service ops",
    details: {
      // TODO(Riz): one line on what the service was and what changed in the flow.
      situation: [
        "Dispatch run with the Ministry of Health, Khyber Pakhtunkhwa",
        "3 minutes from request to dispatch",
      ],
      did: [
        "Reworked the dispatch flow end to end",
        "Took the waiting out of the hand-offs",
      ],
      outcomes: [
        { number: "20s", label: "dispatch time / was 3 minutes" },
        { number: "9×", label: "faster" },
      ],
      takeaway:
        "Most delay lives between steps, not inside them. Find the hand-offs and the speed follows.",
      where: "Careem · 2019–20",
    },
  },
  {
    id: "cs-07",
    num: "07",
    tag: "FRACTIONAL COO · AUTOMATION",
    title: "The layer underneath: AI that runs the process",
    result: "20+ workflows live · ~40 hrs/week removed",
    area: "Automation",
    details: {
      situation: [
        "Founder-led teams of a handful of people",
        "Repetitive work held together by whoever remembers",
      ],
      did: [
        "Fixed the process first, then automated it",
        "Designed the automations on n8n and the Claude API",
        "Handed over systems that run without me",
      ],
      outcomes: [
        { number: "20+", label: "workflows live" },
        { number: "7+", label: "clients" },
        { number: "~40h", label: "manual work removed per week, per engagement" },
      ],
      takeaway:
        "This is what a fractional COO should leave behind. Not a deck. A process that runs on its own.",
      where: "Client work · 2025–",
    },
  },
  /* ── Client work as a fractional operator. Drawn from each client's own
     testimonial and the engagement record; nothing added beyond them.
     The "For a founder" lines are new copy for Riz to check. ── */
  {
    id: "cs-08",
    num: "08",
    tag: "CYCLE TOGETHER · PEOPLE & STRUCTURE",
    title: "A founder back in control of her business",
    result: "Eight roles covered by one fractional operator",
    area: "People & structure",
    details: {
      situation: [
        "A founder stuck in the details",
        "Hiring, onboarding and internal systems all running through her",
        "Never fully in control of any of them",
      ],
      did: [
        "Covered the roles the business was missing: COO, Chief of Staff, HR, finance and product",
        "Designed every process, framework and tool around how the team actually works",
        "Walked the team through the why behind each one, so it runs without me",
      ],
      outcomes: [{ number: "8", label: "roles covered in one engagement" }],
      takeaway:
        "Early on, you don't need eight hires. You need one operator who can wear the hats until the business can afford the people.",
      where: "Cycle Together · Fractional COO",
    },
    testimonialId: "biola-babawale",
  },
  {
    id: "cs-09",
    num: "09",
    tag: "SHAPING WEALTH · PRODUCT",
    title: "Lydia, from stuck decisions to a working build",
    result: "An AI coaching platform taken from concept to build",
    area: "Product",
    details: {
      situation: [
        "Lydia, an AI coaching platform for financial advisors, still a concept",
        "Key decisions stuck in conversation",
        "An existing platform that couldn't carry it",
      ],
      did: [
        "Made a clear recommendation on how Lydia should be structured",
        "Wrote a plain-English brief on why the existing platform couldn't carry it",
        "Wrote the specs and templates the engineers built from, and ran the delivery cadence",
      ],
      outcomes: [{ number: "0 → 1", label: "Lydia, from concept to a working build" }],
      takeaway:
        "A decision stuck in conversation costs more than a wrong one. Write the recommendation down and let the team move.",
      where: "Shaping Wealth · 2025–26",
    },
    testimonialId: "brian-portnoy",
  },
  {
    id: "cs-10",
    num: "10",
    tag: "STRATEASY CONSULTING · GO-TO-MARKET",
    title: "Visible to the right people before the first meeting",
    result: "29% outreach reply rate · 11 qualified conversations",
    area: "Go-to-market",
    details: {
      situation: [
        "Credentials, track record and institutional relationships already in place",
        "No way to make any of it visible without being in the room first",
        "Every engagement starting from zero",
      ],
      // TODO(Riz): confirm or reword. The testimonial names the problem, not the method;
      // these two lines are read from the engagement's scope (GTM and positioning) and results.
      did: [
        "Sharpened how the founder and the firm are positioned",
        "Ran targeted outreach to the buyers who mattered",
      ],
      outcomes: [
        { number: "29%", label: "outreach reply rate" },
        { number: "6×", label: "profile views in 60 days" },
        { number: "11", label: "qualified conversations" },
      ],
      takeaway:
        "Credentials don't sell themselves. If the right people can't see the track record before the meeting, every deal starts from zero.",
      where: "Strateasy Consulting · 5 months",
    },
    testimonialId: "shahzad-akhtar",
  },
  {
    id: "cs-11",
    num: "11",
    tag: "BRENNA & CO. · SOPS & SYSTEMS",
    title: "SOPs and systems, organised in five days",
    result: "5 days start to finish · rated 5.0",
    area: "SOPs & systems",
    details: {
      situation: [
        "Parts of the business that felt overwhelming",
        "SOPs and systems that needed organising",
      ],
      did: [
        "Organised the SOPs",
        "Streamlined the systems",
        "Brought structure to the areas that had felt overwhelming",
      ],
      outcomes: [
        { number: "5 days", label: "start to finish" },
        { number: "9 hrs", label: "to organise SOPs and streamline systems" },
        { number: "5.0", label: "client rating, out of 5" },
      ],
      takeaway:
        "Not every ops problem needs a quarter. Some need one sharp week and someone who writes it all down.",
      where: "Brenna & Co. · 2025",
    },
    testimonialId: "kaitlin-malaspina",
  },
];

export const caseRows = caseRowsBase;

/* Logos for the companies that have one in public/logos. Anything else
   (client work) falls back to its name. */
export const LOGOS: Record<string, string> = {
  Bolt: "/logos/bolt.png",
  Wise: "/logos/wise.svg",
  Careem: "/logos/careem.png",
};

/** "BOLT · COST" → { company: "Bolt", area: "Cost" } */
export function splitTag(tag: string) {
  const [co, ...rest] = tag.split("·").map((t) => t.trim());
  const title = (w: string) => w.split(" ").map((p) => p.charAt(0) + p.slice(1).toLowerCase()).join(" ");
  const company = co.startsWith("FRACTIONAL") ? "Fractional COO" : title(co);
  return { company, area: rest.join(" · ").toLowerCase() };
}


// founder-facing names for each case's area
export const AREA_LABEL: Record<string, string> = {
  Cost: "Cost",
  Growth: "Growth",
  Compliance: "Compliance",
  "Finance ops": "Month-end close",
  Launches: "Launches",
  "Service ops": "Speed",
  Automation: "Automation",
  "People & structure": "People & structure",
  Product: "Product",
  "Go-to-market": "Go-to-market",
  "SOPs & systems": "SOPs & systems",
};

/** The founder-facing name for a case's area, e.g. "Finance ops" → "Month-end close". */
export const areaLabel = (area: string) => AREA_LABEL[area] ?? area;
