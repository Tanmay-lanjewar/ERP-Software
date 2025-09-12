import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Menu,
  MenuItem,
  Checkbox,
  Avatar,
  InputBase,
  Tabs,
  Tab,
  Breadcrumbs,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import Sidebar from "./Sidebar";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

import axios from "axios";

const PurchaseOrderActions = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuIndex, setMenuIndex] = useState(null);
  const [tab, setTab] = useState(0);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/purchase")
      .then((res) => {
        console.log("Purchase Orders API Response:", res.data);
        const sorted = [...res.data].sort((a, b) => {
          const dateA = new Date(a.purchase_order_date || a.created_at || 0);
          const dateB = new Date(b.purchase_order_date || b.created_at || 0);
          return dateB - dateA;
        });
        setRows(sorted);
      })
      .catch((error) => {
        console.error("Failed to fetch purchase orders:", error);
        setRows([]);
      });
  }, []);

  const filteredRows = rows.filter((row) => {
    if (tab === 0) return true;
    if (tab === 1) return row.status === "Sent";
    if (tab === 2) return row.status === "Draft";
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

  const handleDownloadPdf = async (order) => {
    try {
      // Fetch full purchase order with items and vendor
      const idOrNo = order.id || order.purchase_order_no;
      if (!idOrNo) {
        alert('Purchase order identifier missing');
        return;
      }
      const poResponse = await axios.get(`http://localhost:5000/api/purchase/${idOrNo}`);
      console.log('PO Full Response:', poResponse.data);
      const { purchase_order = {}, vendor = {} } = poResponse.data || {};
      const items = Array.isArray(purchase_order.items) ? purchase_order.items : [];

      // Helper to normalize addresses like ', , ,' -> '...'
      const normalizeAddress = (s) => {
        if (!s) return '';
        return s
          .split(',')
          .map((t) => t.trim())
          .filter((t) => t && t.toLowerCase() !== 'n/a')
          .join(', ');
      };

      // choose the most meaningful vendor name (display_name > company_name > vendor_name)
      const pickVendorName = (v) => v.display_name || v.company_name || v.vendor_name || '';

      // Prepare safe data from backend only (no dummy constants)
      const safeOrderData = {
        purchase_order_no: purchase_order.purchase_order_no || order.purchase_order_no || '',
        purchase_order_date: (purchase_order.purchase_order_date || order.purchase_order_date || '').slice(0, 10),
        os_id: purchase_order.os_id || order.os_id || '',
        subtotal: typeof purchase_order.sub_total !== 'undefined' ? purchase_order.sub_total : order.sub_total || '',
        cgst: typeof purchase_order.cgst !== 'undefined' ? purchase_order.cgst : order.cgst || '',
        sgst: typeof purchase_order.sgst !== 'undefined' ? purchase_order.sgst : order.sgst || '',
        igst: typeof purchase_order.igst !== 'undefined' ? purchase_order.igst : order.igst || '',
        freight: typeof purchase_order.freight !== 'undefined' ? purchase_order.freight : order.freight || '',
        total: typeof purchase_order.total !== 'undefined' ? purchase_order.total : order.total || '',
        total_in_words: purchase_order.total_in_words || order.total_in_words || '',
        payment_terms: purchase_order.payment_terms || order.payment_terms || '',
        delivery_time: purchase_order.delivery_time || order.delivery_time || '',
        required_docs: purchase_order.required_docs || order.required_docs || '',
        po_validity: purchase_order.po_validity || order.po_validity || '',
        gstin: purchase_order.gstin || purchase_order.gst || order.gstin || 'N/A',
        udyam: purchase_order.udyam || 'UDYAM-MH-20-0114278',
        status: purchase_order.status || order.status || ''
      };

      const safeVendorDetails = {
        vendor_name: pickVendorName(vendor),
        billing_address: normalizeAddress(vendor.billing_address || ''),
        shipping_address: normalizeAddress(vendor.shipping_address || vendor.billing_address || ''),
        gst: vendor.gst || vendor.gstin || '',
        contact_name: vendor.contact_name || vendor.display_name || '',
        mobile_no: vendor.mobile_no || vendor.phone || '',
        email: vendor.email || '',
        model_no: vendor.model_no || '',
      };

      // Build HTML using backend data
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Purchase Order - ${safeOrderData.purchase_order_no}</title>
          <style>
            body { margin: 0; padding: 20px; font-family: Arial, sans-serif; font-size: 10px; }
            .container { border: 2px solid #000; padding: 10px; width: 600px; margin: auto; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #000; padding-bottom: 5px; margin-bottom: 10px; }
            .logo { width: 200px; height: auto; margin-top: -70px; margin-bottom: -70px; }
            .order-details { text-align: right; }
            .gstin-udyam { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 2px solid #000; }
            .address-section { border-bottom: 2px solid #000; padding: 5px 0; }
            .address-section div { display: flex; }
            .address-section div div:first-child { width: 100px; font-weight: bold; }
            .title { text-align: center; font-weight: bold; padding: 5px 0; border-bottom: 2px solid #000; }
            .vendor-table { width: 100%; border-collapse: collapse; margin-bottom: 5px; }
            .vendor-table td { border: 1px solid #000; padding: 3px; }
            .vendor-table td:nth-child(odd) { background-color: #f2f2f2; font-weight: bold; }
            .items-table { width: 100%; border-collapse: collapse; margin-top: 5px; }
            .items-table th, .items-table td { border: 1px solid #000; padding: 3px; }
            .items-table th { background-color: #f2f2f2; }
            .items-table td:nth-child(1), .items-table td:nth-child(3), .items-table td:nth-child(4), .items-table td:nth-child(5) { text-align: center; }
            .items-table td:nth-child(6), .items-table td:nth-child(7) { text-align: right; }
            .terms-financials { display: flex; margin-top: 5px; }
            .terms { width: 50%; border: 1px solid #000; padding: 5px; }
            .terms-title { font-weight: bold; border-bottom: 1px solid #000; padding-bottom: 3px; margin-bottom: 5px; }
            .financials-table { width: 50%; border-collapse: collapse; margin-left: -1px; }
            .financials-table td { border: 1px solid #000; padding: 3px; }
            .financials-table td:first-child { font-weight: bold; background-color: #f2f2f2; }
            .financials-table td:last-child { text-align: right; }
            .total-in-words { border: 1px solid #000; padding: 3px; margin-top: 5px; }
            .footer { display: flex; justify-content: space-between; align-items: flex-end; padding-top: 5px; }
            .contact-info { width: 70%; border: 1px solid #000; padding: 3px; }
            .signature { width: 30%; text-align: center; margin-left: 10px; }
            .signature img { height: 50px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo-container">
                <img src="/static/media/ui.405d9b691b910181ce2e.png" alt="Meraki Expert Logo" class="logo" />
              </div>
              <div class="order-details">
                <div><strong>PO No:</strong> ${safeOrderData.purchase_order_no}</div>
                <div><strong>Date:</strong> ${safeOrderData.purchase_order_date}</div>
                <div><strong>JO ID:</strong> ${safeOrderData.os_id}</div>
              </div>
            </div>
            <div class="gstin-udyam">
              <div><strong>GSTIN:</strong> ${safeOrderData.gstin}</div>
              <div><strong>UDYAM:</strong> ${safeOrderData.udyam}</div>
            </div>
            <div class="address-section">
              <div>
                <div>Billing Address:</div>
                <div>${safeVendorDetails.billing_address}</div>
              </div>
              <div>
                <div>Shipping Address:</div>
                <div>${safeVendorDetails.shipping_address}</div>
              </div>
            </div>
            <div class="title">Purchase Order</div>
            <table class="vendor-table">
              <tbody>
                <tr>
                  <td>Vendor:</td>
                  <td>${safeVendorDetails.vendor_name}</td>
                  <td>GSTIN</td>
                  <td>${safeVendorDetails.gst}</td>
                </tr>
                <tr>
                  <td>Address:</td>
                  <td>${safeVendorDetails.billing_address}</td>
                  <td>Kind Attn.</td>
                  <td>${safeVendorDetails.contact_name}</td>
                </tr>
                <tr>
                  <td>Mobile No.</td>
                  <td>${safeVendorDetails.mobile_no}</td>
                  <td>Email</td>
                  <td>${safeVendorDetails.email}</td>
                </tr>
              </tbody>
            </table>
            <div class="requirement">This is reference to our requirement,</div>
            <table class="items-table">
              <thead>
                <tr>
                  <th>Sr. No.</th>
                  <th>Item Description</th>
                  <th>HSN Code</th>
                  <th>Qty.</th>
                  <th>MOU</th>
                  <th>Rate</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                ${items.map((item, index) => `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${item.description || item.item_name || ''}</td>
                    <td>${item.hsnCode || item.hsn_code || ''}</td>
                    <td>${item.quantity || item.qty || ''}</td>
                    <td>${item.mou || ''}</td>
                    <td>₹${item.rate ?? ''}</td>
                    <td>₹${item.amount ?? ''}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div class="terms-financials">
              <div class="terms">
                <div class="terms-title">Terms & Conditions</div>
                <div>Payment Terms: ${safeOrderData.payment_terms}</div>
                <div>PO Validity: ${safeOrderData.po_validity}</div>
                <div>Delivery: ${safeOrderData.delivery_time}</div>
                <div>Document Required: ${safeOrderData.required_docs}</div>
              </div>
              <table class="financials-table">
                <tbody>
                  <tr><td>Amount</td><td>₹${safeOrderData.subtotal}</td></tr>
                  <tr><td>CGST</td><td>₹${safeOrderData.cgst}</td></tr>
                  <tr><td>SGST</td><td>₹${safeOrderData.sgst}</td></tr>
                  <tr><td>IGST</td><td>₹${safeOrderData.igst}</td></tr>
                  <tr><td>Freight Charges</td><td>₹${safeOrderData.freight}</td></tr>
                  <tr><td>Total (Tax Inclusive)</td><td>₹${safeOrderData.total}</td></tr>
                  <tr><td>ROUNDUP</td><td>₹${safeOrderData.total}</td></tr>
                </tbody>
              </table>
            </div>
            <div class="total-in-words"><strong>Amount (in words):</strong> ${safeOrderData.total_in_words}</div>
            <div class="footer">
              <div class="contact-info">Email: merakiexpert@gmail.com | Mobile: +91-8793484326 / +91-9130801011 | www.merakkiexpert.in</div>
              <div class="signature">
                <div>For MERAKI EXPERT</div>
                <img src="https://example.com/signature.png" alt="Signature" />
                <div>(Authorized Signatory)</div>
              </div>
            </div>
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 300);
    } catch (error) {
      console.error('Failed to generate Purchase Order print:', error);
      alert('Failed to generate Purchase Order print');
    }
  };

  const handlePrintOrder = async (order) => {
    // Placeholder for print functionality (can reuse handleDownloadPdf logic if needed)
  };

  const handleSendEmail = (order) => {
    try {
      const subject = encodeURIComponent(
        `Purchase Order ${order.purchase_order_no || "N/A"}`
      );
      const body = encodeURIComponent(
        `Hi,\n\nHere are your purchase order details:\nOrder #: ${
          order.purchase_order_no || "N/A"
        }\nVendor: ${order.vendor_name || "N/A"}\nAmount: ₹${
          order.total || "N/A"
        }\nDelivery Date: ${
          order.delivery_date ? order.delivery_date.slice(0, 10) : "N/A"
        }`
      );
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
    } catch (error) {
      console.error("Email generation failed:", error);
      alert("Failed to generate email. Please try again.");
    }
  };

  const handleShareLink = (order) => {
    try {
      navigator.clipboard.writeText(
        `https://dummy-purchase-order-link/${
          order.purchase_order_no || "unknown"
        }`
      );
      alert("Purchase order link copied to clipboard!");
    } catch (error) {
      console.error("Share link failed:", error);
      alert("Failed to copy link. Please try again.");
    }
  };

  return (
    <Box display="flex">
      <Sidebar />
      <Box flex={1} display="flex" flexDirection="column" minHeight="100vh">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={2}
        >
          <Breadcrumbs>
            <Typography color="text.primary">Purchase Order</Typography>
          </Breadcrumbs>
          <Box display="flex" gap={2}>
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
              <Avatar src="https://i.pravatar.cc/40?img=1" />
              <Typography fontSize={14}>Admin name</Typography>
              <ArrowDropDownIcon />
            </Box>
          </Box>
        </Box>
        <Box p={3}>
          <Paper sx={{ p: 1, borderRadius: 2 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              px={4}
              py={2}
              borderBottom="1px solid #e0e0e0"
            >
              <Typography fontWeight="bold" fontSize={18}>
                Purchase Order
              </Typography>
              <Button
                variant="contained"
                onClick={() => (window.location.href = "/add-purchase-order")}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  bgcolor: "#004085",
                  color: "#fff",
                  "&:hover": { bgcolor: "#003366" },
                }}
              >
                + New Purchase Order
              </Button>
            </Box>
            <Box
              px={4}
              pt={2}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Tabs
                value={tab}
                onChange={(e, newTab) => setTab(newTab)}
                sx={{
                  "& .MuiTab-root": {
                    textTransform: "none",
                    bgcolor: "#f1f1f1",
                    borderRadius: 2,
                    mr: 1,
                  },
                  "& .Mui-selected": {
                    bgcolor: "#004085",
                    color: "white !important",
                  },
                  "& .MuiTabs-indicator": { display: "none" },
                }}
              >
                <Tab label="All Purchase Order" />
                <Tab label="Sent Purchase Order" />
                <Tab label="Draft Purchase Order" />
              </Tabs>
              <TextField
                size="small"
                placeholder="Search by item name..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  sx: { bgcolor: "white", borderRadius: 2 },
                }}
              />
            </Box>
            <TableContainer component={Paper} sx={{ boxShadow: "none", mt: 2 }}>
              <Table size="small">
                <TableHead sx={{ backgroundColor: "#F9FAFB" }}>
                  <TableRow>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
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
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell sx={{ color: "#0B5FFF", fontWeight: 500 }}>
                        {row.purchase_order_no || "N/A"}
                      </TableCell>
                      <TableCell>{row.vendor_name || "N/A"}</TableCell>
                      <TableCell>
                        {row.purchase_order_date
                          ? row.purchase_order_date.slice(0, 10)
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {row.delivery_date
                          ? row.delivery_date.slice(0, 10)
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="caption"
                          sx={{
                            backgroundColor: "#F2F4F7",
                            color: "#344054",
                            px: 1.5,
                            py: 0.5,
                            borderRadius: "12px",
                            fontWeight: 600,
                          }}
                        >
                          {row.status || "Draft"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {row.total ? `₹${row.total}` : "N/A"}
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={(e) => handleMenuOpen(e, i)}>
                          <MoreVertIcon />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl) && menuIndex === i}
                          onClose={handleMenuClose}
                        >
                          <MenuItem onClick={() => handleEditPurchase(row.id)}>
                            Edit
                          </MenuItem>
                          <MenuItem onClick={() => handleDownloadPdf(row)}>
                            Download PDF
                          </MenuItem>
                          <MenuItem onClick={() => handlePrintOrder(row)}>
                            Print
                          </MenuItem>
                          <MenuItem onClick={() => handleSendEmail(row)}>
                            Send Email
                          </MenuItem>
                          <MenuItem onClick={() => handleShareLink(row)}>
                            Share Link
                          </MenuItem>
                        </Menu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mt={2}
            >
              <Typography variant="body2">
                Showing 1 to {filteredRows.length} of {rows.length} entries
              </Typography>
              <Box display="flex" gap={1}>
                {[1, 2, 3].map((page) => (
                  <Button
                    key={page}
                    size="small"
                    variant={page === 1 ? "outlined" : "text"}
                  >
                    {page}
                  </Button>
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