import React from 'react';
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
  Checkbox,
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

const dummyData = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  customerName: 'Customer 1',
  paymentMode: 'Online',
  paymentDate: '30/06/2025',
  status: 'Sent',
  billAmount: '₹118.00',
}));

const PaymentsSettings = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f4f5fa', minHeight: '100vh' }}>
         <Sidebar />

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
    
        <Box
          sx={{
            backgroundColor: '#fff',
            p: 2,
            px: 3,
            borderBottom: '1px solid #e0e0e0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Payments Settings
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: '#f0f0f0',
                px: 2,
                py: 0.5,
                borderRadius: '8px',
              }}
            >
              <SearchIcon fontSize="small" sx={{ mr: 1 }} />
              <InputBase placeholder="Search anything here..." />
            </Box>
            <IconButton>
              <NotificationsNoneIcon />
            </IconButton>
            <Avatar src="/avatar.png" sx={{ width: 32, height: 32 }} />
            <Typography fontSize={14}>Admin name</Typography>
          </Box>
        </Box>

        <Box sx={{ p: 3 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: '12px' }}>
            <Grid container justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" fontWeight="bold">
                Payments Settings
              </Typography>
              <Button variant="contained" sx={{ bgcolor: '#003865', textTransform: 'none' }}onClick={() => navigate('/add-Payment-settings')}>
                + Add Payments Entry
              </Button>
            </Grid>

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Button variant="outlined" size="small">All</Button>
              <Button variant="outlined" size="small">Draft</Button>
              <Button variant="outlined" size="small">Sent</Button>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  bgcolor: '#f0f0f0',
                  px: 2,
                  py: 0.5,
                  borderRadius: '8px',
                }}
              >
                <SearchIcon fontSize="small" sx={{ mr: 1 }} />
                <InputBase placeholder="Search by customer name,..." />
              </Box>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox"><Checkbox /></TableCell>
                    <TableCell>Customer Name</TableCell>
                    <TableCell>Payment Mode</TableCell>
                    <TableCell>Payment Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Bill Amount</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dummyData.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell padding="checkbox"><Checkbox /></TableCell>
                      <TableCell>{row.customerName}</TableCell>
                      <TableCell>{row.paymentMode}</TableCell>
                      <TableCell>{row.paymentDate}</TableCell>
                      <TableCell>
                        <Chip
                          label={row.status}
                          size="small"
                          sx={{
                            bgcolor: '#e6f4ea',
                            color: '#0b8f3c',
                            fontWeight: 500,
                          }}
                        />
                      </TableCell>
                      <TableCell>{row.billAmount}</TableCell>
                      <TableCell>
                        <IconButton><MoreVertIcon /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Pagination count={4} shape="rounded" />
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default PaymentsSettings;
