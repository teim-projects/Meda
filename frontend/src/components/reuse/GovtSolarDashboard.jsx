import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, Building, Zap, Award, Layers, ChevronRight, BarChart2 } from 'lucide-react';
import { energyApi } from '../../services/energyApi';

// Harmonious, distinct executive palette
const PALETTE = [
  '#2563eb', // Nagpur - Royal Blue
  '#1e3a8a', // Gadchiroli - Deep Navy
  '#ea580c', // Pune - Amber Orange
  '#4f46e5', // Bhandara - Deep Indigo
  '#059669', // Chandrapur - Emerald Green
  '#7c3aed', // Yavatmal - Royal Violet
  '#0d9488', // Satara - Cyan Teal
  '#e11d48', // Thane - Deep Rose
  '#d97706', // Hingoli - Warm Amber
  '#0891b2', // Sangli - Ocean Cyan
  '#16a34a', // Amravati - Green
  '#c2410c', // Chhatrapati Sambhajinagar - Rust
  '#9333ea', // Jalna - Violet
  '#2563eb', // Gondia - Blue
  '#64748b', // Others - Steel Slate
];

const DEFAULT_DISTRICTS = [
  { district: 'Nagpur', count: 1246, capacity_mw: 12.35, percentage: 18.84, formatted_count: '1.25K', color: '#2563eb' },
  { district: 'Gadchiroli', count: 685, capacity_mw: 4.88, percentage: 10.36, formatted_count: '0.69K', color: '#1e3a8a' },
  { district: 'Pune', count: 647, capacity_mw: 6.56, percentage: 9.78, formatted_count: '0.65K', color: '#ea580c' },
  { district: 'Bhandara', count: 395, capacity_mw: 4.12, percentage: 5.97, formatted_count: '0.40K', color: '#4f46e5' },
  { district: 'Chandrapur', count: 310, capacity_mw: 0.61, percentage: 4.69, formatted_count: '0.31K', color: '#059669' },
  { district: 'Yavatmal', count: 300, capacity_mw: 1.49, percentage: 4.54, formatted_count: '0.30K', color: '#7c3aed' },
  { district: 'Satara', count: 255, capacity_mw: 1.22, percentage: 3.85, formatted_count: '0.26K', color: '#0d9488' },
  { district: 'Thane', count: 251, capacity_mw: 1.70, percentage: 3.79, formatted_count: '0.25K', color: '#e11d48' },
  { district: 'Hingoli', count: 213, capacity_mw: 1.03, percentage: 3.22, formatted_count: '0.21K', color: '#d97706' },
  { district: 'Sangli', count: 193, capacity_mw: 0.68, percentage: 2.92, formatted_count: '0.19K', color: '#0891b2' },
  { district: 'Amravati', count: 183, capacity_mw: 3.03, percentage: 2.77, formatted_count: '0.18K', color: '#16a34a' },
  { district: 'Chhatrapati Sambhajinagar', count: 179, capacity_mw: 3.15, percentage: 2.71, formatted_count: '0.18K', color: '#c2410c' },
  { district: 'Jalna', count: 162, capacity_mw: 1.51, percentage: 2.45, formatted_count: '0.16K', color: '#9333ea' },
  { district: 'Gondia', count: 157, capacity_mw: 1.43, percentage: 2.37, formatted_count: '0.16K', color: '#2563eb' },
  { district: 'Buldhana', count: 151, capacity_mw: 1.08, percentage: 2.28, formatted_count: '0.15K', color: '#0284c7' },
  { district: 'Parbhani', count: 142, capacity_mw: 2.04, percentage: 2.15, formatted_count: '0.14K', color: '#6366f1' },
  { district: 'Washim', count: 112, capacity_mw: 1.10, percentage: 1.69, formatted_count: '0.11K', color: '#0f766e' },
  { district: 'Palghar', count: 104, capacity_mw: 0.86, percentage: 1.57, formatted_count: '0.10K', color: '#b45309' },
  { district: 'Wardha', count: 94, capacity_mw: 0.84, percentage: 1.42, formatted_count: '0.09K', color: '#3b82f6' },
  { district: 'Ahilyanagar', count: 79, capacity_mw: 0.80, percentage: 1.19, formatted_count: '0.08K', color: '#8b5cf6' },
  { district: 'Nanded', count: 78, capacity_mw: 1.06, percentage: 1.18, formatted_count: '0.08K', color: '#15803d' },
  { district: 'Latur', count: 77, capacity_mw: 0.57, percentage: 1.16, formatted_count: '0.08K', color: '#64748b' },
  { district: 'Sindhudurg', count: 79, capacity_mw: 0.46, percentage: 1.19, formatted_count: '0.08K', color: '#0369a1' },
  { district: 'Nandurbar', count: 68, capacity_mw: 1.22, percentage: 1.03, formatted_count: '0.07K', color: '#9f1239' },
  { district: 'Akola', count: 66, capacity_mw: 2.25, percentage: 1.00, formatted_count: '0.07K', color: '#0e7490' },
  { district: 'Dharashiv', count: 64, capacity_mw: 0.55, percentage: 0.97, formatted_count: '0.06K', color: '#a855f7' },
  { district: 'Raigad', count: 64, capacity_mw: 0.94, percentage: 0.97, formatted_count: '0.06K', color: '#e11d48' },
  { district: 'Nashik', count: 55, capacity_mw: 0.59, percentage: 0.83, formatted_count: '0.06K', color: '#334155' },
  { district: 'Ratnagiri', count: 54, capacity_mw: 0.79, percentage: 0.82, formatted_count: '0.05K', color: '#047857' },
  { district: 'Beed', count: 39, capacity_mw: 0.32, percentage: 0.59, formatted_count: '0.04K', color: '#d946ef' },
  { district: 'Dhule', count: 35, capacity_mw: 0.58, percentage: 0.53, formatted_count: '0.04K', color: '#0284c7' },
  { district: 'Jalgaon', count: 27, capacity_mw: 0.55, percentage: 0.41, formatted_count: '0.03K', color: '#5b21b6' },
  { district: 'Kolhapur', count: 26, capacity_mw: 0.13, percentage: 0.39, formatted_count: '0.03K', color: '#65a30d' },
  { district: 'Solapur', count: 12, capacity_mw: 0.17, percentage: 0.18, formatted_count: '0.01K', color: '#ca8a04' },
  { district: 'Mumbai Suburban', count: 9, capacity_mw: 0.59, percentage: 0.14, formatted_count: '0.01K', color: '#475569' },
  { district: 'Mumbai City', count: 6, capacity_mw: 0.15, percentage: 0.09, formatted_count: '0.01K', color: '#94a3b8' }
];

const DEFAULT_DIVISIONS = [
  { division: 'Nagpur', count: 2887, capacity_mw: 24.23, percentage: 39.46, color: '#2563eb' },
  { division: 'Amravati', count: 812, capacity_mw: 8.96, percentage: 14.59, color: '#10b981' },
  { division: 'Pune', count: 914, capacity_mw: 7.95, percentage: 12.95, color: '#f59e0b' },
  { division: 'Chhatrapati Sambhajinagar', count: 696, capacity_mw: 7.72, percentage: 12.58, color: '#8b5cf6' },
  { division: 'Mumbai', count: 434, capacity_mw: 4.24, percentage: 6.91, color: '#06b6d4' },
  { division: 'Nashik', count: 264, capacity_mw: 3.74, percentage: 6.09, color: '#ec4899' },
  { division: 'Latur', count: 258, capacity_mw: 2.50, percentage: 4.07, color: '#64748b' },
  { division: 'Kolhapur', count: 352, capacity_mw: 2.06, percentage: 3.35, color: '#f97316' }
];

export const GovtSolarDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [totalProjects, setTotalProjects] = useState(6614);
  const [totalCapacityMw, setTotalCapacityMw] = useState(61.00);
  const [districts, setDistricts] = useState(DEFAULT_DISTRICTS);
  const [divisions, setDivisions] = useState(DEFAULT_DIVISIONS);
  
  // Fixed inspect district state (for the stationary breakdown box)
  const [inspectedDistrict, setInspectedDistrict] = useState(null);
  const [activePieHover, setActivePieHover] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await energyApi.getAnalytics('govt-solarization');
      if (res && res.success) {
        setTotalProjects(res.total_projects !== undefined ? res.total_projects : 6617);
        setTotalCapacityMw(res.total_capacity_mw !== undefined ? Number(res.total_capacity_mw) : 61.4);
        if (res.districts && res.districts.length > 0) {
          const formatted = res.districts.map((d, idx) => ({
            ...d,
            rank: idx + 1,
            color: PALETTE[idx % PALETTE.length]
          }));
          setDistricts(formatted);
          if (!inspectedDistrict) {
            setInspectedDistrict(formatted[0]);
          }
        }
        if (res.divisions && res.divisions.length > 0) {
          const divColors = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899', '#64748b', '#f97316'];
          const formattedDivs = res.divisions.map((div, idx) => ({
            ...div,
            color: divColors[idx % divColors.length]
          }));
          setDivisions(formattedDivs);
        }
      }
    } catch (err) {
      console.warn('Analytics endpoint fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Default inspected district to Nagpur on start
  useEffect(() => {
    if (districts.length > 0 && !inspectedDistrict) {
      setInspectedDistrict(districts[0]);
    }
  }, [districts]);

  // Logarithmic height mapping for Bar Chart
  const maxCount = Math.max(...districts.map(d => Number(d.count) || 0), 1);
  const maxLog = Math.log10(maxCount) * 1.05;
  const getLogBarHeightPct = (count) => {
    if (!count || count <= 0) return 3;
    const logVal = Math.log10(count);
    const pct = (logVal / maxLog) * 100;
    return Math.min(Math.max(pct, 4), 98);
  };

  // Top 7 Major Districts + 1 "Other Districts" group for the simplified, crystal-clear pie chart
  const topSegmentsCount = 7;
  const topDistricts = districts.slice(0, topSegmentsCount);
  const otherDistricts = districts.slice(topSegmentsCount);
  const otherCount = otherDistricts.reduce((acc, d) => acc + d.count, 0);
  const otherMw = otherDistricts.reduce((acc, d) => acc + (Number(d.capacity_mw) || 0), 0);
  const otherPct = otherDistricts.reduce((acc, d) => acc + (d.percentage || 0), 0);

  const simplifiedPieItems = [
    ...topDistricts,
    ...(otherDistricts.length > 0 ? [{
      district: `Other ${otherDistricts.length} Districts`,
      count: otherCount,
      capacity_mw: Number(otherMw.toFixed(2)),
      percentage: Number(otherPct.toFixed(2)),
      color: '#64748b',
      isOthers: true
    }] : [])
  ];

  const totalSegmentPct = simplifiedPieItems.reduce((acc, d) => acc + (d.percentage || 0), 0) || 100;
  let anglePointer = -90; // Start at 12 o'clock for a balanced, clean circle

  const pieSlices = simplifiedPieItems.map((item, idx) => {
    const sliceAngle = ((item.percentage || 0) / totalSegmentPct) * 360;
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

  // The active inspected district for the stationary box
  const activeBox = inspectedDistrict || districts[0] || {
    district: 'Nagpur',
    count: 1246,
    capacity_mw: 12.35,
    percentage: 18.84,
    rank: 1
  };

  return (
    <div className="w-full bg-[#f4f7fb] p-2 sm:p-4 md:p-6 font-sans text-slate-800 antialiased space-y-6">
      
      {/* 1. TOP SECTION: TWO KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-[760px]">
        {/* KPI Card 1: Total Installed Capacity */}
        <div className="bg-[#0b1b3d] rounded-xl p-5 text-white shadow-sm flex flex-col justify-between min-h-[105px] border border-slate-900/80">
          <div className="text-3xl lg:text-4xl font-bold tracking-tight text-white leading-none">
            {Number(totalCapacityMw || 61.00).toFixed(2).replace(/\.00$/, '')}
          </div>
          <div className="text-[13px] font-medium text-slate-200 mt-2">
            Total Installed Capacity in MW
          </div>
        </div>

        {/* KPI Card 2: Total No. Of Projects (Database rows count) */}
        <div className="bg-[#0b1b3d] rounded-xl p-5 text-white shadow-sm flex flex-col justify-between min-h-[105px] border border-slate-900/80">
          <div className="text-3xl lg:text-4xl font-bold tracking-tight text-white leading-none">
            {Number(totalProjects || 6614).toLocaleString()}
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

          {/* Main Bar Chart Graphic Area with Logarithmic Y-Axis */}
          <div className="relative flex items-stretch h-[280px] pt-4">
            
            {/* Vertical Y-Axis Label */}
            <div className="w-6 flex items-center justify-center shrink-0 pr-1 select-none">
              <span
                className="text-[10.5px] font-semibold text-slate-700 tracking-wide"
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              >
                Count of Capacity (MW)
              </span>
            </div>

            {/* Y-Axis Ticks: 1,000, 100, 10, 1 */}
            <div className="w-9 shrink-0 flex flex-col justify-between py-1 text-right pr-2 text-[10px] font-medium text-slate-500 select-none">
              <span className="relative -top-2">1,000</span>
              <span className="relative -top-1">100</span>
              <span>10</span>
              <span className="relative top-1">1</span>
            </div>

            {/* Bars Plot Area with Dotted Grid Lines */}
            <div className="flex-1 relative border-l border-b border-slate-300 overflow-x-auto overflow-y-hidden pb-1">
              
              {/* Horizontal Guide Lines */}
              <div className="absolute inset-0 pointer-events-none flex flex-col justify-between py-1">
                <div className="w-full border-b border-dashed border-slate-200/90 h-0" />
                <div className="w-full border-b border-dashed border-slate-200/90 h-0" />
                <div className="w-full border-b border-dashed border-slate-200/90 h-0" />
                <div className="w-full border-b border-slate-300 h-0" />
              </div>

              {/* Bars List */}
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

          {/* Rotated District Labels */}
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

          {/* Bottom Centered Axis Title: District */}
          <div className="w-full text-center text-xs font-semibold text-slate-800 pt-1 select-none">
            District
          </div>

        </div>

        {/* ===================== RIGHT: SIMPLIFIED, CLEAR PIE CHART (5 Cols) ===================== */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-700/80 p-5 shadow-sm flex flex-col justify-between">
          
          <div className="text-center mb-1">
            <h2 className="text-sm font-bold text-slate-900">
              District wise MW capacity percentage distribution
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Major districts breakdown • Clear & non-overlapping
            </p>
          </div>

          {/* Clean Donut Pie Graphic with Center Active Information */}
          <div className="relative w-full flex items-center justify-center my-3">
            <svg viewBox="0 0 280 280" className="w-[240px] h-[240px] select-none overflow-visible">
              
              {/* Donut Slices */}
              <g>
                {pieSlices.map((slice, idx) => {
                  const isHovered = activePieHover?.district === slice.district;
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
                          sub: `${slice.percentage}% (${slice.count.toLocaleString()} bldgs)`
                        })
                      }
                      onMouseLeave={() => setActivePieHover(null)}
                    />
                  );
                })}
              </g>

              {/* Center Donut Hole Card (Clear Live Info) */}
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

          {/* CLEAR, STRUCTURED COLOR ENTRIES (100% Readable, Zero Mess) */}
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
                        sub: `${item.percentage}% (${item.count.toLocaleString()} bldgs)`
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

      {/* 3. NEW AESTHETIC GRAPH BELOW BOTH: ADMINISTRATIVE DIVISION BREAKDOWN */}
      <div className="bg-white rounded-2xl border border-slate-700/80 p-6 shadow-sm">
        
        {/* Section Header with Summary Pills */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-50 text-blue-700 rounded-lg">
                <BarChart2 size={18} />
              </div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Division-Wise Solarization Distribution (Revenue Divisions of Maharashtra)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Regional breakdown showing Installed Capacity (MW) and Government Buildings count across all 8 divisions
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex items-center gap-2">
            <div className="bg-blue-50 text-blue-800 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5">
              <Building size={14} />
              <span>8 Divisions • 36 Districts</span>
            </div>
            <div className="bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5">
              <Zap size={14} />
              <span>100% State Coverage</span>
            </div>
          </div>
        </div>

        {/* Division Progress Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          {divisions.map((div, idx) => {
            const maxMw = 25; // Nagpur max ~24.23 MW
            const progressPct = Math.min((div.capacity_mw / maxMw) * 100, 100);

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

                {/* Aesthetic Gradient Progress Bar */}
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

        {/* Executive Regional Insight Footer */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-3">
          <div className="flex items-center gap-2">
            <Award size={15} className="text-amber-500 shrink-0" />
            <span>
              Highest Solar Capacity: <strong className="text-slate-900">Nagpur Division (24.23 MW, 39.5%)</strong> followed by <strong className="text-slate-900">Amravati (8.96 MW)</strong> & <strong className="text-slate-900">Pune (7.95 MW)</strong>.
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
