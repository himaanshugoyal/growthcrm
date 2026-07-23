import type {
  AuditEntry, Automation, Campaign, Conversation, ConversationMessage, Customer,
  Integration, Lead, LifecycleEvent, Product, Summary, Task, WorkspaceData,
} from "@/app/data";
import { emptyWorkspaceData } from "@/app/data";
import { allRows, firstRow, getDatabase } from "./runtime";

const schemaStatements = [
  `CREATE TABLE IF NOT EXISTS organizations (
    id TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL, created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL, deleted_at TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY NOT NULL, organization_id TEXT NOT NULL, name TEXT NOT NULL,
    tracking_key TEXT NOT NULL UNIQUE, website TEXT, description TEXT NOT NULL DEFAULT '',
    brand_voice TEXT NOT NULL DEFAULT '', activation_event TEXT, created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL, deleted_at TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY NOT NULL, organization_id TEXT NOT NULL, product_id TEXT NOT NULL,
    name TEXT NOT NULL, email TEXT, normalized_phone TEXT, external_user_id TEXT, company TEXT,
    stage TEXT NOT NULL DEFAULT 'New Lead', score INTEGER NOT NULL DEFAULT 0,
    expected_value REAL NOT NULL DEFAULT 0, source TEXT, campaign TEXT, assigned_to TEXT,
    location TEXT, requirement TEXT, pain TEXT, budget TEXT, timeline TEXT, next_step TEXT,
    intent TEXT, consent_status TEXT NOT NULL DEFAULT 'unknown', consent_at TEXT,
    last_activity_at TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL, deleted_at TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS lead_notes (
    id TEXT PRIMARY KEY NOT NULL, organization_id TEXT NOT NULL, lead_id TEXT NOT NULL,
    author_name TEXT NOT NULL, content TEXT NOT NULL, created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS lifecycle_events (
    id TEXT PRIMARY KEY NOT NULL, organization_id TEXT NOT NULL, product_id TEXT NOT NULL,
    lead_id TEXT, visitor_id TEXT, event_name TEXT NOT NULL, occurred_at TEXT NOT NULL,
    idempotency_key TEXT NOT NULL, properties_json TEXT NOT NULL DEFAULT '{}',
    attribution_json TEXT NOT NULL DEFAULT '{}', created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS conversations (
    id TEXT PRIMARY KEY NOT NULL, organization_id TEXT NOT NULL, product_id TEXT NOT NULL,
    lead_id TEXT NOT NULL, channel TEXT NOT NULL, ai_enabled INTEGER NOT NULL DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'open', handoff_summary TEXT, created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL, deleted_at TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY NOT NULL, organization_id TEXT NOT NULL, product_id TEXT NOT NULL,
    conversation_id TEXT NOT NULL, direction TEXT NOT NULL, sender_type TEXT NOT NULL,
    content TEXT NOT NULL, sent_at TEXT NOT NULL, agent_run_id TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY NOT NULL, organization_id TEXT NOT NULL, product_id TEXT NOT NULL,
    lead_id TEXT, plan TEXT, subscription_status TEXT, total_revenue REAL NOT NULL DEFAULT 0,
    health_score INTEGER NOT NULL DEFAULT 0, health_factors_json TEXT NOT NULL DEFAULT '{}',
    csat REAL, nps INTEGER, last_activity_at TEXT, created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL, deleted_at TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS campaigns (
    id TEXT PRIMARY KEY NOT NULL, organization_id TEXT NOT NULL, product_id TEXT NOT NULL,
    name TEXT NOT NULL, platform TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'Draft',
    spend REAL NOT NULL DEFAULT 0, lead_count INTEGER NOT NULL DEFAULT 0,
    paid_count INTEGER NOT NULL DEFAULT 0, revenue REAL NOT NULL DEFAULT 0,
    last_synced_at TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL, deleted_at TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY NOT NULL, organization_id TEXT NOT NULL, product_id TEXT, lead_id TEXT,
    title TEXT NOT NULL, task_type TEXT NOT NULL DEFAULT 'Follow-up', due_at TEXT,
    priority TEXT NOT NULL DEFAULT 'Medium', assigned_to TEXT, completed_at TEXT,
    created_at TEXT NOT NULL, updated_at TEXT NOT NULL, deleted_at TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS automations (
    id TEXT PRIMARY KEY NOT NULL, organization_id TEXT NOT NULL, product_id TEXT, name TEXT NOT NULL,
    trigger_description TEXT NOT NULL, action_description TEXT NOT NULL,
    run_count INTEGER NOT NULL DEFAULT 0, enabled INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL, updated_at TEXT NOT NULL, deleted_at TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS integrations (
    id TEXT PRIMARY KEY NOT NULL, organization_id TEXT NOT NULL, product_id TEXT,
    provider TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'Disconnected',
    description TEXT NOT NULL DEFAULT '', last_synced_at TEXT, created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL, deleted_at TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY NOT NULL, organization_id TEXT NOT NULL, product_id TEXT,
    actor_id TEXT, actor_type TEXT NOT NULL, action TEXT NOT NULL, target_type TEXT NOT NULL,
    target_id TEXT, metadata_json TEXT NOT NULL DEFAULT '{}', created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS marketing_leads (
    id TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL,
    team_size TEXT NOT NULL, goal TEXT NOT NULL, message TEXT NOT NULL DEFAULT '',
    source TEXT NOT NULL DEFAULT 'website', consent_at TEXT NOT NULL, created_at TEXT NOT NULL
  )`,
  "CREATE INDEX IF NOT EXISTS leads_org_product_idx ON leads (organization_id, product_id)",
  "CREATE INDEX IF NOT EXISTS lead_notes_lead_time_idx ON lead_notes (lead_id, created_at)",
  "CREATE INDEX IF NOT EXISTS messages_conversation_idx ON messages (conversation_id, sent_at)",
  "CREATE INDEX IF NOT EXISTS tasks_org_due_idx ON tasks (organization_id, due_at)",
];

let schemaReady: Promise<void> | null = null;

export function ensureWorkspaceSchema() {
  schemaReady ??= (async () => {
    const db = getDatabase();
    for (const sql of schemaStatements) await db.prepare(sql).run();
  })();
  return schemaReady;
}

const palette = [
  ["#bd4e2f", "#fff0e9", "peach"],
  ["#4267b2", "#eaf0ff", "blue"],
  ["#7b5aa6", "#f2eaff", "violet"],
  ["#3f7557", "#e1f0e7", "mint"],
  ["#806532", "#f2e8d3", "sand"],
  ["#9a536b", "#fae5eb", "pink"],
] as const;

const money = (value: number) =>
  value.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const initials = (name: string) => name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
const relative = (date: string | null) => {
  if (!date) return "No activity";
  const minutes = Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / 60_000));
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
  return `${Math.floor(minutes / 1440)}d ago`;
};

type OrganizationRow = { id: string; name: string };
type ProductRow = { id: string; name: string; description: string; tracking_key: string };
type LeadRow = {
  id: string; product_id: string; product_name: string; name: string; company: string | null;
  stage: string; score: number; expected_value: number; source: string | null; campaign: string | null;
  assigned_to: string | null; location: string | null; requirement: string | null; pain: string | null;
  budget: string | null; timeline: string | null; next_step: string | null; intent: string | null;
  email: string | null; normalized_phone: string | null; last_activity_at: string | null;
};

export async function getWorkspaceData(): Promise<WorkspaceData> {
  await ensureWorkspaceSchema();
  const requestedOrganization = process.env.APP_ORGANIZATION_ID?.trim();
  const organization = requestedOrganization
    ? await firstRow<OrganizationRow>("SELECT id, name FROM organizations WHERE id = ? AND deleted_at IS NULL", requestedOrganization)
    : await firstRow<OrganizationRow>("SELECT id, name FROM organizations WHERE deleted_at IS NULL ORDER BY created_at LIMIT 1");
  if (!organization) return { ...emptyWorkspaceData, loadedAt: new Date().toISOString() };

  const organizationId = organization.id;
  const [
    productRows, leadRows, noteRows, campaignRows, customerRows, conversationRows,
    messageRows, taskRows, automationRows, eventRows, auditRows, integrationRows,
  ] = await Promise.all([
    allRows<ProductRow>("SELECT id, name, description, tracking_key FROM products WHERE organization_id = ? AND deleted_at IS NULL ORDER BY created_at", organizationId),
    allRows<LeadRow>(`SELECT l.*, p.name AS product_name FROM leads l JOIN products p ON p.id = l.product_id
      WHERE l.organization_id = ? AND l.deleted_at IS NULL ORDER BY COALESCE(l.last_activity_at, l.created_at) DESC`, organizationId),
    allRows<{ id: string; lead_id: string; author_name: string; content: string; created_at: string }>(
      "SELECT id, lead_id, author_name, content, created_at FROM lead_notes WHERE organization_id = ? ORDER BY created_at DESC", organizationId),
    allRows<Record<string, string | number | null>>(`SELECT c.*, p.name AS product_name FROM campaigns c JOIN products p ON p.id = c.product_id
      WHERE c.organization_id = ? AND c.deleted_at IS NULL ORDER BY c.created_at DESC`, organizationId),
    allRows<Record<string, string | number | null>>(`SELECT c.*, p.name AS product_name, l.name AS lead_name, l.company AS lead_company
      FROM customers c JOIN products p ON p.id = c.product_id LEFT JOIN leads l ON l.id = c.lead_id
      WHERE c.organization_id = ? AND c.deleted_at IS NULL ORDER BY c.health_score DESC`, organizationId),
    allRows<Record<string, string | number | null>>(`SELECT c.*, p.name AS product_name, l.name AS lead_name
      FROM conversations c JOIN products p ON p.id = c.product_id JOIN leads l ON l.id = c.lead_id
      WHERE c.organization_id = ? AND c.deleted_at IS NULL ORDER BY c.updated_at DESC`, organizationId),
    allRows<Record<string, string>>("SELECT * FROM messages WHERE organization_id = ? ORDER BY sent_at", organizationId),
    allRows<Record<string, string | null>>(`SELECT t.*, l.name AS lead_name FROM tasks t LEFT JOIN leads l ON l.id = t.lead_id
      WHERE t.organization_id = ? AND t.deleted_at IS NULL ORDER BY t.completed_at IS NOT NULL, t.due_at`, organizationId),
    allRows<Record<string, string | number | null>>(`SELECT a.*, p.name AS product_name FROM automations a LEFT JOIN products p ON p.id = a.product_id
      WHERE a.organization_id = ? AND a.deleted_at IS NULL ORDER BY a.created_at DESC`, organizationId),
    allRows<Record<string, string>>(`SELECT e.id, e.event_name, e.occurred_at, p.name AS product_name
      FROM lifecycle_events e JOIN products p ON p.id = e.product_id WHERE e.organization_id = ? ORDER BY e.occurred_at DESC LIMIT 50`, organizationId),
    allRows<Record<string, string | null>>("SELECT * FROM audit_logs WHERE organization_id = ? ORDER BY created_at DESC LIMIT 50", organizationId),
    allRows<Record<string, string | null>>("SELECT * FROM integrations WHERE organization_id = ? AND deleted_at IS NULL ORDER BY provider", organizationId),
  ]);

  const products: Product[] = [
    { id: "all", name: "All Products", short: "OS", color: "#20201e", bg: "#f1efe9", description: "", trackingKey: "" },
    ...productRows.map((product, index) => ({
      id: product.id, name: product.name, short: initials(product.name),
      color: palette[index % palette.length][0], bg: palette[index % palette.length][1],
      description: product.description || "", trackingKey: product.tracking_key,
    })),
  ];
  const productTone = new Map(productRows.map((product, index) => [product.id, palette[index % palette.length][2]]));
  const notesByLead = new Map<string, Lead["notes"]>();
  for (const note of noteRows) {
    const list = notesByLead.get(note.lead_id) ?? [];
    list.push({ id: note.id, author: note.author_name, content: note.content, createdAt: note.created_at });
    notesByLead.set(note.lead_id, list);
  }
  const leads: Lead[] = leadRows.map((lead) => ({
    id: lead.id, name: lead.name, company: lead.company || "—", product: lead.product_name,
    productId: lead.product_id, stage: lead.stage, score: Number(lead.score || 0),
    value: money(Number(lead.expected_value || 0)), valueNumber: Number(lead.expected_value || 0),
    source: lead.source || "Unknown", campaign: lead.campaign || "No campaign",
    activity: relative(lead.last_activity_at), owner: lead.assigned_to || "Unassigned",
    initials: initials(lead.name), tone: productTone.get(lead.product_id) || "peach",
    next: lead.next_step || "No next step", intent: lead.intent || (lead.score >= 80 ? "High" : lead.score >= 50 ? "Medium" : "Low"),
    email: lead.email || "—", phone: lead.normalized_phone || "—", location: lead.location || "—",
    requirement: lead.requirement || "Not captured", pain: lead.pain || "Not captured",
    budget: lead.budget || "Not captured", timeline: lead.timeline || "Not captured",
    notes: notesByLead.get(lead.id) ?? [],
  }));
  const campaigns: Campaign[] = campaignRows.map((row) => {
    const spend = Number(row.spend || 0); const revenue = Number(row.revenue || 0);
    return { id: String(row.id), name: String(row.name), platform: String(row.platform),
      product: String(row.product_name), productId: String(row.product_id), status: String(row.status),
      spend: money(spend), spendValue: spend, leads: Number(row.lead_count || 0), paid: Number(row.paid_count || 0),
      revenue: money(revenue), revenueValue: revenue, roas: spend ? `${(revenue / spend).toFixed(1)}×` : "—",
      sync: relative(row.last_synced_at ? String(row.last_synced_at) : null) };
  });
  const customers: Customer[] = customerRows.map((row) => ({
    id: String(row.id), name: row.lead_name ? String(row.lead_name) : "Unlinked customer",
    company: row.lead_company ? String(row.lead_company) : "—", product: String(row.product_name),
    productId: String(row.product_id), plan: row.plan ? String(row.plan) : "—",
    revenue: money(Number(row.total_revenue || 0)), revenueValue: Number(row.total_revenue || 0),
    health: Number(row.health_score || 0), status: row.subscription_status ? String(row.subscription_status) : "Unknown",
    activity: relative(row.last_activity_at ? String(row.last_activity_at) : null),
    initials: initials(row.lead_name ? String(row.lead_name) : "Customer"),
    csat: row.csat == null ? null : Number(row.csat), nps: row.nps == null ? null : Number(row.nps),
  }));
  const messagesByConversation = new Map<string, ConversationMessage[]>();
  for (const row of messageRows) {
    const list = messagesByConversation.get(row.conversation_id) ?? [];
    list.push({ id: row.id, direction: row.direction, senderType: row.sender_type, content: row.content, sentAt: row.sent_at });
    messagesByConversation.set(row.conversation_id, list);
  }
  const conversations: Conversation[] = conversationRows.map((row) => {
    const messages = messagesByConversation.get(String(row.id)) ?? [];
    const latest = messages.at(-1);
    return { id: String(row.id), leadId: String(row.lead_id), lead: String(row.lead_name),
      product: String(row.product_name), productId: String(row.product_id), channel: String(row.channel),
      status: String(row.status), preview: latest?.content || "No messages yet",
      time: relative(latest?.sentAt || String(row.updated_at)), unread: 0, sentiment: "Not scored",
      initials: initials(String(row.lead_name)), aiEnabled: Boolean(row.ai_enabled),
      handoffSummary: row.handoff_summary ? String(row.handoff_summary) : "", messages };
  });
  const tasks: Task[] = taskRows.map((row) => ({
    id: String(row.id), title: String(row.title), type: String(row.task_type),
    due: row.due_at ? new Date(row.due_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "No due date",
    dueAt: row.due_at, priority: String(row.priority), owner: row.assigned_to || "Unassigned",
    lead: row.lead_name || "No linked lead", completed: Boolean(row.completed_at),
  }));
  const automations: Automation[] = automationRows.map((row) => ({
    id: String(row.id), name: String(row.name), trigger: String(row.trigger_description),
    action: String(row.action_description), runs: Number(row.run_count || 0), status: Boolean(row.enabled),
    product: row.product_name ? String(row.product_name) : "All Products",
  }));
  const lifecycleEvents: LifecycleEvent[] = eventRows.map((row) => ({
    id: row.id, event: row.event_name, product: row.product_name, occurredAt: row.occurred_at,
  }));
  const auditLogs: AuditEntry[] = auditRows.map((row) => ({
    id: String(row.id), actor: row.actor_id || String(row.actor_type), action: String(row.action),
    targetType: String(row.target_type), createdAt: String(row.created_at),
  }));
  const integrations: Integration[] = integrationRows.map((row) => ({
    id: String(row.id), name: String(row.provider), status: String(row.status),
    description: String(row.description || ""), productId: row.product_id,
  }));

  const summaryFor = (productId: string): Summary => {
    const scopedLeads = productId === "all" ? leads : leads.filter((lead) => lead.productId === productId);
    const scopedCustomers = productId === "all" ? customers : customers.filter((customer) => customer.productId === productId);
    const scopedCampaigns = productId === "all" ? campaigns : campaigns.filter((campaign) => campaign.productId === productId);
    const scopedEvents = productId === "all" ? lifecycleEvents : lifecycleEvents.filter((event) =>
      productRows.find((product) => product.id === productId)?.name === event.product);
    const revenueValue = scopedCustomers.reduce((sum, customer) => sum + customer.revenueValue, 0);
    const spend = scopedCampaigns.reduce((sum, campaign) => sum + campaign.spendValue, 0);
    return { leads: scopedLeads.length, qualified: scopedLeads.filter((lead) => lead.score >= 70 || ["Qualified", "Demo / Meeting", "Negotiation", "Paid"].includes(lead.stage)).length,
      signups: scopedEvents.filter((event) => event.event === "signup_completed").length,
      paid: scopedCustomers.filter((customer) => !["cancelled", "churned"].includes(customer.status.toLowerCase())).length,
      revenue: money(revenueValue), revenueValue, roas: spend ? `${(revenueValue / spend).toFixed(1)}×` : "—", trend: "Live" };
  };
  const summaryByProduct: Record<string, Summary> = { all: summaryFor("all") };
  for (const product of productRows) summaryByProduct[product.id] = summaryFor(product.id);

  return {
    organizationId, organizationName: organization.name, loadedAt: new Date().toISOString(),
    products, summaryByProduct, leads, campaigns, customers, conversations, tasks,
    automations, lifecycleEvents, auditLogs, integrations,
  };
}
