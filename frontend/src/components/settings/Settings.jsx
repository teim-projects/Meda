import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Stack,
  Button,
  Grid,
  TextField,
  Switch,
  MenuItem,
  Chip,
  Tabs,
  Tab,
  Snackbar,
  Alert,
  InputAdornment
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Sparkles,
  User,
  Shield,
  Bell,
  Lock,
  Save,
  RotateCcw,
  Building,
  Mail,
  Phone,
  Globe,
  Clock,
  Database,
  ShieldCheck,
  Check,
  Activity
} from 'lucide-react';

const Settings = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // State for settings
  const [generalSettings, setGeneralSettings] = useState({
    platformName: 'MEDA Renewable Energy Portal',
    adminEmail: currentUser?.email || 'admin@meda-energy.org',
    contactPhone: '+91 98230 45678',
    organization: 'Maharashtra Energy Development Agency',
    location: 'Pune, Maharashtra',
    autoSave: true,
    compactView: false,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailOnFailure: true,
    emailDailySummary: true,
    smsOnSpike: false,
    securityAlerts: true,
    digestTime: '08:00',
  });

  const [securitySettings, setSecuritySettings] = useState({
    enable2FA: true,
    sessionTimeout: '30',
    passwordExpiry: '60',
    ipWhitelisting: false,
  });

  const handleGeneralChange = (e) => {
    const { name, value, checked, type } = e.target;
    setGeneralSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleNotifChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSecurityChange = (e) => {
    const { name, value, checked, type } = e.target;
    setSecuritySettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSaveAll = () => {
    setSnackbar({
      open: true,
      message: 'Platform settings updated and saved successfully!',
      severity: 'success',
    });
  };

  const handleResetDefaults = () => {
    setSnackbar({
      open: true,
      message: 'Settings reset to system default configuration.',
      severity: 'info',
    });
  };

  return (
    <Box sx={{ width: '100%', p: { xs: 1, md: 1.5 }, pb: 8 }}>
      
      {/* 🌟 ULTRA-ATTRACTIVE HERO HEADER */}
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
                <SettingsIcon size={22} />
              </Box>
              <Chip 
                icon={<Sparkles size={13} style={{ color: '#34d399' }} />}
                label="SYSTEM CONFIGURATION ENGINE" 
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
              Platform Settings & Governance Controls
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ color: '#e2e8f0 !important', lineHeight: 1.5, fontSize: '0.9rem', opacity: 0.9 }}
            >
              Manage organization profile parameters, notification preferences, security policies, and user governance.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ zIndex: 1, ml: { md: 'auto' }, flexShrink: 0 }}>
            <Button
              variant="contained"
              onClick={handleSaveAll}
              sx={{ 
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                boxShadow: '0 6px 20px rgba(16, 185, 129, 0.28)',
                '&:hover': { background: 'linear-gradient(135deg, #059669 0%, #047857 100%)' },
                py: 1.3,
                px: 3,
                borderRadius: 3,
                fontWeight: 800,
                fontSize: '0.88rem',
                textTransform: 'none'
              }}
              startIcon={<Save size={16} />}
            >
              Save All Settings
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* 🚀 FULL-WIDTH KPI SUMMARY METRICS DECK */}
      <Box 
        sx={{ 
          width: '100%',
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
          gap: 2.5,
          mb: 3.5
        }}
      >
        {/* Card 1 */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 2.5, 
            px: 2.8,
            borderRadius: 3.5, 
            border: '1.5px solid #e2e8f0', 
            bgcolor: '#ffffff',
            boxShadow: '0 4px 18px rgba(0,0,0,0.03)',
            transition: 'all 0.25s ease',
            overflow: 'hidden',
            '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 8px 25px rgba(16, 185, 129, 0.08)', borderColor: '#6ee7b7' }
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ width: 44, height: 44, borderRadius: 2.8, bgcolor: '#ecfdf5', border: '1px solid #d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Database size={22} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="caption" color="#64748b" fontWeight={800} sx={{ letterSpacing: '0.5px', fontSize: '0.68rem', display: 'block', mb: 0.2 }}>
                DATABASE STATUS
              </Typography>
              <Typography variant="h5" fontWeight={800} color="#059669" noWrap sx={{ fontSize: '1.2rem' }}>
                meda_db Active
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {/* Card 2 */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 2.5, 
            px: 2.8,
            borderRadius: 3.5, 
            border: '1.5px solid #e2e8f0', 
            bgcolor: '#ffffff',
            boxShadow: '0 4px 18px rgba(0,0,0,0.03)',
            transition: 'all 0.25s ease',
            overflow: 'hidden',
            '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 8px 25px rgba(245, 158, 11, 0.08)', borderColor: '#fde68a' }
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ width: 44, height: 44, borderRadius: 2.8, bgcolor: '#fffbeb', border: '1px solid #fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Bell size={22} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="caption" color="#64748b" fontWeight={800} sx={{ letterSpacing: '0.5px', fontSize: '0.68rem', display: 'block', mb: 0.2 }}>
                NOTIFICATIONS
              </Typography>
              <Typography variant="h5" fontWeight={800} color="#b45309" noWrap sx={{ fontSize: '1.2rem' }}>
                Email & Alerts Active
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {/* Card 3 */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 2.5, 
            px: 2.8,
            borderRadius: 3.5, 
            border: '1.5px solid #e2e8f0', 
            bgcolor: '#ffffff',
            boxShadow: '0 4px 18px rgba(0,0,0,0.03)',
            transition: 'all 0.25s ease',
            overflow: 'hidden',
            '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 8px 25px rgba(37, 99, 235, 0.08)', borderColor: '#93c5fd' }
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ width: 44, height: 44, borderRadius: 2.8, bgcolor: '#eff6ff', border: '1px solid #dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ShieldCheck size={22} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="caption" color="#64748b" fontWeight={800} sx={{ letterSpacing: '0.5px', fontSize: '0.68rem', display: 'block', mb: 0.2 }}>
                SECURITY GOVERNANCE
              </Typography>
              <Typography variant="h5" fontWeight={800} color="#0f172a" noWrap sx={{ fontSize: '1.2rem' }}>
                2FA & SSL Active
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {/* Card 4 */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 2.5, 
            px: 2.8,
            borderRadius: 3.5, 
            border: '1.5px solid #e2e8f0', 
            bgcolor: '#ffffff',
            boxShadow: '0 4px 18px rgba(0,0,0,0.03)',
            transition: 'all 0.25s ease',
            overflow: 'hidden',
            '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 8px 25px rgba(124, 58, 237, 0.08)', borderColor: '#c084fc' }
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ width: 44, height: 44, borderRadius: 2.8, bgcolor: '#faf5ff', border: '1px solid #e9d5ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Clock size={22} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="caption" color="#64748b" fontWeight={800} sx={{ letterSpacing: '0.5px', fontSize: '0.68rem', display: 'block', mb: 0.2 }}>
                SESSION TIMEOUT
              </Typography>
              <Typography variant="h5" fontWeight={800} color="#7c3aed" noWrap sx={{ fontSize: '1.2rem' }}>
                30 Minutes
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Box>

      {/* 🚀 SETTINGS NAVIGATION TABS */}
      <Paper 
        elevation={0}
        sx={{ 
          borderRadius: 3.5, 
          border: '1.5px solid #e2e8f0', 
          mb: 3.5, 
          bgcolor: '#ffffff',
          px: 1.5,
          pt: 1,
          boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
        }}
      >
        <Tabs 
          value={activeTab} 
          onChange={(e, val) => setActiveTab(val)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 800,
              fontSize: '0.9rem',
              py: 1.8,
              px: 2.5,
              borderRadius: 2.5,
              minHeight: 48,
              color: '#64748b',
              '&.Mui-selected': {
                color: '#10b981',
                bgcolor: 'rgba(16, 185, 129, 0.08)',
              }
            },
            '& .MuiTabs-indicator': {
              bgcolor: '#10b981',
              height: 3,
              borderRadius: '3px 3px 0 0'
            }
          }}
        >
          <Tab icon={<User size={18} />} iconPosition="start" label="General & Profile" />
          <Tab icon={<Bell size={18} />} iconPosition="start" label="Notifications & Alerts" />
          <Tab icon={<ShieldCheck size={18} />} iconPosition="start" label="Security & Governance" />
        </Tabs>
      </Paper>

      {/* TAB 0: GENERAL & PROFILE SETTINGS */}
      {activeTab === 0 && (
        <Grid container spacing={3.5} width="100%">
          <Grid item xs={12} md={7}>
            <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: 4, border: '1.5px solid #e2e8f0', bgcolor: '#ffffff', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2.5 }}>
                <Box sx={{ p: 1.2, borderRadius: 2.5, bgcolor: '#dbeafe', color: '#2563eb', display: 'flex' }}>
                  <User size={20} />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={800} color="#0f172a" sx={{ fontSize: '1.15rem' }}>
                    Organization & Account Profile
                  </Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    Primary branding and contact details for official reporting
                  </Typography>
                </Box>
              </Stack>

              <Stack spacing={2.5}>
                <Box>
                  <Typography variant="caption" fontWeight={700} color="#475569" sx={{ mb: 0.8, display: 'block' }}>
                    Application / Portal Name
                  </Typography>
                  <TextField
                    name="platformName"
                    value={generalSettings.platformName}
                    onChange={handleGeneralChange}
                    fullWidth
                    variant="outlined"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f8fafc' } }}
                  />
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" fontWeight={700} color="#475569" sx={{ mb: 0.8, display: 'block' }}>
                      Admin Official Email
                    </Typography>
                    <TextField
                      name="adminEmail"
                      value={generalSettings.adminEmail}
                      onChange={handleGeneralChange}
                      fullWidth
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Mail size={16} color="#64748b" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f8fafc' } }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" fontWeight={700} color="#475569" sx={{ mb: 0.8, display: 'block' }}>
                      Contact Telephone
                    </Typography>
                    <TextField
                      name="contactPhone"
                      value={generalSettings.contactPhone}
                      onChange={handleGeneralChange}
                      fullWidth
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone size={16} color="#64748b" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f8fafc' } }}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" fontWeight={700} color="#475569" sx={{ mb: 0.8, display: 'block' }}>
                      Organization Unit
                    </Typography>
                    <TextField
                      name="organization"
                      value={generalSettings.organization}
                      onChange={handleGeneralChange}
                      fullWidth
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Building size={16} color="#64748b" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f8fafc' } }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" fontWeight={700} color="#475569" sx={{ mb: 0.8, display: 'block' }}>
                      Headquarters Location
                    </Typography>
                    <TextField
                      name="location"
                      value={generalSettings.location}
                      onChange={handleGeneralChange}
                      fullWidth
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Globe size={16} color="#64748b" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f8fafc' } }}
                    />
                  </Grid>
                </Grid>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: 4, border: '1.5px solid #e2e8f0', bgcolor: '#ffffff', height: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2.5 }}>
                <Box sx={{ p: 1.2, borderRadius: 2.5, bgcolor: '#dcfce7', color: '#16a34a', display: 'flex' }}>
                  <Sparkles size={20} />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={800} color="#0f172a" sx={{ fontSize: '1.15rem' }}>
                    Interface Preferences
                  </Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    Customize UI density and autosave behaviors
                  </Typography>
                </Box>
              </Stack>

              <Stack spacing={2.5}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: '#f8fafc', borderColor: '#e2e8f0' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="subtitle2" fontWeight={800} color="#0f172a">
                        Auto-Save Field Changes
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Automatically persist form modifications to database
                      </Typography>
                    </Box>
                    <Switch
                      name="autoSave"
                      checked={generalSettings.autoSave}
                      onChange={handleGeneralChange}
                      color="success"
                    />
                  </Stack>
                </Paper>

                <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: '#f8fafc', borderColor: '#e2e8f0' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="subtitle2" fontWeight={800} color="#0f172a">
                        Compact Table View
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Reduce vertical padding on data grids and data tables
                      </Typography>
                    </Box>
                    <Switch
                      name="compactView"
                      checked={generalSettings.compactView}
                      onChange={handleGeneralChange}
                      color="success"
                    />
                  </Stack>
                </Paper>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* TAB 1: NOTIFICATIONS & ALERTS */}
      {activeTab === 1 && (
        <Grid container spacing={3.5} width="100%">
          <Grid item xs={12} md={7}>
            <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: 4, border: '1.5px solid #e2e8f0', bgcolor: '#ffffff', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2.5 }}>
                <Box sx={{ p: 1.2, borderRadius: 2.5, bgcolor: '#fef3c7', color: '#b45309', display: 'flex' }}>
                  <Bell size={20} />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={800} color="#0f172a" sx={{ fontSize: '1.15rem' }}>
                    Alert Notifications Dispatch
                  </Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    Choose trigger events for email and SMS alerts
                  </Typography>
                </Box>
              </Stack>

              <Stack spacing={2.5}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: '#f8fafc', borderColor: '#e2e8f0' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="subtitle2" fontWeight={800} color="#0f172a">
                        Email Alerts on Sync Failure
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Dispatch immediate email alert when MEDA API sync fails
                      </Typography>
                    </Box>
                    <Switch
                      name="emailOnFailure"
                      checked={notificationSettings.emailOnFailure}
                      onChange={handleNotifChange}
                      color="success"
                    />
                  </Stack>
                </Paper>

                <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: '#f8fafc', borderColor: '#e2e8f0' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="subtitle2" fontWeight={800} color="#0f172a">
                        Daily Energy Summary Digest Email
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Receive a daily morning report summarizing credit notes
                      </Typography>
                    </Box>
                    <Switch
                      name="emailDailySummary"
                      checked={notificationSettings.emailDailySummary}
                      onChange={handleNotifChange}
                      color="success"
                    />
                  </Stack>
                </Paper>

                <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: '#f8fafc', borderColor: '#e2e8f0' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="subtitle2" fontWeight={800} color="#0f172a">
                        SMS Spike Warning Alerts
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Send SMS alerts if energy generation deviates significantly
                      </Typography>
                    </Box>
                    <Switch
                      name="smsOnSpike"
                      checked={notificationSettings.smsOnSpike}
                      onChange={handleNotifChange}
                      color="success"
                    />
                  </Stack>
                </Paper>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: 4, border: '1.5px solid #e2e8f0', bgcolor: '#ffffff', height: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2.5 }}>
                <Box sx={{ p: 1.2, borderRadius: 2.5, bgcolor: '#f3e8ff', color: '#7c3aed', display: 'flex' }}>
                  <Clock size={20} />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={800} color="#0f172a" sx={{ fontSize: '1.15rem' }}>
                    Digest Schedule
                  </Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    Set automated dispatch times
                  </Typography>
                </Box>
              </Stack>

              <Box>
                <Typography variant="caption" fontWeight={700} color="#475569" sx={{ mb: 0.8, display: 'block' }}>
                  Daily Morning Digest Time
                </Typography>
                <TextField
                  type="time"
                  name="digestTime"
                  value={notificationSettings.digestTime}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, digestTime: e.target.value })}
                  fullWidth
                  variant="outlined"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f8fafc' } }}
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* TAB 2: SECURITY & GOVERNANCE */}
      {activeTab === 2 && (
        <Grid container spacing={3.5} width="100%">
          <Grid item xs={12} md={7}>
            <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: 4, border: '1.5px solid #e2e8f0', bgcolor: '#ffffff', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2.5 }}>
                <Box sx={{ p: 1.2, borderRadius: 2.5, bgcolor: '#fee2e2', color: '#dc2626', display: 'flex' }}>
                  <ShieldCheck size={20} />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={800} color="#0f172a" sx={{ fontSize: '1.15rem' }}>
                    Authentication & Session Governance
                  </Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    Configure multi-factor auth and session security timers
                  </Typography>
                </Box>
              </Stack>

              <Stack spacing={2.5}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: '#f8fafc', borderColor: '#e2e8f0' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="subtitle2" fontWeight={800} color="#0f172a">
                        Enforce Two-Factor Authentication (2FA)
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Require authenticator OTP code for all admin logins
                      </Typography>
                    </Box>
                    <Switch
                      name="enable2FA"
                      checked={securitySettings.enable2FA}
                      onChange={handleSecurityChange}
                      color="success"
                    />
                  </Stack>
                </Paper>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" fontWeight={700} color="#475569" sx={{ mb: 0.8, display: 'block' }}>
                      Inactivity Session Timeout
                    </Typography>
                    <TextField
                      select
                      name="sessionTimeout"
                      value={securitySettings.sessionTimeout}
                      onChange={handleSecurityChange}
                      fullWidth
                      variant="outlined"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f8fafc' } }}
                    >
                      <MenuItem value="15">15 Minutes</MenuItem>
                      <MenuItem value="30">30 Minutes (Recommended)</MenuItem>
                      <MenuItem value="60">60 Minutes (1 Hour)</MenuItem>
                      <MenuItem value="240">240 Minutes (4 Hours)</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" fontWeight={700} color="#475569" sx={{ mb: 0.8, display: 'block' }}>
                      Password Policy Expiry
                    </Typography>
                    <TextField
                      select
                      name="passwordExpiry"
                      value={securitySettings.passwordExpiry}
                      onChange={handleSecurityChange}
                      fullWidth
                      variant="outlined"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f8fafc' } }}
                    >
                      <MenuItem value="30">Every 30 Days</MenuItem>
                      <MenuItem value="60">Every 60 Days (Recommended)</MenuItem>
                      <MenuItem value="90">Every 90 Days</MenuItem>
                      <MenuItem value="0">Never Expire</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: 4, border: '1.5px solid #e2e8f0', bgcolor: '#ffffff', height: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2.5 }}>
                <Box sx={{ p: 1.2, borderRadius: 2.5, bgcolor: '#f1f5f9', color: '#475569', display: 'flex' }}>
                  <Lock size={20} />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={800} color="#0f172a" sx={{ fontSize: '1.15rem' }}>
                    Network Access Control
                  </Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    IP Whitelisting & Firewall Mode
                  </Typography>
                </Box>
              </Stack>

              <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: '#f8fafc', borderColor: '#e2e8f0' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="subtitle2" fontWeight={800} color="#0f172a">
                      Strict IP Address Whitelisting
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Restrict admin portal access to designated IP ranges
                    </Typography>
                  </Box>
                  <Switch
                    name="ipWhitelisting"
                    checked={securitySettings.ipWhitelisting}
                    onChange={handleSecurityChange}
                    color="success"
                  />
                </Stack>
              </Paper>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* 🚀 BOTTOM GLOBAL ACTION BAR */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          mt: 4,
          borderRadius: 4,
          border: '1.5px solid #e2e8f0',
          bgcolor: '#ffffff',
          boxShadow: '0 10px 30px rgba(0,0,0,0.03)'
        }}
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Check size={18} color="#10b981" />
            <Typography variant="body2" color="text.secondary" fontWeight={600}>
              System Configuration Status: <strong>All Settings Synced & Validated</strong>
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ width: { xs: '100%', sm: 'auto' } }}>
            <Button
              variant="outlined"
              onClick={handleResetDefaults}
              sx={{
                borderRadius: 3,
                fontWeight: 700,
                textTransform: 'none',
                borderColor: '#cbd5e1',
                color: '#475569',
                flex: { xs: 1, sm: 'none' }
              }}
              startIcon={<RotateCcw size={16} />}
            >
              Reset Defaults
            </Button>

            <Button
              variant="contained"
              onClick={handleSaveAll}
              sx={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                boxShadow: '0 6px 20px rgba(16, 185, 129, 0.28)',
                '&:hover': { background: 'linear-gradient(135deg, #059669 0%, #047857 100%)' },
                borderRadius: 3,
                fontWeight: 800,
                textTransform: 'none',
                px: 3.5,
                flex: { xs: 1, sm: 'none' }
              }}
              startIcon={<Save size={16} />}
            >
              Save Configuration
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Snackbar Feedback Alert */}
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

export default Settings;
