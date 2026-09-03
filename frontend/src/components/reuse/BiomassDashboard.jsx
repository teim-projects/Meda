import React, { useState, useEffect } from 'react';
import { RefreshCw, Flame, Zap, Award, BarChart2 } from 'lucide-react';
import { energyApi } from '../../services/energyApi';

const PALETTE = [
  '#2563eb', '#1e3a8a', '#ea580c', '#4f46e5', '#059669',
  '#7c3aed', '#0d9488', '#e11d48', '#d97706', '#0891b2',
  '#16a34a', '#c2410c', '#9333ea', '#3b82f6', '#475569',
  '#0284c7', '#15803d', '#b45309', '#6d28d9', '#be185d',
  '#047857', '#0369a1', '#a16207', '#4338ca', '#9f1239',
  '#0f766e', '#1d4ed8', '#c05621', '#5b21b6', '#831843',
  '#166534', '#075985', '#92400e', '#3730a3', '#881337', '#334155'
];

export const BiomassDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalCapacityMw, setTotalCapacityMw] = useState(0);
  const [districts, setDistricts] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [inspectedDistrict, setInspectedDistrict] = useState(null);
  const [activePieHover, setActivePieHover] = useState(null);
  const [hoveredTimeline, setHoveredTimeline] = useState(null);
  const [pieViewMode, setPieViewMode] = useState('page'); // 'page' | 'all'
  const [piePage, setPiePage] = useState(1);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await energyApi.getAnalytics('biomass');
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
        if (res.timeline && Array.isArray(res.timeline)) {
          setTimeline(res.timeline);
        } else {
          setTimeline([]);
        }
      } else {
        setTotalProjects(0);
        setTotalCapacityMw(0);
        setDistricts([]);
        setTimeline([]);
        setInspectedDistrict(null);
      }
    } catch (err) {
      console.warn('Biomass analytics error:', err);
      setTotalProjects(0);
      setTotalCapacityMw(0);
      setDistricts([]);
      setTimeline([]);
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
  };

  // Dynamic max capacity across districts for Bar Chart Y-axis scale
  const maxDistrictMw = Math.max(...districts.map(d => Number(d.capacity_mw) || 0), 1);
  const getBarHeightPct = (mw) => {
    if (!mw || mw <= 0) return 4;
    return Math.min(Math.max((mw / maxDistrictMw) * 94, 5), 98);
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
      const otherCount = remainingDistricts.reduce((acc, d) => acc + (d.count || 0), 0);
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
  let anglePointer = -90;
  const pieSlices = simplifiedPieItems.map((item) => {
    const sliceAngle = ((Number(item.percentage) || 0) / totalSegmentPct) * 360;
    const startA = anglePointer;
    const endA = anglePointer + sliceAngle;
    anglePointer = endA;
    return {
      ...item,
      startAngle: startA,
      endAngle: endA
    };
  });

  const handleOtherClick = (item) => {
    if (item.isOther) {
      if (item.targetPage && item.targetPage <= totalPages) {
        setPiePage(item.targetPage);
        setActivePieHover(null);
      } else {
        setPieViewMode('all');
        setActivePieHover(null);
      }
    }
  };

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

  const currentCenterDisplay = activePieHover || {
    title: 'Total Installed',
    mw: `${Number(totalCapacityMw).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/\.00$/, '')} MW`,
    sub: `${Number(totalProjects).toLocaleString('en-IN')} Projects`
  };

  // SVG Timeline calculations dynamically scaled to actual data
  const minYear = timeline[0]?.year || 2005;
  const maxYear = timeline[timeline.length - 1]?.year || 2024;
  const maxTimelineMw = Math.max(...timeline.map((t) => Number(t.cumulative_mw) || 0), 10) * 1.05;

  const getTimelineCoords = (pt) => {
    const x = 40 + ((pt.year - minYear) / Math.max(maxYear - minYear, 1)) * 430;
    const y = 110 - (pt.cumulative_mw / maxTimelineMw) * 85;
    return { x, y };
  };

  const timelinePathD = timeline.reduce((acc, pt, idx) => {
    const { x, y } = getTimelineCoords(pt);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  const timelineAreaD = timeline.length > 0
    ? `${timelinePathD} L ${getTimelineCoords(timeline[timeline.length - 1]).x} 110 L ${getTimelineCoords(timeline[0]).x} 110 Z`
    : '';

  return (
    <div className="w-full bg-[#f4f7fb] p-2 sm:p-4 md:p-6 font-sans text-slate-800 antialiased space-y-6">
      
      {/* 1. TOP KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-[760px]">
        <div className="bg-[#0b1b3d] rounded-xl p-5 text-white shadow-sm flex flex-col justify-between min-h-[105px] border border-slate-900/80">
          <div className="text-3xl lg:text-4xl font-bold tracking-tight text-white leading-none">
            {Number(totalCapacityMw).toFixed(2)}
          </div>
          <div className="text-[13px] font-medium text-slate-200 mt-2">
            Total Installed Capacity (MW)
          </div>
        </div>

        <div className="bg-[#0b1b3d] rounded-xl p-5 text-white shadow-sm flex flex-col justify-between min-h-[105px] border border-slate-900/80">
          <div className="text-3xl lg:text-4xl font-bold tracking-tight text-white leading-none">
            {totalProjects}
          </div>
          <div className="text-[13px] font-medium text-slate-200 mt-2">
            No. Of Projects
          </div>
        </div>
      </div>

      {/* 2. MIDDLE SECTION: BAR CHART + TIMELINE (LEFT) & PIE CHART (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* ===================== LEFT SIDE (7 Cols) ===================== */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* BAR CHART: District wise Installed by MW */}
          <div className="bg-white rounded-2xl border border-slate-700/80 p-5 shadow-sm flex flex-col justify-between relative">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                  District wise Installed by MW
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Biomass Power Generation by District
                </p>
              </div>

              {/* STATIONARY IN-PLACE BREAKDOWN INSPECTION BOX */}
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
                    <span><strong>{activeBox.count}</strong> projects</span>
                    <span><strong>{Number(activeBox.capacity_mw).toFixed(2)}</strong> MW</span>
                    <span className="text-emerald-700 font-semibold">{activeBox.percentage}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Plot area */}
            {districts.length === 0 ? (
              <div className="py-16 text-center flex flex-col items-center justify-center bg-slate-50/60 rounded-xl border border-dashed border-slate-200 my-2">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2.5">
                  <BarChart2 size={20} />
                </div>
                <div className="text-sm font-bold text-slate-800">No Biomass Data Uploaded Yet</div>
                <p className="text-xs text-slate-500 mt-0.5 max-w-xs">
                  Upload completed Biomass template in Templates to view district-wise bars.
                </p>
              </div>
            ) : (
              <>
                <div className="relative flex items-stretch h-[240px] pt-4">
                  <div className="w-6 flex items-center justify-center shrink-0 pr-1 select-none">
                    <span
                      className="text-[10.5px] font-semibold text-slate-700 tracking-wide"
                      style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                    >
                      MW Capacity
                    </span>
                  </div>

                  <div className="w-8 shrink-0 flex flex-col justify-between py-1 text-right pr-2 text-[10px] font-medium text-slate-500 select-none">
                    <span className="relative -top-2">{Math.round(maxDistrictMw)}</span>
                    <span>{Math.round(maxDistrictMw * 0.67)}</span>
                    <span>{Math.round(maxDistrictMw * 0.33)}</span>
                    <span className="relative top-1">0</span>
                  </div>

                  <div className="flex-1 relative border-l border-b border-slate-300 overflow-x-auto overflow-y-hidden pb-1">
                    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between py-1">
                      <div className="w-full border-b border-dashed border-slate-200/90 h-0" />
                      <div className="w-full border-b border-dashed border-slate-200/90 h-0" />
                      <div className="w-full border-b border-dashed border-slate-200/90 h-0" />
                      <div className="w-full border-b border-slate-300 h-0" />
                    </div>

                    <div className="h-full flex items-end min-w-max px-2 gap-[7px] pt-2">
                      {districts.map((item, idx) => {
                        const barHeightPct = getBarHeightPct(item.capacity_mw);
                        const isSelected = activeBox.district === item.district;

                        return (
                          <div
                            key={idx}
                            className="flex flex-col items-center justify-end h-full w-[22px] group cursor-pointer relative"
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
                                style={{ height: `${barHeightPct}%`, transformOrigin: 'bottom' }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Rotated district labels */}
                <div className="flex items-start ml-[45px] overflow-x-auto min-h-[85px] pt-1">
                  <div className="flex items-start min-w-max px-2 gap-[7px]">
                    {districts.map((item, idx) => {
                      const isSelected = activeBox.district === item.district;
                      return (
                        <div
                          key={idx}
                          className="w-[22px] flex justify-center cursor-pointer"
                          onMouseEnter={() => setInspectedDistrict({ ...item, rank: idx + 1 })}
                          onClick={() => setInspectedDistrict({ ...item, rank: idx + 1 })}
                        >
                          <span
                            className={`text-[9px] select-none transition-colors ${
                              isSelected ? 'text-blue-700 font-bold' : 'text-slate-700 font-medium'
                            }`}
                            style={{
                              writingMode: 'vertical-rl',
                              transform: 'rotate(180deg)',
                              maxHeight: '80px'
                            }}
                            title={item.district}
                          >
                            {item.district}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* TIMELINE GRAPH: Capacity Installed (MW) over years */}
          <div className="bg-white rounded-2xl border border-slate-700/80 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-slate-900">
                Capacity Installed (MW) over years
              </h2>
              {hoveredTimeline && (
                <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">
                  Year {hoveredTimeline.year}: {hoveredTimeline.cumulative_mw} MW
                </span>
              )}
            </div>

            {timeline.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-xs italic bg-slate-50/60 rounded-xl border border-dashed border-slate-200">
                No commissioning dates recorded in database to plot timeline curve yet.
              </div>
            ) : (
              <div className="relative w-full h-[140px]">
                <svg viewBox="0 0 500 130" className="w-full h-full overflow-visible">
                  <line x1="35" y1="25" x2="480" y2="25" stroke="#f1f5f9" strokeDasharray="3 3" />
                  <line x1="35" y1="67" x2="480" y2="67" stroke="#f1f5f9" strokeDasharray="3 3" />
                  <line x1="35" y1="110" x2="480" y2="110" stroke="#e2e8f0" />

                  <text x="28" y="29" fontSize="9" fill="#94a3b8" textAnchor="end">{Math.round(maxTimelineMw)}</text>
                  <text x="28" y="70" fontSize="9" fill="#94a3b8" textAnchor="end">{Math.round(maxTimelineMw / 2)}</text>
                  <text x="28" y="113" fontSize="9" fill="#94a3b8" textAnchor="end">0</text>

                  <defs>
                    <linearGradient id="biomassGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path d={timelineAreaD} fill="url(#biomassGrad)" />
                  <path d={timelinePathD} fill="none" stroke="#0e294b" strokeWidth="2.4" strokeLinecap="round" />

                  {timeline.map((pt, idx) => {
                    const { x, y } = getTimelineCoords(pt);
                    const isHover = hoveredTimeline?.year === pt.year;
                    return (
                      <g key={idx}>
                        <circle
                          cx={x}
                          cy={y}
                          r={isHover ? '5' : '3'}
                          fill={isHover ? '#10b981' : '#0e294b'}
                          stroke="#ffffff"
                          strokeWidth="1.5"
                          className="cursor-pointer transition-all"
                          onMouseEnter={() => setHoveredTimeline(pt)}
                          onMouseLeave={() => setHoveredTimeline(null)}
                        />
                      </g>
                    );
                  })}

                  {timeline
                    .filter((_, idx) => idx % Math.max(Math.ceil(timeline.length / 6), 1) === 0 || idx === timeline.length - 1)
                    .map((pt, idx) => {
                      const { x } = getTimelineCoords(pt);
                      return (
                        <text key={idx} x={x} y="125" fontSize="9" fill="#64748b" textAnchor="middle">
                          {pt.year}
                        </text>
                      );
                    })}
                </svg>
              </div>
            )}
          </div>

        </div>

        {/* ===================== RIGHT SIDE: PIE CHART (5 Cols) ===================== */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-700/80 p-5 shadow-sm flex flex-col justify-between">
          
          <div className="text-center mb-1">
            <h2 className="text-sm font-bold text-slate-900">
              District wise MW capacity percentage distribution
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Biomass Power Generation Distribution
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
                <Flame size={22} />
              </div>
              <div className="text-sm font-bold text-slate-800">No Distribution Available</div>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Capacity percentage breakdown will appear here once Biomass rows are present in the table.
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
                            if (slice.isOther) handleOtherClick(slice);
                          }}
                          onMouseEnter={() =>
                            setActivePieHover({
                              title: slice.district,
                              mw: `${Number(slice.capacity_mw).toFixed(2)} MW`,
                              sub: slice.isOther 
                                ? `${slice.percentage}% • Click to view next 10`
                                : `${slice.percentage}% (${slice.count} projects)`
                            })
                          }
                          onMouseLeave={() => setActivePieHover(null)}
                        />
                      );
                    })}
                  </g>

                  {/* Center Donut Hole Card */}
                  <circle cx="140" cy="140" r="64" fill="#ffffff" />
                  <text x="140" y="125" textAnchor="middle" fontSize="10" fontWeight="600" fill="#64748b">
                    {currentCenterDisplay.title}
                  </text>
                  <text x="140" y="146" textAnchor="middle" fontSize="15" fontWeight="800" fill="#0f172a">
                    {currentCenterDisplay.mw}
                  </text>
                  <text x="140" y="163" textAnchor="middle" fontSize="9.5" fontWeight="500" fill="#2563eb">
                    {currentCenterDisplay.sub}
                  </text>
                </svg>
              </div>

              {/* CLEAR COLOR BADGE GRID */}
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
                            : item.isOther 
                              ? 'bg-amber-50/80 border-amber-300 hover:bg-amber-100 font-semibold' 
                              : 'bg-slate-50/60 border-slate-100 hover:bg-slate-100'
                        }`}
                        onClick={() => {
                          if (item.isOther) handleOtherClick(item);
                        }}
                        onMouseEnter={() =>
                          setActivePieHover({
                            title: item.district,
                            mw: `${Number(item.capacity_mw).toFixed(2)} MW`,
                            sub: item.isOther 
                              ? `${item.percentage}% • Click to view next 10`
                              : `${item.percentage}% (${item.count} projects)`
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
                            {item.isOther && (
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

      {/* 3. AESTHETIC BOTTOM GRAPH: REGIONAL BIOMASS HUBS */}
      <div className="bg-white rounded-2xl border border-slate-700/80 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg">
                <Flame size={18} />
              </div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Biomass Agro-Residue Power Generation Hubs
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Top generating district clusters computed dynamically from database records
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5">
              <Zap size={14} />
              <span>{Number(totalCapacityMw).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/\.00$/, '')} MW Commissioned</span>
            </div>
            <button
              onClick={loadData}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
              title="Refresh Biomass Data from Database"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              <span>Sync</span>
            </button>
          </div>
        </div>

        {districts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
            {districts.slice(0, 3).map((hub, hIdx) => {
              const colors = ['blue', 'emerald', 'amber'];
              const theme = colors[hIdx % colors.length];
              const maxCap = Number(districts[0]?.capacity_mw) || 1;
              const pctWidth = Math.min(Math.round(((Number(hub.capacity_mw) || 0) / maxCap) * 100), 100);

              return (
                <div key={hIdx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    #{hIdx + 1} Leading District
                  </div>
                  <div className="text-xl font-extrabold text-slate-900 mt-1 truncate">
                    {hub.district}
                  </div>
                  <div className="text-sm font-bold text-blue-700 mt-0.5">
                    {Number(hub.capacity_mw).toFixed(2)} MW • {hub.count} Projects ({hub.percentage}%)
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 mt-3">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full"
                      style={{ width: `${pctWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-8 text-center text-slate-400 text-xs italic">
            No district ranking data available. Upload Biomass data in Templates to display leading generation hubs.
          </div>
        )}
      </div>

    </div>
  );
};

export default BiomassDashboard;
