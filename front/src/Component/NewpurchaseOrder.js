import React from 'react';
import {
    Box, Button, Typography, Grid, TextField, MenuItem, IconButton, Select,
    InputLabel, FormControl, Divider, Breadcrumbs, Link, Radio, RadioGroup, FormControlLabel, InputBase,Avatar
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Sidebar from './Sidebar';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import Checkbox from '@mui/material/Checkbox';
import { useState } from 'react';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useNavigate } from 'react-router-dom';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
const PurchaseOrderForm = () => {
const navigate= useNavigate()
    const [customers, setCustomers] = useState(['Customer 1', 'Customer 2']);
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [customerModalOpen, setCustomerModalOpen] = useState(false);
    const [customerTab, setCustomerTab] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    const [previewOpen, setPreviewOpen] = useState(false);

    const handleAddCustomer = () => {
        setCustomerModalOpen(true);
    }
    const [items, setItems] = useState(['Item 1', 'Item 2']);
    const [itemModalOpen, setItemModalOpen] = useState(false);
    const [itemSearchTerm, setItemSearchTerm] = useState('');
    const [rows, setRows] = useState([
        { item: '', qty: 0, rate: 0, discount: 0, amount: 0 },
    ]);



    const handleItemSelect = (rowIndex, itemName) => {
        const updatedRows = [...rows];
        updatedRows[rowIndex].item = itemName;
        setRows(updatedRows);
        setItemModalOpen(false);
    };


    const updateRow = (index, field, value) => {
        const updated = [...rows];
        updated[index][field] = parseFloat(value) || 0;
        updated[index].amount = calculateAmount(updated[index]);
        setRows(updated);
    };


    const calculateAmount = (row) => {
        const total = (row.qty || 0) * (row.rate || 0);
        return total - (row.discount || 0);
    };

    const addNewRow = () => {
        setRows([...rows, { item: '', qty: 0, rate: 0, discount: 0, amount: 0 }]);
    };

    const deleteRow = (index) => {
        const updated = [...rows];
        updated.splice(index, 1);
        setRows(updated);
    };

    const subtotal = rows.reduce((sum, row) => sum + calculateAmount(row), 0);
    const gst = subtotal * 0.09;
    const total = subtotal + gst * 2;

    return (
        <Box sx={{ display: 'flex', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
            <Sidebar />

            <Box flex={1} display="flex" flexDirection="column" minHeight="100vh">
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
                        <Typography color="text.secondary" fontSize="14px" >
                            Purchase order
                        </Typography>
                        <Typography color="text.primary" fontWeight={600} fontSize="14px">
                            New Purchase order
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


                <Box p={3}>
                    <Paper sx={{ p: 1, borderRadius: 2 }}>
                        <Typography fontWeight="bold" fontSize={18} mb={2}>New Purchase Order</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}><TextField fullWidth label="Purchase Order*" sx={{  width: 500,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '22px',
                    bgcolor: '#f9fafb',height:40,
                  },}} defaultValue="PO-0001" /></Grid>
                   <Grid container spacing={2} sx={{ mt: 1 }}>
                  
                                <Grid item xs={12} sm={6} md={3}>
                           
                                <Typography fontWeight="bold" fontSize={13}>Delivery Address*</Typography>
                                <RadioGroup row defaultValue="organization">
                                    <FormControlLabel value="organization" control={<Radio />} label="Organization" />
                                    <FormControlLabel value="customer" control={<Radio />} label="Customer" />
                                </RadioGroup>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={2}
                                    defaultValue={`Laxmi Enterprises,\nNagpur, Maharashtra, 200145`}
                                />
                                <Button size="small" sx={{ textTransform: 'none', mt: 1 }}>✏️ Edit Details</Button>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <FormControl sx={{  width: 150,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '22px',
                    bgcolor: '#f9fafb',height:40,
                  },}}>
                                    <InputLabel >Vendor Name*</InputLabel>
                                    <Select defaultValue="">
                                        <MenuItem value="">Select or add a vendor</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={4}><TextField fullWidth label="Purchase Order Date*" type="date" defaultValue="2025-06-21" InputLabelProps={{ shrink: true }} sx={{  width: 150,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '22px',
                    bgcolor: '#f9fafb',height:40,
                  },}} /></Grid>
                            <Grid item xs={12} sm={4}><TextField fullWidth label="Delivery Date" type="date" InputLabelProps={{ shrink: true }}sx={{  width: 150,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '22px',
                    bgcolor: '#f9fafb',height:40,
                  },}} /></Grid>
                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth sx={{  width: 150,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '22px',
                    bgcolor: '#f9fafb',height:40,
                  },}}>
                                    <InputLabel>Payment Terms</InputLabel>
                                    <Select defaultValue="Due end of the month" >
                                        <MenuItem value="Due end of the month">Due end of the month</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={4}><TextField fullWidth label="Due Date" type="date" defaultValue="2025-06-30" InputLabelProps={{ shrink: true }} sx={{  width: 150,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '22px',
                    bgcolor: '#f9fafb',height:40,
                  },}}/></Grid></Grid></Grid>
                        

                        <Box mt={3}>
                            <Divider />
                            <Typography variant="subtitle1" fontWeight="bold" mb={1} sx={{ fontWeight: 600, fontSize: 18, }}>
                                Item Table
                            </Typography>
                            <Box display="flex" justifyContent="flex-end" >
                                <Button variant="text" sx={{ fontWeight: 500, color: '#1976d2' }} onClick={addNewRow}>
                                    + ADD NEW ROW
                                </Button>
                                <Button variant="text" sx={{ fontWeight: 500, color: '#1976d2' }}>
                                    + ADD ITEMS IN BULK
                                </Button>
                            </Box>

                            <TableContainer component={Paper} sx={{ mt: 3, boxShadow: 'none' }}>
                                <Table size="small">
                                    <TableHead sx={{ backgroundColor: '#f9fafb' }}>
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

                                <Grid item xs={12} sm={6} md={4} sx={{ ml: 20 }}>
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
                                <Button variant="outlined" color="inherit">Cancel</Button>
                                <Button variant="outlined"sx={{ textTransform: 'none',
                                borderRadius: 2,
                                px: 4,
                               
                                '&:hover': {  }}} onClick={() => navigate('/purchase-order-list')}>Save as Draft</Button>
                                <Button variant="contained" sx={{ textTransform: 'none',
                                borderRadius: 2,
                                px: 4,
                                bgcolor: '#004085',
                                '&:hover': { bgcolor: '#003366' }}}onClick={() => navigate('/purchase-order-list')}>Save & Send</Button>
                            </Box>
                        </Box></Paper>
                </Box>
            </Box>
        </Box>
    );
};

export default PurchaseOrderForm;
