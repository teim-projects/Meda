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
import { Database, FileText, RefreshCw, Code2 } from 'lucide-react';
import { medaApi } from '../../services/medaApi';

const MedaRawData = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const [selectedJson, setSelectedJson] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchRawRecords = async () => {
    setLoading(true);
    try {
      const data = await medaApi.getRawRecords({
        page: page + 1,
        page_size: rowsPerPage,
      });
      setRecords(data.results || []);
      setTotalCount(data.count || 0);
    } catch (err) {
      console.error('Error fetching raw records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRawRecords();
  }, [page, rowsPerPage]);

  const handleOpenJson = (rawRecord) => {
    setSelectedJson(rawRecord);
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
            <Database color="#10b981" size={28} /> Raw Data Storage
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>
            Verbatim un-modified JSON responses received from MEDA API.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          onClick={fetchRawRecords}
          sx={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.3)', textTransform: 'none' }}
          startIcon={<RefreshCw size={16} />}
        >
          Refresh
        </Button>
      </Paper>

      <Card elevation={1} sx={{ borderRadius: 3, border: '1px solid #e2e8f0' }}>
        <TableContainer>
          <Table sx={{ minWidth: 700 }}>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Month</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Fetched Date</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Records Count</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                    <CircularProgress size={30} />
                  </TableCell>
                </TableRow>
              ) : records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4, color: '#64748b' }}>
                    No raw JSON records stored yet.
                  </TableCell>
                </TableRow>
              ) : (
                records.map((rec) => (
                  <TableRow key={rec.id} hover>
                    <TableCell sx={{ fontWeight: 700 }}>#{rec.id}</TableCell>
                    <TableCell>{rec.month}</TableCell>
                    <TableCell>{formatDate(rec.created_at)}</TableCell>
                    <TableCell>{rec.records_count}</TableCell>
                    <TableCell>
                      {rec.processed ? (
                        <Chip label="Processed" color="success" size="small" />
                      ) : (
                        <Chip label="Pending" color="warning" size="small" />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleOpenJson(rec)}
                        startIcon={<Code2 size={14} />}
                        sx={{ textTransform: 'none', borderRadius: 1.5 }}
                      >
                        View JSON
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

      {/* JSON Viewer Modal */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Code2 size={20} color="#10b981" /> Original MEDA JSON Response (Record #{selectedJson?.id})
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 0 }}>
          <Box
            component="pre"
            sx={{
              p: 3,
              m: 0,
              bgcolor: '#0f172a',
              color: '#38bdf8',
              fontSize: '0.85rem',
              fontFamily: 'monospace',
              maxHeight: 500,
              overflowY: 'auto',
              borderRadius: '0 0 8px 8px',
            }}
          >
            {selectedJson?.raw_json ? JSON.stringify(selectedJson.raw_json, null, 2) : 'No JSON data available.'}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setModalOpen(false)} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MedaRawData;
