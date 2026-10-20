/**
 * The CV, as data. The /cv page renders it and the downloadable PDF is
 * printed from that page (scripts/cv-pdf.mjs), so the two never drift.
 *
 * Source: Rizwan_Mahmood_Sep_2026_CV.pdf. Roles, dates and figures are
 * carried over unchanged; the framing is Fractional COO
 * to match the site. The hidden keyword block and the investor line from
 * the original are deliberately left out.
 */

export const CV_CONTACT = {
  name: "Rizwan Mahmood",
  role: "Fractional COO",
  email: "riz@consultwithriz.com",
  phone: "+372 5389 0745",
  phoneHref: "tel:+37253890745",
  linkedin: "linkedin.com/in/consult-with-riz",
  linkedinHref: "https://www.linkedin.com/in/consult-with-riz/",
  location: "Tallinn, Estonia",
};

export const CV_SUMMARY =
  "Fractional COO for Seed to Series B founders. 10+ years delivering operational, product and AI transformation inside high-growth technology businesses (Wise, Bolt, Motive, Careem). I diagnose broken processes, design the target operating model, install the cadence and ship the tooling, including AI agents, automations and reporting, that delivers measurable cost, speed, risk and compliance gains across 70+ markets.";

export const CV_SKILLS: { label: string; value: string }[] = [
  { label: "Operations Leadership", value: "Operating model design, process mapping, workflow audits, KPI & reporting design, change management" },
  { label: "Business Management", value: "Strategy planning, business expansion, resource allocation, P&L optimisation" },
  { label: "AI & Automation", value: "n8n, Anthropic, LLM agent design, prompt engineering, Make/Zapier, Attio & ClickUp" },
  { label: "Product Management", value: "Discovery, prioritisation, impact assessment, experimentation, implementation" },
  { label: "Cross-Functional Leadership", value: "Delivery with Engineering, Product, Public Policy, Legal and Risk teams" },
  { label: "Technical", value: "Tableau & Looker (business user), Microsoft Office & G-Suite (advanced), Confluence, Jira, SQL (basic)" },
  { label: "Soft Skills", value: "Executive communication, team management, C-suite reporting, critical thinking" },
];

export const CV_ACHIEVEMENTS: { group: string; items: { tag: string; text: string }[] }[] = [
  {
    group: "Product Management",
    items: [
      { tag: "(Wise) Reconciliation Automation", text: "Shipped bank/scheme auto-recs and exception tooling achieving ~92% straight-through matching; reduced month-end close from ~8 to ~3 days and manual journals by ~65% across Finance Ops." },
      { tag: "(Wise) Revenue & Fee Recognition", text: "Standardised fee mapping and IFRS-aligned revenue recognition for transfers; improved revenue accuracy and audit traceability." },
      { tag: "(Wise) Tax & Regulatory Reporting", text: "Integrated VAT/GST rules into the finance data pipeline; enabled compliant filings across EU/UK and lowered ad-hoc analyst time by ~30%." },
      { tag: "(Wise) Treasury & Liquidity Insights", text: "Delivered cash-position dashboards fed by ledger events; reduced idle balances and improved FX P&L attribution for Treasury and Controllership." },
    ],
  },
  {
    group: "Product Operations",
    items: [
      { tag: "(Bolt) Cost Reduction", text: "Led product-driven optimisation with engineering teams, reducing courier costs from 21% to 14% of GMV (saving $3.9M) in 6 months by implementing segmentation tooling and a new earnings component; impacting 20 countries across Europe & Africa, in response to the downturn caused by the war in Ukraine in Feb 2022." },
      { tag: "(Bolt) Regulatory Compliance", text: "Revamped courier processes in line with the EU's Workers' Directive, reaching 80%+ compliance while maintaining business continuity. Integrated the internal admin tool with Google Sheet automation for courier blocking, cutting manual effort by 70% through 2 new microservices built with Engineering." },
    ],
  },
  {
    group: "Operational Excellence",
    items: [
      { tag: "(Motive) Market Expansion", text: "Project managed market expansion covering lead gen, legal certification, website development, product marketing assets and sales enablement to deliver a certified ELD solution for the Canadian market." },
      { tag: "(Careem) Strategic Business Initiative", text: "Researched, modelled and launched a healthcare service solution in partnership with the Ministry of Health KPK in Pakistan, reducing dispatch time from 3 minutes to 20 seconds." },
    ],
  },
];

export type CvRole = { title: string; meta?: string; scope?: string; bullets?: string[] };
export type CvJob = {
  company: string;
  descriptor: string;
  href?: string;
  /** shown in the logo variants */
  logo?: string;
  /** logo height in px, tuned per logo so they read at the same visual size (Wise is the reference) */
  logoH?: number;
  logoClass?: "is-wide";
  /** Riz's own current role: no logo, title in coral */
  self?: boolean;
  dates: string;
  roles: CvRole[];
};

export const CV_EXPERIENCE: CvJob[] = [
  {
    company: "Fractional COO",
    self: true,
    descriptor: "Independent",
    dates: "Jun ’25 – Present",
    roles: [
      {
        title: "Fractional COO, Ops & AI Transformation",
        scope: "Client engagements",
        bullets: [
          "Embedded with founders and leadership teams as fractional COO, including the Chief of Staff work on the founder's side: operating cadence, metrics, process design and follow-through.",
          "Engagements run end to end, from process discovery and workflow audit through solution design, build, deployment and handover to the client's own team.",
          "Shipped production automations on n8n and the Anthropic Claude API, replacing manual back-office processes across sales, finance and client operations; 20+ workflows live across 7+ clients.",
          "Client delivery across sectors: automated reporting, document generation and client-intake workflows for edtech, accelerator and financial services clients, removing ~40 hours of manual work per week per engagement.",
        ],
      },
    ],
  },
  {
    company: "Shaping Wealth",
    logoH: 36,
    logo: "/logos/shapingwealth.png",
    logoClass: "is-wide",
    descriptor: "Behavioural Finance Training & AI Platform",
    href: "https://www.shapingwealth.com",
    dates: "Oct ’25 – Sep ’26",
    roles: [
      {
        title: "Business Transformation Consultant (Fractional), Lydia AI Platform",
        scope: "Individual contributor",
        bullets: [
          "Owned product for Lydia, an AI behavioural coaching platform for financial advisors: PRDs, agent specifications, roadmap and delivery cadence with a distributed engineering team.",
          "Compressed the delivery roadmap and stood up the agent documentation and specification infrastructure the engineering team builds against, moving the platform from concept to working build.",
        ],
      },
    ],
  },
  {
    company: "Wise",
    logoH: 20,
    logo: "/logos/wise.svg",
    descriptor: "Fintech listed on the London Stock Exchange",
    href: "https://wise.com",
    dates: "May ’25 – Nov ’25",
    roles: [
      {
        title: "Product Manager, Finance Implementation",
        scope: "Individual contributor",
        bullets: [
          "Integrated 12+ products and 13+ market launches into Wise's finance systems, enabling compliant operations in 70+ countries.",
          "Reduced time-to-market by 9% through streamlined implementation planning and cross-functional execution.",
          "Improved financial data accuracy, cutting reporting errors by 3% and shortening month-end close to 3 days.",
          "Strengthened safeguarding controls, mitigating currency exposure risks across multi-billion GBP transaction flows.",
          "Delivered training to regional teams, ensuring 100% compliance with finance processes during expansions.",
        ],
      },
    ],
  },
  {
    company: "Bolt",
    logoH: 32,
    logo: "/logos/bolt.png",
    descriptor: "Unicorn ride-hailing company",
    href: "https://bolt.eu",
    dates: "Oct ’21 – May ’25",
    roles: [
      {
        title: "Global Manager, Operational Excellence",
        meta: "Delivery Central Operations · 1 yr 7 mos",
        scope: "Managing 2 people",
        bullets: [
          "Owned two workstreams, Logistics & Inventory and Regulatory & Compliance, revamping courier processes in line with the EU's Workers' Directive to reach 80%+ compliance without disrupting business continuity, and integrating the internal admin tool with two new microservices to cut manual effort by 70%.",
          "Introduced courier reporting frameworks in 15 countries, unlocking faster problem identification, knowledge sharing and upskilling of local teams.",
        ],
      },
      {
        title: "Global Manager, Courier Operations",
        meta: "Food Central Operations · 2 yrs",
        scope: "Managed 1 person",
        bullets: [
          "Led the rollout of courier segmentation with PMs and engineers, reducing courier costs by 1.3% of GMV through data-driven strategies and technical optimisations.",
          "Partnered with Engineering to optimise delivery assignment logic, increasing courier efficiency by 12%. Implemented A/B testing for delivery fees, driving a $2.1M revenue increase in 6 months.",
          "Operated as Product Operations Manager through testing, rollout and scaling of new features, UI improvements and tools, ensuring technical solutions met business and user requirements.",
        ],
      },
    ],
  },
  {
    company: "Motive",
    logoH: 19.5,
    logo: "/logos/motive.svg",
    descriptor: "Unicorn formerly known as KeepTruckin",
    href: "https://gomotive.com",
    dates: "Sep ’20 – Sep ’21",
    roles: [{ title: "Associate Manager, Special Projects Group, Corporate Strategy", scope: "Individual contributor" }],
  },
  {
    company: "Careem",
    logoH: 18,
    logo: "/logos/careem.png",
    descriptor: "Unicorn ride-hailing company, later acquired by Uber",
    href: "https://www.careem.com",
    dates: "Oct ’19 – Sep ’20",
    roles: [
      { title: "Country Operations Lead, Delivery", scope: "Managed 4 people" },
      { title: "Lead, Growth & Channels, Ride-hailing", scope: "Managed 2 people" },
    ],
  },
  {
    company: "S&P Global Market Intelligence",
    logoH: 18.5,
    logo: "/logos/spglobal.svg",
    descriptor: "Fortune 500 financial services company",
    href: "https://www.spglobal.com",
    dates: "Apr ’17 – May ’19",
    roles: [
      { title: "Associate, Client Operations, Insurance", scope: "Managed 2 people" },
      { title: "Analyst, Product Operations, Insurance", scope: "Individual contributor" },
    ],
  },
];

export const CV_EDUCATION = [
  { title: "BSc Applied Accounting", detail: "Oxford Brookes University, Upper Second Class, 2017" },
  { title: "ACCA Affiliate", detail: "Association of Chartered Certified Accountants, 2016" },
];

export const CV_OTHER = [
  "Business: founded a fashion business (Perbal Clothing) and operated it for 2 years (2015–2017).",
  "Volunteer work: business development at AIESEC and training students in financial and career planning (2014–2016).",
  "Fitness: gym, tennis.",
];

export const CV_PDF_PATH = "/Rizwan-Mahmood-CV.pdf";
