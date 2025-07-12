import {
  Box, Typography, Grid, TextField, Button, RadioGroup,
  FormControlLabel, Radio, FormLabel, Checkbox,
  IconButton, Paper, InputBase, Breadcrumbs, MenuItem, FormControl, InputAdornment,
  Select,Avatar
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import { Navigate, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Sidebar from './Sidebar';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import { useLocation } from 'react-router-dom';

import { useState } from 'react';
const textFieldStyle = {
  bgcolor: '#f9fafb',
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
  },
  '& input::placeholder': {
    color: '#b0b0b0',
  },
  '& .MuiInputLabel-root': {
    fontWeight: 500,
  }
};

export default function AddCustomerForm() {
   const navigate = useNavigate();
  const titleOptions = ['MR', 'MS', 'MRS'];
 const location = useLocation();
const customerData = location.state?.customer;

const [companyName, setCompanyName] = useState(customerData?.company || '');
const [fullName, setFullName] = useState(customerData?.name || '');
const [email, setEmail] = useState(customerData?.email || '');
const [phone, setPhone] = useState(customerData?.phone || '');
const [customerType, setCustomerType] = useState(customerData?.type || 'Business');

const isEditMode = Boolean(customerData);


  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />

      <Box sx={{ flex: 1, bgcolor: '#f9fafc', minHeight: '100vh' }}>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            mt: 1,
            px: 3
          }}
        >

          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
            <Typography color="text.secondary" fontSize="14px">
              Customer
            </Typography>
            <Typography variant="h6" fontWeight={100} sx={{fontSize: 15}}>
              {isEditMode ? 'Edit Customer' : 'Add Customer'}
            </Typography>

          </Breadcrumbs>

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
                bgcolor: '#f9fafb',
                width: 240,
              }}
            >
              <SearchIcon sx={{ fontSize: 20, color: '#999' }} />
              <InputBase
                placeholder="Search anything here..."
                sx={{ ml: 1, fontSize: 14, flex: 1 }}
                inputProps={{ 'aria-label': 'search' }}
              />
            </Paper>

            <IconButton
              sx={{
                borderRadius: '12px',
                border: '1px solid #e0e0e0',
                bgcolor: '#f9fafb',
                p: 1,
              }}
            >
              <NotificationsNoneIcon sx={{ fontSize: 20, color: '#666' }} />
            </IconButton> <Box display="flex" alignItems="center" gap={1}>
              <Avatar src="https://i.pravatar.cc/40?img=1" />
              <Typography fontSize={14}>Admin name</Typography>
              <ArrowDropDownIcon />
            </Box>
          </Box>
        </Box>

        <Box sx={{ px: 4, py: 3, bgcolor: 'white' }}>

          <Paper sx={{ p: 1, borderRadius: 2 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: '#111',
                mb: 2,
                borderBottom: '1px solid #eee',
                pb: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                cursor: 'pointer',
              }}
              onClick={() => navigate(-1)}
            >
              <ArrowBackIcon sx={{ fontSize: 22 }} />
              New Customer
            </Typography>
            <FormLabel sx={{ mb: 1, fontWeight: 500 }}>Customer Type</FormLabel>
            <RadioGroup row defaultValue="business">
              <FormControlLabel value="business" control={<Radio />} label="Domestic" />
              <FormControlLabel value="individual" control={<Radio />} label="International" />
            </RadioGroup>

            <Grid container spacing={2} mt={2}>
              <Grid item xs={12} sm={4}>
                <Typography fontWeight={500} mb={0.5}>Primary Contact Full Name</Typography>
                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <FormControl fullWidth size="small">
                      <Select defaultValue="MR" sx={{ borderRadius: '10px', bgcolor: '#f9fafb', height: 40 }}>
                        {titleOptions.map((option) => (
                          <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      fullWidth 
                       value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter full name"
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '10px',
                          bgcolor: '#f9fafb',
                          height: 40
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Typography fontWeight={500} mb={0.5}>Company Name</Typography>
                <TextField
                  fullWidth
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Enter company name"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      bgcolor: '#f9fafb',
                      height: 40
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <Typography fontWeight={500} mb={0.5}>Display Name</Typography>
                <TextField
                  fullWidth
                  placeholder="Enter display name"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      bgcolor: '#f9fafb',
                      height: 40
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography fontWeight={500} mb={0.5}>Email Address</Typography>
                <TextField
                  fullWidth
                  placeholder="Enter email address"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ fontSize: 18, color: '#888' }} />
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      bgcolor: '#f9fafb',
                      height: 40
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography fontWeight={500} mb={0.5}>Company Phone Number</Typography>
                <TextField
                  fullWidth
                  placeholder="Enter company phone number"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon sx={{ fontSize: 18, color: '#888' }} />
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      bgcolor: '#f9fafb',
                      height: 40
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <Typography fontWeight={500} mb={0.5}>PAN Number</Typography>
                <TextField
                  fullWidth
                  placeholder="Enter PAN number"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      bgcolor: '#f9fafb',
                      height: 40
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <Typography fontWeight={500} mb={0.5}>GST Number</Typography>
                <TextField
                  fullWidth
                  placeholder="Enter GST number"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      bgcolor: '#f9fafb',
                      height: 40
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <Typography fontWeight={500} mb={0.5}>Currency Preference</Typography>
                <FormControl fullWidth size="small">
                  <Select defaultValue="" displayEmpty sx={{ borderRadius: '10px', bgcolor: '#f9fafb', height: 40 }}>
                    <MenuItem value="" disabled>Select currency</MenuItem>
                    <MenuItem value="INR">INR</MenuItem>
                    <MenuItem value="USD">USD</MenuItem>
                    <MenuItem value="EUR">EUR</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography fontWeight={500} mb={0.5}>Upload Document</Typography>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{
                    borderRadius: '10px',
                    textTransform: 'none',
                    height: '40px',
                    fontWeight: 500,
                  }}
                >
                  📎 Upload File
                </Button>
                <Typography variant="caption" display="block" sx={{ mt: 1, color: '#888' }}>
                  Max upload file size: 5 MB
                </Typography>
              </Grid>
            </Grid>
 <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, mb: 2 }}>Address Details</Typography>

            <Box display={'flex'} justifyContent={'space-between'}>
              <Grid item xs={12} md={6} >
                <Paper
                  elevation={0}
                  sx={{ p: -1, borderRadius: 2, height: '100%' }}
                >
                <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>Billing Address</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField fullWidth label="Recipient Name" x={textFieldStyle} sx={{
                        width: { xs: '100%', sm: '100%', md: 450 }
                        ,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '10px',
                          bgcolor: '#f9fafb',
                          height: 40,
                        },
                      }} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth label="Country/Region" placeholder="Select a country/region" x={textFieldStyle} sx={{
                        width: { xs: '100%', sm: '100%', md: 450 }
                        ,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '10px',
                          bgcolor: '#f9fafb',
                          height: 40,
                        },
                      }} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth label="Address 1" placeholder="Street address or P.O. Box" x={textFieldStyle} sx={{
                        width: { xs: '100%', sm: '100%', md: 450 }
                        ,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '10px',
                          bgcolor: '#f9fafb',
                          height: 40,
                        },
                      }} />
                    </Grid>
                     <Grid item xs={12}>
                      <TextField fullWidth label="Address 2" placeholder="Apartment, suite, unit, building, floor, etc." x={textFieldStyle} sx={{
                        width: { xs: '100%', sm: '100%', md: 450 }
                        ,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '10px',
                          bgcolor: '#f9fafb',
                          height: 40,
                        },
                      }} />
                    </Grid>
                      <Grid item xs={12}>
                      <TextField fullWidth label="City" x={textFieldStyle} sx={{
                        width: { xs: '100%', sm: '100%', md: 216 }
                        ,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '10px',
                          bgcolor: '#f9fafb',
                          height: 40,
                        },
                      }} />
                    </Grid> <Grid item xs={6}>
                      <TextField fullWidth label="State" x={textFieldStyle} sx={{
                        width: { xs: '100%', sm: '100%', md: 216 }
                        ,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '10px',
                          bgcolor: '#f9fafb',
                          height: 40,
                        },
                      }} />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField fullWidth label="Pin Code" x={textFieldStyle} sx={{
                        width: { xs: '100%', sm: '100%', md: 216 }
                        ,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '10px',
                          bgcolor: '#f9fafb',
                          height: 40,
                        },
                      }} />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField fullWidth label="Fax Number" x={textFieldStyle} sx={{
                        width: { xs: '100%', sm: '100%', md: 216 }
                        ,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '10px',
                          bgcolor: '#f9fafb',
                          height: 40,
                        },
                      }} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon sx={{ fontSize: 18, color: '#888' }} />
                      </InputAdornment>
                    )
                  }}label="Other Phone Number" x={textFieldStyle} sx={{
                        width: { xs: '100%', sm: '100%', md: 216 }
                        ,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '10px',
                          bgcolor: '#f9fafb',
                          height: 40,
                        },
                        
                      }}  />
                    </Grid>
                    
                  </Grid>
                </Paper>
              </Grid>

              <Grid item xs={12} md={3} ml={3} >
                <Paper
                  elevation={0}
                  sx={{ p:-2, borderRadius: 2, height: '100%' }}
                >
                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>Shipping Address</Typography>
                    <FormControlLabel control={<Checkbox />} label="Copy Billing Address" />
                  </Box>
                  <Grid container spacing={2}>
                      <Grid item xs={12}>
                      <TextField fullWidth label="Recipient Name" x={textFieldStyle} sx={{
                        width: { xs: '100%', sm: '100%', md: 450 }
                        ,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '10px',
                          bgcolor: '#f9fafb',
                          height: 40,
                        },
                      }} />
                    </Grid>
                     <Grid item xs={12}>
                      <TextField fullWidth label="Country/Region" placeholder="Select a country/region" x={textFieldStyle} sx={{
                        width: { xs: '100%', sm: '100%', md: 450 }
                        ,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '10px',
                          bgcolor: '#f9fafb',
                          height: 40,
                        },
                      }} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth label="Address 1" placeholder="Street address or P.O. Box" x={textFieldStyle} sx={{
                        width: { xs: '100%', sm: '100%', md: 450 }
                        ,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '10px',
                          bgcolor: '#f9fafb',
                          height: 40,
                        },
                      }} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth label="Address 2" placeholder="Apartment, suite, unit, building, floor, etc." x={textFieldStyle} sx={{
                        width: { xs: '100%', sm: '100%', md: 450 }
                        ,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '10px',
                          bgcolor: '#f9fafb',
                          height: 40,
                        },
                      }} />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField fullWidth label="City" x={textFieldStyle} sx={{
                        width: { xs: '100%', sm: '100%', md: 220 }
                        ,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '10px',
                          bgcolor: '#f9fafb',
                          height: 40,
                        },
                      }} />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField fullWidth label="State" x={textFieldStyle} sx={{
                        width: { xs: '100%', sm: '100%', md: 220 }
                        ,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '10px',
                          bgcolor: '#f9fafb',
                          height: 40,
                        },
                      }} />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField fullWidth label="Pin Code" x={textFieldStyle} sx={{
                        width: { xs: '100%', sm: '100%', md: 220 }
                        ,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '10px',
                          bgcolor: '#f9fafb',
                          height: 40,
                        },
                      }} />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField fullWidth label="Fax Number" x={textFieldStyle} sx={{
                        width: { xs: '100%', sm: '100%', md: 220 }
                        ,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '10px',
                          bgcolor: '#f9fafb',
                          height: 40,
                        },
                      }} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon sx={{ fontSize: 18, color: '#888' }} />
                      </InputAdornment>
                    )
                  }} label="Other Phone Number" x={textFieldStyle} sx={{
                        width: { xs: '100%', sm: '100%', md: 220 }
                        ,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '10px',
                          bgcolor: '#f9fafb',
                          height: 40,
                        },
                      }} />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
</Box>
            <Grid container spacing={2} mt={4}>
              <Grid item xs={12}>
                <Typography>Remark</Typography>
                <TextField fullWidth multiline rows={3} x={textFieldStyle} sx={{
                  width: { xs: '100%', sm: '100%', md: 1000 }
                  ,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    bgcolor: '#f9fafb',
                    height: 40,
                  },
                }} />
              </Grid>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 2,
                  width: '100%',
                  mt: 2,
                }}
              >
                <Button
                  variant="outlined"
                  color="error"
                  sx={{
                    px: 4,
                    py: 1,
                    borderRadius: '20px',
                    textTransform: 'none',
                    fontWeight: 500,
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#004085',
                    '&:hover': { backgroundColor: '#003366' },
                    px: 4,
                    py: 1,
                    borderRadius: '20px',
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                  }}
                  onClick={() => navigate('/customer-list')}
                >
                  Add
                </Button>
              </Box>
            </Grid>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
