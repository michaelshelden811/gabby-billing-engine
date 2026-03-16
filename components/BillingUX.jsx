"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ─── Palette & Design System ───────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  :root {
    --bg: #0a0f1a;
    --surface: #111827;
    --card: #1a2235;
    --card-hover: #1e2a3f;
    --border: rgba(99,130,180,0.12);
    --border-strong: rgba(99,130,180,0.22);
    --accent: #4f8ef7;
    --accent-dim: rgba(79,142,247,0.12);
    --accent-glow: rgba(79,142,247,0.25);
    --green: #34d399;
    --green-dim: rgba(52,211,153,0.12);
    --amber: #fbbf24;
    --amber-dim: rgba(251,191,36,0.1);
    --red: #f87171;
    --red-dim: rgba(248,113,113,0.1);
    --purple: #a78bfa;
    --purple-dim: rgba(167,139,250,0.12);
    --text: #e8edf5;
    --text-sec: #7a90b0;
    --text-dim: #4a5a72;
    --radius: 14px;
    --radius-sm: 8px;
    --radius-lg: 20px;
    --shadow: 0 4px 24px rgba(0,0,0,0.4);
    --shadow-lg: 0 8px 40px rgba(0,0,0,0.5);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: var(--bg);
    font-family: 'DM Sans', sans-serif;
    color: var(--text);
    min-height: 100vh;
  }

  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 4px; }

  input, select, textarea, button {
    font-family: 'DM Sans', sans-serif;
  }

  input, select, textarea {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    color: var(--text);
    font-size: 14px;
    padding: 10px 14px;
    width: 100%;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  input:focus, select:focus, textarea:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-dim);
  }

  select option { background: var(--surface); }
  textarea { resize: vertical; line-height: 1.6; }

  button { cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.15s; }

  .btn-primary {
    background: var(--accent);
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: var(--radius-sm);
    font-weight: 600;
  }
  .btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }
  .btn-primary:active { transform: translateY(0); }

  .btn-ghost {
    background: transparent;
    color: var(--text-sec);
    border: 1px solid var(--border);
    padding: 9px 18px;
    border-radius: var(--radius-sm);
  }
  .btn-ghost:hover { background: var(--card-hover); color: var(--text); border-color: var(--border-strong); }

  .btn-sm {
    padding: 6px 14px;
    font-size: 12px;
    border-radius: 6px;
  }

  .btn-danger {
    background: var(--red-dim);
    color: var(--red);
    border: 1px solid rgba(248,113,113,0.2);
    padding: 9px 18px;
    border-radius: var(--radius-sm);
  }
  .btn-danger:hover { background: rgba(248,113,113,0.2); }

  .card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 20px;
  }

  .label {
    font-size: 11px;
    font-weight: 600;
    color: var(--text-dim);
    text-transform: uppercase;
    letter-spacing: 1px;
    display: block;
    margin-bottom: 6px;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    font-size: 11px;
    font-weight: 600;
    padding: 3px 9px;
    border-radius: 20px;
    letter-spacing: 0.3px;
  }

  .badge-green { background: var(--green-dim); color: var(--green); }
  .badge-amber { background: var(--amber-dim); color: var(--amber); }
  .badge-red { background: var(--red-dim); color: var(--red); }
  .badge-blue { background: var(--accent-dim); color: var(--accent); }
  .badge-purple { background: var(--purple-dim); color: var(--purple); }

  .divider {
    height: 1px;
    background: var(--border);
    margin: 16px 0;
  }

  .fg { display: flex; flex-direction: column; margin-bottom: 14px; }
  .fr2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .fr3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }

  .mono { font-family: 'DM Mono', monospace; }

  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  .fade-in { animation: fadeIn 0.25s ease; }

  @keyframes spin { to { transform: rotate(360deg); } }
  .spin { animation: spin 1s linear infinite; }

  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
  .pulse { animation: pulse 1.5s ease infinite; }

  /* ─── Responsive layout ─────────────────────────────────────── */
  .app-shell   { display: flex; min-height: 100vh; overflow-x: hidden; }
  .app-content { flex: 1; overflow: auto; background: var(--bg); min-width: 0; }

  .app-sidebar {
    width: 220px; flex-shrink: 0;
    background: var(--surface); border-right: 1px solid var(--border);
    display: flex; flex-direction: column;
    height: 100vh; position: sticky; top: 0;
  }

  /* Hamburger button — hidden on desktop */
  .mob-nav-header { display: none; }
  .mob-menu-btn   { display: none; }

  /* Mobile dropdown — hidden on desktop */
  .mob-nav-dropdown { display: none; }

  .page-wrap { padding: 28px 32px; margin: 0 auto; }

  .stat-grid    { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px; }
  .dash-grid    { display: grid; grid-template-columns: 1.4fr 1fr; gap: 16px; }
  .gen-grid     { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

  @media (max-width: 768px) {
    html, body { overflow-x: hidden; }

    /* App shell stacks vertically */
    .app-shell { flex-direction: column; }

    /* Desktop sidebar hidden on mobile */
    .app-sidebar { display: none !important; }

    /* Mobile header bar shown */
    .mob-nav-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      height: 56px;
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      position: sticky;
      top: 0;
      z-index: 100;
      flex-shrink: 0;
    }

    .mob-nav-brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .mob-nav-brand-icon {
      width: 30px; height: 30px; border-radius: 8px;
      background: var(--accent-dim); border: 1px solid var(--accent-glow);
      display: flex; align-items: center; justify-content: center; font-size: 15px;
    }

    .mob-nav-brand-text { font-size: 14px; font-weight: 700; }

    /* Hamburger button */
    .mob-menu-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 38px; height: 38px;
      border-radius: 8px;
      background: transparent;
      border: 1px solid var(--border);
      color: var(--text-sec);
      font-size: 18px;
      cursor: pointer;
      transition: background 0.15s;
    }
    .mob-menu-btn:hover { background: var(--card); color: var(--text); }

    /* Dropdown menu */
    .mob-nav-dropdown {
      position: fixed;
      top: 56px;
      left: 0; right: 0;
      z-index: 99;
      background: var(--surface);
      border-bottom: 1px solid var(--border-strong);
      box-shadow: var(--shadow-lg);
      padding: 8px 12px 12px;
      animation: fadeIn 0.15s ease;
    }
    .mob-nav-dropdown.open { display: block; }

    .mob-nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      padding: 12px 14px;
      border-radius: 10px;
      border: none;
      cursor: pointer;
      text-align: left;
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 2px;
      transition: background 0.12s;
    }

    .mob-nav-item:hover { background: var(--card-hover); }

    .mob-nav-item.active {
      background: var(--accent-dim);
      color: var(--accent);
      font-weight: 600;
    }

    .mob-nav-item:not(.active) { color: var(--text-sec); background: transparent; }

    .mob-nav-divider {
      height: 1px;
      background: var(--border);
      margin: 8px 0;
    }

    .mob-nav-signout {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      padding: 12px 14px;
      border-radius: 10px;
      border: none;
      cursor: pointer;
      text-align: left;
      font-size: 14px;
      font-weight: 500;
      color: var(--red);
      background: var(--red-dim);
    }
    .mob-nav-signout:hover { background: rgba(248,113,113,0.18); }

    .mob-nav-user {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px 6px;
    }
    .mob-nav-user-avatar {
      width: 28px; height: 28px; border-radius: 50%;
      background: var(--purple-dim); color: var(--purple);
      display: flex; align-items: center; justify-content: center;
      font-size: 11px; font-weight: 700; flex-shrink: 0;
    }
    .mob-nav-user-name { font-size: 13px; font-weight: 600; }
    .mob-nav-user-role { font-size: 11px; color: var(--text-dim); }

    /* Page padding */
    .page-wrap { padding: 14px 16px; }

    /* Named layout grids collapse */
    .stat-grid { grid-template-columns: 1fr 1fr; }
    .dash-grid { grid-template-columns: 1fr; }
    .gen-grid  { grid-template-columns: 1fr; }

    /* 2-col and 3-col form grids collapse */
    .fr2 { grid-template-columns: 1fr; }
    .fr3 { grid-template-columns: 1fr 1fr; }

    /* auto-fill card grids: force 1 column on small phones */
    .auto-grid { grid-template-columns: 1fr !important; }

    /* Fixed fixed-pixel table grids: allow horizontal scroll instead of overflow */
    .table-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
    .table-scroll .table-inner { min-width: 560px; }

    /* Accept / reject 2-col → stack */
    .action-grid { grid-template-columns: 1fr !important; }

    /* Time-field inline grid → stack */
    .time-grid { grid-template-columns: 1fr !important; }

    /* Peer profile stat tiles: shrink but stay 3-col */
    .peer-stats { gap: 6px !important; }
    .peer-stats > div { padding: 8px 6px !important; }

    /* Page header rows with filter pills wrap on mobile */
    .page-header { flex-wrap: wrap; gap: 10px !important; }
    .page-header-actions { margin-left: 0 !important; flex-wrap: wrap; }

    /* Modal full-width on mobile */
    .modal-box {
      width: 100% !important; max-width: 100% !important;
      margin: 0; border-radius: 0 !important;
      max-height: 100vh; height: 100vh;
    }
  }

  @media (max-width: 480px) {
    .stat-grid { grid-template-columns: 1fr 1fr; }
    .fr3       { grid-template-columns: 1fr; }
    .auto-grid { grid-template-columns: 1fr !important; }
  }
`;

// ─── Utilities ────────────────────────────────────────────────────────────
const fmtDate = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const fmtTime = (d) => new Date(d).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
const uid = () => Math.random().toString(36).slice(2, 9);
const initials = (first, last) => `${first?.[0] || ""}${last?.[0] || ""}`.toUpperCase();
const displayName = (first, last) => `${first || ""} ${last?.[0] || ""}.`.trim();

const SERVICE_TYPES = [
  "Individual Peer Support",
  "Community Support",
  "Recovery Meeting",
  "Shared Meal",
  "House Meeting",
  "Transportation Support",
  "Service Work / House Activity",
];

const DURATIONS = [
  { label: "15 min", mins: 15 },
  { label: "30 min", mins: 30 },
  { label: "45 min", mins: 45 },
  { label: "1 hour", mins: 60 },
  { label: "1h 30m", mins: 90 },
  { label: "2 hours", mins: 120 },
  { label: "2h 30m", mins: 150 },
  { label: "3 hours", mins: 180 },
];

const BARRIERS = [
  "Transportation Access",
  "Employment & Financial Stability",
  "Housing Stability",
  "Access to Services & Benefits",
  "Legal System Obligations",
  "Recovery Engagement",
  "Independent Living & Daily Living Skills",
  "Medication Access & Adherence",
];

// ─── LocalStorage helpers ─────────────────────────────────────────────────
const LS = {
  get: (k, def) => {
    try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch { return def; }
  },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

// ─── Structured Data Stores ───────────────────────────────────────────────
// These stores manage each data domain independently via localStorage.
// Each store exposes: get, save, add, delete (and helpers where applicable).
// Mirrors: /stores/profilesStore.ts, housesStore.ts, clientsStore.ts, servicesStore.ts

// ── Profiles Store ── key: "profiles" ─────────────────────────────────────
// Model: { id: number, name: string, role: string }
const ProfilesStore = {
  get: ()                               => { try { const r = localStorage.getItem("profiles"); return r ? JSON.parse(r) : []; } catch { return []; } },
  save: (profiles)                      => { try { localStorage.setItem("profiles", JSON.stringify(profiles)); } catch {} },
  add: (name, role)                     => { const cur = ProfilesStore.get(); const id = cur.length > 0 ? Math.max(...cur.map((p) => p.id)) + 1 : 1; const updated = [...cur, { id, name: name.trim(), role }]; ProfilesStore.save(updated); return updated; },
  delete: (id)                          => { const updated = ProfilesStore.get().filter((p) => p.id !== id); ProfilesStore.save(updated); return updated; },
  getById: (id)                         => ProfilesStore.get().find((p) => p.id === id),
};

// ── Houses Store ── key: "pb_houses" ──────────────────────────────────────
// Model: { id: string, name: string, managerId: string }
const HousesStore = {
  get: ()                               => { try { const r = localStorage.getItem("pb_houses"); return r ? JSON.parse(r) : []; } catch { return []; } },
  save: (houses)                        => { try { localStorage.setItem("pb_houses", JSON.stringify(houses)); } catch {} },
  add: (name, managerId = "")           => { const cur = HousesStore.get(); const id = Math.random().toString(36).slice(2, 9); const updated = [...cur, { id, name: name.trim(), managerId }]; HousesStore.save(updated); return updated; },
  delete: (id)                          => { const updated = HousesStore.get().filter((h) => h.id !== id); HousesStore.save(updated); return updated; },
  getById: (id)                         => HousesStore.get().find((h) => h.id === id),
  update: (id, changes)                 => { const updated = HousesStore.get().map((h) => h.id === id ? { ...h, ...changes } : h); HousesStore.save(updated); return updated; },
};

// ── Clients Store ── key: "pb_clients" ────────────────────────────────────
// Model: { id: string, name: string, houseId: string }
const ClientsStore = {
  get: ()                               => { try { const r = localStorage.getItem("pb_clients"); return r ? JSON.parse(r) : []; } catch { return []; } },
  save: (clients)                       => { try { localStorage.setItem("pb_clients", JSON.stringify(clients)); } catch {} },
  add: (name, houseId = "")             => { const cur = ClientsStore.get(); const id = Math.random().toString(36).slice(2, 9); const updated = [...cur, { id, name: name.trim(), houseId }]; ClientsStore.save(updated); return updated; },
  delete: (id)                          => { const updated = ClientsStore.get().filter((c) => c.id !== id); ClientsStore.save(updated); return updated; },
  getById: (id)                         => ClientsStore.get().find((c) => c.id === id),
  getByHouse: (houseId)                 => ClientsStore.get().filter((c) => c.houseId === houseId),
  update: (id, changes)                 => { const updated = ClientsStore.get().map((c) => c.id === id ? { ...c, ...changes } : c); ClientsStore.save(updated); return updated; },
};

// ── Services Store ── key: "pb_ledger" ────────────────────────────────────
// Model: { id: string, peerId: string, clientId: string, houseId: string, duration: number, note: string, date: string }
const ServicesStore = {
  get: ()                               => { try { const r = localStorage.getItem("pb_ledger"); return r ? JSON.parse(r) : []; } catch { return []; } },
  save: (services)                      => { try { localStorage.setItem("pb_ledger", JSON.stringify(services)); } catch {} },
  add: (peerId, clientId, houseId, duration, note, date) => { const cur = ServicesStore.get(); const id = Math.random().toString(36).slice(2, 9); const updated = [...cur, { id, peerId, clientId, houseId, duration, note: (note || "").trim(), date: date ?? new Date().toISOString() }]; ServicesStore.save(updated); return updated; },
  delete: (id)                          => { const updated = ServicesStore.get().filter((s) => s.id !== id); ServicesStore.save(updated); return updated; },
  getById: (id)                         => ServicesStore.get().find((s) => s.id === id),
  getByClient: (clientId)               => ServicesStore.get().filter((s) => s.clientId === clientId),
  getByPeer: (peerId)                   => ServicesStore.get().filter((s) => s.peerId === peerId),
  getByHouse: (houseId)                 => ServicesStore.get().filter((s) => s.houseId === houseId),
  update: (id, changes)                 => { const updated = ServicesStore.get().map((s) => s.id === id ? { ...s, ...changes } : s); ServicesStore.save(updated); return updated; },
};
// ─────────────────────────────────────────────────────────────────────────

// ─── House color palette (cycled on creation) ─────────────────────────────
const HOUSE_COLORS = ["#4f8ef7","#34d399","#a78bfa","#fbbf24","#f87171","#38bdf8","#fb923c","#a3e635"];
const pickColor = (existingHouses) => HOUSE_COLORS[existingHouses.length % HOUSE_COLORS.length];

// ─── Duration → word count target ─────────────────────────────────────────
function wordCountTarget(mins) {
  if (mins <= 60)  return { min: 120, max: 150 };
  if (mins <= 120) return { min: 150, max: 190 };
  return                  { min: 180, max: 220 };
}

// ─── AI-Powered SOAIP Generator ───────────────────────────────────────────
async function buildSOAIPWithAI(houseName, serviceType, duration, mins, rawNotes, barriers) {
  const barrierList = barriers?.length ? barriers.join(", ") : "none specified";
  const wc = wordCountTarget(mins);

  const prompt = `You are a peer support documentation specialist writing billing-grade SOAIP notes for a community recovery program.

SESSION DETAILS:
- House: ${houseName}
- Service Type: ${serviceType}
- Duration: ${duration}
- Barriers Addressed: ${barrierList}
- Staff Notes: ${rawNotes?.trim() || "(no notes provided — construct a specific, reasonable narrative from the service type, duration, and barriers listed above)"}

WORD COUNT REQUIREMENT — STRICTLY ENFORCED:
The combined total word count across all five SOAIP sections must be between ${wc.min} and ${wc.max} words.
Count every word in all five sections combined. Do not exceed ${wc.max} words. Do not fall below ${wc.min} words.
Distribute length proportionally: longer sessions require more detail in each section.

CONTENT REQUIREMENTS — every note must include all four of the following:
1. A specific description of the activity or interaction that took place during this session
2. Which barrier(s) were addressed and how they directly connected to this session
3. What the peer support specialist actually did — specific observable actions, not general statements
4. How the client participated or responded during this specific session

SCOPE REQUIREMENT — PEER SUPPORT ONLY:
This documentation is for peer support services — NOT therapy, counseling, or clinical treatment.
Every section must stay clearly within peer support scope.

BANNED LANGUAGE — do not use any of the following under any circumstance:
- Clinical / therapy terms: "process feelings", "create space", "processing", "present moment awareness", "clinical insight", "emotional regulation", "therapeutic", "treatment", "interventions" (as a concept), "counseling", "therapeutic relationship", "trauma-informed", "coping skills", "psychoeducation", "mental health treatment"
- Generic filler: "recovery focused conversation", "strength based engagement", "continued engagement in recovery", "recovery oriented motivation", "consistent support", "recovery-oriented", "strength-based", "peer support services", "ongoing support", "recovery lifestyle"
- Vague action phrases: "provided support", "created space for processing", "facilitated emotional exploration", "offered a safe space", "held space"

REQUIRED LANGUAGE — use peer support language grounded in observable action:
- Intervention: encouraged participation in activity, shared lived experience related to recovery, facilitated group interaction, reinforced engagement in recovery environment, walked alongside client, helped client problem-solve, accompanied client, reviewed options with client, connected client to resources
- Plan: encourage continued participation in house activities, reinforce involvement in recovery community, support continued engagement with peers, follow up on [specific item from today's session]

SECTION DEFINITIONS — follow these precisely:

SUBJECTIVE — What the client communicated, expressed, or shared during this session. Reflect the client's perspective, statements, or observable mood. No clinical interpretation.

OBJECTIVE — The observable facts only: what specific activity occurred, how the client physically participated, what was visibly completed or attempted. No interpretation.

ASSESSMENT — Explain how this session addressed the identified barrier(s). Connect the activity directly to the barrier and to the client's recovery stability. No therapy language. Stay within peer support scope.

INTERVENTION — Describe exactly what the peer support specialist did using observable action verbs: encouraged, facilitated, shared, walked through, helped, accompanied, modeled, connected, reinforced, reviewed. Be specific — reference the actual activity or situation.

PLAN — Describe the next steps that encourage continued engagement. Connect directly to what happened today. Use peer-appropriate language: encourage, reinforce, support, follow up on. Not a clinical treatment plan — a peer continuity statement.

Refer to the individual ONLY as "client" — never use names, pronouns, or identifying information.
Respond with ONLY a valid JSON object. No markdown, no backticks, no explanation:
{"subjective":"...","objective":"...","assessment":"...","intervention":"...","plan":"..."}`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1400,
      system: "You are a peer support documentation specialist — not a therapist, counselor, or clinician. You write audit-defensible SOAIP billing notes for community-based peer support programs. You always stay within peer support scope: observable actions, lived experience, recovery engagement, and barrier removal. You never use clinical, therapeutic, or counseling language. You always follow word count requirements exactly, always refer to individuals as 'client' only, and respond only with valid JSON.",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) throw new Error(`API error: ${response.status}`);
  const data = await response.json();
  const text = data.content?.find((b) => b.type === "text")?.text || "";
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

// ─── Avatar Component ──────────────────────────────────────────────────────
function Avatar({ photo, first, last, size = 48, color = "#4f8ef7" }) {
  const style = {
    width: size, height: size, borderRadius: "50%", flexShrink: 0,
    overflow: "hidden", display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: size * 0.35, fontWeight: 700,
    background: color + "22", color, border: `2px solid ${color}33`,
    letterSpacing: "0.5px",
  };
  if (photo) return <img src={photo} alt="" style={{ ...style, objectFit: "cover", background: "none", border: `2px solid ${color}33` }} />;
  return <div style={style}>{initials(first, last)}</div>;
}

// ─── Modal ─────────────────────────────────────────────────────────────────
function Modal({ open, onClose, title, children, width = 560 }) {
  useEffect(() => {
    const handle = (e) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
      zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="fade-in modal-box" style={{
        background: "var(--surface)", border: "1px solid var(--border-strong)",
        borderRadius: "var(--radius-lg)", width, maxWidth: "100%", maxHeight: "90vh",
        overflow: "auto", boxShadow: "var(--shadow-lg)",
      }}>
        <div style={{ padding: "20px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 17, fontWeight: 600 }}>{title}</div>
          <button onClick={onClose} style={{
            background: "none", border: "none", color: "var(--text-sec)", fontSize: 20,
            lineHeight: 1, padding: "4px 8px", borderRadius: 6,
          }}>×</button>
        </div>
        <div style={{ padding: "16px 24px 24px" }}>{children}</div>
      </div>
    </div>
  );
}

// ─── Stat Card ─────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color = "var(--accent)", icon }) {
  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span className="label">{label}</span>
        {icon && <span style={{ fontSize: 18, opacity: 0.5 }}>{icon}</span>}
      </div>
      <div style={{ fontSize: 32, fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: "var(--text-dim)" }}>{sub}</div>}
    </div>
  );
}

// ─── Login Screen ──────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  const USERS = [
    { email: "admin@barbell.org",    password: "barbell2024", name: "Admin User",    role: "Admin" },
    { email: "peer@barbell.org",     password: "barbell2024", name: "Jordan Rivera", role: "Peer" },
    { email: "director@barbell.org", password: "barbell2024", name: "Sam Torres",    role: "Peer" },
  ];

  const handleLogin = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const user = USERS.find((u) => u.email === email.trim().toLowerCase() && u.password === pass);
    if (user) onLogin(user);
    else setErr("Invalid credentials. Please try again.");
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "radial-gradient(ellipse at 30% 40%, rgba(79,142,247,0.06) 0%, transparent 60%)",
      padding: 20,
    }}>
      <div style={{ width: 400, maxWidth: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, background: "var(--accent-dim)",
            border: "1px solid var(--accent-glow)", display: "flex", alignItems: "center",
            justifyContent: "center", margin: "0 auto 16px", fontSize: 24,
          }}>🏋️</div>
          <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>PeerBill</div>
          <div style={{ fontSize: 13, color: "var(--text-sec)" }}>Barbell Saves Project · Staff Portal</div>
        </div>
        <div className="card" style={{ padding: 28 }}>
          <form onSubmit={handleLogin}>
            <div className="fg">
              <label className="label">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@barbell.org" type="email"
                onKeyDown={(e) => e.key === "Enter" && handleLogin(e)} />
            </div>
            <div className="fg">
              <label className="label">Password</label>
              <input value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Password" type="password"
                onKeyDown={(e) => e.key === "Enter" && handleLogin(e)} />
            </div>
            {err && <div style={{ fontSize: 13, color: "var(--red)", marginBottom: 12 }}>{err}</div>}
            <button type="submit" className="btn-primary" style={{ width: "100%", padding: 12 }}
              onClick={handleLogin}>Sign In</button>
          </form>
          <div style={{ marginTop: 16, textAlign: "center" }}>
            <button
              onClick={() => window.location.href = "/create-profile"}
              style={{
                background: "none", border: "none", fontSize: 13,
                color: "var(--accent)", cursor: "pointer", opacity: 0.85,
                textDecoration: "underline", textUnderlineOffset: 3, padding: 0,
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
              onMouseLeave={(e) => e.currentTarget.style.opacity = "0.85"}
            >Create a Profile</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Shared nav items helper ───────────────────────────────────────────────
function getNav(role) {
  if (role === "Admin") return [
    { id: "dashboard",       label: "Dashboard",        icon: "◈" },
    { id: "houses",          label: "Houses",           icon: "⬡" },
    { id: "housemanagement", label: "House Management", icon: "⊞" },
    { id: "clients",         label: "Clients",          icon: "○" },
    { id: "peers",           label: "Peers",            icon: "◉" },
    { id: "generate",        label: "Generate Note",    icon: "✦" },
    { id: "ledger",          label: "Ledger",           icon: "≡" },
    { id: "profiles",        label: "Profiles",         icon: "⊙" },
  ];
  return [
    { id: "generate",   label: "Generate Note", icon: "✦" },
    { id: "myledger",   label: "My Ledger",     icon: "≡" },
    { id: "myreports",  label: "My Reports",    icon: "◧" },
    { id: "myprofile",  label: "My Profile",    icon: "◉" },
  ];
}

// ─── Desktop Sidebar (hidden on mobile via CSS) ────────────────────────────
function DesktopSidebar({ page, setPage, user, onLogout }) {
  const nav = getNav(user.role);
  return (
    <div className="app-sidebar">
      <div className="sidebar-brand" style={{ padding: "22px 20px 18px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10, background: "var(--accent-dim)",
            border: "1px solid var(--accent-glow)", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 16, flexShrink: 0,
          }}>🏋️</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>PeerBill</div>
            <div style={{ fontSize: 10, color: "var(--text-dim)", letterSpacing: 1 }}>BARBELL SAVES</div>
          </div>
        </div>
      </div>
      <nav style={{ flex: 1, padding: "12px 10px", overflow: "auto" }}>
        {nav.map((item) => (
          <button key={item.id} onClick={() => setPage(item.id)} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
            borderRadius: 10, border: "none", cursor: "pointer", marginBottom: 2, textAlign: "left",
            background: page === item.id ? "var(--accent-dim)" : "transparent",
            color: page === item.id ? "var(--accent)" : "var(--text-sec)",
            fontWeight: page === item.id ? 600 : 400,
            borderLeft: page === item.id ? "2px solid var(--accent)" : "2px solid transparent",
          }}>
            <span style={{ fontSize: 14, opacity: 0.8 }}>{item.icon}</span>
            <span style={{ fontSize: 13 }}>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-user" style={{ padding: "14px 16px", borderTop: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: "50%", background: "var(--purple-dim)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 700, color: "var(--purple)", flexShrink: 0,
          }}>{user.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</div>
            <div style={{ fontSize: 10, color: "var(--text-dim)" }}>{user.role}</div>
          </div>
        </div>
        <button className="btn-ghost btn-sm" style={{ width: "100%", justifyContent: "center" }} onClick={onLogout}>Sign Out</button>
      </div>
    </div>
  );
}

// ─── Mobile Nav — hamburger header + dropdown (visible only on mobile) ─────
function MobileNav({ page, setPage, user, onLogout }) {
  const [open, setOpen] = useState(false);
  const nav = getNav(user.role);

  const handleNavClick = (id) => {
    setPage(id);
    setOpen(false);
  };

  return (
    <>
      {/* Header bar */}
      <div className="mob-nav-header">
        <div className="mob-nav-brand">
          <div className="mob-nav-brand-icon">🏋️</div>
          <span className="mob-nav-brand-text">PeerBill</span>
        </div>
        <button
          className="mob-menu-btn"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="mob-nav-dropdown open">
          {/* User info */}
          <div className="mob-nav-user">
            <div className="mob-nav-user-avatar">
              {user.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
            </div>
            <div>
              <div className="mob-nav-user-name">{user.name}</div>
              <div className="mob-nav-user-role">{user.role}</div>
            </div>
          </div>
          <div className="mob-nav-divider" />

          {/* Nav items */}
          {nav.map((item) => (
            <button
              key={item.id}
              className={`mob-nav-item${page === item.id ? " active" : ""}`}
              onClick={() => handleNavClick(item.id)}
            >
              <span style={{ fontSize: 16, opacity: 0.8, width: 20, textAlign: "center" }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}

          <div className="mob-nav-divider" />

          {/* Sign Out */}
          <button className="mob-nav-signout" onClick={() => { setOpen(false); onLogout(); }}>
            <span style={{ fontSize: 15 }}>⎋</span>
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </>
  );
}

// ─── Dashboard ─────────────────────────────────────────────────────────────
function Dashboard({ houses, clients, ledger, setPage, setGenerateTarget }) {
  const totalHours = ledger.reduce((s, e) => s + e.mins / 60, 0);
  const thisWeek = ledger.filter((e) => {
    const d = new Date(e.date); const now = new Date();
    return (now - d) < 7 * 24 * 60 * 60 * 1000;
  });
  const recent = [...ledger].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);

  return (
    <div className="fade-in page-wrap" style={{ maxWidth: 1100 }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Dashboard</div>
        <div style={{ color: "var(--text-sec)", fontSize: 14 }}>Barbell Saves Project · Peer Support Operations</div>
      </div>
      <div className="stat-grid">
        <StatCard label="Houses" value={houses.length} icon="⬡" color="var(--accent)" />
        <StatCard label="Active Clients" value={clients.filter((c) => c.status === "Active").length} sub={`${clients.length} total enrolled`} icon="○" color="var(--green)" />
        <StatCard label="Total Hours" value={totalHours.toFixed(1)} sub="all time" icon="◷" color="var(--purple)" />
        <StatCard label="This Week" value={`${thisWeek.reduce((s, e) => s + e.mins / 60, 0).toFixed(1)}h`} sub={`${thisWeek.length} services`} icon="📅" color="var(--amber)" />
      </div>

      <div className="dash-grid">
        <div className="card">
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16, color: "var(--text-sec)" }}>Recent Services</div>
          {recent.length === 0 && <div style={{ color: "var(--text-dim)", fontSize: 13, padding: "20px 0", textAlign: "center" }}>No services recorded yet. Generate your first note.</div>}
          {recent.map((entry) => {
            const client = clients.find((c) => c.id === entry.clientId);
            const house = houses.find((h) => h.id === entry.houseId);
            return (
              <div key={entry.id} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "10px 0",
                borderBottom: "1px solid var(--border)",
              }}>
                <Avatar first={client?.firstName} last={client?.lastName} photo={client?.photo} color={house?.color} size={38} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>
                    {client ? displayName(client.firstName, client.lastName) : "Unknown"}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-sec)" }}>{entry.serviceType} · {entry.duration}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 11, color: "var(--text-dim)" }}>{fmtDate(entry.date)}</div>
                  <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 1 }}>{house?.name}</div>
                </div>
              </div>
            );
          })}
          {recent.length > 0 && (
            <button className="btn-ghost btn-sm" style={{ marginTop: 12, width: "100%" }} onClick={() => setPage("ledger")}>
              View Full Ledger →
            </button>
          )}
        </div>

        <div className="card">
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16, color: "var(--text-sec)" }}>Houses Overview</div>
          {houses.map((house) => {
            const hClients = clients.filter((c) => c.houseId === house.id);
            const hHours = ledger.filter((e) => e.houseId === house.id).reduce((s, e) => s + e.mins / 60, 0);
            return (
              <div key={house.id} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "10px 0",
                borderBottom: "1px solid var(--border)", cursor: "pointer",
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, background: house.color + "22",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, flexShrink: 0,
                }}>⬡</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{house.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text-sec)" }}>{hClients.length} clients</div>
                </div>
                <div style={{ fontSize: 12, color: "var(--text-dim)", fontFamily: "DM Mono, monospace" }}>
                  {hHours.toFixed(1)}h
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Houses Page ───────────────────────────────────────────────────────────
function HousesPage({ houses, clients, ledger, setPage, setGenerateTarget }) {
  const [selected, setSelected]         = useState(null);
  const [showHouseReport, setShowHouseReport] = useState(false);

  if (selected) {
    const house = houses.find((h) => h.id === selected);
    const hClients = clients.filter((c) => c.houseId === selected);
    const hHours = ledger.filter((e) => e.houseId === selected).reduce((s, e) => s + e.mins / 60, 0);
    return (
      <div className="fade-in page-wrap" style={{ maxWidth: 900 }}>
        <div className="page-header" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
          <button className="btn-ghost btn-sm" onClick={() => setSelected(null)}>← Houses</button>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{house.name} House</div>
          <span className="badge badge-blue">{hClients.length} clients</span>
          <div className="page-header-actions" style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
            <span className="badge badge-purple">{hHours.toFixed(1)} hrs logged</span>
            <button className="btn-ghost btn-sm" onClick={() => setShowHouseReport(true)}>📊 Generate Client Monthly Reports</button>
          </div>
        </div>
        <div className="auto-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
          {hClients.length === 0 && (
            <div className="card" style={{ gridColumn: "1 / -1", textAlign: "center", color: "var(--text-dim)", padding: 32 }}>
              No clients assigned to this house yet.
            </div>
          )}
          {hClients.map((client) => {
            const cHours = ledger.filter((e) => e.clientId === client.id).reduce((s, e) => s + e.mins / 60, 0);
            return (
              <div key={client.id} className="card" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Avatar first={client.firstName} last={client.lastName} photo={client.photo} color={house.color} size={52} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{displayName(client.firstName, client.lastName)}</div>
                    <span className={`badge badge-${client.status === "Active" ? "green" : "amber"}`}>{client.status}</span>
                  </div>
                </div>
                <div className="divider" style={{ margin: "0" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 12, color: "var(--text-dim)" }}>Total hours</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: house.color, fontFamily: "DM Mono, monospace" }}>{cHours.toFixed(1)}h</div>
                </div>
                <button className="btn-primary btn-sm" style={{ width: "100%" }} onClick={() => {
                  setGenerateTarget({ houseId: selected, clientId: client.id });
                  setPage("generate");
                }}>Generate Note</button>
              </div>
            );
          })}
        </div>
        <HouseReportModal open={showHouseReport} onClose={() => setShowHouseReport(false)}
          house={house} clients={clients} ledger={ledger} />
      </div>
    );
  }

  return (
    <div className="fade-in page-wrap" style={{ maxWidth: 900 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Houses</div>
        <div style={{ color: "var(--text-sec)", fontSize: 14 }}>Recovery residences managed by Barbell Saves</div>
      </div>
      <div className="auto-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
        {houses.map((house) => {
          const hClients = clients.filter((c) => c.houseId === house.id);
          const hHours = ledger.filter((e) => e.houseId === house.id).reduce((s, e) => s + e.mins / 60, 0);
          const activeCount = hClients.filter((c) => c.status === "Active").length;
          return (
            <div key={house.id} className="card" style={{
              cursor: "pointer", transition: "all 0.2s", borderColor: "transparent",
              borderTop: `3px solid ${house.color}`,
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--card-hover)"; e.currentTarget.style.borderColor = house.color; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "var(--card)"; e.currentTarget.style.borderColor = "transparent"; }}
              onClick={() => setSelected(house.id)}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12, background: house.color + "22",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, marginBottom: 14,
              }}>⬡</div>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>{house.name}</div>
              <div style={{ fontSize: 13, color: "var(--text-sec)", marginBottom: 14 }}>{activeCount} active clients</div>
              <div className="divider" style={{ margin: "12px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "var(--text-dim)" }}>Total logged</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: house.color, fontFamily: "DM Mono, monospace" }}>{hHours.toFixed(1)}h</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Profile Action Menu ───────────────────────────────────────────────────
function ProfileMenu({ onEdit, onArchive, isArchived }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen((v) => !v)} className="btn-ghost btn-sm" style={{ padding: "6px 10px" }}>
        ⋯ Actions
      </button>
      {open && (
        <div className="fade-in" style={{
          position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 200,
          background: "var(--surface)", border: "1px solid var(--border-strong)",
          borderRadius: "var(--radius-sm)", boxShadow: "var(--shadow)", minWidth: 170, overflow: "hidden",
        }}>
          <button onClick={() => { onEdit(); setOpen(false); }} style={{
            width: "100%", padding: "10px 16px", background: "none", border: "none",
            color: "var(--text)", fontSize: 13, textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
          }}
            onMouseEnter={(e) => e.currentTarget.style.background = "var(--card-hover)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "none"}
          >✏ Edit Profile</button>
          <div style={{ height: 1, background: "var(--border)" }} />
          <button onClick={() => { onArchive(isArchived ? "Active" : "Archived"); setOpen(false); }} style={{
            width: "100%", padding: "10px 16px", background: "none", border: "none",
            color: isArchived ? "var(--green)" : "var(--amber)", fontSize: 13, textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
          }}
            onMouseEnter={(e) => e.currentTarget.style.background = "var(--card-hover)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "none"}
          >{isArchived ? "✓ Restore Profile" : "⊘ Archive Profile"}</button>
        </div>
      )}
    </div>
  );
}

// ─── Clients Page ──────────────────────────────────────────────────────────
function ClientsPage({ houses, clients, setClients, ledger, setPage, setGenerateTarget, user }) {
  const isAdmin = user?.role === "Admin";
  const [showAdd, setShowAdd]           = useState(false);
  const [editClientId, setEditClientId] = useState(null);
  const [filter, setFilter]             = useState("all");
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [form, setForm] = useState({
    firstName: "", lastName: "", houseId: houses[0]?.id || "",
    startDate: new Date().toISOString().split("T")[0], status: "Active", photo: "", phone: "", email: "",
  });
  const photoRef = useRef();

  const updateClients = (updated) => { setClients(updated); LS.set("pb_clients", updated); };

  const archiveClient = (id, newStatus) => {
    updateClients(clients.map((c) => c.id === id ? { ...c, status: newStatus } : c));
    if (selectedClientId === id) setSelectedClientId(null);
  };

  const openEdit = (client) => {
    setForm({
      firstName: client.firstName, lastName: client.lastName,
      houseId: client.houseId || houses[0]?.id || "",
      startDate: client.startDate || new Date().toISOString().split("T")[0],
      status: client.status || "Active",
      photo: client.photo || "",
      phone: client.phone || "",
      email: client.email || "",
    });
    setEditClientId(client.id);
    setShowAdd(true);
  };

  const saveClient = () => {
    if (!form.firstName || !form.lastName) return;
    if (editClientId) {
      updateClients(clients.map((c) => c.id === editClientId ? { ...c, ...form } : c));
    } else {
      updateClients([...clients, { id: uid(), ...form, createdAt: new Date().toISOString() }]);
    }
    setForm({ firstName: "", lastName: "", houseId: houses[0]?.id || "", startDate: new Date().toISOString().split("T")[0], status: "Active", photo: "", phone: "", email: "" });
    setShowAdd(false); setEditClientId(null);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm((f) => ({ ...f, photo: ev.target.result }));
    reader.readAsDataURL(file);
  };

  // Show profile if one is selected
  if (selectedClientId) {
    const client = clients.find((c) => c.id === selectedClientId);
    const house  = houses.find((h) => h.id === client?.houseId);
    if (client) return (
      <ClientProfile
        client={client} house={house} ledger={ledger}
        onBack={() => setSelectedClientId(null)}
        setPage={setPage} setGenerateTarget={setGenerateTarget}
        isAdmin={isAdmin}
        onEdit={() => { openEdit(client); setSelectedClientId(null); }}
        onArchive={(status) => archiveClient(client.id, status)}
      />
    );
  }

  const filterOptions = ["all", "Active", "Discharged", "Archived"];
  const filtered = clients.filter((c) =>
    filter === "all" ? c.status !== "Archived" : c.status === filter
  );

  return (
    <div className="fade-in page-wrap" style={{ maxWidth: 1100 }}>
      <div className="page-header" style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Clients</div>
          <div style={{ color: "var(--text-sec)", fontSize: 14 }}>{clients.filter((c) => c.status !== "Archived").length} enrolled</div>
        </div>
        <div className="page-header-actions" style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
          {filterOptions.map((f) => (
            <button key={f} onClick={() => setFilter(f)} style={{
              background: filter === f ? "var(--accent-dim)" : "transparent",
              color: filter === f ? "var(--accent)" : "var(--text-sec)",
              border: `1px solid ${filter === f ? "var(--accent-glow)" : "var(--border)"}`,
              borderRadius: 20, padding: "5px 14px", fontSize: 12, fontWeight: 500, cursor: "pointer",
            }}>{f === "all" ? "Active" : f}</button>
          ))}
          {isAdmin && <button className="btn-primary btn-sm" onClick={() => { setEditClientId(null); setForm({ firstName: "", lastName: "", houseId: houses[0]?.id || "", startDate: new Date().toISOString().split("T")[0], status: "Active", photo: "", phone: "", email: "" }); setShowAdd(true); }}>+ Add Client</button>}
        </div>
      </div>

      <div className="auto-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
        {filtered.length === 0 && (
          <div className="card" style={{ gridColumn: "1/-1", textAlign: "center", color: "var(--text-dim)", padding: 40 }}>
            {filter === "Archived" ? "No archived clients." : "No clients found."}
          </div>
        )}
        {filtered.map((client) => {
          const house      = houses.find((h) => h.id === client.houseId);
          const cHours     = ledger.filter((e) => e.clientId === client.id).reduce((s, e) => s + e.mins / 60, 0);
          const lastService = ledger.filter((e) => e.clientId === client.id).sort((a, b) => new Date(b.date) - new Date(a.date))[0];
          const isArchived = client.status === "Archived";
          return (
            <div key={client.id} className="card" style={{ display: "flex", flexDirection: "column", gap: 12, opacity: isArchived ? 0.65 : 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Avatar first={client.firstName} last={client.lastName} photo={client.photo} color={house?.color || "#4f8ef7"} size={52} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 3 }}>{displayName(client.firstName, client.lastName)}</div>
                  <div style={{ fontSize: 11, color: "var(--text-sec)", marginBottom: 4 }}>{house?.name || "—"} house</div>
                  <span className={`badge badge-${client.status === "Active" ? "green" : client.status === "Archived" ? "red" : "amber"}`}>{client.status}</span>
                </div>
                {isAdmin && (
                  <ProfileMenu
                    onEdit={() => openEdit(client)}
                    onArchive={(s) => archiveClient(client.id, s)}
                    isArchived={isArchived}
                  />
                )}
              </div>
              <div className="divider" style={{ margin: 0 }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 10, color: "var(--text-dim)", marginBottom: 2 }}>TOTAL HOURS</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: house?.color || "var(--accent)", fontFamily: "DM Mono, monospace" }}>{cHours.toFixed(1)}h</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 10, color: "var(--text-dim)", marginBottom: 2 }}>LAST SERVICE</div>
                  <div style={{ fontSize: 12, color: "var(--text-sec)" }}>{lastService ? fmtDate(lastService.date) : "None"}</div>
                </div>
              </div>
              {!isArchived && (
                <button className="btn-primary btn-sm" style={{ width: "100%" }} onClick={() => {
                  setGenerateTarget({ houseId: client.houseId, clientId: client.id });
                  setPage("generate");
                }}>Generate Note</button>
              )}
              <button className="btn-ghost btn-sm" style={{ width: "100%" }} onClick={() => setSelectedClientId(client.id)}>
                View Profile →
              </button>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Client Modal */}
      <Modal open={showAdd} onClose={() => { setShowAdd(false); setEditClientId(null); }} title={editClientId ? "Edit Client Profile" : "Add New Client"}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <div style={{ position: "relative" }}>
            <Avatar first={form.firstName} last={form.lastName} photo={form.photo} color="#4f8ef7" size={64} />
            <button onClick={() => photoRef.current?.click()} style={{
              position: "absolute", bottom: -4, right: -4, width: 22, height: 22,
              borderRadius: "50%", background: "var(--accent)", border: "2px solid var(--surface)",
              fontSize: 11, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
            }}>+</button>
          </div>
          <div style={{ color: "var(--text-sec)", fontSize: 13 }}>Upload a photo or one will be<br />generated from their initials.</div>
          <input ref={photoRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhotoUpload} />
        </div>
        <div className="fr2">
          <div className="fg"><label className="label">First Name *</label><input value={form.firstName} onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))} placeholder="First name" /></div>
          <div className="fg"><label className="label">Last Name *</label><input value={form.lastName} onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))} placeholder="Last name" /></div>
        </div>
        <div className="fr2">
          <div className="fg"><label className="label">Phone</label><input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="(555) 000-0000" /></div>
          <div className="fg"><label className="label">Email</label><input value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="email@example.com" /></div>
        </div>
        <div className="fg">
          <label className="label">Assigned House</label>
          <select value={form.houseId} onChange={(e) => setForm((f) => ({ ...f, houseId: e.target.value }))}>
            <option value="">No house assigned</option>
            {houses.filter((h) => h.status !== "Inactive").map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
          </select>
        </div>
        <div className="fr2">
          <div className="fg"><label className="label">Program Start Date</label><input type="date" value={form.startDate} onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))} /></div>
          <div className="fg"><label className="label">Status</label>
            <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
              <option>Active</option><option>Discharged</option>
            </select>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
          <button className="btn-ghost" onClick={() => { setShowAdd(false); setEditClientId(null); }}>Cancel</button>
          <button className="btn-primary" onClick={saveClient}>{editClientId ? "Save Changes" : "Add Client"}</button>
        </div>
      </Modal>
    </div>
  );
}

// ─── Client Profile ────────────────────────────────────────────────────────
function ClientProfile({ client, house, ledger, onBack, setPage, setGenerateTarget, isAdmin, onEdit, onArchive }) {
  const [expandedId, setExpandedId]   = useState(null);
  const [monthVal, setMonthVal]       = useState(MONTH_OPTIONS[0].value);
  const [report, setReport]           = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [copied, setCopied]           = useState(false);

  const history = ledger
    .filter((e) => e.clientId === client.id)
    .sort((a, b) => new Date(b.serviceDate || b.date) - new Date(a.serviceDate || a.date));

  const totalHours  = history.reduce((s, e) => s + e.mins / 60, 0);
  const accentColor = house?.color || "var(--accent)";
  const monthLabel  = MONTH_OPTIONS.find((m) => m.value === monthVal)?.label || "";
  const monthEntries = entriesForMonth(history, monthVal);

  const genReport = async () => {
    setReportLoading(true); setReport(null);
    try {
      const r = await generateClientReport(client, house, monthEntries, monthLabel);
      setReport(r);
    } catch { setReport(null); }
    setReportLoading(false);
  };

  const reportText = report ? reportToText(client, house, monthEntries, monthLabel, report) : "";

  return (
    <div className="fade-in page-wrap" style={{ maxWidth: 1000 }}>

      {/* Back nav */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <button className="btn-ghost btn-sm" onClick={onBack}>← Clients</button>
        {isAdmin && onEdit && (
          <ProfileMenu onEdit={onEdit} onArchive={onArchive} isArchived={client.status === "Archived"} />
        )}
      </div>

      {client.status === "Archived" && (
        <div style={{ background: "var(--red-dim)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 10, padding: "11px 16px", marginBottom: 16, fontSize: 13, color: "var(--red)", display: "flex", alignItems: "center", gap: 8 }}>
          ⊘ This profile is archived. Service history is preserved for reporting purposes.
        </div>
      )}

      {/* Profile header */}
      <div className="card" style={{ marginBottom: 20, borderTop: `3px solid ${accentColor}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
          <Avatar first={client.firstName} last={client.lastName} photo={client.photo} color={accentColor} size={72} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
              {client.firstName} {client.lastName.slice(0, 1)}.
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <span className={`badge badge-${client.status === "Active" ? "green" : "amber"}`}>{client.status}</span>
              {house && <span style={{ fontSize: 12, color: "var(--text-sec)" }}>📍 {house.name} house</span>}
              {client.startDate && <span style={{ fontSize: 12, color: "var(--text-sec)" }}>📅 Since {fmtDate(client.startDate)}</span>}
            </div>
          </div>
          <div className="fr2" style={{ gap: 10, textAlign: "center" }}>
            <div style={{ background: "var(--bg)", borderRadius: 10, padding: "12px 16px", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: accentColor, fontFamily: "DM Mono, monospace", lineHeight: 1 }}>{totalHours.toFixed(1)}</div>
              <div style={{ fontSize: 10, color: "var(--text-dim)", marginTop: 3, textTransform: "uppercase", letterSpacing: "0.8px" }}>Total Hours</div>
            </div>
            <div style={{ background: "var(--bg)", borderRadius: 10, padding: "12px 16px", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: accentColor, fontFamily: "DM Mono, monospace", lineHeight: 1 }}>{history.length}</div>
              <div style={{ fontSize: 10, color: "var(--text-dim)", marginTop: 3, textTransform: "uppercase", letterSpacing: "0.8px" }}>Services</div>
            </div>
          </div>
          <button className="btn-primary btn-sm" onClick={() => {
            setGenerateTarget({ houseId: client.houseId, clientId: client.id });
            setPage("generate");
          }}>Generate Note</button>
        </div>
      </div>

      {/* Monthly Progress Report */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: report ? 16 : 0, flexWrap: "wrap" }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Generate Monthly Progress Report</div>
          <select value={monthVal} onChange={(e) => { setMonthVal(e.target.value); setReport(null); }} style={{ width: "auto", padding: "6px 12px", fontSize: 13 }}>
            {MONTH_OPTIONS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
          <div style={{ fontSize: 12, color: "var(--text-dim)" }}>{monthEntries.length} services this month</div>
          <button className="btn-primary btn-sm" style={{ marginLeft: "auto" }} onClick={genReport} disabled={reportLoading || monthEntries.length === 0}>
            {reportLoading ? <><span className="spin" style={{ display: "inline-block", marginRight: 6 }}>◌</span>Generating…</> : "Generate Report"}
          </button>
        </div>
        {monthEntries.length === 0 && !reportLoading && (
          <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 4 }}>No services recorded in {monthLabel} — select a different month.</div>
        )}
        {report && (
          <div className="fade-in">
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>
              {client.firstName} {client.lastName[0]}. · {monthLabel}
            </div>
            <ClientReportDisplay client={client} house={house} entries={monthEntries} monthLabel={monthLabel} report={report} />
            <ReportActions text={reportText} filename={`${client.firstName}_${client.lastName[0]}_${monthVal}_report.txt`}
              copied={copied} onCopy={() => { copyText(reportText); setCopied(true); setTimeout(() => setCopied(false), 2000); }} />
          </div>
        )}
      </div>

      {/* Service History */}
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
          Service History
          <span className="badge badge-blue">{history.length} entries</span>
        </div>

        {history.length === 0 && (
          <div className="card" style={{ textAlign: "center", padding: 40, color: "var(--text-dim)" }}>
            <div style={{ fontSize: 28, marginBottom: 10, opacity: 0.3 }}>≡</div>
            No services recorded for this client yet.
          </div>
        )}

        {history.length > 0 && (
          <div className="card table-scroll" style={{ padding: 0, overflow: "hidden" }}>
            <div className="table-inner">
            {/* Table header */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "130px 100px 100px 90px 1fr 140px 28px",
              gap: 0, padding: "10px 18px",
              background: "var(--bg)", borderBottom: "1px solid var(--border)",
            }}>
              {["Service Date", "Start", "End", "Duration", "Service Type", "Peer Author", ""].map((h) => (
                <div key={h} style={{ fontSize: 10, fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.8px" }}>{h}</div>
              ))}
            </div>

            {/* Rows */}
            {history.map((entry, idx) => {
              const isExpanded = expandedId === entry.id;
              const isLast = idx === history.length - 1;
              return (
                <div key={entry.id}>
                  {/* Data row */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "130px 100px 100px 90px 1fr 140px 28px",
                      gap: 0, padding: "12px 18px", cursor: "pointer",
                      borderBottom: isExpanded || !isLast ? "1px solid var(--border)" : "none",
                      background: isExpanded ? "var(--card-hover)" : "transparent",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => { if (!isExpanded) e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                    onMouseLeave={(e) => { if (!isExpanded) e.currentTarget.style.background = "transparent"; }}
                  >
                    <div style={{ fontSize: 13, color: "var(--text)" }}>
                      {entry.serviceDate ? fmtDate(entry.serviceDate) : fmtDate(entry.date)}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--text-sec)" }}>
                      {entry.startTime ? fmtTimeLabel(entry.startTime) : "—"}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--text-sec)" }}>
                      {entry.endTime ? fmtTimeLabel(entry.endTime) : "—"}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: accentColor, fontFamily: "DM Mono, monospace" }}>
                      {entry.duration}
                    </div>
                    <div style={{ fontSize: 12 }}>
                      <span className="badge badge-blue" style={{ fontSize: 11 }}>{entry.serviceType}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-sec)" }}>
                      {entry.authorName || "—"}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-dim)", alignSelf: "center" }}>
                      {isExpanded ? "▲" : "▼"}
                    </div>
                  </div>

                  {/* Expanded SOAIP note */}
                  {isExpanded && entry.soaip && (
                    <div className="fade-in" style={{ padding: "16px 20px", background: "var(--bg)", borderBottom: isLast ? "none" : "1px solid var(--border)" }}>
                      <SOAIPDisplay soaip={entry.soaip} />
                      {entry.editedAt && (
                        <div style={{ fontSize: 11, color: "var(--amber)", marginTop: 8 }}>
                          ✏ Edited by {entry.editedBy} on {fmtDate(entry.editedAt)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SOAIP Note Display (reused in Generate + Ledger) ──────────────────────
function SOAIPDisplay({ soaip }) {
  return (
    <>
      {[
        { label: "S — Subjective", text: soaip.subjective, color: "var(--accent)" },
        { label: "O — Objective",  text: soaip.objective,  color: "var(--green)" },
        { label: "A — Assessment", text: soaip.assessment, color: "var(--purple)" },
        { label: "I — Intervention", text: soaip.intervention, color: "var(--amber)" },
        { label: "P — Plan",       text: soaip.plan,       color: "var(--red)" },
      ].map(({ label, text, color }) => (
        <div key={label} style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color, marginBottom: 5, letterSpacing: "0.5px" }}>{label}</div>
          <div style={{ fontSize: 13, lineHeight: 1.75, color: "var(--text-sec)", background: "var(--bg)", borderRadius: 8, padding: "10px 14px", borderLeft: `3px solid ${color}` }}>
            {text}
          </div>
        </div>
      ))}
    </>
  );
}

// ─── Time options for dropdowns ────────────────────────────────────────────
const TIME_OPTIONS = (() => {
  const opts = [];
  for (let h = 6; h <= 23; h++) {
    for (const m of [0, 15, 30, 45]) {
      const hh  = h % 12 === 0 ? 12 : h % 12;
      const mm  = m.toString().padStart(2, "0");
      const ampm = h < 12 ? "AM" : "PM";
      opts.push({ label: `${hh}:${mm} ${ampm}`, value: `${h.toString().padStart(2, "0")}:${mm}` });
    }
  }
  // midnight
  opts.push({ label: "12:00 AM", value: "00:00" });
  return opts;
})();

function calcMinsFromTimes(start, end) {
  if (!start || !end) return null;
  const [sh, sm] = start.split(":").map(Number);
  let [eh, em]   = end.split(":").map(Number);
  let diff = (eh * 60 + em) - (sh * 60 + sm);
  if (diff <= 0) diff += 24 * 60; // handle crossing midnight
  return diff;
}

function fmtTimeLabel(val) {
  if (!val) return "";
  const opt = TIME_OPTIONS.find((o) => o.value === val);
  return opt ? opt.label : val;
}

// ─── Generate Note ─────────────────────────────────────────────────────────
function GeneratePage({ houses, clients, ledger, setLedger, generateTarget, setGenerateTarget, user }) {
  const [houseId, setHouseId]         = useState(generateTarget?.houseId || houses[0]?.id || "");
  const [clientId, setClientId]       = useState(generateTarget?.clientId || "");
  const [serviceType, setServiceType] = useState(SERVICE_TYPES[0]);
  const [serviceDate, setServiceDate] = useState(new Date().toISOString().split("T")[0]);
  const [startTime, setStartTime]     = useState("");
  const [endTime, setEndTime]         = useState("");
  const [mins, setMins]               = useState(60);
  const [timeAutoCalc, setTimeAutoCalc] = useState(false); // true when duration was auto-calculated
  const [notes, setNotes]             = useState("");
  const [barriers, setBarriers]       = useState([]);
  const [pending, setPending]         = useState(null);
  const [loading, setLoading]         = useState(false);
  const [listening, setListening]     = useState(false);
  const [accepted, setAccepted]       = useState(false);
  const recogRef = useRef(null);

  // Auto-calculate duration when both times are set
  useEffect(() => {
    const calculated = calcMinsFromTimes(startTime, endTime);
    if (calculated && calculated > 0) {
      // Snap to nearest DURATIONS entry, or use raw value
      const snapped = DURATIONS.reduce((best, d) =>
        Math.abs(d.mins - calculated) < Math.abs(best.mins - calculated) ? d : best
      );
      setMins(snapped.mins);
      setTimeAutoCalc(true);
    } else {
      setTimeAutoCalc(false);
    }
  }, [startTime, endTime]);

  useEffect(() => {
    if (generateTarget) {
      if (generateTarget.houseId) setHouseId(generateTarget.houseId);
      if (generateTarget.clientId) setClientId(generateTarget.clientId);
      setGenerateTarget(null);
    }
  }, []);

  const houseClients   = clients.filter((c) => c.houseId === houseId && c.status !== "Archived");
  const selectedClient = clients.find((c) => c.id === clientId);
  const selectedHouse  = houses.find((h) => h.id === houseId);
  const clientLedger   = ledger
    .filter((e) => e.clientId === clientId)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const togBarrier = (b) =>
    setBarriers((prev) => prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]);

  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Voice dictation requires Chrome or Edge."); return; }
    const r = new SR(); r.continuous = true; r.interimResults = true; r.lang = "en-US";
    r.onresult = (e) => {
      let final = notes;
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript + " ";
      }
      setNotes(final);
    };
    r.onerror = () => setListening(false);
    r.onend   = () => setListening(false);
    r.start(); recogRef.current = r; setListening(true);
  };
  const stopVoice = () => { recogRef.current?.stop(); setListening(false); };

  const [apiError, setApiError] = useState(null);

  // Step 1 — call Claude API, enter review state (NOT saved yet)
  const generate = async () => {
    if (!clientId || !houseId) { alert("Please select a house and client."); return; }
    setLoading(true);
    setApiError(null);
    const dur = DURATIONS.find((d) => d.mins === mins)?.label || `${mins} min`;
    try {
      const soaip = await buildSOAIPWithAI(selectedHouse?.name, serviceType, dur, mins, notes, barriers);
      setPending({
        id: uid(),
        date: new Date().toISOString(),
        serviceDate,
        startTime,
        endTime,
        houseId, clientId, serviceType, mins, duration: dur,
        summary: soaip.subjective.slice(0, 120) + "...",
        soaip,
        authorName:  user.name,
        authorEmail: user.email,
        authorRole:  user.role,
      });
    } catch (err) {
      setApiError("Note generation failed. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2a — Accept: save to ledger
  const acceptNote = () => {
    const updated = [...ledger, pending];
    setLedger(updated);
    LS.set("pb_ledger", updated);
    setAccepted(true);
    setPending(null);
    setNotes(""); setBarriers([]); setStartTime(""); setEndTime(""); setTimeAutoCalc(false);
    setServiceDate(new Date().toISOString().split("T")[0]);
    setTimeout(() => setAccepted(false), 2800);
  };

  // Step 2b — Reject: discard, reset
  const rejectNote = () => {
    setPending(null);
    setNotes(""); setBarriers([]); setStartTime(""); setEndTime(""); setTimeAutoCalc(false);
  };

  const [copied, setCopied] = useState(false);

  const copyNote = async () => {
    if (!pending) return;
    const { soaip } = pending;
    const text = [
      `SUBJECTIVE\n${soaip.subjective}`,
      `OBJECTIVE\n${soaip.objective}`,
      `ASSESSMENT\n${soaip.assessment}`,
      `INTERVENTION\n${soaip.intervention}`,
      `PLAN\n${soaip.plan}`,
    ].join("\n\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers that block clipboard without interaction
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.focus(); ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // ── Workflow step indicator ──────────────────────────────────────────────
  const step = pending ? 2 : 1;
  const steps = ["Enter Details & Notes", "Review AI Note", "Saved to Ledger"];

  return (
    <div className="fade-in page-wrap" style={{ maxWidth: 1140 }}>

      {/* Header + step trail */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>Generate Note</div>
        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
          {steps.map((s, i) => {
            const idx = i + 1;
            const active = idx === step;
            const done   = idx < step || accepted;
            return (
              <div key={s} style={{ display: "flex", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%", fontSize: 11, fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: done ? "var(--green)" : active ? "var(--accent)" : "var(--card)",
                    color: (done || active) ? "#fff" : "var(--text-dim)",
                    border: `2px solid ${done ? "var(--green)" : active ? "var(--accent)" : "var(--border)"}`,
                    transition: "all 0.3s",
                  }}>{done ? "✓" : idx}</div>
                  <span style={{ fontSize: 12, fontWeight: active ? 600 : 400, color: active ? "var(--text)" : done ? "var(--green)" : "var(--text-dim)" }}>{s}</span>
                </div>
                {i < steps.length - 1 && (
                  <div style={{ width: 28, height: 1, background: done ? "var(--green)" : "var(--border)", margin: "0 8px", transition: "background 0.3s" }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Accepted flash banner */}
      {accepted && (
        <div className="fade-in" style={{
          background: "var(--green-dim)", border: "1px solid rgba(52,211,153,0.3)",
          borderRadius: 12, padding: "14px 20px", marginBottom: 20,
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <span style={{ fontSize: 20 }}>✅</span>
          <div>
            <div style={{ fontWeight: 600, color: "var(--green)", fontSize: 14 }}>Note accepted and saved to ledger</div>
            <div style={{ fontSize: 12, color: "var(--text-sec)", marginTop: 2 }}>Authored by {user.name} · {fmtDate(new Date().toISOString())}</div>
          </div>
        </div>
      )}

      <div className="gen-grid">

        {/* ── Left column — inputs (locked during review) ─────────────────── */}
        <div style={{ opacity: pending ? 0.45 : 1, pointerEvents: pending ? "none" : "auto", transition: "opacity 0.2s" }}>
          <div className="card" style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16, color: "var(--text-sec)" }}>Session Details</div>
            <div className="fg">
              <label className="label">House</label>
              <select value={houseId} onChange={(e) => { setHouseId(e.target.value); setClientId(""); }}>
                <option value="">Select house...</option>
                {houses.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
              </select>
            </div>
            <div className="fg">
              <label className="label">Client</label>
              {selectedClient && (
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, padding: "8px 12px", background: "var(--bg)", borderRadius: 8 }}>
                  <Avatar first={selectedClient.firstName} last={selectedClient.lastName} photo={selectedClient.photo} color={selectedHouse?.color} size={32} />
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{displayName(selectedClient.firstName, selectedClient.lastName)}</span>
                </div>
              )}
              <select value={clientId} onChange={(e) => setClientId(e.target.value)}>
                <option value="">Select client...</option>
                {houseClients.map((c) => <option key={c.id} value={c.id}>{displayName(c.firstName, c.lastName)}</option>)}
              </select>
            </div>
            <div className="fg">
              <label className="label">Service Type</label>
              <select value={serviceType} onChange={(e) => setServiceType(e.target.value)}>
                {SERVICE_TYPES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>

            {/* ── Time fields ──────────────────────────────────────────── */}
            <div className="fg">
              <label className="label">Service Date</label>
              <input type="date" value={serviceDate} onChange={(e) => setServiceDate(e.target.value)} />
            </div>
            <div className="time-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
              <div>
                <label className="label">Start Time</label>
                <select value={startTime} onChange={(e) => setStartTime(e.target.value)}>
                  <option value="">Select...</option>
                  {TIME_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className="label">End Time</label>
                <select value={endTime} onChange={(e) => setEndTime(e.target.value)}>
                  <option value="">Select...</option>
                  {TIME_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>
            {timeAutoCalc && startTime && endTime && (
              <div style={{
                fontSize: 12, color: "var(--green)", marginBottom: 10, marginTop: -8,
                display: "flex", alignItems: "center", gap: 6,
                background: "var(--green-dim)", borderRadius: 8, padding: "7px 12px",
                border: "1px solid rgba(52,211,153,0.2)",
              }}>
                <span>⏱</span>
                Duration auto-calculated from {fmtTimeLabel(startTime)} – {fmtTimeLabel(endTime)}
              </div>
            )}

            <div className="fg">
              <label className="label">Duration</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {DURATIONS.map((d) => (
                  <button key={d.mins} onClick={() => setMins(d.mins)} style={{
                    padding: "7px 13px", borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: "pointer",
                    background: mins === d.mins ? "var(--accent)" : "var(--bg)",
                    color:      mins === d.mins ? "#fff" : "var(--text-sec)",
                    border: `1.5px solid ${mins === d.mins ? "var(--accent)" : "var(--border)"}`,
                    boxShadow:  mins === d.mins ? "0 0 12px var(--accent-glow)" : "none",
                  }}>{d.label}</button>
                ))}
              </div>
              <div style={{ marginTop: 8, fontSize: 11, color: "var(--text-dim)", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: "var(--accent)", fontWeight: 600 }}>◈</span>
                {(() => { const wc = wordCountTarget(mins); return `Note target: ${wc.min}–${wc.max} words total`; })()}
              </div>
            </div>
          </div>

          <div className="card" style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14, color: "var(--text-sec)" }}>Barriers Addressed</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {BARRIERS.map((b) => (
                <button key={b} onClick={() => togBarrier(b)} style={{
                  padding: "5px 11px", borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: "pointer",
                  background: barriers.includes(b) ? "var(--accent-dim)" : "transparent",
                  color:      barriers.includes(b) ? "var(--accent)" : "var(--text-sec)",
                  border: `1px solid ${barriers.includes(b) ? "var(--accent-glow)" : "var(--border)"}`,
                }}>{b}</button>
              ))}
            </div>
          </div>

          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-sec)" }}>Session Notes</div>
              <button onClick={listening ? stopVoice : startVoice} style={{
                display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 20,
                fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none",
                background: listening ? "var(--red-dim)" : "var(--accent-dim)",
                color:      listening ? "var(--red)"     : "var(--accent)",
              }}>
                <span className={listening ? "pulse" : ""}>{listening ? "⏹" : "🎙"}</span>
                {listening ? "Stop Recording" : "Dictate Notes"}
              </button>
            </div>
            {listening && (
              <div style={{ fontSize: 12, color: "var(--red)", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                <span className="pulse">●</span> Listening… speak now
              </div>
            )}
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter session notes or click Dictate Notes to speak…" rows={5} />
            <button onClick={generate} className="btn-primary" style={{ width: "100%", padding: 12, marginTop: 14 }} disabled={loading || !!pending}>
              {loading
                ? <><span className="spin" style={{ display: "inline-block", marginRight: 8 }}>◌</span>Generating with AI…</>
                : "⚡ Generate SOAIP Note"}
            </button>
            {apiError && (
              <div style={{ marginTop: 10, fontSize: 13, color: "var(--red)", background: "var(--red-dim)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 8, padding: "10px 14px" }}>
                ⚠ {apiError}
              </div>
            )}
          </div>
        </div>

        {/* ── Right column — review panel / history ────────────────────────── */}
        <div>
          {/* Client history */}
          {clientId && clientLedger.length > 0 && !pending && (
            <div className="card" style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14, color: "var(--text-sec)" }}>
                Recent Services — {selectedClient ? displayName(selectedClient.firstName, selectedClient.lastName) : ""}
              </div>
              {clientLedger.map((entry) => (
                <div key={entry.id} style={{ padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{entry.serviceType}</span>
                    <span style={{ fontSize: 11, color: "var(--text-dim)", fontFamily: "DM Mono, monospace" }}>{entry.duration}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-sec)", marginBottom: 3 }}>{fmtDate(entry.date)}</div>
                  <div style={{ fontSize: 11, color: "var(--text-dim)", lineHeight: 1.5 }}>{entry.summary}</div>
                </div>
              ))}
            </div>
          )}

          {/* ── REVIEW STATE ─────────────────────────────────────────────── */}
          {pending && (
            <div className="fade-in">
              {/* Review header banner */}
              <div style={{
                background: "linear-gradient(135deg, rgba(79,142,247,0.1) 0%, rgba(167,139,250,0.08) 100%)",
                border: "1px solid var(--accent-glow)",
                borderRadius: 14, padding: "16px 20px", marginBottom: 14,
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 3 }}>📋 Review Note Before Saving</div>
                  <div style={{ fontSize: 12, color: "var(--text-sec)" }}>
                    Author: <strong style={{ color: "var(--text)" }}>{user.name}</strong>
                    {" · "}{pending.serviceDate ? fmtDate(pending.serviceDate) : fmtDate(pending.date)}
                    {pending.startTime && pending.endTime && (
                      <span> · {fmtTimeLabel(pending.startTime)} – {fmtTimeLabel(pending.endTime)}</span>
                    )}
                    {" · "}{pending.duration}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {(() => {
                    const totalWords = Object.values(pending.soaip).join(" ").split(/\s+/).filter(Boolean).length;
                    const wc = wordCountTarget(pending.mins);
                    const ok = totalWords >= wc.min && totalWords <= wc.max;
                    const color = ok ? "var(--green)" : "var(--amber)";
                    const bg   = ok ? "var(--green-dim)" : "var(--amber-dim)";
                    return (
                      <div style={{ background: bg, border: `1px solid ${color}33`, borderRadius: 8, padding: "5px 12px", textAlign: "center" }}>
                        <div style={{ fontSize: 16, fontWeight: 700, color, fontFamily: "DM Mono, monospace", lineHeight: 1 }}>{totalWords}</div>
                        <div style={{ fontSize: 10, color, opacity: 0.8, marginTop: 2 }}>words · target {wc.min}–{wc.max}</div>
                      </div>
                    );
                  })()}
                  <button className="btn-ghost btn-sm" onClick={copyNote} style={{
                    minWidth: 90, transition: "all 0.15s",
                    background: copied ? "var(--green-dim)" : "",
                    color: copied ? "var(--green)" : "",
                    borderColor: copied ? "rgba(52,211,153,0.3)" : "",
                  }}>
                    {copied ? "✓ Copied" : "Copy"}
                  </button>
                </div>
              </div>

              {/* SOAIP preview */}
              <div className="card" style={{ marginBottom: 14 }}>
                <SOAIPDisplay soaip={pending.soaip} />
              </div>

              {/* Accept / Reject buttons */}
              <div className="action-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <button onClick={rejectNote} style={{
                  padding: "16px 20px", borderRadius: 12, fontSize: 14, fontWeight: 700,
                  cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                  background: "var(--red-dim)", color: "var(--red)",
                  border: "2px solid rgba(248,113,113,0.25)",
                  transition: "all 0.15s",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(248,113,113,0.2)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "var(--red-dim)"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <span style={{ fontSize: 26 }}>👎</span>
                  <span>Reject Note</span>
                  <span style={{ fontSize: 11, fontWeight: 400, opacity: 0.8 }}>Discard &amp; reset form</span>
                </button>
                <button onClick={acceptNote} style={{
                  padding: "16px 20px", borderRadius: 12, fontSize: 14, fontWeight: 700,
                  cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                  background: "var(--green-dim)", color: "var(--green)",
                  border: "2px solid rgba(52,211,153,0.3)",
                  transition: "all 0.15s",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(52,211,153,0.2)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "var(--green-dim)"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <span style={{ fontSize: 26 }}>👍</span>
                  <span>Accept Note</span>
                  <span style={{ fontSize: 11, fontWeight: 400, opacity: 0.8 }}>Save to ledger</span>
                </button>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!pending && !clientId && (
            <div className="card" style={{ textAlign: "center", padding: 40, color: "var(--text-dim)" }}>
              <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.3 }}>✦</div>
              <div style={{ fontSize: 14 }}>Select a house and client,<br />then generate your note.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── House Management Page ─────────────────────────────────────────────────
function HouseManagementPage({ houses, setHouses, clients, ledger }) {
  const EMPTY_FORM = { name: "", address: "", status: "Active" };
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const openAdd = () => { setForm(EMPTY_FORM); setEditId(null); setShowAdd(true); };
  const openEdit = (house) => { setForm({ name: house.name, address: house.address || "", status: house.status || "Active" }); setEditId(house.id); setShowAdd(true); };

  const saveHouse = () => {
    if (!form.name.trim()) return;
    let updated;
    if (editId) {
      updated = houses.map((h) => h.id === editId ? { ...h, name: form.name.trim(), address: form.address.trim(), status: form.status } : h);
    } else {
      const newHouse = { id: uid(), name: form.name.trim(), address: form.address.trim(), status: form.status, color: pickColor(houses), createdAt: new Date().toISOString() };
      updated = [...houses, newHouse];
    }
    setHouses(updated);
    LS.set("pb_houses", updated);
    setShowAdd(false);
    setEditId(null);
  };

  const confirmDelete = (house) => {
    const assigned = clients.filter((c) => c.houseId === house.id).length;
    setDeleteTarget({ house, assignedCount: assigned });
  };

  const doDelete = () => {
    const updated = houses.filter((h) => h.id !== deleteTarget.house.id);
    setHouses(updated);
    LS.set("pb_houses", updated);
    setDeleteTarget(null);
  };

  return (
    <div className="fade-in page-wrap" style={{ maxWidth: 900 }}>
      <div className="page-header" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>House Management</div>
          <div style={{ color: "var(--text-sec)", fontSize: 14 }}>Add, edit, and manage recovery houses</div>
        </div>
        <button className="btn-primary" onClick={openAdd} style={{ marginTop: 4, flexShrink: 0 }}>+ Add House</button>
      </div>

      {houses.length === 0 && (
        <div className="card" style={{ textAlign: "center", padding: 56, color: "var(--text-dim)" }}>
          <div style={{ fontSize: 36, marginBottom: 14, opacity: 0.25 }}>⬡</div>
          <div style={{ fontSize: 15, marginBottom: 6, color: "var(--text-sec)" }}>No houses yet</div>
          <div style={{ fontSize: 13, marginBottom: 20 }}>Add your first recovery house to get started.</div>
          <button className="btn-primary" onClick={openAdd}>+ Add First House</button>
        </div>
      )}

      <div className="auto-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
        {houses.map((house) => {
          const hClients = clients.filter((c) => c.houseId === house.id);
          const hHours = ledger.filter((e) => e.houseId === house.id).reduce((s, e) => s + e.mins / 60, 0);
          const activeCount = hClients.filter((c) => c.status === "Active").length;
          return (
            <div key={house.id} className="card" style={{ borderTop: `3px solid ${house.color}`, display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: house.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>⬡</div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>{house.name}</div>
                    {house.address && <div style={{ fontSize: 12, color: "var(--text-sec)", marginTop: 2 }}>{house.address}</div>}
                  </div>
                </div>
                <span className={`badge badge-${house.status === "Active" ? "green" : "amber"}`}>{house.status || "Active"}</span>
              </div>

              <div className="fr3" style={{ gap: 8 }}>
                {[
                  { label: "Clients", value: hClients.length },
                  { label: "Active", value: activeCount },
                  { label: "Hours", value: hHours.toFixed(1) + "h" },
                ].map(({ label, value }) => (
                  <div key={label} style={{ background: "var(--bg)", borderRadius: 8, padding: "10px 12px", border: "1px solid var(--border)" }}>
                    <div style={{ fontSize: 10, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 3 }}>{label}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: house.color, fontFamily: "DM Mono, monospace" }}>{value}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
                <button className="btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => openEdit(house)}>Edit</button>
                <button className="btn-danger btn-sm" style={{ flex: 1 }} onClick={() => confirmDelete(house)}>Delete</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      <Modal open={showAdd} onClose={() => { setShowAdd(false); setEditId(null); }} title={editId ? "Edit House" : "Add New House"} width={480}>
        <div className="fg">
          <label className="label">House Name *</label>
          <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Acoma, Mayberry…" autoFocus />
        </div>
        <div className="fg">
          <label className="label">Address (optional)</label>
          <input value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} placeholder="123 Main St, City, State" />
        </div>
        <div className="fg">
          <label className="label">Status</label>
          <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
          <button className="btn-ghost" onClick={() => { setShowAdd(false); setEditId(null); }}>Cancel</button>
          <button className="btn-primary" onClick={saveHouse} disabled={!form.name.trim()}>{editId ? "Save Changes" : "Add House"}</button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete House" width={440}>
        {deleteTarget && (
          <>
            {deleteTarget.assignedCount > 0 ? (
              <div style={{ background: "var(--red-dim)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 10, padding: "14px 16px", marginBottom: 18 }}>
                <div style={{ fontWeight: 600, color: "var(--red)", marginBottom: 6 }}>⚠ Clients still assigned</div>
                <div style={{ fontSize: 13, color: "var(--text-sec)", lineHeight: 1.6 }}>
                  <strong style={{ color: "var(--text)" }}>{deleteTarget.assignedCount} client{deleteTarget.assignedCount > 1 ? "s are" : " is"}</strong> currently assigned to <strong style={{ color: "var(--text)" }}>{deleteTarget.house.name}</strong>. You should reassign them before deleting this house. Deleting will remove the house but their records will remain.
                </div>
              </div>
            ) : (
              <div style={{ fontSize: 14, color: "var(--text-sec)", marginBottom: 18, lineHeight: 1.6 }}>
                Are you sure you want to delete <strong style={{ color: "var(--text)" }}>{deleteTarget.house.name}</strong>? This cannot be undone.
              </div>
            )}
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button className="btn-ghost" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="btn-danger" onClick={doDelete}>
                {deleteTarget.assignedCount > 0 ? "Delete Anyway" : "Delete House"}
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}

// ─── Ledger ────────────────────────────────────────────────────────────────
function LedgerPage({ houses, clients, ledger, setLedger, user }) {
  const [filterHouse, setFilterHouse] = useState("all");
  const [editingId, setEditingId]     = useState(null);
  const [editForm, setEditForm]       = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [expandedId, setExpandedId]   = useState(null);

  const sorted   = [...ledger].sort((a, b) => new Date(b.date) - new Date(a.date));
  const filtered = sorted.filter((e) => filterHouse === "all" || e.houseId === filterHouse);
  const totalHrs = filtered.reduce((s, e) => s + e.mins / 60, 0);

  const canModify = (entry) =>
    user.role === "Admin" || entry.authorEmail === user.email;

  const openEdit = (entry) => {
    setEditForm({
      serviceType: entry.serviceType,
      mins:        entry.mins,
      subjective:  entry.soaip?.subjective || "",
      objective:   entry.soaip?.objective  || "",
      assessment:  entry.soaip?.assessment || "",
      intervention:entry.soaip?.intervention || "",
      plan:        entry.soaip?.plan        || "",
    });
    setEditingId(entry.id);
  };

  const saveEdit = () => {
    const dur = DURATIONS.find((d) => d.mins === Number(editForm.mins))?.label || `${editForm.mins} min`;
    const updated = ledger.map((e) => e.id !== editingId ? e : {
      ...e,
      serviceType: editForm.serviceType,
      mins:        Number(editForm.mins),
      duration:    dur,
      soaip: {
        subjective:   editForm.subjective,
        objective:    editForm.objective,
        assessment:   editForm.assessment,
        intervention: editForm.intervention,
        plan:         editForm.plan,
      },
      editedAt:    new Date().toISOString(),
      editedBy:    user.name,
    });
    setLedger(updated);
    LS.set("pb_ledger", updated);
    setEditingId(null);
  };

  const confirmDelete = (entry) => setDeleteTarget(entry);

  const doDelete = () => {
    const updated = ledger.filter((e) => e.id !== deleteTarget.id);
    setLedger(updated);
    LS.set("pb_ledger", updated);
    setDeleteTarget(null);
  };

  return (
    <div className="fade-in page-wrap" style={{ maxWidth: 960 }}>
      <div className="page-header" style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Billing Ledger</div>
          <div style={{ color: "var(--text-sec)", fontSize: 14 }}>{filtered.length} services · {totalHrs.toFixed(1)} hours logged</div>
        </div>
        <div className="page-header-actions" style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
          <select value={filterHouse} onChange={(e) => setFilterHouse(e.target.value)} style={{ width: "auto", padding: "7px 12px" }}>
            <option value="all">All Houses</option>
            {houses.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
          </select>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="card" style={{ textAlign: "center", padding: 48, color: "var(--text-dim)" }}>
          <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.3 }}>≡</div>
          No services recorded yet. Generate a note to create your first ledger entry.
        </div>
      )}

      {filtered.map((entry) => {
        const client    = clients.find((c) => c.id === entry.clientId);
        const house     = houses.find((h) => h.id === entry.houseId);
        const canEdit   = canModify(entry);
        const expanded  = expandedId === entry.id;
        const isEditing = editingId === entry.id;

        return (
          <div key={entry.id} className="card" style={{ marginBottom: 12 }}>
            {/* ── Entry header ─────────────────────────────────────────── */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <Avatar first={client?.firstName} last={client?.lastName} photo={client?.photo} color={house?.color} size={44} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 5 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 600, fontSize: 15 }}>{client ? displayName(client.firstName, client.lastName) : "Unknown"}</span>
                    <span className="badge badge-blue">{entry.serviceType}</span>
                    {entry.editedAt && <span className="badge badge-amber" style={{ fontSize: 10 }}>Edited</span>}
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 12, color: "var(--text-sec)", marginBottom: 2 }}>
                      {entry.serviceDate ? fmtDate(entry.serviceDate) : fmtDate(entry.date)}
                      {entry.startTime && entry.endTime
                        ? ` · ${fmtTimeLabel(entry.startTime)} – ${fmtTimeLabel(entry.endTime)}`
                        : ` · ${fmtTime(entry.date)}`}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: house?.color || "var(--accent)", fontFamily: "DM Mono, monospace" }}>{entry.duration}</div>
                  </div>
                </div>

                {/* Author + house row */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, color: "var(--text-dim)" }}>{house?.name} house</span>
                  <span style={{ fontSize: 11, color: "var(--text-dim)" }}>·</span>
                  <span style={{ fontSize: 11, color: "var(--text-dim)" }}>
                    By <strong style={{ color: entry.authorEmail === user.email ? "var(--accent)" : "var(--text-sec)" }}>
                      {entry.authorName || "Unknown"}
                    </strong>
                    {entry.authorRole && <span style={{ color: "var(--text-dim)" }}> ({entry.authorRole})</span>}
                  </span>
                  {entry.editedAt && (
                    <span style={{ fontSize: 10, color: "var(--amber)" }}>· Edited by {entry.editedBy} on {fmtDate(entry.editedAt)}</span>
                  )}
                </div>

                <div style={{ fontSize: 12, color: "var(--text-sec)", lineHeight: 1.6, marginBottom: 10 }}>{entry.summary}</div>

                {/* Action row */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button className="btn-ghost btn-sm" onClick={() => setExpandedId(expanded ? null : entry.id)}>
                    {expanded ? "Hide Note ↑" : "View Full Note ↓"}
                  </button>
                  {canEdit ? (
                    <>
                      <button className="btn-ghost btn-sm" onClick={() => { openEdit(entry); setExpandedId(entry.id); }}>✏ Edit Note</button>
                      <button className="btn-danger btn-sm" onClick={() => confirmDelete(entry)}>🗑 Delete</button>
                    </>
                  ) : (
                    <span style={{ fontSize: 11, color: "var(--text-dim)", alignSelf: "center", paddingLeft: 4 }}>
                      🔒 View only
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* ── Expanded SOAIP view / edit ────────────────────────────── */}
            {expanded && entry.soaip && (
              <div className="fade-in" style={{ marginTop: 16, borderTop: "1px solid var(--border)", paddingTop: 16 }}>
                {isEditing ? (
                  /* Edit form */
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14, color: "var(--text-sec)" }}>Editing Note</div>
                    <div className="fr2" style={{ marginBottom: 12 }}>
                      <div className="fg" style={{ marginBottom: 0 }}>
                        <label className="label">Service Type</label>
                        <select value={editForm.serviceType} onChange={(e) => setEditForm((f) => ({ ...f, serviceType: e.target.value }))}>
                          {SERVICE_TYPES.map((s) => <option key={s}>{s}</option>)}
                        </select>
                      </div>
                      <div className="fg" style={{ marginBottom: 0 }}>
                        <label className="label">Duration</label>
                        <select value={editForm.mins} onChange={(e) => setEditForm((f) => ({ ...f, mins: e.target.value }))}>
                          {DURATIONS.map((d) => <option key={d.mins} value={d.mins}>{d.label}</option>)}
                        </select>
                      </div>
                    </div>
                    {[
                      { key: "subjective",   label: "S — Subjective",   color: "var(--accent)" },
                      { key: "objective",    label: "O — Objective",    color: "var(--green)" },
                      { key: "assessment",   label: "A — Assessment",   color: "var(--purple)" },
                      { key: "intervention", label: "I — Intervention", color: "var(--amber)" },
                      { key: "plan",         label: "P — Plan",         color: "var(--red)" },
                    ].map(({ key, label, color }) => (
                      <div key={key} className="fg">
                        <label className="label" style={{ color }}>{label}</label>
                        <textarea value={editForm[key]} rows={3}
                          onChange={(e) => setEditForm((f) => ({ ...f, [key]: e.target.value }))}
                          style={{ borderLeft: `3px solid ${color}` }} />
                      </div>
                    ))}
                    <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 6 }}>
                      <button className="btn-ghost btn-sm" onClick={() => setEditingId(null)}>Cancel</button>
                      <button className="btn-primary btn-sm" onClick={saveEdit}>Save Changes</button>
                    </div>
                  </div>
                ) : (
                  /* Read-only SOAIP view */
                  <SOAIPDisplay soaip={entry.soaip} />
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Delete confirm modal */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Note" width={420}>
        {deleteTarget && (
          <>
            <div style={{ fontSize: 14, color: "var(--text-sec)", marginBottom: 6, lineHeight: 1.6 }}>
              Delete this note for <strong style={{ color: "var(--text)" }}>
                {(() => { const c = clients.find((x) => x.id === deleteTarget.clientId); return c ? displayName(c.firstName, c.lastName) : "Unknown"; })()}
              </strong>?
            </div>
            <div style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 20, lineHeight: 1.5, background: "var(--bg)", borderRadius: 8, padding: "10px 14px" }}>
              {fmtDate(deleteTarget.date)} · {deleteTarget.serviceType} · {deleteTarget.duration}<br />
              By {deleteTarget.authorName || "Unknown"}
            </div>
            <div style={{ fontSize: 13, color: "var(--amber)", marginBottom: 18, background: "var(--amber-dim)", borderRadius: 8, padding: "10px 14px" }}>
              ⚠ This will permanently remove the note and its ledger entry.
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button className="btn-ghost" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="btn-danger" onClick={doDelete}>Delete Note</button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}

// ─── Report Helpers ────────────────────────────────────────────────────────
const MONTH_OPTIONS = (() => {
  const opts = [];
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    opts.push({
      label: d.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      value: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
    });
  }
  return opts;
})();

function entriesForMonth(ledger, monthVal) {
  return ledger.filter((e) => {
    const d = e.serviceDate || e.date?.split("T")[0] || "";
    return d.startsWith(monthVal);
  });
}

function copyText(text) {
  try {
    navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.focus(); ta.select();
    document.execCommand("copy"); document.body.removeChild(ta);
  }
}

function downloadText(text, filename) {
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = filename;
  a.click(); URL.revokeObjectURL(url);
}

function ReportActions({ text, filename, copied, onCopy }) {
  return (
    <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
      <button className="btn-ghost btn-sm" onClick={onCopy} style={{
        minWidth: 90, background: copied ? "var(--green-dim)" : "",
        color: copied ? "var(--green)" : "", borderColor: copied ? "rgba(52,211,153,0.3)" : "",
      }}>{copied ? "✓ Copied" : "Copy Report"}</button>
      <button className="btn-ghost btn-sm" onClick={() => downloadText(text, filename)}>Download</button>
    </div>
  );
}

// ─── Client Monthly Report Generator ──────────────────────────────────────
async function generateClientReport(client, house, entries, monthLabel) {
  const totalServices = entries.length;
  const totalHours = entries.reduce((s, e) => s + e.mins / 60, 0).toFixed(1);
  const barriers = [...new Set(entries.flatMap((e) =>
    e.soaip?.subjective?.match(/barriers?[^.]*\.?/gi)?.join(" ") || []
  ))];
  const serviceTypes = [...new Set(entries.map((e) => e.serviceType))];
  const noteSummaries = entries.map((e) =>
    `- ${e.serviceDate || e.date?.split("T")[0]}: ${e.serviceType} (${e.duration}). ${e.soaip?.assessment || ""}`
  ).join("\n");

  const prompt = `You are a peer support program coordinator writing a structured monthly progress report for a client.

CLIENT: [Client — first name ${client.firstName}, last initial ${client.lastName[0]}]
HOUSE: ${house?.name || "Unknown"}
REPORT MONTH: ${monthLabel}
TOTAL SERVICES: ${totalServices}
TOTAL HOURS: ${totalHours}
SERVICE TYPES DELIVERED: ${serviceTypes.join(", ") || "none"}
SERVICE SUMMARIES:
${noteSummaries || "(no services this month)"}

Write a structured progress report with these sections. Use professional, recovery-oriented peer support language. Do NOT use clinical or therapy language. Refer to individual only as "client".

REQUIRED SECTIONS:
1. Engagement Summary — 3–4 sentences summarizing the client's participation and engagement during the month
2. Barriers Addressed — list the barriers that were worked on this month based on services
3. Activities & Services — summarize the types of activities and services provided
4. Recovery Progress — 2–3 sentences on observable progress indicators from the service notes
5. Plan for Continued Support — 2–3 sentences on next steps for continued peer support engagement

Respond ONLY with a valid JSON object:
{"engagementSummary":"...","barriersAddressed":"...","activitiesServices":"...","recoveryProgress":"...","continuedSupport":"..."}`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514", max_tokens: 800,
      system: "You are a peer support documentation specialist. Write clear, professional monthly progress reports for peer support programs. Always use peer support language, never clinical language. Refer to the individual as 'client'. Respond only with valid JSON.",
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await response.json();
  const text = data.content?.find((b) => b.type === "text")?.text || "";
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}

function ClientReportDisplay({ client, house, entries, monthLabel, report }) {
  const totalHours = entries.reduce((s, e) => s + e.mins / 60, 0).toFixed(1);
  const sections = [
    { label: "Engagement Summary",        text: report.engagementSummary,  color: "var(--accent)" },
    { label: "Barriers Addressed",        text: report.barriersAddressed,  color: "var(--red)" },
    { label: "Activities & Services",     text: report.activitiesServices, color: "var(--green)" },
    { label: "Recovery Progress",         text: report.recoveryProgress,   color: "var(--purple)" },
    { label: "Plan for Continued Support",text: report.continuedSupport,   color: "var(--amber)" },
  ];
  return (
    <div>
      <div style={{ display: "flex", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
        {[
          { label: "Services", value: entries.length },
          { label: "Hours",    value: totalHours + "h" },
          { label: "House",    value: house?.name || "—" },
        ].map(({ label, value }) => (
          <div key={label} style={{ background: "var(--bg)", borderRadius: 8, padding: "10px 16px", border: "1px solid var(--border)", textAlign: "center", minWidth: 80 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--accent)", fontFamily: "DM Mono, monospace" }}>{value}</div>
            <div style={{ fontSize: 10, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.8px", marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>
      {sections.map(({ label, text, color }) => (
        <div key={label} style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color, marginBottom: 5, letterSpacing: "0.5px", textTransform: "uppercase" }}>{label}</div>
          <div style={{ fontSize: 13, lineHeight: 1.75, color: "var(--text-sec)", background: "var(--bg)", borderRadius: 8, padding: "10px 14px", borderLeft: `3px solid ${color}` }}>{text}</div>
        </div>
      ))}
    </div>
  );
}

function reportToText(client, house, entries, monthLabel, report) {
  const totalHours = entries.reduce((s, e) => s + e.mins / 60, 0).toFixed(1);
  return [
    `MONTHLY PROGRESS REPORT`,
    `Client: ${client.firstName} ${client.lastName[0]}.`,
    `House: ${house?.name || "Unknown"}`,
    `Month: ${monthLabel}`,
    `Total Services: ${entries.length} | Total Hours: ${totalHours}h`,
    ``,
    `ENGAGEMENT SUMMARY\n${report.engagementSummary}`,
    ``,
    `BARRIERS ADDRESSED\n${report.barriersAddressed}`,
    ``,
    `ACTIVITIES & SERVICES\n${report.activitiesServices}`,
    ``,
    `RECOVERY PROGRESS\n${report.recoveryProgress}`,
    ``,
    `PLAN FOR CONTINUED SUPPORT\n${report.continuedSupport}`,
  ].join("\n");
}

// ─── Peers Page ────────────────────────────────────────────────────────────
function PeersPage({ peers, setPeers, ledger, houses }) {
  const [selectedId, setSelectedId] = useState(null);
  const [showAdd, setShowAdd]       = useState(false);
  const [editPeerId, setEditPeerId] = useState(null);
  const [filter, setFilter]         = useState("active");
  const BLANK = { name: "", role: "Peer Support Specialist", status: "Active", phone: "", email: "", primaryHouse: "", secondaryHouses: [], photo: "" };
  const [form, setForm]             = useState(BLANK);
  const photoRef = useRef();

  const updatePeers = (updated) => { setPeers(updated); LS.set("pb_peers", updated); };

  const archivePeer = (id, newStatus) => {
    updatePeers(peers.map((p) => p.id === id ? { ...p, status: newStatus } : p));
    if (selectedId === id) setSelectedId(null);
  };

  const openEdit = (peer) => {
    setForm({ name: peer.name, role: peer.role, status: peer.status, phone: peer.phone || "", email: peer.email || "", primaryHouse: peer.primaryHouse || "", secondaryHouses: peer.secondaryHouses || [], photo: peer.photo || "" });
    setEditPeerId(peer.id);
    setShowAdd(true);
  };

  if (selectedId) {
    const peer = peers.find((p) => p.id === selectedId);
    if (peer) return <PeerProfile peer={peer} peers={peers} setPeers={setPeers} ledger={ledger} houses={houses}
      onBack={() => setSelectedId(null)} isAdmin
      onEdit={() => { openEdit(peer); setSelectedId(null); }}
      onArchive={(s) => archivePeer(peer.id, s)} />;
  }

  const handlePhoto = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm((f) => ({ ...f, photo: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const savePeer = () => {
    if (!form.name.trim()) return;
    if (editPeerId) {
      updatePeers(peers.map((p) => p.id === editPeerId ? { ...p, ...form } : p));
    } else {
      updatePeers([...peers, { id: uid(), ...form, createdAt: new Date().toISOString() }]);
    }
    setForm(BLANK); setShowAdd(false); setEditPeerId(null);
  };

  const visible = peers.filter((p) =>
    filter === "active" ? p.status !== "Archived" : p.status === "Archived"
  );

  return (
    <div className="fade-in page-wrap" style={{ maxWidth: 960 }}>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Peers</div>
          <div style={{ color: "var(--text-sec)", fontSize: 14 }}>Peer support staff directory</div>
        </div>
        <div className="page-header-actions" style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {["active", "Archived"].map((f) => (
            <button key={f} onClick={() => setFilter(f)} style={{
              background: filter === f ? "var(--accent-dim)" : "transparent",
              color: filter === f ? "var(--accent)" : "var(--text-sec)",
              border: `1px solid ${filter === f ? "var(--accent-glow)" : "var(--border)"}`,
              borderRadius: 20, padding: "5px 14px", fontSize: 12, fontWeight: 500, cursor: "pointer",
            }}>{f === "active" ? "Active" : "Archived"}</button>
          ))}
          <button className="btn-primary btn-sm" onClick={() => { setEditPeerId(null); setForm(BLANK); setShowAdd(true); }}>+ Add Peer</button>
        </div>
      </div>

      {visible.length === 0 && (
        <div className="card" style={{ textAlign: "center", padding: 48, color: "var(--text-dim)" }}>
          <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.3 }}>◉</div>
          {filter === "Archived" ? "No archived peers." : "No peers added yet. Add your first peer support staff member."}
        </div>
      )}

      <div className="auto-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
        {visible.map((peer) => {
          const pLedger   = ledger.filter((e) => e.authorEmail === peer.email);
          const totalHrs  = pLedger.reduce((s, e) => s + e.mins / 60, 0);
          const thisMonth = MONTH_OPTIONS[0].value;
          const monthHrs  = entriesForMonth(pLedger, thisMonth).reduce((s, e) => s + e.mins / 60, 0);
          const houseObj  = houses.find((h) => h.id === peer.primaryHouse);
          const isArchived = peer.status === "Archived";
          return (
            <div key={peer.id} className="card" style={{ display: "flex", flexDirection: "column", gap: 12, opacity: isArchived ? 0.65 : 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ cursor: "pointer" }} onClick={() => setSelectedId(peer.id)}>
                  <Avatar first={peer.name.split(" ")[0]} last={peer.name.split(" ")[1] || "P"} photo={peer.photo} color="var(--purple)" size={52} />
                </div>
                <div style={{ flex: 1, minWidth: 0, cursor: "pointer" }} onClick={() => setSelectedId(peer.id)}>
                  <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 3 }}>{peer.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text-sec)", marginBottom: 4 }}>{peer.role}</div>
                  <span className={`badge badge-${peer.status === "Active" ? "green" : isArchived ? "red" : "amber"}`}>{peer.status}</span>
                </div>
                <ProfileMenu onEdit={() => openEdit(peer)} onArchive={(s) => archivePeer(peer.id, s)} isArchived={isArchived} />
              </div>
              <div className="divider" style={{ margin: 0 }} />
              <div style={{ display: "flex", justifyContent: "space-between", cursor: "pointer" }} onClick={() => setSelectedId(peer.id)}>
                <div>
                  <div style={{ fontSize: 10, color: "var(--text-dim)", marginBottom: 2 }}>THIS MONTH</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "var(--purple)", fontFamily: "DM Mono, monospace" }}>{monthHrs.toFixed(1)}h</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 10, color: "var(--text-dim)", marginBottom: 2 }}>TOTAL HOURS</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "var(--purple)", fontFamily: "DM Mono, monospace" }}>{totalHrs.toFixed(1)}h</div>
                </div>
              </div>
              {houseObj && <div style={{ fontSize: 11, color: "var(--text-sec)" }}>📍 {houseObj.name}</div>}
            </div>
          );
        })}
      </div>

      <Modal open={showAdd} onClose={() => { setShowAdd(false); setEditPeerId(null); }} title={editPeerId ? "Edit Peer Profile" : "Add Peer Staff"} width={500}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <div style={{ position: "relative" }}>
            <Avatar first={form.name.split(" ")[0] || "?"} last={form.name.split(" ")[1] || "P"} photo={form.photo} color="var(--purple)" size={60} />
            <button onClick={() => photoRef.current?.click()} style={{ position: "absolute", bottom: -4, right: -4, width: 22, height: 22, borderRadius: "50%", background: "var(--accent)", border: "2px solid var(--surface)", fontSize: 11, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
          </div>
          <div style={{ fontSize: 13, color: "var(--text-sec)" }}>Upload a photo or initials will be used.</div>
          <input ref={photoRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhoto} />
        </div>
        <div className="fr2">
          <div className="fg"><label className="label">Full Name *</label><input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="First Last" /></div>
          <div className="fg"><label className="label">Role</label>
            <select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}>
              <option>Peer Support Specialist</option>
              <option>House Manager</option>
              <option>Lead Peer Specialist</option>
              <option>Program Coordinator</option>
              <option>Housing Director</option>
            </select>
          </div>
        </div>
        <div className="fr2">
          <div className="fg"><label className="label">Email</label><input value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="email@barbell.org" /></div>
          <div className="fg"><label className="label">Phone</label><input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="(555) 000-0000" /></div>
        </div>
        <div className="fr2">
          <div className="fg"><label className="label">Primary House</label>
            <select value={form.primaryHouse} onChange={(e) => setForm((f) => ({ ...f, primaryHouse: e.target.value }))}>
              <option value="">None</option>{houses.filter((h) => h.status !== "Inactive").map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
            </select>
          </div>
          <div className="fg"><label className="label">Status</label>
            <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}><option>Active</option><option>Inactive</option></select>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
          <button className="btn-ghost" onClick={() => { setShowAdd(false); setEditPeerId(null); }}>Cancel</button>
          <button className="btn-primary" onClick={savePeer}>{editPeerId ? "Save Changes" : "Add Peer"}</button>
        </div>
      </Modal>
    </div>
  );
}

// ─── Peer Profile ──────────────────────────────────────────────────────────
function PeerProfile({ peer, peers, setPeers, ledger, houses, onBack, isOwnProfile, isAdmin, onEdit, onArchive }) {
  const [monthVal, setMonthVal]       = useState(MONTH_OPTIONS[0].value);
  const [report, setReport]           = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [expandedId, setExpandedId]   = useState(null);
  const [copied, setCopied]           = useState(false);

  const pLedger = ledger
    .filter((e) => e.authorEmail === peer.email || e.authorName === peer.name)
    .sort((a, b) => new Date(b.serviceDate || b.date) - new Date(a.serviceDate || a.date));

  const thisMonth    = MONTH_OPTIONS[0].value;
  const monthLabel   = MONTH_OPTIONS.find((m) => m.value === monthVal)?.label || "";
  const monthEntries = entriesForMonth(pLedger, monthVal);
  const monthHrs     = monthEntries.reduce((s, e) => s + e.mins / 60, 0);
  const daysWorked   = [...new Set(monthEntries.map((e) => e.serviceDate || e.date?.split("T")[0]))].length;
  const totalHrs     = pLedger.reduce((s, e) => s + e.mins / 60, 0);

  // House distribution this month
  const houseHrs = houses.map((h) => ({
    house: h,
    hrs: monthEntries.filter((e) => e.houseId === h.id).reduce((s, e) => s + e.mins / 60, 0),
  })).filter((x) => x.hrs > 0).sort((a, b) => b.hrs - a.hrs);

  const genReport = async () => {
    setReportLoading(true);
    const barriers = [...new Set(monthEntries.flatMap((e) =>
      (e.soaip?.intervention || "").split(/[.,;]/).map((s) => s.trim()).filter((s) => s.length > 10)
    ))].slice(0, 5);
    const prompt = `You are writing a monthly peer support activity report for a staff member.

PEER NAME: ${peer.name}
ROLE: ${peer.role}
REPORT MONTH: ${monthLabel}
TOTAL SERVICES: ${monthEntries.length}
TOTAL HOURS: ${monthHrs.toFixed(1)}
DAYS WORKED: ${daysWorked}
HOUSES SERVED: ${houseHrs.map((x) => x.house.name + " (" + x.hrs.toFixed(1) + "h)").join(", ") || "none"}
COMMON BARRIERS ADDRESSED: ${barriers.join("; ") || "various recovery barriers"}

Write a structured peer monthly report with these sections. Use professional language appropriate for a peer support program. No clinical language.

SECTIONS:
1. Activity Summary — 2–3 sentences summarizing the peer's service activity this month
2. Houses Served — brief description of work across houses
3. Barriers Addressed — summary of common barriers the peer helped clients address
4. Notable Engagement — 1–2 sentences on observations about client engagement
5. Continued Service Plan — 1–2 sentences on continued service focus

Respond ONLY with valid JSON:
{"activitySummary":"...","housesServed":"...","barriersAddressed":"...","notableEngagement":"...","continuedPlan":"..."}`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 700,
          system: "You write professional peer support monthly staff reports. No clinical language. Respond only with valid JSON.",
          messages: [{ role: "user", content: prompt }] }),
      });
      const data = await res.json();
      const text = data.content?.find((b) => b.type === "text")?.text || "";
      setReport(JSON.parse(text.replace(/```json|```/g, "").trim()));
    } catch { setReport(null); }
    setReportLoading(false);
  };

  const reportText = report ? [
    `PEER MONTHLY REPORT`, `Peer: ${peer.name}`, `Role: ${peer.role}`, `Month: ${monthLabel}`,
    `Total Services: ${monthEntries.length} | Total Hours: ${monthHrs.toFixed(1)}h | Days Worked: ${daysWorked}`,
    ``, `ACTIVITY SUMMARY\n${report.activitySummary}`,
    ``, `HOUSES SERVED\n${report.housesServed}`,
    ``, `BARRIERS ADDRESSED\n${report.barriersAddressed}`,
    ``, `NOTABLE ENGAGEMENT\n${report.notableEngagement}`,
    ``, `CONTINUED SERVICE PLAN\n${report.continuedPlan}`,
  ].join("\n") : "";

  const primaryHouse = houses.find((h) => h.id === peer.primaryHouse);
  const isArchived   = peer.status === "Archived";

  return (
    <div className="fade-in page-wrap" style={{ maxWidth: 1000 }}>
      {/* Back nav + actions */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        {onBack
          ? <button className="btn-ghost btn-sm" onClick={onBack}>← Peers</button>
          : <div />}
        {(isAdmin || isOwnProfile) && onEdit && (
          <ProfileMenu onEdit={onEdit} onArchive={onArchive} isArchived={isArchived} />
        )}
      </div>

      {isArchived && (
        <div style={{ background: "var(--red-dim)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 10, padding: "11px 16px", marginBottom: 16, fontSize: 13, color: "var(--red)", display: "flex", alignItems: "center", gap: 8 }}>
          ⊘ This profile is archived. Service history is preserved for reporting purposes.
        </div>
      )}

      {/* Profile header */}
      <div className="card" style={{ marginBottom: 20, borderTop: "3px solid var(--purple)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
          <Avatar first={peer.name.split(" ")[0]} last={peer.name.split(" ")[1] || "P"} photo={peer.photo} color="var(--purple)" size={72} />
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{peer.name}</div>
            <div style={{ fontSize: 13, color: "var(--text-sec)", marginBottom: 8 }}>{peer.role}</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <span className={`badge badge-${peer.status === "Active" ? "green" : isArchived ? "red" : "amber"}`}>{peer.status}</span>
              {peer.email && <span style={{ fontSize: 12, color: "var(--text-sec)" }}>✉ {peer.email}</span>}
              {peer.phone && <span style={{ fontSize: 12, color: "var(--text-sec)" }}>📞 {peer.phone}</span>}
              {primaryHouse && <span style={{ fontSize: 12, color: "var(--text-sec)" }}>📍 {primaryHouse.name}</span>}
            </div>
          </div>
          {/* Stat tiles */}
          <div className="peer-stats" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {[
              { label: "Month Hrs",   value: monthHrs.toFixed(1) + "h" },
              { label: "Month Svcs",  value: monthEntries.length },
              { label: "Days Worked", value: daysWorked },
            ].map(({ label, value }) => (
              <div key={label} style={{ background: "var(--bg)", borderRadius: 10, padding: "12px 14px", border: "1px solid var(--border)", textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: "var(--purple)", fontFamily: "DM Mono, monospace", lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: 10, color: "var(--text-dim)", marginTop: 3, textTransform: "uppercase", letterSpacing: "0.8px" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* House distribution */}
      {houseHrs.length > 0 && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: "var(--text-sec)" }}>
            House Distribution — {MONTH_OPTIONS.find((m) => m.value === thisMonth)?.label}
          </div>
          {houseHrs.map(({ house: h, hrs }) => {
            const pct = totalHrs > 0 ? (hrs / totalHrs * 100) : 0;
            return (
              <div key={h.id} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 13 }}>{h.name}</span>
                  <span style={{ fontSize: 12, fontFamily: "DM Mono, monospace", color: h.color }}>{hrs.toFixed(1)} hrs</span>
                </div>
                <div style={{ height: 5, background: "var(--border)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: h.color, borderRadius: 4, transition: "width 0.5s" }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Monthly report generator */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: report ? 16 : 0, flexWrap: "wrap" }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Generate Peer Monthly Report</div>
          <select value={monthVal} onChange={(e) => { setMonthVal(e.target.value); setReport(null); }} style={{ width: "auto", padding: "6px 12px", fontSize: 13 }}>
            {MONTH_OPTIONS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
          <button className="btn-primary btn-sm" onClick={genReport} disabled={reportLoading}>
            {reportLoading ? <><span className="spin" style={{ display: "inline-block", marginRight: 6 }}>◌</span>Generating…</> : "Generate Report"}
          </button>
        </div>
        {report && (
          <div className="fade-in">
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>
              {peer.name} · {monthLabel}
            </div>
            {[
              { label: "Activity Summary",      text: report.activitySummary,   color: "var(--accent)" },
              { label: "Houses Served",          text: report.housesServed,      color: "var(--green)" },
              { label: "Barriers Addressed",     text: report.barriersAddressed, color: "var(--red)" },
              { label: "Notable Engagement",     text: report.notableEngagement, color: "var(--purple)" },
              { label: "Continued Service Plan", text: report.continuedPlan,     color: "var(--amber)" },
            ].map(({ label, text, color }) => (
              <div key={label} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color, marginBottom: 4, letterSpacing: "0.5px", textTransform: "uppercase" }}>{label}</div>
                <div style={{ fontSize: 13, lineHeight: 1.75, color: "var(--text-sec)", background: "var(--bg)", borderRadius: 8, padding: "10px 14px", borderLeft: `3px solid ${color}` }}>{text}</div>
              </div>
            ))}
            <ReportActions text={reportText} filename={`${peer.name.replace(" ", "_")}_${monthVal}_report.txt`}
              copied={copied} onCopy={() => { copyText(reportText); setCopied(true); setTimeout(() => setCopied(false), 2000); }} />
          </div>
        )}
      </div>

      {/* Service ledger */}
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
          Service Ledger
          <span className="badge badge-purple">{pLedger.length} entries</span>
        </div>
        {pLedger.length === 0 && (
          <div className="card" style={{ textAlign: "center", padding: 32, color: "var(--text-dim)" }}>No services recorded yet.</div>
        )}
        {pLedger.length > 0 && (
          <div className="card table-scroll" style={{ padding: 0, overflow: "hidden" }}>
            <div className="table-inner">
            <div style={{ display: "grid", gridTemplateColumns: "130px 1fr 120px 90px 28px", gap: 0, padding: "10px 18px", background: "var(--bg)", borderBottom: "1px solid var(--border)" }}>
              {["Date", "Client", "House", "Duration", ""].map((h) => (
                <div key={h} style={{ fontSize: 10, fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.8px" }}>{h}</div>
              ))}
            </div>
            {pLedger.map((entry, idx) => {
              const isExpanded = expandedId === entry.id;
              const isLast = idx === pLedger.length - 1;
              return (
                <div key={entry.id}>
                  <div onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                    style={{ display: "grid", gridTemplateColumns: "130px 1fr 120px 90px 28px", gap: 0, padding: "12px 18px", cursor: "pointer", borderBottom: isExpanded || !isLast ? "1px solid var(--border)" : "none", background: isExpanded ? "var(--card-hover)" : "transparent", transition: "background 0.15s" }}
                    onMouseEnter={(e) => { if (!isExpanded) e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                    onMouseLeave={(e) => { if (!isExpanded) e.currentTarget.style.background = "transparent"; }}
                  >
                    <div style={{ fontSize: 13 }}>{entry.serviceDate ? fmtDate(entry.serviceDate) : fmtDate(entry.date)}</div>
                    <div style={{ fontSize: 12 }}><span className="badge badge-blue" style={{ fontSize: 11 }}>{entry.serviceType}</span></div>
                    <div style={{ fontSize: 12, color: "var(--text-sec)" }}>{houses.find((h) => h.id === entry.houseId)?.name || "—"}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--purple)", fontFamily: "DM Mono, monospace" }}>{entry.duration}</div>
                    <div style={{ fontSize: 11, color: "var(--text-dim)", alignSelf: "center" }}>{isExpanded ? "▲" : "▼"}</div>
                  </div>
                  {isExpanded && entry.soaip && (
                    <div className="fade-in" style={{ padding: "16px 20px", background: "var(--bg)", borderBottom: isLast ? "none" : "1px solid var(--border)" }}>
                      <SOAIPDisplay soaip={entry.soaip} />
                    </div>
                  )}
                </div>
              );
            })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── My Ledger (Peer view of own services) ─────────────────────────────────
function MyLedger({ user, ledger, houses }) {
  const [expandedId, setExpandedId] = useState(null);
  const myEntries = ledger
    .filter((e) => e.authorEmail === user.email || e.authorName === user.name)
    .sort((a, b) => new Date(b.serviceDate || b.date) - new Date(a.serviceDate || a.date));
  const totalHrs = myEntries.reduce((s, e) => s + e.mins / 60, 0);

  return (
    <div className="fade-in page-wrap" style={{ maxWidth: 900 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>My Ledger</div>
        <div style={{ color: "var(--text-sec)", fontSize: 14 }}>{myEntries.length} services · {totalHrs.toFixed(1)} hours</div>
      </div>
      {myEntries.length === 0 && (
        <div className="card" style={{ textAlign: "center", padding: 48, color: "var(--text-dim)" }}>
          <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.3 }}>≡</div>
          No services recorded yet.
        </div>
      )}
      {myEntries.length > 0 && (
        <div className="card table-scroll" style={{ padding: 0, overflow: "hidden" }}>
          <div className="table-inner">
          <div style={{ display: "grid", gridTemplateColumns: "130px 100px 100px 90px 1fr 28px", gap: 0, padding: "10px 18px", background: "var(--bg)", borderBottom: "1px solid var(--border)" }}>
            {["Date", "Start", "End", "Duration", "Service Type", ""].map((h) => (
              <div key={h} style={{ fontSize: 10, fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.8px" }}>{h}</div>
            ))}
          </div>
          {myEntries.map((entry, idx) => {
            const isExpanded = expandedId === entry.id;
            const isLast = idx === myEntries.length - 1;
            const house = houses.find((h) => h.id === entry.houseId);
            return (
              <div key={entry.id}>
                <div onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                  style={{ display: "grid", gridTemplateColumns: "130px 100px 100px 90px 1fr 28px", gap: 0, padding: "12px 18px", cursor: "pointer", borderBottom: isExpanded || !isLast ? "1px solid var(--border)" : "none", background: isExpanded ? "var(--card-hover)" : "transparent", transition: "background 0.15s" }}
                  onMouseEnter={(e) => { if (!isExpanded) e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                  onMouseLeave={(e) => { if (!isExpanded) e.currentTarget.style.background = "transparent"; }}
                >
                  <div style={{ fontSize: 13 }}>{entry.serviceDate ? fmtDate(entry.serviceDate) : fmtDate(entry.date)}</div>
                  <div style={{ fontSize: 13, color: "var(--text-sec)" }}>{entry.startTime ? fmtTimeLabel(entry.startTime) : "—"}</div>
                  <div style={{ fontSize: 13, color: "var(--text-sec)" }}>{entry.endTime ? fmtTimeLabel(entry.endTime) : "—"}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: house?.color || "var(--accent)", fontFamily: "DM Mono, monospace" }}>{entry.duration}</div>
                  <div style={{ fontSize: 12 }}><span className="badge badge-blue" style={{ fontSize: 11 }}>{entry.serviceType}</span></div>
                  <div style={{ fontSize: 11, color: "var(--text-dim)", alignSelf: "center" }}>{isExpanded ? "▲" : "▼"}</div>
                </div>
                {isExpanded && entry.soaip && (
                  <div className="fade-in" style={{ padding: "16px 20px", background: "var(--bg)", borderBottom: isLast ? "none" : "1px solid var(--border)" }}>
                    <SOAIPDisplay soaip={entry.soaip} />
                  </div>
                )}
              </div>
            );
          })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── My Reports (Peer's own monthly reports) ───────────────────────────────
function MyReports({ user, ledger, houses }) {
  const [monthVal, setMonthVal]         = useState(MONTH_OPTIONS[0].value);
  const [report, setReport]             = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [copied, setCopied]             = useState(false);

  const myEntries   = ledger.filter((e) => e.authorEmail === user.email || e.authorName === user.name);
  const monthLabel  = MONTH_OPTIONS.find((m) => m.value === monthVal)?.label || "";
  const monthEntries = entriesForMonth(myEntries, monthVal);
  const monthHrs    = monthEntries.reduce((s, e) => s + e.mins / 60, 0);
  const daysWorked  = [...new Set(monthEntries.map((e) => e.serviceDate || e.date?.split("T")[0]))].length;
  const houseHrs    = houses.map((h) => ({ house: h, hrs: monthEntries.filter((e) => e.houseId === h.id).reduce((s, e) => s + e.mins / 60, 0) })).filter((x) => x.hrs > 0);

  const genReport = async () => {
    setReportLoading(true);
    const prompt = `You are writing a monthly peer support activity report for a staff member.

PEER NAME: ${user.name}
REPORT MONTH: ${monthLabel}
TOTAL SERVICES: ${monthEntries.length}
TOTAL HOURS: ${monthHrs.toFixed(1)}
DAYS WORKED: ${daysWorked}
HOUSES SERVED: ${houseHrs.map((x) => x.house.name + " (" + x.hrs.toFixed(1) + "h)").join(", ") || "none recorded"}

Write a structured peer monthly report. Use professional peer support language. No clinical language.

SECTIONS:
1. Activity Summary — 2–3 sentences on service activity this month
2. Houses Served — brief description of work across houses  
3. Barriers Addressed — summary of barriers addressed
4. Notable Engagement — 1–2 sentences on client engagement observations
5. Continued Service Plan — 1–2 sentences on focus for next month

Respond ONLY with valid JSON:
{"activitySummary":"...","housesServed":"...","barriersAddressed":"...","notableEngagement":"...","continuedPlan":"..."}`;
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 700,
          system: "You write professional peer support monthly staff reports. No clinical language. Respond only with valid JSON.",
          messages: [{ role: "user", content: prompt }] }),
      });
      const data = await res.json();
      const text = data.content?.find((b) => b.type === "text")?.text || "";
      setReport(JSON.parse(text.replace(/```json|```/g, "").trim()));
    } catch { setReport(null); }
    setReportLoading(false);
  };

  const reportText = report ? [
    `MY MONTHLY REPORT`, `Peer: ${user.name}`, `Month: ${monthLabel}`,
    `Services: ${monthEntries.length} | Hours: ${monthHrs.toFixed(1)}h | Days: ${daysWorked}`,
    ``, `ACTIVITY SUMMARY\n${report.activitySummary}`,
    ``, `HOUSES SERVED\n${report.housesServed}`,
    ``, `BARRIERS ADDRESSED\n${report.barriersAddressed}`,
    ``, `NOTABLE ENGAGEMENT\n${report.notableEngagement}`,
    ``, `CONTINUED SERVICE PLAN\n${report.continuedPlan}`,
  ].join("\n") : "";

  return (
    <div className="fade-in page-wrap" style={{ maxWidth: 800 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>My Reports</div>
        <div style={{ color: "var(--text-sec)", fontSize: 14 }}>Generate your monthly activity report</div>
      </div>
      <div className="card">
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          <select value={monthVal} onChange={(e) => { setMonthVal(e.target.value); setReport(null); }} style={{ width: "auto", padding: "8px 12px" }}>
            {MONTH_OPTIONS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
          <div style={{ fontSize: 13, color: "var(--text-sec)" }}>{monthEntries.length} services · {monthHrs.toFixed(1)}h · {daysWorked} days</div>
          <button className="btn-primary btn-sm" style={{ marginLeft: "auto" }} onClick={genReport} disabled={reportLoading}>
            {reportLoading ? <><span className="spin" style={{ display: "inline-block", marginRight: 6 }}>◌</span>Generating…</> : "Generate Report"}
          </button>
        </div>
        {report && (
          <div className="fade-in">
            {[
              { label: "Activity Summary",      text: report.activitySummary,   color: "var(--accent)" },
              { label: "Houses Served",          text: report.housesServed,      color: "var(--green)" },
              { label: "Barriers Addressed",     text: report.barriersAddressed, color: "var(--red)" },
              { label: "Notable Engagement",     text: report.notableEngagement, color: "var(--purple)" },
              { label: "Continued Service Plan", text: report.continuedPlan,     color: "var(--amber)" },
            ].map(({ label, text, color }) => (
              <div key={label} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color, marginBottom: 4, letterSpacing: "0.5px", textTransform: "uppercase" }}>{label}</div>
                <div style={{ fontSize: 13, lineHeight: 1.75, color: "var(--text-sec)", background: "var(--bg)", borderRadius: 8, padding: "10px 14px", borderLeft: `3px solid ${color}` }}>{text}</div>
              </div>
            ))}
            <ReportActions text={reportText} filename={`my_report_${monthVal}.txt`}
              copied={copied} onCopy={() => { copyText(reportText); setCopied(true); setTimeout(() => setCopied(false), 2000); }} />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── My Profile (Peer's own profile view) ─────────────────────────────────
function MyProfile({ user, peers, setPeers, ledger, houses }) {
  const [editOpen, setEditOpen]   = useState(false);
  const [editForm, setEditForm]   = useState({});
  const photoRef = useRef();

  const peer = peers.find((p) => p.email === user.email);

  const openEdit = () => {
    if (!peer) return;
    setEditForm({ name: peer.name, role: peer.role, status: peer.status, phone: peer.phone || "", email: peer.email || "", primaryHouse: peer.primaryHouse || "", secondaryHouses: peer.secondaryHouses || [], photo: peer.photo || "" });
    setEditOpen(true);
  };

  const saveEdit = () => {
    if (!peer) return;
    const updated = peers.map((p) => p.id === peer.id ? { ...p, ...editForm } : p);
    setPeers(updated); LS.set("pb_peers", updated); setEditOpen(false);
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setEditForm((f) => ({ ...f, photo: ev.target.result }));
    reader.readAsDataURL(file);
  };

  if (!peer) return (
    <div className="fade-in page-wrap" style={{ maxWidth: 600 }}>
      <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>My Profile</div>
      <div className="card" style={{ textAlign: "center", padding: 40, color: "var(--text-dim)" }}>
        <div style={{ fontSize: 28, marginBottom: 12, opacity: 0.3 }}>◉</div>
        <div style={{ marginBottom: 16 }}>No peer profile found for your account.</div>
        <div style={{ fontSize: 13, color: "var(--text-sec)" }}>Ask an Admin to create your peer profile so your service history appears here.</div>
      </div>
    </div>
  );

  return (
    <>
      <PeerProfile peer={peer} peers={peers} setPeers={setPeers} ledger={ledger} houses={houses}
        isOwnProfile onEdit={openEdit} onArchive={null} />

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit My Profile" width={500}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <div style={{ position: "relative" }}>
            <Avatar first={editForm.name?.split(" ")[0] || "?"} last={editForm.name?.split(" ")[1] || "P"} photo={editForm.photo} color="var(--purple)" size={60} />
            <button onClick={() => photoRef.current?.click()} style={{ position: "absolute", bottom: -4, right: -4, width: 22, height: 22, borderRadius: "50%", background: "var(--accent)", border: "2px solid var(--surface)", fontSize: 11, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
          </div>
          <div style={{ fontSize: 13, color: "var(--text-sec)" }}>Update your photo or contact info.</div>
          <input ref={photoRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhoto} />
        </div>
        <div className="fr2">
          <div className="fg"><label className="label">Name</label><input value={editForm.name || ""} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} /></div>
          <div className="fg"><label className="label">Role</label>
            <select value={editForm.role || ""} onChange={(e) => setEditForm((f) => ({ ...f, role: e.target.value }))}>
              <option>Peer Support Specialist</option><option>House Manager</option><option>Lead Peer Specialist</option><option>Program Coordinator</option><option>Housing Director</option>
            </select>
          </div>
        </div>
        <div className="fr2">
          <div className="fg"><label className="label">Phone</label><input value={editForm.phone || ""} onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))} placeholder="(555) 000-0000" /></div>
          <div className="fg"><label className="label">Email</label><input value={editForm.email || ""} onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))} placeholder="email@barbell.org" /></div>
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
          <button className="btn-ghost" onClick={() => setEditOpen(false)}>Cancel</button>
          <button className="btn-primary" onClick={saveEdit}>Save Changes</button>
        </div>
      </Modal>
    </>
  );
}

// ─── House Report Generator (inside HousesPage detail view) ────────────────
function HouseReportModal({ open, onClose, house, clients, ledger }) {
  const [monthVal, setMonthVal]   = useState(MONTH_OPTIONS[0].value);
  const [reports, setReports]     = useState(null);
  const [loading, setLoading]     = useState(false);
  const [copied, setCopied]       = useState(false);

  const houseClients = clients.filter((c) => c.houseId === house?.id);
  const monthLabel   = MONTH_OPTIONS.find((m) => m.value === monthVal)?.label || "";

  const generate = async () => {
    setLoading(true); setReports(null);
    const results = [];
    for (const client of houseClients) {
      const entries = entriesForMonth(ledger.filter((e) => e.clientId === client.id), monthVal);
      if (entries.length === 0) { results.push({ client, entries, report: null }); continue; }
      try {
        const report = await generateClientReport(client, house, entries, monthLabel);
        results.push({ client, entries, report });
      } catch {
        results.push({ client, entries, report: null });
      }
    }
    setReports(results);
    setLoading(false);
  };

  const fullText = reports ? [
    `HOUSE MONTHLY REPORT`, `House: ${house?.name}`, `Month: ${monthLabel}`, ``,
    ...reports.map(({ client, entries, report }) => {
      const hrs = entries.reduce((s, e) => s + e.mins / 60, 0).toFixed(1);
      if (!report) return `CLIENT: ${client.firstName} ${client.lastName[0]}.\nNo services recorded this month.\n`;
      return reportToText(client, house, entries, monthLabel, report);
    })
  ].join("\n---\n") : "";

  return (
    <Modal open={open} onClose={() => { onClose(); setReports(null); }} title={`House Report — ${house?.name}`} width={680}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <select value={monthVal} onChange={(e) => { setMonthVal(e.target.value); setReports(null); }} style={{ width: "auto" }}>
          {MONTH_OPTIONS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>
        <button className="btn-primary btn-sm" onClick={generate} disabled={loading}>
          {loading ? <><span className="spin" style={{ display: "inline-block", marginRight: 6 }}>◌</span>Generating {houseClients.length} reports…</> : `Generate Reports (${houseClients.length} clients)`}
        </button>
      </div>
      {reports && (
        <div className="fade-in">
          {reports.map(({ client, entries, report }) => (
            <div key={client.id} style={{ marginBottom: 20, borderBottom: "1px solid var(--border)", paddingBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{client.firstName} {client.lastName[0]}.</div>
                <span className="badge badge-blue">{entries.length} services</span>
              </div>
              {report
                ? <ClientReportDisplay client={client} house={house} entries={entries} monthLabel={monthLabel} report={report} />
                : <div style={{ fontSize: 13, color: "var(--text-dim)", padding: "12px 0" }}>No services recorded for this client in {monthLabel}.</div>
              }
            </div>
          ))}
          <ReportActions text={fullText} filename={`${house?.name}_${monthVal}_report.txt`}
            copied={copied} onCopy={() => { copyText(fullText); setCopied(true); setTimeout(() => setCopied(false), 2000); }} />
        </div>
      )}
    </Modal>
  );
}

// ─── Profiles ──────────────────────────────────────────────────────────────
const PROFILE_ROLES = [
  "Peer",
  "Housing Manager",
  "Housing Director",
  "Clinical Director",
  "Admin",
];

const SINGLETON_ROLES = ["Housing Director", "Clinical Director"];

function getStoredProfiles() {
  try {
    const raw = localStorage.getItem("profiles");
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveProfiles(profiles) {
  try { localStorage.setItem("profiles", JSON.stringify(profiles)); } catch {}
}

function ProfilesPage({ user }) {
  const [profiles, setProfiles] = useState(() => getStoredProfiles());
  const [showAdd, setShowAdd]   = useState(false);
  const [name, setName]         = useState("");
  const [role, setRole]         = useState(PROFILE_ROLES[0]);
  const [err, setErr]           = useState("");

  // Only Admin and Housing Director have create/delete rights.
  // Housing Director acts as the default Admin.
  const isPrivileged = user?.role === "Admin" || user?.role === "Housing Director";

  const addProfile = () => {
    if (!name.trim()) { setErr("Name is required."); return; }

    // Enforce singleton roles
    if (SINGLETON_ROLES.includes(role)) {
      const exists = profiles.some((p) => p.role === role);
      if (exists) {
        setErr(`Only one ${role} profile is allowed.`);
        return;
      }
    }

    const newProfile = {
      id:   profiles.length > 0 ? Math.max(...profiles.map((p) => p.id)) + 1 : 1,
      name: name.trim(),
      role,
    };
    const updated = [...profiles, newProfile];
    setProfiles(updated);
    saveProfiles(updated);
    setName(""); setRole(PROFILE_ROLES[0]); setErr(""); setShowAdd(false);
  };

  const deleteProfile = (id) => {
    const target = profiles.find((p) => p.id === id);
    if (target && target.name === user?.name) {
      alert("You cannot delete your own profile.");
      return;
    }
    const updated = profiles.filter((p) => p.id !== id);
    setProfiles(updated);
    saveProfiles(updated);
  };

  const badgeClass = (r) => {
    if (r === "Admin")             return "badge-blue";
    if (r === "Clinical Director") return "badge-red";
    if (r === "Housing Director")  return "badge-amber";
    if (r === "Housing Manager")   return "badge-green";
    return "badge-purple";
  };

  const avatarStyle = (r) => ({
    background: (r === "Admin" || r === "Housing Director") ? "var(--accent-dim)" : "var(--purple-dim)",
    color:      (r === "Admin" || r === "Housing Director") ? "var(--accent)"     : "var(--purple)",
  });

  return (
    <div className="fade-in page-wrap" style={{ maxWidth: 700 }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Profiles</div>
        <div style={{ color: "var(--text-sec)", fontSize: 14 }}>Local profiles stored in this browser</div>
      </div>

      {/* Profile list */}
      <div className="card" style={{ marginBottom: 16, padding: 0, overflow: "hidden" }}>
        {profiles.length === 0 && (
          <div style={{ padding: "32px 20px", textAlign: "center", color: "var(--text-dim)", fontSize: 13 }}>
            No profiles yet.{isPrivileged ? " Use the form below to create one." : ""}
          </div>
        )}
        {profiles.map((p, idx) => {
          const isSelf = p.name === user?.name;
          return (
            <div key={p.id} style={{
              display: "flex", alignItems: "center", gap: 14,
              padding: "14px 20px",
              borderBottom: idx < profiles.length - 1 ? "1px solid var(--border)" : "none",
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 700,
                ...avatarStyle(p.role),
              }}>
                {p.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>
                  {p.name}
                  {isSelf && <span style={{ fontSize: 11, color: "var(--text-dim)", marginLeft: 8 }}>(you)</span>}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-sec)", marginTop: 2 }}>{p.role}</div>
              </div>
              <span className={`badge ${badgeClass(p.role)}`}>{p.role}</span>
              {isPrivileged && !isSelf && (
                <button
                  onClick={() => deleteProfile(p.id)}
                  style={{
                    marginLeft: 8, background: "var(--red-dim)", border: "1px solid rgba(248,113,113,0.2)",
                    color: "var(--red)", borderRadius: 6, padding: "4px 10px", fontSize: 12,
                    cursor: "pointer", flexShrink: 0,
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(248,113,113,0.2)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "var(--red-dim)"}
                >Delete</button>
              )}
            </div>
          );
        })}
      </div>

      {/* Add profile — only visible to privileged roles */}
      {isPrivileged && (
        showAdd ? (
          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14, color: "var(--text-sec)" }}>New Profile</div>
            <div className="fg">
              <label className="label">Name *</label>
              <input value={name} onChange={(e) => { setName(e.target.value); setErr(""); }} placeholder="Full name"
                onKeyDown={(e) => e.key === "Enter" && addProfile()} autoFocus />
            </div>
            <div className="fg">
              <label className="label">Role</label>
              <select value={role} onChange={(e) => { setRole(e.target.value); setErr(""); }}>
                {PROFILE_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            {err && <div style={{ fontSize: 13, color: "var(--red)", marginBottom: 12 }}>{err}</div>}
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
              <button className="btn-ghost btn-sm" onClick={() => { setShowAdd(false); setName(""); setRole(PROFILE_ROLES[0]); setErr(""); }}>Cancel</button>
              <button className="btn-primary btn-sm" onClick={addProfile}>Save Profile</button>
            </div>
          </div>
        ) : (
          <button className="btn-primary btn-sm" onClick={() => setShowAdd(true)}>+ Add Profile</button>
        )
      )}
    </div>
  );
}

// ─── App Root ──────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser]             = useState(() => LS.get("pb_user", null));
  const [page, setPage]             = useState("dashboard");
  const [houses, setHouses]         = useState(() => LS.get("pb_houses", []));
  const [clients, setClients]       = useState(() => LS.get("pb_clients", []));
  const [ledger, setLedger]         = useState(() => LS.get("pb_ledger", []));
  const [peers, setPeers]           = useState(() => LS.get("pb_peers", []));
  const [generateTarget, setGenerateTarget] = useState(null);

  const isAdmin = user?.role === "Admin";

  const handleLogin  = (u) => { setUser(u); LS.set("pb_user", u); setPage(u.role === "Admin" ? "dashboard" : "generate"); };
  const handleLogout = () => { setUser(null); LS.set("pb_user", null); setPage("dashboard"); };

  if (!user) return (
    <>
      <style>{css}</style>
      <LoginScreen onLogin={handleLogin} />
    </>
  );

  const sharedProps = { houses, clients, ledger, setLedger };

  const pages = {
    // Admin pages
    dashboard:       <Dashboard {...sharedProps} setPage={setPage} setGenerateTarget={setGenerateTarget} />,
    houses:          <HousesPage {...sharedProps} setPage={setPage} setGenerateTarget={setGenerateTarget} peers={peers} />,
    housemanagement: <HouseManagementPage houses={houses} setHouses={setHouses} clients={clients} ledger={ledger} />,
    clients:         <ClientsPage {...sharedProps} setClients={setClients} setPage={setPage} setGenerateTarget={setGenerateTarget} user={user} />,
    peers:           <PeersPage peers={peers} setPeers={setPeers} ledger={ledger} houses={houses} />,
    ledger:          <LedgerPage {...sharedProps} user={user} />,
    // Shared
    generate:        <GeneratePage {...sharedProps} generateTarget={generateTarget} setGenerateTarget={setGenerateTarget} user={user} />,
    // Admin extras
    profiles:        <ProfilesPage user={user} />,
    // Peer-only pages
    myledger:        <MyLedger user={user} ledger={ledger} houses={houses} />,
    myreports:       <MyReports user={user} ledger={ledger} houses={houses} />,
    myprofile:       <MyProfile user={user} peers={peers} setPeers={setPeers} ledger={ledger} houses={houses} />,
  };

  const validPage = (!isAdmin && !["generate","myledger","myreports","myprofile"].includes(page))
    ? "generate"
    : page;

  return (
    <>
      <style>{css}</style>
      {/* Mobile header + hamburger dropdown — rendered outside app-shell flex container */}
      <MobileNav page={validPage} setPage={setPage} user={user} onLogout={handleLogout} />
      {/* Desktop app shell — sidebar + content side by side */}
      <div className="app-shell">
        <DesktopSidebar page={validPage} setPage={setPage} user={user} onLogout={handleLogout} />
        <div className="app-content">
          {pages[validPage] || (isAdmin ? pages.dashboard : pages.generate)}
        </div>
      </div>
    </>
  );
}
