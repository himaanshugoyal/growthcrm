import { index, integer, real, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

const audit = {
  createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
  updatedAt: text("updated_at").notNull().default("CURRENT_TIMESTAMP"),
  deletedAt: text("deleted_at"),
};

export const organizations = sqliteTable("organizations", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  ...audit,
});

export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id").notNull().references(() => organizations.id),
  name: text("name").notNull(),
  trackingKey: text("tracking_key").notNull(),
  website: text("website"),
  description: text("description").notNull().default(""),
  brandVoice: text("brand_voice").notNull().default(""),
  activationEvent: text("activation_event"),
  ...audit,
}, (t) => [
  uniqueIndex("products_tracking_key_unique").on(t.trackingKey),
  index("products_org_idx").on(t.organizationId),
]);

export const leads = sqliteTable("leads", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id").notNull().references(() => organizations.id),
  productId: text("product_id").notNull().references(() => products.id),
  name: text("name").notNull(),
  email: text("email"),
  normalizedPhone: text("normalized_phone"),
  externalUserId: text("external_user_id"),
  company: text("company"),
  stage: text("stage").notNull().default("New Lead"),
  score: integer("score").notNull().default(0),
  expectedValue: real("expected_value").notNull().default(0),
  source: text("source"),
  campaign: text("campaign"),
  assignedTo: text("assigned_to"),
  consentStatus: text("consent_status").notNull().default("unknown"),
  consentAt: text("consent_at"),
  lastActivityAt: text("last_activity_at"),
  ...audit,
}, (t) => [
  index("leads_org_product_idx").on(t.organizationId, t.productId),
  index("leads_email_idx").on(t.organizationId, t.email),
  index("leads_phone_idx").on(t.organizationId, t.normalizedPhone),
]);

export const lifecycleEvents = sqliteTable("lifecycle_events", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id").notNull().references(() => organizations.id),
  productId: text("product_id").notNull().references(() => products.id),
  leadId: text("lead_id").references(() => leads.id),
  visitorId: text("visitor_id"),
  eventName: text("event_name").notNull(),
  occurredAt: text("occurred_at").notNull(),
  idempotencyKey: text("idempotency_key").notNull(),
  propertiesJson: text("properties_json").notNull().default("{}"),
  attributionJson: text("attribution_json").notNull().default("{}"),
  createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
}, (t) => [
  uniqueIndex("events_idempotency_unique").on(t.organizationId, t.idempotencyKey),
  index("events_product_time_idx").on(t.organizationId, t.productId, t.occurredAt),
]);

export const conversations = sqliteTable("conversations", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id").notNull(),
  productId: text("product_id").notNull(),
  leadId: text("lead_id").notNull(),
  channel: text("channel").notNull(),
  aiEnabled: integer("ai_enabled", { mode: "boolean" }).notNull().default(true),
  status: text("status").notNull().default("open"),
  handoffSummary: text("handoff_summary"),
  ...audit,
}, (t) => [index("conversations_scope_idx").on(t.organizationId, t.productId)]);

export const messages = sqliteTable("messages", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id").notNull(),
  productId: text("product_id").notNull(),
  conversationId: text("conversation_id").notNull().references(() => conversations.id),
  direction: text("direction").notNull(),
  senderType: text("sender_type").notNull(),
  content: text("content").notNull(),
  sentAt: text("sent_at").notNull(),
  agentRunId: text("agent_run_id"),
}, (t) => [index("messages_conversation_idx").on(t.organizationId, t.productId, t.conversationId, t.sentAt)]);

export const customers = sqliteTable("customers", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id").notNull(),
  productId: text("product_id").notNull(),
  leadId: text("lead_id"),
  plan: text("plan"),
  subscriptionStatus: text("subscription_status"),
  totalRevenue: real("total_revenue").notNull().default(0),
  healthScore: integer("health_score").notNull().default(0),
  healthFactorsJson: text("health_factors_json").notNull().default("{}"),
  csat: real("csat"),
  nps: integer("nps"),
  lastActivityAt: text("last_activity_at"),
  ...audit,
}, (t) => [index("customers_scope_idx").on(t.organizationId, t.productId)]);

export const auditLogs = sqliteTable("audit_logs", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id").notNull(),
  productId: text("product_id"),
  actorId: text("actor_id"),
  actorType: text("actor_type").notNull(),
  action: text("action").notNull(),
  targetType: text("target_type").notNull(),
  targetId: text("target_id"),
  metadataJson: text("metadata_json").notNull().default("{}"),
  createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
}, (t) => [index("audit_org_time_idx").on(t.organizationId, t.createdAt)]);
