import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tabs,
  Tab,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Pagination,
  Checkbox,
  TextField,
  Avatar,
  Paper,
  InputBase,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Sidebar from "./Sidebar";
import AddIcon from "@mui/icons-material/Add";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import jsPDF from "jspdf";


export default function QuotationListPage() {
  const navigator = useNavigate();
  const [tab, setTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedQuote, setSelectedQuote] = useState(null);

  
const handleDownloadPdf = () => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Quotation Document', 105, 20, null, null, 'center');

  // Add a horizontal line
  doc.setLineWidth(0.5);
  doc.line(20, 25, 190, 25);

  // Quotation Details
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');

  const details = [
    { label: 'Quotation #', value: selectedQuote?.quoteNumber },
    { label: 'Customer', value: selectedQuote?.customer },
    { label: 'Created Date', value: selectedQuote?.createdDate },
    { label: 'Expiry Date', value: selectedQuote?.expiryDate },
    { label: 'Status', value: selectedQuote?.status },
    { label: 'Amount', value: selectedQuote?.amount },
  ];

  let y = 40;
  details.forEach(({ label, value }) => {
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, 25, y);
    doc.setFont('helvetica', 'normal');
    doc.text(`${value}`, 70, y);
    y += 12;
  });

  // Footer note
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.text('Generated by ERP Software', 105, 280, null, null, 'center');

  doc.save(`${selectedQuote?.quoteNumber || 'quotation'}.pdf`);
};


const handlePrintQuotation = () => {
  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
    <html>
      <head>
        <title>Quotation Print</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 40px;
          }
          h1 {
            text-align: center;
            color: #003366;
          }
          .quotation-details {
            margin-top: 30px;
          }
          .quotation-details p {
            font-size: 16px;
            margin: 10px 0;
          }
          .label {
            font-weight: bold;
            color: #333;
          }
          .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <h1>Quotation Document</h1>
        <div class="quotation-details">
          <p><span class="label">Quotation #:</span> ${selectedQuote?.quoteNumber}</p>
          <p><span class="label">Customer:</span> ${selectedQuote?.customer}</p>
          <p><span class="label">Created Date:</span> ${selectedQuote?.createdDate}</p>
          <p><span class="label">Expiry Date:</span> ${selectedQuote?.expiryDate}</p>
          <p><span class="label">Status:</span> ${selectedQuote?.status}</p>
          <p><span class="label">Amount:</span> ${selectedQuote?.amount}</p>
        </div>
        <div class="footer">
          Generated by ERP Software
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
};

const sampleQuotations = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  quoteNumber: "QT-00001",
  customer: "Customer 1",
  createdDate: "30/06/2025",
  expiryDate: "30/08/2025",
  status: i % 3 === 0 ? "Sent" : "Draft",
  amount: "₹118.00",
}));

  const handleTabChange = (_, newVal) => setTab(newVal);

  const handleMenuClick = (event, quote) => {
    setAnchorEl(event.currentTarget);
    setSelectedQuote(quote);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedQuote(null);
  };

  const handleAddQuotation = () => {
    navigator("/add-Quotation");
  };

  const handleSendEmail = () => {
  const subject = encodeURIComponent(`Quotation ${selectedQuote?.quoteNumber}`);
  const body = encodeURIComponent(
    `Hello,\n\nPlease find the quotation details below:\n\n` +
    `Quotation #: ${selectedQuote?.quoteNumber}\n` +
    `Customer: ${selectedQuote?.customer}\n` +
    `Created Date: ${selectedQuote?.createdDate}\n` +
    `Expiry Date: ${selectedQuote?.expiryDate}\n` +
    `Status: ${selectedQuote?.status}\n` +
    `Amount: ${selectedQuote?.amount}\n\n` +
    `Thank you.`
  );
  
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
};


  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />

      <Box sx={{ flex: 1, bgcolor: "#f9fafc", minHeight: "100vh" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            mt: 1,
            px: 3,
          }}
        >
          <Typography color="text.secondary" fontSize="20px">
            Quatation
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Paper
              elevation={0}
              sx={{
                display: "flex",
                alignItems: "center",
                px: 1.5,
                py: 0.5,
                borderRadius: "999px",
                border: "1px solid #e0e0e0",
                bgcolor: "#f9fafb",
                width: 240,
              }}
            >
              <SearchIcon sx={{ fontSize: 20, color: "#999" }} />
              <InputBase
                placeholder="Search anything here..."
                sx={{ ml: 1, fontSize: 14, flex: 1 }}
                inputProps={{ "aria-label": "search" }}
              />
            </Paper>

            <IconButton
              sx={{
                borderRadius: "12px",
                border: "1px solid #e0e0e0",
                bgcolor: "#f9fafb",
                p: 1,
              }}
            >
              <NotificationsNoneIcon sx={{ fontSize: 20, color: "#666" }} />
            </IconButton>
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar src="https://i.pravatar.cc/150?img=1" />
              <Typography fontSize={14}>Admin name</Typography>
              <ArrowDropDownIcon />
            </Box>
          </Box>
        </Box>
        <Box sx={{ px: 2, py: 2 }}>
          <Paper sx={{ p: 1, borderRadius: 2 }}>
            <Box
              sx={{
                display: "flex",
                px: 4,
                py: 2,
                justifyContent: "space-between",
                borderBottom: "1px solid #e0e0e0",
              }}
            >
              <Typography variant="h6" fontWeight={600}>
                Products & Services
              </Typography>
              <Button
                sx={{ backgroundColor: "#003366" }}
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddQuotation}
              >
                New Quotation
              </Button>
            </Box>
            <Box py={3} px={4} flex={1}>
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Tabs
                  value={tab}
                  onChange={handleTabChange}
                  sx={{
                    "& .MuiTab-root": {
                      textTransform: "none",
                      bgcolor: "#f1f1f1",
                      borderRadius: 2,
                      mr: 1,
                      textDecoration: "none",
                    },
                    "& .Mui-selected": {
                      bgcolor: "#004085",
                      color: "white !important",
                      textDecoration: "none",
                    },
                    "& .MuiTabs-indicator": {
                      display: "none",
                    },
                  }}
                >
                  <Tab label="All Quotation" />
                  <Tab label="Sent Quotation" />
                  <Tab label="Draft Quotation" />
                </Tabs>
                <Box mb={2} maxWidth={350}>
                  <TextField
                    fullWidth
                    placeholder="Search by quotation no, customer name..."
                    size="small"
                  />
                </Box>
              </Grid>

              <Table sx={{ bgcolor: "#fff", borderRadius: 2 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f5f6fa" }}>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>Quotation#</TableCell>
                    <TableCell>Customer Name</TableCell>
                    <TableCell>Created Date</TableCell>
                    <TableCell>Expiry Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Bill Amount</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sampleQuotations
                    .filter((q) => {
                      if (tab === 1) return q.status === "Sent";
                      if (tab === 2) return q.status === "Draft";
                      return true; // tab === 0 => All
                    })
                    .map((q) => (
                      <TableRow key={q.id} hover>
                        <TableCell>
                          <Checkbox />
                        </TableCell>
                        <TableCell sx={{ color: "#007bff", fontWeight: 500 }}>
                          {q.quoteNumber}
                        </TableCell>
                        <TableCell>{q.customer}</TableCell>
                        <TableCell>{q.createdDate}</TableCell>
                        <TableCell>{q.expiryDate}</TableCell>
                        <TableCell>
                          <Chip
                            label={q.status}
                            size="small"
                            color={q.status === "Sent" ? "success" : "default"}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>{q.amount}</TableCell>
                        <TableCell align="center">
                          <IconButton onClick={(e) => handleMenuClick(e, q)}>
                            <MoreVertIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>

              <Box mt={3} display="flex" justifyContent="space-between">
                <Typography variant="body2">
                  Showing 1 to 15 of 100 entries
                </Typography>
                <Box display="flex" justifyContent="space-between">
                  <Pagination
                    count={5}
                    page={1}
                    sx={{
                      "& .MuiPaginationItem-root": {
                        color: "grey",
                        borderColor: "#004085",
                      },
                      "& .Mui-selected": {
                        backgroundColor: "#004085",
                        color: "#fff",
                        "&:hover": {
                          backgroundColor: "#003366",
                        },
                      },
                    }}
                  />
                </Box>
              </Box>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
              >
                <MenuItem
                  onClick={() => {
                    navigator(`/editQuotation/${selectedQuote?.id}`);
                    handleCloseMenu();
                  }}
                >Edit</MenuItem>
                <MenuItem
                  onClick={() => {
                    handleDownloadPdf();
                    handleCloseMenu();
                  }}
                >
                  Download the PDF
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handlePrintQuotation();
                    handleCloseMenu();
                  }}
                >
                  Print Quotation
                </MenuItem>
                <MenuItem onClick={() => { handleSendEmail(); handleCloseMenu(); }}>Send Email</MenuItem>

                {/* <MenuItem>Share Link</MenuItem> */}
              </Menu>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
