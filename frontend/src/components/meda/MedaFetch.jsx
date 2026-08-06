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
  Stack
} from '@mui/material';
import { DownloadCloud, CheckCircle2, XCircle, Clock, Database, Calendar, Filter } from 'lucide-react';
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
        }}
      >
        <Typography variant="h5" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <DownloadCloud color="#10b981" size={28} /> Fetch Credit Notes Data
        </Typography>
        <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>
          Select any month & year range (e.g. 2015 to 2030) to download MEDA Energy Credit Notes.
        </Typography>
      </Paper>

      {/* Input Selection Form */}
      <Card elevation={1} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="h6" fontWeight={700} sx={{ color: '#0f172a' }}>
              Select Month & Year Range
            </Typography>

            {/* Presets Bar */}
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Typography variant="caption" sx={{ color: '#64748b', alignSelf: 'center', mr: 0.5, fontWeight: 600 }}>
                Presets:
              </Typography>
              <Chip label="2023" size="small" onClick={() => handlePreset('2023')} variant="outlined" clickable />
              <Chip label="2024" size="small" onClick={() => handlePreset('2024')} variant="outlined" clickable />
              <Chip label="2025" size="small" onClick={() => handlePreset('2025')} variant="outlined" clickable />
              <Chip label="2026" size="small" onClick={() => handlePreset('2026')} variant="outlined" clickable />
              <Chip label="Last 12 Months" size="small" onClick={() => handlePreset('last12')} color="primary" variant="outlined" clickable />
            </Stack>
          </Box>

          <form onSubmit={handleFetch}>
            <Grid container spacing={2.5} alignItems="center">
              {/* FROM MONTH & YEAR */}
              <Grid item xs={12} sm={5}>
                <Box sx={{ border: '1px solid #cbd5e1', borderRadius: 2, p: 2, bgcolor: '#f8fafc' }}>
                  <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
                    FROM DATE ({fromMonth}-{fromYear})
                  </Typography>
                  <Grid container spacing={1.5}>
                    <Grid item xs={6}>
                      <TextField
                        select
                        label="From Month"
                        value={fromMonth}
                        onChange={(e) => setFromMonth(e.target.value)}
                        fullWidth
                        size="small"
                        variant="outlined"
                      >
                        {MONTHS.map((m) => (
                          <MenuItem key={`from-m-${m.val}`} value={m.val}>
                            {m.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        select
                        label="From Year"
                        value={fromYear}
                        onChange={(e) => setFromYear(e.target.value)}
                        fullWidth
                        size="small"
                        variant="outlined"
                      >
                        {YEARS.map((y) => (
                          <MenuItem key={`from-y-${y}`} value={y}>
                            {y}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              {/* TO MONTH & YEAR */}
              <Grid item xs={12} sm={5}>
                <Box sx={{ border: '1px solid #cbd5e1', borderRadius: 2, p: 2, bgcolor: '#f8fafc' }}>
                  <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
                    TO DATE ({toMonth}-{toYear})
                  </Typography>
                  <Grid container spacing={1.5}>
                    <Grid item xs={6}>
                      <TextField
                        select
                        label="To Month"
                        value={toMonth}
                        onChange={(e) => setToMonth(e.target.value)}
                        fullWidth
                        size="small"
                        variant="outlined"
                      >
                        {MONTHS.map((m) => (
                          <MenuItem key={`to-m-${m.val}`} value={m.val}>
                            {m.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        select
                        label="To Year"
                        value={toYear}
                        onChange={(e) => setToYear(e.target.value)}
                        fullWidth
                        size="small"
                        variant="outlined"
                      >
                        {YEARS.map((y) => (
                          <MenuItem key={`to-y-${y}`} value={y}>
                            {y}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              {/* FETCH BUTTON */}
              <Grid item xs={12} sm={2}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  fullWidth
                  sx={{
                    bgcolor: '#10b981',
                    '&:hover': { bgcolor: '#059669' },
                    py: 2,
                    borderRadius: 2,
                    fontWeight: 700,
                    textTransform: 'none',
                    height: '100%',
                  }}
                  startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <DownloadCloud size={18} />}
                >
                  {loading ? 'Fetching...' : 'Fetch Data'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      {/* Progress & Live Results Section */}
      {loading && (
        <Card elevation={1} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', p: 3, mb: 4 }}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#0f172a', mb: 1 }}>
            Syncing MEDA API Data ({fromMonth}-{fromYear} to {toMonth}-{toYear})...
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Calling MEDA endpoints sequentially for requested months and storing raw & normalized records.
          </Typography>
          <LinearProgress sx={{ height: 10, borderRadius: 5, bgcolor: '#e2e8f0', '& .MuiLinearProgress-bar': { bgcolor: '#10b981' } }} />
        </Card>
      )}

      {/* Results Summary Metrics */}
      {result && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Alert severity={result.status === 'COMPLETED' ? 'success' : 'warning'} sx={{ borderRadius: 2 }}>
              Data sync operation completed for range <strong>{fromMonth}-{fromYear} to {toMonth}-{toYear}</strong> with status: <strong>{result.status}</strong>
            </Alert>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <Database size={20} color="#3b82f6" />
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  RECORDS IMPORTED
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight={800} color="#0f172a">
                {result.total_records}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <CheckCircle2 size={20} color="#10b981" />
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  SUCCESS COUNT
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight={800} color="#10b981">
                {result.success_count}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <XCircle size={20} color="#ef4444" />
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  FAILED COUNT
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight={800} color="#ef4444">
                {result.failed_count}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <Clock size={20} color="#8b5cf6" />
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  TOTAL DURATION
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight={800} color="#8b5cf6">
                {result.duration}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}

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

export default MedaFetch;
