"use client";

import Link from "next/link";
import {
  ArrowRight, BarChart3, Bot, Check, CheckCircle2, ChevronDown, CircleDollarSign,
  Clock3, Command, MessageCircle, MousePointer2, Play, ShieldCheck, Sparkles,
  Target, TrendingUp, UserRoundCheck, Users, Zap,
} from "lucide-react";
import { useState } from "react";

const features = [
  {
    icon: MessageCircle,
    title: "One WhatsApp team inbox",
    copy: "Every lead, reply and owner in one shared view—without losing the human touch.",
    accent: "mint",
  },
  {
    icon: Bot,
    title: "AI that qualifies, not annoys",
    copy: "Answer routine questions, capture intent and hand hot conversations to your team with context.",
    accent: "blue",
  },
  {
    icon: Target,
    title: "A pipeline that updates itself",
    copy: "Move every conversation from new lead to paid customer with scores, next steps and deal value.",
    accent: "amber",
  },
  {
    icon: BarChart3,
    title: "Revenue attribution",
    copy: "See which campaigns, conversations and follow-ups create signups—not just clicks.",
    accent: "violet",
  },
  {
    icon: Zap,
    title: "Follow-ups on autopilot",
    copy: "Trigger timely, personalized nudges while your team stays focused on ready-to-buy leads.",
    accent: "coral",
  },
  {
    icon: UserRoundCheck,
    title: "Customer health, after the sale",
    copy: "Spot risk, celebrate payments and keep retention work in the same customer timeline.",
    accent: "green",
  },
];

const faqs = [
  ["Do I need a new WhatsApp number?", "No. GrowthOS is designed to connect with your existing WhatsApp Business setup and preserve the way customers already reach you."],
  ["Will AI take over every conversation?", "Only when you want it to. Set clear rules, pause AI per conversation, and hand off high-intent or sensitive chats to a person instantly."],
  ["Can I see which campaign generated a sale?", "Yes. GrowthOS connects campaign source, conversation history, pipeline movement and revenue in one customer timeline."],
  ["How quickly can my team get started?", "Most teams can map their sales flow and begin onboarding in a guided session. We tailor the setup to your products, stages and follow-up rules."],
];

export function LandingPage() {
  const [openFaq, setOpenFaq] = useState(0);
  const [mobileNav, setMobileNav] = useState(false);

  return (
    <main className="marketing-site">
      <div className="announcement">
        <span><Sparkles size={14} /> Built for teams that sell on WhatsApp</span>
        <Link href="/contact">Get an early-access walkthrough <ArrowRight size={14} /></Link>
      </div>

      <header className="marketing-nav">
        <Link href="/" className="marketing-logo" aria-label="GrowthOS home">
          <span><Command size={20} strokeWidth={2.6} /></span>
          GrowthOS
        </Link>
        <button className="marketing-menu" onClick={() => setMobileNav(!mobileNav)} aria-expanded={mobileNav} aria-label="Toggle navigation">
          <span /><span /><span />
        </button>
        <nav className={mobileNav ? "open" : ""} aria-label="Main navigation">
          <a href="#features" onClick={() => setMobileNav(false)}>Features</a>
          <a href="#how-it-works" onClick={() => setMobileNav(false)}>How it works</a>
          <a href="#results" onClick={() => setMobileNav(false)}>Why GrowthOS</a>
          <Link href="/dashboard">Sign in</Link>
          <Link href="/contact" className="nav-cta">Book a demo <ArrowRight size={15} /></Link>
        </nav>
      </header>

      <section className="marketing-hero">
        <div className="hero-copy">
          <div className="hero-kicker"><span className="pulse-dot" /> WhatsApp CRM + AI growth engine</div>
          <h1>Turn every WhatsApp conversation into <em>revenue.</em></h1>
          <p>Capture, qualify and convert leads from one intelligent workspace—without spreadsheets, missed follow-ups or scattered customer context.</p>
          <div className="hero-actions">
            <Link href="/contact" className="marketing-primary">Book your free demo <ArrowRight size={18} /></Link>
            <a href="#product-tour" className="marketing-secondary"><span><Play size={14} fill="currentColor" /></span> See it in action</a>
          </div>
          <div className="hero-proof">
            <span><Check size={15} /> Guided setup</span>
            <span><Check size={15} /> Human handoff</span>
            <span><Check size={15} /> No credit card</span>
          </div>
        </div>

        <div className="hero-product" id="product-tour">
          <div className="product-glow" />
          <div className="mock-browser">
            <div className="mock-top">
              <div className="mock-logo"><Command size={15} /> GrowthOS</div>
              <div className="mock-search">Search conversations…</div>
              <div className="mock-avatar">HK</div>
            </div>
            <div className="mock-body">
              <aside className="mock-sidebar">
                <span className="mock-nav-title">Workspace</span>
                <i className="selected"><MessageCircle size={13} /> Inbox <b>8</b></i>
                <i><Users size={13} /> Leads</i>
                <i><Target size={13} /> Pipeline</i>
                <i><BarChart3 size={13} /> Analytics</i>
                <div className="mock-mini-result"><small>This month</small><strong>₹3.42L</strong><em><TrendingUp size={10} /> +28.4%</em></div>
              </aside>
              <div className="mock-conversations">
                <div className="mock-pane-head"><strong>Conversations</strong><span>12 open</span></div>
                {[
                  ["AS", "Aarav Sharma", "Can we start with 5 users?", "2m", "hot"],
                  ["MK", "Meera Kapoor", "Yes, please share the pricing", "8m", ""],
                  ["RS", "Rohan Shah", "We need an automation demo", "24m", ""],
                  ["NP", "Nisha Patel", "Thanks! I’ll check with my team", "1h", ""],
                ].map(([initials, name, text, time, tone], i) => (
                  <div className={`mock-thread ${i === 0 ? "active" : ""}`} key={name}>
                    <span className={`thread-avatar ${tone}`}>{initials}</span>
                    <span><strong>{name}</strong><small>{text}</small></span>
                    <time>{time}</time>
                  </div>
                ))}
              </div>
              <div className="mock-chat">
                <div className="mock-chat-head">
                  <span className="thread-avatar hot">AS</span>
                  <span><strong>Aarav Sharma</strong><small><i /> Online · Qualified lead</small></span>
                  <em>92</em>
                </div>
                <div className="mock-messages">
                  <div className="chat-date">Today, 11:42 AM</div>
                  <p className="incoming">Hi! We’re evaluating a WhatsApp CRM for our sales team.</p>
                  <p className="outgoing">Great timing, Aarav! How many people currently handle incoming leads?</p>
                  <p className="incoming">Five. Can we assign chats and track which campaigns convert?</p>
                  <div className="ai-note"><Sparkles size={12} /><span><strong>High buying intent detected</strong>Team plan · Demo recommended</span></div>
                  <p className="outgoing">Absolutely. I can show you both in a 20-minute walkthrough. Would tomorrow at 3 PM work?</p>
                </div>
                <div className="mock-compose">Type a reply… <span><Sparkles size={12} /> AI assist</span></div>
              </div>
            </div>
          </div>
          <div className="floating-card qualified"><CheckCircle2 size={18} /><span><small>Lead qualified</small><strong>Demo booked · 3:00 PM</strong></span></div>
          <div className="floating-card revenue"><CircleDollarSign size={18} /><span><small>Pipeline value</small><strong>+ ₹48,000</strong></span></div>
        </div>
      </section>

      <section className="trust-strip" aria-label="GrowthOS outcomes">
        <p>One workspace for the full customer journey</p>
        <div>
          <span><MessageCircle size={18} /> Conversations</span>
          <i />
          <span><MousePointer2 size={18} /> Lead capture</span>
          <i />
          <span><Target size={18} /> Pipeline</span>
          <i />
          <span><CircleDollarSign size={18} /> Revenue</span>
          <i />
          <span><ShieldCheck size={18} /> Retention</span>
        </div>
      </section>

      <section className="feature-section" id="features">
        <div className="section-heading">
          <span>Everything in context</span>
          <h2>Your sales team shouldn’t need six tools to close one customer.</h2>
          <p>GrowthOS keeps every conversation, signal and next step connected from first message to renewal.</p>
        </div>
        <div className="feature-grid">
          {features.map((feature) => (
            <article key={feature.title} className="feature-card">
              <span className={`feature-icon ${feature.accent}`}><feature.icon size={21} /></span>
              <h3>{feature.title}</h3>
              <p>{feature.copy}</p>
              <a href="#how-it-works">Explore the workflow <ArrowRight size={14} /></a>
            </article>
          ))}
        </div>
      </section>

      <section className="workflow-section" id="how-it-works">
        <div className="workflow-copy">
          <span className="section-label">From hello to closed-won</span>
          <h2>A better sales process, running quietly in the background.</h2>
          <p>GrowthOS gives every lead a clear path forward while your team keeps conversations personal.</p>
          <div className="workflow-list">
            <div><b>01</b><span><strong>Connect your channels</strong><small>Bring WhatsApp leads and campaign context into one shared inbox.</small></span></div>
            <div><b>02</b><span><strong>Let AI do the first-mile work</strong><small>Qualify intent, answer common questions and recommend the next best action.</small></span></div>
            <div><b>03</b><span><strong>Close with complete context</strong><small>Your team steps in at the right moment with history, value and next step ready.</small></span></div>
          </div>
          <Link href="/contact" className="text-cta">Map my sales workflow <ArrowRight size={16} /></Link>
        </div>
        <div className="workflow-visual">
          <div className="pipeline-card">
            <div className="pipeline-head"><span>Live pipeline</span><em>₹2.94L open</em></div>
            {[
              ["New lead", "18", "₹82K", 78],
              ["Qualified", "11", "₹1.28L", 92],
              ["Demo booked", "7", "₹76K", 64],
              ["Negotiation", "3", "₹48K", 42],
            ].map(([label, count, value, width], index) => (
              <div className="pipeline-row" key={String(label)}>
                <span><i>{index + 1}</i><strong>{label}</strong><small>{count} leads</small></span>
                <span><b style={{ width: `${width}%` }} /></span>
                <em>{value}</em>
              </div>
            ))}
          </div>
          <div className="workflow-insight"><Sparkles size={17} /><span><strong>Growth opportunity</strong><small>Follow up with 4 demo-ready leads today to unlock ₹72K.</small></span><ArrowRight size={15} /></div>
        </div>
      </section>

      <section className="results-section" id="results">
        <div className="result-story">
          <span className="quote-mark">“</span>
          <blockquote>We stopped asking, “Who is following up?” GrowthOS made every lead visible, every next step obvious, and our WhatsApp sales process finally measurable.</blockquote>
          <div><span className="result-avatar">AK</span><span><strong>Ananya Khanna</strong><small>Growth lead, D2C brand</small></span></div>
        </div>
        <div className="result-metrics">
          <span><strong>2.3×</strong><small>faster first response</small></span>
          <span><strong>34%</strong><small>more qualified leads</small></span>
          <span><strong>100%</strong><small>follow-up visibility</small></span>
          <p>Illustrative outcomes based on the workflow GrowthOS is designed to improve.</p>
        </div>
      </section>

      <section className="faq-section">
        <div className="section-heading compact">
          <span>Questions, answered</span>
          <h2>Ready when your sales process is.</h2>
        </div>
        <div className="faq-list">
          {faqs.map(([question, answer], index) => (
            <article className={openFaq === index ? "open" : ""} key={question}>
              <button onClick={() => setOpenFaq(openFaq === index ? -1 : index)} aria-expanded={openFaq === index}>
                {question}<ChevronDown size={19} />
              </button>
              <div><p>{answer}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="final-cta">
        <div>
          <span><Clock3 size={15} /> 20-minute personalized walkthrough</span>
          <h2>See what your next 100 WhatsApp leads could look like in GrowthOS.</h2>
          <p>Tell us how you sell today. We’ll show you a cleaner, faster path from first reply to paid customer.</p>
        </div>
        <Link href="/contact" className="marketing-primary light">Book your free demo <ArrowRight size={18} /></Link>
      </section>

      <footer className="marketing-footer">
        <div>
          <Link href="/" className="marketing-logo"><span><Command size={19} /></span>GrowthOS</Link>
          <p>The AI growth CRM for teams that sell on WhatsApp.</p>
        </div>
        <div><strong>Product</strong><a href="#features">Features</a><a href="#how-it-works">How it works</a><Link href="/dashboard">Sign in</Link></div>
        <div><strong>Company</strong><Link href="/contact">Contact</Link><a href="mailto:hello@growthos.ai">hello@growthos.ai</a></div>
        <p className="footer-bottom">© {new Date().getFullYear()} GrowthOS. Built for better conversations.</p>
      </footer>
    </main>
  );
}
