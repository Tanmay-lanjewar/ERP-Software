import React, { useState, useEffect } from 'react';
import {
  Box, Button, Typography, Table, TableHead, TableRow, TableCell,
  TableBody, Checkbox, TextField, Chip, Pagination, Tabs, Tab,
  IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent,
  InputAdornment, Paper, Avatar, DialogActions
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import LinkIcon from '@mui/icons-material/Link';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import { grey } from '@mui/material/colors';

export default function VendorListPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [vendorList, setVendorList] = useState([]);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/vendors'); // your backend URL
      const data = await response.json();
      setVendorList(data);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
  };

  const [searchTerm, setSearchTerm] = useState('');

  const handleMenuClick = (event, vendor) => {
    setAnchorEl(event.currentTarget);
    setSelectedVendor(vendor);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedVendor(null);
  };

  const handleDeleteClick = () => {
    setOpenDialog(true);
    setAnchorEl(null);
  };

  const confirmDelete = () => {
    setVendorList(vendorList.filter(v => v.id !== selectedVendor.id));
    setOpenDialog(false);
    setSelectedVendor(null);
  };

  const handleSendEmail = (vendor) => {
    const subject = encodeURIComponent(`Regarding Vendor: ${vendor.vendor_name}`);
    const body = encodeURIComponent(`Hello,\n\nThis is regarding vendor ${vendor.vendor_name}.\n\nRegards.`);
    window.location.href = `mailto:${vendor.email}?subject=${subject}&body=${body}`;
    handleCloseMenu();
  };

  const handleShareLink = (vendor) => {
    navigator.clipboard.writeText(`https://dummy-vendor-link/${vendor.id}`);
    alert('Vendor link copied to clipboard!');
    handleCloseMenu();
  };

  const filteredVendors = vendorList.filter(v => {
    const matchesTab = tab === 0 || (tab === 1 && v.status === 'Active') || (tab === 2 && v.status === 'Inactive');
    const matchesSearch = v.vendor_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Sidebar />
        <Box px={2} flex={1} display="flex" flexDirection="column" minHeight="100vh">
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: 4, py: 2,
            bgcolor: 'white',
          }}>
            <Typography style={{color:grey}}  fontWeight={600}>Vendors</Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar src="https://i.pravatar.cc/40?img=1" />
              <Typography fontSize={14}>Admin name</Typography>
              <ArrowDropDownIcon />
            </Box>
          </Box>

          <Box sx={{ px: 2, py: 2 }}>
            <Paper sx={{ p: 1, borderRadius: 2 }}>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                px: 4, py: 2,
                borderBottom: '1px solid #e0e0e0'
              }}>
                <Typography variant="h6" fontWeight={600}>Vendors</Typography>
                <Button
                  variant="contained"
                  sx={{
                    textTransform: 'none',
                    borderRadius: 2,
                    bgcolor: '#004085',
                    '&:hover': { bgcolor: '#003366' }
                  }}
                  onClick={() => navigate('/add-vendor')}
                >
                  + New Vendor
                </Button>
              </Box>

              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                px: 4, py: 2
              }}>
                <Tabs
                  value={tab}
                  onChange={(_, val) => setTab(val)}
                  textColor="primary"
                  indicatorColor="primary"
                >
                  <Tab label="All Vendors" />
                  <Tab label="Active Vendors" />
                  <Tab label="Inactive Vendors" />
                </Tabs>
                <TextField
                  size="small"
                  placeholder="Search by vendor name..."
                  onChange={(e) => setSearchTerm(e.target.value)}
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

              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><Checkbox /></TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Company Name</TableCell>
                    <TableCell>Display Name</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Email Address</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredVendors.map(v => (
                    <TableRow key={v.id}>
                      <TableCell><Checkbox /></TableCell>
                      <TableCell>{v.vendor_name}</TableCell>
                      <TableCell>{v.company_name}</TableCell>
                      <TableCell>{v.display_name}</TableCell>
                      <TableCell>
                        <Chip
                          label={v.status}
                          color={v.status === 'Active' ? 'success' : 'error'}
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{v.email}</TableCell>
                      <TableCell>{v.phone}</TableCell>
                      <TableCell>
                        <IconButton onClick={(e) => handleMenuClick(e, v)}>
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Box mt={3} display="flex" justifyContent="space-between">
                <Typography variant="body2">
                  Showing {filteredVendors.length} of {vendorList.length} entries
                </Typography>
                <Pagination count={3} page={1} />
              </Box>
            </Paper>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
          >
           <MenuItem onClick={() => navigate(`/edit-vendor/${selectedVendor.id}`)}>

              <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
            </MenuItem>
            <MenuItem onClick={() => handleSendEmail(selectedVendor)}>
              <EmailIcon fontSize="small" sx={{ mr: 1 }} /> Send Email
            </MenuItem>
            <MenuItem onClick={() => handleShareLink(selectedVendor)}>
              <LinkIcon fontSize="small" sx={{ mr: 1 }} /> Share Link
            </MenuItem>
            {/* <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
              <DeleteOutlineIcon fontSize="small" sx={{ mr: 1 }} /> Delete
            </MenuItem> */}
          </Menu>

          <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            {/* <DialogTitle>Delete Vendor</DialogTitle> */}
           {/* <DialogContent>
              Are you sure you want to delete "{selectedVendor?.display_name}"?
            </DialogContent>
           */}
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button onClick={confirmDelete} color="error" variant="contained">Delete</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </>
  );
}
