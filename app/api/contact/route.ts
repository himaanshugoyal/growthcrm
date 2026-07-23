import { env } from "cloudflare:workers";

type ContactRequest = {
  name?: string;
  email?: string;
  phone?: string;
  teamSize?: string;
  goal?: string;
  message?: string;
  consent?: string;
};

const clean = (value: unknown, max: number) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

export async function POST(request: Request) {
  if (Number(request.headers.get("content-length") || 0) > 16_384) {
    return Response.json({ error: "Request is too large." }, { status: 413 });
  }

  let payload: ContactRequest;
  try {
    payload = await request.json() as ContactRequest;
  } catch {
    return Response.json({ error: "Please submit a valid form." }, { status: 400 });
  }

  const name = clean(payload.name, 80);
  const email = clean(payload.email, 120).toLowerCase();
  const phone = clean(payload.phone, 24);
  const teamSize = clean(payload.teamSize, 40);
  const goal = clean(payload.goal, 100);
  const message = clean(payload.message, 800);

  if (!name || !email || !phone || !teamSize || !goal || payload.consent !== "yes") {
    return Response.json({ error: "Please complete all required fields." }, { status: 422 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Please enter a valid work email." }, { status: 422 });
  }

  const db = env.DB;
  await db.prepare(
    `CREATE TABLE IF NOT EXISTS marketing_leads (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      team_size TEXT NOT NULL,
      goal TEXT NOT NULL,
      message TEXT NOT NULL DEFAULT '',
      source TEXT NOT NULL DEFAULT 'website_demo',
      consent_at TEXT NOT NULL,
      created_at TEXT NOT NULL
    )`,
  ).run();
  await db.prepare(
    "CREATE INDEX IF NOT EXISTS marketing_leads_created_idx ON marketing_leads (created_at)",
  ).run();

  const now = new Date().toISOString();
  await db.prepare(
    `INSERT INTO marketing_leads
      (id, name, email, phone, team_size, goal, message, source, consent_at, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'website_demo', ?, ?)`,
  ).bind(crypto.randomUUID(), name, email, phone, teamSize, goal, message, now, now).run();

  return Response.json({ ok: true }, { status: 201 });
}
