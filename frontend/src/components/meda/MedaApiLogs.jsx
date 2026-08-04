import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  TablePagination,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from '@mui/material';
import { Activity, RefreshCw, Eye, AlertCircle } from 'lucide-react';
import { medaApi } from '../../services/medaApi';

const MedaApiLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const [modalType, setModalType] = useState(null); // 'request' or 'response'
  const [selectedLog, setSelectedLog] = useState(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await medaApi.getRequestLogs({
        page: page + 1,
        page_size: rowsPerPage,
      });
      setLogs(data.results || []);
      setTotalCount(data.count || 0);
    } catch (err) {
      console.error('Error fetching API logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, rowsPerPage]);

  const handleOpenModal = (log, type) => {
    setSelectedLog(log);
    setModalType(type);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      return new Date(dateStr).toLocaleString();
    } catch {
      return dateStr;
    }
  };

  const getStatusChip = (statusCode) => {
    if (!statusCode) return <Chip label="Failed" color="error" size="small" />;
    if (statusCode >= 200 && statusCode < 300) {
      return <Chip label={`${statusCode} OK`} color="success" size="small" />;
    }
    return <Chip label={`${statusCode}`} color="error" size="small" />;
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
            <Activity color="#10b981" size={28} /> API Request Logs
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>
            Complete HTTP audit trail of all outbound calls to MEDA endpoints.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          onClick={fetchLogs}
          sx={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.3)', textTransform: 'none' }}
          startIcon={<RefreshCw size={16} />}
        >
          Refresh Logs
        </Button>
      </Paper>

      <Card elevation={1} sx={{ borderRadius: 3, border: '1px solid #e2e8f0' }}>
        <TableContainer>
          <Table sx={{ minWidth: 900 }}>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Request Time</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Endpoint</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Month</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>HTTP Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Response Time</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Records</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="center">View Request</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="center">View Response</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 5 }}>
                    <CircularProgress size={30} />
                  </TableCell>
                </TableRow>
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4, color: '#64748b' }}>
                    No API logs recorded yet.
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id} hover>
                    <TableCell>{formatDate(log.created_at)}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{log.endpoint}</TableCell>
                    <TableCell>{log.month || '-'}</TableCell>
                    <TableCell>{getStatusChip(log.response_status)}</TableCell>
                    <TableCell>{log.response_time}s</TableCell>
                    <TableCell>{log.records_received}</TableCell>
                    <TableCell>
                      {log.error_message ? (
                        <Chip label="Error" color="error" size="small" />
                      ) : (
                        <Chip label="Success" color="success" size="small" />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleOpenModal(log, 'request')}
                        sx={{ textTransform: 'none', borderRadius: 1.5 }}
                      >
                        Request
                      </Button>
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleOpenModal(log, 'response')}
                        sx={{ textTransform: 'none', borderRadius: 1.5 }}
                      >
                        Response
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

      {/* Detail Modal */}
      <Dialog open={!!modalType} onClose={() => setModalType(null)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {modalType === 'request' ? 'HTTP Request Audit' : 'HTTP Response Details'} (Log #{selectedLog?.id})
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 0 }}>
          <Box
            component="pre"
            sx={{
              p: 3,
              m: 0,
              bgcolor: '#0f172a',
              color: modalType === 'request' ? '#38bdf8' : (selectedLog?.error_message ? '#f87171' : '#4ade80'),
              fontSize: '0.85rem',
              fontFamily: 'monospace',
              maxHeight: 500,
              overflowY: 'auto',
              borderRadius: '0 0 8px 8px',
            }}
          >
            {modalType === 'request' && selectedLog && (
              JSON.stringify({
                method: selectedLog.request_method,
                url: selectedLog.request_url,
                headers: selectedLog.request_headers,
                body: selectedLog.request_body,
              }, null, 2)
            )}
            {modalType === 'response' && selectedLog && (
              JSON.stringify({
                status: selectedLog.response_status,
                response_time: `${selectedLog.response_time}s`,
                records_received: selectedLog.records_received,
                error_message: selectedLog.error_message || None,
              }, null, 2)
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setModalType(null)} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MedaApiLogs;
