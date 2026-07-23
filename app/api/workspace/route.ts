import { getDatabase } from "@/db/runtime";
import { ensureWorkspaceSchema, getWorkspaceData } from "@/db/workspace";

export const dynamic = "force-dynamic";

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function GET() {
  try {
    return json({ data: await getWorkspaceData() });
  } catch (error) {
    console.error("Workspace load failed", error);
    return json({ error: "The live workspace database could not be loaded." }, 500);
  }
}

type Mutation = {
  action?: string;
  id?: string;
  value?: unknown;
  content?: string;
  organizationName?: string;
  productName?: string;
};

export async function POST(request: Request) {
  let body: Mutation;
  try {
    body = await request.json() as Mutation;
  } catch {
    return json({ error: "Invalid JSON body." }, 400);
  }
  if (!body.action) return json({ error: "Action is required." }, 400);

  await ensureWorkspaceSchema();
  const workspace = await getWorkspaceData();
  const db = getDatabase();
  const now = new Date().toISOString();
  try {
    if (body.action === "workspace.initialize") {
      if (workspace.organizationId) return json({ error: "The workspace is already initialized." }, 409);
      const organizationName = String(body.organizationName || "").trim().slice(0, 100);
      const productName = String(body.productName || "").trim().slice(0, 100);
      if (!organizationName || !productName) return json({ error: "Organization and product names are required." }, 422);
      const organizationId = crypto.randomUUID();
      const productId = crypto.randomUUID();
      await db.prepare(
        "INSERT INTO organizations (id, name, created_at, updated_at) VALUES (?, ?, ?, ?)",
      ).bind(organizationId, organizationName, now, now).run();
      await db.prepare(
        `INSERT INTO products
         (id, organization_id, name, tracking_key, description, brand_voice, created_at, updated_at)
         VALUES (?, ?, ?, ?, '', '', ?, ?)`,
      ).bind(productId, organizationId, productName, `pk_${crypto.randomUUID().replaceAll("-", "")}`, now, now).run();
      return json({ data: await getWorkspaceData() });
    }
    if (!body.id) return json({ error: "Record id is required." }, 400);
    if (!workspace.organizationId) return json({ error: "Initialize the workspace before adding data." }, 409);

    switch (body.action) {
      case "lead.stage": {
        const stage = String(body.value || "");
        if (!["New Lead", "Engaged", "Qualified", "Demo / Meeting", "Negotiation", "Paid"].includes(stage)) {
          return json({ error: "Unsupported pipeline stage." }, 422);
        }
        await db.prepare("UPDATE leads SET stage = ?, updated_at = ? WHERE id = ? AND organization_id = ?")
          .bind(stage, now, body.id, workspace.organizationId).run();
        break;
      }
      case "lead.note": {
        const content = String(body.content || "").trim().slice(0, 4000);
        if (!content) return json({ error: "Note content is required." }, 422);
        await db.prepare(
          "INSERT INTO lead_notes (id, organization_id, lead_id, author_name, content, created_at) VALUES (?, ?, ?, ?, ?, ?)",
        ).bind(crypto.randomUUID(), workspace.organizationId, body.id, "Himanshu", content, now).run();
        break;
      }
      case "conversation.ai":
        await db.prepare("UPDATE conversations SET ai_enabled = ?, updated_at = ? WHERE id = ? AND organization_id = ?")
          .bind(body.value ? 1 : 0, now, body.id, workspace.organizationId).run();
        break;
      case "conversation.message": {
        const content = String(body.content || "").trim().slice(0, 4000);
        if (!content) return json({ error: "Message content is required." }, 422);
        const conversation = await db.prepare(
          "SELECT product_id FROM conversations WHERE id = ? AND organization_id = ?",
        ).bind(body.id, workspace.organizationId).first<{ product_id: string }>();
        if (!conversation) return json({ error: "Conversation not found." }, 404);
        await db.prepare(
          `INSERT INTO messages
           (id, organization_id, product_id, conversation_id, direction, sender_type, content, sent_at)
           VALUES (?, ?, ?, ?, 'outgoing', 'human', ?, ?)`,
        ).bind(crypto.randomUUID(), workspace.organizationId, conversation.product_id, body.id, content, now).run();
        await db.prepare("UPDATE conversations SET updated_at = ? WHERE id = ?").bind(now, body.id).run();
        break;
      }
      case "task.completed":
        await db.prepare("UPDATE tasks SET completed_at = ?, updated_at = ? WHERE id = ? AND organization_id = ?")
          .bind(body.value ? now : null, now, body.id, workspace.organizationId).run();
        break;
      case "automation.enabled":
        await db.prepare("UPDATE automations SET enabled = ?, updated_at = ? WHERE id = ? AND organization_id = ?")
          .bind(body.value ? 1 : 0, now, body.id, workspace.organizationId).run();
        break;
      case "campaign.pause":
        await db.prepare("UPDATE campaigns SET status = 'Paused', updated_at = ? WHERE id = ? AND organization_id = ?")
          .bind(now, body.id, workspace.organizationId).run();
        await db.prepare(
          `INSERT INTO audit_logs
           (id, organization_id, actor_id, actor_type, action, target_type, target_id, metadata_json, created_at)
           VALUES (?, ?, 'Himanshu', 'user', 'Paused campaign', 'campaign', ?, '{}', ?)`,
        ).bind(crypto.randomUUID(), workspace.organizationId, body.id, now).run();
        break;
      default:
        return json({ error: "Unsupported workspace action." }, 422);
    }
    return json({ data: await getWorkspaceData() });
  } catch (error) {
    console.error("Workspace mutation failed", error);
    return json({ error: "The live database update failed." }, 500);
  }
}
