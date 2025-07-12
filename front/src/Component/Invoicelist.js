import React from 'react';
import {
    Box, Typography, Button, TextField, InputAdornment, IconButton, Paper,
    Table, TableHead, TableRow, TableCell, TableBody, Menu, MenuItem, Chip, Checkbox,Avatar,InputBase
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PrintIcon from '@mui/icons-material/Print';
import EditIcon from '@mui/icons-material/Edit';
import ShareIcon from '@mui/icons-material/Share';
import EmailIcon from '@mui/icons-material/Email';
import Sidebar from './Sidebar';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
const invoices = Array.from({ length: 13 }).map((_, i) => ({
    id: `INV-000${i + 1}`,
    customer: 'Customer 1',
    createdDate: '30/06/2025',
    dueDate: '30/06/2025',
    status: i % 3 === 0 ? 'Paid' : i % 2 === 0 ? 'Draft' : 'Partial',
    amount: '₹118.00',
}));

const statusColor = {
    Paid: 'success',
    Draft: 'default',
    Partial: 'info',
};

export default function Invoicelist() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [menuIndex, setMenuIndex] = React.useState(null);

    const handleMenuOpen = (event, index) => {
        setAnchorEl(event.currentTarget);
        setMenuIndex(index);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setMenuIndex(null);
    };

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

          <Typography color="text.secondary" fontSize="20px">
           Invoice
          </Typography>


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
            </IconButton>
              <Box display="flex" alignItems="center" gap={1}>
            <Avatar src="https://i.pravatar.cc/150?img=1" />
            <Typography fontSize={14}>Admin name</Typography>
            <ArrowDropDownIcon />
          </Box>
          </Box>
        </Box>
<Box sx={{ px: 2, py: 2 }}>
                            <Paper sx={{ p: 1, borderRadius: 2, }}>
                
                   <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 4, py: 2,
         
          borderBottom: '1px solid #e0e0e0'
        }}>
          <Typography variant="h6" fontWeight={600}>Invoice</Typography>
      
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: '#004085',
                            color: '#fff',
                            fontWeight: 600,
                            textTransform: 'none',
                            borderRadius: '10px',
                            px: 2.5,
                            '&:hover': { backgroundColor: '#003366' },
                        }}
                    >
                        + New Invoice
                    </Button>
        </Box>  
             

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                       
                        px: 3,
                        py: 1.5,
                        borderBottom: '1px solid #e0e0e0',
                        borderRadius: 1,
                        mb: 2,
                    }}
                >
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        {['All Invoices', 'Sent Invoices', 'Draft Invoices', 'Pro Forma Invoices'].map((label, i) => (
                            <Button
                                key={i}
                                variant={i === 0 ? 'contained' : 'outlined'}
                                sx={{
                                    backgroundColor: i === 0 ? '#004085' : 'transparent',
                                    borderColor: '#cfd8dc',
                                    color: i === 0 ? '#fff' : '#333',
                                    fontWeight: 500,
                                    textTransform: 'none',
                                    borderRadius: '20px',
                                    px: 2,
                                    height: 36,
                                    '&:hover': {
                                        backgroundColor: i === 0 ? '#003366' : '#f5f5f5',
                                    },
                                }}
                            >
                                {label}
                            </Button>
                        ))}
                    </Box>

                    <TextField
                        size="small"
                        placeholder="Search by invoice no, customer name..."
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                            sx: {
                                bgcolor: '#f9f9f9',
                                borderRadius: '20px',
                                px: 1,
                            },
                        }}
                        sx={{ width: 300 }}
                    />
                </Box>

                <Paper sx={{ overflow: 'auto' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox />
                                </TableCell>
                                <TableCell>Invoice#</TableCell>
                                <TableCell>Customer Name</TableCell>
                                <TableCell>Created Date</TableCell>
                                <TableCell>Due Date</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Bill Amount</TableCell>
                                <TableCell align="center">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {invoices.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell padding="checkbox">
                                        <Checkbox />
                                    </TableCell>
                                    <TableCell sx={{ color: '#0061F2', fontWeight: 500 }}>{row.id}</TableCell>
                                    <TableCell>{row.customer}</TableCell>
                                    <TableCell>{row.createdDate}</TableCell>
                                    <TableCell>{row.dueDate}</TableCell>
                                    <TableCell>
                                        <Chip label={row.status} color={statusColor[row.status]} size="small" />
                                    </TableCell>
                                    <TableCell>{row.amount}</TableCell>
                                    <TableCell align="center">
                                        <IconButton onClick={(e) => handleMenuOpen(e, index)}>
                                            <MoreVertIcon />
                                        </IconButton>
                                        {menuIndex === index && (
                                            <Menu
                                                anchorEl={anchorEl}
                                                open={Boolean(anchorEl)}
                                                onClose={handleMenuClose}
                                                PaperProps={{ sx: { width: 200 } }}
                                            >
                                                <MenuItem><EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit</MenuItem>
                                                <MenuItem><PictureAsPdfIcon fontSize="small" sx={{ mr: 1 }} /> Download the PDF</MenuItem>
                                                <MenuItem><PrintIcon fontSize="small" sx={{ mr: 1 }} /> Print Invoice</MenuItem>
                                                <MenuItem><EmailIcon fontSize="small" sx={{ mr: 1 }} /> Send Email</MenuItem>
                                                <MenuItem><ShareIcon fontSize="small" sx={{ mr: 1 }} /> Share Link</MenuItem>
                                            </Menu>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Typography variant="body2">Showing 1 to 15 of 100 entries</Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        {[1, 2, 3, 4].map((page) => (
                            <Button key={page} size="small" variant={page === 1 ? 'outlined' : 'text'}>
                                {page}
                            </Button>
                        ))}
                    </Box>
                </Box></Paper></Box>
            </Box>
        </Box>
    );
}
