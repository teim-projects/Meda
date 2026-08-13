import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Folder, 
  Zap, 
  FileText, 
  CheckCircle, 
  Activity, 
  Network, 
  Wifi, 
  TrendingUp, 
  Download, 
  RefreshCw, 
  Filter, 
  Search, 
  Eye, 
  Edit, 
  ChevronDown,
  Sun,
  Wind,
  Droplets,
  Flame,
  Cpu,
  Check,
  RotateCcw
} from 'lucide-react';
import axios from 'axios';
import { medaApi } from '../../services/medaApi';
import { API_BASE_URL } from '../../services/apiConfig';

const Dashboard = ({ currentUser }) => {
  const navigate = useNavigate();

  // Filters State
  const [energySourceFilter, setEnergySourceFilter] = useState('All');
  const [dateRangeFilter, setDateRangeFilter] = useState('All');
  const [zoneFilter, setZoneFilter] = useState('All');
  const [circleFilter, setCircleFilter] = useState('All');
  const [substationFilter, setSubstationFilter] = useState('All');
  const [agreementTypeFilter, setAgreementTypeFilter] = useState('All');
  const [vendorFilter, setVendorFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Backend Connection & API states
  const [dbStatus, setDbStatus] = useState('Checking...');
  const [isMedaConnected, setIsMedaConnected] = useState(false);
  const [loadingDb, setLoadingDb] = useState(false);
  const [activeTooltipBar, setActiveTooltipBar] = useState(null);

  // Real API Data states
  const [recentSyncJobs, setRecentSyncJobs] = useState([]);
  const [creditNotes, setCreditNotes] = useState([]);

  const checkBackendStatus = async () => {
    setLoadingDb(true);
    try {
      await axios.get(`${API_BASE_URL}/api/accounts/login/`);
      setDbStatus('Connected (meda_db Active)');
    } catch (err) {
      if (err.response && err.response.status === 405) {
        setDbStatus('Connected (meda_db Active)');
      } else {
        setDbStatus('Django API Ready');
      }
    }

    try {
      const statusRes = await medaApi.getStatus();
      setIsMedaConnected(statusRes.is_connected || false);
    } catch (e) {
      setIsMedaConnected(false);
    }

    try {
      const jobsRes = await medaApi.getSyncJobs({ page: 1, page_size: 5 });
      if (jobsRes && jobsRes.results) setRecentSyncJobs(jobsRes.results);
    } catch (e) {
      console.log('Using default sync jobs demo data');
    }

    try {
      const notesRes = await medaApi.getCreditNotes({ page: 1, page_size: 10 });
      if (notesRes && notesRes.results) setCreditNotes(notesRes.results);
    } catch (e) {
      console.log('Using default credit notes demo data');
    }

    setLoadingDb(false);
  };

  useEffect(() => {
    checkBackendStatus();
  }, []);

  const username = currentUser?.username || localStorage.getItem('username') || 'meda Admin';

  const resetFilters = () => {
    setEnergySourceFilter('All');
    setDateRangeFilter('All');
    setZoneFilter('All');
    setCircleFilter('All');
    setSubstationFilter('All');
    setAgreementTypeFilter('All');
    setVendorFilter('All');
    setSearchQuery('');
  };

  // Top 8 KPI Cards Data (Matching Screenshot 1)
  const kpiMetrics = [
    { title: 'TOTAL PROJECTS', value: '1,847', sub: '+12.4% vs last year', color: '#059669', icon: Folder, badgeColor: '#dcfce7' },
    { title: 'INSTALLED CAPACITY', value: '12,850 MW', sub: 'Target: 15,000 MW', color: '#2563eb', icon: Zap, badgeColor: '#dbeafe' },
    { title: 'AGREEMENT CAPACITY', value: '9,820 MW', sub: '78.9% of installed', color: '#d97706', icon: FileText, badgeColor: '#fef3c7' },
    { title: 'COMMISSIONED', value: '1,542', sub: '83.5% commission rate', color: '#16a34a', icon: CheckCircle, badgeColor: '#dcfce7', isCheck: true },
    { title: 'TOTAL GENERATORS', value: '4,218', sub: 'Across all sources', color: '#0891b2', icon: Activity, badgeColor: '#cff4fc' },
    { title: 'TOTAL SUBSTATIONS', value: '342', sub: 'In 24 zones', color: '#7c3aed', icon: Network, badgeColor: '#f3e8ff' },
    { title: 'TOTAL FEEDERS', value: '1,876', sub: 'Grid connected', color: '#ea580c', icon: Wifi, badgeColor: '#ffedd5' },
    { title: 'AVERAGE TARIFF', value: '₹ 4.12 / unit', sub: 'FY 2024-25', color: '#db2777', icon: TrendingUp, badgeColor: '#fce7f3' }
  ];

  // Donut 1 Energy Source Breakdown
  const energySourcesList = [
    { name: 'Solar', color: '#059669' },
    { name: 'Wind', color: '#2563eb' },
    { name: 'Hydro', color: '#d97706' },
    { name: 'Hybrid', color: '#0891b2' },
    { name: 'Biogas', color: '#7c3aed' },
    { name: 'Biomass', color: '#db2777' },
    { name: 'Waste', color: '#ea580c' },
    { name: 'Battery', color: '#65a30d' }
  ];

  // Bar Chart Zone Data (Capacity by Zone MW)
  const zoneCapacityData = [
    { name: 'Pune', mw: 3400 },
    { name: 'Nashik', mw: 2650 },
    { name: 'Konkan', mw: 1950 },
    { name: 'Aurangabad', mw: 1720 },
    { name: 'Amravati', mw: 1480 },
    { name: 'Nagpur', mw: 1350 }
  ];

  // Top Vendors Data (Horizontal Bar)
  const topVendors = [
    { name: 'Adani Green', mw: '3,850 MW', widthPct: 95 },
    { name: 'Tata Power', mw: '2,920 MW', widthPct: 78 },
    { name: 'ReNew Power', mw: '2,410 MW', widthPct: 65 },
    { name: 'Greenko', mw: '1,850 MW', widthPct: 50 },
    { name: 'Azure Power', mw: '1,420 MW', widthPct: 40 }
  ];

  // Master Table Demo Dataset (Matching Screenshot 2)
  const initialMasterProjects = [
    { id: 1, generator: 'Solapur Solar Park I', vendor: 'Adani Green', source: 'Solar', capacity: '200 MW', zone: 'Pune', circle: 'Solapur', agreement: 'PPA', date: '2021-03-15', status: 'Active' },
    { id: 2, generator: 'Satara Wind Farm II', vendor: 'ReNew Power', source: 'Wind', capacity: '180 MW', zone: 'Pune', circle: 'Satara', agreement: 'FIT', date: '2020-09-22', status: 'Active' },
    { id: 3, generator: 'Nashik Solar Hybrid', vendor: 'Tata Power', source: 'Hybrid', capacity: '90 MW', zone: 'Nashik', circle: 'Nashik', agreement: 'BOOT', date: '2022-06-10', status: 'Active' },
    { id: 4, generator: 'Pune Biogas Plant', vendor: 'Greenko', source: 'Biogas', capacity: '30 MW', zone: 'Pune', circle: 'Pune', agreement: 'REC', date: '2023-01-08', status: 'Active' },
    { id: 5, generator: 'Nagpur Wind Farm Unit 1', vendor: 'Azure Power', source: 'Wind', capacity: '150 MW', zone: 'Nagpur', circle: 'Nagpur', agreement: 'PPA', date: '2019-11-30', status: 'Active' },
    { id: 6, generator: 'Aurangabad Solar Hub', vendor: 'Adani Green', source: 'Solar', capacity: '240 MW', zone: 'Aurangabad', circle: 'Aurangabad', agreement: 'PPA', date: '2022-04-18', status: 'Active' },
    { id: 7, generator: 'Koyna Hydro Project', vendor: 'MahaGenco', source: 'Hydro', capacity: '120 MW', zone: 'Konkan', circle: 'Ratnagiri', agreement: 'FIT', date: '2018-08-14', status: 'Active' }
  ];

  // Filter Master Projects dynamically
  const filteredProjects = initialMasterProjects.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.generator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.circle.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSource = energySourceFilter === 'All' || item.source === energySourceFilter;
    const matchesZone = zoneFilter === 'All' || item.zone === zoneFilter;
    const matchesAgreement = agreementTypeFilter === 'All' || item.agreement === agreementTypeFilter;

    return matchesSearch && matchesSource && matchesZone && matchesAgreement;
  });

  return (
    <div className="meda-dashboard-wrap animate-fade-in">
      {/* 1. TOP HEADER OVERVIEW BAR */}
      <div className="dashboard-top-header">
        <div className="dth-left">
          <h1 className="dth-title">Dashboard Overview</h1>
          <p className="dth-sub">Monitor renewable energy projects and infrastructure across all energy sources.</p>
        </div>

        <div className="dth-right-actions">
          <button className="btn-export-outlined" onClick={() => window.print()}>
            <Download size={14} />
            <span>Export</span>
          </button>

          <button className="btn-refresh-filled" onClick={checkBackendStatus} disabled={loadingDb}>
            <RefreshCw size={14} className={loadingDb ? 'spin' : ''} />
            <span>{loadingDb ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* 2. HORIZONTAL FILTER BAR */}
      <div className="filter-bar-card light-card">
        <div className="filters-row flex-wrap">
          <div className="filter-dropdown-select">
            <select value={energySourceFilter} onChange={e => setEnergySourceFilter(e.target.value)}>
              <option value="All">Energy Source</option>
              <option value="Solar">Solar</option>
              <option value="Wind">Wind</option>
              <option value="Hydro">Hydro</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Biogas">Biogas</option>
            </select>
            <ChevronDown size={14} className="dd-arrow" />
          </div>

          <div className="filter-dropdown-select">
            <select value={dateRangeFilter} onChange={e => setDateRangeFilter(e.target.value)}>
              <option value="All">Date Range</option>
              <option value="2024">FY 2024-25</option>
              <option value="2023">FY 2023-24</option>
              <option value="2022">FY 2022-23</option>
            </select>
            <ChevronDown size={14} className="dd-arrow" />
          </div>

          <div className="filter-dropdown-select">
            <select value={zoneFilter} onChange={e => setZoneFilter(e.target.value)}>
              <option value="All">Zone</option>
              <option value="Pune">Pune</option>
              <option value="Nashik">Nashik</option>
              <option value="Konkan">Konkan</option>
              <option value="Aurangabad">Aurangabad</option>
              <option value="Nagpur">Nagpur</option>
            </select>
            <ChevronDown size={14} className="dd-arrow" />
          </div>

          <div className="filter-dropdown-select">
            <select value={circleFilter} onChange={e => setCircleFilter(e.target.value)}>
              <option value="All">Circle</option>
              <option value="Solapur">Solapur</option>
              <option value="Satara">Satara</option>
              <option value="Kolhapur">Kolhapur</option>
              <option value="Nashik">Nashik</option>
            </select>
            <ChevronDown size={14} className="dd-arrow" />
          </div>

          <div className="filter-dropdown-select">
            <select value={substationFilter} onChange={e => setSubstationFilter(e.target.value)}>
              <option value="All">Substation</option>
              <option value="Substation-A">Substation A</option>
              <option value="Substation-B">Substation B</option>
            </select>
            <ChevronDown size={14} className="dd-arrow" />
          </div>

          <div className="filter-dropdown-select">
            <select value={agreementTypeFilter} onChange={e => setAgreementTypeFilter(e.target.value)}>
              <option value="All">Agreement Type</option>
              <option value="PPA">PPA</option>
              <option value="FIT">FIT</option>
              <option value="BOOT">BOOT</option>
              <option value="REC">REC</option>
            </select>
            <ChevronDown size={14} className="dd-arrow" />
          </div>

          <div className="filter-dropdown-select">
            <select value={vendorFilter} onChange={e => setVendorFilter(e.target.value)}>
              <option value="All">Vendor</option>
              <option value="Adani Green">Adani Green</option>
              <option value="Tata Power">Tata Power</option>
              <option value="ReNew Power">ReNew Power</option>
              <option value="Greenko">Greenko</option>
            </select>
            <ChevronDown size={14} className="dd-arrow" />
          </div>

          <button className="btn-apply-filter">
            <Filter size={13} />
            <span>Apply</span>
          </button>

          <button className="btn-reset-link" onClick={resetFilters}>
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* 3. TOP 8 KPI METRIC CARDS ROW */}
      <div className="kpi-eight-cards-grid">
        {kpiMetrics.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="kpi-mini-card light-card">
              <div className="kmc-header">
                <span className="kmc-title">{kpi.title}</span>
                <div className="kmc-icon-box" style={{ background: kpi.badgeColor, color: kpi.color }}>
                  <Icon size={16} />
                </div>
              </div>

              <div className="kmc-main">
                <div className="kmc-val" style={{ color: kpi.title === 'COMMISSIONED' ? '#059669' : '#0f172a' }}>
                  {kpi.value}
                  {kpi.isCheck && <CheckCircle size={15} color="#059669" className="chk-inline" />}
                </div>
                <div className="kmc-sub" style={{ color: kpi.title === 'TOTAL PROJECTS' ? '#059669' : '#64748b' }}>
                  {kpi.sub}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. FIRST CHARTS ROW (3 CARDS) */}
      <div className="charts-three-row">
        {/* Card 1: Installed Capacity by Energy Source (Donut) */}
        <div className="chart-box-card light-card">
          <h3 className="chart-box-title">INSTALLED CAPACITY BY ENERGY SOURCE</h3>
          
          <div className="donut-center-wrap">
            <svg viewBox="0 0 160 160" className="donut-sources-svg">
              <circle cx="80" cy="80" r="54" fill="none" stroke="#059669" strokeWidth="20" strokeDasharray="110 339" strokeDashoffset="0" />
              <circle cx="80" cy="80" r="54" fill="none" stroke="#2563eb" strokeWidth="20" strokeDasharray="80 339" strokeDashoffset="-115" />
              <circle cx="80" cy="80" r="54" fill="none" stroke="#d97706" strokeWidth="20" strokeDasharray="45 339" strokeDashoffset="-198" />
              <circle cx="80" cy="80" r="54" fill="none" stroke="#0891b2" strokeWidth="20" strokeDasharray="35 339" strokeDashoffset="-245" />
              <circle cx="80" cy="80" r="54" fill="none" stroke="#7c3aed" strokeWidth="20" strokeDasharray="25 339" strokeDashoffset="-282" />
              <circle cx="80" cy="80" r="54" fill="none" stroke="#db2777" strokeWidth="20" strokeDasharray="18 339" strokeDashoffset="-309" />
              <circle cx="80" cy="80" r="54" fill="none" stroke="#ea580c" strokeWidth="20" strokeDasharray="12 339" strokeDashoffset="-328" />
            </svg>
          </div>

          <div className="energy-legend-grid">
            {energySourcesList.map((src, i) => (
              <div key={i} className="es-legend-item">
                <span className="es-dot" style={{ background: src.color }}></span>
                <span className="es-name">{src.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Capacity by Zone (MW) (Vertical Bars) */}
        <div className="chart-box-card light-card">
          <h3 className="chart-box-title">CAPACITY BY ZONE (MW)</h3>
          
          <div className="svg-vbar-container">
            <svg viewBox="0 0 350 200" className="vbar-svg">
              <line x1="30" y1="30" x2="330" y2="30" stroke="#f1f5f9" strokeDasharray="3,3" />
              <line x1="30" y1="75" x2="330" y2="75" stroke="#f1f5f9" strokeDasharray="3,3" />
              <line x1="30" y1="120" x2="330" y2="120" stroke="#f1f5f9" strokeDasharray="3,3" />
              <line x1="30" y1="165" x2="330" y2="165" stroke="#e2e8f0" />

              <text x="22" y="34" fontSize="9" fill="#94a3b8" textAnchor="end">3400</text>
              <text x="22" y="79" fontSize="9" fill="#94a3b8" textAnchor="end">2550</text>
              <text x="22" y="124" fontSize="9" fill="#94a3b8" textAnchor="end">1700</text>
              <text x="22" y="169" fontSize="9" fill="#94a3b8" textAnchor="end">0</text>

              {/* Bars */}
              {/* Pune */}
              <rect x="45" y="30" width="36" height="135" rx="4" fill="#059669" />
              <text x="63" y="182" fontSize="9" fill="#64748b" textAnchor="middle">Pune</text>

              {/* Nashik */}
              <rect x="95" y="60" width="36" height="105" rx="4" fill="#059669" />
              <text x="113" y="182" fontSize="9" fill="#64748b" textAnchor="middle">Nashik</text>

              {/* Konkan */}
              <rect x="145" y="95" width="36" height="70" rx="4" fill="#059669" />
              <text x="163" y="182" fontSize="9" fill="#64748b" textAnchor="middle">Konkan</text>

              {/* Aurangabad (Highlighted matching screenshot tooltip) */}
              <rect x="195" y="105" width="36" height="60" rx="4" fill="#059669" />
              <text x="213" y="182" fontSize="9" fill="#64748b" textAnchor="middle">Aurangabad</text>

              {/* Amravati */}
              <rect x="245" y="115" width="36" height="50" rx="4" fill="#059669" />
              <text x="263" y="182" fontSize="9" fill="#64748b" textAnchor="middle">Amravati</text>

              {/* Nagpur */}
              <rect x="295" y="122" width="36" height="43" rx="4" fill="#059669" />
              <text x="313" y="182" fontSize="9" fill="#64748b" textAnchor="middle">Nagpur</text>
            </svg>

            {/* Hover Tooltip display matching screenshot 1 */}
            <div className="screenshot-tooltip-box">
              <div className="stb-city">Aurangabad</div>
              <div className="stb-cap">Capacity : 1,720 MW</div>
            </div>
          </div>
        </div>

        {/* Card 3: Commissioning Trend (2019–2024) (Multi-Series Line) */}
        <div className="chart-box-card light-card">
          <h3 className="chart-box-title">COMMISSIONING TREND (2019–2024)</h3>
          
          <div className="svg-trendline-wrap">
            <svg viewBox="0 0 350 180" className="trendline-svg">
              <line x1="30" y1="25" x2="330" y2="25" stroke="#f1f5f9" />
              <line x1="30" y1="65" x2="330" y2="65" stroke="#f1f5f9" />
              <line x1="30" y1="105" x2="330" y2="105" stroke="#f1f5f9" />
              <line x1="30" y1="145" x2="330" y2="145" stroke="#e2e8f0" />

              <text x="22" y="28" fontSize="9" fill="#94a3b8" textAnchor="end">3200</text>
              <text x="22" y="68" fontSize="9" fill="#94a3b8" textAnchor="end">2400</text>
              <text x="22" y="108" fontSize="9" fill="#94a3b8" textAnchor="end">1600</text>
              <text x="22" y="148" fontSize="9" fill="#94a3b8" textAnchor="end">0</text>

              {/* Line 1: Projects (Solid Teal Line) */}
              <path d="M 45,130 L 100,118 L 155,100 L 210,95 L 265,88 L 320,80" fill="none" stroke="#059669" strokeWidth="2.5" />
              <circle cx="45" cy="130" r="3.5" fill="#059669" />
              <circle cx="100" cy="118" r="3.5" fill="#059669" />
              <circle cx="155" cy="100" r="3.5" fill="#059669" />
              <circle cx="210" cy="95" r="3.5" fill="#059669" />
              <circle cx="265" cy="88" r="3.5" fill="#059669" />
              <circle cx="320" cy="80" r="3.5" fill="#059669" />

              {/* Line 2: Capacity MW (Dashed Blue Line) */}
              <path d="M 45,125 L 100,105 L 155,85 L 210,65 L 265,38 L 320,25" fill="none" stroke="#2563eb" strokeWidth="2" strokeDasharray="4,4" />
              <circle cx="45" cy="125" r="3.5" fill="#2563eb" />
              <circle cx="100" cy="105" r="3.5" fill="#2563eb" />
              <circle cx="155" cy="85" r="3.5" fill="#2563eb" />
              <circle cx="210" cy="65" r="3.5" fill="#2563eb" />
              <circle cx="265" cy="38" r="3.5" fill="#2563eb" />
              <circle cx="320" cy="25" r="3.5" fill="#2563eb" />

              <text x="45" y="162" fontSize="9" fill="#64748b" textAnchor="middle">2019</text>
              <text x="100" y="162" fontSize="9" fill="#64748b" textAnchor="middle">2020</text>
              <text x="155" y="162" fontSize="9" fill="#64748b" textAnchor="middle">2021</text>
              <text x="210" y="162" fontSize="9" fill="#64748b" textAnchor="middle">2022</text>
              <text x="265" y="162" fontSize="9" fill="#64748b" textAnchor="middle">2023</text>
              <text x="320" y="162" fontSize="9" fill="#64748b" textAnchor="middle">2024</text>
            </svg>
          </div>

          <div className="line-legend-footer">
            <span className="lg-item"><span className="lg-dot green"></span> Projects</span>
            <span className="lg-item"><span className="lg-dot blue"></span> Capacity (MW)</span>
          </div>
        </div>
      </div>

      {/* 5. SECOND CHARTS ROW (3 CARDS) */}
      <div className="charts-three-row">
        {/* Card 4: Agreement Type Distribution (Donut) */}
        <div className="chart-box-card light-card">
          <h3 className="chart-box-title">AGREEMENT TYPE DISTRIBUTION</h3>
          
          <div className="donut-center-wrap">
            <svg viewBox="0 0 160 160" className="donut-sources-svg">
              <circle cx="80" cy="80" r="54" fill="none" stroke="#059669" strokeWidth="22" strokeDasharray="180 339" strokeDashoffset="0" />
              <circle cx="80" cy="80" r="54" fill="none" stroke="#2563eb" strokeWidth="22" strokeDasharray="95 339" strokeDashoffset="-185" />
              <circle cx="80" cy="80" r="54" fill="none" stroke="#7c3aed" strokeWidth="22" strokeDasharray="40 339" strokeDashoffset="-282" />
              <circle cx="80" cy="80" r="54" fill="none" stroke="#d97706" strokeWidth="22" strokeDasharray="20 339" strokeDashoffset="-324" />
            </svg>
          </div>
        </div>

        {/* Card 5: Top Vendors by Capacity (MW) (Horizontal Bars) */}
        <div className="chart-box-card light-card">
          <h3 className="chart-box-title">TOP VENDORS BY CAPACITY (MW)</h3>
          
          <div className="hbar-list-container">
            {topVendors.map((vendor, idx) => (
              <div key={idx} className="hbar-item-row">
                <span className="hbr-name">{vendor.name}</span>
                <div className="hbr-bar-track">
                  <div className="hbr-bar-fill" style={{ width: `${vendor.widthPct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 6: Capacity by Circle — Treemap (MW) (Treemap Tiles Grid) */}
        <div className="chart-box-card light-card">
          <h3 className="chart-box-title">CAPACITY BY CIRCLE — TREEMAP (MW)</h3>
          
          <div className="treemap-grid-box">
            <div className="tm-tile tile-pune">
              <strong>Pune</strong>
              <span>1,350 MW</span>
            </div>

            <div className="tm-tile tile-solapur">
              <strong>Solapur</strong>
              <span>920 MW</span>
            </div>

            <div className="tm-tile tile-aurangabad">
              <strong>Aurangabad</strong>
              <span>520 MW</span>
            </div>

            <div className="tm-tile tile-kolhapur">
              <strong>Kolhapur</strong>
              <span>780 MW</span>
            </div>

            <div className="tm-tile tile-satara">
              <strong>Satara</strong>
              <span>390 MW</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6. THIRD CHARTS ROW (STACKED, SUNBURST, DUAL AREA) */}
      <div className="charts-three-row">
        {/* Card 7: Projects by Zone — Stacked Bar */}
        <div className="chart-box-card light-card">
          <h3 className="chart-box-title">PROJECTS BY ZONE — STACKED</h3>
          
          <div className="stacked-bar-wrap">
            <svg viewBox="0 0 350 180" className="stacked-svg">
              <line x1="30" y1="20" x2="330" y2="20" stroke="#f1f5f9" />
              <line x1="30" y1="60" x2="330" y2="60" stroke="#f1f5f9" />
              <line x1="30" y1="100" x2="330" y2="100" stroke="#f1f5f9" />
              <line x1="30" y1="140" x2="330" y2="140" stroke="#e2e8f0" />

              <text x="22" y="24" fontSize="9" fill="#94a3b8" textAnchor="end">1800</text>
              <text x="22" y="64" fontSize="9" fill="#94a3b8" textAnchor="end">1350</text>
              <text x="22" y="104" fontSize="9" fill="#94a3b8" textAnchor="end">900</text>
              <text x="22" y="144" fontSize="9" fill="#94a3b8" textAnchor="end">0</text>

              {/* Pune Stack */}
              <rect x="45" y="100" width="30" height="40" fill="#d97706" />
              <rect x="45" y="55" width="30" height="45" fill="#2563eb" />
              <rect x="45" y="25" width="30" height="30" fill="#06b6d4" />
              <text x="60" y="155" fontSize="9" fill="#64748b" textAnchor="middle">Pune</text>

              {/* Nashik Stack */}
              <rect x="95" y="110" width="30" height="30" fill="#d97706" />
              <rect x="95" y="75" width="30" height="35" fill="#2563eb" />
              <rect x="95" y="50" width="30" height="25" fill="#06b6d4" />
              <text x="110" y="155" fontSize="9" fill="#64748b" textAnchor="middle">Nashik</text>

              {/* Konkan Stack */}
              <rect x="145" y="115" width="30" height="25" fill="#d97706" />
              <rect x="145" y="85" width="30" height="30" fill="#2563eb" />
              <rect x="145" y="65" width="30" height="20" fill="#06b6d4" />
              <text x="160" y="155" fontSize="9" fill="#64748b" textAnchor="middle">Konkan</text>

              {/* Aurangabad */}
              <rect x="195" y="120" width="30" height="20" fill="#d97706" />
              <rect x="195" y="98" width="30" height="22" fill="#2563eb" />
              <rect x="195" y="85" width="30" height="13" fill="#06b6d4" />
              <text x="210" y="155" fontSize="9" fill="#64748b" textAnchor="middle">Aurangabad</text>

              {/* Amravati */}
              <rect x="245" y="122" width="30" height="18" fill="#d97706" />
              <rect x="245" y="105" width="30" height="17" fill="#2563eb" />
              <rect x="245" y="95" width="30" height="10" fill="#06b6d4" />
              <text x="260" y="155" fontSize="9" fill="#64748b" textAnchor="middle">Amravati</text>

              {/* Nagpur */}
              <rect x="295" y="125" width="30" height="15" fill="#d97706" />
              <rect x="295" y="112" width="30" height="13" fill="#2563eb" />
              <rect x="295" y="103" width="30" height="9" fill="#06b6d4" />
              <text x="310" y="155" fontSize="9" fill="#64748b" textAnchor="middle">Nagpur</text>
            </svg>
          </div>

          <div className="line-legend-footer">
            <span className="lg-item"><span className="lg-dot orange"></span> Solar</span>
            <span className="lg-item"><span className="lg-dot blue"></span> Wind</span>
            <span className="lg-item"><span className="lg-dot cyan"></span> Hydro</span>
          </div>
        </div>

        {/* Card 8: Substation -> Feeder -> Generator (Multi-ring Sunburst Donut) */}
        <div className="chart-box-card light-card">
          <h3 className="chart-box-title">SUBSTATION ➔ FEEDER ➔ GENERATOR</h3>
          
          <div className="donut-center-wrap">
            <svg viewBox="0 0 180 180" className="sunburst-svg">
              {/* Inner Ring (Substations) */}
              <circle cx="90" cy="90" r="40" fill="none" stroke="#059669" strokeWidth="18" strokeDasharray="140 251" />
              <circle cx="90" cy="90" r="40" fill="none" stroke="#2563eb" strokeWidth="18" strokeDasharray="100 251" strokeDashoffset="-142" />

              {/* Outer Ring (Feeders & Generators) */}
              <circle cx="90" cy="90" r="66" fill="none" stroke="#5eead4" strokeWidth="16" strokeDasharray="80 414" />
              <circle cx="90" cy="90" r="66" fill="none" stroke="#fcd34d" strokeWidth="16" strokeDasharray="70 414" strokeDashoffset="-82" />
              <circle cx="90" cy="90" r="66" fill="none" stroke="#f87171" strokeWidth="16" strokeDasharray="60 414" strokeDashoffset="-154" />
              <circle cx="90" cy="90" r="66" fill="none" stroke="#c084fc" strokeWidth="16" strokeDasharray="50 414" strokeDashoffset="-216" />
              <circle cx="90" cy="90" r="66" fill="none" stroke="#a3e635" strokeWidth="16" strokeDasharray="40 414" strokeDashoffset="-268" />
            </svg>
          </div>

          <div className="line-legend-footer">
            <span className="lg-item"><span className="lg-dot green"></span> Substations</span>
            <span className="lg-item"><span className="lg-dot cyan"></span> Feeders & Generators</span>
          </div>
        </div>

        {/* Card 9: Agreement Capacity Trend (MW) (Dual Area Curve) */}
        <div className="chart-box-card light-card">
          <h3 className="chart-box-title">AGREEMENT CAPACITY TREND (MW)</h3>
          
          <div className="svg-trendline-wrap">
            <svg viewBox="0 0 350 180" className="trendline-svg">
              <defs>
                <linearGradient id="solarAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d97706" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#d97706" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <line x1="30" y1="30" x2="330" y2="30" stroke="#f1f5f9" />
              <line x1="30" y1="70" x2="330" y2="70" stroke="#f1f5f9" />
              <line x1="30" y1="110" x2="330" y2="110" stroke="#f1f5f9" />
              <line x1="30" y1="145" x2="330" y2="145" stroke="#e2e8f0" />

              <text x="22" y="34" fontSize="9" fill="#94a3b8" textAnchor="end">1200</text>
              <text x="22" y="74" fontSize="9" fill="#94a3b8" textAnchor="end">900</text>
              <text x="22" y="114" fontSize="9" fill="#94a3b8" textAnchor="end">600</text>
              <text x="22" y="148" fontSize="9" fill="#94a3b8" textAnchor="end">0</text>

              {/* Solar Area curve */}
              <path d="M 45,95 Q 150,60 260,40 T 320,65 L 320,145 L 45,145 Z" fill="url(#solarAreaGrad)" />
              <path d="M 45,95 Q 150,60 260,40 T 320,65" fill="none" stroke="#d97706" strokeWidth="2.5" />

              {/* Wind Line curve */}
              <path d="M 45,115 Q 150,90 260,85 T 320,70" fill="none" stroke="#2563eb" strokeWidth="2.5" />

              <text x="45" y="162" fontSize="9" fill="#64748b" textAnchor="middle">Jan</text>
              <text x="100" y="162" fontSize="9" fill="#64748b" textAnchor="middle">Feb</text>
              <text x="155" y="162" fontSize="9" fill="#64748b" textAnchor="middle">Mar</text>
              <text x="210" y="162" fontSize="9" fill="#64748b" textAnchor="middle">Apr</text>
              <text x="265" y="162" fontSize="9" fill="#64748b" textAnchor="middle">May</text>
              <text x="320" y="162" fontSize="9" fill="#64748b" textAnchor="middle">Jun</text>
            </svg>
          </div>

          <div className="line-legend-footer">
            <span className="lg-item"><span className="lg-dot orange"></span> Solar</span>
            <span className="lg-item"><span className="lg-dot blue"></span> Wind</span>
          </div>
        </div>
      </div>

      {/* 7. PROJECT MASTER TABLE (MATCHING SCREENSHOT 2) */}
      <div className="project-master-table-card light-card">
        <div className="pmt-header-flex">
          <h3 className="pmt-title">PROJECT MASTER TABLE</h3>

          <div className="pmt-controls-right">
            <div className="pmt-search-box">
              <Search size={14} className="pmt-search-icon" />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pmt-search-input" 
              />
            </div>

            <button className="btn-export-outlined btn-compact">
              <Download size={13} />
              <span>Export</span>
            </button>
          </div>
        </div>

        <div className="table-responsive-wrapper">
          <table className="master-project-table">
            <thead>
              <tr>
                <th>GENERATOR</th>
                <th>VENDOR</th>
                <th>ENERGY SOURCE</th>
                <th>CAPACITY</th>
                <th>ZONE</th>
                <th>CIRCLE</th>
                <th>AGREEMENT TYPE</th>
                <th>DATE</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((proj) => (
                <tr key={proj.id} className="table-row-hover">
                  <td><strong className="proj-name-bold">{proj.generator}</strong></td>
                  <td><span className="vendor-text">{proj.vendor}</span></td>
                  <td>
                    <span className={`source-pill ${proj.source.toLowerCase()}`}>
                      {proj.source}
                    </span>
                  </td>
                  <td><strong className="cap-bold">{proj.capacity}</strong></td>
                  <td><span className="zone-sub">{proj.zone}</span></td>
                  <td><span className="circle-sub">{proj.circle}</span></td>
                  <td>
                    <span className="agreement-blue-pill">{proj.agreement}</span>
                  </td>
                  <td><span className="date-text">{proj.date}</span></td>
                  <td>
                    <span className="status-green-pill">Active</span>
                  </td>
                  <td>
                    <div className="table-actions-cell">
                      <button className="icon-act-btn" title="View Details"><Eye size={14} /></button>
                      <button className="icon-act-btn" title="Edit Record"><Edit size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inline Styles matching Screenshot 1 & 2 exactly */}
      <style>{`
        .meda-dashboard-wrap {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        /* 1. Header Overview Bar */
        .dashboard-top-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0px 2px;
        }

        .dth-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.3px;
        }

        .dth-sub {
          font-size: 0.75rem;
          color: #64748b;
          margin-top: 1px;
        }

        .dth-right-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-export-outlined {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #334155;
          font-weight: 600;
          font-size: 0.75rem;
          padding: 6px 14px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 5px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .btn-export-outlined:hover {
          background: #f8fafc;
          border-color: #10b981;
          color: #059669;
          transform: translateY(-1px);
        }

        .btn-refresh-filled {
          background: #059669;
          border: none;
          color: #ffffff;
          font-weight: 600;
          font-size: 0.75rem;
          padding: 6px 16px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 5px;
          cursor: pointer;
          box-shadow: 0 3px 10px rgba(5, 150, 105, 0.25);
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .btn-refresh-filled:hover {
          background: #047857;
          transform: translateY(-1px);
          box-shadow: 0 5px 15px rgba(5, 150, 105, 0.35);
        }

        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        /* 2. Filter Bar */
        .filter-bar-card {
          padding: 10px 14px;
          border: 1px solid #e2e8f0;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .filter-bar-card:hover {
          border-color: #cbd5e1;
          box-shadow: 0 4px 15px rgba(8, 45, 56, 0.04);
        }

        .filters-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .filter-dropdown-select {
          position: relative;
        }

        .filter-dropdown-select select {
          appearance: none;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 6px 26px 6px 12px;
          font-size: 0.72rem;
          color: #475569;
          font-weight: 600;
          outline: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .filter-dropdown-select select:hover {
          border-color: #10b981;
          background: #ffffff;
        }

        .dd-arrow {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          pointer-events: none;
        }

        .btn-apply-filter {
          background: #059669;
          color: #ffffff;
          border: none;
          border-radius: 16px;
          padding: 6px 14px;
          font-size: 0.72rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-apply-filter:hover {
          background: #047857;
          transform: translateY(-1px);
        }

        .btn-reset-link {
          background: transparent;
          border: none;
          color: #94a3b8;
          font-size: 0.72rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 3px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-reset-link:hover { color: #0f172a; }

        /* 3. TOP 8 KPI CARDS GRID */
        .kpi-eight-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
          gap: 12px;
        }

        .kpi-mini-card {
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: #ffffff;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          min-height: 82px;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease;
        }

        .kpi-mini-card:hover {
          transform: translateY(-3px) scale(1.008);
          box-shadow: 0 8px 20px rgba(8, 45, 56, 0.06), 0 0 0 1px rgba(16, 185, 129, 0.25);
          border-color: #10b981;
        }

        .kmc-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 4px;
        }

        .kmc-title {
          font-size: 0.62rem;
          font-weight: 800;
          color: #94a3b8;
          letter-spacing: 0.3px;
          line-height: 1.2;
        }

        .kmc-icon-box {
          width: 24px;
          height: 24px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .kmc-main { margin-top: 6px; }

        .kmc-val {
          font-size: 1.2rem;
          font-weight: 800;
          letter-spacing: -0.3px;
          display: flex;
          align-items: center;
          gap: 3px;
        }

        .kmc-sub {
          font-size: 0.62rem;
          font-weight: 600;
          margin-top: 1px;
        }

        /* 4. CHARTS THREE ROW GRID (UNIFORM EQUAL HEIGHT CARDS - ENLARGED) */
        .charts-three-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          align-items: stretch;
        }

        @media (max-width: 1024px) {
          .charts-three-row { grid-template-columns: 1fr; }
        }

        .chart-box-card {
          padding: 18px 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: #ffffff;
          border-radius: 14px;
          border: 1px solid #e2e8f0;
          height: 335px;
          min-height: 335px;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease;
        }

        .chart-box-card:hover {
          transform: translateY(-4px) scale(1.005);
          box-shadow: 0 12px 28px rgba(8, 45, 56, 0.08), 0 0 0 1px rgba(16, 185, 129, 0.25);
          border-color: #10b981;
        }

        .chart-box-title {
          font-size: 0.72rem;
          font-weight: 800;
          color: #64748b;
          letter-spacing: 0.4px;
          text-transform: uppercase;
        }

        .donut-center-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 175px;
          flex: 1;
        }

        .donut-sources-svg, .sunburst-svg {
          width: 170px;
          height: 170px;
          transition: transform 0.3s ease;
        }

        .donut-sources-svg:hover, .sunburst-svg:hover {
          transform: scale(1.06);
        }

        .energy-legend-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px 12px;
          margin-top: 6px;
        }

        .es-legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.72rem;
          color: #475569;
          font-weight: 600;
        }

        .es-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }

        .svg-vbar-container {
          position: relative;
          width: 100%;
          height: 215px;
          flex: 1;
        }

        .vbar-svg, .trendline-svg, .stacked-svg {
          width: 100%;
          height: 100%;
        }

        .screenshot-tooltip-box {
          position: absolute;
          top: 75px;
          left: 145px;
          background: #ffffff;
          border: 1px solid #10b981;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.15);
          border-radius: 6px;
          padding: 4px 9px;
          z-index: 10;
        }

        .stb-city { font-size: 0.72rem; font-weight: 700; color: #0f172a; }
        .stb-cap { font-size: 0.68rem; color: #059669; font-weight: 700; }

        .svg-trendline-wrap {
          width: 100%;
          height: 215px;
          flex: 1;
        }

        .line-legend-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          font-size: 0.72rem;
          color: #64748b;
          font-weight: 600;
          margin-top: 6px;
        }

        .lg-item { display: flex; align-items: center; gap: 5px; }
        .lg-dot { width: 7px; height: 7px; border-radius: 50%; }
        .lg-dot.green { background: #059669; }
        .lg-dot.blue { background: #2563eb; }
        .lg-dot.orange { background: #d97706; }
        .lg-dot.cyan { background: #06b6d4; }

        /* Horizontal Bars Vendor Card */
        .hbar-list-container {
          display: flex;
          flex-direction: column;
          gap: 11px;
          margin-top: 6px;
          flex: 1;
          justify-content: center;
        }

        .hbar-item-row {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .hbr-name {
          font-size: 0.72rem;
          font-weight: 600;
          color: #475569;
        }

        .hbr-bar-track {
          height: 18px;
          background: #f1f5f9;
          border-radius: 4px;
          overflow: hidden;
        }

        .hbr-bar-fill {
          height: 100%;
          background: #2563eb;
          border-radius: 4px;
          transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Treemap Tiles Card */
        .treemap-grid-box {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          grid-template-rows: 100px 100px;
          gap: 4px;
          margin-top: 6px;
          border-radius: 8px;
          overflow: hidden;
          flex: 1;
        }

        .tm-tile {
          color: #ffffff;
          padding: 8px 10px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          font-size: 0.72rem;
          transition: opacity 0.2s ease, transform 0.2s ease;
        }

        .tm-tile:hover {
          opacity: 0.92;
          transform: scale(1.02);
        }

        .tile-pune { background: #059669; grid-row: 1 / 3; }
        .tile-solapur { background: #d97706; }
        .tile-aurangabad { background: #ea580c; }
        .tile-kolhapur { background: #0891b2; }
        .tile-satara { background: #65a30d; }

        .stacked-bar-wrap {
          width: 100%;
          height: 215px;
          flex: 1;
        }

        /* Project Master Table Card */
        .project-master-table-card {
          padding: 18px 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: #ffffff;
          border-radius: 14px;
          border: 1px solid #e2e8f0;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .project-master-table-card:hover {
          box-shadow: 0 8px 24px rgba(8, 45, 56, 0.05);
        }

        .pmt-header-flex {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .pmt-title {
          font-size: 0.8rem;
          font-weight: 800;
          color: #64748b;
          letter-spacing: 0.4px;
        }

        .pmt-controls-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .pmt-search-box {
          position: relative;
          width: 170px;
        }

        .pmt-search-icon {
          position: absolute;
          left: 8px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        .pmt-search-input {
          width: 100%;
          padding: 5px 10px 5px 28px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          font-size: 0.72rem;
          outline: none;
          transition: border-color 0.2s ease;
        }

        .pmt-search-input:focus {
          border-color: #10b981;
          background: #ffffff;
        }

        .master-project-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .master-project-table th {
          padding: 9px 10px;
          font-size: 0.65rem;
          font-weight: 800;
          color: #94a3b8;
          border-bottom: 1px solid #e2e8f0;
          text-transform: uppercase;
        }

        .master-project-table td {
          padding: 10px 10px;
          font-size: 0.76rem;
          border-bottom: 1px solid #f1f5f9;
        }

        .table-row-hover {
          transition: background 0.15s ease;
        }

        .table-row-hover:hover {
          background: #f8fafc;
        }

        .proj-name-bold { color: #0f172a; }
        .vendor-text { color: #475569; }

        .source-pill {
          padding: 2px 6px;
          border-radius: 10px;
          font-size: 0.65rem;
          font-weight: 700;
        }

        .source-pill.solar { background: #dcfce7; color: #15803d; }
        .source-pill.wind { background: #dbeafe; color: #1e40af; }
        .source-pill.hybrid { background: #cff4fc; color: #0e7490; }
        .source-pill.biogas { background: #f3e8ff; color: #6b21a8; }

        .cap-bold { color: #0f172a; }

        .agreement-blue-pill {
          background: #dbeafe;
          color: #2563eb;
          font-weight: 700;
          font-size: 0.65rem;
          padding: 1px 6px;
          border-radius: 4px;
        }

        .status-green-pill {
          background: #dcfce7;
          color: #16a34a;
          font-weight: 700;
          font-size: 0.65rem;
          padding: 1px 6px;
          border-radius: 10px;
        }

        .icon-act-btn:hover { color: #0f172a; }

        /* Mobile View Alignments & Responsive Controls */
        @media (max-width: 768px) {
          .dashboard-header-bar {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .dh-actions {
            width: 100%;
            display: flex;
            justify-content: space-between;
            gap: 8px;
          }

          .filters-row {
            flex-wrap: wrap;
            gap: 8px;
          }

          .filter-dropdown-select {
            flex: 1 1 calc(50% - 6px);
            min-width: 130px;
          }

          .filter-dropdown-select select {
            width: 100%;
          }

          .btn-apply-filter, .btn-reset-link {
            flex: 1 1 auto;
            justify-content: center;
          }

          .kpi-eight-cards-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
          }

          .charts-three-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
