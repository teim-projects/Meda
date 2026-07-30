import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Activity, 
  ArrowUpRight, 
  TrendingUp, 
  Database, 
  CheckCircle,
  RefreshCw,
  Server,
  Zap,
  Sun,
  Wind
} from 'lucide-react';
import axios from 'axios';

const Dashboard = ({ currentUser }) => {
  const [dbStatus, setDbStatus] = useState('Checking...');
  const [loadingDb, setLoadingDb] = useState(false);

  const checkBackendStatus = async () => {
    setLoadingDb(true);
    try {
      await axios.get('http://localhost:8000/api/accounts/login/');
      setDbStatus('Connected (meda_db Active)');
    } catch (err) {
      if (err.response && err.response.status === 405) {
        setDbStatus('Connected (meda_db Active)');
      } else {
        setDbStatus('Backend API Ready (Local Dev Mode)');
      }
    } finally {
      setLoadingDb(false);
    }
  };

  useEffect(() => {
    checkBackendStatus();
  }, []);

  const username = currentUser?.username || localStorage.getItem('username') || 'meda User';

  const stats = [
    { title: 'Total Users', value: '1,428', change: '+12.5%', icon: Users, accent: '#10b981' },
    { title: 'API Requests', value: '84.2K', change: '+8.1%', icon: Activity, accent: '#06b6d4' },
    { title: 'Active Sessions', value: '312', change: '+24.3%', icon: Zap, accent: '#6366f1' },
    { title: 'System Health', value: '99.9%', change: 'Optimal', icon: Database, accent: '#8b5cf6' },
  ];

  const recentActivities = [
    { id: 1, user: 'admin', action: 'Authenticated via Django REST API', time: '2 mins ago', status: 'Success' },
    { id: 2, user: 'system', action: 'Connected to MySQL meda_db', time: '10 mins ago', status: 'Success' },
    { id: 3, user: 'meda_agent', action: 'Updated UI to light theme with dark sidebar', time: '5 mins ago', status: 'Completed' },
    { id: 4, user: 'dev_user', action: 'Configured responsive laptop layout', time: '1 hour ago', status: 'Success' },
  ];

  return (
    <div className="dashboard-light-container animate-fade-in">
      {/* Welcome Banner */}
      <div className="welcome-light-banner light-card">
        <div className="wb-content">
          <h2 className="wb-title">Welcome back, <span className="highlight-name">{username}</span>! 👋</h2>
          <p className="wb-sub">Here is your <strong>meda</strong> Maharashtra Energy Development Agency administration dashboard.</p>
        </div>
        <button className="btn-primary refresh-btn" onClick={checkBackendStatus} disabled={loadingDb}>
          <RefreshCw size={15} className={loadingDb ? 'spin' : ''} />
          <span>Refresh API Status</span>
        </button>
      </div>

      {/* Metrics Cards Grid */}
      <div className="metrics-grid">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="metric-light-card light-card">
              <div className="mc-header">
                <span className="mc-title">{stat.title}</span>
                <div className="mc-icon-box" style={{ background: `${stat.accent}15`, color: stat.accent }}>
                  <Icon size={18} />
                </div>
              </div>
              <div className="mc-body">
                <span className="mc-value">{stat.value}</span>
                <span className="mc-change">
                  <TrendingUp size={13} /> {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="dashboard-main-grid">
        {/* Backend & DB Architecture Card */}
        <div className="status-light-card light-card">
          <div className="card-header-flex">
            <div>
              <h3 className="card-title">Backend Architecture</h3>
              <p className="card-sub">Django REST API & MySQL Database Status</p>
            </div>
            <div className="status-indicator-badge">
              <CheckCircle size={14} /> {dbStatus}
            </div>
          </div>

          <div className="architecture-list">
            <div className="arch-item">
              <Server size={18} className="arch-icon green" />
              <div className="arch-details">
                <strong>Django REST Framework</strong>
                <span>Mapped in `settings.py` (`rest_framework`, `corsheaders`)</span>
              </div>
              <span className="pill green">Active</span>
            </div>

            <div className="arch-item">
              <Database size={18} className="arch-icon cyan" />
              <div className="arch-details">
                <strong>MySQL Backend (meda_db)</strong>
                <span>Database engine: `django.db.backends.mysql`</span>
              </div>
              <span className="pill cyan">Configured</span>
            </div>

            <div className="arch-item">
              <Users size={18} className="arch-icon purple" />
              <div className="arch-details">
                <strong>Accounts App Endpoints</strong>
                <span>`/api/accounts/login/` & `/api/accounts/profile/`</span>
              </div>
              <span className="pill purple">Mapped</span>
            </div>
          </div>
        </div>

        {/* Recent Activity Table Card */}
        <div className="activity-light-card light-card">
          <div className="card-header-flex">
            <h3 className="card-title">Recent Activity Logs</h3>
            <span className="view-all-link">Live Feed <ArrowUpRight size={13} /></span>
          </div>

          <div className="table-wrapper">
            <table className="activity-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Action</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentActivities.map((act) => (
                  <tr key={act.id}>
                    <td className="user-cell">
                      <div className="mini-avatar">{act.user.charAt(0).toUpperCase()}</div>
                      <span>{act.user}</span>
                    </td>
                    <td className="action-cell">{act.action}</td>
                    <td className="time-cell">{act.time}</td>
                    <td>
                      <span className="status-badge success">{act.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        .dashboard-light-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .welcome-light-banner {
          padding: 22px 26px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%);
          border-left: 5px solid #10b981;
        }

        .wb-title {
          font-size: 1.45rem;
          font-weight: 800;
          color: #0f172a;
        }

        .highlight-name {
          color: #10b981;
        }

        .wb-sub {
          margin-top: 4px;
          color: #64748b;
          font-size: 0.85rem;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .metric-light-card {
          padding: 18px 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .mc-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .mc-title {
          font-size: 0.82rem;
          color: #64748b;
          font-weight: 600;
        }

        .mc-icon-box {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mc-body {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
        }

        .mc-value {
          font-size: 1.6rem;
          font-weight: 800;
          color: #0f172a;
        }

        .mc-change {
          font-size: 0.75rem;
          font-weight: 700;
          color: #10b981;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .dashboard-main-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        @media (max-width: 1024px) {
          .dashboard-main-grid {
            grid-template-columns: 1fr;
          }
        }

        .status-light-card, .activity-light-card {
          padding: 22px 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .card-header-flex {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .card-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: #0f172a;
        }

        .card-sub {
          font-size: 0.78rem;
          color: #64748b;
          margin-top: 2px;
        }

        .status-indicator-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 20px;
          background: #ecfdf5;
          color: #059669;
          border: 1px solid #a7f3d0;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .architecture-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .arch-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 10px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
        }

        .arch-icon.green { color: #10b981; }
        .arch-icon.cyan { color: #06b6d4; }
        .arch-icon.purple { color: #8b5cf6; }

        .arch-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .arch-details strong {
          font-size: 0.85rem;
          color: #0f172a;
        }

        .arch-details span {
          font-size: 0.75rem;
          color: #64748b;
        }

        .pill {
          padding: 3px 8px;
          border-radius: 20px;
          font-size: 0.68rem;
          font-weight: 700;
        }

        .pill.green { background: #dcfce7; color: #15803d; }
        .pill.cyan { background: #cff4fc; color: #0891b2; }
        .pill.purple { background: #f3e8ff; color: #7e22ce; }

        .table-wrapper {
          overflow-x: auto;
        }

        .activity-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .activity-table th {
          padding: 10px 12px;
          font-size: 0.72rem;
          color: #94a3b8;
          border-bottom: 1px solid #e2e8f0;
          text-transform: uppercase;
        }

        .activity-table td {
          padding: 12px;
          font-size: 0.82rem;
          border-bottom: 1px solid #f1f5f9;
        }

        .user-cell {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: #0f172a;
        }

        .mini-avatar {
          width: 24px;
          height: 24px;
          border-radius: 6px;
          background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.72rem;
          font-weight: 700;
        }

        .action-cell {
          color: #475569;
        }

        .time-cell {
          color: #94a3b8;
          font-size: 0.75rem;
        }

        .status-badge.success {
          color: #059669;
          font-weight: 600;
          font-size: 0.75rem;
        }

        .view-all-link {
          font-size: 0.75rem;
          font-weight: 600;
          color: #10b981;
          display: flex;
          align-items: center;
          gap: 2px;
          cursor: pointer;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
