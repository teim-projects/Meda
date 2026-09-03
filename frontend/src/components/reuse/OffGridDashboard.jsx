import React, { useState } from 'react';
import { 
  Sun, 
  Zap, 
  Download, 
  RefreshCw, 
  Filter, 
  X, 
  Check, 
  ChevronRight, 
  Layers, 
  Award, 
  Info,
  SlidersHorizontal
} from 'lucide-react';

export const OffGridDashboard = ({ isEmbedded = false }) => {
  // Filter states (Agency, Capacity HP, Scheme)
  const [selectedAgency, setSelectedAgency] = useState('All'); // 'All' | 'MEDA' | 'MSEDCL'
  const [selectedHp, setSelectedHp] = useState('All'); // 'All' | '3 HP' | '5 HP' | '7.5 HP'
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [numberFormat, setNumberFormat] = useState('standard'); // 'standard' (1003077) or 'indian' (10,03,077)
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Exact dataset from the user screenshot
  const rawData = {
    totalPumps: 1003077,
    schemes: [
      {
        id: 'meda-kusum-b',
        name: 'PM KUSUM Component - B',
        agency: 'MEDA',
        total: 265083,
        // Pastel warm vanilla / butter theme
        bg: 'linear-gradient(135deg, #fffdf2 0%, #fef8db 50%, #fef08a 100%)',
        borderColor: '#fde047',
        badgeBg: 'bg-amber-100/90 text-amber-900 border-amber-300/80',
        textColor: 'text-amber-950',
        subcardBg: 'linear-gradient(180deg, #ffffff 0%, #fffdf4 60%, #fef9c3 100%)',
        subcardBorder: '#fef08a',
        subcardShadow: '0 2px 6px rgba(254, 240, 138, 0.35)',
        ratings: [
          { hp: '3 HP', count: 149461, numericHp: 3 },
          { hp: '5 HP', count: 88989, numericHp: 5 },
          { hp: '7.5 HP', count: 26633, numericHp: 7.5 },
        ]
      },
      {
        id: 'msedcl-kusum-b',
        name: 'PM KUSUM Component B',
        agency: 'MSEDCL',
        total: 225691,
        // Pastel sky / ice blue theme
        bg: 'linear-gradient(135deg, #f8fafc 0%, #f0f9ff 50%, #e0f2fe 100%)',
        borderColor: '#bae6fd',
        badgeBg: 'bg-sky-100/90 text-sky-900 border-sky-300/80',
        textColor: 'text-sky-950',
        subcardBg: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 60%, #e0f2fe 100%)',
        subcardBorder: '#bae6fd',
        subcardShadow: '0 2px 6px rgba(186, 230, 253, 0.35)',
        ratings: [
          { hp: '3 HP', count: 122376, numericHp: 3 },
          { hp: '5 HP', count: 80671, numericHp: 5 },
          { hp: '7.5 HP', count: 22644, numericHp: 7.5 },
        ]
      },
      {
        id: 'msedcl-mtskpy',
        name: 'Magel Tyala Saur Krushi Pump Yojana',
        agency: 'MSEDCL',
        total: 512303,
        // Pastel soft mint / pistachio theme
        bg: 'linear-gradient(135deg, #fbfdfc 0%, #f0fdf4 50%, #dcfce7 100%)',
        borderColor: '#bbf7d0',
        badgeBg: 'bg-emerald-100/90 text-emerald-900 border-emerald-300/80',
        textColor: 'text-emerald-950',
        subcardBg: 'linear-gradient(180deg, #ffffff 0%, #fbfdfc 60%, #dcfce7 100%)',
        subcardBorder: '#bbf7d0',
        subcardShadow: '0 2px 6px rgba(187, 247, 208, 0.35)',
        ratings: [
          { hp: '3 HP', count: 206530, numericHp: 3 },
          { hp: '5 HP', count: 241732, numericHp: 5 },
          { hp: '7.5 HP', count: 64041, numericHp: 7.5 },
        ]
      }
    ]
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  const handleExport = () => {
    window.print();
  };

  const formatNum = (num) => {
    if (numberFormat === 'indian') {
      return Number(num).toLocaleString('en-IN');
    }
    return String(num);
  };

  // Filter schemes based on agency selection
  const filteredSchemes = rawData.schemes.filter(s => {
    if (selectedAgency !== 'All' && s.agency !== selectedAgency) return false;
    return true;
  });

  // Calculate dynamic filtered total if filters are active
  const calculateFilteredTotal = () => {
    if (selectedAgency === 'All' && selectedHp === 'All') {
      return rawData.totalPumps;
    }
    let sum = 0;
    filteredSchemes.forEach(scheme => {
      scheme.ratings.forEach(r => {
        if (selectedHp === 'All' || r.hp === selectedHp) {
          sum += r.count;
        }
      });
    });
    return sum;
  };

  const currentDisplayTotal = calculateFilteredTotal();

  return (
    <div className="w-full font-sans antialiased text-slate-800 relative select-none">
      {/* 1. STANDALONE DASHBOARD HEADER (Only shown on standalone /off-grid page) */}
      {!isEmbedded && (
        <div className="bg-white border border-slate-200/80 rounded-xl p-3 sm:p-4 mb-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-700 tracking-wider uppercase mb-0.5">
              <Sun size={13} className="text-amber-500" />
              <span>Renewable Energy • Agricultural Solarization</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              Off Grid Solar Projects
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                10.03 Lakh Pumps
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Number format toggle */}
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-[11px] font-semibold text-slate-600">
              <button
                type="button"
                onClick={() => setNumberFormat('standard')}
                className={`px-2 py-0.5 rounded-md transition-all ${numberFormat === 'standard' ? 'bg-white shadow-2xs text-slate-900 font-bold' : 'hover:text-slate-900'}`}
                title="Exact numbers as shown in reference"
              >
                1003077
              </button>
              <button
                type="button"
                onClick={() => setNumberFormat('indian')}
                className={`px-2 py-0.5 rounded-md transition-all ${numberFormat === 'indian' ? 'bg-white shadow-2xs text-slate-900 font-bold' : 'hover:text-slate-900'}`}
                title="Formatted with commas"
              >
                10,03,077
              </button>
            </div>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              <RefreshCw size={12} className={isRefreshing ? 'animate-spin text-amber-600' : ''} />
              <span>Refresh</span>
            </button>

            <button
              onClick={handleExport}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              <Download size={12} />
              <span>Export</span>
            </button>

            <button
              onClick={() => setShowFilterDrawer(!showFilterDrawer)}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg border shadow-2xs transition-all cursor-pointer ${
                showFilterDrawer || selectedAgency !== 'All' || selectedHp !== 'All'
                  ? 'bg-rose-500 border-rose-600 text-white'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Filter size={12} />
              <span>Filters</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. MAIN COMPACT DASHBOARD CONTENT AREA */}
      <div className="relative bg-[#f8fafc] rounded-xl p-3 sm:p-4 md:p-5 border border-slate-200/80 shadow-2xs space-y-3.5 sm:space-y-4">

        {/* TOP HERO HIGHLIGHT CARD (Total No. Of Solar Pump Installed) - COMPACT PASTEL BLUSH ROSE */}
        <div className="max-w-[340px] mx-auto">
          <div 
            className="rounded-xl py-2.5 px-4 sm:py-3 sm:px-5 border text-center transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 50%, #fecdd3 100%)',
              borderColor: '#fda4af',
              boxShadow: '0 4px 12px -2px rgba(253, 164, 175, 0.4), 0 2px 4px rgba(0, 0, 0, 0.03)'
            }}
          >
            {/* Soft gloss highlight line */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent"></div>
            
            <div className="text-2xl sm:text-3xl font-black text-rose-950 tracking-tight leading-none font-mono">
              {formatNum(currentDisplayTotal)}
            </div>
            <div className="text-xs sm:text-[13px] font-extrabold text-rose-800 mt-1 tracking-tight">
              Total No. Of Solar Pump Installed
            </div>

            {/* Active filters badge if any */}
            {(selectedAgency !== 'All' || selectedHp !== 'All') && (
              <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-200/80 text-rose-900 text-[10px] font-bold">
                <span>{selectedAgency !== 'All' ? selectedAgency : ''} {selectedHp !== 'All' ? selectedHp : ''}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedAgency('All');
                    setSelectedHp('All');
                  }}
                  className="hover:text-rose-950 font-black ml-0.5"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>

        {/* TWO COLUMNS: MEDA (LEFT) & MSEDCL PM KUSUM B (RIGHT) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 lg:gap-5 max-w-[1100px] mx-auto">
          
          {/* ================= LEFT SECTION: MEDA PM KUSUM COMPONENT - B (PASTEL WARM VANILLA) ================= */}
          <div className="flex flex-col gap-2.5">
            {/* Main Scheme Card */}
            <div 
              className="rounded-xl p-3 sm:p-3.5 border relative transition-all duration-200 transform hover:-translate-y-0.5"
              style={{
                background: rawData.schemes[0].bg,
                borderColor: rawData.schemes[0].borderColor,
                boxShadow: '0 3px 10px -2px rgba(253, 224, 71, 0.25)'
              }}
            >
              <div className="flex items-start justify-between">
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none font-mono">
                  {formatNum(rawData.schemes[0].total)}
                </div>
                <span className={`font-black text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-md border ${rawData.schemes[0].badgeBg}`}>
                  MEDA
                </span>
              </div>
              <div className={`text-xs sm:text-sm font-extrabold mt-2 tracking-tight ${rawData.schemes[0].textColor}`}>
                PM KUSUM Component - B
              </div>
            </div>

            {/* 3 Subcards (3 HP, 5 HP, 7.5 HP) */}
            <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
              {rawData.schemes[0].ratings.map((r, idx) => {
                const isSelected = selectedHp === r.hp;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedHp(selectedHp === r.hp ? 'All' : r.hp)}
                    className={`rounded-lg p-2 sm:p-2.5 text-center border transition-all duration-150 transform hover:-translate-y-0.5 cursor-pointer ${
                      isSelected ? 'ring-2 ring-amber-500 ring-offset-1 scale-[1.02]' : ''
                    }`}
                    style={{
                      background: rawData.schemes[0].subcardBg,
                      borderColor: rawData.schemes[0].subcardBorder,
                      boxShadow: rawData.schemes[0].subcardShadow
                    }}
                  >
                    <div className="text-sm sm:text-base font-black text-slate-900 leading-tight font-mono">
                      {formatNum(r.count)}
                    </div>
                    <div className="text-[11px] font-extrabold text-amber-900 mt-0.5 tracking-tight">
                      {r.hp}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ================= RIGHT SECTION: MSEDCL PM KUSUM COMPONENT B (PASTEL SKY BLUE) ================= */}
          <div className="flex flex-col gap-2.5">
            {/* Main Scheme Card */}
            <div 
              className="rounded-xl p-3 sm:p-3.5 border relative transition-all duration-200 transform hover:-translate-y-0.5"
              style={{
                background: rawData.schemes[1].bg,
                borderColor: rawData.schemes[1].borderColor,
                boxShadow: '0 3px 10px -2px rgba(186, 230, 253, 0.35)'
              }}
            >
              <div className="flex items-start justify-between">
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none font-mono">
                  {formatNum(rawData.schemes[1].total)}
                </div>
                <span className={`font-black text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-md border ${rawData.schemes[1].badgeBg}`}>
                  MSEDCL
                </span>
              </div>
              <div className={`text-xs sm:text-sm font-extrabold mt-2 tracking-tight ${rawData.schemes[1].textColor}`}>
                PM KUSUM Component B
              </div>
            </div>

            {/* 3 Subcards (3 HP, 5 HP, 7.5 HP) */}
            <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
              {rawData.schemes[1].ratings.map((r, idx) => {
                const isSelected = selectedHp === r.hp;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedHp(selectedHp === r.hp ? 'All' : r.hp)}
                    className={`rounded-lg p-2 sm:p-2.5 text-center border transition-all duration-150 transform hover:-translate-y-0.5 cursor-pointer ${
                      isSelected ? 'ring-2 ring-sky-500 ring-offset-1 scale-[1.02]' : ''
                    }`}
                    style={{
                      background: rawData.schemes[1].subcardBg,
                      borderColor: rawData.schemes[1].subcardBorder,
                      boxShadow: rawData.schemes[1].subcardShadow
                    }}
                  >
                    <div className="text-sm sm:text-base font-black text-slate-900 leading-tight font-mono">
                      {formatNum(r.count)}
                    </div>
                    <div className="text-[11px] font-extrabold text-sky-900 mt-0.5 tracking-tight">
                      {r.hp}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* BOTTOM CENTERED SECTION: MSEDCL MAGEL TYALA SAUR KRUSHI PUMP YOJANA (PASTEL SOFT MINT) */}
        <div className="max-w-[520px] mx-auto flex flex-col gap-2.5 pt-1">
          {/* Main Scheme Card */}
          <div 
            className="rounded-xl p-3 sm:p-3.5 border relative transition-all duration-200 transform hover:-translate-y-0.5"
            style={{
              background: rawData.schemes[2].bg,
              borderColor: rawData.schemes[2].borderColor,
              boxShadow: '0 3px 10px -2px rgba(187, 247, 208, 0.35)'
            }}
          >
            <div className="flex items-start justify-between">
              <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none font-mono">
                {formatNum(rawData.schemes[2].total)}
              </div>
              <span className={`font-black text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-md border ${rawData.schemes[2].badgeBg}`}>
                MSEDCL
              </span>
            </div>
            <div className={`text-xs sm:text-sm font-extrabold mt-2 tracking-tight ${rawData.schemes[2].textColor}`}>
              Magel Tyala Saur Krushi Pump Yojana
            </div>
          </div>

          {/* 3 Subcards (3 HP, 5 HP, 7.5 HP) */}
          <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
            {rawData.schemes[2].ratings.map((r, idx) => {
              const isSelected = selectedHp === r.hp;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedHp(selectedHp === r.hp ? 'All' : r.hp)}
                  className={`rounded-lg p-2 sm:p-2.5 text-center border transition-all duration-150 transform hover:-translate-y-0.5 cursor-pointer ${
                    isSelected ? 'ring-2 ring-emerald-500 ring-offset-1 scale-[1.02]' : ''
                  }`}
                  style={{
                    background: rawData.schemes[2].subcardBg,
                    borderColor: rawData.schemes[2].subcardBorder,
                    boxShadow: rawData.schemes[2].subcardShadow
                  }}
                >
                  <div className="text-sm sm:text-base font-black text-slate-900 leading-tight font-mono">
                    {formatNum(r.count)}
                  </div>
                  <div className="text-[11px] font-extrabold text-emerald-900 mt-0.5 tracking-tight">
                    {r.hp}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* COLLAPSIBLE FILTERS DRAWER TAB (Handle on right edge) */}
        <div className="fixed top-1/2 -translate-y-1/2 right-0 z-40">
          <button
            onClick={() => setShowFilterDrawer(!showFilterDrawer)}
            className="flex items-center gap-1 py-2 px-1.5 bg-white text-slate-700 border-y border-l border-slate-300 rounded-l-lg shadow-sm hover:bg-rose-50 hover:border-rose-300 hover:text-rose-800 transition-all font-bold text-[10px] tracking-wider uppercase cursor-pointer"
            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
            title="Toggle Filters Drawer"
          >
            <Filter size={11} className="rotate-90 text-rose-500" />
            <span>Filters</span>
          </button>
        </div>

        {/* SLIDE-OVER FILTERS DRAWER */}
        {showFilterDrawer && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <div 
              className="absolute inset-0 bg-slate-900/25 backdrop-blur-2xs transition-opacity"
              onClick={() => setShowFilterDrawer(false)}
            />

            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
              <div className="w-screen max-w-xs bg-white shadow-xl border-l border-slate-200 p-5 flex flex-col justify-between">
                
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal size={16} className="text-rose-600" />
                      <h2 className="text-sm font-black text-slate-900">Filters</h2>
                    </div>
                    <button
                      onClick={() => setShowFilterDrawer(false)}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="py-4 space-y-4">
                    {/* Agency Filter */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                        Agency
                      </label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {['All', 'MEDA', 'MSEDCL'].map(agency => (
                          <button
                            key={agency}
                            onClick={() => setSelectedAgency(agency)}
                            className={`py-1.5 px-2 text-xs font-bold rounded-lg border transition-all ${
                              selectedAgency === agency
                                ? 'bg-rose-500 border-rose-600 text-white shadow-2xs'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {agency}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Pump Capacity Filter */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                        Rating (HP)
                      </label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {['All', '3 HP', '5 HP', '7.5 HP'].map(hp => (
                          <button
                            key={hp}
                            onClick={() => setSelectedHp(hp)}
                            className={`py-1.5 px-2 text-xs font-bold rounded-lg border transition-all ${
                              selectedHp === hp
                                ? 'bg-rose-500 border-rose-600 text-white shadow-2xs'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {hp}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Number Format */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                        Display Format
                      </label>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setNumberFormat('standard')}
                          className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-lg border transition-all ${
                            numberFormat === 'standard'
                              ? 'bg-slate-900 border-slate-900 text-white'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          1003077
                        </button>
                        <button
                          onClick={() => setNumberFormat('indian')}
                          className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-lg border transition-all ${
                            numberFormat === 'indian'
                              ? 'bg-slate-900 border-slate-900 text-white'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          10,03,077
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedAgency('All');
                      setSelectedHp('All');
                      setNumberFormat('standard');
                    }}
                    className="flex-1 py-2 px-3 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setShowFilterDrawer(false)}
                    className="flex-1 py-2 px-3 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-2xs transition-colors"
                  >
                    Apply
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default OffGridDashboard;
