export type ProductId = "all" | "flowkreative" | "asksemble" | "vyrical";

export const products = [
  { id: "all" as const, name: "All Products", short: "OS", color: "#171717", bg: "#f1efe9" },
  { id: "flowkreative" as const, name: "FlowKreative", short: "FK", color: "#bd4e2f", bg: "#fff0e9" },
  { id: "asksemble" as const, name: "Asksemble", short: "AS", color: "#4267b2", bg: "#eaf0ff" },
  { id: "vyrical" as const, name: "Vyrical", short: "VY", color: "#7b5aa6", bg: "#f2eaff" },
];

export const summaryByProduct = {
  all: { leads: 286, qualified: 114, signups: 79, paid: 41, revenue: "₹6.84L", roas: "4.2×", trend: "+18.4%" },
  flowkreative: { leads: 126, qualified: 58, signups: 39, paid: 21, revenue: "₹3.16L", roas: "5.1×", trend: "+23.1%" },
  asksemble: { leads: 94, qualified: 34, signups: 27, paid: 13, revenue: "₹2.21L", roas: "3.8×", trend: "+14.8%" },
  vyrical: { leads: 66, qualified: 22, signups: 13, paid: 7, revenue: "₹1.47L", roas: "2.9×", trend: "+8.6%" },
};

export const leads = [
  { id: "LD-2401", name: "Aarav Mehta", company: "Northstar Labs", product: "FlowKreative", stage: "Qualified", score: 92, value: "₹48,000", source: "Google Ads", campaign: "Founder Focus — Search", activity: "WhatsApp · 12m ago", owner: "You", initials: "AM", tone: "peach", next: "Demo today, 4:30 PM", intent: "High", email: "aarav@northstarlabs.in", phone: "+91 98765 42110", location: "Bengaluru, India", requirement: "A distraction-free system for capturing founder decisions and turning them into an execution rhythm.", pain: "Ideas disappear across WhatsApp, Notes, and weekly meetings.", budget: "₹3,000–5,000 / month", timeline: "This month" },
  { id: "LD-2402", name: "Meera Iyer", company: "Common Ground", product: "Asksemble", stage: "Demo / Meeting", score: 86, value: "₹72,000", source: "Meta Ads", campaign: "Ops Leaders — Q3", activity: "Telegram · 28m ago", owner: "You", initials: "MI", tone: "blue", next: "Share security brief", intent: "High", email: "meera@commonground.co", phone: "+91 98401 88272", location: "Chennai, India", requirement: "Knowledge answers for a 45-person operations team.", pain: "Too much repeat work finding internal policy answers.", budget: "₹60,000–80,000 / year", timeline: "Within 30 days" },
  { id: "LD-2403", name: "Kabir Shah", company: "Studio Katha", product: "Vyrical", stage: "Engaged", score: 74, value: "₹24,000", source: "Instagram", campaign: "Lyrics That Move", activity: "Form · 1h ago", owner: "Riya", initials: "KS", tone: "violet", next: "Follow up tomorrow", intent: "Medium", email: "kabir@studiokatha.com", phone: "+91 98211 30298", location: "Mumbai, India", requirement: "Produce lyric videos for three artist releases each month.", pain: "Freelance motion timelines are unpredictable.", budget: "₹1,500–2,500 / month", timeline: "Next quarter" },
  { id: "LD-2404", name: "Sana Qureshi", company: "Fable Foods", product: "FlowKreative", stage: "New Lead", score: 68, value: "₹18,000", source: "Organic", campaign: "—", activity: "Signup · 2h ago", owner: "Unassigned", initials: "SQ", tone: "mint", next: "Qualify today", intent: "Medium", email: "sana@fablefoods.in", phone: "+91 98190 44673", location: "Pune, India", requirement: "A simple workspace to keep launch tasks and decisions together.", pain: "Launch context is fragmented across five tools.", budget: "Not shared", timeline: "Exploring" },
  { id: "LD-2405", name: "Vikram Sethi", company: "Alto Consulting", product: "Asksemble", stage: "Negotiation", score: 88, value: "₹1,20,000", source: "Referral", campaign: "Partner Network", activity: "Email · 3h ago", owner: "You", initials: "VS", tone: "sand", next: "Proposal due Friday", intent: "High", email: "vikram@altoconsulting.in", phone: "+91 99100 19022", location: "Gurugram, India", requirement: "A client-safe research assistant for consulting teams.", pain: "Analysts repeat discovery across engagements.", budget: "₹1,00,000 / year", timeline: "This quarter" },
  { id: "LD-2406", name: "Nisha Rao", company: "Indie Current", product: "Vyrical", stage: "Nurture", score: 51, value: "₹12,000", source: "YouTube", campaign: "Creator Stories", activity: "WhatsApp · yesterday", owner: "Riya", initials: "NR", tone: "pink", next: "Nurture in 12 days", intent: "Low", email: "nisha@indiecurrent.fm", phone: "+91 99008 32721", location: "Hyderabad, India", requirement: "Occasional lyric visualizers for indie releases.", pain: "DIY tools feel templated.", budget: "Under ₹1,000 / month", timeline: "No deadline" },
];

export const campaigns = [
  { name: "Founder Focus — Search", platform: "Google", product: "FlowKreative", status: "Live", spend: "₹42,800", leads: 64, paid: 14, revenue: "₹2,18,400", roas: "5.1×", sync: "8 min ago" },
  { name: "Ops Leaders — Q3", platform: "Meta", product: "Asksemble", status: "Live", spend: "₹37,200", leads: 47, paid: 8, revenue: "₹1,41,600", roas: "3.8×", sync: "14 min ago" },
  { name: "Lyrics That Move", platform: "Meta", product: "Vyrical", status: "Learning", spend: "₹29,100", leads: 38, paid: 5, revenue: "₹84,390", roas: "2.9×", sync: "21 min ago" },
  { name: "Creator Stories", platform: "Google", product: "Vyrical", status: "Draft", spend: "₹0", leads: 0, paid: 0, revenue: "₹0", roas: "—", sync: "Not published" },
];

export const customers = [
  { name: "Ananya Bose", company: "Morrow Studio", product: "FlowKreative", plan: "Pro", revenue: "₹31,920", health: 94, status: "Thriving", activity: "16 min ago", initials: "AB" },
  { name: "Rohan Malhotra", company: "Weave Systems", product: "Asksemble", plan: "Team", revenue: "₹48,000", health: 86, status: "Healthy", activity: "2h ago", initials: "RM" },
  { name: "Tara Menon", company: "Paper Boat Music", product: "Vyrical", plan: "Studio", revenue: "₹17,988", health: 72, status: "Watch", activity: "3 days ago", initials: "TM" },
  { name: "Aditya Kapoor", company: "Kernel Works", product: "FlowKreative", plan: "Pro", revenue: "₹23,940", health: 43, status: "At risk", activity: "11 days ago", initials: "AK" },
];

export const conversations = [
  { lead: "Aarav Mehta", product: "FlowKreative", channel: "WhatsApp", status: "AI qualifying", preview: "Yes, the biggest issue is that decisions get lost…", time: "12m", unread: 2, sentiment: "Positive", initials: "AM" },
  { lead: "Meera Iyer", product: "Asksemble", channel: "Telegram", status: "Needs human", preview: "Can you share how permissions work for teams?", time: "28m", unread: 1, sentiment: "Curious", initials: "MI" },
  { lead: "Kabir Shah", product: "Vyrical", channel: "WhatsApp", status: "AI paused", preview: "Riya: I’ll share three relevant examples.", time: "1h", unread: 0, sentiment: "Positive", initials: "KS" },
  { lead: "Nisha Rao", product: "Vyrical", channel: "WhatsApp", status: "Nurture", preview: "Thanks, I’ll revisit this next month.", time: "1d", unread: 0, sentiment: "Neutral", initials: "NR" },
];

export const tasks = [
  { title: "Run FlowKreative demo with Aarav", type: "Meeting", due: "Today · 4:30 PM", priority: "High", owner: "You", lead: "Aarav Mehta" },
  { title: "Send Asksemble security overview", type: "Follow-up", due: "Today · 6:00 PM", priority: "High", owner: "You", lead: "Meera Iyer" },
  { title: "Review Vyrical sample renders", type: "Review", due: "Tomorrow", priority: "Medium", owner: "Riya", lead: "Kabir Shah" },
  { title: "Prepare Alto annual proposal", type: "Proposal", due: "Friday", priority: "High", owner: "You", lead: "Vikram Sethi" },
];

export const automations = [
  { name: "Route high-intent leads", trigger: "Lead score becomes ≥ 80", action: "Assign owner + create task", runs: 48, status: true, product: "All Products" },
  { name: "Activation rescue", trigger: "Signup not activated in 3 days", action: "Draft a helpful WhatsApp message", runs: 21, status: true, product: "FlowKreative" },
  { name: "Trial ending follow-up", trigger: "Trial ends in 2 days", action: "Notify owner + draft follow-up", runs: 17, status: true, product: "Asksemble" },
  { name: "Post-render CSAT", trigger: "First video rendered", action: "Send approved CSAT survey", runs: 32, status: false, product: "Vyrical" },
];
