import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../services/apiConfig";

import heroLogo from "../../assets/logo.png";
import amritLogo from "../../assets/75.jpg";
import sealLogo from "../../assets/MH.png";
import ashokaLogo from "../../assets/emb.png";
import bgImage from "../../assets/bg_meda3.png";

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
   BACKGROUND IMAGE
----------------------------------------------------------------*/
function BackgroundImage() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-slate-950">
      <img
        src={bgImage}
        alt="MEDA Background"
        className="h-full w-full object-cover object-center opacity-100 brightness-[1.02] contrast-[1.02] transition-all duration-700"
      />
      {/* Subtle light vignette to keep image crisp and content readable */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none" />
    </div>
  );
}

/* ---------------------------------------------------------------
   CHROME: Official Top Navbar Header
----------------------------------------------------------------*/
const fmt = (n, d = 0) => n.toLocaleString("en-IN", { minimumFractionDigits: d, maximumFractionDigits: d });

function BrandBar() {
  return (
    <header className="relative z-30 w-full bg-white shadow-md border-t-4 border-[#362029]">
      <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center justify-between px-3 py-2 sm:px-6 md:px-8">
        
        {/* Left Section: MEDA Emblem & Amrit Mahotsav Logo */}
        <div className="flex items-center gap-3 sm:gap-5">
          <img
            src={heroLogo}
            alt="MEDA Mahaurja Logo"
            className="h-10 w-auto sm:h-12 md:h-14 object-contain"
          />
          <div className="h-8 w-[1px] bg-slate-200 hidden sm:block" />
          <img
            src={amritLogo}
            alt="75 Swatantryacha Amrit Mahotsav"
            className="h-9 w-auto sm:h-11 md:h-13 object-contain"
          />
        </div>

        {/* Center Section: Official Marathi Title */}
        <div className="my-1 flex flex-col items-center text-center px-2">
          <h1 className="text-[17px] font-bold tracking-tight text-[#1b2559] sm:text-[22px] md:text-[25px] leading-tight">
            महाराष्ट्र ऊर्जा विकास अभिकरण (महाऊर्जा)
          </h1>
          <p className="mt-0.5 text-[12px] font-semibold text-[#3b4874] sm:text-[14px] md:text-[15px] leading-tight">
            (महाराष्ट्र शासन संस्था)
          </p>
        </div>

        {/* Right Section: Maharashtra Rajyamudra & Satyameva Jayate Emblem */}
        <div className="flex items-center gap-3 sm:gap-5">
          <img
            src={sealLogo}
            alt="Maharashtra Rajyamudra Golden Seal"
            className="h-10 w-auto sm:h-12 md:h-13 object-contain"
          />
          <div className="h-8 w-[1px] bg-slate-200 hidden sm:block" />
          <img
            src={ashokaLogo}
            alt="National Emblem of India Satyameva Jayate"
            className="h-10 w-auto sm:h-12 md:h-14 object-contain"
          />
        </div>

      </div>
    </header>
  );
}

function Ticker({ active }) {
  const now = useClock();
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="relative z-30 flex w-full items-center justify-between border-t border-white/20 bg-slate-900/65 py-2.5 px-4 backdrop-blur-lg">
      <div className="ticker-track flex-1 overflow-hidden">
        {items.map((t, i) => (
          <span key={i} className="flex shrink-0 items-center gap-2 px-6 text-[11.5px] font-semibold whitespace-nowrap text-white/90">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: active.accent, boxShadow: `0 0 8px ${active.accent}90`, transition: "all .8s" }} />
            {t}
          </span>
        ))}
      </div>
      <span className="mono shrink-0 ml-4 rounded-lg border border-white/30 bg-slate-900/80 px-3 py-1 text-[11px] font-semibold tracking-wider text-white tabular-nums shadow-lg backdrop-blur-md">
        {now.toLocaleTimeString("en-GB")} IST
      </span>
    </div>
  );
}

/* ---------------------------------------------------------------
   LEFT HUD
----------------------------------------------------------------*/
const MINT_CARD_GRADIENT = "linear-gradient(135deg, #eef7f0 0%, #d5ebd9 50%, #bfe2c5 100%)";

const ENERGY_CAPACITY_BLOCKS = [
  { id: "solar", val: "20,477.42", unit: "MW", title: "Solar Power Projects" },
  { id: "wind", val: "6,371.81", unit: "MW", title: "Wind Power Projects" },
  { id: "bagasse", val: "2,732.80", unit: "MW", title: "Bagasse Based Co-gen Power" },
  { id: "small-hydro", val: "374.08", unit: "MW", title: "Small Hydro Power Projects" },
  { id: "large-hydro", val: "3061", unit: "MW", title: "Large Hydro Power Projects" },
  { id: "biomass", val: "215.00", unit: "MW", title: "Biomass Based Power Projects" },
  { id: "solid-waste", val: "59.79", unit: "MW", title: "Municipal Solid Waste Projects" },
];

function EnergyCard({ block, index }) {
  return (
    <div
      className="pop-in group relative flex h-[96px] w-full flex-col justify-between overflow-hidden rounded-xl border-2 border-white/90 bg-white p-0.5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{ animationDelay: `${0.1 + index * 0.04}s` }}
    >
      <div
        className="flex h-full w-full flex-col justify-between rounded-lg p-3 transition-all duration-300"
        style={{ background: MINT_CARD_GRADIENT }}
      >
        <div className="flex items-baseline gap-1.5">
          <span className="mono text-[19px] font-extrabold tracking-tight text-slate-900 tabular-nums sm:text-[21px]">
            {block.val}
          </span>
          <span className="text-[13px] font-bold text-slate-900 sm:text-[14px]">
            {block.unit}
          </span>
        </div>

        <h3 className="text-[12px] font-normal leading-snug text-slate-800 line-clamp-2 sm:text-[12.5px]">
          {block.title}
        </h3>
      </div>
    </div>
  );
}

function LiveHud({ active }) {
  return (
    <div className="relative z-20 w-full max-w-[860px]">
      <div className="pop-in pl-6 sm:pl-9 lg:pl-12" style={{ animationDelay: "0.08s" }}>
        <h1 className="text-[22px] font-bold tracking-tight text-white leading-snug drop-shadow-md sm:text-[26px] lg:text-[28px]">
          Maharashtra Renewable Energy Projects
          <span className="mt-1 block text-[15px] font-semibold text-emerald-400 drop-shadow-sm sm:text-[18px] lg:text-[20px]">
            – Commissioning Status Dashboard
          </span>
        </h1>
      </div>

      {/* Uniform grid of all 7 energy capacity blocks */}
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {ENERGY_CAPACITY_BLOCKS.map((block, i) => (
          <EnergyCard key={block.id} block={block} index={i} />
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
                    Login
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
      <BackgroundImage />

      <div className="relative z-10 flex min-h-screen w-full flex-col justify-between">
        <div className={`fade-delay-enter ${showContent ? "active" : ""}`} style={{ transitionDelay: "0ms" }}>
          <BrandBar />
        </div>

        <main className="relative z-20 mx-auto flex w-full max-w-[1540px] flex-1 flex-col items-center justify-center gap-8 px-4 py-6 xl:flex-row xl:items-end xl:justify-between xl:gap-12 xl:px-8 xl:pb-10">
          <div className={`w-full max-w-[880px] xl:w-auto flex-1 fade-delay-enter ${showContent ? "active" : ""}`} style={{ transitionDelay: "200ms" }}>
            <LiveHud active={active} />
          </div>
          <div className={`flex w-full justify-center xl:w-auto xl:justify-end shrink-0 fade-delay-enter ${showContent ? "active" : ""}`} style={{ transitionDelay: "400ms" }}>
            <LoginCard active={active} onLoginSuccess={onLoginSuccess} />
          </div>
        </main>
      </div>
    </div>
  );
}
