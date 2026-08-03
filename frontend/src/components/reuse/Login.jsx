import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import heroLogo from "../../assets/logo.png";

/* =====================================================================
   meda · Superadmin Login
   LOGIC: aapka original Django auth code — bilkul unchanged.
   UI:    NexaGrid living-grid scene (screenshot jaisa).
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
      background: linear-gradient(150deg, rgba(255,255,255,0.85), rgba(255,255,255,0.55) 45%, rgba(255,255,255,0.75));
      backdrop-filter: blur(26px) saturate(180%);
      -webkit-backdrop-filter: blur(26px) saturate(180%);
      border: 1px solid rgba(255,255,255,0.9);
      box-shadow: 0 8px 32px rgba(15,23,42,0.06), inset 0 1px 0 rgba(255,255,255,1);
    }
    @keyframes auroraDrift { 0%{transform:translate3d(-6%,0,0) scale(1);opacity:.55} 50%{transform:translate3d(8%,-4%,0) scale(1.18);opacity:.85} 100%{transform:translate3d(-6%,0,0) scale(1);opacity:.55} }
    .aurora { position:absolute; border-radius:50%; filter:blur(70px); animation:auroraDrift 18s ease-in-out infinite; will-change:transform,opacity; }
    @keyframes corePulse { 0%,100%{transform:scale(1);filter:brightness(1)} 50%{transform:scale(1.06);filter:brightness(1.25)} }
    @keyframes ringExpand { 0%{transform:scale(.55);opacity:.85} 100%{transform:scale(2.4);opacity:0} }
    .core-ring { position:absolute; inset:0; border-radius:50%; border:1px solid rgba(251,191,36,0.55); animation:ringExpand 5s ease-out infinite; }
    @keyframes slowSpin { to{transform:rotate(360deg)} }
    @keyframes gridScroll { to{background-position:0 60px,0 60px} }
    .grid-floor {
      position:absolute; left:50%; bottom:-4%; width:320%; height:62%;
      transform:translateX(-50%) perspective(340px) rotateX(74deg); transform-origin:bottom center;
      background-size:60px 60px,60px 60px; animation:gridScroll 2.6s linear infinite;
      -webkit-mask-image:linear-gradient(to top, rgba(0,0,0,.95) 0%, rgba(0,0,0,.5) 45%, transparent 88%);
      mask-image:linear-gradient(to top, rgba(0,0,0,.95) 0%, rgba(0,0,0,.5) 45%, transparent 88%);
    }
    @keyframes bladeSpin { to{transform:rotate(360deg)} }
    .turbine { position:absolute; bottom:0; transform-origin:bottom center; }
    .turbine .tower {
      position:absolute; left:50%; bottom:0; translate:-50% 0; width:calc(var(--u)*0.062); height:calc(var(--u)*1);
      background:linear-gradient(90deg, rgba(255,255,255,0.06), rgba(226,240,255,0.78) 45%, rgba(255,255,255,0.05));
      clip-path:polygon(36% 0,64% 0,100% 100%,0 100%); box-shadow:0 0 20px rgba(14,165,233,0.35);
    }
    .turbine .head {
      position:absolute; left:50%; bottom:calc(var(--u)*0.98); translate:-50% 0; width:calc(var(--u)*0.16); height:calc(var(--u)*0.09);
      border-radius:99px; background:linear-gradient(90deg,#cfe6ff,#7fd8ee); box-shadow:0 0 18px rgba(14,165,233,0.7); z-index:2;
    }
    .turbine .rotor { position:absolute; left:50%; bottom:calc(var(--u)*1.025); translate:-50% 0; width:0; height:0; animation:bladeSpin linear infinite; z-index:3; }
    .turbine .hub { position:absolute; left:50%; top:50%; translate:-50% -50%; width:calc(var(--u)*0.07); height:calc(var(--u)*0.07); border-radius:50%; background:#eaf6ff; box-shadow:0 0 14px rgba(14,165,233,0.9); }
    .turbine .blade {
      position:absolute; left:50%; bottom:0; translate:-50% 0; width:calc(var(--u)*0.055); height:calc(var(--u)*0.46); transform-origin:50% 100%;
      background:linear-gradient(to top, rgba(226,244,255,0.95), rgba(56,189,248,0.55));
      clip-path:polygon(46% 0,62% 12%,100% 88%,50% 100%,0 88%,38% 12%); filter:drop-shadow(0 0 7px rgba(56,189,248,0.6));
    }
    @keyframes panelShine { 0%{transform:translateX(-140%) skewX(-18deg);opacity:0} 18%{opacity:.9} 55%{opacity:0} 100%{transform:translateX(260%) skewX(-18deg);opacity:0} }
    .solar-panel {
      position:relative; overflow:hidden; border-radius:3px; border:1px solid rgba(245,158,11,0.6);
      background-image:linear-gradient(to right, rgba(255,255,255,0.24) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.24) 1px, transparent 1px), linear-gradient(160deg, #1e3a5f, #0a1a30);
      background-size:25% 100%,100% 50%,100% 100%; box-shadow:0 0 20px -4px rgba(245,158,11,0.65);
    }
    .solar-panel::after { content:""; position:absolute; inset:0; width:45%; background:linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent); animation:panelShine 4.5s ease-in-out infinite; }
    @keyframes waveShift { to{transform:translateX(-50%)} }
    .wave-band { position:absolute; width:200%; height:100%; animation:waveShift linear infinite; }
    @keyframes floaty { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
    .floaty { animation:floaty 7s ease-in-out infinite; }
    @keyframes livePulse { 0%{box-shadow:0 0 0 0 rgba(16,185,129,.6)} 70%{box-shadow:0 0 0 9px rgba(16,185,129,0)} 100%{box-shadow:0 0 0 0 rgba(16,185,129,0)} }
    .live-dot { animation:livePulse 2s infinite; }
    @keyframes scanLine { 0%{transform:translateY(-100%);opacity:0} 15%{opacity:.9} 85%{opacity:.9} 100%{transform:translateY(1200%);opacity:0} }
    .scan-line { animation:scanLine 7s linear infinite; }
    @keyframes tickerScroll { from{transform:translateX(0)} to{transform:translateX(-50%)} }
    .ticker-track { display:inline-flex; animation:tickerScroll 40s linear infinite; }
    .ticker-track:hover { animation-play-state:paused; }
    @keyframes dashFlow { to{stroke-dashoffset:-260} }
    .dash-flow { stroke-dasharray:6 14; animation:dashFlow 4s linear infinite; }
    @keyframes borderSweep { to{transform:rotate(360deg)} }
    .sweep-border {
      position:absolute; inset:-140%;
      background:conic-gradient(from 0deg, transparent 0deg, rgba(var(--accent-rgb),0.9) 40deg, transparent 110deg, transparent 250deg, rgba(16,185,129,0.7) 300deg, transparent 340deg);
      animation:borderSweep 7s linear infinite;
    }
    @keyframes chargeFill { from{width:0%} }
    .charge { animation:chargeFill 1.4s ease-out; }
    @keyframes popIn { from{opacity:0;transform:translateY(14px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
    .pop-in { animation:popIn .6s cubic-bezier(.22,1,.36,1) both; }
    @keyframes spinFast { to{transform:rotate(360deg)} }
    .spin-fast { animation:spinFast .8s linear infinite; }
    @keyframes evBlink { 0%,100%{opacity:1} 50%{opacity:.25} }
    .ev-blink { animation:evBlink 1.4s ease-in-out infinite; }
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

function usePointerParallax() {
  const [p, setP] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e) => setP({ x: (e.clientX / window.innerWidth) * 2 - 1, y: (e.clientY / window.innerHeight) * 2 - 1 });
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return p;
}

/* ---------------------------------------------------------------
   PARTICLE FIELD
----------------------------------------------------------------*/
function ParticleField({ rgb, density = 80 }) {
  const ref = useRef(null);
  const rgbRef = useRef(rgb);
  rgbRef.current = rgb;
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let w = 0, h = 0, dpr = 1, parts = [], raf = 0, t = 0;
    const spawn = (init = false) => {
      const z = Math.random();
      return { x: Math.random() * w, y: init ? Math.random() * h : h + Math.random() * 80, r: 0.5 + z * 2.4, vy: 0.15 + z * 0.75, vx: (Math.random() - 0.5) * 0.35, a: 0.15 + z * 0.6, tw: Math.random() * Math.PI * 2 };
    };
    const build = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr); canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      parts = Array.from({ length: Math.round(density * Math.min(1.4, Math.max(0.5, w / 1200))) }, () => spawn(true));
    };
    const draw = () => {
      t += 0.016;
      ctx.clearRect(0, 0, w, h);
      const c = rgbRef.current;
      for (const p of parts) {
        p.y -= p.vy; p.x += p.vx + Math.sin(t * 0.6 + p.tw) * 0.25; p.tw += 0.02;
        if (p.y < -20) Object.assign(p, spawn());
        if (p.x < -30) p.x = w + 20;
        if (p.x > w + 30) p.x = -20;
        const alpha = p.a * (0.6 + Math.sin(p.tw * 1.7) * 0.4);
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
        g.addColorStop(0, `rgba(${c}, ${alpha * 0.8})`);
        g.addColorStop(0.4, `rgba(${c}, ${alpha * 0.25})`);
        g.addColorStop(1, `rgba(${c}, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2); ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    build(); draw();
    const ro = new ResizeObserver(build);
    ro.observe(canvas);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [density]);
  return <canvas ref={ref} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden />;
}

/* ---------------------------------------------------------------
   SCENE
----------------------------------------------------------------*/
const P = 1400;
function Layer({ z, children }) {
  const scale = (P - z) / P;
  return <div className="absolute inset-0" style={{ transform: `translateZ(${z}px) scale(${scale})`, transformStyle: "preserve-3d" }}>{children}</div>;
}

function Turbine({ left, size, speed, opacity = 1, flip = false }) {
  return (
    <div className="turbine" style={{ left, "--u": `${size}px`, width: size, height: size * 1.5, opacity, transform: `rotateY(${flip ? -22 : 16}deg)` }}>
      <div className="tower" /><div className="head" />
      <div className="rotor" style={{ animationDuration: `${speed}s` }}>
        <div className="hub" />
        {[0, 120, 240].map((d) => <span key={d} className="blade" style={{ transform: `rotate(${d}deg)` }} />)}
      </div>
    </div>
  );
}

function SolarArray({ left, bottom, scale = 1 }) {
  return (
    <div className="absolute preserve-3d" style={{ left, bottom, transform: `scale(${scale}) rotateX(58deg) rotateZ(-8deg)`, transformOrigin: "bottom center" }}>
      {[0, 1, 2].map((r) => (
        <div key={r} className="preserve-3d mb-3 flex gap-2" style={{ transform: `translateZ(${r * 6}px)` }}>
          {Array.from({ length: 5 }).map((_, c) => (
            <div key={c} className="solar-panel" style={{ width: 54, height: 32, transform: "rotateX(-52deg)", transformOrigin: "bottom center", animationDelay: `${(r * 5 + c) * 0.22}s` }} />
          ))}
        </div>
      ))}
    </div>
  );
}

function Pylon({ left, h, o = 1 }) {
  return (
    <svg className="absolute bottom-0" style={{ left, width: h * 0.5, height: h, opacity: o }} viewBox="0 0 50 100" fill="none" stroke="rgba(var(--accent-rgb),0.75)" strokeWidth="1.2">
      <path d="M25 0 L10 100 M25 0 L40 100 M12 86 H38 M15 66 H35 M18 46 H32 M20 30 H30" />
      <path d="M15 66 L35 46 M35 66 L15 46 M18 46 L32 30 M32 46 L18 30" opacity="0.55" />
      <path d="M4 30 H46 M8 18 H42" strokeWidth="1.6" />
      <circle cx="25" cy="8" r="2" fill="rgba(var(--accent-rgb),0.9)" stroke="none" />
    </svg>
  );
}

function EvPost({ left, bottom, delay = 0 }) {
  return (
    <div className="absolute" style={{ left, bottom }}>
      <div className="relative h-16 w-7 rounded-md border border-teal-500/60 bg-gradient-to-b from-slate-100 to-slate-300 shadow-lg">
        <div className="absolute left-1/2 top-2 h-5 w-4 -translate-x-1/2 rounded-sm bg-slate-800">
          <div className="ev-blink mx-auto mt-1 h-1 w-2 rounded-full bg-teal-400" style={{ animationDelay: `${delay}s` }} />
        </div>
        <div className="absolute -right-3 top-3 h-8 w-[3px] rounded-full bg-slate-500/70" />
        <div className="absolute -right-3.5 top-10 h-2.5 w-2.5 rounded-full bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.9)]" />
      </div>
    </div>
  );
}

function EnergyScene({ px, py, rgb }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ perspective: `${P}px`, perspectiveOrigin: "50% 42%" }} aria-hidden>
      <div className="preserve-3d absolute inset-0 transition-transform duration-[900ms] ease-out" style={{ transform: `rotateX(${py * -0.5}deg) rotateY(${px * 0.7}deg)` }}>

        <Layer z={-1000}>
          <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_105%,#e0f2fe_0%,#bae6fd_38%,#7dd3fc_72%,#38bdf8_100%)]" />
          <div className="aurora" style={{ left: "6%", top: "4%", width: "44%", height: "48%", background: "radial-gradient(circle, rgba(255,255,255,0.8), transparent 65%)" }} />
          <div className="aurora" style={{ right: "2%", top: "-6%", width: "50%", height: "55%", background: "radial-gradient(circle, rgba(255,255,255,0.6), transparent 68%)", animationDelay: "-7s" }} />
        </Layer>

        <Layer z={-820}>
          <div className="absolute" style={{ left: "58%", top: "16%", width: 300, height: 300, transform: "translate(-50%,-50%)" }}>
            <div className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle, rgba(251,191,36,0.95) 0%, rgba(251,191,36,0.3) 34%, transparent 66%)", animation: "corePulse 6s ease-in-out infinite", filter: "blur(4px)" }} />
            <div className="absolute rounded-full" style={{ inset: "34%", background: "radial-gradient(circle at 40% 35%, #ffffff, rgba(253,230,138,0.9) 55%, transparent 75%)", boxShadow: "0 0 90px 24px rgba(251,191,36,0.4)", animation: "corePulse 4s ease-in-out infinite" }} />
            {[0, 1.6, 3.2].map((d) => <div key={d} className="core-ring" style={{ animationDelay: `${d}s` }} />)}
            <div className="absolute inset-[-14%]" style={{ animation: "slowSpin 26s linear infinite" }}>
              <div className="absolute inset-0 rounded-[50%] border-2 border-indigo-400/50 [transform:rotate(20deg)_scaleY(0.32)]" />
              <div className="absolute inset-0 rounded-[50%] border-2 border-cyan-400/50 [transform:rotate(80deg)_scaleY(0.32)]" />
              <div className="absolute inset-0 rounded-[50%] border-2 border-emerald-400/50 [transform:rotate(140deg)_scaleY(0.32)]" />
            </div>
          </div>
        </Layer>

        <Layer z={-640}>
          <svg className="absolute bottom-[26%] left-0 w-full" viewBox="0 0 1440 300" preserveAspectRatio="none" style={{ height: "34%" }}>
            <defs><linearGradient id="ridgeFar" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#94a3b8" /><stop offset="100%" stopColor="#cbd5e1" /></linearGradient></defs>
            <path d="M0,215 L120,140 L215,185 L335,100 L440,170 L545,112 L665,196 L790,132 L905,190 L1025,122 L1145,182 L1265,118 L1385,188 L1440,150 L1440,300 L0,300 Z" fill="url(#ridgeFar)" opacity="0.8" />
          </svg>
        </Layer>

        <Layer z={-500}>
          <div className="absolute bottom-[27%] left-0 h-40 w-full">
            {[8, 17, 26, 74, 83, 92].map((l, i) => <Turbine key={l} left={`${l}%`} size={46} speed={1.9 * (1 + (i % 3) * 0.22)} opacity={0.8} />)}
          </div>
        </Layer>

        <Layer z={-430}>
          {[{ l: "31%", w: 90, d: "0s" }, { l: "38%", w: 60, d: "-3s" }, { l: "44%", w: 74, d: "-6s" }].map((v) => (
            <div key={v.l} className="floaty absolute bottom-[27%] rounded-full" style={{ left: v.l, width: v.w, height: v.w * 2.1, animationDelay: v.d, opacity: 0.55, filter: "blur(18px)", background: "linear-gradient(to top, rgba(148,163,184,0.7), rgba(255,255,255,0.85), transparent)" }} />
          ))}
        </Layer>

        <Layer z={-330}>
          <svg className="absolute bottom-[20%] left-0 w-full" viewBox="0 0 1440 260" preserveAspectRatio="none" style={{ height: "30%" }}>
            <path d="M0,190 C160,120 260,205 400,160 C540,115 640,200 790,168 C940,136 1050,196 1200,150 C1320,113 1390,175 1440,158 L1440,260 L0,260 Z" fill="#64748b" opacity="0.9" />
            <path d="M0,190 C160,120 260,205 400,160 C540,115 640,200 790,168 C940,136 1050,196 1200,150 C1320,113 1390,175 1440,158" fill="none" stroke="rgba(16,185,129,0.75)" strokeWidth="2" />
          </svg>
          <div className="absolute bottom-[20%] left-[4%] flex items-end gap-[6px]">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} style={{ width: 0, height: 0, borderLeft: `${5 + (i % 3)}px solid transparent`, borderRight: `${5 + (i % 3)}px solid transparent`, borderBottom: `${20 + (i % 4) * 7}px solid rgba(16,185,129,0.85)` }} />
            ))}
          </div>
        </Layer>

        <Layer z={-190}>
          <div className="absolute bottom-[19%] left-0 h-80 w-full">
            <Turbine left="6%" size={124} speed={2} opacity={1} />
            <Turbine left="17%" size={92} speed={2.6} opacity={0.9} flip />
            <Turbine left="29%" size={108} speed={2.2} opacity={0.95} />
            <Turbine left="40%" size={84} speed={3} opacity={0.85} flip />
            <Turbine left="64%" size={96} speed={2.4} opacity={0.9} />
            <Turbine left="79%" size={118} speed={2.1} opacity={0.95} flip />
            <Turbine left="90%" size={80} speed={2.9} opacity={0.8} />
          </div>
        </Layer>

        <Layer z={-110}>
          <svg className="absolute bottom-[17%] left-0 w-full" viewBox="0 0 1440 160" preserveAspectRatio="none" style={{ height: "18%" }}>
            <path className="dash-flow" d="M60,42 Q210,88 360,42 T660,42 T960,42 T1260,42" fill="none" stroke="rgba(var(--accent-rgb),0.85)" strokeWidth="2.5" />
            <path className="dash-flow" style={{ animationDelay: "-2s" }} d="M60,62 Q210,112 360,62 T660,62 T960,62 T1260,62" fill="none" stroke="rgba(16,185,129,0.8)" strokeWidth="2" />
          </svg>
          <Pylon left="4%" h={150} o={0.85} /><Pylon left="24%" h={130} o={0.7} /><Pylon left="64%" h={140} o={0.6} /><Pylon left="88%" h={120} o={0.5} />
        </Layer>

        <Layer z={-40}>
          <SolarArray left="6%" bottom="15%" scale={1} />
          <div className="absolute preserve-3d" style={{ left: "47%", bottom: "14%", transform: "scale(1.15) rotateX(60deg) rotateZ(-10deg)" }}>
            <div className="flex gap-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="relative h-20 w-12 overflow-hidden rounded-sm border-2 border-slate-400 bg-slate-300 shadow-xl">
                  <div className="absolute top-2 h-2 w-full bg-indigo-500/60" />
                  <div className="absolute bottom-4 left-1/2 h-2 w-2 -translate-x-1/2 animate-pulse rounded-full bg-emerald-400" style={{ animationDelay: `${i * 0.4}s` }} />
                </div>
              ))}
            </div>
          </div>
          <EvPost left="60%" bottom="15%" delay={0} />
          <EvPost left="64.5%" bottom="14%" delay={0.5} />
          <EvPost left="69%" bottom="15%" delay={1} />
          <SolarArray left="76%" bottom="14%" scale={0.9} />
        </Layer>

        <Layer z={0}>
          <div className="grid-floor" style={{ backgroundImage: "linear-gradient(to right, rgba(15,23,42,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.15) 1.4px, transparent 1.4px)" }} />
        </Layer>

        <Layer z={90}>
          <div className="absolute bottom-0 left-0 h-[22%] w-full overflow-hidden">
            <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(240,249,255,0) 0%, rgba(186,230,253,0.8) 40%, rgba(125,211,252,0.95) 100%)" }} />
            {[{ d: 11, o: 0.7, b: "38%", c: "rgba(2,132,199,0.4)" }, { d: 17, o: 0.6, b: "22%", c: "rgba(3,105,161,0.5)" }, { d: 23, o: 0.5, b: "8%", c: "rgba(7,89,133,0.6)" }].map((wv) => (
              <div key={wv.b} className="wave-band" style={{ bottom: wv.b, height: 40, animationDuration: `${wv.d}s`, opacity: wv.o }}>
                <svg viewBox="0 0 1200 40" preserveAspectRatio="none" className="h-full w-full">
                  <path d="M0,20 C100,4 200,36 300,20 C400,4 500,36 600,20 C700,4 800,36 900,20 C1000,4 1100,36 1200,20" fill="none" stroke={wv.c} strokeWidth="3" />
                </svg>
              </div>
            ))}
          </div>
        </Layer>

        <Layer z={230}>
          <div className="absolute inset-0 bg-[radial-gradient(130%_100%_at_50%_50%,transparent_35%,rgba(248,250,252,0.85)_100%)]" />
        </Layer>
      </div>

      <ParticleField rgb={rgb} />
      <div className="absolute inset-0 overflow-hidden">
        <div className="scan-line h-24 w-full" style={{ background: "linear-gradient(to bottom, transparent, rgba(var(--accent-rgb),0.08), transparent)" }} />
      </div>
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
        <img src={heroLogo} alt="meda" className="h-[160px] w-[160px] rounded-2xl object-contain" style={{ filter: "drop-shadow(0 10px 24px rgba(16,185,129,0.45))" }} />
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <span className="hidden items-center gap-1.5 text-[11.5px] font-medium text-slate-500 md:flex">
          <span className="live-dot h-1.5 w-1.5 rounded-full bg-emerald-500" /> 9 sources · all nominal
        </span>
        <span className="mono rounded-lg border border-slate-200 bg-white/70 px-2.5 py-1 text-[11.5px] font-semibold tracking-wider text-slate-700 tabular-nums shadow-sm">
          {now.toLocaleTimeString("en-GB")} IST
        </span>
      </div>
    </header>
  );
}

function Ticker({ active }) {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="relative z-30 w-full overflow-hidden border-t border-slate-200 bg-white/60 py-2 backdrop-blur-md">
      <div className="ticker-track">
        {items.map((t, i) => (
          <span key={i} className="flex shrink-0 items-center gap-2 px-6 text-[11.5px] font-medium whitespace-nowrap text-slate-600">
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
    { label: "Solar Installed", val: "4.8 GW", color: "#d97706", bg: "rgba(245,158,11,0.16)",
      icon: <svg viewBox="0 0 24 24" {...S}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg> },
    { label: "Wind Power", val: "5.2 GW", color: "#0891b2", bg: "rgba(6,182,212,0.16)",
      icon: <svg viewBox="0 0 24 24" {...S}><path d="M12.8 19.6A2 2 0 1 0 14 16H2" /><path d="M17.5 8a2.5 2.5 0 1 1 2 4H2" /><path d="M9.8 4.4A2 2 0 1 1 11 8H2" /></svg> },
    { label: "Tons CO₂ Saved", val: `${fmt(co2 / 1_000_000, 1)}M`, color: "#059669", bg: "rgba(16,185,129,0.16)",
      icon: <svg viewBox="0 0 24 24" {...S}><path d="M4 20c0-8 6-14 16-14 0 9-5.4 14-11 14-2.6 0-5-1.6-5-1.6Z" /><path d="M8 20C9.5 15 13 12 17 10" /></svg> },
    { label: "Grid Reliability", val: `${rel.toFixed(1)}%`, color: "#7c3aed", bg: "rgba(139,92,246,0.16)",
      icon: <svg viewBox="0 0 24 24" {...S}><path d="M15 7h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-1" /><path d="M5 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h1" /><path d="m11 7-3 5h4l-3 5" /><path d="M22 11v2" /></svg> },
  ];

  return (
    <div className="relative z-20 w-full max-w-[560px]">
      <div className="pop-in" style={{ animationDelay: "0.08s" }}>
        <span className="inline-flex items-center gap-2 rounded-full border bg-white/70 px-3 py-1.5 text-[11px] font-bold tracking-wide shadow-sm backdrop-blur-md" style={{ borderColor: `${active.accent}50`, color: active.accent, transition: "all .8s" }}>
          <span className="live-dot h-1.5 w-1.5 rounded-full" style={{ background: active.accent }} />
          {active.hi} · live national grid
        </span>

        <h2 className="mt-5 text-[40px] leading-[1.04] font-bold tracking-tight text-slate-900 sm:text-[54px]">
          Nine clean sources.
          <br />
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(90deg, ${active.accent}, ${active.accent2})`, transition: "all .8s" }}>One living grid.</span>
        </h2>
        <p className="mt-4 max-w-[470px] text-[15px] leading-relaxed font-medium text-slate-600">
          Solar, wind, hybrid, biomass, waste-to-energy, green hydrogen, BESS, pumped storage and EV charging — streaming together in the scene behind you.
        </p>
      </div>

      <div className="mt-7 grid max-w-[460px] grid-cols-2 gap-3">
        {tiles.map((t, i) => (
          <div
            key={t.label}
            className="pop-in group flex items-center gap-3 rounded-xl border border-white/80 bg-white/70 px-4 py-3.5 shadow-[0_10px_30px_-12px_rgba(15,23,42,0.18)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/90 hover:shadow-[0_16px_36px_-12px_rgba(15,23,42,0.28)]"
            style={{ animationDelay: `${0.15 + i * 0.08}s` }}
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" style={{ background: t.bg, color: t.color }}>
              <span className="h-5 w-5">{t.icon}</span>
            </span>
            <span className="min-w-0">
              <span className="mono block text-[17px] leading-tight font-bold text-slate-900 tabular-nums">{t.val}</span>
              <span className="block text-[11px] font-medium text-slate-500">{t.label}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   LOGIN CARD — screenshot UI + aapka original Django logic
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

  /* ===== aapke original code ke states — unchanged ===== */
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

  /* ===== aapka ORIGINAL Django login — bilkul same ===== */
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
      const response = await axios.post("http://localhost:8000/api/accounts/login/", {
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
        setError("Cannot connect to backend server. Please verify Django backend is running at http://localhost:8000");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={wrapRef} onPointerMove={onMove} onPointerLeave={() => setTilt({ x: 0, y: 0 })} className="w-full max-w-[440px]" style={{ perspective: "1300px" }}>
      <div className="preserve-3d relative transition-transform duration-200 ease-out" style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}>
        <div className="absolute -inset-6 -z-10 rounded-[38px] blur-3xl" style={{ background: "radial-gradient(60% 60% at 50% 45%, rgba(var(--accent-rgb),0.30), transparent 72%)" }} />
        <div className="relative overflow-hidden rounded-[28px] p-[1.5px] shadow-2xl shadow-slate-200/60">
          <div className="sweep-border opacity-70" />
          <div className="glass relative overflow-hidden rounded-[26.5px] bg-white/75 px-6 py-7 sm:px-8">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/60 to-transparent" />

            <div className="preserve-3d relative" style={{ transform: "translateZ(46px)" }}>
              
              <h1 className="pop-in mt-2 text-[27px] leading-[1.15] font-bold tracking-tight text-slate-900">
                Welcome back,<br />
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(90deg, ${active.accent}, ${active.accent2})` }}>energy operator.</span>
              </h1>
              <p className="pop-in mt-2 text-[13px] font-medium text-slate-500">One console for every renewable asset on the grid.</p>
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
              <Field label="Operator e-mail" value={username} onChange={setUsername} type="text" placeholder="you@nexagrid.energy" accent={active.accent}
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
  useEffect(() => {
    const id = window.setInterval(() => setIdx((i) => (i + 1) % ENERGY_TYPES.length), 5200);
    return () => window.clearInterval(id);
  }, []);
  const active = ENERGY_TYPES[idx];
  const { x, y } = usePointerParallax();

  return (
    <div
      className="nx-root relative flex min-h-screen w-full max-w-[100vw] flex-col overflow-x-hidden overflow-y-auto bg-[#f8fafc]"
      style={{ "--accent": active.accent, "--accent-2": active.accent2, "--accent-rgb": active.rgb }}
    >
      <LoginStyles />
      <EnergyScene px={x} py={y} rgb={active.rgb} />
      <BrandBar />
      <main className="relative z-20 mx-auto flex w-full max-w-[1380px] flex-1 flex-col items-center justify-start gap-10 px-5 pt-0 pb-6 -mt-8 lg:flex-row lg:items-start lg:justify-between lg:gap-16 lg:px-10 lg:-mt-12">
        <div className="w-full max-w-[560px] lg:w-auto"><LiveHud active={active} /></div>
        <div className="flex w-full justify-center lg:w-auto lg:justify-end"><LoginCard active={active} onLoginSuccess={onLoginSuccess} /></div>
      </main>
      <Ticker active={active} />
    </div>
  );
}
