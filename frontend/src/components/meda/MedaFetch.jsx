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
  TextField
} from '@mui/material';
import { DownloadCloud, CheckCircle2, XCircle, Clock, Database, Calendar } from 'lucide-react';
import { medaApi } from '../../services/medaApi';

const monthsList = [
  { label: 'Jan 2026', value: '01-2026' },
  { label: 'Feb 2026', value: '02-2026' },
  { label: 'Mar 2026', value: '03-2026' },
  { label: 'Apr 2026', value: '04-2026' },
  { label: 'May 2026', value: '05-2026' },
  { label: 'Jun 2026', value: '06-2026' },
  { label: 'Jul 2026', value: '07-2026' },
  { label: 'Aug 2026', value: '08-2026' },
  { label: 'Sep 2026', value: '09-2026' },
  { label: 'Oct 2026', value: '10-2026' },
  { label: 'Nov 2026', value: '11-2026' },
  { label: 'Dec 2026', value: '12-2026' },
];

const MedaFetch = () => {
  const [fromMonth, setFromMonth] = useState('01-2026');
  const [toMonth, setToMonth] = useState('04-2026');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const handleFetch = async (e) => {
    e.preventDefault();
    if (!fromMonth || !toMonth) {
      setSnackbar({
        open: true,
        message: 'Please select both From Month and To Month.',
        severity: 'warning',
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const data = await medaApi.fetchData({
        from_month: fromMonth,
        to_month: toMonth,
      });

      if (data.success) {
        setResult(data.sync_job);
        setSnackbar({
          open: true,
          message: 'Data fetched successfully!',
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
          Select month range to download MEDA Energy Credit Notes. The backend handles automatic authentication, raw JSON storage, and record normalization.
        </Typography>
      </Paper>

      {/* Input Selection Form */}
      <Card elevation={1} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={700} gutterBottom sx={{ color: '#0f172a', mb: 3 }}>
            Select Date Range
          </Typography>

          <form onSubmit={handleFetch}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} sm={5}>
                <TextField
                  select
                  label="From Month"
                  value={fromMonth}
                  onChange={(e) => setFromMonth(e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    startAdornment: <Calendar size={18} style={{ marginRight: 8, color: '#64748b' }} />,
                  }}
                >
                  {monthsList.map((m) => (
                    <MenuItem key={`from-${m.value}`} value={m.value}>
                      {m.label} ({m.value})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={5}>
                <TextField
                  select
                  label="To Month"
                  value={toMonth}
                  onChange={(e) => setToMonth(e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    startAdornment: <Calendar size={18} style={{ marginRight: 8, color: '#64748b' }} />,
                  }}
                >
                  {monthsList.map((m) => (
                    <MenuItem key={`to-${m.value}`} value={m.value}>
                      {m.label} ({m.value})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={2}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  fullWidth
                  sx={{
                    bgcolor: '#10b981',
                    '&:hover': { bgcolor: '#059669' },
                    py: 1.8,
                    borderRadius: 2,
                    fontWeight: 600,
                    textTransform: 'none',
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
            Syncing MEDA API Data...
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Calling endpoints sequentially for selected months and storing raw & normalized records.
          </Typography>
          <LinearProgress sx={{ height: 10, borderRadius: 5, bgcolor: '#e2e8f0', '& .MuiLinearProgress-bar': { bgcolor: '#10b981' } }} />
        </Card>
      )}

      {/* Results Summary Metrics */}
      {result && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Alert severity={result.status === 'COMPLETED' ? 'success' : 'warning'} sx={{ borderRadius: 2 }}>
              Data sync operation completed with status: <strong>{result.status}</strong>
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
