import { useEffect, useState } from 'react';
import {
  Box, Button, Typography, TextField, IconButton, InputAdornment, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Menu, MenuItem, Checkbox, Avatar, InputBase, Tabs, Tab, Breadcrumbs
} from '@mui/material';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; // Changed import to named import for reliability
import { useNavigate } from 'react-router-dom';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import Sidebar from './Sidebar';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import axios from 'axios';

const PurchaseOrderActions = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuIndex, setMenuIndex] = useState(null);
  const [tab, setTab] = useState(0);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/purchase')
      .then(res => {
        const grouped = {};
        res.data.forEach(row => {
          if (!grouped[row.purchase_order_no]) {
            grouped[row.purchase_order_no] = row;
          }
        });
        setRows(Object.values(grouped));
      })
      .catch(error => {
        console.error('Failed to fetch purchase orders:', error);
        setRows([]);
      });
  }, []);

  const filteredRows = rows.filter(row => {
    if (tab === 0) return true;
    if (tab === 1) return row.status === 'Sent';
    if (tab === 2) return row.status === 'Draft';
    return true;
  });

  const handleMenuOpen = (event, index) => {
    setAnchorEl(event.currentTarget);
    setMenuIndex(index);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuIndex(null);
  };

  const handleEditPurchase = (id) => {
    navigate(`/edit-purchase/${id}`);
  };
 

  const handleDownloadPdf = (order) => {
    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text("Purchase Order Document", 105, 20, null, null, "center");
      doc.line(20, 25, 190, 25);
      let y = 40;
      const details = [
        ['Order #', order.orderNo],
        ['Vendor', order.vendor],
        ['Created Date', order.created],
        ['Delivery Date', order.delivery],
        ['Status', order.status],
        ['Amount', order.amount]
      ];
      details.forEach(([label, value]) => {
        doc.setFont("helvetica", "bold");
        doc.text(`${label}:`, 25, y);
        doc.setFont("helvetica", "normal");
        doc.text(`${value}`, 70, y);
        y += 12;
      });
      doc.save(`${order.orderNo}.pdf`);
    });
  };

const handlePrintOrder = (order) => {
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>Print Purchase Order</title>
        <style>
          body {
            font-family: Helvetica, Arial, sans-serif;
            margin: 20px;
            font-size: 10pt;
            color: #000;
            width: 595px; /* A4 width in points */
            height: 842px; /* A4 height in points */
            box-sizing: border-box;
          }
          .container {
            width: 100%;
            max-width: 555px; /* 595px - 20px left margin - 20px right margin */
            margin: 0 auto;
          }
          .logo {
            text-align: center;
            margin-bottom: 10px;
          }
          h1 {
            text-align: center;
            font-size: 18pt;
            font-weight: bold;
            margin: 0 0 5px 0;
          }
          hr {
            border: 0.5px solid black;
            margin: 5px 0;
          }
          .row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
          }
          .col-left {
            width: 48%;
          }
          .col-right {
            width: 48%;
            text-align: right;
          }
          .bold {
            font-weight: bold;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
            font-size: 9pt;
          }
          th, td {
            border: 1px solid #000; /* Explicit borders on all sides for every cell */
            padding: 5px;
            text-align: left;
          }
          th {
            background-color: #004085;
            color: white;
            font-weight: bold;
          }
          .totals {
            text-align: right;
            margin-top: 10px;
            font-size: 10pt;
          }
          .totals p {
            margin: 2px 0;
          }
          .amount-words {
            margin: 10px 0;
            font-size: 10pt;
          }
          .terms {
            margin-top: 15px;
            font-size: 10pt;
          }
          .terms p {
            margin: 2px 0;
          }
          .signatory {
            margin-top: 15px;
            font-weight: bold;
            font-size: 10pt;
          }
          .footer {
            margin-top: 15px;
            font-style: italic;
            font-size: 10pt;
          }
          .footer p {
            margin: 2px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Logo -->
          <div class="logo">
            <img src="https://via.placeholder.com/100x50?text=Logo" alt="Company Logo" style="width: 100px; height: 50px;" />
          </div>

          <!-- Header -->
          <h1>Purchase Order</h1>
          <hr>

          <!-- Company and PO Details -->
          <div class="row">
            <div class="col-left">
              <p class="bold">Wellworth International</p>
              <p>GSTIN: 27AKUPY6544R1ZM ; UDYAM-MH-20-0114278</p>
              <p>Shop no 7, Sukhada Apartments, Temple Bazar,</p>
              <p>Pinjari, Gali, Sitabuldi, Nagpur</p>
            </div>
            <div class="col-right">
              <p><span class="bold">PO No:</span> ${order.purchase_order_no || 'PO/10/2025-26/WWI'}</p>
              <p><span class="bold">Date:</span> ${order.purchase_order_date ? order.purchase_order_date.slice(0, 10) : '13/08/2025'}</p>
              <p><span class="bold">OS ID:</span> ${order.os_id || 'N/A'}</p>
            </div>
          </div>

          <!-- Vendor, Billing, Shipping -->
          <div class="row">
            <div class="col-left">
              <p class="bold">Vendor:</p>
              <p>${order.vendor_name || 'Meraki Expert'}</p>
              <p>GSTIN: 27AANPJ3194R1ZT</p>
              <p>Address:</p>
              <p>101, 2nd Floor, Shri Sai Appartment, Near Kachore Lawn, Nagpur - 440015</p>
              <p>Kind Attn.: Mr. Kishor Choudhari</p>
              <p>Mobile No.: 7338729293</p>
              <p>Email: kishor.choudhari@bossproducts.com</p>
            </div>
            <div class="col-right">
              <p class="bold">Billing Address:</p>
              <p>101, 2nd Floor, Shri Sai Appartment, Near Kachore Lawn, Nagpur - 440015</p>
              <p class="bold" style="margin-top: 10px;">Shipping Address:</p>
              <p>Meraki Expert, 101, 2nd Floor, Shri Sai Appartment, Near Kachore Lawn, Nagpur - 440015</p>
            </div>
          </div>

          <!-- Requirement Text -->
          <p style="margin: 10px 0;">This is referance to our requirement,</p>

          <!-- Item Table -->
          <table>
            <thead>
              <tr>
                <th style="width: 8%;">Sr. No.</th>
                <th style="width: 35%;">Item Description</th>
                <th style="width: 15%;">HSN Code</th>
                <th style="width: 10%;">Qty.</th>
                <th style="width: 10%;">MOU</th>
                <th style="width: 10%;">Rate</th>
                <th style="width: 12%;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${
                order.items && Array.isArray(order.items)
                  ? order.items.map((item, index) => `
                      <tr>
                        <td>${index + 1}</td>
                        <td>${item.description || 'Boss GP - Silicon - 260 Ml (24 pieces)'}</td>
                        <td>${item.hsnCode || '32149090'}</td>
                        <td>${item.quantity || '35.00'}</td>
                        <td>${item.mou || 'Box'}</td>
                        <td>${item.rate || '2160'}</td>
                        <td>${item.amount || '75600.00'}</td>
                      </tr>
                    `).join('')
                  : `
                      <tr>
                        <td>1</td>
                        <td>Boss GP - Silicon - 260 Ml (24 pieces)</td>
                        <td>32149090</td>
                        <td>35.00</td>
                        <td>Box</td>
                        <td>2160</td>
                        <td>75600.00</td>
                      </tr>
                    `
              }
            </tbody>
          </table>

          <!-- Totals -->
          <div class="totals">
            <p>Total: ${order.subtotal || '75600.00'}</p>
            <p>CGST + SGST: ${order.tax || '13608.00'}</p>
            <p>IGST: ${order.igst || 'N/A'}</p>
            <p>Freight Charges: ${order.freight || 'Extra at Actual'}</p>
            <p class="bold">Total (Tax Inclusive): ${order.total || '89208.00'}</p>
            <p class="bold">ROUNDUP: ${order.total || '89208.00'}</p>
          </div>

          <!-- Amount in Words -->
          <p class="amount-words">Amount (in words) : :${order.total_in_words || 'Eighty Nine thousand two hundred and eight.'}</p>

          <!-- Terms & Conditions -->
          <div class="terms">
            <p class="bold">Terms & Conditions</p>
            <p>Payment Terms: 100% After Delivery.</p>
            <p>Delivery: 1 to 2 Weeks (Immediate)</p>
            <p>Document Required: Test Certificate</p>
            <p>PO Validity : 4 Month</p>
          </div>

          <!-- Signatory -->
          <p class="signatory">(Authorized Signatory)</p>

          <!-- Footer -->
          <div class="footer">
            <p>For MERAKI EXPERT</p>
            <p>Email: merakiexpert@gmail.com | Mobile: +91-8793484326 / +91-9130801011 | www.merrakiexpert.in</p>
          </div>
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
};
  const handleSendEmail = (order) => {
    try {
      const subject = encodeURIComponent(`Purchase Order ${order.purchase_order_no || 'N/A'}`);
      const body = encodeURIComponent(`Hi,\n\nHere are your purchase order details:\nOrder #: ${order.purchase_order_no || 'N/A'}\nVendor: ${order.vendor_name || 'N/A'}\nAmount: ₹${order.total || 'N/A'}\nDelivery Date: ${order.delivery_date ? order.delivery_date.slice(0, 10) : 'N/A'}`);
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
    } catch (error) {
      console.error('Email generation failed:', error);
      alert('Failed to generate email. Please try again.');
    }
  };

  const handleShareLink = (order) => {
    try {
      navigator.clipboard.writeText(`https://dummy-purchase-order-link/${order.purchase_order_no || 'unknown'}`);
      alert('Purchase order link copied to clipboard!');
    } catch (error) {
      console.error('Share link failed:', error);
      alert('Failed to copy link. Please try again.');
    }
  };

  return (
    <Box display="flex">
      <Sidebar />
      <Box flex={1} display="flex" flexDirection="column" minHeight="100vh">
        <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
          <Breadcrumbs><Typography color="text.primary">Purchase Order</Typography></Breadcrumbs>
          <Box display="flex" gap={2}>
            <Paper elevation={0} sx={{ display: 'flex', alignItems: 'center', px: 1.5, py: 0.5, borderRadius: '999px', border: '1px solid #e0e0e0', bgcolor: '#f9fafb', width: 240 }}>
              <SearchIcon sx={{ fontSize: 20, color: '#999' }} />
              <InputBase placeholder="Search anything here..." sx={{ ml: 1, fontSize: 14, flex: 1 }} inputProps={{ 'aria-label': 'search' }} />
            </Paper>
            <IconButton sx={{ borderRadius: '12px', border: '1px solid #e0e0e0', bgcolor: '#f9fafb', p: 1 }}>
              <NotificationsNoneIcon sx={{ fontSize: 20, color: '#666' }} />
            </IconButton>
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar src="https://i.pravatar.cc/40?img=1" />
              <Typography fontSize={14}>Admin name</Typography>
              <ArrowDropDownIcon />
            </Box>
          </Box>
        </Box>

        <Box p={3}>
          <Paper sx={{ p: 1, borderRadius: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" px={4} py={2} borderBottom="1px solid #e0e0e0">
              <Typography fontWeight="bold" fontSize={18}>Purchase Order</Typography>
              <Button variant="contained" onClick={() => window.location.href = '/add-purchase-order'} sx={{ textTransform: 'none', borderRadius: 2, bgcolor: '#004085', color: '#fff', '&:hover': { bgcolor: '#003366' } }}>+ New Purchase Order</Button>
            </Box>
            <Box px={4} pt={2} display="flex" justifyContent="space-between" alignItems="center">
              <Tabs value={tab} onChange={(e, newTab) => setTab(newTab)} sx={{ '& .MuiTab-root': { textTransform: 'none', bgcolor: '#f1f1f1', borderRadius: 2, mr: 1 }, '& .Mui-selected': { bgcolor: '#004085', color: 'white !important' }, '& .MuiTabs-indicator': { display: 'none' } }}>
                <Tab label="All Purchase Order" />
                <Tab label="Sent Purchase Order" />
                <Tab label="Draft Purchase Order" />
              </Tabs>
              <TextField size="small" placeholder="Search by item name..." InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>), sx: { bgcolor: 'white', borderRadius: 2 } }} />
            </Box>

            <TableContainer component={Paper} sx={{ boxShadow: 'none', mt: 2 }}>
              <Table size="small">
                <TableHead sx={{ backgroundColor: '#F9FAFB' }}>
                  <TableRow>
                    <TableCell><Checkbox /></TableCell>
                    <TableCell>Purchase Order #</TableCell>
                    <TableCell>Vendor Name</TableCell>
                    <TableCell>Created Date</TableCell>
                    <TableCell>Delivery Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Bill Amount</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRows.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell><Checkbox /></TableCell>
                      <TableCell sx={{ color: '#0B5FFF', fontWeight: 500 }}>{row.purchase_order_no || 'N/A'}</TableCell>
                      <TableCell>{row.vendor_name || 'N/A'}</TableCell>
                      <TableCell>{row.purchase_order_date ? row.purchase_order_date.slice(0, 10) : 'N/A'}</TableCell>
                      <TableCell>{row.delivery_date ? row.delivery_date.slice(0, 10) : 'N/A'}</TableCell>
                      <TableCell>
                        <Typography variant="caption" sx={{ backgroundColor: '#F2F4F7', color: '#344054', px: 1.5, py: 0.5, borderRadius: '12px', fontWeight: 600 }}>{row.status || 'Draft'}</Typography>
                      </TableCell>
                      <TableCell>{row.total ? `₹${row.total}` : 'N/A'}</TableCell>
                      <TableCell>
                        <IconButton onClick={(e) => handleMenuOpen(e, i)}><MoreVertIcon /></IconButton>
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl) && menuIndex === i} onClose={handleMenuClose}>
                          <MenuItem onClick={() => handleEditPurchase(row._id)}>Edit</MenuItem>
                          <MenuItem onClick={() => handleDownloadPdf(row)}>Download PDF</MenuItem>
                          <MenuItem onClick={() => handlePrintOrder(row)}>Print</MenuItem>
                          <MenuItem onClick={() => handleSendEmail(row)}>Send Email</MenuItem>
                          <MenuItem onClick={() => handleShareLink(row)}>Share Link</MenuItem>
                        </Menu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
              <Typography variant="body2">Showing 1 to {filteredRows.length} of {rows.length} entries</Typography>
              <Box display="flex" gap={1}>
                {[1, 2, 3].map(page => (
                  <Button key={page} size="small" variant={page === 1 ? 'outlined' : 'text'}>{page}</Button>
                ))}
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default PurchaseOrderActions;