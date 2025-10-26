import React from 'react';
import {
  Box, Grid, Typography, TextField, FormControlLabel,
  Checkbox, Button, Select, MenuItem, InputLabel, FormControl, Avatar, InputBase, Breadcrumbs, Paper, IconButton
} from '@mui/material';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import axios from 'axios';
import { useState } from 'react';
import UserMenu from './UserMenu';

export default function NewVendorForm() {
  const navigate = useNavigate();
  const [vendorName, setVendorName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [gstNumber, setGstNumber] = useState('');

  const [billingRecipient, setBillingRecipient] = useState('');
  const [billingCountry, setBillingCountry] = useState('');
  const [billingAddress1, setBillingAddress1] = useState('');
  const [billingAddress2, setBillingAddress2] = useState('');
  const [billingCity, setBillingCity] = useState('');
  const [billingState, setBillingState] = useState('');
  const [billingPinCode, setBillingPinCode] = useState('');
  const [billingFax, setBillingFax] = useState('');
  const [billingOtherPhone, setBillingOtherPhone] = useState('');

  const [shippingRecipient, setShippingRecipient] = useState('');
  const [shippingCountry, setShippingCountry] = useState('');
  const [shippingAddress1, setShippingAddress1] = useState('');
  const [shippingAddress2, setShippingAddress2] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingState, setShippingState] = useState('');
  const [shippingPinCode, setShippingPinCode] = useState('');
  const [shippingFax, setShippingFax] = useState('');
  const [shippingOtherPhone, setShippingOtherPhone] = useState('');

  const [accountHolderName, setAccountHolderName] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');

  const [remark, setRemark] = useState('');

  const API_URL = "http://168.231.102.6:5000/api/vendors";

  const handleSave = async () => {
    const vendorData = {
      vendor_name: vendorName,
      company_name: companyName,
      display_name: displayName,
      email: email,
      phone: companyPhone,
      pan: panNumber,
      gst: gstNumber,
      billing_recipient: billingRecipient,
      billing_country: billingCountry,
      billing_address1: billingAddress1,
      billing_address2: billingAddress2,
      billing_city: billingCity,
      billing_state: billingState,
      billing_pincode: billingPinCode,
      billing_fax: billingFax,
      billing_other_phone: billingOtherPhone,
      shipping_recipient: shippingRecipient,
      shipping_country: shippingCountry,
      shipping_address1: shippingAddress1,
      shipping_address2: shippingAddress2,
      shipping_city: shippingCity,
      shipping_state: shippingState,
      shipping_pincode: shippingPinCode,
      shipping_fax: shippingFax,
      shipping_other_phone: shippingOtherPhone,
      account_holder_name: accountHolderName,
      bank_name: bankName,
      account_number: accountNumber,
      ifsc: ifscCode,
      remark: remark
    };

    try {
      const response = await axios.post(API_URL, vendorData);
      if (response.status === 201) {
        alert("Vendor added successfully!");
        navigate('/vendor-list'); // Redirect to vendor list page
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to add vendor: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <Box sx={{ display: 'flex', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
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
              Vendor
            </Typography>
            <Typography color="text.primary" fontWeight={600} fontSize="14px">
              Add
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
            </IconButton>  
            <Box display="flex" alignItems="center" gap={1}>
              <NotificationsNoneIcon />
              <UserMenu />
            </Box>
          </Box>
        </Box>
        <Box sx={{ px: 2, py: 2 }}>
          <Paper sx={{ p: 1, borderRadius: 2 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: '#111',
                mb: 2,
                borderBottom: '1px solid #eee',
                pb: 1,
              }}
            >
              Vendors
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  sx={{
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
                  fullWidth
                  label="Primary Contact Full Name"
                  onChange={(e) => setVendorName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  sx={{
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
                  fullWidth
                  label="Company Name"
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  sx={{
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
                  fullWidth
                  label="Designation"
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  sx={{
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
                  fullWidth
                  label="Email Address"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  sx={{
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
                  fullWidth
                  label="Company Phone Number"
                  onChange={(e) => setCompanyPhone(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  sx={{
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
                  fullWidth
                  label="PAN Number"
                  onChange={(e) => setPanNumber(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  sx={{
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
                  fullWidth
                  label="GST Number"
                  onChange={(e) => setGstNumber(e.target.value)}
                />
              </Grid>
            </Grid>
            <Box mt={5}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Address Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography fontWeight="medium" mb={1}>
                    Billing Address
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        sx={{
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
                        fullWidth
                        label="Recipient Name"
                        onChange={(e) => setBillingRecipient(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl
                        fullWidth
                        sx={{
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
                        <InputLabel>Country/Region</InputLabel>
                        <Select
                          label="Country/Region"
                          onChange={(e) => setBillingCountry(e.target.value)}
                        >
                          <MenuItem value="India">India</MenuItem>
                          <MenuItem value="USA">USA</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        sx={{
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
                        fullWidth
                        label="Address 1"
                        onChange={(e) => setBillingAddress1(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        sx={{
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
                        fullWidth
                        label="Address 2"
                        onChange={(e) => setBillingAddress2(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        sx={{
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
                        fullWidth
                        label="City"
                        onChange={(e) => setBillingCity(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        sx={{
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
                        fullWidth
                        label="State"
                        onChange={(e) => setBillingState(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        sx={{
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
                        fullWidth
                        label="Pin Code"
                        onChange={(e) => setBillingPinCode(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        sx={{
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
                        fullWidth
                        label="Fax Number"
                        onChange={(e) => setBillingFax(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        sx={{
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
                        fullWidth
                        label="Other Phone Number"
                        onChange={(e) => setBillingOtherPhone(e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography fontWeight="medium" mb={1}>
                      Shipping Address
                    </Typography>
                    <FormControlLabel
                      control={<Checkbox />}
                      label="Copy Billing Address"
                    />
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        sx={{
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
                        fullWidth
                        label="Recipient Name"
                        onChange={(e) => setShippingRecipient(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl
                        fullWidth
                        sx={{
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
                        <InputLabel>Country/Region</InputLabel>
                        <Select
                          label="Country/Region"
                          onChange={(e) => setShippingCountry(e.target.value)}
                        >
                          <MenuItem value="India">India</MenuItem>
                          <MenuItem value="USA">USA</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        sx={{
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
                        fullWidth
                        label="Address 1"
                        onChange={(e) => setShippingAddress1(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        sx={{
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
                        fullWidth
                        label="Address 2"
                        onChange={(e) => setShippingAddress2(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        sx={{
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
                        fullWidth
                        label="City"
                        onChange={(e) => setShippingCity(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        sx={{
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
                        fullWidth
                        label="State"
                        onChange={(e) => setShippingState(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        sx={{
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
                        fullWidth
                        label="Pin Code"
                        onChange={(e) => setShippingPinCode(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        sx={{
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
                        fullWidth
                        label="Fax Number"
                        onChange={(e) => setShippingFax(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        sx={{
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
                        fullWidth
                        label="Other Phone Number"
                        onChange={(e) => setShippingOtherPhone(e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
            <Box mt={5}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Bank Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    sx={{
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
                    fullWidth
                    label="Account Holder Name"
                    onChange={(e) => setAccountHolderName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    sx={{
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
                    fullWidth
                    label="Bank Name"
                    onChange={(e) => setBankName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    sx={{
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
                    fullWidth
                    label="Account Number"
                    onChange={(e) => setAccountNumber(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    sx={{
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
                    fullWidth
                    label="Re-enter Account Number"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    sx={{
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
                    fullWidth
                    label="IFSC"
                    onChange={(e) => setIfscCode(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={9}>
                  <TextField
                    sx={{
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
                    fullWidth
                    label="Remark"
                    onChange={(e) => setRemark(e.target.value)}
                  />
                </Grid>
              </Grid>
            </Box>
            <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
              <Button variant="outlined">Cancel</Button>
              <Button variant="contained" color="primary" onClick={handleSave}>
                Add
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
