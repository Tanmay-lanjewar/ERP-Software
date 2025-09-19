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
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

export default function CustomerList() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCustomers, setSelectedCustomers] = useState([]);
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const navigate = useNavigate();


    const [printDialogOpen, setPrintDialogOpen] = useState(false);
    const [printCustomer, setPrintCustomer] = useState(null);


    const handlePrintStatement = (customer) => {
        setPrintCustomer(customer);
        setPrintDialogOpen(true);
        handleMenuClose();
    };


    const fetchCustomers = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/customers');
            const data = await res.json();
            setCustomers(data);
        } catch (err) {
            console.error('Error fetching customers:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleMenuOpen = (event, rowId) => {
        setMenuAnchor(event.currentTarget);
        setSelectedRow(rowId);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
        setSelectedRow(null);
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

    const handleEditClick = (customer) => {
        setEditingCustomer(customer);
        setEditModalOpen(true);
    };

    const handleEditClose = () => {
        setEditModalOpen(false);
        setEditingCustomer(null);
    };

    const toggleCustomerStatus = async (customer) => {
        const newStatus = customer.status === 'Active' ? 'Inactive' : 'Active';
        try {
            const response = await fetch(`http://localhost:5000/api/customers/${customer.id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            await fetchCustomers(); // refresh list
        } catch (err) {
            console.error('Failed to toggle status', err);
            alert('Status update failed.');
        } finally {
            handleMenuClose();
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

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

            {/* Print Statement Dialog */}
            <Dialog open={printDialogOpen} onClose={() => setPrintDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Print Statement</DialogTitle>
                <DialogContent>
                    <Typography variant="h6" mb={2}>{printCustomer?.customer_name} - Statement</Typography>
                    {/* Dummy statement data */}
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Amount</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {[
                                { date: '2025-07-01', desc: 'Invoice #1001', amount: '₹1,000' },
                                { date: '2025-07-05', desc: 'Payment Received', amount: '-₹1,000' },
                                { date: '2025-07-10', desc: 'Invoice #1002', amount: '₹2,000' },
                            ].map((row, idx) => (
                                <TableRow key={idx}>
                                    <TableCell>{row.date}</TableCell>
                                    <TableCell>{row.desc}</TableCell>
                                    <TableCell>{row.amount}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => window.print()} variant="contained" color="primary">Print</Button>
                    <Button onClick={() => setPrintDialogOpen(false)} variant="outlined">Close</Button>
                </DialogActions>
            </Dialog>


            {/* Edit Modal */}
            <Modal open={editModalOpen} onClose={handleEditClose}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'white',
                    boxShadow: 24,
                    borderRadius: 2,
                    p: 4,
                    width: '90%',
                    maxWidth: 800,
                    maxHeight: '90vh',
                    overflowY: 'auto',
                }}>
                    <Typography variant="h6" mb={2}>Edit Customer</Typography>
                    {editingCustomer && (
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            try {
                                await fetch(`http://localhost:5000/api/customers/${editingCustomer.id}`, {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(editingCustomer),
                                });
                                alert('Customer updated!');
                                handleEditClose();
                                fetchCustomers();
                            } catch (error) {
                                console.error('Error updating customer:', error);
                                alert('Update failed.');
                            }
                        }}>
                            {/* Basic Info */}
                            <Typography variant="subtitle1" mt={2}>Basic Info</Typography>
                            <Box display="flex" gap={2} flexWrap="wrap">
                                {[
                                    { field: 'customer_type', label: 'Customer Type', options: ['Domestic', 'International'] },
                                    { field: 'title', label: 'Title', options: ['Mr.', 'Mrs.', 'Ms.', 'Dr.'] },
                                    { field: 'customer_name', label: 'Customer Name' },
                                    { field: 'company_name', label: 'Company Name' },
                                    { field: 'display_name', label: 'Display Name' },
                                    { field: 'email', label: 'Email' },
                                    { field: 'mobile', label: 'Mobile' },
                                    { field: 'office_no', label: 'Office No' },
                                    { field: 'pan', label: 'PAN' },
                                    { field: 'gst', label: 'GST' },
                                    { field: 'currency', label: 'Currency', options: ['INR', 'USD', 'EUR'] },
                                    { field: 'document_path', label: 'Document Path' },
                                    { field: 'status', label: 'Status', options: ['Active', 'Inactive'] }
                                ].map(({ field, label, options }) => (
                                    options ? (
                                        <TextField
                                            key={field}
                                            select
                                            label={label}
                                            value={editingCustomer[field] || ''}
                                            onChange={(e) => setEditingCustomer({ ...editingCustomer, [field]: e.target.value })}
                                            fullWidth
                                            sx={{ flex: '1 1 45%' }}
                                        >
                                            <MenuItem value="">Select {label}</MenuItem>
                                            {options.map(opt => (
                                                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                            ))}
                                        </TextField>
                                    ) : (
                                        <TextField
                                            key={field}
                                            label={label}
                                            value={editingCustomer[field] || ''}
                                            onChange={(e) => setEditingCustomer({ ...editingCustomer, [field]: e.target.value })}
                                            fullWidth
                                            sx={{ flex: '1 1 45%' }}
                                        />
                                    )
                                ))}
                            </Box>

                            {/* Billing Info */}
                            <Typography variant="subtitle1" mt={3}>Billing Info</Typography>
                            <Box display="flex" gap={2} flexWrap="wrap">
                                {[
                                    'billing_recipient_name', 'billing_country', 'billing_address1', 'billing_address2',
                                    'billing_city', 'billing_state', 'billing_pincode', 'billing_fax', 'billing_phone'
                                ].map(field => (
                                    <TextField
                                        key={field}
                                        label={field.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                        value={editingCustomer[field] || ''}
                                        onChange={(e) => setEditingCustomer({ ...editingCustomer, [field]: e.target.value })}
                                        fullWidth
                                        multiline={field.includes('address')}
                                        sx={{ flex: '1 1 45%' }}
                                    />
                                ))}
                            </Box>

                            {/* Shipping Info */}
                            <Typography variant="subtitle1" mt={3}>Shipping Info</Typography>
                            <Box display="flex" gap={2} flexWrap="wrap">
                                {[
                                    'shipping_recipient_name', 'shipping_country', 'shipping_address1', 'shipping_address2',
                                    'shipping_city', 'shipping_state', 'shipping_pincode', 'shipping_fax', 'shipping_phone'
                                ].map(field => (
                                    <TextField
                                        key={field}
                                        label={field.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                        value={editingCustomer[field] || ''}
                                        onChange={(e) => setEditingCustomer({ ...editingCustomer, [field]: e.target.value })}
                                        fullWidth
                                        multiline={field.includes('address')}
                                        sx={{ flex: '1 1 45%' }}
                                    />
                                ))}
                            </Box>

                            {/* Remarks */}
                            <Box mt={3}>
                                <TextField
                                    label="Remark"
                                    fullWidth
                                    multiline
                                    rows={3}
                                    value={editingCustomer.remark || ''}
                                    onChange={(e) => setEditingCustomer({ ...editingCustomer, remark: e.target.value })}
                                    sx={{ mb: 2 }}
                                />
                            </Box>

                            <Box mt={3} display="flex" justifyContent="flex-end" gap={1}>
                                <Button onClick={handleEditClose} variant="outlined">Cancel</Button>
                                <Button type="submit" variant="contained">Save</Button>
                            </Box>
                        </form>
                    )}
                </Box>
            </Modal>

            {/* Main Content */}
            <Box sx={{ flex: 1, minHeight: '100vh', bgcolor: '#f9fafc' }}>
                {/* Top bar */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, mt: 1, px: 3 }}>
                    <Typography color="text.secondary" fontSize="20px">Customer</Typography>
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

                {/* Table */}
                <Box sx={{ px: 2, py: 2 }}>
                    <Paper sx={{ p: 1, borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 4, py: 2, borderBottom: '1px solid #e0e0e0' }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>Customer</Typography>
                            <Button
                                variant="contained"
                                sx={{ textTransform: 'none', borderRadius: 2, bgcolor: '#004085', '&:hover': { bgcolor: '#003366' } }}
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
                                            <TableCell>Status</TableCell>
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
                                            <TableRow key={row.id} hover>
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        checked={selectedCustomers.includes(row.id)}
                                                        onChange={() => handleSelectOne(row.id)}
                                                    />
                                                </TableCell>
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
                                                    <IconButton onClick={(e) => handleMenuOpen(e, row.id)}><MoreVertIcon /></IconButton>
                                                    {selectedRow === row.id && (
                                                        <Menu
                                                            anchorEl={menuAnchor}
                                                            open={Boolean(menuAnchor)}
                                                            onClose={handleMenuClose}
                                                            PaperProps={{ sx: { width: 200 } }}
                                                        >
                                                            <MenuItem onClick={() => { handleEditClick(row); handleMenuClose(); }}>
                                                                <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
                                                            </MenuItem>
                                                            <MenuItem onClick={() => handlePrintStatement(row)}>
                                                                <PrintIcon fontSize="small" sx={{ mr: 1 }} /> Print Statement
                                                            </MenuItem>

                                                            <MenuItem onClick={() => toggleCustomerStatus(row)}>
                                <BlockIcon fontSize="small" sx={{ mr: 1 }} />
                                {row.status === 'Active' ? 'Mark as Inactive' : 'Mark as Active'}
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


