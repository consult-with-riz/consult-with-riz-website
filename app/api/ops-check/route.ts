/**
 * Saves an Ops Health Check email.
 *
 * Not connected to a newsletter yet: with no KIT_API_KEY set, it accepts
 * the request, stores nothing, and answers { connected: false } so the page
 * can say so honestly. Connecting Kit is the TODO below.
 */
export async function POST(req: Request) {
  let body: { email?: string };
  try { body = await req.json(); } catch { return Response.json({ ok: false }, { status: 400 }); }
  const email = (body.email ?? "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Response.json({ ok: false }, { status: 400 });

  if (!process.env.KIT_API_KEY) return Response.json({ ok: true, connected: false });

  // TODO(Kit): subscribe the email to the Ops Health Check form, tag it with
  // the weakest area (body.weakest) and store the score, then return
  // { ok: true, connected: true }. Build and test once the Kit account exists.
  return Response.json({ ok: true, connected: false });
}
