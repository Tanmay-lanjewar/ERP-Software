import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Button, TextField, InputAdornment, IconButton,
    Paper, Table, TableBody, TableCell, TableHead, TableRow, Menu, MenuItem,
    Checkbox, Modal, InputBase, Avatar
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
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export default function CustomerList() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCustomers, setSelectedCustomers] = useState([]);
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:5000/api/customers')
            .then((res) => res.json())
            .then((data) => {
                setCustomers(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error fetching customers:', err);
                setLoading(false);
            });
    }, []);

    const handleMenuOpen = (event, rowId) => {
        setMenuAnchor(event.currentTarget);
        setSelectedRow(rowId);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedCustomers(customers.map((c) => c._id));
        } else {
            setSelectedCustomers([]);
        }
    };

    const handleSelectOne = (id) => {
        setSelectedCustomers((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    if (loading) {
        return (
            <Box sx={{ p: 4 }}>
                <Typography>Loading customers...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <Box sx={{ flex: 1, minHeight: '100vh', bgcolor: '#f9fafc' }}>
                {/* Top bar */}
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
                        </IconButton>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Avatar src="https://i.pravatar.cc/40?img=1" />
                            <Typography fontSize={14}>Admin name</Typography>
                            <ArrowDropDownIcon />
                        </Box>
                    </Box>
                </Box>

                {/* Customer Table */}
                <Box sx={{ px: 2, py: 2 }}>
                    <Paper sx={{ p: 1, borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 4, py: 2, borderBottom: '1px solid #e0e0e0' }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>Customer</Typography>
                            <Button
                                variant="contained"
                                sx={{
                                    textTransform: 'none', borderRadius: 2, bgcolor: '#004085',
                                    '&:hover': { bgcolor: '#003366' }
                                }}
                                onClick={() => navigate('/add-customer')}
                            >
                                + New Customer
                            </Button>
                        </Box>

                        <Box sx={{ px: 4, pt: 2 }}>
                            <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden', backgroundColor: '#fff' }}>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: '#f5f6fa' }}>
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    checked={selectedCustomers.length === customers.length}
                                                    indeterminate={selectedCustomers.length > 0 && selectedCustomers.length < customers.length}
                                                    onChange={handleSelectAll}
                                                />
                                            </TableCell>
                                            <TableCell>Status</TableCell> {/* ✅ New status column */}
                                            <TableCell>Company Name</TableCell>
                                            <TableCell>Customer Name</TableCell>
                                            <TableCell>Customer Type</TableCell>
                                            <TableCell>Email</TableCell>
                                            <TableCell>Mobile</TableCell>
                                            <TableCell align="center">Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {customers.map((row) => (
                                            <TableRow key={row._id} hover>
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        checked={selectedCustomers.includes(row._id)}
                                                        onChange={() => handleSelectOne(row._id)}
                                                    />
                                                </TableCell>

                                                {/* ✅ Status badge */}
                                                <TableCell>
                                                    <Box
                                                        sx={{
                                                            display: 'inline-block',
                                                            px: 1.5,
                                                            py: 0.5,
                                                            borderRadius: '999px',
                                                            fontSize: '12px',
                                                            fontWeight: 500,
                                                            bgcolor: row.status === 'Active' ? '#d1fae5' : '#fee2e2',
                                                            color: row.status === 'Active' ? '#065f46' : '#991b1b',
                                                            textAlign: 'center',
                                                        }}
                                                    >
                                                        {row.status || 'Inactive'}
                                                    </Box>
                                                </TableCell>

                                                <TableCell>{row.company_name}</TableCell>
                                                <TableCell>{row.customer_name}</TableCell>
                                                <TableCell>{row.customer_type}</TableCell>
                                                <TableCell>{row.email}</TableCell>
                                                <TableCell>{row.mobile}</TableCell>
                                                <TableCell align="center">
                                                    <IconButton onClick={(e) => handleMenuOpen(e, row._id)}><MoreVertIcon /></IconButton>
                                                    {selectedRow === row._id && (
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
                                                            <MenuItem>
                                                                <PrintIcon fontSize="small" sx={{ mr: 1 }} /> Print Statement
                                                            </MenuItem>
                                                            <MenuItem>
                                                                <BlockIcon fontSize="small" sx={{ mr: 1 }} /> Mark as Inactive
                                                            </MenuItem>
                                                            
                                                        </Menu>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Paper>
                        </Box>
                    </Paper>
                </Box>
            </Box>

        </Box>
    );
}
