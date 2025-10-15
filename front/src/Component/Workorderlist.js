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
import ui from '../assets/mera.png';


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
      // Fetch work order details from API
      const response = await axios.get(`http://localhost:5000/api/work-orders/${workOrder.work_order_id}`);
      const responseData = response.data;
      
      if (!responseData || !responseData.workOrderItems) {
        alert('Work order data is incomplete');
        return;
      }

      // Extract data from response
      const { workOrder: workOrderData, workOrderItems, customer } = responseData;

      // Use totals from backend response
      const sub_total = parseFloat(responseData.total_amount || workOrderData.sub_total || 0);
      const cgst = parseFloat(responseData.cgst || workOrderData.cgst || 0);
      const sgst = parseFloat(responseData.sgst || workOrderData.sgst || 0);
      const grand_total = parseFloat(responseData.grand_total || workOrderData.grand_total || 0);
      
      // Format date
      const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN');
      };
      
      // Format currency
      const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR'
        }).format(amount);
      };

      // Generate items HTML
      const itemsHTML = workOrderItems.map((item, index) => `
        <tr>
          <td style="border: 1px solid #000; padding: 3px; text-align: center;">${index + 1}</td>
          <td style="border: 1px solid #000; padding: 3px;">${item.item_detail || 'N/A'}</td>
          <td style="border: 1px solid #000; padding: 3px; text-align: center;">32149090</td>
          <td style="border: 1px solid #000; padding: 3px; text-align: center;">${item.quantity || 0}</td>
          <td style="border: 1px solid #000; padding: 3px; text-align: center;">${item.uom_description || 'Box'}</td>
          <td style="border: 1px solid #000; padding: 3px; text-align: right;">${item.rate || 0}</td>
          <td style="border: 1px solid #000; padding: 3px; text-align: right;">${item.amount || (item.quantity * item.rate).toFixed(2)}</td>
        </tr>
      `).join('');

      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
      <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Work Order</title>
</head>
<body style="font-family: Arial, sans-serif; font-size: 10px; margin: 0; padding: 20px;">
    <div style="border: 2px solid #000; padding: 10px; width: 600px; margin: auto;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #000; padding-bottom: 5px;">
                <div style="display: flex; align-items: center;">
                    <img src="https://example.com/logo.png" alt="Merraki Expert Logo" style="width: 50px; height: auto; margin-right: 10px;">
                    <div style="font-size: 14px; font-weight: bold;">MERRAKI EXPERT</div>
                </div>
                <div style="text-align: right;">
                    <div style="margin-bottom: 2px;"><strong>Work No:</strong> ${workOrderData.work_order_number}</div>
                    <div style="margin-bottom: 2px;"><strong>Date:</strong> ${formatDate(workOrderData.work_order_date)}</div>
                    <div><strong>JO ID:</strong> ${workOrderData.job_order_id || 'N/A'}</div>
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
            Work Order
        </div>

        <table style="width: 100%; border-collapse: collapse;">
            <tbody>
                <tr>
                    <td style="width: 25%; border: 1px solid #000; padding: 3px; background-color: #f2f2f2; font-weight: bold;">Customer:</td>
                    <td style="width: 25%; border: 1px solid #000; padding: 3px;">${customer.customer_name || 'N/A'}</td>
                    <td style="width: 25%; border: 1px solid #000; padding: 3px; background-color: #f2f2f2; font-weight: bold;">GSTIN</td>
                    <td style="width: 25%; border: 1px solid #000; padding: 3px;">${customer.gst || 'N/A'}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #000; padding: 3px; background-color: #f2f2f2; font-weight: bold;">Address:</td>
                    <td style="border: 1px solid #000; padding: 3px;">${customer.billing_address1 || 'N/A'}</td>
                    <td style="border: 1px solid #000; padding: 3px; background-color: #f2f2f2; font-weight: bold;">Kind Attn.</td>
                    <td style="border: 1px solid #000; padding: 3px;">${customer.billing_recipient_name || 'N/A'}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #000; padding: 3px; background-color: #f2f2f2; font-weight: bold;">Mobile No.</td>
                    <td style="border: 1px solid #000; padding: 3px;">${workOrderData.customer_phone || 'N/A'}</td>
                    <td style="border: 1px solid #000; padding: 3px; background-color: #f2f2f2; font-weight: bold;">Email</td>
                    <td style="border: 1px solid #000; padding: 3px; color: #00f;">${workOrderData.customer_email || 'N/A'}</td>
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
                ${itemsHTML}
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
                            <td style="border: 1px solid #000; padding: 3px; text-align: right;">${sub_total.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid #000; padding: 3px; font-weight: bold; background-color: #f2f2f2;">CGST (9%)</td>
                            <td style="border: 1px solid #000; padding: 3px; text-align: right;">${cgst.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid #000; padding: 3px; font-weight: bold; background-color: #f2f2f2;">SGST (9%)</td>
                            <td style="border: 1px solid #000; padding: 3px; text-align: right;">${sgst.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid #000; padding: 3px; font-weight: bold; background-color: #f2f2f2;">IGST</td>
                            <td style="border: 1px solid #000; padding: 3px; text-align: right;">0.00</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid #000; padding: 3px; font-weight: bold; background-color: #f2f2f2;">Freight Charges</td>
                            <td style="border: 1px solid #000; padding: 3px; text-align: right;">Extra at Actual</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid #000; padding: 3px; font-weight: bold; background-color: #f2f2f2;">Total (Tax Inclusive)</td>
                            <td style="border: 1px solid #000; padding: 3px; text-align: right;">${grand_total.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid #000; padding: 3px; font-weight: bold; background-color: #f2f2f2; text-align: right;">ROUNDUP</td>
                            <td style="border: 1px solid #000; padding: 3px; text-align: right;">${Math.round(grand_total).toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div style="border: 1px solid #000; padding: 3px; margin-top: 5px;">
            <strong>Amount (in words) :</strong> ${numberToWords(Math.round(grand_total))} Rupees Only
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
              <Avatar src="https://i.pravatar.cc/40?img=1" />
              <Typography fontSize={14}>Admin name</Typography>
              <ArrowDropDownIcon />
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