import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, TextField, Button, Paper, Typography } from "@mui/material";


import MoreVertIcon from "@mui/icons-material/MoreVert";
import Sidebar from "./Sidebar";
import AddIcon from "@mui/icons-material/Add";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import jsPDF from "jspdf";

// Dummy data (same as your main page)
const sampleQuotations = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  quoteNumber: "QT-00001",
  customer: "Customer 1",
  createdDate: "30/06/2025",
  expiryDate: "30/08/2025",
  status: i % 3 === 0 ? "Sent" : "Draft",
  amount: "₹118.00",
}));

export default function EditQuotationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    quoteNumber: "",
    customer: "",
    createdDate: "",
    expiryDate: "",
    status: "",
    amount: "",
  });

  useEffect(() => {
    const quote = sampleQuotations.find((q) => q.id === Number(id));
    if (quote) setFormData(quote);
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Data:", formData);
    alert("Quotation updated successfully!");
    navigate("/Quotation"); // Redirect to the quotation list after saving
    
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
              name="quoteNumber"
              label="Quotation #"
              value={formData.quoteNumber}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              name="customer"
              label="Customer"
              value={formData.customer}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              name="createdDate"
              label="Created Date"
              value={formData.createdDate}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              name="expiryDate"
              label="Expiry Date"
              value={formData.expiryDate}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              name="status"
              label="Status"
              value={formData.status}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              name="amount"
              label="Amount"
              value={formData.amount}
              onChange={handleChange}
              margin="normal"
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
