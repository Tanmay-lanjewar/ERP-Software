import { useEffect, useState } from 'react';
import {
  Box, Button, Typography, TextField, IconButton, InputAdornment, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Menu, MenuItem, Checkbox, Avatar, InputBase, Tabs, Tab, Breadcrumbs
} from '@mui/material';
import { useNavigate } from "react-router-dom";
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
            // Group by purchase_order_no so each order appears only once
            const grouped = {};
            res.data.forEach(row => {
                if (!grouped[row.purchase_order_no]) {
                    grouped[row.purchase_order_no] = row;
                }
            });
            setRows(Object.values(grouped));
        })
        .catch(() => setRows([]));
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
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Purchase Order</title>
</head>
<body style="font-family: Arial, sans-serif; font-size: 10px; margin: 0; padding: 20px;">
    <div style="border: 2px solid #000; padding: 10px; width: 600px; margin: auto;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #000; padding-bottom: 5px;">
            <div style="display: flex; align-items: center;">
                <img src="/static/media/ui.405d9b691b910181ce2e.png" alt="Merraki Expert Logo" style="width: 200px; height: auto; margin-Top: -70px; margin-Bottom: -70px;">
                 <div style="font-size: 14px; font-weight: bold;"></div>
            </div>
            <div style="text-align: right;">
                <div style="margin-bottom: 2px;"><strong>PO No:</strong> PO/10/2025-26/WWI</div>
                <div style="margin-bottom: 2px;"><strong>Date:</strong> 11/08/2025</div>
                <div><strong>JO ID:</strong> N/A</div>
            </div>
        </div>

        <div style="display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 2px solid #000;">
            <div style="font-size: 10px;"><strong>GSTIN:</strong> 27AKUPY6544R1ZM</div>
            <div style="font-size: 10px;"><strong>UDYAM-MH-20-0114278</strong></div>
        </div>

        <div style="border-bottom: 2px solid #000; padding: 5px 0;">
            <div style="display: flex;">
                <div style="width: 100px; font-weight: bold;">Billing Address:</div>
                <div>101, 2nd Floor, Shri Sai Appartment, Near Kachore Lawn, Nagpur - 440015</div>
            </div>
            <div style="display: flex;">
                <div style="width: 100px; font-weight: bold;">Shipping Address:</div>
                <div>Meraki Expert, 101, 2nd Floor, Shri Sai Appartment, Near Kachore Lawn, Nagpur - 440015</div>
            </div>
        </div>

        <div style="text-align: center; font-weight: bold; padding: 5px 0; border-bottom: 2px solid #000;">
            Purchase Order
        </div>

        <table style="width: 100%; border-collapse: collapse;">
            <tbody>
                <tr>
                    <td style="width: 25%; border: 1px solid #000; padding: 3px; background-color: #f2f2f2; font-weight: bold;">Vendor:</td>
                    <td style="width: 25%; border: 1px solid #000; padding: 3px;">Wellworth International</td>
                    <td style="width: 25%; border: 1px solid #000; padding: 3px; background-color: #f2f2f2; font-weight: bold;">GSTIN</td>
                    <td style="width: 25%; border: 1px solid #000; padding: 3px;">27AANPj1949R1ZT</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #000; padding: 3px; background-color: #f2f2f2; font-weight: bold;">Address:</td>
                    <td style="border: 1px solid #000; padding: 3px;">shop no 7, Sukhadada Apartments, Temple Bazar, Pinjari, Gali, Sitabuldi, Nagpur</td>
                    <td style="border: 1px solid #000; padding: 3px; background-color: #f2f2f2; font-weight: bold;">Kind Attn.</td>
                    <td style="border: 1px solid #000; padding: 3px;">Mr. Kishor Choudhari</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #000; padding: 3px; background-color: #f2f2f2; font-weight: bold;">Mobile No.</td>
                    <td style="border: 1px solid #000; padding: 3px;">7338729293</td>
                    <td style="border: 1px solid #000; padding: 3px; background-color: #f2f2f2; font-weight: bold;">Email</td>
                    <td style="border: 1px solid #000; padding: 3px; color: #00f;">kishor.choudhari@bossproducts.com</td>
                </tr>
            </tbody>
        </table>

        <div style="border: 1px solid #000; padding: 3px; margin-top: 5px;">
            This is referance to our requirement,
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-top: 5px;">
            <thead>
                <tr style="background-color: #f2f2f2;">
                    <th style="border: 1px solid #000; padding: 3px; width: 5%;">Sr. No.</th>
                    <th style="border: 1px solid #000; padding: 3px; width: 35%;">Item Description</th>
                    <th style="border: 1px solid #000; padding: 3px; width: 10%;">HSN Code</th>
                    <th style="border: 1px solid #000; padding: 3px; width: 5%;">Qty.</th>
                    <th style="border: 1px solid #000; padding: 3px; width: 5%;">MOU</th>
                    <th style="border: 1px solid #000; padding: 3px; width: 15%;">Rate</th>
                    <th style="border: 1px solid #000; padding: 3px; width: 25%;">Amount</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; padding: 3px; text-align: center;">1</td>
                    <td style="border: 1px solid #000; padding: 3px;">Boss GP - Silicon - 250 MI (24 pieces)</td>
                    <td style="border: 1px solid #000; padding: 3px; text-align: center;">32149090</td>
                    <td style="border: 1px solid #000; padding: 3px; text-align: center;">35.00</td>
                    <td style="border: 1px solid #000; padding: 3px; text-align: center;">Box</td>
                    <td style="border: 1px solid #000; padding: 3px; text-align: right;">2160</td>
                    <td style="border: 1px solid #000; padding: 3px; text-align: right;">75600.00</td>
                </tr>
            </tbody>
        </table>

        <div style="display: flex; margin-top: 5px;">
            <div style="width: 50%; border: 1px solid #000; padding: 5px;">
                <div style="font-weight: bold; border-bottom: 1px solid #000; padding-bottom: 3px; margin-bottom: 5px;">Terms & Conditions</div>
                <div>Payment Terms: 100% After Delivery.</div>
                <div style="margin-top: 5px;">PO Validity : 4 Month</div>
                <div>Delivery: 1 to 2 Weeks (Immediate)</div>
                <div>Document Required: Test Certificate</div>
            </div>
            <div style="width: 50%;">
                <table style="width: 100%; border-collapse: collapse; margin-left: -1px;">
                    <tbody>
                        <tr>
                            <td style="border: 1px solid #000; padding: 3px; font-weight: bold; background-color: #f2f2f2;">Amount</td>
                            <td style="border: 1px solid #000; padding: 3px; text-align: right;">75600.00</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid #000; padding: 3px; font-weight: bold; background-color: #f2f2f2;">CGST + SGST</td>
                            <td style="border: 1px solid #000; padding: 3px; text-align: right;">13608.00</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid #000; padding: 3px; font-weight: bold; background-color: #f2f2f2;">IGST</td>
                            <td style="border: 1px solid #000; padding: 3px; text-align: right;">N/A</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid #000; padding: 3px; font-weight: bold; background-color: #f2f2f2;">Freight Charges</td>
                            <td style="border: 1px solid #000; padding: 3px; text-align: right;">Extra at Actual</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid #000; padding: 3px; font-weight: bold; background-color: #f2f2f2;">Total (Tax Inclusive)</td>
                            <td style="border: 1px solid #000; padding: 3px; text-align: right;">89208.00</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid #000; padding: 3px; font-weight: bold; background-color: #f2f2f2; text-align: right;">ROUNDUP</td>
                            <td style="border: 1px solid #000; padding: 3px; text-align: right;">89208.00</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div style="border: 1px solid #000; padding: 3px; margin-top: 5px;">
            <strong>Amount (in words) :</strong> Eighty Nine thousand two hundred and eight.
        </div>

        <div style="display: flex; justify-content: space-between; align-items: flex-end; padding-top: 5px;">
            <div style="width: 70%;">
                <div style="border: 1px solid #000; padding: 3px;">
                    Email : merakkiexpert@gmail.com | Mobile : +91-8793484326 / +91-9130801011 | www.merakkiexpert.in
                </div>
            </div>
            <div style="width: 30%; text-align: center; margin-left: 10px;">
                <div style="font-weight: bold;">For MERAKI EXPERT</div>
                <div style="height: 50px; display: flex; align-items: center; justify-content: center;">
                    <img src="https://example.com/signature.png" alt="Signature" style="height: 50px;">
                </div>
                <div>(Authorized Signatory)</div>
            </div>
        </div>
    </div>
</body>
</html>
`);
    printWindow.document.close();
    printWindow.print();
  };

  const handlePrintOrder = (order) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html><head><title>Print Purchase Order</title>
      <style>body{font-family:Arial;margin:40px;}h1{text-align:center;color:#003366;}p{font-size:16px;}</style>
      </head><body>
      <h1>Purchase Order Document</h1>
      <p><b>Order #:</b> ${order.orderNo}</p>
      <p><b>Vendor:</b> ${order.vendor}</p>
      <p><b>Created Date:</b> ${order.created}</p>
      <p><b>Delivery Date:</b> ${order.delivery}</p>
      <p><b>Status:</b> ${order.status}</p>
      <p><b>Amount:</b> ${order.amount}</p>
      <p style="margin-top:40px;font-style:italic;text-align:center;">Generated by ERP Software</p>
      </body></html>`);
    printWindow.document.close();
    printWindow.print();
  };

  const handleSendEmail = (order) => {
    const subject = encodeURIComponent(`Purchase Order ${order.orderNo}`);
    const body = encodeURIComponent(`Hi,\n\nHere are your purchase order details:\nOrder #: ${order.orderNo}\nVendor: ${order.vendor}\nAmount: ${order.amount}\nDelivery Date: ${order.delivery}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleShareLink = (order) => {
    navigator.clipboard.writeText(`https://dummy-purchase-order-link/${order.orderNo}`);
    alert('Purchase order link copied to clipboard!');
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
              <Button variant="contained" onClick={()=>
window.location.href = '/add-purchase-order'
              } sx={{ textTransform: 'none', borderRadius: 2, bgcolor: '#004085', color: '#fff', '&:hover': { bgcolor: '#003366' } }}>+ New Purchase Order</Button>
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
                      <TableCell sx={{ color: '#0B5FFF', fontWeight: 500 }}>{row.purchase_order_no}</TableCell>
                      <TableCell>{row.vendor_name}</TableCell>
                      <TableCell>{row.purchase_order_date ? row.purchase_order_date.slice(0,10) : ''}</TableCell>
                      <TableCell>{row.delivery_date ? row.delivery_date.slice(0,10) : ''}</TableCell>
                      <TableCell>
                        <Typography variant="caption" sx={{ backgroundColor: '#F2F4F7', color: '#344054', px: 1.5, py: 0.5, borderRadius: '12px', fontWeight: 600 }}>Draft</Typography>
                      </TableCell>
                      <TableCell>{row.total ? `₹${row.total}` : ''}</TableCell>
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
              <Typography variant="body2">Showing 1 to 10 of 10 entries</Typography>
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
