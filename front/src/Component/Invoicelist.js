import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Menu,
  MenuItem,
  Chip,
  Checkbox,
  Avatar,
  InputBase,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import PrintIcon from "@mui/icons-material/Print";
import EditIcon from "@mui/icons-material/Edit";
import ShareIcon from "@mui/icons-material/Share";
import EmailIcon from "@mui/icons-material/Email";
import Sidebar from "./Sidebar";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


const statusColor = {
  Paid: "success",
  Draft: "default",
  Partial: "info",
};

export default function Invoicelist() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuIndex, setMenuIndex] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("All Invoices");
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  React.useEffect(() => {
    setLoading(true);
    setError('');
    axios.get('http://localhost:5000/api/invoice')
      .then(res => setInvoices(res.data))
      .catch(() => setError('Failed to fetch invoices'))
      .finally(() => setLoading(false));
  }, []);

  const handleMenuOpen = (event, index) => {
    setAnchorEl(event.currentTarget);
    setMenuIndex(index);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuIndex(null);
  };

  const handleNewInvoice = () => navigate("/new-invoice");

  const handleEditInvoice = (id) => {
    navigate(`/edit-invoice/${id}`);
  };



const handleDownloadPdf = (invoice) => {
 const printWindow = window.open("", "_blank");
  printWindow.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Tax Invoice</title>
  <style>
    @page {
      size: A4 landscape; /* horizontal print */
      margin: 10mm;
    }
    body {
      font-family: Arial, sans-serif;
      font-size: 12px;
      color: #000;
    }
    .invoice-box {
      width: 98%;
      border: 1px solid #000;
      padding: 10px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    td, th {
      border: 1px solid #000;
      padding: 5px;
      vertical-align: top;
    }
    .logo {
    height: 270px;
    width: auto;
    object-fit: contain;
    margin-Top: -100px;
    margin-Bottom: -90px; 
    margin-Left: -60px;
    margin-Right: -70px;
    } 
    .no-border{
     height: -80px;
    }
    .no-border td {
      border: none;
    }
    .center {
      text-align: center;
    }
    .right {
      text-align: right;
    }
    .bold {
      font-weight: bold;
    }
    .small {
      font-size: 10px;
    }
  </style>
</head>
<body>
<div class="invoice-box">

  <!-- Header -->
  <table class="no-border">
    <tr>
      <td style="border:none;">
       <img src="/static/media/ui.405d9b691b910181ce2e.png" class="logo" alt="Logo" />
      </td>
      <td style="text-align:center; border:none;">
        <p class="bold">TAX INVOICE</p>
        <p class="small">[Section 31 of the CGST Act, 2017 read with Rule 1 of Revised Invoice Rules, 2017]</p>
      </td>
      <td style="border:none;">
        <table class="no-border">
          <tr><td class="bold">Invoice No.:</td><td>ME/2025-26/023</td></tr>
          <tr><td class="bold">Invoice Date:</td><td>11.05.2025</td></tr>
          <tr><td class="bold">Cust Order Date:</td><td>31.01.2025</td></tr>
          <tr><td class="bold">PO Number:</td><td>JUPL/2025/09</td></tr>
        </table>
      </td>
    </tr>
  </table>

  <!-- Supplier GST Info -->
  <table style="margin-top:10px;">
    <tr>
      <td>
        <p><span class="bold">GSTIN :</span> 27AKUPY6544R1ZM</p>
        <p><span class="bold">Name :</span> Meraki Expert</p>
        <p><span class="bold">PAN :</span> AKUPY6544R</p>
      </td>
    </tr>
  </table>

  <!-- Billed / Shipped -->
  <table style="margin-top:10px;">
    <tr>
      <th>Details of Receiver (Billed to)</th>
      <th>Details of Consignee (Shipped to)</th>
    </tr>
    <tr>
      <td>
        JUST UNIVERSAL PVT. LTD.<br>
        Kh. No. 101/1, 101/2, 102, Kapsi Budruk,<br>
        Tah. Kamptee, Nagpur - 441104.<br>
        Pin Code - 441104, Maharashtra<br>
        <b>State Code :</b> 27<br>
        <b>GSTIN :</b> 27AAFCJ1515K1ZL
      </td>
      <td>
        JUST UNIVERSAL PVT. LTD.<br>
        Kh. No. 101/1, 101/2, 102, Kapsi Budruk,<br>
        Tah. Kamptee, Nagpur - 441104.<br>
        Pin Code - 441104, Maharashtra<br>
        <b>State Code :</b> 27<br>
        <b>GSTIN :</b> 27AAFCJ1515K1ZL
      </td>
    </tr>
  </table>

  <!-- Items Table -->
  <table style="margin-top:10px;">
    <tr>
      <th>S.No.</th>
      <th>Description of Goods</th>
      <th>HSN / SAC</th>
      <th>QTY</th>
      <th>Unit</th>
      <th>Rate</th>
      <th>Total Value (Rs.)</th>
      <th>Disc.</th>
      <th>Taxable Value (Rs.)</th>
      <th>CGST</th>
      <th>SGST</th>
      <th>IGST</th>
      <th>Total</th>
    </tr>
    <tr>
      <td>1</td>
      <td>
        Supply of Kingspan Jindal Contineous Line, 50 mm THK PUR Wall Panel Both Side 0.5 mm PPGL - 300Mpa - SMP - AZ 150 GSM (RAL9002) Plain Lamination Density: 40 (+-2) Kg/cum. - Panel Cover Width:1000MM
      </td>
      <td>39259010</td>
      <td>680.250</td>
      <td>Sq.M</td>
      <td>1430.00</td>
      <td>9,72,757.50</td>
      <td>-</td>
      <td>9,72,757.50</td>
      <td>9%<br>87,548.18</td>
      <td>9%<br>87,548.18</td>
      <td>0%</td>
      <td>11,47,853.85</td>
    </tr>
  </table>

  <!-- Totals -->
  <table style="margin-top:10px;">
    <tr>
      <td class="right bold">Grand Total (Inclusive of GST)</td>
      <td class="bold">11,47,854</td>
    </tr>
    <tr>
      <td colspan="2">Invoice Value (In words): Eleven Lac Fourty Seven Thousand Eight Hundred and Fifty Four Rupees only</td>
    </tr>
  </table>

  <!-- Declaration -->
  <p class="bold" style="margin-top:20px;">Declaration :</p>
  <p class="small">
    Certified that the particulars given above are true and correct and the amount indicated represents the Price actually charged
    and that there is no flow of additional consideration directly or indirectly from the Receiver [Buyer].
  </p>

  <!-- Footer -->
  <table class="no-border" style="margin-top:20px;">
    <tr>
      <td style="border:none;"></td>
      <td style="border:none;" class="right">
        For MERAKI EXPERT<br><br><br>
        Authorized Signatory
      </td>
    </tr>
  </table>
</div>
</body>
</html>

`);
  printWindow.document.close();
  printWindow.print();
};



  const handlePrintInvoice = (invoice) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html><head><title>Print Invoice</title>
      <style>body{font-family:Arial;margin:40px;}h1{text-align:center;color:#003366;}p{font-size:16px;}</style>
      </head><body>
      <h1>Invoice Document</h1>
      <p><b>Invoice #:</b> ${invoice.id}</p>
      <p><b>Customer:</b> ${invoice.customer}</p>
      <p><b>Created Date:</b> ${invoice.createdDate}</p>
      <p><b>Due Date:</b> ${invoice.dueDate}</p>
      <p><b>Status:</b> ${invoice.status}</p>
      <p><b>Amount:</b> ${invoice.amount}</p>
      <p style="margin-top:40px;font-style:italic;text-align:center;">Generated by ERP Software</p>
      </body></html>`);
    printWindow.document.close();
    printWindow.print();
  };

  const handleSendEmail = (invoice) => {
    const subject = encodeURIComponent(`Invoice ${invoice.id}`);
    const body = encodeURIComponent(
      `Hi,\n\nHere are your invoice details:\nInvoice #: ${invoice.id}\nCustomer: ${invoice.customer}\nAmount: ${invoice.amount}\nDue Date: ${invoice.dueDate}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleShareLink = (invoice) => {
    navigator.clipboard.writeText(`https://dummy-invoice-link/${invoice.id}`);
    alert("Invoice link copied to clipboard!");
  };

  const filteredInvoices = invoices.filter((invoice) => {
    if (selectedFilter === "All Invoices") return true;
    if (selectedFilter === "Sent Invoices") return invoice.status === "Paid";
    if (selectedFilter === "Draft Invoices") return invoice.status === "Draft";
    if (selectedFilter === "Pro Forma Invoices") return invoice.status === "Partial";
    return true;
  }).filter(invoice =>
    !searchTerm ||
    invoice.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box sx={{ flex: 1, bgcolor: "#f9fafc", minHeight: "100vh" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, mt: 1, px: 3 }}>
          <Typography color="text.secondary" fontSize="20px">Invoice</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Paper elevation={0} sx={{
              display: "flex", alignItems: "center", px: 1.5, py: 0.5, borderRadius: "999px",
              border: "1px solid #e0e0e0", bgcolor: "#f9fafb", width: 240,
            }}>
              <SearchIcon sx={{ fontSize: 20, color: "#999" }} />
              <InputBase
                placeholder="Search anything here..."
                sx={{ ml: 1, fontSize: 14, flex: 1 }}
                inputProps={{ "aria-label": "search" }}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </Paper>
            <IconButton sx={{
              borderRadius: "12px", border: "1px solid #e0e0e0", bgcolor: "#f9fafb", p: 1,
            }}>
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
            <Box sx={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              px: 4, py: 2, borderBottom: "1px solid #e0e0e0",
            }}>
              <Typography variant="h6" fontWeight={600}>Invoice</Typography>
              <Button variant="contained" sx={{
                backgroundColor: "#004085", color: "#fff", fontWeight: 600,
                textTransform: "none", borderRadius: "10px", px: 2.5,
                "&:hover": { backgroundColor: "#003366" },
              }} onClick={handleNewInvoice}>+ New Invoice</Button>
            </Box>

            <Box sx={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              px: 3, py: 1.5, borderBottom: "1px solid #e0e0e0", borderRadius: 1, mb: 2,
            }}>
              <Box sx={{ display: "flex", gap: 1 }}>
                {["All Invoices", "Sent Invoices", "Draft Invoices", "Pro Forma Invoices"].map((label, i) => (
                  <Button
                    key={i}
                    onClick={() => setSelectedFilter(label)}
                    variant={selectedFilter === label ? "contained" : "outlined"}
                    sx={{
                      backgroundColor: selectedFilter === label ? "#004085" : "transparent",
                      borderColor: "#cfd8dc", color: selectedFilter === label ? "#fff" : "#333",
                      fontWeight: 500, textTransform: "none", borderRadius: "20px", px: 2, height: 36,
                      "&:hover": { backgroundColor: selectedFilter === label ? "#003366" : "#f5f5f5" },
                    }}
                  >
                    {label}
                  </Button>
                ))}
              </Box>

              <TextField
                size="small"
                placeholder="Search by invoice no, customer name..."
                InputProps={{
                  endAdornment: <InputAdornment position="end"><SearchIcon /></InputAdornment>,
                  sx: { bgcolor: "#f9f9f9", borderRadius: "20px", px: 1 },
                }}
                sx={{ width: 300 }}
              />
            </Box>

            <Paper sx={{ overflow: "auto" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox"><Checkbox /></TableCell>
                    <TableCell>Invoice#</TableCell>
                    <TableCell>Customer Name</TableCell>
                    <TableCell>Created Date</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Bill Amount</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredInvoices.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell padding="checkbox"><Checkbox /></TableCell>
                      <TableCell sx={{ color: "#0061F2", fontWeight: 500 }}>{row.invoice_number}</TableCell>
                      <TableCell>{row.customer_name}</TableCell>
                      <TableCell>{row.invoice_date}</TableCell>
                      <TableCell>{row.expiry_date}</TableCell>
                      <TableCell><Chip label={row.status} color={statusColor[row.status]} size="small" /></TableCell>
                      <TableCell>{row.grand_total ? `₹${row.grand_total}` : ''}</TableCell>
                      <TableCell align="center">
                        <IconButton onClick={(e) => handleMenuOpen(e, index)}><MoreVertIcon /></IconButton>
                        {menuIndex === index && (
                          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} PaperProps={{ sx: { width: 200 } }}>
                            <MenuItem onClick={() => handleEditInvoice(row.invoice_id)}><EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit</MenuItem>
                            <MenuItem onClick={() => handleDownloadPdf(row)}><PictureAsPdfIcon fontSize="small" sx={{ mr: 1 }} /> Download the PDF</MenuItem>
                            <MenuItem onClick={() => handlePrintInvoice(row)}><PrintIcon fontSize="small" sx={{ mr: 1 }} /> Print Invoice</MenuItem>
                            <MenuItem onClick={() => handleSendEmail(row)}><EmailIcon fontSize="small" sx={{ mr: 1 }} /> Send Email</MenuItem>
                            <MenuItem onClick={() => handleShareLink(row)}><ShareIcon fontSize="small" sx={{ mr: 1 }} /> Share Link</MenuItem>
                            <MenuItem onClick={async () => {
                              await axios.put(`http://localhost:5000/api/invoice/${row.invoice_id}`, { status: 'Paid' });
                              setInvoices(prev => prev.map(inv => inv.invoice_id === row.invoice_id ? { ...inv, status: 'Paid' } : inv));
                              handleMenuClose();
                            }}>Mark as Paid</MenuItem>
                            <MenuItem onClick={async () => {
                              await axios.put(`http://localhost:5000/api/invoice/${row.invoice_id}`, { status: 'Partial' });
                              setInvoices(prev => prev.map(inv => inv.invoice_id === row.invoice_id ? { ...inv, status: 'Partial' } : inv));
                              handleMenuClose();
                            }}>Mark as Partial</MenuItem>
                            <MenuItem onClick={async () => {
                              await axios.put(`http://localhost:5000/api/invoice/${row.invoice_id}`, { status: 'Draft' });
                              setInvoices(prev => prev.map(inv => inv.invoice_id === row.invoice_id ? { ...inv, status: 'Draft' } : inv));
                              handleMenuClose();
                            }}>Mark as Draft</MenuItem>
                          </Menu>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}