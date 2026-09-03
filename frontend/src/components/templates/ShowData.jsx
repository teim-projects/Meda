import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  LinearProgress,
  CircularProgress,
  Alert,
  Stack,
  Chip,
  TextField,
  InputAdornment,
  Button,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Database, 
  AlertCircle,
  Search,
  RefreshCw,
  Download,
  Sparkles,
  Flame,
  Sprout,
  Recycle,
  Droplets,
  Sun,
  Zap,
  Wind,
  Home,
  Building2,
  Check,
  FileSpreadsheet,
  Layers,
  ArrowRight,
  Cpu
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { energyApi } from '../../services/energyApi';

const ENERGY_TYPES = [
  { val: 'biomass', label: 'Biomass', icon: Flame, color: '#10b981', bg: 'rgba(16, 185, 129, 0.08)', desc: 'Organic plant & bio-energy', active: true },
  { val: 'bagasse', label: 'Bagasse', icon: Sprout, color: '#84cc16', bg: 'rgba(132, 204, 22, 0.08)', desc: 'Sugar mill sugarcane residue', active: true },
  { val: 'govt_solarization', label: 'Govt Solarization', icon: Building2, color: '#ec4899', bg: 'rgba(236, 72, 153, 0.08)', desc: 'Govt building rooftop solarization', active: true },
  { val: 'msw', label: 'MSW (Solid Waste)', icon: Recycle, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.08)', desc: 'Municipal solid waste records', active: true },
  { val: 'shp', label: 'Small Hydro Power', icon: Droplets, color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.08)', desc: 'Small run-of-river hydro energy', active: true },
  { val: 'solar_grid', label: 'Solar Grid', icon: Sun, color: '#eab308', bg: 'rgba(234, 179, 8, 0.08)', desc: 'Utility scale grid solar systems', active: true },
  { val: 'solar_kusum', label: 'Solar Kusum', icon: Zap, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.08)', desc: 'PM-KUSUM agricultural solar', active: true },
  { val: 'wind', label: 'Wind Power', icon: Wind, color: '#6366f1', bg: 'rgba(99, 102, 241, 0.08)', desc: 'Wind turbine energy data', active: true },
  { val: 'mskvy', label: 'MSKVY', icon: Cpu, color: '#0284c7', bg: 'rgba(2, 132, 199, 0.08)', desc: 'Mukhyamantri Saur Krushi Vahini Yojana', active: true },
];

const ShowData = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState('biomass');
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [headers, setHeaders] = useState([]);
  const [fieldMap, setFieldMap] = useState({});
  const [rows, setRows] = useState([]);
  const [displayName, setDisplayName] = useState('');

  // Pagination states for high-performance rendering of large datasets
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const abortControllerRef = useRef(null);

  const currentTypeObj = ENERGY_TYPES.find(e => e.val === selectedType) || ENERGY_TYPES[0];

  const isTypeActive = (typeVal = selectedType) => {
    const matched = ENERGY_TYPES.find(e => e.val === typeVal);
    return matched ? matched.active : false;
  };

  const loadData = async (typeToLoad = selectedType) => {
    if (!isTypeActive(typeToLoad)) {
      setHeaders([]);
      setFieldMap({});
      setRows([]);
      setDisplayName('');
      setError('This energy type module is not active yet.');
      setLoading(false);
      return;
    }

    // Cancel any previous in-flight request so network & UI never freeze
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const res = await energyApi.getData(typeToLoad, { signal: controller.signal });
      if (res.success) {
        setHeaders(res.headers || []);
        setFieldMap(res.fields || {});
        setRows(res.data || []);
        setDisplayName(res.display_name || '');
        setPage(0);
      }
    } catch (err) {
      if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED' || err.message === 'canceled') {
        // Request was aborted by user clicking another category, do nothing
        return;
      }
      console.error(err);
      setError(err.response?.data?.error || err.message || 'Failed to fetch stored records.');
    } finally {
      if (abortControllerRef.current === controller) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadData(selectedType);
    setSearchQuery('');
    setPage(0);
  }, [selectedType]);

  const handleExportData = async () => {
    if (!isTypeActive()) return;
    setDownloading(true);
    try {
      const response = await energyApi.downloadFilledData(selectedType);
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `${selectedType}_records.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  // Live client-side search filtering memoized to prevent UI thread lag
  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return rows;
    const query = searchQuery.toLowerCase();
    return rows.filter((row) => {
      return Object.values(row).some((val) => {
        if (val === null || val === undefined) return false;
        return String(val).toLowerCase().includes(query);
      });
    });
  }, [rows, searchQuery]);

  // Paginated rows: Only slices 25-50 items to DOM, preventing browser lockup
  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredRows.slice(start, start + rowsPerPage);
  }, [filteredRows, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ width: '100%', p: { xs: 1, md: 1.5 }, pb: 8 }}>
      
      {/* 🌟 ULTRA-ATTRACTIVE HERO HEADER (Matching Templates.jsx Gradient) */}
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
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2.5} width="100%">
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
                label="MEDA DATA EXPLORER" 
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

            <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: '-0.5px', color: '#ffffff !important', mb: 0.8, fontSize: { xs: '1.4rem', md: '1.85rem' } }}>
              Stored Renewable Data
            </Typography>
            <Typography variant="body2" sx={{ color: '#e2e8f0 !important', lineHeight: 1.5, fontSize: '0.9rem', opacity: 0.9 }}>
              Inspect, search, and export verified database records across all active renewable energy sources in real time.
            </Typography>
          </Box>

          <Stack direction={{ xs: 'row', sm: 'row' }} spacing={1.5} alignItems="center" sx={{ zIndex: 1, ml: { md: 'auto' }, width: { xs: '100%', sm: 'auto' }, justifyContent: 'space-between' }}>
            {/* Selected Source Pill */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.2,
                px: { xs: 1.5, sm: 2.2 },
                py: 1.2,
                borderRadius: 3,
                bgcolor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                backdropFilter: 'blur(10px)',
                flex: { xs: 1, sm: 'none' },
                minWidth: 0
              }}
            >
              <Box sx={{ p: 1, borderRadius: 2, bgcolor: currentTypeObj.bg, color: currentTypeObj.color, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                <Layers size={18} />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="caption" sx={{ color: '#94a3b8 !important', display: 'block', fontWeight: 700, fontSize: '0.62rem', lineHeight: 1, mb: 0.3 }}>
                  ACTIVE SOURCE
                </Typography>
                <Typography variant="subtitle2" noWrap sx={{ color: '#ffffff !important', fontWeight: 800, fontSize: { xs: '0.85rem', sm: '0.98rem' }, lineHeight: 1 }}>
                  {currentTypeObj.label}
                </Typography>
              </Box>
            </Box>

            {/* Total Records Pill */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.2,
                px: { xs: 1.5, sm: 2.2 },
                py: 1.2,
                borderRadius: 3,
                bgcolor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                backdropFilter: 'blur(10px)',
                flex: { xs: 1, sm: 'none' },
                minWidth: 0
              }}
            >
              <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(16, 185, 129, 0.25)', color: '#34d399', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                <Database size={18} />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="caption" sx={{ color: '#94a3b8 !important', display: 'block', fontWeight: 700, fontSize: '0.62rem', lineHeight: 1, mb: 0.3 }}>
                  TOTAL RECORDS
                </Typography>
                <Typography variant="subtitle2" noWrap sx={{ color: '#34d399 !important', fontWeight: 800, fontSize: { xs: '0.85rem', sm: '0.98rem' }, lineHeight: 1 }}>
                  {rows.length} Entries
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Stack>
      </Paper>

      {/* SECTION 1: Interactive Energy Source Category Grid */}
      <Box sx={{ mb: 3.5 }}>
        <Typography variant="h6" fontWeight={800} color="#0f172a" sx={{ fontSize: '1.1rem', mb: 1.8 }}>
          Select Energy Category
        </Typography>

        {/* 8 Visual Cards Grid (Full Width & Expanded Dimensions - No Truncation) */}
        <Box 
          sx={{ 
            width: '100%',
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
            gap: 2.5 
          }}
        >
          {ENERGY_TYPES.map((type) => {
            const IconComp = type.icon;
            const isSelected = selectedType === type.val;

            return (
              <Paper
                key={type.val}
                elevation={0}
                onClick={() => {
                  if (type.active && selectedType !== type.val) {
                    setSelectedType(type.val);
                  }
                }}
                sx={{
                  p: 2.2,
                  px: 2.5,
                  borderRadius: 3.5,
                  border: '2px solid',
                  borderColor: isSelected ? type.color : type.active ? '#cbd5e1' : '#f1f5f9',
                  background: isSelected 
                    ? `linear-gradient(135deg, ${type.bg} 0%, #ffffff 100%)` 
                    : '#ffffff',
                  cursor: type.active ? 'pointer' : 'default',
                  opacity: type.active ? 1 : 0.6,
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  minHeight: 84,
                  display: 'flex',
                  alignItems: 'center',
                  pointerEvents: 'auto',
                  boxShadow: isSelected 
                    ? `0 10px 25px ${type.color}25` 
                    : '0 3px 10px rgba(0,0,0,0.03)',
                  '&:hover': {
                    borderColor: type.active ? type.color : '#94a3b8',
                    transform: type.active ? 'translateY(-3px)' : 'none',
                    boxShadow: type.active ? `0 12px 28px ${type.color}28` : 'none'
                  }
                }}
              >
                {/* Top Accent Line */}
                {isSelected && (
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      top: 0, 
                      left: 0, 
                      right: 0, 
                      height: 4, 
                      bgcolor: type.color 
                    }} 
                  />
                )}

                <Stack direction="row" alignItems="center" spacing={2} width="100%">
                  {/* Colorful Vibrant Icon Container */}
                  <Box
                    sx={{
                      width: 46,
                      height: 46,
                      borderRadius: 3,
                      background: isSelected 
                        ? `linear-gradient(135deg, ${type.color} 0%, ${type.color}cc 100%)` 
                        : type.bg,
                      color: isSelected ? '#ffffff' : type.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: isSelected ? `0 4px 14px ${type.color}40` : 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <IconComp size={24} />
                  </Box>

                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} sx={{ mb: 0.3 }}>
                      <Typography 
                        variant="subtitle1" 
                        fontWeight={800} 
                        sx={{ 
                          fontSize: '0.94rem', 
                          color: isSelected ? type.color : '#0f172a',
                          lineHeight: 1.25
                        }}
                      >
                        {type.label}
                      </Typography>

                      {isSelected && (
                        <Chip
                          icon={loading ? <RefreshCw size={11} className="spin" color="#ffffff" /> : <Check size={11} color="#ffffff" />}
                          label={loading ? "LOADING..." : "ACTIVE"}
                          size="small"
                          sx={{
                            bgcolor: type.color,
                            color: '#ffffff !important',
                            fontWeight: 800,
                            fontSize: '0.65rem',
                            height: 20,
                            px: 0.5,
                            flexShrink: 0,
                            '& .MuiChip-icon': { color: '#ffffff' }
                          }}
                        />
                      )}
                    </Stack>

                    <Typography 
                      variant="caption" 
                      color="#64748b" 
                      sx={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, lineHeight: 1.3 }}
                    >
                      {type.desc}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            );
          })}
        </Box>
      </Box>

      {/* SECTION 2: DATA TABLE TOOLBAR & VIEWER */}
      <Paper 
        elevation={0} 
        sx={{ 
          border: '1px solid #e2e8f0', 
          borderRadius: 4, 
          overflow: 'hidden',
          bgcolor: '#ffffff',
          boxShadow: '0 8px 30px rgba(0,0,0,0.03)'
        }}
      >
        {/* Table Controls Bar */}
        <Box 
          sx={{ 
            p: 2.5, 
            px: 3, 
            borderBottom: '1px solid #e2e8f0', 
            bgcolor: '#ffffff',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' },
            justifyContent: 'space-between',
            gap: 2
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box 
              sx={{ 
                p: 1, 
                borderRadius: 2, 
                bgcolor: currentTypeObj.bg, 
                color: currentTypeObj.color 
              }}
            >
              <Database size={20} />
            </Box>
            <Box>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="subtitle1" fontWeight={800} color="#0f172a" sx={{ fontSize: '1rem' }}>
                  {displayName || currentTypeObj.label} Table
                </Typography>
                <Chip 
                  label={`${filteredRows.length} ${filteredRows.length === 1 ? 'row' : 'rows'}`} 
                  size="small"
                  sx={{ bgcolor: '#f1f5f9', color: '#475569', fontWeight: 800, fontSize: '0.72rem' }}
                />
              </Stack>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                {searchQuery ? `Matching "${searchQuery}" in dataset` : 'Stored database entries'}
              </Typography>
            </Box>
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', sm: 'center' }} width={{ xs: '100%', sm: 'auto' }}>
            {/* Live Search Input */}
            <TextField
              size="small"
              placeholder="Search table rows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={16} color="#94a3b8" />
                  </InputAdornment>
                ),
              }}
              sx={{ 
                width: { xs: '100%', sm: 240 },
                '& .MuiOutlinedInput-root': { borderRadius: 2.5, bgcolor: '#f8fafc', fontSize: '0.85rem' }
              }}
            />

            {/* Refresh Button */}
            <Tooltip title="Refresh dataset">
              <IconButton 
                onClick={loadData} 
                disabled={loading}
                sx={{ border: '1px solid #cbd5e1', borderRadius: 2.5, p: 1 }}
              >
                <RefreshCw size={18} color="#475569" className={loading ? 'spin' : ''} />
              </IconButton>
            </Tooltip>

            {/* Export Excel Button */}
            <Button
              variant="contained"
              startIcon={<Download size={16} />}
              disabled={loading || downloading || rows.length === 0}
              onClick={handleExportData}
              sx={{
                borderRadius: 2.5,
                py: 1,
                px: 2,
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                fontWeight: 800,
                textTransform: 'none',
                fontSize: '0.85rem',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.22)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                }
              }}
            >
              {downloading ? <CircularProgress size={18} color="inherit" /> : 'Export Excel'}
            </Button>
          </Stack>
        </Box>

        {/* Non-blocking top progress bar while fetching */}
        {loading && (
          <LinearProgress 
            sx={{ 
              height: 3, 
              bgcolor: 'rgba(16, 185, 129, 0.15)',
              '& .MuiLinearProgress-bar': {
                bgcolor: currentTypeObj.color || '#10b981'
              }
            }} 
          />
        )}

        {/* Initial Loading Spinner when table has no data yet */}
        {loading && rows.length === 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
            <CircularProgress color="success" size={36} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontWeight: 700 }}>
              Fetching stored database records for {currentTypeObj.label}...
            </Typography>
          </Box>
        )}

        {/* Error Alert */}
        {error && !loading && (
          <Box sx={{ p: 3 }}>
            <Alert severity="warning" sx={{ borderRadius: 3 }} icon={<AlertCircle />}>
              {error}
            </Alert>
          </Box>
        )}

        {/* DATA TABLE */}
        {(!loading || rows.length > 0) && !error && (
          <TableContainer sx={{ maxHeight: 620, opacity: loading ? 0.65 : 1, transition: 'opacity 0.2s ease' }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell 
                    sx={{ 
                      fontWeight: 800, 
                      bgcolor: '#f1f5f9 !important', 
                      color: '#1e293b !important', 
                      py: 1.6, 
                      fontSize: '0.72rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.6px',
                      borderBottom: '2px solid #cbd5e1 !important',
                      width: 50
                    }}
                  >
                    #
                  </TableCell>
                  {headers.map((header) => (
                    <TableCell 
                      key={header} 
                      sx={{ 
                        fontWeight: 800, 
                        bgcolor: '#f1f5f9 !important', 
                        color: '#1e293b !important', 
                        py: 1.6, 
                        whiteSpace: 'nowrap',
                        fontSize: '0.72rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.6px',
                        borderBottom: '2px solid #cbd5e1 !important',
                        borderRight: '1px solid #e2e8f0'
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={headers.length + 1} align="center" sx={{ py: 9 }}>
                      <Box sx={{ maxWidth: 400, mx: 'auto', textAlign: 'center' }}>
                        <Box 
                          sx={{ 
                            width: 56, 
                            height: 56, 
                            borderRadius: '50%', 
                            bgcolor: '#f1f5f9', 
                            color: '#94a3b8', 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            mb: 2 
                          }}
                        >
                          <FileSpreadsheet size={28} />
                        </Box>
                        <Typography variant="subtitle1" fontWeight={800} color="#0f172a" sx={{ mb: 0.5 }}>
                          No Data Records Found
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, fontSize: '0.85rem' }}>
                          {searchQuery 
                            ? `No records matching "${searchQuery}" found in ${displayName || currentTypeObj.label}.` 
                            : `There are currently no stored entries for ${displayName || currentTypeObj.label}. Download the template, fill it out, and upload it.`}
                        </Typography>
                        {!searchQuery && (
                          <Button
                            variant="outlined"
                            endIcon={<ArrowRight size={16} />}
                            onClick={() => navigate('/energy-templates')}
                            sx={{ borderRadius: 2.5, textTransform: 'none', fontWeight: 800, borderColor: '#cbd5e1', color: '#0f172a' }}
                          >
                            Go to Energy Templates
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedRows.map((row, index) => (
                    <TableRow 
                      key={row.id || index} 
                      hover
                      sx={{ 
                        bgcolor: '#ffffff',
                        transition: 'background-color 0.15s ease',
                        '&:hover': {
                          bgcolor: 'rgba(16, 185, 129, 0.05) !important'
                        }
                      }}
                    >
                      <TableCell sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.78rem' }}>
                        {page * rowsPerPage + index + 1}
                      </TableCell>
                      {headers.map((header) => {
                        const fieldName = fieldMap[header];
                        const cellVal = row[fieldName];
                        
                        let displayVal = cellVal;
                        if (cellVal === null || cellVal === undefined || cellVal === '') {
                          displayVal = '-';
                        } else if (typeof cellVal === 'boolean') {
                          displayVal = cellVal ? 'Yes' : 'No';
                        }
                        
                        return (
                          <TableCell 
                            key={header} 
                            sx={{ 
                              whiteSpace: 'nowrap', 
                              fontSize: '0.82rem', 
                              color: displayVal === '-' ? '#94a3b8' : '#1e293b',
                              fontWeight: displayVal === '-' ? 400 : 500
                            }}
                          >
                            {displayVal}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* High Performance Table Pagination */}
        {filteredRows.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[25, 50, 100, 250]}
            component="div"
            count={filteredRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              borderTop: '1px solid #e2e8f0',
              bgcolor: '#f8fafc',
              '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#475569'
              }
            }}
          />
        )}
      </Paper>

    </Box>
  );
};

export default ShowData;
