import { getDatabase } from "@/db/runtime";
import { ensureWorkspaceSchema } from "@/db/workspace";

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
  await ensureWorkspaceSchema();
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

  const db = getDatabase();
  await db.prepare(
    `CREATE TABLE IF NOT EXISTS marketing_leads (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      team_size TEXT NOT NULL,
      goal TEXT NOT NULL,
      message TEXT NOT NULL DEFAULT '',
      source TEXT NOT NULL DEFAULT 'website',
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
      VALUES (?, ?, ?, ?, ?, ?, ?, 'website', ?, ?)`,
  ).bind(crypto.randomUUID(), name, email, phone, teamSize, goal, message, now, now).run();

  const scope = await db.prepare(
    `SELECT o.id AS organization_id, p.id AS product_id
     FROM organizations o JOIN products p ON p.organization_id = o.id
     WHERE o.deleted_at IS NULL AND p.deleted_at IS NULL ORDER BY o.created_at, p.created_at LIMIT 1`,
  ).first<{ organization_id: string; product_id: string }>();
  if (scope) {
    await db.prepare(
      `INSERT INTO leads
       (id, organization_id, product_id, name, email, normalized_phone, company, stage, score,
        expected_value, source, campaign, assigned_to, consent_status, consent_at,
        last_activity_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, '', 'New Lead', 0, 0, 'Website', 'Demo request',
        'Unassigned', 'granted', ?, ?, ?, ?)`,
    ).bind(
      crypto.randomUUID(), scope.organization_id, scope.product_id, name, email, phone, now, now, now, now,
    ).run();
  }

  return Response.json({ ok: true }, { status: 201 });
}
