import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Paper,
  LinearProgress,
  Alert,
  CircularProgress,
  Snackbar,
  MenuItem,
  TextField,
  Chip,
  Stack,
  InputAdornment
} from '@mui/material';
import { 
  DownloadCloud, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Database, 
  Calendar, 
  Filter, 
  Sparkles, 
  Check,
  Layers,
  ArrowRight,
  RefreshCw,
  Zap,
  Activity,
  ShieldCheck
} from 'lucide-react';
import { medaApi } from '../../services/medaApi';

const MONTHS = [
  { val: '01', label: 'Jan (01)' },
  { val: '02', label: 'Feb (02)' },
  { val: '03', label: 'Mar (03)' },
  { val: '04', label: 'Apr (04)' },
  { val: '05', label: 'May (05)' },
  { val: '06', label: 'Jun (06)' },
  { val: '07', label: 'Jul (07)' },
  { val: '08', label: 'Aug (08)' },
  { val: '09', label: 'Sep (09)' },
  { val: '10', label: 'Oct (10)' },
  { val: '11', label: 'Nov (11)' },
  { val: '12', label: 'Dec (12)' },
];

// Generate list of years dynamically from 2015 to 2030
const currentYearNum = new Date().getFullYear();
const YEARS = Array.from({ length: 2030 - 2015 + 1 }, (_, i) => String(2015 + i));

const MedaFetch = () => {
  const [fromMonth, setFromMonth] = useState('01');
  const [fromYear, setFromYear] = useState('2024');
  const [toMonth, setToMonth] = useState('12');
  const [toYear, setToYear] = useState('2024');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  // Quick Presets Helper
  const handlePreset = (presetType) => {
    const yr = String(currentYearNum);
    switch (presetType) {
      case '2023':
        setFromMonth('01'); setFromYear('2023');
        setToMonth('12'); setToYear('2023');
        break;
      case '2024':
        setFromMonth('01'); setFromYear('2024');
        setToMonth('12'); setToYear('2024');
        break;
      case '2025':
        setFromMonth('01'); setFromYear('2025');
        setToMonth('12'); setToYear('2025');
        break;
      case '2026':
        setFromMonth('01'); setFromYear('2026');
        setToMonth('12'); setToYear('2026');
        break;
      case 'last12': {
        const now = new Date();
        const prev = new Date();
        prev.setMonth(now.getMonth() - 11);
        const fM = String(prev.getMonth() + 1).padStart(2, '0');
        const fY = String(prev.getFullYear());
        const tM = String(now.getMonth() + 1).padStart(2, '0');
        const tY = String(now.getFullYear());
        setFromMonth(fM); setFromYear(fY);
        setToMonth(tM); setToYear(tY);
        break;
      }
      default:
        break;
    }
  };

  const handleFetch = async (e) => {
    e.preventDefault();

    const fromStr = `${fromMonth}-${fromYear}`;
    const toStr = `${toMonth}-${toYear}`;

    // Date order validation check
    const fromVal = parseInt(fromYear) * 12 + parseInt(fromMonth);
    const toVal = parseInt(toYear) * 12 + parseInt(toMonth);

    if (fromVal > toVal) {
      setSnackbar({
        open: true,
        message: 'From Month/Year cannot be after To Month/Year.',
        severity: 'warning',
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const data = await medaApi.fetchData({
        from_month: fromStr,
        to_month: toStr,
      });

      if (data.success) {
        setResult(data.sync_job);
        setSnackbar({
          open: true,
          message: `Data fetched successfully for ${fromStr} to ${toStr}!`,
          severity: 'success',
        });
      } else {
        setSnackbar({
          open: true,
          message: data.message || 'Fetch failed.',
          severity: 'error',
        });
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Failed to fetch data.';
      setSnackbar({
        open: true,
        message: errMsg,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
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
                <DownloadCloud size={22} />
              </Box>
              <Chip 
                icon={<Sparkles size={13} style={{ color: '#34d399' }} />}
                label="MEDA DATA FETCH ENGINE" 
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
              Fetch Renewable Energy Credit Notes
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ color: '#e2e8f0 !important', lineHeight: 1.5, fontSize: '0.9rem', opacity: 0.9 }}
            >
              Select any month & year range (e.g. 2015 to 2030) to download and sync official MEDA Energy Credit Notes directly into meda_db.
            </Typography>
          </Box>

          <Stack 
            direction="row" 
            spacing={1.5} 
            alignItems="center" 
            sx={{ zIndex: 1, ml: { md: 'auto' }, width: { xs: '100%', sm: 'auto' } }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.2,
                px: 2.2,
                py: 1.2,
                borderRadius: 3,
                bgcolor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(16, 185, 129, 0.25)', color: '#34d399', display: 'flex', alignItems: 'center' }}>
                <Check size={18} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#94a3b8 !important', display: 'block', fontWeight: 700, fontSize: '0.62rem', lineHeight: 1, mb: 0.3 }}>
                  API STATUS
                </Typography>
                <Typography variant="subtitle2" sx={{ color: '#ffffff !important', fontWeight: 800, fontSize: '0.95rem', lineHeight: 1 }}>
                  Ready to Sync
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Stack>
      </Paper>

      {/* 🚀 FULL-WIDTH INTERACTIVE DATE RANGE PANEL */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 3.5 },
          mb: 3.5,
          borderRadius: 4,
          border: '1.5px solid #e2e8f0',
          bgcolor: '#ffffff',
          boxShadow: '0 10px 30px rgba(0,0,0,0.03)'
        }}
      >
        <Stack 
          direction={{ xs: 'column', md: 'row' }} 
          alignItems={{ xs: 'flex-start', md: 'center' }} 
          justifyContent="space-between" 
          spacing={2} 
          sx={{ mb: 3 }}
        >
          <Box>
            <Stack direction="row" alignItems="center" spacing={1.5}>
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
                <Calendar size={20} />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={800} color="#0f172a" sx={{ fontSize: '1.15rem' }}>
                  Select Month & Year Range
                </Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                  Choose date parameters or click quick presets to fetch records
                </Typography>
              </Box>
            </Stack>
          </Box>

          {/* Quick Presets Bar */}
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" gap={0.5}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, mr: 0.5, fontSize: '0.75rem' }}>
              Quick Presets:
            </Typography>
            <Chip label="2023" size="small" onClick={() => handlePreset('2023')} variant="outlined" clickable sx={{ borderRadius: 2, fontWeight: 700 }} />
            <Chip label="2024" size="small" onClick={() => handlePreset('2024')} variant="outlined" clickable sx={{ borderRadius: 2, fontWeight: 700 }} />
            <Chip label="2025" size="small" onClick={() => handlePreset('2025')} variant="outlined" clickable sx={{ borderRadius: 2, fontWeight: 700 }} />
            <Chip label="2026" size="small" onClick={() => handlePreset('2026')} variant="outlined" clickable sx={{ borderRadius: 2, fontWeight: 700 }} />
            <Chip 
              label="Last 12 Months" 
              size="small" 
              onClick={() => handlePreset('last12')} 
              sx={{ 
                bgcolor: 'rgba(16, 185, 129, 0.12)', 
                color: '#059669', 
                border: '1px solid rgba(16, 185, 129, 0.3)',
                fontWeight: 800,
                fontSize: '0.72rem',
                borderRadius: 2
              }} 
              clickable 
            />
          </Stack>
        </Stack>

        <form onSubmit={handleFetch}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 280px' },
              gap: 2.5,
              width: '100%'
            }}
          >
            {/* FROM DATE SELECTION BOX */}
            <Paper 
              elevation={0}
              sx={{ 
                p: 2.5, 
                borderRadius: 3.5, 
                border: '1.5px solid #e2e8f0', 
                bgcolor: '#f8fafc',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
              }}
            >
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box sx={{ p: 0.6, borderRadius: 1.5, bgcolor: '#dcfce7', color: '#10b981', display: 'flex' }}>
                    <Calendar size={15} />
                  </Box>
                  <Typography variant="caption" fontWeight={800} color="#0f172a" sx={{ fontSize: '0.78rem', letterSpacing: '0.5px' }}>
                    START DATE (FROM)
                  </Typography>
                </Stack>
                <Chip 
                  label={`${fromMonth} - ${fromYear}`} 
                  size="small" 
                  sx={{ bgcolor: '#ffffff', color: '#10b981', fontWeight: 800, border: '1px solid #bbf7d0', fontSize: '0.72rem' }} 
                />
              </Stack>

              <Grid container spacing={1.5}>
                <Grid item xs={6}>
                  <Typography variant="caption" fontWeight={700} color="#475569" sx={{ mb: 0.6, display: 'block' }}>
                    From Month
                  </Typography>
                  <TextField
                    select
                    value={fromMonth}
                    onChange={(e) => setFromMonth(e.target.value)}
                    fullWidth
                    size="small"
                    variant="outlined"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5, bgcolor: '#ffffff', fontSize: '0.85rem' } }}
                  >
                    {MONTHS.map((m) => (
                      <MenuItem key={`from-m-${m.val}`} value={m.val}>
                        {m.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="caption" fontWeight={700} color="#475569" sx={{ mb: 0.6, display: 'block' }}>
                    From Year
                  </Typography>
                  <TextField
                    select
                    value={fromYear}
                    onChange={(e) => setFromYear(e.target.value)}
                    fullWidth
                    size="small"
                    variant="outlined"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5, bgcolor: '#ffffff', fontSize: '0.85rem' } }}
                  >
                    {YEARS.map((y) => (
                      <MenuItem key={`from-y-${y}`} value={y}>
                        {y}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </Paper>

            {/* TO DATE SELECTION BOX */}
            <Paper 
              elevation={0}
              sx={{ 
                p: 2.5, 
                borderRadius: 3.5, 
                border: '1.5px solid #e2e8f0', 
                bgcolor: '#f8fafc',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
              }}
            >
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box sx={{ p: 0.6, borderRadius: 1.5, bgcolor: '#e0f2fe', color: '#0284c7', display: 'flex' }}>
                    <Calendar size={15} />
                  </Box>
                  <Typography variant="caption" fontWeight={800} color="#0f172a" sx={{ fontSize: '0.78rem', letterSpacing: '0.5px' }}>
                    END DATE (TO)
                  </Typography>
                </Stack>
                <Chip 
                  label={`${toMonth} - ${toYear}`} 
                  size="small" 
                  sx={{ bgcolor: '#ffffff', color: '#0284c7', fontWeight: 800, border: '1px solid #bae6fd', fontSize: '0.72rem' }} 
                />
              </Stack>

              <Grid container spacing={1.5}>
                <Grid item xs={6}>
                  <Typography variant="caption" fontWeight={700} color="#475569" sx={{ mb: 0.6, display: 'block' }}>
                    To Month
                  </Typography>
                  <TextField
                    select
                    value={toMonth}
                    onChange={(e) => setToMonth(e.target.value)}
                    fullWidth
                    size="small"
                    variant="outlined"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5, bgcolor: '#ffffff', fontSize: '0.85rem' } }}
                  >
                    {MONTHS.map((m) => (
                      <MenuItem key={`to-m-${m.val}`} value={m.val}>
                        {m.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="caption" fontWeight={700} color="#475569" sx={{ mb: 0.6, display: 'block' }}>
                    To Year
                  </Typography>
                  <TextField
                    select
                    value={toYear}
                    onChange={(e) => setToYear(e.target.value)}
                    fullWidth
                    size="small"
                    variant="outlined"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5, bgcolor: '#ffffff', fontSize: '0.85rem' } }}
                  >
                    {YEARS.map((y) => (
                      <MenuItem key={`to-y-${y}`} value={y}>
                        {y}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </Paper>

            {/* ACTION LAUNCH DECK (Single Row Height) */}
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3.5,
                border: '1.5px solid rgba(16, 185, 129, 0.3)',
                background: 'linear-gradient(135deg, #0f172a 0%, #064e3b 100%)',
                color: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 8px 24px rgba(6, 78, 59, 0.18)'
              }}
            >
              <Box sx={{ mb: 1.5 }}>
                <Typography variant="caption" fontWeight={700} sx={{ color: '#34d399 !important', letterSpacing: '0.5px' }}>
                  TARGET RANGE
                </Typography>
                <Typography variant="subtitle2" fontWeight={800} sx={{ color: '#ffffff !important', mt: 0.3 }}>
                  {fromMonth}/{fromYear} ➔ {toMonth}/{toYear}
                </Typography>
              </Box>

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                fullWidth
                sx={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  boxShadow: '0 6px 20px rgba(16, 185, 129, 0.35)',
                  '&:hover': { background: 'linear-gradient(135deg, #059669 0%, #047857 100%)' },
                  py: 1.4,
                  borderRadius: 3,
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  textTransform: 'none'
                }}
                startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <DownloadCloud size={18} />}
              >
                {loading ? 'Syncing...' : 'Fetch & Sync Data'}
              </Button>
            </Paper>
          </Box>
        </form>
      </Paper>

      {/* Progress Animation State */}
      {loading && (
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            mb: 3.5, 
            borderRadius: 4, 
            border: '1.5px solid rgba(16, 185, 129, 0.3)', 
            bgcolor: '#ffffff',
            boxShadow: '0 10px 30px rgba(0,0,0,0.04)'
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1.5 }}>
            <CircularProgress size={22} color="success" />
            <Box>
              <Typography variant="subtitle1" fontWeight={800} color="#0f172a">
                Syncing MEDA API Credit Notes ({fromMonth}-{fromYear} to {toMonth}-{toYear})...
              </Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                Fetching pages from Mahadiscom REST API endpoints and storing raw & normalized records into meda_db...
              </Typography>
            </Box>
          </Stack>
          <LinearProgress 
            sx={{ 
              height: 10, 
              borderRadius: 5, 
              bgcolor: '#f1f5f9', 
              '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #10b981 0%, #06b6d4 100%)' } 
            }} 
          />
        </Paper>
      )}

      {/* Results & Quick Stats Grid */}
      {result && (
        <Stack spacing={3}>
          <Alert 
            severity={result.status === 'COMPLETED' ? 'success' : 'warning'} 
            sx={{ borderRadius: 3, fontWeight: 700, fontSize: '0.9rem' }}
          >
            Data sync operation completed for range <strong>{fromMonth}-{fromYear} to {toMonth}-{toYear}</strong> with status: <strong>{result.status}</strong>
          </Alert>

          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3.5, border: '1.5px solid #e2e8f0', bgcolor: '#ffffff' }}>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
                  <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#dbeafe', color: '#2563eb' }}>
                    <Database size={20} />
                  </Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>
                    RECORDS IMPORTED
                  </Typography>
                </Stack>
                <Typography variant="h4" fontWeight={800} color="#0f172a">
                  {result.total_records || 0}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3.5, border: '1.5px solid #e2e8f0', bgcolor: '#ffffff' }}>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
                  <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#dcfce7', color: '#16a34a' }}>
                    <CheckCircle2 size={20} />
                  </Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>
                    SUCCESS COUNT
                  </Typography>
                </Stack>
                <Typography variant="h4" fontWeight={800} color="#16a34a">
                  {result.success_count || 0}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3.5, border: '1.5px solid #e2e8f0', bgcolor: '#ffffff' }}>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
                  <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#fef2f2', color: '#ef4444' }}>
                    <XCircle size={20} />
                  </Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>
                    FAILED COUNT
                  </Typography>
                </Stack>
                <Typography variant="h4" fontWeight={800} color="#ef4444">
                  {result.failed_count || 0}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3.5, border: '1.5px solid #e2e8f0', bgcolor: '#ffffff' }}>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
                  <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#f3e8ff', color: '#7c3aed' }}>
                    <Clock size={20} />
                  </Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>
                    TOTAL DURATION
                  </Typography>
                </Stack>
                <Typography variant="h4" fontWeight={800} color="#7c3aed">
                  {result.duration || '0s'}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Stack>
      )}

      {/* Snackbar Alert */}
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

export default MedaFetch;
