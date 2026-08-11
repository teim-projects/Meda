import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logoImg from '../../assets/logo.png';
import { 
  Sun, 
  Wind,
  Search, 
  Bell, 
  LogOut, 
  ChevronDown, 
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
  X
} from 'lucide-react';
import { medaApi } from '../../services/medaApi';

const Sidebar = ({ children, currentUser, onLogout, isMedaConnected: propIsMedaConnected }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMedaConnected, setIsMedaConnected] = useState(propIsMedaConnected || false);
  const navigate = useNavigate();

  useEffect(() => {
    if (propIsMedaConnected !== undefined) {
      setIsMedaConnected(propIsMedaConnected);
    } else {
      medaApi.getStatus()
        .then((res) => setIsMedaConnected(res.is_connected))
        .catch(() => setIsMedaConnected(false));
    }
  }, [propIsMedaConnected]);

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

          <div className="logo-icon-wrap" style={{ overflow: 'hidden', padding: '0px', background: 'transparent' }}>
            <img src={logoImg} alt="meda logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div className="brand-text-wrap">
            <span className="brand-name">meda</span>
            <span className="brand-badge">PRO</span>
          </div>
        </div>

        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search meda platform..." 
            className="search-input" 
          />
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
        <aside className="sidebar-dark-pane desktop-sidebar">
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
                          title="Requires active MEDA login"
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
          --navbar-height: 60px;
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
          padding: 0 16px;
          z-index: 50;
        }

        .brand-section {
          display: flex;
          align-items: center;
          gap: 12px;
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
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .brand-text-wrap {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .brand-name {
          font-size: 1.15rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.5px;
        }

        .brand-badge {
          font-size: 0.65rem;
          font-weight: 800;
          background: #10b981;
          color: #ffffff;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .search-box {
          position: relative;
          width: 320px;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          color: #94a3b8;
        }

        .search-input {
          width: 100%;
          padding: 7px 12px 7px 38px;
          background: #f1f5f9;
          border: 1px solid transparent;
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
