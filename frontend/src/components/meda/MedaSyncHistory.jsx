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
} from '@mui/material';
import { History, Eye, RefreshCw, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
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
        return <Chip label="Completed" color="success" size="small" />;
      case 'IN_PROGRESS':
        return <Chip label="In Progress" color="info" size="small" />;
      case 'FAILED':
        return <Chip label="Failed" color="error" size="small" />;
      default:
        return <Chip label={status || 'Unknown'} size="small" />;
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 3 } }}>
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
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <History color="#10b981" size={28} /> Sync History
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>
            Historical record of all multi-month data synchronization executions.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          onClick={fetchJobs}
          sx={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.3)', textTransform: 'none' }}
          startIcon={<RefreshCw size={16} />}
        >
          Refresh History
        </Button>
      </Paper>

      <Card elevation={1} sx={{ borderRadius: 3, border: '1px solid #e2e8f0' }}>
        <TableContainer>
          <Table sx={{ minWidth: 850 }}>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Sync ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>From Month</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>To Month</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Started</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Completed</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Total Records</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Success</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Failed</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Duration</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={11} align="center" sx={{ py: 5 }}>
                    <CircularProgress size={30} />
                  </TableCell>
                </TableRow>
              ) : jobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} align="center" sx={{ py: 4, color: '#64748b' }}>
                    No sync jobs recorded yet.
                  </TableCell>
                </TableRow>
              ) : (
                jobs.map((job) => (
                  <TableRow key={job.id} hover>
                    <TableCell sx={{ fontWeight: 700 }}>#{job.id}</TableCell>
                    <TableCell>{job.from_month}</TableCell>
                    <TableCell>{job.to_month}</TableCell>
                    <TableCell>{formatDate(job.started_at)}</TableCell>
                    <TableCell>{formatDate(job.completed_at)}</TableCell>
                    <TableCell>{getStatusChip(job.status)}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{job.total_records}</TableCell>
                    <TableCell sx={{ color: '#10b981', fontWeight: 600 }}>{job.success_count}</TableCell>
                    <TableCell sx={{ color: '#ef4444', fontWeight: 600 }}>{job.failed_count}</TableCell>
                    <TableCell>{job.duration}</TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleOpenDetail(job)}
                        startIcon={<Eye size={14} />}
                        sx={{ textTransform: 'none', borderRadius: 1.5 }}
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
        />
      </Card>

      {/* Sync Job Details Modal */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          Sync Job #{selectedJob?.id} Details
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ py: 3 }}>
          {selectedJob && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Range:</Typography>
                <Typography variant="body2" fontWeight={600}>{selectedJob.from_month} to {selectedJob.to_month}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Status:</Typography>
                {getStatusChip(selectedJob.status)}
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Started At:</Typography>
                <Typography variant="body2">{formatDate(selectedJob.started_at)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Completed At:</Typography>
                <Typography variant="body2">{formatDate(selectedJob.completed_at)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Execution Duration:</Typography>
                <Typography variant="body2" fontWeight={600}>{selectedJob.duration}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Total Records Fetched:</Typography>
                <Typography variant="body2" fontWeight={700}>{selectedJob.total_records}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Successful Parses:</Typography>
                <Typography variant="body2" color="success.main" fontWeight={700}>{selectedJob.success_count}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Failed Parses:</Typography>
                <Typography variant="body2" color="error.main" fontWeight={700}>{selectedJob.failed_count}</Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MedaSyncHistory;
