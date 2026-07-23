import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Check, Command, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Book a demo",
  description: "Book a personalized GrowthOS walkthrough for your WhatsApp sales workflow.",
};

export default function ContactPage() {
  return (
    <main className="contact-page">
      <header className="contact-nav">
        <Link href="/" className="marketing-logo"><span><Command size={20} /></span>GrowthOS</Link>
        <Link href="/" className="back-link"><ArrowLeft size={15} /> Back to home</Link>
      </header>
      <section className="contact-shell">
        <div className="contact-copy">
          <span className="section-label"><Sparkles size={14} /> Personalized product tour</span>
          <h1>Let’s map your WhatsApp sales flow.</h1>
          <p>Share a little about your team. We’ll tailor the demo around your real lead journey, follow-up gaps and growth goals.</p>
          <div className="contact-benefits">
            <div><span><MessageCircle size={19} /></span><p><strong>See your workflow in GrowthOS</strong><small>From incoming message to qualified deal and customer.</small></p></div>
            <div><span><Sparkles size={19} /></span><p><strong>Find your fastest automation wins</strong><small>Identify repetitive work AI can take off your team.</small></p></div>
            <div><span><ShieldCheck size={19} /></span><p><strong>Get a practical rollout plan</strong><small>No generic pitch—just the best next steps for your setup.</small></p></div>
          </div>
          <div className="contact-assurance">
            <span><Check size={14} /> 20 minutes</span>
            <span><Check size={14} /> No obligation</span>
            <span><Check size={14} /> Built around your use case</span>
          </div>
        </div>
        <ContactForm />
      </section>
      <footer className="contact-footer">© {new Date().getFullYear()} GrowthOS <span>·</span> Your details stay private.</footer>
    </main>
  );
}
