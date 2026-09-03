import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logoImg from '../../assets/logo.png';
import {
  Sun,
  Home,
  Wind,
  Search,
  Bell,
  LogOut,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  ShieldCheck,
  Zap,
  Plug,
  Download,
  History,
  Database,
  Activity,
  Lock,
  FileSpreadsheet,
  Menu,
  X,
  Cpu,
  Building2,
  Droplets,
  Flame,
  Trash2,
  ArrowRight,
  Leaf,
  Layers
} from 'lucide-react';
import { medaApi } from '../../services/medaApi';

const DASHBOARD_HEADERS = [
  { 
    id: 'summary', 
    name: 'Summary', 
    desc: 'Full RE capacity & state grid overview', 
    tabId: 'summary', 
    icon: LayoutDashboard,
    iconBg: '#ecfdf5',
    iconColor: '#059669',
    keywords: ['summary', 'overview', 'total', 'all schemes', 're capacity', 'commissioned', 'solar', 'wind']
  },
  { 
    id: 'solar-grid-conn', 
    name: 'Grid Connected Solar', 
    desc: 'Commissioned grid connected solar schemes', 
    tabId: 'solar-grid-conn', 
    icon: Sun,
    iconBg: '#ffedd5',
    iconColor: '#ea580c',
    keywords: ['grid connected', 'grid', 'solar grid conn', 'schemes', 'solar projects']
  },
  { 
    id: 'solar-offgrid-sum', 
    name: 'Off Grid Solar', 
    desc: 'Agricultural solar pumps & off-grid systems', 
    tabId: 'solar-offgrid-sum', 
    icon: Sun,
    iconBg: '#fef9c3',
    iconColor: '#ca8a04',
    keywords: ['off grid', 'solar pumps', 'pumps', 'agriculture', 'irrigation']
  },
  { 
    id: 'kusum-ac', 
    name: 'KUSUM Scheme', 
    desc: 'PM-KUSUM component A & C solar installations', 
    tabId: 'kusum-ac', 
    icon: Zap,
    iconBg: '#fef3c7',
    iconColor: '#d97706',
    keywords: ['kusum', 'pm kusum', 'kusum a', 'kusum c', 'solar kusum', 'farmers']
  },
  { 
    id: 'mskvy', 
    name: 'MSKVY', 
    desc: 'Mukhyamantri Saur Krushi Vahini Yojana', 
    tabId: 'mskvy', 
    icon: Cpu,
    iconBg: '#e0f2fe',
    iconColor: '#0284c7',
    keywords: ['mskvy', 'mukhyamantri saur krushi vahini', 'feeder', 'mskvy 1.0', 'mskvy 2.0', 'solar feeder']
  },
  { 
    id: 'solar-rooftop', 
    name: 'Rooftop Solar', 
    desc: 'Grid connected rooftop solar generation', 
    tabId: 'solar-rooftop', 
    icon: Home,
    iconBg: '#ecfdf5',
    iconColor: '#059669',
    keywords: ['rooftop', 'solar rooftop', 'residential', 'consumer rooftop', 'commercial rooftop']
  },
  { 
    id: 'solar-grid', 
    name: 'Solar Grid (RE Policy)', 
    desc: 'Utility scale grid connected solar plants', 
    tabId: 'solar-grid', 
    icon: Sun,
    iconBg: '#fef08a',
    iconColor: '#ca8a04',
    keywords: ['solar grid', 'utility scale', 're policy', 'solar power', 'grid solar']
  },
  { 
    id: 'govt-building-solar', 
    name: 'Government Building Solar', 
    desc: 'Govt buildings rooftop solarization', 
    tabId: 'govt-building-solar', 
    icon: Building2,
    iconBg: '#e0e7ff',
    iconColor: '#4f46e5',
    keywords: ['govt building', 'government', 'rooftop solarization', 'public buildings', 'govt solar']
  },
  { 
    id: 'wind', 
    name: 'Wind Power', 
    desc: 'Wind turbine generating stations & districts', 
    tabId: 'wind', 
    icon: Wind,
    iconBg: '#cff4fc',
    iconColor: '#0891b2',
    keywords: ['wind', 'wind power', 'turbines', 'wind farms', 'generators', 'aerogenerators']
  },
  { 
    id: 'bagasse', 
    name: 'Bagasse Co-gen', 
    desc: 'Sugar factory co-generation power stations', 
    tabId: 'bagasse', 
    icon: Leaf,
    iconBg: '#dcfce7',
    iconColor: '#16a34a',
    keywords: ['bagasse', 'co-generation', 'sugar mill', 'co gen', 'crushing', 'sugar']
  },
  { 
    id: 'biomass', 
    name: 'Biomass Power', 
    desc: 'Agricultural residue biomass power plants', 
    tabId: 'biomass', 
    icon: Flame,
    iconBg: '#d1fae5',
    iconColor: '#059669',
    keywords: ['biomass', 'bio power', 'agricultural residue', 'briquettes', 'waste biomass']
  },
  { 
    id: 'small-hydro', 
    name: 'Small Hydro Projects', 
    desc: 'Small run-of-river hydro power generators', 
    tabId: 'small-hydro', 
    icon: Droplets,
    iconBg: '#e0f2fe',
    iconColor: '#0284c7',
    keywords: ['small hydro', 'shp', 'water power', 'run of river', 'hydro', 'dams']
  },
  { 
    id: 'municipal-waste', 
    name: 'Municipal Solid Waste (MSW)', 
    desc: 'Urban solid waste to energy power stations', 
    tabId: 'municipal-waste', 
    icon: Trash2,
    iconBg: '#f3e8ff',
    iconColor: '#7c3aed',
    keywords: ['msw', 'waste to energy', 'municipal solid waste', 'waste', 'refuse']
  },
  // Main Page Shortcuts
  { 
    id: 'nav-dashboard', 
    name: 'Dashboard Overview', 
    desc: 'Main energy dashboard page', 
    path: '/dashboard', 
    icon: LayoutDashboard,
    iconBg: '#f1f5f9',
    iconColor: '#475569',
    keywords: ['dashboard', 'home', 'main page']
  },
  { 
    id: 'nav-accounts', 
    name: 'Accounts & Users', 
    desc: 'User management & superadmin roles', 
    path: '/accounts', 
    icon: Users,
    iconBg: '#f1f5f9',
    iconColor: '#475569',
    keywords: ['accounts', 'users', 'superadmin', 'roles', 'credentials']
  },
  { 
    id: 'nav-templates', 
    name: 'Energy Templates', 
    desc: 'Excel upload & template management', 
    path: '/energy-templates', 
    icon: FileSpreadsheet,
    iconBg: '#f1f5f9',
    iconColor: '#475569',
    keywords: ['energy templates', 'upload excel', 'templates', 'import data', 'spreadsheet']
  },
  { 
    id: 'nav-show-data', 
    name: 'Show Data Database', 
    desc: 'Raw and formatted database table views', 
    path: '/show-data', 
    icon: Database,
    iconBg: '#f1f5f9',
    iconColor: '#475569',
    keywords: ['show data', 'records', 'tables', 'database view', 'table view']
  },
  { 
    id: 'nav-settings', 
    name: 'Settings', 
    desc: 'Platform configuration & preferences', 
    path: '/settings', 
    icon: Settings,
    iconBg: '#f1f5f9',
    iconColor: '#475569',
    keywords: ['settings', 'preferences', 'configuration', 'config']
  }
];

const Sidebar = ({ children, currentUser, onLogout, isMedaConnected: propIsMedaConnected }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => localStorage.getItem('sidebar_collapsed') === 'true');
  const [isMedaConnected, setIsMedaConnected] = useState(propIsMedaConnected || false);
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredHeaders = searchQuery.trim() === '' 
    ? [] 
    : DASHBOARD_HEADERS.filter(item => {
        const q = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.desc.toLowerCase().includes(q) ||
          (item.keywords && item.keywords.some(k => k.toLowerCase().includes(q)))
        );
      }).slice(0, 8);

  const handleSelectHeader = (item) => {
    if (item.tabId) {
      navigate(`/dashboard?tab=${item.tabId}`);
    } else if (item.path) {
      navigate(item.path);
    }
    setSearchQuery('');
    setSearchOpen(false);
  };

  const handleKeyDown = (e) => {
    if (!searchOpen || filteredHeaders.length === 0) {
      if (e.key === 'Enter' && searchQuery.trim()) {
        const best = DASHBOARD_HEADERS.find(h => 
          h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          h.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        if (best) handleSelectHeader(best);
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredHeaders.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredHeaders.length) % filteredHeaders.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredHeaders[selectedIndex]) {
        handleSelectHeader(filteredHeaders[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setSearchOpen(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setSelectedIndex(0);
    setSearchOpen(e.target.value.trim().length > 0);
  };

  useEffect(() => {
    if (propIsMedaConnected !== undefined) {
      setIsMedaConnected(propIsMedaConnected);
    } else {
      medaApi.getStatus()
        .then((res) => setIsMedaConnected(res.is_connected))
        .catch(() => setIsMedaConnected(false));
    }
  }, [propIsMedaConnected]);

  const toggleSidebar = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    localStorage.setItem('sidebar_collapsed', String(nextState));
  };

  const handleLogout = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setShowDropdown(false);
    setMobileOpen(false);
    localStorage.clear();
    if (onLogout) {
      onLogout();
    }
    navigate('/login', { replace: true });
  };

  const username = currentUser?.username || localStorage.getItem('username') || 'meda User';

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Accounts', path: '/accounts', icon: Users },
    { name: 'Energy Templates', path: '/energy-templates', icon: FileSpreadsheet },
    { name: 'Show Data', path: '/show-data', icon: Database },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const medaNavItems = [
    { name: 'MEDA Login', path: '/meda/login', icon: Plug, requiresAuth: false },
    { name: 'Fetch Data', path: '/meda/fetch', icon: Download, requiresAuth: true },
    { name: 'Sync History', path: '/meda/sync-history', icon: History, requiresAuth: true },
    { name: 'Raw Data', path: '/meda/raw-data', icon: Database, requiresAuth: true },
    { name: 'API Logs', path: '/meda/api-logs', icon: Activity, requiresAuth: true },
  ];

  return (
    <div className="app-shell">
      {/* Top Navbar Section (Clean Responsive Header) */}
      <header className="navbar-container">
        <div className="brand-section">
          {/* Mobile Menu Toggle Button */}
          <button
            className="mobile-toggle-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle Navigation"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Desktop Sidebar Collapse Toggle Button */}
          <button
            type="button"
            className="desktop-sidebar-toggle-btn"
            onClick={toggleSidebar}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            aria-label="Toggle Sidebar Collapse"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>

          <div className="logo-icon-wrap">
            <img src={logoImg} alt="meda logo" className="logo-img-scaled" />
          </div>
          <div className="brand-text-wrap">
            <span className="brand-name">meda</span>
          </div>
        </div>

        {/* Interactive Searchbox with Dashboard Header Suggestions */}
        <div className="search-box-wrap" ref={searchRef}>
          <div className="search-box">
            <Search size={17} className="search-icon" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => {
                if (searchQuery.trim().length > 0) setSearchOpen(true);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search dashboard headers (e.g. MSKVY, Solar, Wind)..."
              className="search-input"
            />
            {searchQuery && (
              <button 
                type="button" 
                onClick={() => { setSearchQuery(''); setSearchOpen(false); }}
                className="search-clear-btn"
                title="Clear Search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Autocomplete Suggestions Dropdown */}
          {searchOpen && (
            <div className="search-dropdown-menu animate-fade-in">
              {filteredHeaders.length > 0 ? (
                <div className="search-dropdown-group">
                  <div className="search-dropdown-header">
                    <span>MATCHING DASHBOARD HEADERS</span>
                    <span className="search-count-pill">{filteredHeaders.length} found</span>
                  </div>
                  <ul className="search-results-list">
                    {filteredHeaders.map((item, idx) => {
                      const Icon = item.icon || LayoutDashboard;
                      const isSelected = idx === selectedIndex;
                      return (
                        <li key={item.id}>
                          <button
                            type="button"
                            onClick={() => handleSelectHeader(item)}
                            onMouseEnter={() => setSelectedIndex(idx)}
                            className={`search-result-item ${isSelected ? 'selected' : ''}`}
                          >
                            <div className="sri-icon-box" style={{ background: item.iconBg || 'rgba(16, 185, 129, 0.1)', color: item.iconColor || '#059669' }}>
                              <Icon size={16} />
                            </div>
                            <div className="sri-text-col">
                              <span className="sri-name">{item.name}</span>
                              <span className="sri-desc">{item.desc}</span>
                            </div>
                            <span className="sri-tag">
                              {item.tabId ? 'Open Header' : 'Navigate'}
                              <ArrowRight size={11} className="sri-arrow" />
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : (
                <div className="search-no-results">
                  <p className="snr-title">No matching dashboard headers</p>
                  <p className="snr-sub">Try searching for <strong>MSKVY</strong>, <strong>Solar</strong>, <strong>KUSUM</strong>, or <strong>Wind</strong></p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="nav-controls">
          <button className="nav-icon-btn" title="Notifications">
            <Bell size={18} />
            <span className="notification-dot"></span>
          </button>

          <div className="user-profile-rel">
            <button
              className="user-profile-btn"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="avatar-circle">
                {username.charAt(0).toUpperCase()}
              </div>
              <div className="user-info-text">
                <span className="user-name">{username}</span>
                <span className="user-role">Superadmin</span>
              </div>
              <ChevronDown size={16} className={`chevron ${showDropdown ? 'open' : ''}`} />
            </button>

            {showDropdown && (
              <div className="user-dropdown-menu animate-fade-in">
                <div className="dropdown-header">
                  <p className="dh-name">{username}</p>
                  <p className="dh-email">{currentUser?.email || 'admin@meda.io'}</p>
                </div>
                <div className="dropdown-divider"></div>
                <button type="button" onClick={handleLogout} className="dropdown-item danger">
                  <LogOut size={16} /> Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main App Layout */}
      <div className="layout-body">
        {/* Left Sidebar Pane (Desktop) */}
        <aside className={`sidebar-dark-pane desktop-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, overflowY: 'auto' }}>
            <div className="nav-group">
              {!isCollapsed && <p className="nav-group-title">MAIN NAVIGATION</p>}
              <ul className="nav-list">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.name}>
                      <NavLink
                        to={item.path}
                        title={isCollapsed ? item.name : undefined}
                        className={({ isActive }) => `dark-nav-link ${isActive ? 'active' : ''}`}
                      >
                        <Icon size={18} className="link-icon" />
                        {!isCollapsed && <span>{item.name}</span>}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="nav-group">
              <div style={{ display: 'flex', itemsCenter: 'center', justifyContent: isCollapsed ? 'center' : 'space-between', paddingRight: isCollapsed ? 0 : 8 }}>
                {!isCollapsed && <p className="nav-group-title" style={{ marginBottom: 0 }}>MEDA INTEGRATION</p>}
                <span style={{
                  fontSize: isCollapsed ? '0.55rem' : '0.6rem',
                  fontWeight: 700,
                  color: isMedaConnected ? '#10b981' : '#ef4444',
                  background: isMedaConnected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  padding: isCollapsed ? '2px 4px' : '2px 6px',
                  borderRadius: '4px'
                }}>
                  {isCollapsed ? '•' : (isMedaConnected ? 'ONLINE' : 'OFFLINE')}
                </span>
              </div>

              <ul className="nav-list" style={{ marginTop: 8 }}>
                {medaNavItems.map((item) => {
                  const Icon = item.icon;
                  const isDisabled = item.requiresAuth && !isMedaConnected;

                  if (isDisabled) {
                    return (
                      <li key={item.name}>
                        <div
                          className="dark-nav-link disabled"
                          title={isCollapsed ? `${item.name} (Requires active MEDA login)` : 'Requires active MEDA login'}
                          style={{ opacity: 0.5, cursor: 'not-allowed' }}
                        >
                          <Icon size={18} className="link-icon" />
                          {!isCollapsed && <span>{item.name}</span>}
                          {!isCollapsed && <Lock size={12} style={{ marginLeft: 'auto', color: '#64748b' }} />}
                        </div>
                      </li>
                    );
                  }

                  return (
                    <li key={item.name}>
                      <NavLink
                        to={item.path}
                        title={isCollapsed ? item.name : undefined}
                        className={({ isActive }) => `dark-nav-link ${isActive ? 'active' : ''}`}
                      >
                        <Icon size={18} className="link-icon" />
                        {!isCollapsed && <span>{item.name}</span>}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div style={{ paddingTop: 12, borderTop: '1px solid #114250' }}>
            <button onClick={handleLogout} className="logout-btn" title={isCollapsed ? 'Sign Out' : undefined}>
              <LogOut size={16} />
              {!isCollapsed && <span>Sign Out</span>}
            </button>
          </div>
        </aside>

        {/* Mobile Navigation Backdrop Overlay */}
        {mobileOpen && (
          <div
            className="mobile-backdrop"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Mobile Slide-Out Drawer Pane */}
        <aside className={`sidebar-dark-pane mobile-drawer ${mobileOpen ? 'open' : ''}`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, overflowY: 'auto' }}>
            <div className="nav-group">
              <p className="nav-group-title">MAIN NAVIGATION</p>
              <ul className="nav-list">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.name}>
                      <NavLink
                        to={item.path}
                        onClick={() => setMobileOpen(false)}
                        className={({ isActive }) => `dark-nav-link ${isActive ? 'active' : ''}`}
                      >
                        <Icon size={18} className="link-icon" />
                        <span>{item.name}</span>
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="nav-group">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: 8 }}>
                <p className="nav-group-title" style={{ marginBottom: 0 }}>MEDA INTEGRATION</p>
                <span style={{
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  color: isMedaConnected ? '#10b981' : '#ef4444',
                  background: isMedaConnected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  padding: '2px 6px',
                  borderRadius: '4px'
                }}>
                  {isMedaConnected ? 'ONLINE' : 'OFFLINE'}
                </span>
              </div>

              <ul className="nav-list" style={{ marginTop: 8 }}>
                {medaNavItems.map((item) => {
                  const Icon = item.icon;
                  const isDisabled = item.requiresAuth && !isMedaConnected;

                  if (isDisabled) {
                    return (
                      <li key={item.name}>
                        <div
                          className="dark-nav-link disabled"
                          style={{ opacity: 0.5, cursor: 'not-allowed' }}
                        >
                          <Icon size={18} className="link-icon" />
                          <span>{item.name}</span>
                          <Lock size={12} style={{ marginLeft: 'auto', color: '#64748b' }} />
                        </div>
                      </li>
                    );
                  }

                  return (
                    <li key={item.name}>
                      <NavLink
                        to={item.path}
                        onClick={() => setMobileOpen(false)}
                        className={({ isActive }) => `dark-nav-link ${isActive ? 'active' : ''}`}
                      >
                        <Icon size={18} className="link-icon" />
                        <span>{item.name}</span>
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div style={{ paddingTop: 12, borderTop: '1px solid #114250' }}>
            <button onClick={handleLogout} className="logout-btn">
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Page Main Content Container */}
        <main className="content-white-pane">
          {children}
        </main>
      </div>

      {/* Styled JSX for Responsive Layout & Shell */}
      <style>{`
        :root {
          --navbar-height: 72px;
          --sidebar-width: 240px;
        }

        .app-shell {
          display: flex;
          flex-direction: column;
          height: 100vh;
          width: 100vw;
          overflow: hidden;
          background: #f8fafc;
          font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
        }

        /* Top Navbar */
        .navbar-container {
          height: var(--navbar-height);
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          box-shadow: 0 2px 10px rgba(15, 23, 42, 0.03);
          z-index: 50;
        }

        .brand-section {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .mobile-toggle-btn {
          display: none;
          background: transparent;
          border: none;
          color: #0f172a;
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
        }

        .mobile-toggle-btn:hover {
          background: #f1f5f9;
        }

        .logo-icon-wrap {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(6, 182, 212, 0.12) 100%);
          border: 1px solid rgba(16, 185, 129, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          box-shadow: 0 4px 14px rgba(16, 185, 129, 0.15);
          flex-shrink: 0;
          transition: all 0.3s ease;
        }

        .logo-icon-wrap:hover {
          transform: translateY(-1px) scale(1.03);
          box-shadow: 0 6px 18px rgba(16, 185, 129, 0.25);
        }

        .logo-img-scaled {
          width: 100%;
          height: 100%;
          object-fit: contain;
          transform: scale(2.2);
          transition: transform 0.3s ease;
        }

        .brand-text-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .brand-name {
          font-size: 1.5rem;
          font-weight: 900;
          background: linear-gradient(135deg, #0f172a 0%, #059669 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.6px;
        }

        .brand-badge {
          font-size: 0.75rem;
          font-weight: 800;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: #ffffff;
          padding: 4px 10px;
          border-radius: 8px;
          box-shadow: 0 3px 8px rgba(16, 185, 129, 0.3);
          letter-spacing: 0.5px;
        }

        .search-box-wrap {
          position: relative;
          width: 380px;
        }

        .search-box {
          position: relative;
          width: 100%;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 13px;
          color: #94a3b8;
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          padding: 8px 34px 8px 38px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          font-size: 0.82rem;
          color: #0f172a;
          outline: none;
          transition: all 0.2s ease;
        }

        .search-input:focus {
          background: #ffffff;
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
        }

        .search-clear-btn {
          position: absolute;
          right: 10px;
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3px;
          border-radius: 50%;
          transition: all 0.15s ease;
        }

        .search-clear-btn:hover {
          color: #0f172a;
          background: #e2e8f0;
        }

        /* Search Dropdown */
        .search-dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          width: 400px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          box-shadow: 0 16px 36px -4px rgba(15, 23, 42, 0.18), 0 4px 12px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          z-index: 100;
        }

        .search-dropdown-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 9px 14px;
          background: #f8fafc;
          border-bottom: 1px solid #f1f5f9;
          font-size: 0.68rem;
          font-weight: 800;
          color: #64748b;
          letter-spacing: 0.5px;
        }

        .search-count-pill {
          background: #e2e8f0;
          color: #334155;
          font-size: 0.65rem;
          padding: 2px 7px;
          border-radius: 6px;
          font-weight: 700;
        }

        .search-results-list {
          list-style: none;
          margin: 0;
          padding: 6px;
          max-height: 380px;
          overflow-y: auto;
        }

        .search-result-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 8px 10px;
          border-radius: 10px;
          border: none;
          background: transparent;
          cursor: pointer;
          text-align: left;
          transition: all 0.15s ease;
        }

        .search-result-item:hover,
        .search-result-item.selected {
          background: #f0fdf4;
        }

        .sri-icon-box {
          width: 32px;
          height: 32px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .sri-text-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .sri-name {
          font-size: 0.82rem;
          font-weight: 700;
          color: #0f172a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .search-result-item.selected .sri-name,
        .search-result-item:hover .sri-name {
          color: #059669;
        }

        .sri-desc {
          font-size: 0.7rem;
          color: #64748b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sri-tag {
          font-size: 0.68rem;
          font-weight: 700;
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 3px;
          flex-shrink: 0;
          padding: 3px 6px;
          border-radius: 6px;
          background: #f1f5f9;
        }

        .search-result-item:hover .sri-tag,
        .search-result-item.selected .sri-tag {
          color: #059669;
          background: #dcfce7;
        }

        .search-result-item:hover .sri-arrow,
        .search-result-item.selected .sri-arrow {
          transform: translateX(2px);
          transition: transform 0.15s ease;
        }

        .search-no-results {
          padding: 24px 16px;
          text-align: center;
        }

        .snr-title {
          font-size: 0.82rem;
          font-weight: 700;
          color: #334155;
          margin: 0;
        }

        .snr-sub {
          font-size: 0.74rem;
          color: #64748b;
          margin-top: 4px;
          margin-bottom: 0;
        }

        .nav-controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .nav-icon-btn {
          position: relative;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .user-profile-rel {
          position: relative;
        }

        .user-profile-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 8px;
          border-radius: 20px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          cursor: pointer;
        }

        .avatar-circle {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #10b981;
          color: #ffffff;
          font-weight: 700;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-info-text {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .user-name {
          font-size: 0.8rem;
          font-weight: 700;
          color: #0f172a;
        }

        .user-role {
          font-size: 0.65rem;
          color: #64748b;
        }

        .user-dropdown-menu {
          position: absolute;
          right: 0;
          top: calc(100% + 6px);
          width: 200px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 8px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
          z-index: 100;
        }

        .dropdown-header {
          padding: 6px 10px;
        }

        .dh-name {
          font-weight: 700;
          font-size: 0.85rem;
          color: #0f172a;
        }

        .dh-email {
          font-size: 0.72rem;
          color: #64748b;
        }

        .dropdown-divider {
          height: 1px;
          background: #e2e8f0;
          margin: 6px 0;
        }

        .dropdown-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          background: transparent;
          border: none;
          border-radius: 8px;
          color: #64748b;
          font-size: 0.82rem;
          cursor: pointer;
        }

        .dropdown-item.danger {
          color: #ef4444;
        }

        .dropdown-item.danger:hover {
          background: #fef2f2;
        }

        /* Layout Body */
        .layout-body {
          display: flex;
          flex: 1;
          height: calc(100vh - var(--navbar-height));
          overflow: hidden;
          position: relative;
        }

        /* Desktop Sidebar Pane */
        .sidebar-dark-pane {
          width: var(--sidebar-width);
          min-width: var(--sidebar-width);
          background: #082d38;
          border-right: 1px solid #114250;
          padding: 16px 12px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 12px;
          height: 100%;
          transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1), min-width 0.3s cubic-bezier(0.16, 1, 0.3, 1), padding 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .desktop-sidebar.collapsed {
          width: var(--sidebar-collapsed-width);
          min-width: var(--sidebar-collapsed-width);
          padding: 16px 6px;
          align-items: center;
        }

        .desktop-sidebar.collapsed .dark-nav-link {
          justify-content: center;
          padding: 10px 0;
          width: 44px;
          height: 44px;
          border-radius: 10px;
        }

        .desktop-sidebar.collapsed .logout-btn {
          justify-content: center;
          padding: 10px 0;
          width: 44px;
          height: 44px;
          border-radius: 10px;
        }

        .desktop-sidebar.collapsed .nav-list {
          align-items: center;
        }

        .nav-group-title {
          font-size: 0.6rem;
          font-weight: 800;
          letter-spacing: 0.8px;
          color: #648d9f;
          margin-bottom: 6px;
          padding-left: 8px;
        }

        .nav-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .dark-nav-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          border-radius: 8px;
          color: #829ab1;
          text-decoration: none;
          font-size: 0.8rem;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .dark-nav-link:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.08);
        }

        .dark-nav-link.active {
          color: #ffffff;
          background: #114250;
          border: 1px solid #1c5b6e;
          font-weight: 700;
        }

        .dark-nav-link.active .link-icon {
          color: #10b981;
        }

        .logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 8px;
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #f87171;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.22);
        }

        /* Content Pane */
        .content-white-pane {
          flex: 1;
          background: #f8fafc;
          padding: 16px;
          overflow-y: auto;
          height: 100%;
          width: 100%;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Mobile Backdrop & Drawer */
        .mobile-backdrop {
          display: none;
          position: fixed;
          top: var(--navbar-height);
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(4px);
          z-index: 90;
        }

        .mobile-drawer {
          display: none;
          position: fixed;
          top: var(--navbar-height);
          left: 0;
          bottom: 0;
          z-index: 95;
          transform: translateX(-100%);
          transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 10px 0 30px rgba(0, 0, 0, 0.2);
        }

        .mobile-drawer.open {
          transform: translateX(0);
        }

        /* Responsive Breakpoints */
        @media (max-width: 900px) {
          .desktop-sidebar {
            display: none !important;
          }

          .mobile-toggle-btn {
            display: flex;
          }

          .mobile-backdrop {
            display: block;
          }

          .mobile-drawer {
            display: flex;
          }
        }

        @media (max-width: 600px) {
          .search-box {
            display: none;
          }

          .user-info-text {
            display: none;
          }

          .content-white-pane {
            padding: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
