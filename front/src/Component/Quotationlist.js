import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tabs,
  Tab,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Pagination,
  Checkbox,
  TextField,
  Avatar,
  Paper,
  InputBase,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Sidebar from "./Sidebar";
import AddIcon from "@mui/icons-material/Add";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import axios from 'axios';


export default function QuotationListPage() {
  const navigator = useNavigate();
  const [tab, setTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  React.useEffect(() => {
    const fetchQuotations = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get('http://localhost:5000/api/quotation');
        setQuotations(res.data);
      } catch (err) {
        setError('Failed to fetch quotations');
      } finally {
        setLoading(false);
      }
    };
    fetchQuotations();
  }, []);

  
// Download PDF
const handleDownloadPdf = async () => {
  if (!selectedQuote) return;
  try {
    console.log("=== HTML Template Generation Started ===");
    console.log("Selected quote:", selectedQuote);
    
    // Extract data directly from selectedQuote object
    const safeQuoteData = {
      quotation_id: selectedQuote.quotation_id || "QT-001",
      quote_number: selectedQuote.quote_number || selectedQuote.quotation_id || "QT-001",
      quotation_date: selectedQuote.quotation_date ? selectedQuote.quotation_date.slice(0, 10) : "2025-01-01",
      expiry_date: selectedQuote.expiry_date ? selectedQuote.expiry_date.slice(0, 10) : "2025-02-01",
      customer_name: selectedQuote.customer_name || "Sample Customer",
      subject: selectedQuote.subject || "Sample Quotation Subject",
      customer_notes: selectedQuote.customer_notes || "Thanks for your business.",
      terms_and_conditions: selectedQuote.terms_and_conditions || "Standard terms and conditions apply.",
      status: selectedQuote.status || "Draft",
      grand_total: selectedQuote.grand_total || "0.00",
      sub_total: selectedQuote.sub_total || "0.00",
      cgst: selectedQuote.cgst || "0.00",
      sgst: selectedQuote.sgst || "0.00"
    };

    // Extract customer details from selectedQuote
    const safeCustomerDetails = {
      customer_name: selectedQuote.customer_name || "Sample Customer",
      company_name: selectedQuote.company_name || "Sample Company Ltd",
      billing_address: selectedQuote.billing_address || "123 Customer Street, Customer City, Customer State 123456",
      phone: selectedQuote.phone || "+91-9876543210",
      email: selectedQuote.email || "customer@example.com"
    };
    
    console.log("Safe quote data:", safeQuoteData);
    console.log("Safe customer details:", safeCustomerDetails);

    // Create HTML template with data
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Quotation - ${safeQuoteData.quote_number}</title>
        <style>
          body {
            margin: 0;
            padding: 20px;
            font-family: Arial, sans-serif;
            font-size: 10px;
          }
          .container {
            border: 2px solid #000;
            padding: 10px;
            width: 600px;
            margin: auto;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #000;
            padding-bottom: 5px;
            margin-bottom: 10px;
          }
          .logo-container {
            display: flex;
            align-items: center;
          }
          .logo {
            width: 200px;
            height: auto;
            margin-top: -70px;
            margin-bottom: -70px;
          }
          .company-info {
            text-align: center;
          }
          .company-info h1 {
            margin: 0;
            font-size: 18px;
            color: #004085;
          }
          .company-info p {
            margin: 2px 0;
            font-size: 10px;
          }
          .quotation-details {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
          }
          .quotation-left, .quotation-right {
            width: 48%;
          }
          .customer-section {
            border: 1px solid #ccc;
            padding: 10px;
            margin: 10px 0;
            background-color: #f9f9f9;
          }
          .customer-section h3 {
            margin: 0 0 10px 0;
            font-size: 12px;
            color: #004085;
          }
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
          }
          .items-table th,
          .items-table td {
            border: 1px solid #ccc;
            padding: 5px;
            text-align: left;
          }
          .items-table th {
            background-color: #004085;
            color: white;
            font-weight: bold;
          }
          .items-table td:nth-child(2),
          .items-table td:nth-child(3),
          .items-table td:nth-child(4),
          .items-table td:nth-child(5) {
            text-align: center;
          }
          .items-table td:nth-child(6) {
            text-align: right;
          }
          .totals-section {
            margin: 10px 0;
            text-align: right;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            margin: 2px 0;
            padding: 2px 0;
          }
          .total-row.total {
            font-weight: bold;
            font-size: 12px;
            border-top: 1px solid #ccc;
            padding-top: 5px;
          }
          .terms-section {
            border: 1px solid #ccc;
            padding: 10px;
            margin: 10px 0;
            background-color: #f9f9f9;
          }
          .terms-section h3 {
            margin: 0 0 10px 0;
            font-size: 12px;
            color: #004085;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px solid #ccc;
            font-size: 9px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo-container">
              <img src="/static/media/ui.405d9b691b910181ce2e.png" alt="Meraki Expert Logo" class="logo">
            </div>
            <div class="company-info">
              <h1>MERRAKI EXPERT</h1>
              <p>GSTIN: 27AKUPY6544R1ZM | UDYAM-MH-20-0114278</p>
              <p>101, 2nd Floor, Shree Sai Apartment, Near Kachore Lawn, Manish Nagar, Nagpur - 440015 (MH)</p>
            </div>
          </div>
          
          <div class="quotation-details">
            <div class="quotation-left">
              <h2 style="margin: 0; color: #004085; font-size: 16px;">QUOTATION</h2>
              <p><strong>Quotation #:</strong> ${safeQuoteData.quote_number}</p>
              <p><strong>Date:</strong> ${safeQuoteData.quotation_date}</p>
              <p><strong>Expiry:</strong> ${safeQuoteData.expiry_date}</p>
              <p><strong>Status:</strong> ${safeQuoteData.status}</p>
            </div>
            <div class="quotation-right">
              <p><strong>Subject:</strong> ${safeQuoteData.subject}</p>
            </div>
          </div>
          
          <div class="customer-section">
            <h3>Bill To:</h3>
            <p><strong>Customer:</strong> ${safeCustomerDetails.customer_name}</p>
            <p><strong>Company:</strong> ${safeCustomerDetails.company_name}</p>
            <p><strong>Address:</strong> ${safeCustomerDetails.billing_address}</p>
            <p><strong>Phone:</strong> ${safeCustomerDetails.phone}</p>
            <p><strong>Email:</strong> ${safeCustomerDetails.email}</p>
          </div>
          
          <table class="items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Discount</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Sample Item</td>
                <td>1</td>
                <td>₹100.00</td>
                <td>₹0.00</td>
                <td>₹100.00</td>
              </tr>
            </tbody>
          </table>
          
          <div class="totals-section">
            <div class="total-row">
              <span>Sub Total:</span>
              <span>₹${safeQuoteData.sub_total}</span>
            </div>
            <div class="total-row">
              <span>CGST (9%):</span>
              <span>₹${safeQuoteData.cgst}</span>
            </div>
            <div class="total-row">
              <span>SGST (9%):</span>
              <span>₹${safeQuoteData.sgst}</span>
            </div>
            <div class="total-row total">
              <span>Grand Total:</span>
              <span>₹${safeQuoteData.grand_total}</span>
            </div>
          </div>
          
          <div class="terms-section">
            <h3>Terms & Conditions:</h3>
            <p>${safeQuoteData.terms_and_conditions}</p>
          </div>
          
          <div class="terms-section">
            <h3>Customer Notes:</h3>
            <p>${safeQuoteData.customer_notes}</p>
          </div>
          
          <div class="footer">
            <p>Generated by ERP Software | Meraki Expert</p>
            <p>Email: merakiexpert@gmail.com | Mobile: +91-8793484326 / +91-9130801011</p>
          </div>
        </div>
      </body>
      </html>
    `);
    
    printWindow.document.close();
    console.log("=== HTML Template Generated Successfully ===");
    
    // Auto print the window
    setTimeout(() => {
      printWindow.print();
    }, 500);
    
  } catch (err) {
    console.error('HTML template generation error:', err);
    alert('Failed to generate quotation template');
  }
};


const handlePrintQuotation = () => {
  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quotation - ${quoteData.quote_number}</title>
</head>
<body style="font-family: Arial, sans-serif; font-size: 10px; margin: 0; padding: 20px;">
    <div style="border: 2px solid #000; padding: 10px; width: 600px; margin: auto;">
        <div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 5px;">
            <img src="/static/media/ui.405d9b691b910181ce2e.png" alt="Merraki Expert Logo" style="width: 200px; height: auto; margin-Top: -70px; margin-Bottom: -70px;">
            <div style="font-size: 14px; font-weight: bold;">MERRAKI EXPERT</div>
            <div style="font-size: 10px;">A Cool Reality...</div>
        </div>

        <div style="text-align: center; border-bottom: 2px solid #000; padding: 5px 0;">
            <div style="font-size: 10px;"><strong>GSTIN:</strong> ${gstin} | <strong>${udyam}</strong> | <strong>${iso}</strong></div>
            <div style="font-size: 10px;">101, 2nd Floor, Shree Sai Apartment, Near Kachore Lawn, Manish Nagar, Nagpur - 440015 (MH)</div>
            <div style="font-size: 10px; margin-top: 5px;"><strong>Quotation Ref. No. ME/BESPL/1057/2025-26</strong></div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-top: 5px;">
            <tbody>
                <tr>
                    <td style="width: 15%; border: 1px solid #000; padding: 3px; background-color: #f2f2f2; font-weight: bold;">Company</td>
                    <td style="width: 35%; border: 1px solid #000; padding: 3px;">M/S Blueladder EPC Solutions Pvt. Ltd</td>
                    <td style="width: 20%; border: 1px solid #000; padding: 3px; background-color: #f2f2f2; font-weight: bold;">Date</td>
                    <td style="width: 30%; border: 1px solid #000; padding: 3px;">25-Aug-25</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #000; padding: 3px; background-color: #f2f2f2; font-weight: bold;">Contact Person</td>
                    <td style="border: 1px solid #000; padding: 3px;">Ms. Komal</td>
                    <td style="border: 1px solid #000; padding: 3px; background-color: #f2f2f2; font-weight: bold;">Location</td>
                    <td style="border: 1px solid #000; padding: 3px;">6th Floor, Landmark building, Ramdaspeth, Nagpur, Maharashtra 440010</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #000; padding: 3px; background-color: #f2f2f2; font-weight: bold;">Contact Number</td>
                    <td style="border: 1px solid #000; padding: 3px;">7666900371</td>
                    <td style="border: 1px solid #000; padding: 3px; background-color: #f2f2f2; font-weight: bold;">Meraki Expert</td>
                    <td style="border: 1px solid #000; padding: 3px;">${merakiExpert}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #000; padding: 3px; background-color: #f2f2f2; font-weight: bold;">E-mail</td>
                    <td style="border: 1px solid #000; padding: 3px;"><a href="mailto:komal.e@blueladderepc.com" style="color: #00f;">komal.e@blueladderepc.com</a></td>
                    <td style="border: 1px solid #000; padding: 3px; background-color: #f2f2f2; font-weight: bold;">E-mail</td>
                    <td style="border: 1px solid #000; padding: 3px;"><a href="mailto:${merakiEmail}" style="color: #00f;">${merakiEmail}</a></td>
                </tr>
            </tbody>
        </table>

        <div style="text-align: center; font-weight: bold; padding: 5px 0; border-top: 2px solid #000; border-bottom: 2px solid #000; margin-top: 5px;">
            Quotation - Supply & Installation of PUR Panel.
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-top: 5px;">
            <thead>
                <tr style="background-color: #f2f2f2;">
                    <th style="border: 1px solid #000; padding: 3px; width: 5%;">Sr. No.</th>
                    <th style="border: 1px solid #000; padding: 3px; width: 50%;">Description</th>
                    <th style="border: 1px solid #000; padding: 3px; width: 10%;">Qty.</th>
                    <th style="border: 1px solid #000; padding: 3px; width: 10%;">UOM</th>
                    <th style="border: 1px solid #000; padding: 3px; width: 15%;">Rate</th>
                    <th style="border: 1px solid #000; padding: 3px; width: 15%;">Total</th>
                </tr>
            </thead>
            <tbody>
                <tr style="background-color: #f2f2f2;">
                    <td colspan="6" style="border: 1px solid #000; padding: 3px; font-weight: bold;">PUR Panel with accessories</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #000; padding: 3px; text-align: center;">1</td>
                    <td style="border: 1px solid #000; padding: 3px;">Supply of Continuous Line - 40mm thick PUR Wall Panel Both side 0.5mm PPGI lamination - Density: 40(+/-2) Kg/Cum - RAL-9002, Panel Cover Width: 1000mm.</td>
                    <td style="border: 1px solid #000; padding: 3px; text-align: center;">792.29</td>
                    <td style="border: 1px solid #000; padding: 3px; text-align: center;">Sq.M</td>
                    <td style="border: 1px solid #000; padding: 3px; text-align: right;">1501</td>
                    <td style="border: 1px solid #000; padding: 3px; text-align: right;">11,89,227.29</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #000; padding: 3px; text-align: center;">2</td>
                    <td style="border: 1px solid #000; padding: 3px;">Supply of PPGI Falshings such as Bottom-U Channel, Inside/Outside Flashings, Top outside Flashing, Flat Strip etc.</td>
                    <td style="border: 1px solid #000; padding: 3px; text-align: center;">350.00</td>
                    <td style="border: 1px solid #000; padding: 3px; text-align: center;">Kgs.</td>
                    <td style="border: 1px solid #000; padding: 3px; text-align: right;">160</td>
                    <td style="border: 1px solid #000; padding: 3px; text-align: right;">56,000.00</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #000; padding: 3px; text-align: center;">3</td>
                    <td style="border: 1px solid #000; padding: 3px;">Supply of Panel fixing Accessories like Silicon Sealant,SDS, ALU. POP Rivet, Sleeve with Screw, etc.</td>
                    <td style="border: 1px solid #000; padding: 3px; text-align: center;">792.29</td>
                    <td style="border: 1px solid #000; padding: 3px; text-align: center;">Sq.M</td>
                    <td style="border: 1px solid #000; padding: 3px; text-align: right;">120</td>
                    <td style="border: 1px solid #000; padding: 3px; text-align: right;">95,074.80</td>
                </tr>
                <tr>
                    <td colspan="4" style="border: 1px solid #000; padding: 3px; font-weight: bold; text-align: right;">Total Basic</td>
                    <td colspan="2" style="border: 1px solid #000; padding: 3px; text-align: right;">₹ 13,40,302.09</td>
                </tr>
                <tr>
                    <td colspan="4" style="border: 1px solid #000; padding: 3px; font-weight: bold; text-align: right;">GST @18%</td>
                    <td colspan="2" style="border: 1px solid #000; padding: 3px; text-align: right;">₹ 2,41,254.38</td>
                </tr>
                <tr>
                    <td colspan="4" style="border: 1px solid #000; padding: 3px; font-weight: bold; text-align: right;">Freight</td>
                    <td colspan="2" style="border: 1px solid #000; padding: 3px; text-align: right;">Extra At Actual.</td>
                </tr>
                <tr>
                    <td colspan="4" style="border: 1px solid #000; padding: 3px; font-weight: bold; text-align: right;">Grand Total</td>
                    <td colspan="2" style="border: 1px solid #000; padding: 3px; text-align: right;">₹ 15,81,557.00</td>
                </tr>
            </tbody>
        </table>

        <table style="width: 100%; border-collapse: collapse; margin-top: 5px;">
            <thead>
                <tr style="background-color: #f2f2f2;">
                    <th style="border: 1px solid #000; padding: 3px; width: 5%;">Sr. No.</th>
                    <th style="border: 1px solid #000; padding: 3px; width: 50%;">Description</th>
                    <th style="border: 1px solid #000; padding: 3px; width: 10%;">Qty.</th>
                    <th style="border: 1px solid #000; padding: 3px; width: 10%;">UOM</th>
                    <th style="border: 1px solid #000; padding: 3px; width: 15%;">Rate</th>
                    <th style="border: 1px solid #000; padding: 3px; width: 15%;">Total</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; padding: 3px; text-align: center;">1</td>
                    <td style="border: 1px solid #000; padding: 3px;">Installation labour Charges for PUR Panels with accessories.</td>
                    <td style="border: 1px solid #000; padding: 3px; text-align: center;">792.29</td>
                    <td style="border: 1px solid #000; padding: 3px; text-align: center;">Sq.Mtr</td>
                    <td style="border: 1px solid #000; padding: 3px; text-align: right;">250.00</td>
                    <td style="border: 1px solid #000; padding: 3px; text-align: right;">1,98,072.50</td>
                </tr>
                <tr>
                    <td colspan="4" style="border: 1px solid #000; padding: 3px; font-weight: bold; text-align: right;">Total Basic</td>
                    <td colspan="2" style="border: 1px solid #000; padding: 3px; text-align: right;">₹ 1,98,072.50</td>
                </tr>
                <tr>
                    <td colspan="4" style="border: 1px solid #000; padding: 3px; font-weight: bold; text-align: right;">GST @18%</td>
                    <td colspan="2" style="border: 1px solid #000; padding: 3px; text-align: right;">₹ 35,653.05</td>
                </tr>
                <tr>
                    <td colspan="4" style="border: 1px solid #000; padding: 3px; font-weight: bold; text-align: right;">Grand Total</td>
                    <td colspan="2" style="border: 1px solid #000; padding: 3px; text-align: right;">₹ 2,33,725.55</td>
                </tr>
            </tbody>
        </table>

        <div style="border: 2px solid #000; margin-top: 10px; padding: 5px;">
            <div style="text-align: center; font-weight: bold; border-bottom: 1px solid #000; padding-bottom: 5px; margin-bottom: 5px; color: #073d82 ;">COMMERCIAL TERMS & CONDITIONS</div>
            <div style="display: flex;">
                <div style="width: 25%; font-weight: bold;">Delivery Period</div>
                <div style="width: 75%;">: ${quotation.delivery_period || '3 to 4 weeks from the date of technically and commercially clear order.'}</div>
            </div>
            <div style="display: flex;">
                <div style="width: 25%; font-weight: bold;">Installation Period</div>
                <div style="width: 75%;">: ${quotation.installation_period || '2 to 3 weeks'}</div>
            </div>
            <div style="display: flex;">
                <div style="width: 25%; font-weight: bold;">Transportation</div>
                <div style="width: 75%;">: ${quotation.transportation || 'Extra at Actual'}</div>
            </div>
            <div style="display: flex;">
                <div style="width: 25%; font-weight: bold;">Payment Terms</div>
                <div style="width: 75%;">: ${quotation.payment_terms_html || 'Supply/Installation Terms<br>a) 50% Advance along with Purchase order<br>b) 45% Against performing invoice prior to dispatch<br>c) 5% after successfull Installation and commissioning'}</div>
            </div>
            <div style="display: flex;">
                <div style="width: 25%; font-weight: bold;">Warranty</div>
                <div style="width: 75%;">: ${quotation.warranty || 'Offer a standard warranty of 15 months from date of dispatch or 12 months from date of satisfactory installation whichever is earlier'}</div>
            </div>
            <div style="display: flex;">
                <div style="width: 25%; font-weight: bold;">Validity</div>
                <div style="width: 75%;">: ${quotation.validity || 'Our offer shall remain valid for 15 days'}</div>
            </div>
            <div style="display: flex;">
                <div style="width: 25%; font-weight: bold;">Exclusions</div>
                <div style="width: 75%;">: ${quotation.exclusions || 'Civil work, MS work, Loading / Unloading at site, Power supply, Adequate lighting arrangement for installation activities, Scrap folding, Scissor lift.'}</div>
            </div>
        </div>
        
        <div style="text-align: right; margin-top: 10px;">
            <div style="font-weight: bold; margin-bottom: 20px;">Best Regards,</div>
            <div style="font-weight: bold; margin-bottom: 5px;">${quotation.sales_person || 'Niraj Khicher'}</div>
            <div>Mob. No. ${quotation.sales_person_mobile || merakiPhone}</div>
        </div>

        <div style="text-align: center; border-top: 1px solid #000; padding-top: 5px; margin-top: 10px;">
            <div style="font-size: 10px;">
                Email: merakkiexpert@gmail.com | Mobile: 8793484326, 9130801011 | www.merakkiexpert.in
            </div>
        </div>
    </div>
</body>
</html>
  `);
  printWindow.document.close();
  printWindow.print();
};

  const handleTabChange = (_, newVal) => setTab(newVal);

  const handleMenuClick = (event, quote) => {
    setAnchorEl(event.currentTarget);
    setSelectedQuote(quote);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedQuote(null);
  };

  const handleAddQuotation = () => {
    navigator("/add-Quotation");
  };

  const handleSendEmail = () => {
  const subject = encodeURIComponent(`Quotation ${selectedQuote?.quoteNumber}`);
  const body = encodeURIComponent(
    `Hello,\n\nPlease find the quotation details below:\n\n` +
    `Quotation #: ${selectedQuote?.quoteNumber}\n` +
    `Customer: ${selectedQuote?.customer}\n` +
    `Created Date: ${selectedQuote?.createdDate}\n` +
    `Expiry Date: ${selectedQuote?.expiryDate}\n` +
    `Status: ${selectedQuote?.status}\n` +
    `Amount: ${selectedQuote?.amount}\n\n` +
    `Thank you.`
  );
  
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
};

const handleDeleteQuotation = async () => {
  if (!selectedQuote) return;
  if (!window.confirm('Are you sure you want to delete this quotation?')) return;
  try {
    await axios.delete(`http://localhost:5000/api/quotation/${selectedQuote.quotation_id}`);
    setQuotations((prev) => prev.filter(q => q.quotation_id !== selectedQuote.quotation_id));
    setAnchorEl(null);
    setSelectedQuote(null);
  } catch (err) {
    alert('Failed to delete quotation');
  }
};

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />

      <Box sx={{ flex: 1, bgcolor: "#f9fafc", minHeight: "100vh" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            mt: 1,
            px: 3,
          }}
        >
          <Typography color="text.secondary" fontSize="20px">
            Quatation
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
              <Avatar src="https://i.pravatar.cc/150?img=1" />
              <Typography fontSize={14}>Admin name</Typography>
              <ArrowDropDownIcon />
            </Box>
          </Box>
        </Box>
        <Box sx={{ px: 2, py: 2 }}>
          <Paper sx={{ p: 1, borderRadius: 2 }}>
            <Box
              sx={{
                display: "flex",
                px: 4,
                py: 2,
                justifyContent: "space-between",
                borderBottom: "1px solid #e0e0e0",
              }}
            >
              <Typography variant="h6" fontWeight={600}>
                Products & Services
              </Typography>
              <Button
                sx={{ backgroundColor: "#003366" }}
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddQuotation}
              >
                New Quotation
              </Button>
            </Box>
            <Box py={3} px={4} flex={1}>
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Tabs
                  value={tab}
                  onChange={handleTabChange}
                  sx={{
                    "& .MuiTab-root": {
                      textTransform: "none",
                      bgcolor: "#f1f1f1",
                      borderRadius: 2,
                      mr: 1,
                      textDecoration: "none",
                    },
                    "& .Mui-selected": {
                      bgcolor: "#004085",
                      color: "white !important",
                      textDecoration: "none",
                    },
                    "& .MuiTabs-indicator": {
                      display: "none",
                    },
                  }}
                >
                  <Tab label="All Quotation" />
                  <Tab label="Sent Quotation" />
                  <Tab label="Draft Quotation" />
                </Tabs>
                <Box mb={2} maxWidth={350}>
                  <TextField
                    fullWidth
                    placeholder="Search by quotation no, customer name..."
                    size="small"
                  />
                </Box>
              </Grid>

              <Table sx={{ bgcolor: "#fff", borderRadius: 2 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f5f6fa" }}>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>Quotation#</TableCell>
                    <TableCell>Customer Name</TableCell>
                    <TableCell>Created Date</TableCell>
                    <TableCell>Expiry Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Bill Amount</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={8}>Loading...</TableCell></TableRow>
                  ) : error ? (
                    <TableRow><TableCell colSpan={8}>{error}</TableCell></TableRow>
                  ) : (
                    quotations
                      .filter((q) => {
                        if (tab === 1) return q.status === "Sent";
                        if (tab === 2) return q.status === "Draft";
                        return true;
                      })
                      .map((q) => (
                        <TableRow key={q.quotation_id} hover>
                          <TableCell>
                            <Checkbox />
                          </TableCell>
                          <TableCell sx={{ color: "#007bff", fontWeight: 500 }}>
                            {q.quotation_id}
                          </TableCell>
                          <TableCell>{q.customer_name}</TableCell>
                          <TableCell>{q.quotation_date}</TableCell>
                          <TableCell>{q.expiry_date}</TableCell>
                          <TableCell>
                            <Chip
                              label={q.status || 'Draft'}
                              size="small"
                              color={q.status === "Sent" ? "success" : "default"}
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>{q.grand_total ? `₹${q.grand_total}` : ''}</TableCell>
                          <TableCell align="center">
                            <IconButton onClick={(e) => handleMenuClick(e, q)}>
                              <MoreVertIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>

              <Box mt={3} display="flex" justifyContent="space-between">
                <Typography variant="body2">
                  Showing 1 to 15 of 100 entries.
                </Typography>
                <Box display="flex" justifyContent="space-between">
                  <Pagination
                    count={5}
                    page={1}
                    sx={{
                      "& .MuiPaginationItem-root": {
                        color: "grey",
                        borderColor: "#004085",
                      },
                      "& .Mui-selected": {
                        backgroundColor: "#004085",
                        color: "#fff",
                        "&:hover": {
                          backgroundColor: "#003366",
                        },
                      },
                    }}
                  />
                </Box>
              </Box>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
              >
                <MenuItem
                  onClick={() => {
                    navigator(`/editQuotation/${selectedQuote?.quotation_id}`);
                    handleCloseMenu();
                  }}
                >Edit</MenuItem>
                <MenuItem
                  onClick={() => {
                    handleDownloadPdf();
                    handleCloseMenu();
                  }}
                >
                  Download the PDF
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handlePrintQuotation();
                    handleCloseMenu();
                  }}
                >
                  Print Quotation
                </MenuItem>
                <MenuItem onClick={() => { handleSendEmail(); handleCloseMenu(); }}>Send Email</MenuItem>
                <MenuItem
                  onClick={async () => {
                    if (!selectedQuote) return;
                    const newStatus = selectedQuote.status === 'Sent' ? 'Draft' : 'Sent';
                    try {
                      await axios.put(`http://localhost:5000/api/quotation/${selectedQuote.quotation_id}`, { status: newStatus });
                      setQuotations(prev => prev.map(q => q.quotation_id === selectedQuote.quotation_id ? { ...q, status: newStatus } : q));
                    } catch (err) {
                      alert('Failed to update status');
                    }
                    handleCloseMenu();
                  }}
                  style={{ color: selectedQuote?.status === 'Sent' ? '#1976d2' : '#388e3c' }}
                >
                  {selectedQuote?.status === 'Sent' ? 'Mark as Draft' : 'Mark as Sent'}
                </MenuItem>
                <MenuItem onClick={handleDeleteQuotation} style={{ color: 'red' }}>Delete</MenuItem>
              </Menu>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
