import React, { useState } from 'react';
import {
    Box, Typography, Button, Grid, TextField, InputAdornment, IconButton,
    Paper, Table, TableBody, TableCell, TableHead, TableRow, Menu, MenuItem,
    Tabs, Tab, Checkbox, Modal, InputBase, Pagination, Dialog, DialogTitle, DialogContent, DialogActions,Avatar
} from '@mui/material';
import {
    MoreVert as MoreVertIcon,
    Search as SearchIcon,
    Edit as EditIcon,
    Print as PrintIcon,
    Delete as DeleteIcon,
    Block as BlockIcon,
    NotificationsNone as NotificationsNoneIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const customers = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    company: 'Diva Enterprises',
    name: 'Ramesh Kumar',
    type: 'Business',
    email: 'rameshkumar@gmail.com',
    phone: '+91 8485912667',
}));

export default function CustomerList() {
    const [selectedCustomers, setSelectedCustomers] = useState([]);

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [tab, setTab] = useState(0);
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [openPrintDialog, setOpenPrintDialog] = useState(false);
    const navigate = useNavigate();
    const handleMenuOpen = (event, rowId) => {
        setMenuAnchor(event.currentTarget);
        setSelectedRow(rowId);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
    };

    const handlePrintOpen = () => {
        setOpenPrintDialog(true);
        handleMenuClose();
    };

    const handlePrintClose = () => {
        setOpenPrintDialog(false);
    };
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedCustomers(customers.map((c) => c.id));
        } else {
            setSelectedCustomers([]);
        }
    };

    const handleSelectOne = (id) => {
        setSelectedCustomers((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <Box sx={{ flex: 1, minHeight: '100vh', bgcolor: '#f9fafc', }}>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, mt: 1, px: 3 }}>
                    <Typography color="text.secondary" fontSize="14px">Customer</Typography>
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

                                width: 240,
                            }}
                        >
                            <SearchIcon sx={{ fontSize: 20, color: '#999' }} />
                            <InputBase placeholder="Search anything here..." sx={{ ml: 1, fontSize: 14, flex: 1 }} />
                        </Paper>
                        <IconButton sx={{ borderRadius: '12px', border: '1px solid #e0e0e0', bgcolor: '#f9fafb', p: 1 }}>
                            <NotificationsNoneIcon sx={{ fontSize: 20, color: '#666' }} />
                        </IconButton> <Box display="flex" alignItems="center" gap={1}>
              <Avatar src="https://i.pravatar.cc/40?img=1" />
              <Typography fontSize={14}>Admin name</Typography>
              <ArrowDropDownIcon />
            </Box>
                    </Box>
                </Box>
                <Box sx={{ px: 2, py: 2 }}>
                    <Paper sx={{ p: 1, borderRadius: 2, }}>
                        {selectedCustomers.length > 0 ? (
                            <Box sx={{
                                px: 4, py: 2, borderBottom: '1px solid #e0e0e0',
                                background: '#f1f5ff', display: 'flex',
                                justifyContent: 'space-between', alignItems: 'center',
                                borderTopLeftRadius: '8px', borderTopRightRadius: '8px'
                            }}>
                                <Typography fontWeight={600} fontSize={14}>
                                    {selectedCustomers.length} Selected
                                </Typography>
                                <Box display="flex" gap={2}>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        sx={{
                                            textTransform: 'none',
                                            borderRadius: 2,
                                            borderColor: '#ccc'
                                        }}
                                    >
                                        Mark as Inactive
                                    </Button>
                                    <Button
                                        variant="text"
                                        color="error"
                                        size="small"
                                        onClick={() => setOpenDelete(true)}
                                        sx={{
                                            textTransform: 'none',
                                            fontWeight: 600
                                        }}
                                    >
                                        <DeleteIcon sx={{ mr: 0.5 }} fontSize="small" /> Delete All
                                    </Button>
                                </Box>
                            </Box>
                        ) : (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 4, py: 2, borderBottom: '1px solid #e0e0e0' }}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>Customer</Typography>
                                <Button variant="contained" sx={{ textTransform: 'none', borderRadius: 2, bgcolor: '#004085', '&:hover': { bgcolor: '#003366' } }}>
                                    + New Customer
                                </Button>
                            </Box>
                        )}


                        <Box sx={{ px: 4, pt: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Tabs value={tab} onChange={(e, val) => setTab(val)} sx={{
                                    '& .MuiTab-root': { textTransform: 'none', bgcolor: '#f1f1f1', borderRadius: 2, mr: 1 },
                                    '& .Mui-selected': { bgcolor: '#004085', color: 'white !important' },
                                    '& .MuiTabs-indicator': { display: 'none' }
                                }}>
                                    <Tab label="Active Customers" />
                                    <Tab label="Inactive Customers" />
                                </Tabs>
                                <TextField
                                    size="small"
                                    placeholder="Search Customers"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
                                        sx: { bgcolor: 'white', borderRadius: 2 },
                                    }}
                                />
                            </Box>

                            <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden', backgroundColor: '#fff' }}>


                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: '#f5f6fa' }}>
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    checked={selectedCustomers.length === customers.length}
                                                    indeterminate={
                                                        selectedCustomers.length > 0 &&
                                                        selectedCustomers.length < customers.length
                                                    }
                                                    onChange={handleSelectAll}
                                                />
                                            </TableCell>
                                            <TableCell>Company Name</TableCell>
                                            <TableCell>Customer Name</TableCell>
                                            <TableCell>Customer Type</TableCell>
                                            <TableCell>Email Address</TableCell>
                                            <TableCell>Phone Number</TableCell>
                                            <TableCell align="center">Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {customers.map((row) => (
                                            <TableRow
                                                key={row.id}
                                                hover
                                                sx={{
                                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s',
                                                    borderRadius: '8px',
                                                    backgroundColor: '#fff',
                                                    '&:hover': {
                                                        backgroundColor: 'whitesmoke',
                                                        transform: 'translateY(-4px) scale(1.01)',
                                                        boxShadow: '0 8px 20px rgba(187, 187, 187, 0.91)',
                                                        zIndex: 10,
                                                        position: 'relative',
                                                    },
                                                }}
                                            >

                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        checked={selectedCustomers.includes(row.id)}
                                                        onChange={() => handleSelectOne(row.id)}
                                                    />
                                                </TableCell>



                                                <TableCell sx={{
                                                    py: 1.5,
                                                    px: 2.5,

                                                    fontSize: '14px',
                                                    color: '#333',
                                                }}>{row.company}</TableCell>

                                                <TableCell sx={{
                                                    py: 1.5,
                                                    px: 2.5,

                                                    fontSize: '14px',
                                                    color: '#333',
                                                }}>{row.name}</TableCell>
                                                <TableCell sx={{
                                                    py: 1.5,
                                                    px: 2.5,

                                                    fontSize: '14px',
                                                    color: '#333',
                                                }}>{row.type}</TableCell>
                                                <TableCell sx={{
                                                    py: 1.5,
                                                    px: 2.5,

                                                    fontSize: '14px',
                                                    color: '#333',
                                                }}>{row.email}</TableCell>
                                                <TableCell sx={{
                                                    py: 1.5,
                                                    px: 2.5,

                                                    fontSize: '14px',
                                                    color: '#333',
                                                }}>{row.phone}</TableCell>
                                                <TableCell align="center">
                                                    <IconButton onClick={(e) => handleMenuOpen(e, row.id)}><MoreVertIcon /></IconButton>
                                                    {selectedRow === row.id && (
                                                        <Menu
                                                            anchorEl={menuAnchor}
                                                            open={Boolean(menuAnchor)}
                                                            onClose={handleMenuClose}
                                                            PaperProps={{ sx: { width: 200 } }}
                                                        >
                                                            <MenuItem
                                                                onClick={() => {
                                                                    navigate('/add-customer', { state: { customer: row } });
                                                                    handleMenuClose();
                                                                }}
                                                            >
                                                                <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
                                                            </MenuItem>

                                                            <MenuItem onClick={handlePrintOpen}><PrintIcon fontSize="small" sx={{ mr: 1 }} /> Print Statement</MenuItem>
                                                            <MenuItem><BlockIcon fontSize="small" sx={{ mr: 1 }} /> Mark as Inactive</MenuItem>
                                                            <MenuItem
                                                                sx={{ color: 'error.main' }}
                                                                onClick={() => {
                                                                    setOpenDelete(true);
                                                                    setSelectedRow(row.id);
                                                                    handleMenuClose();
                                                                }}
                                                            >
                                                                <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
                                                            </MenuItem>
                                                        </Menu>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Paper>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                                <Typography variant="body2" sx={{ color: '#666' }}>Showing 1 to 12 of 100 entries</Typography>
                                <Box display="flex" justifyContent="space-between">
                                    <Pagination
                                        count={5}
                                        page={1}
                                        sx={{
                                            '& .MuiPaginationItem-root': {
                                                color: 'grey',
                                                borderColor: '#004085',
                                            },
                                            '& .Mui-selected': {
                                                backgroundColor: '#004085',
                                                color: '#fff',
                                                '&:hover': {
                                                    backgroundColor: '#003366',
                                                },
                                            },
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Box></Paper></Box>
            </Box>

            <Modal open={openDelete} onClose={() => setOpenDelete(false)}>
                <Box sx={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400, bgcolor: 'white', p: 3, borderRadius: 2, boxShadow: 24
                }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} borderBottom="1px solid #ccc">
                        <Typography variant="h6" fontWeight={600}>Delete Customer</Typography>
                        <IconButton onClick={() => setOpenDelete(false)}><CloseIcon /></IconButton>
                    </Box>
                    <Typography color="text.secondary">
                        Are you sure you want to delete {customers.find(c => c.id === selectedRow)?.name}? This action cannot be undone.
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                        <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
                        <Button variant="contained" color="error" onClick={() => setOpenDelete(false)}>Yes</Button>
                    </Box>
                </Box>
            </Modal>

            <Dialog open={openPrintDialog} onClose={handlePrintClose} maxWidth={false}
                PaperProps={{ sx: { width: 460, borderRadius: '24px', p: 0, overflow: 'hidden' } }}

            >
                <DialogTitle sx={{
                    fontWeight: 'bold', fontSize: '16px',
                    borderBottom: '1px solid #e0e0e0',
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', px: 2, py: 1.5
                }}>
                    Print Statement
                    <IconButton onClick={handlePrintClose}><CloseIcon /></IconButton>
                </DialogTitle>

                <DialogContent sx={{ px: 3, pt: 2, pb: 1 }}>
                    <Typography fontSize={14} color="text.secondary" mb={2}>
                        You can print your customer’s statements for the selected date range.
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={2}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            {[{ label: "Start Date", value: startDate, onChange: setStartDate },
                            { label: "End Date", value: endDate, onChange: setEndDate }].map(({ label, value, onChange }) => (
                                <DatePicker
                                    key={label}
                                    label={label}
                                    value={value}
                                    onChange={onChange}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            fullWidth
                                            variant="outlined"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    backgroundColor: '#f9fafb',
                                                    borderRadius: '20px',
                                                    height: '40px',
                                                    minHeight: '40px',
                                                    paddingRight: '10px',
                                                },
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderRadius: '20px',
                                                },
                                                '& .MuiInputBase-input': {
                                                    fontSize: '13px',
                                                    padding: '10px 14px',
                                                },
                                                '& .MuiInputLabel-root': {
                                                    fontSize: '13px',
                                                },
                                                '& .MuiSvgIcon-root': {
                                                    fontSize: '20px',
                                                },
                                            }}


                                        />
                                    )}
                                />
                            ))}
                        </LocalizationProvider>
                    </Box>
                </DialogContent>

                <DialogActions sx={{ justifyContent: 'flex-end', px: 3, pb: 2, pt: 1 }}>
                    <Button onClick={handlePrintClose} variant="outlined" sx={{
                        borderRadius: '8px', px: 3, textTransform: 'none',
                        borderColor: '#cfd8dc', fontSize: '14px',
                    }}>Cancel</Button>
                    <Button onClick={() => {
                        console.log(startDate, endDate);
                        handlePrintClose();
                    }} variant="contained" sx={{
                        borderRadius: '8px', px: 3, textTransform: 'none',
                        bgcolor: '#004085', fontSize: '14px',
                        '&:hover': { bgcolor: '#003366' },
                    }}>Print Statement</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
