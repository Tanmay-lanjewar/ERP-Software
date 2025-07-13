import {
  Box, Grid, Typography, TextField, Button, MenuItem, Tooltip,
  IconButton, InputAdornment, Paper, Breadcrumbs, InputBase, FormControl, Select, Avatar
} from '@mui/material';
import {
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

const units = ['cm', 'mm', 'kg', 'pcs'];
const vendors = ['Laxmi Motors', 'ABC Traders'];
const taxes = ['GST 5%', 'GST 12%', 'None'];

export default function AddItems() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: 'Product',
    product_name: '',
    sku: '',
    tax_applicable: '',
    status: 'Active',
    category: '',
    unit: '',
    sale_price: '',
    sale_discount: '',
    sale_discount_type: '%',
    sale_description: '',
    purchase_price: '',
    purchase_discount: '',
    purchase_discount_type: '%',
    purchase_description: '',
    preferred_vendor: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generateSKU = () => {
  const prefix = formData.product_name?.substring(0, 3).toUpperCase() || "SKU";
  const uniqueNumber = Date.now().toString().slice(-5); // e.g., last 5 digits of timestamp
  return `${prefix}${uniqueNumber}`;
};

const handleSubmit = async () => {
  const dataToSend = {
    ...formData,
    sku: generateSKU(), // auto-generated
  };

  try {
    await axios.post('http://localhost:5000/api/products', dataToSend);
    navigate('/item-list');
  } catch (error) {
    console.error('Error saving item:', error);
  }
};


  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar active="Items" />
      <Box sx={{ flex: 1, bgcolor: '#f9fafc', minHeight: '100vh' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, mt: 1, px: 3 }}>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
            <Typography color="text.secondary" fontSize="14px">Product & Services</Typography>
            <Typography color="text.primary" fontWeight={600} fontSize="14px">Add</Typography>
          </Breadcrumbs>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Paper elevation={0} sx={{ display: 'flex', alignItems: 'center', px: 1.5, py: 0.5, borderRadius: '999px', border: '1px solid #e0e0e0', bgcolor: '#f9fafb', width: 240 }}>
              <SearchIcon sx={{ fontSize: 20, color: '#999' }} />
              <InputBase placeholder="Search anything here..." sx={{ ml: 1, fontSize: 14, flex: 1 }} inputProps={{ 'aria-label': 'search' }} />
            </Paper>
            <IconButton sx={{ borderRadius: '12px', border: '1px solid #e0e0e0', bgcolor: '#f9fafb', p: 1 }}>
              <NotificationsNoneIcon sx={{ fontSize: 20, color: '#666' }} />
            </IconButton>
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar src="https://i.pravatar.cc/150?img=1" />
              <Typography fontSize={14}>Admin name</Typography>
              <ArrowDropDownIcon />
            </Box>
          </Box>
        </Box>

        <Box sx={{ px: 4, py: 4 }}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>New Product & Services</Typography>

            <FormLabel sx={{ mb: 1, fontWeight: 500 }}>Customer Type</FormLabel>
            <RadioGroup row name="type" value={formData.type} onChange={handleChange}>
              <FormControlLabel value="Product" control={<Radio />} label="Product" />
              <FormControlLabel value="Service" control={<Radio />} label="Service" />
            </RadioGroup>

            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} md={4}>
                <TextField fullWidth size="small" name="product_name" label="Product Name" value={formData.product_name} onChange={handleChange} />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField select fullWidth size="small" name="tax_applicable" label="Tax Applicable" value={formData.tax_applicable} onChange={handleChange}
                  sx={{
    width: { xs: '100%', sm: '100%', md: 200 },
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px',
      backgroundColor: '#f9fafb',
      height: 40,
    },
    '& .MuiSelect-select': {
      fontSize: '14px',
      padding: '10px 14px',
    },
  }}
                >
                  {taxes.map((tax) => <MenuItem key={tax} value={tax}>{tax}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField select fullWidth size="small" name="status" label="Status" value={formData.status} onChange={handleChange}>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth size="small" name="category" label="Category" value={formData.category} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField select fullWidth size="small" name="unit" label="Unit" value={formData.unit} onChange={handleChange}
                  sx={{
    width: { xs: '100%', sm: '100%', md: 70 },
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px',
      backgroundColor: '#f9fafb',
      height: 40,
    },
    '& .MuiSelect-select': {
      fontSize: '14px',
      padding: '10px 14px',
    },
  }}
                >
                  {units.map((unit) => <MenuItem key={unit} value={unit}>{unit}</MenuItem>)}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1">Sales Information</Typography>
                <TextField fullWidth size="small" label="Sale Price" name="sale_price" value={formData.sale_price} onChange={handleChange} />
                <TextField fullWidth size="small" label="Sale Discount" name="sale_discount" value={formData.sale_discount} onChange={handleChange} sx={{ mt: 2 }} />
                <TextField select fullWidth size="small" label="Sale Discount Type" name="sale_discount_type" value={formData.sale_discount_type} onChange={handleChange} sx={{ mt: 2 }}>
                  <MenuItem value="%">%</MenuItem>
                  <MenuItem value="Flat">Flat</MenuItem>
                </TextField>
                <TextField fullWidth size="small" multiline rows={2} label="Sale Description" name="sale_description" value={formData.sale_description} onChange={handleChange} sx={{ mt: 2 }} />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1">Purchase Information</Typography>
                <TextField fullWidth size="small" label="Purchase Price" name="purchase_price" value={formData.purchase_price} onChange={handleChange} />
                <TextField fullWidth size="small" label="Purchase Discount" name="purchase_discount" value={formData.purchase_discount} onChange={handleChange} sx={{ mt: 2 }} />
                <TextField select fullWidth size="small" label="Purchase Discount Type" name="purchase_discount_type" value={formData.purchase_discount_type} onChange={handleChange} sx={{ mt: 2 }}>
                  <MenuItem  value="%">%</MenuItem>
                  <MenuItem value="Flat">Flat</MenuItem>
                </TextField>
                <TextField fullWidth size="small" multiline rows={2} label="Purchase Description" name="purchase_description" value={formData.purchase_description} onChange={handleChange} sx={{ mt: 2 }} />
                <TextField select fullWidth size="small" label="Preferred Vendor" name="preferred_vendor" value={formData.preferred_vendor} onChange={handleChange} sx={{ mt: 2 }}>
                  {vendors.map((vendor) => <MenuItem key={vendor} value={vendor}>{vendor}</MenuItem>)}
                </TextField>
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
              <Button variant="outlined" sx={{ textTransform: 'none', borderRadius: 2, px: 4 }}>Cancel</Button>
              <Button variant="contained" onClick={handleSubmit} sx={{ textTransform: 'none', borderRadius: 2, bgcolor: '#004085', '&:hover': { bgcolor: '#003366' } }}>Add</Button>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
