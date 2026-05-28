import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════
   GLOBAL STYLES — injected once
═══════════════════════════════════════════════════════════════ */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500;700&family=Nunito:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --c-bg:       #060c18;
    --c-surface:  #0d1526;
    --c-surface2: #111d33;
    --c-border:   rgba(255,255,255,0.07);
    --c-border2:  rgba(255,255,255,0.12);
    --c-text:     #dde6f5;
    --c-muted:    #5a7093;
    --c-dim:      #2c3e57;
    --c-green:    #22d37a;
    --c-green2:   #16a860;
    --c-blue:     #4da6ff;
    --c-amber:    #f5a623;
    --c-red:      #ff5c6b;
    --c-purple:   #a78bfa;
    --font-display: 'Syne', sans-serif;
    --font-mono:    'JetBrains Mono', monospace;
    --font-body:    'Nunito', sans-serif;
    --radius-sm: 8px;
    --radius-md: 14px;
    --radius-lg: 20px;
    --radius-xl: 28px;
    --shadow-sm:  0 2px 12px rgba(0,0,0,0.3);
    --shadow-md:  0 8px 32px rgba(0,0,0,0.4);
    --shadow-lg:  0 16px 48px rgba(0,0,0,0.5);
    --glow-green: 0 0 24px rgba(34,211,122,0.15);
    --glow-blue:  0 0 24px rgba(77,166,255,0.15);
  }

  html, body, #root { height: 100%; }

  body {
    background: var(--c-bg);
    color: var(--c-text);
    font-family: var(--font-body);
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--c-dim); border-radius: 99px; }

  button { cursor: pointer; font-family: var(--font-body); }
  textarea, input { font-family: var(--font-body); }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.5; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  @keyframes ringPop {
    0%   { transform: scale(0.95); opacity: 0; }
    60%  { transform: scale(1.03); }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes streakIn {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }

  .fade-up { animation: fadeUp 0.45s ease both; }
  .fade-in { animation: fadeIn 0.3s ease both; }

  .card {
    background: var(--c-surface);
    border: 1px solid var(--c-border);
    border-radius: var(--radius-lg);
    padding: 20px 22px;
    box-shadow: var(--shadow-sm);
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .card:hover { border-color: var(--c-border2); }

  .card-title {
    font-family: var(--font-display);
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--c-muted);
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .btn {
    border: none;
    border-radius: var(--radius-sm);
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 13px;
    letter-spacing: 0.04em;
    padding: 10px 18px;
    transition: all 0.18s;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }
  .btn:active { transform: scale(0.97); }

  .btn-ghost {
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--c-border2);
    color: var(--c-muted);
  }
  .btn-ghost:hover { background: rgba(255,255,255,0.08); color: var(--c-text); }

  .btn-green {
    background: rgba(34,211,122,0.12);
    border: 1px solid rgba(34,211,122,0.35);
    color: var(--c-green);
  }
  .btn-green:hover { background: rgba(34,211,122,0.2); box-shadow: var(--glow-green); }

  .btn-blue {
    background: rgba(77,166,255,0.12);
    border: 1px solid rgba(77,166,255,0.3);
    color: var(--c-blue);
  }
  .btn-blue:hover { background: rgba(77,166,255,0.2); box-shadow: var(--glow-blue); }

  .btn-amber {
    background: rgba(245,166,35,0.12);
    border: 1px solid rgba(245,166,35,0.3);
    color: var(--c-amber);
  }
  .btn-amber:hover { background: rgba(245,166,35,0.2); }

  .btn-red {
    background: rgba(255,92,107,0.1);
    border: 1px solid rgba(255,92,107,0.25);
    color: var(--c-red);
  }
  .btn-red:hover { background: rgba(255,92,107,0.18); }

  .pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 10px;
    border-radius: 99px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.04em;
  }

  .progress-track {
    height: 6px;
    background: rgba(255,255,255,0.06);
    border-radius: 99px;
    overflow: hidden;
  }
  .progress-fill {
    height: 100%;
    border-radius: 99px;
    transition: width 0.5s cubic-bezier(0.4,0,0.2,1);
    transform-origin: left;
  }

  /* RESPONSIVE */
  @media (max-width: 768px) {
    .hide-mobile { display: none !important; }
    .show-mobile { display: flex !important; }
  }
  @media (min-width: 769px) {
    .show-mobile { display: none !important; }
  }
`;

/* ═══════════════════════════════════════════════════════════════
   CONSTANTS & LOGIC
═══════════════════════════════════════════════════════════════ */
const STORAGE_KEY = "vocabflow_v5";
const TOTAL_DAYS = 18;
const GRAMMAR_PER_DAY = 5;
const WORK_SECS = 35 * 60;
const BREAK_SECS = 10 * 60;

function getVocabForDay(d) {
  if (d <= 0) return 0;
  if (d === 1) return 40;
  if (d <= 9) return 40 + (d - 1) * 7;
  if (d === 10) return 104;
  return 104 + (d - 10) * 7;
}

function redistributeMissed(missed, fromDay, total) {
  const remaining = total - fromDay;
  if (remaining <= 0 || missed <= 0) return {};
  const perDay = Math.ceil(missed / remaining);
  const dist = {};
  let left = missed;
  for (let d = fromDay + 1; d <= total && left > 0; d++) {
    const add = Math.min(perDay, left);
    dist[d] = add;
    left -= add;
  }
  return dist;
}

function buildDefaultState() {
  const days = {};
  for (let d = 1; d <= TOTAL_DAYS; d++) {
    days[d] = {
      vocabTarget: getVocabForDay(d),
      vocabDone: 0,
      grammarTarget: GRAMMAR_PER_DAY,
      grammarDone: 0,
      vocabExtra: 0,
      grammarExtra: 0,
      completed: false,
      notes: "",
    };
  }
  return {
    days,
    currentDay: 1,
    startDate: new Date().toISOString().slice(0, 10),
    pomodoro: { active: false, isWork: true, timeLeft: WORK_SECS, sessions: 0 },
    totalPomodoros: 0,
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...buildDefaultState(), ...JSON.parse(raw) } : buildDefaultState();
  } catch { return buildDefaultState(); }
}
function saveState(s) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {}
}

function pad2(n) { return String(n).padStart(2, "0"); }
function fmtTime(s) { return `${pad2(Math.floor(s / 60))}:${pad2(s % 60)}`; }

function dayLabel(startDate, day) {
  const d = new Date(startDate);
  d.setDate(d.getDate() + day - 1);
  return {
    weekday: d.toLocaleDateString("uz-UZ", { weekday: "short" }),
    date: d.toLocaleDateString("uz-UZ", { day: "numeric", month: "short" }),
  };
}

async function getAITip(phase, day, sessions) {
  const prompts = {
    work: `Sen eng zo'r, qiziqarli va kulgili o'zbek tili o'qituvchisi assistantisan. Foydalanuvchi ${day}-kun, ${sessions + 1}-pomodoro — 35 daqiqa lug'at va grammatika o'rganmoqda. Unga 3-4 jumlada juda energetik, biroz kulgili, lekin juda foydali maslahat ber. Xotirani mustahkamlash usuli, diqqatni to'plash sirlari yoki qiziqarli o'rganish hackini aytib ber. Emoji ishlat. Faqat o'zbek tilida.`,
    break: `Sen eng zo'r, kulgili o'zbek o'qituvchisi assistantisan. Foydalanuvchi ${sessions}-pomodoro tugatdi — 10 daqiqa dam olyapti. Unga dam olish paytida miya uchun foydali, kulgili, qiziqarli 3-4 jumla maslahat ber. Cho'zilish, suv, havo, miya isitish haqida. Emoji bilan. Faqat o'zbek tilida.`,
  };
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 350,
        messages: [{ role: "user", content: prompts[phase] }],
      }),
    });
    const data = await res.json();
    return data.content?.map(b => b.text || "").join("") || null;
  } catch { return null; }
}

/* ═══════════════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════════════ */
export default function App() {
  // inject global styles
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = GLOBAL_CSS;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  const [state, setState] = useState(loadState);
  const [tab, setTab] = useState("today");
  const [aiTip, setAiTip] = useState({ text: "", phase: "" });
  const [aiLoading, setAiLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [now, setNow] = useState(new Date());
  const timerRef = useRef(null);
  const audioRef = useRef(null);

  const { days, currentDay, startDate, pomodoro, totalPomodoros } = state;
  const today = days[currentDay];
  const vocabTotal = today.vocabTarget + today.vocabExtra;
  const gramTotal = today.grammarTarget + today.grammarExtra;
  const vocabPct = vocabTotal ? Math.min(100, Math.round(today.vocabDone / vocabTotal * 100)) : 0;
  const gramPct = gramTotal ? Math.min(100, Math.round(today.grammarDone / gramTotal * 100)) : 0;
  const completedCount = Object.values(days).filter(d => d.completed).length;
  const pomoDuration = pomodoro.isWork ? WORK_SECS : BREAK_SECS;
  const pomoPct = Math.round((pomoDuration - pomodoro.timeLeft) / pomoDuration * 100);

  // persist
  useEffect(() => { saveState(state); }, [state]);

  // clock
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // toast helper
  const showToast = useCallback((msg, type = "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  }, []);

  // beep
  const beep = useCallback((freq = 440, dur = 0.4, vol = 0.25) => {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      osc.start(); osc.stop(ctx.currentTime + dur);
      setTimeout(() => ctx.close(), dur * 1000 + 100);
    } catch {}
  }, []);

  // pomodoro
  useEffect(() => {
    if (!pomodoro.active) { clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(() => {
      setState(prev => {
        const p = prev.pomodoro;
        if (p.timeLeft <= 1) {
          const nextIsWork = !p.isWork;
          const nextSessions = p.isWork ? p.sessions + 1 : p.sessions;
          const nextTotalPomodoros = p.isWork ? prev.totalPomodoros + 1 : prev.totalPomodoros;
          beep(nextIsWork ? 330 : 660, 0.6);
          const phase = nextIsWork ? "work" : "break";
          setAiLoading(true);
          getAITip(phase, prev.currentDay, nextSessions).then(tip => {
            setAiTip({ text: tip || getFallback(phase), phase });
            setAiLoading(false);
          });
          showToast(nextIsWork ? "🍅 Yangi sessiya! Tayyor bo'ling!" : "☕ Dam olish vaqti keldi!", nextIsWork ? "green" : "blue");
          return {
            ...prev,
            totalPomodoros: nextTotalPomodoros,
            pomodoro: { active: true, isWork: nextIsWork, timeLeft: nextIsWork ? WORK_SECS : BREAK_SECS, sessions: nextSessions },
          };
        }
        return { ...prev, pomodoro: { ...p, timeLeft: p.timeLeft - 1 } };
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [pomodoro.active, beep, showToast]);

  // actions
  const setDay = useCallback((d) => {
    setState(prev => ({ ...prev, currentDay: d }));
    setTab("today");
  }, []);

  const updateField = useCallback((day, field, val) => {
    setState(prev => {
      const d = { ...prev.days[day], [field]: val };
      const vT = d.vocabTarget + d.vocabExtra;
      const gT = d.grammarTarget + d.grammarExtra;
      d.completed = d.vocabDone >= vT && d.grammarDone >= gT;
      return { ...prev, days: { ...prev.days, [day]: d } };
    });
  }, []);

  const incVocab = useCallback((day, amt) => {
    setState(prev => {
      const d = prev.days[day];
      const vT = d.vocabTarget + d.vocabExtra;
      const gT = d.grammarTarget + d.grammarExtra;
      const newVal = Math.min(vT, Math.max(0, d.vocabDone + amt));
      const updated = { ...d, vocabDone: newVal };
      updated.completed = updated.vocabDone >= vT && updated.grammarDone >= gT;
      return { ...prev, days: { ...prev.days, [day]: updated } };
    });
  }, []);

  const incGrammar = useCallback((day, amt) => {
    setState(prev => {
      const d = prev.days[day];
      const vT = d.vocabTarget + d.vocabExtra;
      const gT = d.grammarTarget + d.grammarExtra;
      const newVal = Math.min(gT, Math.max(0, d.grammarDone + amt));
      const updated = { ...d, grammarDone: newVal };
      updated.completed = updated.vocabDone >= vT && updated.grammarDone >= gT;
      return { ...prev, days: { ...prev.days, [day]: updated } };
    });
  }, []);

  const markMissed = useCallback((day) => {
    setState(prev => {
      const d = prev.days[day];
      const vT = d.vocabTarget + d.vocabExtra;
      const gT = d.grammarTarget + d.grammarExtra;
      const vMissed = Math.max(0, vT - d.vocabDone);
      const gMissed = Math.max(0, gT - d.grammarDone);
      if (vMissed === 0 && gMissed === 0) { showToast("✅ Bu kun allaqachon tugallangan!", "green"); return prev; }
      const vDist = redistributeMissed(vMissed, day, TOTAL_DAYS);
      const gDist = redistributeMissed(gMissed, day, TOTAL_DAYS);
      const newDays = { ...prev.days };
      for (let d2 = day + 1; d2 <= TOTAL_DAYS; d2++) {
        newDays[d2] = { ...newDays[d2], vocabExtra: (newDays[d2].vocabExtra || 0) + (vDist[d2] || 0), grammarExtra: (newDays[d2].grammarExtra || 0) + (gDist[d2] || 0) };
      }
      newDays[day] = { ...newDays[day], completed: false };
      showToast(`📋 ${vMissed} so'z + ${gMissed} grammatika keyingi kunlarga taqsimlandi`, "amber");
      return { ...prev, days: newDays };
    });
  }, [showToast]);

  const startPomo = useCallback(() => {
    beep(550, 0.2);
    setAiLoading(true);
    getAITip("work", currentDay, pomodoro.sessions).then(tip => {
      setAiTip({ text: tip || getFallback("work"), phase: "work" });
      setAiLoading(false);
    });
    setState(prev => ({ ...prev, pomodoro: { ...prev.pomodoro, active: true } }));
  }, [currentDay, pomodoro.sessions, beep]);

  const pausePomo = useCallback(() => {
    setState(prev => ({ ...prev, pomodoro: { ...prev.pomodoro, active: false } }));
  }, []);

  const resetPomo = useCallback(() => {
    clearInterval(timerRef.current);
    setState(prev => ({ ...prev, pomodoro: { active: false, isWork: true, timeLeft: WORK_SECS, sessions: prev.pomodoro.sessions } }));
    setAiTip({ text: "", phase: "" });
  }, []);

  const refreshTip = useCallback(() => {
    setAiLoading(true);
    getAITip("work", currentDay, pomodoro.sessions).then(tip => {
      setAiTip({ text: tip || getFallback("work"), phase: "work" });
      setAiLoading(false);
    });
  }, [currentDay, pomodoro.sessions]);

  /* ─── RENDER ─────────────────────────────────────────────── */
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Ambient bg */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        background: `
          radial-gradient(ellipse 60% 50% at 10% 10%, rgba(34,211,122,0.05) 0%, transparent 70%),
          radial-gradient(ellipse 50% 60% at 90% 85%, rgba(77,166,255,0.04) 0%, transparent 70%),
          radial-gradient(ellipse 40% 40% at 50% 50%, rgba(167,139,250,0.03) 0%, transparent 70%)
        `,
      }} />

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)",
          zIndex: 9999, animation: "slideDown 0.25s ease",
          background: "var(--c-surface2)",
          border: `1px solid ${toast.type === "green" ? "rgba(34,211,122,0.4)" : toast.type === "blue" ? "rgba(77,166,255,0.35)" : "rgba(245,166,35,0.4)"}`,
          color: toast.type === "green" ? "var(--c-green)" : toast.type === "blue" ? "var(--c-blue)" : "var(--c-amber)",
          padding: "11px 24px", borderRadius: 99, fontSize: 13, fontWeight: 600,
          boxShadow: "var(--shadow-md)", whiteSpace: "nowrap",
        }}>{toast.msg}</div>
      )}

      {/* ── HEADER ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(6,12,24,0.85)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--c-border)",
        padding: "0 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 60, flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: "linear-gradient(135deg, var(--c-green), var(--c-blue))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontWeight: 800, color: "#000",
            fontFamily: "var(--font-display)",
          }}>V</div>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 15, letterSpacing: "-0.3px", lineHeight: 1 }}>VocabFlow</div>
            <div style={{ fontSize: 11, color: "var(--c-muted)", fontFamily: "var(--font-mono)" }}>
              {now.toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </div>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hide-mobile" style={{ display: "flex", gap: 4 }}>
          {[["today","📅","Bugun"], ["calendar","🗓","Kalendar"], ["stats","📊","Statistika"]].map(([v, icon, label]) => (
            <button key={v} onClick={() => setTab(v)} style={{
              padding: "7px 14px", borderRadius: "var(--radius-sm)",
              border: tab === v ? "1px solid rgba(34,211,122,0.35)" : "1px solid transparent",
              background: tab === v ? "rgba(34,211,122,0.1)" : "transparent",
              color: tab === v ? "var(--c-green)" : "var(--c-muted)",
              fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12,
              letterSpacing: "0.04em", transition: "all 0.18s",
              display: "flex", alignItems: "center", gap: 5,
            }}>{icon} {label}</button>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            background: "rgba(34,211,122,0.08)", border: "1px solid rgba(34,211,122,0.2)",
            color: "var(--c-green)", borderRadius: 99, padding: "4px 12px",
            fontSize: 12, fontFamily: "var(--font-mono)", fontWeight: 700,
          }}>{completedCount}/{TOTAL_DAYS} ✓</div>
          {pomodoro.active && (
            <div style={{
              background: pomodoro.isWork ? "rgba(34,211,122,0.1)" : "rgba(77,166,255,0.1)",
              border: `1px solid ${pomodoro.isWork ? "rgba(34,211,122,0.3)" : "rgba(77,166,255,0.3)"}`,
              color: pomodoro.isWork ? "var(--c-green)" : "var(--c-blue)",
              borderRadius: 99, padding: "4px 12px",
              fontSize: 12, fontFamily: "var(--font-mono)", fontWeight: 700,
              animation: "pulse 2s ease infinite",
            }}>⏱ {fmtTime(pomodoro.timeLeft)}</div>
          )}
        </div>
      </header>

      {/* Mobile nav */}
      <nav className="show-mobile" style={{
        background: "var(--c-surface)", borderBottom: "1px solid var(--c-border)",
        padding: "8px 12px", gap: 4, flexShrink: 0,
      }}>
        {[["today","📅","Bugun"], ["calendar","🗓","Takvim"], ["stats","📊","Stat"]].map(([v, icon, label]) => (
          <button key={v} onClick={() => setTab(v)} style={{
            flex: 1, padding: "8px 6px", borderRadius: "var(--radius-sm)",
            border: tab === v ? "1px solid rgba(34,211,122,0.35)" : "1px solid transparent",
            background: tab === v ? "rgba(34,211,122,0.1)" : "transparent",
            color: tab === v ? "var(--c-green)" : "var(--c-muted)",
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 11,
            display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
          }}>
            <span style={{ fontSize: 16 }}>{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {/* ── CONTENT ── */}
      <div style={{ flex: 1, position: "relative", zIndex: 1 }}>

        {/* ══ TODAY TAB ══ */}
        {tab === "today" && (
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 16px" }} className="fade-up">

            {/* Day Strip */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontFamily: "var(--font-display)", fontWeight: 700, letterSpacing: "0.1em", color: "var(--c-muted)", textTransform: "uppercase", marginBottom: 10 }}>
                18 kunlik jadval
              </div>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                {Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1).map(d => {
                  const done = days[d].completed;
                  const active = d === currentDay;
                  return (
                    <button key={d} onClick={() => setDay(d)} style={{
                      width: 36, height: 36, borderRadius: "var(--radius-sm)",
                      border: active ? "1.5px solid var(--c-green)" : done ? "1px solid rgba(34,211,122,0.3)" : "1px solid var(--c-border)",
                      background: active ? "rgba(34,211,122,0.15)" : done ? "rgba(34,211,122,0.07)" : "var(--c-surface)",
                      color: active ? "var(--c-green)" : done ? "var(--c-green2)" : "var(--c-muted)",
                      fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 12,
                      transition: "all 0.15s",
                      position: "relative",
                    }}>
                      {done ? "✓" : d}
                      {active && <span style={{ position: "absolute", bottom: -2, left: "50%", transform: "translateX(-50%)", width: 4, height: 4, borderRadius: 99, background: "var(--c-green)" }} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14 }}>

              {/* ─ Day Overview ─ */}
              <div className="card" style={{ gridColumn: "1 / -1" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 26, letterSpacing: "-0.5px", lineHeight: 1 }}>
                      {currentDay}<span style={{ fontSize: 14, color: "var(--c-muted)", fontWeight: 600 }}>-kun</span>
                    </div>
                    <div style={{ fontSize: 13, color: "var(--c-muted)", marginTop: 3 }}>
                      {dayLabel(startDate, currentDay).weekday}, {dayLabel(startDate, currentDay).date}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <MetricChip color="green" icon="📚" label="Lug'at" value={`${today.vocabDone}/${vocabTotal}`} extra={today.vocabExtra > 0 ? `+${today.vocabExtra}` : null} />
                    <MetricChip color="blue" icon="🧩" label="Grammatika" value={`${today.grammarDone}/${gramTotal}`} extra={today.grammarExtra > 0 ? `+${today.grammarExtra}` : null} />
                    <MetricChip color="purple" icon="🍅" label="Pomodoro" value={pomodoro.sessions} />
                    <MetricChip color="amber" icon="🔥" label="Jami" value={totalPomodoros} />
                  </div>
                </div>
                {/* Overall progress bar */}
                <div style={{ marginTop: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--c-muted)", fontFamily: "var(--font-mono)", marginBottom: 6 }}>
                    <span>Kun progressi</span>
                    <span>{Math.round((vocabPct + gramPct) / 2)}%</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${Math.round((vocabPct + gramPct) / 2)}%`, background: "linear-gradient(90deg, var(--c-green), var(--c-blue))" }} />
                  </div>
                </div>
                {today.completed && (
                  <div style={{
                    marginTop: 14, padding: "12px 18px", borderRadius: "var(--radius-md)",
                    background: "linear-gradient(135deg, rgba(34,211,122,0.12), rgba(77,166,255,0.08))",
                    border: "1px solid rgba(34,211,122,0.3)",
                    display: "flex", alignItems: "center", gap: 10,
                    fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--c-green)",
                  }}>
                    🎉 {currentDay}-kun muvaffaqiyatli yakunlandi! Zo'r ketayapsiz!
                  </div>
                )}
              </div>

              {/* ─ Vocabulary Card ─ */}
              <div className="card">
                <div className="card-title" style={{ color: "var(--c-green)" }}>📚 Lug'at</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 36, fontWeight: 700, color: "var(--c-text)" }}>{today.vocabDone}</span>
                  <span style={{ color: "var(--c-muted)", fontSize: 16 }}>/ {vocabTotal}</span>
                </div>
                {today.vocabExtra > 0 && (
                  <div style={{ fontSize: 11, color: "var(--c-amber)", marginBottom: 6, fontFamily: "var(--font-mono)" }}>+{today.vocabExtra} qo'shimcha taqsimlangan</div>
                )}
                <div className="progress-track" style={{ marginBottom: 16 }}>
                  <div className="progress-fill" style={{ width: `${vocabPct}%`, background: "var(--c-green)" }} />
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <CounterBtn onClick={() => incVocab(currentDay, -1)} label="−" variant="ghost" />
                  <CounterBtn onClick={() => incVocab(currentDay, 1)} label="+1" variant="green" />
                  <CounterBtn onClick={() => incVocab(currentDay, 5)} label="+5" variant="green" />
                  <CounterBtn onClick={() => incVocab(currentDay, 10)} label="+10" variant="green" />
                  <button className="btn btn-ghost" style={{ flex: 1, fontSize: 12, padding: "8px 10px" }}
                    onClick={() => updateField(currentDay, "vocabDone", vocabTotal)}>
                    Hammasi ✓
                  </button>
                </div>
              </div>

              {/* ─ Grammar Card ─ */}
              <div className="card">
                <div className="card-title" style={{ color: "var(--c-blue)" }}>🧩 Grammatika</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 36, fontWeight: 700, color: "var(--c-text)" }}>{today.grammarDone}</span>
                  <span style={{ color: "var(--c-muted)", fontSize: 16 }}>/ {gramTotal}</span>
                </div>
                {today.grammarExtra > 0 && (
                  <div style={{ fontSize: 11, color: "var(--c-amber)", marginBottom: 6, fontFamily: "var(--font-mono)" }}>+{today.grammarExtra} qo'shimcha</div>
                )}
                <div className="progress-track" style={{ marginBottom: 16 }}>
                  <div className="progress-fill" style={{ width: `${gramPct}%`, background: "var(--c-blue)" }} />
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <CounterBtn onClick={() => incGrammar(currentDay, -1)} label="−" variant="ghost" />
                  <CounterBtn onClick={() => incGrammar(currentDay, 1)} label="+1" variant="blue" />
                  <CounterBtn onClick={() => incGrammar(currentDay, 5)} label="+5" variant="blue" />
                  <button className="btn btn-ghost" style={{ flex: 1, fontSize: 12, padding: "8px 10px" }}
                    onClick={() => updateField(currentDay, "grammarDone", gramTotal)}>
                    Hammasi ✓
                  </button>
                </div>
              </div>

              {/* ─ Pomodoro ─ */}
              <div className="card" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
                <div className="card-title" style={{ alignSelf: "flex-start", color: pomodoro.isWork ? "var(--c-green)" : "var(--c-blue)" }}>
                  🍅 Pomodoro — {pomodoro.isWork ? "📖 Dars (35 daq)" : "☕ Dam (10 daq)"}
                </div>

                {/* Ring */}
                <div style={{ position: "relative", width: 168, height: 168, flexShrink: 0, animation: "ringPop 0.4s ease" }}>
                  <svg width="168" height="168" style={{ transform: "rotate(-90deg)" }}>
                    <circle cx="84" cy="84" r="74" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                    <circle cx="84" cy="84" r="74" fill="none"
                      stroke={pomodoro.isWork ? "var(--c-green)" : "var(--c-blue)"}
                      strokeWidth="8" strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 74}`}
                      strokeDashoffset={`${2 * Math.PI * 74 * (1 - pomoPct / 100)}`}
                      style={{ transition: "stroke-dashoffset 1s linear, stroke 0.4s" }}
                    />
                  </svg>
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 32, fontWeight: 700, letterSpacing: "-1px", lineHeight: 1 }}>{fmtTime(pomodoro.timeLeft)}</div>
                    <div style={{ fontSize: 11, color: "var(--c-muted)", marginTop: 3 }}>{pomoPct}% tugadi</div>
                  </div>
                </div>

                {/* Buttons */}
                <div style={{ display: "flex", gap: 8, marginTop: 16, width: "100%" }}>
                  {!pomodoro.active
                    ? <button className="btn btn-green" style={{ flex: 1, padding: "11px" }} onClick={startPomo}>▶ Boshlash</button>
                    : <button className="btn btn-amber" style={{ flex: 1, padding: "11px" }} onClick={pausePomo}>⏸ Pauza</button>
                  }
                  <button className="btn btn-ghost" style={{ padding: "11px 16px" }} onClick={resetPomo}>↺</button>
                </div>

                {/* Session dots */}
                <div style={{ display: "flex", gap: 6, marginTop: 14, alignItems: "center" }}>
                  {Array.from({ length: Math.max(4, pomodoro.sessions) }, (_, i) => (
                    <div key={i} style={{
                      width: i < pomodoro.sessions ? 10 : 8,
                      height: i < pomodoro.sessions ? 10 : 8,
                      borderRadius: 99,
                      background: i < pomodoro.sessions ? "var(--c-green)" : "var(--c-border2)",
                      transition: "all 0.3s",
                      boxShadow: i < pomodoro.sessions ? "0 0 8px rgba(34,211,122,0.5)" : "none",
                    }} />
                  ))}
                  <span style={{ fontSize: 11, color: "var(--c-muted)", fontFamily: "var(--font-mono)", marginLeft: 4 }}>{pomodoro.sessions} sessiya</span>
                </div>
              </div>

              {/* ─ AI Tip ─ */}
              <div className="card" style={{ background: "var(--c-surface2)", border: "1px solid var(--c-border)" }}>
                <div className="card-title" style={{ color: "var(--c-purple)" }}>🤖 AI Maslahat</div>
                {aiLoading ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--c-muted)", fontSize: 14 }}>
                    <div style={{ width: 16, height: 16, border: "2px solid var(--c-purple)", borderTopColor: "transparent", borderRadius: 99, animation: "spin 0.7s linear infinite" }} />
                    AI maslahat tayyorlamoqda...
                  </div>
                ) : aiTip.text ? (
                  <>
                    <div style={{
                      background: aiTip.phase === "break" ? "rgba(77,166,255,0.06)" : "rgba(167,139,250,0.06)",
                      border: `1px solid ${aiTip.phase === "break" ? "rgba(77,166,255,0.15)" : "rgba(167,139,250,0.15)"}`,
                      borderRadius: "var(--radius-md)", padding: "14px 16px",
                      fontSize: 14, color: "var(--c-text)", lineHeight: 1.75,
                    }}>{aiTip.text}</div>
                    <button className="btn btn-ghost" style={{ marginTop: 10, fontSize: 12 }} onClick={refreshTip}>🔄 Yangi maslahat</button>
                  </>
                ) : (
                  <div style={{ fontSize: 13, color: "var(--c-muted)", fontStyle: "italic", lineHeight: 1.6 }}>
                    Pomodoro boshlanganda AI sizga qiziqarli va foydali maslahatlar beradi 💡<br />
                    <span style={{ fontSize: 11 }}>Dars va dam olish paytlari uchun alohida maslahatlar</span>
                  </div>
                )}
              </div>

              {/* ─ Notes ─ */}
              <div className="card">
                <div className="card-title">📝 Eslatmalar</div>
                <textarea value={today.notes}
                  onChange={e => updateField(currentDay, "notes", e.target.value)}
                  placeholder={`${currentDay}-kun uchun yodlovlar, qiyin so'zlar, g'oyalar...`}
                  style={{
                    width: "100%", minHeight: 100, background: "rgba(255,255,255,0.03)",
                    border: "1px solid var(--c-border)", borderRadius: "var(--radius-md)",
                    color: "var(--c-text)", padding: "12px 14px", fontSize: 13, lineHeight: 1.6,
                    resize: "vertical", outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={e => e.target.style.borderColor = "var(--c-border2)"}
                  onBlur={e => e.target.style.borderColor = "var(--c-border)"}
                />
              </div>

              {/* ─ Missed Day ─ */}
              <div className="card">
                <div className="card-title" style={{ color: "var(--c-amber)" }}>⚠️ Kun o'tkazib yubordingizmi?</div>
                <p style={{ fontSize: 13, color: "var(--c-muted)", lineHeight: 1.7, marginBottom: 14 }}>
                  Bugungi bajarilmagan vazifalar keyingi kunlarga avtomatik teng taqsimlanadi. Hech nima yo'qolmaydi — jadval o'zini o'zi moslashtiradi.
                </p>
                <button className="btn btn-amber" style={{ width: "100%", padding: "11px" }} onClick={() => markMissed(currentDay)}>
                  📋 Qolganlarni keyingi kunlarga taqsimlash
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ══ CALENDAR TAB ══ */}
        {tab === "calendar" && (
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 16px" }} className="fade-up">
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, letterSpacing: "-0.5px" }}>18 Kunlik Jadval</h2>
              <p style={{ fontSize: 13, color: "var(--c-muted)", marginTop: 4 }}>Bir kunga bosing — o'sha kunga o'tasiz</p>
            </div>

            {/* Summary strip */}
            <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
              {[
                { label: "Tugallangan", val: completedCount, color: "green" },
                { label: "Jarayonda", val: TOTAL_DAYS - completedCount, color: "blue" },
                { label: "Jami so'z", val: Object.values(days).reduce((s,d)=>s+d.vocabDone,0), color: "purple" },
              ].map(({label,val,color}) => (
                <div key={label} style={{
                  background: "var(--c-surface)", border: "1px solid var(--c-border)",
                  borderRadius: "var(--radius-md)", padding: "10px 18px",
                  display: "flex", alignItems: "center", gap: 10,
                }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 20, color: `var(--c-${color})` }}>{val}</span>
                  <span style={{ fontSize: 12, color: "var(--c-muted)" }}>{label}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))", gap: 10 }}>
              {Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1).map(d => {
                const day = days[d];
                const vT = day.vocabTarget + day.vocabExtra;
                const gT = day.grammarTarget + day.grammarExtra;
                const vP = vT ? Math.round(day.vocabDone / vT * 100) : 0;
                const isActive = d === currentDay;
                const isDone = day.completed;
                return (
                  <div key={d} onClick={() => setDay(d)} style={{
                    background: "var(--c-surface)", cursor: "pointer",
                    border: isActive ? "1.5px solid var(--c-green)" : isDone ? "1px solid rgba(34,211,122,0.25)" : "1px solid var(--c-border)",
                    borderRadius: "var(--radius-md)", padding: "14px 16px",
                    transition: "all 0.18s",
                    position: "relative", overflow: "hidden",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "var(--shadow-md)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
                  >
                    {isDone && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "var(--c-green)" }} />}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 16 }}>{d}-kun</span>
                      <span style={{ fontSize: 14 }}>{isDone ? "✅" : isActive ? "👆" : ""}</span>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--c-muted)", marginBottom: 8 }}>
                      {dayLabel(startDate, d).weekday}, {dayLabel(startDate, d).date}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--c-muted)", marginBottom: 3 }}>📚 {day.vocabDone}/{vT}</div>
                    <div style={{ fontSize: 12, color: "var(--c-muted)", marginBottom: 8 }}>🧩 {day.grammarDone}/{gT}</div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${vP}%`, background: isDone ? "var(--c-green)" : "var(--c-blue)" }} />
                    </div>
                    {day.vocabExtra > 0 && <div style={{ fontSize: 10, color: "var(--c-amber)", marginTop: 5 }}>+{day.vocabExtra} qo'shilgan</div>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══ STATS TAB ══ */}
        {tab === "stats" && (
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 16px" }} className="fade-up">
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, letterSpacing: "-0.5px" }}>Statistika</h2>
              <p style={{ fontSize: 13, color: "var(--c-muted)", marginTop: 4 }}>18 kunlik o'quv jarayoni</p>
            </div>

            {/* Big stat cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px,1fr))", gap: 10, marginBottom: 20 }}>
              {[
                { icon:"📚", val: Object.values(days).reduce((s,d)=>s+d.vocabDone,0), label:"O'rganilgan so'zlar", color:"green" },
                { icon:"🧩", val: Object.values(days).reduce((s,d)=>s+d.grammarDone,0), label:"Grammatika", color:"blue" },
                { icon:"✅", val: `${completedCount}/${TOTAL_DAYS}`, label:"Tugallangan kun", color:"green" },
                { icon:"🍅", val: totalPomodoros, label:"Jami pomodoro", color:"amber" },
                { icon:"📅", val: `${currentDay}-kun`, label:"Joriy kun", color:"purple" },
                { icon:"🎯", val: `${Math.round(completedCount/TOTAL_DAYS*100)}%`, label:"Umumiy progress", color:"blue" },
              ].map(({ icon, val, label, color }) => (
                <div key={label} className="card" style={{ textAlign: "center", padding: "18px 14px" }}>
                  <div style={{ fontSize: 26, marginBottom: 8 }}>{icon}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: 22, color: `var(--c-${color})`, lineHeight: 1 }}>{val}</div>
                  <div style={{ fontSize: 11, color: "var(--c-muted)", marginTop: 6, lineHeight: 1.3 }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Overall progress bar */}
            <div className="card" style={{ marginBottom: 14 }}>
              <div className="card-title">📈 Umumiy progress</div>
              <div className="progress-track" style={{ height: 10 }}>
                <div className="progress-fill" style={{ width: `${Math.round(completedCount/TOTAL_DAYS*100)}%`, background: "linear-gradient(90deg, var(--c-green), var(--c-blue))" }} />
              </div>
              <div style={{ fontSize: 12, color: "var(--c-muted)", marginTop: 6, fontFamily: "var(--font-mono)" }}>
                {completedCount} / {TOTAL_DAYS} kun — {TOTAL_DAYS - completedCount} kun qoldi
              </div>
            </div>

            {/* Table */}
            <div className="card">
              <div className="card-title">📋 Kunlik jadval</div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--c-border)" }}>
                      {["Kun","Sana","Lug'at","Grammatika","Holat","Pomodoro"].map(h => (
                        <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: "var(--c-muted)", fontFamily: "var(--font-display)", fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1).map(d => {
                      const day = days[d];
                      const vT = day.vocabTarget + day.vocabExtra;
                      const gT = day.grammarTarget + day.grammarExtra;
                      const isActive = d === currentDay;
                      return (
                        <tr key={d} onClick={() => setDay(d)} style={{
                          borderBottom: "1px solid var(--c-border)",
                          background: isActive ? "rgba(34,211,122,0.04)" : "transparent",
                          cursor: "pointer",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                        onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                        >
                          <td style={{ padding: "9px 12px", fontFamily: "var(--font-mono)", fontWeight: 700, color: isActive ? "var(--c-green)" : "var(--c-text)" }}>{d}</td>
                          <td style={{ padding: "9px 12px", color: "var(--c-muted)" }}>{dayLabel(startDate, d).weekday} {dayLabel(startDate, d).date}</td>
                          <td style={{ padding: "9px 12px", fontFamily: "var(--font-mono)", color: "var(--c-text)" }}>
                            {day.vocabDone}/{vT}
                            {day.vocabExtra > 0 && <span style={{ fontSize: 10, color: "var(--c-amber)", marginLeft: 4 }}>+{day.vocabExtra}</span>}
                          </td>
                          <td style={{ padding: "9px 12px", fontFamily: "var(--font-mono)", color: "var(--c-text)" }}>{day.grammarDone}/{gT}</td>
                          <td style={{ padding: "9px 12px" }}>
                            {day.completed ? <span style={{ color: "var(--c-green)", fontWeight: 700 }}>✅ Tugadi</span>
                              : day.vocabDone > 0 ? <span style={{ color: "var(--c-blue)" }}>🔄 Davom</span>
                              : <span style={{ color: "var(--c-muted)" }}>⏳ Kutilmoqda</span>}
                          </td>
                          <td style={{ padding: "9px 12px", color: "var(--c-muted)", fontFamily: "var(--font-mono)" }}>—</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Reset */}
            <div className="card" style={{ marginTop: 14, textAlign: "center" }}>
              <p style={{ fontSize: 13, color: "var(--c-muted)", marginBottom: 12 }}>Barcha ma'lumotlarni o'chirib, yangi boshlash uchun:</p>
              <button className="btn btn-red" onClick={() => {
                if (window.confirm("Hamma ma'lumotlar o'chiriladi. Davom etasizmi?")) {
                  localStorage.removeItem(STORAGE_KEY);
                  setState(buildDefaultState());
                  showToast("🗑 Ma'lumotlar tozalandi", "info");
                }
              }}>🗑 Barcha ma'lumotlarni o'chirish</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SUB COMPONENTS
═══════════════════════════════════════════════════════════════ */
function MetricChip({ color, icon, label, value, extra }) {
  const colors = { green: ["rgba(34,211,122,0.1)", "rgba(34,211,122,0.25)", "var(--c-green)"], blue: ["rgba(77,166,255,0.1)", "rgba(77,166,255,0.25)", "var(--c-blue)"], amber: ["rgba(245,166,35,0.1)", "rgba(245,166,35,0.25)", "var(--c-amber)"], purple: ["rgba(167,139,250,0.1)", "rgba(167,139,250,0.25)", "var(--c-purple)"] };
  const [bg, border, fg] = colors[color] || colors.green;
  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 12, padding: "8px 14px", display: "flex", flexDirection: "column", gap: 2, minWidth: 80 }}>
      <div style={{ fontSize: 11, color: "var(--c-muted)" }}>{icon} {label}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: 18, color: fg }}>{value}</div>
      {extra && <div style={{ fontSize: 10, color: "var(--c-amber)" }}>{extra}</div>}
    </div>
  );
}

function CounterBtn({ onClick, label, variant }) {
  const cls = variant === "green" ? "btn btn-green" : variant === "blue" ? "btn btn-blue" : "btn btn-ghost";
  return (
    <button className={cls} style={{ padding: "8px 12px", fontSize: 13, minWidth: 40 }} onClick={onClick}>{label}</button>
  );
}

function getFallback(phase) {
  if (phase === "work") return "📚 Har bir so'zni ko'zing, aytib chiqing va misol gapda ishlating! Miya uch marta eshitsa, yaxshi yodlaydi. Diqqat faqat kitobda — telefon uzoqda bo'lsin 💪";
  return "☕ Telefoningizni qo'ying! Deraza oldiga boring, 5 marta chuqur nafas oling. Miya ham dam olishga muhtoj — unga hurmat ko'rsating. Suv iching, cho'zing, jilmaying 😄";
}