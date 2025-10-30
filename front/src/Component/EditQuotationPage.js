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
import UserMenu from './UserMenu';

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
    subject: '',
    customer_notes: '',
    terms_and_conditions: '',
    freight: 0,
    attachment_url: ''
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
          subject: q.subject || '',
          customer_notes: q.customer_notes || '',
          terms_and_conditions: q.terms_and_conditions || '',
          freight: q.freight || 0,
          attachment_url: q.attachment_url || ''
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
        quotation: {
          customer_name: formData.customer_name,
          quotation_date: formData.quotation_date,
          expiry_date: formData.expiry_date,
          status: formData.status,
          subject: formData.subject || '',
          customer_notes: formData.customer_notes || '',
          terms_and_conditions: formData.terms_and_conditions || '',
          freight: formData.freight || 0,
          attachment_url: formData.attachment_url || ''
        },
        items: [] // For now, we'll handle basic quotation info only
      });
      alert('Quotation updated successfully!');
      navigate('/quotation-list');
    } catch (err) {
      setError('Failed to update quotation: ' + (err.response?.data?.error || err.message));
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
            Edit Quotation
          </Typography>
          <UserMenu />
        </Box>

        {/* Main Content */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3, p: 2 }}>
          <Paper sx={{ width: 800, p: 4, borderRadius: 3 }}>
          <Typography variant="h5" fontWeight={600} mb={3} textAlign="center">
            Edit Quotation
          </Typography>
          {error && (
            <Typography color="error" mb={2} textAlign="center">
              {error}
            </Typography>
          )}
          {loading && (
            <Typography color="primary" mb={2} textAlign="center">
              Loading...
            </Typography>
          )}
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
    </Box>
  );
}
