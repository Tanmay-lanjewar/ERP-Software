import React, { useState } from 'react';
import {
  Box, Typography, Button, InputBase, IconButton, Avatar, Chip,
  Table, TableHead, TableRow, TableCell, TableBody, Menu, MenuItem,
  Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const workOrders = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  orderNo: `WO-000${i + 1}`,
  customer: `Customer ${i + 1}`,
  date: '30/06/2025',
  status: ['Draft', 'In Progress', 'Completed', 'Cancelled'][i % 4],
  amount: '₹118.00'
}));

const statusColorMap = {
  Draft: { bg: '#E6F4EA', color: '#333' },
  'In Progress': { bg: '#E5F0FB', color: '#1565C0' },
  Completed: { bg: '#E6F4EA', color: '#2E7D32' },
  Cancelled: { bg: '#FEEAEA', color: '#C62828' },
};

const WorkOrderlist = () => {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [tab, setTab] = useState('All');
  const navigate = useNavigate();

  const handleMenuClick = (event, order) => {
    setMenuAnchor(event.currentTarget);
    setSelectedOrder(order);
  };

  const handleClose = () => {
    setMenuAnchor(null);
    setSelectedOrder(null);
  };

  const handleShareLink = (order) => {
    navigator.clipboard.writeText(`https://dummy-workorder-link/${order.orderNo}`);
    alert('Work order link copied to clipboard!');
    handleClose();
  };

  const handleDownloadPDF = (order) => {
    const doc = new jsPDF();
    doc.text(`Work Order: ${order.orderNo}`, 20, 20);
    doc.text(`Customer: ${order.customer}`, 20, 30);
    doc.text(`Date: ${order.date}`, 20, 40);
    doc.text(`Status: ${order.status}`, 20, 50);
    doc.text(`Amount: ${order.amount}`, 20, 60);
    doc.save(`${order.orderNo}.pdf`);
    handleClose();
  };

  const getFilteredOrders = () => {
    if (tab === 'All') return workOrders;
    return workOrders.filter(order => order.status === tab);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#F9FAFB' }}>
      <Sidebar />

      <Box sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            height: 60,
            borderBottom: '1px solid #eee',
            display: 'flex',
            alignItems: 'center',
            px: 3,
            justifyContent: 'space-between',
            bgcolor: '#fff'
          }}
        >
          <Typography fontWeight="bold">Work Order</Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: '#F0F0F0',
                px: 2,
                py: 0.5,
                borderRadius: 5,
                minWidth: 250
              }}
            >
              <SearchIcon fontSize="small" sx={{ color: '#555' }} />
              <InputBase placeholder="Search anything here..." sx={{ ml: 1, flex: 1, fontSize: 14 }} />
            </Box>
            <IconButton><NotificationsNoneIcon /></IconButton>
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar src="https://i.pravatar.cc/40?img=1" />
              <Typography fontSize={14}>Admin name</Typography>
              <ArrowDropDownIcon />
            </Box>
          </Box>
        </Box>

        <Box sx={{ p: 3 }}>
          <Paper sx={{ backgroundColor: '#fff', p: 3, borderRadius: 2 }}>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography variant="h6" fontWeight="bold">Work Order</Typography>
              <Button
                variant="contained"
                sx={{ backgroundColor: '#004085', textTransform: 'none', '&:hover': { backgroundColor: '#003060' } }}
                onClick={() => navigate('/add-Work-Order')}
              >
                + Add New Work Order
              </Button>
            </Box>

            <Box display="flex" gap={1} mb={2}>
              {['All', 'Draft', 'In Progress', 'Completed', 'Cancelled'].map(label => (
                <Button
                  key={label}
                  variant={tab === label ? 'contained' : 'outlined'}
                  sx={{ textTransform: 'none' }}
                  onClick={() => setTab(label)}
                >
                  {label}
                </Button>
              ))}
            </Box>

            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Work Order #</TableCell>
                  <TableCell>Customer Name</TableCell>
                  <TableCell>Created Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Bill Amount</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getFilteredOrders().map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.orderNo}</TableCell>
                    <TableCell>{row.customer}</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.status}
                        size="small"
                        sx={{
                          bgcolor: statusColorMap[row.status].bg,
                          color: statusColorMap[row.status].color
                        }}
                      />
                    </TableCell>
                    <TableCell>{row.amount}</TableCell>
                    <TableCell>
                      <IconButton onClick={(e) => handleMenuClick(e, row)}>
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Box>
      </Box>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleClose}>Edit</MenuItem>
        <MenuItem onClick={() => handleDownloadPDF(selectedOrder)}>Download PDF</MenuItem>
        <MenuItem onClick={() => handleShareLink(selectedOrder)}>Share Link</MenuItem>
      </Menu>
    </Box>
  );
};

export default WorkOrderlist;
