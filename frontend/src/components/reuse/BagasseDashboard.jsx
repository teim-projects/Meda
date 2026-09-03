import React, { useState, useEffect } from 'react';
import { RefreshCw, Factory, Zap, Award, BarChart2 } from 'lucide-react';
import { energyApi } from '../../services/energyApi';

const PALETTE = [
  '#2563eb', '#1e3a8a', '#ea580c', '#4f46e5', '#059669',
  '#7c3aed', '#0d9488', '#e11d48', '#d97706', '#0891b2',
  '#16a34a', '#c2410c', '#9333ea', '#3b82f6', '#64748b'
];

const DEFAULT_DISTRICTS = [
  { district: 'Solapur', count: 36, capacity_mw: 575.45, percentage: 21.06, color: '#2563eb' },
  { district: 'Pune', count: 21, capacity_mw: 383.40, percentage: 14.03, color: '#1e3a8a' },
  { district: 'Ahilyanagar', count: 18, capacity_mw: 346.90, percentage: 12.69, color: '#ea580c' },
  { district: 'Kolhapur', count: 18, capacity_mw: 343.50, percentage: 12.57, color: '#4f46e5' },
  { district: 'Satara', count: 13, capacity_mw: 252.50, percentage: 9.24, color: '#059669' },
  { district: 'Sangli', count: 10, capacity_mw: 149.70, percentage: 5.48, color: '#7c3aed' },
  { district: 'Beed', count: 6, capacity_mw: 99.00, percentage: 3.62, color: '#0d9488' },
  { district: 'Dharashiv (Rural)', count: 5, capacity_mw: 98.20, percentage: 3.59, color: '#e11d48' },
  { district: 'Latur', count: 5, capacity_mw: 91.00, percentage: 3.33, color: '#d97706' },
  { district: 'Dharashiv', count: 4, capacity_mw: 65.00, percentage: 2.38, color: '#0891b2' },
  { district: 'Parbhani', count: 3, capacity_mw: 30.00, percentage: 1.10, color: '#16a34a' },
  { district: 'Jalna', count: 3, capacity_mw: 30.00, percentage: 1.10, color: '#c2410c' },
  { district: 'Nandurbar', count: 2, capacity_mw: 28.00, percentage: 1.02, color: '#9333ea' },
  { district: 'Nashik', count: 2, capacity_mw: 28.00, percentage: 1.02, color: '#3b82f6' },
  { district: 'Nagpur', count: 2, capacity_mw: 25.00, percentage: 0.91, color: '#64748b' }
];

const DEFAULT_TIMELINE = [
  { year: 2002, cumulative_mw: 42.0 },
  { year: 2005, cumulative_mw: 120.0 },
  { year: 2008, cumulative_mw: 340.0 },
  { year: 2010, cumulative_mw: 850.0 },
  { year: 2013, cumulative_mw: 1420.0 },
  { year: 2015, cumulative_mw: 1890.0 },
  { year: 2018, cumulative_mw: 2210.0 },
  { year: 2020, cumulative_mw: 2350.0 },
  { year: 2022, cumulative_mw: 2427.8 },
  { year: 2023, cumulative_mw: 2613.6 },
  { year: 2024, cumulative_mw: 2702.8 },
  { year: 2025, cumulative_mw: 2732.8 }
];

export const BagasseDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [totalProjects, setTotalProjects] = useState(156);
  const [totalCapacityMw, setTotalCapacityMw] = useState(2732.80);
  const [districts, setDistricts] = useState(DEFAULT_DISTRICTS);
  const [timeline, setTimeline] = useState(DEFAULT_TIMELINE);
  const [inspectedDistrict, setInspectedDistrict] = useState(null);
  const [activePieHover, setActivePieHover] = useState(null);
  const [hoveredTimeline, setHoveredTimeline] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await energyApi.getAnalytics('bagasse');
      if (res && res.success) {
        setTotalProjects(res.total_projects !== undefined ? res.total_projects : 156);
        setTotalCapacityMw(res.total_capacity_mw !== undefined ? Number(res.total_capacity_mw) : 2732.80);
        if (res.districts && res.districts.length > 0) {
          const formatted = res.districts.map((d, idx) => ({
            ...d,
            rank: idx + 1,
            color: PALETTE[idx % PALETTE.length]
          }));
          setDistricts(formatted);
          if (!inspectedDistrict) setInspectedDistrict(formatted[0]);
        }
        if (res.timeline && res.timeline.length > 0) {
          setTimeline(res.timeline);
        }
      }
    } catch (err) {
      console.warn('Bagasse analytics fallback:', err);
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

  const activeBox = inspectedDistrict || districts[0] || DEFAULT_DISTRICTS[0];

  // Logarithmic height mapping (ticks 1, 10, 100, 1000)
  const maxDistrictMw = Math.max(...districts.map(d => Number(d.capacity_mw) || 0), 1);
  const maxLog = Math.log10(maxDistrictMw) * 1.05;
  const getLogBarHeightPct = (mw) => {
    if (!mw || mw <= 0) return 4;
    const logVal = Math.log10(mw);
    const pct = (logVal / maxLog) * 100;
    return Math.min(Math.max(pct, 6), 98);
  };

  // Simplified pie chart segments (Top 6 + Others)
  const topSegmentsCount = 6;
  const topDistricts = districts.slice(0, topSegmentsCount);
  const otherDistricts = districts.slice(topSegmentsCount);
  const otherMw = otherDistricts.reduce((acc, d) => acc + (Number(d.capacity_mw) || 0), 0);
  const otherCount = otherDistricts.reduce((acc, d) => acc + d.count, 0);
  const otherPct = otherDistricts.reduce((acc, d) => acc + (d.percentage || 0), 0);

  const simplifiedPieItems = [
    ...topDistricts,
    ...(otherDistricts.length > 0 ? [{
      district: `Other ${otherDistricts.length} Districts`,
      count: otherCount,
      capacity_mw: Number(otherMw.toFixed(2)),
      percentage: Number(otherPct.toFixed(2)),
      color: '#64748b'
    }] : [])
  ];

  const totalSegmentPct = simplifiedPieItems.reduce((acc, d) => acc + (d.percentage || 0), 0) || 100;
  let anglePointer = -90;
  const pieSlices = simplifiedPieItems.map((item, idx) => {
    const sliceAngle = ((item.percentage || 0) / totalSegmentPct) * 360;
    const startA = anglePointer;
    const endA = anglePointer + sliceAngle;
    anglePointer = endA;
    return {
      ...item,
      startAngle: startA,
      endAngle: endA
    };
  });

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

  // SVG Timeline points calculation dynamically scaled to actual data
  const minYear = timeline[0]?.year || 2005;
  const maxYear = timeline[timeline.length - 1]?.year || 2025;
  const maxMw = Math.max(...timeline.map((t) => Number(t.cumulative_mw) || 0), 10) * 1.05;

  const getTimelineCoords = (pt) => {
    const x = 40 + ((pt.year - minYear) / Math.max(maxYear - minYear, 1)) * 430;
    const y = 110 - (pt.cumulative_mw / maxMw) * 85;
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
            {Number(totalCapacityMw).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                  Bagasse Cogeneration Capacity by District
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
            <div className="relative flex items-stretch h-[240px] pt-4">
              <div className="w-6 flex items-center justify-center shrink-0 pr-1 select-none">
                <span
                  className="text-[10.5px] font-semibold text-slate-700 tracking-wide"
                  style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                >
                  MW Capacity
                </span>
              </div>

              <div className="w-9 shrink-0 flex flex-col justify-between py-1 text-right pr-2 text-[10px] font-medium text-slate-500 select-none">
                <span className="relative -top-2">1,000</span>
                <span className="relative -top-1">100</span>
                <span>10</span>
                <span className="relative top-1">1</span>
              </div>

              <div className="flex-1 relative border-l border-b border-slate-300 overflow-x-auto overflow-y-hidden pb-1">
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between py-1">
                  <div className="w-full border-b border-dashed border-slate-200/90 h-0" />
                  <div className="w-full border-b border-dashed border-slate-200/90 h-0" />
                  <div className="w-full border-b border-dashed border-slate-200/90 h-0" />
                  <div className="w-full border-b border-slate-300 h-0" />
                </div>

                <div className="h-full flex items-end min-w-max px-2 gap-[4px] pt-2">
                  {districts.map((item, idx) => {
                    const barHeightPct = getLogBarHeightPct(item.capacity_mw);
                    const isSelected = activeBox.district === item.district;

                    return (
                      <div
                        key={idx}
                        className="flex flex-col items-center justify-end h-full w-[17px] group cursor-pointer relative"
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
            <div className="flex items-start ml-[50px] overflow-x-auto min-h-[85px] pt-1">
              <div className="flex items-start min-w-max px-2 gap-[4px]">
                {districts.map((item, idx) => {
                  const isSelected = activeBox.district === item.district;
                  return (
                    <div
                      key={idx}
                      className="w-[17px] flex justify-center cursor-pointer"
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
          </div>

          {/* TIMELINE GRAPH: Capacity Installed (MW) over years */}
          <div className="bg-white rounded-2xl border border-slate-700/80 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-slate-900">
                Capacity Installed (MW) over years
              </h2>
              {hoveredTimeline && (
                <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">
                  Year {hoveredTimeline.year}: {hoveredTimeline.cumulative_mw.toLocaleString()} MW
                </span>
              )}
            </div>

            <div className="relative w-full h-[140px]">
              <svg viewBox="0 0 500 130" className="w-full h-full overflow-visible">
                {/* Horizontal Guide Lines */}
                <line x1="35" y1="25" x2="480" y2="25" stroke="#f1f5f9" strokeDasharray="3 3" />
                <line x1="35" y1="67" x2="480" y2="67" stroke="#f1f5f9" strokeDasharray="3 3" />
                <line x1="35" y1="110" x2="480" y2="110" stroke="#e2e8f0" />

                {/* Y Axis Labels */}
                <text x="28" y="29" fontSize="9" fill="#94a3b8" textAnchor="end">2K</text>
                <text x="28" y="113" fontSize="9" fill="#94a3b8" textAnchor="end">0K</text>

                {/* Gradient area */}
                <defs>
                  <linearGradient id="bagasseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d={timelineAreaD} fill="url(#bagasseGrad)" />
                <path d={timelinePathD} fill="none" stroke="#0e294b" strokeWidth="2.4" strokeLinecap="round" />

                {/* Data Points */}
                {timeline.map((pt, idx) => {
                  const { x, y } = getTimelineCoords(pt);
                  const isHover = hoveredTimeline?.year === pt.year;
                  return (
                    <g key={idx}>
                      <circle
                        cx={x}
                        cy={y}
                        r={isHover ? '5' : '3'}
                        fill={isHover ? '#2563eb' : '#0e294b'}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        className="cursor-pointer transition-all"
                        onMouseEnter={() => setHoveredTimeline(pt)}
                        onMouseLeave={() => setHoveredTimeline(null)}
                      />
                    </g>
                  );
                })}

                {/* Year X-Axis Labels */}
                {timeline
                  .filter((_, idx) => idx % Math.ceil(timeline.length / 5) === 0 || idx === timeline.length - 1)
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
          </div>

        </div>

        {/* ===================== RIGHT SIDE: PIE CHART (5 Cols) ===================== */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-700/80 p-5 shadow-sm flex flex-col justify-between">
          
          <div className="text-center mb-1">
            <h2 className="text-sm font-bold text-slate-900">
              District wise MW capacity percentage distribution
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Major Bagasse Cogeneration Hubs
            </p>
          </div>

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
                      onMouseEnter={() =>
                        setActivePieHover({
                          title: slice.district,
                          mw: `${Number(slice.capacity_mw).toFixed(2)} MW`,
                          sub: `${slice.percentage}% (${slice.count} projects)`
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
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
              {simplifiedPieItems.map((item, idx) => {
                const isHovered = activePieHover?.title === item.district;
                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-1.5 rounded-lg border transition-all cursor-pointer ${
                      isHovered ? 'bg-blue-50/80 border-blue-300 shadow-xs' : 'bg-slate-50/60 border-slate-100 hover:bg-slate-100'
                    }`}
                    onMouseEnter={() =>
                      setActivePieHover({
                        title: item.district,
                        mw: `${Number(item.capacity_mw).toFixed(2)} MW`,
                        sub: `${item.percentage}% (${item.count} projects)`
                      })
                    }
                    onMouseLeave={() => setActivePieHover(null)}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-semibold text-slate-800 text-[11px] truncate">
                        {item.district}
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

        </div>

      </div>

      {/* 3. AESTHETIC BOTTOM GRAPH: REGIONAL COGENERATION DISTRIBUTION */}
      <div className="bg-white rounded-2xl border border-slate-700/80 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-50 text-blue-700 rounded-lg">
                <Factory size={18} />
              </div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Bagasse Cogeneration Clusters & Sugar Belt Performance
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Top sugar factory co-generation zones across Western Maharashtra and Marathwada
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-blue-50 text-blue-800 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5">
              <Zap size={14} />
              <span>{Number(totalCapacityMw).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/\.00$/, '')} MW Commissioned</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Top Cogeneration Hub</div>
            <div className="text-xl font-extrabold text-slate-900 mt-1">Solapur District</div>
            <div className="text-sm font-bold text-blue-700 mt-0.5">575.45 MW • 36 Projects</div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-3">
              <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '100%' }} />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Western Maharashtra Belt</div>
            <div className="text-xl font-extrabold text-slate-900 mt-1">Pune, Kolhapur, Satara</div>
            <div className="text-sm font-bold text-emerald-700 mt-0.5">979.40 MW • 52 Projects</div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-3">
              <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: '85%' }} />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ahilyanagar & Marathwada</div>
            <div className="text-xl font-extrabold text-slate-900 mt-1">Ahilyanagar, Sangli, Beed</div>
            <div className="text-sm font-bold text-amber-700 mt-0.5">595.60 MW • 34 Projects</div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-3">
              <div className="bg-amber-600 h-1.5 rounded-full" style={{ width: '70%' }} />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default BagasseDashboard;
