import React from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  IconButton,
  Avatar,
  InputBase,
  Grid,
  Paper,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Sidebar from './Sidebar';
import UserMenu from './UserMenu';

const customers = ['Customer 1', 'Customer 2'];
const currencies = ['INR', 'USD', 'EUR'];
const paymentModes = ['Online', 'Cash', 'Cheque'];

const AddPaymentsEntry = () => {
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
            <Box display="flex" alignItems="center" gap={1}>
              <NotificationsNoneIcon />
              <UserMenu />
            </Box>
          </Box>
        </Box>

       
        <Box sx={{ p: 3 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: '12px' }}>
            <Box display="flex" alignItems="center" gap={1} mb={3}>
              <ArrowBackIosNewIcon fontSize="small" />
              <Typography variant="h6" fontWeight="bold">
                Add Payments Entry
              </Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  select
                  fullWidth
                  required
                  label="Customer Name"
                  defaultValue="Customer 1"     sx={{
                      width: { xs: '100%', sm: '100%', md: 330 },
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                        backgroundColor: '#f9fafb',
                        height: 40,
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderRadius: '10px',
                      },
                      '& input': {
                        fontSize: '14px',
                        padding: '10px 14px',
                      },
                    }}
                >
                  {customers.map((c) => (
                    <MenuItem key={c} value={c}>{c}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  required
                  label="Payment Date"
                  type="date"
                  defaultValue="2025-04-01"
                  InputLabelProps={{ shrink: true }}     sx={{
                      width: { xs: '100%', sm: '100%', md: 330 },
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                        backgroundColor: '#f9fafb',
                        height: 40,
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderRadius: '10px',
                      },
                      '& input': {
                        fontSize: '14px',
                        padding: '10px 14px',
                      },
                    }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField select fullWidth required label="Payment Mode"     sx={{
                      width: { xs: '100%', sm: '100%', md: 330 },
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                        backgroundColor: '#f9fafb',
                        height: 40,
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderRadius: '10px',
                      },
                      '& input': {
                        fontSize: '14px',
                        padding: '10px 14px',
                      },
                    }}>
                  {paymentModes.map((mode) => (
                    <MenuItem key={mode} value={mode}>{mode}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField select fullWidth required label="Currency Preference"     sx={{
                      width: { xs: '100%', sm: '100%', md: 330 },
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                        backgroundColor: '#f9fafb',
                        height: 40,
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderRadius: '10px',
                      },
                      '& input': {
                        fontSize: '14px',
                        padding: '10px 14px',
                      },
                    }}>
                  {currencies.map((curr) => (
                    <MenuItem key={curr} value={curr}>{curr}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth required label="Amount" placeholder="Enter amount"     sx={{
                      width: { xs: '100%', sm: '100%', md: 330 },
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                        backgroundColor: '#f9fafb',
                        height: 40,
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderRadius: '10px',
                      },
                      '& input': {
                        fontSize: '14px',
                        padding: '10px 14px',
                      },
                    }} />
              </Grid>
            </Grid>

       
            <Box
              mt={6}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderTop="1px solid #eee"
              pt={2}
            >
              <Typography sx={{ color: '#888' }}>Preview Receipt</Typography>
              <Box display="flex" gap={2}>
                <Button variant="outlined" color="inherit" sx={{ textTransform: 'none' }}>
                  Cancel
                </Button>
                <Button variant="outlined" sx={{ textTransform: 'none' }}>
                  Save as Draft
                </Button>
                <Button variant="contained" sx={{ textTransform: 'none', bgcolor: '#003865' }}>
                  Save & Send
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default AddPaymentsEntry;