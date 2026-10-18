import CalBookingButton from "@/components/CalModal";
import {
  CV_ACHIEVEMENTS,
  CV_CONTACT,
  CV_EDUCATION,
  CV_EXPERIENCE,
  CV_OTHER,
  CV_PDF_PATH,
  CV_SKILLS,
  CV_SUMMARY,
} from "@/components/cv/cvData";

/* Small line icons for the contact row, drawn in currentColor. */
const ICON = {
  mail: <path d="M3 6.5h18v11H3z M3 7l9 6 9-6" />,
  phone: <path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16.5 16.5 0 0 1 4.5 5.5a2 2 0 0 1 2-2z" />,
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M7.5 10.5v6 M7.5 7.5v.01 M11 16.5v-6 M11 13a2.5 2.5 0 0 1 5 0v3.5" />
    </>
  ),
  pin: <path d="M12 21s-6.5-6.2-6.5-11.2a6.5 6.5 0 0 1 13 0C18.5 14.8 12 21 12 21z M12 12.3a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />,
};

function ContactIcon({ name }: { name: keyof typeof ICON }) {
  return (
    <svg className="cv-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICON[name]}
    </svg>
  );
}



/**
 * The CV document, shared by /cv and its logo previews. On screen it is a sheet on the cream background with
 * a download bar; in print it becomes plain A4, and the downloadable PDF
 * is printed from exactly this page (scripts/cv-pdf.mjs).
 */
export type CvLogoMode = "none" | "with-name" | "logo-only";

export default function CvView({ logoMode = "none" }: { logoMode?: CvLogoMode }) {
  return (
    <div className="cv-wrap">
      <style>{`
        .cv-wrap { background: var(--cream); padding: 112px 16px 80px; }
        .cv-bar {
          max-width: 860px; margin: 0 auto 20px;
          display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;
        }
        .cv-bar p { margin: 0; font-family: var(--font-geist-mono), monospace; font-size: 13px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted); }
        .cv-bar-actions { display: flex; gap: 10px; flex-wrap: wrap; }

        .cv {
          --cv-ink: #1C1B19;
          max-width: 860px; margin: 0 auto; background: #fff;
          border: 1px solid var(--line); border-radius: 14px; box-shadow: var(--shadow-lg);
          padding: 56px 60px; color: var(--cv-ink);
          font-size: 14px; line-height: 1.55;
        }
        /* the site's global p/li sizes and list reset don't apply inside the CV */
        .cv p, .cv li, .cv dd, .cv dt { font-size: inherit; line-height: inherit; }
        .cv ul { list-style: disc; }
        .cv li::marker { color: var(--coral); }
        .cv a { color: inherit; text-decoration: none; }
        .cv a:hover { color: var(--coral); }

        .cv-head { text-align: center; padding-bottom: 20px; border-bottom: 2px solid var(--coral); }
        .cv-name { margin: 0; font-size: 34px; font-weight: 600; letter-spacing: -0.02em; line-height: 1.1; color: #22332C; }
        .cv-role { margin: 6px 0 12px; font-size: 16px; font-weight: 600; color: var(--coral); }
        .cv-contact { margin: 0; display: flex; justify-content: center; flex-wrap: wrap; gap: 6px 22px; font-size: 13px; font-weight: 600; }
        .cv-contact > a, .cv-contact > span { display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; color: var(--coral); }
        .cv .cv-contact > a:hover { color: #c8411f; text-decoration: underline; }
        .cv-ic { width: 15px; height: 15px; flex-shrink: 0; }
        .cv-summary { margin: 18px 0 0; text-align: center; }

        /* each section opens on a cream band with a coral edge */
        .cv-h2 {
          margin: 28px 0 14px; padding: 7px 12px;
          background: var(--cream); border-left: 4px solid var(--coral); border-radius: 0 6px 6px 0;
          font-family: var(--font-geist-mono), monospace; font-size: 12px; font-weight: 700;
          letter-spacing: 0.14em; text-transform: uppercase; color: #22332C;
        }
        /* skills as labelled tiles, one per category */
        .cv-skills { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 0; }
        .cv-skill { border: 1px solid var(--line); border-top: 3px solid var(--coral); border-radius: 8px; padding: 9px 12px 10px; background: #FDFBF7; break-inside: avoid; }
        .cv-skill dt {
          margin-bottom: 3px;
          font-family: var(--font-geist-mono), monospace; font-size: 11px; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase; color: var(--coral);
        }
        .cv-skill dd { margin: 0; }
        .cv-skill:last-child:nth-child(odd) { grid-column: 1 / -1; }

        .cv-group { margin: 12px 0 4px; font-weight: 700; font-size: 13.5px; }
        .cv ul { margin: 4px 0 0; padding-left: 18px; }
        .cv li { margin: 3px 0; }
        .cv li b { font-weight: 600; }

        .cv-job { margin-top: 16px; break-inside: avoid; }
        .cv-job + .cv-job { padding-top: 14px; border-top: 1px dashed var(--line-2); }
        .cv-job-top { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
        .cv-company { display: inline-flex; align-items: center; flex-wrap: wrap; gap: 4px 6px; font-weight: 700; font-size: 15px; }
        .cv-logo-slot { flex: 0 0 96px; display: flex; align-items: center; }
        .cv-logo { display: block; height: calc(var(--lh) * 1px); width: auto; max-width: none; object-fit: contain; margin-right: 4px; }
        .cv-company.is-self, .cv-company.is-self a { color: var(--coral); }
        .cv-company small { font-weight: 400; font-size: 13.5px; color: #4A4A4A; }
        .cv-dates { font-family: var(--font-geist-mono), monospace; font-size: 12.5px; white-space: nowrap; }
        .cv-role-row { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; flex-wrap: wrap; margin-top: 6px; }
        .cv-role-title { font-weight: 600; }
        .cv-role-title em { font-style: normal; font-weight: 400; color: #4A4A4A; }
        .cv-scope { font-size: 12.5px; color: #4A4A4A; white-space: nowrap; }

        @media (max-width: 640px) {
          .cv-wrap { padding-top: 96px; }
          .cv { padding: 28px 20px; border-radius: 12px; font-size: 13.5px; }
          .cv-name { font-size: 28px; }
          .cv-skills { grid-template-columns: 1fr; }
        }

        /* Print / PDF: plain A4, no site chrome */
        @page { size: A4; margin: 10mm 12mm; }
        @media print {
          header, footer, nextjs-portal, .cv-bar { display: none !important; }
          html, body { background: #fff !important; }
          .cv-wrap { padding: 0; background: #fff; }
          .cv { max-width: none; border: 0; border-radius: 0; box-shadow: none; padding: 0; font-size: 9pt; line-height: 1.32; }
          .cv-head { padding-bottom: 7pt; border-bottom-width: 1.5pt; }
          .cv-name { font-size: 20pt; }
          .cv-role { font-size: 11pt; margin: 1pt 0 4pt; }
          .cv-contact { font-size: 8.5pt; gap: 2pt 14pt; }
          .cv-ic { width: 9pt; height: 9pt; }
          .cv-summary { margin-top: 5pt; }
          .cv-h2 { margin: 9pt 0 5pt; padding: 3pt 7pt; font-size: 8pt; border-left-width: 2.5pt; }
          .cv-skills { gap: 4pt; }
          .cv-skill { padding: 4pt 7pt 5pt; border-top-width: 2pt; border-radius: 4pt; }
          .cv-skill dt { font-size: 7pt; margin-bottom: 1pt; }
          .cv-group { margin: 4pt 0 1pt; font-size: 9pt; }
          .cv ul { margin-top: 1pt; padding-left: 13pt; }
          .cv li { margin: 1pt 0; }
          .cv-job { margin-top: 6pt; }
          .cv-job + .cv-job { padding-top: 5pt; }
          .cv-company { font-size: 9.5pt; gap: 2pt 5pt; }
          .cv-logo { height: calc(var(--lh) * 0.62pt); }
          .cv-logo-slot { flex-basis: 60pt; }
          .cv-company small, .cv-dates, .cv-scope, .cv-role-title em { font-size: 8.5pt; }
          .cv-role-row { margin-top: 2pt; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      <div className="cv-bar">
        <p>Curriculum vitae</p>
        <div className="cv-bar-actions">
          <a href={CV_PDF_PATH} download className="btn-coral">Download PDF</a>
          <CalBookingButton className="btn-ghost">Book a call</CalBookingButton>
        </div>
      </div>

      <article className="cv">
        <div className="cv-head">
          <h1 className="cv-name">{CV_CONTACT.name}</h1>
          <p className="cv-role">{CV_CONTACT.role}</p>
          <p className="cv-contact">
            <a href={`mailto:${CV_CONTACT.email}`}><ContactIcon name="mail" />{CV_CONTACT.email}</a>
            <a href={CV_CONTACT.phoneHref}><ContactIcon name="phone" />{CV_CONTACT.phone}</a>
            <a href={CV_CONTACT.linkedinHref} target="_blank" rel="noopener noreferrer"><ContactIcon name="linkedin" />{CV_CONTACT.linkedin}</a>
            <span><ContactIcon name="pin" />{CV_CONTACT.location}</span>
          </p>
          <p className="cv-summary">{CV_SUMMARY}</p>
        </div>

        <h2 className="cv-h2">Skills &amp; expertise</h2>
        <dl className="cv-skills">
          {CV_SKILLS.map((s) => (
            <div key={s.label} className="cv-skill">
              <dt>{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>

        <h2 className="cv-h2">Career achievements</h2>
        {CV_ACHIEVEMENTS.map((g) => (
          <div key={g.group}>
            <p className="cv-group">{g.group}</p>
            <ul>
              {g.items.map((it) => (
                <li key={it.tag}>
                  <b>{it.tag}:</b> {it.text}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <h2 className="cv-h2">Professional experience</h2>
        {CV_EXPERIENCE.map((job) => (
          <section key={job.company} className="cv-job">
            <div className="cv-job-top">
              <span className={`cv-company${job.self ? " is-self" : ""}`}>
                {logoMode !== "none" && job.logo && (
                  /* fixed-width slot so every company name starts in the same column */
                  <span className="cv-logo-slot">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={job.logo}
                    alt={job.company}
                    className={`cv-logo${job.logoClass ? " " + job.logoClass : ""}`}
                    style={{ ["--lh" as string]: job.logoH ?? 20 }}
                  />
                  </span>
                )}
                {(logoMode !== "logo-only" || !job.logo) &&
                  (job.href ? (
                    <a href={job.href} target="_blank" rel="noopener noreferrer">{job.company}</a>
                  ) : (
                    job.company
                  ))}
                <small>{logoMode === "logo-only" && job.logo ? job.descriptor : `· ${job.descriptor}`}</small>
              </span>
              <span className="cv-dates">{job.dates}</span>
            </div>
            {job.roles.map((r) => (
              <div key={r.title}>
                <div className="cv-role-row">
                  <span className="cv-role-title">
                    {r.title}
                    {r.meta && <em> · {r.meta}</em>}
                  </span>
                  {r.scope && <span className="cv-scope">{r.scope}</span>}
                </div>
                {r.bullets && (
                  <ul>
                    {r.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        ))}

        <h2 className="cv-h2">Education</h2>
        <ul>
          {CV_EDUCATION.map((e) => (
            <li key={e.title}>
              <b>{e.title}</b>, {e.detail}
            </li>
          ))}
        </ul>

        <h2 className="cv-h2">Other</h2>
        <ul>
          {CV_OTHER.map((o) => (
            <li key={o}>{o}</li>
          ))}
        </ul>
      </article>
    </div>
  );
}
