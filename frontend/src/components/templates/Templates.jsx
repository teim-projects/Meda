import React, { useState, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
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
  Stack
} from '@mui/material';
import { 
  FileSpreadsheet, 
  Download, 
  Upload, 
  FileDown, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  Layers
} from 'lucide-react';
import { energyApi } from '../../services/energyApi';

const ENERGY_TYPES = [
  { val: 'biomass', label: 'Biomass', active: true },
  { val: 'bagasse', label: 'Bagasse', active: true },
  { val: 'msw', label: 'MSW (Municipal Solid Waste)', active: true },
  { val: 'shp', label: 'SHP (Small Hydro Power)', active: true },
  { val: 'solar_grid', label: 'Solar Grid', active: true },
  { val: 'solar_kusum', label: 'Solar Kusum', active: true },
  { val: 'wind', label: 'Wind', active: true },
  { val: 'rooftop_solar', label: 'Rooftop Solar', active: false }, // Listed but inactive/not configured
];

const Templates = () => {
  const [selectedType, setSelectedType] = useState('biomass');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const fileInputRef = useRef(null);

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
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

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
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
      if (data.success) {
        setUploadResult(data);
        setFile(null); // Clear selected file
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setSnackbar({
          open: true,
          message: 'Excel file uploaded and parsed successfully!',
          severity: 'success'
        });
      }
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.error || err.message || 'Excel upload failed.';
      
      // If there are missing columns or validation details, attach them
      if (err.response?.data?.missing_columns) {
        setErrorMsg(`Missing columns in uploaded sheet: ${err.response.data.missing_columns.join(', ')}`);
      } else {
        setErrorMsg(errorMsg);
      }

      setSnackbar({
        open: true,
        message: 'Failed to process Excel upload.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', p: { xs: 2, md: 3 } }}>
      
      {/* Page Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff',
          boxShadow: '0 4px 20px rgba(15, 23, 42, 0.08)'
        }}
      >
        <Typography variant="h5" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <FileSpreadsheet color="#10b981" size={28} /> Renewable Energy Templates
        </Typography>
        <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>
          Select a renewable energy type to download empty Excel templates, upload completed files, or export saved database records.
        </Typography>
      </Paper>

      {/* Control Card */}
      <Card elevation={1} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          
          <Grid container spacing={4} alignItems="flex-start">
            
            {/* Step 1: Select Type */}
            <Grid item xs={12} md={5}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="subtitle1" fontWeight={700} color="#0f172a" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Layers size={18} color="#10b981" /> 1. Select Energy Type
                </Typography>
                
                <TextField
                  select
                  label="Renewable Energy Type"
                  value={selectedType}
                  onChange={handleTypeChange}
                  fullWidth
                  variant="outlined"
                  helperText={!isTypeActive() ? "This source is not configured on the backend yet." : ""}
                  error={!isTypeActive()}
                >
                  {ENERGY_TYPES.map((type) => (
                    <MenuItem key={type.val} value={type.val}>
                      <Stack direction="row" justifyContent="space-between" width="100%" alignItems="center">
                        <Typography>{type.label}</Typography>
                        {!type.active && (
                          <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 600 }}>
                            Not Active
                          </Typography>
                        )}
                      </Stack>
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Grid>

            {/* Divider for larger screens */}
            <Grid item xs={12} md={7}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Typography variant="subtitle1" fontWeight={700} color="#0f172a">
                  2. Operations
                </Typography>

                <Grid container spacing={2}>
                  
                  {/* Action 1: Download Template */}
                  <Grid item xs={12} sm={6}>
                    <Paper 
                      variant="outlined" 
                      sx={{ p: 2.5, textAlign: 'center', borderRadius: 2.5, height: '100%', display: 'flex', flexDirection: 'column', justifyBetween: 'space-between', gap: 2 }}
                    >
                      <Box>
                        <Typography variant="body1" fontWeight={600} color="#334155">
                          Download Template
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                          Download a blank Excel sheet with correct column headers.
                        </Typography>
                      </Box>
                      <Button
                        variant="outlined"
                        startIcon={<Download size={16} />}
                        disabled={loading || !isTypeActive()}
                        onClick={handleDownloadTemplate}
                        fullWidth
                        sx={{ mt: 'auto', borderRadius: 2, py: 1 }}
                      >
                        Download
                      </Button>
                    </Paper>
                  </Grid>

                  {/* Action 2: Download Filled Data */}
                  <Grid item xs={12} sm={6}>
                    <Paper 
                      variant="outlined" 
                      sx={{ p: 2.5, textAlign: 'center', borderRadius: 2.5, height: '100%', display: 'flex', flexDirection: 'column', justifyBetween: 'space-between', gap: 2 }}
                    >
                      <Box>
                        <Typography variant="body1" fontWeight={600} color="#334155">
                          Download Stored Data
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                          Download an Excel file of all entries saved for this type.
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<FileDown size={16} />}
                        disabled={loading || !isTypeActive()}
                        onClick={handleDownloadData}
                        fullWidth
                        sx={{ 
                          mt: 'auto', 
                          borderRadius: 2, 
                          py: 1, 
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)'
                        }}
                      >
                        Export Data
                      </Button>
                    </Paper>
                  </Grid>

                  {/* Action 3: Upload Excel Sheet */}
                  <Grid item xs={12}>
                    <Paper 
                      variant="outlined" 
                      sx={{ p: 3, borderRadius: 2.5, bgcolor: '#f8fafc', borderStyle: 'dashed', borderWidth: 2 }}
                    >
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
                        <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                          <Typography variant="body1" fontWeight={600} color="#334155" sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                            <Upload size={16} color="#10b981" /> Upload Completed Sheet
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                            Select the template with filled rows and import it directly into the database.
                          </Typography>
                        </Box>

                        <input
                          type="file"
                          accept=".xlsx, .xls"
                          style={{ display: 'none' }}
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          disabled={loading || !isTypeActive()}
                        />

                        <Stack direction="row" spacing={1.5} sx={{ width: { xs: '100%', sm: 'auto' }, mt: { xs: 2, sm: 0 } }}>
                          <Button
                            variant="outlined"
                            color="inherit"
                            onClick={triggerFileSelect}
                            disabled={loading || !isTypeActive()}
                            sx={{ flex: 1, whiteSpace: 'nowrap', borderRadius: 2, px: 2.5 }}
                          >
                            {file ? 'Change File' : 'Select Excel'}
                          </Button>

                          {file && (
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={handleUploadExcel}
                              disabled={loading}
                              sx={{ flex: 1, whiteSpace: 'nowrap', borderRadius: 2, px: 2.5 }}
                            >
                              {loading ? <CircularProgress size={20} color="inherit" /> : 'Upload'}
                            </Button>
                          )}
                        </Stack>
                      </Stack>

                      {file && (
                        <Box sx={{ mt: 2, p: 1, bgcolor: '#ffffff', borderRadius: 1.5, border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Info size={14} color="#64748b" />
                          <Typography variant="caption" color="#475569" fontWeight={500} noWrap sx={{ maxWidth: '80%' }}>
                            Selected File: <strong>{file.name}</strong> ({(file.size / 1024).toFixed(1)} KB)
                          </Typography>
                        </Box>
                      )}
                    </Paper>
                  </Grid>

                </Grid>
              </Box>
            </Grid>

          </Grid>

        </CardContent>
      </Card>

      {/* Spinner Loading Overlay */}
      {loading && !file && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress color="primary" />
        </Box>
      )}

      {/* Validation & Upload Results Panel */}
      {uploadResult && (
        <Card elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 3, p: 3, mb: 4 }}>
          <Typography variant="h6" fontWeight={700} sx={{ color: '#0f172a', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircle2 color="#10b981" size={20} /> Import Result Summary
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={4}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, textAlign: 'center', bgcolor: '#f0fdf4', borderColor: '#bbf7d0' }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>SUCCESSFULLY IMPORTED</Typography>
                <Typography variant="h4" fontWeight={800} color="#15803d" sx={{ mt: 0.5 }}>{uploadResult.imported_count}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, textAlign: 'center', bgcolor: uploadResult.failed_count > 0 ? '#fef2f2' : '#f8fafc', borderColor: uploadResult.failed_count > 0 ? '#fecaca' : '#cbd5e1' }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>FAILED ROWS</Typography>
                <Typography variant="h4" fontWeight={800} color={uploadResult.failed_count > 0 ? '#b91c1c' : '#64748b'} sx={{ mt: 0.5 }}>{uploadResult.failed_count}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, textAlign: 'center', bgcolor: '#f8fafc' }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>TOTAL PROCESSED</Typography>
                <Typography variant="h4" fontWeight={800} color="#334155" sx={{ mt: 0.5 }}>{uploadResult.imported_count + uploadResult.failed_count}</Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Row-by-Row Failures detailed review */}
          {uploadResult.failed_count > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" fontWeight={700} color="#b91c1c" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
                <AlertTriangle size={16} /> Parsing Errors Breakdown
              </Typography>
              <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <List disablePadding sx={{ maxHeight: 250, overflowY: 'auto' }}>
                  {uploadResult.failed_rows.map((rowObj, index) => (
                    <React.Fragment key={`err-row-${rowObj.row_number}`}>
                      {index > 0 && <Divider />}
                      <ListItem sx={{ py: 1.5, px: 2 }}>
                        <ListItemText 
                          primary={<Typography variant="body2" fontWeight={600} color="#334155">Row #{rowObj.row_number} - Error Description</Typography>}
                          secondary={
                            <Box sx={{ mt: 0.5 }}>
                              <Typography variant="caption" color="#ef4444" sx={{ display: 'block', fontFamily: 'monospace', bgcolor: '#fef2f2', p: 1, borderRadius: 1 }}>
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
        </Card>
      )}

      {/* Main Error Box */}
      {errorMsg && (
        <Alert severity="error" sx={{ borderRadius: 3, mb: 4 }} icon={<AlertTriangle />}>
          <Typography variant="subtitle2" fontWeight={700}>Import Failed</Typography>
          <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>{errorMsg}</Typography>
        </Alert>
      )}

      {/* Snackbar Alert Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%', borderRadius: 2 }} elevation={6}>
          {snackbar.message}
        </Alert>
      </Snackbar>

    </Box>
  );
};

export default Templates;
