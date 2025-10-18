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
  <meta charset="UTF-8" /> 
  <meta name="viewport" content="width=device-width, initial-scale=1.0" /> 
  <title>Work Order - Meraki Expert</title> 
  <link 
    rel="stylesheet" 
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css" 
    integrity="sha512
2SwdPD6INVrV/lHTZbO2nodKhrnDdJK9/kg2XD1r9uGqPo1cUbujc+IYdlYdEErWNu69gVcYgdxl
 mVmzTWnetw==" 
    crossorigin="anonymous" 
    referrerpolicy="no-referrer" 
  /> 
   
</head> 
<style> 
  /* Reset */ 
* { 
  margin: 0; 
  padding: 0; 
  box-sizing: border-box; 
} 
 
/* Body */ 
body { 
  font-family: Arial, sans-serif; 
  background-color: #f5f5f5; 
  padding: 10px; 
  color: #222; 
} 
 
/* Work Order Container */ 
.work-order { 
  background: #fff; 
  border: 1px solid #ccc; 
  max-width: 900px; 
  margin: auto; 
  padding: 20px; 
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); 
} 
 
/* Header */ 
header { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  border-bottom: 3px solid #1c71b8; 
  padding-bottom: 10px; 
  flex-wrap: wrap; 
} 
 
header img { 
  height: 60px; 
  margin-right: 10px; 
} 
 
header .header-left { 
  display: flex; 
  align-items: center; 
  gap: 10px; 
} 
 
.first{ 
  color: #1c71b8; 
  text-align: center; 
} 
header h2 { 
  color: #1c71b8; 
} 
 
.header-right p { 
  font-size: 12px; 
  text-align: justify; 
  padding-right: 35px; 
} 
 
/* GST Info */ 
.gst-info { 
  display: flex; 
  justify-content: space-between; 
  border-bottom: 2px solid #000; 
  font-size: 12px; 
  padding: 5px 0; 
f
 lex-wrap: wrap; 
} 
/* Address */ 
.address-block { 
border-bottom: 2px solid #000; 
padding: 10px 0; 
font-size: 12px; 
} 
/* Table */ 
.table-container { 
overflow-x: auto; 
} 
table { 
width: 100%; 
border-collapse: collapse; 
font-size: 11px; 
margin: 15px 0; 
} 
th, td { 
border: 1px solid #999; 
padding: 6px; 
text-align: left; 
} 
th { 
background-color: #e5eff8; 
} 
.text-right { 
text-align: right; 
} 
/* Terms */ 
.terms { 
border: 1px solid #ccc; 
padding: 10px; 
background: #f8f8f8; 
border-radius: 4px; 
} 
.terms h3 { 
color: #1c71b8; 
margin-bottom: 10px; 
} 
.terms ul { 
list-style: none; 
} 
.terms li { 
border-bottom: 1px solid #ddd; 
padding: 4px 0; 
  font-size: 11px; 
} 
 
/* Footer */ 
footer { 
  display: flex; 
  justify-content: space-between; 
  font-size: 12px; 
  margin-top: 20px; 
  border-top: 2px solid #1c71b8; 
  padding-top: 10px; 
} 
 
/* Contact Info */ 
.address { 
  
     display: flex; 
     justify-content: space-between; 
     padding-bottom: 40px; 
     bottom: 10px; 
    } 
 
    .highlight { 
      color: #1c71b8; 
      font-weight: bold; 
    } 
    .address-section{ 
      display: flex; 
       
   
    } 
.office-address{ 
  width: 500px; 
  font-size: 12px; 
  padding-bottom: 40px; 
 
} 
.registerd-address{ 
 width: 400; 
  font-size: 12px; 
  padding-left: 20px; 
 
} 
.map{ 
  padding-top: 60px; 
} 
.office-address p:first-child { 
  font-weight: bold; 
  color: #4caf50; 
  padding-bottom: 30px; 
} 
  .registerd-address p:first-child{ 
     font-weight: bold; 
  color: #4caf50; 
  padding-bottom: 30px; 
  } 
 
.contact-bar{ 
  display: flex; 
  position: absolute; 
  color: white; 
  font-weight: bold; 
  font-size: 13px; 
  height: 30px; 
  width: 450px; 
  top: 1040px; 
  justify-content: space-between; 
  align-items: center; 
  padding: 10px 20px; 
  flex-wrap: wrap; 
   
 
} 
.web-bar{ 
  position: absolute; 
  height: 5px; 
  width: 430px; 
  left:430px; 
  margin-bottom: 7px; 
   
   
} 
.contact-left{ 
  background-color: #a6ce39; 
padding: 10px ; 
width: 470px; 
height: 35px; 
display: flex; 
align-items: center; 
f
 lex-wrap: wrap; 
gap: 15px; 
font-size: 14px; 
} 
.contact-right{ 
background-color: #0b3d91; 
f
 lex: 1; 
text-align: center; 
padding: 10px 20px; 
display: flex; 
align-items: center; 
f
 lex-wrap: wrap; 
gap: 15px; 
font-size: 14px; 
bottom: 20px; 
} 
a{ 
color: white; 
text-decoration: underline; 
transition: color 0.3s; 
} 
.contact-left i, .contact-right i{ 
  margin-right: 6px; 
} 
 
/*      Responsive Layouts */ 
@media (max-width: 768px) { 
  .contact-bar{ 
    flex-direction: column; 
    text-align: center; 
  } 
  header { 
    flex-direction: column; 
    text-align: center; 
  } 
 
  .gst-info { 
    flex-direction: column; 
    align-items: flex-start; 
  } 
 
  .address { 
    flex-direction: column; 
    gap: 10px; 
  } 
   
 
  table { 
    font-size: 10px; 
  } 
} 
 
@media (max-width: 480px) { 
  body { 
    padding: 5px; 
  } 
 
  header h2 { 
    font-size: 1.2rem; 
  } 
 
  .work-order { 
    padding: 10px; 
  } 
 
  table { 
    font-size: 9px; 
  } 
 
  footer { 
    flex-direction: column; 
    text-align: center; 
    gap: 5px; 
  } 
  .contact-left, .contact-right{ 
    flex-direction: column; 
    gap: 8px; 
    font-size: 13px; 
  } 
  .contact-bar{ 
    padding: 15px 10px; 
  } 
} 
</style> 
<body> 
  <div class="work-order"> 
 
    <!-- Header --> 
    <header> 
      <div class="header-left"> 
        <img src="C:\Users\USER\Documents\ERP-Software\front\src\assets\mera.jpg" 
alt="Merraki Expert Logo" /> 
        <h2>MERRAKI EXPERT</h2> 
      </div> 
      <div class="header-right"> 
        <p><strong>Work No:</strong> WO-1023</p> 
        <p><strong>Date:</strong> 14-Oct-2025</p> 
        <p><strong>JO ID:</strong> 102</p> 
      </div> 
    </header> 
 
    <div class="gst-info"> 
      <p><strong>GSTIN:</strong> 27AKUPY6544R1ZM</p> 
      <p><strong>UDYAM-MH-20-0114278</strong></p> 
    </div> 
 
    <!-- Address --> 
    <div class="address-block"> 
      <div> 
        <strong>Billing Address:</strong> 
        <p>101, 2nd Floor, Shri Sai Apartment, Near Kachore Lawn, Nagpur - 440015</p> 
      </div> 
      <div> 
        <strong>Shipping Address:</strong> 
        <p>Meraki Expert, 101, 2nd Floor, Shri Sai Apartment, Near Kachore Lawn, Nagpur - 
440015</p> 
      </div> 
    </div> 
 
    <h3 class="first">Work Order against (M/s. Jai Maa Santoshi Cold Storage, Goa.)</h3> 
 
    <!-- Table --> 
    <div class="table-container"> 
      <table> 
        <thead> 
          <tr> 
            <th>S.No.</th> 
            <th>Description</th> 
            <th>Quantity</th> 
            <th>Unit</th> 
            <th>Rate</th> 
            <th>Amount</th> 
          </tr> 
        </thead> 
        <tbody> 
          <tr> 
            <td>1</td> 
            <td>PUF Insulated Wall & Roof Panel Installation with Finishing.</td> 
            <td>4430.63</td> 
            <td>Sq.Mtr.</td> 
            <td>140</td> 
            <td>₹ 620,288.20</td> 
          </tr> 
          <tr><td>2</td><td>Cutouts included if 
any</td><td></td><td></td><td></td><td></td></tr> 
          <tr><td>3</td><td>Loading, Unloading & Lifting 
included</td><td></td><td></td><td></td><td></td></tr> 
          <tr><td>4</td><td>Material Handling on site 
included</td><td></td><td></td><td></td><td></td></tr> 
          <tr><td>5</td><td>Accessories Handling 
included</td><td></td><td></td><td></td><td></td></tr> 
          <tr> 
            <td colspan="5" class="text-right"><strong>Total Amount</strong></td> 
            <td>₹620,288.20</td> 
          </tr> 
          <tr> 
            <td colspan="6" class="text-right"><strong>Rs. Six Lakh Twenty Thousand Two 
Hundred Eight and Twenty Paisa Only</strong></td> 
          </tr> 
        </tbody> 
      </table> 
    </div> 
 
    <!-- Terms --> 
    <div class="terms"> 
      <h3>Terms & Conditions</h3> 
      <ul> 
        <li>Advance Payment 20%.</li> 
        <li>80% payment after 15 Days WCC Report.</li> 
        <li>Payment as per work order.</li> 
        <li>Measurement as per installation of Panel (Sq.Mtr).</li> 
        <li>Ensure minimum wastage of materials.</li> 
        <li>Work quality must meet standards.</li> 
        <li>All work with safety equipment.</li> 
        <li>PPE Kit compulsory on site.</li> 
        <li>No smoking, alcohol, or chewing Gutkha on site.</li> 
        <li>No child labour allowed.</li> 
        <li>Work per approved drawing.</li> 
        <li>Misconduct will be penalized.</li> 
        <li>Tools ready with safety before site work.</li> 
        <li>Debris cleaning mandatory after installation.</li> 
      </ul> 
    </div> 
 
    <!-- Footer --> 
    <footer> 
      <div> 
        <strong>Contractor Signature</strong> 
      </div> 
      <div> 
        <strong>Meraki Expert</strong> 
      </div> 
    </footer> 
 
    <!-- Contact Section --> 
    
    <div class="address"> 
      <div class="address-section"> 
        <div class="office-address"> 
        <div class="map"> <p><i class="fas fa-map-marker-alt"></i>Office Address:</p></div>  
          <p> 101, 2nd Floor, Shri Sai Apartment, Near Kachore Lawn, Manish Nagar, Nagpur - 
440015 (MH)</p> 
        </div> 
        <div class="registerd-address"> 
        <div class="map"><p><i class="fas fa-map-marker-alt"></i>Registered Address</p></div 
        >3863, Prabhag No.5, Ganesh Square, Teacher Colony Road, Deori, Gondia - 441901</> 
      </div> 
      </div> 
       
      <div class="contact-bar"> 
        <div class="contact-left"> 
          <i class="fas fa-phone-alt"></i>+91 77220 01802 
           
           
            <i class="fas fa-envelope"></i>info@merakiexpert.in 
           
          </div> 
      
      <div class="web-bar"> 
        <div class="contact-right"><a href="https://www.mrakiexpert.in" target="_blank"> 
          <i class="fas fa-globe"></i> www.merakiexpert.in 
          </a> 
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