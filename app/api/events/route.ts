import { env } from "cloudflare:workers";

const allowedEvents = new Set([
  "lead_created", "form_submitted", "demo_requested", "signup_started",
  "signup_completed", "activation_completed", "trial_started",
  "subscription_started", "payment_received", "subscription_cancelled",
  "churned", "reactivated", "csat_submitted", "nps_submitted",
]);

type EventPayload = {
  event: string;
  userId?: string;
  visitorId?: string;
  occurredAt?: string;
  properties?: Record<string, unknown>;
  attribution?: Record<string, unknown>;
};

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const productKey = request.headers.get("x-growthos-product-key")?.trim();
  const idempotencyKey = request.headers.get("idempotency-key")?.trim();
  if (!productKey || !idempotencyKey || idempotencyKey.length > 160) {
    return json({ error: "Product key and valid idempotency key are required." }, 400);
  }

  let payload: EventPayload;
  try {
    if (Number(request.headers.get("content-length") || 0) > 32_768) {
      return json({ error: "Payload too large." }, 413);
    }
    payload = await request.json() as EventPayload;
  } catch {
    return json({ error: "Invalid JSON body." }, 400);
  }
  if (!allowedEvents.has(payload.event)) {
    return json({ error: "Unsupported lifecycle event." }, 422);
  }

  const product = await env.DB.prepare(
    "SELECT id, organization_id FROM products WHERE tracking_key = ? AND deleted_at IS NULL LIMIT 1",
  ).bind(productKey).first<{ id: string; organization_id: string }>();
  if (!product) return json({ error: "Unknown product key." }, 404);

  const eventId = crypto.randomUUID();
  const occurredAt = payload.occurredAt || new Date().toISOString();
  try {
    await env.DB.prepare(
      `INSERT INTO lifecycle_events
       (id, organization_id, product_id, visitor_id, event_name, occurred_at, idempotency_key, properties_json, attribution_json)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).bind(
      eventId, product.organization_id, product.id, payload.visitorId || null,
      payload.event, occurredAt, idempotencyKey,
      JSON.stringify(payload.properties || {}), JSON.stringify(payload.attribution || {}),
    ).run();
  } catch (error) {
    if (String(error).toLowerCase().includes("unique")) {
      return json({ accepted: true, duplicate: true });
    }
    return json({ error: "Event could not be recorded." }, 500);
  }
  return json({ accepted: true, eventId }, 202);
}
