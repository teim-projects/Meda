import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Button,
  TablePagination,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Stack,
  Grid
} from '@mui/material';
import { 
  History, 
  Eye, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Sparkles, 
  Database,
  Layers,
  XCircle,
  Activity,
  Calendar,
  Check
} from 'lucide-react';
import { medaApi } from '../../services/medaApi';

const MedaSyncHistory = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const [selectedJob, setSelectedJob] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await medaApi.getSyncJobs({
        page: page + 1,
        page_size: rowsPerPage,
      });
      setJobs(data.results || []);
      setTotalCount(data.count || 0);
    } catch (err) {
      console.error('Error fetching sync jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page, rowsPerPage]);

  const handleOpenDetail = (job) => {
    setSelectedJob(job);
    setModalOpen(true);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      return new Date(dateStr).toLocaleString();
    } catch {
      return dateStr;
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <Chip 
            label="Completed" 
            size="small" 
            sx={{ bgcolor: '#dcfce7', color: '#15803d', fontWeight: 800, fontSize: '0.72rem' }} 
          />
        );
      case 'IN_PROGRESS':
        return (
          <Chip 
            label="In Progress" 
            size="small" 
            sx={{ bgcolor: '#dbeafe', color: '#1e40af', fontWeight: 800, fontSize: '0.72rem' }} 
          />
        );
      case 'FAILED':
        return (
          <Chip 
            label="Failed" 
            size="small" 
            sx={{ bgcolor: '#fef2f2', color: '#b91c1c', fontWeight: 800, fontSize: '0.72rem' }} 
          />
        );
      default:
        return <Chip label={status || 'Unknown'} size="small" sx={{ fontWeight: 700, fontSize: '0.72rem' }} />;
    }
  };

  // Compute Summary Metrics
  const completedJobsCount = jobs.filter(j => j.status === 'COMPLETED').length;
  const totalSyncedRecords = jobs.reduce((acc, j) => acc + (j.total_records || 0), 0);

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
                <History size={22} />
              </Box>
              <Chip 
                icon={<Sparkles size={13} style={{ color: '#34d399' }} />}
                label="MEDA SYNC ENGINE" 
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
              MEDA Data Synchronization History
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ color: '#e2e8f0 !important', lineHeight: 1.5, fontSize: '0.9rem', opacity: 0.9 }}
            >
              Historical audit log of all multi-month data synchronization executions and MEDA credit note imports.
            </Typography>
          </Box>

          <Stack 
            direction="row" 
            spacing={1.5} 
            alignItems="center" 
            sx={{ zIndex: 1, ml: { md: 'auto' }, flexShrink: 0 }}
          >
            <Button
              variant="contained"
              onClick={fetchJobs}
              disabled={loading}
              sx={{ 
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                boxShadow: '0 6px 20px rgba(16, 185, 129, 0.28)',
                '&:hover': { background: 'linear-gradient(135deg, #059669 0%, #047857 100%)' },
                py: 1.2,
                px: 2.5,
                borderRadius: 3,
                fontWeight: 800,
                fontSize: '0.85rem',
                textTransform: 'none'
              }}
              startIcon={<RefreshCw size={16} className={loading ? 'spin' : ''} />}
            >
              Refresh History
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
            background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)',
            boxShadow: '0 4px 15px rgba(37, 99, 235, 0.05)',
            transition: 'all 0.25s ease',
            position: 'relative',
            overflow: 'hidden',
            '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 8px 25px rgba(37, 99, 235, 0.12)', borderColor: '#93c5fd' }
          }}
        >
          <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, bgcolor: '#2563eb' }} />
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ width: 44, height: 44, borderRadius: 2.8, background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)', flexShrink: 0 }}>
              <History size={22} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="caption" color="#64748b" fontWeight={800} sx={{ letterSpacing: '0.5px', fontSize: '0.68rem', display: 'block', mb: 0.2 }}>
                TOTAL SYNC JOBS
              </Typography>
              <Typography variant="h5" fontWeight={800} color="#0f172a" noWrap sx={{ fontSize: '1.25rem' }}>
                {totalCount} Executions
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
            background: 'linear-gradient(135deg, #ecfdf5 0%, #ffffff 100%)',
            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.05)',
            transition: 'all 0.25s ease',
            position: 'relative',
            overflow: 'hidden',
            '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 8px 25px rgba(16, 185, 129, 0.12)', borderColor: '#6ee7b7' }
          }}
        >
          <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, bgcolor: '#10b981' }} />
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ width: 44, height: 44, borderRadius: 2.8, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)', flexShrink: 0 }}>
              <CheckCircle2 size={22} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="caption" color="#64748b" fontWeight={800} sx={{ letterSpacing: '0.5px', fontSize: '0.68rem', display: 'block', mb: 0.2 }}>
                COMPLETED RUNS
              </Typography>
              <Typography variant="h5" fontWeight={800} color="#059669" noWrap sx={{ fontSize: '1.25rem' }}>
                {completedJobsCount} Success
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
            background: 'linear-gradient(135deg, #e0f2fe 0%, #ffffff 100%)',
            boxShadow: '0 4px 15px rgba(2, 132, 199, 0.05)',
            transition: 'all 0.25s ease',
            position: 'relative',
            overflow: 'hidden',
            '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 8px 25px rgba(2, 132, 199, 0.12)', borderColor: '#7dd3fc' }
          }}
        >
          <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, bgcolor: '#0284c7' }} />
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ width: 44, height: 44, borderRadius: 2.8, background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)', flexShrink: 0 }}>
              <Database size={22} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="caption" color="#64748b" fontWeight={800} sx={{ letterSpacing: '0.5px', fontSize: '0.68rem', display: 'block', mb: 0.2 }}>
                RECORDS SYNCED
              </Typography>
              <Typography variant="h5" fontWeight={800} color="#0f172a" noWrap sx={{ fontSize: '1.25rem' }}>
                {totalSyncedRecords.toLocaleString()} Records
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
            background: 'linear-gradient(135deg, #faf5ff 0%, #ffffff 100%)',
            boxShadow: '0 4px 15px rgba(124, 58, 237, 0.05)',
            transition: 'all 0.25s ease',
            position: 'relative',
            overflow: 'hidden',
            '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 8px 25px rgba(124, 58, 237, 0.12)', borderColor: '#c084fc' }
          }}
        >
          <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, bgcolor: '#7c3aed' }} />
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ width: 44, height: 44, borderRadius: 2.8, background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)', flexShrink: 0 }}>
              <Activity size={22} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="caption" color="#64748b" fontWeight={800} sx={{ letterSpacing: '0.5px', fontSize: '0.68rem', display: 'block', mb: 0.2 }}>
                DATABASE ENGINE
              </Typography>
              <Typography variant="h5" fontWeight={800} color="#7c3aed" noWrap sx={{ fontSize: '1.25rem' }}>
                meda_db Active
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Box>

      {/* 🚀 FULL-WIDTH HIGH-END DATA TABLE */}
      <Paper 
        elevation={0} 
        sx={{ 
          border: '1.5px solid #e2e8f0', 
          borderRadius: 4, 
          overflow: 'hidden',
          bgcolor: '#ffffff',
          boxShadow: '0 10px 30px rgba(0,0,0,0.03)'
        }}
      >
        <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto' }}>
          <Table sx={{ minWidth: 950 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#0f172a' }}>
                <TableCell sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.78rem' }}>Sync ID</TableCell>
                <TableCell sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.78rem' }}>From Month</TableCell>
                <TableCell sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.78rem' }}>To Month</TableCell>
                <TableCell sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.78rem' }}>Started At</TableCell>
                <TableCell sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.78rem' }}>Completed At</TableCell>
                <TableCell sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.78rem' }}>Status</TableCell>
                <TableCell sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.78rem' }}>Total Records</TableCell>
                <TableCell sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.78rem' }}>Success</TableCell>
                <TableCell sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.78rem' }}>Failed</TableCell>
                <TableCell sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.78rem' }}>Duration</TableCell>
                <TableCell sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.78rem' }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={11} align="center" sx={{ py: 6 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="center">
                      <CircularProgress size={24} color="success" />
                      <Typography variant="body2" color="text.secondary" fontWeight={600}>
                        Loading synchronization execution logs...
                      </Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              ) : jobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} align="center" sx={{ py: 6, color: '#64748b' }}>
                    <Stack alignItems="center" spacing={1}>
                      <History size={32} color="#94a3b8" />
                      <Typography variant="subtitle1" fontWeight={700} color="#0f172a">
                        No Sync Executions Found
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Click "Fetch Data" in the left navigation to run your first data synchronization.
                      </Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              ) : (
                jobs.map((job, idx) => (
                  <TableRow 
                    key={job.id} 
                    sx={{ 
                      bgcolor: idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                      '&:hover': { bgcolor: 'rgba(16, 185, 129, 0.05)' }
                    }}
                  >
                    <TableCell sx={{ fontWeight: 800, color: '#0f172a' }}>#{job.id}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{job.from_month}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{job.to_month}</TableCell>
                    <TableCell sx={{ fontSize: '0.82rem', color: '#475569' }}>{formatDate(job.started_at)}</TableCell>
                    <TableCell sx={{ fontSize: '0.82rem', color: '#475569' }}>{formatDate(job.completed_at)}</TableCell>
                    <TableCell>{getStatusChip(job.status)}</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: '#0f172a' }}>{job.total_records}</TableCell>
                    <TableCell sx={{ color: '#16a34a', fontWeight: 800 }}>{job.success_count}</TableCell>
                    <TableCell sx={{ color: '#ef4444', fontWeight: 800 }}>{job.failed_count}</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>{job.duration}</TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleOpenDetail(job)}
                        startIcon={<Eye size={14} />}
                        sx={{ 
                          textTransform: 'none', 
                          borderRadius: 2,
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          borderColor: '#cbd5e1',
                          color: '#0f172a',
                          '&:hover': { bgcolor: '#f1f5f9', borderColor: '#10b981' }
                        }}
                      >
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          sx={{ borderTop: '1px solid #e2e8f0', bgcolor: '#ffffff' }}
        />
      </Paper>

      {/* Sync Job Details Modal */}
      <Dialog 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 4, p: 1 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex' }}>
            <History size={20} />
          </Box>
          Sync Job #{selectedJob?.id} Details
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ py: 3 }}>
          {selectedJob && (
            <Stack spacing={2}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: '#f8fafc' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>DATE RANGE</Typography>
                  <Typography variant="subtitle2" fontWeight={800} color="#0f172a">
                    {selectedJob.from_month} ➔ {selectedJob.to_month}
                  </Typography>
                </Stack>
              </Paper>

              <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: '#f8fafc' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>EXECUTION STATUS</Typography>
                  {getStatusChip(selectedJob.status)}
                </Stack>
              </Paper>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Paper variant="outlined" sx={{ p: 1.8, borderRadius: 3, bgcolor: '#f8fafc' }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={700}>STARTED</Typography>
                    <Typography variant="body2" fontWeight={600} color="#334155" sx={{ mt: 0.5 }}>
                      {formatDate(selectedJob.started_at)}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper variant="outlined" sx={{ p: 1.8, borderRadius: 3, bgcolor: '#f8fafc' }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={700}>COMPLETED</Typography>
                    <Typography variant="body2" fontWeight={600} color="#334155" sx={{ mt: 0.5 }}>
                      {formatDate(selectedJob.completed_at)}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Paper variant="outlined" sx={{ p: 1.8, borderRadius: 3, bgcolor: '#f8fafc' }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={700}>TOTAL</Typography>
                    <Typography variant="h6" fontWeight={800} color="#0f172a" sx={{ mt: 0.3 }}>
                      {selectedJob.total_records}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={4}>
                  <Paper variant="outlined" sx={{ p: 1.8, borderRadius: 3, bgcolor: '#f8fafc' }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={700}>SUCCESS</Typography>
                    <Typography variant="h6" fontWeight={800} color="#16a34a" sx={{ mt: 0.3 }}>
                      {selectedJob.success_count}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={4}>
                  <Paper variant="outlined" sx={{ p: 1.8, borderRadius: 3, bgcolor: '#f8fafc' }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={700}>FAILED</Typography>
                    <Typography variant="h6" fontWeight={800} color="#ef4444" sx={{ mt: 0.3 }}>
                      {selectedJob.failed_count}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setModalOpen(false)}
            variant="contained"
            sx={{ bgcolor: '#0f172a', textTransform: 'none', borderRadius: 2, fontWeight: 700 }}
          >
            Close Details
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MedaSyncHistory;
