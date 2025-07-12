import React, { useState } from 'react';
import {
  Box, Button, Typography, Grid, TextField, Select, MenuItem,
  InputLabel, FormControl, IconButton, Paper, Divider,Avatar
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Sidebar from './Sidebar';
import {
  TableContainer, Table, TableHead, TableBody, TableRow, TableCell,
  Checkbox
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { useNavigate } from 'react-router-dom';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

export default function NewQuotation() {
  const [quoteDate, setQuoteDate] = useState('2025-08-21');
  const [expiryDate, setExpiryDate] = useState('2025-09-21');
  const [items, setItems] = useState([
    { id: 1, details: '', quantity: 0, rate: 0, discount: 0 }
  ]);
const [rows, setRows] = useState([
    { item: '', qty: 0, rate: 0, discount: 0, amount: 0 },
  ]);

  const handleAddRow = () => {
    setItems([...items, { id: Date.now(), details: '', quantity: 0, rate: 0, discount: 0 }]);
  };

  const handleRemoveRow = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const calculateAmount = (item) => {
    const amount = (item.quantity * item.rate) - item.discount;
    return isNaN(amount) ? 0 : amount;
  };
const navigate = useNavigate();
const [selectedRowIndex, setSelectedRowIndex] = useState(null);
const [itemModalOpen, setItemModalOpen] = useState(false);
const [itemSearchTerm, setItemSearchTerm] = useState('');
const [previewOpen, setPreviewOpen] = useState(false);


const updateRow = (index, field, value) => {
  const updated = [...items];
  updated[index][field] = field === 'qty' || field === 'rate' ? Number(value) : value;
  setItems(updated);
};


const deleteRow = (index) => {
  const updated = items.filter((_, i) => i !== index);
  setItems(updated);
};

  const subtotal = rows.reduce((sum, row) => sum + calculateAmount(row), 0);
  const gst = subtotal * 0.09;
  const total = subtotal + gst * 2;
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
       <Box sx={{ flex: 1, bgcolor: '#f9fafc', minHeight: '100vh' }}>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            mt: 1,
            px: 3
          }}
        >

          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
            <Typography color="text.secondary" fontSize="14px">
              Quatation
            </Typography>
            <Typography variant="h6" fontWeight={100} sx={{fontSize: 15}}>
              Add Quatation
            </Typography>

          </Breadcrumbs>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Paper
              elevation={0}
              sx={{
                display: 'flex',
                alignItems: 'center',
                px: 1.5,
                py: 0.5,
                borderRadius: '999px',
                border: '1px solid #e0e0e0',
                bgcolor: '#f9fafb',
                width: 240,
              }}
            >
              <SearchIcon sx={{ fontSize: 20, color: '#999' }} />
              <InputBase
                placeholder="Search anything here..."
                sx={{ ml: 1, fontSize: 14, flex: 1 }}
                inputProps={{ 'aria-label': 'search' }}
              />
            </Paper>

            <IconButton
              sx={{
                borderRadius: '12px',
                border: '1px solid #e0e0e0',
                bgcolor: '#f9fafb',
                p: 1,
              }}
            >
              <NotificationsNoneIcon sx={{ fontSize: 20, color: '#666' }} />
            </IconButton> <Box display="flex" alignItems="center" gap={1}>
              <Avatar src="https://i.pravatar.cc/40?img=1" />
              <Typography fontSize={14}>Admin name</Typography>
              <ArrowDropDownIcon />
            </Box>
          </Box>
        </Box>
         <Box sx={{ px: 4, py: 3,  }}>
  <Paper sx={{ p: 1, borderRadius: 2 }}>
           
           
    <Typography     variant="h6"
              sx={{
                fontWeight: 600,
                color: '#111',
                mb: 2,
                borderBottom: '1px solid #eee',
                pb: 1,
              }}>Quatation</Typography>
        <Grid container spacing={2} mb={2}>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField label="Quote#" fullWidth value="QT-000001" InputProps={{ readOnly: true }} sx={{ borderRadius: 2,
                width: { xs: '100%', sm: '100%', md: 400 }
,
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                bgcolor: '#f9fafb',
                height: 40,
              },
            }} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth sx={{
                width: { xs: '100%', sm: '100%', md: 400 }
,
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                bgcolor: '#f9fafb',
                height: 40,
              },
            }}>
              <InputLabel>Customer Name*</InputLabel>
              <Select defaultValue="">
                <MenuItem value=""><em>Select or add a customer</em></MenuItem>
                <MenuItem value="Customer A">Customer A</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Quote Date*"
              type="date"
              fullWidth
              value={quoteDate}
              onChange={(e) => setQuoteDate(e.target.value)}
              InputLabelProps={{ shrink: true }} sx={{
                width: { xs: '100%', sm: '100%', md: 400 }
,
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                bgcolor: '#f9fafb',
                height: 40,
              },
            }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Expiry Date*"
              type="date"
              fullWidth
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              InputLabelProps={{ shrink: true }} sx={{
                width: { xs: '100%', sm: '100%', md: 400 }
,
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                bgcolor: '#f9fafb',
                height: 40,
              },
            }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Subject" fullWidth placeholder="Write what this invoice is about"  sx={{
                width: { xs: '100%', sm: '100%', md: 400 }
,
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                bgcolor: '#f9fafb',
                height: 40,
              },
            }}/>
          </Grid>
        </Grid>

        <Box mt={5}>
            <Divider />
            <Typography variant="subtitle1" fontWeight="bold" mb={2} sx={{ fontWeight: 600, fontSize: 18, }}>
              Item Table
            </Typography>
            <Box display="flex" justifyContent="flex-end" mt={1} gap={3}>
              <Button variant="text" sx={{ fontWeight: 500, color: '#1976d2' }} onClick={handleAddRow}>
                + ADD NEW ROW
              </Button>
              <Button variant="text" sx={{ fontWeight: 500, color: '#1976d2' }}>
                + ADD ITEMS IN BULK
              </Button>
            </Box>

            <TableContainer component={Paper} sx={{ mt: 3, boxShadow: 'none' }}>
              <Table size="small">
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell>Item Details</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Rate</TableCell>
                    <TableCell>Discount</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {rows.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <TextField
                          fullWidth
                          placeholder="Type or Click to select an item"
                          value={row.item}
                          InputProps={{ readOnly: true }}
                          onClick={() => {
                            setSelectedRowIndex(index);
                            setItemModalOpen(true);
                            setItemSearchTerm('');
                          }}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          type="number"
                          value={row.qty}
                          onChange={(e) => updateRow(index, 'qty', e.target.value)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          type="number"
                          value={row.rate}
                          onChange={(e) => updateRow(index, 'rate', e.target.value)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <FormControl fullWidth >
                          <Select
                            value={row.discount}
                            onChange={(e) => updateRow(index, 'discount', e.target.value)}
                          >
                            <MenuItem value={0}>0%</MenuItem>
                            <MenuItem value={5}>5%</MenuItem>
                            <MenuItem value={10}>10%</MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          type="number"
                          value={calculateAmount(row).toFixed(2)}
                          InputProps={{ readOnly: true }}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => deleteRow(index)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Grid container spacing={2} mt={4}>
              <Grid item xs={12} sm={8}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <TextField

                    multiline
                    rows={1}
                    label="Customer Notes"
                    defaultValue="Thanks for your business."
                    helperText="Will be displayed on the invoice"
                    sx={{ bgcolor: '#f9fafb', borderRadius: 1, width: 500, }}
                  />
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={4} sx={{ ml: 15 }}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    bgcolor: '#fafafa',
                    width: '200%',
                  }}
                >
                  {[
                    { label: 'Sub Total', value: `₹${subtotal.toFixed(2)}` },
                    { label: 'CGST (9%)', value: `₹${gst.toFixed(2)}` },
                    { label: 'SGST (9%)', value: `₹${gst.toFixed(2)}` },
                  ].map((item, i) => (
                    <Box
                      key={i}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={1}
                    >
                      <Typography fontSize={14}>{item.label}</Typography>
                      <Typography fontSize={14}>{item.value}</Typography>
                    </Box>
                  ))}

                  <Divider sx={{ my: 1 }} />

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography fontWeight="bold" fontSize="1rem">
                      Total (₹)
                    </Typography>
                    <Typography fontWeight="bold" fontSize="1rem">
                      ₹{total.toFixed(2)}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>

            </Grid>
          </Box>

          <Grid container spacing={2} mt={3}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Terms & Conditions" />
              <Box display="flex" alignItems="center" mt={1}>
                <Checkbox />
                <Typography variant="body2">Use this in future for all invoices</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ ml: 60 }}>
              <Typography>Attachment</Typography>
              <Button variant="outlined" startIcon={<CloudUploadIcon />} sx={{ mt: 1 }}>
                Upload File
              </Button>
              <Typography variant="caption" display="block" mt={1}>
                You can upload a maximum of 10 files, 10MB each
              </Typography>
            </Grid>
          </Grid>

          <Box mt={4} display="flex" justifyContent="space-between" flexWrap="wrap" gap={2}>
            <Box display="flex" justifyContent="flex-end" mb={2}>
              <Button
                startIcon={<VisibilityOutlinedIcon />}
                sx={{ color: '#002D72', textTransform: 'none', fontWeight: 'bold' }}
                onClick={() => setPreviewOpen(true)}
              >
                Preview Invoice
              </Button>

            </Box>
            <Box display="flex" gap={2}>
              <Button variant="outlined" color="error"  sx={{
                                
                                    px: 1,
                                    py: 1,
                                    borderRadius: '15px',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                }}>Cancel</Button>
              <Button variant="outlined"onClick={() => navigate('/quatation-list')}   sx={{
                                  
                                   
                                    px: 1,
                                    py: 1,
                                    borderRadius: '15px',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                }}>Save as Draft</Button>
              <Button variant="contained" onClick={() => navigate('/Quotation-list')}  sx={{
                                    backgroundColor: '#004085',
                                    '&:hover': { backgroundColor: '#003366' },
                                    px: 1,
                                    py: 1,
                                    borderRadius: '15px',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                                }}>Save & Send</Button>
            </Box>
          </Box></Paper></Box>
</Box>
    </Box>
  );
}
