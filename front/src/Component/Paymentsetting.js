import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Avatar,
  InputBase,
  Paper,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import Sidebar from './Sidebar';

const PaymentsSettings = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  // Static data for testing
  const payments = [
    {
      payment_id: 1,
      customer_name: "Rahul Kumar",
      invoice_number: "INV-0001",
      amount: 25000,
      pending_amount: 5000,
      payment_mode: "Online",
      payment_date: "2024-03-20",
      status: "Completed"
    },
    {
      payment_id: 2,
      customer_name: "Priya Sharma",
      invoice_number: "INV-0002",
      amount: 15000,
      pending_amount: 15000,
      payment_mode: "Cash",
      payment_date: "2024-03-19",
      status: "Pending"
    },
    {
      payment_id: 3,
      customer_name: "Amit Patel",
      invoice_number: "INV-0003",
      amount: 50000,
      pending_amount: 0,
      payment_mode: "Cheque",
      payment_date: "2024-03-18",
      status: "Completed"
    }
  ];

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customer_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    return matchesSearch && payment.status === filter;
  });

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f4f5fa', minHeight: '100vh' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        {/* Header */}
        <Box sx={{ 
          backgroundColor: '#fff', 
          p: 2, 
          borderRadius: '12px',
          mb: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="h5" fontWeight="600">
            Payments Settings
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton>
              <NotificationsNoneIcon />
            </IconButton>
            <Avatar sx={{ width: 35, height: 35 }} />
          </Box>
        </Box>

        {/* Main Content */}
        <Paper sx={{ p: 3, borderRadius: '12px' }}>
          {/* Top Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6" fontWeight="600">
              Payments List
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/add-payment')}
              sx={{
                bgcolor: '#003865',
                '&:hover': { bgcolor: '#002548' },
                borderRadius: '8px',
                textTransform: 'none',
              }}
            >
              Add New Payment
            </Button>
          </Box>

          {/* Filters */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button
              onClick={() => setFilter('all')}
              variant={filter === 'all' ? 'contained' : 'outlined'}
              sx={{
                bgcolor: filter === 'all' ? '#003865' : 'transparent',
                color: filter === 'all' ? '#fff' : '#003865',
                '&:hover': { bgcolor: filter === 'all' ? '#002548' : '#f0f0f0' },
                borderRadius: '8px',
                textTransform: 'none',
              }}
            >
              All
            </Button>
            <Button
              onClick={() => setFilter('Completed')}
              variant={filter === 'Completed' ? 'contained' : 'outlined'}
              sx={{
                bgcolor: filter === 'Completed' ? '#003865' : 'transparent',
                color: filter === 'Completed' ? '#fff' : '#003865',
                '&:hover': { bgcolor: filter === 'Completed' ? '#002548' : '#f0f0f0' },
                borderRadius: '8px',
                textTransform: 'none',
              }}
            >
              Completed
            </Button>
            <Button
              onClick={() => setFilter('Pending')}
              variant={filter === 'Pending' ? 'contained' : 'outlined'}
              sx={{
                bgcolor: filter === 'Pending' ? '#003865' : 'transparent',
                color: filter === 'Pending' ? '#fff' : '#003865',
                '&:hover': { bgcolor: filter === 'Pending' ? '#002548' : '#f0f0f0' },
                borderRadius: '8px',
                textTransform: 'none',
              }}
            >
              Pending
            </Button>
          </Box>

          {/* Search */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: '#f5f5f5',
                px: 2,
                py: 1,
                borderRadius: '8px',
                width: '300px'
              }}
            >
              <SearchIcon sx={{ color: '#666', mr: 1 }} />
              <InputBase
                placeholder="Search payments..."
                value={searchTerm}
                onChange={handleSearch}
                fullWidth
              />
            </Box>
          </Box>

          {/* Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f9fafb' }}>Customer Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f9fafb' }}>Invoice Number</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f9fafb' }}>Payment Number</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f9fafb' }}>Amount Received</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f9fafb' }}>Pending Amount</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f9fafb' }}>Payment Mode</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f9fafb' }}>Payment Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f9fafb' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f9fafb' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.payment_id} hover>
                    <TableCell>{payment.customer_name}</TableCell>
                    <TableCell>{payment.invoice_number}</TableCell>
                    <TableCell>{`PAY-${payment.payment_id.toString().padStart(4, '0')}`}</TableCell>
                    <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                    <TableCell>₹{payment.pending_amount.toLocaleString()}</TableCell>
                    <TableCell>{payment.payment_mode}</TableCell>
                    <TableCell>{new Date(payment.payment_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip
                        label={payment.status}
                        size="small"
                        sx={{
                          bgcolor: payment.status === 'Completed' ? '#e6f4ea' : '#feeaea',
                          color: payment.status === 'Completed' ? '#0b8f3c' : '#d32f2f',
                          fontWeight: 500,
                          borderRadius: '6px',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small">
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Pagination
              count={Math.ceil(filteredPayments.length / 10)}
              color="primary"
              sx={{
                '& .MuiPaginationItem-root': {
                  color: '#003865',
                },
                '& .Mui-selected': {
                  bgcolor: '#003865 !important',
                  color: '#fff !important',
                },
              }}
            />
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default PaymentsSettings;
