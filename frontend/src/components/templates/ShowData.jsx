import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Stack
} from '@mui/material';
import { Database, AlertCircle } from 'lucide-react';
import { energyApi } from '../../services/energyApi';

const ENERGY_TYPES = [
  { val: 'biomass', label: 'Biomass', active: true },
  { val: 'bagasse', label: 'Bagasse', active: true },
  { val: 'msw', label: 'MSW (Municipal Solid Waste)', active: true },
  { val: 'shp', label: 'SHP (Small Hydro Power)', active: true },
  { val: 'solar_grid', label: 'Solar Grid', active: true },
  { val: 'solar_kusum', label: 'Solar Kusum', active: true },
  { val: 'wind', label: 'Wind', active: true },
  { val: 'rooftop_solar', label: 'Rooftop Solar', active: false },
];

const ShowData = () => {
  const [selectedType, setSelectedType] = useState('biomass');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [headers, setHeaders] = useState([]);
  const [fieldMap, setFieldMap] = useState({});
  const [rows, setRows] = useState([]);
  const [displayName, setDisplayName] = useState('');

  const isTypeActive = () => {
    const matched = ENERGY_TYPES.find(e => e.val === selectedType);
    return matched ? matched.active : false;
  };

  const loadData = async () => {
    if (!isTypeActive()) {
      setHeaders([]);
      setFieldMap({});
      setRows([]);
      setDisplayName('');
      setError('This energy type is not configured yet.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await energyApi.getData(selectedType);
      if (res.success) {
        setHeaders(res.headers || []);
        setFieldMap(res.fields || {});
        setRows(res.data || []);
        setDisplayName(res.display_name || '');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || 'Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedType]);

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: { xs: 2, md: 3 } }}>
      
      {/* Header Info */}
      <Paper elevation={0} sx={{ p: 2.5, mb: 3, borderRadius: 2, border: '1px solid #e2e8f0', bgcolor: '#f8fafc' }}>
        <Typography variant="h5" fontWeight={600} color="#0f172a" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Database size={24} color="#0284c7" /> Show Stored Data
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Select an energy type to display its currently stored database records.
        </Typography>
      </Paper>

      {/* Selector Box */}
      <Card elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 2, mb: 3 }}>
        <CardContent sx={{ p: 2.5 }}>
          <TextField
            select
            label="Renewable Energy Type"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            size="small"
            sx={{ width: 300, maxWidth: '100%' }}
            variant="outlined"
          >
            {ENERGY_TYPES.map((type) => (
              <MenuItem key={type.val} value={type.val} disabled={!type.active}>
                <Stack direction="row" justifyContent="space-between" width="100%" spacing={2}>
                  <Typography fontSize="0.875rem">{type.label}</Typography>
                  {!type.active && (
                    <Typography variant="caption" sx={{ color: '#ef4444' }}>
                      Not Active
                    </Typography>
                  )}
                </Stack>
              </MenuItem>
            ))}
          </TextField>
        </CardContent>
      </Card>

      {/* Main Content Alert or Spinner */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 6 }}>
          <CircularProgress size={36} />
        </Box>
      )}

      {error && !loading && (
        <Alert severity="warning" sx={{ borderRadius: 2, mb: 3 }} icon={<AlertCircle />}>
          {error}
        </Alert>
      )}

      {/* Data Table */}
      {!loading && !error && (
        <Card elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid #e2e8f0', bgcolor: '#f8fafc' }}>
            <Typography variant="subtitle2" fontWeight={600} color="#334155">
              {displayName || 'Energy Source'} Table ({rows.length} records found)
            </Typography>
          </Box>
          
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, bgcolor: '#f1f5f9' }}>#</TableCell>
                  {headers.map((header) => (
                    <TableCell key={header} sx={{ fontWeight: 700, bgcolor: '#f1f5f9', whiteSpace: 'nowrap' }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={headers.length + 1} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                      No data entries found in the database. Please download the template, fill it out, and upload it.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row, index) => (
                    <TableRow key={row.id || index} hover>
                      <TableCell sx={{ color: 'text.secondary', fontWeight: 500 }}>
                        {index + 1}
                      </TableCell>
                      {headers.map((header) => {
                        const fieldName = fieldMap[header];
                        const cellVal = row[fieldName];
                        
                        // Handle date objects / booleans or null values cleanly
                        let displayVal = cellVal;
                        if (cellVal === null || cellVal === undefined) {
                          displayVal = '-';
                        } else if (typeof cellVal === 'boolean') {
                          displayVal = cellVal ? 'Yes' : 'No';
                        }
                        
                        return (
                          <TableCell key={header} sx={{ whiteSpace: 'nowrap' }}>
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
        </Card>
      )}

    </Box>
  );
};

export default ShowData;
