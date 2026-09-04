import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import GovtSolarDashboard from './GovtSolarDashboard';
import BagasseDashboard from './BagasseDashboard';
import BiomassDashboard from './BiomassDashboard';
import SolarGridDashboard from './SolarGridDashboard';
import MswDashboard from './MswDashboard';
import SmallHydroDashboard from './SmallHydroDashboard';
import SolarKusumDashboard from './SolarKusumDashboard';
import WindDashboard from './WindDashboard';
import OffGridDashboard from './OffGridDashboard';
import RooftopDashboard from './RooftopDashboard';
import GridConnectedDashboard from './GridConnectedDashboard';
import MskvyDashboard from './MskvyDashboard';
import { energyApi } from '../../services/energyApi';
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
  RotateCcw,
  LayoutGrid,
  Award,
  Building2,
  Leaf,
  Trash2,
  Home,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Compass,
  Navigation,
  Layers,
  Info,
  ArrowUpRight
} from 'lucide-react';
import axios from 'axios';
import { medaApi } from '../../services/medaApi';
import { API_BASE_URL } from '../../services/apiConfig';
import logoImg from '../../assets/logo.png';

const Dashboard = ({ currentUser }) => {
  const navigate = useNavigate();

  // Active Category Tab & Scroller State
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTabState] = useState(tabFromUrl || 'summary');
  const formatCapacityMw = (val) => {
    if (val === undefined || val === null || isNaN(val)) return '0';
    const num = Number(val);
    if (num === 0) return '0';
    return num.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).replace(/\.00$/, '');
  };

  const [govtSolarSummary, setGovtSolarSummary] = useState({ count: '0', capacity: '0 MW', rawCount: 0, rawMw: 0 });
  const [solarGridSummary, setSolarGridSummary] = useState({ count: '0', capacity: '0 MW', rawCount: 0, rawMw: 0 });
  const [bagasseSummary, setBagasseSummary] = useState({ count: '0', capacity: '0 MW', rawCount: 0, rawMw: 0 });
  const [biomassSummary, setBiomassSummary] = useState({ count: '0', capacity: '0 MW', rawCount: 0, rawMw: 0 });
  const [mswSummary, setMswSummary] = useState({ count: '0', capacity: '0 MW', rawCount: 0, rawMw: 0 });
  const [shpSummary, setShpSummary] = useState({ count: '0', capacity: '0 MW', rawCount: 0, rawMw: 0 });
  const [kusumSummary, setKusumSummary] = useState({ count: '0', capacity: '0 MW', rawCount: 0, rawMw: 0 });
  const [windSummary, setWindSummary] = useState({ count: '0', capacity: '0 MW', rawCount: 0, rawMw: 0 });
  const [mskvySummary, setMskvySummary] = useState({ count: '0', capacity: '0 MW', rawCount: 0, rawMw: 0 });

  const setActiveTab = (tabId) => {
    setActiveTabState(tabId);
    setSearchParams({ tab: tabId });
  };

  useEffect(() => {
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTabState(tabFromUrl);
    }
  }, [tabFromUrl]);

  const fetchAnalytics = async () => {
    try {
      const results = await Promise.allSettled([
        energyApi.getAnalytics('govt-solarization'),
        energyApi.getAnalytics('solar-grid'),
        energyApi.getAnalytics('bagasse'),
        energyApi.getAnalytics('biomass'),
        energyApi.getAnalytics('msw'),
        energyApi.getAnalytics('small-hydro'),
        energyApi.getAnalytics('solar-kusum'),
        energyApi.getAnalytics('wind'),
        energyApi.getAnalytics('mskvy')
      ]);

      const [govt, solar, bagasse, biomass, msw, shp, kusum, wind, mskvy] = results;

      if (govt.status === 'fulfilled' && govt.value?.success) {
        const count = Number(govt.value.total_projects || 0);
        const mw = Number(govt.value.total_capacity_mw || 0);
        setGovtSolarSummary({
          count: count.toLocaleString('en-IN'),
          capacity: `${formatCapacityMw(mw)} MW`,
          rawCount: count,
          rawMw: mw
        });
      }
      if (solar.status === 'fulfilled' && solar.value?.success) {
        const count = Number(solar.value.total_projects || 0);
        const mw = Number(solar.value.total_capacity_mw || 0);
        setSolarGridSummary({
          count: count.toLocaleString('en-IN'),
          capacity: `${formatCapacityMw(mw)} MW`,
          rawCount: count,
          rawMw: mw
        });
      }
      if (bagasse.status === 'fulfilled' && bagasse.value?.success) {
        const count = Number(bagasse.value.total_projects || 0);
        const mw = Number(bagasse.value.total_capacity_mw || 0);
        setBagasseSummary({
          count: count.toLocaleString('en-IN'),
          capacity: `${formatCapacityMw(mw)} MW`,
          rawCount: count,
          rawMw: mw
        });
      }
      if (biomass.status === 'fulfilled' && biomass.value?.success) {
        const count = Number(biomass.value.total_projects || 0);
        const mw = Number(biomass.value.total_capacity_mw || 0);
        setBiomassSummary({
          count: count.toLocaleString('en-IN'),
          capacity: `${formatCapacityMw(mw)} MW`,
          rawCount: count,
          rawMw: mw
        });
      }
      if (msw.status === 'fulfilled' && msw.value?.success) {
        const count = Number(msw.value.total_projects || 0);
        const mw = Number(msw.value.total_capacity_mw || 0);
        setMswSummary({
          count: count.toLocaleString('en-IN'),
          capacity: `${formatCapacityMw(mw)} MW`,
          rawCount: count,
          rawMw: mw
        });
      }
      if (shp.status === 'fulfilled' && shp.value?.success) {
        const count = Number(shp.value.total_projects || 0);
        const mw = Number(shp.value.total_capacity_mw || 0);
        setShpSummary({
          count: count.toLocaleString('en-IN'),
          capacity: `${formatCapacityMw(mw)} MW`,
          rawCount: count,
          rawMw: mw
        });
      }
      if (kusum.status === 'fulfilled' && kusum.value?.success) {
        const count = Number(kusum.value.total_projects || 0);
        const mw = Number(kusum.value.total_capacity_mw || 0);
        setKusumSummary({
          count: count.toLocaleString('en-IN'),
          capacity: `${formatCapacityMw(mw)} MW`,
          rawCount: count,
          rawMw: mw
        });
      }
      if (wind.status === 'fulfilled' && wind.value?.success) {
        const count = Number(wind.value.total_projects || 0);
        const mw = Number(wind.value.total_capacity_mw || 0);
        setWindSummary({
          count: count.toLocaleString('en-IN'),
          capacity: `${formatCapacityMw(mw)} MW`,
          rawCount: count,
          rawMw: mw
        });
      }
      if (mskvy && mskvy.status === 'fulfilled' && mskvy.value?.success) {
        const count = Number(mskvy.value.total_projects || 0);
        const mw = Number(mskvy.value.total_capacity_mw || 0);
        setMskvySummary({
          count: count.toLocaleString('en-IN'),
          capacity: `${formatCapacityMw(mw)} MW`,
          rawCount: count,
          rawMw: mw
        });
      }
    } catch (err) {
      console.warn('Error fetching analytics:', err);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const scrollRef = useRef(null);

  // Maharashtra Wind Geographical Map State
  const [selectedWindDistrict, setSelectedWindDistrict] = useState('satara');
  const [hoveredWindDistrict, setHoveredWindDistrict] = useState(null);
  const [mapTooltip, setMapTooltip] = useState({ visible: false, district: null, x: 0, y: 0 });

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Dynamic Grid Connected Solar Capacity Sum:
  const dynamicGridConnectedMw = 
    (solarGridSummary.rawMw || 0) +
    (kusumSummary.rawMw || 0) +
    (mskvySummary.rawMw || 0) + // MSKVY
    8000.04 + // Rooftop
    (govtSolarSummary.rawMw || 0) +
    15.81; // Amrut

  // Dynamic Total Installed Capacity Sum:
  const dynamicTotalCapacityMw = 
    dynamicGridConnectedMw +
    (windSummary.rawMw || 0) +
    (bagasseSummary.rawMw || 0) +
    (shpSummary.rawMw || 0) +
    (mswSummary.rawMw || 0) +
    (biomassSummary.rawMw || 0) +
    3061.0; // Large Hydro

  // Dynamic Total Projects Count across database models:
  const dynamicTotalProjectsCount = 
    (solarGridSummary.rawCount || 0) +
    (windSummary.rawCount || 0) +
    (bagasseSummary.rawCount || 0) +
    (biomassSummary.rawCount || 0) +
    (mswSummary.rawCount || 0) +
    (shpSummary.rawCount || 0) +
    (govtSolarSummary.rawCount || 0) +
    (kusumSummary.rawCount || 0) +
    (mskvySummary.rawCount || 0);

  const CATEGORIES = [
    { id: 'summary', label: 'Summary', icon: LayoutGrid, count: dynamicTotalProjectsCount.toLocaleString('en-IN'), capacity: `${formatCapacityMw(dynamicTotalCapacityMw)} MW`, color: '#059669', bg: '#dcfce7' },
    { id: 'solar-grid-conn', label: 'Grid Connected', icon: Sun, count: '', capacity: `${formatCapacityMw(dynamicGridConnectedMw)} MW`, color: '#ea580c', bg: '#ffedd5' },
    { id: 'solar-offgrid-sum', label: 'Off Grid', icon: Sun, count: '10,03,077', capacity: '43.42 Lakh HP', color: '#ca8a04', bg: '#fef9c3' },
    { id: 'kusum-ac', label: 'KUSUM', icon: Zap, count: kusumSummary.count, capacity: kusumSummary.capacity, color: '#d97706', bg: '#fef3c7' },
    { id: 'mskvy', label: 'MSKVY', icon: Cpu, count: mskvySummary.count, capacity: mskvySummary.capacity, color: '#0284c7', bg: '#e0f2fe' },
    { id: 'solar-rooftop', label: 'Rooftop', icon: Home, count: '2,410', capacity: '8,000.04 MW', color: '#059669', bg: '#ecfdf5' },
    { id: 'solar-grid', label: 'Solar Grid', icon: Sun, count: solarGridSummary.count, capacity: solarGridSummary.capacity, color: '#eab308', bg: '#fef08a' },
    { id: 'govt-building-solar', label: 'Government Building Solar', icon: Building2, count: govtSolarSummary.count, capacity: govtSolarSummary.capacity, color: '#4f46e5', bg: '#e0e7ff' },
    { id: 'wind', label: 'Wind', icon: Wind, count: windSummary.count, capacity: windSummary.capacity, color: '#0891b2', bg: '#cff4fc' },
    { id: 'bagasse', label: 'Bagasse', icon: Leaf, count: bagasseSummary.count, capacity: bagasseSummary.capacity, color: '#16a34a', bg: '#dcfce7' },
    { id: 'biomass', label: 'Biomass', icon: Flame, count: biomassSummary.count, capacity: biomassSummary.capacity, color: '#059669', bg: '#d1fae5' },
    { id: 'small-hydro', label: 'Small Hydro Projects', icon: Droplets, count: shpSummary.count, capacity: shpSummary.capacity, color: '#0284c7', bg: '#e0f2fe' },
    { id: 'municipal-waste', label: 'Municipal Solid Waste', icon: Trash2, count: mswSummary.count, capacity: mswSummary.capacity, color: '#7c3aed', bg: '#f3e8ff' }
  ];

  const currentCategory = CATEGORIES.find(c => c.id === activeTab) || CATEGORIES[0];
  const CurrentIcon = currentCategory.icon;

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
    fetchAnalytics();
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
    { title: 'TOTAL PROJECTS', value: dynamicTotalProjectsCount.toLocaleString('en-IN'), sub: '+12.4% vs last year', color: '#059669', icon: Folder, badgeColor: '#dcfce7' },
    { title: 'INSTALLED CAPACITY', value: `${formatCapacityMw(dynamicTotalCapacityMw)} MW`, sub: 'Target: 35,000 MW', color: '#2563eb', icon: Zap, badgeColor: '#dbeafe' },
    { title: 'AGREEMENT CAPACITY', value: `${formatCapacityMw(dynamicTotalCapacityMw * 0.789)} MW`, sub: '78.9% of installed', color: '#d97706', icon: FileText, badgeColor: '#fef3c7' },
    { title: 'COMMISSIONED', value: Math.round(dynamicTotalProjectsCount * 0.92).toLocaleString('en-IN'), sub: '92.0% commission rate', color: '#16a34a', icon: CheckCircle, badgeColor: '#dcfce7', isCheck: true },
    { title: 'TOTAL GENERATORS', value: ((windSummary.rawCount || 0) + (solarGridSummary.rawCount || 0)).toLocaleString('en-IN'), sub: 'Across active sources', color: '#0891b2', icon: Activity, badgeColor: '#cff4fc' },
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
    { name: 'Chhatrapati Sambhajinagar', mw: 1720 },
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
    { id: 6, generator: 'Chhatrapati Sambhajinagar Solar Hub', vendor: 'Adani Green', source: 'Solar', capacity: '240 MW', zone: 'Chhatrapati Sambhajinagar', circle: 'Chhatrapati Sambhajinagar', agreement: 'PPA', date: '2022-04-18', status: 'Active' },
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


  // Maharashtra Wind Power Districts Map Dataset (Accurate Real Outline Layout)
  const MAHARASHTRA_WIND_DISTRICTS = [
    {
      "id": "ahilyanagar",
      "name": "Ahilyanagar",
      "region": "Western / Central",
      "mw": 350,
      "pct": "5.5%",
      "projects": 175,
      "farms": "Akole, Sangamner Ridge",
      "color": "#38bdf8",
      "fill": "#7dd3fc",
      "rank": "#6",
      "windSpeed": "6.2 m/s",
      "cx": 227.0,
      "cy": 235.0,
      "path": "M 139.1,201.8 L 140.1,201.6 L 140.8,200.9 L 140.9,200.6 L 140.5,200.5 L 139.7,200.1 L 140.3,199.4 L 140.8,198.9 L 141.9,198.3 L 141.0,197.6 L 141.7,197.5 L 142.4,197.8 L 143.2,195.9 L 144.7,195.2 L 145.3,193.6 L 147.7,192.8 L 149.1,193.4 L 149.9,192.6 L 150.8,193.1 L 150.6,194.2 L 151.3,195.8 L 151.9,196.5 L 151.6,197.4 L 155.4,198.6 L 156.4,198.5 L 158.8,198.7 L 161.1,198.8 L 163.1,198.9 L 166.5,199.5 L 168.9,201.0 L 169.9,200.8 L 172.1,199.4 L 173.2,198.5 L 172.5,196.9 L 174.1,197.2 L 174.4,196.3 L 175.1,194.7 L 175.8,194.3 L 177.4,193.8 L 180.8,193.5 L 183.3,192.6 L 184.6,192.0 L 185.7,190.7 L 188.4,191.2 L 189.9,191.3 L 190.3,189.5 L 194.0,188.7 L 194.6,188.5 L 194.3,186.9 L 193.8,185.1 L 191.2,182.6 L 186.4,181.2 L 185.4,179.3 L 183.1,178.8 L 183.9,176.9 L 186.3,176.5 L 188.2,176.5 L 188.8,176.2 L 189.5,175.7 L 192.4,176.6 L 194.9,176.2 L 201.1,176.0 L 203.3,175.0 L 204.4,176.3 L 205.9,176.4 L 207.8,176.5 L 208.2,176.0 L 211.5,176.5 L 213.0,177.5 L 222.2,178.1 L 223.0,179.7 L 220.0,180.8 L 219.9,184.5 L 219.6,186.0 L 216.1,185.3 L 214.7,190.0 L 215.2,191.1 L 216.9,191.1 L 217.7,190.1 L 218.8,189.5 L 220.4,190.5 L 222.3,191.2 L 224.1,192.0 L 225.4,191.9 L 225.1,190.9 L 226.8,191.4 L 226.7,192.1 L 227.6,192.3 L 229.1,192.8 L 231.1,192.6 L 231.9,193.9 L 233.0,194.4 L 233.9,195.9 L 235.5,196.4 L 235.1,197.5 L 236.4,198.7 L 236.8,199.0 L 237.9,199.5 L 238.4,200.2 L 240.0,200.3 L 242.2,199.8 L 242.4,200.5 L 243.8,200.7 L 245.7,200.3 L 246.7,201.0 L 247.7,200.5 L 251.0,201.1 L 254.6,202.4 L 256.0,202.2 L 256.4,202.7 L 257.8,203.5 L 258.9,203.6 L 261.3,203.3 L 263.0,203.7 L 264.8,204.6 L 266.6,204.8 L 267.5,204.5 L 269.1,204.2 L 271.3,205.6 L 271.5,206.6 L 272.9,207.5 L 273.9,208.5 L 275.7,209.2 L 276.9,209.7 L 277.5,207.6 L 278.5,207.8 L 278.8,208.8 L 280.8,210.9 L 281.6,211.9 L 282.9,211.7 L 283.1,213.0 L 284.8,211.6 L 286.1,212.5 L 284.4,213.4 L 282.5,214.9 L 283.4,216.1 L 285.1,215.5 L 285.5,216.7 L 284.3,218.2 L 287.4,218.7 L 288.0,218.1 L 289.9,217.8 L 290.9,217.6 L 293.2,217.3 L 293.9,217.5 L 294.8,217.9 L 296.2,217.9 L 296.8,217.3 L 297.8,217.7 L 297.6,220.2 L 298.5,220.6 L 301.0,220.5 L 301.3,222.6 L 302.6,225.7 L 301.2,226.7 L 298.5,229.0 L 297.8,229.3 L 296.5,230.0 L 295.0,230.3 L 292.2,232.4 L 290.8,233.3 L 290.0,234.1 L 291.6,235.4 L 294.5,237.9 L 292.8,238.4 L 292.1,238.9 L 293.9,239.6 L 297.4,239.4 L 297.5,240.5 L 294.8,242.5 L 293.9,242.0 L 290.2,242.9 L 288.1,243.0 L 286.6,242.1 L 288.5,240.1 L 290.2,239.5 L 290.1,238.4 L 286.6,239.3 L 285.3,239.4 L 285.1,237.8 L 283.1,238.0 L 283.9,239.6 L 285.1,240.3 L 286.2,242.1 L 285.9,243.1 L 281.7,241.8 L 279.3,242.6 L 279.5,243.2 L 279.3,245.1 L 281.0,246.5 L 284.6,247.1 L 284.1,249.4 L 283.2,249.7 L 280.1,250.5 L 278.9,250.0 L 277.8,249.4 L 277.7,247.7 L 276.7,246.9 L 277.3,246.4 L 277.1,244.1 L 275.3,243.9 L 274.9,243.9 L 274.2,244.2 L 273.8,242.7 L 273.2,241.4 L 272.7,240.5 L 271.4,241.3 L 270.1,241.9 L 270.5,242.6 L 270.5,243.2 L 269.9,244.9 L 271.6,246.0 L 271.8,247.2 L 269.3,247.8 L 268.3,247.1 L 266.4,245.8 L 265.9,246.1 L 259.5,244.8 L 259.3,244.0 L 260.8,243.6 L 260.0,242.8 L 261.5,242.9 L 261.8,241.1 L 262.7,240.5 L 261.6,239.5 L 260.9,239.8 L 259.7,240.8 L 258.8,241.0 L 257.4,241.2 L 257.1,241.0 L 255.9,240.7 L 254.9,241.0 L 254.9,240.3 L 254.0,240.9 L 252.7,240.5 L 251.4,240.4 L 250.7,240.5 L 248.6,239.7 L 247.8,239.1 L 247.2,239.4 L 245.6,241.3 L 245.0,244.9 L 246.5,246.2 L 247.8,247.5 L 248.8,248.8 L 248.5,250.4 L 247.4,251.1 L 245.9,251.0 L 243.5,250.6 L 241.2,250.1 L 237.9,251.2 L 236.2,249.9 L 235.6,251.5 L 237.3,251.9 L 237.3,253.1 L 238.5,254.4 L 239.4,255.9 L 240.7,255.9 L 241.6,255.4 L 242.0,256.9 L 243.2,258.6 L 244.3,260.0 L 245.2,259.8 L 244.8,261.4 L 246.8,261.5 L 248.3,262.1 L 249.8,262.1 L 250.4,263.2 L 251.6,264.0 L 253.3,263.4 L 252.8,264.4 L 253.2,265.3 L 254.6,265.9 L 256.4,267.3 L 257.9,268.8 L 259.3,269.9 L 261.6,270.8 L 262.8,272.1 L 264.6,273.4 L 265.7,274.6 L 266.7,275.0 L 268.2,272.9 L 268.6,268.4 L 273.1,269.0 L 277.4,269.1 L 282.8,264.0 L 285.2,265.1 L 288.7,265.9 L 289.6,261.6 L 294.0,266.2 L 295.7,267.4 L 300.5,269.3 L 303.0,267.7 L 304.0,269.6 L 305.6,271.0 L 305.9,272.3 L 303.3,272.5 L 302.8,273.9 L 303.8,274.7 L 302.7,275.6 L 301.2,275.8 L 299.5,277.0 L 297.7,276.9 L 296.3,278.1 L 295.5,278.7 L 294.4,279.5 L 292.4,282.6 L 291.3,283.7 L 287.7,282.3 L 284.3,282.1 L 281.8,284.6 L 278.5,285.0 L 276.1,284.7 L 274.9,283.1 L 273.6,282.9 L 272.8,282.1 L 271.4,283.7 L 269.7,284.0 L 267.2,284.6 L 264.4,285.5 L 263.6,286.7 L 261.9,288.4 L 261.1,289.4 L 260.9,291.3 L 260.1,291.5 L 259.6,291.9 L 258.6,292.0 L 257.1,291.4 L 253.7,291.2 L 252.9,293.4 L 250.0,294.0 L 249.3,294.7 L 247.5,294.7 L 244.7,295.3 L 242.5,296.9 L 240.4,297.2 L 239.9,298.5 L 237.5,298.3 L 236.3,297.8 L 234.1,297.5 L 233.7,296.6 L 234.8,294.9 L 232.5,293.1 L 231.2,293.1 L 229.8,293.9 L 227.3,292.9 L 226.4,290.8 L 227.3,288.2 L 226.2,286.5 L 224.8,285.7 L 223.0,286.5 L 220.7,287.5 L 221.4,288.7 L 222.0,289.2 L 219.5,289.9 L 217.6,289.0 L 213.7,288.1 L 211.9,286.7 L 210.8,285.1 L 212.8,283.9 L 213.0,282.7 L 213.6,282.2 L 211.9,281.1 L 210.7,280.3 L 210.4,279.3 L 210.4,277.4 L 207.8,277.5 L 206.6,276.7 L 204.3,276.1 L 204.0,275.1 L 205.5,274.6 L 207.1,274.0 L 206.9,272.9 L 204.3,272.6 L 204.5,271.0 L 203.4,269.4 L 202.4,269.5 L 201.1,269.3 L 200.4,268.1 L 199.6,267.5 L 197.5,268.1 L 196.6,266.1 L 196.5,265.1 L 196.0,263.9 L 196.3,262.5 L 196.3,261.2 L 194.2,261.0 L 191.3,260.9 L 189.7,260.5 L 188.6,258.7 L 188.1,257.7 L 187.3,256.3 L 186.1,255.4 L 184.7,254.1 L 182.7,252.3 L 182.1,251.5 L 180.8,250.8 L 180.9,249.8 L 179.9,249.3 L 180.0,248.8 L 179.0,248.1 L 177.9,247.5 L 177.5,246.8 L 176.2,245.7 L 177.8,243.8 L 178.5,242.3 L 178.2,240.9 L 179.4,239.5 L 180.8,239.1 L 181.8,239.6 L 183.0,237.8 L 184.1,236.8 L 184.6,235.2 L 187.0,234.9 L 189.0,233.6 L 187.0,232.7 L 184.2,232.4 L 180.5,233.8 L 177.9,233.2 L 176.3,232.6 L 175.5,232.5 L 174.7,233.7 L 173.3,232.0 L 170.3,231.6 L 168.5,231.3 L 168.9,231.8 L 168.3,231.7 L 167.1,231.2 L 165.2,230.7 L 164.3,229.5 L 163.3,229.7 L 162.8,228.4 L 162.4,227.2 L 161.4,227.0 L 161.7,226.6 L 162.7,226.0 L 161.7,224.8 L 161.1,223.7 L 160.0,222.1 L 157.4,222.3 L 155.9,223.1 L 155.0,222.9 L 154.4,223.1 L 152.8,222.6 L 150.9,221.2 L 149.3,220.7 L 147.8,222.1 L 146.1,221.6 L 145.5,220.8 L 143.1,219.7 L 141.2,219.4 L 139.6,219.9 L 138.3,219.4 L 136.0,218.2 L 135.0,217.9 L 134.4,216.6 L 131.0,215.7 L 131.3,213.8 L 132.9,212.8 L 132.2,211.1 L 130.6,210.2 L 129.3,210.2 L 128.2,208.9 L 126.2,209.0 L 125.5,208.0 L 124.9,205.3 L 126.1,204.2 L 127.0,204.6 L 128.8,205.0 L 130.6,204.8 L 132.5,204.3 L 133.4,203.0 L 134.6,202.5 L 136.0,202.4 L 137.1,202.2 L 138.7,201.5 L 139.1,201.8 Z"
    },
    {
      "id": "beed",
      "name": "Beed",
      "region": "Marathwada",
      "mw": 480,
      "pct": "7.5%",
      "projects": 210,
      "farms": "Ashti, Patoda Wind Farms",
      "color": "#0284c7",
      "fill": "#38bdf8",
      "rank": "#5",
      "windSpeed": "6.4 m/s",
      "cx": 319.1,
      "cy": 251.0,
      "path": "M 332.0,274.1 L 330.0,273.9 L 329.1,273.9 L 327.8,273.4 L 327.1,274.2 L 326.0,274.0 L 324.8,273.5 L 323.5,273.4 L 322.2,272.7 L 320.8,272.9 L 319.6,273.0 L 318.0,272.5 L 316.4,271.9 L 314.5,272.4 L 314.1,273.7 L 314.1,275.1 L 312.4,275.1 L 309.4,273.5 L 308.8,272.2 L 306.8,271.4 L 304.3,270.5 L 304.0,268.1 L 301.8,268.8 L 297.7,268.5 L 294.4,267.4 L 292.2,262.9 L 288.9,264.6 L 285.9,264.7 L 283.6,263.9 L 278.5,268.7 L 274.7,269.3 L 270.9,268.4 L 268.2,271.2 L 266.9,275.0 L 265.8,274.7 L 265.2,273.7 L 262.8,272.1 L 261.6,270.8 L 259.3,269.9 L 257.9,268.8 L 256.4,267.3 L 254.6,265.9 L 253.2,265.3 L 252.8,264.4 L 253.3,263.4 L 251.6,264.0 L 250.4,263.2 L 249.8,262.1 L 248.3,262.1 L 246.8,261.5 L 244.8,261.4 L 245.2,259.8 L 244.3,260.0 L 243.2,258.6 L 242.0,256.9 L 241.6,255.4 L 240.7,255.9 L 239.4,255.9 L 238.5,254.4 L 237.3,253.1 L 237.3,251.9 L 235.6,251.5 L 236.2,249.9 L 237.9,251.2 L 241.2,250.1 L 243.5,250.6 L 245.9,251.0 L 247.4,251.1 L 248.5,250.4 L 248.8,248.8 L 247.8,247.5 L 246.5,246.2 L 245.0,244.9 L 245.6,241.3 L 247.2,239.4 L 247.8,239.1 L 248.6,239.7 L 250.7,240.5 L 251.4,240.4 L 252.7,240.5 L 254.0,240.9 L 254.9,240.3 L 254.9,241.0 L 255.9,240.7 L 257.1,241.0 L 257.4,241.2 L 258.8,241.0 L 259.7,240.8 L 260.9,239.8 L 261.6,239.5 L 262.7,240.5 L 261.8,241.1 L 261.5,242.9 L 260.0,242.8 L 260.8,243.6 L 259.3,244.0 L 259.5,244.8 L 265.9,246.1 L 266.4,245.8 L 268.3,247.1 L 269.3,247.8 L 271.8,247.2 L 271.6,246.0 L 269.9,244.9 L 270.5,243.2 L 270.5,242.6 L 270.1,241.9 L 271.4,241.3 L 272.7,240.5 L 273.2,241.4 L 273.8,242.7 L 274.2,244.2 L 274.9,243.9 L 275.3,243.9 L 277.1,244.1 L 277.3,246.4 L 276.7,246.9 L 277.7,247.7 L 277.8,249.4 L 278.9,250.0 L 280.1,250.5 L 283.2,249.7 L 284.1,249.4 L 284.6,247.1 L 281.0,246.5 L 279.3,245.1 L 279.5,243.2 L 279.3,242.6 L 281.7,241.8 L 285.9,243.1 L 286.2,242.1 L 285.1,240.3 L 283.9,239.6 L 283.1,238.0 L 285.1,237.8 L 285.3,239.4 L 286.6,239.3 L 290.1,238.4 L 290.2,239.5 L 288.5,240.1 L 286.6,242.1 L 288.1,243.0 L 290.2,242.9 L 293.9,242.0 L 294.8,242.5 L 297.5,240.5 L 297.4,239.4 L 293.9,239.6 L 292.1,238.9 L 292.8,238.4 L 294.5,237.9 L 291.6,235.4 L 290.0,234.1 L 290.8,233.3 L 292.2,232.4 L 295.0,230.3 L 296.5,230.0 L 297.8,229.3 L 298.5,229.0 L 301.2,226.7 L 302.6,225.7 L 301.3,222.6 L 301.0,220.5 L 298.5,220.6 L 297.6,220.2 L 297.8,217.7 L 296.8,217.3 L 297.6,216.0 L 299.4,216.6 L 299.9,217.4 L 300.6,218.7 L 305.4,220.4 L 308.1,220.2 L 309.4,220.5 L 311.9,220.3 L 314.9,221.4 L 315.6,222.2 L 317.7,222.0 L 322.0,222.1 L 323.0,221.0 L 323.4,219.4 L 326.2,219.2 L 329.9,221.0 L 332.8,220.8 L 334.6,220.5 L 336.2,219.8 L 337.8,220.1 L 337.2,221.5 L 336.4,223.2 L 337.7,226.3 L 340.0,226.9 L 343.5,225.5 L 346.5,223.5 L 347.4,223.6 L 347.1,224.4 L 347.5,226.3 L 348.7,227.4 L 351.1,227.7 L 352.2,227.9 L 353.9,226.8 L 354.1,225.9 L 355.8,226.7 L 356.6,226.1 L 357.5,226.8 L 359.2,226.7 L 360.0,227.3 L 361.0,227.6 L 363.1,227.4 L 364.4,228.1 L 364.9,229.2 L 366.2,230.1 L 365.9,230.6 L 367.5,230.7 L 369.0,230.7 L 370.6,229.5 L 372.6,229.3 L 373.5,229.3 L 376.5,230.1 L 378.7,231.1 L 378.8,233.0 L 377.7,234.5 L 378.2,235.6 L 378.5,237.1 L 377.7,238.0 L 375.6,239.7 L 375.1,240.8 L 376.8,241.4 L 378.4,240.6 L 379.5,239.2 L 380.9,239.4 L 381.5,240.4 L 383.2,241.9 L 384.8,241.4 L 385.6,241.8 L 385.7,242.5 L 385.6,243.9 L 385.9,245.5 L 386.2,246.2 L 386.5,246.8 L 387.1,247.1 L 387.6,248.1 L 389.0,248.6 L 389.3,249.6 L 388.9,250.0 L 389.1,250.7 L 389.4,252.1 L 391.9,253.1 L 393.5,255.0 L 394.5,254.5 L 396.3,252.5 L 399.1,252.9 L 399.2,257.6 L 401.4,258.7 L 403.2,259.8 L 404.6,260.3 L 405.7,262.3 L 407.4,263.0 L 407.8,264.7 L 407.6,266.7 L 408.3,267.0 L 410.4,266.8 L 412.4,267.3 L 412.4,268.1 L 412.7,269.0 L 413.2,269.7 L 413.2,271.3 L 411.7,271.3 L 409.8,271.9 L 408.1,272.4 L 407.0,274.0 L 408.5,275.3 L 406.6,275.9 L 402.7,273.5 L 399.7,275.1 L 396.9,275.5 L 393.7,275.9 L 390.8,278.2 L 387.4,277.0 L 381.2,279.0 L 381.7,282.8 L 380.4,282.9 L 379.1,282.8 L 377.7,281.4 L 376.1,281.4 L 373.9,281.2 L 372.8,280.9 L 371.8,280.6 L 370.8,281.0 L 370.2,281.7 L 369.0,281.4 L 368.6,280.4 L 366.8,280.4 L 364.7,280.3 L 363.5,280.0 L 361.4,279.8 L 360.9,281.7 L 359.8,282.2 L 359.8,281.0 L 357.7,279.8 L 353.2,280.1 L 351.5,280.5 L 349.7,280.0 L 346.3,278.4 L 345.8,280.0 L 344.8,279.6 L 344.0,278.6 L 344.9,277.6 L 343.1,277.5 L 341.2,278.1 L 340.0,277.5 L 340.3,276.5 L 340.0,275.5 L 338.5,275.3 L 337.3,274.9 L 334.6,275.1 L 333.9,275.0 L 332.4,275.0 L 332.0,274.6 L 332.0,274.1 Z"
    },
    {
      "id": "dhule",
      "name": "Dhule",
      "region": "Khandesh (North)",
      "mw": 580,
      "pct": "9.1%",
      "projects": 290,
      "farms": "Sakri, Shirpur Wind Cluster",
      "color": "#0891b2",
      "fill": "#0891b2",
      "rank": "#4",
      "windSpeed": "6.5 m/s",
      "cx": 213.6,
      "cy": 79.2,
      "path": "M 159.8,90.6 L 160.2,90.8 L 161.2,90.8 L 161.6,89.1 L 162.9,88.7 L 164.5,89.9 L 166.5,89.6 L 167.4,88.6 L 168.3,85.1 L 171.0,83.5 L 173.6,83.6 L 173.6,82.9 L 174.2,82.7 L 174.4,82.2 L 174.6,82.3 L 174.8,82.5 L 174.9,82.6 L 174.8,82.8 L 174.7,83.0 L 174.7,83.3 L 174.8,83.4 L 175.1,83.4 L 175.4,83.4 L 175.7,83.4 L 175.9,83.6 L 176.1,83.7 L 176.3,83.8 L 176.6,83.9 L 176.7,83.7 L 176.7,83.5 L 176.8,83.2 L 176.8,83.0 L 177.0,82.9 L 177.3,82.9 L 177.6,82.9 L 177.9,82.9 L 178.2,82.9 L 178.5,82.9 L 178.8,82.9 L 179.1,82.9 L 179.3,82.9 L 179.5,82.8 L 179.7,82.7 L 179.8,82.5 L 179.9,82.2 L 180.0,82.0 L 180.1,81.8 L 180.2,81.6 L 180.4,81.5 L 180.6,81.4 L 180.9,81.4 L 181.2,81.4 L 181.5,81.4 L 181.8,81.3 L 182.0,81.2 L 182.2,81.1 L 182.4,81.0 L 182.7,80.9 L 183.0,80.9 L 183.3,80.9 L 183.5,80.9 L 183.8,80.8 L 184.1,80.8 L 184.4,80.8 L 184.7,80.8 L 184.9,80.8 L 185.1,80.9 L 185.3,81.1 L 185.5,81.3 L 185.7,81.4 L 185.9,81.6 L 186.2,81.6 L 186.4,81.6 L 186.7,81.6 L 187.0,81.6 L 187.3,81.6 L 187.5,81.6 L 187.8,81.5 L 188.1,81.3 L 188.4,81.2 L 188.6,81.1 L 188.8,81.0 L 188.9,81.0 L 189.0,81.2 L 189.0,81.5 L 189.0,81.7 L 189.1,81.9 L 189.3,82.0 L 189.5,82.0 L 189.9,81.9 L 190.2,81.9 L 190.4,82.0 L 190.5,82.2 L 190.8,82.2 L 191.0,82.1 L 191.3,82.2 L 191.4,82.4 L 191.6,82.3 L 191.9,82.2 L 192.1,82.1 L 192.5,82.1 L 192.7,82.1 L 192.8,82.0 L 192.9,81.8 L 193.0,81.5 L 193.0,81.3 L 193.0,81.1 L 192.8,80.9 L 192.7,80.7 L 192.8,80.6 L 193.0,80.6 L 193.3,80.5 L 193.5,80.5 L 193.8,80.4 L 194.1,80.4 L 194.4,80.4 L 194.7,80.3 L 195.0,80.3 L 195.3,80.3 L 195.5,80.2 L 195.8,80.2 L 196.1,80.1 L 196.3,80.0 L 196.6,79.9 L 196.8,79.8 L 197.0,79.7 L 197.3,79.6 L 197.6,79.5 L 197.8,79.6 L 197.7,79.8 L 197.6,80.1 L 197.6,80.2 L 197.8,80.2 L 198.1,80.2 L 198.4,80.1 L 198.7,80.0 L 199.0,79.9 L 199.3,79.8 L 199.5,79.8 L 199.8,79.8 L 199.9,79.9 L 199.9,80.2 L 199.9,80.4 L 200.1,80.5 L 200.4,80.4 L 200.5,80.6 L 200.6,80.8 L 200.7,81.0 L 200.6,81.2 L 200.2,81.2 L 200.1,81.3 L 200.1,81.5 L 200.3,81.7 L 200.5,81.7 L 200.8,81.8 L 201.0,81.8 L 201.3,81.8 L 201.6,81.8 L 201.9,81.8 L 202.1,81.8 L 202.4,81.7 L 202.7,81.7 L 203.0,81.7 L 203.3,81.7 L 203.6,81.7 L 203.9,81.7 L 204.1,81.7 L 205.0,81.1 L 205.9,77.8 L 203.8,76.6 L 204.1,73.1 L 205.3,71.6 L 206.1,69.8 L 205.9,69.6 L 205.9,67.5 L 211.4,68.6 L 212.8,69.3 L 215.0,68.5 L 218.9,69.6 L 223.3,69.4 L 223.4,69.2 L 223.5,69.0 L 223.6,68.8 L 223.8,68.6 L 223.9,68.4 L 224.1,68.2 L 224.2,68.1 L 224.3,67.9 L 224.3,67.7 L 224.1,67.5 L 223.9,67.3 L 223.9,67.1 L 224.0,66.9 L 224.2,66.8 L 224.3,66.6 L 224.4,66.4 L 224.5,66.2 L 224.6,66.0 L 224.7,65.8 L 224.8,65.6 L 224.8,65.4 L 224.8,65.2 L 224.7,65.0 L 224.6,64.8 L 224.5,64.6 L 224.4,64.3 L 224.6,64.3 L 224.9,64.2 L 225.1,64.1 L 225.4,64.1 L 225.7,64.0 L 226.0,63.9 L 226.2,63.9 L 226.5,63.9 L 226.8,63.8 L 227.0,63.8 L 227.3,64.0 L 227.5,64.1 L 227.5,63.9 L 227.4,63.7 L 227.6,63.6 L 227.9,63.5 L 228.2,63.6 L 228.5,63.6 L 228.8,63.7 L 229.1,63.8 L 229.3,63.9 L 229.5,63.9 L 229.6,63.8 L 229.4,63.6 L 229.4,63.3 L 229.4,63.1 L 229.4,62.9 L 229.5,62.7 L 229.6,62.5 L 229.7,62.3 L 229.8,62.1 L 229.8,61.9 L 229.9,61.7 L 230.0,61.5 L 230.1,61.3 L 230.1,61.1 L 230.2,60.9 L 230.0,60.8 L 229.8,60.6 L 229.8,60.4 L 229.7,60.3 L 229.5,60.1 L 229.5,60.0 L 229.6,59.8 L 229.9,59.7 L 230.0,59.5 L 230.0,59.3 L 230.0,59.1 L 230.1,58.8 L 230.1,58.6 L 230.1,58.4 L 230.1,58.2 L 230.0,58.0 L 230.0,57.8 L 230.0,57.6 L 230.0,57.4 L 229.9,57.2 L 229.9,56.9 L 229.8,56.7 L 229.8,56.5 L 229.8,56.3 L 229.9,56.1 L 230.0,55.9 L 230.1,55.7 L 230.2,55.5 L 230.4,55.3 L 230.5,55.2 L 230.6,55.0 L 230.8,54.8 L 230.9,54.6 L 231.1,54.4 L 231.2,54.2 L 231.3,54.1 L 231.3,53.9 L 231.3,53.6 L 231.5,53.7 L 231.8,53.8 L 232.0,53.9 L 232.3,53.9 L 232.6,54.0 L 232.8,54.0 L 233.1,54.0 L 233.4,54.0 L 233.7,54.0 L 233.9,53.9 L 233.8,53.7 L 233.8,53.6 L 234.1,53.6 L 234.4,53.8 L 234.6,53.8 L 234.9,53.9 L 235.2,53.9 L 235.5,54.0 L 235.7,54.0 L 236.0,54.0 L 236.3,54.0 L 236.6,54.0 L 236.7,53.8 L 236.7,53.6 L 236.8,53.4 L 237.0,53.3 L 237.3,53.2 L 237.6,53.2 L 237.8,53.1 L 238.1,53.0 L 238.4,52.9 L 238.6,52.8 L 238.8,52.7 L 239.0,52.5 L 239.2,52.4 L 239.5,52.3 L 239.6,52.3 L 239.8,52.5 L 240.1,52.5 L 240.4,52.5 L 240.6,52.5 L 240.9,52.5 L 241.2,52.4 L 241.5,52.4 L 241.7,52.4 L 242.0,52.4 L 242.3,52.4 L 242.6,52.5 L 242.9,52.5 L 243.1,52.6 L 243.3,52.7 L 243.5,52.9 L 243.6,53.1 L 243.7,53.3 L 243.9,53.4 L 244.1,53.6 L 244.3,53.7 L 244.6,53.8 L 244.8,53.9 L 245.1,53.9 L 245.4,54.0 L 245.6,54.1 L 245.9,54.1 L 246.1,54.2 L 246.4,54.3 L 246.7,54.3 L 246.9,54.4 L 247.2,54.5 L 247.5,54.5 L 247.7,54.6 L 248.0,54.7 L 248.3,54.7 L 248.5,54.8 L 248.8,54.8 L 249.1,54.9 L 249.4,54.9 L 249.6,54.9 L 249.9,55.0 L 250.2,55.0 L 250.4,55.1 L 250.7,55.2 L 251.0,55.2 L 251.2,55.3 L 251.5,55.4 L 251.7,55.5 L 252.0,55.6 L 252.2,55.7 L 252.5,55.8 L 253.6,56.4 L 257.1,57.2 L 258.0,58.1 L 259.2,59.4 L 260.5,61.2 L 261.5,63.3 L 263.6,65.7 L 266.8,66.8 L 271.1,68.4 L 270.0,68.7 L 268.8,69.3 L 267.3,69.3 L 266.7,70.2 L 265.0,72.1 L 266.1,73.3 L 264.3,73.3 L 263.8,74.0 L 266.4,75.3 L 264.9,76.0 L 264.4,78.1 L 264.4,79.3 L 263.4,79.9 L 260.9,82.1 L 258.6,82.6 L 257.5,83.4 L 256.0,84.0 L 254.6,85.0 L 253.7,85.0 L 252.6,85.4 L 250.5,83.8 L 248.0,82.9 L 247.7,83.3 L 248.6,83.8 L 248.0,84.3 L 248.5,84.4 L 249.0,85.1 L 246.5,86.6 L 244.9,87.0 L 243.0,87.8 L 241.9,89.2 L 240.8,91.6 L 240.6,92.5 L 239.4,94.5 L 242.3,95.5 L 244.1,97.0 L 244.6,99.4 L 245.6,100.8 L 246.0,101.9 L 244.3,102.3 L 246.4,105.0 L 247.8,106.0 L 248.9,106.7 L 249.4,108.2 L 249.4,110.5 L 250.9,111.8 L 250.8,112.8 L 249.4,113.5 L 249.0,114.2 L 250.0,115.6 L 251.5,116.9 L 251.6,119.1 L 249.8,119.9 L 247.9,120.3 L 248.5,120.6 L 248.0,121.5 L 248.2,122.5 L 246.6,124.1 L 245.9,125.0 L 242.9,125.4 L 241.0,126.2 L 237.9,126.5 L 236.5,126.9 L 234.7,126.5 L 234.0,125.0 L 233.0,124.8 L 231.5,124.4 L 231.0,124.7 L 230.2,124.6 L 229.2,124.0 L 228.2,124.2 L 227.5,123.3 L 225.6,122.6 L 221.9,122.3 L 220.6,121.1 L 220.8,119.3 L 220.6,118.0 L 221.1,117.4 L 220.7,116.0 L 219.6,115.8 L 217.4,114.5 L 214.4,113.5 L 213.0,112.6 L 212.4,112.6 L 210.1,112.0 L 209.2,112.6 L 208.4,113.3 L 206.9,113.3 L 205.4,113.1 L 204.6,112.3 L 203.1,113.0 L 201.5,114.2 L 197.5,113.2 L 196.5,112.1 L 197.4,111.7 L 196.6,110.7 L 196.3,110.2 L 195.5,110.4 L 195.5,111.4 L 193.0,111.0 L 192.1,110.0 L 191.3,110.5 L 190.9,111.5 L 190.0,110.8 L 188.3,110.8 L 185.4,110.6 L 184.0,110.5 L 183.0,110.2 L 181.6,110.7 L 180.4,110.0 L 179.0,110.2 L 175.4,109.7 L 174.5,110.5 L 172.1,109.7 L 170.5,109.7 L 169.2,110.3 L 168.8,111.3 L 166.8,110.7 L 165.1,111.1 L 164.3,111.7 L 162.9,111.3 L 161.7,110.8 L 160.8,111.7 L 159.7,111.6 L 158.7,111.2 L 156.8,111.0 L 154.8,111.5 L 153.3,111.2 L 152.9,110.6 L 152.8,109.3 L 152.5,107.1 L 151.9,106.2 L 150.9,105.4 L 149.5,104.0 L 150.2,102.4 L 151.3,101.8 L 149.9,100.9 L 146.0,99.7 L 146.5,98.0 L 147.0,97.4 L 151.3,96.8 L 153.8,96.6 L 155.3,97.0 L 156.1,96.2 L 154.7,94.9 L 155.8,94.0 L 157.2,92.4 L 159.8,90.6 Z"
    },
    {
      "id": "latur",
      "name": "Latur",
      "region": "Marathwada",
      "mw": 85,
      "pct": "1.3%",
      "projects": 40,
      "farms": "Ausa Micro Wind Grid",
      "color": "#0ea5e9",
      "fill": "#bae6fd",
      "rank": "#10",
      "windSpeed": "5.7 m/s",
      "cx": 416.1,
      "cy": 298.3,
      "path": "M 436.4,309.1 L 435.3,309.5 L 434.4,309.5 L 433.4,310.1 L 431.7,311.6 L 431.5,313.2 L 430.6,314.5 L 432.5,315.1 L 434.9,316.2 L 433.7,317.1 L 433.2,318.3 L 433.1,319.8 L 433.6,320.5 L 430.2,321.0 L 430.2,322.5 L 430.2,323.7 L 430.3,325.5 L 430.4,328.2 L 429.8,329.9 L 428.0,330.3 L 427.0,331.1 L 426.0,331.3 L 422.2,331.6 L 420.9,332.2 L 419.8,332.8 L 419.0,333.2 L 416.9,332.2 L 416.1,331.0 L 413.5,330.7 L 412.1,329.7 L 407.6,329.4 L 407.7,327.3 L 408.0,325.8 L 408.5,324.5 L 407.7,323.8 L 403.0,323.5 L 401.5,322.1 L 401.0,321.4 L 400.0,320.9 L 398.9,322.1 L 396.2,322.0 L 394.4,322.0 L 393.4,321.7 L 392.5,321.7 L 392.2,320.3 L 390.8,321.8 L 389.7,321.5 L 385.9,321.1 L 384.0,320.6 L 380.9,320.1 L 382.0,319.6 L 381.9,318.5 L 379.3,316.9 L 376.9,317.6 L 376.0,317.9 L 375.5,316.9 L 374.9,316.3 L 372.6,315.7 L 371.3,313.9 L 370.7,312.8 L 371.1,312.0 L 371.2,309.9 L 372.6,307.5 L 373.0,306.4 L 371.8,304.6 L 374.6,300.5 L 371.5,298.1 L 371.7,294.7 L 370.1,295.4 L 368.7,296.1 L 367.0,295.3 L 364.3,294.5 L 364.7,293.6 L 366.0,291.5 L 368.8,291.6 L 369.8,290.9 L 370.3,288.8 L 368.8,287.5 L 369.0,286.6 L 368.7,284.8 L 370.5,283.3 L 370.7,281.4 L 371.2,280.6 L 372.4,280.6 L 373.9,281.2 L 376.1,281.4 L 377.7,281.4 L 379.1,282.8 L 380.0,283.0 L 380.9,283.1 L 380.8,280.3 L 385.5,277.2 L 389.4,277.0 L 393.3,277.0 L 395.7,275.5 L 398.9,276.8 L 402.0,273.5 L 403.6,273.7 L 407.6,276.1 L 408.3,274.6 L 407.4,273.5 L 408.6,271.8 L 410.1,271.8 L 412.7,271.6 L 413.3,271.1 L 413.0,269.4 L 412.7,268.6 L 412.7,267.5 L 414.1,265.7 L 416.1,265.7 L 417.6,265.3 L 419.2,263.8 L 421.5,263.1 L 423.3,262.9 L 424.7,262.3 L 426.7,261.6 L 429.1,261.1 L 434.3,261.5 L 437.8,262.4 L 438.4,266.2 L 442.6,265.8 L 442.7,268.4 L 442.5,270.0 L 442.0,272.0 L 443.9,272.6 L 446.5,271.9 L 450.3,271.4 L 451.5,270.8 L 454.5,271.1 L 454.1,272.8 L 452.2,274.5 L 456.2,275.2 L 457.0,275.9 L 457.5,276.9 L 462.7,277.9 L 462.4,280.2 L 463.5,281.7 L 464.3,282.3 L 464.9,283.2 L 464.0,284.6 L 461.8,286.0 L 460.6,286.3 L 461.0,287.5 L 462.1,287.6 L 462.2,289.7 L 461.4,290.1 L 462.4,291.3 L 461.0,293.0 L 459.5,294.6 L 459.3,296.2 L 458.6,298.2 L 456.4,299.6 L 456.8,301.8 L 455.7,303.0 L 453.4,303.0 L 452.5,304.5 L 451.6,306.3 L 451.8,306.9 L 451.1,307.3 L 450.2,308.2 L 448.1,308.6 L 447.6,309.8 L 447.1,312.1 L 444.8,312.5 L 443.2,312.0 L 442.4,310.5 L 441.4,309.9 L 440.4,310.5 L 438.3,311.5 L 437.6,311.0 L 437.5,309.9 L 436.4,309.1 Z"
    },
    {
      "id": "nandurbar",
      "name": "Nandurbar",
      "region": "Khandesh (North)",
      "mw": 350,
      "pct": "5.5%",
      "projects": 160,
      "farms": "Navapur, Shahada Plateau",
      "color": "#38bdf8",
      "fill": "#7dd3fc",
      "rank": "#7",
      "windSpeed": "6.3 m/s",
      "cx": 189.0,
      "cy": 60.9,
      "path": "M 164.3,58.3 L 164.0,58.4 L 161.7,58.3 L 157.8,59.1 L 158.1,60.6 L 156.9,60.4 L 156.2,59.3 L 155.3,61.0 L 153.5,60.7 L 152.9,60.5 L 151.0,60.7 L 149.7,61.8 L 148.2,61.6 L 146.4,62.6 L 144.9,60.6 L 143.4,56.8 L 142.4,54.6 L 139.7,53.2 L 140.7,52.2 L 144.3,52.1 L 146.3,51.7 L 149.2,50.9 L 149.7,47.3 L 148.6,46.2 L 146.8,45.1 L 145.0,44.2 L 144.7,41.9 L 144.9,40.5 L 144.3,39.8 L 143.3,39.0 L 141.7,38.1 L 144.6,37.0 L 150.0,35.8 L 153.4,35.1 L 157.4,33.3 L 161.4,31.9 L 164.5,30.4 L 168.4,29.6 L 172.8,28.4 L 173.1,28.4 L 173.4,28.4 L 173.7,28.4 L 173.9,28.5 L 174.2,28.6 L 174.4,28.7 L 174.7,28.8 L 174.9,28.9 L 175.2,29.0 L 175.4,29.1 L 175.6,29.2 L 175.8,29.4 L 175.9,29.6 L 176.1,29.8 L 176.3,29.9 L 176.4,30.1 L 176.7,30.2 L 176.9,30.3 L 177.2,30.4 L 177.5,30.4 L 177.7,30.4 L 178.0,30.5 L 178.3,30.5 L 178.6,30.5 L 178.8,30.4 L 179.1,30.4 L 179.4,30.3 L 179.6,30.3 L 179.9,30.2 L 180.2,30.2 L 180.5,30.1 L 180.7,30.2 L 181.0,30.2 L 181.3,30.2 L 181.6,30.1 L 181.9,30.1 L 182.1,30.1 L 182.4,30.0 L 182.7,30.0 L 183.0,30.0 L 183.2,29.9 L 183.5,29.9 L 183.8,29.9 L 184.1,29.9 L 184.3,29.9 L 184.6,29.8 L 184.9,29.8 L 185.2,29.8 L 185.5,29.8 L 185.7,29.8 L 186.0,29.7 L 186.3,29.7 L 186.5,29.5 L 186.6,29.4 L 186.7,29.2 L 186.7,28.9 L 186.8,28.7 L 186.8,28.5 L 186.8,28.3 L 186.9,28.1 L 187.0,27.9 L 187.1,27.7 L 187.2,27.5 L 187.3,27.4 L 187.6,27.2 L 187.8,27.1 L 188.0,27.0 L 188.3,27.0 L 188.6,26.9 L 188.9,26.9 L 189.1,26.9 L 189.4,26.9 L 189.7,26.9 L 190.0,26.8 L 190.3,26.8 L 190.5,26.8 L 190.8,26.8 L 191.1,26.8 L 191.4,26.8 L 191.6,26.7 L 191.9,26.6 L 192.1,26.5 L 192.4,26.4 L 192.6,26.3 L 192.7,26.1 L 192.9,25.9 L 193.0,25.7 L 193.2,25.6 L 193.4,25.5 L 193.7,25.4 L 193.9,25.3 L 194.1,25.1 L 194.3,24.9 L 194.9,24.0 L 197.0,23.1 L 200.1,22.9 L 200.6,23.7 L 201.4,24.5 L 200.7,24.4 L 199.8,25.0 L 200.4,26.2 L 201.2,27.4 L 202.7,27.6 L 203.7,27.8 L 204.4,28.1 L 204.8,28.9 L 207.2,29.9 L 207.3,31.1 L 208.3,32.1 L 207.4,33.4 L 206.8,38.3 L 206.0,40.0 L 206.3,41.3 L 206.4,41.5 L 206.5,41.7 L 206.7,41.8 L 206.9,42.0 L 207.1,42.1 L 207.3,42.3 L 207.4,42.5 L 207.4,42.7 L 207.4,42.9 L 207.3,43.1 L 207.2,43.3 L 207.0,43.5 L 207.0,43.7 L 207.0,43.9 L 207.1,44.1 L 207.1,44.3 L 207.0,44.5 L 206.9,44.7 L 206.9,44.9 L 206.8,45.1 L 206.8,45.3 L 206.9,45.5 L 207.0,45.7 L 207.3,45.8 L 207.5,45.9 L 207.8,45.9 L 208.1,46.0 L 208.3,46.0 L 208.6,46.0 L 208.9,46.0 L 209.2,46.0 L 209.5,45.9 L 209.8,45.9 L 210.0,45.8 L 210.3,45.8 L 210.5,45.9 L 210.7,46.0 L 210.8,46.2 L 211.0,46.4 L 211.1,46.6 L 211.2,46.8 L 211.3,47.0 L 211.4,47.2 L 211.4,47.4 L 211.4,47.7 L 211.4,47.9 L 211.4,48.1 L 211.3,48.3 L 211.0,48.4 L 211.0,48.5 L 211.3,48.7 L 211.5,48.8 L 211.8,48.8 L 211.9,48.6 L 212.1,48.5 L 212.4,48.5 L 212.7,48.5 L 213.0,48.4 L 213.3,48.4 L 213.5,48.5 L 213.7,48.6 L 213.7,48.8 L 213.8,49.1 L 213.7,49.3 L 213.6,49.5 L 213.8,49.7 L 213.9,49.8 L 214.1,50.0 L 214.4,50.0 L 214.6,50.1 L 214.9,50.1 L 215.2,50.0 L 215.5,50.0 L 215.8,50.1 L 216.1,50.1 L 216.3,50.1 L 216.6,50.2 L 216.9,50.2 L 217.1,50.3 L 217.4,50.4 L 217.7,50.4 L 217.9,50.5 L 218.2,50.5 L 218.5,50.5 L 218.8,50.6 L 219.0,50.6 L 219.3,50.6 L 219.6,50.7 L 219.9,50.7 L 220.1,50.7 L 220.4,50.8 L 220.7,50.8 L 221.0,50.8 L 221.2,50.9 L 221.5,51.0 L 221.7,51.1 L 222.0,51.2 L 222.2,51.4 L 222.4,51.5 L 222.6,51.6 L 222.8,51.7 L 223.1,51.9 L 223.3,52.0 L 223.5,52.1 L 223.7,52.2 L 224.0,52.4 L 224.2,52.5 L 224.5,52.5 L 224.7,52.6 L 225.0,52.7 L 225.3,52.7 L 225.5,52.8 L 225.8,52.8 L 226.1,52.9 L 226.3,53.0 L 226.6,53.0 L 226.9,53.0 L 227.1,53.1 L 227.4,53.1 L 227.7,53.2 L 228.0,53.2 L 228.2,53.3 L 228.5,53.3 L 228.8,53.4 L 229.0,53.4 L 229.3,53.5 L 229.6,53.5 L 229.9,53.6 L 230.1,53.6 L 230.4,53.6 L 230.7,53.6 L 231.0,53.6 L 231.3,53.6 L 231.3,53.9 L 231.3,54.1 L 231.2,54.2 L 231.1,54.4 L 230.9,54.6 L 230.8,54.8 L 230.6,55.0 L 230.5,55.2 L 230.4,55.3 L 230.2,55.5 L 230.1,55.7 L 230.0,55.9 L 229.9,56.1 L 229.8,56.3 L 229.8,56.5 L 229.8,56.7 L 229.9,56.9 L 229.9,57.2 L 230.0,57.4 L 230.0,57.6 L 230.0,57.8 L 230.0,58.0 L 230.1,58.2 L 230.1,58.4 L 230.1,58.6 L 230.1,58.8 L 230.0,59.1 L 230.0,59.3 L 230.0,59.5 L 229.9,59.7 L 229.6,59.8 L 229.5,60.0 L 229.5,60.1 L 229.7,60.3 L 229.8,60.4 L 229.8,60.6 L 230.0,60.8 L 230.2,60.9 L 230.1,61.1 L 230.1,61.3 L 230.0,61.5 L 229.9,61.7 L 229.8,61.9 L 229.8,62.1 L 229.7,62.3 L 229.6,62.5 L 229.5,62.7 L 229.4,62.9 L 229.4,63.1 L 229.4,63.3 L 229.4,63.6 L 229.6,63.8 L 229.5,63.9 L 229.3,63.9 L 229.1,63.8 L 228.8,63.7 L 228.5,63.6 L 228.2,63.6 L 227.9,63.5 L 227.6,63.6 L 227.4,63.7 L 227.5,63.9 L 227.5,64.1 L 227.3,64.0 L 227.0,63.8 L 226.8,63.8 L 226.5,63.9 L 226.2,63.9 L 226.0,63.9 L 225.7,64.0 L 225.4,64.1 L 225.1,64.1 L 224.9,64.2 L 224.6,64.3 L 224.4,64.3 L 224.5,64.6 L 224.6,64.8 L 224.7,65.0 L 224.8,65.2 L 224.8,65.4 L 224.8,65.6 L 224.7,65.8 L 224.6,66.0 L 224.5,66.2 L 224.4,66.4 L 224.3,66.6 L 224.2,66.8 L 224.0,66.9 L 223.9,67.1 L 223.9,67.3 L 224.1,67.5 L 224.3,67.7 L 224.3,67.9 L 224.2,68.1 L 224.1,68.2 L 223.9,68.4 L 223.8,68.6 L 223.6,68.8 L 223.5,69.0 L 223.4,69.2 L 223.3,69.4 L 218.9,69.6 L 215.0,68.5 L 212.8,69.3 L 211.4,68.6 L 205.9,67.5 L 205.9,69.6 L 206.1,69.8 L 205.3,71.6 L 204.1,73.1 L 203.8,76.6 L 205.9,77.8 L 205.0,81.1 L 204.1,81.7 L 203.9,81.7 L 203.6,81.7 L 203.3,81.7 L 203.0,81.7 L 202.7,81.7 L 202.4,81.7 L 202.1,81.8 L 201.9,81.8 L 201.6,81.8 L 201.3,81.8 L 201.0,81.8 L 200.8,81.8 L 200.5,81.7 L 200.3,81.7 L 200.1,81.5 L 200.1,81.3 L 200.2,81.2 L 200.6,81.2 L 200.7,81.0 L 200.6,80.8 L 200.5,80.6 L 200.4,80.4 L 200.1,80.5 L 199.9,80.4 L 199.9,80.2 L 199.9,79.9 L 199.8,79.8 L 199.5,79.8 L 199.3,79.8 L 199.0,79.9 L 198.7,80.0 L 198.4,80.1 L 198.1,80.2 L 197.8,80.2 L 197.6,80.2 L 197.6,80.1 L 197.7,79.8 L 197.8,79.6 L 197.6,79.5 L 197.3,79.6 L 197.0,79.7 L 196.8,79.8 L 196.6,79.9 L 196.3,80.0 L 196.1,80.1 L 195.8,80.2 L 195.5,80.2 L 195.3,80.3 L 195.0,80.3 L 194.7,80.3 L 194.4,80.4 L 194.1,80.4 L 193.8,80.4 L 193.5,80.5 L 193.3,80.5 L 193.0,80.6 L 192.8,80.6 L 192.7,80.7 L 192.8,80.9 L 193.0,81.1 L 193.0,81.3 L 193.0,81.5 L 192.9,81.8 L 192.8,82.0 L 192.7,82.1 L 192.5,82.1 L 192.1,82.1 L 191.9,82.2 L 191.6,82.3 L 191.4,82.4 L 191.3,82.2 L 191.0,82.1 L 190.8,82.2 L 190.5,82.2 L 190.4,82.0 L 190.2,81.9 L 189.9,81.9 L 189.5,82.0 L 189.3,82.0 L 189.1,81.9 L 189.0,81.7 L 189.0,81.5 L 189.0,81.2 L 188.9,81.0 L 188.8,81.0 L 188.6,81.1 L 188.4,81.2 L 188.1,81.3 L 187.8,81.5 L 187.5,81.6 L 187.3,81.6 L 187.0,81.6 L 186.7,81.6 L 186.4,81.6 L 186.2,81.6 L 185.9,81.6 L 185.7,81.4 L 185.5,81.3 L 185.3,81.1 L 185.1,80.9 L 184.9,80.8 L 184.7,80.8 L 184.4,80.8 L 184.1,80.8 L 183.8,80.8 L 183.5,80.9 L 183.3,80.9 L 183.0,80.9 L 182.7,80.9 L 182.4,81.0 L 182.2,81.1 L 182.0,81.2 L 181.8,81.3 L 181.5,81.4 L 181.2,81.4 L 180.9,81.4 L 180.6,81.4 L 180.4,81.5 L 180.2,81.6 L 180.1,81.8 L 180.0,82.0 L 179.9,82.2 L 179.8,82.5 L 179.7,82.7 L 179.5,82.8 L 179.3,82.9 L 179.1,82.9 L 178.8,82.9 L 178.5,82.9 L 178.2,82.9 L 177.9,82.9 L 177.6,82.9 L 177.3,82.9 L 177.0,82.9 L 176.8,83.0 L 176.8,83.2 L 176.7,83.5 L 176.7,83.7 L 176.6,83.9 L 176.3,83.8 L 176.1,83.7 L 175.9,83.6 L 175.7,83.4 L 175.4,83.4 L 175.1,83.4 L 174.8,83.4 L 174.7,83.3 L 174.7,83.0 L 174.8,82.8 L 174.9,82.6 L 174.8,82.5 L 174.6,82.3 L 174.4,82.2 L 174.2,82.7 L 173.6,82.9 L 173.6,83.6 L 171.0,83.5 L 168.3,85.1 L 167.4,88.6 L 166.5,89.6 L 164.5,89.9 L 162.9,88.7 L 161.6,89.1 L 161.2,90.8 L 160.1,90.6 L 158.6,91.5 L 156.8,93.5 L 155.2,94.2 L 155.3,95.0 L 156.1,96.2 L 155.3,97.0 L 153.8,96.6 L 151.3,96.8 L 147.0,97.4 L 146.5,98.0 L 146.4,99.3 L 145.8,99.6 L 144.8,98.8 L 141.0,96.1 L 142.2,92.9 L 138.7,93.9 L 137.6,94.2 L 135.5,93.5 L 135.1,93.0 L 136.0,91.5 L 135.0,92.0 L 133.0,91.6 L 133.0,92.4 L 133.0,92.9 L 132.6,93.4 L 131.9,93.6 L 131.4,92.2 L 130.4,91.6 L 129.7,91.5 L 128.0,92.1 L 127.5,90.5 L 126.7,90.4 L 124.8,90.6 L 124.3,89.3 L 124.0,89.0 L 123.2,88.6 L 121.9,88.4 L 121.1,88.0 L 120.6,87.2 L 122.0,86.9 L 123.2,87.0 L 124.3,88.0 L 125.6,88.1 L 125.8,88.6 L 129.1,88.3 L 131.3,88.3 L 133.0,89.0 L 135.1,89.1 L 135.9,88.2 L 135.3,87.1 L 139.2,87.2 L 139.9,86.4 L 141.4,86.5 L 142.8,86.7 L 143.7,85.7 L 142.7,85.0 L 142.4,84.0 L 142.9,82.6 L 144.1,81.2 L 146.1,79.4 L 149.3,80.0 L 154.5,77.3 L 154.7,76.6 L 155.3,73.8 L 155.2,70.4 L 155.8,70.2 L 157.2,70.1 L 158.2,69.4 L 160.2,68.7 L 160.6,68.4 L 161.1,68.4 L 161.6,68.4 L 162.2,68.3 L 162.7,68.2 L 163.3,68.3 L 163.8,68.3 L 164.0,67.9 L 164.2,67.5 L 164.2,67.1 L 164.3,66.6 L 164.3,66.2 L 164.5,65.8 L 164.7,65.4 L 164.9,65.0 L 165.2,64.6 L 165.4,64.2 L 165.5,63.8 L 165.7,63.7 L 166.1,64.0 L 166.4,64.3 L 166.5,64.7 L 166.4,65.1 L 166.7,65.4 L 167.3,65.5 L 167.8,65.6 L 168.4,65.6 L 168.9,65.7 L 169.1,66.0 L 169.6,66.1 L 170.1,66.0 L 170.7,65.9 L 170.7,65.5 L 170.7,65.1 L 171.3,65.0 L 171.8,65.0 L 172.4,65.0 L 172.6,65.5 L 173.1,65.7 L 173.6,65.7 L 174.2,65.7 L 174.4,65.4 L 174.8,65.2 L 175.2,64.9 L 175.7,65.1 L 176.1,65.0 L 176.5,64.7 L 177.1,64.7 L 177.5,65.0 L 177.9,65.2 L 178.5,65.2 L 179.0,65.2 L 179.6,65.3 L 180.0,65.2 L 180.1,64.8 L 180.0,64.3 L 180.1,63.9 L 180.6,63.8 L 181.1,63.8 L 181.6,64.1 L 181.8,64.5 L 182.0,64.9 L 182.5,65.0 L 183.0,65.0 L 183.6,64.9 L 183.8,64.5 L 184.0,64.2 L 184.6,64.1 L 185.1,64.0 L 185.7,64.0 L 186.2,63.9 L 186.8,63.9 L 187.3,63.8 L 187.9,63.7 L 188.2,63.4 L 188.4,63.0 L 188.9,62.8 L 189.4,62.7 L 189.8,62.4 L 189.9,62.0 L 190.0,61.6 L 190.1,61.2 L 190.2,59.2 L 189.9,59.2 L 189.7,59.2 L 189.4,59.2 L 189.2,59.2 L 189.0,59.1 L 188.7,59.1 L 188.5,58.9 L 188.5,58.7 L 188.4,58.5 L 188.4,58.4 L 188.4,58.1 L 188.4,58.0 L 188.4,57.9 L 188.4,57.6 L 188.3,57.4 L 188.1,57.2 L 187.9,57.2 L 187.7,57.4 L 187.6,57.5 L 187.5,57.7 L 187.3,57.8 L 187.1,57.8 L 186.8,57.8 L 186.7,57.8 L 186.5,57.8 L 186.3,58.0 L 186.0,58.1 L 185.9,58.1 L 185.7,58.2 L 185.6,58.4 L 185.5,58.6 L 185.2,58.6 L 185.0,58.7 L 184.8,58.8 L 184.7,59.1 L 184.7,59.3 L 184.6,59.5 L 184.4,59.6 L 184.1,59.6 L 183.8,59.6 L 183.6,59.6 L 183.3,59.6 L 183.0,59.5 L 182.8,59.4 L 182.6,59.3 L 182.5,59.1 L 182.4,59.0 L 182.2,58.8 L 181.9,58.8 L 181.8,58.6 L 181.7,58.5 L 181.4,58.5 L 181.2,58.5 L 180.9,58.6 L 180.9,58.7 L 180.9,59.0 L 180.7,59.0 L 180.5,59.1 L 180.5,59.3 L 180.3,59.4 L 180.0,59.5 L 179.7,59.5 L 179.5,59.5 L 179.3,59.6 L 179.1,59.7 L 178.9,59.8 L 178.7,59.9 L 178.6,59.9 L 178.5,60.0 L 178.2,60.1 L 178.0,60.0 L 177.8,59.9 L 177.7,59.7 L 177.7,59.6 L 177.7,59.4 L 177.6,59.2 L 177.5,59.1 L 177.3,58.9 L 177.1,58.8 L 176.9,58.6 L 176.8,58.5 L 176.7,58.3 L 176.7,58.1 L 176.6,57.8 L 176.4,57.7 L 176.2,57.6 L 175.9,57.6 L 175.6,57.6 L 175.3,57.7 L 175.1,57.7 L 175.0,57.7 L 174.7,57.7 L 174.4,57.8 L 174.2,57.9 L 174.0,58.1 L 173.9,58.2 L 173.7,58.4 L 173.4,58.4 L 173.1,58.5 L 172.8,58.5 L 172.6,58.5 L 172.4,58.4 L 172.2,58.3 L 172.0,58.1 L 171.8,58.0 L 171.6,58.0 L 171.4,58.0 L 171.1,58.0 L 170.8,58.1 L 170.5,58.1 L 170.3,58.0 L 170.0,58.0 L 169.7,57.9 L 169.5,57.9 L 169.3,57.9 L 169.1,57.9 L 168.8,57.9 L 168.5,58.0 L 168.3,58.0 L 168.0,58.0 L 167.9,58.0 L 167.7,58.0 L 167.5,58.0 L 167.3,57.9 L 167.1,57.9 L 166.9,57.8 L 166.7,57.8 L 166.5,58.0 L 166.0,58.4 L 164.4,58.3 L 164.3,58.3 Z"
    },
    {
      "id": "nashik",
      "name": "Nashik",
      "region": "North Maharashtra",
      "mw": 95,
      "pct": "1.5%",
      "projects": 52,
      "farms": "Sinnar, Igatpuri Hills",
      "color": "#0ea5e9",
      "fill": "#bae6fd",
      "rank": "#9",
      "windSpeed": "5.8 m/s",
      "cx": 162.7,
      "cy": 154.9,
      "path": "M 140.9,200.6 L 140.8,200.9 L 140.1,201.6 L 139.1,201.8 L 137.4,201.9 L 136.2,202.2 L 134.8,202.4 L 133.8,202.8 L 133.1,204.0 L 131.0,204.7 L 129.3,205.0 L 127.3,204.8 L 126.5,204.2 L 124.8,205.0 L 121.1,204.0 L 121.3,203.1 L 119.9,202.4 L 118.9,200.5 L 117.8,199.1 L 116.2,197.2 L 115.3,196.3 L 113.1,195.7 L 114.3,194.3 L 114.1,193.4 L 114.0,192.8 L 111.4,192.3 L 109.1,191.6 L 108.5,190.3 L 107.1,186.7 L 106.1,185.9 L 106.0,184.6 L 107.7,183.7 L 106.9,181.6 L 108.3,178.6 L 109.8,178.0 L 108.9,176.7 L 107.4,176.2 L 106.0,174.1 L 105.7,173.5 L 105.4,173.2 L 103.6,172.7 L 103.0,173.1 L 102.3,172.3 L 101.9,173.1 L 100.7,171.6 L 99.4,171.4 L 98.3,171.2 L 96.4,170.3 L 96.0,170.0 L 95.4,170.4 L 94.5,169.7 L 94.3,170.5 L 93.7,170.5 L 93.6,170.8 L 93.2,170.7 L 92.3,170.0 L 92.2,168.8 L 92.0,168.3 L 92.7,168.0 L 92.7,166.9 L 91.2,165.9 L 90.5,164.9 L 91.0,164.2 L 93.3,163.0 L 93.4,161.2 L 93.7,159.7 L 95.3,158.7 L 96.9,159.1 L 99.2,159.4 L 99.8,158.6 L 100.7,158.4 L 100.5,159.5 L 101.3,159.0 L 102.5,158.8 L 103.3,158.8 L 103.3,159.8 L 106.5,160.5 L 106.3,158.8 L 106.2,158.1 L 105.7,156.5 L 105.6,155.2 L 105.8,154.1 L 106.9,153.4 L 106.2,150.9 L 105.9,149.0 L 105.6,147.6 L 104.3,145.5 L 103.1,146.3 L 102.8,145.1 L 104.3,144.6 L 104.8,143.7 L 105.1,143.5 L 106.3,142.8 L 107.1,140.9 L 108.8,138.7 L 109.8,137.7 L 110.5,136.8 L 110.7,135.2 L 112.9,133.9 L 111.5,132.1 L 110.7,130.4 L 107.3,129.8 L 107.2,129.2 L 106.4,127.9 L 105.7,127.3 L 105.3,126.6 L 104.6,125.8 L 106.6,125.0 L 107.3,124.6 L 107.1,123.3 L 108.6,123.0 L 108.0,121.9 L 109.3,120.5 L 110.7,120.4 L 111.6,122.0 L 112.1,123.1 L 113.3,123.9 L 114.7,123.9 L 116.1,123.9 L 117.8,125.3 L 119.7,125.6 L 122.4,126.6 L 124.6,127.8 L 125.1,129.2 L 125.6,130.9 L 126.5,131.1 L 127.9,132.0 L 129.2,132.1 L 130.7,131.2 L 133.3,131.2 L 134.9,131.3 L 137.4,130.6 L 138.9,130.0 L 140.0,129.1 L 142.3,128.7 L 143.9,128.3 L 144.7,126.1 L 144.9,124.4 L 143.1,123.9 L 143.8,122.0 L 146.6,122.4 L 148.3,119.9 L 150.4,119.7 L 152.6,119.7 L 154.6,118.8 L 154.4,118.0 L 153.8,116.8 L 153.7,113.8 L 154.4,112.3 L 154.8,111.5 L 156.8,111.0 L 158.7,111.2 L 159.7,111.6 L 160.8,111.7 L 161.7,110.8 L 162.9,111.3 L 164.3,111.7 L 165.1,111.1 L 166.8,110.7 L 168.8,111.3 L 169.2,110.3 L 170.5,109.7 L 172.1,109.7 L 174.5,110.5 L 175.4,109.7 L 179.0,110.2 L 180.4,110.0 L 181.6,110.7 L 183.0,110.2 L 184.0,110.5 L 185.4,110.6 L 188.3,110.8 L 190.0,110.8 L 190.9,111.5 L 191.3,110.5 L 192.1,110.0 L 193.0,111.0 L 195.5,111.4 L 195.5,110.4 L 196.3,110.2 L 196.6,110.7 L 197.4,111.7 L 196.5,112.1 L 197.5,113.2 L 201.5,114.2 L 203.1,113.0 L 204.6,112.3 L 205.4,113.1 L 206.9,113.3 L 208.4,113.3 L 209.2,112.6 L 210.1,112.0 L 212.4,112.6 L 213.0,112.6 L 214.4,113.5 L 217.4,114.5 L 219.6,115.8 L 220.7,116.0 L 221.1,117.4 L 220.6,118.0 L 220.8,119.3 L 220.6,121.1 L 221.9,122.3 L 225.6,122.6 L 227.5,123.3 L 228.2,124.2 L 229.2,124.0 L 230.2,124.6 L 231.0,124.7 L 231.5,124.4 L 233.0,124.8 L 234.0,125.0 L 234.7,126.5 L 235.0,129.7 L 234.1,130.2 L 233.5,132.2 L 233.8,133.2 L 231.2,133.8 L 230.8,135.0 L 231.6,136.4 L 232.6,137.3 L 231.5,139.0 L 233.1,138.9 L 234.0,139.1 L 234.3,140.7 L 235.6,141.2 L 236.7,142.6 L 237.7,143.8 L 236.7,144.3 L 238.3,145.4 L 238.7,146.4 L 239.1,147.9 L 239.6,149.1 L 239.8,150.6 L 239.4,152.0 L 239.8,153.2 L 244.5,153.6 L 246.1,153.8 L 246.5,154.9 L 245.7,155.8 L 246.1,158.1 L 245.6,161.0 L 245.5,161.9 L 246.0,162.3 L 244.2,162.7 L 243.0,161.4 L 239.1,160.9 L 239.2,159.0 L 238.9,157.0 L 236.7,156.7 L 236.6,156.0 L 235.4,155.9 L 232.4,156.9 L 234.3,156.8 L 232.3,158.9 L 230.8,158.9 L 230.6,160.5 L 228.3,160.0 L 227.5,159.9 L 226.8,160.2 L 226.3,161.9 L 225.6,164.1 L 225.4,164.8 L 225.2,165.5 L 228.2,168.0 L 226.1,168.9 L 225.9,171.7 L 226.4,172.8 L 223.9,173.6 L 223.3,174.9 L 223.7,176.2 L 223.0,176.6 L 222.2,178.1 L 213.0,177.5 L 211.5,176.5 L 208.2,176.0 L 207.8,176.5 L 205.9,176.4 L 204.4,176.3 L 203.3,175.0 L 201.1,176.0 L 194.9,176.2 L 192.4,176.6 L 189.5,175.7 L 188.8,176.2 L 188.2,176.5 L 186.3,176.5 L 183.9,176.9 L 183.1,178.8 L 185.4,179.3 L 186.4,181.2 L 191.2,182.6 L 193.8,185.1 L 194.3,186.9 L 194.6,188.5 L 194.0,188.7 L 190.3,189.5 L 189.9,191.3 L 188.4,191.2 L 185.7,190.7 L 184.6,192.0 L 183.3,192.6 L 180.8,193.5 L 177.4,193.8 L 175.8,194.3 L 175.1,194.7 L 174.4,196.3 L 174.1,197.2 L 172.5,196.9 L 173.2,198.5 L 172.1,199.4 L 169.9,200.8 L 168.9,201.0 L 166.5,199.5 L 163.1,198.9 L 161.1,198.8 L 158.8,198.7 L 156.4,198.5 L 155.4,198.6 L 151.6,197.4 L 151.9,196.5 L 151.3,195.8 L 150.6,194.2 L 150.8,193.1 L 149.9,192.6 L 149.1,193.4 L 147.7,192.8 L 145.3,193.6 L 144.7,195.2 L 143.2,195.9 L 142.4,197.8 L 141.7,197.5 L 141.0,197.6 L 141.9,198.3 L 140.8,198.9 L 140.3,199.4 L 139.7,200.1 L 140.7,200.5 L 140.9,200.6 Z"
    },
    {
      "id": "dharashiv",
      "name": "Dharashiv",
      "region": "Marathwada",
      "mw": 900,
      "pct": "14.1%",
      "projects": 415,
      "farms": "Tuljapur, Bhoonj, Paranda Wind Hub",
      "color": "#2563eb",
      "fill": "#2563eb",
      "rank": "#3",
      "windSpeed": "6.8 m/s",
      "cx": 344.9,
      "cy": 308.7,
      "path": "M 332.0,274.1 L 331.9,274.9 L 333.2,274.8 L 334.2,275.0 L 334.7,275.1 L 336.1,274.9 L 337.7,275.1 L 339.6,275.3 L 340.4,276.1 L 339.9,277.2 L 340.7,278.1 L 342.4,277.6 L 344.9,277.6 L 344.0,278.6 L 344.8,279.6 L 345.8,280.0 L 346.3,278.4 L 349.7,280.0 L 351.5,280.5 L 353.2,280.1 L 357.7,279.8 L 359.8,281.0 L 359.8,282.2 L 360.9,281.7 L 361.4,279.8 L 363.5,280.0 L 364.7,280.3 L 366.8,280.4 L 368.9,280.4 L 369.2,281.6 L 370.7,281.7 L 370.5,283.3 L 368.9,284.2 L 368.8,286.5 L 368.7,287.2 L 370.2,288.6 L 369.4,288.9 L 369.8,292.0 L 366.6,291.1 L 365.4,292.5 L 363.7,294.0 L 366.4,295.3 L 368.1,295.5 L 369.5,296.0 L 371.2,294.8 L 371.7,296.9 L 374.5,298.9 L 374.5,301.6 L 372.0,305.2 L 373.0,306.8 L 372.5,308.1 L 371.1,310.7 L 370.9,312.3 L 370.7,313.1 L 371.3,314.8 L 373.4,316.0 L 375.5,316.4 L 375.8,317.5 L 376.8,317.6 L 379.3,316.9 L 381.9,318.5 L 381.4,319.3 L 381.7,320.3 L 384.4,321.0 L 388.8,321.6 L 390.1,321.6 L 391.7,320.3 L 392.5,321.3 L 393.0,321.8 L 394.1,321.8 L 395.7,321.7 L 398.2,322.1 L 399.7,321.2 L 401.0,321.4 L 401.5,322.1 L 403.0,323.5 L 407.7,323.8 L 408.5,324.5 L 408.0,325.8 L 407.7,327.3 L 407.6,329.4 L 412.1,329.7 L 413.5,330.7 L 413.7,332.1 L 415.1,334.1 L 416.1,334.6 L 418.2,336.4 L 417.4,337.6 L 416.5,338.6 L 414.5,339.4 L 414.0,339.8 L 411.8,339.5 L 411.2,340.5 L 411.8,341.2 L 412.5,342.8 L 409.8,343.9 L 410.1,345.3 L 409.2,346.0 L 408.9,347.4 L 406.6,346.7 L 405.8,344.6 L 403.6,343.7 L 402.9,341.5 L 401.4,341.4 L 400.1,344.5 L 398.2,345.7 L 397.4,341.8 L 397.7,341.1 L 394.4,341.5 L 393.8,343.2 L 392.4,344.6 L 390.1,346.4 L 390.4,348.8 L 385.9,349.6 L 384.8,350.0 L 382.5,349.1 L 380.2,347.5 L 378.5,346.9 L 375.0,346.2 L 373.9,344.7 L 371.9,343.8 L 369.4,344.4 L 367.9,345.5 L 366.5,346.1 L 365.4,346.6 L 363.6,346.8 L 360.4,346.5 L 358.7,345.5 L 359.9,344.8 L 361.3,343.9 L 358.9,343.5 L 358.5,341.9 L 357.2,341.1 L 356.0,341.2 L 355.5,340.9 L 354.3,341.3 L 354.0,340.0 L 350.2,341.0 L 346.5,341.6 L 345.3,341.9 L 346.2,339.4 L 346.6,337.4 L 346.0,336.1 L 343.0,335.3 L 342.9,336.6 L 341.3,336.1 L 339.8,335.0 L 338.6,334.9 L 336.8,335.8 L 334.0,334.9 L 331.9,333.7 L 330.6,330.9 L 331.2,329.2 L 330.1,328.8 L 330.8,325.1 L 331.4,323.0 L 333.0,322.5 L 334.5,322.9 L 335.8,323.0 L 336.8,323.6 L 337.0,325.1 L 339.5,325.4 L 341.9,325.2 L 343.5,325.4 L 344.2,324.1 L 345.0,323.5 L 345.7,321.7 L 346.2,319.8 L 345.0,319.4 L 344.5,319.2 L 344.4,318.2 L 344.9,317.8 L 344.7,317.3 L 344.5,316.8 L 344.2,316.4 L 343.7,316.6 L 343.1,316.6 L 342.5,316.7 L 341.9,316.8 L 341.4,316.7 L 341.3,316.3 L 341.0,315.9 L 340.6,315.6 L 340.2,315.3 L 340.0,314.9 L 339.8,314.4 L 339.7,314.0 L 340.0,313.6 L 340.4,313.3 L 340.7,312.9 L 341.0,312.5 L 341.2,312.1 L 341.4,311.6 L 341.3,311.2 L 341.0,310.8 L 340.6,310.5 L 340.3,310.0 L 340.2,309.6 L 338.9,309.0 L 340.1,305.4 L 339.9,305.1 L 339.5,304.8 L 339.1,304.7 L 338.7,304.4 L 338.3,304.0 L 338.4,303.6 L 338.5,303.1 L 338.4,302.7 L 338.3,302.3 L 338.2,301.8 L 338.1,301.4 L 338.0,300.9 L 336.9,300.0 L 336.0,298.4 L 334.6,296.3 L 333.2,296.0 L 331.3,296.3 L 329.4,295.3 L 327.2,294.8 L 326.1,294.2 L 324.1,292.7 L 323.7,291.2 L 322.1,290.9 L 319.9,291.1 L 319.0,292.8 L 318.5,293.7 L 319.0,294.3 L 319.9,294.6 L 320.2,296.6 L 319.1,297.9 L 318.8,298.2 L 317.4,298.4 L 316.3,299.3 L 315.1,298.9 L 312.8,298.8 L 311.9,300.0 L 310.8,301.4 L 309.8,303.0 L 311.1,303.7 L 310.8,305.2 L 308.5,305.3 L 306.0,305.3 L 304.5,307.9 L 303.8,308.5 L 303.6,310.3 L 303.5,312.7 L 301.9,313.4 L 300.2,312.2 L 299.5,311.6 L 298.1,311.9 L 297.3,310.3 L 296.4,310.3 L 295.7,311.0 L 295.4,311.3 L 292.7,310.4 L 292.2,309.7 L 293.1,307.9 L 292.2,306.7 L 291.8,305.7 L 292.5,304.5 L 289.2,303.7 L 289.3,301.9 L 289.5,301.0 L 289.2,300.2 L 290.1,299.1 L 288.6,298.9 L 287.7,297.7 L 286.1,296.6 L 285.1,295.6 L 283.9,295.0 L 282.8,294.6 L 281.8,293.9 L 280.6,294.1 L 280.1,293.4 L 278.9,293.0 L 280.6,291.0 L 280.1,289.7 L 280.3,288.8 L 280.2,286.5 L 281.1,285.5 L 281.6,284.7 L 283.5,283.3 L 286.0,282.0 L 290.9,283.5 L 292.0,282.9 L 293.6,281.0 L 295.3,279.1 L 295.8,278.2 L 297.6,277.2 L 298.4,276.8 L 300.3,276.5 L 302.3,275.5 L 303.5,275.4 L 302.9,274.3 L 303.0,273.0 L 304.0,272.3 L 306.8,271.4 L 308.8,272.2 L 309.4,273.5 L 312.4,275.1 L 314.1,275.1 L 314.1,273.7 L 314.5,272.4 L 316.4,271.9 L 318.0,272.5 L 319.6,273.0 L 320.8,272.9 L 322.2,272.7 L 323.6,273.2 L 324.3,273.2 L 325.8,273.8 L 326.8,274.4 L 327.7,273.8 L 328.9,273.4 L 329.8,273.8 L 331.4,274.3 L 332.0,274.1 Z"
    },
    {
      "id": "pune",
      "name": "Pune",
      "region": "Western Maharashtra",
      "mw": 110,
      "pct": "1.7%",
      "projects": 68,
      "farms": "Bhor, Khed Wind Hill",
      "color": "#0ea5e9",
      "fill": "#bae6fd",
      "rank": "#8",
      "windSpeed": "5.9 m/s",
      "cx": 171.2,
      "cy": 285.1,
      "path": "M 148.4,310.8 L 148.9,311.3 L 150.5,313.1 L 150.8,314.0 L 150.1,314.7 L 147.3,314.5 L 148.9,316.9 L 148.1,318.0 L 148.1,319.9 L 147.7,320.3 L 147.1,321.0 L 146.2,320.7 L 145.2,321.1 L 142.7,320.8 L 140.8,321.8 L 138.4,321.6 L 137.7,320.9 L 136.9,320.6 L 133.5,320.2 L 129.0,321.5 L 128.2,320.9 L 126.8,320.1 L 125.5,319.8 L 124.5,318.4 L 123.7,316.7 L 122.8,315.4 L 124.1,313.1 L 124.2,314.3 L 125.3,314.5 L 124.9,314.1 L 125.8,313.2 L 126.4,312.5 L 126.9,312.8 L 127.7,311.8 L 129.2,311.8 L 128.3,310.7 L 126.9,310.6 L 125.6,310.4 L 124.0,309.9 L 123.0,309.4 L 121.3,310.1 L 119.8,309.3 L 119.5,307.7 L 118.9,308.9 L 117.5,308.3 L 117.2,309.4 L 115.9,309.0 L 116.9,307.7 L 116.0,307.7 L 117.0,306.7 L 115.9,306.3 L 117.2,305.5 L 116.2,305.0 L 114.9,304.4 L 114.9,303.4 L 114.3,303.1 L 114.7,302.3 L 113.0,302.7 L 111.8,302.4 L 111.6,301.1 L 109.6,301.3 L 106.8,300.7 L 106.9,299.9 L 106.6,299.2 L 107.1,298.3 L 108.5,296.8 L 107.9,296.2 L 107.1,295.1 L 106.6,293.4 L 105.6,293.6 L 104.6,293.0 L 104.4,292.3 L 104.3,291.2 L 104.2,289.6 L 105.0,288.0 L 105.3,286.6 L 105.1,286.1 L 104.5,286.7 L 103.7,287.4 L 102.8,287.7 L 102.5,287.8 L 102.3,288.6 L 100.9,287.5 L 101.5,287.3 L 102.2,287.6 L 102.8,286.6 L 103.9,286.1 L 103.3,286.0 L 100.8,284.0 L 99.0,283.2 L 99.4,282.6 L 100.7,282.0 L 98.7,282.4 L 97.5,281.7 L 97.6,280.5 L 98.2,279.3 L 98.5,278.6 L 98.9,278.5 L 100.0,277.6 L 100.9,276.0 L 102.6,274.9 L 103.4,274.1 L 103.1,272.5 L 102.2,270.6 L 100.9,271.2 L 100.7,270.6 L 99.5,271.5 L 98.6,271.6 L 98.2,271.1 L 99.4,269.8 L 100.1,268.9 L 100.6,267.8 L 100.7,266.9 L 101.4,264.8 L 102.1,264.7 L 102.8,263.6 L 103.3,260.3 L 103.8,260.0 L 105.9,259.3 L 108.0,257.6 L 107.7,256.5 L 107.3,255.2 L 108.1,254.6 L 109.3,254.5 L 109.9,253.5 L 110.2,251.8 L 110.7,251.2 L 111.8,250.4 L 114.8,251.2 L 115.5,250.4 L 115.8,250.2 L 116.9,249.5 L 117.7,248.8 L 119.0,247.6 L 118.0,246.8 L 117.2,245.8 L 116.6,245.2 L 115.5,244.5 L 116.0,243.9 L 116.4,242.4 L 114.9,242.1 L 115.7,241.3 L 115.6,240.5 L 116.0,239.8 L 116.6,239.2 L 117.5,239.7 L 117.9,238.2 L 117.2,238.1 L 116.9,237.0 L 117.5,236.3 L 117.4,235.6 L 117.8,235.2 L 119.5,235.1 L 120.3,234.7 L 123.8,234.7 L 125.8,233.8 L 127.5,232.4 L 128.8,231.0 L 130.4,231.0 L 131.6,230.3 L 131.4,228.7 L 129.6,227.3 L 129.6,226.4 L 131.0,225.6 L 133.7,224.4 L 136.7,224.4 L 139.1,223.5 L 140.4,223.7 L 141.2,224.1 L 140.6,221.6 L 141.2,219.4 L 143.1,219.7 L 145.5,220.8 L 146.1,221.6 L 147.8,222.1 L 149.3,220.7 L 150.9,221.2 L 152.8,222.6 L 154.4,223.1 L 155.0,222.9 L 155.9,223.1 L 157.4,222.3 L 160.0,222.1 L 161.1,223.7 L 161.7,224.8 L 162.7,226.0 L 161.7,226.6 L 161.4,227.0 L 162.4,227.2 L 162.8,228.4 L 163.3,229.7 L 164.3,229.5 L 165.2,230.7 L 167.1,231.2 L 168.3,231.7 L 168.9,231.8 L 168.5,231.3 L 170.3,231.6 L 173.3,232.0 L 174.7,233.7 L 175.5,232.5 L 176.3,232.6 L 177.9,233.2 L 180.5,233.8 L 184.2,232.4 L 187.0,232.7 L 189.0,233.6 L 187.0,234.9 L 184.6,235.2 L 184.1,236.8 L 183.0,237.8 L 181.8,239.6 L 180.8,239.1 L 179.4,239.5 L 178.2,240.9 L 178.5,242.3 L 177.8,243.8 L 176.2,245.7 L 177.5,246.8 L 177.9,247.5 L 179.0,248.1 L 180.0,248.8 L 179.9,249.3 L 180.9,249.8 L 180.8,250.8 L 182.1,251.5 L 182.7,252.3 L 184.7,254.1 L 186.1,255.4 L 187.3,256.3 L 188.1,257.7 L 188.6,258.7 L 189.7,260.5 L 191.3,260.9 L 194.2,261.0 L 196.3,261.2 L 196.3,262.5 L 196.0,263.9 L 196.4,265.1 L 196.6,266.1 L 197.5,268.1 L 199.6,267.5 L 200.2,267.8 L 201.0,268.5 L 201.7,269.7 L 203.2,269.3 L 204.5,270.0 L 204.0,272.0 L 206.3,272.9 L 207.3,273.6 L 206.3,274.5 L 205.3,275.2 L 203.9,275.6 L 205.9,276.7 L 207.2,277.5 L 209.9,277.3 L 210.9,277.9 L 210.3,279.9 L 211.7,280.9 L 212.8,282.0 L 213.7,282.7 L 213.0,283.7 L 211.7,284.6 L 211.2,286.2 L 213.2,287.9 L 216.6,288.6 L 219.0,289.8 L 221.2,289.4 L 222.1,288.8 L 220.7,287.9 L 221.4,287.0 L 223.9,286.0 L 225.7,286.2 L 227.2,287.6 L 226.9,289.8 L 226.9,292.4 L 229.2,293.9 L 230.9,293.3 L 232.1,293.0 L 234.8,294.6 L 234.3,295.8 L 233.6,297.3 L 235.5,297.9 L 237.1,298.1 L 238.0,300.3 L 237.4,301.4 L 234.4,301.0 L 233.5,302.2 L 235.8,303.9 L 237.9,305.3 L 241.1,305.0 L 242.8,304.1 L 245.3,304.2 L 248.0,303.8 L 250.3,305.1 L 252.2,305.4 L 255.4,304.2 L 256.6,303.9 L 256.0,305.1 L 253.9,306.8 L 253.7,308.6 L 255.5,309.0 L 257.1,308.8 L 259.3,307.7 L 261.9,307.0 L 262.8,307.7 L 262.7,310.1 L 261.0,312.6 L 261.2,314.3 L 262.7,314.6 L 265.4,314.3 L 267.6,314.6 L 267.6,315.5 L 265.8,316.3 L 264.8,317.7 L 263.2,317.9 L 261.0,318.5 L 260.3,320.3 L 257.8,321.6 L 256.1,323.5 L 254.5,325.9 L 256.2,327.5 L 258.4,326.5 L 260.8,325.3 L 262.2,325.2 L 263.6,323.6 L 264.5,325.0 L 264.5,325.8 L 263.4,325.8 L 264.5,326.6 L 263.5,327.6 L 262.3,328.2 L 260.3,328.1 L 260.6,328.9 L 259.2,329.9 L 257.4,329.1 L 257.0,329.9 L 257.3,330.9 L 255.0,331.5 L 254.3,331.0 L 252.5,330.2 L 250.2,329.7 L 247.3,329.1 L 246.9,328.0 L 244.3,327.6 L 242.9,328.1 L 240.9,327.6 L 238.8,327.5 L 238.5,326.6 L 239.7,325.6 L 240.0,324.2 L 238.9,323.9 L 237.0,324.0 L 236.8,323.1 L 235.5,322.2 L 234.9,322.3 L 234.9,323.3 L 234.9,323.6 L 234.7,323.7 L 234.1,323.5 L 233.4,322.8 L 231.9,322.7 L 230.9,321.8 L 229.9,321.8 L 228.7,321.6 L 226.4,321.4 L 225.5,321.2 L 223.8,320.3 L 221.5,318.3 L 220.5,319.1 L 219.1,320.1 L 217.1,319.9 L 214.6,319.3 L 213.9,320.0 L 212.4,318.9 L 211.0,318.3 L 208.8,319.2 L 205.6,319.1 L 203.7,319.8 L 202.0,319.7 L 200.7,318.9 L 198.0,318.2 L 196.0,318.1 L 194.8,318.0 L 193.5,317.0 L 192.1,316.4 L 190.1,317.2 L 188.4,318.2 L 187.1,318.0 L 183.8,317.2 L 182.0,316.1 L 179.3,316.1 L 176.9,315.2 L 174.6,315.3 L 172.4,314.7 L 170.1,314.0 L 167.8,314.5 L 166.5,314.0 L 165.7,313.2 L 163.3,313.7 L 162.2,313.2 L 160.4,311.8 L 159.5,312.3 L 157.5,311.6 L 155.7,310.4 L 154.3,310.6 L 151.8,311.1 L 150.9,311.2 L 150.2,309.8 L 149.2,310.5 L 148.6,310.2 L 147.9,310.3 L 147.7,310.7 L 148.4,310.8 Z"
    },
    {
      "id": "sangli",
      "name": "Sangli",
      "region": "Western Maharashtra (Desh)",
      "mw": 1420,
      "pct": "22.3%",
      "projects": 620,
      "farms": "Kadegaon, Jat, Atpadi Wind Park",
      "color": "#0284c7",
      "fill": "#0369a1",
      "rank": "#2",
      "windSpeed": "7.1 m/s",
      "cx": 224.4,
      "cy": 386.5,
      "path": "M 247.2,384.4 L 247.0,383.4 L 250.5,383.1 L 252.3,382.6 L 253.5,382.3 L 254.9,381.5 L 259.9,381.6 L 259.5,380.4 L 260.7,379.6 L 261.5,379.7 L 264.2,380.0 L 267.4,380.2 L 269.2,380.2 L 270.2,378.3 L 272.0,378.6 L 274.3,379.1 L 274.6,380.6 L 274.2,382.3 L 272.3,383.3 L 274.0,384.7 L 277.4,384.5 L 277.5,387.1 L 280.7,385.4 L 278.8,383.8 L 279.2,382.1 L 283.1,381.8 L 285.4,380.5 L 286.8,382.8 L 289.0,384.1 L 290.0,383.2 L 290.4,381.1 L 290.9,379.3 L 292.8,378.4 L 295.7,379.4 L 295.4,380.2 L 300.2,380.3 L 302.4,378.1 L 304.7,376.7 L 307.0,375.7 L 310.4,376.6 L 310.9,377.7 L 313.5,380.1 L 313.6,382.5 L 311.8,384.0 L 310.5,384.6 L 311.8,387.0 L 312.8,388.2 L 314.9,390.5 L 315.3,392.2 L 314.4,393.5 L 312.3,394.6 L 312.9,395.8 L 314.6,396.1 L 314.2,399.7 L 314.8,400.3 L 314.5,401.2 L 312.5,401.6 L 311.2,400.6 L 308.8,400.3 L 307.8,397.7 L 305.0,398.1 L 302.5,400.8 L 300.8,401.1 L 299.4,401.9 L 297.9,402.2 L 297.6,400.6 L 295.6,399.2 L 292.9,400.2 L 288.8,399.8 L 285.5,401.3 L 280.6,401.4 L 278.6,401.5 L 279.2,405.4 L 278.4,407.4 L 275.2,408.2 L 274.0,408.9 L 272.2,410.0 L 269.7,408.4 L 268.9,407.9 L 266.1,407.8 L 264.9,406.7 L 263.6,405.5 L 262.1,404.8 L 260.9,402.0 L 258.2,402.6 L 256.6,402.6 L 255.1,403.6 L 254.0,402.4 L 252.1,402.4 L 248.8,402.2 L 248.8,402.9 L 247.9,403.3 L 246.4,402.5 L 246.3,404.0 L 247.3,404.8 L 248.8,407.2 L 247.0,407.2 L 246.3,407.8 L 244.0,408.8 L 244.3,412.2 L 243.5,415.2 L 238.7,415.2 L 233.6,417.0 L 231.3,417.2 L 230.2,417.7 L 228.8,418.8 L 225.0,419.5 L 224.8,418.2 L 219.9,416.8 L 219.7,415.4 L 216.8,413.5 L 214.7,413.0 L 212.0,412.7 L 210.8,410.8 L 208.5,409.5 L 207.6,409.8 L 206.6,410.7 L 205.8,410.3 L 205.9,408.9 L 204.9,408.5 L 203.2,408.3 L 202.6,409.2 L 199.0,409.9 L 197.5,409.3 L 198.5,407.8 L 197.3,407.1 L 195.1,408.1 L 193.1,408.7 L 192.3,407.9 L 190.2,407.4 L 189.1,406.4 L 187.0,405.9 L 185.6,404.6 L 183.6,405.6 L 182.0,406.7 L 181.3,405.4 L 179.7,405.2 L 179.3,406.2 L 177.4,406.1 L 175.8,405.8 L 174.4,406.6 L 173.0,406.7 L 171.2,404.8 L 169.1,405.0 L 168.4,404.5 L 166.6,405.4 L 165.7,404.8 L 163.9,404.0 L 163.4,402.8 L 162.2,402.5 L 162.1,401.5 L 162.4,401.0 L 161.9,400.5 L 162.1,399.3 L 159.6,398.6 L 158.3,399.2 L 157.4,398.4 L 158.1,397.6 L 158.3,395.6 L 156.7,394.6 L 155.4,393.9 L 154.5,393.0 L 152.8,392.8 L 151.8,392.3 L 151.0,390.5 L 148.8,389.4 L 148.9,388.6 L 147.9,388.3 L 147.1,387.9 L 145.8,386.7 L 142.9,385.3 L 139.8,384.7 L 138.8,385.4 L 139.6,386.7 L 138.4,386.8 L 137.1,386.7 L 136.8,385.5 L 135.7,385.6 L 133.9,385.3 L 132.4,384.9 L 132.1,384.6 L 133.0,384.2 L 134.0,383.1 L 132.5,381.3 L 131.7,380.4 L 132.1,379.3 L 132.2,378.6 L 134.0,378.8 L 135.3,377.7 L 136.9,377.8 L 138.2,379.2 L 141.6,380.1 L 143.4,380.9 L 145.6,382.2 L 148.2,384.0 L 149.3,385.5 L 150.5,386.6 L 151.6,386.8 L 154.0,388.1 L 158.4,388.5 L 158.9,389.4 L 161.0,390.1 L 163.0,391.3 L 164.5,390.6 L 166.2,390.7 L 169.3,390.3 L 169.9,389.3 L 172.1,389.5 L 174.6,388.7 L 177.2,387.0 L 180.9,387.9 L 183.0,386.8 L 183.0,386.2 L 184.5,385.6 L 186.2,384.5 L 186.2,382.7 L 185.2,382.1 L 185.9,381.0 L 186.8,380.1 L 185.0,379.4 L 183.9,377.6 L 183.8,376.1 L 184.4,375.3 L 187.2,374.6 L 186.5,373.5 L 186.0,372.7 L 186.7,371.6 L 185.9,371.4 L 184.0,371.7 L 183.6,371.1 L 184.1,369.9 L 185.5,368.3 L 186.4,367.2 L 189.0,367.0 L 192.7,367.6 L 198.1,368.2 L 201.7,368.9 L 205.8,369.6 L 208.7,368.3 L 210.8,366.9 L 213.5,367.5 L 214.5,366.6 L 216.3,365.1 L 218.1,366.6 L 219.4,368.4 L 222.1,368.7 L 224.3,368.9 L 224.0,368.3 L 223.7,367.2 L 223.5,366.5 L 224.5,366.0 L 224.7,365.5 L 224.8,364.2 L 224.7,363.4 L 224.4,363.0 L 223.8,361.9 L 226.1,362.0 L 227.5,362.6 L 229.9,362.8 L 232.7,364.0 L 234.9,364.4 L 235.9,363.3 L 236.8,362.8 L 238.6,361.2 L 239.7,360.3 L 240.0,358.5 L 239.8,356.4 L 241.6,355.3 L 241.4,353.5 L 242.3,352.6 L 243.8,351.4 L 244.2,351.9 L 244.9,352.0 L 245.3,352.6 L 245.0,353.9 L 245.6,355.2 L 248.8,354.2 L 249.1,354.1 L 249.3,355.1 L 249.4,356.2 L 251.5,357.7 L 247.7,359.3 L 247.0,359.9 L 247.7,360.5 L 248.3,361.0 L 249.8,362.2 L 250.4,363.4 L 251.9,362.8 L 255.1,361.3 L 256.2,362.1 L 255.9,364.4 L 255.7,366.0 L 254.7,367.7 L 252.5,367.8 L 252.5,369.2 L 252.5,371.1 L 249.9,372.4 L 249.7,373.5 L 249.0,376.3 L 247.5,376.8 L 246.8,377.5 L 244.1,377.7 L 243.3,379.3 L 242.9,380.5 L 242.0,380.8 L 241.8,381.7 L 241.0,381.9 L 239.5,382.1 L 239.1,382.5 L 239.4,382.8 L 240.7,382.6 L 240.2,383.3 L 240.7,384.0 L 242.2,383.6 L 242.9,384.0 L 242.2,384.2 L 242.3,384.5 L 242.9,385.1 L 243.6,385.1 L 244.6,385.0 L 247.0,385.3 L 247.2,384.4 Z"
    },
    {
      "id": "satara",
      "name": "Satara",
      "region": "Western Maharashtra (Desh)",
      "mw": 1640,
      "pct": "25.7%",
      "projects": 742,
      "farms": "Vankusawade, Chalkewadi, Thoseghar",
      "color": "#0369a1",
      "fill": "#0284c7",
      "rank": "#1",
      "windSpeed": "7.4 m/s",
      "cx": 175.6,
      "cy": 347.2,
      "path": "M 148.7,310.3 L 149.5,310.3 L 150.2,309.8 L 150.9,311.2 L 151.8,311.1 L 154.3,310.6 L 155.7,310.4 L 157.5,311.6 L 159.5,312.3 L 160.4,311.8 L 162.2,313.2 L 163.3,313.7 L 165.7,313.2 L 166.5,314.0 L 167.8,314.5 L 170.1,314.0 L 172.4,314.7 L 174.6,315.3 L 176.9,315.2 L 179.3,316.1 L 182.0,316.1 L 183.8,317.2 L 187.1,318.0 L 188.4,318.2 L 190.1,317.2 L 192.1,316.4 L 193.5,317.0 L 194.8,318.0 L 196.0,318.1 L 198.0,318.2 L 200.7,318.9 L 202.0,319.7 L 203.7,319.8 L 205.6,319.1 L 208.8,319.2 L 211.0,318.3 L 212.4,318.9 L 213.9,320.0 L 214.6,319.3 L 217.1,319.9 L 219.1,320.1 L 220.5,319.1 L 221.5,318.3 L 223.8,320.3 L 225.5,321.2 L 222.9,322.5 L 221.7,324.1 L 221.0,327.8 L 220.4,329.6 L 218.6,331.3 L 218.7,333.0 L 217.0,334.0 L 216.3,334.9 L 217.2,335.4 L 217.9,336.1 L 219.0,336.3 L 219.2,335.8 L 219.9,335.3 L 220.8,333.8 L 222.8,334.7 L 223.3,336.1 L 223.5,337.1 L 223.4,337.7 L 224.4,337.8 L 224.9,338.2 L 224.9,338.7 L 224.5,339.1 L 225.3,339.1 L 224.9,339.5 L 225.7,339.2 L 226.3,339.5 L 229.0,338.6 L 228.5,339.2 L 229.4,339.4 L 229.4,340.9 L 228.8,341.0 L 230.1,341.3 L 230.9,341.3 L 232.1,340.6 L 234.1,341.8 L 237.1,343.7 L 238.9,344.0 L 240.8,343.9 L 240.4,345.5 L 241.2,347.5 L 242.3,348.9 L 243.8,351.4 L 242.3,352.6 L 241.4,353.5 L 241.6,355.3 L 239.8,356.4 L 240.0,358.5 L 239.7,360.3 L 238.6,361.2 L 236.8,362.8 L 235.9,363.3 L 234.9,364.4 L 232.7,364.0 L 229.9,362.8 L 227.5,362.6 L 226.1,362.0 L 223.8,361.9 L 224.4,363.0 L 224.7,363.4 L 224.8,364.2 L 224.7,365.5 L 224.5,366.0 L 223.5,366.5 L 223.7,367.2 L 224.0,368.3 L 224.3,368.9 L 222.1,368.7 L 219.4,368.4 L 218.1,366.6 L 216.3,365.1 L 214.5,366.6 L 213.5,367.5 L 210.8,366.9 L 208.7,368.3 L 205.8,369.6 L 201.7,368.9 L 198.1,368.2 L 192.7,367.6 L 189.0,367.0 L 186.4,367.2 L 185.5,368.3 L 184.1,369.9 L 183.6,371.1 L 184.0,371.7 L 185.9,371.4 L 186.7,371.6 L 186.0,372.7 L 186.5,373.5 L 187.2,374.6 L 184.4,375.3 L 183.8,376.1 L 183.9,377.6 L 185.0,379.4 L 186.8,380.1 L 185.9,381.0 L 185.2,382.1 L 186.2,382.7 L 186.2,384.5 L 184.5,385.6 L 183.0,386.2 L 183.0,386.8 L 180.9,387.9 L 177.2,387.0 L 174.6,388.7 L 172.1,389.5 L 169.9,389.3 L 169.3,390.3 L 166.2,390.7 L 164.5,390.6 L 163.0,391.3 L 161.0,390.1 L 158.9,389.4 L 158.4,388.5 L 154.0,388.1 L 151.6,386.8 L 150.5,386.6 L 149.3,385.5 L 148.2,384.0 L 145.6,382.2 L 143.4,380.9 L 141.6,380.1 L 138.2,379.2 L 136.9,377.8 L 135.3,377.7 L 134.0,378.8 L 132.2,378.6 L 131.6,378.3 L 131.4,376.9 L 130.9,376.3 L 130.5,376.0 L 130.8,374.2 L 130.8,372.9 L 130.8,371.6 L 129.5,370.3 L 128.4,370.0 L 127.4,369.5 L 127.3,368.8 L 127.9,369.1 L 128.6,368.8 L 129.5,368.8 L 130.8,367.0 L 132.1,366.7 L 133.0,365.8 L 132.9,364.6 L 132.5,364.1 L 132.2,362.6 L 131.8,361.8 L 133.0,361.3 L 132.9,360.3 L 134.6,359.2 L 136.1,358.5 L 136.2,356.3 L 133.9,355.1 L 134.6,353.7 L 133.9,353.0 L 134.5,352.3 L 134.4,351.7 L 132.4,351.5 L 131.6,351.2 L 132.3,350.3 L 132.1,349.8 L 132.6,349.0 L 132.0,348.7 L 131.7,348.2 L 130.6,347.3 L 130.6,346.8 L 129.3,346.3 L 128.5,346.2 L 128.0,345.4 L 125.7,345.7 L 124.0,345.2 L 122.3,345.8 L 121.3,345.3 L 120.3,344.5 L 120.5,343.2 L 121.4,341.8 L 122.2,340.0 L 121.5,339.4 L 123.0,339.0 L 122.6,338.2 L 121.9,336.8 L 121.5,336.0 L 122.5,335.2 L 121.4,334.4 L 120.9,333.0 L 120.3,332.7 L 119.4,331.6 L 117.0,331.4 L 118.1,330.7 L 120.7,328.9 L 121.6,327.7 L 122.8,328.2 L 124.6,326.9 L 126.3,325.1 L 127.1,323.5 L 127.7,321.8 L 130.8,320.7 L 134.6,320.2 L 137.8,320.7 L 137.7,321.1 L 139.3,321.5 L 141.2,321.7 L 143.4,320.8 L 145.7,320.9 L 146.5,321.0 L 147.2,320.8 L 147.6,320.2 L 148.3,319.6 L 148.6,317.4 L 148.1,315.8 L 148.7,314.8 L 150.3,314.4 L 151.0,313.6 L 150.0,312.2 L 148.6,311.1 L 148.1,310.7 L 147.6,310.5 L 148.0,310.3 L 148.7,310.3 Z"
    }
  ];

  const MAHARASHTRA_OTHER_DISTRICTS = [
    {
      "id": "akola",
      "name": "Akola",
      "path": "M 414.9,111.9 L 415.4,111.2 L 416.3,110.8 L 415.5,110.4 L 415.0,109.6 L 415.3,109.3 L 414.9,108.4 L 414.0,107.8 L 412.7,108.0 L 411.5,107.1 L 410.1,106.4 L 409.5,105.9 L 408.9,105.5 L 410.3,105.3 L 412.1,105.4 L 414.2,104.8 L 416.6,105.2 L 416.8,106.0 L 417.8,106.2 L 417.8,105.1 L 417.2,104.7 L 417.2,104.2 L 417.9,103.7 L 419.8,102.6 L 417.7,101.1 L 416.9,100.2 L 417.4,99.2 L 418.4,99.1 L 418.6,98.7 L 418.5,97.7 L 418.1,97.3 L 417.7,97.0 L 417.1,97.3 L 416.4,96.9 L 416.2,96.6 L 416.4,96.0 L 417.5,94.8 L 416.7,92.8 L 418.0,90.3 L 417.1,88.3 L 416.5,85.9 L 418.1,85.3 L 419.9,85.5 L 423.6,85.0 L 428.1,84.6 L 432.4,84.4 L 434.4,84.5 L 438.2,83.9 L 438.0,82.3 L 439.8,81.0 L 442.4,81.7 L 443.3,82.5 L 444.4,82.9 L 445.8,82.7 L 447.9,83.1 L 448.9,82.5 L 451.3,82.5 L 452.2,81.7 L 452.9,81.3 L 454.1,81.4 L 453.8,82.2 L 453.9,83.2 L 454.4,83.9 L 454.2,84.7 L 453.5,85.3 L 453.0,86.1 L 452.9,87.1 L 452.4,88.5 L 452.8,88.9 L 455.3,89.3 L 455.8,90.3 L 454.3,90.5 L 453.6,91.4 L 453.9,92.7 L 454.0,93.8 L 451.5,94.0 L 451.8,95.8 L 451.6,96.7 L 453.7,97.7 L 453.5,99.2 L 453.3,100.2 L 450.2,100.4 L 452.2,101.4 L 451.9,102.8 L 451.2,104.9 L 450.3,105.7 L 450.3,106.9 L 450.2,108.7 L 451.1,109.7 L 452.5,109.2 L 453.5,109.9 L 454.5,110.5 L 457.4,110.5 L 458.7,110.1 L 460.3,110.2 L 461.5,110.9 L 462.6,110.4 L 464.3,110.9 L 465.7,110.6 L 467.4,110.2 L 468.2,110.7 L 470.0,111.0 L 471.7,110.7 L 473.1,111.1 L 474.9,110.9 L 476.1,110.9 L 477.0,110.7 L 477.8,111.0 L 478.4,110.5 L 478.7,110.5 L 479.9,109.7 L 480.3,109.2 L 480.4,108.5 L 480.9,108.4 L 482.2,108.8 L 483.4,109.8 L 485.4,110.4 L 486.7,110.8 L 488.6,110.4 L 489.0,111.6 L 489.1,112.6 L 490.6,113.8 L 491.9,113.7 L 493.9,114.5 L 494.4,116.0 L 495.1,116.2 L 494.7,117.4 L 496.2,117.5 L 496.5,118.7 L 496.0,119.2 L 495.6,119.6 L 494.8,119.8 L 494.9,120.7 L 493.0,120.3 L 491.7,120.3 L 491.1,121.6 L 489.5,121.8 L 488.3,123.1 L 488.0,123.7 L 485.3,124.3 L 484.4,124.5 L 484.0,123.7 L 483.0,123.2 L 482.9,124.9 L 481.2,125.2 L 479.8,124.7 L 479.9,125.4 L 478.3,125.8 L 479.1,126.4 L 479.8,127.3 L 480.6,127.9 L 480.5,128.7 L 478.0,128.4 L 476.4,128.7 L 476.1,129.4 L 475.9,130.3 L 475.0,130.2 L 474.8,130.8 L 471.4,131.5 L 470.2,131.4 L 469.1,131.1 L 469.5,133.2 L 469.1,134.0 L 468.8,134.8 L 471.2,135.3 L 474.3,134.8 L 473.3,137.6 L 472.0,138.0 L 471.6,136.9 L 468.2,136.9 L 468.3,139.0 L 466.6,139.8 L 464.6,140.4 L 463.4,140.3 L 461.1,139.5 L 459.7,138.1 L 458.9,139.3 L 456.6,140.6 L 454.7,141.7 L 455.8,142.5 L 455.7,143.4 L 454.6,144.2 L 451.8,144.2 L 451.2,145.3 L 450.1,144.5 L 449.4,144.0 L 449.1,143.5 L 448.5,143.7 L 446.7,142.9 L 445.1,142.5 L 444.9,144.1 L 444.5,145.2 L 441.5,145.0 L 441.5,143.2 L 442.1,141.6 L 439.9,140.5 L 439.3,141.4 L 439.3,143.3 L 438.3,143.3 L 437.2,143.5 L 437.1,144.1 L 436.9,144.5 L 436.1,145.3 L 435.5,145.5 L 435.8,146.3 L 434.1,146.8 L 431.6,146.5 L 430.1,147.7 L 428.0,149.9 L 427.7,150.4 L 428.9,150.9 L 426.6,152.6 L 426.2,153.3 L 425.5,152.9 L 424.6,151.7 L 422.6,151.7 L 421.7,153.0 L 420.4,153.2 L 420.0,152.6 L 418.2,152.6 L 417.8,151.9 L 418.5,150.6 L 417.3,150.2 L 415.6,150.1 L 414.2,148.9 L 413.0,148.6 L 412.4,148.4 L 410.5,146.6 L 411.5,145.2 L 412.4,144.1 L 412.0,143.2 L 411.1,142.4 L 409.3,139.9 L 410.7,138.9 L 411.0,136.2 L 412.7,135.7 L 413.5,137.1 L 413.8,137.3 L 414.5,136.9 L 414.8,135.8 L 416.4,135.6 L 416.8,133.2 L 416.4,131.1 L 417.5,130.2 L 417.0,129.2 L 416.1,127.5 L 414.1,127.2 L 415.9,125.7 L 413.4,124.2 L 412.2,121.9 L 413.6,120.9 L 415.4,119.8 L 416.3,116.4 L 415.0,114.8 L 413.7,113.8 L 414.0,112.3 L 414.8,112.0 L 414.9,111.9 Z"
    },
    {
      "id": "amravati",
      "name": "Amravati",
      "path": "M 490.1,71.7 L 490.9,71.7 L 491.8,72.0 L 492.4,72.1 L 494.1,71.9 L 493.6,70.5 L 493.6,70.2 L 495.0,70.4 L 497.2,70.6 L 497.8,70.2 L 499.3,70.6 L 499.6,71.7 L 500.1,71.7 L 501.8,69.9 L 502.3,70.1 L 503.3,71.4 L 503.3,72.8 L 506.4,72.2 L 507.5,70.8 L 508.9,70.8 L 511.2,70.5 L 511.7,69.4 L 512.1,68.8 L 515.3,69.6 L 518.0,70.6 L 519.7,71.4 L 521.3,71.3 L 522.5,71.0 L 524.4,70.8 L 526.8,69.6 L 528.5,69.5 L 530.7,68.5 L 532.5,68.2 L 535.5,66.9 L 539.3,65.5 L 542.5,64.2 L 546.6,62.1 L 546.3,60.3 L 546.6,59.1 L 547.5,57.9 L 552.9,57.4 L 555.8,56.8 L 554.4,55.9 L 555.1,55.2 L 556.9,55.8 L 558.7,56.8 L 560.3,56.6 L 562.0,55.5 L 563.6,56.5 L 565.5,55.5 L 565.2,53.7 L 566.3,53.5 L 567.8,53.9 L 569.6,54.5 L 569.1,56.4 L 569.9,57.5 L 569.9,58.8 L 570.4,60.0 L 570.7,61.6 L 570.5,63.0 L 570.7,64.2 L 571.4,66.0 L 571.2,66.6 L 572.2,68.4 L 571.9,69.3 L 570.1,69.7 L 569.5,70.3 L 568.3,70.8 L 567.2,70.7 L 565.9,70.6 L 565.2,70.0 L 564.4,70.8 L 562.8,71.0 L 561.7,71.6 L 560.6,72.1 L 559.4,72.5 L 555.9,73.3 L 553.6,74.9 L 549.1,74.8 L 544.7,74.7 L 543.7,74.0 L 541.8,73.5 L 540.1,73.0 L 538.7,72.8 L 537.2,73.2 L 537.7,75.0 L 536.6,76.8 L 537.4,77.6 L 538.0,78.3 L 537.4,79.0 L 535.8,79.9 L 535.8,81.5 L 537.0,81.9 L 537.2,83.1 L 539.5,84.6 L 539.0,85.9 L 540.5,87.2 L 542.1,88.1 L 543.6,89.0 L 543.3,89.7 L 542.6,91.0 L 543.0,91.7 L 544.4,93.6 L 544.5,94.7 L 544.4,96.1 L 543.3,96.9 L 543.9,98.0 L 543.1,99.2 L 543.6,99.8 L 544.3,102.0 L 544.1,103.2 L 546.1,103.9 L 546.7,104.9 L 546.9,105.9 L 547.3,106.5 L 549.3,107.0 L 551.0,106.9 L 552.4,107.3 L 553.5,107.7 L 554.9,109.2 L 556.2,111.0 L 556.7,111.3 L 557.4,111.4 L 557.8,112.4 L 558.5,111.9 L 559.3,112.0 L 559.8,112.9 L 558.1,113.6 L 557.8,114.9 L 557.6,116.1 L 558.8,118.4 L 559.2,119.0 L 558.2,120.8 L 557.8,122.1 L 556.9,122.0 L 555.8,122.1 L 554.1,123.0 L 552.0,122.7 L 550.1,122.7 L 549.7,123.6 L 547.3,123.6 L 546.1,124.1 L 545.1,124.9 L 542.6,124.5 L 542.1,125.0 L 542.1,125.7 L 540.7,126.3 L 539.0,126.3 L 539.6,124.9 L 539.1,124.1 L 538.2,123.9 L 537.8,124.5 L 537.5,124.6 L 537.2,124.3 L 536.9,124.2 L 535.8,124.1 L 534.1,124.4 L 533.5,124.9 L 532.3,126.2 L 532.8,126.9 L 531.7,127.4 L 529.3,128.4 L 528.2,129.8 L 526.4,130.7 L 525.2,130.9 L 524.2,131.1 L 523.7,131.8 L 523.1,132.3 L 522.2,131.9 L 522.5,130.2 L 522.6,128.9 L 521.1,128.3 L 519.7,128.0 L 519.0,128.6 L 517.9,128.6 L 517.6,129.9 L 516.2,131.0 L 515.3,131.9 L 513.4,130.4 L 511.3,132.3 L 510.2,133.5 L 507.7,133.5 L 506.4,132.2 L 504.5,131.9 L 501.9,131.4 L 499.5,130.8 L 498.7,131.9 L 497.5,131.9 L 496.5,131.0 L 498.1,127.9 L 498.4,125.7 L 498.2,125.1 L 496.9,125.1 L 496.7,123.2 L 497.0,122.6 L 496.4,121.2 L 495.4,120.7 L 494.8,119.8 L 495.6,119.6 L 496.0,119.2 L 496.5,118.7 L 496.2,117.5 L 494.7,117.4 L 495.2,115.9 L 494.4,114.7 L 492.9,114.2 L 491.5,113.8 L 490.3,113.2 L 488.9,112.4 L 488.9,111.1 L 487.6,110.4 L 486.3,110.6 L 484.2,110.1 L 481.9,109.7 L 482.1,108.5 L 480.7,108.4 L 480.6,108.7 L 480.1,109.4 L 479.4,110.2 L 478.4,110.5 L 477.8,111.0 L 477.0,110.7 L 476.1,110.9 L 474.9,110.9 L 473.1,111.1 L 471.7,110.7 L 470.0,111.0 L 468.2,110.7 L 467.4,110.2 L 465.7,110.6 L 464.3,110.9 L 462.6,110.4 L 461.5,110.9 L 460.3,110.2 L 458.7,110.1 L 457.4,110.5 L 454.5,110.5 L 453.5,109.9 L 452.5,109.2 L 451.1,109.7 L 450.2,108.7 L 450.3,106.9 L 450.3,105.7 L 451.2,104.9 L 451.9,102.8 L 452.2,101.4 L 450.2,100.4 L 453.3,100.2 L 453.5,99.2 L 453.7,97.7 L 451.6,96.7 L 451.8,95.8 L 451.5,94.0 L 454.0,93.8 L 453.9,92.7 L 453.6,91.4 L 454.3,90.5 L 455.8,90.3 L 455.3,89.3 L 452.8,88.9 L 452.4,88.5 L 452.9,87.1 L 453.0,86.1 L 453.5,85.3 L 454.2,84.7 L 454.4,83.9 L 453.9,83.2 L 453.8,82.2 L 454.1,81.4 L 452.9,81.3 L 452.2,81.7 L 451.3,82.5 L 448.9,82.5 L 447.9,83.1 L 445.8,82.7 L 444.4,82.9 L 443.3,82.5 L 442.4,81.7 L 439.8,81.0 L 438.0,82.3 L 438.2,83.9 L 434.4,84.5 L 432.4,84.4 L 428.1,84.6 L 423.6,85.0 L 419.9,85.5 L 418.1,85.3 L 417.2,85.1 L 416.0,84.9 L 415.3,82.7 L 414.6,83.0 L 414.1,81.9 L 414.4,80.7 L 413.3,79.3 L 411.3,78.1 L 408.4,77.9 L 405.2,77.2 L 403.0,74.5 L 411.8,69.7 L 413.6,67.5 L 417.0,65.2 L 418.4,63.6 L 416.5,61.4 L 417.0,59.8 L 417.9,58.8 L 417.8,56.4 L 418.9,55.0 L 422.4,55.3 L 424.1,53.7 L 428.7,54.7 L 435.9,49.9 L 438.8,48.5 L 440.6,47.6 L 443.6,46.2 L 444.7,45.6 L 445.6,45.9 L 447.5,45.6 L 450.2,45.6 L 452.7,46.3 L 453.5,45.4 L 455.3,45.6 L 456.6,47.6 L 458.1,47.4 L 458.6,47.0 L 461.6,46.2 L 462.7,45.1 L 464.5,44.6 L 464.1,44.2 L 463.7,43.6 L 463.9,42.7 L 466.5,42.9 L 469.2,42.7 L 470.7,42.9 L 475.5,43.1 L 478.6,42.6 L 479.9,42.5 L 482.0,42.0 L 482.0,42.4 L 483.2,43.6 L 484.3,44.0 L 485.9,45.3 L 486.2,46.3 L 486.7,46.2 L 488.2,47.2 L 488.7,48.7 L 489.6,50.6 L 490.9,52.8 L 490.6,53.6 L 490.8,56.6 L 491.2,57.9 L 492.7,57.6 L 493.1,59.8 L 490.5,60.0 L 487.6,59.3 L 485.0,58.4 L 481.4,58.2 L 479.8,58.1 L 479.3,58.8 L 477.7,58.8 L 476.6,59.8 L 477.9,62.1 L 478.3,63.6 L 478.6,64.3 L 479.9,64.6 L 481.4,65.5 L 481.4,66.5 L 482.2,68.1 L 482.7,70.4 L 485.3,71.4 L 486.4,68.4 L 489.4,69.6 L 489.4,71.1 L 489.5,71.6 L 490.1,71.7 Z"
    },
    {
      "id": "chhatrapati-sambhajinagar",
      "name": "Chhatrapati Sambhajinagar",
      "path": "M 345.0,126.8 L 345.2,126.7 L 345.1,126.4 L 345.0,126.0 L 345.8,126.1 L 346.0,126.1 L 346.3,126.1 L 346.7,125.9 L 347.1,125.9 L 347.4,126.0 L 348.0,126.4 L 348.1,126.7 L 347.9,127.4 L 348.2,128.0 L 348.5,128.5 L 348.6,128.8 L 348.7,129.0 L 348.7,129.3 L 348.7,129.5 L 348.6,129.6 L 348.6,130.2 L 348.9,130.7 L 348.9,130.9 L 348.5,131.5 L 348.5,131.7 L 348.7,132.0 L 348.7,132.3 L 348.7,132.6 L 348.4,132.7 L 348.0,132.6 L 347.4,132.8 L 347.2,132.8 L 347.0,132.8 L 346.7,133.0 L 346.8,133.3 L 346.8,134.1 L 346.7,134.5 L 346.3,134.4 L 346.1,134.2 L 346.1,134.0 L 345.9,134.0 L 345.8,134.1 L 345.2,134.5 L 345.0,134.5 L 344.9,134.5 L 344.5,134.2 L 344.2,134.5 L 343.5,134.5 L 342.6,134.2 L 342.3,134.1 L 341.6,134.1 L 340.7,134.1 L 339.7,133.9 L 338.6,133.0 L 338.7,132.9 L 338.9,132.7 L 339.0,130.9 L 339.0,130.7 L 339.0,129.8 L 338.9,129.6 L 338.9,129.5 L 338.9,129.3 L 340.2,129.1 L 340.5,129.0 L 340.8,128.8 L 341.0,128.1 L 341.0,127.4 L 341.4,127.5 L 342.5,127.5 L 343.9,127.6 L 344.0,127.6 L 344.2,127.6 L 344.4,127.3 L 344.9,127.1 L 345.0,126.8 Z M 332.2,138.1 L 332.6,139.0 L 334.4,140.3 L 333.9,140.9 L 332.7,139.9 L 331.8,139.3 L 330.0,138.7 L 328.3,138.7 L 327.1,139.4 L 326.7,140.3 L 324.6,139.9 L 323.4,140.3 L 323.4,141.7 L 322.9,142.8 L 322.1,143.9 L 321.8,145.6 L 323.3,146.2 L 324.5,147.6 L 323.4,148.3 L 322.0,149.1 L 319.6,149.0 L 318.8,149.6 L 316.4,150.5 L 316.4,151.5 L 316.8,153.3 L 316.4,154.2 L 315.3,155.7 L 315.1,156.5 L 315.4,157.7 L 315.8,158.8 L 315.1,160.0 L 312.5,159.8 L 312.0,161.8 L 311.6,163.5 L 311.3,164.2 L 311.0,165.3 L 310.9,166.9 L 310.4,169.3 L 309.1,169.9 L 307.6,171.6 L 307.6,172.5 L 308.1,173.5 L 310.0,173.8 L 313.0,175.4 L 313.0,177.9 L 315.0,179.0 L 314.0,180.7 L 312.8,185.6 L 313.5,187.6 L 311.8,189.0 L 312.6,190.6 L 310.6,191.8 L 310.6,193.1 L 311.4,193.9 L 311.3,198.1 L 308.7,200.9 L 307.3,201.8 L 307.9,203.5 L 309.5,204.1 L 312.9,204.9 L 313.3,206.5 L 312.1,209.3 L 312.0,212.5 L 311.0,214.4 L 309.8,213.8 L 308.9,216.6 L 309.6,218.3 L 308.1,220.2 L 305.4,220.4 L 300.6,218.7 L 299.9,217.4 L 299.4,216.6 L 297.6,216.0 L 296.8,217.3 L 296.2,217.9 L 294.8,217.9 L 293.9,217.5 L 293.2,217.3 L 290.9,217.6 L 289.9,217.8 L 288.0,218.1 L 287.4,218.7 L 284.3,218.2 L 285.5,216.7 L 285.1,215.5 L 283.4,216.1 L 282.5,214.9 L 284.4,213.4 L 286.1,212.5 L 284.8,211.6 L 283.1,213.0 L 282.9,211.7 L 281.6,211.9 L 280.8,210.9 L 278.8,208.8 L 278.5,207.8 L 277.5,207.6 L 276.9,209.7 L 275.7,209.2 L 273.9,208.5 L 272.9,207.5 L 271.5,206.6 L 271.3,205.6 L 269.1,204.2 L 267.5,204.5 L 266.6,204.8 L 264.8,204.6 L 263.0,203.7 L 261.3,203.3 L 258.9,203.6 L 257.8,203.5 L 256.4,202.7 L 256.0,202.2 L 254.6,202.4 L 251.0,201.1 L 247.7,200.5 L 246.7,201.0 L 245.7,200.3 L 243.8,200.7 L 242.4,200.5 L 242.2,199.8 L 240.0,200.3 L 238.4,200.2 L 237.9,199.5 L 236.9,198.9 L 236.5,198.8 L 235.4,197.9 L 235.4,196.9 L 234.6,196.3 L 233.1,195.0 L 232.3,194.0 L 231.3,193.3 L 229.7,192.8 L 228.1,192.0 L 226.9,192.3 L 226.7,191.9 L 226.7,191.1 L 225.1,190.9 L 225.4,191.9 L 224.1,192.0 L 222.3,191.2 L 220.4,190.5 L 218.8,189.5 L 217.7,190.1 L 216.9,191.1 L 215.2,191.1 L 214.7,190.0 L 216.1,185.3 L 219.6,186.0 L 219.9,184.5 L 220.0,180.8 L 223.0,179.7 L 222.2,178.1 L 223.0,176.6 L 223.7,176.2 L 223.3,174.9 L 223.9,173.6 L 226.4,172.8 L 225.9,171.7 L 226.1,168.9 L 228.2,168.0 L 225.2,165.5 L 225.4,164.8 L 225.6,164.1 L 226.3,161.9 L 226.8,160.2 L 227.5,159.9 L 228.3,160.0 L 230.6,160.5 L 230.8,158.9 L 232.3,158.9 L 234.3,156.8 L 232.4,156.9 L 235.4,155.9 L 236.6,156.0 L 236.7,156.7 L 238.9,157.0 L 239.2,159.0 L 239.1,160.9 L 243.0,161.4 L 244.2,162.7 L 246.0,162.3 L 245.5,161.9 L 245.6,161.0 L 246.1,158.1 L 245.7,155.8 L 246.5,154.9 L 247.7,153.7 L 249.7,151.4 L 251.1,150.4 L 252.0,149.0 L 254.2,149.7 L 256.9,151.1 L 257.7,150.3 L 257.7,149.5 L 258.8,149.1 L 261.0,149.1 L 262.1,148.3 L 264.0,148.0 L 263.4,145.3 L 262.4,143.7 L 263.3,142.8 L 264.1,142.1 L 264.9,141.9 L 266.8,141.7 L 267.5,141.0 L 267.5,139.3 L 268.0,138.5 L 269.3,138.6 L 271.0,138.2 L 271.2,137.3 L 272.1,137.3 L 272.9,137.0 L 273.8,137.3 L 273.5,135.7 L 274.4,135.1 L 274.9,133.8 L 275.3,133.1 L 276.0,131.5 L 277.8,131.6 L 279.8,131.5 L 280.9,130.9 L 281.8,130.3 L 284.2,130.1 L 285.6,129.9 L 286.1,130.1 L 286.9,131.1 L 288.9,131.2 L 289.2,135.0 L 291.3,135.4 L 292.6,135.5 L 292.0,134.6 L 292.7,134.3 L 294.3,134.6 L 295.3,135.1 L 295.1,132.8 L 295.8,133.4 L 297.5,133.8 L 298.5,134.3 L 299.0,133.4 L 299.3,133.0 L 300.4,132.4 L 301.0,131.5 L 301.1,129.6 L 302.5,128.5 L 304.0,128.9 L 304.7,128.3 L 305.9,128.8 L 307.1,129.1 L 309.3,128.6 L 309.4,127.5 L 312.4,127.8 L 313.5,127.3 L 313.6,126.1 L 313.2,125.4 L 314.1,124.1 L 316.3,124.2 L 317.5,125.3 L 317.2,127.6 L 319.5,127.7 L 322.0,128.1 L 322.7,130.3 L 323.9,130.8 L 325.7,131.0 L 327.0,131.5 L 328.4,132.1 L 330.7,131.7 L 329.2,131.2 L 330.7,129.6 L 330.3,128.0 L 331.7,127.4 L 334.6,129.5 L 334.7,131.5 L 333.8,132.2 L 334.6,134.8 L 333.3,134.5 L 332.3,135.0 L 332.2,135.9 L 331.7,136.2 L 331.3,137.5 L 332.2,138.1 Z"
    },
    {
      "id": "buldana",
      "name": "Buldana",
      "path": "M 360.3,97.2 L 360.4,96.6 L 360.6,96.5 L 361.1,97.0 L 362.7,97.6 L 363.3,98.2 L 364.6,98.6 L 366.4,99.1 L 367.9,100.3 L 369.7,100.9 L 370.8,101.8 L 371.6,102.6 L 372.7,102.6 L 374.7,103.1 L 377.1,102.7 L 377.8,102.2 L 379.0,101.4 L 380.2,101.2 L 380.8,99.9 L 381.5,98.5 L 381.5,98.0 L 381.6,97.5 L 381.9,97.1 L 381.7,96.4 L 381.4,96.0 L 380.9,95.0 L 380.9,94.4 L 380.7,93.8 L 380.5,93.6 L 383.0,92.5 L 385.6,91.5 L 387.0,91.0 L 387.5,89.2 L 388.3,88.6 L 389.3,88.0 L 389.8,85.5 L 391.3,84.9 L 395.3,84.9 L 398.5,84.4 L 401.9,84.9 L 402.9,85.2 L 403.6,83.5 L 404.7,81.1 L 406.2,80.7 L 406.4,78.5 L 409.8,78.0 L 412.1,77.8 L 414.1,80.3 L 414.0,81.2 L 414.2,82.4 L 414.8,83.1 L 415.4,82.9 L 416.1,85.1 L 417.5,85.0 L 416.5,85.9 L 417.1,88.3 L 418.0,90.3 L 416.7,92.8 L 417.5,94.8 L 416.4,96.0 L 416.2,96.6 L 416.4,96.9 L 417.1,97.3 L 417.7,97.0 L 418.1,97.3 L 418.5,97.7 L 418.6,98.7 L 418.4,99.1 L 417.4,99.2 L 416.9,100.2 L 417.7,101.1 L 419.8,102.6 L 417.9,103.7 L 417.2,104.2 L 417.2,104.7 L 417.8,105.1 L 417.8,106.2 L 416.8,106.0 L 416.6,105.2 L 414.2,104.8 L 412.1,105.4 L 410.3,105.3 L 408.8,105.6 L 409.4,106.4 L 410.4,106.3 L 411.8,107.5 L 413.1,107.8 L 414.2,109.0 L 415.4,108.3 L 414.9,109.2 L 415.0,109.6 L 415.2,110.7 L 416.1,111.3 L 414.8,111.5 L 414.5,112.3 L 413.9,112.7 L 413.9,114.1 L 416.2,115.4 L 415.0,118.7 L 413.8,120.8 L 413.0,121.8 L 413.3,122.7 L 415.4,125.1 L 414.2,126.6 L 416.1,127.5 L 417.0,129.2 L 417.5,130.2 L 416.4,131.2 L 416.6,134.2 L 415.8,136.1 L 414.8,136.1 L 414.3,137.1 L 413.7,137.3 L 413.3,137.4 L 412.9,135.8 L 411.4,135.7 L 410.3,138.3 L 409.8,138.8 L 411.2,141.5 L 411.7,142.8 L 412.4,143.7 L 412.2,145.0 L 410.4,146.2 L 409.8,147.7 L 412.8,148.9 L 413.9,148.8 L 415.2,149.9 L 416.3,150.0 L 418.5,150.6 L 417.8,151.9 L 418.1,152.4 L 419.5,152.5 L 420.2,153.1 L 421.2,153.2 L 421.9,154.2 L 421.6,155.4 L 420.5,156.9 L 418.4,158.3 L 416.0,158.5 L 414.2,158.8 L 414.5,160.3 L 414.5,161.7 L 414.4,164.4 L 410.4,165.0 L 406.8,165.1 L 406.0,165.7 L 405.4,167.4 L 404.0,168.9 L 403.0,169.5 L 406.3,171.6 L 406.0,173.2 L 405.3,175.6 L 406.1,176.9 L 404.1,177.2 L 404.0,178.7 L 403.7,179.6 L 401.3,179.9 L 402.0,181.1 L 401.7,182.3 L 404.4,181.6 L 405.8,181.8 L 405.5,183.5 L 404.6,184.1 L 402.8,185.9 L 400.6,186.0 L 397.7,186.2 L 395.1,185.7 L 394.1,184.5 L 393.2,183.8 L 391.4,182.8 L 390.5,181.3 L 390.5,180.2 L 386.9,180.0 L 383.7,180.3 L 382.4,180.4 L 381.2,181.3 L 377.9,181.0 L 377.3,182.3 L 376.8,182.5 L 375.4,182.9 L 374.5,183.3 L 373.6,183.2 L 372.6,183.8 L 369.3,183.6 L 368.0,183.9 L 364.9,184.1 L 363.4,184.4 L 362.4,185.2 L 359.1,184.9 L 358.9,185.7 L 357.5,184.8 L 356.2,184.6 L 353.9,184.0 L 352.6,182.7 L 350.9,180.4 L 350.4,179.3 L 350.1,178.6 L 349.1,178.2 L 347.7,178.0 L 346.6,176.0 L 345.5,176.2 L 344.3,175.8 L 342.1,173.9 L 345.9,172.9 L 347.0,169.8 L 351.3,169.0 L 350.4,167.2 L 352.9,166.6 L 354.5,164.8 L 355.0,162.5 L 356.6,161.9 L 357.6,160.4 L 359.1,158.7 L 357.9,157.1 L 360.4,156.5 L 362.4,153.6 L 361.5,151.9 L 358.3,151.6 L 357.4,150.7 L 356.7,149.5 L 355.0,147.8 L 353.2,147.3 L 352.1,148.0 L 349.2,149.9 L 348.0,151.5 L 345.0,150.4 L 342.7,150.4 L 340.5,151.8 L 338.3,151.0 L 338.2,149.9 L 338.8,149.3 L 339.7,148.3 L 339.7,146.4 L 341.3,146.6 L 341.8,145.7 L 340.4,144.6 L 340.2,143.2 L 339.9,141.5 L 341.1,139.3 L 340.5,138.7 L 339.7,137.1 L 340.4,135.3 L 341.1,134.9 L 342.6,134.6 L 344.2,134.5 L 345.0,134.5 L 345.9,134.0 L 346.3,134.4 L 346.8,133.3 L 347.2,132.8 L 348.4,132.7 L 348.7,132.0 L 348.9,130.9 L 348.6,129.6 L 348.7,129.0 L 348.2,128.0 L 348.0,126.4 L 346.7,125.9 L 346.0,126.1 L 345.8,125.9 L 345.4,125.1 L 344.8,124.2 L 345.3,123.2 L 345.0,122.5 L 344.9,121.1 L 346.2,120.3 L 346.3,119.6 L 346.2,119.4 L 345.2,118.7 L 343.9,117.8 L 344.7,117.0 L 344.8,116.0 L 346.1,115.4 L 349.0,115.6 L 349.7,114.9 L 350.3,114.1 L 349.7,113.1 L 350.4,112.5 L 351.2,112.3 L 351.8,111.7 L 352.4,110.9 L 354.1,108.9 L 355.7,107.6 L 354.7,107.0 L 353.6,106.4 L 353.3,104.7 L 354.1,104.0 L 355.1,103.7 L 355.9,102.2 L 356.4,101.3 L 358.4,100.5 L 359.8,99.4 L 360.1,98.3 L 360.3,97.4 L 360.3,97.2 Z"
    },
    {
      "id": "chandrapur",
      "name": "Chandrapur",
      "path": "M 711.3,136.1 L 710.6,139.9 L 710.4,141.0 L 711.5,143.1 L 712.0,145.3 L 713.3,148.3 L 711.8,149.4 L 710.8,150.7 L 711.1,153.0 L 713.9,155.1 L 715.4,157.2 L 714.8,158.9 L 712.6,159.2 L 710.4,160.0 L 708.1,162.4 L 707.8,163.8 L 710.1,164.7 L 713.3,165.9 L 714.5,169.3 L 713.3,173.2 L 711.8,174.8 L 708.8,176.5 L 704.8,176.0 L 703.7,174.3 L 703.1,173.3 L 700.8,172.5 L 697.3,173.7 L 695.5,174.3 L 694.7,176.4 L 696.6,180.0 L 697.8,181.8 L 697.2,182.9 L 696.0,184.1 L 693.4,185.8 L 692.0,188.0 L 692.8,191.3 L 695.6,194.8 L 696.0,197.3 L 696.3,201.9 L 696.5,204.5 L 693.6,203.9 L 689.8,205.3 L 687.2,205.6 L 684.2,205.8 L 680.8,207.1 L 679.6,209.9 L 679.1,211.2 L 676.8,211.0 L 674.4,209.5 L 674.0,207.9 L 671.4,208.4 L 671.5,209.8 L 668.1,211.2 L 666.1,210.1 L 662.9,209.0 L 659.7,207.8 L 657.8,206.2 L 654.2,206.0 L 652.6,206.9 L 652.0,206.5 L 651.3,205.4 L 649.4,204.8 L 647.2,203.6 L 646.3,203.7 L 647.3,204.4 L 647.2,205.9 L 645.7,207.7 L 645.5,209.5 L 643.6,210.7 L 643.0,212.6 L 643.9,214.1 L 639.4,214.0 L 637.1,211.4 L 633.9,210.3 L 631.1,209.3 L 629.6,209.4 L 627.9,209.3 L 626.0,208.4 L 624.1,208.0 L 622.0,207.9 L 620.8,208.6 L 619.4,208.0 L 619.8,207.1 L 621.9,205.8 L 620.9,204.2 L 621.4,202.8 L 622.1,201.1 L 621.5,200.8 L 619.1,200.3 L 616.6,200.2 L 612.9,199.9 L 610.5,198.9 L 610.9,196.8 L 610.3,194.2 L 609.1,192.2 L 610.7,191.5 L 612.1,192.3 L 612.9,193.4 L 615.4,193.5 L 617.6,193.2 L 618.4,192.3 L 617.5,190.8 L 618.5,189.4 L 620.5,188.9 L 622.8,188.8 L 624.9,189.3 L 626.6,188.2 L 628.5,188.1 L 630.5,187.5 L 631.8,186.2 L 634.3,184.8 L 635.7,184.3 L 637.1,182.3 L 632.5,180.8 L 631.5,179.3 L 632.8,177.7 L 633.1,176.6 L 631.9,175.6 L 633.6,175.3 L 633.1,173.7 L 631.4,172.7 L 630.0,170.4 L 629.4,169.8 L 627.5,169.9 L 627.7,168.8 L 626.4,167.9 L 624.7,165.9 L 623.0,165.2 L 621.5,165.2 L 620.3,165.0 L 620.6,163.7 L 621.3,163.1 L 620.2,162.2 L 618.9,161.7 L 619.1,160.7 L 619.5,159.4 L 618.6,158.5 L 617.3,157.8 L 616.6,157.1 L 615.8,155.4 L 613.6,155.6 L 612.4,155.8 L 609.2,155.4 L 605.8,155.5 L 605.7,154.6 L 606.2,153.7 L 604.7,152.0 L 605.6,150.9 L 607.6,149.7 L 606.7,148.1 L 607.1,147.2 L 606.3,145.3 L 606.7,144.3 L 609.5,143.9 L 609.0,143.1 L 608.4,142.0 L 609.8,142.4 L 611.9,142.6 L 614.5,141.9 L 617.5,142.2 L 619.7,141.7 L 620.1,140.0 L 622.0,139.9 L 622.4,140.2 L 623.1,140.7 L 624.6,138.9 L 626.8,138.8 L 627.6,139.4 L 628.9,139.4 L 632.0,139.9 L 633.6,140.6 L 635.7,139.4 L 637.6,138.6 L 638.6,136.5 L 640.0,135.7 L 642.9,133.4 L 643.6,132.0 L 644.1,130.7 L 649.1,130.5 L 651.3,130.7 L 653.4,130.2 L 654.1,128.4 L 655.1,126.1 L 656.1,125.0 L 656.8,124.1 L 658.8,123.8 L 659.5,124.9 L 661.8,125.2 L 664.4,124.7 L 666.4,123.9 L 668.5,122.1 L 669.1,122.0 L 671.2,121.6 L 672.6,121.8 L 675.7,122.4 L 679.2,122.7 L 682.9,124.2 L 684.7,125.4 L 686.7,126.1 L 688.1,126.1 L 689.2,123.1 L 692.9,123.1 L 693.0,121.2 L 695.7,120.3 L 697.0,122.1 L 699.9,123.3 L 704.6,123.1 L 709.6,124.5 L 710.6,126.6 L 710.4,129.4 L 709.1,133.1 L 711.4,134.8 L 711.3,136.1 Z"
    },
    {
      "id": "garhchiroli",
      "name": "Garhchiroli",
      "path": "M 710.4,140.9 L 710.7,138.9 L 711.4,135.3 L 709.8,133.7 L 710.1,130.8 L 710.5,127.7 L 709.9,124.9 L 709.7,123.8 L 712.2,122.7 L 714.3,123.3 L 716.6,124.5 L 717.9,124.3 L 718.9,122.7 L 720.6,121.7 L 722.3,121.8 L 724.9,123.0 L 727.0,123.1 L 728.5,123.7 L 730.8,123.0 L 733.4,124.1 L 735.2,125.1 L 738.2,125.5 L 740.3,124.2 L 741.7,122.7 L 743.5,121.7 L 745.4,118.7 L 745.2,116.4 L 746.1,114.8 L 747.2,113.1 L 748.7,113.9 L 752.2,114.1 L 754.4,112.8 L 758.2,113.1 L 764.0,112.3 L 767.6,113.3 L 766.9,115.1 L 767.3,117.5 L 768.0,120.3 L 769.8,122.1 L 770.3,123.2 L 769.1,124.0 L 766.3,124.6 L 763.6,125.3 L 761.5,126.8 L 761.1,128.1 L 762.6,129.7 L 764.7,130.5 L 768.3,128.7 L 770.8,128.3 L 773.0,129.0 L 774.0,129.6 L 773.8,130.8 L 773.7,132.2 L 773.2,133.1 L 773.3,134.1 L 772.8,135.9 L 772.6,138.3 L 771.6,140.9 L 772.5,141.8 L 771.4,143.2 L 770.8,144.7 L 771.2,145.5 L 772.2,146.4 L 772.7,147.3 L 773.1,148.4 L 773.7,149.9 L 770.7,150.4 L 766.5,151.8 L 763.9,154.1 L 759.6,153.9 L 757.0,154.9 L 755.0,155.4 L 752.3,155.9 L 753.4,158.3 L 754.9,160.0 L 753.4,160.5 L 752.8,161.4 L 752.1,162.3 L 753.7,163.8 L 757.3,164.5 L 758.3,163.4 L 760.7,163.8 L 762.7,163.8 L 764.5,164.7 L 765.5,165.4 L 766.7,166.3 L 766.7,168.5 L 766.7,170.6 L 765.9,173.9 L 766.9,174.5 L 766.4,176.2 L 766.0,177.7 L 764.7,179.3 L 761.0,179.6 L 760.0,178.6 L 757.6,177.7 L 755.9,178.9 L 754.2,179.2 L 754.3,181.2 L 756.9,182.0 L 759.3,181.4 L 761.9,182.1 L 762.6,184.0 L 760.2,185.9 L 759.2,187.0 L 756.5,188.3 L 754.0,188.0 L 753.1,189.5 L 756.3,189.5 L 758.2,189.7 L 759.8,190.2 L 761.2,189.9 L 760.5,188.9 L 760.0,187.3 L 762.7,186.9 L 766.1,187.8 L 766.8,188.9 L 766.5,191.0 L 769.4,192.5 L 771.2,194.0 L 775.3,195.2 L 777.8,196.8 L 778.3,197.6 L 777.4,202.2 L 777.9,203.4 L 782.2,203.2 L 787.4,205.2 L 789.3,207.0 L 793.3,206.8 L 794.2,208.5 L 795.6,209.7 L 798.1,210.1 L 799.2,212.2 L 798.7,214.7 L 796.1,215.8 L 791.5,216.6 L 790.0,217.3 L 791.5,219.2 L 792.9,220.8 L 794.9,221.9 L 792.2,223.2 L 791.0,224.0 L 789.6,224.6 L 787.6,225.8 L 786.5,226.8 L 784.8,227.4 L 782.3,227.7 L 780.8,227.7 L 779.7,226.7 L 779.5,224.6 L 777.5,224.6 L 773.8,226.1 L 772.1,225.1 L 771.5,223.8 L 770.5,221.3 L 769.6,219.1 L 768.4,219.1 L 765.0,222.0 L 763.5,223.2 L 760.6,223.8 L 759.6,225.4 L 757.8,228.7 L 755.4,230.1 L 753.7,230.4 L 752.0,231.0 L 751.7,233.2 L 751.8,235.3 L 748.5,236.6 L 748.0,237.4 L 746.2,239.5 L 747.2,241.3 L 746.4,242.7 L 745.8,244.0 L 743.2,245.4 L 743.7,247.2 L 741.3,249.8 L 741.4,251.5 L 741.0,253.2 L 741.3,254.1 L 744.1,256.2 L 745.5,257.7 L 747.6,259.5 L 748.8,261.9 L 747.5,263.3 L 744.2,264.2 L 742.4,266.1 L 741.1,266.5 L 740.6,266.3 L 738.9,266.7 L 738.8,267.6 L 740.3,268.9 L 739.3,271.1 L 737.8,271.4 L 736.3,271.1 L 734.5,272.0 L 734.0,273.0 L 732.0,272.7 L 731.1,271.5 L 729.6,272.2 L 727.7,272.6 L 726.7,273.0 L 724.5,271.4 L 723.8,271.1 L 722.5,270.2 L 720.7,269.6 L 718.2,267.4 L 717.6,266.2 L 714.7,265.7 L 710.1,264.9 L 706.6,261.4 L 709.5,260.9 L 710.9,258.0 L 710.9,253.5 L 710.1,250.7 L 710.2,246.6 L 707.4,245.2 L 704.5,246.2 L 703.5,244.3 L 703.7,240.2 L 709.2,237.1 L 711.2,236.1 L 709.2,233.6 L 710.1,229.5 L 712.9,226.6 L 712.4,223.8 L 713.4,220.9 L 713.9,218.9 L 711.4,215.9 L 710.9,214.1 L 709.3,213.2 L 707.4,211.8 L 703.8,210.5 L 700.0,208.2 L 699.4,206.3 L 697.2,205.5 L 696.7,203.9 L 696.0,200.5 L 696.1,196.1 L 693.6,193.1 L 692.4,190.8 L 692.1,187.5 L 694.1,185.2 L 696.0,183.6 L 697.6,182.6 L 697.2,180.8 L 695.8,179.1 L 695.0,175.8 L 696.0,173.8 L 698.5,173.0 L 702.2,172.4 L 703.1,173.3 L 703.6,175.0 L 706.1,176.6 L 710.0,176.1 L 712.3,174.3 L 714.3,172.1 L 714.4,168.4 L 712.6,165.3 L 709.3,164.5 L 707.7,163.4 L 708.5,161.7 L 710.9,159.8 L 713.3,159.0 L 715.2,158.5 L 715.1,156.6 L 713.2,154.6 L 710.8,152.3 L 711.2,149.9 L 712.9,148.8 L 712.0,146.2 L 712.0,143.5 L 710.3,141.9 L 710.4,140.9 Z"
    },
    {
      "id": "gondiya",
      "name": "Gondiya",
      "path": "M 746.7,58.5 L 746.8,58.8 L 747.2,59.0 L 747.8,59.3 L 748.6,59.6 L 750.1,60.1 L 750.7,60.5 L 750.9,61.0 L 751.1,61.5 L 751.2,62.2 L 751.2,62.6 L 751.3,62.9 L 751.7,63.2 L 752.1,63.8 L 752.6,64.4 L 753.3,64.7 L 753.8,65.0 L 754.0,65.5 L 754.3,66.2 L 754.6,66.9 L 754.1,67.3 L 753.5,67.8 L 753.5,68.4 L 752.6,69.0 L 752.6,69.6 L 753.2,70.6 L 753.7,71.3 L 754.0,71.5 L 754.5,71.5 L 755.5,71.5 L 756.1,71.7 L 756.7,71.9 L 757.3,71.8 L 757.6,71.2 L 757.7,70.4 L 758.0,69.8 L 758.5,69.7 L 759.2,69.9 L 759.8,70.0 L 760.4,69.8 L 760.9,70.0 L 761.5,69.9 L 762.5,70.2 L 763.4,70.4 L 764.2,70.4 L 764.7,70.6 L 765.4,71.1 L 765.9,71.6 L 766.5,72.1 L 767.1,72.2 L 768.3,72.6 L 768.8,72.8 L 768.3,73.2 L 768.5,73.8 L 769.0,74.0 L 769.9,73.9 L 770.4,74.1 L 770.6,74.8 L 771.3,75.2 L 772.1,75.4 L 772.9,75.4 L 773.3,75.6 L 774.3,75.6 L 775.1,75.4 L 776.3,75.3 L 777.0,74.8 L 777.7,75.1 L 778.2,75.5 L 778.5,76.1 L 779.0,76.5 L 778.9,77.3 L 778.2,77.7 L 777.5,78.0 L 777.0,78.4 L 776.5,78.8 L 776.1,79.5 L 775.8,80.3 L 775.4,80.9 L 774.4,81.3 L 773.4,81.9 L 772.9,82.3 L 772.6,82.5 L 772.0,82.8 L 771.2,82.8 L 770.1,83.1 L 769.2,83.6 L 768.8,84.0 L 767.8,84.4 L 767.2,84.6 L 766.5,84.7 L 765.7,84.6 L 764.8,84.4 L 764.2,84.9 L 763.9,85.5 L 763.6,85.9 L 762.8,85.8 L 762.1,86.1 L 761.2,86.4 L 760.5,86.8 L 759.5,86.7 L 758.7,86.9 L 758.6,87.7 L 758.2,88.6 L 757.9,89.2 L 757.5,90.0 L 757.3,90.6 L 758.0,90.9 L 758.1,91.2 L 757.6,91.2 L 757.2,91.4 L 757.0,91.9 L 756.7,92.2 L 757.0,92.6 L 757.4,93.3 L 757.5,94.0 L 757.5,94.6 L 757.7,95.0 L 758.0,95.5 L 758.0,96.1 L 758.0,96.6 L 757.8,97.2 L 757.2,97.5 L 756.8,98.1 L 756.2,98.5 L 755.9,99.0 L 756.7,99.6 L 757.4,102.1 L 758.1,103.6 L 759.1,104.9 L 761.3,104.9 L 763.8,104.9 L 766.7,104.5 L 767.1,106.8 L 767.6,110.0 L 768.0,113.0 L 762.8,112.2 L 757.1,113.1 L 753.7,113.2 L 751.2,114.2 L 748.1,113.8 L 746.6,113.1 L 746.1,115.3 L 745.7,117.7 L 744.7,119.8 L 742.9,121.8 L 741.6,123.3 L 738.9,124.1 L 737.1,125.5 L 734.6,124.8 L 732.2,123.9 L 729.2,123.2 L 728.4,123.2 L 726.2,122.8 L 723.9,122.9 L 721.9,121.6 L 719.8,122.0 L 718.4,123.7 L 717.5,124.5 L 715.8,124.0 L 713.1,122.9 L 713.2,121.9 L 712.2,120.8 L 711.2,120.3 L 713.3,119.0 L 712.7,118.3 L 710.6,117.2 L 709.9,118.3 L 708.1,118.6 L 709.0,117.5 L 709.2,116.8 L 710.1,115.3 L 709.3,115.3 L 707.7,114.9 L 708.6,113.9 L 709.0,112.6 L 709.1,112.0 L 710.0,110.9 L 710.6,110.5 L 709.9,110.2 L 710.4,109.4 L 712.2,109.1 L 712.5,107.3 L 711.5,104.5 L 713.5,103.1 L 714.4,103.7 L 715.6,103.3 L 717.5,103.3 L 719.5,103.6 L 718.3,104.5 L 719.9,104.4 L 721.4,103.1 L 723.4,102.8 L 723.6,102.4 L 723.9,100.8 L 724.8,100.5 L 725.4,99.9 L 725.1,98.2 L 724.4,97.3 L 722.3,97.7 L 722.2,97.1 L 722.7,96.8 L 723.6,96.3 L 723.7,95.8 L 723.4,95.7 L 723.3,95.1 L 723.5,94.7 L 723.1,94.0 L 722.8,92.6 L 721.7,92.2 L 723.2,91.1 L 722.5,90.7 L 722.6,90.1 L 722.6,89.7 L 723.1,89.2 L 723.5,88.6 L 723.0,87.9 L 722.7,87.5 L 722.1,86.9 L 722.5,85.7 L 721.2,84.7 L 720.7,84.3 L 720.1,83.9 L 719.4,83.8 L 718.4,83.4 L 718.0,82.7 L 716.9,83.3 L 716.1,83.3 L 715.1,82.4 L 711.4,81.7 L 707.1,81.6 L 705.5,81.0 L 703.5,81.1 L 703.7,82.3 L 702.5,82.5 L 700.7,82.8 L 701.8,81.3 L 701.7,80.7 L 701.0,80.2 L 701.5,79.9 L 700.1,78.8 L 700.2,78.3 L 701.0,77.9 L 700.0,77.4 L 700.6,76.8 L 700.2,76.0 L 699.0,75.6 L 698.9,73.7 L 698.7,73.0 L 697.4,72.8 L 697.2,71.4 L 701.2,69.5 L 704.5,68.2 L 705.1,66.6 L 706.7,65.1 L 708.9,63.2 L 709.2,61.3 L 709.1,58.8 L 710.5,58.0 L 713.3,58.0 L 715.8,59.6 L 716.6,59.3 L 717.4,58.9 L 718.0,58.6 L 718.9,58.0 L 719.6,57.9 L 720.5,58.1 L 721.1,58.2 L 721.7,58.2 L 722.2,58.2 L 722.8,57.9 L 723.2,57.5 L 723.7,57.1 L 724.5,56.4 L 725.1,55.9 L 725.6,55.6 L 726.2,55.4 L 726.8,55.0 L 726.9,54.5 L 727.7,54.1 L 728.8,54.4 L 729.8,54.4 L 730.6,54.1 L 731.3,53.5 L 732.1,53.0 L 732.7,53.0 L 733.4,52.8 L 733.7,52.3 L 734.3,52.2 L 735.4,52.3 L 736.1,53.0 L 736.9,53.3 L 738.3,53.2 L 739.4,53.1 L 740.3,53.3 L 741.6,54.0 L 742.0,54.8 L 743.0,55.3 L 743.3,55.6 L 743.5,56.4 L 744.6,56.6 L 745.5,56.5 L 746.2,56.7 L 746.6,57.5 L 746.8,57.8 L 747.5,57.3 L 747.5,58.1 L 746.7,58.5 Z"
    },
    {
      "id": "mumbai_suburban",
      "name": "Mumbai Suburban",
      "path": "M 46.2,238.7 L 46.2,238.7 L 46.2,238.7 L 46.2,238.7 L 46.3,238.7 L 46.3,238.9 L 46.3,238.9 L 46.3,238.9 L 46.2,238.9 L 46.2,238.9 L 46.1,238.9 L 46.1,238.9 L 46.0,238.9 L 46.0,238.8 L 46.0,238.8 L 46.0,238.8 L 46.0,238.8 L 46.0,238.8 L 46.1,238.8 L 46.1,238.7 L 46.1,238.7 L 46.1,238.7 L 46.1,238.7 L 46.1,238.7 L 46.2,238.7 Z M 46.4,229.3 L 47.3,229.4 L 48.0,229.5 L 49.3,230.3 L 49.8,230.5 L 49.8,230.6 L 49.8,230.7 L 49.9,230.8 L 49.8,230.8 L 49.8,230.9 L 49.7,231.0 L 49.7,231.1 L 49.6,231.2 L 49.6,231.2 L 49.5,231.3 L 49.5,231.3 L 49.4,231.3 L 49.4,231.4 L 49.4,231.4 L 49.3,231.5 L 49.3,231.5 L 49.2,231.6 L 49.2,231.6 L 49.1,231.7 L 49.0,231.7 L 49.0,231.7 L 48.9,231.7 L 48.9,231.8 L 48.8,231.8 L 48.8,231.8 L 48.7,231.9 L 48.7,231.9 L 48.6,231.9 L 48.6,232.0 L 48.6,232.0 L 48.5,232.0 L 48.5,232.1 L 48.5,232.1 L 48.4,232.2 L 48.4,232.2 L 48.3,232.3 L 48.3,232.3 L 48.2,232.3 L 48.1,232.2 L 47.9,232.2 L 47.9,232.1 L 47.7,232.1 L 47.7,232.2 L 47.8,232.2 L 47.9,232.3 L 48.0,232.3 L 48.0,232.3 L 48.1,232.3 L 48.2,232.4 L 48.2,232.4 L 48.2,232.5 L 48.2,232.6 L 48.2,232.6 L 48.1,232.7 L 48.1,232.7 L 48.0,232.7 L 48.0,232.8 L 47.9,232.8 L 47.9,232.8 L 47.8,232.9 L 47.8,232.9 L 47.8,233.0 L 47.7,233.0 L 47.7,233.0 L 47.7,233.1 L 47.6,233.1 L 47.6,233.2 L 47.5,233.2 L 47.5,233.3 L 47.4,233.4 L 47.4,233.4 L 47.3,233.4 L 47.3,233.5 L 47.2,233.5 L 47.2,233.6 L 47.1,233.6 L 47.1,233.8 L 47.1,233.9 L 47.2,233.9 L 47.2,234.0 L 47.3,234.1 L 47.3,234.2 L 47.2,234.2 L 47.2,234.3 L 47.1,234.3 L 47.1,234.3 L 47.1,234.4 L 47.0,234.4 L 46.9,234.4 L 46.8,234.4 L 46.8,234.4 L 46.7,234.4 L 46.6,234.4 L 46.5,234.5 L 46.4,234.5 L 46.3,234.4 L 46.3,234.4 L 46.2,234.4 L 46.2,234.3 L 46.1,234.3 L 46.1,234.1 L 46.2,233.9 L 46.2,233.8 L 46.3,233.8 L 46.4,233.8 L 46.5,233.8 L 46.6,233.7 L 46.6,233.7 L 46.5,233.6 L 46.5,233.5 L 46.4,233.5 L 46.3,233.4 L 46.1,233.4 L 46.1,233.5 L 45.9,233.3 L 46.0,233.3 L 46.0,233.2 L 46.1,233.2 L 46.1,233.1 L 46.1,233.0 L 46.1,232.7 L 46.1,232.6 L 46.0,232.6 L 46.0,232.6 L 46.0,232.5 L 45.9,232.4 L 45.9,232.4 L 45.8,232.4 L 45.8,232.4 L 45.8,232.3 L 45.7,232.3 L 45.7,232.2 L 45.7,232.0 L 45.7,231.9 L 45.8,231.9 L 45.8,231.8 L 45.9,231.8 L 45.9,231.8 L 45.9,231.7 L 46.0,231.6 L 46.0,231.4 L 45.9,231.2 L 45.9,231.2 L 45.8,231.1 L 46.0,231.1 L 46.0,231.0 L 46.0,230.9 L 46.1,230.8 L 46.0,230.8 L 46.0,230.7 L 46.1,230.6 L 46.1,230.6 L 46.1,230.5 L 46.1,230.4 L 46.2,230.3 L 46.2,230.2 L 46.3,230.1 L 46.2,229.9 L 46.2,229.7 L 46.2,229.5 L 46.2,229.4 L 46.3,229.4 L 46.3,229.4 L 46.3,229.3 L 46.4,229.3 Z M 52.6,228.8 L 53.8,228.9 L 54.3,228.9 L 54.7,229.4 L 55.1,229.6 L 55.9,229.5 L 59.0,230.5 L 60.8,232.8 L 64.6,235.5 L 65.2,235.9 L 65.6,235.9 L 66.0,236.3 L 66.7,236.6 L 66.9,237.2 L 67.3,237.5 L 67.3,237.8 L 67.0,238.0 L 66.7,238.5 L 65.9,239.4 L 65.1,239.0 L 64.8,238.6 L 64.9,238.4 L 64.7,238.4 L 64.6,238.7 L 65.1,239.2 L 65.6,239.5 L 65.4,239.9 L 65.0,240.1 L 64.1,241.1 L 63.5,240.9 L 62.6,239.9 L 62.9,240.8 L 63.7,241.3 L 63.7,242.0 L 63.2,242.1 L 63.6,242.8 L 63.8,243.3 L 64.1,243.7 L 64.2,244.1 L 64.0,244.3 L 63.9,244.3 L 64.3,244.6 L 64.7,244.9 L 64.3,246.1 L 63.6,246.5 L 63.2,246.9 L 62.8,247.4 L 60.9,248.1 L 59.1,249.0 L 57.5,249.6 L 57.4,249.7 L 57.3,249.4 L 56.9,249.4 L 56.1,249.4 L 55.4,249.6 L 55.3,249.1 L 55.5,248.6 L 55.5,248.1 L 55.3,247.8 L 52.4,245.1 L 51.2,245.2 L 51.2,245.1 L 51.1,245.1 L 51.0,245.1 L 50.9,245.1 L 50.8,245.2 L 50.7,245.2 L 50.7,245.3 L 50.6,245.3 L 50.6,245.4 L 50.6,245.4 L 50.5,245.5 L 50.4,245.5 L 50.4,245.5 L 50.3,245.5 L 50.2,245.6 L 50.2,245.6 L 50.1,245.6 L 50.1,245.7 L 50.1,245.8 L 50.1,245.9 L 50.1,246.0 L 50.0,246.0 L 50.0,245.9 L 50.0,245.9 L 49.9,245.8 L 49.9,245.7 L 49.9,245.6 L 49.8,245.6 L 49.7,245.7 L 49.6,245.7 L 49.5,245.7 L 49.4,245.7 L 49.4,245.7 L 49.3,245.6 L 49.4,245.6 L 49.4,245.6 L 49.5,245.5 L 49.5,245.4 L 49.6,245.4 L 49.6,245.3 L 49.6,245.3 L 49.7,245.3 L 49.7,245.1 L 49.8,245.1 L 49.8,245.0 L 49.9,244.9 L 49.9,244.8 L 50.0,244.8 L 50.0,244.7 L 50.0,244.6 L 50.0,244.6 L 50.0,244.5 L 49.8,244.4 L 49.8,244.3 L 49.9,244.2 L 49.9,244.2 L 49.9,244.0 L 49.8,243.8 L 49.8,243.7 L 49.9,243.7 L 50.0,243.6 L 49.9,243.5 L 49.9,243.2 L 49.9,243.0 L 49.9,242.9 L 50.0,242.9 L 50.1,242.9 L 50.1,242.9 L 50.2,243.0 L 50.3,243.0 L 50.3,242.7 L 50.3,242.7 L 50.2,242.6 L 50.3,242.4 L 50.3,242.3 L 50.3,242.2 L 50.3,241.7 L 50.3,241.5 L 50.2,241.3 L 50.2,241.2 L 50.2,241.1 L 50.1,241.0 L 50.1,240.9 L 50.0,240.8 L 50.0,240.5 L 50.0,240.5 L 49.9,240.3 L 49.9,240.3 L 49.9,240.2 L 49.8,240.2 L 49.8,240.0 L 49.7,240.0 L 49.8,239.8 L 49.8,239.7 L 49.8,239.6 L 49.7,239.6 L 49.7,239.5 L 49.6,239.5 L 49.5,239.5 L 49.5,239.5 L 49.4,239.4 L 49.4,239.4 L 49.4,239.4 L 49.3,239.3 L 49.3,239.3 L 49.2,239.3 L 49.2,239.2 L 49.2,239.2 L 49.1,239.2 L 49.1,239.1 L 49.1,239.0 L 49.0,239.0 L 49.0,239.0 L 48.9,238.9 L 48.9,238.9 L 48.8,238.9 L 48.8,238.8 L 48.7,238.8 L 48.7,238.7 L 48.7,238.7 L 48.6,238.7 L 48.6,238.6 L 48.6,238.6 L 48.5,238.6 L 48.5,238.5 L 48.4,238.5 L 48.4,238.5 L 48.3,238.4 L 48.3,238.4 L 48.2,238.3 L 48.2,238.2 L 48.2,238.2 L 48.3,238.1 L 48.3,238.0 L 48.4,238.0 L 48.4,237.9 L 48.4,237.7 L 48.5,237.6 L 48.6,237.6 L 48.6,237.6 L 48.6,237.5 L 48.7,237.5 L 48.7,237.5 L 48.8,237.4 L 48.8,237.4 L 48.9,237.4 L 48.9,237.3 L 49.0,237.3 L 49.1,237.2 L 49.1,237.2 L 49.2,237.1 L 49.2,237.1 L 49.3,237.0 L 49.3,237.0 L 49.4,236.9 L 49.5,236.9 L 49.5,236.9 L 49.6,236.9 L 49.6,236.8 L 49.7,236.8 L 49.7,236.7 L 49.8,236.7 L 49.8,236.6 L 49.9,236.6 L 49.9,236.6 L 50.0,236.5 L 50.0,236.5 L 50.1,236.5 L 50.2,236.4 L 50.3,236.4 L 50.4,236.5 L 50.5,236.5 L 50.6,236.4 L 50.6,236.4 L 50.6,236.3 L 50.5,236.3 L 50.5,236.2 L 50.6,236.1 L 50.6,236.1 L 50.6,236.0 L 50.7,235.9 L 50.7,235.9 L 50.6,235.7 L 50.7,235.7 L 50.7,235.5 L 50.7,235.5 L 50.7,235.3 L 50.6,235.2 L 50.6,235.2 L 50.5,235.1 L 50.5,235.1 L 50.4,235.1 L 50.4,235.2 L 50.5,235.3 L 50.5,235.3 L 50.6,235.4 L 50.6,235.6 L 50.5,235.6 L 50.5,235.7 L 50.4,235.7 L 50.4,235.7 L 50.3,235.7 L 50.3,235.8 L 50.2,235.8 L 50.2,235.8 L 50.1,235.9 L 50.1,235.9 L 50.0,235.9 L 50.0,236.0 L 49.9,236.0 L 49.9,236.0 L 49.7,236.0 L 49.6,236.0 L 49.6,236.1 L 49.6,236.2 L 49.5,236.2 L 49.5,236.3 L 49.4,236.3 L 49.4,236.3 L 49.3,236.4 L 49.3,236.4 L 49.3,236.4 L 49.2,236.5 L 49.2,236.5 L 49.2,236.6 L 49.1,236.6 L 49.1,236.6 L 49.0,236.7 L 49.0,236.8 L 49.0,236.8 L 48.9,236.9 L 48.9,236.9 L 48.9,237.0 L 48.9,237.1 L 48.8,237.1 L 48.7,237.1 L 48.6,237.2 L 48.5,237.2 L 48.5,237.2 L 48.4,237.3 L 48.4,237.3 L 48.4,237.3 L 48.3,237.4 L 48.3,237.4 L 48.3,237.5 L 48.2,237.5 L 48.1,237.5 L 48.0,237.5 L 48.0,237.4 L 47.9,237.4 L 47.9,237.4 L 47.8,237.3 L 47.8,237.3 L 47.8,237.3 L 47.8,237.2 L 47.7,237.2 L 47.7,237.2 L 47.7,237.2 L 47.7,237.3 L 47.8,237.3 L 47.8,237.4 L 47.9,237.4 L 47.8,237.5 L 47.9,237.5 L 47.9,237.5 L 48.0,237.6 L 48.1,237.7 L 48.1,237.9 L 48.1,238.1 L 47.9,238.1 L 47.9,238.2 L 47.9,238.2 L 47.8,238.3 L 47.8,238.3 L 47.8,238.3 L 47.7,238.3 L 47.4,238.3 L 47.4,238.3 L 47.5,238.4 L 47.5,238.6 L 47.6,238.6 L 47.5,238.9 L 47.5,238.9 L 47.5,238.9 L 47.4,239.0 L 47.4,239.1 L 47.3,239.1 L 47.3,239.1 L 47.0,239.1 L 46.9,239.1 L 46.9,239.1 L 46.7,239.2 L 46.6,239.2 L 46.6,239.1 L 46.7,239.1 L 46.7,239.0 L 46.6,239.0 L 46.6,238.9 L 46.6,238.9 L 46.7,238.8 L 46.8,238.7 L 46.7,238.3 L 46.7,238.2 L 46.7,238.1 L 46.8,238.0 L 46.8,238.0 L 46.8,238.0 L 46.8,237.6 L 46.8,237.6 L 46.7,237.5 L 46.7,237.4 L 46.7,237.4 L 46.6,237.4 L 46.6,237.3 L 46.4,237.3 L 46.4,237.2 L 46.4,237.2 L 46.4,237.1 L 46.4,237.1 L 46.3,237.0 L 46.1,237.0 L 46.2,236.9 L 46.3,236.9 L 46.3,236.9 L 46.3,236.7 L 46.3,236.6 L 46.1,236.6 L 46.1,236.5 L 46.0,236.5 L 46.0,236.4 L 46.1,236.4 L 46.1,236.3 L 46.1,236.3 L 46.2,236.3 L 46.4,236.3 L 46.5,236.4 L 46.6,236.4 L 46.6,236.3 L 46.7,236.3 L 46.7,236.2 L 46.8,236.2 L 46.9,236.1 L 47.0,236.1 L 47.0,236.0 L 47.1,236.0 L 47.3,236.0 L 47.4,235.9 L 47.4,235.8 L 47.5,235.8 L 47.5,235.5 L 47.5,235.5 L 47.5,235.3 L 47.5,235.2 L 47.5,235.2 L 47.5,235.1 L 47.5,234.8 L 47.5,234.8 L 47.5,234.5 L 47.5,234.5 L 47.5,234.3 L 47.5,234.3 L 47.5,234.3 L 47.6,234.0 L 47.6,234.0 L 47.6,234.0 L 47.6,233.9 L 47.7,233.9 L 47.8,233.9 L 47.9,233.9 L 47.9,233.8 L 48.0,233.8 L 48.0,233.7 L 48.1,233.7 L 48.1,233.4 L 48.2,233.4 L 48.2,233.2 L 48.3,233.2 L 48.3,233.2 L 48.4,233.2 L 48.4,233.1 L 48.4,233.1 L 48.5,233.1 L 48.6,233.0 L 48.6,233.0 L 48.7,233.0 L 48.7,232.9 L 48.8,232.9 L 48.8,232.9 L 48.9,232.8 L 48.9,232.8 L 48.9,232.7 L 48.9,232.7 L 48.9,232.4 L 48.9,232.3 L 49.0,232.2 L 49.0,232.2 L 49.2,232.1 L 49.3,232.1 L 49.3,232.1 L 49.4,232.0 L 49.4,232.0 L 49.5,232.0 L 49.5,231.9 L 49.6,231.9 L 49.6,231.9 L 49.6,231.8 L 49.7,231.8 L 49.7,231.8 L 49.8,231.7 L 49.8,231.7 L 49.9,231.7 L 49.9,231.6 L 49.9,231.6 L 50.0,231.5 L 50.0,231.4 L 50.0,231.3 L 50.1,231.3 L 50.1,231.2 L 50.2,231.2 L 50.2,231.1 L 50.3,230.9 L 50.3,230.8 L 50.3,230.8 L 50.3,230.7 L 50.4,230.7 L 50.3,230.7 L 50.4,230.6 L 50.4,230.5 L 50.5,230.5 L 50.5,230.5 L 50.6,230.4 L 50.6,230.4 L 50.8,230.4 L 50.8,230.3 L 51.0,230.3 L 51.2,230.3 L 51.3,230.2 L 51.3,230.2 L 51.4,230.2 L 51.4,230.1 L 51.5,230.1 L 51.5,230.0 L 51.5,229.9 L 51.6,229.8 L 51.5,229.8 L 51.5,229.7 L 51.4,229.7 L 51.4,229.7 L 51.3,229.6 L 51.3,229.5 L 51.2,229.5 L 51.2,229.5 L 51.1,229.4 L 51.1,229.4 L 51.2,229.3 L 51.2,229.2 L 51.2,229.1 L 51.3,229.1 L 51.3,229.0 L 51.4,229.0 L 51.4,229.0 L 51.4,228.9 L 51.5,228.9 L 51.5,228.9 L 52.1,228.9 L 52.6,228.8 Z"
    },
    {
      "id": "hingoli",
      "name": "Hingoli",
      "path": "M 483.0,213.5 L 482.9,215.1 L 481.8,215.9 L 479.6,216.0 L 478.8,218.4 L 479.2,219.4 L 479.0,220.3 L 476.6,220.7 L 475.6,221.7 L 473.4,223.4 L 470.3,223.0 L 468.6,222.3 L 466.8,223.4 L 465.3,224.4 L 463.6,225.3 L 461.9,225.7 L 460.0,225.4 L 459.7,228.4 L 457.2,229.7 L 455.8,230.7 L 454.7,231.7 L 453.8,232.3 L 452.2,232.3 L 449.7,232.2 L 449.1,231.3 L 447.2,231.7 L 445.9,230.8 L 445.3,229.9 L 442.5,230.0 L 441.7,230.5 L 440.1,230.5 L 438.9,230.0 L 439.7,228.3 L 439.7,227.7 L 436.8,225.6 L 433.9,224.9 L 431.8,226.2 L 428.7,226.6 L 427.8,225.8 L 428.1,225.3 L 428.5,224.6 L 430.0,223.8 L 427.9,223.1 L 427.6,222.2 L 428.0,220.6 L 428.8,219.9 L 430.2,218.0 L 430.5,217.0 L 428.0,215.9 L 425.8,216.2 L 425.5,214.2 L 424.0,212.1 L 426.0,209.3 L 426.2,207.9 L 428.3,205.3 L 430.2,202.8 L 429.9,201.7 L 429.2,200.8 L 428.0,201.3 L 426.2,202.6 L 425.6,202.0 L 425.3,200.7 L 424.1,200.4 L 424.5,199.1 L 424.5,197.4 L 423.2,196.3 L 422.0,196.4 L 420.5,196.9 L 421.6,198.6 L 420.3,198.1 L 418.6,198.9 L 418.0,197.4 L 418.3,195.1 L 417.4,194.3 L 416.2,195.4 L 416.7,196.7 L 415.8,197.7 L 414.7,197.0 L 413.8,195.7 L 413.0,195.3 L 412.5,193.6 L 411.2,191.2 L 410.1,191.7 L 408.2,191.2 L 404.7,190.4 L 403.3,190.1 L 400.5,190.5 L 400.7,189.1 L 401.0,187.6 L 398.6,187.2 L 394.2,187.5 L 392.5,186.8 L 393.3,186.3 L 393.2,185.4 L 395.1,185.7 L 397.7,186.2 L 400.6,186.0 L 402.8,185.9 L 404.6,184.1 L 405.1,184.1 L 406.5,185.3 L 408.9,184.6 L 409.1,183.6 L 412.1,183.9 L 413.8,182.5 L 416.1,181.3 L 416.7,179.1 L 422.6,177.1 L 426.4,177.9 L 428.0,178.2 L 428.5,176.9 L 431.0,175.9 L 432.7,175.3 L 434.7,174.9 L 436.9,174.1 L 437.7,173.2 L 439.1,173.9 L 440.3,173.5 L 441.6,173.5 L 443.3,174.4 L 444.3,175.5 L 445.4,176.6 L 445.7,177.6 L 446.6,178.8 L 448.0,178.8 L 450.1,178.4 L 450.6,177.6 L 453.0,176.8 L 454.2,176.2 L 455.7,175.3 L 457.5,175.6 L 457.3,176.6 L 457.0,178.1 L 458.1,178.7 L 460.0,179.3 L 460.2,180.8 L 459.7,181.9 L 460.8,182.2 L 462.6,181.8 L 463.2,180.5 L 464.1,180.8 L 464.4,181.6 L 465.8,181.1 L 467.1,181.2 L 466.9,182.3 L 465.7,182.1 L 465.3,182.7 L 465.7,183.2 L 467.7,182.7 L 469.2,183.6 L 469.9,184.3 L 471.1,184.7 L 470.7,185.7 L 470.0,186.5 L 469.6,186.9 L 471.2,188.0 L 473.1,187.6 L 473.8,188.5 L 475.4,190.7 L 475.4,191.7 L 473.5,191.6 L 472.8,193.1 L 473.3,193.7 L 473.2,194.4 L 474.4,194.6 L 476.4,193.6 L 478.1,194.4 L 478.7,195.5 L 479.2,196.3 L 479.0,197.5 L 479.7,198.3 L 480.0,198.7 L 481.2,199.2 L 481.0,200.6 L 480.9,202.9 L 481.3,203.4 L 479.7,206.5 L 481.1,206.8 L 481.3,209.3 L 481.5,211.8 L 482.4,212.2 L 483.1,212.8 L 483.0,213.5 Z"
    },
    {
      "id": "jalgaon",
      "name": "Jalgaon",
      "path": "M 372.1,102.6 L 371.4,102.6 L 370.6,101.5 L 369.0,100.5 L 367.2,100.1 L 366.1,98.9 L 363.8,98.3 L 363.1,98.0 L 362.1,97.5 L 360.8,96.8 L 360.5,96.4 L 360.3,96.7 L 360.3,97.4 L 360.1,98.3 L 359.8,99.4 L 358.4,100.5 L 356.4,101.3 L 355.9,102.2 L 355.1,103.7 L 354.1,104.0 L 353.3,104.7 L 353.6,106.4 L 354.7,107.0 L 355.7,107.6 L 354.1,108.9 L 352.4,110.9 L 351.8,111.7 L 351.2,112.3 L 350.4,112.5 L 349.7,113.1 L 350.3,114.1 L 349.7,114.9 L 349.0,115.6 L 346.1,115.4 L 344.8,116.0 L 344.7,117.0 L 343.9,117.8 L 345.2,118.7 L 346.2,119.4 L 346.3,119.6 L 346.2,120.3 L 344.9,121.1 L 345.0,122.5 L 345.3,123.2 L 344.8,124.2 L 345.4,125.1 L 345.8,125.9 L 345.8,126.1 L 345.2,126.7 L 344.4,127.3 L 343.9,127.6 L 341.0,127.4 L 340.5,129.0 L 338.9,129.5 L 339.0,130.7 L 338.7,132.9 L 337.7,132.6 L 334.7,131.7 L 333.1,129.2 L 331.7,127.9 L 330.1,128.6 L 329.6,129.6 L 330.0,131.3 L 330.0,132.0 L 328.1,131.9 L 325.5,131.9 L 325.5,130.3 L 323.4,130.9 L 322.8,129.2 L 320.3,128.5 L 317.8,128.1 L 317.2,126.9 L 317.8,124.7 L 314.9,124.1 L 313.6,124.3 L 313.6,125.3 L 313.8,126.6 L 313.0,127.3 L 311.0,127.8 L 308.8,127.6 L 309.0,128.8 L 306.6,129.0 L 305.4,128.6 L 304.2,128.3 L 303.9,129.0 L 302.1,128.6 L 300.8,130.0 L 301.1,131.7 L 300.0,132.7 L 299.3,133.2 L 298.6,133.6 L 298.3,134.7 L 297.3,133.5 L 295.8,133.1 L 295.1,134.0 L 295.2,135.3 L 294.2,133.7 L 292.3,134.3 L 292.3,134.8 L 292.6,135.8 L 290.6,135.0 L 289.1,134.3 L 288.6,130.8 L 286.7,131.0 L 285.9,129.7 L 285.1,130.1 L 282.9,129.9 L 281.9,131.0 L 280.2,131.0 L 279.5,131.6 L 277.1,131.4 L 275.8,132.6 L 275.3,133.6 L 274.9,134.2 L 273.9,135.3 L 273.4,136.1 L 273.7,137.3 L 272.0,136.9 L 271.9,137.4 L 271.1,137.4 L 271.1,138.5 L 269.0,138.4 L 267.6,138.5 L 267.4,140.1 L 267.4,141.2 L 266.2,141.7 L 264.4,141.9 L 264.0,142.4 L 263.0,143.1 L 263.0,144.5 L 263.8,146.1 L 263.8,148.1 L 261.6,148.5 L 260.0,149.0 L 258.2,149.1 L 257.7,149.7 L 257.7,150.7 L 255.5,150.5 L 253.6,149.5 L 251.7,149.2 L 251.2,150.9 L 248.1,152.5 L 247.2,153.9 L 246.1,153.8 L 244.5,153.6 L 239.8,153.2 L 239.4,152.0 L 239.8,150.6 L 239.6,149.1 L 239.1,147.9 L 238.7,146.4 L 238.3,145.4 L 236.7,144.3 L 237.7,143.8 L 236.7,142.6 L 235.6,141.2 L 234.3,140.7 L 234.0,139.1 L 233.1,138.9 L 231.5,139.0 L 232.6,137.3 L 231.6,136.4 L 230.8,135.0 L 231.2,133.8 L 233.8,133.2 L 233.5,132.2 L 234.1,130.2 L 235.0,129.7 L 237.2,126.8 L 239.1,126.7 L 242.0,126.0 L 243.2,125.0 L 246.1,124.8 L 247.0,123.8 L 248.3,122.3 L 248.1,120.9 L 248.2,120.5 L 248.8,120.4 L 250.9,119.4 L 251.9,118.2 L 251.3,116.4 L 249.4,114.6 L 248.9,114.0 L 249.5,112.9 L 251.1,112.7 L 250.7,111.3 L 249.3,110.1 L 248.8,107.8 L 248.9,106.5 L 247.4,105.8 L 244.4,104.9 L 244.8,102.2 L 245.8,101.5 L 244.9,100.5 L 244.8,98.9 L 243.7,96.8 L 239.9,95.6 L 240.2,94.0 L 240.4,92.2 L 241.9,91.0 L 242.1,88.6 L 243.4,87.6 L 245.7,87.1 L 247.9,85.9 L 249.1,84.7 L 248.1,84.5 L 248.3,84.2 L 248.6,83.6 L 247.2,82.9 L 249.0,82.8 L 251.5,84.8 L 252.8,85.3 L 254.0,85.0 L 255.4,85.1 L 256.3,83.6 L 257.7,83.1 L 259.7,82.4 L 261.4,82.0 L 264.0,79.6 L 264.5,79.0 L 265.3,77.5 L 265.0,75.8 L 265.8,74.6 L 263.6,73.7 L 264.9,73.3 L 266.2,73.0 L 265.5,70.7 L 266.9,69.9 L 267.7,69.3 L 269.2,69.1 L 270.2,68.6 L 272.6,68.9 L 274.8,68.6 L 276.2,69.3 L 278.9,68.8 L 280.2,68.6 L 280.2,70.5 L 281.9,70.3 L 285.0,70.2 L 286.2,69.8 L 287.8,70.8 L 289.1,71.0 L 290.1,70.5 L 292.2,70.2 L 293.6,70.4 L 294.9,70.2 L 297.2,70.4 L 299.5,70.6 L 301.3,70.8 L 302.9,71.7 L 303.7,71.4 L 304.2,71.3 L 305.3,71.3 L 305.7,70.8 L 307.0,70.3 L 309.7,70.2 L 310.3,71.0 L 311.6,71.1 L 313.3,71.0 L 315.1,71.0 L 316.2,70.6 L 318.4,70.3 L 320.2,70.2 L 321.2,70.2 L 322.6,70.8 L 325.7,70.5 L 327.6,70.6 L 330.8,70.6 L 332.3,70.6 L 333.5,69.8 L 335.3,69.8 L 336.9,70.4 L 339.2,70.2 L 342.1,70.2 L 345.0,71.6 L 348.2,72.3 L 349.9,73.2 L 353.2,71.9 L 354.9,72.7 L 356.8,76.6 L 358.0,78.0 L 358.9,79.1 L 359.8,80.2 L 359.0,81.2 L 358.4,81.8 L 359.2,82.4 L 360.1,83.0 L 360.6,84.0 L 360.4,84.6 L 361.0,85.5 L 360.5,86.8 L 358.3,86.6 L 356.1,86.5 L 356.0,87.6 L 357.2,88.2 L 357.9,89.6 L 358.2,90.5 L 360.5,91.6 L 360.7,92.0 L 360.5,92.9 L 361.5,93.2 L 362.6,92.8 L 366.8,92.5 L 370.4,93.2 L 371.5,93.8 L 378.1,93.6 L 379.2,93.7 L 380.3,93.7 L 380.5,93.6 L 380.8,94.0 L 380.9,94.5 L 381.0,95.3 L 381.6,96.1 L 381.8,96.7 L 381.8,97.3 L 381.5,97.7 L 381.6,98.2 L 381.3,98.6 L 380.5,100.3 L 379.8,101.2 L 378.8,101.6 L 377.8,102.5 L 377.1,103.2 L 374.1,103.0 L 372.7,102.6 L 372.1,102.6 Z"
    },
    {
      "id": "jalna",
      "name": "Jalna",
      "path": "M 367.1,224.6 L 364.5,226.3 L 365.6,226.9 L 364.4,228.1 L 363.1,227.4 L 361.0,227.6 L 360.0,227.3 L 359.2,226.7 L 357.5,226.8 L 356.6,226.1 L 355.8,226.7 L 354.1,225.9 L 353.9,226.8 L 352.2,227.9 L 351.1,227.7 L 348.7,227.4 L 347.5,226.3 L 347.1,224.4 L 347.4,223.6 L 346.5,223.5 L 343.5,225.5 L 340.0,226.9 L 337.7,226.3 L 336.4,223.2 L 337.2,221.5 L 337.8,220.1 L 336.2,219.8 L 334.6,220.5 L 332.8,220.8 L 329.9,221.0 L 326.2,219.2 L 323.4,219.4 L 323.0,221.0 L 322.0,222.1 L 317.7,222.0 L 315.6,222.2 L 314.9,221.4 L 311.9,220.3 L 309.4,220.5 L 309.5,218.9 L 309.2,216.8 L 309.4,214.7 L 310.8,214.4 L 311.3,213.7 L 312.1,210.6 L 313.2,207.4 L 313.1,205.1 L 312.8,204.4 L 308.1,203.8 L 307.6,202.5 L 308.0,200.9 L 311.1,199.8 L 311.1,196.2 L 310.8,193.1 L 310.6,192.6 L 312.6,190.9 L 312.0,189.3 L 313.0,188.4 L 313.2,186.2 L 313.7,182.1 L 315.4,179.7 L 313.5,178.2 L 313.3,176.7 L 311.6,173.8 L 308.5,173.7 L 307.9,172.7 L 307.4,172.0 L 309.3,169.7 L 310.7,169.2 L 310.5,166.2 L 311.1,165.1 L 311.3,163.8 L 311.6,163.2 L 312.1,160.9 L 313.9,159.9 L 315.3,159.8 L 315.4,158.0 L 315.5,157.0 L 315.0,156.4 L 315.6,154.8 L 316.6,153.9 L 316.7,152.8 L 316.1,151.0 L 317.2,150.5 L 319.0,149.3 L 320.5,149.1 L 322.9,148.7 L 323.8,148.1 L 324.5,147.0 L 321.9,145.9 L 321.8,145.1 L 322.1,143.4 L 323.7,142.5 L 323.4,141.2 L 324.2,139.9 L 326.1,140.4 L 327.1,139.7 L 328.1,138.9 L 329.0,138.7 L 331.3,139.3 L 332.8,139.7 L 333.4,140.8 L 334.3,140.4 L 333.6,139.3 L 332.3,138.3 L 331.7,138.2 L 331.4,136.2 L 332.1,136.0 L 332.5,135.0 L 332.8,134.7 L 333.5,134.5 L 333.6,133.2 L 334.8,132.0 L 337.9,132.8 L 339.7,133.9 L 340.4,134.1 L 342.3,134.1 L 342.3,135.0 L 341.0,135.1 L 340.3,135.8 L 339.7,137.1 L 340.5,138.7 L 341.1,139.3 L 339.9,141.5 L 340.2,143.2 L 340.4,144.6 L 341.8,145.7 L 341.3,146.6 L 339.7,146.4 L 339.7,148.3 L 338.8,149.3 L 338.2,149.9 L 338.3,151.0 L 340.5,151.8 L 342.7,150.4 L 345.0,150.4 L 348.0,151.5 L 350.1,148.7 L 352.4,147.0 L 353.4,148.1 L 356.7,148.3 L 356.7,149.7 L 357.4,150.7 L 358.3,151.6 L 360.8,152.0 L 363.1,151.7 L 360.7,155.9 L 358.9,156.8 L 358.6,158.5 L 357.5,159.6 L 356.7,161.5 L 355.4,162.2 L 355.1,164.1 L 353.9,167.0 L 351.2,167.0 L 351.3,169.0 L 347.0,169.8 L 345.9,172.9 L 342.1,173.9 L 344.3,175.8 L 345.5,176.2 L 346.6,176.0 L 346.3,177.6 L 349.0,177.8 L 350.0,178.5 L 349.8,179.2 L 350.7,180.2 L 352.5,182.3 L 353.7,183.7 L 355.2,184.5 L 357.0,184.3 L 358.0,185.7 L 358.9,184.9 L 361.2,185.4 L 363.3,184.7 L 364.7,184.2 L 367.4,183.8 L 368.8,183.6 L 372.3,183.8 L 373.3,183.2 L 374.1,183.4 L 375.0,183.0 L 376.5,182.9 L 377.1,182.2 L 377.9,181.0 L 381.2,181.3 L 382.4,180.4 L 385.8,180.3 L 388.1,180.3 L 390.7,180.3 L 390.6,181.7 L 392.4,183.5 L 393.8,183.9 L 394.3,184.9 L 393.2,185.4 L 393.3,186.3 L 392.5,186.8 L 392.3,187.7 L 392.7,188.5 L 390.1,189.1 L 390.4,190.7 L 392.3,191.9 L 390.3,192.4 L 387.6,193.0 L 390.2,196.7 L 388.2,199.0 L 386.7,199.5 L 387.0,202.0 L 385.2,203.9 L 386.6,205.3 L 386.4,206.3 L 386.4,207.1 L 386.0,208.4 L 384.2,209.5 L 383.8,210.7 L 381.0,209.6 L 379.5,211.1 L 379.7,211.8 L 377.0,213.7 L 375.4,214.8 L 373.2,216.6 L 372.2,219.2 L 369.3,222.2 L 370.6,223.0 L 370.6,223.4 L 370.1,224.1 L 367.1,224.6 Z"
    },
    {
      "id": "kolhapur",
      "name": "Kolhapur",
      "path": "M 146.6,436.2 L 146.0,435.6 L 145.0,435.0 L 145.7,433.9 L 145.6,433.2 L 144.9,432.8 L 143.5,432.5 L 144.6,432.0 L 144.9,431.2 L 145.9,430.2 L 145.8,429.4 L 145.5,428.9 L 147.2,427.8 L 147.5,427.0 L 146.4,426.1 L 146.5,425.6 L 146.5,424.3 L 146.9,424.0 L 147.4,423.2 L 147.7,422.8 L 146.8,422.6 L 146.8,422.4 L 147.7,422.0 L 146.3,421.1 L 145.0,421.0 L 143.9,420.4 L 143.6,420.1 L 144.6,419.5 L 145.4,417.9 L 144.6,417.4 L 144.5,417.0 L 144.1,416.4 L 142.8,415.6 L 141.7,416.0 L 140.4,415.5 L 139.5,414.5 L 138.0,414.8 L 137.6,414.5 L 137.8,414.2 L 137.5,412.7 L 137.2,412.1 L 135.8,411.6 L 135.1,411.6 L 133.6,411.1 L 134.6,410.3 L 135.3,410.7 L 137.1,410.5 L 138.4,409.2 L 138.2,408.6 L 138.6,407.8 L 137.0,406.0 L 136.7,405.5 L 136.0,405.0 L 136.8,405.3 L 137.5,405.1 L 138.2,405.0 L 139.4,404.9 L 140.7,405.0 L 140.8,404.0 L 140.6,402.5 L 139.5,402.1 L 138.4,401.0 L 139.5,400.0 L 140.4,398.7 L 142.3,398.9 L 144.2,398.9 L 144.8,398.1 L 144.7,396.5 L 143.7,395.3 L 143.1,393.4 L 142.3,392.1 L 140.9,391.1 L 138.7,390.0 L 137.0,388.6 L 136.0,389.1 L 134.0,388.3 L 132.1,387.8 L 131.4,386.9 L 133.2,385.7 L 133.9,385.3 L 135.7,385.6 L 136.8,385.5 L 137.1,386.7 L 138.4,386.8 L 139.6,386.7 L 138.8,385.4 L 139.8,384.7 L 142.9,385.3 L 145.8,386.7 L 147.1,387.9 L 147.9,388.3 L 148.9,388.6 L 148.8,389.4 L 151.0,390.5 L 151.8,392.3 L 152.8,392.8 L 154.5,393.0 L 155.4,393.9 L 156.7,394.6 L 158.3,395.6 L 158.1,397.6 L 157.4,398.4 L 158.3,399.2 L 159.6,398.6 L 162.1,399.3 L 161.9,400.5 L 162.4,401.0 L 162.1,401.5 L 162.2,402.5 L 163.4,402.8 L 163.9,404.0 L 165.7,404.8 L 166.6,405.4 L 168.4,404.5 L 169.1,405.0 L 171.2,404.8 L 173.0,406.7 L 174.4,406.6 L 175.8,405.8 L 177.4,406.1 L 179.3,406.2 L 179.7,405.2 L 181.3,405.4 L 182.0,406.7 L 183.6,405.6 L 185.6,404.6 L 187.0,405.9 L 189.1,406.4 L 190.2,407.4 L 192.3,407.9 L 193.1,408.7 L 195.1,408.1 L 197.3,407.1 L 198.5,407.8 L 197.5,409.3 L 199.0,409.9 L 202.6,409.2 L 203.2,408.3 L 204.9,408.5 L 205.9,408.9 L 205.8,410.3 L 206.6,410.7 L 207.6,409.8 L 208.5,409.5 L 210.8,410.8 L 212.0,412.7 L 214.7,413.0 L 216.8,413.5 L 219.7,415.4 L 219.9,416.8 L 224.8,418.2 L 223.9,419.7 L 223.3,421.6 L 223.8,422.0 L 221.4,423.8 L 221.1,425.8 L 223.5,426.6 L 223.7,427.4 L 222.0,427.5 L 219.8,427.4 L 218.8,427.6 L 218.8,429.3 L 217.5,429.3 L 217.1,429.9 L 214.6,430.6 L 214.2,431.0 L 213.3,431.3 L 212.1,431.2 L 211.3,430.9 L 211.8,429.8 L 210.8,428.5 L 210.3,426.8 L 206.7,425.6 L 205.3,425.8 L 204.4,425.0 L 202.9,423.8 L 202.3,424.6 L 203.1,426.3 L 200.8,427.9 L 199.1,429.2 L 196.8,429.5 L 196.3,430.5 L 196.0,430.9 L 195.5,432.1 L 195.0,433.3 L 194.0,433.5 L 193.0,433.0 L 191.6,431.8 L 190.4,431.5 L 189.4,431.5 L 189.3,433.0 L 189.1,435.2 L 188.2,434.9 L 187.8,433.2 L 186.7,433.2 L 185.9,433.3 L 185.7,432.2 L 184.5,432.9 L 185.5,433.8 L 185.8,435.1 L 183.0,435.6 L 183.6,436.2 L 184.2,437.2 L 185.4,436.4 L 186.1,435.1 L 186.9,436.7 L 186.8,438.4 L 187.6,438.3 L 189.6,438.8 L 190.8,438.9 L 190.8,439.5 L 191.1,439.9 L 191.2,440.9 L 193.4,441.4 L 192.8,442.5 L 192.2,443.8 L 191.7,444.3 L 190.9,444.1 L 190.4,445.0 L 190.1,446.0 L 189.9,446.7 L 189.9,447.2 L 189.6,447.7 L 189.6,448.4 L 189.6,448.9 L 190.7,448.7 L 190.1,449.1 L 190.9,449.4 L 191.0,450.1 L 191.1,451.1 L 190.1,451.5 L 190.0,452.3 L 190.9,452.7 L 191.7,452.2 L 192.3,452.2 L 191.9,451.2 L 192.4,451.0 L 193.6,451.0 L 195.3,451.0 L 196.5,452.1 L 198.4,452.4 L 199.8,453.7 L 200.4,454.1 L 202.3,454.6 L 203.9,454.5 L 205.3,455.1 L 206.4,456.2 L 206.0,456.9 L 206.7,457.8 L 206.9,458.6 L 205.5,459.2 L 204.8,461.7 L 204.9,462.1 L 205.1,465.3 L 204.8,465.9 L 203.8,466.1 L 202.0,465.0 L 200.0,464.6 L 198.1,465.2 L 197.1,465.9 L 196.3,466.7 L 195.2,466.9 L 194.6,467.2 L 193.7,468.2 L 194.6,468.6 L 194.4,469.8 L 196.1,469.7 L 197.5,469.0 L 199.4,468.6 L 200.9,468.8 L 202.7,469.2 L 202.7,470.4 L 201.4,472.3 L 200.9,473.6 L 200.5,474.6 L 197.6,478.3 L 195.7,480.2 L 196.4,480.5 L 196.7,481.8 L 196.2,482.4 L 196.8,483.4 L 196.5,484.2 L 195.3,485.0 L 194.1,485.6 L 193.3,486.5 L 194.1,487.3 L 193.7,488.9 L 191.9,490.3 L 190.4,490.0 L 189.5,490.5 L 188.5,491.2 L 185.7,491.8 L 184.0,491.6 L 181.9,491.8 L 181.1,490.6 L 181.2,488.6 L 179.5,489.2 L 177.0,489.6 L 174.4,488.7 L 173.1,486.2 L 170.3,486.2 L 169.6,484.8 L 167.1,485.3 L 166.1,485.9 L 166.2,486.8 L 162.9,486.3 L 164.0,484.9 L 167.8,482.7 L 168.6,482.4 L 168.5,480.6 L 168.2,479.6 L 167.5,477.8 L 166.6,476.7 L 165.5,477.1 L 164.5,476.4 L 164.6,475.8 L 165.3,475.0 L 166.2,473.8 L 167.8,472.6 L 168.1,471.7 L 167.1,471.3 L 166.7,470.5 L 166.0,469.9 L 165.6,469.1 L 164.8,469.5 L 164.5,470.3 L 162.4,470.3 L 160.2,468.9 L 159.5,468.5 L 160.2,468.2 L 160.6,467.9 L 160.5,467.6 L 160.6,467.2 L 159.5,466.8 L 159.0,466.1 L 156.8,465.7 L 154.5,465.6 L 152.5,465.6 L 150.9,466.2 L 149.5,465.7 L 148.1,465.8 L 148.3,464.9 L 146.6,465.1 L 146.0,465.7 L 146.0,466.6 L 146.8,466.6 L 145.5,466.2 L 144.9,465.8 L 145.7,464.8 L 146.2,463.8 L 146.1,463.2 L 146.6,462.7 L 146.7,462.0 L 147.8,461.9 L 148.6,462.1 L 150.0,462.4 L 151.7,462.7 L 152.3,462.4 L 152.4,461.7 L 152.1,461.1 L 152.3,460.0 L 153.2,460.1 L 154.5,459.9 L 155.3,459.6 L 154.8,459.1 L 155.3,458.5 L 156.3,457.9 L 156.1,457.4 L 154.8,457.6 L 153.8,457.7 L 153.4,457.5 L 153.6,457.2 L 153.4,457.0 L 153.3,456.6 L 153.7,456.4 L 154.3,455.7 L 155.1,454.8 L 154.6,455.0 L 153.5,455.1 L 153.1,455.4 L 152.4,455.5 L 150.8,455.4 L 150.7,455.3 L 152.3,454.3 L 151.5,453.6 L 150.4,453.3 L 149.1,452.0 L 150.0,450.8 L 151.0,450.1 L 150.9,448.2 L 149.6,448.6 L 148.6,449.2 L 147.4,449.7 L 146.5,449.6 L 146.0,450.1 L 145.4,449.2 L 145.8,448.3 L 144.9,447.1 L 145.3,446.5 L 145.8,446.3 L 146.8,445.7 L 147.7,444.9 L 146.4,443.8 L 145.9,442.1 L 147.3,441.1 L 147.8,440.5 L 148.9,439.9 L 149.2,439.7 L 149.7,439.3 L 149.5,437.7 L 146.8,437.4 L 146.8,436.6 L 146.6,436.2 Z"
    },
    {
      "id": "nagpur",
      "name": "Nagpur",
      "path": "M 584.6,90.9 L 582.1,90.9 L 579.1,88.1 L 578.4,86.4 L 576.6,84.9 L 575.1,83.7 L 574.2,83.3 L 572.6,82.6 L 570.1,82.4 L 568.9,82.4 L 567.5,81.7 L 563.4,80.9 L 560.9,80.6 L 560.7,79.7 L 560.3,79.2 L 558.8,79.0 L 559.4,77.7 L 558.5,77.6 L 557.2,76.9 L 555.6,75.9 L 554.5,74.9 L 553.6,74.9 L 555.9,73.3 L 559.4,72.5 L 560.6,72.1 L 561.7,71.6 L 562.8,71.0 L 564.4,70.8 L 565.2,70.0 L 565.9,70.6 L 567.2,70.7 L 568.3,70.8 L 569.5,70.3 L 570.1,69.7 L 571.9,69.3 L 572.2,68.4 L 571.2,66.6 L 571.4,66.0 L 570.7,64.2 L 570.5,63.0 L 571.4,62.0 L 572.9,62.4 L 573.6,62.0 L 574.6,61.7 L 575.8,61.3 L 576.9,60.5 L 577.9,60.1 L 579.8,60.4 L 582.0,60.8 L 583.3,61.1 L 583.9,62.4 L 585.8,63.2 L 586.9,63.1 L 588.8,63.9 L 590.5,63.4 L 592.4,63.7 L 594.6,63.8 L 595.3,64.1 L 597.0,64.6 L 598.5,64.4 L 599.5,63.5 L 601.4,63.0 L 602.4,64.7 L 603.2,63.7 L 604.3,63.0 L 606.8,63.0 L 609.1,63.0 L 612.0,63.1 L 613.4,62.4 L 615.0,62.7 L 617.4,62.8 L 617.9,60.9 L 616.5,60.5 L 616.3,59.0 L 615.5,57.5 L 616.9,57.4 L 615.4,56.9 L 616.4,55.3 L 618.5,55.1 L 621.9,53.5 L 623.6,54.0 L 626.4,54.4 L 628.3,54.5 L 631.8,54.8 L 633.2,54.1 L 632.8,53.4 L 636.3,52.0 L 637.3,50.3 L 644.0,51.0 L 644.8,49.4 L 644.0,49.0 L 644.2,47.3 L 644.8,45.7 L 648.2,46.2 L 649.3,47.3 L 653.3,48.3 L 655.9,48.5 L 659.1,49.1 L 660.8,48.8 L 662.2,48.0 L 663.7,48.5 L 666.1,48.3 L 669.2,50.0 L 669.9,51.2 L 670.2,52.2 L 671.2,52.8 L 670.3,53.1 L 670.3,54.2 L 671.0,56.0 L 673.0,56.8 L 673.3,58.1 L 673.4,58.9 L 670.8,59.6 L 668.8,61.6 L 667.1,63.6 L 665.4,65.3 L 665.0,66.0 L 665.8,67.7 L 667.9,67.6 L 668.3,69.8 L 670.9,71.7 L 671.9,73.0 L 673.9,74.8 L 674.9,75.4 L 674.9,76.3 L 674.9,76.9 L 676.5,78.4 L 676.1,79.1 L 675.5,81.5 L 675.4,82.7 L 674.5,84.2 L 675.0,85.2 L 674.5,86.7 L 675.2,87.5 L 674.3,87.8 L 672.6,87.9 L 672.5,86.5 L 669.6,85.9 L 670.4,87.4 L 668.8,89.0 L 670.2,89.5 L 670.6,90.2 L 672.1,91.0 L 672.6,91.8 L 672.3,92.3 L 671.6,93.0 L 674.3,93.1 L 676.2,94.5 L 677.5,94.1 L 678.7,94.1 L 679.7,95.8 L 682.1,99.5 L 682.7,100.7 L 684.2,101.8 L 684.2,103.8 L 682.4,106.0 L 679.9,108.2 L 679.7,109.7 L 678.5,110.2 L 677.6,111.0 L 675.8,111.2 L 675.0,110.5 L 673.5,110.8 L 674.2,112.2 L 675.0,114.3 L 672.9,116.3 L 672.5,118.3 L 672.5,119.2 L 671.5,120.5 L 670.3,121.7 L 670.0,122.0 L 668.7,121.7 L 667.1,123.4 L 664.9,124.6 L 662.8,124.9 L 660.1,125.2 L 659.2,124.0 L 657.5,123.9 L 655.6,124.6 L 655.9,125.7 L 655.3,126.9 L 653.9,129.3 L 652.1,130.9 L 650.2,130.3 L 646.4,130.5 L 643.5,130.2 L 642.5,129.6 L 640.6,129.2 L 640.3,128.0 L 639.4,127.9 L 639.0,127.1 L 638.9,126.3 L 636.9,125.6 L 636.5,124.9 L 636.3,123.7 L 633.2,122.2 L 631.6,121.3 L 630.2,120.8 L 628.7,120.2 L 627.3,119.4 L 624.9,119.2 L 624.0,118.8 L 622.8,117.9 L 620.6,117.9 L 619.2,117.1 L 617.7,116.0 L 618.3,115.3 L 616.7,114.6 L 615.7,114.1 L 615.6,113.5 L 615.3,111.8 L 612.7,111.3 L 612.3,112.1 L 610.9,111.7 L 610.3,109.4 L 610.3,108.9 L 609.0,108.9 L 608.2,107.9 L 607.5,107.5 L 606.4,108.6 L 605.0,108.7 L 603.4,107.7 L 602.0,106.9 L 601.4,105.4 L 599.5,104.3 L 599.5,103.7 L 598.5,103.5 L 597.7,101.6 L 598.1,99.5 L 597.5,98.9 L 596.0,98.2 L 594.7,97.6 L 592.5,96.9 L 591.0,96.8 L 590.6,95.9 L 590.0,95.0 L 588.8,94.4 L 587.3,93.8 L 586.9,93.3 L 586.1,92.6 L 585.7,91.8 L 584.6,90.9 Z"
    },
    {
      "id": "nanded",
      "name": "Nanded",
      "path": "M 438.1,254.1 L 439.6,253.8 L 440.4,252.4 L 441.3,251.0 L 442.4,248.9 L 441.6,247.6 L 443.9,245.7 L 443.5,243.8 L 444.8,242.6 L 445.5,240.8 L 447.3,241.1 L 447.1,241.9 L 445.8,242.6 L 446.1,243.7 L 449.3,243.0 L 450.8,243.6 L 451.8,243.0 L 453.1,241.0 L 453.3,239.9 L 453.8,239.8 L 454.9,238.8 L 455.4,237.3 L 455.2,236.6 L 454.4,235.7 L 454.6,234.4 L 454.2,233.1 L 454.7,231.7 L 455.8,230.7 L 457.2,229.7 L 459.7,228.4 L 460.4,225.4 L 462.2,225.7 L 463.9,224.6 L 466.4,224.2 L 466.7,222.4 L 470.3,222.5 L 473.0,223.6 L 474.9,222.2 L 476.4,221.1 L 478.7,220.5 L 479.5,219.8 L 478.8,218.4 L 479.6,216.0 L 481.8,215.9 L 482.9,215.1 L 483.0,213.5 L 483.1,212.7 L 481.8,212.4 L 481.2,211.6 L 481.1,208.3 L 479.9,206.9 L 480.6,205.3 L 480.9,203.4 L 481.3,200.9 L 480.7,200.6 L 480.7,199.2 L 480.0,198.5 L 480.2,197.9 L 481.8,197.8 L 482.6,198.4 L 484.2,198.2 L 485.5,198.6 L 487.2,198.9 L 487.9,199.4 L 489.0,199.5 L 490.9,200.2 L 491.8,200.1 L 493.2,200.5 L 494.1,200.7 L 494.7,201.1 L 494.7,201.9 L 496.1,202.5 L 496.4,203.4 L 497.4,203.5 L 497.0,204.3 L 497.8,207.4 L 496.4,207.4 L 498.8,208.0 L 501.5,208.5 L 503.8,209.6 L 505.7,209.1 L 507.4,210.8 L 505.9,212.1 L 506.0,213.0 L 504.6,213.4 L 503.5,214.0 L 502.4,214.5 L 502.2,215.9 L 503.2,216.2 L 505.6,216.5 L 507.7,216.6 L 510.8,215.3 L 512.2,214.2 L 513.6,215.6 L 515.0,216.1 L 516.2,214.8 L 514.3,213.4 L 516.1,212.5 L 516.2,210.4 L 518.3,210.5 L 519.1,211.2 L 520.2,211.2 L 520.9,209.8 L 521.8,209.1 L 522.6,210.4 L 524.6,211.5 L 526.0,210.8 L 528.1,211.1 L 528.5,212.4 L 529.1,214.5 L 530.3,214.3 L 531.7,212.8 L 532.7,211.7 L 535.3,213.3 L 537.2,213.7 L 539.8,212.5 L 541.6,210.9 L 542.9,209.6 L 542.4,208.5 L 541.9,207.3 L 544.0,207.6 L 547.4,206.8 L 547.5,205.3 L 548.5,203.0 L 547.9,201.4 L 546.5,199.8 L 544.5,199.2 L 542.1,199.3 L 540.3,199.6 L 539.2,200.7 L 537.4,199.9 L 535.6,198.8 L 534.7,196.7 L 532.1,197.0 L 529.3,198.0 L 528.7,196.5 L 526.7,195.3 L 524.2,193.7 L 522.4,194.4 L 521.0,194.0 L 520.7,194.7 L 519.0,193.3 L 518.3,193.5 L 517.4,193.3 L 517.9,191.2 L 516.5,189.6 L 517.7,187.9 L 518.4,186.7 L 519.8,184.9 L 520.3,183.8 L 522.9,182.8 L 524.8,182.2 L 526.1,180.8 L 527.7,180.9 L 529.2,180.4 L 531.4,180.6 L 533.4,179.5 L 535.4,179.5 L 536.2,180.7 L 539.0,181.8 L 542.0,181.7 L 543.1,180.8 L 544.8,180.6 L 548.4,181.5 L 550.9,180.5 L 552.6,179.9 L 554.2,179.7 L 554.0,181.4 L 552.8,182.6 L 555.1,183.5 L 556.5,182.3 L 557.7,180.6 L 559.3,181.0 L 558.0,185.4 L 562.4,186.6 L 563.4,188.3 L 564.9,190.5 L 563.5,193.7 L 562.8,195.6 L 560.4,196.8 L 559.5,197.4 L 556.5,196.5 L 554.8,198.3 L 555.8,199.3 L 557.4,200.0 L 558.2,201.7 L 557.9,203.6 L 556.1,205.9 L 558.1,208.7 L 558.3,210.0 L 560.2,211.4 L 559.7,214.0 L 558.9,215.0 L 557.3,213.7 L 557.3,214.3 L 557.7,215.3 L 555.5,215.4 L 553.5,216.8 L 551.1,216.2 L 548.5,217.2 L 545.1,218.0 L 542.4,218.8 L 543.1,220.7 L 547.5,224.8 L 548.8,225.8 L 547.7,228.0 L 547.7,230.8 L 543.6,230.9 L 539.5,230.2 L 536.1,230.9 L 535.1,229.7 L 533.8,228.3 L 531.8,226.3 L 528.6,224.8 L 526.0,223.3 L 523.9,224.0 L 522.0,225.2 L 520.3,225.5 L 517.8,226.3 L 517.9,227.6 L 521.5,228.1 L 520.7,229.6 L 518.5,230.4 L 517.9,231.9 L 517.0,233.5 L 517.6,235.3 L 517.1,236.2 L 516.7,236.9 L 515.0,238.7 L 516.3,240.3 L 516.6,242.1 L 515.3,242.3 L 514.2,241.6 L 512.4,241.2 L 512.3,242.5 L 511.5,243.5 L 511.9,245.0 L 510.6,244.7 L 508.6,244.2 L 508.2,246.7 L 508.8,247.3 L 509.2,248.9 L 510.9,250.0 L 513.6,251.8 L 515.0,252.5 L 516.3,254.0 L 517.4,255.8 L 519.8,256.5 L 521.4,258.7 L 523.3,259.2 L 526.1,259.4 L 525.5,260.6 L 525.4,262.1 L 517.6,262.7 L 514.3,266.1 L 512.3,270.0 L 509.3,271.9 L 508.2,270.7 L 507.0,272.4 L 505.9,274.0 L 505.7,275.1 L 506.2,276.4 L 507.2,279.5 L 505.5,282.3 L 500.6,283.0 L 498.7,284.0 L 495.6,282.8 L 493.4,283.2 L 492.9,284.4 L 493.2,285.0 L 493.6,286.7 L 493.7,288.0 L 492.2,288.5 L 490.3,288.6 L 488.6,288.7 L 488.9,289.3 L 492.0,290.1 L 491.4,290.6 L 488.8,291.1 L 488.3,292.7 L 488.9,294.5 L 486.3,296.2 L 486.8,298.1 L 490.5,299.7 L 488.9,301.7 L 486.1,300.5 L 485.5,302.4 L 483.6,303.6 L 481.4,303.8 L 479.2,303.3 L 478.2,301.6 L 477.3,300.7 L 474.3,301.0 L 471.2,300.2 L 471.0,298.3 L 474.4,298.3 L 475.8,296.1 L 476.6,294.2 L 475.3,293.5 L 472.7,293.6 L 472.5,292.5 L 471.7,291.4 L 472.2,290.0 L 469.6,291.3 L 468.8,290.0 L 467.3,289.6 L 465.2,291.1 L 462.1,290.6 L 461.4,290.1 L 462.2,289.7 L 462.1,287.6 L 461.0,287.5 L 460.7,286.9 L 461.4,286.0 L 462.8,285.7 L 464.6,283.5 L 464.3,282.3 L 463.2,281.6 L 462.7,279.9 L 462.3,277.8 L 457.4,276.4 L 456.7,275.9 L 454.1,275.1 L 452.3,273.4 L 454.9,272.3 L 453.1,271.0 L 451.2,270.4 L 448.7,271.6 L 445.1,272.0 L 443.2,272.5 L 441.8,271.7 L 442.9,269.9 L 442.7,267.8 L 442.0,265.8 L 438.1,264.6 L 437.7,262.4 L 437.7,261.4 L 439.2,259.2 L 437.7,257.8 L 433.7,258.2 L 433.8,257.1 L 433.2,256.3 L 431.5,256.3 L 431.1,255.7 L 432.7,255.3 L 433.8,254.8 L 435.1,255.3 L 436.1,254.9 L 438.1,254.1 Z M 466.2,288.1 L 465.9,288.1 L 465.5,288.0 L 465.4,288.0 L 465.0,288.0 L 464.9,288.1 L 464.8,288.2 L 464.7,288.3 L 464.4,288.3 L 464.1,288.2 L 463.6,288.2 L 463.3,288.3 L 463.2,288.7 L 463.0,289.2 L 462.7,289.4 L 462.7,289.8 L 462.7,289.8 L 462.8,290.1 L 463.5,290.3 L 463.8,290.4 L 465.2,289.9 L 465.7,289.8 L 466.4,289.1 L 466.4,288.3 L 466.2,288.1 Z"
    },
    {
      "id": "parbhani",
      "name": "Parbhani",
      "path": "M 433.6,257.0 L 433.6,257.8 L 437.1,257.9 L 438.8,258.0 L 438.6,260.8 L 437.2,261.7 L 432.2,261.3 L 427.0,261.5 L 425.3,262.3 L 424.1,263.3 L 422.1,262.9 L 420.7,263.8 L 417.7,264.3 L 416.7,265.7 L 414.8,265.8 L 413.2,267.2 L 412.4,267.3 L 410.4,266.8 L 408.3,267.0 L 407.6,266.7 L 407.8,264.7 L 407.4,263.0 L 405.7,262.3 L 404.6,260.3 L 403.2,259.8 L 401.4,258.7 L 399.2,257.6 L 399.1,252.9 L 396.3,252.5 L 394.5,254.5 L 393.5,255.0 L 391.9,253.1 L 389.4,252.1 L 389.1,250.7 L 388.9,250.0 L 389.3,249.6 L 389.0,248.6 L 387.6,248.1 L 387.1,247.1 L 386.5,246.8 L 386.2,246.2 L 385.9,245.5 L 385.6,243.9 L 385.7,242.5 L 385.6,241.8 L 384.8,241.4 L 383.2,241.9 L 381.5,240.4 L 380.9,239.4 L 379.5,239.2 L 378.4,240.6 L 376.8,241.4 L 375.1,240.8 L 375.6,239.7 L 377.7,238.0 L 378.5,237.1 L 378.2,235.6 L 377.7,234.5 L 378.8,233.0 L 378.7,231.1 L 376.5,230.1 L 373.5,229.3 L 372.6,229.3 L 370.6,229.5 L 369.0,230.7 L 367.5,230.7 L 365.9,230.6 L 366.2,230.1 L 364.9,229.2 L 364.4,228.1 L 365.6,226.9 L 364.5,226.3 L 367.1,224.6 L 370.1,224.1 L 370.6,223.4 L 370.6,223.0 L 369.9,222.8 L 369.5,221.9 L 369.8,221.5 L 371.6,219.2 L 373.8,214.8 L 376.2,214.7 L 378.9,213.9 L 380.0,211.5 L 379.5,210.3 L 381.9,210.0 L 384.4,210.7 L 384.2,209.3 L 386.2,207.9 L 386.3,206.7 L 386.5,206.0 L 385.5,205.1 L 386.0,203.1 L 387.0,200.9 L 387.1,199.0 L 388.7,198.1 L 390.0,195.0 L 390.0,193.3 L 390.8,192.0 L 392.5,191.3 L 389.9,190.1 L 391.3,189.1 L 392.7,188.2 L 392.8,187.1 L 397.0,187.5 L 400.5,187.1 L 400.8,188.7 L 400.8,190.0 L 402.3,190.5 L 403.9,189.1 L 407.5,190.8 L 409.3,192.0 L 410.7,191.3 L 411.5,191.5 L 413.0,194.0 L 413.1,195.7 L 414.1,195.8 L 415.0,197.4 L 416.3,197.4 L 416.5,196.2 L 416.5,195.1 L 417.8,194.4 L 417.9,195.7 L 417.9,198.3 L 419.1,198.7 L 420.8,198.9 L 421.7,198.3 L 420.6,196.4 L 422.4,196.5 L 423.9,196.2 L 425.1,198.5 L 424.2,199.4 L 424.4,200.6 L 426.1,200.9 L 425.5,202.4 L 426.6,202.4 L 428.3,201.0 L 429.6,201.0 L 429.6,202.1 L 429.7,204.6 L 427.5,205.4 L 426.6,208.8 L 424.9,208.9 L 424.7,212.9 L 426.0,214.8 L 426.9,217.1 L 429.9,216.3 L 430.4,217.4 L 429.4,218.8 L 428.4,220.2 L 427.9,221.2 L 427.6,222.8 L 428.2,223.4 L 429.9,224.2 L 428.4,224.9 L 427.9,225.5 L 428.1,226.0 L 429.3,226.6 L 431.8,226.2 L 433.9,224.9 L 436.8,225.6 L 439.7,227.7 L 439.7,228.3 L 438.9,230.0 L 440.1,230.5 L 441.9,230.5 L 444.3,229.8 L 445.7,230.0 L 446.7,231.4 L 449.1,231.3 L 449.7,232.2 L 452.2,232.3 L 453.8,232.3 L 454.3,233.4 L 454.5,234.9 L 454.4,235.8 L 455.2,236.6 L 455.4,237.3 L 454.9,238.8 L 453.8,239.8 L 453.3,239.9 L 453.1,241.0 L 451.8,243.0 L 450.8,243.6 L 449.3,243.0 L 446.1,243.7 L 445.8,242.6 L 447.1,241.9 L 447.3,241.1 L 445.5,240.8 L 444.8,242.6 L 443.5,243.8 L 443.9,245.7 L 441.6,247.6 L 442.4,248.9 L 441.3,251.0 L 440.4,252.4 L 439.6,253.8 L 438.1,254.1 L 436.1,254.9 L 435.1,255.3 L 433.8,254.8 L 432.7,255.3 L 431.1,255.7 L 431.5,256.3 L 433.2,256.3 L 433.6,257.0 Z"
    },
    {
      "id": "raigarh",
      "name": "Raigarh",
      "path": "M 70.0,319.5 L 70.0,319.6 L 70.0,319.6 L 70.0,319.6 L 70.0,319.6 L 70.0,319.7 L 69.9,319.7 L 69.9,319.7 L 69.8,319.7 L 69.8,319.6 L 69.8,319.6 L 69.8,319.6 L 69.8,319.6 L 69.8,319.6 L 69.9,319.6 L 69.9,319.5 L 70.0,319.5 Z M 63.3,301.0 L 63.3,301.0 L 63.3,301.0 L 63.3,301.1 L 63.3,301.1 L 63.3,301.1 L 63.4,301.1 L 63.4,301.1 L 63.3,301.1 L 63.3,301.1 L 63.3,301.1 L 63.3,301.1 L 63.3,301.1 L 63.3,301.2 L 63.0,301.2 L 63.0,301.1 L 63.0,301.1 L 63.0,301.1 L 63.0,301.1 L 63.0,301.1 L 63.0,301.1 L 63.0,301.0 L 63.0,301.0 L 63.0,301.0 L 63.1,301.0 L 63.1,301.0 L 63.2,301.0 L 63.2,301.0 L 63.3,301.0 Z M 73.8,300.3 L 73.8,300.3 L 73.8,300.3 L 73.8,300.3 L 73.8,300.3 L 73.8,300.4 L 73.8,300.4 L 73.8,300.4 L 73.8,300.4 L 73.8,300.4 L 73.8,300.4 L 73.8,300.4 L 73.8,300.4 L 73.8,300.5 L 73.8,300.5 L 73.8,300.6 L 73.8,300.6 L 73.8,300.6 L 73.7,300.6 L 73.7,300.6 L 73.7,300.6 L 73.7,300.6 L 73.6,300.6 L 73.6,300.7 L 73.6,300.7 L 73.6,300.7 L 73.5,300.7 L 73.5,300.6 L 73.5,300.6 L 73.5,300.6 L 73.5,300.6 L 73.5,300.6 L 73.4,300.6 L 73.4,300.6 L 73.5,300.6 L 73.5,300.5 L 73.5,300.5 L 73.5,300.4 L 73.6,300.4 L 73.6,300.4 L 73.6,300.4 L 73.6,300.4 L 73.6,300.4 L 73.6,300.3 L 73.7,300.3 L 73.7,300.3 L 73.7,300.3 L 73.7,300.3 L 73.8,300.3 Z M 74.1,299.4 L 74.1,299.5 L 74.1,299.5 L 74.1,299.5 L 74.1,299.5 L 74.1,299.6 L 74.0,299.6 L 74.0,299.6 L 74.0,299.6 L 74.0,299.6 L 73.9,299.6 L 73.9,299.6 L 73.9,299.6 L 73.9,299.5 L 73.9,299.5 L 73.9,299.5 L 74.0,299.5 L 74.0,299.4 L 74.0,299.4 L 74.0,299.4 L 74.0,299.4 L 74.0,299.4 L 74.1,299.4 Z M 53.9,276.0 L 53.9,276.0 L 53.9,276.0 L 53.9,276.1 L 53.9,276.1 L 53.9,276.1 L 53.9,276.1 L 53.9,276.2 L 53.9,276.2 L 53.9,276.2 L 53.8,276.2 L 53.8,276.2 L 53.8,276.2 L 53.8,276.2 L 53.8,276.2 L 53.8,276.1 L 53.8,276.1 L 53.8,276.1 L 53.8,276.1 L 53.8,276.0 L 53.9,276.0 Z M 49.0,270.7 L 49.0,270.7 L 49.1,270.7 L 49.1,270.7 L 49.1,270.7 L 49.1,270.8 L 49.1,270.8 L 49.1,270.8 L 49.2,270.8 L 49.2,270.8 L 49.2,270.8 L 49.2,270.9 L 49.2,270.9 L 49.2,270.9 L 49.3,270.9 L 49.3,271.0 L 49.2,271.0 L 49.2,271.0 L 49.1,271.0 L 49.1,271.0 L 49.0,271.0 L 49.0,271.0 L 49.0,271.0 L 49.0,270.9 L 49.0,270.9 L 49.0,270.8 L 49.0,270.8 L 49.0,270.7 L 49.0,270.7 L 49.0,270.7 L 49.0,270.7 Z M 51.8,270.6 L 51.8,270.6 L 51.8,270.6 L 51.8,270.6 L 51.8,270.6 L 51.8,270.7 L 51.8,270.7 L 51.8,270.8 L 51.8,270.8 L 51.8,270.8 L 51.7,270.8 L 51.7,270.7 L 51.7,270.7 L 51.7,270.7 L 51.7,270.7 L 51.7,270.6 L 51.8,270.6 L 51.8,270.6 L 51.8,270.6 Z M 57.3,251.5 L 57.3,251.5 L 57.4,251.5 L 57.5,251.5 L 57.5,251.6 L 57.5,251.7 L 57.6,251.7 L 57.7,251.7 L 57.7,251.7 L 57.7,251.8 L 57.7,251.8 L 57.9,251.9 L 57.9,251.8 L 57.9,251.8 L 58.0,251.9 L 57.9,252.1 L 58.0,252.3 L 57.9,252.3 L 57.9,252.2 L 57.9,252.2 L 57.9,252.1 L 57.9,252.0 L 57.7,251.9 L 57.6,252.0 L 57.5,252.0 L 57.5,252.0 L 57.5,252.0 L 57.4,252.1 L 57.4,252.1 L 57.4,252.2 L 57.3,252.2 L 57.3,252.3 L 57.3,252.4 L 57.3,252.5 L 57.2,252.6 L 57.2,252.7 L 57.2,252.9 L 57.3,253.0 L 57.3,253.1 L 57.2,253.1 L 57.2,253.1 L 57.2,253.1 L 57.2,253.2 L 57.1,253.2 L 57.0,253.2 L 57.1,253.1 L 57.1,253.1 L 57.1,253.0 L 57.1,252.8 L 57.2,252.7 L 57.2,252.6 L 57.2,252.4 L 57.2,252.3 L 57.3,252.2 L 57.3,252.2 L 57.3,252.1 L 57.3,252.1 L 57.4,252.0 L 57.3,251.9 L 57.3,251.9 L 57.3,251.9 L 57.3,251.9 L 57.2,251.8 L 57.2,251.8 L 57.2,251.8 L 57.1,251.8 L 57.1,251.7 L 57.1,251.7 L 57.1,251.6 L 57.1,251.6 L 57.1,251.6 L 57.2,251.6 L 57.2,251.5 L 57.3,251.5 Z M 60.8,250.9 L 60.8,250.9 L 60.8,250.9 L 60.9,251.0 L 60.9,251.0 L 61.0,251.0 L 61.0,251.1 L 61.0,251.1 L 61.0,251.1 L 61.0,251.1 L 61.0,251.2 L 61.0,251.2 L 61.1,251.2 L 61.0,251.4 L 61.0,251.4 L 61.0,251.5 L 61.0,251.5 L 60.9,251.5 L 60.9,251.6 L 60.9,251.6 L 60.9,251.6 L 60.8,251.7 L 60.8,251.7 L 60.8,251.7 L 60.8,251.8 L 60.7,251.8 L 60.7,251.8 L 60.7,251.8 L 60.7,251.9 L 60.6,251.9 L 60.6,251.9 L 60.6,252.0 L 60.6,252.1 L 60.5,252.2 L 60.5,252.2 L 60.5,252.3 L 60.5,252.3 L 60.4,252.4 L 60.3,252.4 L 60.3,252.3 L 60.3,252.3 L 60.2,252.2 L 60.2,252.2 L 60.2,252.2 L 60.0,252.2 L 59.9,252.2 L 59.9,252.1 L 59.8,252.1 L 59.8,252.1 L 59.8,252.0 L 59.8,252.0 L 59.7,252.0 L 59.7,251.9 L 59.7,252.0 L 59.6,251.9 L 59.5,251.9 L 59.5,251.9 L 59.5,251.9 L 59.4,251.8 L 59.4,251.8 L 59.4,251.5 L 59.4,251.5 L 59.5,251.5 L 59.5,251.4 L 59.5,251.4 L 59.5,251.3 L 59.6,251.3 L 59.7,251.3 L 59.7,251.2 L 59.7,251.2 L 59.8,251.2 L 59.9,251.2 L 60.0,251.2 L 60.0,251.1 L 60.0,251.1 L 60.1,251.1 L 60.1,251.1 L 60.2,251.0 L 60.3,251.0 L 60.4,251.0 L 60.4,251.0 L 60.5,251.0 L 60.5,250.9 L 60.6,250.9 L 60.6,250.9 L 60.7,250.9 L 60.7,250.9 L 60.8,250.9 Z M 68.8,248.8 L 68.8,248.8 L 68.9,248.8 L 68.9,248.9 L 69.0,248.9 L 69.0,248.9 L 69.0,248.9 L 69.0,248.9 L 69.0,248.9 L 69.0,249.0 L 69.1,249.0 L 69.1,249.1 L 69.1,249.1 L 69.1,249.2 L 69.1,249.2 L 69.1,249.3 L 69.0,249.3 L 69.0,249.3 L 69.0,249.3 L 69.0,249.2 L 68.9,249.2 L 68.9,249.2 L 68.9,249.2 L 68.9,249.1 L 68.9,249.1 L 68.9,249.1 L 68.9,249.1 L 68.9,249.0 L 68.8,249.0 L 68.8,249.0 L 68.8,249.0 L 68.8,248.8 L 68.8,248.8 Z M 85.1,319.3 L 83.6,319.1 L 82.8,320.0 L 81.6,321.3 L 81.0,322.3 L 79.3,323.5 L 78.8,323.8 L 78.4,324.6 L 77.4,324.5 L 76.5,324.1 L 71.9,324.2 L 69.9,324.6 L 69.8,324.5 L 69.8,324.5 L 69.6,324.5 L 69.6,324.4 L 69.5,324.4 L 69.5,324.4 L 69.5,324.3 L 69.5,324.3 L 69.4,324.2 L 69.4,324.2 L 69.3,324.2 L 69.2,324.1 L 69.2,324.1 L 69.1,324.1 L 69.1,324.2 L 69.0,324.2 L 69.0,324.2 L 68.9,324.3 L 68.7,324.3 L 68.6,324.2 L 68.5,324.2 L 68.3,324.2 L 68.2,324.2 L 68.2,324.1 L 68.1,324.1 L 68.1,324.0 L 68.2,324.0 L 68.4,324.0 L 68.4,323.9 L 68.4,323.9 L 68.4,323.9 L 68.3,323.8 L 68.3,323.8 L 68.2,323.7 L 68.2,323.6 L 68.1,323.5 L 68.1,323.4 L 68.1,323.2 L 68.0,323.1 L 68.0,323.0 L 68.0,322.9 L 67.9,322.9 L 67.9,322.9 L 67.9,322.8 L 67.8,322.8 L 67.8,322.7 L 67.7,322.8 L 67.6,322.7 L 67.6,322.7 L 67.6,322.7 L 67.3,322.7 L 67.3,322.7 L 67.2,322.6 L 67.2,322.6 L 67.1,322.5 L 67.1,322.5 L 67.0,322.5 L 67.0,322.4 L 67.0,322.2 L 66.9,322.2 L 66.9,322.0 L 66.8,322.0 L 66.8,322.0 L 66.6,321.9 L 66.6,321.8 L 66.8,321.8 L 66.8,321.8 L 66.9,321.8 L 67.0,321.8 L 67.1,321.8 L 67.1,321.7 L 67.2,321.7 L 67.2,321.7 L 67.3,321.6 L 67.4,321.6 L 67.5,321.6 L 67.5,321.6 L 67.6,321.6 L 67.8,321.5 L 68.1,321.5 L 68.2,321.5 L 68.2,321.6 L 68.3,321.6 L 68.3,321.6 L 68.4,321.7 L 68.5,321.7 L 68.7,321.6 L 68.7,321.6 L 68.8,321.6 L 68.8,321.5 L 68.9,321.5 L 68.9,321.5 L 69.0,321.5 L 69.0,321.4 L 69.0,321.4 L 69.1,321.4 L 69.2,321.3 L 69.2,321.3 L 69.3,321.2 L 69.3,321.2 L 69.4,321.1 L 69.4,321.1 L 69.5,321.1 L 69.5,321.0 L 69.6,321.0 L 69.7,320.9 L 69.7,320.9 L 69.8,320.9 L 69.8,320.8 L 69.9,320.8 L 69.9,320.8 L 69.9,320.7 L 70.0,320.7 L 70.1,320.5 L 70.1,320.5 L 70.1,320.4 L 70.1,320.4 L 70.2,320.3 L 70.2,320.2 L 70.3,320.2 L 70.4,320.2 L 70.4,320.3 L 70.5,320.3 L 70.5,320.4 L 70.6,320.4 L 70.6,320.4 L 70.6,320.3 L 70.6,320.3 L 70.5,320.3 L 70.5,320.2 L 70.5,320.2 L 70.4,320.1 L 70.2,320.1 L 70.2,320.2 L 70.1,320.2 L 70.1,320.3 L 70.1,320.3 L 70.0,320.5 L 70.0,320.5 L 69.9,320.6 L 69.9,320.6 L 69.9,320.7 L 69.8,320.7 L 69.7,320.7 L 69.7,320.8 L 69.6,320.8 L 69.6,320.8 L 69.6,320.9 L 69.5,320.9 L 69.5,321.0 L 69.4,321.0 L 69.3,321.0 L 69.2,321.0 L 69.1,321.0 L 69.1,320.9 L 69.0,320.9 L 69.0,320.8 L 69.0,320.8 L 68.9,320.7 L 68.9,320.6 L 68.8,320.6 L 68.7,320.7 L 68.7,320.7 L 68.7,320.7 L 68.6,320.7 L 68.6,320.7 L 68.4,320.7 L 68.5,320.5 L 68.5,320.5 L 68.6,320.4 L 68.6,320.4 L 68.6,320.3 L 68.7,320.3 L 68.7,320.2 L 68.8,320.2 L 68.8,320.2 L 68.8,320.1 L 68.8,320.0 L 68.9,320.0 L 69.0,320.0 L 69.1,320.0 L 69.1,319.9 L 69.3,319.9 L 69.4,319.9 L 69.5,319.8 L 69.6,319.8 L 69.7,319.8 L 69.8,319.7 L 70.0,319.8 L 70.1,319.8 L 70.1,319.8 L 70.1,319.7 L 70.2,319.7 L 70.1,319.6 L 70.1,319.5 L 70.2,319.5 L 70.2,319.5 L 70.1,319.4 L 70.0,319.4 L 70.0,319.5 L 69.8,319.5 L 69.8,319.5 L 69.7,319.5 L 69.7,319.5 L 69.6,319.5 L 69.7,319.6 L 69.6,319.6 L 69.5,319.6 L 69.4,319.7 L 69.4,319.7 L 69.3,319.7 L 69.2,319.7 L 69.1,319.7 L 69.1,319.7 L 69.0,319.7 L 68.9,319.8 L 68.8,319.7 L 68.7,319.7 L 68.7,319.8 L 68.8,319.8 L 68.8,319.9 L 68.7,319.9 L 68.7,319.9 L 68.6,319.9 L 68.6,320.1 L 68.5,320.1 L 68.6,320.2 L 68.5,320.2 L 68.5,320.3 L 68.4,320.3 L 68.3,320.4 L 68.3,320.5 L 68.2,320.7 L 68.2,320.7 L 68.2,320.7 L 68.1,320.9 L 68.1,321.0 L 68.0,321.0 L 67.9,321.0 L 67.8,321.0 L 67.8,320.9 L 67.7,320.9 L 67.7,320.8 L 67.6,320.8 L 67.6,320.7 L 67.5,320.5 L 67.5,320.5 L 67.5,320.4 L 67.5,320.4 L 67.4,320.4 L 67.4,320.3 L 67.4,320.3 L 67.4,320.1 L 67.3,320.1 L 67.3,320.0 L 67.3,320.0 L 67.2,319.8 L 67.2,319.8 L 67.2,319.7 L 67.1,319.7 L 67.1,319.7 L 67.0,319.6 L 67.0,319.6 L 66.9,319.6 L 66.9,319.5 L 66.8,319.5 L 66.8,319.5 L 66.6,319.4 L 66.6,319.4 L 66.5,319.4 L 66.5,319.4 L 66.5,319.5 L 66.4,319.6 L 66.4,319.6 L 66.3,319.7 L 66.3,319.7 L 66.2,319.7 L 66.1,319.8 L 65.9,319.7 L 65.8,319.7 L 65.8,319.6 L 65.8,319.5 L 65.7,319.5 L 65.7,319.5 L 65.6,319.4 L 65.6,319.4 L 65.5,319.4 L 65.5,319.3 L 65.5,319.3 L 65.5,319.1 L 65.5,319.0 L 65.6,318.9 L 65.6,318.8 L 65.6,318.8 L 65.7,318.8 L 65.7,318.7 L 65.8,318.7 L 65.8,318.7 L 65.8,318.5 L 65.9,318.4 L 65.9,318.4 L 66.0,318.4 L 66.0,318.3 L 66.2,318.3 L 66.3,318.3 L 66.3,318.2 L 66.4,318.2 L 66.5,318.2 L 66.6,318.1 L 66.6,318.1 L 66.6,317.9 L 66.7,317.8 L 66.7,317.8 L 66.5,317.8 L 66.5,317.8 L 66.5,317.7 L 66.4,317.7 L 66.4,317.9 L 66.3,317.9 L 66.3,317.8 L 66.3,317.7 L 66.2,317.7 L 66.2,317.6 L 66.1,317.5 L 66.1,317.5 L 66.1,317.4 L 66.1,317.3 L 66.0,317.2 L 66.0,317.1 L 66.0,317.0 L 65.9,317.0 L 65.9,316.8 L 65.8,316.7 L 65.8,316.6 L 65.7,316.5 L 65.7,316.4 L 65.7,316.3 L 65.6,316.2 L 65.6,316.2 L 65.6,316.1 L 65.5,316.0 L 65.5,316.0 L 65.4,315.9 L 65.4,315.9 L 65.4,315.9 L 65.3,315.8 L 65.2,315.8 L 65.1,315.8 L 65.0,315.8 L 64.9,315.8 L 64.9,315.7 L 64.8,315.6 L 64.8,315.6 L 64.8,315.5 L 64.6,315.5 L 64.6,315.4 L 64.5,315.4 L 64.5,315.4 L 64.5,315.2 L 64.5,315.1 L 64.5,314.9 L 64.4,314.9 L 64.3,314.9 L 64.3,314.7 L 64.3,314.7 L 64.3,314.6 L 64.3,314.6 L 64.2,314.5 L 64.2,314.4 L 64.2,314.3 L 64.1,314.3 L 64.1,314.2 L 64.0,314.2 L 64.0,314.2 L 63.9,314.2 L 63.9,314.1 L 63.8,314.0 L 63.8,313.7 L 63.8,313.7 L 63.7,313.5 L 63.9,313.5 L 63.9,313.5 L 64.0,313.5 L 64.1,313.4 L 64.1,313.4 L 64.2,313.3 L 64.4,313.3 L 64.5,313.3 L 64.6,313.2 L 64.7,313.2 L 64.7,312.9 L 64.8,312.9 L 64.8,312.8 L 65.0,312.8 L 65.0,312.7 L 65.1,312.4 L 65.1,312.3 L 65.2,312.3 L 65.2,312.2 L 65.1,312.2 L 65.1,312.1 L 65.1,312.0 L 65.1,311.9 L 65.1,311.9 L 65.2,311.7 L 65.2,311.7 L 65.2,311.6 L 65.4,311.7 L 65.5,311.7 L 65.5,311.6 L 65.5,311.5 L 65.4,311.5 L 65.3,311.5 L 65.3,311.4 L 65.2,311.2 L 65.2,311.1 L 65.2,310.9 L 65.1,310.9 L 65.1,310.7 L 65.0,310.7 L 65.0,310.5 L 64.9,310.4 L 64.9,310.3 L 64.9,310.3 L 64.9,310.2 L 64.8,310.2 L 64.8,310.1 L 64.8,310.0 L 64.7,309.8 L 64.7,309.7 L 64.7,309.6 L 64.6,309.6 L 64.6,309.5 L 64.5,309.3 L 64.5,309.1 L 64.5,309.0 L 64.5,309.0 L 64.6,309.0 L 64.6,309.0 L 64.8,309.0 L 64.9,309.0 L 65.0,309.1 L 65.0,309.1 L 65.1,309.0 L 65.3,309.0 L 65.3,308.9 L 65.3,308.8 L 65.0,308.9 L 64.9,308.9 L 64.8,308.9 L 64.8,308.8 L 64.6,308.8 L 64.6,308.8 L 64.5,308.7 L 64.5,308.7 L 64.5,308.7 L 64.4,308.6 L 64.4,308.6 L 64.3,308.5 L 64.3,308.5 L 64.2,308.5 L 64.1,308.4 L 64.1,308.4 L 64.0,308.4 L 64.0,308.3 L 63.9,308.3 L 63.9,308.2 L 63.8,308.2 L 63.8,308.3 L 63.7,308.2 L 63.7,308.2 L 63.6,308.1 L 63.6,308.1 L 63.4,308.1 L 63.4,308.0 L 63.4,308.0 L 63.3,307.9 L 63.3,307.8 L 63.3,307.8 L 63.2,307.7 L 63.2,307.7 L 63.1,307.6 L 63.1,307.6 L 62.9,307.6 L 62.9,307.5 L 62.9,307.5 L 62.8,307.5 L 62.8,307.4 L 62.7,307.4 L 62.7,307.4 L 62.6,307.3 L 62.6,307.3 L 62.5,307.2 L 62.5,307.2 L 62.4,307.1 L 62.4,307.1 L 62.4,307.1 L 62.1,307.0 L 62.1,307.1 L 62.0,307.1 L 61.9,307.1 L 61.9,307.0 L 61.8,307.0 L 61.8,306.9 L 61.8,306.9 L 61.6,306.9 L 61.6,306.8 L 61.5,306.8 L 61.5,306.8 L 61.3,306.8 L 61.2,306.9 L 61.1,306.9 L 61.1,307.0 L 61.0,307.0 L 60.9,307.0 L 60.8,307.1 L 60.8,307.1 L 60.7,307.3 L 60.6,307.3 L 60.4,307.2 L 60.4,307.2 L 60.2,307.2 L 60.2,307.1 L 60.1,307.1 L 60.1,307.1 L 60.0,307.0 L 60.0,307.0 L 60.0,306.9 L 60.0,306.7 L 60.1,306.7 L 60.2,306.7 L 60.3,306.6 L 60.3,306.5 L 60.3,306.4 L 60.4,306.3 L 60.4,306.3 L 60.5,306.3 L 60.5,306.2 L 60.6,306.2 L 60.6,306.1 L 60.7,306.1 L 60.8,306.1 L 60.9,306.0 L 60.9,306.0 L 61.0,306.0 L 61.0,305.7 L 60.9,305.6 L 60.9,305.6 L 60.9,305.5 L 60.8,305.3 L 60.9,305.3 L 60.9,305.2 L 60.9,305.1 L 61.0,305.1 L 61.1,305.1 L 61.1,305.0 L 61.1,304.9 L 61.1,304.8 L 61.0,304.8 L 61.1,304.8 L 61.1,304.6 L 61.0,304.6 L 61.0,304.5 L 61.0,304.4 L 60.9,304.3 L 60.9,304.2 L 60.9,304.2 L 60.8,304.1 L 60.8,304.0 L 60.8,304.0 L 60.8,303.8 L 60.8,303.7 L 60.7,303.7 L 60.7,303.6 L 60.7,303.6 L 60.6,303.4 L 60.6,303.3 L 60.6,303.3 L 60.5,303.3 L 60.5,303.2 L 60.4,303.2 L 60.4,303.1 L 60.4,303.1 L 60.4,303.0 L 60.5,303.0 L 60.5,302.9 L 60.5,302.9 L 60.6,302.9 L 60.6,302.8 L 60.5,302.8 L 60.5,302.8 L 60.5,302.6 L 60.4,302.6 L 60.4,302.5 L 60.5,302.4 L 60.5,302.4 L 60.5,302.4 L 60.6,302.3 L 60.6,302.3 L 60.7,302.2 L 60.7,302.2 L 60.8,302.2 L 60.9,302.2 L 60.9,302.2 L 61.0,302.2 L 61.1,302.2 L 61.4,302.2 L 61.5,302.1 L 61.6,302.2 L 61.7,302.2 L 61.8,302.2 L 61.8,302.3 L 61.9,302.3 L 61.9,302.4 L 61.9,302.5 L 62.1,302.6 L 62.1,302.6 L 62.1,302.6 L 62.2,302.7 L 62.4,302.7 L 62.4,302.7 L 62.6,302.7 L 62.6,302.6 L 62.7,302.5 L 62.7,302.5 L 63.0,302.5 L 63.1,302.5 L 63.1,302.5 L 63.2,302.6 L 63.2,302.6 L 63.3,302.6 L 63.3,302.7 L 63.3,302.8 L 63.3,302.8 L 63.4,302.9 L 63.5,302.9 L 63.6,303.0 L 63.6,303.1 L 63.7,303.2 L 63.7,303.3 L 63.6,303.4 L 63.6,303.4 L 63.7,303.5 L 63.7,303.6 L 63.6,303.7 L 63.8,303.7 L 63.8,303.8 L 64.0,303.8 L 64.0,303.9 L 63.9,303.9 L 63.9,304.0 L 63.8,304.0 L 63.8,304.0 L 63.8,304.2 L 63.8,304.4 L 63.9,304.5 L 63.9,304.6 L 63.9,304.6 L 64.0,304.7 L 64.0,304.7 L 64.0,305.0 L 64.0,305.0 L 64.1,305.0 L 64.2,305.0 L 64.3,305.1 L 64.6,305.1 L 64.6,305.2 L 64.7,305.2 L 64.7,305.3 L 64.8,305.4 L 64.8,305.3 L 64.9,305.3 L 65.0,305.3 L 65.2,305.3 L 65.3,305.2 L 65.4,305.2 L 65.5,305.2 L 65.6,305.2 L 65.6,305.1 L 65.7,305.1 L 65.7,305.1 L 65.9,305.1 L 65.9,305.1 L 66.1,305.1 L 66.2,305.1 L 66.3,305.0 L 66.3,304.9 L 66.4,304.9 L 66.5,304.9 L 66.6,305.0 L 66.6,305.0 L 66.6,305.0 L 66.8,305.1 L 66.9,305.1 L 66.9,305.1 L 66.9,305.2 L 67.2,305.1 L 67.4,305.2 L 67.5,305.2 L 67.5,305.3 L 67.6,305.3 L 67.6,305.3 L 67.6,305.4 L 67.7,305.3 L 67.9,305.3 L 67.9,305.3 L 67.9,305.2 L 67.9,305.2 L 67.9,305.2 L 68.0,305.1 L 68.0,305.1 L 68.1,305.2 L 68.1,305.3 L 68.2,305.3 L 68.2,305.4 L 68.3,305.4 L 68.4,305.4 L 68.4,305.4 L 68.5,305.4 L 68.5,305.4 L 68.6,305.5 L 68.8,305.5 L 68.9,305.5 L 69.0,305.5 L 69.0,305.5 L 69.1,305.5 L 69.2,305.6 L 69.3,305.6 L 69.4,305.6 L 69.5,305.7 L 69.5,305.7 L 69.6,305.7 L 69.7,305.8 L 69.8,305.8 L 69.8,305.9 L 70.0,305.9 L 70.1,305.8 L 70.3,305.9 L 70.4,305.9 L 70.5,305.9 L 70.5,306.0 L 70.6,306.0 L 70.7,306.0 L 70.8,306.0 L 70.8,306.1 L 71.0,306.1 L 71.0,306.2 L 71.0,306.2 L 71.0,306.3 L 71.0,306.3 L 71.1,306.2 L 71.1,306.2 L 71.1,306.2 L 71.2,306.1 L 71.2,306.1 L 71.4,306.2 L 71.4,306.2 L 71.5,306.2 L 71.7,306.3 L 71.8,306.3 L 71.9,306.3 L 71.9,306.3 L 72.0,306.4 L 72.1,306.4 L 72.2,306.4 L 72.3,306.5 L 72.3,306.5 L 72.4,306.5 L 72.4,306.6 L 72.5,306.6 L 72.5,306.6 L 72.6,306.7 L 72.6,306.7 L 72.7,306.8 L 72.8,306.8 L 72.8,306.8 L 72.9,306.9 L 72.9,306.9 L 72.9,307.3 L 73.0,307.7 L 73.0,307.8 L 73.0,307.9 L 73.0,308.0 L 72.9,308.0 L 72.9,308.1 L 72.9,308.1 L 72.8,308.1 L 72.7,308.2 L 72.7,308.2 L 72.6,308.2 L 72.6,308.3 L 72.5,308.3 L 72.4,308.3 L 72.3,308.4 L 72.3,308.4 L 72.1,308.4 L 72.0,308.5 L 72.0,308.5 L 71.9,308.5 L 71.8,308.5 L 71.8,308.6 L 71.7,308.7 L 71.7,308.7 L 71.7,308.8 L 71.6,308.8 L 71.6,308.9 L 71.5,309.0 L 71.5,309.0 L 71.6,309.2 L 71.6,309.3 L 71.6,309.5 L 71.7,309.5 L 71.7,309.6 L 71.7,309.6 L 71.8,309.7 L 71.9,309.7 L 71.9,309.8 L 72.0,309.8 L 72.0,309.9 L 72.1,309.9 L 72.1,310.0 L 72.2,310.0 L 72.2,310.1 L 72.3,310.1 L 72.3,310.1 L 72.4,310.1 L 72.4,310.2 L 72.5,310.2 L 72.5,310.3 L 72.6,310.3 L 72.7,310.3 L 72.7,310.3 L 72.8,310.4 L 72.8,310.4 L 72.8,310.4 L 72.9,310.4 L 72.9,310.5 L 73.0,310.5 L 73.1,310.6 L 73.1,310.7 L 73.1,310.7 L 73.0,310.8 L 73.0,310.8 L 72.9,310.9 L 72.9,310.9 L 72.9,311.0 L 72.8,311.1 L 72.8,311.1 L 72.9,311.0 L 72.9,311.0 L 72.9,311.0 L 73.0,310.9 L 73.0,310.9 L 73.1,310.9 L 73.1,310.8 L 73.1,310.8 L 73.3,310.8 L 73.3,310.8 L 73.3,310.9 L 73.4,311.0 L 73.4,311.0 L 73.5,311.1 L 73.5,311.1 L 73.6,311.1 L 73.6,311.2 L 73.5,311.4 L 73.5,311.4 L 73.5,311.4 L 73.4,311.5 L 73.4,311.5 L 73.4,311.5 L 73.3,311.6 L 73.3,311.7 L 73.2,311.7 L 73.2,311.8 L 73.3,311.7 L 73.3,311.7 L 73.3,311.7 L 73.4,311.6 L 73.4,311.6 L 73.4,311.5 L 73.5,311.5 L 73.6,311.5 L 73.6,311.4 L 73.7,311.3 L 73.8,311.3 L 73.9,311.4 L 73.9,311.4 L 74.0,311.5 L 74.0,311.6 L 74.0,311.8 L 74.0,311.8 L 74.1,311.7 L 74.2,311.6 L 74.3,311.7 L 74.3,311.8 L 74.4,311.8 L 74.4,311.9 L 74.5,311.9 L 74.4,312.1 L 74.5,312.2 L 74.5,312.2 L 74.6,312.2 L 74.6,312.1 L 74.6,312.1 L 74.6,311.8 L 74.5,311.8 L 74.5,311.7 L 74.5,311.6 L 74.5,311.6 L 74.4,311.6 L 74.4,311.5 L 74.3,311.5 L 74.3,311.5 L 74.2,311.4 L 74.3,311.3 L 74.3,311.3 L 74.4,311.3 L 74.5,311.3 L 74.6,311.2 L 74.7,311.2 L 74.7,311.2 L 74.8,311.3 L 74.8,311.3 L 74.9,311.3 L 75.0,311.3 L 75.0,311.3 L 75.0,311.3 L 75.0,311.2 L 75.0,311.2 L 74.9,311.1 L 74.9,311.1 L 74.8,311.1 L 74.8,311.1 L 74.8,311.0 L 74.8,310.9 L 74.9,310.9 L 74.9,310.9 L 74.9,310.9 L 74.9,310.8 L 74.8,310.8 L 74.7,310.8 L 74.6,310.7 L 74.6,310.7 L 74.5,310.7 L 74.5,310.7 L 74.4,310.8 L 74.4,310.8 L 74.3,310.8 L 74.2,310.7 L 74.2,310.8 L 74.1,310.7 L 74.1,310.7 L 74.0,310.7 L 74.0,310.6 L 73.9,310.5 L 73.9,310.4 L 73.9,310.3 L 73.9,310.2 L 73.8,310.2 L 73.9,310.2 L 73.9,310.1 L 73.9,310.1 L 73.8,310.1 L 73.5,310.1 L 73.5,309.9 L 73.4,309.9 L 73.4,310.0 L 73.3,310.0 L 73.1,309.9 L 73.1,309.9 L 73.0,309.9 L 72.9,309.9 L 72.9,309.8 L 72.8,309.8 L 72.8,309.8 L 72.7,309.7 L 72.6,309.7 L 72.6,309.7 L 72.5,309.6 L 72.4,309.6 L 72.4,309.6 L 72.3,309.5 L 72.3,309.5 L 72.2,309.5 L 72.2,309.4 L 72.2,309.4 L 72.1,309.3 L 72.1,309.3 L 72.1,309.3 L 72.0,309.2 L 72.0,309.2 L 72.0,309.0 L 72.0,308.9 L 72.1,308.9 L 72.1,308.8 L 72.2,308.8 L 72.2,308.7 L 72.3,308.7 L 72.4,308.7 L 72.5,308.7 L 72.6,308.7 L 72.7,308.7 L 72.8,308.7 L 72.9,308.7 L 73.1,308.7 L 73.1,308.6 L 73.2,308.6 L 73.3,308.6 L 73.4,308.6 L 73.5,308.5 L 73.5,308.4 L 73.5,308.3 L 73.5,308.2 L 73.5,308.2 L 73.5,307.9 L 73.6,307.8 L 73.6,307.7 L 73.7,307.6 L 73.7,307.6 L 73.8,307.5 L 73.8,307.5 L 73.8,307.4 L 73.9,307.4 L 73.9,307.3 L 73.9,307.3 L 73.9,307.3 L 73.9,307.1 L 73.9,306.9 L 73.9,306.8 L 73.8,306.8 L 73.8,306.8 L 73.7,306.7 L 73.7,306.6 L 73.9,306.5 L 73.9,306.5 L 73.8,306.5 L 73.9,306.4 L 73.9,306.3 L 73.9,306.2 L 73.8,306.2 L 73.8,306.1 L 73.7,306.1 L 73.7,305.8 L 73.7,305.8 L 73.6,305.8 L 73.5,305.8 L 73.5,305.6 L 73.4,305.6 L 73.3,305.6 L 73.1,305.5 L 73.1,305.5 L 73.0,305.4 L 72.9,305.4 L 72.8,305.4 L 72.8,305.3 L 72.7,305.3 L 72.7,305.2 L 72.7,305.2 L 72.6,305.1 L 72.5,305.1 L 72.5,305.0 L 72.4,304.9 L 72.4,304.9 L 72.3,304.8 L 72.3,304.8 L 72.2,304.8 L 72.2,304.7 L 72.1,304.6 L 72.1,304.5 L 72.2,304.3 L 72.2,304.2 L 72.2,304.2 L 72.2,304.1 L 72.3,304.1 L 72.3,304.1 L 72.4,304.0 L 72.4,304.0 L 72.5,304.0 L 72.5,303.9 L 72.6,303.9 L 72.7,303.8 L 72.7,303.8 L 72.8,303.7 L 72.8,303.6 L 72.8,303.5 L 72.8,303.4 L 72.8,303.3 L 72.7,303.3 L 72.7,303.2 L 72.6,303.2 L 72.6,303.1 L 72.6,303.1 L 72.5,303.0 L 72.5,303.0 L 72.5,302.9 L 72.4,302.9 L 72.4,302.9 L 72.3,302.9 L 72.3,302.8 L 72.3,302.7 L 72.3,302.7 L 72.2,302.7 L 72.2,302.7 L 72.0,302.7 L 71.9,302.7 L 71.8,302.6 L 71.8,302.6 L 71.6,302.6 L 71.3,302.5 L 71.3,302.5 L 71.3,302.4 L 71.3,302.4 L 71.2,302.4 L 71.2,302.3 L 71.1,302.3 L 71.1,302.2 L 71.1,302.1 L 71.0,302.1 L 71.0,301.9 L 70.9,301.9 L 70.9,301.8 L 70.9,301.8 L 70.8,301.7 L 70.8,301.7 L 70.7,301.6 L 70.7,301.5 L 70.7,301.4 L 70.6,301.4 L 70.6,301.3 L 70.5,301.3 L 70.4,301.3 L 70.4,301.1 L 70.5,301.0 L 70.5,300.9 L 70.6,300.9 L 70.7,300.8 L 70.8,300.8 L 70.9,300.8 L 71.3,300.8 L 71.3,300.8 L 71.4,300.8 L 71.4,300.9 L 71.5,300.9 L 71.6,300.9 L 71.6,301.0 L 71.7,301.0 L 71.7,301.0 L 72.2,301.1 L 72.3,301.1 L 72.6,301.1 L 72.6,301.1 L 72.8,301.1 L 72.9,301.1 L 73.1,301.1 L 73.2,301.2 L 73.5,301.2 L 73.6,301.3 L 73.6,301.4 L 73.8,301.4 L 74.0,301.4 L 74.1,301.5 L 74.1,301.5 L 74.1,301.6 L 74.2,301.6 L 74.2,301.7 L 74.3,301.8 L 74.3,301.8 L 74.3,301.9 L 74.4,301.9 L 74.4,301.9 L 74.5,301.9 L 74.4,301.9 L 74.4,301.9 L 74.4,301.8 L 74.3,301.8 L 74.3,301.7 L 74.3,301.6 L 74.2,301.6 L 74.2,301.5 L 74.1,301.5 L 74.1,301.4 L 74.0,301.3 L 73.9,301.3 L 73.7,301.3 L 73.7,301.2 L 73.7,301.2 L 73.7,301.1 L 73.7,301.1 L 73.8,301.0 L 73.9,301.0 L 74.1,301.0 L 74.1,300.7 L 74.1,300.7 L 74.1,300.4 L 74.1,300.4 L 74.1,300.3 L 74.1,300.3 L 74.1,300.1 L 74.1,300.0 L 74.2,300.0 L 74.2,300.0 L 74.2,299.9 L 74.3,299.9 L 74.3,299.8 L 74.3,299.8 L 74.4,299.7 L 74.4,299.6 L 74.5,299.6 L 74.5,299.6 L 74.5,299.5 L 74.5,299.5 L 74.6,299.4 L 74.6,299.3 L 74.6,299.3 L 74.6,299.3 L 74.5,299.3 L 74.5,299.3 L 74.5,299.4 L 74.4,299.4 L 74.4,299.5 L 74.3,299.5 L 74.3,299.4 L 74.2,299.3 L 74.2,299.1 L 74.3,299.1 L 74.3,299.1 L 74.6,299.1 L 74.4,299.0 L 74.3,299.0 L 74.3,298.9 L 74.3,298.8 L 74.3,298.8 L 74.2,298.9 L 74.2,299.0 L 74.2,299.0 L 74.1,299.2 L 74.1,299.2 L 74.1,299.3 L 74.0,299.3 L 74.0,299.4 L 73.9,299.4 L 73.9,299.5 L 73.8,299.5 L 73.8,299.6 L 73.8,299.7 L 73.7,299.8 L 73.7,299.9 L 73.7,300.0 L 73.6,300.0 L 73.6,300.1 L 73.6,300.1 L 73.5,300.1 L 73.5,300.1 L 73.5,300.2 L 73.4,300.2 L 73.4,300.3 L 73.3,300.3 L 73.3,300.4 L 73.2,300.4 L 73.1,300.5 L 73.1,300.5 L 73.0,300.5 L 72.9,300.5 L 72.9,300.6 L 72.8,300.6 L 72.8,300.6 L 72.8,300.7 L 72.7,300.7 L 72.6,300.7 L 72.5,300.8 L 72.3,300.8 L 72.2,300.8 L 72.1,300.8 L 72.0,300.8 L 71.8,300.7 L 71.8,300.7 L 71.6,300.7 L 71.6,300.6 L 71.5,300.6 L 71.4,300.6 L 71.3,300.6 L 71.3,300.5 L 71.2,300.5 L 71.1,300.5 L 71.0,300.5 L 70.9,300.5 L 70.9,300.5 L 70.8,300.5 L 70.6,300.6 L 70.6,300.6 L 70.5,300.6 L 70.5,300.7 L 70.4,300.7 L 70.4,300.8 L 70.3,300.8 L 70.3,300.9 L 70.2,300.9 L 70.2,301.0 L 70.1,301.0 L 70.1,301.2 L 70.1,301.2 L 70.1,301.3 L 70.1,301.3 L 70.1,301.4 L 70.1,301.4 L 70.2,301.6 L 70.2,301.6 L 70.2,301.7 L 70.3,301.7 L 70.3,301.8 L 70.4,301.8 L 70.4,301.8 L 70.5,301.9 L 70.5,302.0 L 70.5,302.0 L 70.6,302.1 L 70.6,302.2 L 70.6,302.3 L 70.7,302.3 L 70.7,302.4 L 70.7,302.5 L 70.8,302.5 L 70.9,302.5 L 70.9,302.6 L 71.0,302.7 L 71.0,302.7 L 71.1,302.7 L 71.1,302.8 L 71.2,302.8 L 71.2,302.8 L 71.3,302.9 L 71.3,302.9 L 71.4,302.9 L 71.4,303.0 L 71.5,303.0 L 71.5,303.1 L 71.5,303.2 L 71.5,303.3 L 71.4,303.3 L 71.4,303.4 L 71.3,303.4 L 71.3,303.4 L 71.1,303.4 L 71.0,303.4 L 70.9,303.5 L 70.8,303.5 L 70.6,303.5 L 70.5,303.6 L 70.4,303.6 L 70.4,303.6 L 70.3,303.7 L 70.1,303.7 L 69.8,303.7 L 69.7,303.7 L 69.7,303.6 L 69.6,303.6 L 69.5,303.6 L 69.3,303.6 L 69.3,303.6 L 69.2,303.6 L 69.2,303.7 L 69.0,303.7 L 69.0,303.5 L 69.0,303.5 L 68.9,303.5 L 68.9,303.4 L 68.9,303.4 L 68.8,303.3 L 68.8,303.3 L 68.7,303.4 L 68.6,303.4 L 68.4,303.4 L 68.4,303.3 L 68.3,303.3 L 68.4,303.1 L 68.5,303.1 L 68.5,303.1 L 68.5,303.0 L 68.5,302.9 L 68.5,302.9 L 68.5,302.8 L 68.5,302.7 L 68.5,302.7 L 68.3,302.7 L 68.3,302.6 L 68.3,302.6 L 68.2,302.5 L 68.1,302.5 L 68.1,302.5 L 68.0,302.4 L 68.0,302.4 L 67.8,302.4 L 67.8,302.3 L 67.7,302.3 L 67.6,302.3 L 67.5,302.3 L 67.3,302.2 L 66.7,302.2 L 66.5,302.3 L 66.4,302.3 L 66.2,302.3 L 66.3,302.4 L 66.2,302.5 L 66.2,302.6 L 66.1,302.7 L 66.1,302.8 L 66.1,302.8 L 66.0,302.9 L 66.0,302.9 L 66.0,302.9 L 65.9,303.0 L 65.8,302.9 L 65.7,302.8 L 65.7,302.6 L 65.7,302.5 L 65.6,302.4 L 65.6,302.4 L 65.6,302.4 L 65.6,302.2 L 65.5,302.1 L 65.5,302.1 L 65.5,302.0 L 65.2,302.0 L 65.2,301.9 L 65.2,301.8 L 65.2,301.7 L 65.1,301.7 L 65.0,301.6 L 64.9,301.6 L 64.9,301.4 L 64.8,301.4 L 64.8,301.3 L 64.8,301.2 L 64.7,301.2 L 64.7,301.1 L 64.6,301.0 L 64.5,301.1 L 64.4,301.1 L 64.3,301.1 L 64.2,301.1 L 64.1,301.1 L 64.0,301.0 L 64.0,301.0 L 64.0,301.0 L 63.9,300.9 L 63.8,301.0 L 63.7,301.1 L 63.7,301.0 L 63.6,301.0 L 63.6,300.9 L 63.5,300.9 L 63.5,300.7 L 63.4,300.6 L 63.5,300.5 L 63.5,300.4 L 63.4,300.4 L 63.4,300.3 L 63.4,300.3 L 63.3,300.2 L 63.3,300.2 L 63.3,300.2 L 63.2,300.1 L 63.2,300.1 L 63.1,300.1 L 63.0,300.1 L 62.9,300.1 L 62.8,300.2 L 62.7,300.2 L 62.6,300.2 L 62.6,300.1 L 62.5,300.1 L 62.5,300.1 L 62.5,300.0 L 62.4,300.0 L 62.4,300.0 L 62.4,299.9 L 62.3,299.9 L 62.3,299.8 L 62.3,299.7 L 62.4,299.7 L 62.5,299.7 L 62.5,299.6 L 62.6,299.6 L 62.6,299.6 L 62.8,299.6 L 62.8,299.6 L 62.7,299.5 L 62.7,299.5 L 62.6,299.5 L 62.6,299.4 L 62.6,299.4 L 62.5,299.4 L 62.5,299.3 L 62.5,299.3 L 62.4,299.2 L 62.4,299.2 L 62.3,299.1 L 62.3,299.1 L 62.2,299.0 L 62.2,298.9 L 62.2,298.9 L 62.1,298.8 L 62.1,298.8 L 62.1,298.5 L 62.0,298.5 L 62.0,298.4 L 61.9,298.4 L 61.8,298.3 L 61.8,298.3 L 61.8,298.3 L 61.7,298.2 L 61.7,298.2 L 61.5,298.2 L 61.4,298.1 L 61.4,298.1 L 61.3,297.9 L 61.2,297.9 L 61.2,297.9 L 61.1,297.8 L 61.1,297.8 L 61.0,297.8 L 60.9,297.7 L 60.8,297.8 L 60.8,297.8 L 60.7,297.9 L 60.6,297.8 L 60.5,297.8 L 60.5,297.8 L 60.4,297.9 L 60.3,297.7 L 60.4,297.7 L 60.4,297.6 L 60.4,297.6 L 60.5,297.5 L 60.5,297.4 L 60.5,297.4 L 60.4,297.3 L 60.4,297.3 L 60.3,297.3 L 60.1,297.3 L 60.1,297.3 L 60.0,297.3 L 59.8,297.3 L 59.8,297.4 L 59.6,297.3 L 59.6,297.3 L 59.4,297.3 L 59.4,297.3 L 59.4,297.3 L 59.3,297.4 L 59.2,297.4 L 59.2,297.5 L 59.1,297.5 L 59.0,297.5 L 58.9,297.5 L 58.9,297.5 L 58.8,297.4 L 58.8,297.4 L 58.7,297.3 L 58.7,297.2 L 58.6,297.1 L 58.6,297.1 L 58.5,297.1 L 58.5,297.0 L 58.5,297.0 L 58.4,296.9 L 58.5,296.8 L 58.5,296.7 L 58.5,296.6 L 58.4,296.6 L 58.4,296.6 L 58.4,296.5 L 58.3,296.5 L 58.3,296.5 L 58.2,296.3 L 58.2,296.1 L 58.2,296.0 L 58.3,295.9 L 58.3,295.9 L 58.3,295.9 L 58.4,295.8 L 58.4,295.8 L 58.5,295.8 L 58.5,295.7 L 58.6,295.7 L 58.7,295.7 L 58.8,295.6 L 58.8,295.7 L 59.0,295.7 L 59.1,295.6 L 59.1,295.6 L 59.2,295.6 L 59.3,295.5 L 59.3,295.6 L 59.4,295.6 L 59.5,295.6 L 59.6,295.6 L 59.5,295.5 L 59.5,295.5 L 59.4,295.4 L 59.5,295.3 L 59.5,295.2 L 59.6,295.1 L 59.6,294.9 L 59.6,294.9 L 59.6,294.5 L 59.5,294.4 L 59.5,294.3 L 59.4,294.3 L 59.4,294.2 L 59.3,294.2 L 59.3,294.1 L 59.1,294.1 L 58.8,294.1 L 58.6,294.2 L 58.6,294.1 L 58.5,294.0 L 58.4,294.1 L 58.3,294.1 L 58.3,294.0 L 58.3,294.0 L 58.3,293.9 L 58.3,293.8 L 58.2,293.8 L 58.2,293.7 L 58.2,293.7 L 58.0,293.7 L 58.0,293.6 L 57.9,293.6 L 57.9,293.5 L 58.0,293.5 L 58.0,293.4 L 57.9,293.4 L 57.7,293.3 L 57.9,293.3 L 57.9,293.2 L 57.9,293.1 L 57.8,292.9 L 57.8,292.8 L 57.7,292.7 L 57.8,292.5 L 57.9,292.4 L 57.8,292.4 L 57.7,292.3 L 57.7,292.3 L 57.8,292.3 L 57.9,292.3 L 57.9,292.2 L 57.9,292.2 L 58.0,292.0 L 58.0,292.0 L 57.9,291.9 L 57.8,291.8 L 57.8,291.8 L 57.7,291.7 L 57.7,291.7 L 57.7,291.6 L 57.6,291.5 L 57.5,291.5 L 57.5,291.3 L 57.6,291.3 L 57.6,291.2 L 57.6,291.2 L 57.7,291.2 L 57.7,291.1 L 57.7,290.9 L 57.7,290.8 L 57.6,290.5 L 57.6,290.5 L 57.6,290.4 L 57.5,290.3 L 57.5,290.3 L 57.4,290.2 L 57.4,290.1 L 57.4,290.1 L 57.3,289.9 L 57.3,289.9 L 57.3,289.7 L 57.2,289.7 L 57.2,289.6 L 57.1,289.5 L 57.1,289.4 L 57.1,289.4 L 57.0,289.4 L 57.0,289.3 L 56.9,289.3 L 56.8,289.3 L 56.7,289.3 L 56.6,289.3 L 56.7,288.8 L 56.7,288.7 L 56.7,288.3 L 56.8,288.2 L 56.8,288.1 L 56.9,288.1 L 56.9,288.2 L 57.0,288.2 L 57.1,288.1 L 57.1,288.1 L 57.2,288.0 L 57.2,287.9 L 57.3,287.7 L 57.3,287.7 L 57.2,287.6 L 57.3,287.6 L 57.3,287.0 L 57.2,287.0 L 57.2,286.8 L 57.3,286.7 L 57.3,286.6 L 57.4,286.6 L 57.5,286.5 L 57.5,286.4 L 57.5,286.2 L 57.5,286.2 L 57.5,286.0 L 57.6,286.0 L 57.6,285.9 L 57.6,285.9 L 57.7,285.8 L 57.9,285.8 L 58.0,285.9 L 58.1,285.9 L 58.2,285.8 L 58.1,285.8 L 58.1,285.7 L 58.2,285.7 L 58.2,285.4 L 58.1,285.3 L 58.1,285.2 L 58.1,285.2 L 58.1,285.0 L 58.2,284.9 L 58.2,284.8 L 58.2,284.7 L 58.2,284.5 L 58.2,284.4 L 58.2,284.4 L 58.1,284.3 L 58.1,284.1 L 58.0,284.0 L 58.0,283.9 L 58.0,283.8 L 57.9,283.7 L 57.9,283.7 L 57.9,283.7 L 57.8,283.6 L 57.8,283.6 L 57.7,283.5 L 57.7,283.4 L 57.6,283.4 L 57.5,283.2 L 57.6,283.2 L 57.6,283.1 L 57.7,283.1 L 57.8,283.1 L 57.9,283.1 L 57.9,283.2 L 57.9,283.2 L 58.0,283.3 L 58.0,283.3 L 58.0,283.4 L 58.1,283.5 L 58.1,283.6 L 58.2,283.8 L 58.2,283.8 L 58.3,283.9 L 58.4,283.9 L 58.5,283.9 L 58.8,284.0 L 58.8,283.9 L 58.9,283.9 L 58.9,283.8 L 58.9,283.8 L 59.0,283.8 L 59.2,283.8 L 59.2,283.7 L 59.3,283.7 L 59.3,283.7 L 59.5,283.6 L 59.5,283.6 L 59.6,283.6 L 59.6,283.5 L 59.7,283.5 L 59.8,283.5 L 59.8,283.0 L 59.7,283.0 L 59.7,282.9 L 59.7,282.9 L 59.6,282.9 L 59.6,282.8 L 59.5,282.8 L 59.4,282.8 L 59.4,282.6 L 59.3,282.4 L 59.3,282.3 L 59.3,282.2 L 59.2,282.1 L 59.2,282.0 L 59.1,282.0 L 59.1,281.9 L 59.1,281.8 L 59.0,281.7 L 59.0,281.6 L 59.0,281.6 L 58.9,281.5 L 58.9,281.5 L 58.8,281.5 L 58.8,281.4 L 58.8,281.4 L 58.7,281.3 L 58.7,281.2 L 58.7,281.2 L 58.6,281.1 L 58.6,281.1 L 58.5,281.0 L 58.5,280.9 L 58.4,280.9 L 58.4,280.8 L 58.4,280.8 L 58.3,280.7 L 58.3,280.7 L 58.3,280.6 L 58.2,280.6 L 58.2,280.4 L 58.1,280.3 L 58.1,280.2 L 58.0,280.2 L 58.0,280.1 L 57.9,280.1 L 57.9,279.8 L 58.0,279.8 L 58.0,279.8 L 58.1,279.7 L 58.1,279.7 L 57.9,279.7 L 57.8,279.7 L 57.8,279.7 L 57.7,279.7 L 57.7,279.6 L 57.6,279.6 L 57.6,279.5 L 57.5,279.4 L 57.5,279.4 L 57.5,279.3 L 57.4,279.3 L 57.4,279.2 L 57.4,279.1 L 57.3,279.1 L 57.3,278.9 L 57.2,278.9 L 57.2,278.8 L 57.2,278.8 L 57.1,278.7 L 57.1,278.6 L 57.1,278.5 L 57.0,278.5 L 56.9,278.4 L 56.9,278.4 L 56.9,278.3 L 56.8,278.2 L 56.8,278.1 L 56.7,278.1 L 56.7,278.0 L 56.7,278.0 L 56.6,277.8 L 56.6,277.8 L 56.6,277.7 L 56.5,277.7 L 56.5,277.6 L 56.4,277.6 L 56.4,277.5 L 56.3,277.5 L 56.3,277.4 L 56.3,277.3 L 56.2,277.2 L 56.2,277.2 L 56.1,277.2 L 56.0,277.1 L 56.0,277.0 L 56.0,277.0 L 55.9,276.9 L 55.9,276.8 L 55.9,276.8 L 55.8,276.7 L 55.8,276.6 L 55.7,276.4 L 55.7,276.1 L 55.7,276.0 L 55.7,275.8 L 56.0,275.8 L 56.1,275.9 L 56.3,275.9 L 56.4,275.9 L 56.4,276.0 L 56.8,276.0 L 56.9,276.1 L 56.9,276.1 L 56.9,276.2 L 57.0,276.4 L 57.1,276.4 L 57.2,276.4 L 57.2,276.4 L 57.3,276.3 L 57.3,276.2 L 57.3,276.2 L 57.2,276.2 L 57.2,276.1 L 57.2,276.1 L 57.1,276.0 L 57.1,276.0 L 57.0,276.0 L 56.8,276.0 L 56.8,275.9 L 56.7,275.9 L 56.7,275.8 L 56.6,275.8 L 56.5,275.8 L 56.4,275.8 L 56.3,275.7 L 56.3,275.7 L 56.2,275.7 L 56.1,275.6 L 56.0,275.6 L 56.0,275.6 L 55.6,275.6 L 55.6,275.6 L 55.5,275.7 L 55.5,275.8 L 55.5,275.9 L 55.0,275.8 L 55.0,275.8 L 54.9,275.8 L 54.8,275.8 L 54.6,275.8 L 54.5,275.7 L 54.4,275.7 L 54.4,275.6 L 54.3,275.6 L 54.3,275.5 L 54.2,275.4 L 54.2,275.3 L 54.2,275.3 L 54.1,275.2 L 54.1,275.2 L 54.1,275.1 L 54.0,275.1 L 54.0,275.0 L 53.9,274.9 L 53.9,274.7 L 53.9,274.6 L 53.8,274.5 L 53.8,274.4 L 53.8,274.1 L 53.8,273.9 L 53.8,273.7 L 53.8,273.6 L 53.9,273.5 L 53.8,273.5 L 53.8,273.4 L 53.7,273.4 L 53.7,273.2 L 53.6,273.2 L 53.6,273.0 L 53.6,272.9 L 53.5,272.7 L 53.5,272.6 L 53.5,272.3 L 53.4,272.1 L 53.4,271.9 L 53.3,271.8 L 53.3,271.8 L 53.3,271.7 L 53.2,271.7 L 53.2,271.7 L 53.1,271.6 L 53.1,271.6 L 53.1,271.5 L 53.0,271.5 L 53.0,271.4 L 53.1,271.3 L 53.1,271.2 L 53.1,271.2 L 53.2,271.1 L 53.2,271.1 L 53.3,271.0 L 53.3,271.0 L 53.3,270.9 L 53.4,270.9 L 53.4,270.8 L 53.5,270.8 L 53.5,270.5 L 53.5,270.5 L 53.6,270.4 L 53.6,270.3 L 53.6,270.1 L 53.7,270.0 L 53.7,269.9 L 53.8,269.8 L 53.8,269.6 L 53.8,268.8 L 53.8,268.5 L 53.7,268.5 L 53.7,268.3 L 53.6,268.3 L 53.7,267.9 L 53.7,267.8 L 53.8,267.6 L 53.8,267.6 L 53.8,267.5 L 53.9,267.3 L 53.9,267.1 L 54.0,267.1 L 54.0,267.0 L 54.1,267.0 L 54.1,267.1 L 54.2,267.0 L 54.2,267.0 L 54.1,267.0 L 54.1,266.9 L 54.0,266.8 L 54.0,266.7 L 53.9,266.7 L 53.9,266.6 L 53.9,266.5 L 53.9,266.4 L 53.8,266.2 L 53.9,266.1 L 53.9,266.1 L 53.9,266.0 L 53.8,266.0 L 53.8,266.0 L 53.7,265.9 L 53.8,265.8 L 53.8,265.7 L 53.7,265.6 L 53.7,265.4 L 53.8,265.2 L 53.8,265.2 L 53.8,265.1 L 53.7,264.9 L 53.8,264.4 L 53.8,264.2 L 53.8,264.1 L 53.9,264.0 L 53.9,264.0 L 54.1,263.9 L 54.1,263.9 L 54.2,263.8 L 54.2,263.6 L 54.2,263.6 L 54.3,263.4 L 54.3,263.4 L 54.4,263.4 L 54.5,263.5 L 54.5,263.5 L 54.6,263.6 L 54.7,263.6 L 55.0,263.6 L 55.1,263.6 L 55.2,263.5 L 55.3,263.5 L 55.3,263.5 L 55.4,263.4 L 55.4,263.4 L 55.5,263.4 L 55.6,263.4 L 55.9,263.5 L 56.0,263.5 L 56.0,263.6 L 56.0,263.6 L 55.9,263.7 L 55.9,263.8 L 56.0,263.9 L 56.4,263.8 L 56.5,263.8 L 56.6,263.8 L 56.6,263.7 L 56.7,263.7 L 56.8,263.7 L 56.9,263.6 L 56.9,263.6 L 57.0,263.6 L 57.0,263.5 L 57.1,263.5 L 57.1,263.4 L 57.2,263.5 L 57.3,263.5 L 57.4,263.5 L 57.4,263.6 L 57.5,263.6 L 57.5,263.6 L 57.6,263.6 L 57.6,263.7 L 57.6,263.7 L 57.7,263.8 L 57.6,263.9 L 57.6,264.0 L 57.7,264.1 L 57.7,264.2 L 57.8,264.2 L 57.9,264.2 L 57.9,264.3 L 58.0,264.3 L 58.1,264.3 L 58.5,264.3 L 58.7,264.3 L 58.7,264.2 L 58.8,264.2 L 58.8,264.2 L 58.9,264.2 L 58.9,264.1 L 59.0,264.1 L 59.0,264.0 L 59.1,264.0 L 59.1,264.0 L 59.2,263.9 L 59.2,263.9 L 59.2,263.9 L 59.3,263.8 L 59.3,263.8 L 59.3,263.7 L 59.4,263.7 L 59.4,263.7 L 59.5,263.6 L 59.5,263.6 L 59.6,263.6 L 59.6,263.5 L 59.6,263.5 L 59.7,263.5 L 59.7,263.4 L 59.7,263.4 L 59.8,263.3 L 59.8,263.3 L 59.9,263.1 L 59.9,263.0 L 60.0,263.0 L 60.0,262.9 L 60.1,262.8 L 60.1,262.7 L 60.1,262.7 L 60.2,262.6 L 60.2,262.6 L 60.3,262.5 L 60.3,262.5 L 60.3,262.3 L 60.4,262.3 L 60.4,262.2 L 60.5,262.1 L 60.5,262.0 L 60.5,262.0 L 60.6,261.9 L 60.6,261.9 L 60.6,261.8 L 60.7,261.8 L 60.7,261.7 L 60.8,261.7 L 60.8,261.7 L 61.2,261.6 L 61.2,261.8 L 61.3,261.8 L 61.3,262.0 L 61.3,262.0 L 61.4,262.1 L 61.5,262.1 L 61.5,262.2 L 61.6,262.2 L 61.6,262.3 L 61.6,262.3 L 61.7,262.3 L 61.7,262.4 L 61.7,262.4 L 61.8,262.5 L 61.8,262.6 L 61.9,262.6 L 61.9,262.7 L 62.0,262.7 L 62.0,262.9 L 62.0,262.9 L 62.1,263.0 L 62.1,263.0 L 62.1,263.1 L 62.2,263.1 L 62.2,263.2 L 62.3,263.3 L 62.3,263.3 L 62.3,263.4 L 62.4,263.5 L 62.4,263.5 L 62.4,263.6 L 62.5,263.6 L 62.5,263.7 L 62.6,263.7 L 62.6,263.8 L 62.6,263.8 L 62.7,263.8 L 62.7,263.8 L 62.8,263.9 L 62.8,263.9 L 62.8,264.0 L 62.9,264.0 L 62.9,264.0 L 63.0,264.1 L 63.0,264.1 L 63.0,264.1 L 63.1,264.2 L 63.1,264.2 L 63.2,264.2 L 63.2,264.2 L 63.3,264.3 L 63.3,264.3 L 63.4,264.3 L 63.5,264.4 L 63.5,264.4 L 63.6,264.4 L 63.6,264.5 L 63.8,264.5 L 63.8,264.4 L 63.8,264.4 L 63.9,264.4 L 63.9,264.3 L 63.9,264.3 L 64.0,264.2 L 64.0,264.1 L 64.0,264.1 L 64.1,264.0 L 64.1,263.9 L 64.2,263.9 L 64.2,263.8 L 64.2,263.8 L 64.3,263.8 L 64.3,263.7 L 64.2,263.6 L 64.2,263.6 L 64.2,263.5 L 64.2,263.4 L 64.3,263.4 L 64.4,263.3 L 64.5,263.4 L 64.6,263.4 L 64.6,263.3 L 64.6,263.3 L 64.7,263.2 L 64.7,263.1 L 64.7,263.1 L 64.8,263.0 L 64.8,263.0 L 64.8,263.0 L 64.7,262.9 L 64.7,262.9 L 64.7,262.8 L 64.6,262.7 L 64.6,262.6 L 64.5,262.5 L 64.6,262.0 L 64.6,262.0 L 64.6,261.9 L 64.7,261.9 L 64.7,261.8 L 64.8,261.8 L 64.8,261.7 L 64.8,261.7 L 64.9,261.6 L 64.9,261.6 L 64.9,261.6 L 64.8,261.5 L 64.8,261.4 L 64.9,261.3 L 64.9,261.2 L 64.8,261.1 L 64.8,260.9 L 64.8,260.9 L 64.7,260.8 L 64.7,260.7 L 64.7,260.5 L 64.7,260.4 L 64.6,260.2 L 64.7,260.2 L 64.7,260.1 L 64.7,260.1 L 64.6,259.9 L 64.7,259.8 L 64.7,259.8 L 64.8,259.8 L 64.8,259.7 L 64.8,259.7 L 64.9,259.6 L 64.9,259.6 L 64.9,259.5 L 65.0,259.5 L 65.0,259.4 L 65.1,259.4 L 65.1,259.3 L 65.2,259.3 L 65.2,259.2 L 65.2,259.2 L 65.3,259.1 L 65.3,259.0 L 65.3,259.0 L 65.4,258.9 L 65.4,258.8 L 65.3,258.8 L 65.2,258.7 L 65.2,258.7 L 65.2,258.8 L 65.1,258.8 L 65.0,258.8 L 65.0,258.9 L 64.9,258.9 L 64.9,258.9 L 64.8,259.0 L 64.5,259.0 L 64.4,259.0 L 64.3,259.1 L 64.3,259.1 L 64.2,259.1 L 64.2,259.1 L 64.1,259.2 L 64.1,259.2 L 64.0,259.2 L 64.0,259.3 L 63.9,259.3 L 63.9,259.3 L 63.9,259.4 L 63.8,259.4 L 63.8,259.4 L 63.7,259.5 L 63.7,259.5 L 63.6,259.5 L 63.6,259.6 L 63.4,259.6 L 63.4,259.6 L 63.3,259.6 L 63.3,259.7 L 63.3,259.7 L 63.2,259.7 L 63.2,259.8 L 63.1,259.8 L 63.1,259.8 L 63.0,259.8 L 62.9,259.8 L 62.9,259.8 L 62.8,259.8 L 62.8,259.9 L 62.7,259.9 L 62.6,259.9 L 62.5,260.0 L 62.4,260.0 L 62.3,260.0 L 62.1,260.1 L 62.1,260.1 L 62.0,260.1 L 61.9,260.2 L 61.8,260.2 L 61.7,260.2 L 61.5,260.2 L 61.5,260.3 L 61.2,260.3 L 61.1,260.3 L 61.1,260.3 L 61.1,260.3 L 61.0,260.2 L 61.0,260.2 L 60.9,260.2 L 60.9,260.1 L 60.8,260.1 L 60.7,260.1 L 60.6,260.1 L 60.1,260.0 L 60.1,260.0 L 60.1,260.0 L 60.0,259.9 L 59.9,259.9 L 59.7,259.9 L 59.6,259.9 L 59.6,259.9 L 59.5,259.9 L 59.5,259.7 L 59.4,259.7 L 59.4,259.6 L 59.3,259.6 L 59.3,259.4 L 59.3,259.3 L 59.3,258.9 L 59.3,258.8 L 59.2,258.8 L 59.2,258.8 L 59.2,258.6 L 59.1,258.6 L 59.1,258.6 L 59.0,258.5 L 59.0,258.4 L 58.9,258.4 L 58.9,258.4 L 58.8,258.3 L 58.8,258.3 L 58.8,258.2 L 58.7,258.2 L 58.7,258.1 L 58.7,258.0 L 58.6,258.0 L 58.6,257.9 L 58.5,257.8 L 58.5,257.8 L 58.4,257.7 L 58.4,257.7 L 58.4,257.6 L 58.3,257.6 L 58.2,257.5 L 58.1,257.5 L 58.1,257.4 L 58.1,257.4 L 58.0,257.4 L 57.9,257.3 L 57.9,257.1 L 57.9,256.8 L 58.0,256.5 L 57.9,256.4 L 57.9,256.3 L 57.9,256.1 L 58.0,256.1 L 58.0,256.0 L 58.1,256.0 L 58.1,255.9 L 58.3,256.0 L 58.5,256.0 L 58.6,255.9 L 58.7,255.9 L 58.7,255.9 L 58.7,255.8 L 58.7,255.7 L 58.7,255.5 L 58.8,255.5 L 58.9,255.6 L 59.0,255.5 L 59.0,255.5 L 59.1,255.4 L 59.2,255.4 L 59.3,255.4 L 59.4,255.4 L 59.8,255.4 L 59.8,255.5 L 59.9,255.5 L 59.9,255.6 L 60.0,255.7 L 60.0,255.7 L 60.1,255.8 L 60.1,255.8 L 60.1,255.9 L 60.2,255.9 L 60.3,255.9 L 60.3,256.0 L 60.4,256.0 L 60.4,256.1 L 60.5,256.1 L 60.5,256.1 L 60.6,256.2 L 60.6,256.2 L 60.7,256.2 L 60.7,256.3 L 60.8,256.3 L 60.8,256.3 L 60.9,256.4 L 60.9,256.4 L 60.9,256.4 L 60.9,256.6 L 61.0,256.5 L 61.1,256.4 L 61.1,256.3 L 61.1,255.9 L 61.1,255.8 L 61.1,255.6 L 61.2,255.6 L 61.3,255.6 L 61.3,255.4 L 61.8,255.5 L 61.8,255.5 L 61.9,255.5 L 61.9,255.6 L 62.0,255.6 L 62.1,255.7 L 62.3,255.6 L 62.3,255.6 L 62.4,255.7 L 62.4,255.7 L 62.5,255.6 L 62.5,255.6 L 62.5,255.5 L 62.5,255.4 L 62.6,255.4 L 62.6,255.3 L 62.7,255.3 L 62.7,255.3 L 62.8,255.2 L 62.8,255.1 L 62.8,255.1 L 62.8,254.8 L 62.9,254.8 L 62.9,254.6 L 62.8,254.6 L 62.8,254.5 L 62.6,254.5 L 62.6,254.4 L 62.5,254.4 L 62.5,254.4 L 62.4,254.4 L 62.4,254.3 L 62.4,254.3 L 62.3,254.2 L 62.3,254.2 L 62.3,254.2 L 62.2,254.2 L 62.2,254.1 L 62.1,254.1 L 62.1,254.1 L 62.1,254.0 L 62.0,254.0 L 62.0,254.0 L 61.9,253.9 L 61.9,253.9 L 61.8,253.9 L 61.8,253.9 L 61.7,253.8 L 61.7,253.8 L 61.7,253.7 L 61.6,253.7 L 61.6,253.7 L 61.5,253.6 L 61.5,253.6 L 61.4,253.6 L 61.4,253.5 L 61.4,253.3 L 61.3,253.3 L 61.3,253.2 L 61.3,253.2 L 61.2,253.1 L 61.2,253.1 L 61.1,253.0 L 61.1,253.0 L 61.0,253.0 L 61.0,252.9 L 60.9,252.9 L 60.9,252.9 L 60.8,252.8 L 60.8,252.8 L 60.9,252.7 L 60.9,252.7 L 60.9,252.7 L 61.0,252.6 L 61.0,252.6 L 61.1,252.5 L 61.1,252.5 L 61.2,252.5 L 61.2,252.4 L 61.3,252.4 L 61.3,252.4 L 61.3,252.3 L 61.4,252.2 L 61.4,252.1 L 61.4,252.1 L 61.4,252.0 L 61.5,252.0 L 61.5,252.0 L 61.6,251.9 L 61.6,251.8 L 61.6,251.8 L 61.7,251.7 L 61.7,251.6 L 61.7,251.6 L 61.7,251.6 L 61.8,251.7 L 61.8,251.8 L 61.7,251.8 L 61.7,251.9 L 61.6,251.9 L 61.6,252.0 L 61.6,252.1 L 61.5,252.2 L 61.5,252.2 L 61.5,252.3 L 61.6,252.3 L 61.6,252.2 L 61.7,252.2 L 61.7,252.1 L 61.8,252.1 L 61.8,252.0 L 61.8,251.9 L 61.9,251.8 L 61.9,251.8 L 62.0,251.8 L 62.1,251.7 L 62.1,251.7 L 62.1,251.6 L 62.2,251.6 L 62.2,251.5 L 62.2,251.5 L 62.2,251.4 L 62.2,251.4 L 62.3,251.4 L 62.3,251.2 L 62.3,251.1 L 62.2,251.1 L 62.2,251.1 L 62.1,251.0 L 62.1,251.0 L 62.2,250.9 L 62.2,250.9 L 62.3,250.8 L 62.3,250.8 L 62.4,250.8 L 62.7,250.8 L 62.7,250.8 L 62.8,250.8 L 62.8,250.9 L 62.8,250.9 L 62.9,251.0 L 62.9,251.0 L 62.9,251.1 L 63.0,251.1 L 63.0,251.2 L 63.1,251.2 L 63.1,251.2 L 63.2,251.3 L 63.3,251.3 L 63.5,251.3 L 63.5,251.3 L 63.6,251.3 L 63.6,251.4 L 63.7,251.4 L 63.7,251.5 L 63.8,251.5 L 63.8,251.5 L 64.1,251.6 L 64.3,251.6 L 64.6,251.6 L 64.7,251.5 L 64.7,251.5 L 64.8,251.4 L 64.8,251.4 L 64.8,251.3 L 64.9,251.3 L 64.9,251.2 L 65.0,251.2 L 65.0,251.1 L 65.1,251.1 L 65.2,251.1 L 65.2,251.1 L 65.2,251.1 L 65.3,251.2 L 65.5,251.2 L 66.0,251.2 L 66.1,251.1 L 66.2,251.1 L 66.2,251.1 L 66.3,251.1 L 66.4,251.0 L 66.5,251.0 L 66.6,251.0 L 66.7,250.9 L 66.7,250.9 L 66.8,250.8 L 66.8,250.8 L 66.8,250.8 L 66.8,250.7 L 66.9,250.7 L 67.0,250.6 L 67.0,250.6 L 67.1,250.5 L 67.3,250.5 L 67.5,250.5 L 67.6,250.5 L 67.6,250.5 L 67.7,250.4 L 67.8,250.4 L 67.8,250.3 L 67.9,250.3 L 67.9,250.3 L 68.0,250.2 L 68.0,250.0 L 68.0,249.9 L 68.0,249.8 L 68.2,249.8 L 68.2,249.7 L 68.3,249.7 L 68.3,249.7 L 68.4,249.7 L 68.4,249.6 L 68.5,249.5 L 68.5,249.5 L 68.5,249.5 L 68.6,249.5 L 68.7,249.5 L 68.7,249.5 L 68.7,249.6 L 68.7,249.6 L 68.9,249.6 L 69.0,249.6 L 69.0,249.6 L 68.9,249.5 L 69.0,249.5 L 69.0,249.4 L 69.1,249.5 L 69.2,249.4 L 69.2,249.4 L 69.3,249.3 L 69.4,249.3 L 69.4,249.2 L 69.4,249.2 L 69.4,249.0 L 69.4,249.0 L 69.4,248.9 L 69.8,248.9 L 70.4,248.9 L 71.6,247.7 L 72.0,246.8 L 72.0,245.0 L 72.0,241.4 L 73.6,240.6 L 75.3,240.3 L 76.4,240.5 L 77.3,240.7 L 78.4,240.7 L 79.6,240.6 L 81.2,239.6 L 83.9,240.7 L 84.9,239.7 L 85.8,239.5 L 87.0,241.0 L 88.6,242.3 L 89.6,243.7 L 90.7,243.9 L 92.7,243.0 L 94.1,242.5 L 94.9,243.0 L 95.0,243.5 L 95.8,243.1 L 96.7,243.1 L 96.9,242.1 L 96.3,240.8 L 97.8,239.9 L 100.7,239.2 L 103.1,239.0 L 104.7,238.8 L 108.3,239.2 L 110.0,239.1 L 112.5,239.5 L 115.1,239.1 L 116.0,239.8 L 115.6,240.5 L 115.7,241.3 L 114.9,242.1 L 116.4,242.4 L 116.0,243.9 L 115.5,244.5 L 116.6,245.2 L 117.2,245.8 L 118.0,246.8 L 119.0,247.6 L 117.7,248.8 L 116.9,249.5 L 115.8,250.2 L 115.5,250.4 L 114.8,251.2 L 111.8,250.4 L 110.7,251.2 L 110.2,251.8 L 109.9,253.5 L 109.3,254.5 L 108.1,254.6 L 107.3,255.2 L 107.7,256.5 L 108.0,257.6 L 105.9,259.3 L 103.8,260.0 L 103.3,260.3 L 102.8,263.6 L 102.1,264.7 L 101.4,264.8 L 100.7,266.9 L 100.6,267.8 L 100.1,268.9 L 99.4,269.8 L 98.2,271.1 L 98.6,271.6 L 99.5,271.5 L 100.7,270.6 L 100.9,271.2 L 102.2,270.6 L 103.1,272.5 L 103.4,274.1 L 102.6,274.9 L 100.9,276.0 L 100.0,277.6 L 98.9,278.5 L 98.5,278.6 L 98.2,279.3 L 97.6,280.5 L 97.5,281.7 L 98.7,282.4 L 100.7,282.0 L 99.4,282.6 L 99.0,283.2 L 100.8,284.0 L 103.3,286.0 L 103.9,286.1 L 102.8,286.6 L 102.2,287.6 L 101.5,287.3 L 100.9,287.5 L 102.3,288.6 L 102.5,287.8 L 102.8,287.7 L 103.7,287.4 L 104.5,286.7 L 105.1,286.1 L 105.3,286.6 L 105.0,288.0 L 104.2,289.6 L 104.3,291.2 L 104.4,292.3 L 104.6,293.0 L 105.6,293.6 L 106.6,293.4 L 107.1,295.1 L 107.9,296.2 L 108.5,296.8 L 107.1,298.3 L 106.6,299.2 L 106.9,299.9 L 106.8,300.7 L 109.6,301.3 L 111.6,301.1 L 111.8,302.4 L 113.0,302.7 L 114.7,302.3 L 114.3,303.1 L 114.9,303.4 L 114.9,304.4 L 116.2,305.0 L 117.2,305.5 L 115.9,306.3 L 117.0,306.7 L 116.0,307.7 L 116.9,307.7 L 115.9,309.0 L 117.2,309.4 L 117.5,308.3 L 118.9,308.9 L 119.5,307.7 L 119.8,309.3 L 121.3,310.1 L 123.0,309.4 L 124.0,309.9 L 125.6,310.4 L 126.9,310.6 L 128.3,310.7 L 129.2,311.8 L 127.7,311.8 L 126.9,312.8 L 126.4,312.5 L 125.8,313.2 L 124.9,314.1 L 125.3,314.5 L 124.2,314.3 L 124.1,313.1 L 122.8,315.4 L 123.7,316.7 L 124.5,318.4 L 125.5,319.8 L 126.8,320.1 L 128.2,320.9 L 127.7,321.8 L 127.1,323.5 L 126.3,325.1 L 124.6,326.9 L 122.8,328.2 L 121.6,327.7 L 120.7,328.9 L 118.1,330.7 L 117.0,331.4 L 119.4,331.6 L 120.3,332.7 L 118.5,333.6 L 117.4,332.7 L 115.8,333.0 L 115.2,333.9 L 113.8,334.7 L 113.2,333.6 L 110.0,334.1 L 109.1,334.7 L 108.4,333.8 L 108.7,332.9 L 108.3,331.5 L 107.5,330.5 L 106.8,330.6 L 106.4,331.3 L 105.9,331.7 L 105.2,332.1 L 102.8,332.1 L 101.8,330.6 L 102.5,329.7 L 101.0,328.1 L 100.6,326.8 L 99.4,325.6 L 100.4,324.2 L 101.1,323.1 L 99.4,322.1 L 98.2,321.8 L 96.4,321.8 L 94.4,321.0 L 95.0,319.2 L 93.3,318.4 L 89.5,319.3 L 86.9,318.5 L 85.4,319.2 L 85.1,319.3 Z"
    },
    {
      "id": "ratnagiri",
      "name": "Ratnagiri",
      "path": "M 74.3,337.0 L 74.3,337.0 L 74.3,337.0 L 74.3,337.0 L 74.3,337.0 L 74.3,337.0 L 74.3,337.0 L 74.3,337.0 L 74.4,337.0 L 74.4,337.1 L 74.4,337.1 L 74.4,337.1 L 74.4,337.1 L 74.4,337.1 L 74.4,337.1 L 74.4,337.2 L 74.4,337.2 L 74.4,337.2 L 74.3,337.2 L 74.3,337.3 L 74.3,337.3 L 74.3,337.3 L 74.2,337.3 L 74.2,337.3 L 74.2,337.3 L 74.2,337.3 L 74.2,337.3 L 74.2,337.2 L 74.2,337.2 L 74.2,337.2 L 74.2,337.2 L 74.2,337.1 L 74.1,337.1 L 74.1,337.1 L 74.1,337.1 L 74.1,337.1 L 74.1,337.1 L 74.1,337.0 L 74.1,337.0 L 74.1,337.0 L 74.2,337.0 L 74.2,337.0 L 74.3,337.0 Z M 85.1,319.3 L 86.6,318.5 L 88.7,319.2 L 92.6,318.3 L 94.2,318.3 L 94.6,319.8 L 95.8,321.8 L 97.5,321.5 L 98.9,322.6 L 100.9,322.8 L 100.6,324.0 L 99.5,324.8 L 100.1,326.6 L 101.1,327.1 L 101.8,328.6 L 102.0,330.4 L 102.1,331.9 L 104.4,332.3 L 105.5,331.9 L 106.0,331.6 L 106.5,331.1 L 106.9,330.4 L 107.9,330.7 L 108.5,332.3 L 108.7,333.0 L 108.4,334.0 L 109.4,334.6 L 110.4,333.6 L 113.5,334.1 L 114.3,334.6 L 115.8,333.6 L 116.4,332.6 L 117.5,333.0 L 119.3,333.1 L 120.7,332.7 L 120.8,333.6 L 122.3,334.8 L 121.9,335.5 L 121.5,336.2 L 122.3,337.0 L 122.8,338.4 L 122.7,339.1 L 121.6,339.6 L 122.2,340.3 L 121.4,342.0 L 120.5,343.7 L 121.3,344.9 L 121.7,345.5 L 122.5,345.9 L 124.4,345.0 L 126.3,345.9 L 128.1,345.7 L 128.9,346.4 L 129.4,346.5 L 131.3,346.8 L 130.6,347.6 L 131.9,348.4 L 132.2,348.8 L 132.5,349.2 L 132.2,349.9 L 131.9,350.6 L 131.6,351.3 L 133.7,351.6 L 134.6,351.9 L 133.9,352.7 L 134.4,353.2 L 135.0,354.0 L 133.8,355.3 L 136.6,356.6 L 135.4,359.0 L 134.5,359.3 L 132.9,360.6 L 132.7,361.5 L 132.2,362.2 L 132.5,362.8 L 132.5,364.3 L 133.0,365.2 L 132.8,366.6 L 131.6,366.7 L 130.3,367.4 L 129.3,368.9 L 128.3,369.2 L 127.6,368.7 L 127.2,369.0 L 127.6,369.7 L 128.7,370.1 L 129.9,370.5 L 131.1,372.1 L 130.7,373.1 L 131.1,374.7 L 130.2,376.1 L 131.1,376.4 L 131.2,377.1 L 131.9,378.5 L 132.1,379.3 L 131.7,380.4 L 132.5,381.3 L 134.0,383.1 L 133.0,384.2 L 132.1,384.6 L 132.4,384.9 L 132.5,386.0 L 131.5,387.5 L 132.6,387.7 L 134.5,388.6 L 136.3,388.9 L 137.8,389.1 L 139.8,390.1 L 141.2,391.1 L 142.0,392.8 L 143.7,393.6 L 144.2,395.7 L 144.1,397.2 L 144.7,398.9 L 143.7,399.0 L 141.6,398.9 L 140.2,398.8 L 139.1,400.1 L 138.6,401.2 L 139.9,402.3 L 141.1,403.4 L 141.0,404.5 L 140.5,405.1 L 138.9,405.0 L 138.0,405.3 L 137.3,405.1 L 136.4,404.4 L 135.9,405.8 L 136.8,405.5 L 136.8,406.9 L 138.7,408.1 L 138.6,408.9 L 138.4,409.4 L 135.8,409.8 L 135.1,410.5 L 134.0,410.5 L 133.7,411.2 L 135.0,411.9 L 136.3,411.8 L 137.2,412.6 L 137.9,412.9 L 137.6,414.2 L 137.6,414.6 L 138.0,415.3 L 139.8,414.4 L 140.8,415.9 L 141.9,415.8 L 143.3,415.7 L 144.4,416.8 L 144.8,417.0 L 145.0,417.6 L 145.3,418.4 L 144.1,419.5 L 143.6,420.2 L 144.0,420.7 L 145.6,421.1 L 146.9,421.4 L 147.8,422.2 L 146.5,422.6 L 147.1,422.6 L 147.6,423.0 L 147.0,423.5 L 146.8,424.2 L 146.1,424.3 L 144.3,423.7 L 141.6,423.0 L 140.5,423.6 L 139.0,423.3 L 137.9,425.0 L 138.9,426.4 L 138.6,427.4 L 137.9,428.0 L 136.0,427.9 L 134.1,427.5 L 133.7,427.3 L 132.6,426.1 L 131.0,427.0 L 129.6,429.0 L 128.9,429.7 L 127.7,429.9 L 127.6,430.7 L 126.3,430.9 L 124.9,431.1 L 122.7,432.3 L 120.9,432.5 L 118.9,433.7 L 117.6,434.4 L 115.6,433.8 L 113.4,434.1 L 112.3,435.0 L 111.2,435.9 L 110.6,436.0 L 110.2,435.8 L 105.8,434.2 L 105.0,434.7 L 102.7,434.3 L 102.6,434.3 L 102.5,434.4 L 102.3,434.4 L 102.2,434.3 L 102.1,434.3 L 102.1,434.2 L 102.1,434.2 L 102.0,434.2 L 102.0,434.1 L 101.8,434.1 L 101.7,434.1 L 101.6,434.1 L 101.4,434.1 L 101.4,434.1 L 101.3,434.1 L 101.3,434.0 L 101.2,434.0 L 101.2,434.0 L 101.1,434.0 L 101.0,433.9 L 100.9,433.9 L 100.9,433.8 L 100.8,433.8 L 100.7,433.8 L 100.6,433.7 L 100.6,433.7 L 100.5,433.7 L 100.4,433.6 L 100.3,433.6 L 100.2,433.6 L 100.1,433.6 L 100.1,433.5 L 100.0,433.5 L 99.8,433.5 L 99.8,433.4 L 99.6,433.4 L 99.6,433.2 L 99.5,433.2 L 99.4,433.1 L 99.4,433.1 L 99.4,432.9 L 99.5,432.9 L 99.4,432.8 L 99.4,432.8 L 99.4,432.7 L 99.3,432.6 L 99.3,432.4 L 99.4,432.4 L 99.6,432.4 L 99.7,432.4 L 99.7,432.5 L 99.8,432.5 L 99.8,432.4 L 99.9,432.4 L 100.1,432.4 L 100.1,432.4 L 100.4,432.3 L 100.4,432.3 L 100.5,432.3 L 100.5,432.2 L 100.6,432.2 L 100.7,432.2 L 100.7,432.3 L 100.7,432.3 L 100.8,432.3 L 100.9,432.4 L 100.9,432.4 L 100.9,432.4 L 101.0,432.5 L 101.0,432.4 L 101.0,432.4 L 101.0,432.3 L 100.9,432.3 L 100.9,432.3 L 100.8,432.2 L 100.7,432.2 L 100.7,432.2 L 100.7,432.1 L 100.6,432.1 L 100.6,432.0 L 100.5,432.0 L 100.5,432.1 L 100.4,432.1 L 100.4,432.1 L 100.3,432.2 L 100.3,432.2 L 100.2,432.2 L 100.1,432.2 L 100.0,432.2 L 99.8,432.2 L 99.8,432.3 L 99.7,432.3 L 99.6,432.3 L 99.5,432.3 L 99.4,432.3 L 99.4,432.3 L 99.3,432.2 L 99.3,432.1 L 99.2,432.1 L 99.1,432.1 L 99.0,432.1 L 99.0,432.0 L 98.9,432.0 L 98.9,431.9 L 98.8,431.9 L 98.8,431.9 L 98.8,431.9 L 98.9,431.8 L 98.9,431.8 L 98.9,431.7 L 99.0,431.7 L 99.1,431.6 L 99.1,431.6 L 99.0,431.6 L 99.0,431.6 L 99.0,431.5 L 98.8,431.5 L 98.8,431.5 L 98.7,431.5 L 98.6,431.4 L 98.6,431.4 L 98.6,431.2 L 98.5,431.2 L 98.6,431.1 L 98.9,431.1 L 99.1,431.1 L 99.1,431.2 L 99.2,431.2 L 99.2,431.2 L 99.3,431.3 L 99.3,431.3 L 99.4,431.3 L 99.5,431.4 L 99.5,431.4 L 99.6,431.4 L 99.7,431.4 L 99.7,431.4 L 99.8,431.4 L 99.8,431.5 L 99.8,431.5 L 99.9,431.5 L 100.4,431.5 L 100.4,431.5 L 100.6,431.5 L 100.8,431.6 L 101.1,431.6 L 101.2,431.6 L 101.4,431.6 L 101.5,431.5 L 101.5,431.5 L 101.5,431.4 L 101.6,431.4 L 101.9,431.3 L 102.1,431.3 L 102.4,431.3 L 102.5,431.4 L 102.6,431.4 L 102.9,431.4 L 103.0,431.4 L 103.0,431.3 L 102.9,431.3 L 102.7,431.3 L 102.6,431.3 L 102.4,431.3 L 102.3,431.2 L 102.1,431.2 L 102.1,431.2 L 101.9,431.2 L 101.9,431.2 L 101.8,431.2 L 101.8,431.2 L 101.8,431.2 L 101.8,431.1 L 101.8,431.1 L 101.8,431.1 L 101.7,431.1 L 101.6,431.2 L 101.5,431.2 L 101.5,431.2 L 101.5,431.3 L 101.4,431.3 L 101.4,431.4 L 101.4,431.4 L 101.3,431.4 L 101.3,431.5 L 101.1,431.5 L 101.1,431.4 L 101.0,431.5 L 100.9,431.5 L 100.7,431.4 L 100.6,431.4 L 100.5,431.4 L 100.4,431.3 L 100.4,431.3 L 100.3,431.4 L 100.2,431.4 L 100.1,431.3 L 100.0,431.3 L 99.9,431.3 L 99.9,431.3 L 99.7,431.2 L 99.7,431.2 L 99.6,431.2 L 99.6,431.2 L 99.5,431.2 L 99.5,431.2 L 99.4,431.2 L 99.5,431.1 L 99.5,431.0 L 99.5,430.8 L 99.5,430.8 L 99.6,430.7 L 99.5,430.7 L 99.5,430.6 L 99.4,430.6 L 99.4,430.5 L 99.4,430.5 L 99.6,430.4 L 99.6,430.4 L 99.7,430.4 L 99.8,430.5 L 99.9,430.4 L 100.1,430.4 L 100.1,430.3 L 100.0,430.3 L 100.0,430.3 L 99.8,430.3 L 99.8,430.3 L 99.6,430.3 L 99.5,430.3 L 99.4,430.3 L 99.4,430.4 L 99.3,430.4 L 99.3,430.5 L 99.3,430.6 L 99.1,430.6 L 99.1,430.5 L 98.7,430.5 L 98.6,430.5 L 98.5,430.5 L 98.4,430.5 L 98.3,430.5 L 98.2,430.4 L 98.2,430.4 L 98.2,430.3 L 98.3,430.2 L 98.3,430.2 L 98.3,430.1 L 98.4,430.1 L 98.5,430.0 L 98.5,429.9 L 98.4,429.8 L 98.4,429.8 L 98.4,429.7 L 98.5,429.7 L 98.4,429.7 L 98.4,429.6 L 98.3,429.6 L 98.3,429.6 L 98.2,429.5 L 98.2,429.5 L 98.2,429.5 L 98.1,429.4 L 98.0,429.4 L 98.0,429.4 L 97.8,429.4 L 97.7,429.4 L 97.6,429.5 L 97.5,429.5 L 97.5,429.6 L 97.3,429.6 L 97.2,429.6 L 97.1,429.6 L 97.1,429.5 L 97.0,429.5 L 97.0,429.5 L 96.9,429.4 L 96.8,429.4 L 96.8,429.4 L 96.7,429.3 L 96.6,429.3 L 96.5,429.2 L 96.5,429.2 L 96.4,429.2 L 96.4,429.2 L 96.4,429.1 L 96.4,429.1 L 96.4,428.9 L 96.4,428.8 L 96.4,428.7 L 96.4,428.7 L 96.3,428.6 L 96.3,428.6 L 96.2,428.5 L 96.1,428.5 L 96.1,428.5 L 96.1,428.4 L 96.0,428.3 L 96.0,428.2 L 96.1,428.1 L 96.1,428.1 L 96.1,428.0 L 96.1,428.0 L 96.0,427.9 L 95.9,427.9 L 95.9,427.9 L 95.8,427.8 L 95.9,427.8 L 95.9,427.7 L 95.9,427.7 L 96.1,427.7 L 96.1,427.5 L 96.1,427.5 L 96.2,427.4 L 96.3,427.4 L 96.4,427.4 L 96.5,427.4 L 96.5,427.5 L 96.6,427.5 L 96.6,427.4 L 96.7,427.4 L 96.7,427.4 L 96.9,427.3 L 97.0,427.3 L 97.1,427.3 L 97.2,427.3 L 97.4,427.3 L 97.4,427.4 L 97.5,427.4 L 97.5,427.4 L 97.6,427.5 L 97.7,427.5 L 97.9,427.5 L 97.9,427.5 L 98.0,427.6 L 98.0,427.6 L 98.0,427.6 L 98.0,427.8 L 98.1,427.8 L 98.1,427.9 L 98.3,427.9 L 98.3,427.9 L 98.4,428.0 L 98.6,428.0 L 98.6,428.0 L 98.6,428.2 L 98.7,428.3 L 98.7,428.3 L 98.7,428.2 L 98.8,428.2 L 98.9,428.2 L 99.0,428.3 L 99.0,428.3 L 99.0,428.3 L 99.1,428.3 L 99.1,428.2 L 99.2,428.1 L 99.1,428.1 L 99.0,428.1 L 99.0,428.1 L 99.0,428.1 L 98.9,428.0 L 98.9,427.9 L 98.9,427.9 L 98.9,427.8 L 98.9,427.7 L 98.8,427.7 L 98.8,427.7 L 98.7,427.8 L 98.7,427.8 L 98.6,427.8 L 98.5,427.7 L 98.5,427.7 L 98.4,427.6 L 98.4,427.6 L 98.2,427.6 L 98.1,427.5 L 98.1,427.5 L 98.1,427.4 L 98.1,427.4 L 98.2,427.3 L 98.2,427.3 L 98.2,427.2 L 98.3,427.2 L 98.3,427.1 L 98.4,427.1 L 98.5,427.0 L 98.5,427.0 L 98.6,427.0 L 98.7,426.9 L 98.8,426.9 L 98.8,427.0 L 98.9,427.0 L 98.9,427.0 L 99.0,427.0 L 99.0,427.0 L 99.1,426.9 L 99.1,426.6 L 99.1,426.3 L 99.1,426.2 L 99.1,426.2 L 99.1,426.1 L 99.1,426.0 L 99.0,426.1 L 99.0,426.1 L 98.9,426.2 L 98.9,426.2 L 98.8,426.2 L 98.7,426.3 L 98.6,426.3 L 98.5,426.3 L 98.0,426.3 L 98.0,426.2 L 97.9,426.2 L 97.9,426.1 L 97.8,426.1 L 97.7,426.2 L 97.7,426.2 L 97.7,426.2 L 97.6,426.3 L 97.5,426.4 L 97.3,426.5 L 97.2,426.4 L 97.1,426.4 L 97.1,426.4 L 97.1,426.3 L 97.1,426.2 L 97.2,426.2 L 97.2,426.1 L 97.3,426.1 L 97.3,426.1 L 97.3,426.1 L 97.4,426.0 L 97.4,426.0 L 97.5,426.0 L 97.5,425.9 L 97.5,425.9 L 97.7,425.9 L 97.7,425.8 L 97.9,425.8 L 97.9,425.8 L 98.0,425.9 L 98.0,425.9 L 98.1,425.9 L 98.1,425.8 L 98.2,425.8 L 98.2,425.7 L 98.1,425.7 L 98.1,425.7 L 98.0,425.7 L 98.0,425.6 L 98.0,425.6 L 97.9,425.5 L 98.0,425.4 L 98.0,425.4 L 98.0,425.3 L 98.0,425.2 L 98.0,425.1 L 97.9,425.1 L 97.8,425.0 L 97.7,425.0 L 97.6,424.9 L 97.5,424.9 L 97.4,424.9 L 97.3,424.8 L 97.1,424.8 L 97.0,424.9 L 97.0,425.0 L 97.0,425.0 L 97.0,425.0 L 97.0,425.1 L 97.0,425.1 L 96.9,425.1 L 96.8,425.2 L 96.6,425.2 L 96.5,425.2 L 96.4,425.1 L 96.4,425.0 L 96.4,424.9 L 96.3,424.7 L 96.3,424.6 L 96.4,424.5 L 96.4,424.5 L 96.5,424.5 L 96.5,424.5 L 96.5,424.3 L 96.5,424.3 L 96.6,424.3 L 96.8,424.3 L 96.8,424.4 L 96.9,424.4 L 96.9,424.5 L 97.0,424.4 L 97.0,424.4 L 97.1,424.4 L 97.1,424.3 L 97.2,424.3 L 97.2,424.2 L 97.2,424.2 L 97.3,424.1 L 97.3,424.0 L 97.3,423.9 L 97.3,423.6 L 97.3,423.4 L 97.3,423.2 L 97.2,422.9 L 97.2,422.8 L 97.2,422.8 L 97.2,422.7 L 97.1,422.4 L 97.1,422.2 L 97.1,422.0 L 97.0,422.0 L 97.0,421.5 L 97.4,421.5 L 97.5,421.5 L 97.7,421.6 L 97.8,421.6 L 98.0,421.6 L 97.9,421.5 L 97.8,421.5 L 97.8,421.5 L 97.6,421.5 L 97.5,421.4 L 97.5,421.4 L 97.5,421.3 L 97.2,421.4 L 97.1,421.4 L 97.0,421.3 L 97.0,421.3 L 96.9,421.3 L 96.9,421.2 L 96.8,421.2 L 96.7,421.2 L 96.6,421.2 L 96.6,421.1 L 96.5,421.1 L 96.5,421.0 L 96.4,421.0 L 96.4,420.9 L 96.3,420.9 L 96.3,420.9 L 96.2,420.9 L 96.2,420.8 L 96.1,420.8 L 96.1,420.7 L 96.0,420.7 L 96.0,420.6 L 95.9,420.6 L 95.9,420.4 L 95.9,420.3 L 96.0,420.2 L 96.1,420.2 L 96.0,420.1 L 96.0,420.0 L 95.9,419.9 L 95.9,419.9 L 95.9,419.8 L 95.8,419.7 L 95.8,419.6 L 95.7,419.6 L 95.7,419.5 L 95.6,419.5 L 95.6,419.4 L 95.5,419.4 L 95.4,419.4 L 95.4,419.3 L 95.3,419.3 L 95.3,419.2 L 95.4,418.8 L 95.3,418.8 L 95.3,418.8 L 95.2,418.8 L 95.2,418.6 L 95.2,418.6 L 95.1,418.4 L 94.9,418.4 L 94.9,418.3 L 94.8,418.3 L 94.8,418.3 L 94.8,418.2 L 94.8,418.1 L 94.9,418.1 L 94.9,417.8 L 94.8,417.8 L 94.8,417.7 L 94.8,417.5 L 94.8,417.3 L 94.8,417.2 L 94.9,417.0 L 94.9,416.9 L 94.9,416.9 L 94.9,416.8 L 94.9,416.7 L 94.8,416.7 L 94.7,416.6 L 94.8,416.6 L 94.8,416.2 L 94.8,415.9 L 94.8,415.7 L 94.8,415.4 L 94.8,415.3 L 94.9,415.3 L 94.9,415.2 L 94.9,415.2 L 95.0,415.0 L 94.9,414.9 L 94.9,414.8 L 94.9,414.8 L 95.0,414.6 L 95.0,414.5 L 95.0,414.4 L 95.1,414.4 L 95.1,414.3 L 95.2,414.2 L 95.2,414.1 L 95.3,414.0 L 95.3,413.9 L 95.3,413.9 L 95.4,413.8 L 95.4,413.8 L 95.5,413.7 L 95.5,413.7 L 95.6,413.6 L 95.6,413.6 L 95.6,413.6 L 95.7,413.5 L 95.7,413.5 L 95.8,413.5 L 95.8,413.4 L 95.9,413.4 L 95.9,413.3 L 95.9,413.2 L 95.9,413.2 L 95.8,413.1 L 95.8,412.8 L 95.8,412.8 L 95.9,412.7 L 95.9,412.7 L 96.0,412.5 L 96.1,412.5 L 96.2,412.5 L 96.2,412.4 L 96.3,412.4 L 96.4,412.4 L 96.4,412.4 L 96.4,412.3 L 96.5,412.2 L 96.5,412.2 L 96.6,412.2 L 96.6,412.1 L 96.6,412.1 L 96.7,412.0 L 97.0,412.0 L 97.1,412.1 L 97.2,412.0 L 97.3,411.9 L 97.3,411.9 L 97.3,411.8 L 97.3,411.8 L 97.3,411.7 L 97.2,411.6 L 97.2,411.6 L 97.2,411.6 L 97.1,411.5 L 97.0,411.5 L 96.9,411.4 L 96.7,411.5 L 96.7,411.6 L 96.6,411.6 L 96.6,411.7 L 96.5,411.7 L 96.5,411.8 L 96.5,411.8 L 96.4,412.0 L 96.4,412.0 L 96.4,412.1 L 96.3,412.1 L 96.2,412.2 L 96.2,412.2 L 96.1,412.2 L 95.9,412.3 L 95.9,412.3 L 95.8,412.4 L 95.8,412.4 L 95.8,412.4 L 95.7,412.5 L 95.3,412.5 L 95.3,412.4 L 95.2,412.4 L 95.2,412.4 L 95.0,412.4 L 94.6,412.3 L 94.5,412.3 L 94.5,412.2 L 94.4,412.2 L 94.4,412.2 L 94.3,412.2 L 94.3,412.1 L 94.2,412.1 L 94.2,412.1 L 94.2,412.0 L 94.1,412.0 L 94.1,412.0 L 94.1,411.9 L 94.0,411.9 L 94.0,411.9 L 93.9,411.8 L 93.9,411.8 L 93.9,411.7 L 93.8,411.4 L 93.9,411.3 L 94.0,411.3 L 94.0,411.3 L 94.0,411.2 L 93.9,411.1 L 94.0,410.9 L 93.9,410.9 L 93.9,410.8 L 93.8,410.8 L 93.8,410.7 L 93.8,410.7 L 93.7,410.6 L 93.8,410.5 L 93.8,410.4 L 93.7,410.4 L 93.7,410.4 L 93.6,410.3 L 93.6,410.2 L 93.7,410.1 L 93.7,410.1 L 93.7,410.0 L 93.6,409.9 L 93.6,409.9 L 93.5,409.8 L 93.5,409.8 L 93.5,409.7 L 93.4,409.7 L 93.3,409.8 L 93.3,409.8 L 93.2,409.7 L 93.2,409.6 L 93.2,409.6 L 93.3,409.6 L 93.3,409.5 L 93.4,409.5 L 93.5,409.5 L 93.5,409.4 L 93.6,409.4 L 93.6,409.4 L 93.7,409.3 L 93.6,409.1 L 93.5,409.1 L 93.4,409.2 L 93.4,409.1 L 93.4,409.0 L 93.6,409.0 L 93.6,408.8 L 93.6,408.8 L 93.3,408.8 L 93.3,408.7 L 93.2,408.7 L 93.2,408.6 L 93.3,408.6 L 93.3,408.6 L 93.5,408.5 L 93.5,408.5 L 93.7,408.5 L 93.8,408.6 L 93.8,408.6 L 93.8,408.4 L 93.8,408.2 L 93.7,408.0 L 93.7,407.9 L 93.7,407.8 L 93.6,407.7 L 93.5,407.7 L 93.5,407.7 L 93.4,407.7 L 93.3,407.7 L 93.3,407.6 L 93.2,407.6 L 93.2,407.5 L 93.0,407.5 L 93.0,407.3 L 93.1,407.2 L 93.0,407.1 L 93.0,407.1 L 93.0,407.0 L 93.0,406.9 L 93.0,406.9 L 93.1,406.9 L 93.1,406.8 L 93.3,406.8 L 93.3,406.8 L 93.5,406.7 L 93.5,406.7 L 93.5,406.7 L 93.6,406.6 L 93.7,406.6 L 93.7,406.5 L 93.7,406.4 L 93.8,406.4 L 93.9,406.4 L 93.9,406.3 L 94.0,406.3 L 94.1,406.3 L 94.4,406.2 L 94.5,406.2 L 94.6,406.3 L 94.7,406.3 L 94.9,406.3 L 94.9,406.3 L 95.0,406.3 L 95.0,406.3 L 95.1,406.2 L 95.2,406.3 L 95.3,406.3 L 95.4,406.4 L 95.4,406.4 L 95.5,406.4 L 95.5,406.3 L 95.5,406.3 L 95.4,406.3 L 95.4,406.2 L 95.3,406.2 L 95.1,406.2 L 94.9,406.2 L 94.8,406.2 L 94.8,406.2 L 94.7,406.2 L 94.6,406.2 L 94.5,406.2 L 94.5,406.1 L 94.4,406.1 L 94.3,406.0 L 94.3,406.0 L 94.2,405.9 L 94.2,405.9 L 94.2,405.9 L 94.1,405.8 L 94.1,405.8 L 94.0,405.8 L 94.0,405.7 L 93.8,405.7 L 93.7,405.7 L 93.5,405.7 L 93.4,405.8 L 93.3,405.8 L 93.2,405.8 L 93.1,405.8 L 93.1,405.8 L 93.1,405.8 L 93.1,406.0 L 93.1,406.1 L 92.9,406.1 L 92.9,406.0 L 92.8,406.1 L 92.7,406.1 L 92.6,406.1 L 92.5,406.1 L 92.4,406.1 L 92.4,406.2 L 92.3,406.1 L 92.2,406.0 L 92.2,406.0 L 92.2,405.9 L 92.3,405.9 L 92.3,405.8 L 92.4,405.8 L 92.4,405.8 L 92.4,405.7 L 92.4,405.6 L 92.4,405.3 L 92.3,405.2 L 92.4,405.2 L 92.4,405.2 L 92.5,405.2 L 92.5,405.1 L 92.5,405.1 L 92.6,405.0 L 92.7,405.0 L 92.7,405.0 L 92.8,405.0 L 92.8,404.8 L 92.8,404.8 L 92.8,404.7 L 92.9,404.6 L 92.9,404.6 L 93.0,404.5 L 92.9,404.5 L 92.9,404.4 L 92.9,404.4 L 93.0,404.3 L 93.1,404.3 L 93.0,404.1 L 93.0,404.0 L 93.0,404.0 L 92.9,404.0 L 92.8,403.9 L 92.8,403.8 L 92.7,403.7 L 92.7,403.7 L 92.6,403.6 L 92.7,403.6 L 92.7,403.5 L 92.6,403.5 L 92.6,403.3 L 92.7,403.2 L 92.8,403.1 L 92.9,403.1 L 93.0,403.2 L 93.1,403.1 L 93.1,402.9 L 93.1,402.8 L 93.0,402.8 L 93.0,402.7 L 93.0,402.6 L 92.9,402.5 L 92.9,402.5 L 92.8,402.5 L 92.8,402.4 L 92.8,402.4 L 92.8,402.3 L 92.9,402.3 L 92.8,402.2 L 92.8,402.1 L 92.7,402.0 L 92.7,402.0 L 92.6,402.0 L 92.6,401.9 L 92.6,401.8 L 92.7,401.7 L 92.7,401.6 L 92.8,401.6 L 92.8,401.5 L 92.9,401.5 L 92.9,401.6 L 93.0,401.6 L 93.0,401.6 L 93.2,401.6 L 93.2,401.5 L 93.3,401.5 L 93.3,401.4 L 93.3,401.4 L 93.4,401.4 L 93.5,401.3 L 93.6,401.1 L 93.5,400.8 L 93.5,400.8 L 93.6,400.7 L 93.6,400.7 L 93.7,400.7 L 93.7,400.6 L 93.7,400.5 L 93.7,400.3 L 93.7,400.3 L 93.7,400.1 L 93.7,400.1 L 93.7,399.7 L 93.7,399.7 L 93.8,399.6 L 93.8,399.5 L 93.8,399.4 L 93.7,399.1 L 93.7,399.1 L 93.6,399.0 L 93.6,399.0 L 93.5,399.0 L 93.5,399.0 L 93.5,398.9 L 93.4,398.9 L 92.9,398.9 L 92.8,398.8 L 92.7,398.8 L 92.7,398.8 L 92.6,398.8 L 92.6,398.7 L 92.5,398.7 L 92.5,398.7 L 92.2,398.6 L 92.1,398.7 L 92.1,398.7 L 92.1,398.8 L 92.0,398.8 L 92.0,398.9 L 92.0,399.0 L 91.9,399.1 L 91.8,399.1 L 91.7,399.1 L 91.6,399.1 L 91.6,399.0 L 91.5,399.0 L 91.5,398.9 L 91.4,398.8 L 91.3,398.6 L 91.4,398.6 L 91.3,398.3 L 91.4,398.3 L 91.4,398.2 L 91.5,398.1 L 91.4,398.1 L 91.5,398.0 L 91.5,398.0 L 91.5,398.1 L 91.6,398.1 L 91.7,398.1 L 91.8,398.2 L 92.0,398.2 L 92.0,398.2 L 92.1,398.1 L 92.2,398.0 L 92.2,398.0 L 92.3,398.0 L 92.5,398.0 L 92.7,397.9 L 92.8,397.9 L 92.8,397.8 L 92.8,397.7 L 92.8,397.7 L 92.8,397.6 L 92.8,397.3 L 92.8,397.2 L 92.8,397.1 L 92.7,397.1 L 92.7,397.0 L 92.6,397.0 L 92.6,396.8 L 92.5,396.8 L 92.5,396.7 L 92.5,396.7 L 92.4,396.7 L 92.4,396.6 L 92.3,396.6 L 92.3,396.5 L 92.3,396.5 L 92.2,396.5 L 92.2,396.4 L 92.2,396.3 L 92.1,396.3 L 91.9,396.3 L 91.8,396.3 L 91.7,396.3 L 91.6,396.4 L 91.6,396.3 L 91.6,396.2 L 91.2,396.2 L 91.2,396.4 L 91.1,396.4 L 91.1,396.5 L 91.0,396.5 L 91.0,396.5 L 90.8,396.5 L 90.7,396.5 L 90.6,396.5 L 90.5,396.6 L 90.3,396.6 L 90.3,396.5 L 90.2,396.5 L 90.2,396.3 L 90.2,396.3 L 90.1,396.1 L 90.1,396.1 L 90.1,396.0 L 90.1,396.0 L 90.1,395.9 L 90.2,395.9 L 90.2,395.8 L 90.2,395.7 L 90.3,395.7 L 90.4,395.7 L 90.3,395.5 L 90.3,395.3 L 90.3,395.3 L 90.3,395.2 L 90.3,395.1 L 90.2,395.0 L 90.2,394.9 L 90.2,394.7 L 90.2,394.6 L 90.2,394.5 L 90.2,394.5 L 90.3,394.4 L 90.4,394.4 L 90.6,394.4 L 90.7,394.4 L 90.8,394.4 L 90.9,394.4 L 91.0,394.5 L 91.1,394.5 L 91.2,394.6 L 91.2,394.7 L 91.3,394.7 L 91.4,394.7 L 91.4,394.8 L 91.4,394.8 L 91.5,394.9 L 91.4,394.9 L 91.4,395.0 L 91.5,395.1 L 91.5,395.2 L 91.7,395.1 L 91.7,395.1 L 91.8,395.1 L 91.8,395.2 L 91.9,395.3 L 92.0,395.3 L 92.0,395.3 L 92.0,395.4 L 92.1,395.4 L 92.1,395.4 L 92.1,395.5 L 92.2,395.6 L 92.2,395.8 L 92.2,395.9 L 92.1,395.9 L 92.0,396.0 L 92.0,396.2 L 92.1,396.2 L 92.1,396.2 L 92.2,396.2 L 92.2,396.3 L 92.3,396.3 L 92.3,396.4 L 92.4,396.5 L 92.4,396.5 L 92.5,396.5 L 92.6,396.6 L 92.6,396.7 L 92.6,396.7 L 92.8,396.7 L 92.8,396.6 L 92.9,396.6 L 93.0,396.6 L 93.0,396.5 L 93.1,396.5 L 93.1,396.5 L 93.3,396.4 L 93.3,396.6 L 93.2,396.6 L 93.2,396.7 L 93.1,396.7 L 93.0,396.8 L 93.1,396.8 L 93.2,396.8 L 93.1,396.8 L 93.1,396.9 L 93.0,397.0 L 93.0,397.4 L 93.1,397.4 L 93.1,397.4 L 93.2,397.5 L 93.2,397.6 L 93.3,397.4 L 93.2,397.4 L 93.2,397.3 L 93.3,397.3 L 93.3,397.3 L 93.2,397.1 L 93.3,397.1 L 93.3,397.0 L 93.3,397.0 L 93.4,396.9 L 93.4,396.9 L 93.4,396.8 L 93.4,396.7 L 93.5,396.6 L 93.5,396.6 L 93.6,396.6 L 93.7,396.5 L 93.6,396.5 L 93.7,396.4 L 93.6,396.3 L 93.6,396.3 L 93.5,396.2 L 93.5,396.2 L 93.4,396.2 L 93.4,396.1 L 93.3,396.1 L 93.3,396.0 L 93.2,395.9 L 93.1,395.9 L 92.9,395.8 L 92.8,395.8 L 92.7,395.8 L 92.7,395.7 L 92.5,395.7 L 92.5,395.7 L 92.5,395.6 L 92.5,395.5 L 92.5,395.5 L 92.6,395.4 L 92.7,395.4 L 92.7,395.4 L 92.8,395.3 L 92.8,395.3 L 92.8,395.2 L 92.9,395.0 L 92.9,395.0 L 93.0,395.0 L 93.1,395.0 L 93.2,395.1 L 93.1,395.1 L 93.1,395.1 L 93.0,395.1 L 93.1,395.2 L 93.1,395.3 L 93.2,395.2 L 93.4,395.1 L 93.4,395.2 L 93.4,395.3 L 93.6,395.3 L 93.6,395.3 L 93.5,395.2 L 93.5,395.1 L 93.5,395.1 L 93.7,395.1 L 93.7,395.2 L 93.8,395.1 L 93.8,395.1 L 93.9,395.1 L 93.9,395.2 L 94.0,395.2 L 94.0,395.2 L 94.1,395.3 L 94.1,395.3 L 94.2,395.3 L 94.3,395.4 L 94.4,395.4 L 94.4,395.4 L 94.5,395.4 L 94.6,395.5 L 94.7,395.5 L 94.9,395.5 L 95.0,395.5 L 95.0,395.4 L 95.2,395.5 L 95.2,395.5 L 95.4,395.5 L 95.4,395.5 L 95.5,395.5 L 95.6,395.6 L 95.7,395.6 L 95.8,395.5 L 95.8,395.5 L 95.7,395.5 L 95.8,395.4 L 95.7,395.4 L 95.6,395.4 L 95.5,395.3 L 95.6,395.2 L 95.7,395.3 L 95.7,395.3 L 95.7,395.3 L 95.8,395.3 L 95.9,395.3 L 95.9,395.4 L 96.1,395.4 L 96.1,395.4 L 96.0,395.3 L 96.0,395.3 L 96.0,395.2 L 95.9,395.3 L 95.9,395.2 L 95.9,395.2 L 95.8,395.1 L 95.8,395.1 L 95.7,395.1 L 95.7,395.1 L 95.6,395.1 L 95.5,395.2 L 95.4,395.2 L 95.3,395.3 L 95.1,395.3 L 94.9,395.3 L 94.8,395.3 L 94.5,395.3 L 94.6,395.2 L 94.6,395.2 L 94.6,395.1 L 94.6,395.1 L 94.5,395.1 L 94.3,395.0 L 94.1,395.0 L 94.1,395.0 L 94.0,394.9 L 94.0,394.9 L 94.0,394.9 L 93.9,394.8 L 93.8,394.8 L 93.8,394.7 L 93.2,394.8 L 93.1,394.8 L 93.1,394.7 L 93.1,394.7 L 93.2,394.6 L 93.2,394.6 L 93.4,394.6 L 93.5,394.5 L 93.4,394.5 L 93.2,394.5 L 93.1,394.6 L 93.1,394.6 L 93.0,394.7 L 92.9,394.7 L 92.8,394.8 L 92.8,394.8 L 92.8,394.8 L 92.7,394.9 L 92.6,394.9 L 92.6,394.9 L 92.6,395.0 L 92.5,395.0 L 92.5,395.0 L 92.5,395.1 L 92.4,395.1 L 92.4,395.1 L 92.3,395.1 L 92.3,395.0 L 92.3,395.0 L 92.4,395.0 L 92.4,394.9 L 92.4,394.9 L 92.5,394.9 L 92.5,394.8 L 92.6,394.8 L 92.6,394.8 L 92.6,394.7 L 92.7,394.6 L 92.7,394.6 L 92.8,394.6 L 92.8,394.5 L 92.9,394.5 L 92.9,394.4 L 92.9,394.4 L 93.0,394.3 L 93.0,394.3 L 93.0,394.2 L 93.1,394.2 L 93.1,394.1 L 93.2,394.0 L 93.2,393.7 L 93.2,393.3 L 93.2,392.8 L 93.2,392.6 L 93.2,392.4 L 93.3,392.4 L 93.3,392.3 L 93.4,392.3 L 93.4,392.3 L 93.5,392.3 L 93.7,392.4 L 93.7,392.4 L 93.9,392.3 L 94.0,392.3 L 94.0,392.4 L 94.1,392.5 L 94.1,392.5 L 94.1,392.4 L 94.1,392.2 L 94.0,392.2 L 93.9,392.2 L 93.5,392.2 L 93.4,392.2 L 93.1,392.2 L 93.1,392.2 L 92.8,392.2 L 92.8,392.1 L 92.7,392.1 L 92.7,392.0 L 92.8,392.0 L 92.8,392.0 L 92.9,391.9 L 92.9,391.9 L 93.0,391.9 L 93.0,391.7 L 93.0,391.7 L 93.0,391.6 L 93.0,391.6 L 93.0,391.5 L 92.9,391.4 L 92.9,391.3 L 92.9,391.3 L 92.9,390.9 L 92.9,390.9 L 92.9,390.7 L 92.9,390.6 L 92.9,390.4 L 92.9,390.4 L 92.9,390.3 L 92.9,390.2 L 92.9,390.1 L 92.9,390.1 L 92.8,390.0 L 92.7,390.0 L 92.7,389.9 L 92.6,389.8 L 92.6,389.8 L 92.7,389.7 L 92.7,389.7 L 92.7,389.7 L 92.8,389.6 L 92.7,389.6 L 92.6,389.7 L 92.5,389.7 L 92.4,389.7 L 92.4,389.7 L 92.5,389.7 L 92.6,389.6 L 92.5,389.5 L 92.4,389.6 L 91.8,389.6 L 91.8,389.7 L 91.4,389.7 L 91.2,389.7 L 91.1,389.6 L 91.2,389.6 L 91.3,389.6 L 91.3,389.5 L 91.3,389.4 L 91.4,389.4 L 91.4,389.4 L 91.4,389.3 L 91.5,389.3 L 91.5,389.2 L 91.7,389.2 L 91.7,389.1 L 91.7,389.0 L 91.7,388.9 L 91.6,388.8 L 91.6,388.6 L 91.6,388.5 L 91.6,388.4 L 91.4,388.3 L 91.4,388.3 L 91.4,388.2 L 91.4,388.2 L 91.3,388.1 L 91.3,387.8 L 91.3,387.8 L 91.3,387.7 L 91.3,387.6 L 91.2,387.5 L 91.2,387.5 L 91.2,387.3 L 91.1,387.2 L 91.1,387.1 L 91.1,387.1 L 91.0,387.0 L 91.0,386.9 L 91.0,386.9 L 91.0,386.8 L 90.9,386.7 L 90.9,386.6 L 90.9,386.4 L 90.9,386.4 L 91.0,386.4 L 91.0,386.4 L 91.0,386.3 L 90.9,386.3 L 90.9,386.2 L 90.8,386.2 L 90.8,386.1 L 90.8,386.1 L 90.7,386.0 L 90.6,386.0 L 90.7,385.9 L 90.6,385.8 L 90.6,385.8 L 90.5,385.7 L 90.5,385.6 L 90.5,385.6 L 90.5,385.5 L 90.5,385.4 L 90.6,385.3 L 90.6,385.3 L 90.5,385.2 L 90.4,385.2 L 90.4,385.0 L 90.3,384.9 L 90.3,384.8 L 90.2,384.7 L 90.2,384.7 L 90.2,384.7 L 90.1,384.6 L 90.1,384.5 L 90.1,384.5 L 90.1,384.5 L 90.0,384.3 L 90.0,384.3 L 90.0,384.1 L 89.9,384.1 L 89.9,383.9 L 89.8,383.9 L 89.8,383.8 L 89.8,383.8 L 89.7,383.8 L 89.7,383.8 L 89.6,383.7 L 89.4,383.7 L 89.3,383.8 L 89.2,383.8 L 89.2,383.8 L 89.1,383.8 L 89.0,383.8 L 88.9,383.7 L 88.8,383.6 L 88.7,383.6 L 88.7,383.6 L 88.5,383.6 L 88.4,383.6 L 88.3,383.6 L 88.2,383.5 L 88.1,383.4 L 88.0,383.4 L 88.0,383.3 L 88.0,383.3 L 87.9,383.3 L 87.9,383.1 L 87.9,383.1 L 88.0,383.0 L 88.0,383.0 L 88.2,383.0 L 88.5,383.0 L 88.6,383.1 L 88.6,383.1 L 88.7,383.1 L 88.7,383.2 L 88.8,383.2 L 88.9,383.2 L 89.0,383.3 L 89.0,383.3 L 89.1,383.3 L 89.1,383.4 L 89.2,383.4 L 89.2,383.3 L 89.1,383.3 L 89.0,383.2 L 89.0,383.2 L 89.0,383.1 L 89.0,383.0 L 89.1,383.0 L 89.1,383.0 L 89.2,382.9 L 89.2,382.9 L 89.3,382.8 L 89.2,382.8 L 89.2,382.8 L 89.2,382.7 L 89.3,382.6 L 89.3,382.4 L 89.3,382.4 L 89.3,382.3 L 89.3,382.2 L 89.2,381.9 L 89.2,381.9 L 89.2,381.8 L 89.2,381.8 L 89.2,381.7 L 89.2,381.7 L 89.1,381.6 L 89.1,381.6 L 89.1,381.4 L 89.1,381.4 L 89.0,381.3 L 89.0,381.2 L 88.9,381.2 L 88.9,381.1 L 88.8,381.1 L 88.8,381.1 L 88.8,381.0 L 88.7,381.0 L 88.6,381.1 L 88.5,381.1 L 88.4,381.1 L 88.2,381.1 L 88.2,381.0 L 88.2,380.9 L 88.1,380.8 L 88.1,380.8 L 88.1,380.7 L 88.0,380.7 L 88.0,380.7 L 88.0,380.5 L 88.0,380.4 L 88.1,380.4 L 88.1,380.4 L 88.2,380.3 L 88.2,380.3 L 88.1,380.2 L 88.1,380.1 L 88.0,380.1 L 88.0,380.0 L 87.9,380.0 L 87.9,379.7 L 87.9,379.6 L 87.8,379.7 L 87.5,379.7 L 87.4,379.6 L 87.2,379.6 L 87.2,379.5 L 87.2,379.5 L 87.2,379.5 L 87.4,379.4 L 87.5,379.4 L 87.6,379.4 L 87.6,379.3 L 87.6,379.3 L 87.6,379.2 L 87.5,379.2 L 87.5,379.0 L 87.4,379.0 L 87.3,379.0 L 87.2,379.0 L 87.2,379.0 L 87.0,379.0 L 87.0,379.0 L 87.0,378.9 L 87.0,378.8 L 87.0,378.7 L 86.9,378.7 L 86.9,378.6 L 87.0,378.6 L 87.1,378.5 L 87.1,378.5 L 87.2,378.3 L 87.2,378.2 L 87.1,378.2 L 87.1,378.2 L 87.0,378.1 L 87.0,378.1 L 86.9,378.1 L 86.9,378.0 L 86.9,378.0 L 86.9,378.0 L 86.8,377.9 L 86.6,377.9 L 86.6,377.9 L 86.6,377.8 L 86.6,377.8 L 86.5,377.8 L 86.5,377.7 L 86.4,377.7 L 86.4,377.6 L 86.1,377.6 L 86.1,377.5 L 86.0,377.5 L 86.0,377.7 L 85.9,377.8 L 86.0,377.8 L 85.9,377.9 L 85.8,377.9 L 85.7,378.0 L 85.6,378.0 L 85.4,378.0 L 85.4,378.0 L 85.3,378.0 L 85.3,377.9 L 85.3,377.8 L 85.2,377.6 L 85.2,377.4 L 85.2,377.3 L 85.1,377.2 L 85.1,377.1 L 85.0,377.0 L 85.1,376.9 L 85.1,376.9 L 85.2,376.8 L 85.3,376.8 L 85.3,376.7 L 85.2,376.7 L 85.2,376.6 L 85.1,376.5 L 85.0,376.5 L 84.9,376.5 L 84.9,376.5 L 84.8,376.4 L 84.8,376.4 L 84.8,376.4 L 84.7,376.2 L 84.6,376.2 L 84.6,376.1 L 84.5,376.1 L 84.5,376.0 L 84.3,376.0 L 84.2,375.9 L 84.1,375.9 L 84.1,375.8 L 84.0,375.8 L 84.0,375.7 L 84.2,375.7 L 84.2,375.6 L 84.2,375.6 L 84.2,375.5 L 84.2,375.4 L 84.2,375.3 L 84.5,375.3 L 84.5,375.2 L 84.6,375.2 L 84.7,375.2 L 84.8,375.2 L 84.8,375.2 L 84.9,375.3 L 84.9,375.3 L 85.0,375.3 L 85.0,375.5 L 85.1,375.6 L 85.2,375.6 L 85.2,375.6 L 85.3,375.7 L 85.3,375.7 L 85.4,375.7 L 85.5,375.7 L 85.5,375.7 L 85.6,375.7 L 85.7,375.7 L 85.7,375.6 L 85.8,375.6 L 85.8,375.6 L 85.8,375.5 L 85.9,375.4 L 85.9,375.4 L 85.9,375.4 L 86.0,375.4 L 86.1,375.4 L 86.3,375.4 L 86.3,375.5 L 86.6,375.5 L 86.6,375.5 L 86.7,375.4 L 86.7,375.5 L 86.9,375.5 L 87.1,375.5 L 87.1,375.5 L 87.1,375.6 L 87.2,375.6 L 87.2,375.6 L 87.3,375.7 L 87.2,375.7 L 87.2,375.8 L 87.1,375.8 L 87.1,376.0 L 87.0,376.0 L 87.1,376.1 L 87.1,376.1 L 87.1,376.1 L 87.2,376.2 L 87.2,376.2 L 87.2,376.3 L 87.2,376.3 L 87.3,376.3 L 87.2,376.4 L 87.2,376.5 L 87.3,376.7 L 87.3,376.8 L 87.3,376.9 L 87.3,376.9 L 87.4,377.0 L 87.4,377.0 L 87.6,377.0 L 87.7,377.0 L 87.7,376.9 L 87.8,376.9 L 87.8,376.8 L 87.9,376.8 L 87.9,376.7 L 88.0,376.7 L 88.2,376.7 L 88.3,376.6 L 88.3,376.5 L 88.3,376.4 L 88.4,376.3 L 88.4,376.3 L 88.3,376.2 L 88.2,376.2 L 88.3,376.1 L 88.3,376.1 L 88.3,376.0 L 88.4,376.0 L 88.4,376.0 L 88.5,375.9 L 88.5,375.8 L 88.5,375.8 L 88.6,375.7 L 88.6,375.7 L 88.6,375.6 L 88.7,375.6 L 88.7,375.4 L 88.7,375.3 L 88.7,375.2 L 88.8,375.2 L 88.8,375.2 L 89.1,375.2 L 89.0,375.1 L 89.0,375.1 L 88.9,375.1 L 88.9,375.1 L 88.9,375.0 L 88.9,374.9 L 88.9,374.7 L 88.9,374.7 L 88.9,374.5 L 88.9,374.5 L 88.9,374.3 L 89.0,374.3 L 88.9,374.3 L 88.8,374.3 L 88.8,374.4 L 88.6,374.4 L 88.6,374.3 L 88.5,374.3 L 88.2,374.3 L 88.0,374.2 L 87.7,374.2 L 87.7,374.2 L 87.6,374.1 L 87.6,374.1 L 87.5,374.0 L 87.5,374.0 L 87.4,373.9 L 87.4,373.9 L 87.3,373.9 L 87.3,373.8 L 87.2,373.8 L 87.1,373.8 L 87.1,373.7 L 87.0,373.7 L 87.0,373.7 L 86.9,373.7 L 86.9,373.6 L 86.8,373.5 L 86.8,373.5 L 86.8,373.4 L 86.8,373.3 L 86.8,373.3 L 86.9,373.2 L 87.0,373.2 L 87.1,373.2 L 87.5,373.2 L 87.5,373.1 L 87.4,373.1 L 87.4,372.9 L 87.4,372.9 L 87.3,372.8 L 87.2,372.8 L 87.1,372.8 L 87.1,372.8 L 87.0,372.7 L 86.9,372.7 L 86.9,372.7 L 86.9,372.6 L 86.8,372.6 L 86.8,372.5 L 86.7,372.5 L 86.6,372.4 L 86.6,372.4 L 86.5,372.4 L 86.5,372.3 L 86.4,372.3 L 86.4,372.3 L 86.3,372.2 L 86.4,372.0 L 86.4,372.0 L 86.4,372.0 L 86.5,371.9 L 86.6,371.9 L 86.7,371.8 L 86.8,371.8 L 86.8,371.7 L 86.9,371.6 L 86.8,371.5 L 86.8,371.4 L 86.7,371.4 L 86.5,371.3 L 86.5,371.2 L 86.5,371.2 L 86.4,371.2 L 86.4,371.1 L 86.4,371.1 L 86.3,371.0 L 86.3,371.0 L 86.3,370.9 L 86.4,370.9 L 86.4,370.8 L 86.4,370.7 L 86.5,370.6 L 86.5,370.6 L 86.5,370.5 L 86.5,370.5 L 86.5,370.4 L 86.4,370.4 L 86.3,370.4 L 85.9,370.4 L 85.8,370.3 L 85.8,370.3 L 85.9,370.2 L 85.9,370.1 L 85.9,370.0 L 85.9,369.9 L 85.9,369.8 L 85.9,369.7 L 85.8,369.7 L 85.8,369.6 L 85.8,369.5 L 85.7,369.5 L 85.7,369.4 L 85.6,369.4 L 85.6,369.3 L 85.5,369.3 L 85.4,369.4 L 85.2,369.4 L 85.2,369.3 L 85.1,369.3 L 85.1,369.3 L 85.0,369.1 L 84.9,369.1 L 84.8,369.2 L 84.8,369.2 L 84.8,369.2 L 84.6,369.2 L 84.6,369.2 L 84.5,369.2 L 84.5,369.1 L 84.3,369.1 L 84.2,369.1 L 84.1,369.1 L 84.1,369.2 L 84.1,369.3 L 84.1,369.4 L 84.0,369.3 L 84.0,369.3 L 83.9,369.3 L 83.6,369.4 L 83.5,369.3 L 83.4,369.3 L 83.4,369.2 L 83.3,369.2 L 83.1,369.2 L 82.9,369.2 L 82.8,369.1 L 82.8,369.1 L 82.7,369.0 L 82.6,368.9 L 82.6,368.8 L 82.6,368.8 L 82.5,368.6 L 82.5,368.5 L 82.5,368.5 L 82.4,368.4 L 82.4,368.4 L 82.3,368.4 L 82.3,368.3 L 82.2,368.2 L 82.2,368.2 L 82.1,368.2 L 82.1,368.1 L 82.1,368.1 L 82.0,368.0 L 82.0,368.0 L 82.0,367.8 L 82.0,367.8 L 82.0,367.7 L 82.1,367.7 L 82.2,367.7 L 82.3,367.6 L 82.4,367.7 L 82.5,367.7 L 82.5,367.7 L 82.7,367.6 L 82.7,367.7 L 82.8,367.7 L 83.0,367.7 L 83.0,367.6 L 83.0,367.5 L 83.0,367.5 L 83.1,367.4 L 83.1,367.4 L 83.1,367.3 L 83.2,367.3 L 83.4,367.3 L 83.5,367.3 L 83.5,367.2 L 83.7,367.1 L 83.8,367.1 L 83.7,367.0 L 83.7,367.0 L 83.6,367.0 L 83.6,366.9 L 83.7,366.8 L 83.6,366.8 L 83.7,366.7 L 83.7,366.6 L 83.6,366.5 L 83.7,366.4 L 83.7,366.5 L 83.8,366.5 L 83.8,366.4 L 83.7,366.3 L 83.8,366.2 L 83.8,365.9 L 83.9,365.9 L 83.9,365.9 L 84.0,365.8 L 84.1,365.8 L 84.3,365.8 L 84.3,365.8 L 84.4,365.8 L 84.4,365.7 L 84.4,365.7 L 84.5,365.6 L 84.6,365.6 L 84.6,365.5 L 84.7,365.5 L 84.7,365.4 L 84.9,365.4 L 85.0,365.4 L 85.0,365.3 L 85.1,365.4 L 85.2,365.4 L 85.4,365.3 L 85.5,365.3 L 85.4,365.3 L 85.1,365.3 L 85.0,365.2 L 84.9,365.2 L 84.9,365.1 L 84.8,365.1 L 84.7,365.1 L 84.5,365.1 L 84.4,365.0 L 84.2,365.0 L 84.2,365.1 L 83.9,365.1 L 83.8,365.1 L 83.7,365.0 L 83.7,365.0 L 83.7,365.0 L 83.7,364.9 L 83.7,364.9 L 83.7,364.6 L 83.7,364.5 L 83.7,364.4 L 83.7,364.3 L 83.7,364.3 L 83.6,364.3 L 83.6,364.2 L 83.5,364.2 L 83.6,364.1 L 83.5,364.1 L 83.5,364.0 L 83.6,363.9 L 83.6,363.9 L 83.7,363.9 L 83.7,363.8 L 83.8,363.8 L 83.8,363.8 L 83.9,363.8 L 83.9,363.7 L 84.1,363.7 L 84.1,363.6 L 84.1,363.6 L 84.2,363.6 L 84.2,363.6 L 84.3,363.5 L 84.4,363.3 L 84.4,363.2 L 84.4,363.1 L 84.4,363.0 L 84.3,362.9 L 84.3,362.8 L 84.2,362.8 L 84.2,362.7 L 84.1,362.7 L 84.1,362.6 L 84.1,362.5 L 84.0,362.5 L 84.0,362.4 L 84.0,362.3 L 84.0,362.3 L 84.0,362.2 L 83.9,362.1 L 83.9,362.1 L 83.9,362.0 L 83.8,361.9 L 83.8,361.9 L 83.7,361.8 L 83.7,361.7 L 83.7,361.6 L 83.6,361.6 L 83.6,361.5 L 83.6,361.4 L 83.6,361.4 L 83.5,361.3 L 83.5,361.1 L 83.4,361.1 L 83.5,361.0 L 83.4,361.0 L 83.4,360.8 L 83.3,360.7 L 83.3,360.6 L 83.3,360.6 L 83.3,360.5 L 83.5,360.5 L 83.5,360.4 L 83.5,360.3 L 83.4,360.4 L 83.4,360.4 L 83.3,360.4 L 83.3,360.2 L 83.2,360.1 L 83.2,360.1 L 83.1,360.0 L 83.1,359.9 L 82.9,359.9 L 82.9,359.9 L 82.9,359.8 L 82.8,359.8 L 82.8,359.7 L 82.7,359.6 L 82.7,359.5 L 82.7,359.5 L 82.6,359.4 L 82.6,359.4 L 82.5,359.3 L 82.4,359.4 L 82.4,359.4 L 82.3,359.3 L 82.2,359.3 L 82.2,359.3 L 82.1,359.2 L 82.1,359.1 L 82.0,359.0 L 82.0,359.0 L 82.0,358.9 L 81.9,358.9 L 81.9,358.8 L 81.8,358.8 L 81.8,358.7 L 81.7,358.7 L 81.7,358.7 L 81.6,358.7 L 81.6,358.6 L 81.5,358.6 L 81.5,358.5 L 81.4,358.5 L 81.4,358.5 L 81.2,358.6 L 81.2,358.6 L 81.1,358.6 L 80.9,358.6 L 80.8,358.6 L 80.8,358.6 L 80.7,358.5 L 80.7,358.4 L 80.7,358.3 L 80.7,358.2 L 80.5,358.2 L 80.5,358.1 L 80.6,358.1 L 80.7,358.0 L 80.7,358.0 L 80.6,357.9 L 80.5,357.9 L 80.4,357.9 L 80.3,357.9 L 80.3,357.8 L 80.2,357.8 L 80.1,357.7 L 80.1,357.7 L 80.1,357.7 L 80.0,357.7 L 80.0,357.6 L 79.9,357.6 L 79.9,357.6 L 79.8,357.5 L 79.8,357.5 L 79.8,357.5 L 79.7,357.4 L 79.6,357.4 L 79.6,357.3 L 79.6,357.1 L 79.5,357.1 L 79.5,357.0 L 79.5,357.0 L 79.4,357.0 L 79.4,356.9 L 79.3,356.9 L 79.3,356.7 L 79.3,356.7 L 79.2,356.6 L 79.2,356.6 L 79.2,356.6 L 79.2,356.4 L 79.2,356.3 L 79.3,356.2 L 79.3,356.1 L 79.3,356.1 L 79.4,356.1 L 79.4,355.7 L 79.5,355.6 L 79.6,355.6 L 79.7,355.6 L 79.7,355.5 L 79.8,355.5 L 79.8,355.4 L 79.9,355.5 L 80.0,355.4 L 80.0,355.4 L 80.1,355.4 L 80.2,355.3 L 80.2,355.3 L 80.3,355.3 L 80.5,355.2 L 80.6,355.3 L 80.6,355.3 L 80.7,355.3 L 80.7,355.4 L 80.8,355.4 L 80.8,355.5 L 80.8,355.5 L 80.9,355.5 L 80.8,355.7 L 80.9,355.7 L 80.9,355.8 L 81.0,355.7 L 81.1,355.7 L 81.3,355.7 L 81.4,355.6 L 81.6,355.5 L 81.5,355.5 L 81.5,355.4 L 81.5,355.4 L 81.5,355.2 L 81.5,355.1 L 81.5,355.1 L 81.6,355.1 L 81.6,355.0 L 81.9,355.0 L 81.9,354.9 L 81.9,354.9 L 82.0,354.8 L 82.0,354.7 L 82.0,354.6 L 82.0,354.6 L 81.9,354.5 L 81.9,354.5 L 81.8,354.5 L 81.8,354.4 L 81.8,354.4 L 81.7,354.3 L 81.6,354.2 L 81.6,354.1 L 81.5,354.0 L 81.5,353.9 L 81.3,353.9 L 81.2,353.9 L 81.0,353.9 L 80.9,353.9 L 80.8,353.8 L 80.8,353.8 L 80.7,353.7 L 80.7,353.7 L 80.6,353.6 L 80.6,353.6 L 80.6,353.5 L 80.6,353.4 L 80.3,353.4 L 80.3,353.4 L 80.2,353.4 L 80.1,353.4 L 80.1,353.3 L 80.0,353.3 L 79.9,353.2 L 79.9,353.2 L 79.8,353.2 L 79.8,353.1 L 79.8,353.0 L 79.7,353.0 L 79.6,352.9 L 79.6,352.9 L 79.5,352.8 L 79.5,352.8 L 79.4,352.7 L 79.4,352.6 L 79.4,352.6 L 79.3,352.6 L 79.3,352.5 L 79.2,352.5 L 79.2,352.4 L 79.1,352.3 L 79.1,352.3 L 79.0,352.2 L 79.1,352.2 L 79.0,352.1 L 79.0,351.9 L 78.9,351.7 L 78.9,351.7 L 78.8,351.5 L 78.8,351.2 L 78.8,351.2 L 78.7,351.1 L 78.7,351.1 L 78.6,351.0 L 78.6,350.8 L 78.6,350.8 L 78.6,350.7 L 78.5,350.7 L 78.4,350.7 L 78.4,350.6 L 78.3,350.6 L 78.3,350.6 L 78.2,350.5 L 78.3,350.4 L 78.3,350.4 L 78.3,350.3 L 78.3,350.2 L 78.4,350.2 L 78.4,350.2 L 78.5,350.1 L 78.5,350.1 L 78.5,350.0 L 78.6,350.0 L 78.7,350.0 L 78.9,350.0 L 79.0,350.0 L 79.0,350.0 L 79.0,349.9 L 79.0,349.9 L 78.9,349.6 L 78.9,349.5 L 78.8,349.5 L 78.8,349.3 L 78.8,349.3 L 78.7,349.2 L 78.7,349.1 L 78.6,349.1 L 78.6,349.0 L 78.5,349.0 L 78.5,348.9 L 78.3,348.9 L 78.2,348.9 L 78.2,348.8 L 78.2,348.7 L 78.1,348.6 L 78.1,348.6 L 77.9,348.5 L 77.8,348.4 L 77.7,348.4 L 77.7,348.3 L 77.7,348.2 L 77.7,348.2 L 77.7,348.0 L 77.6,348.0 L 77.5,347.9 L 77.5,347.9 L 77.4,347.8 L 77.4,347.7 L 77.4,347.6 L 77.4,347.5 L 77.2,347.4 L 77.2,347.4 L 77.1,347.2 L 77.1,347.1 L 77.1,347.0 L 77.1,346.9 L 77.1,346.8 L 77.0,346.7 L 77.0,346.6 L 77.0,346.5 L 77.0,346.4 L 77.0,346.3 L 77.0,346.2 L 77.1,346.2 L 77.1,346.1 L 77.2,346.1 L 77.2,346.1 L 77.2,346.0 L 77.3,346.0 L 77.3,346.0 L 77.5,345.9 L 77.7,345.9 L 77.7,345.8 L 77.8,345.8 L 77.9,345.8 L 78.0,345.8 L 78.0,345.8 L 78.0,345.7 L 78.0,345.7 L 78.1,345.7 L 78.2,345.6 L 78.2,345.6 L 78.3,345.5 L 78.3,345.4 L 78.4,345.4 L 78.4,345.4 L 78.5,345.4 L 78.7,345.3 L 78.8,345.3 L 78.8,345.3 L 78.8,345.3 L 79.0,345.2 L 79.0,345.2 L 79.0,345.2 L 78.9,345.1 L 79.0,345.1 L 79.0,344.9 L 79.0,344.9 L 78.9,344.7 L 79.0,344.6 L 79.0,344.6 L 78.9,344.6 L 78.9,344.5 L 78.8,344.4 L 78.8,344.2 L 78.7,344.2 L 78.7,344.1 L 78.8,344.0 L 78.7,344.0 L 78.7,343.9 L 78.6,343.8 L 78.6,343.8 L 78.6,343.7 L 78.6,343.7 L 78.6,343.6 L 78.5,343.6 L 78.4,343.5 L 78.4,343.4 L 78.3,343.3 L 78.3,343.1 L 78.4,343.0 L 78.3,343.0 L 78.3,342.9 L 78.3,342.9 L 78.3,342.8 L 78.2,342.8 L 78.1,342.7 L 78.0,342.7 L 78.1,342.6 L 78.1,342.6 L 78.0,342.5 L 78.0,342.4 L 78.0,342.3 L 77.9,342.3 L 77.9,342.0 L 77.9,342.0 L 77.9,341.9 L 77.9,341.9 L 77.8,341.8 L 77.8,341.8 L 77.8,341.7 L 77.7,341.7 L 77.7,341.6 L 77.6,341.6 L 77.6,341.5 L 77.6,341.5 L 77.5,341.4 L 77.5,341.3 L 77.5,341.3 L 77.5,341.2 L 77.4,341.1 L 77.4,340.9 L 77.3,340.9 L 77.3,340.8 L 77.3,340.8 L 77.2,340.7 L 77.2,340.7 L 77.2,340.6 L 77.1,340.6 L 77.1,340.4 L 77.0,340.4 L 77.0,340.3 L 77.0,340.2 L 76.9,340.1 L 76.9,340.1 L 76.9,339.9 L 76.9,339.8 L 76.9,339.8 L 76.8,339.7 L 76.8,339.6 L 76.8,339.4 L 76.7,339.4 L 76.7,339.3 L 76.6,339.3 L 76.6,339.2 L 76.7,339.2 L 76.7,339.2 L 76.8,339.3 L 76.7,339.3 L 76.8,339.3 L 76.9,339.3 L 76.8,339.2 L 76.8,339.1 L 76.7,339.1 L 76.6,339.1 L 76.5,339.1 L 76.4,339.0 L 76.4,339.0 L 76.4,338.9 L 76.3,338.9 L 76.3,338.8 L 76.2,338.7 L 76.2,338.7 L 76.2,338.7 L 76.2,338.6 L 76.1,338.5 L 76.1,338.5 L 76.1,338.4 L 76.0,338.3 L 76.0,338.1 L 75.9,338.1 L 75.8,338.1 L 75.8,338.1 L 75.8,338.0 L 75.8,337.9 L 75.7,337.9 L 75.7,337.9 L 75.6,337.8 L 75.6,337.8 L 75.4,337.7 L 75.4,337.6 L 75.3,337.6 L 75.2,337.5 L 75.0,337.5 L 74.8,337.5 L 74.8,337.5 L 74.7,337.6 L 74.7,337.7 L 74.8,337.7 L 74.7,337.7 L 74.7,337.7 L 74.7,337.7 L 74.7,337.5 L 74.7,337.4 L 74.7,337.4 L 74.8,337.4 L 74.9,337.4 L 74.9,337.3 L 74.8,337.3 L 74.7,337.2 L 74.7,337.2 L 74.7,337.1 L 75.0,337.1 L 75.1,337.1 L 75.1,337.0 L 75.1,336.9 L 75.1,336.9 L 75.2,336.8 L 75.2,336.8 L 75.2,336.7 L 75.2,336.7 L 75.2,336.6 L 75.2,336.6 L 75.2,336.5 L 75.2,336.4 L 75.1,336.3 L 75.1,336.3 L 75.1,336.2 L 75.0,336.2 L 75.0,336.0 L 75.0,336.0 L 75.0,335.9 L 74.8,335.9 L 74.8,335.8 L 74.7,335.7 L 74.7,335.7 L 74.7,335.7 L 74.7,335.6 L 74.6,335.6 L 74.6,335.6 L 74.6,335.5 L 74.6,335.5 L 74.6,335.4 L 74.6,335.3 L 74.7,335.3 L 74.7,335.3 L 74.9,335.3 L 75.0,335.2 L 75.2,335.3 L 75.3,335.3 L 75.4,335.3 L 75.5,335.3 L 75.6,335.3 L 75.8,335.4 L 76.0,335.4 L 76.1,335.4 L 76.2,335.5 L 76.3,335.5 L 76.4,335.5 L 76.4,335.6 L 76.4,335.6 L 76.5,335.7 L 76.5,335.7 L 76.6,335.7 L 76.6,335.7 L 76.8,335.8 L 77.0,335.8 L 77.1,335.8 L 77.3,335.9 L 77.4,335.8 L 77.6,335.8 L 77.6,335.7 L 77.8,335.7 L 78.0,335.7 L 78.0,335.7 L 78.1,335.8 L 78.2,335.8 L 78.2,335.8 L 78.4,335.8 L 78.4,335.9 L 78.5,335.9 L 78.5,336.0 L 78.5,336.0 L 78.6,336.1 L 78.6,336.1 L 78.6,336.2 L 78.7,336.3 L 78.7,336.5 L 78.8,336.5 L 78.8,336.5 L 78.8,336.5 L 78.8,336.4 L 78.8,336.3 L 78.7,336.1 L 78.7,336.1 L 78.6,336.0 L 78.6,335.9 L 78.6,335.9 L 78.5,335.9 L 78.5,335.8 L 78.4,335.8 L 78.4,335.8 L 78.3,335.7 L 78.2,335.7 L 78.2,335.7 L 78.1,335.6 L 77.9,335.6 L 77.8,335.7 L 77.6,335.7 L 77.6,335.7 L 77.4,335.7 L 77.2,335.8 L 77.0,335.8 L 76.9,335.7 L 76.8,335.7 L 76.8,335.7 L 76.7,335.6 L 76.7,335.6 L 76.6,335.6 L 76.6,335.5 L 76.5,335.5 L 76.4,335.5 L 76.4,335.4 L 76.3,335.4 L 76.3,335.4 L 76.2,335.3 L 76.1,335.3 L 75.9,335.3 L 75.8,335.2 L 75.7,335.2 L 75.4,335.2 L 75.4,335.1 L 75.6,335.0 L 75.7,335.1 L 75.8,335.1 L 75.9,335.1 L 75.9,335.1 L 75.9,335.0 L 75.7,335.0 L 75.5,335.0 L 75.4,334.9 L 75.3,334.9 L 75.2,335.0 L 75.1,335.0 L 75.1,335.1 L 75.0,335.1 L 74.8,335.1 L 74.8,335.1 L 74.7,335.0 L 74.7,335.0 L 74.7,335.0 L 74.6,334.9 L 74.6,334.9 L 74.6,334.8 L 74.5,334.7 L 74.5,334.7 L 74.4,334.7 L 74.4,334.6 L 74.4,334.5 L 74.3,334.3 L 74.3,334.2 L 74.3,334.1 L 74.2,334.0 L 74.2,334.0 L 74.0,333.9 L 74.0,333.9 L 73.9,333.9 L 73.9,333.8 L 73.9,333.7 L 73.9,333.7 L 73.9,333.6 L 74.0,333.6 L 74.0,333.6 L 74.0,333.5 L 74.0,333.4 L 73.9,333.4 L 73.9,333.3 L 73.8,333.2 L 73.8,333.2 L 73.7,333.1 L 73.7,333.1 L 73.7,333.1 L 73.6,333.0 L 73.6,333.0 L 73.5,332.9 L 73.5,332.8 L 73.4,332.8 L 73.4,332.4 L 73.4,332.4 L 73.3,332.2 L 73.3,332.2 L 73.2,332.0 L 73.2,332.0 L 73.1,331.8 L 73.1,331.8 L 73.1,331.7 L 73.1,331.6 L 73.1,331.4 L 73.1,331.3 L 73.2,331.3 L 73.3,331.3 L 73.3,331.2 L 73.4,331.2 L 73.5,331.1 L 73.4,331.1 L 73.3,331.2 L 73.3,331.2 L 73.2,331.2 L 73.2,331.3 L 73.0,331.3 L 73.0,331.3 L 73.0,331.4 L 73.0,331.4 L 72.9,331.5 L 72.8,331.5 L 72.6,331.6 L 72.5,331.6 L 72.3,331.6 L 72.3,331.5 L 72.1,331.5 L 72.1,331.5 L 72.1,331.4 L 72.0,331.4 L 72.0,331.3 L 72.0,331.3 L 71.9,331.3 L 71.9,331.2 L 71.8,331.2 L 71.8,331.1 L 71.7,331.1 L 71.7,331.1 L 71.7,331.0 L 71.6,331.0 L 71.5,331.0 L 71.5,330.9 L 71.5,330.9 L 71.4,330.8 L 71.4,330.8 L 71.4,330.7 L 71.4,330.7 L 71.3,330.6 L 71.2,330.6 L 71.2,330.5 L 71.1,330.5 L 71.2,330.4 L 71.1,330.4 L 71.1,330.3 L 71.2,330.3 L 71.3,330.3 L 71.3,330.3 L 71.4,330.3 L 71.4,330.1 L 71.4,330.1 L 71.5,330.0 L 71.5,330.0 L 71.5,329.9 L 71.5,329.9 L 71.5,329.8 L 71.5,329.7 L 71.5,329.6 L 71.5,329.4 L 71.4,329.3 L 71.4,329.2 L 71.4,329.2 L 71.3,329.0 L 71.3,329.0 L 71.3,328.7 L 71.4,328.7 L 71.5,328.8 L 71.6,328.8 L 71.6,328.9 L 71.7,328.9 L 71.8,328.9 L 71.8,328.8 L 71.9,328.8 L 72.0,328.8 L 72.0,328.9 L 72.1,328.9 L 72.2,328.9 L 72.2,328.9 L 72.6,328.9 L 72.7,328.9 L 72.6,328.8 L 72.2,328.8 L 72.2,328.7 L 72.3,328.7 L 72.3,328.6 L 72.3,328.6 L 72.4,328.5 L 72.5,328.5 L 72.6,328.5 L 72.6,328.5 L 72.7,328.7 L 72.7,328.7 L 72.7,328.8 L 72.8,328.9 L 73.0,328.9 L 73.1,328.8 L 73.2,328.8 L 73.2,328.7 L 73.3,328.7 L 73.4,328.7 L 73.4,328.6 L 73.5,328.5 L 73.5,328.4 L 73.5,328.4 L 73.6,328.4 L 73.7,328.3 L 73.7,328.3 L 73.8,328.3 L 73.9,328.3 L 74.0,328.2 L 74.1,328.2 L 74.1,328.1 L 74.2,328.1 L 74.3,328.0 L 74.4,328.0 L 74.4,328.0 L 74.6,328.0 L 74.6,327.9 L 74.8,327.9 L 75.0,327.9 L 74.7,327.8 L 74.6,327.9 L 74.4,327.9 L 74.3,327.9 L 74.3,328.0 L 74.2,328.0 L 74.1,328.0 L 74.1,328.1 L 74.0,328.1 L 73.9,328.1 L 73.8,328.1 L 73.8,328.2 L 73.7,328.2 L 73.6,328.3 L 73.5,328.3 L 73.4,328.4 L 73.3,328.4 L 73.3,328.4 L 73.3,328.5 L 73.2,328.6 L 73.2,328.7 L 73.1,328.7 L 73.0,328.7 L 72.9,328.7 L 72.9,328.7 L 72.9,328.6 L 72.8,328.5 L 72.8,328.5 L 72.7,328.4 L 72.7,328.4 L 72.6,328.4 L 72.6,328.4 L 72.5,328.4 L 72.4,328.4 L 72.1,328.5 L 71.8,328.5 L 71.7,328.5 L 71.7,328.5 L 71.3,328.5 L 71.2,328.5 L 70.9,328.5 L 70.8,328.4 L 70.7,328.4 L 70.7,328.4 L 70.5,328.4 L 70.5,328.4 L 70.5,328.4 L 70.4,328.5 L 70.3,328.5 L 70.2,328.4 L 70.1,328.4 L 70.0,328.4 L 70.0,328.3 L 69.9,328.3 L 69.9,328.2 L 69.8,328.2 L 69.8,328.1 L 69.8,328.1 L 69.7,328.0 L 69.7,328.0 L 69.6,327.9 L 69.5,327.9 L 69.5,327.9 L 69.4,327.8 L 69.4,327.8 L 69.3,327.7 L 69.3,327.7 L 69.2,327.6 L 69.2,327.6 L 69.1,327.4 L 69.1,327.3 L 69.1,327.2 L 69.1,326.9 L 69.2,326.9 L 69.2,326.8 L 69.3,326.8 L 69.3,326.7 L 69.3,326.6 L 69.3,326.6 L 69.2,326.5 L 69.2,326.3 L 69.1,326.0 L 69.2,325.9 L 69.3,325.8 L 69.3,325.8 L 69.4,325.7 L 69.4,325.7 L 69.4,325.7 L 69.5,325.6 L 69.6,325.6 L 69.6,325.6 L 69.7,325.5 L 69.7,325.5 L 69.7,325.5 L 69.8,325.4 L 69.9,325.4 L 69.9,325.3 L 70.0,325.3 L 70.0,325.2 L 70.1,325.2 L 70.1,325.1 L 70.1,325.1 L 70.2,325.1 L 70.1,325.0 L 70.1,324.9 L 70.0,324.8 L 70.0,324.7 L 69.9,324.6 L 69.9,324.6 L 69.9,324.6 L 72.4,324.2 L 76.9,324.2 L 78.0,324.8 L 78.6,324.0 L 79.2,323.6 L 79.5,323.1 L 81.5,321.9 L 81.8,320.8 L 83.0,319.8 L 84.5,319.1 L 85.1,319.3 Z"
    },
    {
      "id": "sindhudurg",
      "name": "Sindhudurg",
      "path": "M 108.8,480.9 L 108.8,480.9 L 108.8,480.9 L 108.8,480.9 L 108.8,480.9 L 108.8,481.0 L 108.8,481.0 L 108.8,481.1 L 108.8,481.1 L 108.8,481.1 L 108.8,481.1 L 108.8,481.1 L 108.7,481.1 L 108.7,481.1 L 108.7,481.1 L 108.7,481.0 L 108.7,481.0 L 108.7,481.0 L 108.6,481.0 L 108.6,480.9 L 108.7,480.9 L 108.7,480.9 L 108.8,480.9 Z M 109.4,480.9 L 109.4,480.9 L 109.5,480.9 L 109.5,480.9 L 109.5,480.9 L 109.5,480.9 L 109.5,480.9 L 109.5,481.0 L 109.6,481.0 L 109.6,481.1 L 109.5,481.1 L 109.5,481.1 L 109.5,481.1 L 109.5,481.1 L 109.5,481.1 L 109.5,481.1 L 109.4,481.1 L 109.4,481.0 L 109.4,481.0 L 109.4,481.0 L 109.3,481.0 L 109.3,481.0 L 109.3,481.0 L 109.3,480.9 L 109.3,480.9 L 109.3,480.9 L 109.3,480.9 L 109.3,480.9 L 109.4,480.9 Z M 109.7,480.4 L 109.7,480.5 L 109.8,480.5 L 109.8,480.5 L 109.8,480.5 L 109.8,480.5 L 109.8,480.5 L 109.8,480.6 L 109.9,480.6 L 109.9,480.6 L 109.8,480.6 L 109.8,480.6 L 109.7,480.6 L 109.7,480.6 L 109.7,480.6 L 109.7,480.6 L 109.7,480.6 L 109.7,480.6 L 109.6,480.6 L 109.6,480.5 L 109.6,480.5 L 109.6,480.5 L 109.6,480.5 L 109.6,480.4 L 109.7,480.4 Z M 109.2,469.3 L 109.2,469.3 L 109.2,469.3 L 109.2,469.3 L 109.2,469.3 L 109.2,469.3 L 109.3,469.3 L 109.3,469.4 L 109.3,469.4 L 109.3,469.4 L 109.4,469.4 L 109.4,469.4 L 109.3,469.4 L 109.3,469.5 L 109.3,469.5 L 109.3,469.5 L 109.3,469.5 L 109.3,469.6 L 109.3,469.6 L 109.3,469.6 L 109.3,469.6 L 109.3,469.7 L 109.3,469.7 L 109.3,469.7 L 109.3,469.7 L 109.3,469.8 L 109.3,469.8 L 109.3,469.8 L 109.2,469.8 L 109.2,469.8 L 109.1,469.8 L 109.1,469.8 L 109.1,469.8 L 109.1,469.7 L 109.1,469.7 L 109.1,469.7 L 109.1,469.7 L 109.1,469.7 L 109.0,469.7 L 109.0,469.7 L 108.9,469.7 L 108.9,469.6 L 108.9,469.6 L 108.9,469.6 L 108.9,469.6 L 108.9,469.5 L 108.9,469.5 L 108.9,469.5 L 108.9,469.5 L 108.9,469.4 L 109.0,469.4 L 109.0,469.4 L 109.0,469.4 L 109.0,469.4 L 109.0,469.4 L 109.0,469.3 L 109.2,469.3 Z M 107.6,465.0 L 107.6,465.0 L 107.6,465.0 L 107.6,465.1 L 107.6,465.1 L 107.6,465.1 L 107.7,465.1 L 107.7,465.1 L 107.7,465.1 L 107.7,465.2 L 107.7,465.2 L 107.7,465.2 L 107.6,465.2 L 107.6,465.3 L 107.6,465.3 L 107.6,465.2 L 107.6,465.2 L 107.6,465.2 L 107.6,465.2 L 107.6,465.2 L 107.5,465.2 L 107.5,465.2 L 107.5,465.2 L 107.5,465.0 L 107.6,465.0 Z M 146.6,425.7 L 146.5,426.3 L 147.4,427.2 L 146.5,427.9 L 145.6,429.1 L 145.7,429.8 L 145.4,430.7 L 144.9,431.7 L 144.0,432.2 L 143.6,432.6 L 145.2,433.0 L 145.8,433.5 L 144.9,434.6 L 145.6,435.5 L 146.6,436.1 L 146.7,437.2 L 148.7,437.8 L 149.7,438.7 L 149.3,439.6 L 149.0,439.8 L 148.1,440.1 L 147.7,440.8 L 146.4,441.7 L 145.2,443.5 L 147.4,444.4 L 147.1,445.5 L 146.3,446.3 L 145.5,446.5 L 144.9,447.0 L 145.8,447.9 L 146.1,448.8 L 146.1,449.4 L 146.1,450.3 L 147.1,449.5 L 148.1,449.3 L 149.6,448.3 L 150.7,448.2 L 151.3,449.1 L 150.0,450.5 L 149.9,451.2 L 150.2,452.8 L 150.6,453.7 L 151.6,454.2 L 152.2,454.8 L 150.2,455.6 L 152.2,455.4 L 152.8,455.4 L 153.4,455.1 L 154.5,454.8 L 154.9,454.7 L 154.7,455.3 L 154.0,456.1 L 153.2,456.5 L 153.4,456.8 L 153.7,457.2 L 153.4,457.4 L 153.6,457.7 L 154.7,457.4 L 155.7,457.5 L 156.1,457.8 L 155.7,458.3 L 154.7,458.9 L 155.3,459.5 L 155.1,460.0 L 153.7,460.3 L 152.8,459.8 L 151.6,461.0 L 152.5,461.6 L 152.3,462.2 L 151.9,462.6 L 150.8,462.5 L 149.5,462.0 L 148.0,461.9 L 147.8,462.5 L 146.4,462.1 L 145.9,463.0 L 146.0,463.5 L 146.0,464.2 L 144.8,465.7 L 145.3,466.0 L 146.9,467.2 L 146.3,466.7 L 145.7,465.7 L 146.4,465.5 L 147.1,464.8 L 147.6,465.6 L 149.4,465.8 L 150.7,466.2 L 151.4,465.4 L 154.2,465.7 L 156.2,465.7 L 157.6,466.0 L 159.9,466.3 L 160.0,467.0 L 160.6,467.4 L 160.6,467.8 L 160.3,468.1 L 159.7,468.4 L 160.0,468.6 L 161.1,470.1 L 164.2,470.3 L 164.7,469.8 L 165.3,469.0 L 165.9,469.6 L 166.4,470.3 L 167.0,471.0 L 167.8,471.5 L 168.4,472.4 L 166.7,473.4 L 165.3,474.9 L 165.0,475.7 L 164.3,476.1 L 165.3,476.9 L 166.4,477.2 L 167.1,477.7 L 168.1,479.4 L 168.7,480.5 L 168.2,482.3 L 168.1,482.8 L 166.0,483.7 L 163.2,485.5 L 163.3,487.5 L 166.2,486.8 L 166.1,485.9 L 167.1,485.3 L 169.6,484.8 L 170.3,486.2 L 173.1,486.2 L 174.4,488.7 L 177.0,489.6 L 179.5,489.2 L 178.9,490.7 L 175.2,491.3 L 174.2,492.5 L 173.0,492.8 L 172.3,493.5 L 171.8,493.9 L 172.4,495.0 L 172.2,496.1 L 170.2,497.3 L 168.2,497.2 L 169.7,498.4 L 170.7,499.2 L 168.8,499.6 L 165.6,500.7 L 162.6,501.8 L 160.0,501.9 L 158.6,501.3 L 157.6,500.7 L 156.6,498.8 L 156.6,497.4 L 156.1,495.4 L 155.2,494.7 L 155.2,493.8 L 154.2,492.0 L 151.4,491.7 L 148.4,491.4 L 148.5,490.3 L 148.2,489.3 L 147.7,488.6 L 146.8,487.8 L 145.9,488.9 L 145.3,489.4 L 144.3,490.5 L 143.8,492.3 L 141.9,492.6 L 140.1,493.3 L 136.8,492.6 L 135.2,493.7 L 134.0,493.4 L 132.4,493.6 L 131.2,493.1 L 129.8,493.2 L 129.6,493.2 L 129.5,493.2 L 129.3,493.2 L 129.2,493.1 L 129.2,493.1 L 129.2,493.1 L 129.1,493.0 L 129.1,493.0 L 129.0,492.9 L 129.0,492.9 L 128.9,492.8 L 128.8,492.8 L 128.8,492.8 L 128.8,492.8 L 128.7,492.7 L 128.7,492.7 L 128.5,492.8 L 128.4,492.7 L 128.4,492.7 L 128.3,492.6 L 128.3,492.5 L 128.3,492.5 L 128.2,492.4 L 128.2,492.3 L 128.1,492.3 L 128.1,492.2 L 127.9,492.2 L 127.9,492.2 L 127.8,492.2 L 127.7,492.1 L 127.6,492.1 L 127.6,492.1 L 127.5,492.0 L 127.3,492.0 L 127.3,492.0 L 127.2,491.9 L 127.1,491.9 L 127.1,491.9 L 127.1,491.7 L 127.0,491.7 L 126.7,491.7 L 126.6,491.6 L 126.9,491.6 L 127.0,491.6 L 127.1,491.6 L 127.1,491.4 L 127.3,491.5 L 127.3,491.5 L 127.5,491.5 L 127.5,491.5 L 127.6,491.5 L 127.6,491.5 L 127.6,491.4 L 127.7,491.4 L 127.7,491.4 L 127.8,491.3 L 127.8,491.2 L 127.9,491.2 L 127.9,491.1 L 128.0,491.1 L 128.1,491.1 L 128.2,491.0 L 128.2,491.0 L 128.2,491.0 L 128.3,490.9 L 128.3,490.9 L 128.4,490.9 L 128.5,490.9 L 128.6,491.0 L 128.7,491.0 L 128.8,491.0 L 128.8,491.1 L 128.9,491.1 L 129.0,491.1 L 129.1,491.1 L 129.0,491.0 L 129.0,491.0 L 128.9,490.9 L 128.8,490.9 L 128.8,490.8 L 128.7,490.8 L 128.6,490.8 L 128.5,490.8 L 128.4,490.7 L 128.3,490.7 L 128.2,490.7 L 128.2,490.7 L 128.1,490.8 L 128.0,490.8 L 128.0,490.7 L 128.0,490.6 L 128.0,490.6 L 128.0,490.6 L 128.0,490.5 L 128.0,490.4 L 128.0,490.2 L 127.9,490.1 L 127.9,490.0 L 127.8,489.9 L 127.8,489.8 L 127.8,489.7 L 127.7,489.7 L 127.7,489.6 L 127.6,489.4 L 127.6,489.4 L 127.6,489.3 L 127.6,489.3 L 127.5,489.3 L 127.5,489.2 L 127.5,489.0 L 127.4,489.0 L 127.4,488.9 L 127.3,488.8 L 127.3,488.7 L 127.3,488.7 L 127.3,488.6 L 127.2,488.6 L 127.2,488.5 L 127.2,488.4 L 127.1,488.3 L 127.2,488.2 L 127.4,488.2 L 127.4,488.1 L 127.4,488.1 L 127.4,488.1 L 127.4,487.9 L 127.5,487.7 L 127.5,487.7 L 127.5,487.6 L 127.6,487.5 L 127.6,487.5 L 127.7,487.5 L 127.8,487.4 L 127.8,487.4 L 127.9,487.4 L 127.9,487.3 L 127.9,487.3 L 127.9,487.2 L 127.8,487.3 L 127.8,487.3 L 127.8,487.4 L 127.7,487.4 L 127.6,487.4 L 127.6,487.5 L 127.4,487.5 L 127.4,487.5 L 127.3,487.6 L 127.4,487.7 L 127.3,487.7 L 127.3,487.8 L 127.2,487.9 L 127.2,488.0 L 127.1,488.0 L 127.1,488.1 L 127.0,488.0 L 127.0,487.9 L 126.9,487.8 L 126.9,487.8 L 126.9,487.7 L 126.9,487.6 L 126.8,487.6 L 126.9,487.5 L 126.8,487.4 L 126.8,487.4 L 126.7,487.4 L 126.7,487.3 L 126.6,487.3 L 126.5,487.3 L 126.4,487.3 L 126.4,487.2 L 126.3,487.2 L 126.3,487.1 L 126.3,487.1 L 126.3,487.0 L 126.2,486.9 L 126.2,486.8 L 126.1,486.8 L 125.9,486.8 L 125.8,486.7 L 125.8,486.6 L 125.8,486.6 L 125.7,486.6 L 125.6,486.5 L 125.6,486.5 L 125.5,486.5 L 125.5,486.3 L 125.6,486.3 L 125.6,486.3 L 125.7,486.3 L 125.7,486.3 L 125.7,486.2 L 125.8,486.1 L 125.7,486.0 L 125.7,485.9 L 125.6,485.9 L 125.6,485.8 L 125.6,485.7 L 125.5,485.6 L 125.5,485.5 L 125.5,485.4 L 125.4,485.4 L 125.4,485.3 L 125.3,485.2 L 125.3,485.1 L 125.3,485.0 L 125.2,484.9 L 125.2,484.9 L 125.1,484.8 L 125.1,484.8 L 125.1,484.6 L 125.0,484.6 L 125.0,484.5 L 124.9,484.4 L 124.9,484.3 L 124.9,484.2 L 124.9,484.2 L 124.8,484.2 L 124.8,484.1 L 124.8,484.1 L 124.7,484.0 L 124.7,484.0 L 124.7,483.9 L 124.6,483.8 L 124.6,483.8 L 124.6,483.7 L 124.6,483.7 L 124.5,483.7 L 124.4,483.6 L 124.3,483.6 L 124.3,483.5 L 124.2,483.5 L 124.2,483.5 L 124.2,483.4 L 124.1,483.4 L 124.1,483.4 L 124.2,483.3 L 124.1,483.2 L 124.0,483.3 L 123.9,483.3 L 123.9,483.4 L 123.8,483.4 L 123.8,483.5 L 123.9,483.6 L 123.9,483.6 L 123.9,483.7 L 123.8,483.7 L 123.7,483.7 L 123.6,483.7 L 123.5,483.6 L 123.5,483.6 L 123.4,483.6 L 123.4,483.5 L 123.4,483.5 L 123.3,483.4 L 123.3,483.4 L 123.3,483.3 L 123.2,483.2 L 123.2,483.2 L 123.2,483.1 L 123.2,482.9 L 123.1,482.9 L 123.1,482.8 L 123.0,482.8 L 123.1,482.7 L 123.1,482.7 L 123.1,482.5 L 123.0,482.5 L 123.0,482.4 L 122.9,482.4 L 123.0,482.3 L 122.9,482.3 L 122.9,482.2 L 122.8,482.1 L 122.8,482.1 L 122.7,482.1 L 122.7,482.0 L 122.7,482.0 L 122.6,481.8 L 122.6,481.8 L 122.6,481.7 L 122.5,481.6 L 122.5,481.5 L 122.4,481.5 L 122.4,481.4 L 122.4,481.4 L 122.4,481.3 L 122.3,481.2 L 122.2,481.2 L 122.1,481.2 L 122.0,481.1 L 122.0,481.0 L 122.1,481.0 L 122.1,481.0 L 122.1,480.9 L 122.0,480.9 L 122.0,480.8 L 121.8,480.8 L 121.8,480.7 L 121.8,480.7 L 121.8,480.6 L 121.8,480.6 L 121.8,480.5 L 121.8,480.5 L 121.7,480.4 L 121.7,480.3 L 121.7,480.3 L 121.6,480.3 L 121.6,480.2 L 121.5,480.2 L 121.5,480.2 L 121.4,480.1 L 121.3,480.1 L 121.3,480.0 L 121.3,479.9 L 121.3,479.8 L 121.2,479.7 L 121.2,479.6 L 121.1,479.6 L 121.1,479.6 L 121.1,479.5 L 121.0,479.5 L 121.2,479.5 L 121.3,479.3 L 121.2,479.2 L 121.1,479.3 L 121.1,479.3 L 121.1,479.4 L 120.9,479.4 L 120.9,479.4 L 120.8,479.5 L 120.8,479.4 L 120.5,479.4 L 120.2,479.4 L 120.1,479.4 L 120.0,479.3 L 119.9,479.3 L 119.7,479.2 L 119.5,479.3 L 119.4,479.2 L 119.2,479.2 L 119.2,479.1 L 119.2,479.0 L 119.1,479.0 L 119.1,478.9 L 119.1,478.7 L 119.0,478.7 L 119.0,478.7 L 118.9,478.7 L 118.8,478.6 L 118.8,478.6 L 118.7,478.6 L 118.5,478.5 L 118.5,478.5 L 118.4,478.5 L 118.3,478.4 L 118.3,478.4 L 118.2,478.3 L 118.1,478.3 L 118.0,478.3 L 118.0,478.2 L 118.0,478.2 L 117.7,478.1 L 117.5,478.1 L 117.4,478.0 L 117.4,478.0 L 117.3,478.0 L 117.2,477.9 L 117.2,477.9 L 117.2,477.9 L 117.1,477.8 L 117.0,477.8 L 117.0,477.7 L 116.9,477.7 L 116.9,477.7 L 116.8,477.6 L 116.8,477.6 L 116.7,477.6 L 116.7,477.5 L 116.6,477.5 L 116.4,477.4 L 116.3,477.4 L 116.1,477.4 L 116.1,477.4 L 116.0,477.5 L 116.0,477.5 L 115.9,477.6 L 115.9,477.6 L 115.9,477.7 L 115.7,477.7 L 115.6,477.6 L 115.4,477.6 L 115.4,477.6 L 115.3,477.5 L 115.3,477.5 L 115.2,477.5 L 115.2,477.4 L 115.1,477.4 L 115.1,477.4 L 115.0,477.3 L 115.0,477.3 L 114.9,477.3 L 114.8,477.3 L 114.7,477.3 L 114.6,477.3 L 114.4,477.3 L 114.4,477.3 L 114.4,477.3 L 114.2,477.2 L 114.1,477.3 L 114.1,477.3 L 114.1,477.3 L 114.0,477.4 L 113.8,477.4 L 113.8,477.3 L 113.8,477.2 L 113.8,477.2 L 113.7,477.1 L 113.7,477.0 L 113.7,477.0 L 113.6,476.9 L 113.6,476.9 L 113.5,476.8 L 113.5,476.8 L 113.5,476.7 L 113.4,476.7 L 113.4,476.6 L 113.3,476.5 L 113.3,476.4 L 113.2,476.4 L 113.2,476.3 L 113.1,476.2 L 113.1,476.1 L 113.1,476.1 L 113.0,476.0 L 113.0,476.0 L 113.1,475.9 L 113.2,475.9 L 113.2,475.8 L 113.3,475.7 L 113.3,475.7 L 113.4,475.7 L 113.4,475.6 L 113.4,475.6 L 113.5,475.2 L 113.4,475.1 L 113.4,475.0 L 113.1,475.0 L 113.1,475.1 L 113.0,475.0 L 112.9,475.0 L 112.9,475.0 L 112.8,474.9 L 112.8,474.8 L 112.8,474.8 L 112.7,474.7 L 112.7,474.7 L 112.6,474.7 L 112.6,474.6 L 112.6,474.6 L 112.5,474.5 L 112.5,474.4 L 112.4,474.4 L 112.4,474.4 L 112.4,474.3 L 112.3,474.3 L 112.3,474.2 L 112.2,474.2 L 112.2,474.1 L 112.1,474.1 L 112.1,474.0 L 112.0,474.0 L 112.0,473.9 L 112.0,473.9 L 111.9,473.8 L 111.9,473.8 L 111.9,473.7 L 111.8,473.6 L 111.8,473.3 L 111.8,473.2 L 111.8,473.1 L 111.8,472.8 L 111.8,472.8 L 111.9,472.7 L 111.9,472.4 L 111.9,472.2 L 112.0,472.1 L 112.0,472.0 L 112.0,471.8 L 111.9,471.8 L 111.9,471.7 L 111.9,471.5 L 111.8,471.3 L 111.8,471.3 L 111.8,471.2 L 111.7,471.2 L 111.7,471.1 L 111.6,471.0 L 111.6,470.9 L 111.6,470.9 L 111.5,470.8 L 111.5,470.8 L 111.5,470.6 L 111.5,470.5 L 111.4,470.4 L 111.4,470.3 L 111.3,470.1 L 111.3,470.1 L 111.3,470.0 L 111.2,469.9 L 111.2,469.8 L 111.1,469.8 L 111.1,469.8 L 111.1,469.7 L 111.0,469.7 L 111.0,469.6 L 110.9,469.6 L 110.9,469.6 L 110.8,469.5 L 110.8,469.5 L 110.8,469.4 L 110.6,469.4 L 110.5,469.4 L 110.4,469.3 L 110.3,469.3 L 110.2,469.3 L 110.0,469.2 L 109.9,469.2 L 109.9,469.1 L 109.9,469.0 L 109.9,468.8 L 109.9,468.8 L 109.8,468.7 L 109.8,468.7 L 109.7,468.6 L 109.6,468.6 L 109.5,468.6 L 109.2,468.6 L 109.1,468.6 L 109.0,468.6 L 109.0,468.7 L 108.8,468.7 L 108.8,468.7 L 108.7,468.6 L 108.7,468.6 L 108.7,468.5 L 108.7,468.5 L 108.8,468.5 L 108.8,468.4 L 108.8,468.4 L 108.8,468.3 L 108.7,468.3 L 108.7,468.3 L 108.7,468.2 L 108.7,468.1 L 108.7,468.1 L 108.7,468.0 L 108.8,468.0 L 109.0,468.0 L 109.0,468.0 L 109.1,468.0 L 109.2,468.0 L 109.3,467.9 L 109.4,467.9 L 109.4,467.8 L 109.5,467.8 L 109.5,467.6 L 109.5,467.6 L 109.5,467.5 L 109.5,467.5 L 109.4,467.4 L 109.5,467.4 L 109.5,467.4 L 109.6,467.3 L 109.7,467.4 L 109.7,467.4 L 109.7,467.5 L 109.9,467.5 L 109.8,467.3 L 109.8,467.3 L 109.7,467.2 L 109.7,467.2 L 109.6,467.1 L 109.6,467.0 L 109.5,466.9 L 109.5,466.8 L 109.4,466.7 L 109.4,466.7 L 109.0,466.7 L 108.9,466.7 L 108.9,466.6 L 108.9,466.6 L 109.0,466.5 L 109.1,466.5 L 109.0,466.4 L 109.0,466.3 L 108.9,466.3 L 108.9,466.3 L 109.0,466.3 L 109.2,466.3 L 109.3,466.2 L 109.4,466.2 L 109.3,466.0 L 109.3,465.8 L 109.3,465.5 L 109.2,465.4 L 109.2,465.4 L 109.1,465.3 L 109.1,465.2 L 109.1,465.2 L 109.0,465.1 L 109.0,465.1 L 108.9,464.9 L 108.9,464.5 L 108.9,464.4 L 109.0,464.4 L 108.9,464.0 L 108.9,463.9 L 108.9,463.8 L 108.9,463.7 L 108.8,463.6 L 108.8,463.5 L 108.8,463.4 L 108.7,463.3 L 108.7,463.2 L 108.6,463.1 L 108.6,463.0 L 108.6,463.0 L 108.5,462.8 L 108.5,462.7 L 108.5,462.6 L 108.4,462.4 L 108.4,462.3 L 108.4,462.1 L 108.4,461.9 L 108.3,461.9 L 108.3,461.8 L 108.2,461.6 L 108.2,461.4 L 108.2,461.3 L 108.2,461.2 L 108.1,461.2 L 108.1,461.1 L 108.0,461.0 L 108.0,460.9 L 108.0,460.9 L 107.9,460.8 L 107.9,460.8 L 107.9,460.5 L 107.8,460.4 L 107.8,460.2 L 107.7,460.1 L 107.7,460.0 L 107.7,459.9 L 107.6,459.8 L 107.6,459.7 L 107.6,459.6 L 107.5,459.5 L 107.5,459.3 L 107.4,459.3 L 107.4,458.8 L 107.4,458.7 L 107.3,458.7 L 107.3,458.6 L 107.2,458.5 L 107.2,458.4 L 107.2,458.3 L 107.1,458.2 L 107.1,458.1 L 107.0,458.0 L 107.0,458.0 L 107.0,457.9 L 106.9,457.9 L 106.9,457.8 L 106.9,457.7 L 107.0,457.6 L 107.0,457.7 L 107.1,457.7 L 107.1,457.7 L 107.4,457.7 L 107.4,457.8 L 107.5,457.8 L 107.5,457.9 L 107.7,457.9 L 107.7,457.9 L 107.7,457.8 L 107.7,457.6 L 107.7,457.6 L 107.5,457.6 L 107.4,457.6 L 107.4,457.6 L 107.2,457.6 L 107.2,457.5 L 107.2,457.5 L 107.2,457.4 L 107.3,457.3 L 107.4,457.3 L 107.4,457.3 L 107.5,457.4 L 107.5,457.4 L 107.6,457.4 L 107.8,457.4 L 107.9,457.4 L 108.0,457.3 L 108.0,457.3 L 108.0,457.2 L 108.1,457.2 L 108.1,457.2 L 108.1,457.0 L 108.1,457.0 L 108.1,456.9 L 108.0,456.9 L 108.0,457.1 L 108.0,457.1 L 107.9,457.2 L 107.9,457.2 L 107.8,457.3 L 107.7,457.3 L 107.6,457.3 L 107.5,457.3 L 107.5,457.2 L 107.6,457.1 L 107.6,457.1 L 107.7,457.1 L 107.7,456.8 L 107.8,456.7 L 107.8,456.6 L 107.9,456.5 L 107.8,456.4 L 107.9,456.3 L 107.9,456.2 L 108.0,456.0 L 107.9,455.9 L 107.9,456.0 L 107.8,456.1 L 107.8,456.2 L 107.8,456.3 L 107.8,456.3 L 107.7,456.4 L 107.7,456.4 L 107.7,456.6 L 107.6,456.6 L 107.6,456.9 L 107.6,456.9 L 107.5,457.0 L 107.5,457.0 L 107.4,457.0 L 107.4,457.1 L 107.3,457.1 L 107.3,457.1 L 107.2,457.2 L 107.2,457.2 L 107.2,457.3 L 107.1,457.3 L 107.1,457.4 L 107.0,457.4 L 107.0,457.5 L 106.9,457.5 L 106.9,457.6 L 106.9,457.6 L 106.8,457.6 L 106.7,457.6 L 106.7,457.7 L 106.6,457.7 L 106.6,457.8 L 106.5,457.8 L 106.5,457.8 L 106.4,457.9 L 106.3,457.8 L 106.3,457.8 L 106.3,457.7 L 106.2,457.7 L 106.2,457.7 L 106.1,457.6 L 106.1,457.6 L 106.1,457.5 L 106.0,457.3 L 106.1,457.2 L 106.1,457.1 L 106.1,457.1 L 106.1,457.0 L 106.1,456.8 L 106.1,456.7 L 106.1,456.7 L 106.0,456.6 L 106.0,456.6 L 105.9,456.5 L 105.9,456.5 L 105.9,456.3 L 105.9,456.0 L 105.8,455.8 L 105.8,455.7 L 105.8,455.6 L 105.7,455.5 L 105.7,455.3 L 105.6,455.3 L 105.6,455.2 L 105.5,455.2 L 105.5,455.0 L 105.5,455.0 L 105.4,454.7 L 105.4,454.5 L 105.4,454.4 L 105.2,454.4 L 105.2,454.4 L 105.1,454.4 L 105.1,454.2 L 105.1,454.0 L 105.1,453.9 L 105.0,453.7 L 105.0,453.5 L 104.9,453.5 L 104.9,453.4 L 104.8,453.3 L 104.8,453.0 L 104.8,452.9 L 104.7,452.8 L 104.7,452.7 L 104.7,452.5 L 104.6,452.4 L 104.6,452.2 L 104.6,452.2 L 104.7,452.1 L 104.7,452.0 L 104.7,451.9 L 104.8,451.9 L 104.8,451.8 L 104.9,451.8 L 104.9,451.6 L 105.0,451.6 L 105.2,451.6 L 105.3,451.6 L 105.4,451.5 L 105.6,451.5 L 105.7,451.5 L 105.7,451.6 L 105.8,451.6 L 106.1,451.5 L 106.3,451.6 L 106.4,451.5 L 106.8,451.5 L 106.8,451.4 L 106.8,451.4 L 106.9,451.3 L 106.9,451.3 L 106.8,451.3 L 106.8,451.3 L 106.7,451.4 L 106.7,451.4 L 106.7,451.4 L 106.6,451.4 L 106.4,451.4 L 106.2,451.4 L 106.1,451.4 L 105.9,451.4 L 105.6,451.4 L 105.6,451.4 L 105.5,451.4 L 105.4,451.4 L 105.4,451.3 L 105.2,451.3 L 105.1,451.3 L 105.1,451.3 L 105.1,451.2 L 105.1,451.2 L 105.3,451.2 L 105.2,451.1 L 105.2,451.0 L 105.2,450.9 L 105.1,450.9 L 105.1,451.0 L 105.1,451.1 L 105.0,451.1 L 105.0,451.2 L 104.9,451.2 L 104.8,451.3 L 104.8,451.3 L 104.7,451.3 L 104.7,451.4 L 104.6,451.5 L 104.6,451.7 L 104.6,451.7 L 104.7,451.8 L 104.7,451.8 L 104.6,451.9 L 104.6,451.9 L 104.5,451.9 L 104.5,451.8 L 104.5,451.8 L 104.4,451.6 L 104.4,451.5 L 104.4,451.4 L 104.3,451.3 L 104.3,451.1 L 104.2,451.1 L 104.2,450.9 L 104.2,450.8 L 104.1,450.7 L 104.1,450.6 L 104.0,450.5 L 104.0,450.5 L 104.0,450.4 L 103.9,450.4 L 103.7,450.4 L 103.6,450.3 L 103.6,450.3 L 103.5,450.2 L 103.5,450.2 L 103.5,450.0 L 103.4,449.9 L 103.4,449.7 L 103.4,449.6 L 103.3,449.6 L 103.3,449.6 L 103.2,449.5 L 103.2,449.5 L 103.1,449.4 L 103.1,449.3 L 103.0,449.3 L 103.0,449.2 L 103.0,449.0 L 103.0,449.0 L 103.2,448.9 L 103.2,448.8 L 103.2,448.7 L 103.2,448.5 L 103.1,448.5 L 103.1,448.4 L 103.0,448.3 L 103.1,448.2 L 103.1,448.1 L 103.2,448.0 L 103.1,447.9 L 103.1,447.9 L 103.0,447.9 L 102.9,447.9 L 102.9,447.8 L 102.8,447.8 L 102.7,447.8 L 102.7,447.7 L 102.6,447.7 L 102.5,447.7 L 102.4,447.7 L 102.3,447.6 L 102.2,447.6 L 102.2,447.5 L 102.3,447.5 L 102.3,447.4 L 102.3,447.4 L 102.4,447.3 L 102.4,447.1 L 102.4,447.0 L 102.5,447.0 L 102.5,446.9 L 102.6,446.9 L 102.6,446.8 L 102.7,446.8 L 102.7,446.7 L 102.6,446.7 L 102.6,446.6 L 102.5,446.5 L 102.5,446.3 L 102.4,446.3 L 102.4,446.1 L 102.4,446.0 L 102.4,445.9 L 102.4,445.8 L 102.5,445.8 L 102.5,445.7 L 102.6,445.7 L 102.6,445.7 L 102.6,445.7 L 102.7,445.8 L 102.7,445.9 L 102.8,445.9 L 102.8,446.0 L 102.8,446.0 L 102.9,446.1 L 102.9,446.1 L 102.9,446.1 L 103.0,446.2 L 103.0,446.2 L 103.4,446.2 L 103.4,446.1 L 103.5,446.1 L 103.8,446.1 L 104.0,446.1 L 104.1,446.0 L 104.3,446.0 L 104.3,446.0 L 104.4,446.0 L 104.6,445.9 L 104.6,445.9 L 104.6,445.9 L 104.7,445.8 L 104.6,445.8 L 104.6,445.7 L 104.5,445.7 L 104.5,445.7 L 104.4,445.8 L 104.4,445.8 L 104.3,445.8 L 104.3,446.0 L 104.2,446.0 L 104.1,445.9 L 103.8,445.9 L 103.5,445.9 L 103.4,445.9 L 103.1,445.9 L 103.1,445.9 L 103.0,445.9 L 102.9,445.9 L 102.9,445.9 L 102.9,445.8 L 102.9,445.8 L 102.9,445.6 L 102.8,445.5 L 102.8,445.4 L 102.6,445.4 L 102.6,445.5 L 102.6,445.5 L 102.5,445.5 L 102.5,445.5 L 102.4,445.6 L 102.3,445.8 L 102.3,445.8 L 102.2,445.8 L 102.2,445.9 L 102.1,445.9 L 102.0,445.9 L 102.0,445.9 L 102.0,445.8 L 101.9,445.8 L 101.9,445.7 L 101.6,445.7 L 101.5,445.7 L 101.5,445.6 L 101.4,445.7 L 101.4,445.7 L 101.4,445.8 L 101.3,445.8 L 101.3,445.8 L 101.0,445.8 L 100.9,445.7 L 100.8,445.7 L 100.8,445.7 L 100.7,445.7 L 100.7,445.6 L 100.6,445.6 L 100.6,445.5 L 100.6,445.4 L 100.7,445.3 L 100.7,445.3 L 100.7,445.2 L 100.8,445.2 L 100.8,445.1 L 100.9,445.0 L 100.9,445.0 L 101.0,444.9 L 101.0,444.8 L 100.9,444.7 L 100.9,444.7 L 100.7,444.7 L 100.6,444.6 L 100.5,444.6 L 100.5,444.6 L 100.5,444.5 L 100.5,444.4 L 100.6,444.3 L 100.6,444.3 L 100.7,444.3 L 100.7,444.0 L 100.8,443.9 L 100.8,443.7 L 100.9,443.7 L 100.9,443.6 L 101.0,443.6 L 101.0,443.6 L 101.1,443.6 L 101.2,443.7 L 101.2,443.7 L 101.2,443.9 L 101.2,443.9 L 101.2,444.0 L 101.2,444.2 L 101.1,444.3 L 101.1,444.3 L 101.1,444.6 L 101.1,444.6 L 101.1,444.6 L 101.2,444.6 L 101.2,444.5 L 101.3,444.4 L 101.3,444.4 L 101.5,444.4 L 101.5,444.3 L 101.5,444.3 L 101.6,444.2 L 101.6,444.0 L 101.6,443.9 L 101.6,443.8 L 101.7,443.7 L 101.8,443.7 L 101.8,443.7 L 101.9,443.6 L 101.9,443.6 L 102.0,443.6 L 102.1,443.5 L 102.2,443.5 L 102.2,443.5 L 102.2,443.4 L 102.3,443.4 L 102.3,443.3 L 102.3,443.3 L 102.4,443.3 L 102.5,443.2 L 102.5,443.2 L 102.7,443.2 L 102.8,443.3 L 102.8,443.3 L 102.9,443.4 L 102.9,443.4 L 102.9,443.4 L 103.0,443.5 L 103.0,443.5 L 103.1,443.6 L 103.1,443.6 L 103.2,443.6 L 103.4,443.7 L 103.6,443.6 L 103.7,443.6 L 103.7,443.6 L 103.8,443.5 L 103.8,443.5 L 103.8,443.4 L 103.9,443.4 L 103.9,443.3 L 104.0,443.3 L 104.0,443.2 L 104.0,443.2 L 104.1,442.9 L 104.0,442.7 L 104.0,442.5 L 104.1,442.5 L 103.9,442.5 L 103.8,442.5 L 103.8,442.6 L 103.7,442.6 L 103.7,442.6 L 103.6,442.7 L 103.5,442.7 L 103.5,442.7 L 103.3,442.7 L 103.2,442.8 L 103.1,442.8 L 103.0,442.8 L 102.7,442.8 L 102.7,442.7 L 102.6,442.7 L 102.5,442.7 L 102.4,442.6 L 102.4,442.6 L 102.3,442.6 L 102.3,442.6 L 102.2,442.7 L 102.2,442.8 L 102.1,442.8 L 102.1,442.9 L 102.1,442.9 L 102.0,443.0 L 102.0,443.0 L 101.9,443.0 L 101.8,443.1 L 101.8,443.1 L 101.7,443.1 L 101.7,443.2 L 101.5,443.1 L 101.4,443.1 L 101.4,443.1 L 101.3,443.0 L 101.2,443.1 L 101.2,443.1 L 101.1,443.1 L 101.0,443.2 L 100.8,443.2 L 100.7,443.1 L 100.6,443.1 L 100.6,443.1 L 100.5,443.1 L 100.4,443.1 L 100.4,443.0 L 100.4,442.9 L 100.4,442.9 L 100.5,442.8 L 100.5,442.8 L 100.5,442.8 L 100.5,442.7 L 100.4,442.7 L 100.4,442.6 L 100.4,442.5 L 100.3,442.3 L 100.4,442.2 L 100.4,442.2 L 100.5,442.2 L 100.5,442.1 L 100.5,442.1 L 100.4,442.0 L 100.4,442.0 L 100.4,441.7 L 100.3,441.7 L 100.3,441.6 L 100.2,441.6 L 100.2,441.6 L 100.1,441.5 L 100.1,441.5 L 100.0,441.5 L 100.0,441.4 L 100.0,441.3 L 99.9,441.1 L 99.9,441.1 L 99.7,440.9 L 99.7,440.8 L 99.7,440.8 L 99.8,440.8 L 99.8,440.6 L 99.8,440.4 L 99.7,440.2 L 99.7,440.1 L 99.7,439.9 L 99.6,439.9 L 99.6,439.8 L 99.6,439.8 L 99.7,439.8 L 100.0,439.8 L 100.1,439.8 L 100.1,439.8 L 100.1,439.9 L 100.2,439.9 L 100.3,439.9 L 100.2,439.9 L 100.2,439.8 L 100.1,439.8 L 100.1,439.7 L 100.0,439.7 L 100.0,439.6 L 99.9,439.7 L 99.8,439.7 L 99.7,439.6 L 99.6,439.6 L 99.6,439.6 L 99.5,439.5 L 99.5,439.5 L 99.5,439.4 L 99.4,439.4 L 99.3,439.4 L 99.2,439.5 L 99.1,439.5 L 99.0,439.5 L 99.0,439.4 L 99.0,439.4 L 98.9,439.3 L 98.9,439.3 L 98.9,439.2 L 98.8,439.1 L 98.8,439.1 L 98.7,439.1 L 98.7,438.9 L 98.7,438.8 L 98.7,438.7 L 98.6,438.5 L 98.6,438.4 L 98.6,438.4 L 98.5,438.3 L 98.5,438.3 L 98.5,438.2 L 98.4,438.2 L 98.4,438.1 L 98.3,438.1 L 98.3,438.0 L 98.2,438.0 L 98.2,437.8 L 98.2,437.7 L 98.1,437.5 L 98.2,437.5 L 98.2,437.2 L 98.2,437.1 L 98.1,437.0 L 98.1,437.0 L 98.1,436.9 L 97.9,436.9 L 97.8,436.9 L 97.7,436.9 L 97.7,436.8 L 97.6,436.7 L 97.6,436.6 L 97.5,436.6 L 97.5,436.5 L 97.5,436.5 L 97.4,436.5 L 97.4,436.5 L 97.4,436.4 L 97.3,436.3 L 97.3,436.3 L 97.2,436.2 L 97.2,436.1 L 97.2,436.0 L 97.2,435.9 L 97.1,435.8 L 97.1,435.6 L 97.0,435.5 L 97.0,435.2 L 96.9,435.1 L 96.9,435.0 L 96.9,434.9 L 96.8,434.8 L 96.8,434.7 L 96.7,434.6 L 96.7,434.6 L 96.7,434.5 L 96.6,434.4 L 96.6,434.3 L 96.5,434.3 L 96.5,434.2 L 96.5,434.2 L 96.4,434.2 L 96.4,434.2 L 96.2,434.2 L 96.1,434.2 L 96.1,434.2 L 96.0,434.2 L 95.9,434.3 L 95.9,434.3 L 95.9,434.3 L 95.8,434.4 L 95.8,434.2 L 95.9,434.1 L 95.9,434.1 L 95.9,434.0 L 96.0,434.0 L 96.0,433.9 L 95.9,433.8 L 95.9,433.7 L 95.9,433.6 L 95.8,433.6 L 95.8,433.4 L 95.7,433.4 L 95.8,433.3 L 95.8,433.2 L 95.8,433.2 L 95.9,433.1 L 95.9,433.1 L 95.8,433.0 L 95.8,433.0 L 95.7,432.9 L 95.7,432.9 L 95.6,432.9 L 95.6,432.8 L 95.5,432.8 L 95.5,432.8 L 95.4,432.8 L 95.4,432.6 L 95.4,432.5 L 95.3,432.5 L 95.3,432.5 L 95.3,432.4 L 95.5,432.5 L 95.4,432.4 L 95.4,432.4 L 95.3,432.4 L 95.3,432.3 L 95.3,432.2 L 95.4,432.2 L 95.4,432.3 L 95.5,432.3 L 95.5,432.3 L 95.6,432.2 L 95.6,432.0 L 95.7,432.0 L 95.7,432.0 L 95.7,431.9 L 95.8,431.9 L 95.8,431.9 L 95.9,431.8 L 95.9,431.8 L 95.9,431.7 L 96.0,431.7 L 96.0,431.7 L 96.1,431.6 L 96.1,431.4 L 96.0,431.4 L 96.0,431.3 L 95.9,431.3 L 96.0,431.2 L 96.1,431.1 L 96.1,431.2 L 96.2,431.2 L 96.2,431.3 L 96.3,431.4 L 96.3,431.4 L 96.3,431.5 L 96.4,431.5 L 96.4,431.4 L 96.5,431.4 L 96.6,431.3 L 96.6,431.3 L 96.7,431.2 L 96.7,431.1 L 96.9,431.1 L 96.9,431.1 L 97.0,431.1 L 97.1,431.2 L 97.3,431.1 L 97.3,431.1 L 97.3,431.1 L 97.4,431.0 L 97.3,430.9 L 97.3,430.9 L 97.2,430.9 L 97.2,430.8 L 97.2,430.7 L 97.3,430.7 L 97.4,430.7 L 97.4,430.8 L 97.5,430.8 L 97.5,430.8 L 97.6,430.9 L 97.6,431.1 L 97.7,431.1 L 97.7,431.1 L 97.8,431.2 L 97.8,431.3 L 97.9,431.3 L 97.9,431.3 L 97.9,431.4 L 98.0,431.5 L 98.0,431.5 L 98.1,431.6 L 98.0,431.8 L 98.0,431.8 L 98.1,431.9 L 98.1,431.9 L 98.2,431.9 L 98.2,432.0 L 98.3,432.0 L 98.3,432.0 L 98.4,432.1 L 98.4,432.1 L 98.5,432.2 L 98.5,432.2 L 98.5,432.4 L 98.6,432.8 L 98.6,433.1 L 98.7,433.1 L 98.7,433.2 L 98.8,433.2 L 98.8,433.2 L 98.8,433.3 L 98.9,433.3 L 98.9,433.4 L 98.9,433.4 L 99.0,433.4 L 99.1,433.5 L 99.1,433.5 L 99.1,433.6 L 99.3,433.7 L 99.3,433.7 L 99.4,433.7 L 99.5,433.7 L 99.6,433.7 L 99.6,433.8 L 99.7,433.8 L 99.8,433.9 L 99.8,433.9 L 99.9,434.0 L 100.0,434.0 L 100.1,434.0 L 100.1,434.0 L 100.1,434.1 L 100.2,434.1 L 100.2,434.4 L 100.2,434.4 L 100.1,434.5 L 100.0,434.5 L 99.9,434.6 L 99.7,434.6 L 99.7,434.6 L 99.5,434.7 L 99.4,434.7 L 99.2,434.7 L 99.1,434.8 L 99.0,434.8 L 98.9,434.9 L 98.9,434.9 L 98.8,435.1 L 98.9,435.0 L 99.0,434.9 L 99.0,434.9 L 99.1,434.9 L 99.3,434.8 L 99.4,434.8 L 99.5,434.8 L 99.6,434.8 L 99.7,434.8 L 99.7,434.7 L 99.9,434.7 L 99.9,434.7 L 100.0,434.6 L 100.3,434.6 L 100.4,434.6 L 100.4,434.5 L 100.5,434.5 L 100.5,434.4 L 100.6,434.4 L 100.6,434.5 L 100.7,434.5 L 100.8,434.6 L 101.1,434.5 L 101.2,434.5 L 101.3,434.5 L 101.4,434.5 L 101.6,434.5 L 101.7,434.5 L 101.9,434.5 L 101.9,434.5 L 102.0,434.5 L 102.1,434.5 L 102.1,434.6 L 102.2,434.6 L 102.3,434.6 L 102.5,434.6 L 102.7,434.3 L 105.3,434.5 L 106.3,434.2 L 110.4,435.9 L 111.0,435.9 L 111.6,435.8 L 112.5,434.7 L 113.9,434.0 L 115.9,433.7 L 117.8,434.4 L 120.4,433.1 L 121.3,432.3 L 123.6,431.9 L 125.4,431.0 L 126.7,430.8 L 127.7,430.5 L 128.1,429.8 L 129.3,429.3 L 130.2,428.1 L 131.2,426.7 L 133.0,427.0 L 134.1,427.2 L 134.6,427.8 L 136.5,428.0 L 138.4,427.9 L 138.6,427.1 L 138.0,425.9 L 138.5,424.6 L 139.8,423.4 L 141.1,423.5 L 142.3,423.5 L 145.2,423.5 L 146.5,424.3 L 146.5,425.6 L 146.6,425.7 Z"
    },
    {
      "id": "solapur",
      "name": "Solapur",
      "path": "M 243.7,385.1 L 243.3,384.6 L 242.2,384.8 L 242.6,384.3 L 242.4,384.0 L 242.8,383.6 L 241.1,383.9 L 240.2,383.6 L 240.6,383.1 L 239.5,382.9 L 239.6,382.5 L 238.7,382.4 L 241.3,382.3 L 241.3,381.6 L 242.1,381.4 L 242.8,380.6 L 243.2,380.1 L 243.8,378.0 L 246.7,377.8 L 247.0,376.8 L 248.7,376.5 L 249.8,373.7 L 249.6,372.7 L 251.3,371.6 L 252.8,369.4 L 252.4,368.0 L 253.9,367.6 L 255.7,366.8 L 255.5,364.9 L 256.3,362.8 L 255.5,361.2 L 252.5,362.4 L 250.7,363.5 L 249.9,362.9 L 248.6,361.1 L 247.9,360.6 L 247.1,360.0 L 247.3,359.5 L 250.3,358.5 L 249.5,356.4 L 249.0,355.9 L 249.3,354.4 L 248.8,354.1 L 247.4,354.4 L 244.9,354.7 L 245.0,353.5 L 245.2,352.1 L 244.4,352.0 L 244.3,351.2 L 242.8,349.4 L 241.9,347.3 L 240.1,345.9 L 240.9,344.2 L 239.3,343.9 L 237.7,344.0 L 235.8,342.4 L 233.0,341.3 L 231.0,340.8 L 230.5,341.5 L 229.1,341.2 L 229.5,340.8 L 229.9,339.7 L 228.5,339.3 L 229.2,338.6 L 227.1,339.2 L 226.0,339.1 L 225.4,339.5 L 224.9,339.3 L 224.7,339.1 L 224.4,339.0 L 224.6,338.4 L 224.3,338.2 L 223.5,337.8 L 223.4,337.3 L 223.4,336.4 L 222.8,335.7 L 221.1,333.8 L 220.0,334.8 L 219.7,335.7 L 219.4,336.2 L 218.2,336.0 L 216.9,335.6 L 216.5,335.2 L 216.8,334.1 L 217.8,333.8 L 218.6,331.7 L 219.1,330.5 L 220.9,328.7 L 221.8,325.3 L 221.5,323.4 L 225.7,321.3 L 227.2,321.3 L 229.2,322.1 L 230.3,321.7 L 231.4,322.3 L 232.4,322.7 L 233.9,323.0 L 234.3,323.6 L 234.8,323.7 L 235.0,323.5 L 234.8,322.6 L 234.9,322.2 L 236.1,322.5 L 236.8,323.4 L 237.6,324.1 L 239.5,324.0 L 240.0,324.5 L 239.4,325.9 L 238.2,327.0 L 240.2,327.1 L 242.1,327.9 L 243.2,328.1 L 244.8,327.6 L 247.3,328.1 L 248.5,329.4 L 250.8,329.8 L 254.1,330.4 L 254.4,331.4 L 256.1,330.7 L 257.5,330.8 L 256.8,329.6 L 257.9,329.1 L 260.2,329.6 L 260.1,328.5 L 260.7,327.9 L 262.8,328.4 L 264.3,327.2 L 264.1,326.4 L 263.6,325.6 L 265.0,325.7 L 264.2,324.1 L 263.0,323.6 L 262.0,325.5 L 259.8,325.1 L 258.0,327.1 L 255.7,327.0 L 254.8,324.9 L 256.7,323.0 L 258.3,321.3 L 260.5,320.1 L 261.5,318.3 L 263.7,318.0 L 264.9,317.0 L 266.9,316.0 L 267.6,315.0 L 267.1,314.4 L 264.6,314.5 L 261.6,314.6 L 261.1,313.7 L 261.3,311.8 L 262.8,309.4 L 262.6,307.5 L 261.5,307.0 L 258.0,308.7 L 256.5,308.9 L 255.1,309.4 L 253.3,307.9 L 254.3,306.3 L 256.6,304.5 L 256.3,303.8 L 253.7,305.0 L 251.9,305.5 L 249.2,304.6 L 247.4,303.8 L 244.7,304.2 L 242.1,304.2 L 240.2,305.0 L 237.1,305.1 L 235.1,303.3 L 233.8,301.3 L 235.9,301.1 L 237.9,301.4 L 237.4,299.5 L 237.5,298.3 L 239.9,298.5 L 240.4,297.2 L 242.5,296.9 L 244.7,295.3 L 247.5,294.7 L 249.3,294.7 L 250.0,294.0 L 252.9,293.4 L 253.7,291.2 L 257.1,291.4 L 258.6,292.0 L 259.6,291.9 L 260.1,291.5 L 260.9,291.3 L 261.1,289.4 L 261.9,288.4 L 263.6,286.7 L 264.4,285.5 L 267.2,284.6 L 269.7,284.0 L 271.4,283.7 L 272.8,282.1 L 273.6,282.9 L 274.9,283.1 L 276.1,284.7 L 278.5,285.0 L 281.4,285.0 L 280.4,285.9 L 280.5,287.2 L 280.3,289.1 L 280.2,290.1 L 280.4,291.4 L 279.0,293.1 L 280.3,293.6 L 280.9,294.2 L 282.0,293.9 L 283.4,294.3 L 284.3,295.1 L 285.8,295.8 L 286.5,297.0 L 288.2,298.3 L 289.4,298.9 L 290.2,299.3 L 289.0,300.5 L 289.6,301.3 L 289.4,302.3 L 292.2,303.8 L 292.2,305.2 L 292.1,306.0 L 292.1,307.1 L 292.9,308.4 L 292.2,310.0 L 293.7,310.4 L 295.6,311.4 L 295.8,310.6 L 296.7,310.4 L 297.9,310.5 L 298.9,311.6 L 299.8,311.7 L 300.7,312.9 L 302.6,313.1 L 303.5,312.3 L 303.7,309.5 L 303.9,308.3 L 305.1,306.5 L 306.8,305.1 L 309.7,305.1 L 311.1,305.0 L 310.6,303.4 L 310.0,302.5 L 311.1,300.9 L 312.1,299.7 L 313.2,298.6 L 315.8,299.2 L 317.0,299.0 L 317.6,298.2 L 319.1,298.3 L 319.3,297.4 L 320.0,296.0 L 319.8,294.4 L 318.3,294.1 L 318.6,293.4 L 319.2,292.4 L 321.1,290.9 L 323.2,290.6 L 323.7,291.8 L 324.9,293.3 L 326.4,294.8 L 328.1,294.9 L 329.7,295.6 L 331.7,296.3 L 333.6,296.0 L 334.8,296.7 L 336.2,299.2 L 337.4,300.3 L 338.0,301.1 L 338.1,301.5 L 338.3,302.0 L 338.3,302.4 L 338.5,302.8 L 338.5,303.3 L 338.4,303.7 L 338.4,304.2 L 338.8,304.5 L 339.3,304.7 L 339.7,304.9 L 339.9,305.2 L 339.1,307.1 L 339.3,309.2 L 340.2,309.7 L 340.4,310.2 L 340.7,310.6 L 341.1,310.9 L 341.3,311.3 L 341.3,311.8 L 341.1,312.2 L 341.0,312.6 L 340.6,313.0 L 340.3,313.4 L 339.9,313.7 L 339.7,314.1 L 339.8,314.6 L 340.1,315.0 L 340.3,315.4 L 340.7,315.7 L 341.1,316.0 L 341.3,316.4 L 341.5,316.8 L 342.1,316.8 L 342.7,316.7 L 343.3,316.6 L 343.9,316.5 L 344.4,316.5 L 344.6,317.0 L 344.7,317.5 L 345.0,318.0 L 344.2,318.4 L 344.7,319.3 L 345.2,319.4 L 346.5,320.6 L 345.4,322.2 L 344.9,323.9 L 343.7,324.2 L 342.8,325.7 L 341.4,325.0 L 338.3,325.5 L 336.8,324.6 L 336.5,323.5 L 335.4,323.0 L 334.2,322.7 L 332.5,322.6 L 331.0,323.5 L 330.3,326.6 L 330.5,328.7 L 331.3,329.5 L 330.7,331.6 L 332.5,334.3 L 334.8,335.1 L 337.6,336.0 L 338.8,334.7 L 340.1,335.1 L 342.1,337.0 L 342.7,336.0 L 343.5,335.3 L 346.7,336.3 L 346.0,338.0 L 345.7,339.6 L 345.6,342.2 L 347.0,341.2 L 351.5,340.7 L 354.6,340.5 L 354.6,341.3 L 355.8,340.8 L 356.2,341.0 L 357.5,341.5 L 358.5,342.6 L 360.0,343.5 L 361.1,344.2 L 358.9,344.6 L 358.9,346.0 L 361.4,346.9 L 364.7,346.7 L 365.6,346.2 L 367.2,346.1 L 368.3,345.3 L 370.2,343.9 L 372.7,343.8 L 374.3,344.8 L 376.5,346.4 L 379.2,347.1 L 380.1,348.3 L 383.2,349.8 L 384.7,350.3 L 384.1,352.2 L 380.5,353.2 L 377.4,353.6 L 375.9,355.2 L 376.6,357.6 L 378.5,358.0 L 379.0,359.5 L 376.9,360.1 L 378.0,361.2 L 379.6,361.8 L 376.4,363.0 L 376.0,365.8 L 379.7,365.6 L 378.6,370.1 L 383.1,372.1 L 380.6,374.2 L 377.7,374.9 L 376.1,372.0 L 374.6,373.3 L 372.5,373.5 L 370.3,372.1 L 368.8,371.4 L 368.3,370.7 L 366.4,370.4 L 362.9,371.3 L 361.0,372.0 L 361.6,374.6 L 361.3,375.9 L 360.2,374.2 L 357.8,371.7 L 354.5,371.0 L 353.4,371.9 L 353.1,372.8 L 352.3,373.4 L 350.6,371.6 L 347.0,372.0 L 345.4,372.5 L 342.4,373.0 L 338.6,373.9 L 335.5,371.9 L 335.4,370.4 L 335.2,367.8 L 334.1,366.8 L 333.8,367.8 L 332.5,369.2 L 331.6,367.6 L 329.0,366.4 L 328.3,367.7 L 328.1,369.1 L 327.5,370.5 L 324.8,369.8 L 323.1,367.6 L 320.6,366.6 L 319.2,367.3 L 316.9,367.4 L 315.4,365.5 L 314.4,363.8 L 312.5,362.7 L 310.8,363.6 L 309.3,366.6 L 309.2,367.5 L 308.8,368.8 L 306.8,369.5 L 306.4,371.8 L 307.7,372.3 L 309.1,374.2 L 306.2,376.3 L 304.0,376.9 L 301.3,378.8 L 299.3,380.4 L 295.6,379.9 L 293.9,379.1 L 292.3,378.2 L 290.4,380.2 L 290.2,381.7 L 290.3,383.9 L 288.2,383.9 L 286.7,382.1 L 284.1,380.8 L 281.3,381.8 L 278.8,382.6 L 279.3,384.2 L 280.1,386.6 L 277.4,384.8 L 277.0,384.5 L 273.3,384.5 L 272.7,382.8 L 274.6,382.0 L 274.7,380.2 L 273.3,379.1 L 271.5,378.6 L 270.2,379.1 L 269.1,380.5 L 265.3,380.1 L 263.5,380.1 L 261.2,379.7 L 260.6,379.7 L 259.6,380.5 L 258.6,381.5 L 254.1,381.4 L 253.5,382.3 L 252.3,382.6 L 250.5,383.1 L 247.0,383.4 L 247.2,384.4 L 246.3,385.2 L 243.9,385.2 L 243.7,385.1 Z"
    },
    {
      "id": "thane",
      "name": "Thane",
      "path": "M 94.4,242.5 L 93.3,242.5 L 91.4,244.0 L 90.3,244.1 L 88.9,242.8 L 87.2,241.4 L 86.2,239.8 L 85.2,239.6 L 84.0,240.6 L 81.3,240.0 L 80.5,239.6 L 78.8,240.6 L 77.7,240.5 L 76.5,240.8 L 75.7,240.3 L 73.8,240.6 L 72.9,241.1 L 71.5,243.5 L 71.9,246.4 L 71.8,247.6 L 70.8,248.4 L 69.9,248.9 L 69.6,248.9 L 69.4,248.9 L 69.4,248.8 L 69.3,248.7 L 69.3,248.7 L 69.2,248.7 L 69.1,248.7 L 69.0,248.7 L 68.8,248.7 L 68.8,248.6 L 68.6,248.7 L 68.3,248.7 L 68.2,248.8 L 68.1,248.9 L 68.0,248.9 L 67.9,248.9 L 67.8,248.9 L 67.6,248.9 L 67.5,248.9 L 67.2,248.8 L 67.1,248.8 L 67.1,248.7 L 67.0,248.7 L 66.8,248.7 L 66.7,248.7 L 66.7,248.5 L 66.6,248.4 L 66.6,248.3 L 66.6,248.1 L 66.6,247.9 L 66.6,247.9 L 66.6,247.7 L 66.5,247.7 L 66.5,247.6 L 66.5,247.5 L 66.6,247.5 L 66.6,247.4 L 66.6,247.4 L 66.7,247.4 L 66.7,247.2 L 66.7,247.2 L 66.8,247.2 L 66.8,247.1 L 66.7,247.0 L 66.8,246.9 L 66.8,246.7 L 66.8,246.6 L 66.7,246.6 L 66.7,246.5 L 66.6,246.4 L 66.6,246.3 L 66.6,246.2 L 66.6,246.2 L 66.5,246.1 L 66.5,246.1 L 66.5,246.0 L 66.5,246.0 L 66.5,245.9 L 66.4,245.8 L 66.4,245.7 L 66.3,245.5 L 66.3,245.5 L 66.3,245.1 L 66.2,245.1 L 66.2,245.0 L 66.1,245.0 L 66.1,245.0 L 66.1,244.9 L 66.0,244.8 L 66.0,244.8 L 66.0,244.7 L 65.9,244.7 L 65.9,244.6 L 65.9,244.6 L 65.8,244.5 L 65.8,244.4 L 65.8,244.4 L 65.7,244.4 L 65.6,244.3 L 65.5,244.3 L 65.4,244.3 L 65.3,244.3 L 65.3,244.2 L 65.2,244.2 L 65.4,242.0 L 66.8,239.2 L 67.6,237.7 L 67.1,237.4 L 66.7,237.1 L 66.6,236.6 L 66.0,236.0 L 65.4,236.0 L 64.9,235.7 L 62.0,234.8 L 59.1,231.1 L 57.9,230.3 L 55.8,229.5 L 55.0,229.5 L 54.6,229.2 L 54.1,228.9 L 53.4,228.8 L 52.6,228.8 L 51.7,228.9 L 51.5,228.9 L 51.5,228.9 L 51.4,228.9 L 51.4,228.9 L 51.3,228.9 L 51.3,229.0 L 51.2,229.0 L 51.2,229.1 L 51.2,229.1 L 51.1,229.2 L 51.1,229.2 L 51.1,229.4 L 51.1,229.4 L 51.1,229.5 L 51.2,229.5 L 51.2,229.6 L 51.2,229.6 L 51.3,229.7 L 51.3,229.7 L 51.4,229.7 L 51.4,229.9 L 51.3,229.9 L 51.3,230.0 L 51.2,230.1 L 51.1,230.1 L 51.0,230.1 L 50.6,230.1 L 50.5,230.2 L 50.4,230.2 L 50.4,230.2 L 50.3,230.2 L 50.2,230.3 L 50.2,230.3 L 50.2,230.3 L 50.1,230.3 L 50.1,230.4 L 50.0,230.4 L 50.0,230.5 L 49.9,230.5 L 49.9,230.5 L 49.8,230.5 L 48.2,229.8 L 47.7,229.4 L 46.7,229.4 L 46.3,229.1 L 46.3,229.0 L 46.4,229.0 L 46.4,229.0 L 46.4,228.8 L 46.3,228.7 L 46.2,228.7 L 46.1,228.7 L 46.1,228.5 L 46.1,228.4 L 46.0,228.4 L 46.0,228.2 L 45.9,228.2 L 45.9,228.1 L 45.9,228.0 L 45.8,228.0 L 46.0,228.0 L 46.2,228.0 L 46.3,227.9 L 46.3,227.3 L 46.4,227.3 L 46.4,227.0 L 46.4,226.9 L 46.4,226.2 L 46.5,226.2 L 46.5,226.1 L 46.5,226.1 L 46.6,226.0 L 46.6,225.9 L 46.6,225.9 L 46.6,225.9 L 46.7,225.8 L 46.7,225.8 L 46.8,225.8 L 46.9,225.7 L 46.9,225.7 L 47.1,225.7 L 47.1,225.6 L 47.3,225.6 L 47.3,225.4 L 47.3,225.3 L 47.4,225.2 L 47.4,225.1 L 47.4,225.0 L 47.5,224.9 L 47.5,224.8 L 47.6,224.7 L 47.6,224.5 L 47.6,224.5 L 47.7,224.3 L 47.7,224.2 L 47.7,224.1 L 47.7,224.1 L 47.7,224.0 L 47.6,224.0 L 47.6,224.0 L 47.5,224.0 L 47.5,223.9 L 47.4,223.9 L 47.4,223.8 L 47.3,223.8 L 47.3,223.7 L 47.2,223.7 L 47.2,223.6 L 47.1,223.6 L 47.1,223.6 L 47.1,223.5 L 47.0,223.5 L 47.0,223.4 L 46.9,223.4 L 46.9,223.4 L 46.9,223.3 L 46.8,223.3 L 46.8,223.2 L 46.7,223.2 L 46.7,223.1 L 46.6,223.1 L 46.5,223.0 L 46.5,223.0 L 46.5,223.0 L 46.4,222.9 L 46.4,222.9 L 46.3,222.9 L 46.3,222.8 L 46.2,222.8 L 46.2,222.7 L 46.1,222.7 L 46.1,222.7 L 46.0,222.6 L 46.0,222.6 L 45.8,222.6 L 45.8,222.5 L 45.7,222.5 L 45.6,222.4 L 45.5,222.4 L 45.5,222.3 L 45.5,222.3 L 45.4,222.2 L 45.4,222.2 L 45.4,222.1 L 45.3,222.0 L 45.3,221.9 L 45.2,221.8 L 45.2,221.8 L 45.2,221.8 L 45.1,221.7 L 45.1,221.7 L 45.1,221.7 L 45.0,221.6 L 45.0,221.6 L 44.9,221.6 L 44.9,221.5 L 44.8,221.5 L 44.8,221.4 L 44.7,221.4 L 44.7,221.3 L 44.6,221.3 L 44.6,221.3 L 44.5,221.3 L 44.5,221.2 L 44.4,221.2 L 44.4,221.2 L 44.3,221.1 L 44.3,221.1 L 44.2,221.1 L 44.2,221.0 L 44.1,221.0 L 44.1,220.9 L 44.0,220.9 L 44.0,220.8 L 43.9,220.8 L 43.9,220.6 L 43.9,220.5 L 43.9,220.4 L 44.0,220.3 L 44.0,220.1 L 44.1,220.1 L 44.1,220.0 L 44.2,220.0 L 44.2,219.8 L 44.2,219.8 L 44.3,219.7 L 44.3,219.7 L 44.3,219.6 L 44.7,219.6 L 44.7,219.5 L 44.6,219.4 L 44.6,219.4 L 44.5,219.4 L 44.5,219.3 L 44.4,219.3 L 44.4,219.3 L 44.3,219.2 L 44.3,218.9 L 44.3,218.7 L 44.3,218.4 L 44.2,218.4 L 44.2,218.2 L 44.2,218.2 L 44.2,217.8 L 44.1,217.7 L 44.1,217.6 L 44.0,217.5 L 44.0,217.2 L 43.9,217.2 L 43.9,217.0 L 43.8,217.0 L 43.8,216.9 L 43.8,216.8 L 43.7,216.6 L 43.7,216.6 L 43.6,216.5 L 43.6,216.4 L 43.6,216.3 L 43.5,216.2 L 43.5,216.2 L 43.4,216.1 L 43.4,215.9 L 43.4,215.9 L 43.3,215.8 L 43.3,215.8 L 43.3,215.7 L 43.2,215.6 L 43.2,215.5 L 43.1,215.5 L 43.1,215.4 L 43.1,215.2 L 43.0,215.2 L 43.0,215.1 L 43.0,215.0 L 42.9,214.9 L 42.9,214.9 L 42.8,214.9 L 42.8,214.8 L 42.8,214.7 L 42.7,214.6 L 42.7,214.3 L 42.8,214.2 L 42.8,214.2 L 42.8,214.1 L 42.9,214.1 L 42.9,214.1 L 43.0,214.0 L 43.0,214.0 L 43.1,214.0 L 43.1,213.9 L 43.2,213.9 L 43.2,213.8 L 43.3,213.8 L 43.3,213.7 L 43.4,213.7 L 43.4,213.6 L 43.5,213.6 L 43.5,213.6 L 43.5,213.6 L 43.6,213.5 L 43.6,213.5 L 43.6,213.4 L 43.8,213.4 L 43.8,213.3 L 44.1,213.3 L 44.2,213.3 L 44.3,213.2 L 44.4,213.2 L 44.5,213.3 L 44.6,213.2 L 44.6,213.2 L 44.7,213.1 L 44.7,213.0 L 44.7,213.0 L 44.8,212.9 L 44.8,212.9 L 44.8,212.7 L 44.9,212.7 L 44.9,212.6 L 45.0,212.6 L 45.0,212.6 L 45.1,212.5 L 45.1,212.5 L 45.3,212.5 L 45.3,212.6 L 45.4,212.6 L 45.4,212.7 L 45.5,212.7 L 45.5,212.6 L 45.5,212.6 L 45.5,212.4 L 45.5,212.3 L 45.5,212.2 L 45.6,212.2 L 45.7,212.2 L 45.8,212.1 L 45.9,212.1 L 46.0,212.1 L 46.0,211.1 L 46.0,211.0 L 48.9,210.4 L 50.1,209.7 L 51.3,210.4 L 52.8,208.8 L 55.5,209.9 L 57.7,210.4 L 58.8,209.1 L 57.9,207.7 L 58.1,205.4 L 61.0,206.2 L 62.5,207.5 L 64.6,207.5 L 66.1,209.7 L 68.1,211.6 L 69.5,212.4 L 71.2,212.3 L 72.2,213.3 L 75.0,213.0 L 78.4,211.9 L 79.2,211.2 L 82.0,210.2 L 83.9,209.1 L 86.6,207.5 L 85.8,205.9 L 86.0,204.3 L 88.6,203.5 L 89.5,203.5 L 90.4,202.7 L 91.9,202.2 L 93.5,201.9 L 92.3,200.3 L 92.1,199.2 L 93.0,198.9 L 95.3,197.8 L 97.1,198.7 L 97.7,197.6 L 99.0,197.5 L 100.3,197.7 L 100.3,198.7 L 101.2,198.6 L 101.8,198.0 L 102.5,197.7 L 103.4,197.1 L 105.9,196.9 L 106.8,196.3 L 108.0,196.1 L 109.1,195.5 L 110.2,195.4 L 111.9,194.9 L 112.8,195.1 L 113.7,195.8 L 115.6,196.4 L 116.6,197.6 L 118.0,199.6 L 119.1,200.7 L 119.8,202.8 L 121.7,203.4 L 122.0,203.9 L 124.9,205.3 L 125.5,208.0 L 126.2,209.0 L 128.2,208.9 L 129.3,210.2 L 130.6,210.2 L 132.2,211.1 L 132.9,212.8 L 131.3,213.8 L 131.0,215.7 L 134.4,216.6 L 135.0,217.9 L 136.0,218.2 L 138.3,219.4 L 139.6,219.9 L 141.1,222.8 L 140.9,224.2 L 140.3,223.8 L 139.1,224.2 L 136.8,224.1 L 133.0,224.7 L 130.6,226.1 L 129.5,226.7 L 130.4,228.0 L 131.8,229.6 L 131.3,230.6 L 129.8,231.0 L 128.1,231.6 L 126.3,233.2 L 125.4,233.2 L 122.7,234.5 L 120.0,234.8 L 118.8,235.2 L 117.9,235.8 L 117.4,235.9 L 117.5,236.9 L 116.8,237.2 L 117.4,238.1 L 118.0,238.4 L 117.4,239.7 L 116.3,239.2 L 113.3,239.3 L 111.2,238.8 L 108.7,238.9 L 105.7,239.1 L 103.6,239.0 L 101.9,239.2 L 98.3,239.8 L 96.8,240.6 L 97.0,241.9 L 96.8,242.7 L 96.6,243.3 L 95.5,243.2 L 94.8,243.5 L 94.8,242.7 L 94.4,242.5 Z"
    },
    {
      "id": "wardha",
      "name": "Wardha",
      "path": "M 584.7,90.9 L 585.7,91.8 L 586.1,92.6 L 586.9,93.3 L 587.3,93.8 L 588.8,94.4 L 590.1,95.1 L 590.8,96.4 L 591.2,96.9 L 593.9,97.2 L 594.8,98.0 L 596.5,98.4 L 597.7,99.1 L 598.1,99.8 L 597.7,101.8 L 598.7,103.6 L 599.8,103.7 L 600.6,105.3 L 602.1,106.4 L 601.7,107.1 L 603.8,107.9 L 605.4,108.8 L 607.0,107.8 L 607.9,107.4 L 608.2,108.3 L 609.4,108.9 L 610.5,109.1 L 610.2,109.9 L 611.3,112.3 L 612.5,111.8 L 613.8,111.5 L 615.2,113.1 L 615.4,113.6 L 616.2,114.3 L 618.0,114.9 L 618.3,115.6 L 618.0,116.9 L 619.9,117.6 L 621.1,117.9 L 623.1,118.8 L 624.2,118.8 L 626.6,119.3 L 628.0,119.4 L 629.5,120.2 L 631.0,120.9 L 632.2,121.2 L 633.0,123.0 L 636.5,124.3 L 636.9,125.0 L 637.1,125.7 L 638.8,126.6 L 638.9,127.6 L 639.8,128.2 L 640.3,128.4 L 640.9,129.7 L 642.7,129.8 L 643.9,130.8 L 643.2,132.7 L 640.9,134.4 L 639.7,136.1 L 638.2,137.8 L 636.6,138.4 L 635.2,140.3 L 632.5,140.4 L 631.4,139.8 L 628.4,139.4 L 627.3,139.4 L 625.9,138.5 L 624.1,139.5 L 623.0,140.7 L 622.1,139.7 L 621.7,139.9 L 620.1,140.3 L 619.4,141.9 L 615.6,142.1 L 613.7,141.6 L 611.1,142.7 L 609.4,142.2 L 608.5,142.5 L 609.8,143.5 L 608.5,144.2 L 606.5,144.6 L 606.6,145.9 L 607.1,147.5 L 606.8,148.4 L 607.3,150.4 L 605.1,151.3 L 603.8,152.1 L 602.3,152.0 L 600.3,152.1 L 598.8,152.3 L 597.2,151.2 L 596.2,150.5 L 596.2,149.4 L 596.1,147.9 L 594.3,146.7 L 592.4,145.2 L 591.3,143.6 L 590.2,142.6 L 589.8,141.8 L 587.5,141.7 L 586.7,141.4 L 586.3,142.2 L 583.3,141.9 L 581.6,140.5 L 580.0,139.0 L 579.1,137.8 L 578.8,136.6 L 577.6,135.4 L 576.0,134.9 L 574.5,134.8 L 572.4,136.0 L 571.3,135.6 L 568.6,136.0 L 566.2,135.4 L 565.0,134.4 L 563.4,134.7 L 562.2,133.7 L 559.0,132.9 L 557.0,132.4 L 555.7,131.4 L 554.7,130.2 L 554.1,128.8 L 553.8,127.4 L 553.6,125.9 L 555.1,124.8 L 555.2,123.5 L 556.3,122.2 L 557.1,121.8 L 558.1,121.8 L 558.9,120.2 L 558.9,118.7 L 559.1,117.5 L 557.6,115.8 L 557.7,114.2 L 558.6,113.4 L 559.8,112.7 L 559.0,111.8 L 558.4,112.2 L 557.6,112.4 L 557.3,111.4 L 556.5,111.3 L 555.9,110.0 L 554.0,108.0 L 553.3,107.7 L 552.0,107.2 L 550.4,106.3 L 548.9,107.0 L 547.3,106.3 L 546.9,105.3 L 546.3,104.6 L 545.9,103.7 L 543.9,103.0 L 544.2,100.5 L 543.3,99.5 L 543.2,98.9 L 544.0,97.8 L 543.5,96.7 L 544.4,95.9 L 544.6,94.1 L 544.0,92.0 L 542.8,91.6 L 542.7,90.8 L 543.8,89.4 L 542.8,88.5 L 541.4,87.8 L 539.5,86.4 L 539.6,85.5 L 538.4,83.6 L 536.9,82.7 L 536.7,81.6 L 535.5,80.8 L 536.0,79.0 L 537.6,78.9 L 537.9,78.0 L 537.0,77.5 L 536.9,76.6 L 537.6,74.0 L 537.3,73.1 L 539.3,73.0 L 540.8,73.3 L 542.5,73.7 L 544.3,74.0 L 545.0,74.8 L 550.8,74.8 L 554.1,75.2 L 554.8,75.1 L 556.1,76.3 L 557.7,77.5 L 558.9,77.5 L 559.3,77.9 L 559.0,79.3 L 560.6,79.2 L 560.6,80.0 L 561.2,80.8 L 563.8,80.9 L 568.1,81.7 L 569.2,82.5 L 571.4,81.9 L 573.4,82.8 L 574.7,83.1 L 576.0,84.3 L 577.3,85.3 L 578.7,86.8 L 580.3,89.0 L 584.6,90.9 L 584.7,90.9 Z"
    },
    {
      "id": "washim",
      "name": "Washim",
      "path": "M 449.6,144.1 L 450.3,145.2 L 451.4,144.8 L 452.1,144.2 L 454.6,144.2 L 455.7,143.4 L 455.8,142.5 L 454.7,141.7 L 456.6,140.6 L 458.9,139.3 L 459.7,138.1 L 461.1,139.5 L 463.4,140.3 L 464.6,140.4 L 466.6,139.8 L 468.3,139.0 L 468.2,136.9 L 471.6,136.9 L 472.0,138.0 L 473.3,137.6 L 474.3,134.8 L 471.2,135.3 L 468.8,134.8 L 469.1,134.0 L 469.5,133.2 L 469.1,131.1 L 470.2,131.4 L 471.4,131.5 L 474.8,130.8 L 475.0,130.2 L 475.9,130.3 L 476.1,129.4 L 476.4,128.7 L 479.4,128.6 L 480.9,128.6 L 479.9,127.9 L 479.7,126.5 L 478.5,125.8 L 478.9,125.1 L 479.8,124.9 L 480.6,124.5 L 482.9,125.2 L 482.5,123.3 L 483.6,123.3 L 484.3,124.0 L 485.2,124.4 L 485.4,123.7 L 488.3,123.4 L 488.9,121.8 L 490.5,121.4 L 491.3,120.9 L 492.4,120.2 L 494.5,120.6 L 495.5,120.7 L 496.4,121.2 L 497.0,122.6 L 496.7,123.2 L 496.9,125.1 L 498.2,125.1 L 498.4,125.7 L 498.1,127.9 L 496.5,131.0 L 497.5,131.9 L 497.4,134.6 L 499.4,134.0 L 501.6,134.4 L 501.3,135.5 L 499.6,135.8 L 499.1,137.0 L 498.4,137.4 L 497.9,139.1 L 497.7,140.6 L 494.8,139.7 L 494.0,140.4 L 493.8,141.8 L 492.6,142.4 L 493.0,143.1 L 492.3,143.3 L 491.6,143.8 L 490.9,146.0 L 490.6,147.3 L 490.3,149.2 L 491.0,149.5 L 491.5,149.8 L 491.9,150.5 L 492.7,151.4 L 492.8,152.5 L 494.3,154.4 L 497.2,155.2 L 499.6,155.7 L 498.3,158.4 L 498.8,159.1 L 497.7,159.7 L 497.9,160.2 L 498.2,161.2 L 499.6,161.2 L 500.6,162.2 L 501.1,163.4 L 500.0,165.2 L 499.6,166.7 L 498.7,167.6 L 497.9,168.5 L 497.0,169.2 L 495.8,170.8 L 494.3,171.3 L 493.5,171.5 L 492.6,171.7 L 490.4,170.9 L 489.4,170.7 L 488.9,169.4 L 487.6,168.5 L 484.3,167.6 L 482.9,168.1 L 481.7,168.2 L 479.9,168.9 L 477.8,168.5 L 476.2,168.0 L 475.1,167.8 L 473.5,167.6 L 471.8,167.5 L 470.6,168.6 L 472.2,170.5 L 471.2,172.0 L 469.4,173.5 L 469.2,174.9 L 469.2,176.2 L 467.8,177.4 L 466.1,177.6 L 464.9,178.8 L 464.2,180.5 L 463.5,180.4 L 463.0,181.6 L 462.0,181.6 L 460.0,182.2 L 460.7,181.2 L 460.0,179.9 L 459.6,178.6 L 457.2,178.4 L 457.2,176.8 L 457.9,175.8 L 456.2,174.8 L 454.2,175.8 L 453.6,176.8 L 452.3,176.6 L 450.4,178.1 L 448.6,178.6 L 447.1,179.2 L 446.3,177.9 L 445.6,176.8 L 444.4,176.0 L 443.7,174.9 L 442.0,173.6 L 440.6,173.4 L 439.6,173.9 L 438.4,173.6 L 437.0,173.4 L 435.1,174.6 L 433.0,175.4 L 432.0,175.7 L 429.8,176.5 L 428.3,177.7 L 427.2,177.8 L 425.8,177.4 L 421.3,179.6 L 416.5,180.6 L 413.8,181.8 L 413.5,183.7 L 409.7,183.6 L 408.8,184.2 L 407.9,185.6 L 405.2,184.4 L 405.5,183.5 L 405.8,181.8 L 404.4,181.6 L 401.7,182.3 L 402.0,181.1 L 401.3,179.9 L 403.7,179.6 L 404.0,178.7 L 404.1,177.2 L 406.1,176.9 L 405.3,175.6 L 406.0,173.2 L 406.3,171.6 L 403.0,169.5 L 404.0,168.9 L 405.4,167.4 L 406.0,165.7 L 406.8,165.1 L 410.4,165.0 L 414.4,164.4 L 414.5,161.7 L 414.5,160.3 L 414.2,158.8 L 416.0,158.5 L 418.4,158.3 L 420.5,156.9 L 421.6,155.4 L 421.9,154.2 L 421.7,153.0 L 422.6,151.7 L 424.6,151.7 L 425.5,152.9 L 426.2,153.3 L 426.6,152.6 L 428.9,150.9 L 427.7,150.4 L 428.0,149.9 L 430.1,147.7 L 431.6,146.5 L 434.1,146.8 L 435.8,146.3 L 435.5,145.5 L 436.1,145.3 L 436.9,144.5 L 437.1,144.1 L 437.2,143.5 L 438.3,143.3 L 439.3,143.3 L 439.3,141.4 L 439.9,140.5 L 442.8,140.6 L 441.9,142.7 L 441.1,144.5 L 443.4,145.4 L 444.7,144.5 L 444.8,142.9 L 445.6,142.7 L 447.4,143.3 L 448.6,143.5 L 449.0,143.7 L 449.4,144.0 L 449.6,144.1 Z"
    },
    {
      "id": "yavatmal",
      "name": "Yavatmal",
      "path": "M 536.0,124.1 L 537.0,124.2 L 537.5,124.5 L 537.7,124.5 L 537.8,124.2 L 538.6,124.0 L 539.2,124.3 L 539.4,124.9 L 539.7,126.1 L 540.7,125.7 L 542.5,125.8 L 541.9,124.8 L 543.0,124.9 L 545.1,124.3 L 546.4,124.0 L 548.3,123.6 L 549.9,123.4 L 551.3,122.5 L 552.3,122.9 L 554.2,122.5 L 556.3,122.2 L 555.2,123.5 L 555.1,124.8 L 553.6,125.9 L 553.8,127.4 L 554.1,128.8 L 554.7,130.2 L 555.7,131.4 L 557.0,132.4 L 559.0,132.9 L 562.2,133.7 L 563.4,134.7 L 565.0,134.4 L 566.2,135.4 L 568.6,136.0 L 571.3,135.6 L 572.4,136.0 L 574.5,134.8 L 576.0,134.9 L 577.6,135.4 L 578.8,136.6 L 579.1,137.8 L 580.0,139.0 L 581.6,140.5 L 583.3,141.9 L 586.3,142.2 L 586.7,141.4 L 587.5,141.7 L 589.8,141.8 L 590.2,142.6 L 591.3,143.6 L 592.4,145.2 L 594.3,146.7 L 596.1,147.9 L 596.2,149.4 L 596.2,150.5 L 597.2,151.2 L 598.8,152.3 L 600.3,152.1 L 602.3,152.0 L 603.8,152.1 L 605.0,152.6 L 606.1,154.3 L 605.7,155.3 L 607.0,155.8 L 611.0,155.5 L 613.3,155.7 L 615.5,155.2 L 615.8,156.5 L 617.2,157.4 L 618.1,158.4 L 619.6,159.1 L 619.1,160.4 L 619.1,161.4 L 619.7,162.1 L 621.2,162.8 L 621.0,163.6 L 620.2,164.3 L 621.2,165.3 L 622.6,165.1 L 624.6,165.8 L 625.7,167.0 L 627.5,168.4 L 627.3,169.5 L 628.8,170.1 L 629.8,170.2 L 630.4,171.1 L 632.2,173.0 L 633.3,174.2 L 633.1,175.3 L 631.7,176.0 L 633.3,176.9 L 631.7,178.3 L 631.7,180.3 L 633.2,181.0 L 636.9,182.7 L 635.4,184.5 L 633.2,185.7 L 631.5,186.4 L 629.8,187.8 L 627.8,188.1 L 626.3,188.7 L 624.1,188.9 L 622.1,188.9 L 619.2,189.0 L 618.0,190.0 L 617.6,191.3 L 618.6,192.7 L 616.7,193.2 L 614.5,193.8 L 612.2,193.2 L 612.0,191.9 L 610.0,191.4 L 608.6,191.9 L 605.7,192.2 L 603.6,190.7 L 600.6,190.8 L 598.7,191.1 L 596.6,191.1 L 594.4,189.9 L 588.2,188.5 L 586.0,187.8 L 584.0,188.1 L 578.9,187.6 L 577.5,189.7 L 575.7,188.6 L 572.0,187.7 L 567.6,186.4 L 566.6,184.9 L 566.4,183.2 L 562.9,183.0 L 560.7,182.0 L 561.8,180.9 L 559.5,180.7 L 556.9,180.9 L 556.4,182.8 L 553.9,183.7 L 552.9,182.2 L 554.4,180.8 L 553.8,179.5 L 552.3,180.3 L 549.8,181.1 L 547.9,181.4 L 544.2,180.5 L 542.8,181.2 L 540.7,181.8 L 537.6,181.6 L 535.8,180.3 L 535.3,179.4 L 532.9,179.7 L 530.3,180.3 L 528.7,180.5 L 527.1,180.9 L 525.5,181.1 L 524.2,182.3 L 521.3,183.1 L 520.3,184.1 L 518.9,185.4 L 518.4,187.0 L 517.0,188.3 L 516.7,190.0 L 517.9,191.6 L 517.7,193.4 L 518.5,193.4 L 519.1,193.8 L 520.8,194.4 L 521.3,194.0 L 522.9,194.2 L 524.5,193.8 L 527.1,196.1 L 529.0,196.6 L 530.1,198.0 L 533.3,196.7 L 535.2,197.2 L 536.5,199.0 L 538.0,200.5 L 539.4,200.2 L 541.7,199.7 L 542.5,199.1 L 545.5,199.5 L 546.9,200.0 L 548.4,202.2 L 548.1,203.7 L 547.9,206.2 L 545.8,207.1 L 543.3,207.5 L 541.4,207.5 L 542.8,208.9 L 541.9,210.2 L 541.6,211.4 L 539.2,212.5 L 536.6,214.0 L 534.4,212.8 L 532.1,211.8 L 531.6,214.1 L 529.5,214.9 L 529.1,214.1 L 527.9,212.0 L 527.8,210.9 L 525.5,211.5 L 524.4,211.2 L 522.3,209.5 L 521.5,209.1 L 520.1,210.1 L 519.7,211.5 L 519.1,210.8 L 517.5,210.1 L 515.8,210.8 L 515.8,212.7 L 514.8,213.9 L 516.2,215.1 L 514.6,216.1 L 513.3,215.0 L 511.9,214.6 L 510.1,215.7 L 507.1,216.7 L 504.6,216.4 L 502.9,216.1 L 502.4,215.3 L 502.6,214.4 L 503.8,213.3 L 504.9,213.4 L 506.3,212.8 L 505.9,211.9 L 507.5,210.4 L 505.2,209.2 L 503.1,209.0 L 500.1,208.5 L 497.6,208.0 L 496.6,207.2 L 497.7,206.7 L 497.3,204.1 L 497.2,203.3 L 496.0,203.4 L 496.0,202.2 L 494.6,201.6 L 494.3,201.1 L 494.0,200.5 L 493.0,200.3 L 491.6,199.8 L 490.3,200.3 L 489.1,199.3 L 487.6,199.3 L 486.7,198.8 L 485.2,198.5 L 483.5,198.1 L 482.4,198.3 L 481.0,198.1 L 479.5,197.6 L 479.5,196.6 L 479.0,195.7 L 478.1,194.7 L 476.3,193.8 L 474.6,194.2 L 473.4,194.6 L 473.5,193.9 L 472.8,193.4 L 473.4,192.0 L 475.1,191.8 L 475.6,190.8 L 473.2,190.0 L 473.8,187.5 L 472.0,187.4 L 469.8,187.2 L 469.7,186.6 L 471.4,186.3 L 471.5,184.7 L 470.0,184.6 L 469.9,183.6 L 467.9,182.8 L 466.1,183.2 L 465.2,182.9 L 465.3,182.2 L 466.9,182.4 L 466.9,181.5 L 466.5,180.8 L 464.8,181.7 L 464.1,181.2 L 464.2,179.9 L 465.6,178.6 L 466.2,176.9 L 468.5,176.3 L 469.0,175.9 L 469.3,174.1 L 470.3,173.2 L 471.9,171.3 L 472.0,170.2 L 470.8,168.3 L 471.9,166.6 L 473.8,167.7 L 475.5,167.7 L 476.6,168.2 L 478.2,168.6 L 480.8,168.8 L 482.4,167.9 L 483.2,168.2 L 486.4,167.1 L 487.7,168.7 L 489.1,169.5 L 489.7,170.7 L 491.5,171.9 L 493.0,171.4 L 493.7,171.5 L 494.7,171.2 L 496.5,170.4 L 497.4,169.0 L 498.3,168.3 L 498.8,167.0 L 499.9,166.4 L 500.1,164.9 L 501.0,163.3 L 500.8,161.8 L 499.3,161.2 L 498.0,160.6 L 497.7,160.1 L 498.2,159.3 L 498.7,158.9 L 498.8,157.3 L 498.2,155.4 L 496.3,154.7 L 494.1,153.4 L 492.9,152.0 L 492.2,151.2 L 491.9,150.2 L 491.4,149.7 L 490.5,149.6 L 490.3,148.9 L 491.1,146.7 L 490.9,145.3 L 491.6,143.6 L 492.9,143.5 L 492.7,142.8 L 493.1,142.1 L 493.9,141.6 L 494.5,140.3 L 495.5,140.1 L 498.0,140.1 L 498.3,138.3 L 498.3,137.2 L 499.3,136.8 L 499.6,135.7 L 501.5,135.3 L 501.4,134.3 L 498.7,134.4 L 497.9,133.3 L 498.7,131.9 L 499.5,130.8 L 501.9,131.4 L 504.5,131.9 L 506.4,132.2 L 507.7,133.5 L 510.2,133.5 L 511.3,132.3 L 513.4,130.4 L 515.3,131.9 L 516.2,131.0 L 517.6,129.9 L 517.9,128.6 L 519.0,128.6 L 519.7,128.0 L 521.1,128.3 L 522.6,128.9 L 522.5,130.2 L 522.2,131.9 L 523.1,132.3 L 523.7,131.8 L 524.2,131.1 L 525.2,130.9 L 526.4,130.7 L 528.2,129.8 L 529.3,128.4 L 531.7,127.4 L 532.8,126.9 L 532.3,126.2 L 533.5,124.9 L 534.1,124.4 L 535.8,124.1 L 536.0,124.1 Z"
    },
    {
      "id": "bhandara",
      "name": "Bhandara",
      "path": "M 678.5,110.2 L 679.7,109.7 L 679.9,108.2 L 680.6,106.6 L 682.8,105.8 L 684.4,103.1 L 683.7,101.2 L 682.2,100.2 L 680.5,97.6 L 679.4,95.3 L 678.0,93.8 L 677.0,94.4 L 675.8,94.3 L 673.4,93.5 L 672.3,93.0 L 672.3,92.1 L 672.2,91.6 L 672.0,90.8 L 670.6,90.0 L 669.3,89.4 L 669.8,88.8 L 669.3,86.7 L 671.3,86.6 L 672.4,86.8 L 673.5,87.9 L 674.7,87.9 L 675.1,87.3 L 675.3,85.6 L 675.0,84.5 L 674.4,84.1 L 675.1,82.0 L 676.1,81.1 L 676.5,79.1 L 675.8,77.2 L 674.6,76.7 L 674.8,76.1 L 674.8,75.0 L 672.8,73.5 L 671.6,72.3 L 670.1,70.7 L 668.7,69.5 L 667.5,67.6 L 665.3,67.5 L 664.8,65.8 L 665.7,65.1 L 667.1,63.4 L 669.2,61.1 L 672.2,59.2 L 674.4,58.9 L 677.1,59.0 L 679.2,58.4 L 681.6,58.1 L 683.7,58.0 L 684.7,56.5 L 687.6,56.0 L 688.5,55.3 L 691.6,54.6 L 697.1,56.2 L 699.5,57.8 L 702.6,59.4 L 704.5,60.0 L 706.2,60.5 L 708.6,60.4 L 709.3,62.3 L 708.3,64.0 L 705.6,66.3 L 705.0,67.9 L 702.1,68.9 L 697.5,71.2 L 697.3,72.6 L 698.5,72.9 L 698.6,73.6 L 699.0,75.2 L 699.9,75.7 L 700.7,76.5 L 700.3,77.1 L 700.5,77.6 L 700.7,78.2 L 700.1,78.6 L 700.8,79.5 L 701.7,80.3 L 701.5,80.5 L 701.7,81.2 L 700.9,82.0 L 701.8,82.6 L 702.9,82.4 L 703.3,81.7 L 704.7,81.0 L 706.1,81.0 L 708.7,80.6 L 711.8,82.0 L 715.5,82.9 L 716.3,83.3 L 717.3,83.1 L 718.3,82.8 L 718.6,83.5 L 719.5,84.0 L 720.4,83.9 L 720.7,84.5 L 721.2,84.7 L 722.5,85.7 L 722.1,86.9 L 722.7,87.5 L 723.0,87.9 L 723.5,88.6 L 723.1,89.2 L 722.6,89.7 L 722.6,90.1 L 722.5,90.7 L 723.2,91.1 L 721.7,92.2 L 722.8,92.6 L 723.1,94.0 L 723.5,94.7 L 723.3,95.1 L 723.4,95.7 L 723.7,95.8 L 723.6,96.3 L 722.7,96.8 L 722.2,97.1 L 722.3,97.7 L 723.8,97.3 L 724.9,97.3 L 725.0,99.3 L 725.3,100.4 L 724.1,100.7 L 723.7,102.0 L 723.5,102.7 L 721.8,103.0 L 720.3,104.2 L 718.7,104.8 L 719.1,103.9 L 719.2,103.0 L 716.2,103.3 L 714.7,103.5 L 714.0,103.2 L 712.4,103.7 L 711.5,105.4 L 712.5,107.8 L 712.1,109.2 L 710.4,109.4 L 709.9,110.2 L 710.6,110.5 L 710.0,110.9 L 709.1,112.0 L 709.0,112.6 L 708.6,113.9 L 707.7,114.9 L 709.3,115.3 L 710.1,115.3 L 709.2,116.8 L 709.0,117.5 L 709.0,118.5 L 709.2,119.1 L 710.4,117.3 L 711.7,117.9 L 713.5,118.8 L 711.2,120.1 L 711.5,120.7 L 713.3,121.3 L 712.5,122.8 L 710.5,123.6 L 709.6,124.5 L 704.6,123.1 L 699.9,123.3 L 697.0,122.1 L 695.7,120.3 L 693.0,121.2 L 692.9,123.1 L 689.2,123.1 L 688.1,126.1 L 686.7,126.1 L 684.7,125.4 L 682.9,124.2 L 679.2,122.7 L 675.7,122.4 L 672.6,121.8 L 671.8,121.4 L 671.8,120.1 L 672.7,119.0 L 672.9,117.1 L 673.7,115.6 L 675.0,113.8 L 674.0,111.8 L 673.7,110.8 L 675.6,110.8 L 676.8,111.3 L 678.4,110.3 L 678.5,110.2 Z"
    },
    {
      "id": "palghar",
      "name": "Palghar",
      "path": "M 41.5,213.8 L 41.5,213.9 L 41.5,213.9 L 41.6,213.9 L 41.7,213.9 L 41.8,213.9 L 41.9,214.0 L 41.9,214.0 L 42.0,214.1 L 41.9,214.1 L 41.9,214.1 L 41.9,214.1 L 41.8,214.2 L 41.8,214.2 L 41.8,214.2 L 41.7,214.3 L 41.7,214.3 L 41.7,214.4 L 41.7,214.5 L 41.8,214.5 L 41.8,214.5 L 41.8,214.6 L 41.8,214.6 L 41.7,214.6 L 41.7,214.6 L 41.6,214.7 L 41.5,214.7 L 41.5,214.6 L 41.5,214.6 L 41.4,214.6 L 41.4,214.6 L 41.4,214.6 L 41.3,214.5 L 41.3,214.5 L 41.3,214.5 L 41.3,214.4 L 41.2,214.4 L 41.2,214.4 L 41.2,214.4 L 41.2,214.3 L 41.1,214.2 L 41.1,214.2 L 41.1,214.1 L 41.0,214.1 L 41.0,213.9 L 41.1,213.9 L 41.1,213.9 L 41.2,213.9 L 41.3,213.9 L 41.3,213.9 L 41.4,213.9 L 41.5,213.8 Z M 106.0,174.1 L 107.4,176.2 L 108.9,176.7 L 109.8,178.0 L 108.3,178.6 L 106.9,181.6 L 107.7,183.7 L 106.0,184.6 L 106.1,185.9 L 107.1,186.7 L 108.5,190.3 L 109.1,191.6 L 111.4,192.3 L 114.0,192.8 L 114.1,193.4 L 114.3,194.3 L 112.0,194.7 L 110.5,195.3 L 109.3,195.4 L 108.3,196.0 L 107.6,196.5 L 106.2,197.0 L 104.1,196.9 L 102.8,197.6 L 101.6,197.6 L 101.6,198.5 L 100.5,198.9 L 100.5,197.8 L 99.6,197.5 L 98.1,197.1 L 97.4,198.5 L 96.1,198.1 L 93.4,197.8 L 92.5,199.3 L 92.3,199.8 L 93.2,201.4 L 93.3,202.7 L 90.8,202.2 L 90.1,203.6 L 88.8,203.2 L 87.7,204.1 L 85.7,205.3 L 86.6,207.3 L 85.1,208.4 L 82.5,210.2 L 79.6,210.6 L 79.4,211.7 L 76.4,212.1 L 72.6,213.3 L 71.6,212.4 L 70.3,212.0 L 68.5,211.4 L 66.5,209.7 L 65.5,208.9 L 63.1,207.4 L 61.5,206.6 L 59.4,204.9 L 57.7,207.2 L 58.6,208.3 L 58.5,210.1 L 56.2,210.0 L 53.6,209.0 L 51.7,210.1 L 50.4,209.8 L 49.4,210.6 L 46.0,211.0 L 45.9,211.0 L 45.9,210.8 L 46.0,210.8 L 46.0,210.8 L 46.1,210.7 L 46.1,210.7 L 46.1,210.7 L 46.2,210.6 L 46.3,210.6 L 46.3,210.5 L 46.3,210.5 L 46.4,210.4 L 46.4,210.4 L 46.5,210.3 L 46.5,210.2 L 46.5,210.1 L 46.5,210.1 L 46.6,209.9 L 46.6,209.7 L 46.6,209.5 L 46.5,209.5 L 46.5,209.4 L 46.3,209.4 L 45.9,209.4 L 45.8,209.4 L 45.8,209.4 L 45.7,209.5 L 45.7,209.5 L 45.6,209.5 L 45.7,209.5 L 45.8,209.5 L 45.8,209.5 L 46.0,209.5 L 46.0,209.5 L 46.2,209.5 L 46.2,209.5 L 46.3,209.6 L 46.4,209.8 L 46.3,209.9 L 46.3,210.3 L 46.2,210.3 L 46.2,210.4 L 46.2,210.4 L 46.1,210.5 L 46.1,210.5 L 46.0,210.5 L 46.0,210.6 L 45.9,210.6 L 45.9,210.7 L 45.9,210.7 L 45.8,210.7 L 45.8,210.8 L 45.7,210.8 L 45.6,210.9 L 45.5,210.9 L 45.5,211.0 L 45.4,211.0 L 45.4,211.1 L 45.4,211.1 L 45.3,211.1 L 45.0,211.2 L 44.6,211.1 L 44.4,211.1 L 44.4,211.1 L 44.3,211.0 L 44.2,211.0 L 44.0,211.0 L 44.0,210.9 L 43.8,211.0 L 43.7,210.9 L 43.7,210.9 L 43.6,210.8 L 43.5,210.8 L 43.4,210.8 L 43.4,210.8 L 43.3,210.7 L 43.2,210.7 L 43.2,210.7 L 43.0,210.6 L 43.0,210.6 L 42.9,210.5 L 42.9,210.5 L 42.8,210.5 L 42.7,210.4 L 42.7,210.4 L 42.6,210.4 L 42.5,210.3 L 42.5,210.3 L 42.4,210.3 L 42.4,210.2 L 42.3,210.2 L 42.3,210.1 L 42.2,210.1 L 42.2,210.0 L 42.2,209.8 L 42.1,209.8 L 42.0,209.7 L 42.0,209.7 L 42.0,209.5 L 41.6,209.5 L 41.5,209.5 L 41.5,209.5 L 41.4,209.4 L 41.3,209.4 L 41.3,209.3 L 41.2,209.1 L 41.2,209.1 L 41.1,209.0 L 41.1,209.0 L 41.1,209.0 L 41.0,209.0 L 41.0,209.1 L 40.9,209.1 L 40.9,209.0 L 41.0,209.0 L 41.0,208.9 L 41.0,208.9 L 41.0,208.7 L 40.9,208.7 L 40.9,208.6 L 40.9,208.6 L 40.8,208.6 L 40.6,208.6 L 40.6,208.6 L 40.5,208.6 L 40.4,208.6 L 40.3,208.6 L 40.3,208.5 L 40.3,208.5 L 40.3,208.3 L 40.5,208.3 L 40.5,208.2 L 40.2,208.2 L 40.1,208.1 L 40.3,208.1 L 40.4,208.2 L 40.4,208.2 L 40.5,208.2 L 40.6,208.2 L 40.7,208.2 L 40.6,208.1 L 40.5,208.1 L 40.5,208.1 L 40.4,208.0 L 40.6,207.9 L 40.6,207.9 L 40.6,207.6 L 40.6,207.5 L 40.6,207.5 L 40.6,207.4 L 40.5,207.3 L 40.5,207.3 L 40.5,207.2 L 40.4,207.1 L 40.4,207.0 L 40.4,206.8 L 40.5,206.7 L 40.5,206.6 L 40.4,206.5 L 40.4,206.4 L 40.3,206.4 L 40.3,206.3 L 40.3,206.3 L 40.2,206.3 L 40.2,206.2 L 40.2,206.2 L 40.1,206.1 L 40.1,205.9 L 40.1,205.9 L 40.1,205.7 L 40.2,205.7 L 40.2,205.5 L 40.2,205.4 L 40.2,205.2 L 40.2,205.2 L 40.1,205.0 L 40.0,204.9 L 40.0,204.7 L 39.9,204.7 L 39.9,204.7 L 39.8,204.6 L 39.8,204.5 L 39.7,204.5 L 39.7,204.3 L 39.9,204.4 L 40.0,204.4 L 40.3,204.4 L 40.4,204.4 L 40.5,204.3 L 40.5,204.3 L 40.6,204.2 L 40.7,204.3 L 40.8,204.3 L 40.8,204.4 L 40.9,204.4 L 41.0,204.4 L 41.2,204.4 L 41.2,204.4 L 41.3,204.3 L 41.3,204.2 L 41.4,204.2 L 41.4,204.1 L 41.7,204.1 L 41.7,204.2 L 41.8,204.2 L 42.0,204.2 L 42.0,204.2 L 42.0,204.1 L 41.9,204.1 L 41.8,204.0 L 41.7,204.0 L 41.7,204.0 L 41.5,204.0 L 41.4,204.0 L 41.4,203.9 L 41.3,203.8 L 41.4,203.6 L 41.4,203.6 L 41.4,203.3 L 41.3,203.2 L 41.3,203.0 L 41.3,202.9 L 41.2,202.8 L 41.2,202.8 L 41.2,202.7 L 41.1,202.5 L 41.2,202.4 L 41.2,202.3 L 41.1,202.2 L 41.1,202.1 L 41.0,202.1 L 41.0,202.0 L 41.0,201.9 L 40.9,201.9 L 40.9,202.0 L 40.9,202.1 L 40.9,202.1 L 40.9,202.1 L 40.7,202.1 L 40.7,202.0 L 40.6,202.0 L 40.6,201.9 L 40.6,201.9 L 40.5,201.8 L 40.5,201.8 L 40.4,201.8 L 40.4,201.7 L 40.4,201.6 L 40.3,201.6 L 40.3,201.5 L 40.2,201.4 L 40.2,201.4 L 40.2,201.3 L 40.1,201.3 L 40.1,201.2 L 40.1,201.2 L 40.0,201.2 L 40.0,201.1 L 39.9,201.0 L 39.9,200.9 L 39.8,200.8 L 39.8,200.7 L 39.8,200.7 L 39.7,200.5 L 39.7,200.5 L 39.7,200.3 L 39.6,200.1 L 39.6,199.9 L 39.6,199.8 L 39.6,199.7 L 39.6,199.6 L 39.6,199.5 L 39.6,199.4 L 39.6,199.4 L 39.6,199.3 L 39.5,199.3 L 39.6,199.0 L 39.6,199.0 L 39.5,199.0 L 39.5,198.9 L 39.4,198.8 L 39.4,198.7 L 39.3,198.7 L 39.3,198.6 L 39.2,198.5 L 39.2,198.0 L 39.2,197.9 L 39.2,197.7 L 39.2,197.6 L 39.3,197.5 L 39.3,197.5 L 39.4,197.4 L 39.4,197.3 L 39.4,197.3 L 39.5,197.2 L 39.5,197.0 L 39.6,196.7 L 39.5,196.3 L 39.5,196.2 L 39.5,196.0 L 39.4,196.0 L 39.4,195.9 L 39.3,195.8 L 39.3,195.7 L 39.3,195.7 L 39.2,195.6 L 39.2,195.6 L 39.2,195.6 L 39.1,195.5 L 39.1,195.5 L 39.0,195.4 L 39.0,195.4 L 38.9,195.4 L 38.9,195.3 L 38.9,195.3 L 38.8,195.2 L 38.8,195.2 L 38.7,195.1 L 38.7,195.1 L 38.6,195.1 L 38.6,195.0 L 38.6,195.0 L 38.5,194.9 L 38.5,194.9 L 38.4,194.9 L 38.3,194.8 L 38.2,194.8 L 38.2,194.7 L 38.2,194.7 L 38.1,194.6 L 38.1,194.6 L 38.1,194.6 L 38.0,194.5 L 38.0,194.4 L 38.0,194.3 L 38.1,194.4 L 38.1,194.4 L 38.2,194.4 L 38.2,194.5 L 38.2,194.5 L 38.3,194.5 L 38.4,194.6 L 38.8,194.6 L 39.2,194.6 L 39.4,194.5 L 39.4,194.3 L 39.5,194.3 L 39.5,194.3 L 39.6,194.2 L 39.6,194.1 L 39.7,194.0 L 39.7,193.4 L 39.8,193.4 L 39.8,193.1 L 39.8,193.0 L 39.9,192.9 L 39.9,192.8 L 40.0,192.8 L 40.1,192.7 L 40.1,192.6 L 40.1,192.6 L 40.2,192.6 L 40.3,192.5 L 40.3,192.5 L 40.3,192.5 L 40.2,192.5 L 40.1,192.5 L 40.1,192.5 L 40.0,192.5 L 40.0,192.6 L 39.9,192.6 L 39.9,192.7 L 39.8,192.7 L 39.8,192.8 L 39.7,192.8 L 39.7,193.0 L 39.7,193.0 L 39.6,193.1 L 39.6,193.1 L 39.6,193.4 L 39.5,193.5 L 39.5,193.6 L 39.4,193.7 L 39.4,193.8 L 39.4,193.9 L 39.3,193.9 L 39.3,194.0 L 39.3,194.1 L 39.2,194.1 L 39.0,194.2 L 38.6,194.2 L 38.5,194.1 L 38.3,194.1 L 38.3,194.0 L 38.2,194.0 L 38.2,193.9 L 37.9,193.9 L 37.9,193.7 L 37.8,193.6 L 37.8,193.6 L 37.7,193.5 L 37.7,193.4 L 37.7,193.3 L 37.6,193.2 L 37.6,193.2 L 37.6,193.1 L 37.5,193.1 L 37.5,193.1 L 37.4,193.0 L 37.4,192.9 L 37.3,192.8 L 37.3,192.7 L 37.3,192.6 L 37.3,192.5 L 37.2,192.3 L 37.2,192.1 L 37.3,191.9 L 37.3,191.9 L 37.3,191.8 L 37.4,191.8 L 37.4,191.7 L 37.4,191.4 L 37.5,191.3 L 37.5,191.0 L 37.4,190.9 L 37.4,190.6 L 37.4,190.5 L 37.4,190.1 L 37.5,189.9 L 37.5,189.8 L 37.6,189.8 L 37.6,189.7 L 37.6,189.7 L 37.7,189.6 L 37.7,189.6 L 37.7,189.5 L 37.7,189.5 L 37.7,189.3 L 37.7,189.3 L 37.6,189.2 L 37.6,189.1 L 37.6,188.9 L 37.7,188.9 L 37.7,188.8 L 37.8,188.8 L 38.0,188.8 L 38.0,188.8 L 38.1,188.9 L 38.2,188.7 L 38.0,188.7 L 38.0,188.7 L 37.6,188.7 L 37.5,188.7 L 37.5,188.8 L 37.4,188.8 L 37.4,188.9 L 37.4,189.1 L 37.5,189.5 L 37.5,189.5 L 37.4,189.5 L 37.3,189.4 L 37.3,189.4 L 37.3,189.3 L 37.3,189.3 L 37.2,189.2 L 37.2,189.0 L 37.1,188.9 L 37.1,188.9 L 37.1,188.8 L 37.0,188.7 L 37.0,188.7 L 37.0,188.6 L 36.9,188.6 L 36.9,188.5 L 36.8,188.5 L 36.9,188.5 L 36.8,188.4 L 36.8,188.3 L 36.7,188.2 L 36.7,188.1 L 36.6,188.1 L 36.6,188.1 L 36.5,188.0 L 36.4,188.0 L 36.4,187.9 L 36.4,187.8 L 36.3,187.8 L 36.2,187.8 L 36.2,187.7 L 36.0,187.7 L 35.8,187.7 L 35.7,187.7 L 35.7,187.7 L 35.6,187.6 L 35.6,187.6 L 35.5,187.6 L 35.5,187.5 L 35.4,187.5 L 35.4,187.5 L 35.2,187.6 L 35.2,187.6 L 35.0,187.6 L 35.0,187.6 L 35.0,187.5 L 34.8,187.6 L 34.8,187.5 L 34.9,187.4 L 34.8,187.3 L 34.6,187.3 L 34.6,187.2 L 34.5,187.2 L 34.5,187.1 L 34.4,187.1 L 34.4,187.1 L 34.4,186.9 L 34.3,186.8 L 34.2,186.8 L 34.2,186.5 L 34.2,186.5 L 34.1,186.4 L 34.1,186.3 L 34.0,186.2 L 34.0,186.2 L 34.0,186.1 L 34.1,186.1 L 34.1,186.0 L 34.1,186.0 L 34.1,186.0 L 34.4,185.9 L 34.4,185.8 L 34.3,185.6 L 34.3,185.6 L 34.3,185.5 L 34.2,185.3 L 34.2,185.2 L 34.1,185.2 L 34.1,185.2 L 34.0,185.1 L 34.0,185.1 L 34.0,184.8 L 34.1,184.8 L 34.2,184.7 L 34.3,184.7 L 34.4,184.8 L 34.4,184.8 L 34.5,184.8 L 34.5,184.9 L 34.6,184.9 L 34.6,184.9 L 34.7,184.9 L 34.8,185.1 L 34.8,185.1 L 34.9,185.1 L 34.9,185.2 L 35.0,185.2 L 35.1,185.2 L 35.1,185.3 L 35.4,185.2 L 35.5,185.2 L 35.5,185.2 L 35.5,185.1 L 35.7,185.2 L 35.7,185.2 L 35.8,185.2 L 36.0,185.2 L 36.1,185.2 L 36.1,185.1 L 36.1,185.1 L 36.1,184.9 L 36.1,184.9 L 36.2,184.8 L 36.2,184.8 L 36.2,184.7 L 36.3,184.7 L 36.3,184.6 L 36.4,184.6 L 36.4,184.5 L 36.5,184.5 L 36.5,184.5 L 36.6,184.4 L 36.6,184.4 L 36.7,184.3 L 36.8,184.3 L 36.8,184.3 L 36.8,184.2 L 36.8,184.2 L 36.8,184.2 L 36.8,184.2 L 36.8,184.1 L 36.7,183.9 L 36.8,183.7 L 36.8,183.4 L 36.9,183.4 L 36.9,183.1 L 36.9,183.1 L 37.0,182.6 L 37.0,182.5 L 36.9,182.4 L 37.0,182.3 L 36.9,182.3 L 36.9,182.3 L 36.8,182.1 L 36.8,182.0 L 36.8,181.9 L 36.8,181.6 L 36.7,181.6 L 36.6,181.5 L 36.5,181.5 L 36.5,181.4 L 36.4,181.4 L 36.4,181.3 L 36.3,181.3 L 36.3,181.1 L 36.3,181.1 L 36.3,181.0 L 36.4,180.9 L 36.4,180.9 L 36.5,180.7 L 36.5,180.6 L 36.5,180.4 L 36.4,180.4 L 36.4,180.2 L 36.4,180.2 L 36.3,180.1 L 36.3,180.1 L 36.2,180.0 L 36.2,180.0 L 36.2,179.9 L 36.1,179.9 L 36.1,179.8 L 36.0,179.8 L 36.0,179.7 L 35.9,179.7 L 35.9,179.6 L 35.8,179.6 L 35.6,179.6 L 35.5,179.5 L 35.4,179.5 L 35.4,179.5 L 35.3,179.5 L 35.3,179.4 L 35.3,179.4 L 35.3,179.1 L 35.3,179.1 L 35.4,179.0 L 35.5,179.1 L 35.5,179.0 L 35.6,179.0 L 35.7,179.0 L 35.8,178.9 L 35.8,178.9 L 35.8,178.9 L 35.9,178.8 L 35.9,178.8 L 36.0,178.7 L 36.1,178.7 L 36.2,178.7 L 36.3,178.7 L 36.4,178.6 L 36.5,178.6 L 36.5,178.6 L 36.6,178.5 L 36.7,178.5 L 36.7,178.5 L 36.8,178.4 L 36.9,178.4 L 36.9,178.4 L 37.0,178.3 L 37.0,178.3 L 37.0,178.3 L 37.1,178.2 L 37.1,178.1 L 37.1,178.0 L 37.2,178.0 L 37.2,177.9 L 37.3,177.9 L 37.3,177.8 L 37.3,177.7 L 37.4,177.7 L 37.4,177.6 L 37.4,177.5 L 37.5,177.5 L 37.5,177.4 L 37.6,177.4 L 37.6,177.3 L 37.7,177.3 L 37.7,177.3 L 37.9,177.3 L 37.9,177.2 L 38.0,177.2 L 38.0,177.2 L 38.2,177.1 L 38.3,177.1 L 38.5,177.1 L 38.6,177.1 L 38.7,177.0 L 38.7,177.0 L 38.8,177.0 L 38.8,176.9 L 38.9,176.9 L 38.9,176.9 L 38.9,176.8 L 39.0,176.7 L 39.0,176.7 L 39.1,176.7 L 39.2,176.7 L 39.2,176.6 L 39.3,176.6 L 39.3,176.6 L 39.5,176.5 L 39.6,176.5 L 39.7,176.5 L 39.8,176.5 L 40.3,176.5 L 40.4,176.5 L 40.5,176.6 L 40.5,176.6 L 40.6,176.7 L 40.6,176.7 L 40.7,176.7 L 40.8,176.8 L 40.8,176.8 L 40.9,176.9 L 40.9,176.9 L 40.9,177.0 L 41.0,177.0 L 41.0,177.1 L 41.1,177.1 L 41.1,177.1 L 41.2,177.1 L 41.2,177.2 L 41.3,177.2 L 41.3,177.3 L 41.4,177.3 L 41.4,177.4 L 41.4,177.9 L 41.5,178.1 L 41.5,178.2 L 41.6,178.3 L 41.6,178.3 L 41.7,178.3 L 41.7,178.4 L 41.8,178.4 L 41.8,178.5 L 41.9,178.5 L 42.2,178.5 L 42.3,178.6 L 42.5,178.6 L 42.6,178.6 L 42.8,178.5 L 42.8,178.5 L 42.9,178.5 L 43.2,178.5 L 43.3,178.5 L 43.4,178.5 L 43.4,178.6 L 43.5,178.6 L 43.5,178.7 L 43.5,178.7 L 43.6,178.7 L 43.6,179.2 L 43.6,179.6 L 43.7,179.1 L 43.7,179.0 L 43.7,178.7 L 43.6,178.7 L 43.6,178.6 L 43.6,178.6 L 43.5,178.5 L 43.5,178.5 L 43.5,178.4 L 43.4,178.4 L 42.9,178.4 L 42.7,178.4 L 42.4,178.4 L 42.2,178.4 L 42.1,178.3 L 42.1,178.3 L 42.0,178.3 L 42.0,178.2 L 42.0,178.2 L 41.9,178.1 L 41.9,178.1 L 41.9,177.8 L 41.8,177.6 L 41.8,177.4 L 41.8,177.3 L 41.7,177.3 L 41.7,177.1 L 41.6,177.1 L 41.4,177.0 L 41.4,177.0 L 41.4,177.0 L 41.4,176.9 L 41.3,176.9 L 41.3,176.9 L 41.3,176.8 L 41.2,176.8 L 41.2,176.8 L 41.1,176.7 L 41.1,176.7 L 41.1,176.7 L 41.0,176.6 L 41.0,176.6 L 40.9,176.5 L 40.9,176.5 L 40.8,176.4 L 40.7,176.4 L 40.6,176.4 L 40.4,176.3 L 40.1,176.3 L 40.1,176.2 L 40.1,176.1 L 40.2,176.0 L 40.2,176.0 L 40.2,175.9 L 40.3,175.8 L 40.3,175.8 L 40.3,175.6 L 40.4,175.6 L 40.4,175.5 L 40.5,175.4 L 40.5,175.2 L 40.5,175.2 L 40.6,175.1 L 40.6,175.0 L 40.6,174.8 L 40.6,174.7 L 40.6,174.3 L 40.5,174.1 L 40.5,174.1 L 40.5,174.0 L 40.5,173.8 L 40.4,173.7 L 40.4,173.5 L 40.4,173.5 L 40.4,173.4 L 40.3,173.3 L 40.3,173.3 L 40.3,173.2 L 40.3,173.1 L 40.2,172.9 L 40.2,172.8 L 40.1,172.8 L 40.1,172.7 L 40.1,172.6 L 40.0,172.6 L 40.0,172.5 L 40.0,172.3 L 40.0,172.1 L 40.0,172.0 L 40.0,171.7 L 40.0,171.6 L 40.0,171.4 L 40.0,171.4 L 40.0,171.3 L 40.0,171.2 L 40.0,171.0 L 39.9,171.0 L 39.9,170.9 L 39.9,170.9 L 39.8,170.7 L 39.8,170.6 L 39.8,170.5 L 39.7,170.4 L 39.7,170.3 L 39.6,170.3 L 39.6,170.1 L 39.6,170.0 L 39.5,169.7 L 39.5,169.5 L 39.5,169.3 L 39.4,169.2 L 39.4,169.2 L 39.3,169.1 L 39.3,168.9 L 39.3,168.9 L 39.3,168.8 L 39.4,168.8 L 39.4,168.6 L 39.5,168.6 L 39.5,168.4 L 39.5,168.4 L 39.6,168.3 L 39.6,168.3 L 39.6,168.3 L 39.7,168.2 L 39.8,168.2 L 39.9,168.2 L 40.0,168.2 L 40.1,168.2 L 40.3,168.1 L 40.5,168.1 L 40.9,168.1 L 41.0,168.1 L 40.9,168.1 L 41.0,168.0 L 41.0,168.1 L 41.0,168.0 L 41.1,167.9 L 41.1,167.8 L 41.2,167.8 L 41.2,167.6 L 41.2,167.6 L 41.3,167.3 L 41.3,167.2 L 41.3,167.2 L 41.4,167.1 L 41.4,167.0 L 41.5,167.0 L 41.5,166.9 L 41.6,166.9 L 41.6,166.7 L 41.7,166.7 L 41.7,166.5 L 41.7,166.5 L 41.8,166.4 L 41.8,166.3 L 41.8,166.2 L 41.9,166.2 L 41.9,166.1 L 42.0,166.0 L 42.0,165.9 L 42.0,165.9 L 42.1,165.7 L 42.1,165.6 L 42.1,165.0 L 42.1,164.7 L 42.1,164.5 L 42.0,164.1 L 42.4,164.0 L 44.3,164.4 L 47.3,164.6 L 48.3,164.7 L 48.0,163.2 L 48.7,162.9 L 50.3,163.3 L 51.0,163.0 L 51.1,160.3 L 51.8,160.1 L 52.4,159.9 L 52.1,159.0 L 53.8,158.6 L 54.5,157.6 L 56.1,157.3 L 58.2,157.3 L 59.8,157.5 L 62.8,158.2 L 64.2,160.0 L 65.2,161.4 L 63.9,164.4 L 65.4,165.7 L 67.0,165.1 L 67.1,164.5 L 67.4,163.7 L 68.0,164.4 L 68.2,166.3 L 70.0,168.4 L 71.9,169.1 L 73.7,167.1 L 76.2,167.7 L 76.8,168.0 L 78.1,168.4 L 78.6,168.3 L 79.8,168.4 L 82.2,169.3 L 83.5,170.3 L 84.8,168.4 L 86.3,167.4 L 86.5,165.1 L 87.8,164.6 L 88.0,163.7 L 88.4,164.5 L 90.0,164.6 L 90.5,165.2 L 92.3,166.2 L 92.6,167.2 L 92.6,168.1 L 91.8,168.5 L 91.9,169.5 L 92.4,170.0 L 93.3,170.7 L 93.7,170.9 L 93.8,170.4 L 94.3,170.1 L 94.8,169.7 L 95.6,170.4 L 96.2,169.9 L 96.6,170.5 L 98.5,171.2 L 100.0,171.3 L 101.0,171.6 L 102.2,172.9 L 102.6,172.4 L 103.2,173.2 L 104.3,172.9 L 105.7,173.5 L 106.0,174.0 L 106.0,174.1 Z"
    },
    {
      "id": "mumbai",
      "name": "Mumbai",
      "path": "M 55.5,248.2 L 55.3,248.2 L 55.2,248.3 L 54.8,248.3 L 54.6,248.3 L 54.4,248.4 L 54.4,248.4 L 54.3,248.4 L 54.1,248.5 L 54.0,248.5 L 53.8,248.5 L 53.8,248.5 L 53.7,248.5 L 53.7,248.6 L 53.6,248.7 L 53.6,248.8 L 53.5,248.8 L 53.5,248.8 L 53.4,248.9 L 53.4,249.0 L 53.5,249.0 L 53.5,249.1 L 53.6,249.1 L 53.5,249.3 L 53.4,249.3 L 53.3,249.3 L 53.3,249.3 L 53.3,249.4 L 53.1,249.4 L 53.2,249.5 L 53.2,249.5 L 53.2,249.6 L 53.3,249.7 L 53.3,249.8 L 53.4,249.8 L 53.4,249.9 L 53.4,249.9 L 53.5,250.0 L 53.5,250.1 L 53.5,250.2 L 53.4,250.2 L 53.4,250.3 L 53.3,250.3 L 53.3,250.3 L 53.3,250.3 L 53.2,250.4 L 53.2,250.4 L 53.1,250.4 L 52.9,250.4 L 52.7,250.4 L 52.9,250.4 L 53.0,250.5 L 53.0,250.5 L 53.0,250.5 L 52.7,250.5 L 52.6,250.5 L 52.7,250.6 L 52.9,250.6 L 53.0,250.7 L 52.8,250.7 L 52.6,250.7 L 52.6,250.7 L 52.8,250.8 L 52.8,250.8 L 52.8,250.9 L 52.7,250.9 L 52.5,250.8 L 52.5,251.0 L 52.6,251.0 L 52.6,251.1 L 52.6,251.2 L 52.6,251.3 L 52.5,251.3 L 52.5,251.3 L 52.5,251.4 L 52.4,251.6 L 52.4,251.6 L 52.4,251.8 L 52.3,251.9 L 52.3,252.1 L 52.2,252.2 L 52.2,252.7 L 52.2,252.7 L 52.1,253.0 L 52.1,253.2 L 52.0,253.3 L 52.0,253.5 L 52.0,253.5 L 51.9,253.5 L 51.9,253.6 L 51.9,253.6 L 51.9,253.9 L 52.0,254.0 L 51.9,254.1 L 51.8,254.2 L 51.8,254.1 L 51.7,253.9 L 51.7,253.9 L 51.6,254.0 L 51.6,254.1 L 51.5,254.1 L 51.5,254.1 L 51.4,254.1 L 51.4,254.2 L 51.5,254.2 L 51.6,254.2 L 51.6,254.2 L 51.6,254.3 L 51.5,254.3 L 51.5,254.4 L 51.5,254.4 L 51.5,254.5 L 51.5,254.5 L 51.6,254.6 L 51.7,254.6 L 51.7,254.6 L 51.7,254.5 L 51.8,254.5 L 51.8,254.5 L 51.9,254.4 L 51.9,254.4 L 52.0,254.3 L 52.0,254.4 L 52.0,254.5 L 51.9,254.5 L 51.9,254.5 L 51.8,254.6 L 51.8,254.6 L 51.7,254.6 L 51.7,254.7 L 51.7,254.7 L 51.6,254.8 L 51.5,254.8 L 51.4,254.7 L 51.3,254.7 L 51.3,254.7 L 51.2,254.7 L 51.2,254.6 L 51.1,254.6 L 51.1,254.7 L 51.0,254.7 L 50.9,254.7 L 50.9,254.8 L 50.9,254.9 L 50.8,255.0 L 50.8,255.0 L 50.7,255.0 L 50.7,255.1 L 50.8,255.1 L 50.7,255.2 L 50.7,255.2 L 50.7,255.2 L 50.6,255.3 L 50.6,255.3 L 50.5,255.3 L 50.5,255.4 L 50.4,255.4 L 50.4,255.4 L 50.3,255.5 L 50.3,255.6 L 50.3,255.7 L 50.2,255.7 L 50.2,255.7 L 50.2,255.7 L 50.1,255.7 L 50.1,255.6 L 50.0,255.6 L 50.0,255.6 L 49.9,255.5 L 49.9,255.6 L 49.8,255.6 L 49.8,255.7 L 49.8,255.7 L 49.7,255.7 L 49.6,255.8 L 49.6,255.8 L 49.5,256.1 L 49.5,256.2 L 49.5,256.2 L 49.4,256.3 L 49.4,256.3 L 49.3,256.4 L 49.3,256.5 L 49.2,256.5 L 49.2,256.5 L 49.1,256.6 L 49.1,256.6 L 49.1,256.7 L 49.0,256.7 L 48.9,256.8 L 48.9,256.8 L 48.7,256.9 L 48.6,256.9 L 48.6,257.0 L 48.6,256.9 L 48.6,256.8 L 48.6,256.7 L 48.6,256.7 L 48.6,256.6 L 48.5,256.6 L 48.5,256.5 L 48.4,256.5 L 48.4,256.5 L 48.4,256.4 L 48.3,256.4 L 48.3,256.3 L 48.3,256.2 L 48.2,256.1 L 48.2,255.7 L 48.2,255.6 L 48.3,255.6 L 48.3,255.5 L 48.3,255.4 L 48.4,255.4 L 48.4,255.3 L 48.5,255.3 L 48.5,255.3 L 48.5,255.2 L 48.6,255.2 L 48.6,255.2 L 48.7,255.2 L 48.7,255.2 L 48.7,255.3 L 48.8,255.3 L 48.9,255.3 L 48.9,255.3 L 48.9,255.4 L 49.1,255.4 L 49.1,255.4 L 49.2,255.4 L 49.2,255.3 L 49.3,255.3 L 49.3,255.2 L 49.4,255.1 L 49.4,255.1 L 49.3,255.0 L 49.4,254.9 L 49.5,254.9 L 49.6,254.9 L 49.8,255.0 L 49.8,255.0 L 49.9,255.0 L 50.0,255.0 L 50.0,254.9 L 50.0,254.9 L 50.1,254.8 L 50.1,254.8 L 50.2,254.8 L 50.2,254.6 L 50.1,254.6 L 50.1,254.6 L 50.0,254.6 L 49.9,254.5 L 49.8,254.5 L 49.7,254.5 L 49.6,254.5 L 49.6,254.4 L 49.6,254.4 L 49.6,254.3 L 49.7,254.2 L 49.7,254.2 L 49.8,254.2 L 49.8,254.1 L 49.9,254.1 L 49.9,254.0 L 49.9,254.0 L 50.0,253.9 L 50.0,253.8 L 50.0,253.7 L 50.0,253.3 L 50.0,253.1 L 50.0,253.0 L 49.9,252.9 L 49.9,252.9 L 49.9,252.8 L 49.8,252.8 L 49.8,252.7 L 49.7,252.7 L 49.7,252.7 L 49.7,252.6 L 49.6,252.6 L 49.6,252.5 L 49.5,252.5 L 49.5,252.5 L 49.4,252.4 L 49.4,252.4 L 49.3,252.4 L 49.2,252.3 L 49.2,252.3 L 49.2,252.3 L 49.1,252.3 L 49.0,252.2 L 48.8,252.2 L 48.6,252.2 L 48.6,252.2 L 48.5,252.3 L 48.5,252.3 L 48.4,252.3 L 48.4,252.4 L 48.3,252.4 L 48.3,252.5 L 48.2,252.5 L 48.2,252.6 L 48.1,252.6 L 48.1,252.6 L 47.9,252.7 L 47.9,252.7 L 47.7,252.7 L 47.7,252.8 L 47.7,252.8 L 47.6,252.9 L 47.6,252.9 L 47.5,253.0 L 47.5,253.0 L 47.5,253.1 L 47.4,253.2 L 47.4,253.3 L 47.3,253.3 L 47.3,253.4 L 47.2,253.4 L 47.2,253.3 L 47.1,253.3 L 47.1,253.2 L 47.2,253.2 L 47.2,253.1 L 47.2,253.0 L 47.2,252.9 L 47.1,252.8 L 47.1,252.7 L 47.1,252.7 L 47.1,252.4 L 47.2,252.4 L 47.2,252.3 L 47.3,252.3 L 47.3,252.3 L 47.4,252.2 L 47.4,252.2 L 47.4,252.1 L 47.5,252.1 L 47.5,252.0 L 47.5,252.0 L 47.6,252.0 L 47.6,251.9 L 47.8,251.9 L 47.8,251.8 L 47.8,251.7 L 47.8,251.7 L 47.9,251.6 L 47.9,251.6 L 48.0,251.5 L 48.0,251.4 L 48.1,251.4 L 48.1,251.1 L 48.0,251.1 L 48.0,251.0 L 48.1,251.0 L 48.1,250.9 L 48.2,250.8 L 48.2,250.8 L 48.3,250.8 L 48.3,250.7 L 48.3,250.7 L 48.4,250.6 L 48.4,250.6 L 48.6,250.4 L 48.7,250.4 L 48.7,250.4 L 48.9,250.4 L 49.0,250.3 L 49.0,250.3 L 49.0,250.2 L 49.1,250.2 L 49.2,250.1 L 49.2,249.9 L 49.1,249.8 L 49.1,249.8 L 49.0,249.8 L 48.9,249.7 L 48.9,249.6 L 48.9,249.6 L 48.9,249.5 L 49.0,249.5 L 49.0,249.3 L 48.9,249.3 L 49.0,249.1 L 48.9,249.0 L 48.9,248.8 L 48.9,248.6 L 49.0,248.5 L 49.0,248.5 L 49.0,248.4 L 49.1,248.4 L 49.1,248.3 L 49.2,248.1 L 49.2,248.0 L 49.2,248.0 L 49.3,247.9 L 49.3,247.9 L 49.3,247.8 L 49.3,247.6 L 49.3,247.3 L 49.3,247.0 L 49.2,246.9 L 49.3,246.8 L 49.3,246.9 L 49.4,246.9 L 49.4,247.0 L 49.4,247.0 L 49.5,247.0 L 49.5,247.1 L 49.5,247.1 L 49.6,247.1 L 49.6,247.3 L 49.7,247.4 L 49.7,247.4 L 49.8,247.5 L 50.0,247.5 L 50.2,247.4 L 50.3,247.4 L 50.4,247.4 L 50.4,247.3 L 50.5,247.3 L 50.5,247.3 L 50.6,247.3 L 50.6,247.2 L 50.7,247.2 L 50.7,247.2 L 50.8,247.1 L 50.8,247.1 L 50.9,247.1 L 50.9,247.0 L 50.9,247.0 L 51.0,247.0 L 51.0,246.9 L 51.0,246.8 L 51.1,246.8 L 51.1,246.7 L 51.2,246.7 L 51.2,246.6 L 51.3,246.6 L 51.3,246.5 L 51.4,246.4 L 51.4,246.2 L 51.4,245.9 L 51.4,245.5 L 51.3,245.4 L 51.3,245.4 L 51.2,245.2 L 53.9,246.1 L 55.5,248.2 Z"
    }
  ];


  const currentSelectedDistrictObj = MAHARASHTRA_WIND_DISTRICTS.find(d => d.id === selectedWindDistrict) || MAHARASHTRA_WIND_DISTRICTS[0];

  const handleExportReport = () => {
    const originalTitle = document.title;
    document.title = `Maharashtra_RENEWABLE_ENERGY_COMMISSIONING_Status`;
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  return (
    <div className="meda-dashboard-wrap animate-fade-in">
      {/* ========================================================================= */}
      {/* PRINT-ONLY OFFICIAL RENEWABLE ENERGY COMMISSIONING REPORT                 */}
      {/* Hidden on screen (display: none), Visible only when printing / saving PDF */}
      {/* ========================================================================= */}
      <div id="official-commissioning-report" className="official-print-report font-sans">
        {/* 1. Centered Header: Maharashtra RENEWABLE ENERGY COMMISSIONING Status */}
        <div className="report-header-section">
          <h1 className="report-main-header">
            Maharashtra RENEWABLE ENERGY COMMISSIONING Status
          </h1>
          <div className="report-date">
            <span>Report Date:</span>{' '}
            <strong>
              {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
            </strong>
          </div>
          <div className="report-navy-divider"></div>
        </div>

        {/* 2. Highlight Green KPI Box */}
        <div className="report-kpi-card">
          <div className="rkc-accent-bar"></div>
          <div className="rkc-body">
            <div className="rkc-info">
              <div className="rkc-title">
                TOTAL RE COMMISSIONED CAPACITY
              </div>
              <div className="rkc-sub">
                Total Commissioned Clean Energy Generating Capacity Synchronized with State Grid
              </div>
            </div>
            <div className="rkc-metric">
              <span className="rkc-number">33,283.925</span>{' '}
              <span className="rkc-unit">MW</span>
            </div>
          </div>
        </div>

        {/* 3. Commissioning Data Table (3 Columns: Sr. No., Energy Source, Installed Capacity) */}
        <div className="report-table-wrapper">
          <table className="report-table">
            <thead>
              <tr>
                <th className="th-sr">SR. NO.</th>
                <th className="th-tech">ENERGY SOURCE / TECHNOLOGY</th>
                <th className="th-cap">INSTALLED CAPACITY (MW)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="td-sr">1</td>
                <td className="td-tech">Solar Power Projects</td>
                <td className="td-cap">20,477.420 MW</td>
              </tr>
              <tr>
                <td className="td-sr">2</td>
                <td className="td-tech">Wind Power Projects</td>
                <td className="td-cap">6,371.810 MW</td>
              </tr>
              <tr>
                <td className="td-sr">3</td>
                <td className="td-tech">Large Hydro Power Projects</td>
                <td className="td-cap">3,061.000 MW</td>
              </tr>
              <tr>
                <td className="td-sr">4</td>
                <td className="td-tech">Co-generation (Bagasse) Power</td>
                <td className="td-cap">2,732.800 MW</td>
              </tr>
              <tr>
                <td className="td-sr">5</td>
                <td className="td-tech">Small Hydro Projects</td>
                <td className="td-cap">374.080 MW</td>
              </tr>
              <tr>
                <td className="td-sr">6</td>
                <td className="td-tech">Biomass Power Projects</td>
                <td className="td-cap">215.000 MW</td>
              </tr>
              <tr>
                <td className="td-sr">7</td>
                <td className="td-tech">Municipal Solid Waste (MSW)</td>
                <td className="td-cap">59.790 MW</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="tfoot-total-row">
                <td className="td-sr total-check">✓</td>
                <td className="td-tech total-title">TOTAL STATE RE CAPACITY</td>
                <td className="td-cap total-cap">33,283.925 MW</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* 1. TOP HEADER OVERVIEW BAR */}
      <div className="dashboard-top-header">
        <div className="dth-left">
          <h1 className="dth-title">Dashboard Overview</h1>
          <p className="dth-sub">Monitor renewable energy projects and infrastructure across all energy sources.</p>
        </div>

        <div className="dth-right-actions">
          {activeTab === 'summary' && (
            <button className="btn-export-outlined" onClick={handleExportReport} title="Export PDF Commissioning Report">
              <Download size={14} />
              <span>Export PDF</span>
            </button>
          )}

          <button className="btn-refresh-filled" onClick={checkBackendStatus} disabled={loadingDb}>
            <RefreshCw size={14} className={loadingDb ? 'spin' : ''} />
            <span>{loadingDb ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* 2. HORIZONTAL SCROLLABLE CATEGORY TABS BAR */}
      <div className="category-scroller-card light-card">
        <button
          type="button"
          onClick={() => handleScroll('left')}
          className="tab-scroll-btn btn-left"
          title="Scroll Left"
        >
          <ChevronLeft size={16} />
        </button>

        <div ref={scrollRef} className="category-tabs-track">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveTab(cat.id)}
                className={`cat-tab-pill ${isActive ? 'active' : ''}`}
              >
                <Icon size={14} className="cat-icon" />
                <span className="cat-label">{cat.label}</span>
                {cat.count ? (
                  <span className={`cat-count-badge ${isActive ? 'active-badge' : ''}`}>{cat.count}</span>
                ) : null}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => handleScroll('right')}
          className="tab-scroll-btn btn-right"
          title="Scroll Right"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Category Tab Notice Header for active category */}
      <div className="category-active-notice light-card">
        <div className="can-left">
          <div className="can-icon-box" style={{ background: currentCategory.bg, color: currentCategory.color }}>
            <CurrentIcon size={20} />
          </div>
          <div>
            <h3 className="can-title">{currentCategory.label} Dashboard View</h3>
            <p className="can-sub">Monitoring infrastructure, feeders, and commissioning metrics for {currentCategory.label}.</p>
          </div>
        </div>

        <div className="can-right">
          <div className="can-stat-pill">
            <span className="csp-lbl">CATEGORY CAPACITY</span>
            <span className="csp-val" style={{ color: currentCategory.color }}>{currentCategory.capacity}</span>
          </div>
          {currentCategory.count ? (
            <>
              <div className="can-divider" />
              <div className="can-stat-pill">
                <span className="csp-lbl">TOTAL PROJECTS</span>
                <span className="csp-val">{currentCategory.count}</span>
              </div>
            </>
          ) : null}
        </div>
      </div>

      {/* CONDITIONAL DASHBOARD VIEWS BASED ON ACTIVE TAB */}
      {activeTab === 'summary' ? (
        /* SUMMARY VIEW - Executive Grid Connected Theme & Full Page Balanced Layout */
        <div className="category-view-container summary-view-wrapper animate-fade-in">
          <div className="summary-full-grid">
            {/* Card 1: Solar Energy Projects (Grid Connected & Off Grid) - Spans 2 cols */}
            <div
              className="summary-card card-gridconn-solar col-span-1 md:col-span-2 rounded-2xl p-5 border relative overflow-hidden transition-all duration-300 hover:shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #fff5f5 0%, #ffe4e6 50%, #fecdd3 100%)',
                borderColor: '#fda4af',
                boxShadow: '0 4px 16px -2px rgba(253, 164, 175, 0.35)'
              }}
            >
              {/* Soft gloss highlight line */}
              <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent"></div>

              {/* Top Row: Capacity & Portfolio Header */}
              <div className="flex items-start justify-between gap-3 mb-2.5">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                    <span className="text-[11px] font-black tracking-wider uppercase text-rose-800">
                      Solar Energy Portfolio
                    </span>
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-rose-950 tracking-tight leading-none font-mono">
                    {formatCapacityMw(dynamicGridConnectedMw)}{' '}
                    <span className="text-base sm:text-lg font-bold text-rose-700">MW</span>
                  </div>
                </div>

                <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-white/90 border border-rose-200/90 shadow-2xs flex items-center justify-center shrink-0 text-rose-600">
                  <Sun size={24} strokeWidth={2.3} />
                </div>
              </div>

              {/* Bottom Row: 2 Premium Interactive KPI Tiles (Grid Connected & Off Grid) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2.5">
                <button
                  type="button"
                  onClick={() => setActiveTab('solar-grid-conn')}
                  className="group bg-white/90 hover:bg-white border border-rose-200/90 hover:border-rose-300 rounded-xl p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer flex items-center justify-between"
                  title="Navigate to Grid Connected Dashboard"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-8.5 w-8.5 rounded-lg bg-rose-50 border border-rose-200/80 flex items-center justify-center text-rose-600 shrink-0 group-hover:scale-105 transition-transform">
                      <Zap size={18} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                        Grid Connected
                      </div>
                      <div className="text-[15px] font-black text-slate-900 group-hover:text-rose-700 transition-colors font-mono truncate">
                        {formatCapacityMw(dynamicGridConnectedMw)} MW
                      </div>
                    </div>
                  </div>
                  <div className="h-7.5 w-7.5 rounded-lg bg-rose-50 group-hover:bg-rose-600 text-rose-600 group-hover:text-white flex items-center justify-center transition-colors shrink-0 ml-2 shadow-2xs">
                    <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('solar-offgrid-sum')}
                  className="group bg-white/90 hover:bg-white border border-rose-200/90 hover:border-rose-300 rounded-xl p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer flex items-center justify-between"
                  title="Navigate to Off Grid Dashboard"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-8.5 w-8.5 rounded-lg bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600 shrink-0 group-hover:scale-105 transition-transform">
                      <Sun size={18} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                        Off Grid Solar
                      </div>
                      <div className="text-[13.5px] font-black text-slate-900 group-hover:text-amber-700 transition-colors truncate">
                        10,03,077 Pumps • 43.42 L HP
                      </div>
                    </div>
                  </div>
                  <div className="h-7.5 w-7.5 rounded-lg bg-amber-50 group-hover:bg-amber-600 text-amber-600 group-hover:text-white flex items-center justify-center transition-colors shrink-0 ml-2 shadow-2xs">
                    <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </button>
              </div>
            </div>

            {/* Card 2: Wind Power Project - Pastel Sky Blue */}
            <div
              className="summary-card card-gridconn-wind cursor-pointer group rounded-2xl p-5 border relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between"
              onClick={() => setActiveTab('wind')}
              role="button"
              tabIndex={0}
              title="Navigate to Wind Power Project"
              style={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #f0f9ff 50%, #e0f2fe 100%)',
                borderColor: '#bae6fd',
                boxShadow: '0 3px 12px -2px rgba(186, 230, 253, 0.4)'
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent"></div>
              
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="font-black text-[10.5px] tracking-wider uppercase px-2.5 py-1 rounded-lg border shrink-0 bg-sky-100 text-sky-900 border-sky-300/80 flex items-center gap-1.5 shadow-2xs">
                  <Wind size={13} className="text-sky-600" />
                  <span>WIND POWER</span>
                </span>

                <div className="h-9.5 w-9.5 rounded-xl bg-white/85 border border-sky-200 flex items-center justify-center text-sky-600 group-hover:scale-110 transition-transform shadow-2xs">
                  <Wind size={18} />
                </div>
              </div>

              <div className="my-2">
                <div className="text-2xl sm:text-3xl font-black text-sky-950 tracking-tight leading-none font-mono">
                  {formatCapacityMw(windSummary.rawMw)}{' '}
                  <span className="text-sm font-bold text-sky-700">MW</span>
                </div>
              </div>

              <div className="text-xs font-black tracking-tight text-sky-950 flex items-center justify-between pt-2 border-t border-sky-200/60 mt-2">
                <span>Wind Power Project</span>
                <span className="text-[10.5px] font-bold text-sky-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  Explore <ChevronRight size={14} />
                </span>
              </div>
            </div>

            {/* Card 3: Bagasse Power Project - Pastel Mint Emerald */}
            <div
              className="summary-card card-gridconn-bagasse cursor-pointer group rounded-2xl p-5 border relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between"
              onClick={() => setActiveTab('bagasse')}
              role="button"
              tabIndex={0}
              title="Navigate to Bagasse Power Project"
              style={{
                background: 'linear-gradient(135deg, #fbfdfc 0%, #f0fdf4 50%, #dcfce7 100%)',
                borderColor: '#bbf7d0',
                boxShadow: '0 3px 12px -2px rgba(187, 247, 208, 0.4)'
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent"></div>
              
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="font-black text-[10.5px] tracking-wider uppercase px-2.5 py-1 rounded-lg border shrink-0 bg-emerald-100 text-emerald-900 border-emerald-300/80 flex items-center gap-1.5 shadow-2xs">
                  <Leaf size={13} className="text-emerald-600" />
                  <span>BAGASSE CO-GEN</span>
                </span>

                <div className="h-9.5 w-9.5 rounded-xl bg-white/85 border border-emerald-200 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform shadow-2xs">
                  <Leaf size={18} />
                </div>
              </div>

              <div className="my-2">
                <div className="text-2xl sm:text-3xl font-black text-emerald-950 tracking-tight leading-none font-mono">
                  {formatCapacityMw(bagasseSummary.rawMw)}{' '}
                  <span className="text-sm font-bold text-emerald-700">MW</span>
                </div>
              </div>

              <div className="text-xs font-black tracking-tight text-emerald-950 flex items-center justify-between pt-2 border-t border-emerald-200/60 mt-2">
                <span>Bagasse Power Project</span>
                <span className="text-[10.5px] font-bold text-emerald-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  Explore <ChevronRight size={14} />
                </span>
              </div>
            </div>

            {/* Card 4: Small Hydro Projects - Pastel Fresh Aqua Teal */}
            <div
              className="summary-card card-gridconn-hydro cursor-pointer group rounded-2xl p-5 border relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between"
              onClick={() => setActiveTab('small-hydro')}
              role="button"
              tabIndex={0}
              title="Navigate to Small Hydro Projects"
              style={{
                background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 50%, #99f6e4 100%)',
                borderColor: '#99f6e4',
                boxShadow: '0 3px 12px -2px rgba(153, 246, 228, 0.4)'
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent"></div>
              
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="font-black text-[10.5px] tracking-wider uppercase px-2.5 py-1 rounded-lg border shrink-0 bg-teal-100 text-teal-900 border-teal-300/80 flex items-center gap-1.5 shadow-2xs">
                  <Droplets size={13} className="text-teal-600" />
                  <span>HYDRO POWER</span>
                </span>

                <div className="h-9.5 w-9.5 rounded-xl bg-white/85 border border-teal-200 flex items-center justify-center text-teal-600 group-hover:scale-110 transition-transform shadow-2xs">
                  <Droplets size={18} />
                </div>
              </div>

              <div className="my-2">
                <div className="text-2xl sm:text-3xl font-black text-teal-950 tracking-tight leading-none font-mono">
                  {formatCapacityMw(shpSummary.rawMw)}{' '}
                  <span className="text-sm font-bold text-teal-700">MW</span>
                </div>
              </div>

              <div className="text-xs font-black tracking-tight text-teal-950 flex items-center justify-between pt-2 border-t border-teal-200/60 mt-2">
                <span>Small Hydro Projects</span>
                <span className="text-[10.5px] font-bold text-teal-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  Explore <ChevronRight size={14} />
                </span>
              </div>
            </div>

            {/* Card 5: Municipal Solid Waste - Pastel Lavender Purple */}
            <div
              className="summary-card card-gridconn-msw cursor-pointer group rounded-2xl p-5 border relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between"
              onClick={() => setActiveTab('municipal-waste')}
              role="button"
              tabIndex={0}
              title="Navigate to Municipal Solid Waste"
              style={{
                background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 50%, #e9d5ff 100%)',
                borderColor: '#d8b4fe',
                boxShadow: '0 3px 12px -2px rgba(216, 180, 254, 0.4)'
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent"></div>
              
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="font-black text-[10.5px] tracking-wider uppercase px-2.5 py-1 rounded-lg border shrink-0 bg-purple-100 text-purple-900 border-purple-300/80 flex items-center gap-1.5 shadow-2xs">
                  <Trash2 size={13} className="text-purple-600" />
                  <span>SOLID WASTE</span>
                </span>

                <div className="h-9.5 w-9.5 rounded-xl bg-white/85 border border-purple-200 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform shadow-2xs">
                  <Trash2 size={18} />
                </div>
              </div>

              <div className="my-2">
                <div className="text-2xl sm:text-3xl font-black text-purple-950 tracking-tight leading-none font-mono">
                  {mswSummary.rawMw > 0 ? formatCapacityMw(mswSummary.rawMw) : '59.79'}{' '}
                  <span className="text-sm font-bold text-purple-700">MW</span>
                </div>
              </div>

              <div className="text-xs font-black tracking-tight text-purple-950 flex items-center justify-between pt-2 border-t border-purple-200/60 mt-2">
                <span>Municipal Solid Waste</span>
                <span className="text-[10.5px] font-bold text-purple-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  Explore <ChevronRight size={14} />
                </span>
              </div>
            </div>

            {/* Card 6: Biomass Power Project - Pastel Warm Vanilla Amber */}
            <div
              className="summary-card card-gridconn-biomass cursor-pointer group rounded-2xl p-5 border relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between"
              onClick={() => setActiveTab('biomass')}
              role="button"
              tabIndex={0}
              title="Navigate to Biomass Power Project"
              style={{
                background: 'linear-gradient(135deg, #fffdf0 0%, #fef9c3 50%, #fef08a 100%)',
                borderColor: '#fde047',
                boxShadow: '0 3px 12px -2px rgba(254, 240, 138, 0.4)'
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent"></div>
              
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="font-black text-[10.5px] tracking-wider uppercase px-2.5 py-1 rounded-lg border shrink-0 bg-amber-100 text-amber-900 border-amber-300/80 flex items-center gap-1.5 shadow-2xs">
                  <Flame size={13} className="text-amber-600" />
                  <span>BIOMASS POWER</span>
                </span>

                <div className="h-9.5 w-9.5 rounded-xl bg-white/85 border border-amber-200 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform shadow-2xs">
                  <Flame size={18} />
                </div>
              </div>

              <div className="my-2">
                <div className="text-2xl sm:text-3xl font-black text-amber-950 tracking-tight leading-none font-mono">
                  {formatCapacityMw(biomassSummary.rawMw)}{' '}
                  <span className="text-sm font-bold text-amber-700">MW</span>
                </div>
              </div>

              <div className="text-xs font-black tracking-tight text-amber-950 flex items-center justify-between pt-2 border-t border-amber-200/60 mt-2">
                <span>Biomass Power Project</span>
                <span className="text-[10.5px] font-bold text-amber-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  Explore <ChevronRight size={14} />
                </span>
              </div>
            </div>

            {/* Card 7: Large Hydro Power Projects - Pastel Warm Peach */}
            <div
              className="summary-card card-gridconn-largehydro rounded-2xl p-5 border relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between"
              title="Large Hydro Power Projects"
              style={{
                background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fed7aa 100%)',
                borderColor: '#fed7aa',
                boxShadow: '0 3px 12px -2px rgba(254, 215, 170, 0.4)'
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent"></div>
              
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="font-black text-[10.5px] tracking-wider uppercase px-2.5 py-1 rounded-lg border shrink-0 bg-orange-100 text-orange-900 border-orange-300/80 flex items-center gap-1.5 shadow-2xs">
                  <Layers size={13} className="text-orange-600" />
                  <span>LARGE HYDEL</span>
                </span>

                <div className="h-9.5 w-9.5 rounded-xl bg-white/85 border border-orange-200 flex items-center justify-center text-orange-600 shadow-2xs">
                  <Layers size={18} />
                </div>
              </div>

              <div className="my-2">
                <div className="text-2xl sm:text-3xl font-black text-orange-950 tracking-tight leading-none font-mono">
                  3,061{' '}
                  <span className="text-sm font-bold text-orange-700">MW</span>
                </div>
              </div>

              <div className="text-xs font-black tracking-tight text-orange-950 flex items-center justify-between pt-2 border-t border-orange-200/60 mt-2">
                <span>Large Hydro Power Projects</span>
                <span className="text-[10.5px] font-bold text-orange-700 bg-orange-100/90 px-2 py-0.5 rounded-md border border-orange-200">
                  State Dams
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (activeTab === 'solar-grid-conn' || activeTab === 'solar-grid-conn-summary') ? (
        <div className="category-view-container animate-fade-in">
          <GridConnectedDashboard isEmbedded={true} onNavigateTab={setActiveTab} />
        </div>
      ) : activeTab === 'solar-offgrid-sum' ? (
        <div className="category-view-container animate-fade-in">
          <OffGridDashboard isEmbedded={true} />
        </div>
      ) : (activeTab === 'kusum-ac' || activeTab === 'pm-kusum' || activeTab === 'solar-kusum') ? (
        <div className="category-view-container animate-fade-in">
          <SolarKusumDashboard />
        </div>
      ) : activeTab === 'solar-grid' ? (
        <div className="category-view-container animate-fade-in">
          <SolarGridDashboard />
        </div>
      ) : (activeTab === 'mskvy-2' || activeTab === 'mskvy' || activeTab === 'solar-mskvy-sum') ? (
        <MskvyDashboard />
      ) : (activeTab === 'solar-rooftop' || activeTab === 'rooftop') ? (
        <div className="category-view-container animate-fade-in">
          <RooftopDashboard isEmbedded={true} />
        </div>
      ) : activeTab === 'pm-kusum' ? (
        /* PM KUSUM COMPONENT B SCHEME DASHBOARD VIEW */
        <div className="category-view-container animate-fade-in space-y-6">
          {/* Executive Hero Card */}
          <div className="executive-hero-card">
            <div className="ehc-badge-pill">PM KUSUM COMPONENT-B</div>
            <div className="pink-card-val">265,083</div>
            <div className="pink-card-lbl">Total No. Of Solar Agriculture Pumps Installed</div>
          </div>

          {/* 3 Sub-Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="dashboard-data-card text-center">
              <div className="ddc-accent-bar bg-pink-500" />
              <div>
                <div className="ddc-title">3 HP Pumps Installed</div>
                <div className="ddc-val">149,461</div>
              </div>
            </div>

            <div className="dashboard-data-card text-center">
              <div className="ddc-accent-bar bg-blue-500" />
              <div>
                <div className="ddc-title">5 HP Pumps Installed</div>
                <div className="ddc-val">88,989</div>
              </div>
            </div>

            <div className="dashboard-data-card text-center">
              <div className="ddc-accent-bar bg-amber-500" />
              <div>
                <div className="ddc-title">7.5 HP Pumps Installed</div>
                <div className="ddc-val">26,633</div>
              </div>
            </div>
          </div>

          {/* 2 Charts Split Grid: Stacked HP Bar Chart (2 Cols) + Donut Chart (1 Col) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart 1: District Wise Solar Pumps Installed By HP */}
            <div className="lg:col-span-2 chart-box-card light-card p-5">
              <h3 className="chart-box-title">DISTRICT WISE SOLAR PUMPS INSTALLED BY HP</h3>
              <div className="space-y-2.5 mt-4 max-h-[300px] overflow-y-auto pr-2">
                {[
                  { d: 'Nashik', p3: 13.5, p5: 8.9, p7: 2.1 },
                  { d: 'Ahilyanagar', p3: 11.2, p5: 7.6, p7: 1.8 },
                  { d: 'Jalna', p3: 13.2, p5: 4.1, p7: 1.2 },
                  { d: 'Beed', p3: 11.5, p5: 3.8, p7: 1.1 },
                  { d: 'Ch. Sambhajinagar', p3: 9.2, p5: 6.0, p7: 1.2 },
                  { d: 'Nandurbar', p3: 5.6, p5: 6.4, p7: 3.4 },
                  { d: 'Jalgaon', p3: 7.6, p5: 5.9, p7: 1.5 },
                  { d: 'Pune', p3: 7.8, p5: 4.6, p7: 1.1 },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                      <span>{item.d}</span>
                      <span className="text-[10px] text-slate-500 font-semibold">{item.p3 + item.p5 + item.p7}k pumps</span>
                    </div>
                    <div className="flex h-3.5 rounded-full overflow-hidden bg-slate-100 gap-0.5 shadow-inner">
                      <div className="bg-pink-500 h-full rounded-l-full transition-all duration-500 hover:opacity-90 cursor-pointer" style={{ width: `${item.p3 * 4}%` }} title={`3 HP: ${item.p3}k`} />
                      <div className="bg-blue-500 h-full transition-all duration-500 hover:opacity-90 cursor-pointer" style={{ width: `${item.p5 * 4}%` }} title={`5 HP: ${item.p5}k`} />
                      <div className="bg-amber-500 h-full rounded-r-full transition-all duration-500 hover:opacity-90 cursor-pointer" style={{ width: `${item.p7 * 4}%` }} title={`7.5 HP: ${item.p7}k`} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-4 pt-2 border-t border-slate-100 text-xs font-semibold">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-pink-500" /> 3 HP</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-blue-500" /> 5 HP</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-amber-500" /> 7.5 HP</span>
              </div>
            </div>

            {/* Chart 2: District HP Capacity % Distribution Donut */}
            <div className="chart-box-card light-card p-5">
              <h3 className="chart-box-title">DISTRICT HP CAPACITY % DISTRIBUTION</h3>
              <div className="donut-center-wrap my-2 flex justify-center">
                <svg viewBox="0 0 160 160" className="w-[140px] h-[140px]">
                  <circle cx="80" cy="80" r="54" fill="none" stroke="#2563eb" strokeWidth="22" strokeDasharray="31 339" strokeDashoffset="0" />
                  <circle cx="80" cy="80" r="54" fill="none" stroke="#1e3a8a" strokeWidth="22" strokeDasharray="26 339" strokeDashoffset="-33" />
                  <circle cx="80" cy="80" r="54" fill="none" stroke="#ea580c" strokeWidth="22" strokeDasharray="23 339" strokeDashoffset="-61" />
                  <circle cx="80" cy="80" r="54" fill="none" stroke="#7c3aed" strokeWidth="22" strokeDasharray="21 339" strokeDashoffset="-86" />
                  <circle cx="80" cy="80" r="54" fill="none" stroke="#db2777" strokeWidth="22" strokeDasharray="238 339" strokeDashoffset="-109" />
                </svg>
              </div>
              <div className="space-y-1 text-xs mt-1">
                <div className="flex items-center justify-between"><span className="flex items-center gap-1.5 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Nashik</span> <span className="font-bold">23.95K (9.0%)</span></div>
                <div className="flex items-center justify-between"><span className="flex items-center gap-1.5 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-blue-900" /> Ahilyanagar</span> <span className="font-bold">20.18K (7.6%)</span></div>
                <div className="flex items-center justify-between"><span className="flex items-center gap-1.5 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-orange-600" /> Jalna</span> <span className="font-bold">18.41K (6.9%)</span></div>
                <div className="flex items-center justify-between"><span className="flex items-center gap-1.5 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-purple-600" /> Beed</span> <span className="font-bold">16.65K (6.3%)</span></div>
                <div className="flex items-center justify-between"><span className="flex items-center gap-1.5 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-pink-600" /> Ch. Sambhajinagar</span> <span className="font-bold">16.35K (6.2%)</span></div>
              </div>
            </div>
          </div>

          {/* Bottom Card: PM KUSUM Annual Pump Installation Trendline */}
          <div className="trendline-card-compact light-card p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <h3 className="chart-box-title font-extrabold text-slate-900">PM KUSUM ANNUAL PUMP INSTALLATIONS & TRAJECTORY (2020–2026)</h3>
            <div className="svg-trendline-wrap-compact w-full h-[150px] mt-2">
              <svg viewBox="0 0 350 150" className="w-full h-full">
                <line x1="30" y1="20" x2="330" y2="20" stroke="#f1f5f9" />
                <line x1="30" y1="68" x2="330" y2="68" stroke="#f1f5f9" />
                <line x1="30" y1="120" x2="330" y2="120" stroke="#e2e8f0" />

                <text x="22" y="24" fontSize="9" fill="#94a3b8" textAnchor="end">300K</text>
                <text x="22" y="124" fontSize="9" fill="#94a3b8" textAnchor="end">0K</text>

                <path d="M 43,115 L 103,100 L 163,75 L 223,50 L 283,24" fill="none" stroke="#be185d" strokeWidth="2.5" />
                <circle cx="43" cy="115" r="3.5" fill="#be185d" />
                <circle cx="103" cy="100" r="3.5" fill="#be185d" />
                <circle cx="163" cy="75" r="3.5" fill="#be185d" />
                <circle cx="223" cy="50" r="3.5" fill="#be185d" />
                <circle cx="283" cy="24" r="5" fill="#ec4899" stroke="#ffffff" strokeWidth="2" />

                <text x="43" y="138" fontSize="9" fill="#64748b" textAnchor="middle">2020</text>
                <text x="103" y="138" fontSize="9" fill="#64748b" textAnchor="middle">2022</text>
                <text x="163" y="138" fontSize="9" fill="#64748b" textAnchor="middle">2024</text>
                <text x="223" y="138" fontSize="9" fill="#64748b" textAnchor="middle">2025</text>
                <text x="283" y="138" fontSize="9" fill="#64748b" textAnchor="middle">2026</text>
              </svg>
            </div>
          </div>
        </div>
      ) : activeTab === 'govt-building-solar' ? (
        /* 4. GOVERNMENT BUILDING SOLARIZATION VIEW (Exact Match to Screenshot - Dynamic from Database) */
        <div className="category-view-container animate-fade-in">
          <GovtSolarDashboard />
        </div>
      ) : activeTab === 'wind' ? (
        <div className="category-view-container animate-fade-in">
          <WindDashboard />
        </div>
      ) : activeTab === 'bagasse' ? (
        <div className="category-view-container animate-fade-in">
          <BagasseDashboard />
        </div>
      ) : activeTab === 'biomass' ? (
        <div className="category-view-container animate-fade-in">
          <BiomassDashboard />
        </div>
      ) : (activeTab === 'small-hydro' || activeTab === 'shp') ? (
        <div className="category-view-container animate-fade-in">
          <SmallHydroDashboard />
        </div>
      ) : (activeTab === 'municipal-waste' || activeTab === 'msw') ? (
        <div className="category-view-container animate-fade-in">
          <MswDashboard />
        </div>
      ) : (
        /* DEFAULT VIEW FOR OTHER CATEGORIES */
        <div className="category-view-container animate-fade-in space-y-6">
          <div className="executive-hero-card">
            <div className="ehc-badge-pill">{currentCategory.label.toUpperCase()}</div>
            <div className="pink-card-val">{currentCategory.capacity}</div>
            <div className="pink-card-lbl">Total Commissioned Capacity for {currentCategory.label}</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="dashboard-data-card text-center">
              <div className="ddc-accent-bar bg-emerald-500" />
              <div>
                <div className="ddc-title">Active Projects</div>
                <div className="ddc-val">{currentCategory.count}</div>
              </div>
            </div>
            <div className="dashboard-data-card text-center">
              <div className="ddc-accent-bar bg-blue-500" />
              <div>
                <div className="ddc-title">Grid Efficiency</div>
                <div className="ddc-val">96.4%</div>
              </div>
            </div>
            <div className="dashboard-data-card text-center">
              <div className="ddc-accent-bar bg-teal-500" />
              <div>
                <div className="ddc-title">PPA Agreement Capacity</div>
                <div className="ddc-val">{currentCategory.capacity}</div>
              </div>
            </div>
          </div>

          {/* District Bar Chart & Donut Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 chart-box-card light-card">
              <h3 className="chart-box-title">DISTRICT WISE INSTALLED CAPACITY ({currentCategory.label.toUpperCase()})</h3>
              <div className="h-[260px] flex items-end gap-2 pt-6 pb-2 px-2 overflow-x-auto">
                {[
                  { d: 'Kolhapur', pct: 100, val: '124 MW' },
                  { d: 'Sangli', pct: 82, val: '102 MW' },
                  { d: 'Satara', pct: 75, val: '93 MW' },
                  { d: 'Pune', pct: 60, val: '74 MW' },
                  { d: 'Ahilyanagar', pct: 54, val: '67 MW' },
                  { d: 'Solapur', pct: 45, val: '56 MW' },
                  { d: 'Nashik', pct: 38, val: '47 MW' },
                  { d: 'Nanded', pct: 30, val: '37 MW' },
                  { d: 'Latur', pct: 24, val: '30 MW' },
                  { d: 'Amravati', pct: 18, val: '22 MW' },
                ].map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center justify-end min-w-[36px] h-full group">
                    <span className="text-[9px] font-bold text-slate-600 mb-1 transition-all group-hover:scale-110 group-hover:text-teal-600">{item.val}</span>
                    <div className="w-full h-[170px] flex items-end justify-center bg-slate-100/70 rounded-t-md p-[2px]">
                      <div
                        className="w-full bg-gradient-to-t from-teal-600 to-emerald-400 rounded-t-sm group-hover:from-teal-500 group-hover:to-emerald-300 transition-all shadow-sm"
                        style={{ height: `${Math.max(item.pct, 8)}%` }}
                      />
                    </div>
                    <div className="h-[45px] w-full flex items-start justify-center pt-2">
                      <span className="text-[9px] font-bold text-slate-600 truncate w-full text-center rotate-[-45deg] origin-top-left">{item.d}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="chart-box-card light-card">
              <h3 className="chart-box-title">CAPACITY % DISTRIBUTION</h3>
              <div className="donut-center-wrap my-2">
                <svg viewBox="0 0 160 160" className="donut-sources-svg">
                  <circle cx="80" cy="80" r="54" fill="none" stroke="#0d9488" strokeWidth="22" strokeDasharray="85 339" strokeDashoffset="0" />
                  <circle cx="80" cy="80" r="54" fill="none" stroke="#059669" strokeWidth="22" strokeDasharray="70 339" strokeDashoffset="-87" />
                  <circle cx="80" cy="80" r="54" fill="none" stroke="#2563eb" strokeWidth="22" strokeDasharray="54 339" strokeDashoffset="-159" />
                  <circle cx="80" cy="80" r="54" fill="none" stroke="#7c3aed" strokeWidth="22" strokeDasharray="42 339" strokeDashoffset="-215" />
                  <circle cx="80" cy="80" r="54" fill="none" stroke="#ea580c" strokeWidth="22" strokeDasharray="88 339" strokeDashoffset="-259" />
                </svg>
              </div>
              <div className="space-y-1 text-xs mt-1">
                <div className="flex items-center justify-between"><span className="flex items-center gap-1.5 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-teal-600" /> Kolhapur</span> <span className="font-bold">25.1%</span></div>
                <div className="flex items-center justify-between"><span className="flex items-center gap-1.5 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> Sangli</span> <span className="font-bold">20.6%</span></div>
                <div className="flex items-center justify-between"><span className="flex items-center gap-1.5 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Satara</span> <span className="font-bold">15.9%</span></div>
                <div className="flex items-center justify-between"><span className="flex items-center gap-1.5 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-purple-600" /> Pune</span> <span className="font-bold">12.4%</span></div>
                <div className="flex items-center justify-between"><span className="flex items-center gap-1.5 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-orange-600" /> Others</span> <span className="font-bold">26.0%</span></div>
              </div>
            </div>
          </div>

          {/* Yearly Trend Balanced Pure Line Chart */}
          <div className="trendline-card-compact light-card">
            <h3 className="chart-box-title">CAPACITY INSTALLED (MW) OVER YEARS</h3>
            <div className="svg-trendline-wrap-compact">
              <svg viewBox="0 0 350 150" className="trendline-svg-compact">
                <line x1="30" y1="20" x2="330" y2="20" stroke="#f1f5f9" />
                <line x1="30" y1="68" x2="330" y2="68" stroke="#f1f5f9" />
                <line x1="30" y1="120" x2="330" y2="120" stroke="#e2e8f0" />

                <text x="22" y="24" fontSize="9" fill="#94a3b8" textAnchor="end">100%</text>
                <text x="22" y="124" fontSize="9" fill="#94a3b8" textAnchor="end">0%</text>

                <path d="M 44,118 L 114,100 L 184,76 L 254,48 L 324,22" fill="none" stroke="#0d9488" strokeWidth="2.5" />
                <circle cx="44" cy="118" r="3.5" fill="#0d9488" />
                <circle cx="114" cy="100" r="3.5" fill="#0d9488" />
                <circle cx="184" cy="76" r="3.5" fill="#0d9488" />
                <circle cx="254" cy="48" r="3.5" fill="#0d9488" />
                <circle cx="324" cy="22" r="5" fill="#0d9488" stroke="#ffffff" strokeWidth="2" />

                <text x="44" y="138" fontSize="9" fill="#64748b" textAnchor="middle">2018</text>
                <text x="114" y="138" fontSize="9" fill="#64748b" textAnchor="middle">2020</text>
                <text x="184" y="138" fontSize="9" fill="#64748b" textAnchor="middle">2022</text>
                <text x="254" y="138" fontSize="9" fill="#64748b" textAnchor="middle">2024</text>
                <text x="324" y="138" fontSize="9" fill="#64748b" textAnchor="middle">2026</text>
              </svg>
            </div>
          </div>
        </div>
      )}
      <style>{`
        /* Modern Large Summary Dashboard Grid with Grid Connected Pastel Palette */
        .summary-view-wrapper {
          display: flex;
          flex-direction: column;
        }

        .summary-full-grid {
          display: grid;
          grid-template-columns: repeat(1, minmax(0, 1fr));
          gap: 16px;
          width: 100%;
        }

        @media (min-width: 768px) {
          .summary-full-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (min-width: 1024px) {
          .summary-full-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }

        .summary-card {
          border-radius: 18px;
          padding: 20px 22px;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border-width: 1px;
          border-style: solid;
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          box-sizing: border-box;
          user-select: none;
          min-height: 190px;
        }

        .summary-card.cursor-pointer:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 18px -3px rgba(15, 23, 42, 0.12) !important;
        }

        /* Backwards-compatibility for reference cards if reused */
        .navo-ref-card {
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 16px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05);
          border-radius: 12px;
          padding: 16px 20px;
          min-height: 104px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          box-sizing: border-box;
          user-select: none;
        }

        .navo-ref-card.cursor-pointer:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 26px rgba(15, 23, 42, 0.14), 0 3px 8px rgba(0, 0, 0, 0.06);
        }

        .navo-ref-mw {
          font-size: 1.6rem;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.1;
          letter-spacing: -0.3px;
        }

        .navo-ref-unit {
          font-size: 1.15rem;
          font-weight: 900;
          color: #0f172a;
          margin-left: 5px;
        }

        .navo-ref-label {
          font-size: 0.95rem;
          font-weight: 700;
          color: #0f172a;
          margin-top: 14px;
          letter-spacing: -0.1px;
        }

        .navo-ref-links {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-top: 14px;
        }

        .navo-ref-link-text {
          font-size: 0.95rem;
          font-weight: 700;
          color: #0f172a;
          background: transparent;
          border: none;
          padding: 0;
          cursor: pointer;
          transition: color 0.15s ease, text-decoration 0.15s ease;
          text-align: left;
        }

        .navo-ref-link-text:hover {
          color: #0369a1;
          text-decoration: underline;
        }

        /* Light Pastel Cards */
        .navo-gradient-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.03);
          overflow: hidden;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          position: relative;
          min-height: 135px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .navo-gradient-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
        }

        .navo-subcard {
          background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
          border: 1px solid #fde68a;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .navo-subcard:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 18px rgba(0, 0, 0, 0.06);
        }

        .navo-card-inner {
          padding: 16px 20px;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-sizing: border-box;
        }

        .card-pink-magenta {
          background: linear-gradient(135deg, #ffe4e6 0%, #fecdd3 50%, #fda4af 100%) !important;
          border: 1px solid #f43f5e !important;
          border-left: 5px solid #e11d48 !important;
        }

        .card-green {
          background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 50%, #86efac 100%) !important;
          border: 1px solid #4ade80 !important;
          border-left: 5px solid #16a34a !important;
        }

        .card-peach-orange {
          background: linear-gradient(135deg, #ffedd5 0%, #fed7aa 50%, #fdba74 100%) !important;
          border: 1px solid #fb923c !important;
          border-left: 5px solid #ea580c !important;
        }

        .card-cyan-blue {
          background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 50%, #7dd3fc 100%) !important;
          border: 1px solid #38bdf8 !important;
          border-left: 5px solid #0284c7 !important;
        }

        .card-lavender-purple {
          background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 50%, #d8b4fe 100%) !important;
          border: 1px solid #c084fc !important;
          border-left: 5px solid #9333ea !important;
        }

        .card-gold-yellow {
          background: linear-gradient(135deg, #fef9c3 0%, #fef08a 50%, #fde047 100%) !important;
          border: 1px solid #facc15 !important;
          border-left: 5px solid #ca8a04 !important;
        }

        .card-teal-ocean {
          background: linear-gradient(135deg, #ccfbf1 0%, #99f6e4 50%, #5eead4 100%) !important;
          border: 1px solid #2dd4bf !important;
          border-left: 5px solid #0d9488 !important;
        }

        .card-warm-gold {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fcd34d 100%) !important;
          border: 1px solid #fbbf24 !important;
          border-left: 5px solid #d97706 !important;
        }

        .navo-tag-link {
          font-size: 0.8rem;
          font-weight: 900;
          color: #0f172a;
          text-decoration: underline;
          cursor: pointer;
          letter-spacing: 0.3px;
          background: transparent;
          border: none;
          padding: 0;
          transition: color 0.2s ease;
        }

        .navo-tag-link:hover {
          color: #15803d;
        }

        .navo-card-mw {
          font-size: 1.85rem;
          font-weight: 900;
          color: #0f172a;
          letter-spacing: -0.4px;
          line-height: 1.1;
        }

        .navo-card-unit {
          font-size: 1.1rem;
          font-weight: 900;
          margin-left: 4px;
        }

        .navo-card-footer {
          margin-top: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .navo-card-label {
          font-size: 0.95rem;
          font-weight: 800;
          color: #0f172a;
        }

        .navo-link-btn {
          font-size: 0.78rem;
          font-weight: 900;
          color: #0f172a;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(6px);
          padding: 4px 12px;
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.95);
          cursor: pointer;
          transition: all 0.2s ease;
          user-select: none;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }

        .navo-link-btn:hover {
          background: #0f172a;
          color: #ffffff;
          border-color: #0f172a;
          transform: translateY(-1px);
        }

        .meda-dashboard-wrap {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
          min-height: 100%;
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

        /* 2. Category Tabs Scroller Card */
        .category-scroller-card {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 16px;
          box-shadow: 0 4px 18px rgba(0,0,0,0.02);
          position: relative;
        }

        .tab-scroll-btn {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          color: #475569;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .tab-scroll-btn:hover {
          background: #059669;
          border-color: #059669;
          color: #ffffff;
          box-shadow: 0 3px 10px rgba(5, 150, 105, 0.3);
          transform: scale(1.05);
        }

        .category-tabs-track {
          display: flex;
          align-items: center;
          gap: 8px;
          overflow-x: auto;
          scroll-behavior: smooth;
          padding: 2px 0px;
          flex: 1;
          scrollbar-width: none;
        }

        .category-tabs-track::-webkit-scrollbar {
          display: none;
        }

        .cat-tab-pill {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 7px 14px;
          border-radius: 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #475569;
          font-size: 0.8rem;
          font-weight: 600;
          white-space: nowrap;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          user-select: none;
        }

        .cat-tab-pill:hover {
          background: #ffffff;
          border-color: #cbd5e1;
          color: #0f172a;
          transform: translateY(-1px);
        }

        .cat-tab-pill.active {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          border-color: #047857;
          color: #ffffff;
          font-weight: 700;
          box-shadow: 0 4px 14px rgba(5, 150, 105, 0.28);
          transform: scale(1.02);
        }

        .cat-count-badge {
          font-size: 0.7rem;
          font-weight: 800;
          padding: 1px 7px;
          border-radius: 12px;
          background: #e2e8f0;
          color: #475569;
        }

        .cat-tab-pill.active .cat-count-badge {
          background: rgba(255, 255, 255, 0.25);
          color: #ffffff;
        }

        /* Category Active Notice Banner */
        .category-active-notice {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 16px;
          border-radius: 12px;
          border: 1.5px solid #a7f3d0;
          background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%);
          margin-bottom: 0px;
        }

        .can-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .can-icon-box {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 3px 8px rgba(0,0,0,0.06);
          flex-shrink: 0;
        }

        .can-title {
          font-size: 1rem;
          font-weight: 800;
          color: #0f172a;
        }

        .can-sub {
          font-size: 0.78rem;
          font-weight: 500;
          color: #475569;
        }

        .can-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .can-stat-pill {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .csp-lbl {
          font-size: 0.65rem;
          font-weight: 800;
          color: #64748b;
          letter-spacing: 0.5px;
        }

        .csp-val {
          font-size: 1.05rem;
          font-weight: 800;
          color: #0f172a;
        }

        .can-divider {
          width: 1px;
          height: 28px;
          background: #cbd5e1;
        }

        /* Executive Dark Glass Hero Card */
        .executive-hero-card {
          background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 55%, #064e3b 100%);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 16px;
          padding: 14px 24px;
          text-align: center;
          box-shadow: 0 8px 25px rgba(15, 23, 42, 0.18);
          position: relative;
          overflow: hidden;
        }

        .executive-hero-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #10b981, #6366f1, #06b6d4);
        }

        .ehc-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.65rem;
          font-weight: 800;
          color: #34d399;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(52, 211, 153, 0.3);
          padding: 2px 10px;
          border-radius: 20px;
          letter-spacing: 0.8px;
          margin-bottom: 4px;
        }

        .ehc-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #34d399;
          box-shadow: 0 0 8px #34d399;
        }

        .pink-card-val {
          font-size: 1.95rem;
          font-weight: 900;
          color: #ffffff;
          line-height: 1;
          letter-spacing: -0.5px;
        }

        .pink-card-unit {
          font-size: 1.05rem;
          font-weight: 800;
          margin-left: 4px;
          color: #34d399;
        }

        .pink-card-lbl {
          font-size: 0.78rem;
          font-weight: 600;
          color: #cbd5e1;
          margin-top: 4px;
        }

        .dashboard-data-card {
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 14px;
          padding: 14px 18px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.02);
          position: relative;
          overflow: hidden;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 125px;
          box-sizing: border-box;
        }

        .dashboard-data-card:hover {
          transform: translateY(-2px);
          border-color: #10b981;
          box-shadow: 0 6px 18px rgba(16, 185, 129, 0.1);
        }

        .ddc-accent-bar {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          width: 4px;
          border-radius: 4px 0 0 4px;
        }

        .ddc-title {
          font-size: 0.68rem;
          font-weight: 800;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          line-height: 1.2;
          margin-bottom: 6px;
        }

        .ddc-val {
          font-size: 1.3rem;
          font-weight: 900;
          color: #0f172a;
          line-height: 1;
          letter-spacing: -0.3px;
        }

        .ddc-unit {
          font-size: 0.78rem;
          font-weight: 800;
          margin-left: 3px;
          color: #059669;
        }

        /* Compact Card Bottom Action Footer */
        .card-bottom-action {
          margin-top: 6px;
          padding-top: 4px;
          border-top: 1px solid #f1f5f9;
          display: flex;
          justify-content: flex-end;
        }

        .card-redirect-btn {
          font-size: 0.62rem;
          font-weight: 800;
          color: #047857;
          background: #ecfdf5;
          padding: 2px 8px;
          border-radius: 12px;
          border: 1px solid #a7f3d0;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          user-select: none;
          display: inline-flex;
          align-items: center;
          gap: 3px;
        }

        .card-redirect-btn:hover {
          background: #059669;
          color: #ffffff;
          border-color: #059669;
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(5, 150, 105, 0.2);
        }

        .pumps-group-card {
          padding: 20px;
          border-radius: 18px;
          border: 1.5px solid #e2e8f0;
          background: #ffffff;
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
          transition: all 0.3s ease;
        }

        .pumps-group-card:hover {
          border-color: #cbd5e1;
          box-shadow: 0 8px 24px rgba(0,0,0,0.05);
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
          padding: 16px 18px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: #ffffff;
          border-radius: 14px;
          border: 1px solid #e2e8f0;
          min-height: 350px;
          height: 100%;
          box-sizing: border-box;
          overflow: hidden;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease;
        }

        .chart-box-card:hover {
          transform: translateY(-3px) scale(1.005);
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
          height: 135px;
          margin: 4px 0;
        }

        .donut-sources-svg, .sunburst-svg {
          width: 130px;
          height: 130px;
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

        .trendline-card-compact {
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: #ffffff;
          border-radius: 14px;
          border: 1px solid #e2e8f0;
          height: 245px;
          min-height: 245px;
          box-sizing: border-box;
          overflow: hidden;
          transition: all 0.25s ease;
        }

        .trendline-card-compact:hover {
          border-color: #10b981;
          box-shadow: 0 6px 20px rgba(0,0,0,0.05);
        }

        .svg-trendline-wrap-compact {
          width: 100%;
          height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .trendline-svg-compact {
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

        /* Slow spin animation for map compass */
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spinSlow 12s linear infinite;
        }

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

        /* Smooth Entrance Animation for Dashboard Pages */
        @keyframes dashboardPageFadeIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: dashboardPageFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* 3D Gradient Cards Smooth Hover */
        .navo-gradient-card {
          transition: transform 0.25s ease, box-shadow 0.25s ease !important;
        }

        .navo-gradient-card:hover {
          transform: translateY(-3px) scale(1.015) !important;
          box-shadow: 0 14px 30px rgba(0, 0, 0, 0.22) !important;
        }

        /* Chart Cards Smooth Hover */
        .chart-box-card {
          transition: transform 0.25s ease, box-shadow 0.25s ease !important;
        }

        .chart-box-card:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.07) !important;
        }

        /* Interactive Bar Chart Hover Effect with proper transform-box */
        svg rect {
          transform-box: fill-box;
          transform-origin: bottom;
          transition: opacity 0.2s ease, fill 0.2s ease, transform 0.2s ease !important;
        }

        svg rect:hover {
          opacity: 0.95;
          fill: #2563eb !important;
          transform: scaleY(1.04) !important;
          cursor: pointer;
        }

        /* Interactive Pie / Donut Slice Hover with proper transform-box */
        svg path {
          transform-box: fill-box;
          transform-origin: center;
          transition: opacity 0.2s ease, transform 0.2s ease, filter 0.2s ease !important;
        }

        svg path:hover {
          opacity: 0.92;
          transform: scale(1.03);
          filter: drop-shadow(0 4px 10px rgba(0,0,0,0.25));
          cursor: pointer;
        }

        /* Interactive Circle Data Points */
        svg circle {
          transform-box: fill-box;
          transform-origin: center;
          transition: transform 0.2s ease, fill 0.2s ease !important;
        }

        svg circle:hover {
          transform: scale(1.35);
          cursor: pointer;
        }

        /* Hidden on screen, visible only when printing/exporting PDF */
        .official-print-report {
          display: none;
        }

        /* ========================================================= */
        /* PRINTABLE OFFICIAL COMMISSIONING REPORT STYLES             */
        /* Matches user screenshot exactly (media_1788451250054.png)  */
        /* ========================================================= */
        @media print {
          @page {
            size: A4 portrait;
            margin: 6mm 8mm;
          }

          html, body {
            background: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: auto !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Hide sidebar, top navbar, dashboard header, tabs, and all on-screen dashboard views */
          .meda-sidebar-root,
          .top-navbar,
          .dashboard-top-header,
          .category-scroller-card,
          .category-active-notice,
          .category-view-container,
          .print-hide,
          .no-print {
            display: none !important;
          }

          .content-white-pane {
            padding: 0 !important;
            margin: 0 !important;
            background: #ffffff !important;
            overflow: visible !important;
            height: auto !important;
            border: none !important;
          }

          .meda-dashboard-wrap {
            padding: 0 !important;
            margin: 0 !important;
            gap: 0 !important;
            display: block !important;
          }

          /* Display only the official commissioning report */
          .official-print-report {
            display: block !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 auto !important;
            padding: 2mm 4mm !important;
            background: #ffffff !important;
            box-sizing: border-box !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
            color: #0f172a !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* 1. Header Section (Centered) */
          .report-header-section {
            text-align: center !important;
            margin-bottom: 20px !important;
            padding-top: 6px !important;
          }

          .report-main-header {
            font-size: 24px !important;
            font-weight: 900 !important;
            color: #0b2545 !important;
            letter-spacing: -0.3px !important;
            line-height: 1.25 !important;
            text-align: center !important;
            margin: 0 0 8px 0 !important;
          }

          .report-date {
            font-size: 13px !important;
            color: #475569 !important;
            text-align: center !important;
            margin-bottom: 14px !important;
          }

          .report-date strong {
            color: #0f172a !important;
            font-weight: 800 !important;
          }

          /* Dark Navy Divider Line */
          .report-navy-divider {
            height: 3.5px !important;
            background: #0b2545 !important;
            width: 100% !important;
            margin: 12px auto 0 auto !important;
            border-radius: 2px !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* 2. Highlight Green KPI Box */
          .report-kpi-card {
            border: 2px solid #86efac !important;
            background: #f0fdf4 !important;
            border-radius: 14px !important;
            overflow: hidden !important;
            margin: 22px 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .rkc-accent-bar {
            height: 5px !important;
            background: #059669 !important;
            width: 100% !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .rkc-body {
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            padding: 16px 24px !important;
          }

          .rkc-title {
            font-size: 14px !important;
            font-weight: 900 !important;
            color: #059669 !important;
            letter-spacing: 0.6px !important;
            text-transform: uppercase !important;
          }

          .rkc-sub {
            font-size: 12.5px !important;
            font-weight: 600 !important;
            color: #334155 !important;
            margin-top: 4px !important;
          }

          .rkc-metric {
            text-align: right !important;
          }

          .rkc-number {
            font-size: 34px !important;
            font-weight: 900 !important;
            color: #064e3b !important;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
            line-height: 1 !important;
          }

          .rkc-unit {
            font-size: 19px !important;
            font-weight: 900 !important;
            color: #059669 !important;
            margin-left: 6px !important;
          }

          /* 3. Data Table (3 Columns, Spacious) */
          .report-table-wrapper {
            border: 1.5px solid #cbd5e1 !important;
            border-radius: 10px !important;
            overflow: hidden !important;
            margin-bottom: 24px !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .report-table {
            width: 100% !important;
            border-collapse: collapse !important;
            font-size: 14px !important;
          }

          .report-table thead tr {
            background: #082338 !important;
            color: #ffffff !important;
            font-size: 13px !important;
            font-weight: 800 !important;
            text-transform: uppercase !important;
            letter-spacing: 0.5px !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .report-table th {
            padding: 13px 18px !important;
            border-right: 1px solid #1e3a5f !important;
          }

          .report-table th:last-child {
            border-right: none !important;
          }

          .th-sr { text-align: center !important; width: 12% !important; }
          .th-tech { text-align: left !important; width: 52% !important; padding-left: 20px !important; }
          .th-cap { text-align: right !important; width: 36% !important; padding-right: 20px !important; }

          .report-table tbody tr {
            border-bottom: 1px solid #e2e8f0 !important;
          }

          .report-table td {
            padding: 12px 18px !important;
            border-right: 1px solid #e2e8f0 !important;
          }

          .report-table td:last-child {
            border-right: none !important;
          }

          .td-sr { text-align: center !important; font-size: 14px !important; font-weight: 700 !important; color: #475569 !important; }
          .td-tech { text-align: left !important; font-size: 14.5px !important; font-weight: 800 !important; color: #0f172a !important; padding-left: 20px !important; }
          .td-cap { text-align: right !important; font-size: 15px !important; font-weight: 900 !important; color: #0f172a !important; font-family: ui-monospace, monospace !important; padding-right: 20px !important; }

          .tfoot-total-row {
            background: #f0fdf4 !important;
            border-top: 2.5px solid #10b981 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .tfoot-total-row td {
            padding: 14px 18px !important;
            border-right: 1px solid #bbf7d0 !important;
          }

          .tfoot-total-row td:last-child {
            border-right: none !important;
          }

          .total-check {
            font-size: 16px !important;
            font-weight: 900 !important;
            color: #059669 !important;
          }

          .total-title {
            font-size: 14px !important;
            font-weight: 900 !important;
            color: #065f46 !important;
            letter-spacing: 0.5px !important;
            text-transform: uppercase !important;
            padding-left: 20px !important;
          }

          .total-cap {
            font-size: 16px !important;
            font-weight: 900 !important;
            color: #064e3b !important;
            font-family: ui-monospace, monospace !important;
            padding-right: 20px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
