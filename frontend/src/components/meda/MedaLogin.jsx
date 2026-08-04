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
  Divider
} from '@mui/material';
import { ShieldCheck, Plug, Unplug, Clock, Key, User, Lock, ExternalLink } from 'lucide-react';
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
          message: 'Connected to MEDA successfully! Redirecting to Fetch Data...',
          severity: 'success',
        });
        setStatus(res.status);
        if (onConnectionChange) {
          onConnectionChange(true);
        }
        setTimeout(() => {
          navigate('/meda/fetch');
        }, 1200);
      } else {
        setSnackbar({
          open: true,
          message: res.message || 'Failed to connect to MEDA API.',
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
    <Box sx={{ maxWidth: 1100, mx: 'auto', p: { xs: 2, md: 3 } }}>
      {/* Header Banner */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Plug color="#10b981" size={28} /> MEDA API Authentication
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>
            Connect Django backend securely to Mahadiscom MEDA API. Token management is completely handled server-side.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {status.is_connected ? (
            <Chip
              icon={<ShieldCheck size={16} color="#10b981" />}
              label="Connected & Active"
              sx={{ bgcolor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.4)', fontWeight: 600 }}
            />
          ) : (
            <Chip
              icon={<Unplug size={16} color="#f43f5e" />}
              label="Disconnected"
              sx={{ bgcolor: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e', border: '1px solid rgba(244, 63, 94, 0.4)', fontWeight: 600 }}
            />
          )}
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* Left Column: Form Controls */}
        <Grid item xs={12} md={7}>
          <Card elevation={1} sx={{ borderRadius: 3, border: '1px solid #e2e8f0' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom sx={{ color: '#0f172a', mb: 2 }}>
                MEDA Credentials
              </Typography>
              <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                Enter your MEDA static API token and credentials. The JWT will be acquired and stored securely on Django backend.
              </Alert>

              <form onSubmit={handleConnect}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <TextField
                    label="Static Token"
                    name="static_token"
                    value={formData.static_token}
                    onChange={handleChange}
                    fullWidth
                    required
                    placeholder="Enter X-API-TOKEN"
                    variant="outlined"
                    InputProps={{
                      startAdornment: <Key size={18} style={{ marginRight: 8, color: '#64748b' }} />,
                    }}
                  />

                  <TextField
                    label="MEDA User ID"
                    name="user_id"
                    value={formData.user_id}
                    onChange={handleChange}
                    fullWidth
                    required
                    placeholder="Enter User ID"
                    variant="outlined"
                    InputProps={{
                      startAdornment: <User size={18} style={{ marginRight: 8, color: '#64748b' }} />,
                    }}
                  />

                  <TextField
                    label="MEDA Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    fullWidth
                    required
                    placeholder="Enter Password"
                    variant="outlined"
                    InputProps={{
                      startAdornment: <Lock size={18} style={{ marginRight: 8, color: '#64748b' }} />,
                    }}
                  />

                  <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      sx={{
                        bgcolor: '#10b981',
                        '&:hover': { bgcolor: '#059669' },
                        px: 4,
                        py: 1.2,
                        borderRadius: 2,
                        fontWeight: 600,
                        textTransform: 'none',
                        flex: 1,
                      }}
                      startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <Plug size={18} />}
                    >
                      {loading ? 'Connecting...' : 'Connect'}
                    </Button>

                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleDisconnect}
                      disabled={!status.is_connected || disconnectLoading}
                      sx={{
                        px: 3,
                        py: 1.2,
                        borderRadius: 2,
                        fontWeight: 600,
                        textTransform: 'none',
                      }}
                      startIcon={disconnectLoading ? <CircularProgress size={18} color="inherit" /> : <Unplug size={18} />}
                    >
                      Disconnect
                    </Button>
                  </Box>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column: Connection Status Overview */}
        <Grid item xs={12} md={5}>
          <Card elevation={1} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', height: '100%' }}>
            <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Typography variant="h6" fontWeight={700} gutterBottom sx={{ color: '#0f172a' }}>
                Connection Status
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Live backend status information and token metadata.
              </Typography>

              {fetchingStatus ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                  <CircularProgress size={30} />
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: '#f8fafc' }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      CONNECTION STATUS
                    </Typography>
                    <Box sx={{ mt: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          bgcolor: status.is_connected ? '#10b981' : '#f43f5e',
                        }}
                      />
                      <Typography variant="body1" fontWeight={700} color={status.is_connected ? '#0f172a' : '#64748b'}>
                        {status.is_connected ? 'Connected to MEDA' : 'Disconnected'}
                      </Typography>
                    </Box>
                  </Paper>

                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: '#f8fafc' }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      MEDA USER ID
                    </Typography>
                    <Typography variant="body1" fontWeight={600} sx={{ mt: 0.5, color: '#0f172a' }}>
                      {status.user_id || 'Not connected'}
                    </Typography>
                  </Paper>

                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: '#f8fafc' }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      LAST LOGIN TIME
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5, color: '#475569', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Clock size={16} /> {formatDate(status.last_login_time)}
                    </Typography>
                  </Paper>

                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: '#f8fafc' }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      TOKEN STATUS & EXPIRY
                    </Typography>
                    <Box sx={{ mt: 0.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip
                        label={status.token_status}
                        size="small"
                        color={status.token_status === 'Active' ? 'success' : 'default'}
                      />
                      <Typography variant="caption" color="text.secondary">
                        Exp: {formatDate(status.token_expiry)}
                      </Typography>
                    </Box>
                  </Paper>

                  {status.is_connected && (
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => navigate('/meda/fetch')}
                      sx={{ mt: 'auto', textTransform: 'none', borderRadius: 2, fontWeight: 600 }}
                      endIcon={<ExternalLink size={16} />}
                    >
                      Go to Fetch Data Page
                    </Button>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Snackbar Alert */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MedaLogin;
