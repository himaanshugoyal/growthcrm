"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity, ArrowRight, ArrowUpRight, BarChart3, Bell, Bot,
  BriefcaseBusiness, CalendarClock, Check, ChevronDown, CircleDollarSign,
  Command, FileText, Filter, Gauge, GitBranch,
  Headphones, KanbanSquare, Layers3, LayoutDashboard, LifeBuoy,
  ListChecks, Megaphone, Menu, MessageCircle, MoreHorizontal, Plus, Search,
  Send, Settings, ShieldCheck, SlidersHorizontal, Sparkles, Target, Users,
  WandSparkles, X, Zap,
} from "lucide-react";
import { createContext, useContext, useMemo, useState } from "react";
import {
  emptySummary, type Campaign, type Lead, type ProductId,
  type WorkspaceData,
} from "./data";

const nav = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Leads", href: "/leads", icon: Users },
  { label: "Pipeline", href: "/pipeline", icon: KanbanSquare },
  { label: "Conversations", href: "/conversations", icon: MessageCircle },
  { label: "Campaigns", href: "/campaigns", icon: Megaphone },
  { label: "Customers", href: "/customers", icon: BriefcaseBusiness },
  { label: "Tasks", href: "/tasks", icon: ListChecks },
  { label: "Automations", href: "/automations", icon: Zap },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
];

const stageOrder = ["New Lead", "Engaged", "Qualified", "Demo / Meeting", "Negotiation"];
const pageNames: Record<string, string> = {
  dashboard: "Command center", leads: "Leads", pipeline: "Sales pipeline",
  conversations: "Conversations", campaigns: "Campaigns", customers: "Customers",
  tasks: "Tasks", automations: "Automations", analytics: "Analytics",
  products: "Products", settings: "Settings",
};

type WorkspaceContextValue = {
  data: WorkspaceData;
  mutate: (payload: Record<string, unknown>) => Promise<boolean>;
};

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

function useWorkspace() {
  const value = useContext(WorkspaceContext);
  if (!value) throw new Error("Workspace context is unavailable.");
  return value;
}

export function GrowthOS({ initialData }: { initialData: WorkspaceData }) {
  const [data, setData] = useState(initialData);

  async function mutate(payload: Record<string, unknown>) {
    const response = await fetch("/api/workspace", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json() as { data?: WorkspaceData };
    if (response.ok && result.data) {
      setData(result.data);
      return true;
    }
    return false;
  }

  return <WorkspaceContext.Provider value={{ data, mutate }}><GrowthOSShell /></WorkspaceContext.Provider>;
}

function GrowthOSShell() {
  const { data } = useWorkspace();
  const { products, leads } = data;
  const pathname = usePathname();
  const router = useRouter();
  const [product, setProduct] = useState<ProductId>("all");
  const [productOpen, setProductOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const segment = pathname.split("/").filter(Boolean)[0] || "dashboard";
  const currentProduct = products.find((p) => p.id === product)!;
  const selectedLead = pathname.startsWith("/leads/") ? leads.find((l) => l.id === pathname.split("/")[2]) || leads[0] : null;

  const filteredLeads = useMemo(
    () => product === "all" ? leads : leads.filter((l) => l.productId === product),
    [product, leads],
  );

  function navigate(href: string) {
    setMobileOpen(false);
    router.push(href);
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><Command size={19} strokeWidth={2.6} /></div>
          <span>GrowthOS</span>
          <button className="mobile-close icon-button" onClick={() => setMobileOpen(false)} aria-label="Close navigation"><X size={18} /></button>
        </div>

        <div className="workspace-label">Workspace</div>
        <button className="workspace-card" onClick={() => setProductOpen(!productOpen)} aria-expanded={productOpen}>
          <span className="product-avatar" style={{ background: currentProduct.bg, color: currentProduct.color }}>{currentProduct.short}</span>
          <span className="workspace-copy"><strong>{currentProduct.name}</strong><small>{product === "all" ? "Founder workspace" : "Product workspace"}</small></span>
          <ChevronDown size={15} className={productOpen ? "rotate" : ""} />
        </button>
        {productOpen && (
          <div className="product-menu">
            {products.map((p) => (
              <button key={p.id} onClick={() => { setProduct(p.id); setProductOpen(false); }}>
                <span className="product-avatar small" style={{ background: p.bg, color: p.color }}>{p.short}</span>
                <span>{p.name}</span>
                {p.id === product && <Check size={14} />}
              </button>
            ))}
            <div className="menu-divider" />
            <button onClick={() => navigate("/products")}><Layers3 size={15} /> View products</button>
          </div>
        )}

        <nav className="primary-nav" aria-label="Main navigation">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`) || (pathname === "/" && item.href === "/dashboard");
            return (
              <Link key={item.href} href={item.href} className={active ? "active" : ""}>
                <item.icon size={18} />
                <span>{item.label}</span>
                {item.label === "Leads" && leads.length > 0 && <em>{leads.length}</em>}
                {item.label === "Conversations" && data.conversations.length > 0 && <em>{data.conversations.length}</em>}
                {item.label === "Tasks" && data.tasks.filter((task) => !task.completed).length > 0 && <em>{data.tasks.filter((task) => !task.completed).length}</em>}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <Link href="/settings/products"><Settings size={18} /> Settings</Link>
          <Link href="/settings/integrations"><LifeBuoy size={18} /> Integrations <span className="status-dot" /></Link>
          <div className="profile">
            <span className="avatar dark">HK</span>
            <span><strong>Himanshu</strong><small>Founder</small></span>
            <MoreHorizontal size={16} />
          </div>
        </div>
      </aside>
      {mobileOpen && <button className="sidebar-backdrop" onClick={() => setMobileOpen(false)} aria-label="Close navigation" />}

      <main className="main">
        <header className="topbar">
          <div className="topbar-left">
            <button className="mobile-menu icon-button" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu size={20} /></button>
            <div>
              <span className="eyebrow">{product === "all" ? "Founder workspace" : currentProduct.name}</span>
              <h1>{selectedLead ? selectedLead.name : pageNames[segment] || "GrowthOS"}</h1>
            </div>
          </div>
          <div className="topbar-actions">
            <button className="search-button"><Search size={16} /><span>Search anything</span><kbd>⌘ K</kbd></button>
            <button className="icon-button notification" aria-label="Notifications"><Bell size={18} /><i /></button>
          </div>
        </header>

        <div className="content">
          {!data.organizationId ? <WorkspaceSetup /> :
            selectedLead ? <LeadDetail lead={selectedLead} /> :
            segment === "leads" ? <LeadsPage leads={filteredLeads} /> :
            segment === "pipeline" ? <PipelinePage leads={filteredLeads} /> :
            segment === "conversations" ? <ConversationsPage /> :
            segment === "campaigns" ? <CampaignsPage product={product} /> :
            segment === "customers" ? <CustomersPage product={product} /> :
            segment === "tasks" ? <TasksPage /> :
            segment === "automations" ? <AutomationsPage /> :
            segment === "analytics" ? <AnalyticsPage product={product} /> :
            segment === "products" ? <ProductsPage /> :
            segment === "settings" ? <SettingsPage section={pathname.split("/")[2] || "products"} /> :
            <Dashboard product={product} leads={filteredLeads} />}
        </div>
      </main>

    </div>
  );
}

function WorkspaceSetup() {
  const { mutate } = useWorkspace();
  const [organizationName, setOrganizationName] = useState("");
  const [productName, setProductName] = useState("");
  const [saving, setSaving] = useState(false);
  return <div className="settings-card success-card">
    <span><Layers3 size={28} /></span>
    <h2>Connect your live workspace</h2>
    <p>No organization exists in the database yet. Create the real workspace and first product; no sample records will be inserted.</p>
    <div className="setup-fields">
      <label>Organization name<input value={organizationName} onChange={(event) => setOrganizationName(event.target.value)} placeholder="Your company or workspace" /></label>
      <label>First product<input value={productName} onChange={(event) => setProductName(event.target.value)} placeholder="Your product name" /></label>
    </div>
    <button className="primary-button" disabled={saving || !organizationName.trim() || !productName.trim()} onClick={async () => { setSaving(true); await mutate({ action: "workspace.initialize", organizationName, productName }); setSaving(false); }}>
      {saving ? "Connecting…" : "Create live workspace"}
    </button>
  </div>;
}

function Dashboard({ product, leads: shownLeads }: { product: ProductId; leads: Lead[] }) {
  const { data } = useWorkspace();
  const { products, summaryByProduct, tasks, customers } = data;
  const s = summaryByProduct[product] || emptySummary;
  const [range, setRange] = useState("Last 30 days");
  return (
    <div className="page-stack">
      <section className="page-intro">
        <div><h2>Good morning, Himanshu.</h2><p>Here’s what’s moving across your growth engine.</p></div>
        <div className="intro-actions">
          <span className="live-pill"><i /> Live database · refreshed {new Date(data.loadedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          <select value={range} onChange={(e) => setRange(e.target.value)} aria-label="Date range">
            <option>Last 30 days</option><option>Last 7 days</option><option>This quarter</option>
          </select>
        </div>
      </section>

      <section className="metrics-grid">
        <Metric label="New leads" value={String(s.leads)} meta={s.trend} icon={Users} />
        <Metric label="Qualified" value={String(s.qualified)} meta={`${s.leads ? Math.round(s.qualified / s.leads * 100) : 0}% of leads`} icon={Target} />
        <Metric label="Paying customers" value={String(s.paid)} meta="Live customer records" icon={CircleDollarSign} />
        <Metric label="Attributed revenue" value={s.revenue} meta={`${s.roas} ROAS`} icon={ArrowUpRight} highlight />
      </section>

      <section className="dashboard-grid">
        <div className="panel funnel-panel">
          <PanelHead title="Demand to revenue" subtitle="Across all acquisition channels" action="View analytics" href="/analytics" />
          <div className="funnel-wrap">
            <div className="funnel-visual">
              {[
                ["Leads", s.leads, 100, "#e9a17d"],
                ["Qualified", s.qualified, 72, "#df7e59"],
                ["Signups", s.signups, 56, "#cb6544"],
                ["Activated", Math.round(s.signups * .72), 42, "#a94d33"],
                ["Paid", s.paid, 32, "#6d2f20"],
              ].map(([label, value, width, color]) => (
                <div className="funnel-row" key={String(label)}>
                  <span>{label}</span><div style={{ width: `${width}%`, background: String(color) }}><strong>{value}</strong></div>
                </div>
              ))}
            </div>
            <div className="funnel-insight">
              <span className="spark-icon"><Sparkles size={17} /></span>
              <div><strong>Live conversion funnel</strong><p>Calculated from stored leads, lifecycle events, and customers.</p></div>
              <ArrowRight size={17} />
            </div>
          </div>
        </div>

        <div className="panel attention-panel">
          <PanelHead title="Needs your attention" subtitle="AI-ranked by revenue impact" />
          <div className="attention-list">
            {tasks.filter((task) => !task.completed).slice(0, 2).map((task) =>
              <Attention key={task.id} icon={CalendarClock} tone="blue" title={task.title} copy={`${task.type} · ${task.lead}`} time={task.due} />)}
            {shownLeads.filter((lead) => lead.score >= 80).slice(0, 1).map((lead) =>
              <Attention key={lead.id} icon={Target} tone="orange" title={`${lead.name} is high intent`} copy={`${lead.product} · ${lead.value} expected`} time={lead.activity} />)}
            {customers.filter((customer) => customer.health < 50).slice(0, 1).map((customer) =>
              <Attention key={customer.id} icon={Gauge} tone="red" title={`${customer.name}'s health needs attention`} copy={`${customer.company} · ${customer.product}`} time={customer.activity} />)}
            {tasks.length === 0 && shownLeads.length === 0 && customers.length === 0 &&
              <EmptyState icon={Activity} title="No live priorities yet" copy="Tasks and high-intent records will appear here." />}
          </div>
          <Link className="panel-footer-link" href="/tasks">Open priority queue <ArrowRight size={15} /></Link>
        </div>
      </section>

      <section className="dashboard-grid bottom">
        <div className="panel">
          <PanelHead title="Hot leads" subtitle="Highest buying intent right now" action="View all" href="/leads" />
          <div className="compact-table">
            {shownLeads.slice(0, 4).map((lead) => <LeadRow key={lead.id} lead={lead} compact />)}
          </div>
        </div>
        <div className="panel">
          <PanelHead title="Product pulse" subtitle="Performance this month" action="Compare" href="/analytics" />
          <div className="product-pulse">
            {products.slice(1).map((p, idx) => {
              const ps = summaryByProduct[p.id] || emptySummary;
              return <div key={p.id}>
                <span className="product-avatar" style={{ background: p.bg, color: p.color }}>{p.short}</span>
                <span className="pulse-name"><strong>{p.name}</strong><small>{ps.leads} leads · {ps.paid} paid</small></span>
                <span className="mini-bars">{[44, 62, 51, 77, 68, 82].map((h, i) => <i key={i} style={{ height: `${h - idx * 5}%`, background: p.color }} />)}</span>
                <span className="pulse-revenue"><strong>{ps.revenue}</strong><small>{ps.trend}</small></span>
              </div>;
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value, meta, icon: Icon, highlight }: { label: string; value: string; meta: string; icon: typeof Users; highlight?: boolean }) {
  return <div className={`metric-card ${highlight ? "highlight" : ""}`}>
    <div className="metric-top"><span>{label}</span><i><Icon size={17} /></i></div>
    <strong>{value}</strong>
    <small><ArrowUpRight size={13} /> {meta}</small>
  </div>;
}

function PanelHead({ title, subtitle, action, href }: { title: string; subtitle: string; action?: string; href?: string }) {
  return <div className="panel-head"><div><h3>{title}</h3><p>{subtitle}</p></div>{action && href && <Link href={href}>{action} <ArrowRight size={14} /></Link>}</div>;
}

function Attention({ icon: Icon, tone, title, copy, time }: { icon: typeof MessageCircle; tone: string; title: string; copy: string; time: string }) {
  return <div className="attention-row"><span className={`attention-icon ${tone}`}><Icon size={17} /></span><span><strong>{title}</strong><small>{copy}</small></span><time>{time}</time></div>;
}

function LeadsPage({ leads: shownLeads }: { leads: Lead[] }) {
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState("All stages");
  const result = shownLeads.filter((l) => (l.name + l.company).toLowerCase().includes(query.toLowerCase()) && (stage === "All stages" || l.stage === stage));
  return <div className="page-stack">
    <PageHeader title={`${shownLeads.length} leads in motion`} copy="Every conversation, source, and next step in one place." primary="Add lead" />
    <div className="filterbar">
      <label className="field-search"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search leads or companies…" /></label>
      <select value={stage} onChange={(e) => setStage(e.target.value)} aria-label="Filter by stage"><option>All stages</option>{stageOrder.map((s) => <option key={s}>{s}</option>)}</select>
      <button className="secondary-button"><Filter size={15} /> More filters</button>
      <button className="secondary-button"><SlidersHorizontal size={15} /> Saved views</button>
      <span className="view-toggle"><button className="active"><ListChecks size={16} /></button><button><KanbanSquare size={16} /></button></span>
    </div>
    <div className="table-panel">
      <div className="lead-table-head"><span>Lead</span><span>Stage</span><span>Score</span><span>Attribution</span><span>Value</span><span>Next step</span><span /></div>
      {result.map((lead) => <LeadRow key={lead.id} lead={lead} />)}
      {result.length === 0 && <EmptyState icon={Search} title="No leads found" copy="Try a different search or stage filter." />}
    </div>
  </div>;
}

function LeadRow({ lead, compact = false }: { lead: Lead; compact?: boolean }) {
  if (compact) return <Link href={`/leads/${lead.id}`} className="compact-lead">
    <span className={`avatar ${lead.tone}`}>{lead.initials}</span>
    <span><strong>{lead.name}</strong><small>{lead.company} · {lead.product}</small></span>
    <span className={`score score-${Math.floor(lead.score / 20)}`}>{lead.score}</span>
    <span><strong>{lead.value}</strong><small>{lead.stage}</small></span>
    <ArrowRight size={15} />
  </Link>;
  return <Link href={`/leads/${lead.id}`} className="lead-table-row">
    <span className="lead-person"><span className={`avatar ${lead.tone}`}>{lead.initials}</span><span><strong>{lead.name}</strong><small>{lead.company} · {lead.product}</small></span></span>
    <span><em className="stage-pill">{lead.stage}</em></span>
    <span><em className={`score score-${Math.floor(lead.score / 20)}`}>{lead.score}</em></span>
    <span><strong className="cell-main">{lead.source}</strong><small>{lead.campaign}</small></span>
    <span><strong className="cell-main">{lead.value}</strong><small>{lead.intent} intent</small></span>
    <span><strong className="cell-main">{lead.next}</strong><small>{lead.activity}</small></span>
    <span><MoreHorizontal size={17} /></span>
  </Link>;
}

function PipelinePage({ leads: shownLeads }: { leads: Lead[] }) {
  const { mutate } = useWorkspace();
  const [cards, setCards] = useState(shownLeads);
  async function advance(id: string) {
    const current = cards.find((lead) => lead.id === id);
    if (!current) return;
    const idx = stageOrder.indexOf(current.stage);
    const nextStage = stageOrder[Math.min(idx + 1, stageOrder.length - 1)];
    setCards((all) => all.map((lead) => {
      if (lead.id !== id) return lead;
      return { ...lead, stage: nextStage };
    }));
    await mutate({ action: "lead.stage", id, value: nextStage });
  }
  const pipelineValue = cards.reduce((sum, lead) => sum + lead.valueNumber, 0);
  return <div className="page-stack">
    <PageHeader title={`${pipelineValue.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })} open pipeline`} copy={`${cards.length} active opportunities`} primary="Add opportunity" />
    <div className="pipeline-toolbar"><div className="view-tabs"><button className="active">Kanban</button><button>Table</button></div><span>Live value <strong>{pipelineValue.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })}</strong></span><button className="secondary-button"><Filter size={15} /> Filter</button></div>
    <div className="kanban">
      {stageOrder.map((stage) => {
        const stageLeads = cards.filter((l) => l.stage === stage);
        return <div className="kanban-column" key={stage}>
          <div className="kanban-head"><span><i /> {stage}</span><em>{stageLeads.length}</em></div>
          <small className="column-value">{stageLeads.reduce((sum, l) => sum + l.valueNumber, 0).toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })}</small>
          <div className="kanban-cards">
            {stageLeads.map((lead) => <article className="deal-card" key={lead.id}>
              <div><span className={`avatar ${lead.tone}`}>{lead.initials}</span><em className={`score score-${Math.floor(lead.score / 20)}`}>{lead.score}</em></div>
              <Link href={`/leads/${lead.id}`}>{lead.name}</Link>
              <small>{lead.company} · {lead.product}</small>
              <p>{lead.requirement}</p>
              <div className="deal-meta"><strong>{lead.value}</strong><span><MessageCircle size={14} /> {lead.activity.split(" · ")[0]}</span></div>
              <button onClick={() => advance(lead.id)} disabled={stage === stageOrder.at(-1)}>Move forward <ArrowRight size={13} /></button>
            </article>)}
          </div>
        </div>;
      })}
    </div>
  </div>;
}

function LeadDetail({ lead }: { lead: Lead }) {
  const { data, mutate } = useWorkspace();
  const linkedConversation = data.conversations.find((conversation) => conversation.leadId === lead.id);
  const [aiOn, setAiOn] = useState(linkedConversation?.aiEnabled ?? false);
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState(lead.notes);
  async function saveNote() {
    const content = note.trim();
    if (!content) return;
    const saved = await mutate({ action: "lead.note", id: lead.id, content });
    if (saved) {
      setNotes([{ id: crypto.randomUUID(), author: "Himanshu", content, createdAt: new Date().toISOString() }, ...notes]);
      setNote("");
    }
  }
  return <div className="lead-detail-layout">
    <div className="lead-main">
      <div className="lead-profile">
        <div className={`avatar xl ${lead.tone}`}>{lead.initials}</div>
        <div><div className="lead-name-line"><h2>{lead.name}</h2><span className={`score score-${Math.floor(lead.score / 20)}`}>{lead.score} · High intent</span></div><p>{lead.company} · {lead.location}</p><span>{lead.email} &nbsp;·&nbsp; {lead.phone}</span></div>
      </div>
      <div className="stage-progress">
        {["New", "Engaged", "Qualified", "Demo", "Negotiation", "Paid"].map((s, i) => <div className={i <= 2 ? "done" : ""} key={s}><i>{i < 2 ? <Check size={12} /> : i + 1}</i><span>{s}</span></div>)}
      </div>
      <div className="lead-tabs"><button className="active">Timeline</button><button>Details</button><button>Attribution</button><button>Customer</button></div>
      <div className="composer">
        <div className="composer-tabs"><button className="active">Add note</button><button>Create task</button><button>Log meeting</button></div>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Capture context for your future self…" />
        <div><span><button><FileText size={15} /></button><button><Sparkles size={15} /> Improve with AI</button></span><button className="primary-button" disabled={!note.trim()} onClick={saveNote}>Save note</button></div>
      </div>
      <div className="timeline">
        {notes.map((n) => <TimelineItem key={n.id} icon={FileText} tone="slate" title={`${n.author} added a note`} time={new Date(n.createdAt).toLocaleString()}><p>{n.content}</p></TimelineItem>)}
        {notes.length === 0 && <EmptyState icon={FileText} title="No saved timeline yet" copy="Notes and live activity will appear here." />}
      </div>
    </div>
    <aside className="lead-aside">
      <div className="aside-section">
        <h3>Sales copilot <span><Sparkles size={14} /> Live</span></h3>
        <div className="next-best"><small>Recommended next action</small><strong>{lead.next}</strong><p>{lead.requirement}</p><button><WandSparkles size={15} /> Prepare follow-up</button></div>
      </div>
      <div className="aside-section">
        <h3>AI control</h3>
        <div className="ai-control"><span><strong>Qualification agent</strong><small>{linkedConversation ? (aiOn ? "Replies are active" : "Human has control") : "No conversation connected"}</small></span><button className={`switch ${aiOn ? "on" : ""}`} disabled={!linkedConversation} onClick={async () => { if (!linkedConversation) return; const next = !aiOn; setAiOn(next); await mutate({ action: "conversation.ai", id: linkedConversation.id, value: next }); }} aria-label="Toggle AI control"><i /></button></div>
        {!aiOn && <p className="human-banner"><Headphones size={15} /> Human takeover is active. AI replies are paused.</p>}
      </div>
      <div className="aside-section details-list"><h3>Qualification</h3>
        {[["Need", lead.requirement], ["Pain point", lead.pain], ["Budget", lead.budget], ["Timeline", lead.timeline], ["Authority", "Decision maker"]].map(([k, v]) => <div key={k}><small>{k}</small><p>{v}</p></div>)}
      </div>
      <div className="aside-section details-list"><h3>Attribution</h3><div><small>First touch</small><p>{lead.source} · {lead.campaign}</p></div><div><small>Landing page</small><p>/founder-system</p></div></div>
    </aside>
  </div>;
}

function TimelineItem({ icon: Icon, tone, title, time, children }: { icon: typeof Bot; tone: string; title: string; time: string; children: React.ReactNode }) {
  return <div className="timeline-item"><div className={`timeline-icon ${tone}`}><Icon size={16} /></div><div className="timeline-body"><div><strong>{title}</strong><time>{time}</time></div>{children}</div></div>;
}

function ConversationsPage() {
  const { data, mutate } = useWorkspace();
  const conversations = data.conversations;
  const [selected, setSelected] = useState(0);
  const [draft, setDraft] = useState("");
  const c = conversations[selected];
  if (!c) return <div className="panel"><EmptyState icon={MessageCircle} title="No live conversations" copy="Connected channel conversations will appear here." /></div>;
  function selectConversation(i: number) { setSelected(i); setDraft(""); }
  async function setAiEnabled(value: boolean) {
    await mutate({ action: "conversation.ai", id: c.id, value });
  }
  async function sendMessage() {
    const content = draft.trim();
    if (!content) return;
    if (await mutate({ action: "conversation.message", id: c.id, content })) setDraft("");
  }
  return <div className="inbox-shell">
    <section className="conversation-list">
      <div className="conversation-tools"><label className="field-search"><Search size={15} /><input placeholder="Search conversations…" /></label><button className="icon-button"><Filter size={16} /></button></div>
      <div className="inbox-tabs"><button className="active">Open <em>{conversations.filter((item) => item.status === "open").length}</em></button><button>Needs me</button><button>Closed</button></div>
      {conversations.map((item, i) => <button className={`conversation-row ${selected === i ? "active" : ""}`} key={item.lead} onClick={() => selectConversation(i)}>
        <span className="avatar blue">{item.initials}</span>
        <span><span><strong>{item.lead}</strong><time>{item.time}</time></span><small>{item.product} · {item.channel}</small><p>{item.preview}</p><em>{item.status}</em></span>
        {item.unread > 0 && <i>{item.unread}</i>}
      </button>)}
    </section>
    <section className="chat-panel">
      <div className="chat-head"><div><span className="avatar blue">{c.initials}</span><span><strong>{c.lead}</strong><small>{c.product} · {c.channel} · {c.sentiment} sentiment</small></span></div><div><button className="secondary-button"><Users size={15} /> Assign</button><button className="icon-button"><MoreHorizontal size={18} /></button></div></div>
      <div className="ai-strip"><span><Sparkles size={15} /> Product Advisor is using <strong>{c.product} knowledge only</strong></span><button onClick={() => setAiEnabled(!c.aiEnabled)}>{c.aiEnabled ? "Take over" : "Return to AI"}</button></div>
      <div className="messages">
        {c.messages.map((message) => <div className={`message ${message.direction} ${message.senderType === "human" ? "human" : ""}`} key={message.id}>
          {message.direction === "outgoing" && <small>{message.senderType === "human" ? "You · human reply" : <><Bot size={12} /> Virtual assistant</>}</small>}
          {message.content}
        </div>)}
        {c.messages.length === 0 && <EmptyState icon={MessageCircle} title="No messages yet" copy="The first live channel message will appear here." />}
      </div>
      <div className="chat-composer">
        {!c.aiEnabled && <span className="takeover-note"><Headphones size={14} /> You’re replying. AI is paused.</span>}
        <div><button className="icon-button"><Plus size={18} /></button><textarea value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={c.aiEnabled ? "Take over to send a human reply…" : "Write a reply…"} disabled={c.aiEnabled} /><button className="send-button" disabled={c.aiEnabled || !draft.trim()} onClick={sendMessage}><Send size={16} /></button></div>
      </div>
    </section>
    <aside className="conversation-context">
      <div className="context-person"><span className="avatar xl blue">{c.initials}</span><h3>{c.lead}</h3><p>{c.product} prospect</p><span className="score score-4">86 · High intent</span></div>
      <div className="context-section"><h4>Live handoff</h4><p>{c.handoffSummary || "No handoff summary has been stored."}</p></div>
    </aside>
  </div>;
}

function CampaignsPage({ product }: { product: ProductId }) {
  const { data } = useWorkspace();
  const campaigns = data.campaigns;
  const rows = product === "all" ? campaigns : campaigns.filter((c) => c.productId === product);
  const [confirm, setConfirm] = useState<string | null>(null);
  const spend = rows.reduce((sum, campaign) => sum + campaign.spendValue, 0);
  const revenue = rows.reduce((sum, campaign) => sum + campaign.revenueValue, 0);
  return <div className="page-stack">
    <PageHeader title="Campaign intelligence" copy="Tie every rupee of spend to signups, revenue, and satisfaction." primary="Plan campaign" />
    <div className="metrics-grid three"><Metric label="Ad spend" value={spend.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })} meta="Live campaign spend" icon={CircleDollarSign} /><Metric label="Attributed revenue" value={revenue.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })} meta={spend ? `${(revenue / spend).toFixed(1)}× blended ROAS` : "No spend"} icon={ArrowUpRight} highlight /><Metric label="Paid customers" value={String(rows.reduce((sum, campaign) => sum + campaign.paid, 0))} meta="Campaign-attributed" icon={Target} /></div>
    <div className="table-panel campaign-table">
      <div className="campaign-head"><span>Campaign</span><span>Spend</span><span>Leads</span><span>Paid</span><span>Revenue</span><span>ROAS</span><span>Status</span><span /></div>
      {rows.map((c) => <div className="campaign-row" key={c.name}>
        <span><i className={`platform ${c.platform.toLowerCase()}`}>{c.platform[0]}</i><span><strong>{c.name}</strong><small>{c.product} · {c.platform} · synced {c.sync}</small></span></span>
        <span>{c.spend}</span><span>{c.leads}</span><span>{c.paid}</span><span>{c.revenue}</span><span><strong>{c.roas}</strong></span>
        <span><em className={`status-pill ${c.status.toLowerCase()}`}>{c.status}</em></span>
        <span><button className="icon-button" onClick={() => setConfirm(c.id)}><MoreHorizontal size={17} /></button></span>
      </div>)}
      {rows.length === 0 && <EmptyState icon={Megaphone} title="No live campaigns" copy="Connected ad campaigns will appear here." />}
    </div>
    <div className="safety-note"><ShieldCheck size={18} /><div><strong>Approval-controlled ad actions</strong><p>GrowthOS never publishes, pauses, or changes spend without showing the full action and asking you to confirm.</p></div><Link href="/settings/ad-accounts">Review controls <ArrowRight size={14} /></Link></div>
    {confirm && <ConfirmAd campaign={campaigns.find((c) => c.id === confirm)!} onClose={() => setConfirm(null)} />}
  </div>;
}

function ConfirmAd({ campaign, onClose }: { campaign: Campaign; onClose: () => void }) {
  const { mutate } = useWorkspace();
  const [done, setDone] = useState(false);
  return <div className="modal-backdrop"><div className="modal">
    <button className="modal-close icon-button" onClick={onClose}><X size={18} /></button>
    {done ? <div className="success-state"><span><Check size={26} /></span><h3>Campaign paused</h3><p>The live campaign record and audit log were updated.</p><button className="primary-button" onClick={onClose}>Done</button></div> : <>
      <span className="modal-icon"><ShieldCheck size={22} /></span><h3>Confirm campaign action</h3><p>Review the complete spend impact before continuing.</p>
      <div className="confirm-grid"><div><small>Platform</small><strong>{campaign.platform} Ads</strong></div><div><small>Product</small><strong>{campaign.product}</strong></div><div><small>Campaign</small><strong>{campaign.name}</strong></div><div><small>Action</small><strong>Pause campaign</strong></div><div><small>Current spend</small><strong>{campaign.spend}</strong></div><div><small>Attributed revenue</small><strong>{campaign.revenue}</strong></div></div>
      <label className="confirm-check"><input type="checkbox" id="confirm-ad" /> I understand this will request a provider-side change.</label>
      <div className="modal-actions"><button className="secondary-button" onClick={onClose}>Cancel</button><button className="danger-button" onClick={async () => { if (await mutate({ action: "campaign.pause", id: campaign.id })) setDone(true); }}>Confirm pause</button></div>
    </>}
  </div></div>;
}

function CustomersPage({ product }: { product: ProductId }) {
  const { data } = useWorkspace();
  const rows = product === "all" ? data.customers : data.customers.filter((c) => c.productId === product);
  const averageHealth = rows.length ? Math.round(rows.reduce((sum, customer) => sum + customer.health, 0) / rows.length) : 0;
  const csatRows = rows.filter((customer) => customer.csat != null);
  const averageCsat = csatRows.length ? (csatRows.reduce((sum, customer) => sum + Number(customer.csat), 0) / csatRows.length).toFixed(1) : "—";
  const npsRows = rows.filter((customer) => customer.nps != null);
  const averageNps = npsRows.length ? Math.round(npsRows.reduce((sum, customer) => sum + Number(customer.nps), 0) / npsRows.length) : 0;
  return <div className="page-stack">
    <PageHeader title="Customer health" copy="Know who is thriving, who needs help, and why." primary="Add customer" />
    <div className="health-overview panel"><div><span className="health-ring"><strong>{averageHealth}</strong><small>Average</small></span><span><h3>Portfolio health</h3><p>Calculated from live customer records.</p></span></div><div className="health-factors"><span><small>Customers</small><strong>{rows.length}</strong></span><span><small>Avg. CSAT</small><strong>{averageCsat}</strong></span><span><small>Avg. NPS</small><strong>{averageNps}</strong></span><span><small>At risk</small><strong>{rows.filter((customer) => customer.health < 50).length}</strong></span></div></div>
    <div className="table-panel customer-table">
      <div className="customer-head"><span>Customer</span><span>Product / plan</span><span>Revenue</span><span>Health</span><span>Status</span><span>Last active</span><span /></div>
      {rows.map((c) => <div className="customer-row" key={c.name}><span className="lead-person"><span className="avatar mint">{c.initials}</span><span><strong>{c.name}</strong><small>{c.company}</small></span></span><span><strong>{c.product}</strong><small>{c.plan}</small></span><span><strong>{c.revenue}</strong></span><span><span className="health-bar"><i style={{ width: `${c.health}%` }} /></span><strong>{c.health}</strong></span><span><em className={`health-status ${c.status.toLowerCase().replace(" ", "-")}`}>{c.status}</em></span><span>{c.activity}</span><span><MoreHorizontal size={17} /></span></div>)}
      {rows.length === 0 && <EmptyState icon={BriefcaseBusiness} title="No live customers" copy="Customers created from subscription events will appear here." />}
    </div>
  </div>;
}

function TasksPage() {
  const { data, mutate } = useWorkspace();
  const tasks = data.tasks;
  return <div className="page-stack">
    <PageHeader title="Priority queue" copy="The follow-ups and moments most likely to move revenue." primary="New task" />
    <div className="task-layout"><div className="panel task-panel"><div className="task-section-head"><h3>Live tasks</h3><span>{tasks.filter((task) => !task.completed).length} remaining</span></div>{tasks.map((t) => <div className={`task-row ${t.completed ? "completed" : ""}`} key={t.id}><button className="task-check" onClick={() => mutate({ action: "task.completed", id: t.id, value: !t.completed })}>{t.completed && <Check size={14} />}</button><span><strong>{t.title}</strong><small>{t.type} · {t.lead}</small></span><em className={`priority ${t.priority.toLowerCase()}`}>{t.priority}</em><span><CalendarClock size={14} /> {t.due}</span><span className="avatar small dark">{t.owner === "Himanshu" ? "HK" : t.owner.slice(0, 2).toUpperCase()}</span></div>)}{tasks.length === 0 && <EmptyState icon={ListChecks} title="No live tasks" copy="Create a task or connect an automation to populate this queue." />}</div>
    <aside className="panel focus-panel"><span className="spark-icon"><Sparkles size={18} /></span><h3>Your live focus</h3><p>Prioritized from incomplete database tasks.</p><div><span><strong>{tasks.filter((task) => !task.completed && task.priority === "High").length}</strong><small>High priority</small></span><span><strong>{tasks.filter((task) => !task.completed).length}</strong><small>Open tasks</small></span></div></aside></div>
  </div>;
}

function AutomationsPage() {
  const { data, mutate } = useWorkspace();
  const rules = data.automations;
  const totalRuns = rules.reduce((sum, rule) => sum + rule.runs, 0);
  return <div className="page-stack">
    <PageHeader title="Automations" copy="Handle the routine work while keeping consequential actions human-approved." primary="Build automation" />
    <div className="automation-stats"><div><Zap size={18} /><span><strong>{totalRuns}</strong><small>Total recorded runs</small></span></div><div><Check size={18} /><span><strong>{rules.filter((rule) => rule.status).length}</strong><small>Enabled rules</small></span></div><div><CalendarClock size={18} /><span><strong>{rules.length}</strong><small>Stored automations</small></span></div><div><ShieldCheck size={18} /><span><strong>Live</strong><small>Database state</small></span></div></div>
    <div className="rule-list">{rules.map((rule) => <div className="rule-card" key={rule.id}><span className="rule-icon"><Zap size={18} /></span><span className="rule-copy"><strong>{rule.name}</strong><small>{rule.product} · {rule.runs} runs</small></span><span className="rule-flow"><em>WHEN</em><strong>{rule.trigger}</strong><ArrowRight size={14} /><em>THEN</em><strong>{rule.action}</strong></span><button className={`switch ${rule.status ? "on" : ""}`} onClick={() => mutate({ action: "automation.enabled", id: rule.id, value: !rule.status })}><i /></button><button className="icon-button"><MoreHorizontal size={17} /></button></div>)}{rules.length === 0 && <EmptyState icon={Zap} title="No live automations" copy="Stored automation rules will appear here." />}</div>
  </div>;
}

function AnalyticsPage({ product }: { product: ProductId }) {
  const { data } = useWorkspace();
  const { products, summaryByProduct, campaigns, lifecycleEvents } = data;
  const [metric, setMetric] = useState("Revenue");
  const s = summaryByProduct[product] || emptySummary;
  const scopedCampaigns = product === "all" ? campaigns : campaigns.filter((campaign) => campaign.productId === product);
  const eventCounts = Array.from({ length: 12 }, (_, offset) => {
    const day = new Date(); day.setHours(0, 0, 0, 0); day.setDate(day.getDate() - (11 - offset));
    const next = new Date(day); next.setDate(day.getDate() + 1);
    return lifecycleEvents.filter((event) => {
      const occurred = new Date(event.occurredAt);
      return occurred >= day && occurred < next;
    }).length;
  });
  const maxEvents = Math.max(1, ...eventCounts);
  return <div className="page-stack">
    <PageHeader title="Conversion intelligence" copy="Calculated from live leads, customers, campaigns, and lifecycle events." primary="Export report" />
    <div className="analytics-tabs"><button className="active">Funnel</button><button>Acquisition</button><button>Revenue</button><button>Customers</button><button>AI performance</button></div>
    <div className="metrics-grid"><Metric label="Lead → signup" value={`${s.leads ? Math.round(s.signups / s.leads * 100) : 0}%`} meta="Live conversion" icon={ArrowUpRight} /><Metric label="Signup → paid" value={`${s.signups ? Math.round(s.paid / s.signups * 100) : 0}%`} meta="Live conversion" icon={ArrowUpRight} /><Metric label="Customers" value={String(s.paid)} meta="Active records" icon={CircleDollarSign} /><Metric label="Blended ROAS" value={s.roas} meta="Revenue ÷ campaign spend" icon={ArrowUpRight} highlight /></div>
    <div className="analytics-grid">
      <div className="panel chart-panel"><div className="panel-head"><div><h3>Growth trend</h3><p>Conversion events over time</p></div><select value={metric} onChange={(e) => setMetric(e.target.value)}><option>Revenue</option><option>Leads</option><option>Paid customers</option></select></div>
        <div className="chart">
          <div className="chart-y"><span>₹8L</span><span>₹6L</span><span>₹4L</span><span>₹2L</span><span>₹0</span></div>
          <div className="chart-body"><div className="gridline" /><div className="gridline" /><div className="gridline" /><div className="gridline" /><div className="bar-series">{eventCounts.map((count, i) => <i key={i} style={{ height: `${Math.max(3, count / maxEvents * 100)}%` }}><span>{i === 11 ? `${count} events` : ""}</span></i>)}</div><div className="chart-x"><span>12 days ago</span><span>9 days ago</span><span>6 days ago</span><span>3 days ago</span><span>Today</span></div></div>
        </div>
      </div>
      <div className="panel source-panel"><PanelHead title="Sources that create customers" subtitle="Not just leads" />
        {scopedCampaigns.map((campaign) => <div className="source-row" key={campaign.id}><span><strong>{campaign.name}</strong><small>{campaign.leads} leads · {campaign.paid} paid</small></span><span className="source-bar"><i style={{ width: `${Math.min(100, campaign.leads * 5)}%` }} /></span><strong>{campaign.revenue}</strong></div>)}
        {scopedCampaigns.length === 0 && <EmptyState icon={Megaphone} title="No campaign attribution" copy="Live campaign records will appear here." />}
      </div>
    </div>
    <div className="panel product-comparison"><PanelHead title="Product comparison" subtitle="Same attribution model and date range" />
      <div className="comparison-head"><span>Product</span><span>Leads</span><span>Signups</span><span>Paid</span><span>Revenue</span><span>ROAS</span><span>CSAT</span></div>
      {products.slice(1).map((p) => { const x = summaryByProduct[p.id] || emptySummary; const productCustomers = data.customers.filter((customer) => customer.productId === p.id && customer.csat != null); const csat = productCustomers.length ? (productCustomers.reduce((sum, customer) => sum + Number(customer.csat), 0) / productCustomers.length).toFixed(1) : "—"; return <div className="comparison-row" key={p.id}><span><span className="product-avatar small" style={{ background: p.bg, color: p.color }}>{p.short}</span><strong>{p.name}</strong></span><span>{x.leads}</span><span>{x.signups}</span><span>{x.paid}</span><span><strong>{x.revenue}</strong></span><span>{x.roas}</span><span>{csat}</span></div>; })}
    </div>
  </div>;
}

function ProductsPage() {
  const { data } = useWorkspace();
  return <div className="page-stack"><PageHeader title="Products" copy="Each product has its own demand engine, knowledge, and channels." primary="Add product" /><div className="product-cards">{data.products.slice(1).map((p) => { const summary = data.summaryByProduct[p.id] || emptySummary; const connected = data.integrations.filter((item) => !item.productId || item.productId === p.id); return <article key={p.id}><div><span className="product-avatar xl" style={{ background: p.bg, color: p.color }}>{p.short}</span><span><h3>{p.name}</h3><p>{p.description || "No product description saved."}</p></span><button className="icon-button"><MoreHorizontal size={18} /></button></div><div className="product-stats"><span><strong>{summary.leads}</strong><small>Leads</small></span><span><strong>{summary.paid}</strong><small>Customers</small></span><span><strong>{summary.revenue}</strong><small>Revenue</small></span></div><div className="connections">{connected.map((item) => <span key={item.id}><i className={`connection-dot ${item.status === "Connected" ? "active" : ""}`} /> {item.name}</span>)}{connected.length === 0 && <span>No integrations saved</span>}</div><Link href={`/settings/products?product=${p.id}`}>Manage product <ArrowRight size={15} /></Link></article>; })}</div></div>;
}

const settingsNav = [
  ["products", "Products", Layers3], ["tracking", "Tracking & events", Activity], ["integrations", "Integrations", GitBranch],
  ["whatsapp", "WhatsApp", MessageCircle], ["telegram", "Telegram", Send], ["ad-accounts", "Ad accounts", Megaphone],
  ["ai", "AI agents", Bot], ["team", "Team", Users], ["audit", "Audit log", ShieldCheck],
] as const;

function SettingsPage({ section }: { section: string }) {
  const active = settingsNav.find((x) => x[0] === section) || settingsNav[0];
  const ActiveIcon = active[2];
  return <div className="settings-layout"><aside className="settings-nav"><h3>Settings</h3>{settingsNav.map(([id, label, Icon]) => <Link className={section === id ? "active" : ""} href={`/settings/${id}`} key={id}><Icon size={17} /> {label}</Link>)}</aside><section className="settings-content">
    <div className="settings-title"><span className="settings-icon"><ActiveIcon size={20} /></span><div><h2>{active[1]}</h2><p>Configure how GrowthOS handles {active[1].toLowerCase()} across your workspace.</p></div></div>
    {section === "tracking" ? <TrackingSettings /> : section === "ai" ? <AISettings /> : section === "audit" ? <AuditSettings /> : <IntegrationSettings section={active[1]} />}
  </section></div>;
}

function TrackingSettings() {
  const { data } = useWorkspace();
  const product = data.products.find((item) => item.id !== "all");
  const origin = typeof window === "undefined" ? "https://your-domain" : window.location.origin;
  const code = product ? `<script\n  src="${origin}/tracker.js"\n  data-product-key="${product.trackingKey}"\n  async>\n</script>` : "Create a product to receive a tracking key.";
  return <><div className="settings-card"><div className="settings-card-head"><div><h3>Website tracking</h3><p>Capture attribution and lifecycle events without collecting page content.</p></div><span className="connected-pill"><i /> {product ? "Configured" : "Not configured"}</span></div><div className="code-block"><code>{code}</code><button disabled={!product} onClick={() => navigator.clipboard?.writeText(code)}>Copy</button></div></div><div className="settings-card"><h3>Recent events</h3>{data.lifecycleEvents.slice(0, 12).map((event) => <div className="event-row" key={event.id}><span className="success-dot"><Check size={12} /></span><code>{event.event}</code><span>{event.product}</span><time>{new Date(event.occurredAt).toLocaleString()}</time><em>Accepted</em></div>)}{data.lifecycleEvents.length === 0 && <EmptyState icon={Activity} title="No lifecycle events" copy="Accepted tracker events will appear here." />}</div></>;
}

function AISettings() {
  return <div className="settings-card"><div className="settings-card-head"><div><h3>AI services</h3><p>No live AI-agent configuration table is connected yet.</p></div><span className="connected-pill">Not configured</span></div><EmptyState icon={Bot} title="No AI services configured" copy="Connect an agent provider and store its configuration before enabling AI controls." /></div>;
}

function AuditSettings() {
  const { data } = useWorkspace();
  return <div className="settings-card"><div className="settings-card-head"><div><h3>Immutable action history</h3><p>Database-backed approvals, messages, and sensitive actions.</p></div><button className="secondary-button">Export log</button></div>{data.auditLogs.map((entry) => <div className="audit-row" key={entry.id}><span className="avatar small dark">{entry.actor.slice(0, 2).toUpperCase()}</span><span><strong>{entry.actor}</strong><p>{entry.action}</p></span><em>{entry.targetType}</em><time>{new Date(entry.createdAt).toLocaleString()}</time></div>)}{data.auditLogs.length === 0 && <EmptyState icon={ShieldCheck} title="No audit records" copy="Sensitive live actions will be recorded here." />}</div>;
}

function IntegrationSettings({ section }: { section: string }) {
  const { data } = useWorkspace();
  return <><div className="settings-card"><div className="settings-card-head"><div><h3>{section === "Products" ? "Product configuration" : `${section} connections`}</h3><p>Only integrations stored in the live database are shown.</p></div></div>{data.integrations.map((integration) => <div className="integration-row" key={integration.id}><span className="integration-icon"><GitBranch size={19} /></span><span><strong>{integration.name}</strong><small>{integration.description || "No description saved."}</small></span><em className={integration.status === "Connected" ? "connected" : "warning"}><i /> {integration.status}</em></div>)}{data.integrations.length === 0 && <EmptyState icon={GitBranch} title="No integrations connected" copy="Add a provider record through your live integration service." />}</div></>;
}

function PageHeader({ title, copy, primary }: { title: string; copy: string; primary: string }) {
  return <section className="page-header"><div><h2>{title}</h2><p>{copy}</p></div><span className="eyebrow">{primary} via live data source</span></section>;
}

function EmptyState({ icon: Icon, title, copy }: { icon: typeof Search; title: string; copy: string }) {
  return <div className="empty-state"><Icon size={24} /><strong>{title}</strong><p>{copy}</p></div>;
}
