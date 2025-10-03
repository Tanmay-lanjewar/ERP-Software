import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, InputBase, IconButton, Avatar, Chip,
  Table, TableHead, TableRow, TableCell, TableBody, Menu, MenuItem,
  Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import PrintIcon from "@mui/icons-material/Print";
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserMenu from './UserMenu';


const statusColorMap = {
  Draft: { bg: '#E6F4EA', color: '#333' },
  'In Progress': { bg: '#E5F0FB', color: '#1565C0' },
  Completed: { bg: '#E6F4EA', color: '#2E7D32' },
  Cancelled: { bg: '#FEEAEA', color: '#C62828' },
};

const WorkOrderlist = () => {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [tab, setTab] = useState('All');
  const [workOrders, setWorkOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchWorkOrders();
  }, []);

  const fetchWorkOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch('http://localhost:5000/api/work-orders');
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();
      console.log("📦 Work Orders from backend:", data);
      setWorkOrders(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error('Failed to fetch work orders:', err);
      setError(`Failed to load work orders: ${err.message}. Please check the backend endpoint.`);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = (event, order) => {
    setMenuAnchor(event.currentTarget);
    setSelectedOrder(order);
  };

  const handleClose = () => {
    setMenuAnchor(null);
    setSelectedOrder(null);
  };

  const handleEdit = () => {
    if (selectedOrder) {
      navigate(`/edit-work-order/${selectedOrder.work_order_id}`);
      handleClose();
    }
  };

  const handleShareLink = (order) => {
    navigator.clipboard.writeText(`https://dummy-workorder-link/${order.work_order_id}`);
    alert('Work order link copied to clipboard!');
    handleClose();
  };

  const numberToWords = (num) => {
    const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
    const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    const thousands = ["", "Thousand", "Lakh", "Crore"];

    const convertLessThanThousand = (num) => {
      if (num === 0) return "";
      if (num < 10) return units[num];
      if (num < 20) return teens[num - 10];
      if (num < 100) return `${tens[Math.floor(num / 10)]} ${units[num % 10]}`.trim();
      return `${units[Math.floor(num / 100)]} Hundred ${convertLessThanThousand(num % 100)}`.trim();
    };

    const convert = (num) => {
      if (num === 0) return "Zero";
      let result = "";
      let thousandIndex = 0;
      while (num > 0) {
        const chunk = num % 1000;
        if (chunk > 0) {
          result = `${convertLessThanThousand(chunk)} ${thousands[thousandIndex]} ${result}`.trim();
        }
        num = Math.floor(num / 1000);
        thousandIndex++;
      }
      return result;
    };

    return `${convert(Math.floor(num))} Rupees Only`;
  };

  const handleDownloadPdf = async (workOrder) => {
    try {
      // const response = await axios.get(`http://localhost:5000/api/work-orders/${workOrder.work_order_id}`);
      // const { workOrder: workOrderData, workOrderItems, customer, total_amount, cgst, sgst, grand_total } = response.data;

      // Dummy Data for PDF Generation
      const workOrderData = {
        work_order_number: workOrder.work_order_number || "WO-DUMMY-001",
        work_order_date: workOrder.work_order_date || "2025-09-19",
        due_date: workOrder.due_date || "2025-10-19",
        purchase_order_number: workOrder.purchase_order_number || "PO-DUMMY-123",
        // ... other work order fields if needed
      };

      const customer = {
        customer_name: workOrder.customer_name || "Dummy Customer",
        billing_recipient_name: "Dummy Billing Recipient",
        billing_address1: "123 Dummy Billing St",
        billing_address2: "Apt 4B",
        billing_city: "Dummy City",
        billing_state: "Dummy State",
        billing_pincode: "123456",
        billing_country: "India",
        gst: "27DUMMYGST1Z5",
        shipping_recipient_name: "Dummy Shipping Recipient",
        shipping_address1: "456 Dummy Shipping Ave",
        shipping_address2: "Suite 100",
        shipping_city: "Another Dummy City",
        shipping_state: "Another Dummy State",
        shipping_pincode: "654321",
        shipping_country: "India",
      };

      const workOrderItems = [
        {
          item_name: "Dummy Product 1",
          hsn_sac: "1234",
          quantity: 2,
          unit: "Pcs",
          rate: 150.00,
          discount: 10,
          amount: 280.00, // 2 * 150 - 10 (discount) = 290.00 (This calculation is illustrative. Actual calculation should be precise)
        },
        {
          item_name: "Dummy Service 2",
          hsn_sac: "5678",
          quantity: 1,
          unit: "Hrs",
          rate: 500.00,
          discount: 0,
          amount: 500.00,
        },
      ];

      const sub_total = workOrderItems.reduce((acc, item) => acc + item.amount, 0);
      const cgst = sub_total * 0.09;
      const sgst = sub_total * 0.09;
      const grand_total = sub_total + cgst + sgst;

      if (!customer) {
        throw new Error("Customer not found"); // This error will now only be thrown if dummy customer is not defined.
      }

      const itemsRows = workOrderItems
        .map(
          (item, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${item.item_name}</td>
            <td>${item.hsn_sac || "N/A"}</td>
            <td>${item.quantity}</td>
            <td>${item.unit || "N/A"}</td>
            <td>${parseFloat(item.rate).toFixed(2)}</td>
            <td>${(item.quantity * item.rate).toFixed(2)}</td>
            <td>${item.discount || "-"}</td>
            <td>${item.amount.toFixed(2)}</td>
            <td>9%<br>${(item.amount * 0.09).toFixed(2)}</td>
            <td>9%<br>${(item.amount * 0.09).toFixed(2)}</td>
            <td>0%</td>
            <td>${(item.amount + item.amount * 0.18).toFixed(2)}</td>
          </tr>`
        )
        .join("");

      const billingDetails = `
        ${customer.billing_recipient_name || customer.customer_name || "N/A"}<br>
        ${customer.billing_address1 || ""}${customer.billing_address2 ? `<br>${customer.billing_address2}` : ""}<br>
        ${customer.billing_city || ""}, ${customer.billing_state || ""} - ${customer.billing_pincode || ""}<br>
        Pin Code - ${customer.billing_pincode || ""}, ${customer.billing_country || "India"}<br>
        <b>State Code :</b> ${customer.billing_state ? "27" : "N/A"}<br>
        <b>GSTIN :</b> ${customer.gst || "N/A"}
      `;

      const shippingDetails = `
        ${customer.shipping_recipient_name || customer.customer_name || "N/A"}<br>
        ${customer.shipping_address1 || ""}${customer.shipping_address2 ? `<br>${customer.shipping_address2}` : ""}<br>
        ${customer.shipping_city || ""}, ${customer.shipping_state || ""} - ${customer.shipping_pincode || ""}<br>
        Pin Code - ${customer.shipping_pincode || ""}, ${customer.shipping_country || "India"}<br>
        <b>State Code :</b> ${customer.shipping_state ? "27" : "N/A"}<br>
        <b>GSTIN :</b> ${customer.gst || "N/A"}
      `;

      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>Work Order</title>
          <style>
            @page {
              size: A4 landscape;
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
              margin-top: -100px;
              margin-bottom: -90px;
              margin-left: -60px;
              margin-right: -70px;
            }
            .no-border {
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
                  <img src= class="logo" alt="Logo" />
                </td>
                <td style="text-align:center; border:none;">
                  <p class="bold">WORK ORDER</p>
                  <p class="small">[Section 31 of the CGST Act, 2017 read with Rule 1 of Revised Invoice Rules, 2017]</p>
                </td>
                <td style="border:none;">
                  <table class="no-border">
                    <tr><td class="bold">Work Order No.:</td><td>${workOrderData.work_order_number}</td></tr>
                    <tr><td class="bold">Work Order Date:</td><td>${workOrderData.work_order_date}</td></tr>
                    <tr><td class="bold">Cust Order Date:</td><td>${workOrderData.due_date || "N/A"}</td></tr>
                    <tr><td class="bold">PO Number:</td><td>${workOrderData.purchase_order_number || "N/A"}</td></tr>
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
                <td>${billingDetails}</td>
                <td>${shippingDetails}</td>
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
              ${itemsRows}
            </table>

            <!-- Totals -->
            <table style="margin-top:10px;">
              <tr>
                <td class="right bold">Grand Total (Inclusive of GST)</td>
                <td class="bold">${grand_total.toFixed(2)}</td>
              </tr>
              <tr>
                <td colspan="2">Work Order Value (In words): ${numberToWords(grand_total)}</td>
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
      handleClose();
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  const handlePrintWorkOrder = (order) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html><head><title>Print Work Order</title>
      <style>body{font-family:Arial;margin:40px;}h1{text-align:center;color:#003366;}p{font-size:16px;}</style>
      </head><body>
      <h1>Work Order Document</h1>
      <p><b>Work Order #:</b> ${order.work_order_number}</p>
      <p><b>Customer:</b> ${order.customer_name}</p>
      <p><b>Created Date:</b> ${order.work_order_date ? new Date(order.work_order_date).toLocaleDateString() : 'N/A'}</p>
      <p><b>Status:</b> ${order.status}</p>
      <p><b>Amount:</b> ${order.grand_total}</p>
      <p style="margin-top:40px;font-style:italic;text-align:center;">Generated by ERP Software</p>
      </body></html>`);
    printWindow.document.close();
    printWindow.print();
    handleClose();
  };


  const getFilteredOrders = () => {
    return workOrders.filter(order => {
      const customerName = order.customer_name || '';
      const matchesTab = tab === 'All' || order.status === tab;
      const matchesSearch = customerName.toLowerCase().includes(search.toLowerCase());
      return matchesTab && matchesSearch;
    });
  };

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Loading work orders...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">{error}</Typography>
        <Button onClick={fetchWorkOrders} variant="contained" sx={{ mt: 2 }}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#F9FAFB' }}>
      <Sidebar />

      <Box sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            height: 60,
            borderBottom: '1px solid #eee',
            display: 'flex',
            alignItems: 'center',
            px: 3,
            justifyContent: 'space-between',
            bgcolor: '#fff'
          }}
        >
          <Typography fontWeight="bold">Work Order</Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: '#F0F0F0',
                px: 2,
                py: 0.5,
                borderRadius: 5,
                minWidth: 250
              }}
            >
              <SearchIcon fontSize="small" sx={{ color: '#555' }} />
              <InputBase
                placeholder="Search customer name..."
                sx={{ ml: 1, flex: 1, fontSize: 14 }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Box>
            <IconButton><NotificationsNoneIcon /></IconButton>
            <Box display="flex" alignItems="center" gap={1}>
              <NotificationsNoneIcon />
              <UserMenu />
            </Box>
          </Box>
        </Box>

        <Box sx={{ p: 3 }}>
          <Paper sx={{ backgroundColor: '#fff', p: 3, borderRadius: 2 }}>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography variant="h6" fontWeight="bold">Work Order</Typography>
              <Button
                variant="contained"
                sx={{ backgroundColor: '#004085', textTransform: 'none', '&:hover': { backgroundColor: '#003060' } }}
                onClick={() => navigate('/add-Work-Order')}
              >
                + Add New Work Order
              </Button>
            </Box>

            <Box display="flex" gap={1} mb={2}>
              {['All', 'Draft', 'In Progress', 'Completed', 'Cancelled'].map(label => (
                <Button
                  key={label}
                  variant={tab === label ? 'contained' : 'outlined'}
                  sx={{ textTransform: 'none' }}
                  onClick={() => setTab(label)}
                >
                  {label}
                </Button>
              ))}
            </Box>

            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Work Order #</TableCell>
                  <TableCell>Customer Name</TableCell>
                  <TableCell>Created Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Bill Amount</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getFilteredOrders().map((row) => (
                  <TableRow key={row.work_order_id}>
                    <TableCell>{row.work_order_number || 'N/A'}</TableCell>
                    <TableCell>{row.customer_name || 'N/A'}</TableCell>
                    <TableCell>{row.work_order_date ? new Date(row.work_order_date).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.status || 'Unknown'}
                        size="small"
                        sx={{
                          bgcolor: statusColorMap[row.status]?.bg || '#E0E0E0',
                          color: statusColorMap[row.status]?.color || '#000'
                        }}
                      />
                    </TableCell>
                    <TableCell>{row.grand_total || '-'}</TableCell>
                    <TableCell>
                      <IconButton onClick={(e) => handleMenuClick(e, row)}>
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Box>
      </Box>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={() => handleDownloadPdf(selectedOrder)}><PictureAsPdfIcon fontSize="small" sx={{ mr: 1 }} /> Download PDF</MenuItem>
        <MenuItem onClick={() => handlePrintWorkOrder(selectedOrder)}><PrintIcon fontSize="small" sx={{ mr: 1 }} /> Print Work Order</MenuItem>
        <MenuItem onClick={() => handleShareLink(selectedOrder)}>Share Link</MenuItem>
      </Menu>
    </Box>
  );
};

export default WorkOrderlist;