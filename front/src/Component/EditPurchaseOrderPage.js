import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Paper, Typography, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import Sidebar from './Sidebar';
import axios from 'axios';

export default function EditPurchaseOrderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    purchase_order_number: '',
    vendor_name: '',
    created_date: '',
    delivery_date: '',
    status: '',
    bill_amount: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [vendors, setVendors] = useState([]);

  // Fetch PO
  useEffect(() => {
    const fetchPurchaseOrder = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/purchase/${id}`);
        const po = res.data.purchase_order;
        setFormData({
          purchase_order_number: po.purchase_order_number,
          vendor_name: po.vendor_name,
          created_date: po.created_date,
          delivery_date: po.delivery_date,
          status: po.status || '',
          bill_amount: res.data.bill_amount || '',
        });
      } catch (err) {
        setError('Failed to fetch purchase order');
      } finally {
        setLoading(false);
      }
    };
    fetchPurchaseOrder();
  }, [id]);

  // Fetch vendor list
  useEffect(() => {
    axios.get('http://localhost:5000/api/vendors')
      .then(res => setVendors(res.data))
      .catch(() => setVendors([]));
  }, []);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.put(`http://localhost:5000/api/purchase/${id}`, {
        vendor_name: formData.vendor_name,
        created_date: formData.created_date,
        delivery_date: formData.delivery_date,
        status: formData.status,
      });
      alert('Purchase order updated successfully!');
      navigate('/purchase-order-list');
    } catch (err) {
      setError('Failed to update purchase order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5, width: '100%' }}>
        <Paper sx={{ width: 600, p: 4, borderRadius: 3 }}>
          <Typography variant="h5" fontWeight={600} mb={3} textAlign="center">
            Edit Purchase Order
          </Typography>
          {error && <Typography color="error" mb={2}>{error}</Typography>}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              name="purchase_order_number"
              label="PO Number"
              value={formData.purchase_order_number}
              margin="normal"
              disabled
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Vendor</InputLabel>
              <Select
                name="vendor_name"
                value={formData.vendor_name || ''}
                label="Vendor"
                onChange={handleChange}
              >
                {vendors.map(vendor => (
                  <MenuItem key={vendor.id} value={vendor.name}>
                    {vendor.name}
                  </MenuItem>
                ))}
                {formData.vendor_name && !vendors.some(v => v.name === formData.vendor_name) && (
                  <MenuItem value={formData.vendor_name}>{formData.vendor_name}</MenuItem>
                )}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              name="created_date"
              label="Created Date"
              type="date"
              value={formData.created_date ? formData.created_date.slice(0, 10) : ''}
              onChange={handleChange}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              name="delivery_date"
              label="Delivery Date"
              type="date"
              value={formData.delivery_date ? formData.delivery_date.slice(0, 10) : ''}
              onChange={handleChange}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                label="Status"
                onChange={handleChange}
              >
                <MenuItem value="Draft">Draft</MenuItem>
                <MenuItem value="Sent">Sent</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              name="bill_amount"
              label="Bill Amount"
              value={formData.bill_amount}
              margin="normal"
              disabled
            />
            <Box display="flex" justifyContent="space-between" mt={3}>
              <Button variant="outlined" color="secondary" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button variant="contained" type="submit" disabled={loading}>
                Save Changes
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Box>
  );
}
