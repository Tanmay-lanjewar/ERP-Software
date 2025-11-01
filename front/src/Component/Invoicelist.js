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
import ui from "../assets/mera.png"
import ne from "../assets/new.png"
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
    axios.get('http://168.231.102.6:5000/api/invoice')
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

 

  const handlePrintInvoice = (invoice) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TAX INVOICE Exact Replica</title>
    <style>
        /* ========================================================================= */
        /* BASE LAYOUT - A4 LANDSCAPE SIMULATION (Approx. 1122px x 794px at 96 DPI) */
        /* ========================================================================= */
         @page {
  size: 310mm 230mm;   /* width x height */
  margin: 8mm;
}

        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f0f0f0;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            padding-top: 10px;
        }

        .invoice-container {
            /* A4 Landscape dimensions at typical screen resolution (96dpi) */
            width: 1122px; /* ~29.7 cm */
            height: 794px;  /* ~21.0 cm */
            background-color: #fff;
            padding: 15px;
            box-sizing: border-box;
            /* REMOVED: Outer border around the whole page */
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.2); 
            font-size: 10pt;
            position: relative;
        }

        /* Utility Classes */
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .font-7pt { font-size: 7pt; }
        .font-8pt { font-size: 8pt; }
        .font-9pt { font-size: 9pt; }
        .font-bold { font-weight: bold; }
        .border-1px { border: 1px solid #000; }
        .clearfix::after {
            content: "";
            display: table;
            clear: both;
        }

        /* ========================================================================= */
        /* HEADER SECTION */
        /* ========================================================================= */
        .header-section {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 5px;
        }
        .header-logo {
            width: 300px;
            height: 30px;
            display: flex;
            align-items: center;
            font-size: 14pt;
            font-weight: bold;
            color: #041E42;
        }
        .header-logo span {
             font-size: 8pt;
             font-weight: normal;
             margin-left: 5px;
             color: #9C1F37;
        }
        .header-title {
            text-align: center;
            flex-grow: 1;
            padding-top: 5px;
        }
        .header-title h4 {
            margin: 0;
            font-size: 11pt;
            letter-spacing: 0.5px;
            font-weight: 900;
        }
        .header-title small {
            display: block;
            font-size: 8pt;
            margin-top: 2px;
            line-height: 1.3;
        }
        .header-original {
            font-size: 9pt;
            font-weight: bold;
            width: 150px;
            text-align: right;
            padding-top: 10px;
        }
        
        /* ========================================================================= */
        /* TOP DETAIL BOXES (GSTIN, Invoice No.) */
        /* ========================================================================= */
        .top-details-box {
            display: flex;
            border: 1px solid #040000ff;
            line-height: 1.3;
            margin-bottom: -1px;
            font-size: 9pt;
        }
        .top-details-col {
            width: 50%;
            border-right: 1px solid #ffffffff;
            box-sizing: border-box;
            padding: 0 5px;
        }
        .top-details-col:last-child {
            border-right: none;
        }
        .detail-row {
            display: flex;
            border-bottom: 1px solid #ffffffff;
            padding: 1px 0;
        }
        /* REMOVED: border-bottom on the last row of the first column (where UDYAM text sits) */
        .detail-label {
            width: 80px; 
            font-weight: bold;
        }
        .detail-value {
            flex-grow: 1;
        }
        .detail-small-text {
            font-size: 7pt;
            padding-left: 80px; 
            display: block;
        }

        /* ========================================================================= */
        /* CONSIGNEE/BILLED TO SECTION */
        /* ========================================================================= */
        .consignee-section {
            display: flex;
            border: 1px solid #000;
            border-top: none;
            margin-bottom: -1px;
        }
        .consignee-col {
            width: 50%;
            border-right: 1px solid #000;
            min-height: 110px;
            padding: 5px;
            box-sizing: border-box;
        }
        .consignee-col:last-child {
            border-right: none;
        }
        .consignee-col p {
            margin: 0 0 2px 0;
            font-size: 9pt;
            line-height: 1.3;
        }
        .consignee-col .title {
            font-weight: bold;
            margin-bottom: 5px;
        }

        /* ========================================================================= */
        /* STATE/GSTIN ROW & PLACE OF SUPPLY */
        /* ========================================================================= */
        .state-gstin-row {
            display: flex;
            border: 1px solid #000;
            border-top: none;
            margin-bottom: -1px;
        }
        .state-gstin-col {
            width: 25%;
            border-right: 1px solid #000;
            padding: 5px;
            box-sizing: border-box;
            font-size: 9pt;
        }
        .state-gstin-col:last-child {
            border-right: none;
        }
        .state-gstin-col p {
            margin: 0;
            line-height: 1.3;
        }
        .state-gstin-col .col-header {
            text-decoration: underline;
            margin-bottom: 2px;
        }
        .place-of-supply {
            border: 1px solid #000;
            border-top: none;
            padding: 2px 5px 5px;
            font-size: 9pt;
            margin-bottom: 5px;
        }
        
        /* ========================================================================= */
        /* ITEMS TABLE */
        /* ========================================================================= */
        .items-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 8pt;
            table-layout: fixed;
        }
        .items-table th, .items-table td {
            border: 1px solid #000;
            padding: 3px 5px;
            text-align: left;
            vertical-align: top;
            height: 18px;
            line-height: 1.2;
        }
        .items-table th {
            text-align: center;
            font-weight: bold;
            background-color: #f7f7f7;
            padding: 4px;
        }
        /* Column Widths (Tuned) */
        .items-table .col-sno { width: 3%; }
        .items-table .col-desc { width: 18%; }
        .items-table .col-hsn { width: 5%; }
        .items-table .col-qty { width: 4%; }
        .items-table .col-unit { width: 3%; }
        .items-table .col-rate { width: 4.3%; }
        .items-table .col-total-value { width: 6%; }
        .items-table .col-disc { width: 4%; }
        .items-table .col-taxable-value { width: 6%; }
        .items-table .col-tax-rate { width: 3.5%; }
        .items-table .col-tax-rs { width: 6%; }
        .items-table .col-igst-rs { width: 5.5%; }
        .items-table .col-total-rs { width: 6.5%; }

        .items-table .item-description {
            font-size: 7.5pt;
        }
        /* Footer Rows */
        .total-row td {
            font-weight: bold;
            background-color: #fcfcfc;
            padding: 5px;
        }
        .total-row .col-label {
            text-align: right;
            border-right: none;
        }
        .empty-space-row {
            height: 30px;
        }

        /* ========================================================================= */
        /* BOTTOM SECTIONS */
        /* ========================================================================= */
        .value-in-words-row, .reverse-charge-row {
            border: 1px solid #000;
            border-top: none;
            padding: 5px;
            font-weight: bold;
            font-size: 9pt;
        }
        .declaration-section {
            position: absolute;
            bottom: 15px;
            left: 15px;
            right: 15px;
            border: 1px solid #000;
            padding: 5px;
            font-size: 9pt;
            height: 120px;
        }
        .declaration-section h5 {
            margin: 0 0 5px 0;
            font-weight: bold;
            font-size: 10pt;
            border-bottom: 1px solid #000;
            padding-bottom: 2px;
        }
        .declaration-text {
            width: 60%;
            float: left;
            line-height: 1.4;
        }
        .signature-box {
            width: 38%;
            float: right;
            text-align: center;
            border-left: 1px solid #000;
            padding-left: 10px;
            box-sizing: border-box;
            height: 90px;
        }
        /* Refined signature line: uses margin-top to create the space, and border-top on the text */
        .signature-box .auth-sign {
            font-weight: bold;
            border-top: 1px solid #000;
            padding-top: 2px;
            display: block;
            margin-top: 55px; /* Pushes text down to create signature space above the line */
        }
        .reg-address {
            position: absolute;
            bottom: 5px;
            left: 5px;
            right: 5px;
            font-size: 7pt;
            text-align: center;
            border-top: 1px solid #000;
            padding-top: 2px;
        }
    </style>
</head>
<body>

<div class="invoice-container">
    <div class="header-section">
        <div class="header-logo">
                                <img src= "${ui}" style="width: 250px; height: auto; margin-top: -70px; margin-bottom: -70px;" alt="Logo" />

        </div>
        <div class="header-title">
            <h4>TAX INVOICE</h4>
            <small>for Supply of Goods/Services</small>
            <small class="font-bold">[Section 31 of the CGST Act, 2017 read with Rule 1 of Revised Invoice Rules, 2017]</small>
        </div>
        <div class="header-original">
            Original for Recipient
        </div>
    </div>

    <div class="top-details-box">
        <div class="top-details-col">
            <div class="detail-row">
               <span class="detail-label font-bold">GSTIN</span><span class="detail-value">:<b> 27AKUPY6544R1ZM</b></span>
            </div>
            <div class="detail-row">
                <span class="detail-label font-bold">Name</span><span class="detail-value">:<b> Meraki Expert</b></span>
            </div>
            <div class="detail-row" style="border-bottom: none; padding-bottom: 0;">
               <span class="detail-label font-bold">PAN</span><span class="detail-value">:<b> AKUPY6544R </b></span>
            </div>
            <span class="detail-small-text font-7pt" style="margin-bottom: 2px; margin-right: 10px;">UDYAM-MH-20-0114278</span>
        </div>
        <div class="top-details-col">
            <div class="detail-row">
                <span class="detail-label font-bold">Invoice No.</span><span class="detail-value">:<b> ΜΕ/2025-26/023</b></span>
            </div>
            <div class="detail-row">
                <span class="detail-label font-bold">Invoice Date</span><span class="detail-value">:<b> 11.05.2025</b></span>
            </div>
            <div class="detail-row">
                <span class="detail-label font-bold">Cust Order Date</span><span class="detail-value">: 31.01.2025</span>
            </div>
            <div class="detail-row" style="border-bottom: none;">
                <span class="detail-label font-bold">PO Number</span><span class="detail-value">: JUPL/2025/09</span>
            </div>
        </div>
    </div>

    <div class="consignee-section">
        <div class="consignee-col">
            <p class="title font-bold">Details of Receiver (Billed to)</p>
            <p><strong>Name</strong> : <b>JUST UNIVERSAL PVT. LTD.</b></p>
            <p><strong>Address</strong> : Kh. No. 101/1, 101/2, 102, Kapsi Budruk, Tah. Kamptee, Nagpur - 441104. Pin Code-441104, Maharashtra</p>
            <p><strong>State Code</strong> : <b> 27</b></p>
            <p><strong>GSTIN</strong> : <b>  27AAFCJ1515K1ZL</b></p>
        </div>
        <div class="consignee-col">
            <p class="title font-bold">Details of Consignee (Shipped to)</p>
            <p><strong>Name</strong> : <b>JUST UNIVERSAL PVT. LTD.</b></p>
            <p><strong>Address</strong> : Kh. No. 101/1, 101/2, 102, Kapsi Budruk, Tah. Kamptee, Nagpur-441104. Pin Code-441104, Maharashtra</p>
            <p><strong>State Code</strong> : <b> 27</b></p>
            <p><strong>GSTIN</strong> : <b>  27AAFCJ1515K1ZL</b></p>
        </div>
    </div>

    <div class="state-gstin-row">
        
    </div>
    <div class="place-of-supply border-1px" style="border-top: none; margin-top: -1px;">
        <p style="margin: 0;"><strong>Place of Supply/Service</strong>: Maharashtra</p>
    </div>

    <table class="items-table">
        <thead>
            <tr class="tax-header-row">
                <th class="col-sno" rowspan="2">S.No.</th>
                <th class="col-desc" rowspan="2">Description of Goods</th>
                <th class="col-hsn" rowspan="2">HSN/SAC</th>
                <th class="col-qty" rowspan="2">QTY</th>
                <th class="col-unit" rowspan="2">Unit</th>
                <th class="col-rate" rowspan="2">Rate</th>
                <th class="col-total-value" rowspan="2">Total Value (Rs).</th>
                <th class="col-disc" rowspan="2">Disc.</th>
                <th class="col-taxable-value" rowspan="2">Taxable Value (Rs).</th>
                <th colspan="2">CGST</th>
                <th colspan="2">SGST</th>
                <th colspan="2">IGST</th>
                <th class="col-total-rs" rowspan="2">Total Rs</th>
            </tr>
            <tr class="tax-sub-header-row">
                <th class="col-tax-rate">Rate (%)</th>
                <th class="col-tax-rs">Rs</th>
                <th class="col-tax-rate">Rate (%)</th>
                <th class="col-tax-rs">Rs</th>
                <th class="col-tax-rate">Rate (%)</th>
                <th class="col-tax-rs">Rs</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="col-sno text-center">1</td>
                <td class="col-desc item-description">
                    Supply of Kingspan Jindal Contineous Line, 50 mm THK PUR Wall Panel Both Side 0.5 mm PPGL-300Mpa SMP-AZ 150 GSM (RAL9002) Plain Lamination - Density: 40 (+-2) Kg/cum. Panel Cover Width:1000MM
                </td>
                <td class="col-hsn text-center">39259010</td>
                <td class="col-qty text-right">680.250</td>
                <td class="col-unit text-center">Sq.M</td>
                <td class="col-rate text-right">1430.00</td>
                <td class="col-total-value text-right">9,72,757.50</td>
                <td class="col-disc text-center">-</td>
                <td class="col-taxable-value text-right">9,72,757.500.</td>
                <td class="col-tax-rate text-right">9%</td>
                <td class="col-tax-rs text-right">87,548.18</td>
                <td class="col-tax-rate text-right">9%</td>
                <td class="col-tax-rs text-right">87,548.18</td>
                <td class="col-tax-rate text-right">0%</td>
                <td class="col-igst-rs text-right">0</td>
                <td class="col-total-rs text-right">11,47,853.85</td>
            </tr>
            <tr class="empty-space-row">
                <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
            </tr>
            <tr class="total-row">
                <td colspan="8" class="col-label"></td>
                <td class="col-taxable-value text-right">9,72,757.50</td>
                <td class="col-tax-rate"></td>
                <td class="col-tax-rs text-right">87,548.18</td>
                <td class="col-tax-rate"></td>
                <td class="col-tax-rs text-right">87,548.18</td>
                <td class="col-tax-rate"></td>
                <td class="col-igst-rs text-right">0.00</td>
                <td class="col-total-rs text-right">11,47,853.85</td>
            </tr>
            <tr class="total-row">
                <td colspan="8" class="col-label" style="border-right: 1px solid #000;">Add: Freight</td>
                <td class="col-taxable-value text-right">${(invoice.freight || 0).toFixed(2)}</td>
                <td class="col-tax-rate"></td>
                <td class="col-tax-rs text-right">0.00</td>
                <td class="col-tax-rate"></td>
                <td class="col-tax-rs text-right">0.00</td>
                <td class="col-tax-rate"></td>
                <td class="col-igst-rs text-right">0.00</td>
                <td class="col-total-rs text-right">${(invoice.freight || 0).toFixed(2)}</td>
            </tr>
            <tr class="total-row">
                <td colspan="8" class="col-label" style="border-right: 1px solid #000;">Sub Total</td>
                <td class="col-taxable-value text-right"><b>9,72,757.50</b></td>
                <td class="col-tax-rate"></td>
                <td class="col-tax-rs text-right">87,548.18</td>
                <td class="col-tax-rate"></td>
                <td class="col-tax-rs text-right">87,548.18</td>
                <td class="col-tax-rate"></td>
                <td class="col-igst-rs text-right"><b>0.00</b></td>
                <td class="col-total-rs text-right">11,47,853.85</td>
            </tr>
            <tr class="total-row">
                <td colspan="15" class="col-label" style="text-align: right; border-right: 1px solid #000;"><b>Grand Total (Inclusive of GST)</b></td>
                <td class="col-total-rs text-right">11,47,854</td>
            </tr>
        </tbody>
    </table>

    <div class="value-in-words-row" style="margin-top: 5px;">
        <p style="margin: 0;"><strong>Invoice Value (In words):</strong> Eleven Lac Fourty Seven Thausand Eight Hundred and Fifty Four Rupees only</p>
    </div>

    <div class="reverse-charge-row">
        <p style="margin: 0; display: inline-block;"><strong>Whether Tax is payable on Reverse Charge</strong> :</p>
        <p style="margin: 0; display: inline-block; float: right; padding-right: 5px;">No</p>
    </div>

    <div class="declaration-section clearfix">
        <h5>Declaration :</h5>
        <div class="declaration-text">
            <p style="margin: 0; font-size: 8.5pt; line-height: 1.4;">Certified that the particulars given above are true and correct and the amount indicated represents represents the Price actually charged and that there is no flow of additional consideration directly or indirectly from the Receiver [Buyer].</p>
        </div>
        <div class="signature-box">
            <p class="font-8pt text-right" style="margin: 0; padding-right: 10px;">For MERAKI EXPERT</p>
            <span class="auth-sign">Authorized Signatory</span>
        </div>
        
        <div class="reg-address">
            Registered Address: Prabhag No. 5, Ganesh Chowk, Deori, Dist.-Gondia. 441901 | www.merrakiexpert.in | P: 7722001802; 9130801011
        </div>
    </div>

</div>

</body>
</html>`);
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
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
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
                            <MenuItem onClick={() => handleDownloadPdf(row)}><PrintIcon fontSize="small" sx={{ mr: 1 }} /> Print Invoice</MenuItem>
                            <MenuItem onClick={() => handleSendEmail(row)}><EmailIcon fontSize="small" sx={{ mr: 1 }} /> Send Email</MenuItem>
                            <MenuItem onClick={() => handleShareLink(row)}><ShareIcon fontSize="small" sx={{ mr: 1 }} /> Share Link</MenuItem>
                            <MenuItem onClick={async () => {
                              try {
                                await axios.patch(`http://168.231.102.6:5000/api/invoice/${row.invoice_id}/status`, { status: 'Paid' });
                                setInvoices(prev => prev.map(inv => inv.invoice_id === row.invoice_id ? { ...inv, status: 'Paid' } : inv));
                                handleMenuClose();
                              } catch (error) {
                                console.error('Error updating status:', error);
                                alert('Failed to update invoice status');
                              }
                            }}>Mark as Paid</MenuItem>
                            <MenuItem onClick={async () => {
                              try {
                                await axios.patch(`http://168.231.102.6:5000/api/invoice/${row.invoice_id}/status`, { status: 'Partial' });
                                setInvoices(prev => prev.map(inv => inv.invoice_id === row.invoice_id ? { ...inv, status: 'Partial' } : inv));
                                handleMenuClose();
                              } catch (error) {
                                console.error('Error updating status:', error);
                                alert('Failed to update invoice status');
                              }
                            }}>Mark as Partial</MenuItem>
                            <MenuItem onClick={async () => {
                              try {
                                await axios.patch(`http://168.231.102.6:5000/api/invoice/${row.invoice_id}/status`, { status: 'Draft' });
                                setInvoices(prev => prev.map(inv => inv.invoice_id === row.invoice_id ? { ...inv, status: 'Draft' } : inv));
                                handleMenuClose();
                              } catch (error) {
                                console.error('Error updating status:', error);
                                alert('Failed to update invoice status');
                              }
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
