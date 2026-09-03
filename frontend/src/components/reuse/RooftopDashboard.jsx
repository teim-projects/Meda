import React, { useState } from 'react';
import { 
  Home, 
  Zap, 
  Download, 
  RefreshCw, 
  Building2,
  Layers,
  Sun
} from 'lucide-react';

export const RooftopDashboard = ({ isEmbedded = false }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Exact fixed dataset
  const totalCapacityMw = 8000.04;
  const networks = [
    {
      id: 'msedcl',
      name: 'MSEDCL Network',
      badge: 'MSEDCL',
      capacityMw: 6636.67,
      // Pastel Powder Blue
      bg: 'linear-gradient(135deg, #f8fafc 0%, #f0f9ff 50%, #e0f2fe 100%)',
      borderColor: '#bae6fd',
      textColor: 'text-sky-950',
      badgeBg: 'bg-sky-100 text-sky-900 border-sky-300/80',
      shadow: '0 4px 14px -2px rgba(186, 230, 253, 0.35)'
    },
    {
      id: 'adani',
      name: 'ADANI - Discom Network',
      badge: 'ADANI',
      capacityMw: 757.77,
      // Pastel Sage / Mint
      bg: 'linear-gradient(135deg, #fbfdfc 0%, #f0fdf4 50%, #dcfce7 100%)',
      borderColor: '#bbf7d0',
      textColor: 'text-emerald-950',
      badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300/80',
      shadow: '0 4px 14px -2px rgba(187, 247, 208, 0.35)'
    },
    {
      id: 'tata',
      name: 'TATA - Discom Network',
      badge: 'TATA',
      capacityMw: 372.88,
      // Pastel Lavender
      bg: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 50%, #e9d5ff 100%)',
      borderColor: '#d8b4fe',
      textColor: 'text-purple-950',
      badgeBg: 'bg-purple-100 text-purple-900 border-purple-300/80',
      shadow: '0 4px 14px -2px rgba(216, 180, 254, 0.35)'
    },
    {
      id: 'best',
      name: 'BEST - Discom Network',
      badge: 'BEST',
      capacityMw: 232.72,
      // Pastel Soft Peach / Rose
      bg: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fed7aa 100%)',
      borderColor: '#fed7aa',
      textColor: 'text-amber-950',
      badgeBg: 'bg-amber-100 text-amber-900 border-amber-300/80',
      shadow: '0 4px 14px -2px rgba(254, 215, 170, 0.35)'
    }
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  const handleExport = () => {
    window.print();
  };

  return (
    <div className="w-full font-sans antialiased text-slate-800 relative select-none">
      {/* 1. STANDALONE DASHBOARD HEADER (Only displayed on standalone /rooftop page) */}
      {!isEmbedded && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 mb-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-700 tracking-wider uppercase mb-1">
              <Sun size={13} className="text-amber-500" />
              <span>Renewable Energy • Rooftop Solar</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              Rooftop Solar Projects
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                8,000.04 MW Total
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Comprehensive monitoring of grid connected rooftop solar projects across Maharashtra.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleRefresh}
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

        {/* TOP HERO CARD (Solar Projects Under Rooftop Scheme) - SOOTHING PASTEL BLUSH */}
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
              {totalCapacityMw.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
              <span className="text-base sm:text-lg font-bold text-rose-800">MW</span>
            </div>
            <div className="text-xs sm:text-sm font-extrabold text-rose-800 mt-1.5 tracking-tight">
              Solar Projects Under Rooftop Scheme
            </div>
          </div>
        </div>

        {/* 4-COLUMN GRID: DISCOM NETWORKS IN CLEAN PASTEL CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 max-w-[1140px] mx-auto">
          {networks.map((net) => (
            <div
              key={net.id}
              className="rounded-2xl p-4 border relative transition-all duration-200 transform hover:-translate-y-1 hover:shadow-md"
              style={{
                background: net.bg,
                borderColor: net.borderColor,
                boxShadow: net.shadow
              }}
            >
              {/* Top Row: Big Bold Number + Subtle Clean Agency Badge */}
              <div className="flex items-start justify-between gap-2">
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none font-mono">
                  {net.capacityMw.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
                  <span className="text-xs sm:text-sm font-bold text-slate-700">MW</span>
                </div>
                <span className={`font-black text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-md border shrink-0 ${net.badgeBg}`}>
                  {net.badge}
                </span>
              </div>

              {/* Bottom Row: Full Discom Network Name */}
              <div className={`text-xs sm:text-[13px] font-extrabold mt-3 tracking-tight ${net.textColor}`}>
                {net.name}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default RooftopDashboard;
