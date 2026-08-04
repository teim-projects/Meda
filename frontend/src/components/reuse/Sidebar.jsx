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
  Lock
} from 'lucide-react';
import { medaApi } from '../../services/medaApi';

const Sidebar = ({ children, currentUser, onLogout, isMedaConnected: propIsMedaConnected }) => {
  const [showDropdown, setShowDropdown] = useState(false);
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
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
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
      {/* Top Navbar Section (Clean White Theme) */}
      <header className="navbar-container">
        <div className="brand-section">
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
        {/* Left Sidebar Pane (Dark Colored Theme) */}
        <aside className="sidebar-dark-pane">
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

            {/* MEDA Integration Navigation Section */}
            <div className="nav-group">
              <p className="nav-group-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: 10 }}>
                <span>MEDA INTEGRATION</span>
                <span style={{ 
                  fontSize: '0.6rem', 
                  padding: '2px 6px', 
                  borderRadius: 10, 
                  background: isMedaConnected ? 'rgba(16,185,129,0.2)' : 'rgba(244,63,94,0.2)',
                  color: isMedaConnected ? '#10b981' : '#f43f5e' 
                }}>
                  {isMedaConnected ? 'ONLINE' : 'OFFLINE'}
                </span>
              </p>
              <ul className="nav-list">
                {medaNavItems.map((item) => {
                  const Icon = item.icon;
                  const isLocked = item.requiresAuth && !isMedaConnected;
                  return (
                    <li key={item.name}>
                      {isLocked ? (
                        <div 
                          className="dark-nav-link disabled"
                          style={{ opacity: 0.45, cursor: 'not-allowed', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                          title="Please connect MEDA first on MEDA Login page"
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <Icon size={18} className="link-icon" />
                            <span>{item.name}</span>
                          </div>
                          <Lock size={14} color="#f43f5e" />
                        </div>
                      ) : (
                        <NavLink 
                          to={item.path} 
                          className={({ isActive }) => `dark-nav-link ${isActive ? 'active' : ''}`}
                        >
                          <Icon size={18} className="link-icon" />
                          <span>{item.name}</span>
                        </NavLink>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

         

          <div className="sidebar-footer">
            <button type="button" onClick={handleLogout} className="logout-btn">
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>


        {/* Page Content Pane (White Theme) */}
        <main className="content-white-pane">
          <div className="content-max-wrap">
            {children}
          </div>
        </main>
      </div>

      <style>{`
        .app-shell {
          height: 100vh;
          width: 100vw;
          display: flex;
          flex-direction: column;
          background: #f8fafc;
          overflow: hidden;
        }

        /* Top Navbar - Clean White Theme */
        .navbar-container {
          height: var(--navbar-height);
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          z-index: 50;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
        }

        .brand-section {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon-wrap {
          width: 90px;
          height: 90px;
          border-radius: 16px;
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
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: -0.5px;
          background: linear-gradient(135deg, #0f172a 0%, #10b981 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-transform: lowercase;
        }

        .brand-badge {
          font-size: 0.65rem;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 20px;
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.25);
        }

        .search-box {
          position: relative;
          width: 380px;
          max-width: 40%;
        }

        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        .search-input {
          width: 100%;
          padding: 9px 14px 9px 42px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          color: #0f172a;
          font-size: 0.88rem;
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
          gap: 14px;
        }

        .nav-icon-btn {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #64748b;
          width: 38px;
          height: 38px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;
          transition: all 0.2s ease;
        }

        .nav-icon-btn:hover {
          color: #0f172a;
          border-color: #cbd5e1;
          background: #ffffff;
        }

        .notification-dot {
          position: absolute;
          top: 7px;
          right: 7px;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #f43f5e;
        }

        .user-profile-rel {
          position: relative;
        }

        .user-profile-btn {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 5px 10px 5px 5px;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .user-profile-btn:hover {
          border-color: #cbd5e1;
        }

        .avatar-circle {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
          color: white;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
        }

        .user-info-text {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .user-name {
          font-size: 0.82rem;
          font-weight: 600;
          color: #0f172a;
        }

        .user-role {
          font-size: 0.68rem;
          color: #64748b;
        }

        .chevron {
          color: #94a3b8;
          transition: transform 0.2s ease;
        }

        .chevron.open {
          transform: rotate(180deg);
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
          font-weight: 600;
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
        }

        /* Sidebar - Dark Colored Theme */
        .sidebar-dark-pane {
          width: var(--sidebar-width);
          min-width: var(--sidebar-width);
          background: #0f172a;
          border-right: 1px solid #1e293b;
          padding: 20px 16px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 20px;
          height: 100%;
        }

        .nav-group-title {
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.8px;
          color: #64748b;
          margin-bottom: 12px;
          padding-left: 10px;
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
          gap: 12px;
          padding: 10px 14px;
          border-radius: 10px;
          color: #94a3b8;
          text-decoration: none;
          font-size: 0.88rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .dark-nav-link:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.05);
        }

        .dark-nav-link.active {
          color: #ffffff;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(6, 182, 212, 0.15) 100%);
          border: 1px solid rgba(16, 185, 129, 0.4);
          font-weight: 600;
        }

        .dark-nav-link.active .link-icon {
          color: #10b981;
        }

        .sidebar-dark-card {
          background: #1e293b;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .card-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          align-self: flex-start;
          font-size: 0.63rem;
          font-weight: 700;
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
          padding: 2px 7px;
          border-radius: 20px;
        }

        .sidebar-dark-card h4 {
          font-size: 0.88rem;
          font-weight: 700;
          color: #ffffff;
        }

        .sidebar-dark-card p {
          font-size: 0.75rem;
          color: #94a3b8;
          line-height: 1.3;
        }

        .card-btn {
          margin-top: 4px;
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #10b981;
          font-size: 0.72rem;
          font-weight: 600;
          padding: 6px 10px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 10px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.25);
          color: #f87171;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.2);
        }

        /* Content Area - Clean White Theme */
        .content-white-pane {
          flex: 1;
          background: #f8fafc;
          padding: 24px 28px;
          overflow-y: auto;
          height: 100%;
        }

        .content-max-wrap {
          max-width: 1400px;
          margin: 0 auto;
        }

        @media (max-width: 900px) {
          .sidebar-dark-pane {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
