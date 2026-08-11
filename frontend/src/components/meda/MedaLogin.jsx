import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Chip,
  Alert,
  CircularProgress,
  Snackbar,
  Paper,
  Stack,
  InputAdornment
} from '@mui/material';
import { 
  ShieldCheck, 
  Plug, 
  Unplug, 
  Clock, 
  Key, 
  User, 
  Lock, 
  ExternalLink,
  Sparkles,
  Activity,
  Check,
  Zap,
  Cpu
} from 'lucide-react';
import { medaApi } from '../../services/medaApi';

const MedaLogin = ({ onConnectionChange }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    static_token: '',
    user_id: '',
    password: '',
  });

  const [status, setStatus] = useState({
    is_connected: false,
    user_id: '',
    last_login_time: null,
    token_status: 'Disconnected',
    token_expiry: null,
  });

  const [loading, setLoading] = useState(false);
  const [disconnectLoading, setDisconnectLoading] = useState(false);
  const [fetchingStatus, setFetchingStatus] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const fetchStatus = async () => {
    try {
      setFetchingStatus(true);
      const res = await medaApi.getStatus();
      setStatus(res);
      if (onConnectionChange) {
        onConnectionChange(res.is_connected);
      }
    } catch (err) {
      console.error('Error fetching MEDA status:', err);
    } finally {
      setFetchingStatus(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleConnect = async (e) => {
    e.preventDefault();
    if (!formData.static_token || !formData.user_id || !formData.password) {
      setSnackbar({
        open: true,
        message: 'Please fill in Static Token, User ID, and Password.',
        severity: 'warning',
      });
      return;
    }

    setLoading(true);
    try {
      const res = await medaApi.connect(formData);
      if (res.success) {
        setSnackbar({
          open: true,
          message: 'Connected to MEDA API successfully!',
          severity: 'success',
        });
        setStatus(res.status);
        if (onConnectionChange) {
          onConnectionChange(true);
        }
      } else {
        setSnackbar({
          open: true,
          message: res.message || 'Connection failed.',
          severity: 'error',
        });
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Connection failed.';
      setSnackbar({
        open: true,
        message: errMsg,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setDisconnectLoading(true);
    try {
      const res = await medaApi.disconnect();
      if (res.success) {
        setSnackbar({
          open: true,
          message: 'Disconnected from MEDA API.',
          severity: 'info',
        });
        setStatus(res.status);
        if (onConnectionChange) {
          onConnectionChange(false);
        }
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Error disconnecting.',
        severity: 'error',
      });
    } finally {
      setDisconnectLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleString();
    } catch {
      return dateStr;
    }
  };

  return (
    <Box sx={{ width: '100%', p: { xs: 1, md: 1.5 }, pb: 8 }}>
      
      {/* 🌟 ULTRA-ATTRACTIVE HERO HEADER (Deep Slate-Emerald Theme) */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 3.5 },
          mb: 3.5,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #047857 100%)',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 12px 32px rgba(15, 23, 42, 0.18)',
          border: '1px solid rgba(16, 185, 129, 0.3)'
        }}
      >
        <Stack 
          direction={{ xs: 'column', md: 'row' }} 
          justifyContent="space-between" 
          alignItems={{ xs: 'flex-start', md: 'center' }} 
          spacing={2.5} 
          width="100%"
        >
          <Box sx={{ zIndex: 1, flex: 1, pr: { md: 3 } }}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.2 }}>
              <Box 
                sx={{
                  p: 1,
                  borderRadius: 2,
                  background: 'rgba(16, 185, 129, 0.25)',
                  border: '1px solid rgba(16, 185, 129, 0.45)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#34d399',
                  boxShadow: '0 0 15px rgba(16, 185, 129, 0.3)'
                }}
              >
                <Plug size={22} />
              </Box>
              <Chip 
                icon={<Sparkles size={13} style={{ color: '#34d399' }} />}
                label="MEDA AUTH ENGINE" 
                size="small" 
                sx={{ 
                  bgcolor: 'rgba(16, 185, 129, 0.2)', 
                  color: '#34d399 !important', 
                  border: '1px solid rgba(52, 211, 153, 0.4)',
                  fontWeight: 800,
                  fontSize: '0.72rem',
                  letterSpacing: '0.5px'
                }} 
              />
            </Stack>

            <Typography 
              variant="h4" 
              fontWeight={800} 
              sx={{ 
                letterSpacing: '-0.5px', 
                color: '#ffffff !important', 
                mb: 0.8, 
                fontSize: { xs: '1.35rem', sm: '1.65rem', md: '1.85rem' } 
              }}
            >
              MEDA API Authentication Gateway
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ color: '#e2e8f0 !important', lineHeight: 1.5, fontSize: '0.9rem', opacity: 0.9 }}
            >
              Connect Django backend securely to Mahadiscom MEDA API. OAuth2 JWT authentication and token refreshment is managed server-side.
            </Typography>
          </Box>

          <Stack 
            direction="row" 
            spacing={1.5} 
            alignItems="center" 
            sx={{ zIndex: 1, ml: { md: 'auto' }, flexShrink: 0 }}
          >
            {status.is_connected ? (
              <Chip
                icon={<ShieldCheck size={16} color="#34d399" />}
                label="CONNECTED & ACTIVE"
                sx={{ 
                  bgcolor: 'rgba(16, 185, 129, 0.25)', 
                  color: '#34d399 !important', 
                  border: '1px solid rgba(52, 211, 153, 0.5)',
                  fontWeight: 800,
                  fontSize: '0.78rem',
                  py: 2,
                  px: 1,
                  borderRadius: 3,
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.2)'
                }}
              />
            ) : (
              <Chip
                icon={<Unplug size={16} color="#f87171" />}
                label="DISCONNECTED"
                sx={{ 
                  bgcolor: 'rgba(239, 68, 68, 0.25)', 
                  color: '#f87171 !important', 
                  border: '1px solid rgba(248, 113, 113, 0.5)',
                  fontWeight: 800,
                  fontSize: '0.78rem',
                  py: 2,
                  px: 1,
                  borderRadius: 3
                }}
              />
            )}
          </Stack>
        </Stack>
      </Paper>

      {/* 🚀 MAIN CONTENT GRID (2 Column Responsive Deck) */}
      <Grid container spacing={3.5} width="100%">
        
        {/* LEFT COLUMN: Credentials Form Card */}
        <Grid item xs={12} md={7}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, sm: 3.5 },
              borderRadius: 4,
              border: '1.5px solid #e2e8f0',
              bgcolor: '#ffffff',
              boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
              <Box 
                sx={{ 
                  p: 1.2, 
                  borderRadius: 2.5, 
                  bgcolor: 'rgba(16, 185, 129, 0.12)', 
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center' 
                }}
              >
                <Key size={20} />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={800} color="#0f172a" sx={{ fontSize: '1.15rem' }}>
                  MEDA API Credentials
                </Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                  Provide static access token and credentials to initialize session
                </Typography>
              </Box>
            </Stack>

            {/* Info Notice Banner */}
            <Alert 
              severity="info" 
              icon={<Zap size={18} color="#059669" />}
              sx={{ 
                mb: 3, 
                borderRadius: 3, 
                bgcolor: 'rgba(16, 185, 129, 0.08)', 
                color: '#065f46',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                fontWeight: 600,
                fontSize: '0.84rem'
              }}
            >
              Enter your MEDA static API token and credentials. The JWT token will be acquired and stored securely on the Django backend.
            </Alert>

            <form onSubmit={handleConnect} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Stack spacing={2.5}>
                {/* Static Token Field */}
                <Box>
                  <Typography variant="caption" fontWeight={700} color="#475569" sx={{ mb: 0.8, display: 'block' }}>
                    Static Token (X-API-TOKEN) *
                  </Typography>
                  <TextField
                    name="static_token"
                    value={formData.static_token}
                    onChange={handleChange}
                    fullWidth
                    required
                    placeholder="e.g. meda_static_token_884920..."
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Box sx={{ p: 0.6, borderRadius: 1.5, bgcolor: '#f1f5f9', color: '#64748b', display: 'flex' }}>
                            <Key size={16} />
                          </Box>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ 
                      '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f8fafc', fontSize: '0.9rem' }
                    }}
                  />
                </Box>

                {/* MEDA User ID Field */}
                <Box>
                  <Typography variant="caption" fontWeight={700} color="#475569" sx={{ mb: 0.8, display: 'block' }}>
                    MEDA User ID *
                  </Typography>
                  <TextField
                    name="user_id"
                    value={formData.user_id}
                    onChange={handleChange}
                    fullWidth
                    required
                    placeholder="Enter official User ID"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Box sx={{ p: 0.6, borderRadius: 1.5, bgcolor: '#f1f5f9', color: '#64748b', display: 'flex' }}>
                            <User size={16} />
                          </Box>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ 
                      '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f8fafc', fontSize: '0.9rem' }
                    }}
                  />
                </Box>

                {/* MEDA Password Field */}
                <Box>
                  <Typography variant="caption" fontWeight={700} color="#475569" sx={{ mb: 0.8, display: 'block' }}>
                    MEDA Password *
                  </Typography>
                  <TextField
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    fullWidth
                    required
                    placeholder="Enter password"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Box sx={{ p: 0.6, borderRadius: 1.5, bgcolor: '#f1f5f9', color: '#64748b', display: 'flex' }}>
                            <Lock size={16} />
                          </Box>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ 
                      '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f8fafc', fontSize: '0.9rem' }
                    }}
                  />
                </Box>
              </Stack>

              {/* Action Buttons Row */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    boxShadow: '0 6px 20px rgba(16, 185, 129, 0.28)',
                    '&:hover': { background: 'linear-gradient(135deg, #059669 0%, #047857 100%)' },
                    py: 1.4,
                    px: 3,
                    borderRadius: 3,
                    fontWeight: 800,
                    fontSize: '0.92rem',
                    textTransform: 'none',
                    flex: 1,
                  }}
                  startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <Plug size={18} />}
                >
                  {loading ? 'Authenticating with MEDA...' : 'Connect to MEDA API'}
                </Button>

                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleDisconnect}
                  disabled={!status.is_connected || disconnectLoading}
                  sx={{
                    py: 1.4,
                    px: 3,
                    borderRadius: 3,
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    borderWidth: 1.5,
                    textTransform: 'none',
                  }}
                  startIcon={disconnectLoading ? <CircularProgress size={18} color="inherit" /> : <Unplug size={18} />}
                >
                  Disconnect
                </Button>
              </Stack>
            </form>
          </Paper>
        </Grid>

        {/* RIGHT COLUMN: Connection Status Overview Card */}
        <Grid item xs={12} md={5}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, sm: 3.5 },
              borderRadius: 4,
              border: '1.5px solid #e2e8f0',
              bgcolor: '#ffffff',
              boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <Box>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                <Box 
                  sx={{ 
                    p: 1.2, 
                    borderRadius: 2.5, 
                    bgcolor: 'rgba(56, 189, 248, 0.12)', 
                    color: '#0284c7',
                    display: 'flex',
                    alignItems: 'center' 
                  }}
                >
                  <Activity size={20} />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={800} color="#0f172a" sx={{ fontSize: '1.15rem' }}>
                    Live Connection Status
                  </Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    Real-time backend status & token security info
                  </Typography>
                </Box>
              </Stack>

              {fetchingStatus ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                  <CircularProgress size={32} color="success" />
                </Box>
              ) : (
                <Stack spacing={2} sx={{ mt: 2.5 }}>
                  {/* Item 1: Status Pill */}
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 2, 
                      borderRadius: 3, 
                      bgcolor: status.is_connected ? 'rgba(16, 185, 129, 0.04)' : '#f8fafc',
                      borderColor: status.is_connected ? 'rgba(16, 185, 129, 0.3)' : '#e2e8f0'
                    }}
                  >
                    <Typography variant="caption" color="#64748b" fontWeight={700} sx={{ letterSpacing: '0.5px' }}>
                      CONNECTION STATUS
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1.2} sx={{ mt: 0.8 }}>
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          bgcolor: status.is_connected ? '#10b981' : '#f43f5e',
                          boxShadow: status.is_connected ? '0 0 10px #10b981' : 'none'
                        }}
                      />
                      <Typography variant="subtitle1" fontWeight={800} color={status.is_connected ? '#065f46' : '#64748b'}>
                        {status.is_connected ? 'Active MEDA Connection' : 'Disconnected'}
                      </Typography>
                    </Stack>
                  </Paper>

                  {/* Item 2: User ID */}
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: '#f8fafc', borderColor: '#e2e8f0' }}>
                    <Typography variant="caption" color="#64748b" fontWeight={700} sx={{ letterSpacing: '0.5px' }}>
                      CONNECTED USER ID
                    </Typography>
                    <Typography variant="subtitle2" fontWeight={800} color="#0f172a" sx={{ mt: 0.5, fontSize: '0.95rem' }}>
                      {status.user_id || 'No active session'}
                    </Typography>
                  </Paper>

                  {/* Item 3: Last Login Time */}
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: '#f8fafc', borderColor: '#e2e8f0' }}>
                    <Typography variant="caption" color="#64748b" fontWeight={700} sx={{ letterSpacing: '0.5px' }}>
                      LAST AUTHENTICATION TIMESTAMP
                    </Typography>
                    <Typography variant="body2" fontWeight={600} color="#334155" sx={{ mt: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Clock size={15} color="#0284c7" /> {formatDate(status.last_login_time)}
                    </Typography>
                  </Paper>

                  {/* Item 4: Token Status & Expiry */}
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: '#f8fafc', borderColor: '#e2e8f0' }}>
                    <Typography variant="caption" color="#64748b" fontWeight={700} sx={{ letterSpacing: '0.5px' }}>
                      TOKEN LIFECYCLE
                    </Typography>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 0.8 }}>
                      <Chip
                        label={status.token_status || 'Inactive'}
                        size="small"
                        sx={{
                          bgcolor: status.token_status === 'Active' ? '#dcfce7' : '#f1f5f9',
                          color: status.token_status === 'Active' ? '#15803d' : '#64748b',
                          fontWeight: 800,
                          fontSize: '0.72rem'
                        }}
                      />
                      <Typography variant="caption" color="#64748b" fontWeight={600}>
                        Exp: {formatDate(status.token_expiry)}
                      </Typography>
                    </Stack>
                  </Paper>
                </Stack>
              )}
            </Box>

            {/* Quick Action Footer Button */}
            {status.is_connected && (
              <Button
                variant="contained"
                onClick={() => navigate('/meda/fetch')}
                sx={{ 
                  mt: 3, 
                  py: 1.3,
                  borderRadius: 3, 
                  background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  textTransform: 'none',
                  boxShadow: '0 4px 14px rgba(2, 132, 199, 0.25)'
                }}
                endIcon={<ExternalLink size={16} />}
              >
                Go to Fetch Data Page
              </Button>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Snackbar Notification Alert */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity} 
          sx={{ width: '100%', borderRadius: 2.5, fontWeight: 600 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MedaLogin;
