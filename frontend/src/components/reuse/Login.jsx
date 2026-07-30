import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Sun, 
  Wind, 
  ShieldCheck, 
  Lock, 
  User, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Leaf,
  Globe,
  BatteryCharging
} from 'lucide-react';

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/accounts/login/', {
        username,
        password
      });

      const { access, refresh, user } = response.data;
      
      localStorage.setItem('token', access);
      localStorage.setItem('refresh', refresh);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('username', user.username);

      setSuccess('Superadmin authenticated! Opening meda dashboard...');
      
      if (onLoginSuccess) {
        onLoginSuccess(user);
      }

      setTimeout(() => {
        navigate('/dashboard');
      }, 700);

    } catch (err) {
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        let errorMsg = 'Invalid username or password.';
        
        if (typeof errorData === 'string') {
          errorMsg = 'Backend routing error: Please verify server configuration.';
        } else if (errorData.non_field_errors) {
          errorMsg = errorData.non_field_errors[0];
        } else if (errorData.detail) {
          errorMsg = errorData.detail;
        } else if (errorData.username) {
          errorMsg = errorData.username[0];
        } else if (errorData.password) {
          errorMsg = errorData.password[0];
        }
        
        setError(errorMsg);
      } else {
        setError('Cannot connect to backend server. Please verify Django backend is running at http://localhost:8000');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-light-container">
      <div className="login-light-card animate-fade-in">
        {/* Left Side: Renewable Energy Panel (Clean Teal/Green Theme) */}
        <div className="renewable-info-panel">
          <div className="renewable-header">
            <div className="meda-logo-badge">
              <Sun size={22} />
            </div>
            <div>
              <h2 className="meda-title">meda</h2>
              <p className="meda-subtitle">Maharashtra Energy Development Agency</p>
            </div>
          </div>

          <div className="renewable-hero-text">
            <h3>Powering Sustainability with Renewable Energy</h3>
            <p>
              Leading the state transition towards green energy, solar grids, wind generation, and zero-emission sustainability.
            </p>
          </div>

          <div className="energy-stats-grid">
            <div className="energy-card">
              <div className="ec-icon yellow"><Sun size={18} /></div>
              <div className="ec-info">
                <span className="ec-val">4.8 GW</span>
                <span className="ec-lbl">Solar Installed</span>
              </div>
            </div>

            <div className="energy-card">
              <div className="ec-icon cyan"><Wind size={18} /></div>
              <div className="ec-info">
                <span className="ec-val">5.2 GW</span>
                <span className="ec-lbl">Wind Power</span>
              </div>
            </div>

            <div className="energy-card">
              <div className="ec-icon green"><Leaf size={18} /></div>
              <div className="ec-info">
                <span className="ec-val">12.4M</span>
                <span className="ec-lbl">Tons CO₂ Saved</span>
              </div>
            </div>

            <div className="energy-card">
              <div className="ec-icon purple"><BatteryCharging size={18} /></div>
              <div className="ec-info">
                <span className="ec-val">99.8%</span>
                <span className="ec-lbl">Grid Reliability</span>
              </div>
            </div>
          </div>

          <div className="energy-footer-tag">
            <Globe size={15} /> <span>Clean & Green Energy Initiative</span>
          </div>
        </div>

        {/* Right Side: Superadmin Login Portal (Crisp White Theme) */}
        <div className="login-form-panel">
          <div className="form-header">
            <div className="auth-badge">
              <ShieldCheck size={16} /> Official Portal
            </div>
            <h2>Superadmin Sign In</h2>
            <p>Enter your Django database superuser credentials</p>
          </div>

          {error && (
            <div className="alert-banner error">
              <AlertCircle size={17} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="alert-banner success">
              <CheckCircle2 size={17} />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label className="form-label">Superuser Username</label>
              <div className="input-icon-wrap">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  className="input-field with-icon"
                  placeholder="Enter superuser username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Superuser Password</label>
              <div className="input-icon-wrap">
                <Lock size={18} className="input-icon" />
                <input
                  type="password"
                  className="input-field with-icon"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary login-btn" disabled={loading}>
              {loading ? 'Authenticating Credentials...' : (
                <>
                  <span>Authenticate & Open Dashboard</span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          <div className="form-footer">
            <p className="sec-note">
              🔒 Protected by meda Enterprise Security & JWT Token Authentication
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .login-light-container {
          min-height: 100vh;
          width: 100vw;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f1f5f9;
          padding: 20px;
        }

        .login-light-card {
          width: 100%;
          max-width: 920px;
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          border-radius: 20px;
          overflow: hidden;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.08);
        }

        @media (max-width: 820px) {
          .login-light-card {
            grid-template-columns: 1fr;
          }
          .renewable-info-panel {
            display: none;
          }
        }

        .renewable-info-panel {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: white;
          padding: 36px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 24px;
        }

        .renewable-header {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .meda-logo-badge {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
        }

        .meda-title {
          font-size: 1.6rem;
          font-weight: 800;
          background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-transform: lowercase;
          line-height: 1;
        }

        .meda-subtitle {
          font-size: 0.72rem;
          color: #94a3b8;
          margin-top: 3px;
        }

        .renewable-hero-text h3 {
          font-size: 1.3rem;
          font-weight: 700;
          color: #ffffff;
          line-height: 1.35;
        }

        .renewable-hero-text p {
          font-size: 0.85rem;
          color: #94a3b8;
          margin-top: 8px;
          line-height: 1.45;
        }

        .energy-stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .energy-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .ec-icon {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ec-icon.yellow { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
        .ec-icon.cyan { background: rgba(6, 182, 212, 0.2); color: #22d3ee; }
        .ec-icon.green { background: rgba(16, 185, 129, 0.2); color: #34d399; }
        .ec-icon.purple { background: rgba(139, 92, 246, 0.2); color: #a78bfa; }

        .ec-info {
          display: flex;
          flex-direction: column;
        }

        .ec-val {
          font-size: 1rem;
          font-weight: 800;
          color: #ffffff;
        }

        .ec-lbl {
          font-size: 0.68rem;
          color: #94a3b8;
        }

        .energy-footer-tag {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          color: #34d399;
          font-weight: 600;
        }

        .login-form-panel {
          padding: 36px;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .auth-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 20px;
          background: #ecfdf5;
          color: #059669;
          border: 1px solid #a7f3d0;
          font-size: 0.7rem;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .form-header h2 {
          font-size: 1.55rem;
          font-weight: 800;
          color: #0f172a;
        }

        .form-header p {
          font-size: 0.82rem;
          color: #64748b;
          margin-top: 3px;
          margin-bottom: 20px;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .form-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: #475569;
        }

        .input-icon-wrap {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        .input-field.with-icon {
          padding-left: 42px;
        }

        .login-btn {
          width: 100%;
          padding: 12px;
          margin-top: 8px;
          font-size: 0.9rem;
        }

        .alert-banner {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 10px;
          font-size: 0.82rem;
          margin-bottom: 16px;
        }

        .alert-banner.error {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
        }

        .alert-banner.success {
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          color: #059669;
        }

        .form-footer {
          margin-top: 20px;
          padding-top: 14px;
          border-top: 1px solid #e2e8f0;
          text-align: center;
        }

        .sec-note {
          font-size: 0.72rem;
          color: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default Login;
