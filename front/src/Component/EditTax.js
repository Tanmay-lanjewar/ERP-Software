import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, MenuItem, Button, IconButton, InputBase,
  Avatar, Paper
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const EditTax = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    tax_name: '',
    tax_rate: '',    tax_code: '',
    details: '',
    status: 'Active',
    effective_date: new Date()
  });

  useEffect(() => {
    axios.get(`http://localhost:5000/api/taxes/${id}`)
      .then((res) => {
        const tax = res.data;
        setForm({
          tax_name: tax.tax_name,
          tax_rate: tax.tax_rate,
          tax_code: tax.tax_code,
          details: tax.details,
          status: tax.status,
          effective_date: tax.effective_date ? new Date(tax.effective_date) : new Date()
        });
      })
      .catch((err) => {
        console.error("Error fetching tax:", err);
        alert("Failed to load tax details.");
      });
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/taxes/${id}`, {
        ...form,
        effective_date: form.effective_date.toISOString().split("T")[0]
      });
      alert("Tax updated successfully!");
      navigate('/tax');
    } catch (err) {
      console.error("Error updating tax:", err);
      alert("Update failed.");
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, bgcolor: '#F9FAFB', minHeight: '100vh' }}>
        {/* Header */}
        <Box
          sx={{
            height: 60,
            borderBottom: '1px solid #eee',
            display: 'flex',
            alignItems: 'center',
            px: 3,
            justifyContent: 'space-between',
            bgcolor: '#fff',
          }}
        >
          <Typography fontWeight="bold" fontSize={18}>
            Tax &nbsp;/&nbsp; <span style={{ fontWeight: 400 }}>Edit Tax</span>
          </Typography>

          <Box display="flex" alignItems="center" gap={2}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: '#F0F0F0',
                px: 2,
                py: 0.5,
                borderRadius: 5,
                minWidth: 250,
              }}
            >
              <SearchIcon fontSize="small" sx={{ color: '#555' }} />
              <InputBase
                placeholder="Search anything here..."
                sx={{ ml: 1, flex: 1, fontSize: 14 }}
              />
            </Box>

            <IconButton><NotificationsNoneIcon /></IconButton>

            <Box display="flex" alignItems="center" gap={1}>
              <Avatar src="https://i.pravatar.cc/40?img=1" />
              <Typography fontSize={14}>Admin name</Typography>
              <ArrowDropDownIcon />
            </Box>
          </Box>
        </Box>

        {/* Form */}
        <Box sx={{ px: 4, py: 4 }}>
          <Paper sx={{ p: 1, borderRadius: 2 }}>
            <Box sx={{ p: 3 }}>
              <Box
                sx={{
                  bgcolor: '#fff',
                  borderRadius: 3,
                  p: 4,
                }}
              >
                <Typography variant="h6" fontWeight="bold" mb={3}>
                  Edit Tax
                </Typography>

                <Box display="flex" gap={2} flexWrap="wrap">
                  <TextField
                    label="Tax Type"
                    name="tax_name"
                    value={form.tax_name}
                    onChange={handleChange}
                    fullWidth
                    sx={{ flex: 1, minWidth: 220 }}
                  />

                  <TextField
                    label="Rate (%)"
                    name="tax_rate"
                    value={form.tax_rate}
                    onChange={handleChange}
                    type="number"
                    fullWidth
                    sx={{ flex: 1, minWidth: 220 }}
                  />

                  <TextField
                    label="Label/Category"
                    name="tax_code"
                    value={form.tax_code}
                    onChange={handleChange}
                    fullWidth
                    sx={{ flex: 1, minWidth: 220 }}
                  />

                  <TextField
                    label="Status"
                    name="status"
                    select
                    value={form.status}
                    onChange={handleChange}
                    fullWidth
                    sx={{ flex: 1, minWidth: 220 }}
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                  </TextField>

                  <DatePicker
                    label="Effective Date"
                    value={form.effective_date}
                    onChange={(newValue) =>
                      setForm({ ...form, effective_date: newValue })
                    }
                    sx={{ flex: 1, minWidth: 220 }}
                  />
                </Box>

                <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/tax')}
                    sx={{ borderRadius: 2, textTransform: 'none' }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      borderRadius: 2,
                      backgroundColor: '#004085',
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: '#003060',
                      },
                    }}
                    onClick={handleUpdate}
                  >
                    Update
                  </Button>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default EditTax;
