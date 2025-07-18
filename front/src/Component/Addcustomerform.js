import React, { useState } from 'react';
import {
  Box, Typography, Grid, TextField, Button,
  Select, MenuItem, FormControl, InputLabel, Paper, Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import axios from 'axios';

const AddCustomerForm = () => {
  const [formData, setFormData] = useState({
    customer_type: 'Domestic',
    title: 'MR',
    customer_name: '',
    company_name: '',
    display_name: '',
    email: '',
    mobile: '',
    office_no: '',
    pan: '',
    gst: '',
    currency: 'INR',
    document_path: '',
    billing_recipient_name: '',
    billing_country: '',
    billing_address1: '',
    billing_address2: '',
    billing_city: '',
    billing_state: '',
    billing_pincode: '',
    billing_fax: '',
    billing_phone: '',
    shipping_recipient_name: '',
    shipping_country: '',
    shipping_address1: '',
    shipping_address2: '',
    shipping_city: '',
    shipping_state: '',
    shipping_pincode: '',
    shipping_fax: '',
    shipping_phone: '',
    remark: '',
    status: 'Active'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/customers', formData);
      alert('Customer added successfully!');
      navigate('/customer');
    } catch (error) {
      console.error('Error:', error);
      alert('Error adding customer.');
    }
  };

  const renderTextFields = (fields) =>
    fields.map((field) => (
      <Grid item xs={12} sm={6} key={field}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          label={field.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
          name={field}
          value={formData[field] || ''}
          onChange={handleChange}
        />
      </Grid>
    ));

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 4 }}>
        <Paper elevation={3} sx={{ p: 4, maxWidth: 1100, mx: 'auto' }}>
          <Typography variant="h4" gutterBottom fontWeight={600}>
            Add Customer
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid item xs={12}>
                <Typography variant="h6">Customer Information</Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>
            <Grid container spacing={3}>
              {/* Section: Basic Info */}
              

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Customer Type</InputLabel>
                  <Select name="customer_type" value={formData.customer_type} onChange={handleChange}>
                    <MenuItem value="Domestic">Domestic</MenuItem>
                    <MenuItem value="International">International</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Title</InputLabel>
                  <Select name="title" value={formData.title} onChange={handleChange}>
                    <MenuItem value="MR">MR</MenuItem>
                    <MenuItem value="MS">MS</MenuItem>
                    <MenuItem value="MRS">MRS</MenuItem>
                    <MenuItem value="DR">DR</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {renderTextFields([
                'customer_name', 'company_name', 'display_name', 'email',
                'mobile', 'office_no', 'pan', 'gst', 'document_path'
              ])}
              </Grid>


              {/* Section: Billing */}
              <Grid item xs={12} mt={3}>
                <Typography variant="h6">Billing Address</Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              
              <Grid container spacing={3}>

              {renderTextFields([
                'billing_recipient_name', 'billing_country', 'billing_address1',
                'billing_address2', 'billing_city', 'billing_state',
                'billing_pincode', 'billing_fax', 'billing_phone'
              ])}
              </Grid>

              {/* Section: Shipping */}
              <Grid item xs={12} mt={3}>
                <Typography variant="h6">Shipping Address</Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

               <Grid container spacing={3}>

              {renderTextFields([
                'shipping_recipient_name', 'shipping_country', 'shipping_address1',
                'shipping_address2', 'shipping_city', 'shipping_state',
                'shipping_pincode', 'shipping_fax', 'shipping_phone'
              ])}

              </Grid>

              {/* Section: Misc */}
              <Grid item xs={12} mt={3}>
                <Typography variant="h6">Other Information</Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

               <Grid container spacing={3}>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Currency</InputLabel>
                  <Select name="currency" value={formData.currency} onChange={handleChange}>
                    <MenuItem value="INR">INR</MenuItem>
                    <MenuItem value="USD">USD</MenuItem>
                    <MenuItem value="EUR">EUR</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select name="status" value={formData.status} onChange={handleChange}>
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {renderTextFields(['remark'])}

              </Grid>


              {/* Submit */}
              <Grid item xs={12}>
                <Box  mt={2}>
                  <Button type="submit" variant="contained" size="large" color="primary">
                    Submit
                  </Button>
                </Box>
              </Grid>

              
          
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default AddCustomerForm;
