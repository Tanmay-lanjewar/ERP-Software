import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, TextField, Button, Paper, Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import Sidebar from "./Sidebar";
import axios from 'axios';

export default function EditWorkOrderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    work_order_id: '',
    work_order_number: '',
    customer_name: '',
    work_order_date: '',
    expiry_date: '',
    status: '',
    grand_total: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchWorkOrder = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`http://localhost:5000/api/work-orders/${id}`);
        if (!res.data) {
          throw new Error('No data returned from server');
        }
        const wo = res.data.workorder || res.data;
        setFormData({
          work_order_id: wo.work_order_id || '',
          work_order_number: wo.work_order_number || '',
          customer_name: wo.customer_name || '',
          work_order_date: wo.work_order_date ? new Date(wo.work_order_date).toISOString().split('T')[0] : '',
          expiry_date: wo.expiry_date ? new Date(wo.expiry_date).toISOString().split('T')[0] : '',
          status: wo.status || '',
          grand_total: wo.grand_total || '',
        });
      } catch (err) {
        setError(`Failed to fetch work order: ${err.message}`);
        console.error('Error fetching work order:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkOrder();
  }, [id]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/customers');
        console.log("📦 Customers from backend:", res.data);
        setCustomers(Array.isArray(res.data) ? res.data : res.data.data || []);
      } catch (err) {
        console.error('Error fetching customers:', err);
        setError(`Failed to fetch customers: ${err.message}`);
        setCustomers([]);
      }
    };
    fetchCustomers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.put(`http://localhost:5000/api/work-orders/${id}`, {
        customer_name: formData.customer_name,
        work_order_number: formData.work_order_number,
        work_order_date: formData.work_order_date,
        expiry_date: formData.expiry_date,
        status: formData.status,
        grand_total: formData.grand_total,
      });
      alert('Work order updated successfully!');
      navigate('/Work-Order-List');
    } catch (err) {
      setError(`Failed to update work order: ${err.message}`);
      console.error('Error updating work order:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Loading work order...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">{error}</Typography>
        <Button onClick={() => window.location.reload()} variant="contained" sx={{ mt: 2 }}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <Paper sx={{ width: 600, p: 4, borderRadius: 3 }}>
          <Typography variant="h5" fontWeight={600} mb={3} textAlign="center">
            Edit Work Order
          </Typography>
          {error && (
            <Typography color="error" mb={2} textAlign="center">
              {error}
            </Typography>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              name="work_order_id"
              label="Work Order ID"
              value={formData.work_order_id}
              onChange={handleChange}
              margin="normal"
              disabled
            />
            <TextField
              fullWidth
              name="work_order_number"
              label="Work Order #"
              value={formData.work_order_number}
              onChange={handleChange}
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
                required
              >
                <MenuItem value="">Select Customer</MenuItem>
                {customers.map(customer => (
                  <MenuItem key={customer.customer_id || customer.id} value={customer.customer_name || customer.name}>
                    {customer.customer_name || customer.name}
                  </MenuItem>
                ))}
                {formData.customer_name && !customers.some(c => (c.customer_name || c.name) === formData.customer_name) && (
                  <MenuItem value={formData.customer_name}>{formData.customer_name}</MenuItem>
                )}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              name="work_order_date"
              label="Created Date"
              type="date"
              value={formData.work_order_date}
              onChange={handleChange}
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              fullWidth
              name="expiry_date"
              label="Expiry Date"
              type="date"
              value={formData.expiry_date}
              onChange={handleChange}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status || ''}
                label="Status"
                onChange={handleChange}
                required
              >
                <MenuItem value="">Select Status</MenuItem>
                {['Draft', 'In Progress', 'Completed', 'Cancelled'].map(status => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              name="grand_total"
              label="Amount"
              value={formData.grand_total}
              onChange={handleChange}
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
  );
}