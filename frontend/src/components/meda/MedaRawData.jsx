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
  Stack,
  Grid,
  Tooltip
} from '@mui/material';
import { 
  Database, 
  FileText, 
  RefreshCw, 
  Code2, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Copy, 
  Check 
} from 'lucide-react';
import { medaApi } from '../../services/medaApi';

const MedaRawData = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const [selectedJson, setSelectedJson] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

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
    setCopied(false);
  };

  const handleCopyJson = () => {
    if (selectedJson?.raw_json) {
      navigator.clipboard.writeText(JSON.stringify(selectedJson.raw_json, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      return new Date(dateStr).toLocaleString();
    } catch {
      return dateStr;
    }
  };

  // KPI Metrics Calculation
  const processedCount = records.filter(r => r.processed).length;
  const totalParsedRecords = records.reduce((acc, r) => acc + (r.records_count || 0), 0);

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
                <Database size={22} />
              </Box>
              <Chip 
                icon={<Sparkles size={13} style={{ color: '#34d399' }} />}
                label="MEDA RAW REPOSITORY" 
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
              Raw MEDA API Data Storage
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ color: '#e2e8f0 !important', lineHeight: 1.5, fontSize: '0.9rem', opacity: 0.9 }}
            >
              Verbatim, un-modified raw JSON API payloads received directly from Mahadiscom MEDA REST API servers.
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
              onClick={fetchRawRecords}
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
              Refresh Repository
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
              <Database size={22} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="caption" color="#64748b" fontWeight={800} sx={{ letterSpacing: '0.5px', fontSize: '0.68rem', display: 'block', mb: 0.2 }}>
                RAW PAYLOADS STORED
              </Typography>
              <Typography variant="h5" fontWeight={800} color="#0f172a" noWrap sx={{ fontSize: '1.25rem' }}>
                {totalCount} Payloads
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
                PROCESSED ITEMS
              </Typography>
              <Typography variant="h5" fontWeight={800} color="#059669" noWrap sx={{ fontSize: '1.25rem' }}>
                {processedCount} Processed
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
              <FileText size={22} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="caption" color="#64748b" fontWeight={800} sx={{ letterSpacing: '0.5px', fontSize: '0.68rem', display: 'block', mb: 0.2 }}>
                PARSED JSON RECORDS
              </Typography>
              <Typography variant="h5" fontWeight={800} color="#0f172a" noWrap sx={{ fontSize: '1.25rem' }}>
                {totalParsedRecords.toLocaleString()} Records
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
              <ShieldCheck size={22} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="caption" color="#64748b" fontWeight={800} sx={{ letterSpacing: '0.5px', fontSize: '0.68rem', display: 'block', mb: 0.2 }}>
                AUDIT INTEGRITY
              </Typography>
              <Typography variant="h5" fontWeight={800} color="#7c3aed" noWrap sx={{ fontSize: '1.25rem' }}>
                100% Verbatim
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
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#0f172a' }}>
                <TableCell sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.78rem' }}>Record ID</TableCell>
                <TableCell sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.78rem' }}>Month Parameter</TableCell>
                <TableCell sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.78rem' }}>Fetched Timestamp</TableCell>
                <TableCell sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.78rem' }}>Records Count</TableCell>
                <TableCell sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.78rem' }}>Status</TableCell>
                <TableCell sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.78rem' }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="center">
                      <CircularProgress size={24} color="success" />
                      <Typography variant="body2" color="text.secondary" fontWeight={600}>
                        Loading raw API payload records...
                      </Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              ) : records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6, color: '#64748b' }}>
                    <Stack alignItems="center" spacing={1}>
                      <Database size={32} color="#94a3b8" />
                      <Typography variant="subtitle1" fontWeight={700} color="#0f172a">
                        No Raw JSON Records Found
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Click "Fetch Data" to run a synchronization job and store raw payloads.
                      </Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              ) : (
                records.map((rec, idx) => (
                  <TableRow 
                    key={rec.id} 
                    sx={{ 
                      bgcolor: idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                      '&:hover': { bgcolor: 'rgba(16, 185, 129, 0.05)' }
                    }}
                  >
                    <TableCell sx={{ fontWeight: 800, color: '#0f172a' }}>#{rec.id}</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#0284c7' }}>{rec.month}</TableCell>
                    <TableCell sx={{ fontSize: '0.84rem', color: '#475569' }}>{formatDate(rec.created_at)}</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: '#0f172a' }}>{rec.records_count}</TableCell>
                    <TableCell>
                      {rec.processed ? (
                        <Chip 
                          label="Processed" 
                          size="small"
                          sx={{ bgcolor: '#dcfce7', color: '#15803d', fontWeight: 800, fontSize: '0.72rem' }} 
                        />
                      ) : (
                        <Chip 
                          label="Pending" 
                          size="small"
                          sx={{ bgcolor: '#fef3c7', color: '#b45309', fontWeight: 800, fontSize: '0.72rem' }} 
                        />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleOpenJson(rec)}
                        startIcon={<Code2 size={14} />}
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
          sx={{ borderTop: '1px solid #e2e8f0', bgcolor: '#ffffff' }}
        />
      </Paper>

      {/* JSON Viewer Console Modal */}
      <Dialog 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 4, overflow: 'hidden' }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, bgcolor: '#0f172a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2.5 }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box sx={{ p: 0.8, borderRadius: 1.5, bgcolor: 'rgba(16, 185, 129, 0.2)', color: '#34d399', display: 'flex' }}>
              <Code2 size={20} />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={800} color="#ffffff">
                Original MEDA JSON Response (Record #{selectedJson?.id})
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                Un-modified API payload captured on {formatDate(selectedJson?.created_at)}
              </Typography>
            </Box>
          </Stack>

          <Button
            size="small"
            onClick={handleCopyJson}
            startIcon={copied ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
            sx={{ 
              color: copied ? '#34d399' : '#e2e8f0', 
              border: '1px solid rgba(255,255,255,0.2)',
              textTransform: 'none',
              borderRadius: 2,
              px: 2
            }}
          >
            {copied ? 'Copied!' : 'Copy JSON'}
          </Button>
        </DialogTitle>
        
        <DialogContent sx={{ p: 0, bgcolor: '#0f172a' }}>
          <Box
            component="pre"
            sx={{
              p: 3,
              m: 0,
              bgcolor: '#0f172a',
              color: '#34d399',
              fontSize: '0.85rem',
              fontFamily: 'Consolas, Monaco, "Andale Mono", monospace',
              maxHeight: 480,
              overflowY: 'auto',
              lineHeight: 1.6
            }}
          >
            {selectedJson?.raw_json ? JSON.stringify(selectedJson.raw_json, null, 2) : 'No JSON data available.'}
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, bgcolor: '#0f172a', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <Button 
            onClick={() => setModalOpen(false)} 
            variant="contained"
            sx={{ bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' }, textTransform: 'none', borderRadius: 2, fontWeight: 700 }}
          >
            Close Terminal
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MedaRawData;
