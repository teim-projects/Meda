import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sun,
  Download,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Zap,
  Building2,
  Cpu,
  Home,
  Layers
} from 'lucide-react';
import { energyApi } from '../../services/energyApi';

// Helper to format capacity removing trailing .00
const formatCapacityMw = (val) => {
  if (val === undefined || val === null || isNaN(val) || Number(val) === 0) return '0';
  const num = Number(val);
  return num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/\.00$/, '');
};

export const GridConnectedDashboard = ({ isEmbedded = false, onNavigateTab = null }) => {
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Dynamic state loaded from respective pages/APIs
  const [rePolicyMw, setRePolicyMw] = useState(6589.22);
  const [kusumMw, setKusumMw] = useState(114.00);
  const [mskvyMw, setMskvyMw] = useState(0);
  const [rooftopMw, setRooftopMw] = useState(8000.04);
  const [govtBuildingMw, setGovtBuildingMw] = useState(61.00);

  // Hardcoded values as explicitly requested by user
  const amrutMw = 15.81;
  const liftIrrigationMw = 0.00;
  const textileSchemeMw = 0.00;

  // Load live data from respective APIs
  const loadDynamicData = () => {
    setIsRefreshing(true);
    Promise.allSettled([
      energyApi.getAnalytics('solar-grid'),
      energyApi.getAnalytics('solar-kusum'),
      energyApi.getAnalytics('govt-solarization'),
      energyApi.getAnalytics('mskvy')
    ]).then(([solarRes, kusumRes, govtRes, mskvyRes]) => {
      if (solarRes.status === 'fulfilled' && solarRes.value?.success && solarRes.value.total_capacity_mw) {
        setRePolicyMw(Number(solarRes.value.total_capacity_mw));
      }
      if (kusumRes.status === 'fulfilled' && kusumRes.value?.success && kusumRes.value.total_capacity_mw) {
        setKusumMw(Number(kusumRes.value.total_capacity_mw));
      }
      if (govtRes.status === 'fulfilled' && govtRes.value?.success && govtRes.value.total_capacity_mw) {
        setGovtBuildingMw(Number(govtRes.value.total_capacity_mw));
      }
      if (mskvyRes.status === 'fulfilled' && mskvyRes.value?.success) {
        setMskvyMw(Number(mskvyRes.value.total_capacity_mw || 0));
      }
    }).finally(() => {
      setIsRefreshing(false);
    });
  };

  useEffect(() => {
    loadDynamicData();
  }, []);

  // Total Grid Connected Solar Projects sum (exact sum of all 8 schemes)
  const totalGridCapacityMw =
    rePolicyMw +
    kusumMw +
    mskvyMw +
    rooftopMw +
    govtBuildingMw +
    amrutMw +
    liftIrrigationMw +
    textileSchemeMw;

  // Navigation handler to redirect to respective page/tab
  const handleRedirect = (scheme) => {
    if (scheme.directUrl) {
      navigate(scheme.directUrl);
      return;
    }
    if (scheme.tabId) {
      if (onNavigateTab) {
        onNavigateTab(scheme.tabId);
      } else {
        navigate(`/dashboard?tab=${scheme.tabId}`);
      }
    }
  };

  const handleExport = () => {
    window.print();
  };

  // 8 Schemes Config Matching Screenshot Layout (Row 1: 3, Row 2: 3, Row 3: 2)
  const schemes = [
    {
      id: 'solar-grid',
      name: 'Solar Projects Under RE Policy',
      tag: 'Solar Grid',
      capacity: rePolicyMw,
      isHardcoded: false,
      tabId: 'solar-grid',
      directUrl: null,
      // Pastel warm vanilla / butter
      bg: 'linear-gradient(135deg, #fffdf0 0%, #fef9c3 50%, #fef08a 100%)',
      borderColor: '#fde047',
      textColor: 'text-amber-950',
      badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
      shadow: '0 4px 14px -2px rgba(254, 240, 138, 0.35)'
    },
    {
      id: 'kusum',
      name: 'Solar Project Under Kusum Scheme',
      tag: 'KUSUM',
      capacity: kusumMw,
      isHardcoded: false,
      tabId: 'kusum-ac',
      directUrl: null,
      // Pastel sky blue
      bg: 'linear-gradient(135deg, #f8fafc 0%, #f0f9ff 50%, #e0f2fe 100%)',
      borderColor: '#bae6fd',
      textColor: 'text-sky-950',
      badgeBg: 'bg-sky-100 text-sky-900 border-sky-300',
      shadow: '0 4px 14px -2px rgba(186, 230, 253, 0.35)'
    },
    {
      id: 'mskvy',
      name: 'Solar Project Under MSKVY',
      tag: 'MSKVY',
      capacity: mskvyMw,
      isHardcoded: false,
      tabId: 'mskvy',
      directUrl: null,
      // Pastel soft mint
      bg: 'linear-gradient(135deg, #fbfdfc 0%, #f0fdf4 50%, #dcfce7 100%)',
      borderColor: '#bbf7d0',
      textColor: 'text-emerald-950',
      badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      shadow: '0 4px 14px -2px rgba(187, 247, 208, 0.35)'
    },
    {
      id: 'rooftop',
      name: 'Solar Project under Rooftop Scheme',
      tag: 'Rooftop',
      capacity: rooftopMw,
      isHardcoded: false,
      tabId: 'solar-rooftop',
      directUrl: null,
      // Pastel warm peach
      bg: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fed7aa 100%)',
      borderColor: '#fed7aa',
      textColor: 'text-orange-950',
      badgeBg: 'bg-orange-100 text-orange-900 border-orange-300',
      shadow: '0 4px 14px -2px rgba(254, 215, 170, 0.35)'
    },
    {
      id: 'govt-building',
      name: 'Solar Projects On Govt Building',
      tag: 'Govt. Building Solar',
      capacity: govtBuildingMw,
      isHardcoded: false,
      tabId: 'govt-building-solar',
      directUrl: null,
      // Pastel lavender
      bg: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 50%, #e9d5ff 100%)',
      borderColor: '#d8b4fe',
      textColor: 'text-purple-950',
      badgeBg: 'bg-purple-100 text-purple-900 border-purple-300',
      shadow: '0 4px 14px -2px rgba(216, 180, 254, 0.35)'
    },
    {
      id: 'amrut',
      name: 'Solar Project Under Amrut Scheme',
      tag: 'Amrut Scheme',
      capacity: amrutMw,
      isHardcoded: true,
      tabId: null,
      directUrl: null,
      // Pastel teal
      bg: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 50%, #99f6e4 100%)',
      borderColor: '#99f6e4',
      textColor: 'text-teal-950',
      badgeBg: 'bg-teal-100 text-teal-900 border-teal-300',
      shadow: '0 4px 14px -2px rgba(153, 246, 228, 0.35)'
    },
    {
      id: 'lift-irrigation',
      name: 'Solar Project - Lift Irrigation System',
      tag: 'Lift Irrigation',
      capacity: liftIrrigationMw,
      isHardcoded: true,
      tabId: null,
      directUrl: null,
      // Pastel sand / cream
      bg: 'linear-gradient(135deg, #fafaf9 0%, #f5f5f4 50%, #e7e5e4 100%)',
      borderColor: '#e7e5e4',
      textColor: 'text-stone-900',
      badgeBg: 'bg-stone-100 text-stone-800 border-stone-300',
      shadow: '0 4px 14px -2px rgba(231, 229, 228, 0.35)'
    },
    {
      id: 'textile',
      name: 'Solar Project Under Textile Scheme',
      tag: 'Textile Scheme',
      capacity: textileSchemeMw,
      isHardcoded: true,
      tabId: null,
      directUrl: null,
      // Pastel soft rose
      bg: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 50%, #fecdd3 100%)',
      borderColor: '#fecdd3',
      textColor: 'text-rose-950',
      badgeBg: 'bg-rose-100 text-rose-900 border-rose-300',
      shadow: '0 4px 14px -2px rgba(254, 205, 211, 0.35)'
    }
  ];

  return (
    <div className="w-full font-sans antialiased text-slate-800 relative select-none">
      {/* 1. STANDALONE DASHBOARD HEADER (Only displayed on standalone /grid-connected page) */}
      {!isEmbedded && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 mb-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-700 tracking-wider uppercase mb-1">
              <Sun size={13} className="text-amber-500" />
              <span>Renewable Energy • Grid Connected Commissioning</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              Commissioned Grid Connected Solar Projects
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                {formatCapacityMw(totalGridCapacityMw)} MW
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Comprehensive overview of all commissioned grid connected solar projects across Maharashtra.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={loadDynamicData}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              <RefreshCw size={12} className={isRefreshing ? 'animate-spin text-amber-600' : ''} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. MAIN COMPACT DASHBOARD CONTENT AREA */}
      <div className="relative bg-[#f8fafc] rounded-2xl p-4 sm:p-5 md:p-6 border border-slate-200/80 shadow-2xs space-y-5">

        {/* TOP HERO CARD (Total Grid Connected Solar Projects) - SOOTHING PASTEL BLUSH */}
        <div className="max-w-[360px] mx-auto">
          <div
            className="rounded-2xl py-3.5 px-5 border text-center transition-all duration-200 transform hover:-translate-y-0.5 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 50%, #fecdd3 100%)',
              borderColor: '#fda4af',
              boxShadow: '0 6px 16px -2px rgba(253, 164, 175, 0.4), 0 2px 4px rgba(0, 0, 0, 0.03)'
            }}
          >
            {/* Soft gloss highlight line */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent"></div>

            <div className="text-3xl sm:text-4xl font-black text-rose-950 tracking-tight leading-none font-mono">
              {formatCapacityMw(totalGridCapacityMw)}{' '}
              <span className="text-base sm:text-lg font-bold text-rose-800">MW</span>
            </div>
            <div className="text-xs sm:text-sm font-extrabold text-rose-800 mt-1.5 tracking-tight">
              Total Grid Connected Solar Projects
            </div>
          </div>
        </div>

        {/* 8 SCHEME CARDS GRID (Row 1: 3, Row 2: 3, Row 3: 2) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 lg:gap-4.5 max-w-[1140px] mx-auto">
          {schemes.map((scheme) => {
            const hasLink = Boolean(scheme.tabId || scheme.directUrl);
            return (
              <div
                key={scheme.id}
                onClick={() => hasLink && handleRedirect(scheme)}
                className={`rounded-2xl p-4 border relative transition-all duration-200 transform ${hasLink ? 'hover:-translate-y-1 hover:shadow-md cursor-pointer group' : ''
                  }`}
                style={{
                  background: scheme.bg,
                  borderColor: scheme.borderColor,
                  boxShadow: scheme.shadow
                }}
              >
                {/* Top Row: Big Bold Capacity + Clickable Scheme Tag */}
                <div className="flex items-start justify-between gap-2">
                  <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none font-mono">
                    {formatCapacityMw(scheme.capacity)}{' '}
                    {Number(scheme.capacity) > 0 && (
                      <span className="text-xs sm:text-sm font-bold text-slate-700">MW</span>
                    )}
                  </div>

                  {/* Clean Agency / Scheme Tag Badge */}
                  <div className="flex items-center gap-1">
                    <span
                      className={`font-black text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-md border shrink-0 transition-all ${scheme.badgeBg
                        } ${hasLink ? 'group-hover:scale-105 group-hover:shadow-2xs' : ''}`}
                    >
                      {scheme.tag}
                    </span>
                    {hasLink && (
                      <ChevronRight size={13} className="text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
                    )}
                  </div>
                </div>

                {/* Bottom Row: Full Scheme Name */}
                <div className={`text-xs sm:text-[13px] font-extrabold mt-3 tracking-tight ${scheme.textColor}`}>
                  {scheme.name}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default GridConnectedDashboard;
