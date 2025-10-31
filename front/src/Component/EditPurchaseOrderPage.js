import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Paper, Typography, MenuItem, FormControl, InputLabel, Select, Alert, CircularProgress } from '@mui/material';
import Sidebar from './Sidebar';
import UserMenu from './UserMenu';
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
    delivery_to: '',
    delivery_address: '',
    payment_terms: '',
    due_date: '',
    customer_notes: '',
    terms_and_conditions: '',
    sub_total: 0,
    freight: 0,
    cgst: 0,
    sgst: 0,
    attachment: '',
    vendor_id: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [vendors, setVendors] = useState([]);


  // Fetch PO
  useEffect(() => {
    const fetchPurchaseOrder = async () => {
      try {
        const res = await axios.get(`http://168.231.102.6:5000/api/purchase/${id}`);
        const po = res.data.purchase_order;
        setFormData({
          purchase_order_number: po.purchase_order_no || '',
          vendor_name: po.vendor_name || '',
          created_date: po.purchase_order_date ? po.purchase_order_date.slice(0, 10) : '',
          delivery_date: po.delivery_date ? po.delivery_date.slice(0, 10) : '',
          status: po.status || 'Draft',
          bill_amount: po.total || 0,
          delivery_to: po.delivery_to || '',
          delivery_address: po.delivery_address || '',
          payment_terms: po.payment_terms || '',
          due_date: po.due_date ? po.due_date.slice(0, 10) : '',
          customer_notes: po.customer_notes || '',
          terms_and_conditions: po.terms_and_conditions || '',
          sub_total: po.sub_total || 0,
          freight: po.freight || 0,
          cgst: po.cgst || 0,
          sgst: po.sgst || 0,
          attachment: po.attachment || '',
          vendor_id: po.vendor_id || null
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
    axios.get('http://168.231.102.6:5000/api/vendors')
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
      await axios.put(`http://168.231.102.6:5000/api/purchase/${id}`, {
        purchase_order_no: formData.purchase_order_number,
        vendor_name: formData.vendor_name,
        purchase_order_date: formData.created_date,
        delivery_date: formData.delivery_date,
        status: formData.status,
        delivery_to: formData.delivery_to || '',
        delivery_address: formData.delivery_address || '',
        payment_terms: formData.payment_terms || 'Due end of the month',
        due_date: formData.due_date || '',
        customer_notes: formData.customer_notes || '',
        terms_and_conditions: formData.terms_and_conditions || '',
        sub_total: formData.sub_total || 0,
        freight: formData.freight || 0,
        cgst: formData.cgst || 0,
        sgst: formData.sgst || 0,
        total: formData.bill_amount || 0,
        attachment: formData.attachment || '',
        vendor_id: formData.vendor_id || null
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
      <Box sx={{ flexGrow: 1 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Edit Purchase Order
          </Typography>
          <UserMenu />
        </Box>
        
        {/* Main Content */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5, width: '100%' }}>
          <Paper sx={{ width: 600, p: 4, borderRadius: 3 }}>
            <Typography variant="h5" fontWeight={600} mb={3} textAlign="center">
              Purchase Order Details
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
                  <MenuItem key={vendor.vendor_id} value={vendor.vendor_name}>
                    {vendor.vendor_name}
                  </MenuItem>
                ))}
                {formData.vendor_name && !vendors.some(v => v.vendor_name === formData.vendor_name) && (
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
              onChange={handleChange}
              margin="normal"
              type="number"
            />
            <TextField
              fullWidth
              name="payment_terms"
              label="Payment Terms"
              value={formData.payment_terms}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              name="customer_notes"
              label="Customer Notes"
              value={formData.customer_notes}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={3}
            />
            <TextField
              fullWidth
              name="freight"
              label="Freight"
              value={formData.freight}
              onChange={handleChange}
              margin="normal"
              type="number"
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
    </Box>
  );
}
