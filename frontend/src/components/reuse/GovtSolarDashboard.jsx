import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, Building, Zap, Award, Layers, ChevronRight, BarChart2 } from 'lucide-react';
import { energyApi } from '../../services/energyApi';

// Harmonious, distinct executive palette
const PALETTE = [
  '#2563eb', '#1e3a8a', '#ea580c', '#4f46e5', '#059669',
  '#7c3aed', '#0d9488', '#e11d48', '#d97706', '#0891b2',
  '#16a34a', '#c2410c', '#9333ea', '#3b82f6', '#475569',
  '#0284c7', '#15803d', '#b45309', '#6d28d9', '#be185d',
  '#047857', '#0369a1', '#a16207', '#4338ca', '#9f1239',
  '#0f766e', '#1d4ed8', '#c05621', '#5b21b6', '#831843',
  '#166534', '#075985', '#92400e', '#3730a3', '#881337', '#334155'
];

export const GovtSolarDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalCapacityMw, setTotalCapacityMw] = useState(0);
  const [districts, setDistricts] = useState([]);
  const [divisions, setDivisions] = useState([]);
  
  // Fixed inspect district state (for the stationary breakdown box)
  const [inspectedDistrict, setInspectedDistrict] = useState(null);
  const [activePieHover, setActivePieHover] = useState(null);
  const [pieViewMode, setPieViewMode] = useState('page'); // 'page' | 'all'
  const [piePage, setPiePage] = useState(1);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await energyApi.getAnalytics('govt-solarization');
      if (res && res.success) {
        setTotalProjects(res.total_projects !== undefined ? Number(res.total_projects) : 0);
        setTotalCapacityMw(res.total_capacity_mw !== undefined ? Number(res.total_capacity_mw) : 0);
        if (res.districts && Array.isArray(res.districts) && res.districts.length > 0) {
          const formatted = res.districts.map((d, idx) => ({
            ...d,
            rank: idx + 1,
            color: d.color || PALETTE[idx % PALETTE.length]
          }));
          setDistricts(formatted);
          setInspectedDistrict(formatted[0]);
        } else {
          setDistricts([]);
          setInspectedDistrict(null);
        }
        if (res.divisions && Array.isArray(res.divisions) && res.divisions.length > 0) {
          const divFormatted = res.divisions.map((div, idx) => ({
            ...div,
            color: div.color || PALETTE[idx % PALETTE.length]
          }));
          setDivisions(divFormatted);
        } else {
          setDivisions([]);
        }
      } else {
        setTotalProjects(0);
        setTotalCapacityMw(0);
        setDistricts([]);
        setDivisions([]);
        setInspectedDistrict(null);
      }
    } catch (err) {
      console.warn('Govt solarization analytics error:', err);
      setTotalProjects(0);
      setTotalCapacityMw(0);
      setDistricts([]);
      setDivisions([]);
      setInspectedDistrict(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (districts.length > 0 && !inspectedDistrict) {
      setInspectedDistrict(districts[0]);
    }
  }, [districts]);

  const activeBox = inspectedDistrict || districts[0] || {
    district: 'No Data',
    count: 0,
    capacity_mw: 0,
    percentage: 0,
    rank: 1,
    color: '#2563eb'
  };// Logarithmic height mapping for Bar Chart
  const maxCount = Math.max(...districts.map(d => Number(d.count) || 0), 1);
  const maxLog = Math.log10(maxCount) * 1.05;
  const getLogBarHeightPct = (count) => {
    if (!count || count <= 0) return 3;
    const logVal = Math.log10(count);
    const pct = (logVal / maxLog) * 100;
    return Math.min(Math.max(pct, 4), 98);
  };

  // 10-District Pagination & "All" view logic
  const PAGE_SIZE = 10;
  const totalPages = Math.max(1, Math.ceil(districts.length / PAGE_SIZE));

  let simplifiedPieItems = [];
  if (pieViewMode === 'all' || districts.length <= PAGE_SIZE) {
    // Show all districts
    simplifiedPieItems = districts.map((d, idx) => ({
      ...d,
      color: d.color || PALETTE[idx % PALETTE.length],
      isOther: false
    }));
  } else {
    // Show 10 districts for the current page
    const safePage = Math.min(Math.max(piePage, 1), totalPages);
    const startIndex = (safePage - 1) * PAGE_SIZE;
    const pageDistricts = districts.slice(startIndex, startIndex + PAGE_SIZE);
    const remainingDistricts = districts.slice(startIndex + PAGE_SIZE);

    simplifiedPieItems = pageDistricts.map(d => ({ ...d, isOther: false }));

    if (remainingDistricts.length > 0) {
      const otherMw = remainingDistricts.reduce((acc, d) => acc + (Number(d.capacity_mw) || 0), 0);
      const otherCount = remainingDistricts.reduce((acc, d) => acc + d.count, 0);
      const otherPct = remainingDistricts.reduce((acc, d) => acc + (Number(d.percentage) || 0), 0);

      simplifiedPieItems.push({
        district: `Other ${remainingDistricts.length} District${remainingDistricts.length > 1 ? 's' : ''}`,
        count: otherCount,
        capacity_mw: Number(otherMw.toFixed(2)),
        percentage: Number(otherPct.toFixed(2)),
        color: '#64748b',
        isOther: true,
        targetPage: safePage + 1
      });
    }
  }

  const totalSegmentPct = simplifiedPieItems.reduce((acc, d) => acc + (Number(d.percentage) || 0), 0) || 100;
  let anglePointer = -90; // Start at 12 o'clock for a balanced, clean circle

  const pieSlices = simplifiedPieItems.map((item, idx) => {
    const sliceAngle = ((Number(item.percentage) || 0) / totalSegmentPct) * 360;
    const startA = anglePointer;
    const endA = anglePointer + sliceAngle;
    anglePointer = endA;

    return {
      ...item,
      sliceIndex: idx,
      startAngle: startA,
      endAngle: endA,
      midAngle: (startA + endA) / 2,
      sliceAngle
    };
  });

  const handleOtherClick = (item) => {
    if (item.isOther || item.isOthers) {
      if (item.targetPage && item.targetPage <= totalPages) {
        setPiePage(item.targetPage);
        setActivePieHover(null);
      } else {
        setPieViewMode('all');
        setActivePieHover(null);
      }
    }
  };

  // SVG Donut Path helper
  const getDonutSlicePath = (cx, cy, rOuter, rInner, startAngle, endAngle) => {
    const rad = Math.PI / 180;
    const x1 = cx + rOuter * Math.cos(startAngle * rad);
    const y1 = cy + rOuter * Math.sin(startAngle * rad);
    const x2 = cx + rOuter * Math.cos(endAngle * rad);
    const y2 = cy + rOuter * Math.sin(endAngle * rad);

    const x3 = cx + rInner * Math.cos(endAngle * rad);
    const y3 = cy + rInner * Math.sin(endAngle * rad);
    const x4 = cx + rInner * Math.cos(startAngle * rad);
    const y4 = cy + rInner * Math.sin(startAngle * rad);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return `M ${x1} ${y1} A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${rInner} ${rInner} 0 ${largeArc} 0 ${x4} ${y4} Z`;
  };

  // Active display in pie chart center (either hovered slice or state total)
  const currentCenterDisplay = activePieHover || {
    title: 'Total Installed',
    mw: `${Number(totalCapacityMw).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/\.00$/, '')} MW`,
    sub: `${Number(totalProjects).toLocaleString('en-IN')} Buildings`
  };

  return (
    <div className="w-full bg-[#f4f7fb] p-2 sm:p-4 md:p-6 font-sans text-slate-800 antialiased space-y-6">
      
      {/* 1. TOP SECTION: TWO KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-[760px]">
        {/* KPI Card 1: Total Installed Capacity */}
        <div className="bg-[#0b1b3d] rounded-xl p-5 text-white shadow-sm flex flex-col justify-between min-h-[105px] border border-slate-900/80">
          <div className="text-3xl lg:text-4xl font-bold tracking-tight text-white leading-none">
            {Number(totalCapacityMw || 0).toFixed(2).replace(/\.00$/, '')}
          </div>
          <div className="text-[13px] font-medium text-slate-200 mt-2">
            Total Installed Capacity in MW
          </div>
        </div>

        {/* KPI Card 2: Total No. Of Projects (Database rows count) */}
        <div className="bg-[#0b1b3d] rounded-xl p-5 text-white shadow-sm flex flex-col justify-between min-h-[105px] border border-slate-900/80">
          <div className="text-3xl lg:text-4xl font-bold tracking-tight text-white leading-none">
            {Number(totalProjects || 0).toLocaleString()}
          </div>
          <div className="text-[13px] font-medium text-slate-200 mt-2">
            No. Of Projects
          </div>
        </div>
      </div>

      {/* 2. MIDDLE SECTION: BAR CHART (LEFT) & SIMPLIFIED PIE CHART (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* ===================== LEFT: BAR CHART (7 Cols) ===================== */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-700/80 p-5 shadow-sm flex flex-col justify-between relative">
          
          {/* Header Row with Title + FIXED IN-PLACE BREAKDOWN INSPECTION BOX */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                District Wise Solar Capacity Installed by MW
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Hover any bar below to inspect that district in the fixed box
              </p>
            </div>

            {/* FIXED BREAKDOWN BOX (STATIONARY - NEVER MOVES WITH CURSOR) */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-xl px-3.5 py-2 min-w-[210px] shadow-sm flex items-center gap-3">
              <div
                className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                style={{ backgroundColor: activeBox.color || '#2563eb' }}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-slate-900 text-xs truncate max-w-[110px]">
                    {activeBox.district}
                  </span>
                  <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                    #{activeBox.rank || 1}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 flex items-center justify-between gap-3 mt-0.5">
                  <span><strong>{activeBox.count.toLocaleString()}</strong> projects</span>
                  <span><strong>{Number(activeBox.capacity_mw).toFixed(2)}</strong> MW</span>
                  <span className="text-emerald-700 font-semibold">{activeBox.percentage}%</span>
                </div>
              </div>
            </div>
          </div>

          {districts.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center justify-center bg-slate-50/60 rounded-xl border border-dashed border-slate-200 my-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-2.5">
                <Building size={20} />
              </div>
              <div className="text-sm font-bold text-slate-800">No Government Solarization Data Uploaded Yet</div>
              <p className="text-xs text-slate-500 mt-0.5 max-w-xs">
                Upload completed Government Solarization Excel sheet in Templates to view district bars.
              </p>
            </div>
          ) : (
            <>
              <div className="relative flex items-stretch h-[280px] pt-4">
                <div className="w-6 flex items-center justify-center shrink-0 pr-1 select-none">
                  <span
                    className="text-[10.5px] font-semibold text-slate-700 tracking-wide"
                    style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                  >
                    Count of Capacity (MW)
                  </span>
                </div>

                <div className="w-9 shrink-0 flex flex-col justify-between py-1 text-right pr-2 text-[10px] font-medium text-slate-500 select-none">
                  <span className="relative -top-2">{maxCount >= 1000 ? `${(maxCount/1000).toFixed(1)}K` : Math.round(maxCount)}</span>
                  <span className="relative -top-1">{Math.round(maxCount * 0.1)}</span>
                  <span>{Math.round(maxCount * 0.01)}</span>
                  <span className="relative top-1">1</span>
                </div>

                <div className="flex-1 relative border-l border-b border-slate-300 overflow-x-auto overflow-y-hidden pb-1">
                  <div className="absolute inset-0 pointer-events-none flex flex-col justify-between py-1">
                    <div className="w-full border-b border-dashed border-slate-200/90 h-0" />
                    <div className="w-full border-b border-dashed border-slate-200/90 h-0" />
                    <div className="w-full border-b border-dashed border-slate-200/90 h-0" />
                    <div className="w-full border-b border-slate-300 h-0" />
                  </div>

                  <div className="h-full flex items-end min-w-max px-2 gap-[3px] pt-2">
                    {districts.map((item, idx) => {
                      const barHeightPct = getLogBarHeightPct(item.count);
                      const isSelected = activeBox.district === item.district;

                      return (
                        <div
                          key={idx}
                          className="flex flex-col items-center justify-end h-full w-[15px] sm:w-[17px] group cursor-pointer relative"
                          onMouseEnter={() => setInspectedDistrict({ ...item, rank: idx + 1 })}
                          onClick={() => setInspectedDistrict({ ...item, rank: idx + 1 })}
                        >
                          <div className="w-full h-full flex items-end justify-center">
                            <div
                              className={`w-full transition-all duration-150 rounded-t-[1.5px] ${
                                isSelected
                                  ? 'bg-blue-600 ring-2 ring-blue-400 scale-y-105'
                                  : 'bg-[#0e294b] hover:bg-[#1d4ed8]'
                              }`}
                              style={{
                                height: `${barHeightPct}%`,
                                transformOrigin: 'bottom'
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-start ml-[50px] overflow-x-auto min-h-[90px] pt-1">
                <div className="flex items-start min-w-max px-2 gap-[3px]">
                  {districts.map((item, idx) => {
                    const isSelected = activeBox.district === item.district;
                    return (
                      <div
                        key={idx}
                        className="w-[15px] sm:w-[17px] flex justify-center cursor-pointer"
                        onMouseEnter={() => setInspectedDistrict({ ...item, rank: idx + 1 })}
                        onClick={() => setInspectedDistrict({ ...item, rank: idx + 1 })}
                      >
                        <span
                          className={`text-[8.5px] select-none transition-colors ${
                            isSelected ? 'text-blue-700 font-bold' : 'text-slate-700 font-medium'
                          }`}
                          style={{
                            writingMode: 'vertical-rl',
                            transform: 'rotate(180deg)',
                            maxHeight: '85px'
                          }}
                          title={item.district}
                        >
                          {item.district.length > 15 ? `${item.district.slice(0, 13)}...` : item.district}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="w-full text-center text-xs font-semibold text-slate-800 pt-1 select-none">
                District
              </div>
            </>
          )}

        </div>

        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-700/80 p-5 shadow-sm flex flex-col justify-between">
          
          <div className="text-center mb-1">
            <h2 className="text-sm font-bold text-slate-900">
              District wise MW capacity percentage distribution
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Major districts breakdown • Computed dynamically from database
            </p>
          </div>

          {/* PAGINATION & VIEW TABS */}
          {districts.length > PAGE_SIZE && (
            <div className="flex items-center justify-between gap-1.5 my-2 px-1">
              <div className="inline-flex items-center p-1 bg-slate-100/90 rounded-xl border border-slate-200/90 shadow-xs gap-1">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNum = i + 1;
                  const start = (i * PAGE_SIZE) + 1;
                  const end = Math.min((i + 1) * PAGE_SIZE, districts.length);
                  const isSelected = pieViewMode === 'page' && piePage === pageNum;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => {
                        setPieViewMode('page');
                        setPiePage(pageNum);
                        setActivePieHover(null);
                      }}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                      }`}
                      title={`Show districts ${start} to ${end}`}
                    >
                      {start}–{end}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => {
                    setPieViewMode('all');
                    setActivePieHover(null);
                  }}
                  className={`px-3.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    pieViewMode === 'all'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                  }`}
                  title="Show all districts in pie chart"
                >
                  All ({districts.length})
                </button>
              </div>

              {pieViewMode === 'page' && totalPages > 1 && (
                <span className="text-[11px] font-semibold text-slate-500">
                  Page {piePage} of {totalPages}
                </span>
              )}
            </div>
          )}

          {districts.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center justify-center my-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
                <Building size={22} />
              </div>
              <div className="text-sm font-bold text-slate-800">No Distribution Available</div>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Capacity percentage breakdown will appear here once Government Solarization records are stored.
              </p>
            </div>
          ) : (
            <>
              <div className="relative w-full flex items-center justify-center my-3">
                <svg viewBox="0 0 280 280" className="w-[240px] h-[240px] select-none overflow-visible">
                  <g>
                    {pieSlices.map((slice, idx) => {
                      const isHovered = activePieHover?.title === slice.district;
                      const pathD = getDonutSlicePath(140, 140, 110, 68, slice.startAngle, slice.endAngle);

                      return (
                        <path
                          key={idx}
                          d={pathD}
                          fill={slice.color}
                          stroke="#ffffff"
                          strokeWidth="2"
                          className="cursor-pointer transition-all duration-200"
                          style={{
                            transformOrigin: '140px 140px',
                            transform: isHovered ? 'scale(1.06)' : 'scale(1)',
                            filter: isHovered ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' : 'none',
                            opacity: activePieHover && !isHovered ? 0.75 : 1
                          }}
                          onClick={() => {
                            if (slice.isOther || slice.isOthers) handleOtherClick(slice);
                          }}
                          onMouseEnter={() =>
                            setActivePieHover({
                              title: slice.district,
                              count: (slice.isOther || slice.isOthers)
                                ? `${slice.percentage}%`
                                : `${slice.count.toLocaleString()} bldgs`,
                              mw: (slice.isOther || slice.isOthers)
                                ? `Click to view next 10`
                                : `${slice.percentage}% (${Number(slice.capacity_mw).toFixed(2)} MW)`
                            })
                          }
                          onMouseLeave={() => setActivePieHover(null)}
                        />
                      );
                    })}
                  </g>

                  <circle cx="140" cy="140" r="64" fill="#ffffff" />
                  <text x="140" y="125" textAnchor="middle" fontSize="10" fontWeight="600" fill="#64748b">
                    {currentCenterDisplay.title}
                  </text>
                  <text x="140" y="146" textAnchor="middle" fontSize="16" fontWeight="800" fill="#0f172a">
                    {currentCenterDisplay.count}
                  </text>
                  <text x="140" y="163" textAnchor="middle" fontSize="10" fontWeight="500" fill="#2563eb">
                    {currentCenterDisplay.mw}
                  </text>
                </svg>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs max-h-[220px] overflow-y-auto pr-1">
                  {simplifiedPieItems.map((item, idx) => {
                    const isHovered = activePieHover?.title === item.district;
                    return (
                      <div
                        key={idx}
                        className={`flex items-center justify-between p-1.5 rounded-lg border transition-all cursor-pointer ${
                          isHovered 
                            ? 'bg-blue-50/80 border-blue-300 shadow-xs' 
                            : (item.isOther || item.isOthers) 
                              ? 'bg-amber-50/80 border-amber-300 hover:bg-amber-100 font-semibold' 
                              : 'bg-slate-50/60 border-slate-100 hover:bg-slate-100'
                        }`}
                        onClick={() => {
                          if (item.isOther || item.isOthers) handleOtherClick(item);
                        }}
                        onMouseEnter={() =>
                          setActivePieHover({
                            title: item.district,
                            count: (item.isOther || item.isOthers)
                              ? `${item.percentage}%`
                              : `${item.count.toLocaleString()} bldgs`,
                            mw: (item.isOther || item.isOthers)
                              ? `Click to view next 10`
                              : `${item.percentage}% (${Number(item.capacity_mw).toFixed(2)} MW)`
                          })
                        }
                        onMouseLeave={() => setActivePieHover(null)}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="font-semibold text-slate-800 text-[11px] truncate flex items-center gap-1">
                            {item.district}
                            {(item.isOther || item.isOthers) && (
                              <span className="text-[9px] font-bold text-amber-700 bg-amber-200/80 px-1.5 py-0.2 rounded shrink-0">
                                Next ➔
                              </span>
                            )}
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-slate-900 shrink-0 ml-1">
                          {item.percentage}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

        </div>

      </div>

      <div className="bg-white rounded-2xl border border-slate-700/80 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-50 text-blue-700 rounded-lg">
                <Layers size={18} />
              </div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Administrative Divisions Solarization Distribution
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Commissioned capacity and government building count breakdown across administrative divisions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-blue-50 text-blue-800 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5">
              <Building size={14} />
              <span>{divisions.length} Divisions • {districts.length} Districts</span>
            </div>
            <div className="bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5">
              <Zap size={14} />
              <span>100% State Coverage</span>
            </div>
          </div>
        </div>

        {divisions.length === 0 ? (
          <div className="py-10 text-center text-slate-400 text-xs italic">
            No division breakdown available yet. Upload Government Building Solarization template to populate division cards.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
            {divisions.map((div, idx) => {
              const maxDivMw = Math.max(...divisions.map(d => Number(d.capacity_mw) || 0), 1);
              const progressPct = Math.min(((Number(div.capacity_mw) || 0) / maxDivMw) * 100, 100);

              return (
                <div
                  key={idx}
                  className="bg-slate-50/80 hover:bg-white border border-slate-200/80 hover:border-blue-400 rounded-xl p-4 transition-all duration-200 hover:shadow-md group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-bold text-sm text-slate-900 truncate">
                        {div.division}
                      </span>
                      <span className="text-[11px] font-extrabold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-full">
                        {div.percentage}%
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between mt-1">
                      <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                        {Number(div.capacity_mw).toFixed(2)}
                        <span className="text-xs font-semibold text-slate-500 ml-1">MW</span>
                      </span>
                      <span className="text-xs font-medium text-slate-600">
                        <strong>{div.count.toLocaleString()}</strong> bldgs
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-200 rounded-full h-2 mt-4 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 group-hover:brightness-110"
                      style={{
                        width: `${progressPct}%`,
                        backgroundColor: div.color || '#2563eb'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-3">
          <div className="flex items-center gap-2">
            <Award size={15} className="text-amber-500 shrink-0" />
            <span>
              {divisions.length > 0 ? (
                <>
                  Highest Solar Capacity: <strong className="text-slate-900">{divisions[0].division} Division ({Number(divisions[0].capacity_mw).toFixed(2)} MW, {divisions[0].percentage}%)</strong>
                  {divisions[1] && (
                    <> followed by <strong className="text-slate-900">{divisions[1].division} ({Number(divisions[1].capacity_mw).toFixed(2)} MW)</strong></>
                  )}
                  {divisions[2] && (
                    <> & <strong className="text-slate-900">{divisions[2].division} ({Number(divisions[2].capacity_mw).toFixed(2)} MW)</strong></>
                  )}.
                </>
              ) : (
                <span>No division insight available yet.</span>
              )}
            </span>
          </div>
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-semibold cursor-pointer transition-colors"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            <span>Sync Live Database</span>
          </button>
        </div>

      </div>

    </div>
  );
};

export default GovtSolarDashboard;
