import React from 'react';
import {
  Box, Typography, Button, InputBase, IconButton, Avatar, Chip,
  Table, TableHead, TableRow, TableCell, TableBody, TablePagination, Menu, MenuItem
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Sidebar from './Sidebar';

const rows = Array.from({ length: 15 }, (_, i) => ({
  orderNo: 'WO-00001',
  customer: 'Customer 1',
  date: '30/06/2025',
  status: ['Draft', 'Completed', 'In Progress', 'Cancelled'][i % 4],
  amount: '₹118.00',
}));

const statusColorMap = {
  Draft: { bg: '#E6F4EA', color: '#333' },
  'In Progress': { bg: '#E5F0FB', color: '#1565C0' },
  Completed: { bg: '#E6F4EA', color: '#2E7D32' },
  Cancelled: { bg: '#FEEAEA', color: '#C62828' },
};

const WorkOrderlist = () => {
  const [menuAnchor, setMenuAnchor] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(null);

  const handleMenuClick = (event, index) => {
    setMenuAnchor(event.currentTarget);
    setSelectedIndex(index);
  };

  const handleClose = () => {
    setMenuAnchor(null);
    setSelectedIndex(null);
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
            bgcolor: '#fff',
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
                minWidth: 250,
              }}
            >
              <SearchIcon fontSize="small" sx={{ color: '#555' }} />
              <InputBase
                placeholder="Search anything here..."
                sx={{ ml: 1, flex: 1, fontSize: 14 }}
              />
            </Box>

            <IconButton>
              <NotificationsNoneIcon />
            </IconButton>

            <Box display="flex" alignItems="center" gap={1}>
              <Avatar src="https://i.pravatar.cc/40?img=1" />
              <Typography fontSize={14}>Admin name</Typography>
              <ArrowDropDownIcon />
            </Box>
          </Box>
        </Box>

     
        <Box sx={{ p: 3 }}>
          <Box sx={{ backgroundColor: '#fff', p: 3, borderRadius: 2 }}>
          
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography variant="h6" fontWeight="bold">Work Order</Typography>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#004085',
                  textTransform: 'none',
                  '&:hover': { backgroundColor: '#003060' },
                }}
              >
                + Add New Work Order
              </Button>
            </Box>

            <Box display="flex" gap={1} mb={2}>
              {['All', 'Draft', 'In Progress', 'Completed', 'Cancelled'].map((label, i) => (
                <Button key={i} variant="outlined" sx={{ textTransform: 'none' }}>
                  {label}
                </Button>
              ))}
            </Box>

            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <input type="checkbox" />
                  </TableCell>
                  <TableCell>Work Order #</TableCell>
                  <TableCell>Customer Name</TableCell>
                  <TableCell>Created Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Bill Amount</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell padding="checkbox">
                      <input type="checkbox" />
                    </TableCell>
                    <TableCell>{row.orderNo}</TableCell>
                    <TableCell>{row.customer}</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.status}
                        size="small"
                        sx={{
                          bgcolor: statusColorMap[row.status].bg,
                          color: statusColorMap[row.status].color,
                        }}
                      />
                    </TableCell>
                    <TableCell>{row.amount}</TableCell>
                    <TableCell>
                      <IconButton onClick={(e) => handleMenuClick(e, i)}>
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Box display="flex" justifyContent="flex-end" mt={2}>
              <TablePagination
                component="div"
                count={100}
                page={0}
                rowsPerPage={15}
                rowsPerPageOptions={[]}
                onPageChange={() => {}}
              />
            </Box>
          </Box>
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
        <MenuItem onClick={handleClose}>Cancel</MenuItem>
        <MenuItem onClick={handleClose} sx={{ color: 'red' }}>Delete</MenuItem>
      </Menu>
    </Box>
  );
};

export default WorkOrderlist;
