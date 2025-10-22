import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Paper, Typography, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import Sidebar from './Sidebar';
import UserMenu from './UserMenu';
import axios from 'axios';

export default function EditInvoicePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    invoice_number: '',
    customer_name: '',
    invoice_date: '',
    expiry_date: '',
    status: '',
    grand_total: '',
    subject: '',
    customer_notes: '',
    terms_and_conditions: '',
    freight: '',
    attachment_url: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchInvoice = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`http://localhost:5000/api/invoice/${id}`);
        const inv = res.data.invoice;
        setFormData({
          invoice_number: inv.invoice_number,
          customer_name: inv.customer_name,
          invoice_date: inv.invoice_date,
          expiry_date: inv.expiry_date,
          status: inv.status || '',
          grand_total: res.data.grand_total || '',
          subject: inv.subject || '',
          customer_notes: inv.customer_notes || '',
          terms_and_conditions: inv.terms_and_conditions || '',
          freight: inv.freight || '',
          attachment_url: inv.attachment_url || ''
        });
      } catch (err) {
        setError('Failed to fetch invoice');
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [id]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/customers')
      .then(res => setCustomers(res.data))
      .catch(() => setCustomers([]));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.put(`http://localhost:5000/api/invoice/${id}`, {
        invoice: {
          customer_name: formData.customer_name,
          invoice_date: formData.invoice_date,
          expiry_date: formData.expiry_date,
          status: formData.status,
          subject: formData.subject,
          customer_notes: formData.customer_notes,
          terms_and_conditions: formData.terms_and_conditions,
          freight: formData.freight,
          attachment_url: formData.attachment_url
        },
        items: [] // Placeholder for items - can be enhanced later
      });
      alert('Invoice updated successfully!');
      navigate('/invoice-list');
    } catch (err) {
      setError('Failed to update invoice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1 }}>
        {/* Header */}
        <Box sx={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          p: 2, 
          borderBottom: "1px solid #e0e0e0" 
        }}>
          <Typography variant="h6" fontWeight={600}>
            Edit Invoice
          </Typography>
          <UserMenu />
        </Box>

        {/* Main Content */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3, p: 2 }}>
          <Paper sx={{ width: 800, p: 4, borderRadius: 3 }}>
          <Typography variant="h5" fontWeight={600} mb={3} textAlign="center">
            Edit Invoice
          </Typography>
          {error && <Typography color="error" mb={2}>{error}</Typography>}
          {loading && <Typography color="primary" mb={2}>Loading...</Typography>}
          <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            name="invoice_number"
            label="Invoice #"
            value={formData.invoice_number}
            margin="normal"
            disabled
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Customer</InputLabel>
            <Select
              name="customer_name"
              value={formData.customer_name || ''}
              label="Customer"
              onChange={handleChange}
            >
              {customers.map(customer => (
                <MenuItem key={customer.customer_id} value={customer.customer_name}>
                  {customer.customer_name}
                </MenuItem>
              ))}
              {formData.customer_name && !customers.some(c => c.customer_name === formData.customer_name) && (
                <MenuItem value={formData.customer_name}>{formData.customer_name}</MenuItem>
              )}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            name="invoice_date"
            label="Invoice Date"
            type="date"
            value={formData.invoice_date ? formData.invoice_date.slice(0,10) : ''}
            onChange={handleChange}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            name="expiry_date"
            label="Due Date"
            type="date"
            value={formData.expiry_date ? formData.expiry_date.slice(0,10) : ''}
            onChange={handleChange}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            name="subject"
            label="Subject"
            value={formData.subject}
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
            rows={2}
          />
          <TextField
            fullWidth
            name="freight"
            label="Freight"
            type="number"
            value={formData.freight}
            onChange={handleChange}
            margin="normal"
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
              <MenuItem value="Partial">Partial</MenuItem>
              <MenuItem value="Paid">Paid</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            name="grand_total"
            label="Amount"
            value={formData.grand_total}
            margin="normal"
            disabled
          />
          <Box display="flex" justifyContent="space-between" mt={3}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate(-1)}
            >
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