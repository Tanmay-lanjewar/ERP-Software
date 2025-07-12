import React from 'react';
import {
  Box, Typography, Button, InputBase, IconButton, Avatar, MenuItem, TextField,
  Chip, Menu, Table, TableHead, TableBody, TableRow, TableCell, TablePagination
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Sidebar from './Sidebar';

const rows = Array.from({ length: 15 }, (_, i) => ({
  taxType: 'GST',
  rate: '9%',
  label: 'Electronics',
  status: i % 3 === 0 ? 'Inactive' : i % 4 === 0 ? 'Inactive' : 'Active',
  date: '01/04/2025',
}));

const Taxlist = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedRow, setSelectedRow] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event, rowIndex) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(rowIndex);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
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
          <Typography fontWeight="bold">Tax</Typography>

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
          <Box sx={{
            backgroundColor: '#fff',
            p: 3,
            borderRadius: 2,
          }}>
            
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography variant="h6" fontWeight="bold">Tax</Typography>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#004085',
                  textTransform: 'none',
                  '&:hover': { backgroundColor: '#003060' },
                }}
              >
                + Add Tax
              </Button>
            </Box>

            <Box display="flex" gap={1} mb={2}>
              {['All', 'Active', 'Inactive'].map((label, i) => (
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
                  <TableCell>Tax Type</TableCell>
                  <TableCell>Rate (%)</TableCell>
                  <TableCell>Label/Category</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Effective Date</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell padding="checkbox">
                      <input type="checkbox" />
                    </TableCell>
                    <TableCell>{row.taxType}</TableCell>
                    <TableCell>{row.rate}</TableCell>
                    <TableCell>{row.label}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.status}
                        size="small"
                        sx={{
                          bgcolor: row.status === 'Active' ? '#E6F4EA' : '#FEEAEA',
                          color: row.status === 'Active' ? '#2E7D32' : '#C62828',
                        }}
                      />
                    </TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>
                      <IconButton onClick={(e) => handleClick(e, i)}>
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
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleClose}>
          <EditIcon sx={{ fontSize: 16, mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleClose}>
          Mark as Inactive
        </MenuItem>
        <MenuItem onClick={handleClose} sx={{ color: 'red' }}>
          <DeleteIcon sx={{ fontSize: 16, mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Taxlist;
