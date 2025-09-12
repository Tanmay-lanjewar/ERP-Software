import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, TextField, Button, Paper, Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material";


import MoreVertIcon from "@mui/icons-material/MoreVert";
import Sidebar from "./Sidebar";
import AddIcon from "@mui/icons-material/Add";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import jsPDF from "jspdf";
import axios from 'axios';

export default function EditQuotationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    quotation_id: '',
    customer_name: '',
    quotation_date: '',
    expiry_date: '',
    status: 'Draft',
    grand_total: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchQuotation = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`http://localhost:5000/api/quotation/${id}`);
        const q = res.data.quotation;
        setFormData({
          quotation_id: q.quotation_id,
          customer_name: q.customer_name,
          quotation_date: q.quotation_date,
          expiry_date: q.expiry_date,
          status: q.status || 'Draft',
          grand_total: res.data.grand_total || '',
        });
      } catch (err) {
        setError('Failed to fetch quotation');
      } finally {
        setLoading(false);
      }
    };
    fetchQuotation();
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
      await axios.put(`http://localhost:5000/api/quotation/${id}`, {
        customer_name: formData.customer_name,
        quotation_date: formData.quotation_date,
        expiry_date: formData.expiry_date,
        status: formData.status,
        // Add other fields if needed
      });
      alert('Quotation updated successfully!');
      navigate('/Quotation');
    } catch (err) {
      setError('Failed to update quotation');
    } finally {
      setLoading(false);
    }
  };


  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />

      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <Paper sx={{ width: 600, p: 4, borderRadius: 3 }}>
          <Typography variant="h5" fontWeight={600} mb={3} textAlign="center">
            Edit Quotation
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              name="quotation_id"
              label="Quotation #"
              value={formData.quotation_id}
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
              name="quotation_date"
              label="Created Date"
              value={formData.quotation_date}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              name="expiry_date"
              label="Expiry Date"
              value={formData.expiry_date}
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
                <MenuItem value="Sent">Sent</MenuItem>
                <MenuItem value="Draft">Draft</MenuItem>
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
              <Button variant="contained" type="submit">
                Save Changes
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Box>
  );
}
