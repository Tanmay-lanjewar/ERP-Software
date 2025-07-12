import { useState } from 'react';
import {
    Box, Button, Typography, Grid, TextField, IconButton,
    MenuItem,  InputAdornment, Breadcrumbs, Link, Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Menu, Checkbox,Avatar,InputBase
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import Sidebar from './Sidebar';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Tabs, Tab } from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
const PurchaseOrderActions = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuIndex, setMenuIndex] = useState(null);
const [tab, setTab] = useState(0);

    const handleMenuOpen = (event, index) => {
        setAnchorEl(event.currentTarget);
        setMenuIndex(index);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setMenuIndex(null);
    };

    const rows = Array.from({ length: 10 }).map((_, i) => ({
        orderNo: 'PO-0001',
        vendor: 'Vendor 1',
        created: '30/06/2025',
        delivery: '30/08/2025',
        status: i % 2 === 0 ? 'Draft' : 'Sent',
        amount: '₹118.00'
    }));

    return (
        <Box display="flex" fontFamily="'Inter', sans-serif">
            <Sidebar />
            <Box flex={1} display="flex" flexDirection="column" minHeight="100vh">

                <Box display="flex" justifyContent="space-between" alignItems="center" p={2} >
                    <Breadcrumbs>
                        <Typography color="text.primary">Purchase Order</Typography>
                    </Breadcrumbs>
                    <Box display="flex" alignItems="right" gap={2}>
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
            </IconButton></Box>
                    </Box> <Box display="flex" alignItems="center" gap={1}>
              <Avatar src="https://i.pravatar.cc/40?img=1" />
              <Typography fontSize={14}>Admin name</Typography>
              <ArrowDropDownIcon />
            </Box>
                

                <Box p={3}>
                    <Box sx={{ px: 2, py: 2 }}>
                                                <Paper sx={{ p: 1, borderRadius: 2, }}>
               <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 4, py: 2,
         
          borderBottom: '1px solid #e0e0e0'
        }}>
                        <Typography fontWeight="bold" fontSize={18}>Purchase Order</Typography>
                        <Button
                            variant="contained"
                            sx={{
                                textTransform: 'none',
                                borderRadius: 2,
                                bgcolor: '#004085',
                                color: '#fff',
                                '&:hover': { bgcolor: '#003366' }
                            }}
                        >
                            + New Purchase Order
                        </Button>


                    </Box>

                   
 <Box sx={{ px: 4, pt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Tabs
            value={tab}
            onChange={(e, newTab) => setTab(newTab)}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                bgcolor: '#f1f1f1',
                borderRadius: 2,
                mr: 1,
                textDecoration: 'none',
              },
              '& .Mui-selected': {
                bgcolor: '#004085',
                color: 'white !important',
                textDecoration: 'none',
              },
              '& .MuiTabs-indicator': {
                display: 'none',
              },
            }}
          >
            <Tab label=" All Purchase Order" />
            <Tab label=" Sent Purchase Order" />
            <Tab label=" Draft Purchase Order" />
          </Tabs>


          <TextField
            size="small"
            placeholder="Search by item name..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              sx: { bgcolor: 'white', borderRadius: 2 }
            }}
          />
        </Box>

                    <TableContainer component={Paper} sx={{ boxShadow: 'none',mt:2 }}>
                        <Table size="small">
                            <TableHead sx={{ backgroundColor: '#F9FAFB' }}>
                                <TableRow>
                                    <TableCell><Checkbox /></TableCell>
                                    <TableCell>Purchase Order #</TableCell>
                                    <TableCell>Vendor Name</TableCell>
                                    <TableCell>Created Date</TableCell>
                                    <TableCell>Delivery Date</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Bill Amount</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Checkbox /></TableCell>
                                        <TableCell sx={{ color: '#0B5FFF', fontWeight: 500 }}>{row.orderNo}</TableCell>
                                        <TableCell>{row.vendor}</TableCell>
                                        <TableCell>{row.created}</TableCell>
                                        <TableCell>{row.delivery}</TableCell>
                                        <TableCell>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    backgroundColor: row.status === 'Sent' ? '#D1FADF' : '#F2F4F7',
                                                    color: row.status === 'Sent' ? '#067647' : '#344054',
                                                    px: 1.5,
                                                    py: 0.5,
                                                    borderRadius: '12px',
                                                    fontWeight: 600
                                                }}
                                            >
                                                {row.status}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{row.amount}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={(e) => handleMenuOpen(e, i)}>
                                                <MoreVertIcon />
                                            </IconButton>
                                            <Menu
                                                anchorEl={anchorEl}
                                                open={Boolean(anchorEl) && menuIndex === i}
                                                onClose={handleMenuClose}
                                            >
                                                <MenuItem>Edit</MenuItem>
                                                <MenuItem>Download the PDF</MenuItem>
                                                <MenuItem>Print Purchase Order</MenuItem>
                                                <MenuItem>Send Email</MenuItem>
                                                <MenuItem>Share Link</MenuItem>
                                            </Menu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box sx={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2
                    }}>
                        <Typography variant="body2">Showing 1 to 12 of 100 entries</Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button size="small" variant="outlined">1</Button>
                            <Button size="small">2</Button>
                            <Button size="small">3</Button>
                            <Button size="small">4</Button>
                        </Box>
                    </Box></Paper></Box>
                </Box>
            </Box>
        </Box>
    );
};

export default PurchaseOrderActions;
