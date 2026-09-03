import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Alert,
  CircularProgress,
  Snackbar,
  MenuItem,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
  Stack,
  Chip,
  IconButton
} from '@mui/material';
import { 
  FileSpreadsheet, 
  Download, 
  Upload, 
  FileDown, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  Layers,
  Flame,
  Sprout,
  Recycle,
  Droplets,
  Sun,
  Zap,
  Wind,
  Home,
  Building2,
  Sparkles,
  FileCheck,
  X,
  Check,
  DatabaseCheck,
  Activity,
  Cpu
} from 'lucide-react';
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

const Templates = () => {
  const [selectedType, setSelectedType] = useState('biomass');
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const fileInputRef = useRef(null);

  const currentTypeObj = ENERGY_TYPES.find(e => e.val === selectedType) || ENERGY_TYPES[0];

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSelectType = (val) => {
    setSelectedType(val);
    setFile(null);
    setUploadResult(null);
    setErrorMsg(null);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadResult(null);
      setErrorMsg(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith('.xlsx') || droppedFile.name.endsWith('.xls')) {
        setFile(droppedFile);
        setUploadResult(null);
        setErrorMsg(null);
      } else {
        setSnackbar({
          open: true,
          message: 'Invalid file format. Please upload an Excel sheet (.xlsx or .xls).',
          severity: 'error'
        });
      }
    }
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const clearSelectedFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isTypeActive = () => {
    const matched = ENERGY_TYPES.find(e => e.val === selectedType);
    return matched ? matched.active : false;
  };

  const handleDownloadTemplate = async () => {
    if (!isTypeActive()) {
      setSnackbar({
        open: true,
        message: 'This energy type template is not configured yet.',
        severity: 'warning'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await energyApi.downloadTemplate(selectedType);
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `${selectedType}_template.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setSnackbar({
        open: true,
        message: 'Template downloaded successfully!',
        severity: 'success'
      });
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: 'Failed to download template.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadData = async () => {
    if (!isTypeActive()) {
      setSnackbar({
        open: true,
        message: 'This energy type dataset is not configured yet.',
        severity: 'warning'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await energyApi.downloadFilledData(selectedType);
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `${selectedType}_filled_data.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setSnackbar({
        open: true,
        message: 'Data exported successfully!',
        severity: 'success'
      });
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: 'Failed to download filled data.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUploadExcel = async () => {
    if (!file) {
      setSnackbar({
        open: true,
        message: 'Please select an Excel file to upload.',
        severity: 'warning'
      });
      return;
    }

    setLoading(true);
    setUploadResult(null);
    setErrorMsg(null);

    try {
      const data = await energyApi.uploadExcel(selectedType, file);
      if (data) {
        setUploadResult(data);
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        if (data.imported_count === 0) {
          setErrorMsg(data.message || '0 records were imported into the database.');
          setSnackbar({
            open: true,
            message: 'Upload completed, but 0 records were imported into database.',
            severity: 'warning'
          });
        } else {
          setSnackbar({
            open: true,
            message: data.message || `Successfully imported ${data.imported_count} records!`,
            severity: 'success'
          });
        }
      }
    } catch (err) {
      console.error(err);
      const resData = err.response?.data;
      if (resData) {
        setUploadResult(resData);
      }
      
      let errorMsgText = resData?.error || resData?.detail || err.message || 'Excel upload failed.';
      
      if (err.response?.status === 401) {
        errorMsgText = 'Session expired or unauthorized. Please log in again.';
      }

      if (resData?.expected_columns && resData?.provided_columns) {
        errorMsgText += ` Expected headers: [${resData.expected_columns.join(', ')}]. Provided headers in sheet: [${resData.provided_columns.join(', ')}]`;
      } else if (resData?.missing_columns) {
        errorMsgText = `Missing columns in uploaded sheet: ${resData.missing_columns.join(', ')}`;
      }

      if (resData?.failed_rows && resData.failed_rows.length > 0) {
        const rowErrDetails = resData.failed_rows.map(fr => `Row ${fr.row_number}: ${fr.error}`).join('; ');
        errorMsgText += ` Failed row details: ${rowErrDetails}`;
      }

      setErrorMsg(errorMsgText);

      setSnackbar({
        open: true,
        message: err.response?.status === 401 
          ? 'Session expired. Please log in again.' 
          : (resData?.error || resData?.detail || 'Failed to process Excel upload. Check error details below.'),
        severity: 'error'
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
                <FileSpreadsheet size={22} />
              </Box>
              <Chip 
                icon={<Sparkles size={13} style={{ color: '#34d399' }} />}
                label="MEDA ENERGY ENGINE" 
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
              Renewable Energy Templates
            </Typography>
            <Typography variant="body2" sx={{ color: '#e2e8f0 !important', lineHeight: 1.5, fontSize: '0.9rem', opacity: 0.9 }}>
              Select a renewable energy type to download empty Excel templates, upload completed files, or export saved database records.
            </Typography>
          </Box>

          <Stack direction={{ xs: 'row', sm: 'row' }} spacing={1.5} alignItems="center" sx={{ zIndex: 1, ml: { md: 'auto' }, width: { xs: '100%', sm: 'auto' }, justifyContent: 'space-between' }}>
            {/* Active Modules Pill */}
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
                <Activity size={18} />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="caption" sx={{ color: '#94a3b8 !important', display: 'block', fontWeight: 700, fontSize: '0.62rem', lineHeight: 1, mb: 0.3 }}>
                  ACTIVE MODULES
                </Typography>
                <Typography variant="subtitle2" noWrap sx={{ color: '#ffffff !important', fontWeight: 800, fontSize: { xs: '0.85rem', sm: '0.98rem' }, lineHeight: 1 }}>
                  8 / 8 Modules
                </Typography>
              </Box>
            </Box>

            {/* Format Spec Pill */}
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
              <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(56, 189, 248, 0.25)', color: '#38bdf8', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                <FileCheck size={18} />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="caption" sx={{ color: '#94a3b8 !important', display: 'block', fontWeight: 700, fontSize: '0.62rem', lineHeight: 1, mb: 0.3 }}>
                  FORMAT SPEC
                </Typography>
                <Typography variant="subtitle2" noWrap sx={{ color: '#38bdf8 !important', fontWeight: 800, fontSize: { xs: '0.85rem', sm: '0.98rem' }, lineHeight: 1 }}>
                  Excel (.XLSX)
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Stack>
      </Paper>

      {/* 🚀 WORKFLOW STEPPER BANNER */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          px: 3,
          mb: 3.5,
          borderRadius: 3,
          bgcolor: '#ffffff',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
        }}
      >
        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
            gap: 2,
            alignItems: 'center'
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#f0fdf4', color: '#10b981', flexShrink: 0 }}>
              <Layers size={18} />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ fontSize: '0.68rem' }}>STEP 1</Typography>
              <Typography variant="subtitle2" fontWeight={800} color="#0f172a" sx={{ fontSize: '0.85rem' }}>Select Energy Source</Typography>
            </Box>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#f0fdf4', color: '#10b981', flexShrink: 0 }}>
              <Download size={18} />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ fontSize: '0.68rem' }}>STEP 2</Typography>
              <Typography variant="subtitle2" fontWeight={800} color="#0f172a" sx={{ fontSize: '0.85rem' }}>Download Template</Typography>
            </Box>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#f5f3ff', color: '#8b5cf6', flexShrink: 0 }}>
              <Upload size={18} />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ fontSize: '0.68rem' }}>STEP 3</Typography>
              <Typography variant="subtitle2" fontWeight={800} color="#0f172a" sx={{ fontSize: '0.85rem' }}>Upload Completed Sheet</Typography>
            </Box>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#eff6ff', color: '#3b82f6', flexShrink: 0 }}>
              <FileDown size={18} />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ fontSize: '0.68rem' }}>STEP 4</Typography>
              <Typography variant="subtitle2" fontWeight={800} color="#0f172a" sx={{ fontSize: '0.85rem' }}>Export Stored Data</Typography>
            </Box>
          </Stack>
        </Box>
      </Paper>

      {/* SECTION 1: Interactive Energy Source Selector */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2 }}>
          <Box 
            sx={{ 
              width: 30, 
              height: 30, 
              borderRadius: '50%', 
              bgcolor: '#10b981', 
              color: '#ffffff', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.85rem',
              boxShadow: '0 3px 10px rgba(16, 185, 129, 0.3)'
            }}
          >
            1
          </Box>
          <Typography variant="h6" fontWeight={800} color="#0f172a" sx={{ fontSize: '1.15rem' }}>
            Select Energy Source
          </Typography>
        </Box>

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
                onClick={() => handleSelectType(type.val)}
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
                          icon={<Check size={11} color="#ffffff" />}
                          label="ACTIVE"
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

      {/* SECTION 2: OPERATIONS DECK (GUARANTEED PERFECT SINGLE ROW GRID) */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2 }}>
          <Box 
            sx={{ 
              width: 30, 
              height: 30, 
              borderRadius: '50%', 
              bgcolor: '#10b981', 
              color: '#ffffff', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.85rem',
              boxShadow: '0 3px 10px rgba(16, 185, 129, 0.3)'
            }}
          >
            2
          </Box>
          <Typography variant="h6" fontWeight={800} color="#0f172a" sx={{ fontSize: '1.15rem' }}>
            Operations Deck: <span style={{ color: currentTypeObj.color }}>{currentTypeObj.label}</span>
          </Typography>
        </Box>

        {/* CSS GRID: EXACT 3 EQUAL COLUMNS SIDE-BY-SIDE (NO EARLY WRAPPING) */}
        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, 
            gap: 3,
            alignItems: 'stretch'
          }}
        >
          
          {/* CARD 1: DOWNLOAD TEMPLATE */}
          <Paper 
            elevation={0}
            sx={{ 
              borderRadius: 4, 
              border: '1px solid #e2e8f0', 
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              p: 3,
              bgcolor: '#ffffff',
              transition: 'all 0.2s ease',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
              '&:hover': {
                borderColor: '#10b981',
                transform: 'translateY(-2px)',
                boxShadow: '0 10px 25px rgba(16, 185, 129, 0.12)'
              }
            }}
          >
            <Box 
              sx={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                right: 0, 
                height: 4, 
                background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)' 
              }} 
            />

            <Box>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.8 }}>
                <Box sx={{ p: 1.2, borderRadius: 2.5, bgcolor: '#f0fdf4', color: '#10b981' }}>
                  <Download size={22} />
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight={800} color="#0f172a" sx={{ fontSize: '0.98rem' }}>
                    1. Download Template
                  </Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: '0.72rem' }}>
                    Blank Excel Header Specification
                  </Typography>
                </Box>
              </Stack>

              <Typography variant="body2" color="#475569" sx={{ mb: 2, lineHeight: 1.5, fontSize: '0.85rem' }}>
                Download official blank Excel spreadsheet with pre-mapped headers for <strong>{currentTypeObj.label}</strong>.
              </Typography>

              <Stack spacing={1} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle2 size={15} color="#10b981" />
                  <Typography variant="caption" color="#334155" fontWeight={600} sx={{ fontSize: '0.75rem' }}>Verified column header mapping</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle2 size={15} color="#10b981" />
                  <Typography variant="caption" color="#334155" fontWeight={600} sx={{ fontSize: '0.75rem' }}>Pre-configured data validation rules</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle2 size={15} color="#10b981" />
                  <Typography variant="caption" color="#334155" fontWeight={600} sx={{ fontSize: '0.75rem' }}>Ready for data entry & batch upload</Typography>
                </Box>
              </Stack>
            </Box>

            <Button
              variant="outlined"
              startIcon={<Download size={16} />}
              disabled={loading || !isTypeActive()}
              onClick={handleDownloadTemplate}
              fullWidth
              sx={{ 
                borderRadius: 2.5, 
                py: 1.2, 
                borderColor: '#cbd5e1', 
                color: '#0f172a',
                fontWeight: 800,
                textTransform: 'none',
                fontSize: '0.88rem',
                mt: 'auto',
                '&:hover': {
                  borderColor: '#10b981',
                  bgcolor: 'rgba(16, 185, 129, 0.06)'
                }
              }}
            >
              Download Blank Excel
            </Button>
          </Paper>

          {/* CARD 2: UPLOAD COMPLETED SHEET */}
          <Paper 
            elevation={0}
            sx={{ 
              borderRadius: 4, 
              border: '1px solid #e2e8f0', 
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              p: 3,
              bgcolor: '#ffffff',
              transition: 'all 0.2s ease',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
              '&:hover': {
                borderColor: '#8b5cf6',
                transform: 'translateY(-2px)',
                boxShadow: '0 10px 25px rgba(139, 92, 246, 0.12)'
              }
            }}
          >
            <Box 
              sx={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                right: 0, 
                height: 4, 
                background: 'linear-gradient(90deg, #8b5cf6 0%, #ec4899 100%)' 
              }} 
            />

            <Box>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.8 }}>
                <Box sx={{ p: 1.2, borderRadius: 2.5, bgcolor: '#f5f3ff', color: '#8b5cf6' }}>
                  <Upload size={22} />
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight={800} color="#0f172a" sx={{ fontSize: '0.98rem' }}>
                    2. Upload Completed Sheet
                  </Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: '0.72rem' }}>
                    Batch Excel Parser & Database Import
                  </Typography>
                </Box>
              </Stack>

              {/* Drag and Drop Box */}
              <Box
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileSelect}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  border: '2px dashed',
                  borderColor: isDragging ? '#10b981' : file ? '#10b981' : '#cbd5e1',
                  bgcolor: isDragging ? 'rgba(16, 185, 129, 0.08)' : file ? '#f0fdf4' : '#f8fafc',
                  textAlign: 'center',
                  cursor: loading || !isTypeActive() ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  mb: 2,
                  '&:hover': {
                    borderColor: !isTypeActive() ? '#cbd5e1' : '#10b981',
                    bgcolor: !isTypeActive() ? '#f8fafc' : '#f0fdf4'
                  }
                }}
              >
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  style={{ display: 'none' }}
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  disabled={loading || !isTypeActive()}
                />

                {file ? (
                  <Box sx={{ py: 0.5 }}>
                    <FileCheck size={28} color="#10b981" style={{ margin: '0 auto 6px auto' }} />
                    <Typography variant="subtitle2" fontWeight={800} color="#0f172a" noWrap sx={{ maxWidth: '100%', fontSize: '0.85rem' }}>
                      {file.name}
                    </Typography>
                    <Typography variant="caption" color="#64748b" sx={{ display: 'block', mt: 0.5, fontWeight: 700, fontSize: '0.72rem' }}>
                      {(file.size / 1024).toFixed(1)} KB • Ready to parse
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ py: 0.5 }}>
                    <Upload size={24} color="#94a3b8" style={{ margin: '0 auto 6px auto' }} />
                    <Typography variant="body2" fontWeight={800} color="#334155" sx={{ fontSize: '0.82rem' }}>
                      Drag & Drop Excel sheet here
                    </Typography>
                    <Typography variant="caption" color="#94a3b8" sx={{ display: 'block', mt: 0.5, fontWeight: 600, fontSize: '0.7rem' }}>
                      or click to browse (.xlsx / .xls)
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>

            <Stack direction="row" spacing={1.2} sx={{ mt: 'auto' }}>
              {file ? (
                <>
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={clearSelectedFile}
                    disabled={loading}
                    sx={{ borderRadius: 2.5, py: 1.2, px: 2, color: '#64748b', textTransform: 'none', fontWeight: 700, fontSize: '0.85rem' }}
                  >
                    Clear
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleUploadExcel}
                    disabled={loading}
                    fullWidth
                    sx={{ 
                      borderRadius: 2.5, 
                      py: 1.2, 
                      bgcolor: '#0f172a',
                      fontWeight: 800,
                      textTransform: 'none',
                      fontSize: '0.88rem',
                      '&:hover': { bgcolor: '#1e293b' }
                    }}
                  >
                    {loading ? <CircularProgress size={20} color="inherit" /> : 'Run Import'}
                  </Button>
                </>
              ) : (
                <Button
                  variant="outlined"
                  onClick={triggerFileSelect}
                  disabled={loading || !isTypeActive()}
                  fullWidth
                  sx={{ 
                    borderRadius: 2.5, 
                    py: 1.2, 
                    borderColor: '#cbd5e1',
                    color: '#0f172a',
                    fontWeight: 800,
                    textTransform: 'none',
                    fontSize: '0.88rem'
                  }}
                >
                  Select File
                </Button>
              )}
            </Stack>
          </Paper>

          {/* CARD 3: EXPORT STORED DATA */}
          <Paper 
            elevation={0}
            sx={{ 
              borderRadius: 4, 
              border: '1px solid #e2e8f0', 
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              p: 3,
              bgcolor: '#ffffff',
              transition: 'all 0.2s ease',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
              '&:hover': {
                borderColor: '#3b82f6',
                transform: 'translateY(-2px)',
                boxShadow: '0 10px 25px rgba(59, 130, 246, 0.12)'
              }
            }}
          >
            <Box 
              sx={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                right: 0, 
                height: 4, 
                background: 'linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%)' 
              }} 
            />

            <Box>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.8 }}>
                <Box sx={{ p: 1.2, borderRadius: 2.5, bgcolor: '#eff6ff', color: '#3b82f6' }}>
                  <FileDown size={22} />
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight={800} color="#0f172a" sx={{ fontSize: '0.98rem' }}>
                    3. Export Stored Data
                  </Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: '0.72rem' }}>
                    Database Records to Excel
                  </Typography>
                </Box>
              </Stack>

              <Typography variant="body2" color="#475569" sx={{ mb: 2, lineHeight: 1.5, fontSize: '0.85rem' }}>
                Export all currently saved database entries for <strong>{currentTypeObj.label}</strong> into an Excel sheet.
              </Typography>

              <Stack spacing={1} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle2 size={15} color="#3b82f6" />
                  <Typography variant="caption" color="#334155" fontWeight={600} sx={{ fontSize: '0.75rem' }}>Full parsed dataset export</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle2 size={15} color="#3b82f6" />
                  <Typography variant="caption" color="#334155" fontWeight={600} sx={{ fontSize: '0.75rem' }}>Includes timestamped records</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle2 size={15} color="#3b82f6" />
                  <Typography variant="caption" color="#334155" fontWeight={600} sx={{ fontSize: '0.75rem' }}>Instant 1-click database download</Typography>
                </Box>
              </Stack>
            </Box>

            <Button
              variant="contained"
              startIcon={<FileDown size={16} />}
              disabled={loading || !isTypeActive()}
              onClick={handleDownloadData}
              fullWidth
              sx={{ 
                borderRadius: 2.5, 
                py: 1.2, 
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.22)',
                fontWeight: 800,
                textTransform: 'none',
                fontSize: '0.88rem',
                mt: 'auto',
                '&:hover': {
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                }
              }}
            >
              Export Saved Dataset (.xlsx)
            </Button>
          </Paper>

        </Box>
      </Box>

      {/* Spinner Loading Overlay */}
      {loading && !file && (
        <Paper elevation={0} sx={{ p: 3, textAlign: 'center', borderRadius: 3, border: '1px solid #e2e8f0', my: 3 }}>
          <CircularProgress color="success" size={32} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5, fontWeight: 700 }}>
            Processing database request...
          </Typography>
        </Paper>
      )}

      {/* Main Error Box */}
      {errorMsg && (
        <Alert 
          severity="error" 
          sx={{ borderRadius: 3, mb: 3, border: '1px solid #fecaca' }} 
          icon={<AlertTriangle color="#ef4444" size={22} />}
          action={
            <IconButton size="small" onClick={() => setErrorMsg(null)}>
              <X size={16} />
            </IconButton>
          }
        >
          <Typography variant="subtitle2" fontWeight={800}>Import Failed</Typography>
          <Typography variant="body2" sx={{ mt: 0.5, fontFamily: 'monospace', fontSize: '0.85rem' }}>
            {errorMsg}
          </Typography>
        </Alert>
      )}

      {/* 📊 UPLOAD RESULTS PANEL */}
      {uploadResult && (
        <Paper 
          elevation={0} 
          sx={{ 
            border: '1px solid #e2e8f0', 
            borderRadius: 4, 
            p: { xs: 2.5, md: 3.5 }, 
            mb: 4,
            bgcolor: '#ffffff',
            boxShadow: '0 8px 25px rgba(0,0,0,0.03)'
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2.5 }}>
            <Typography variant="h6" fontWeight={800} sx={{ color: '#0f172a', display: 'flex', alignItems: 'center', gap: 1.2 }}>
              <DatabaseCheck color="#10b981" size={24} /> Batch Import Summary Report
            </Typography>
            <Chip 
              label={`Parsed Source: ${selectedType}`} 
              size="small" 
              sx={{ bgcolor: '#f1f5f9', color: '#475569', fontWeight: 800 }} 
            />
          </Stack>
          
          <Box 
            sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, 
              gap: 2, 
              mb: 2.5 
            }}
          >
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2.2, 
                borderRadius: 3, 
                textAlign: 'center', 
                bgcolor: '#f0fdf4', 
                border: '1px solid #bbf7d0' 
              }}
            >
              <Typography variant="caption" color="#166534" fontWeight={800} sx={{ letterSpacing: '0.6px', fontSize: '0.7rem' }}>
                SUCCESSFULLY IMPORTED
              </Typography>
              <Typography variant="h3" fontWeight={800} color="#15803d" sx={{ mt: 0.5, fontSize: '2rem' }}>
                {uploadResult.imported_count}
              </Typography>
              <Typography variant="caption" color="#15803d" fontWeight={600} sx={{ fontSize: '0.72rem' }}>Rows added to database</Typography>
            </Paper>

            <Paper 
              elevation={0} 
              sx={{ 
                p: 2.2, 
                borderRadius: 3, 
                textAlign: 'center', 
                bgcolor: uploadResult.failed_count > 0 ? '#fef2f2' : '#f8fafc', 
                border: '1px solid',
                borderColor: uploadResult.failed_count > 0 ? '#fecaca' : '#cbd5e1' 
              }}
            >
              <Typography variant="caption" color={uploadResult.failed_count > 0 ? '#991b1b' : '#64748b'} fontWeight={800} sx={{ letterSpacing: '0.6px', fontSize: '0.7rem' }}>
                FAILED ROWS
              </Typography>
              <Typography variant="h3" fontWeight={800} color={uploadResult.failed_count > 0 ? '#b91c1c' : '#64748b'} sx={{ mt: 0.5, fontSize: '2rem' }}>
                {uploadResult.failed_count}
              </Typography>
              <Typography variant="caption" color={uploadResult.failed_count > 0 ? '#b91c1c' : '#64748b'} fontWeight={600} sx={{ fontSize: '0.72rem' }}>
                Rows skipped due to errors
              </Typography>
            </Paper>

            <Paper 
              elevation={0} 
              sx={{ 
                p: 2.2, 
                borderRadius: 3, 
                textAlign: 'center', 
                bgcolor: '#f8fafc', 
                border: '1px solid #e2e8f0' 
              }}
            >
              <Typography variant="caption" color="#475569" fontWeight={800} sx={{ letterSpacing: '0.6px', fontSize: '0.7rem' }}>
                TOTAL PROCESSED
              </Typography>
              <Typography variant="h3" fontWeight={800} color="#0f172a" sx={{ mt: 0.5, fontSize: '2rem' }}>
                {uploadResult.imported_count + uploadResult.failed_count}
              </Typography>
              <Typography variant="caption" color="#64748b" fontWeight={600} sx={{ fontSize: '0.72rem' }}>Total sheet rows evaluated</Typography>
            </Paper>
          </Box>

          {/* Detailed Row-by-Row Failures Breakdown */}
          {uploadResult.failed_count > 0 && uploadResult.failed_rows && uploadResult.failed_rows.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" fontWeight={800} color="#b91c1c" sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 1.2 }}>
                <AlertTriangle size={16} /> Parsing Errors Breakdown
              </Typography>
              
              <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid #fecaca' }}>
                <List disablePadding sx={{ maxHeight: 300, overflowY: 'auto' }}>
                  {uploadResult.failed_rows.map((rowObj, index) => (
                    <React.Fragment key={`err-row-${rowObj.row_number}-${index}`}>
                      {index > 0 && <Divider sx={{ borderColor: '#fee2e2' }} />}
                      <ListItem sx={{ py: 1.5, px: 2.5, bgcolor: '#ffffff' }}>
                        <ListItemText 
                          primary={
                            <Stack direction="row" alignItems="center" spacing={1.2}>
                              <Chip 
                                label={`Row #${rowObj.row_number}`} 
                                size="small" 
                                sx={{ bgcolor: '#fef2f2', color: '#b91c1c', fontWeight: 800, borderRadius: 1.5 }} 
                              />
                              <Typography variant="body2" fontWeight={700} color="#334155" sx={{ fontSize: '0.85rem' }}>
                                Header or Data Type Validation Error
                              </Typography>
                            </Stack>
                          }
                          secondary={
                            <Box sx={{ mt: 0.8 }}>
                              <Typography 
                                variant="caption" 
                                color="#dc2626" 
                                sx={{ 
                                  display: 'block', 
                                  fontFamily: 'monospace', 
                                  bgcolor: '#fef2f2', 
                                  p: 1.2, 
                                  borderRadius: 2,
                                  border: '1px solid #fecaca'
                                }}
                              >
                                {rowObj.error}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            </Box>
          )}
        </Paper>
      )}

      {/* Snackbar Alert Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity} 
          sx={{ width: '100%', borderRadius: 2.5, boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }} 
          elevation={6}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

    </Box>
  );
};

export default Templates;
