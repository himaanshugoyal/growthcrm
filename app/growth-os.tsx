"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, BarChart3, Bell, Bot,
  BriefcaseBusiness, CalendarClock, Check, ChevronDown, CircleDollarSign,
  Command, ExternalLink, FileText, Filter, Gauge, GitBranch,
  Globe2, Headphones, KanbanSquare, Layers3, LayoutDashboard, LifeBuoy,
  ListChecks, Megaphone, Menu, MessageCircle, MoreHorizontal, Plus, Search,
  Send, Settings, ShieldCheck, SlidersHorizontal, Sparkles, Target, Users,
  WandSparkles, X, Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  automations, campaigns, conversations, customers, leads, products,
  summaryByProduct, tasks, type ProductId,
} from "./data";

const nav = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Leads", href: "/leads", icon: Users, count: 8 },
  { label: "Pipeline", href: "/pipeline", icon: KanbanSquare },
  { label: "Conversations", href: "/conversations", icon: MessageCircle, count: 3 },
  { label: "Campaigns", href: "/campaigns", icon: Megaphone },
  { label: "Customers", href: "/customers", icon: BriefcaseBusiness },
  { label: "Tasks", href: "/tasks", icon: ListChecks, count: 4 },
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

export function GrowthOS() {
  const pathname = usePathname();
  const router = useRouter();
  const [product, setProduct] = useState<ProductId>("all");
  const [productOpen, setProductOpen] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const segment = pathname.split("/").filter(Boolean)[0] || "dashboard";
  const currentProduct = products.find((p) => p.id === product)!;
  const selectedLead = pathname.startsWith("/leads/") ? leads.find((l) => l.id === pathname.split("/")[2]) || leads[0] : null;

  const filteredLeads = useMemo(
    () => product === "all" ? leads : leads.filter((l) => l.product.toLowerCase() === product),
    [product],
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
            <button onClick={() => navigate("/products")}><Plus size={15} /> Add product</button>
          </div>
        )}

        <nav className="primary-nav" aria-label="Main navigation">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`) || (pathname === "/" && item.href === "/dashboard");
            return (
              <Link key={item.href} href={item.href} className={active ? "active" : ""}>
                <item.icon size={18} />
                <span>{item.label}</span>
                {item.count && <em>{item.count}</em>}
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
            <button className="primary-button" onClick={() => setQuickOpen(true)}><Plus size={17} /> Quick add</button>
          </div>
        </header>

        <div className="content">
          {selectedLead ? <LeadDetail lead={selectedLead} /> :
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

      {quickOpen && <QuickAdd onClose={() => setQuickOpen(false)} />}
    </div>
  );
}

function Dashboard({ product, leads: shownLeads }: { product: ProductId; leads: typeof leads }) {
  const s = summaryByProduct[product];
  const [range, setRange] = useState("Last 30 days");
  return (
    <div className="page-stack">
      <section className="page-intro">
        <div><h2>Good morning, Himanshu.</h2><p>Here’s what’s moving across your growth engine.</p></div>
        <div className="intro-actions">
          <span className="live-pill"><i /> Data refreshed 8 min ago</span>
          <select value={range} onChange={(e) => setRange(e.target.value)} aria-label="Date range">
            <option>Last 30 days</option><option>Last 7 days</option><option>This quarter</option>
          </select>
        </div>
      </section>

      <section className="metrics-grid">
        <Metric label="New leads" value={String(s.leads)} meta={s.trend} icon={Users} />
        <Metric label="Qualified" value={String(s.qualified)} meta={`${Math.round(s.qualified / s.leads * 100)}% of leads`} icon={Target} />
        <Metric label="Paying customers" value={String(s.paid)} meta="+9 this month" icon={CircleDollarSign} />
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
              <div><strong>Strongest lift: activation → paid</strong><p>Founder Focus leads convert 1.8× better after activation.</p></div>
              <ArrowRight size={17} />
            </div>
          </div>
        </div>

        <div className="panel attention-panel">
          <PanelHead title="Needs your attention" subtitle="AI-ranked by revenue impact" />
          <div className="attention-list">
            <Attention icon={MessageCircle} tone="orange" title="Meera needs a human answer" copy="Asked about team permissions · Asksemble" time="28m" />
            <Attention icon={CalendarClock} tone="blue" title="Aarav’s demo is today" copy="High-intent lead · ₹48,000 expected" time="4:30" />
            <Attention icon={Gauge} tone="red" title="Aditya’s health dropped" copy="No activity in 11 days · FlowKreative" time="2h" />
            <Attention icon={CircleDollarSign} tone="green" title="Payment received" copy="Weave Systems · Asksemble Team" time="3h" />
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
              const ps = summaryByProduct[p.id];
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

function LeadsPage({ leads: shownLeads }: { leads: typeof leads }) {
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

function LeadRow({ lead, compact = false }: { lead: typeof leads[number]; compact?: boolean }) {
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

function PipelinePage({ leads: shownLeads }: { leads: typeof leads }) {
  const [cards, setCards] = useState(shownLeads);
  function advance(id: string) {
    setCards((all) => all.map((lead) => {
      if (lead.id !== id) return lead;
      const idx = stageOrder.indexOf(lead.stage);
      return { ...lead, stage: stageOrder[Math.min(idx + 1, stageOrder.length - 1)] };
    }));
  }
  return <div className="page-stack">
    <PageHeader title="₹2.94L open pipeline" copy="18 active opportunities · 7 need a follow-up" primary="Add opportunity" />
    <div className="pipeline-toolbar"><div className="view-tabs"><button className="active">Kanban</button><button>Table</button></div><span>Weighted value <strong>₹1.86L</strong></span><button className="secondary-button"><Filter size={15} /> Filter</button></div>
    <div className="kanban">
      {stageOrder.map((stage) => {
        const stageLeads = cards.filter((l) => l.stage === stage);
        return <div className="kanban-column" key={stage}>
          <div className="kanban-head"><span><i /> {stage}</span><em>{stageLeads.length}</em></div>
          <small className="column-value">{stageLeads.reduce((sum, l) => sum + Number(l.value.replace(/[₹,]/g, "")), 0).toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })}</small>
          <div className="kanban-cards">
            {stageLeads.map((lead) => <article className="deal-card" key={lead.id}>
              <div><span className={`avatar ${lead.tone}`}>{lead.initials}</span><em className={`score score-${Math.floor(lead.score / 20)}`}>{lead.score}</em></div>
              <Link href={`/leads/${lead.id}`}>{lead.name}</Link>
              <small>{lead.company} · {lead.product}</small>
              <p>{lead.requirement}</p>
              <div className="deal-meta"><strong>{lead.value}</strong><span><MessageCircle size={14} /> {lead.activity.split(" · ")[0]}</span></div>
              <button onClick={() => advance(lead.id)} disabled={stage === stageOrder.at(-1)}>Move forward <ArrowRight size={13} /></button>
            </article>)}
            <button className="add-card"><Plus size={15} /> Add opportunity</button>
          </div>
        </div>;
      })}
    </div>
  </div>;
}

function LeadDetail({ lead }: { lead: typeof leads[number] }) {
  const [aiOn, setAiOn] = useState(true);
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<string[]>([]);
  return <div className="lead-detail-layout">
    <div className="lead-main">
      <div className="lead-profile">
        <div className={`avatar xl ${lead.tone}`}>{lead.initials}</div>
        <div><div className="lead-name-line"><h2>{lead.name}</h2><span className={`score score-${Math.floor(lead.score / 20)}`}>{lead.score} · High intent</span></div><p>{lead.company} · {lead.location}</p><span>{lead.email} &nbsp;·&nbsp; {lead.phone}</span></div>
        <div className="lead-actions"><button className="secondary-button"><MessageCircle size={15} /> Message</button><button className="primary-button">Schedule demo</button></div>
      </div>
      <div className="stage-progress">
        {["New", "Engaged", "Qualified", "Demo", "Negotiation", "Paid"].map((s, i) => <div className={i <= 2 ? "done" : ""} key={s}><i>{i < 2 ? <Check size={12} /> : i + 1}</i><span>{s}</span></div>)}
      </div>
      <div className="lead-tabs"><button className="active">Timeline</button><button>Details</button><button>Attribution</button><button>Customer</button></div>
      <div className="composer">
        <div className="composer-tabs"><button className="active">Add note</button><button>Create task</button><button>Log meeting</button></div>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Capture context for your future self…" />
        <div><span><button><FileText size={15} /></button><button><Sparkles size={15} /> Improve with AI</button></span><button className="primary-button" disabled={!note.trim()} onClick={() => { setNotes([note, ...notes]); setNote(""); }}>Save note</button></div>
      </div>
      <div className="timeline">
        {notes.map((n, i) => <TimelineItem key={i} icon={FileText} tone="slate" title="You added a note" time="Just now"><p>{n}</p></TimelineItem>)}
        <TimelineItem icon={Bot} tone="purple" title="AI qualification completed" time="Today · 11:42 AM">
          <div className="ai-summary"><span><Sparkles size={14} /> Handoff summary</span><p>Aarav is actively evaluating a founder operating system. The core need is preserving decisions and connecting them to execution. Budget and timeline are confirmed; he asked for a focused 30-minute demo.</p><div><em>Budget confirmed</em><em>Decision maker</em><em>This month</em></div></div>
        </TimelineItem>
        <TimelineItem icon={MessageCircle} tone="green" title="WhatsApp conversation" time="Today · 11:28 AM">
          <div className="transcript"><p><strong>Virtual assistant</strong> What usually happens to an important decision after it’s made?</p><p className="reply"><strong>Aarav</strong> It gets buried in WhatsApp or meeting notes. That’s the biggest problem.</p><button>View full conversation <ArrowRight size={13} /></button></div>
        </TimelineItem>
        <TimelineItem icon={Target} tone="orange" title="Google Ads attribution captured" time="Today · 11:19 AM"><p>Founder Focus — Search · “founder productivity system” · first and last touch</p></TimelineItem>
        <TimelineItem icon={Globe2} tone="blue" title="Demo form submitted" time="Today · 11:18 AM"><p>Landing page: /founder-system · gclid captured · consent granted</p></TimelineItem>
      </div>
    </div>
    <aside className="lead-aside">
      <div className="aside-section">
        <h3>Sales copilot <span><Sparkles size={14} /> Live</span></h3>
        <div className="next-best"><small>Recommended next action</small><strong>Tailor the demo around decision capture</strong><p>Show the capture → clarify → commit loop. Avoid broad project-management comparisons.</p><button><WandSparkles size={15} /> Prepare demo brief</button></div>
      </div>
      <div className="aside-section">
        <h3>AI control</h3>
        <div className="ai-control"><span><strong>Qualification agent</strong><small>{aiOn ? "Replies are active" : "Human has control"}</small></span><button className={`switch ${aiOn ? "on" : ""}`} onClick={() => setAiOn(!aiOn)} aria-label="Toggle AI control"><i /></button></div>
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
  const [selected, setSelected] = useState(0);
  const [aiOn, setAiOn] = useState(selected !== 2);
  const [draft, setDraft] = useState("");
  const [sent, setSent] = useState<string[]>([]);
  const c = conversations[selected];
  function selectConversation(i: number) { setSelected(i); setAiOn(i !== 2); setSent([]); }
  return <div className="inbox-shell">
    <section className="conversation-list">
      <div className="conversation-tools"><label className="field-search"><Search size={15} /><input placeholder="Search conversations…" /></label><button className="icon-button"><Filter size={16} /></button></div>
      <div className="inbox-tabs"><button className="active">Open <em>4</em></button><button>Needs me <em>1</em></button><button>Closed</button></div>
      {conversations.map((item, i) => <button className={`conversation-row ${selected === i ? "active" : ""}`} key={item.lead} onClick={() => selectConversation(i)}>
        <span className="avatar blue">{item.initials}</span>
        <span><span><strong>{item.lead}</strong><time>{item.time}</time></span><small>{item.product} · {item.channel}</small><p>{item.preview}</p><em>{item.status}</em></span>
        {item.unread > 0 && <i>{item.unread}</i>}
      </button>)}
    </section>
    <section className="chat-panel">
      <div className="chat-head"><div><span className="avatar blue">{c.initials}</span><span><strong>{c.lead}</strong><small>{c.product} · {c.channel} · {c.sentiment} sentiment</small></span></div><div><button className="secondary-button"><Users size={15} /> Assign</button><button className="icon-button"><MoreHorizontal size={18} /></button></div></div>
      <div className="ai-strip"><span><Sparkles size={15} /> Product Advisor is using <strong>{c.product} knowledge only</strong></span><button onClick={() => setAiOn(!aiOn)}>{aiOn ? "Take over" : "Return to AI"}</button></div>
      <div className="messages">
        <time>Today, 11:28 AM</time>
        <div className="message incoming">Hi, I found {c.product} while looking for a better way to solve this. Can you help?</div>
        <div className="message outgoing"><small><Bot size={12} /> Virtual assistant</small>Absolutely — I’m {c.product}’s virtual assistant. What’s the one outcome you’d most like to improve?</div>
        <div className="message incoming">{c.preview.replace("…", ".")}</div>
        <div className="message outgoing"><small><Bot size={12} /> Virtual assistant</small>That makes sense. Roughly how often does that slow your team down?</div>
        {sent.map((message, i) => <div className="message outgoing human" key={i}><small>You · human reply</small>{message}</div>)}
      </div>
      <div className="suggested-reply"><Sparkles size={15} /><span><small>Suggested reply</small><p>I can show you the exact workflow for that. Would a short demo tomorrow or Friday work better?</p></span><button onClick={() => setDraft("I can show you the exact workflow for that. Would a short demo tomorrow or Friday work better?")}>Use</button></div>
      <div className="chat-composer">
        {!aiOn && <span className="takeover-note"><Headphones size={14} /> You’re replying. AI is paused.</span>}
        <div><button className="icon-button"><Plus size={18} /></button><textarea value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={aiOn ? "Take over to send a human reply…" : "Write a reply…"} disabled={aiOn} /><button className="send-button" disabled={aiOn || !draft.trim()} onClick={() => { setSent([...sent, draft]); setDraft(""); }}><Send size={16} /></button></div>
      </div>
    </section>
    <aside className="conversation-context">
      <div className="context-person"><span className="avatar xl blue">{c.initials}</span><h3>{c.lead}</h3><p>{c.product} prospect</p><span className="score score-4">86 · High intent</span></div>
      <div className="context-section"><h4>Live qualification</h4>{[["Use case", "Team knowledge and repeat questions"], ["Budget", "₹60k–80k / year"], ["Timeline", "Within 30 days"], ["Authority", "Evaluator"]].map(([k, v]) => <div key={k}><small>{k}</small><p>{v}</p></div>)}</div>
      <div className="context-section"><h4>AI confidence</h4><div className="confidence"><span><i style={{ width: "91%" }} /></span><strong>91%</strong></div><p className="source-note"><ShieldCheck size={14} /> 3 product sources used</p></div>
    </aside>
  </div>;
}

function CampaignsPage({ product }: { product: ProductId }) {
  const rows = product === "all" ? campaigns : campaigns.filter((c) => c.product.toLowerCase() === product);
  const [confirm, setConfirm] = useState<string | null>(null);
  return <div className="page-stack">
    <PageHeader title="Campaign intelligence" copy="Tie every rupee of spend to signups, revenue, and satisfaction." primary="Plan campaign" />
    <div className="metrics-grid three"><Metric label="Ad spend" value="₹1.09L" meta="+12.4% vs prior period" icon={CircleDollarSign} /><Metric label="Attributed revenue" value="₹4.44L" meta="4.1× blended ROAS" icon={ArrowUpRight} highlight /><Metric label="Customer acquisition cost" value="₹2,658" meta="-8.6% improvement" icon={Target} /></div>
    <div className="table-panel campaign-table">
      <div className="campaign-head"><span>Campaign</span><span>Spend</span><span>Leads</span><span>Paid</span><span>Revenue</span><span>ROAS</span><span>Status</span><span /></div>
      {rows.map((c) => <div className="campaign-row" key={c.name}>
        <span><i className={`platform ${c.platform.toLowerCase()}`}>{c.platform[0]}</i><span><strong>{c.name}</strong><small>{c.product} · {c.platform} · synced {c.sync}</small></span></span>
        <span>{c.spend}</span><span>{c.leads}</span><span>{c.paid}</span><span>{c.revenue}</span><span><strong>{c.roas}</strong></span>
        <span><em className={`status-pill ${c.status.toLowerCase()}`}>{c.status}</em></span>
        <span><button className="icon-button" onClick={() => setConfirm(c.name)}><MoreHorizontal size={17} /></button></span>
      </div>)}
    </div>
    <div className="safety-note"><ShieldCheck size={18} /><div><strong>Approval-controlled ad actions</strong><p>GrowthOS never publishes, pauses, or changes spend without showing the full action and asking you to confirm.</p></div><Link href="/settings/ad-accounts">Review controls <ArrowRight size={14} /></Link></div>
    {confirm && <ConfirmAd campaign={campaigns.find((c) => c.name === confirm)!} onClose={() => setConfirm(null)} />}
  </div>;
}

function ConfirmAd({ campaign, onClose }: { campaign: typeof campaigns[number]; onClose: () => void }) {
  const [done, setDone] = useState(false);
  return <div className="modal-backdrop"><div className="modal">
    <button className="modal-close icon-button" onClick={onClose}><X size={18} /></button>
    {done ? <div className="success-state"><span><Check size={26} /></span><h3>Action recorded</h3><p>The request was added to the immutable audit log. No spend was changed in this simulator.</p><button className="primary-button" onClick={onClose}>Done</button></div> : <>
      <span className="modal-icon"><ShieldCheck size={22} /></span><h3>Confirm campaign action</h3><p>Review the complete spend impact before continuing.</p>
      <div className="confirm-grid"><div><small>Platform</small><strong>{campaign.platform} Ads</strong></div><div><small>Product</small><strong>{campaign.product}</strong></div><div><small>Campaign</small><strong>{campaign.name}</strong></div><div><small>Action</small><strong>Pause campaign</strong></div><div><small>Daily budget</small><strong>₹3,000</strong></div><div><small>Possible spend</small><strong>₹90,000 / month</strong></div></div>
      <label className="confirm-check"><input type="checkbox" id="confirm-ad" /> I understand this will request a provider-side change.</label>
      <div className="modal-actions"><button className="secondary-button" onClick={onClose}>Cancel</button><button className="danger-button" onClick={() => setDone(true)}>Confirm pause</button></div>
    </>}
  </div></div>;
}

function CustomersPage({ product }: { product: ProductId }) {
  const rows = product === "all" ? customers : customers.filter((c) => c.product.toLowerCase() === product);
  return <div className="page-stack">
    <PageHeader title="Customer health" copy="Know who is thriving, who needs help, and why." primary="Add customer" />
    <div className="health-overview panel"><div><span className="health-ring"><strong>82</strong><small>Healthy</small></span><span><h3>Portfolio health</h3><p>Usage and satisfaction improved this month.</p></span></div><div className="health-factors"><span><small>Activation</small><strong>86%</strong></span><span><small>Avg. CSAT</small><strong>4.6 / 5</strong></span><span><small>NPS</small><strong>+48</strong></span><span><small>At risk</small><strong>6</strong></span></div></div>
    <div className="table-panel customer-table">
      <div className="customer-head"><span>Customer</span><span>Product / plan</span><span>Revenue</span><span>Health</span><span>Status</span><span>Last active</span><span /></div>
      {rows.map((c) => <div className="customer-row" key={c.name}><span className="lead-person"><span className="avatar mint">{c.initials}</span><span><strong>{c.name}</strong><small>{c.company}</small></span></span><span><strong>{c.product}</strong><small>{c.plan}</small></span><span><strong>{c.revenue}</strong></span><span><span className="health-bar"><i style={{ width: `${c.health}%` }} /></span><strong>{c.health}</strong></span><span><em className={`health-status ${c.status.toLowerCase().replace(" ", "-")}`}>{c.status}</em></span><span>{c.activity}</span><span><MoreHorizontal size={17} /></span></div>)}
    </div>
  </div>;
}

function TasksPage() {
  const [done, setDone] = useState<number[]>([]);
  return <div className="page-stack">
    <PageHeader title="Priority queue" copy="The follow-ups and moments most likely to move revenue." primary="New task" />
    <div className="task-layout"><div className="panel task-panel"><div className="task-section-head"><h3>Today</h3><span>{tasks.filter((_, i) => !done.includes(i)).length} remaining</span></div>{tasks.map((t, i) => <div className={`task-row ${done.includes(i) ? "completed" : ""}`} key={t.title}><button className="task-check" onClick={() => setDone(done.includes(i) ? done.filter((x) => x !== i) : [...done, i])}>{done.includes(i) && <Check size={14} />}</button><span><strong>{t.title}</strong><small>{t.type} · {t.lead}</small></span><em className={`priority ${t.priority.toLowerCase()}`}>{t.priority}</em><span><CalendarClock size={14} /> {t.due}</span><span className="avatar small dark">{t.owner === "You" ? "HK" : "RS"}</span></div>)}</div>
    <aside className="panel focus-panel"><span className="spark-icon"><Sparkles size={18} /></span><h3>Your focus for today</h3><p>Completing the first two tasks protects <strong>₹1.2L</strong> in high-intent pipeline.</p><div><span><strong>2</strong><small>High-intent leads</small></span><span><strong>1</strong><small>Demo scheduled</small></span></div><button className="primary-button">Start focus mode <ArrowRight size={15} /></button></aside></div>
  </div>;
}

function AutomationsPage() {
  const [rules, setRules] = useState(automations);
  return <div className="page-stack">
    <PageHeader title="Automations" copy="Handle the routine work while keeping consequential actions human-approved." primary="Build automation" />
    <div className="automation-stats"><div><Zap size={18} /><span><strong>118</strong><small>Runs this month</small></span></div><div><Check size={18} /><span><strong>96.8%</strong><small>Successful</small></span></div><div><CalendarClock size={18} /><span><strong>14.2h</strong><small>Estimated time saved</small></span></div><div><ShieldCheck size={18} /><span><strong>0</strong><small>Loops prevented</small></span></div></div>
    <div className="rule-list">{rules.map((rule, i) => <div className="rule-card" key={rule.name}><span className="rule-icon"><Zap size={18} /></span><span className="rule-copy"><strong>{rule.name}</strong><small>{rule.product} · {rule.runs} runs</small></span><span className="rule-flow"><em>WHEN</em><strong>{rule.trigger}</strong><ArrowRight size={14} /><em>THEN</em><strong>{rule.action}</strong></span><button className={`switch ${rule.status ? "on" : ""}`} onClick={() => setRules(rules.map((r, idx) => idx === i ? { ...r, status: !r.status } : r))}><i /></button><button className="icon-button"><MoreHorizontal size={17} /></button></div>)}</div>
    <div className="execution-history panel"><PanelHead title="Recent execution history" subtitle="Auditable runs across your active rules" /><div className="history-row"><span className="success-dot"><Check size={12} /></span><span><strong>Route high-intent leads</strong><small>Aarav Mehta assigned to Himanshu</small></span><time>12m ago</time><em>Successful</em></div><div className="history-row"><span className="success-dot"><Check size={12} /></span><span><strong>Activation rescue</strong><small>Draft created for Sana Qureshi — awaiting approval</small></span><time>2h ago</time><em>Successful</em></div></div>
  </div>;
}

function AnalyticsPage({ product }: { product: ProductId }) {
  const [metric, setMetric] = useState("Revenue");
  const s = summaryByProduct[product];
  return <div className="page-stack">
    <PageHeader title="Conversion intelligence" copy="First-touch attribution · Last 30 days · data through 8 minutes ago" primary="Export report" />
    <div className="analytics-tabs"><button className="active">Funnel</button><button>Acquisition</button><button>Revenue</button><button>Customers</button><button>AI performance</button></div>
    <div className="metrics-grid"><Metric label="Lead → signup" value={`${Math.round(s.signups / s.leads * 100)}%`} meta="+3.2 pts" icon={ArrowUpRight} /><Metric label="Signup → paid" value={`${Math.round(s.paid / s.signups * 100)}%`} meta="+4.7 pts" icon={ArrowUpRight} /><Metric label="CAC" value="₹2,658" meta="-8.6% lower" icon={ArrowDownRight} /><Metric label="Blended ROAS" value={s.roas} meta="+0.6 vs prior" icon={ArrowUpRight} highlight /></div>
    <div className="analytics-grid">
      <div className="panel chart-panel"><div className="panel-head"><div><h3>Growth trend</h3><p>Conversion events over time</p></div><select value={metric} onChange={(e) => setMetric(e.target.value)}><option>Revenue</option><option>Leads</option><option>Paid customers</option></select></div>
        <div className="chart">
          <div className="chart-y"><span>₹8L</span><span>₹6L</span><span>₹4L</span><span>₹2L</span><span>₹0</span></div>
          <div className="chart-body"><div className="gridline" /><div className="gridline" /><div className="gridline" /><div className="gridline" /><div className="bar-series">{[28, 34, 31, 48, 45, 59, 63, 58, 74, 71, 82, 92].map((h, i) => <i key={i} style={{ height: `${h}%` }}><span>{i === 11 ? s.revenue : ""}</span></i>)}</div><div className="chart-x"><span>Apr 01</span><span>Apr 08</span><span>Apr 15</span><span>Apr 22</span><span>Apr 30</span></div></div>
        </div>
      </div>
      <div className="panel source-panel"><PanelHead title="Sources that create customers" subtitle="Not just leads" />
        {[["Google Ads", 38, 14, "₹2.18L", 82], ["Organic search", 31, 10, "₹1.42L", 68], ["Meta Ads", 47, 8, "₹1.41L", 61], ["Referral", 12, 6, "₹1.12L", 49]].map(([source, leadCount, paid, rev, w]) => <div className="source-row" key={source as string}><span><strong>{source}</strong><small>{leadCount} leads · {paid} paid</small></span><span className="source-bar"><i style={{ width: `${w}%` }} /></span><strong>{rev}</strong></div>)}
      </div>
    </div>
    <div className="panel product-comparison"><PanelHead title="Product comparison" subtitle="Same attribution model and date range" />
      <div className="comparison-head"><span>Product</span><span>Leads</span><span>Signups</span><span>Paid</span><span>Revenue</span><span>ROAS</span><span>CSAT</span></div>
      {products.slice(1).map((p, i) => { const x = summaryByProduct[p.id]; return <div className="comparison-row" key={p.id}><span><span className="product-avatar small" style={{ background: p.bg, color: p.color }}>{p.short}</span><strong>{p.name}</strong></span><span>{x.leads}</span><span>{x.signups}</span><span>{x.paid}</span><span><strong>{x.revenue}</strong></span><span>{x.roas}</span><span>{[4.7, 4.5, 4.4][i]} / 5</span></div>; })}
    </div>
  </div>;
}

function ProductsPage() {
  return <div className="page-stack"><PageHeader title="Products" copy="Each product has its own demand engine, knowledge, and channels." primary="Add product" /><div className="product-cards">{products.slice(1).map((p, i) => <article key={p.id}><div><span className="product-avatar xl" style={{ background: p.bg, color: p.color }}>{p.short}</span><span><h3>{p.name}</h3><p>{["A calm thinking and execution system for founders.", "An AI knowledge and workflow layer for modern teams.", "Turn lyrics into cinematic videos, beautifully and quickly."][i]}</p></span><button className="icon-button"><MoreHorizontal size={18} /></button></div><div className="product-stats"><span><strong>{summaryByProduct[p.id].leads}</strong><small>Leads</small></span><span><strong>{summaryByProduct[p.id].paid}</strong><small>Customers</small></span><span><strong>{summaryByProduct[p.id].revenue}</strong><small>Revenue</small></span></div><div className="connections"><span><i className="connection-dot active" /> Website tracking</span><span><i className="connection-dot active" /> {i === 1 ? "Telegram" : "WhatsApp"}</span><span><i className="connection-dot" /> {i === 2 ? "Meta Ads" : "Google Ads"}</span></div><Link href={`/settings/products?product=${p.id}`}>Manage product <ArrowRight size={15} /></Link></article>)}</div></div>;
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
  const code = `<script\n  src="https://your-growthos.site/tracker.js"\n  data-product-key="pk_flowkreative_demo"\n  async>\n</script>`;
  return <><div className="settings-card"><div className="settings-card-head"><div><h3>Website tracking</h3><p>Capture attribution and lifecycle events without collecting page content.</p></div><span className="connected-pill"><i /> Active</span></div><div className="code-block"><code>{code}</code><button onClick={() => navigator.clipboard?.writeText(code)}>Copy</button></div><div className="settings-row"><span><strong>Consent-aware collection</strong><small>Do not store visitor identifiers until consent is available.</small></span><button className="switch on"><i /></button></div><div className="settings-row"><span><strong>First and last touch</strong><small>Retain raw attribution evidence for future model changes.</small></span><button className="switch on"><i /></button></div></div><div className="settings-card"><h3>Recent events</h3>{["signup_completed", "activation_completed", "subscription_started", "payment_received"].map((e, i) => <div className="event-row" key={e}><span className="success-dot"><Check size={12} /></span><code>{e}</code><span>{["FlowKreative", "Asksemble", "FlowKreative", "Vyrical"][i]}</span><time>{i * 7 + 2}m ago</time><em>Accepted</em></div>)}</div></>;
}

function AISettings() {
  return <><div className="settings-card"><div className="settings-card-head"><div><h3>Focused AI services</h3><p>Every run is product-isolated, sourced, and auditable.</p></div><span className="connected-pill"><i /> 5 active</span></div>{[["Lead Capture", "Normalizes data, identifies source, and safely flags duplicates."], ["Qualification", "Asks one short question at a time and produces structured handoffs."], ["Lead Scoring", "Scores intent from 0–100 and shows every factor."], ["Sales Copilot", "Summarizes, recommends next actions, and drafts replies."], ["Product Advisor", "Answers only from the selected product’s approved knowledge."]].map(([n, d]) => <div className="agent-row" key={n}><span className="agent-icon"><Bot size={17} /></span><span><strong>{n}</strong><small>{d}</small></span><button className="switch on"><i /></button></div>)}</div><div className="settings-card safety-config"><h3>Global safety rules</h3><div><ShieldCheck size={18} /><span><strong>Low-confidence escalation</strong><small>Answers under 78% confidence require human review.</small></span><strong>78%</strong></div><div><Globe2 size={18} /><span><strong>Knowledge isolation</strong><small>Cross-product retrieval is blocked server-side.</small></span><em>Enforced</em></div><div><Headphones size={18} /><span><strong>Human takeover</strong><small>AI stays paused until explicitly returned control.</small></span><em>Enforced</em></div></div></>;
}

function AuditSettings() {
  return <div className="settings-card"><div className="settings-card-head"><div><h3>Immutable action history</h3><p>AI decisions, approvals, messages, and sensitive actions.</p></div><button className="secondary-button">Export log</button></div>{[["Himanshu", "Paused AI in conversation with Kabir Shah", "Conversation", "12m ago"], ["Qualification Agent", "Produced handoff summary for Aarav Mehta", "AI run", "28m ago"], ["System", "Imported 24 Meta Ads metric rows", "Integration", "1h ago"], ["Himanshu", "Approved post-render CSAT automation", "Approval", "Yesterday"]].map((r) => <div className="audit-row" key={r[1]}><span className="avatar small dark">{r[0] === "Himanshu" ? "HK" : r[0][0]}</span><span><strong>{r[0]}</strong><p>{r[1]}</p></span><em>{r[2]}</em><time>{r[3]}</time></div>)}</div>;
}

function IntegrationSettings({ section }: { section: string }) {
  const integrations = [["WhatsApp Cloud API", "Connected", "Inbound and approved template messages", MessageCircle], ["Telegram Bot API", "Connected", "User-initiated conversations only", Send], ["Google Ads", "Connected", "Read metrics · actions need approval", Megaphone], ["Meta Ads", "Needs attention", "Reconnect to resume metric sync", Target]];
  return <><div className="settings-card"><div className="settings-card-head"><div><h3>{section === "Products" ? "Product configuration" : `${section} connections`}</h3><p>Credentials are encrypted and never exposed to AI agents.</p></div><button className="primary-button"><Plus size={15} /> Add connection</button></div>{integrations.map(([name, status, desc, Icon]) => <div className="integration-row" key={String(name)}><span className="integration-icon"><Icon size={19} /></span><span><strong>{name as string}</strong><small>{desc as string}</small></span><em className={status === "Connected" ? "connected" : "warning"}><i /> {status as string}</em><button className="secondary-button">Manage</button></div>)}</div><div className="settings-card privacy-card"><ShieldCheck size={20} /><div><h3>Privacy and retention</h3><p>Consent timestamps, opt-outs, export, and deletion requests are enforced across connected channels.</p></div><button className="secondary-button">Review policy</button></div></>;
}

function PageHeader({ title, copy, primary }: { title: string; copy: string; primary: string }) {
  return <section className="page-header"><div><h2>{title}</h2><p>{copy}</p></div><div><button className="secondary-button"><ExternalLink size={15} /> Import</button><button className="primary-button"><Plus size={16} /> {primary}</button></div></section>;
}

function EmptyState({ icon: Icon, title, copy }: { icon: typeof Search; title: string; copy: string }) {
  return <div className="empty-state"><Icon size={24} /><strong>{title}</strong><p>{copy}</p></div>;
}

function QuickAdd({ onClose }: { onClose: () => void }) {
  const actions = [[Users, "Add lead", "Capture a new contact and attribution"], [MessageCircle, "Simulate conversation", "Test WhatsApp or Telegram qualification"], [Activity, "Record lifecycle event", "Signup, activation, payment, or CSAT"], [ListChecks, "Create task", "Set an owner and follow-up time"], [Megaphone, "Plan campaign", "Draft with approval-controlled publishing"]];
  return <div className="modal-backdrop"><div className="modal quick-modal"><button className="modal-close icon-button" onClick={onClose}><X size={18} /></button><h3>What do you want to add?</h3><p>Choose a workflow to get started.</p><div className="quick-actions">{actions.map(([Icon, title, copy]) => <button key={title as string} onClick={onClose}><span><Icon size={18} /></span><span><strong>{title as string}</strong><small>{copy as string}</small></span><ArrowRight size={16} /></button>)}</div></div></div>;
}
