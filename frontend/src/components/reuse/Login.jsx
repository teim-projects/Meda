import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../services/apiConfig";

import heroLogo from "../../assets/logo.png";
import bgVideo from "../../assets/bg_video.mp4";

/* =====================================================================
   meda · Superadmin Login
   LOGIC: Django auth code — unchanged.
   UI:    Video Background + 4-5s Delayed Data Population.
===================================================================== */

const LoginStyles = () => (
  <style>{`
    .nx-root {
      --accent:#f43f5e; --accent-2:#f97316; --accent-rgb:244,63,94;
      font-family:"Space Grotesk","Inter",ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;
    }
    .mono { font-family:"JetBrains Mono",ui-monospace,monospace; }
    .preserve-3d { transform-style: preserve-3d; }
    .glass {
      background: linear-gradient(150deg, rgba(255,255,255,0.88), rgba(255,255,255,0.65) 45%, rgba(255,255,255,0.80));
      backdrop-filter: blur(26px) saturate(180%);
      -webkit-backdrop-filter: blur(26px) saturate(180%);
      border: 1px solid rgba(255,255,255,0.9);
      box-shadow: 0 12px 40px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,1);
    }
    @keyframes livePulse { 0%{box-shadow:0 0 0 0 rgba(16,185,129,.6)} 70%{box-shadow:0 0 0 9px rgba(16,185,129,0)} 100%{box-shadow:0 0 0 0 rgba(16,185,129,0)} }
    .live-dot { animation:livePulse 2s infinite; }
    @keyframes scanLine { 0%{transform:translateY(-100%);opacity:0} 15%{opacity:.9} 85%{opacity:.9} 100%{transform:translateY(1200%);opacity:0} }
    .scan-line { animation:scanLine 7s linear infinite; }
    @keyframes tickerScroll { from{transform:translateX(0)} to{transform:translateX(-50%)} }
    .ticker-track { display:inline-flex; animation:tickerScroll 40s linear infinite; }
    .ticker-track:hover { animation-play-state:paused; }
    @keyframes borderSweep { to{transform:rotate(360deg)} }
    .sweep-border {
      position:absolute; inset:-140%;
      background:conic-gradient(from 0deg, transparent 0deg, rgba(var(--accent-rgb),0.9) 40deg, transparent 110deg, transparent 250deg, rgba(16,185,129,0.7) 300deg, transparent 340deg);
      animation:borderSweep 7s linear infinite;
    }
    @keyframes chargeFill { from{width:0%} }
    .charge { animation:chargeFill 1.4s ease-out; }
    @keyframes popIn { from{opacity:0;transform:translateY(18px) scale(.96)} to{opacity:1;transform:translateY(0) scale(1)} }
    .pop-in { animation:popIn .8s cubic-bezier(.22,1,.36,1) both; }
    @keyframes spinFast { to{transform:rotate(360deg)} }
    .spin-fast { animation:spinFast .8s linear infinite; }

    /* Delayed appearance smooth transition (4-5s entrance) */
    .fade-delay-enter {
      opacity: 0;
      transform: translateY(24px);
      transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
      pointer-events: none;
    }
    .fade-delay-enter.active {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }

    @media (prefers-reduced-motion: reduce) { .nx-root * { animation-duration:.001ms !important; animation-iteration-count:1 !important; } }
  `}</style>
);

/* ---------------------------------------------------------------
   DATA
----------------------------------------------------------------*/
const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" };

const ENERGY_TYPES = [
  { key: "solar", label: "Solar Projects", hi: "सौर ऊर्जा", accent: "#f59e0b", accent2: "#ea580c", rgb: "245, 158, 11" },
  { key: "wind", label: "Wind Energy", hi: "पवन ऊर्जा", accent: "#0ea5e9", accent2: "#3b82f6", rgb: "14, 165, 233" },
  { key: "hybrid", label: "Hybrid Projects", hi: "हाइब्रिड ऊर्जा", accent: "#8b5cf6", accent2: "#6366f1", rgb: "139, 92, 246" },
  { key: "biomass", label: "Biomass/Biogas", hi: "जैव ऊर्जा", accent: "#10b981", accent2: "#22c55e", rgb: "16, 185, 129" },
  { key: "waste", label: "Waste-to-Energy", hi: "अपशिष्ट ऊर्जा", accent: "#f43f5e", accent2: "#f97316", rgb: "244, 63, 94" },
  { key: "hydrogen", label: "Green Hydrogen", hi: "हरित हाइड्रोजन", accent: "#06b6d4", accent2: "#2dd4bf", rgb: "6, 182, 212" },
  { key: "bess", label: "BESS", hi: "बैटरी स्टोरेज", accent: "#6366f1", accent2: "#3b82f6", rgb: "99, 102, 241" },
  { key: "psp", label: "Pumped Storage", hi: "पंप भण्डारण", accent: "#0284c7", accent2: "#0369a1", rgb: "2, 132, 199" },
  { key: "ev", label: "EV Charging", hi: "ईवी चार्जिंग", accent: "#14b8a6", accent2: "#10b981", rgb: "20, 184, 166" },
];

const TICKER_ITEMS = [
  "⚡ Thar Solar Park · 2,410 MW · nominal",
  "🌬 Jaisalmer Wind Cluster · 1,182 MW · gusting 38 km/h",
  "💧 Tehri Pumped Storage · 1,000 MW · reservoir 82%",
  "🌿 Punjab Biogas Line-7 · 96 MW · feedstock ok",
  "🏭 Pune Waste-to-Energy · 24 MW · incinerator 3 active",
  "🧪 Kandla H₂ Electrolyser · 88% efficiency",
  "🔋 Grid BESS reserve · 6.4 GWh · charging",
  "🚗 NH-48 EV corridor · 312 chargers online",
  "🛰 Satellite irradiance sync · complete",
];

/* ---------------------------------------------------------------
   HOOKS
----------------------------------------------------------------*/
function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

/* ---------------------------------------------------------------
   BACKGROUND VIDEO
----------------------------------------------------------------*/
function VideoBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-black">
      <video
        src={bgVideo}
        autoPlay
        loop
        muted
        playsInline
        className="h-full w-full object-cover opacity-100 brightness-[1.12] contrast-[1.05] saturate-[1.08] transition-all duration-700"
      />
      {/* Subtle light vignette to keep video crisp and bright */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none" />
    </div>
  );
}

/* ---------------------------------------------------------------
   CHROME
----------------------------------------------------------------*/
const fmt = (n, d = 0) => n.toLocaleString("en-IN", { minimumFractionDigits: d, maximumFractionDigits: d });

function BrandBar() {
  const now = useClock();
  return (
    <header className="relative z-30 flex items-center justify-between px-5 py-4 sm:px-8">
      <div className="flex items-center gap-2.5">
        <img src={heroLogo} alt="meda" className="h-[140px] w-[140px] rounded-2xl object-contain drop-shadow-[0_10px_24px_rgba(0,0,0,0.5)]" />
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <span className="hidden items-center gap-1.5 text-[11.5px] font-bold text-white/90 drop-shadow-md md:flex">
          <span className="live-dot h-1.5 w-1.5 rounded-full bg-emerald-400" /> 9 sources · all nominal
        </span>
        <span className="mono rounded-lg border border-white/30 bg-slate-900/60 px-3 py-1.5 text-[11.5px] font-semibold tracking-wider text-white tabular-nums shadow-lg backdrop-blur-md">
          {now.toLocaleTimeString("en-GB")} IST
        </span>
      </div>
    </header>
  );
}

function Ticker({ active }) {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="relative z-30 w-full overflow-hidden border-t border-white/20 bg-slate-900/65 py-2.5 backdrop-blur-lg">
      <div className="ticker-track">
        {items.map((t, i) => (
          <span key={i} className="flex shrink-0 items-center gap-2 px-6 text-[11.5px] font-semibold whitespace-nowrap text-white/90">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: active.accent, boxShadow: `0 0 8px ${active.accent}90`, transition: "all .8s" }} />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   LEFT HUD
----------------------------------------------------------------*/
function LiveHud({ active }) {
  const [co2, setCo2] = useState(12_400_000);
  const [rel, setRel] = useState(99.8);
  useEffect(() => {
    const id = window.setInterval(() => {
      setCo2((c) => c + Math.floor(Math.random() * 900 + 150));
      setRel((r) => Math.min(99.9, Math.max(99.6, r + (Math.random() - 0.5) * 0.12)));
    }, 1400);
    return () => window.clearInterval(id);
  }, []);

  const tiles = [
    { label: "Solar Installed", val: "4.8 GW", color: "#d97706", bg: "rgba(245,158,11,0.18)",
      icon: <svg viewBox="0 0 24 24" {...S}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg> },
    { label: "Wind Power", val: "5.2 GW", color: "#0891b2", bg: "rgba(6,182,212,0.18)",
      icon: <svg viewBox="0 0 24 24" {...S}><path d="M12.8 19.6A2 2 0 1 0 14 16H2" /><path d="M17.5 8a2.5 2.5 0 1 1 2 4H2" /><path d="M9.8 4.4A2 2 0 1 1 11 8H2" /></svg> },
    { label: "Tons CO₂ Saved", val: `${fmt(co2 / 1_000_000, 1)}M`, color: "#059669", bg: "rgba(16,185,129,0.18)",
      icon: <svg viewBox="0 0 24 24" {...S}><path d="M4 20c0-8 6-14 16-14 0 9-5.4 14-11 14-2.6 0-5-1.6-5-1.6Z" /><path d="M8 20C9.5 15 13 12 17 10" /></svg> },
    { label: "Grid Reliability", val: `${rel.toFixed(1)}%`, color: "#7c3aed", bg: "rgba(139,92,246,0.18)",
      icon: <svg viewBox="0 0 24 24" {...S}><path d="M15 7h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-1" /><path d="M5 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h1" /><path d="m11 7-3 5h4l-3 5" /><path d="M22 11v2" /></svg> },
  ];

  return (
    <div className="relative z-20 w-full max-w-[560px]">
      <div className="pop-in" style={{ animationDelay: "0.08s" }}>
        <span className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-slate-900/60 px-3.5 py-1.5 text-[11px] font-bold tracking-wide text-white shadow-md backdrop-blur-md" style={{ borderColor: `${active.accent}70`, transition: "all .8s" }}>
          <span className="live-dot h-1.5 w-1.5 rounded-full" style={{ background: active.accent }} />
          {active.hi} · live national grid
        </span>

        <h2 className="mt-5 text-[40px] leading-[1.04] font-bold tracking-tight text-white sm:text-[54px] drop-shadow-lg">
          Nine clean sources.
          <br />
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(90deg, ${active.accent}, ${active.accent2})`, transition: "all .8s" }}>One living grid.</span>
        </h2>
        <p className="mt-4 max-w-[470px] text-[15px] leading-relaxed font-medium text-slate-200 drop-shadow-md">
          Solar, wind, hybrid, biomass, waste-to-energy, green hydrogen, BESS, pumped storage and EV charging — streaming together in the scene behind you.
        </p>
      </div>

      <div className="mt-7 grid max-w-[460px] grid-cols-2 gap-3">
        {tiles.map((t, i) => (
          <div
            key={t.label}
            className="pop-in group flex items-center gap-3 rounded-xl border border-white/80 bg-white/85 px-4 py-3.5 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-2xl"
            style={{ animationDelay: `${0.15 + i * 0.08}s` }}
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" style={{ background: t.bg, color: t.color }}>
              <span className="h-5 w-5">{t.icon}</span>
            </span>
            <span className="min-w-0">
              <span className="mono block text-[17px] leading-tight font-bold text-slate-900 tabular-nums">{t.val}</span>
              <span className="block text-[11px] font-medium text-slate-600">{t.label}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   LOGIN CARD — screenshot UI + original Django logic
----------------------------------------------------------------*/
function pwStrength(pw) {
  let s = 0;
  if (pw.length >= 6) s++;
  if (pw.length >= 10) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) s++;
  const map = [
    { label: "Weak", color: "#fb7185" }, { label: "Weak", color: "#fb7185" },
    { label: "Fair", color: "#fbbf24" }, { label: "Strong", color: "#34d399" }, { label: "Fortress", color: "#22d3ee" },
  ];
  return { score: s, ...map[s] };
}

function Field({ label, value, onChange, type = "text", placeholder, accent, icon, trailing }) {
  const [focus, setFocus] = useState(false);
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-bold tracking-[0.12em] text-slate-500 uppercase">{label}</span>
      <span
        className="flex items-center gap-2.5 rounded-xl border bg-white/70 px-3 transition-all duration-300"
        style={{ borderColor: focus ? `${accent}90` : "rgba(15,23,42,0.15)", boxShadow: focus ? `0 0 0 3px ${accent}22, 0 4px 16px -4px ${accent}40` : "inset 0 2px 4px rgba(15,23,42,0.02)" }}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 transition-colors duration-300" fill="none" stroke={focus ? accent : "rgba(15,23,42,0.3)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
        <input value={value} onChange={(e) => onChange(e.target.value)} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} type={type} placeholder={placeholder} autoComplete="off"
          className="h-11 w-full bg-transparent text-[14px] font-medium text-slate-900 placeholder-slate-400 outline-none" />
        {trailing}
      </span>
    </label>
  );
}

function LoginCard({ active, onLoginSuccess }) {
  const wrapRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);

  /* ===== Django logic states ===== */
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const strength = pwStrength(password);

  const onMove = (e) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setTilt({ x: -((e.clientY - r.top) / r.height - 0.5) * 11, y: ((e.clientX - r.left) / r.width - 0.5) * 13 });
  };

  /* ===== ORIGINAL Django login ===== */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/accounts/login/`, {
        username,
        password
      });

      const { access, refresh, user } = response.data;

      localStorage.setItem("token", access);
      localStorage.setItem("refresh", refresh);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("username", user.username);

      if (onLoginSuccess) {
        onLoginSuccess(user);
      }

      setSuccess("Superadmin authenticated! Opening meda dashboard...");

      setTimeout(() => {
        navigate("/dashboard");
      }, 700);

    } catch (err) {
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        let errorMsg = "Invalid username or password.";

        if (typeof errorData === "string") {
          errorMsg = "Backend routing error: Please verify server configuration.";
        } else if (errorData.non_field_errors) {
          errorMsg = errorData.non_field_errors[0];
        } else if (errorData.detail) {
          errorMsg = errorData.detail;
        } else if (errorData.username) {
          errorMsg = errorData.username[0];
        } else if (errorData.password) {
          errorMsg = errorData.password[0];
        }

        setError(errorMsg);
      } else {
        setError(`Cannot connect to backend server. Please verify Django backend is running at ${API_BASE_URL}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={wrapRef} onPointerMove={onMove} onPointerLeave={() => setTilt({ x: 0, y: 0 })} className="w-full max-w-[440px]" style={{ perspective: "1300px" }}>
      <div className="preserve-3d relative transition-transform duration-200 ease-out" style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}>
        <div className="absolute -inset-6 -z-10 rounded-[38px] blur-3xl" style={{ background: "radial-gradient(60% 60% at 50% 45%, rgba(var(--accent-rgb),0.35), transparent 72%)" }} />
        <div className="relative overflow-hidden rounded-[28px] p-[1.5px] shadow-2xl">
          <div className="sweep-border opacity-70" />
          <div className="glass relative overflow-hidden rounded-[26.5px] bg-white/80 px-6 py-7 sm:px-8">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/60 to-transparent" />

            <div className="preserve-3d relative" style={{ transform: "translateZ(46px)" }}>
              <h1 className="pop-in mt-2 text-[27px] leading-[1.15] font-bold tracking-tight text-slate-900">
                Welcome back,<br />
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(90deg, ${active.accent}, ${active.accent2})` }}>energy operator.</span>
              </h1>
              <p className="pop-in mt-2 text-[13px] font-medium text-slate-600">One console for every renewable asset on the grid.</p>
            </div>

            {error && (
              <p className="pop-in mt-4 flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[12px] font-medium text-rose-600">
                <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7.5v5.5M12 16.4h.01" strokeLinecap="round" /></svg>
                {error}
              </p>
            )}
            {success && (
              <p className="pop-in mt-4 flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-[12px] font-medium text-emerald-700">
                <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="m8.5 12.5 2.5 2.5 4.5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                {success}
              </p>
            )}

            <form onSubmit={handleLogin} className="preserve-3d relative mt-5 space-y-3.5" style={{ transform: "translateZ(24px)" }}>
              <Field label="Operator e-mail or username" value={username} onChange={setUsername} type="text" placeholder="admin@meda.gov.in or username" accent={active.accent}
                icon={<><rect x="2.5" y="4.5" width="19" height="15" rx="3" /><path d="m3.5 7 8.5 6 8.5-6" /></>} />
              <div>
                <Field label="Passkey" value={password} onChange={setPassword} type={showPw ? "text" : "password"} placeholder="••••••••••" accent={active.accent}
                  icon={<><rect x="4" y="10" width="16" height="10.5" rx="2.6" /><path d="M8 10V7.4a4 4 0 0 1 8 0V10" /></>}
                  trailing={<button type="button" onClick={() => setShowPw((v) => !v)} className="rounded-md px-1.5 py-1 text-[10.5px] font-bold tracking-wide text-slate-400 uppercase transition hover:text-slate-700">{showPw ? "Hide" : "Show"}</button>} />
                {password.length > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex h-1 flex-1 gap-1">
                      {[0, 1, 2, 3].map((i) => (
                        <span key={i} className="h-full flex-1 rounded-full transition-all duration-500" style={{ background: i < strength.score ? strength.color : "rgba(15,23,42,0.1)" }} />
                      ))}
                    </div>
                    <span className="text-[10.5px] font-bold" style={{ color: strength.color }}>{strength.label}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-0.5">
                <button type="button" onClick={() => setRemember((v) => !v)} className="group flex items-center gap-2 text-[12px] font-medium text-slate-500 transition hover:text-slate-800">
                  <span className="relative flex h-4 w-7 items-center rounded-full border transition-colors duration-300" style={{ borderColor: remember ? `${active.accent}aa` : "rgba(15,23,42,0.2)", background: remember ? `${active.accent}20` : "rgba(15,23,42,0.05)" }}>
                    <span className="absolute h-2.5 w-2.5 rounded-full shadow-sm transition-all duration-300" style={{ left: remember ? 14 : 3, background: remember ? active.accent : "rgba(15,23,42,0.4)" }} />
                  </span>
                  Keep me signed in
                </button>
                <a href="#reset" className="text-[12px] font-bold transition hover:opacity-80" style={{ color: active.accent }}>Forgot passkey?</a>
              </div>

              <button type="submit" disabled={loading}
                className="group relative mt-1 flex h-12 w-full items-center justify-center overflow-hidden rounded-xl text-[14px] font-bold text-white transition-transform duration-200 active:scale-[0.985] disabled:cursor-wait"
                style={{ background: `linear-gradient(120deg, ${active.accent}, ${active.accent2})`, boxShadow: `0 8px 24px -6px ${active.accent}90, inset 0 1px 0 rgba(255,255,255,0.4)` }}>
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                {loading ? (
                  <span className="relative flex items-center gap-2.5">
                    <svg viewBox="0 0 24 24" className="spin-fast h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M21 12a9 9 0 1 1-6.2-8.6" strokeLinecap="round" /></svg>
                    Authenticating Credentials...
                  </span>
                ) : (
                  <span className="relative flex items-center gap-2">
                    Enter control room
                    <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h13M12 5.5 18.5 12 12 18.5" /></svg>
                  </span>
                )}
              </button>

              {loading && (
                <div className="h-1 overflow-hidden rounded-full bg-slate-200">
                  <div className="charge h-full rounded-full" style={{ width: "100%", background: `linear-gradient(90deg, ${active.accent}, ${active.accent2})` }} />
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   ROOT — accent auto-cycles through all nine sources
----------------------------------------------------------------*/
export default function Login({ onLoginSuccess }) {
  const [idx, setIdx] = useState(4);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => setIdx((i) => (i + 1) % ENERGY_TYPES.length), 5200);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    // 4.5 seconds delay to populate login form and telemetry screen data over background video
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  const active = ENERGY_TYPES[idx];

  return (
    <div
      className="nx-root relative flex min-h-screen w-full max-w-[100vw] flex-col justify-between overflow-x-hidden overflow-y-auto bg-slate-950 text-slate-900 select-none"
      style={{ "--accent": active.accent, "--accent-2": active.accent2, "--accent-rgb": active.rgb }}
    >
      <LoginStyles />
      <VideoBackground />

      <div className="relative z-10 flex min-h-screen w-full flex-col justify-between">
        <div className={`fade-delay-enter ${showContent ? "active" : ""}`} style={{ transitionDelay: "0ms" }}>
          <BrandBar />
        </div>

        <main className="relative z-20 mx-auto flex w-full max-w-[1380px] flex-1 flex-col items-center justify-center gap-10 px-5 py-6 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:px-10">
          <div className={`w-full max-w-[560px] lg:w-auto fade-delay-enter ${showContent ? "active" : ""}`} style={{ transitionDelay: "200ms" }}>
            <LiveHud active={active} />
          </div>
          <div className={`flex w-full justify-center lg:w-auto lg:justify-end fade-delay-enter ${showContent ? "active" : ""}`} style={{ transitionDelay: "400ms" }}>
            <LoginCard active={active} onLoginSuccess={onLoginSuccess} />
          </div>
        </main>

        <div className={`fade-delay-enter ${showContent ? "active" : ""}`} style={{ transitionDelay: "600ms" }}>
          <Ticker active={active} />
        </div>
      </div>
    </div>
  );
}
