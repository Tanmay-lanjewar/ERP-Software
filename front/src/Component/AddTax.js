import React from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  IconButton,
  InputBase,
  Avatar,Paper
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

const AddTax = () => {
  const [taxType, setTaxType] = React.useState('GST');
  const [status, setStatus] = React.useState('');
  const [date, setDate] = React.useState(new Date());
  const navigate = useNavigate();

  return (
     <Box sx={{ display: 'flex' }}>
            <Sidebar  />
    <Box sx={{ flexGrow: 1, bgcolor: '#F9FAFB', height: '100vh' }}>
      
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
    
        <Typography fontWeight="bold" fontSize={18}>
          Tax &nbsp;/&nbsp; <span style={{ fontWeight: 400 }}>Add Tax</span>
        </Typography>

    
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

      <Box sx={{ px: 4, py: 4 }}>

          <Paper sx={{ p: 1, borderRadius: 2 }}>
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            bgcolor: '#fff',
            borderRadius: 3,
            p: 4,
          }}
        >
          <Typography variant="h6" fontWeight="bold" mb={3}>
            Add Tax
          </Typography>

          <Box display="flex" gap={2} flexWrap="wrap">
            <TextField
              label="Tax Type"
              value={taxType}
              onChange={(e) => setTaxType(e.target.value)}
              select
              fullWidth
              required
              sx={{ flex: 1, minWidth: 220 }}
            >
              <MenuItem value="GST">GST</MenuItem>
              <MenuItem value="VAT">VAT</MenuItem>
              <MenuItem value="Custom">Custom</MenuItem>
            </TextField>

            <TextField
              label="Rate (%)"
              placeholder="Enter rate"
              required
              fullWidth
              sx={{ flex: 1, minWidth: 220 }}
            />

            <TextField
              label="Label/Category"
              placeholder="Enter Label/Category"
              required
              fullWidth
              sx={{ flex: 1, minWidth: 220 }}
            />

            <TextField
              label="Status"
              select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
              fullWidth
              sx={{ flex: 1, minWidth: 220 }}
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </TextField>

            <DatePicker
              label="Effective Date"
              value={date}
              onChange={(newValue) => setDate(newValue)}
              sx={{ flex: 1, minWidth: 220 }}
            />
          </Box>

          <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
            <Button
              variant="outlined"
              onClick={() => navigate('/tax')}
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{
                borderRadius: 2,
                backgroundColor: '#004085',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#003060',
                },
              }}onClick={() => navigate('/Tax-list')}
            >
              Add
            </Button>
          </Box>
        </Box>
      </Box></Paper></Box>
    </Box></Box>
  );
};

export default AddTax;
