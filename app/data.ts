export type ProductId = string;

export type Product = {
  id: string;
  name: string;
  short: string;
  color: string;
  bg: string;
  description: string;
  trackingKey: string;
};

export type Summary = {
  leads: number;
  qualified: number;
  signups: number;
  paid: number;
  revenue: string;
  revenueValue: number;
  roas: string;
  trend: string;
};

export type Lead = {
  id: string;
  name: string;
  company: string;
  product: string;
  productId: string;
  stage: string;
  score: number;
  value: string;
  valueNumber: number;
  source: string;
  campaign: string;
  activity: string;
  owner: string;
  initials: string;
  tone: string;
  next: string;
  intent: string;
  email: string;
  phone: string;
  location: string;
  requirement: string;
  pain: string;
  budget: string;
  timeline: string;
  notes: Array<{ id: string; author: string; content: string; createdAt: string }>;
};

export type Campaign = {
  id: string;
  name: string;
  platform: string;
  product: string;
  productId: string;
  status: string;
  spend: string;
  spendValue: number;
  leads: number;
  paid: number;
  revenue: string;
  revenueValue: number;
  roas: string;
  sync: string;
};

export type Customer = {
  id: string;
  name: string;
  company: string;
  product: string;
  productId: string;
  plan: string;
  revenue: string;
  revenueValue: number;
  health: number;
  status: string;
  activity: string;
  initials: string;
  csat: number | null;
  nps: number | null;
};

export type ConversationMessage = {
  id: string;
  direction: string;
  senderType: string;
  content: string;
  sentAt: string;
};

export type Conversation = {
  id: string;
  leadId: string;
  lead: string;
  product: string;
  productId: string;
  channel: string;
  status: string;
  preview: string;
  time: string;
  unread: number;
  sentiment: string;
  initials: string;
  aiEnabled: boolean;
  handoffSummary: string;
  messages: ConversationMessage[];
};

export type Task = {
  id: string;
  title: string;
  type: string;
  due: string;
  dueAt: string | null;
  priority: string;
  owner: string;
  lead: string;
  completed: boolean;
};

export type Automation = {
  id: string;
  name: string;
  trigger: string;
  action: string;
  runs: number;
  status: boolean;
  product: string;
};

export type LifecycleEvent = {
  id: string;
  event: string;
  product: string;
  occurredAt: string;
};

export type AuditEntry = {
  id: string;
  actor: string;
  action: string;
  targetType: string;
  createdAt: string;
};

export type Integration = {
  id: string;
  name: string;
  status: string;
  description: string;
  productId: string | null;
};

export type WorkspaceData = {
  organizationId: string | null;
  organizationName: string;
  loadedAt: string;
  products: Product[];
  summaryByProduct: Record<string, Summary>;
  leads: Lead[];
  campaigns: Campaign[];
  customers: Customer[];
  conversations: Conversation[];
  tasks: Task[];
  automations: Automation[];
  lifecycleEvents: LifecycleEvent[];
  auditLogs: AuditEntry[];
  integrations: Integration[];
};

export const emptySummary: Summary = {
  leads: 0,
  qualified: 0,
  signups: 0,
  paid: 0,
  revenue: "₹0",
  revenueValue: 0,
  roas: "—",
  trend: "No prior data",
};

export const emptyWorkspaceData: WorkspaceData = {
  organizationId: null,
  organizationName: "Workspace",
  loadedAt: new Date(0).toISOString(),
  products: [{ id: "all", name: "All Products", short: "OS", color: "#20201e", bg: "#f1efe9", description: "", trackingKey: "" }],
  summaryByProduct: { all: emptySummary },
  leads: [],
  campaigns: [],
  customers: [],
  conversations: [],
  tasks: [],
  automations: [],
  lifecycleEvents: [],
  auditLogs: [],
  integrations: [],
};
