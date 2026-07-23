"use client";

import { ArrowRight, CheckCircle2, LoaderCircle } from "lucide-react";
import { FormEvent, useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError("");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "Something went wrong.");
      setStatus("success");
      form.reset();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="contact-form-card success-card" role="status">
        <span><CheckCircle2 size={28} /></span>
        <h2>You’re on the list.</h2>
        <p>Thanks for sharing your goals. We’ll reach out shortly to arrange a personalized GrowthOS walkthrough.</p>
        <button onClick={() => setStatus("idle")}>Send another request</button>
      </div>
    );
  }

  return (
    <form className="contact-form-card" onSubmit={submit}>
      <div className="form-heading">
        <span>Book your free demo</span>
        <p>We usually respond within one business day.</p>
      </div>
      <div className="form-row">
        <label>Full name<input name="name" type="text" autoComplete="name" placeholder="Your name" required maxLength={80} /></label>
        <label>Work email<input name="email" type="email" autoComplete="email" placeholder="you@company.com" required maxLength={120} /></label>
      </div>
      <div className="form-row">
        <label>WhatsApp number<input name="phone" type="tel" autoComplete="tel" placeholder="+91 98765 43210" required maxLength={24} /></label>
        <label>Team size
          <select name="teamSize" required defaultValue="">
            <option value="" disabled>Select size</option>
            <option>Just me</option><option>2–5 people</option><option>6–15 people</option><option>16–50 people</option><option>51+ people</option>
          </select>
        </label>
      </div>
      <label>What would you most like to improve?
        <select name="goal" required defaultValue="">
          <option value="" disabled>Choose your main goal</option>
          <option>Respond to leads faster</option><option>Automate qualification</option><option>Track sales pipeline</option><option>Improve follow-ups</option><option>Measure campaign revenue</option><option>All of the above</option>
        </select>
      </label>
      <label>Anything we should know? <span className="optional">Optional</span>
        <textarea name="message" rows={3} placeholder="Tell us about your current process or biggest bottleneck…" maxLength={800} />
      </label>
      <label className="consent-field">
        <input name="consent" type="checkbox" value="yes" required />
        <span>I agree to be contacted about my GrowthOS demo request.</span>
      </label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="form-submit" type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? <><LoaderCircle className="spin" size={17} /> Sending request…</> : <>Book my personalized demo <ArrowRight size={17} /></>}
      </button>
      <small className="form-privacy">No spam. Your details are only used to arrange your demo.</small>
    </form>
  );
}
