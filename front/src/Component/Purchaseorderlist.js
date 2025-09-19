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

import axios from "axios";

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
      const idOrNo = order.id ;
      if (!idOrNo) {
        alert("Purchase order identifier missing");
        return;
      }

      const { data } = await axios.get(
        `http://localhost:5000/api/purchase/${idOrNo}`
      );
      const purchaseOrder = data?.purchase_order || {};
      const vendor = data?.vendor || {};

      // Normalize / fallback values
      const poNo =  order.purchase_order_no || "";
      const poDate = (purchaseOrder.purchase_order_date || order.purchase_order_date || "").slice(0, 10);
      const subTotal = Number(purchaseOrder.sub_total ?? order.sub_total ?? 0);
      const cgst = Number(purchaseOrder.cgst ?? order.cgst ?? 0);
      const sgst = Number(purchaseOrder.sgst ?? order.sgst ?? 0);
      const total = Number(purchaseOrder.total ?? order.total ?? 0);
      const totalInWords = purchaseOrder.total_in_words || order.total_in_words || "";
      const paymentTerms = purchaseOrder.payment_terms || order.payment_terms || "";
      const poValidity = purchaseOrder.po_validity || order.po_validity || "";
      const deliveryTime = purchaseOrder.delivery_time || order.delivery_time || "";
      const requiredDocs = purchaseOrder.required_docs || order.required_docs || "";

      const items = Array.isArray(purchaseOrder.items)
        ? purchaseOrder.items
        : [];

      // Fallback number-to-words (INR) like invoice PDF
      const numberToWords = (num) => {
        const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
        const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
        const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
        const thousands = ["", "Thousand", "Lakh", "Crore"];

        const convertLessThanThousand = (n) => {
          if (n === 0) return "";
          if (n < 10) return units[n];
          if (n < 20) return teens[n - 10];
          if (n < 100) return `${tens[Math.floor(n / 10)]} ${units[n % 10]}`.trim();
          return `${units[Math.floor(n / 100)]} Hundred ${convertLessThanThousand(n % 100)}`.trim();
        };

        const convert = (n) => {
          if (!n || isNaN(n)) return "";
          if (n === 0) return "Zero";
          let result = "";
          let thousandIndex = 0;
          while (n > 0) {
            const chunk = n % 1000;
            if (chunk > 0) {
              result = `${convertLessThanThousand(chunk)} ${thousands[thousandIndex]} ${result}`.trim();
            }
            n = Math.floor(n / 1000);
            thousandIndex++;
          }
          return result;
        };

        return `${convert(Math.floor(Number(num) || 0))} Rupees Only`;
      };

      // Compose billing/shipping details like invoice PDF
      const billingDetails = `
        ${vendor.billing_recipient_name || vendor.company_name || vendor.vendor_name || "N/A"}<br>
        ${vendor.billing_address1 || ""}${vendor.billing_address2 ? `<br>${vendor.billing_address2}` : ""}<br>
        ${vendor.billing_city || ""}, ${vendor.billing_state || ""} - ${vendor.billing_pincode || ""}<br>
        Pin Code - ${vendor.billing_pincode || ""}, ${vendor.billing_country || "India"}<br>
        <b>State Code :</b> ${vendor.billing_state ? "27" : "N/A"}<br>
        <b>GSTIN :</b> ${vendor.gstin || "N/A"}
      `;

      const shippingDetails = `
        ${vendor.shipping_recipient_name || vendor.company_name || vendor.vendor_name || "N/A"}<br>
        ${vendor.shipping_address1 || ""}${vendor.shipping_address2 ? `<br>${vendor.shipping_address2}` : ""}<br>
        ${vendor.shipping_city || ""}, ${vendor.shipping_state || ""} - ${vendor.shipping_pincode || ""}<br>
        Pin Code - ${vendor.shipping_pincode || ""}, ${vendor.shipping_country || "India"}<br>
        <b>State Code :</b> ${vendor.shipping_state ? "27" : "N/A"}<br>
        <b>GSTIN :</b> ${vendor.gstin || "N/A"}
      `;

      // Open print window with dynamic HTML content
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        alert('Popup blocked. Please allow popups for this site to download the PDF.');
        return;
      }
      printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>Purchase Order - ${poNo}</title>
          <style>
            @page { size: A4 landscape; margin: 10mm; }
            body { font-family: Arial; margin: 20px; }
            .invoice-box {
              max-width: 950px;
              margin: auto;
              padding: 30px;
              border: 1px solid #eee;
            }
            table { width: 100%; border-collapse: collapse; }
            td, th { padding: 8px; border: 1px solid #ddd; }
            .no-border td, .no-border th { border: none !important; }
            .bold { font-weight: bold; }
            .right { text-align: right; }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            <table class="no-border">
              <tr>
                <td>
                  <p class="bold">GSTIN : ${COMPANY.gstin}</p>
                  <p class="bold">Name : ${COMPANY.name}</p>
                </td>
                <td class="right">
                  <h2>PURCHASE ORDER</h2>
                  <p>PO Number: ${poNo}</p>
                  <p>Date: ${poDate}</p>
                </td>
              </tr>
            </table>

            <!-- Vendor Details -->
            <table>
              <tr>
                <th colspan="2">VENDOR DETAILS</th>
              </tr>
              <tr>
                <td width="50%">${billingDetails}</td>
                <td width="50%">${shippingDetails}</td>
              </tr>
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
                ${items.map((it, idx) => `
                <tr>
                  <td>${idx + 1}</td>
                  <td>${it.description || it.item_name || ""}</td>
                  <td>${it.hsnCode || it.hsn_code || ""}</td>
                  <td>${it.quantity ?? it.qty ?? ""}</td>
                  <td>${it.mou || it.uom || ""}</td>
                  <td>${Number(it.rate ?? 0).toFixed(2)}</td>
                  <td>₹ ${Number(it.amount ?? 0).toFixed(2)}</td>
                </tr>`).join('')}
              </tbody>
            </table>

            <!-- Totals -->
            <table class="no-border">
              <tr>
                <td width="70%">
                  <p class="bold">Total Amount (in words): ${totalInWords || numberToWords(total)}</p>
                </td>
                <td>
                  <p>Sub Total: ₹ ${subTotal.toFixed(2)}</p>
                  <p>CGST (${((cgst / (subTotal || 1)) * 100).toFixed(2)}%): ₹ ${cgst.toFixed(2)}</p>
                  <p>SGST (${((sgst / (subTotal || 1)) * 100).toFixed(2)}%): ₹ ${sgst.toFixed(2)}</p>
                  <p class="bold">Grand Total: ₹ ${total.toFixed(2)}</p>
                </td>
              </tr>
            </table>

            <!-- Payment Terms -->
            <table class="no-border">
              <tr>
                <td>
                  <p class="bold">Payment Terms: ${paymentTerms}</p>
                  <p class="bold">Delivery Time: ${deliveryTime}</p>
                  <p class="bold">Required Documents: ${requiredDocs}</p>
                  <p class="bold">PO Validity: ${poValidity}</p>
                </td>
              </tr>
            </table>
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();

      printWindow.onload = () => {
        try {
          setTimeout(() => {
            printWindow.print();
          }, 200); // Add a small delay before printing
        } catch (error) {
          console.error("Print failed:", error);
          alert("Failed to generate PDF. Please allow popups and try again.");
        } finally {
          setTimeout(() => printWindow.close(), 1000);
        }
      };

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