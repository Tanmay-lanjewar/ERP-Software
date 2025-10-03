import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  IconButton,  InputAdornment,
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
import ui from "../assets/mera.png";
import axios from "axios";
import UserMenu from './UserMenu';

// Company constants used in PDF header
const COMPANY = {
  gstin: "27AKUPY6544R1ZM",
  name: "Meraki Expert",
};

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
        setRows(res.data);
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
        gstin: purchase_order.gstin || '27AKUPY6544R1ZM',
        udyam: purchase_order.udyam || 'UDYAM-MH-20-0114278',
        status: purchase_order.status || order.status || ''
      };

      const safeVendorDetails = {
        vendor_name: vendor.vendor_name || order.vendor_name || '',
        billing_address: normalizeAddress(vendor.billing_address || ''),
        shipping_address: normalizeAddress(vendor.shipping_address || vendor.billing_address || ''),
        gst: vendor.gst || '',
        contact_name: vendor.contact_name || '',
        mobile_no: vendor.mobile_no || vendor.phone || '',
        email: vendor.email || '',
      };

      // Build HTML using backend data
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <!DOCTYPE html>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Purchase Order - ${safeOrderData.purchase_order_no || 'N/A'}</title>
</head>
<body style="font-family: Arial, sans-serif; font-size: 10px; margin: 0; padding: 20px;">
    <div style="border: 2px solid #000; padding: 10px; width: 600px; margin: auto;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #000; padding-bottom: 5px;">
            <div style="display: flex; align-items: center;">
                <img src="/static/media/ui.405d9b691b910181ce2e.png" alt="Merraki Expert Logo" style="width: 200px; height: auto; margin-top: -70px; margin-bottom: -70px;">
        
            </div>
            <div style="text-align: right;">
                <div style="margin-bottom: 2px;"><strong>PO No:</strong> ${safeOrderData.purchase_order_no || 'N/A'}</div>
                <div style="margin-bottom: 2px; margin-right: 9px;"><strong>Date:</strong> ${new Date(safeOrderData.purchase_order_date).toLocaleDateString() || 'N/A'}</div>
                <div style="margin-right: 17px;"><strong>JO ID:</strong> ${safeOrderData.jo_id || 'N/A'}</div>
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
                <div>${safeVendorDetails.shipping_address || 'Meraki Expert, 101, 2nd Floor, Shri Sai Appartment, Near Kachore Lawn, Nagpur - 440015'}</div>
            </div>
        </div>

        <div style="text-align: center; font-weight: bold; padding: 5px 0; border-bottom: 2px solid #000;">
            Purchase Order
        </div>

        <table style="width: 100%; border-collapse: collapse;">
            <tbody>
                <tr>
                    <td style="width: 25%; border: 1px solid #000; padding: 3px; background-color: #f2f2f2; font-weight: bold;">Vendor:</td>
                    <td style="width: 25%; border: 1px solid #000; padding: 3px;">${vendor.company_name || vendor.vendor_name}</td>
                    <td style="width: 25%; border: 1px solid #000; padding: 3px; background-color: #f2f2f2; font-weight: bold;">GSTIN</td>
                    <td style="width: 25%; border: 1px solid #000; padding: 3px;">${vendor.gst || 'N/A'}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #000; padding: 3px; background-color: #f2f2f2; font-weight: bold;">Address:</td>
                    <td style="border: 1px solid #000; padding: 3px;">${vendor.billing_address}</td>
                    <td style="border: 1px solid #000; padding: 3px; background-color: #f2f2f2; font-weight: bold;">Kind Attn.</td>
                    <td style="border: 1px solid #000; padding: 3px;">${vendor.contact_name}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #000; padding: 3px; background-color: #f2f2f2; font-weight: bold;">Mobile No.</td>
                    <td style="border: 1px solid #000; padding: 3px;">${vendor.mobile_no}</td>
                    <td style="border: 1px solid #000; padding: 3px; background-color: #f2f2f2; font-weight: bold;">Email</td>
                    <td style="border: 1px solid #000; padding: 3px; color: #00f;"><a href="mailto:${vendor.email}">${vendor.email}</a></td>
                </tr>
            </tbody>
        </table>

            <!-- Items Table -->
            <table>
              <thead>
                <tr>
                  <th>Sr.</th>
                  <th>Description</th>
                  <th>HSN</th>
                  <th>Qty</th>
                  <th>UOM</th>
                  <th>Rate</th>
                  <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                ${safeOrderData.items?.map(item => `
<tr>
<td>${item.sr_no}</td>
<td>${item.description}</td>
<td>${item.hsn_code}</td>
<td>${item.quantity}</td>
<td>${item.uom}</td>
<td>₹${item.rate || 0}</td>
<td>₹${item.amount || 0}</td>
</tr>`).join('') || ''}
            </tbody>
        </table>

        <div style="display: flex; margin-top: 5px;">
            <div style="width: 50%; border: 1px solid #000; padding: 5px;">
                <div style="font-weight: bold; border-bottom: 1px solid #000; padding-bottom: 3px; margin-bottom: 5px;">Terms & Conditions</div>
                <div>Payment Terms: ${safeOrderData.payment_terms || '100% After Delivery'}</div>
                <div style="margin-top: 5px;">PO Validity: ${safeOrderData.po_validity || '4 Month'}</div>
                <div>Delivery: ${safeOrderData.delivery_time || '1 to 2 Weeks (Immediate)'}</div>
                <div>Document Required: ${safeOrderData.required_docs || 'Test Certificate'}</div>
            </div>
            <div style="width: 50%;">
                <table style="width: 100%; border-collapse: collapse; margin-left: -1px;">
                    <tbody>
                        <tr>
                            <td colspan="4" style="border: 1px solid #000; padding: 3px; font-weight: bold; text-align: right;">Sub Total</td>
                            <td colspan="2" style="border: 1px solid #000; padding: 3px; text-align: right;">₹${safeOrderData.sub_total || 0}</td>
                        </tr>
                        <tr>
                            <td colspan="4" style="border: 1px solid #000; padding: 3px; font-weight: bold; text-align: right;">CGST @${(safeOrderData.cgst / (safeOrderData.subtotal || 1) * 100).toFixed(2)}%</td>
                            <td colspan="2" style="border: 1px solid #000; padding: 3px; text-align: right;">₹${safeOrderData.cgst || 0}</td>
                        </tr>
                        <tr>
                            <td colspan="4" style="border: 1px solid #000; padding: 3px; font-weight: bold; text-align: right;">SGST @${(safeOrderData.sgst / (safeOrderData.subtotal || 1) * 100).toFixed(2)}%</td>
                            <td colspan="2" style="border: 1px solid #000; padding: 3px; text-align: right;">₹${safeOrderData.sgst || 0}</td>
                        </tr>
                        <tr>
                            <td colspan="4" style="border: 1px solid #000; padding: 3px; font-weight: bold; text-align: right;">Grand Total</td>
                            <td colspan="2" style="border: 1px solid #000; padding: 3px; text-align: right;">₹${safeOrderData.total || 0}</td>
                        </tr>
                        <tr>
                            <td colspan="4" style="border: 1px solid #000; padding: 3px; font-weight: bold; text-align: right;">Total in Words</td>
                            <td colspan="2" style="border: 1px solid #000; padding: 3px; text-align: left;">${safeOrderData.total_in_words || 'N/A'}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div style="border: 1px solid #000; padding: 3px; margin-top: 5px;">
            <strong>Amount (in words):</strong> ${safeOrderData.total_in_words || 'N/A'}
        </div>

        <div style="display: flex; justify-content: space-between; align-items: flex-end; padding-top: 5px;">
            <div style="width: 70%;">
                <div style="border: 1px solid #000; padding: 3px;">
                    Email: merakkiexpert@gmail.com | Mobile: +91-8793484326 / +91-9130801011 | www.merakkiexpert.in
                </div>
            </div>
            <div style="width: 30%; text-align: center; margin-left: 10px;">
                <div style="font-weight: bold;">For MERAKI EXPERT</div>
                <div style="height: 50px; display: flex; align-items: center; justify-content: center;">
                    <!-- Signature placeholder removed for reliability -->
                </div>
                <div>(Authorized Signatory)</div>
            </div>
        </div>
    </div>
</body>
</html>
      `);
      
      printWindow.onload = () => {
        try {
          printWindow.print();
        } catch (error) {
          console.error('Print failed:', error);
          alert('Failed to generate PDF. Please allow popups and try again.');
        } finally {
          setTimeout(() => printWindow.close(), 1000);
        }
      };
      
      printWindow.document.close();
      
    } catch (error) {
      console.error("Error downloading PDF:", error);
      console.error("Error details:", error.response?.data || error.message);
      alert("Failed to download PDF. Please check console for details.");
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
              <NotificationsNoneIcon />
              <UserMenu />
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