import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Divider,
  IconButton,
  Paper,
  Checkbox,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  InputBase,
  Breadcrumbs,
  CircularProgress,
  Alert,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import axios from "axios";
import UserMenu from './UserMenu';
const NewInvoicePage = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [customerTab, setCustomerTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [status, setStatus] = useState("Draft");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [subject, setSubject] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");
  const [termsAndConditions, setTermsAndConditions] = useState("");
  const [freight, setFreight] = useState(0);
  const [products, setProducts] = useState([]);
  const [units, setUnits] = useState([]);
  const [rows, setRows] = useState([
    { id: Date.now(), item: "", qty: 0, rate: 0, discount: 0, amount: 0, uom_amount: 0, uom_description: "" },
  ]);
  const [customerBillingStateCode, setCustomerBillingStateCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);
    
      try {
        // Fetch all data in parallel
        const [customersRes, invoiceNumberRes, productsRes, unitsRes] = await Promise.all([
 axios.get("http://168.231.102.6:5000/api/customers", { timeout: 10000 }),
 axios.get("http://168.231.102.6:5000/api/invoice/next-number", { timeout: 10000 }),
 axios.get("http://168.231.102.6:5000/api/products", { timeout: 10000 }),
 axios.get("http://168.231.102.6:5000/api/units", { timeout: 10000 })
        ]);
      
        console.log('Customers response:', customersRes.data);
        console.log('Invoice number response:', invoiceNumberRes.data);
        console.log('Products response:', productsRes.data);
        console.log('Units response:', unitsRes.data);
      
        setCustomers(customersRes.data || []);
        setInvoiceNumber(invoiceNumberRes.data.nextInvoiceNumber || 'INV-001');
        setProducts(productsRes.data || []);
        setUnits(unitsRes.data || []);
      
        setLoading(false);
      } catch (error) {
        console.error('Error fetching initial data:', error);
        setLoading(false);
      
        let errorMessage = "Failed to load required data. ";
      
        if (error.code === 'ECONNABORTED') {
          errorMessage += "Request timeout. Please check your internet connection.";
        } else if (error.response) {
          const status = error.response.status;
          if (status === 404) {
            errorMessage += "Backend endpoints not found. Please contact support.";
          } else if (status === 500) {
            errorMessage += "Server error. Please try again later.";
          } else {
            errorMessage += `Server error (${status}). Please try again.`;
          }
        } else if (error.request) {
          errorMessage += "Cannot connect to server. Please check if the backend server is running and accessible.";
        } else {
          errorMessage += error.message || "Unknown error occurred.";
        }
      
        setError(errorMessage);
      
        // Set default values to allow user to continue
        setCustomers([]);
        setInvoiceNumber('INV-001');
        setProducts([]);
        setUnits([]);
      }
    };
  
    fetchInitialData();
  }, []);
const handlePreview = () => {
    try {
      // Use current state data instead of fetching from backend
      const customerObj = customers.find(c => c.id === selectedCustomer);
      if (!customerObj) {
        alert("Please select a customer before previewing.");
        return;
      }
      const invoiceData = {
        invoice_number: invoiceNumber,
        invoice_date: invoiceDate,
        expiry_date: expiryDate,
        subject: subject,
      };
      const items = rows
        .filter(row => row.item && row.qty > 0 && row.rate > 0) // Filter out empty rows
        .map(row => ({
          item_detail: products.find(p => p.id === row.item)?.product_name || row.item || 'N/A',
          hsn_sac: products.find(p => p.id === row.item)?.hsn_code || '39259010',
          quantity: row.qty,
          rate: row.rate,
          discount: row.discount || 0,
          amount: calculateAmount(row),
        }));
      const sub_total = subtotal;
      const cgst_val = cgst;
      const sgst_val = sgst;
      const grand_total = total;
      const freight_val = parseFloat(freight || 0);
      if (items.length === 0) {
        alert("Please add at least one valid item before previewing.");
        return;
      }
      // Helper function to convert number to words (Indian Rupees)
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
      // Generate items table rows
      const itemsRows = items
        .map(
          (item, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${item.item_detail || 'N/A'}</td>
            <td>${item.hsn_sac || "39259010"}</td>
            <td>${item.quantity || 0}</td>
            <td>Sq.M</td>
            <td>${parseFloat(item.rate || 0).toFixed(2)}</td>
            <td>${(parseFloat(item.quantity || 0) * parseFloat(item.rate || 0)).toFixed(2)}</td>
            <td>${item.discount || "-"}</td>
            <td>${parseFloat(item.amount || 0).toFixed(2)}</td>
            <td>9%<br>${(parseFloat(item.amount || 0) * 0.09).toFixed(2)}</td>
            <td>9%<br>${(parseFloat(item.amount || 0) * 0.09).toFixed(2)}</td>
            <td>0%</td>
            <td>${(parseFloat(item.amount || 0) + parseFloat(item.amount || 0) * 0.18).toFixed(2)}</td>
          </tr>`
        )
        .join("");
      // Construct billing and shipping details with fallback
      const billingAddress = `${customerObj.billing_address1 || ""}${customerObj.billing_address2 ? `<br>${customerObj.billing_address2}` : ""}<br>`;
      const shippingAddress = `${customerObj.shipping_address1 || ""}${customerObj.shipping_address2 ? `<br>${customerObj.shipping_address2}` : ""}<br>`;
      const billingDetails = `
        ${customerObj.billing_recipient_name || customerObj.customer_name || "N/A"}<br>
        ${billingAddress}
        ${customerObj.billing_city || ""}, ${customerObj.billing_state || ""} - ${customerObj.billing_pincode || ""}<br>
        Pin Code - ${customerObj.billing_pincode || ""}, ${customerObj.billing_country || "India"}<br>
        <b>State Code :</b> ${customerObj.billing_state ? "27" : "N/A"}<br>
        <b>GSTIN :</b> ${customerObj.gst || "N/A"}
      `;
      const shippingDetails = `
        ${customerObj.shipping_recipient_name || customerObj.customer_name || "N/A"}<br>
        ${shippingAddress}
        ${customerObj.shipping_city || ""}, ${customerObj.shipping_state || ""} - ${customerObj.shipping_pincode || ""}<br>
        Pin Code - ${customerObj.shipping_pincode || ""}, ${customerObj.shipping_country || "India"}<br>
        <b>State Code :</b> ${customerObj.shipping_state ? "27" : "N/A"}<br>
        <b>GSTIN :</b> ${customerObj.gst || "N/A"}
      `;
      // Open print window with dynamic data
      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
     <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=1222, user-scalable=no">
    <title>TAX INVOICE Exact Replica</title>
    <style>
        * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
        @page {
            size: 310mm 275mm;
            margin: 8mm;
        }
       body {
  font-family: Arial, sans-serif;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: flex-start; /* keep content top aligned */
  min-height: 100vh;
  padding: 20px; /* gives nice spacing around */
}
.invoice-containerone {
  background: white;
  width: 100%;
  max-width: 1000px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}
        .invoice-containerone {
            font-size: 0.85em;
            width: 100%;
            height: auto;
            background-color: #fff;
      
            box-sizing: border-box;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  padding: 30px !important; /
        }
        .invoice-containertwo {
            border: 1px solid rgb(177, 177, 177);
            background-color: #fff;
            box-sizing: border-box;
            font-size: 0.85em;
             margin: 40px auto !important;
              width: 100%;
  box-sizing: border-box;
        }
        .text-center {
            text-align: center;
        }
        .text-right {
            text-align: right;
        }
        .font-7pt {
            font-size: 7pt;
        }
        .font-8pt {
            font-size: 8pt;
        }
        .font-9pt {
            font-size: 9pt;
        }
        .font-bold {
            font-weight: bold;
        }
        .border-1px {
            border: 1px solid #636363;
        }
        .clearfix::after {
            content: "";
            display: table;
            clear: both;
        }
        .header-section {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 5px;
            padding-bottom: 5px;
        }
        .header-logo {
            width: 100px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content:space-between;
            font-size: 14pt;
            font-weight: bold;
            color: #041E42;
          
        }
        .header-logo span {
            font-size: 8pt;
            font-weight: normal;
            margin-left: 5px;
            color: #000000;
        }
        .header-title {
            text-align: center;
            flex-grow: 1;
            padding-top: 0px;
        }
        .header-title h4 {
            margin: 0;
            font-size: 9pt;
            font-weight: 800;
        }
        .header-title small {
            display: block;
            font-size: 7pt;
            font-weight: normal;
            margin-top: 2px;
            line-height: 1.3;
        }
        .top-details-box {
            display: flex;
            border: 1px solid gray;
            border-top: 4px solid rgb(0, 0, 0);
            line-height: 1;
            margin-bottom: 9;
            font-size: 7pt;
        }
        .top-details-col {
            width: 50%;
            padding: 0 2px;
            box-sizing: border-box;
            position: relative;
        }
        .detail-row {
            padding-top: 10px;
            display: flex;
            border-bottom: 1px solid transparent;
            padding: 2px 0;
        }
        .detail-label {
            width: 80px;
            font-weight: bold;
        }
        .detail-value {
            flex-grow: 1;
        }
        .detail-small-text {
            font-size: 7pt;
            padding-left: 70px;
            display: block;
        }
        .header-original {
            font-size: 8pt;
            font-weight: bold;
            text-align: right;
            margin-bottom: 3px;
            margin-top: 1px;
            margin-right: 80px;
        }
        .consignee-section {
            display: flex;
            border: 1px solid #696969;
            border-top: none;
            margin-bottom: -1px;
        }
        .consignee-col {
            width: 50%;
        
            min-height: 110px;
            padding: 5px;
            box-sizing: border-box;
        }
        .consignee-col:last-child {
            width: 40%;
            border-right: none;
        }
        .consignee-col p {
            margin: 0 0 2px 0;
            font-size: 7.8pt;
            line-height: 1.2;
        }
        .consignee-col .title {
            font-weight: bold;
            margin-bottom: 5px;
            font-size: 8pt;
        }
        .consignee-section {
            display: flex;
            position: relative;
        }
        .consignee-section::after {
            content: "";
            position: absolute;
            top: 0;
            bottom: 0;
            left: 51.8%;
            width: 1px;
            background: #8e8e8e;
        }
        .consignee-col {
            width: 52%;
            border-right: none;
        }
        .state-gstin-row {
            display: flex;
            border: 1px solid #757575;
            border-top: none;
            margin-bottom: -1px;
        }
        .state-gstin-col {
            width: 25%;
            border-right: 1px solid #797979;
            padding: 5px;
            box-sizing: border-box;
            font-size: 7.8pt;
        }
        .state-gstin-col:last-child {
            border-right: none;
        }
        .state-gstin-col p {
            margin: 0;
            line-height: 1.2;
        }
        .state-gstin-col .col-header {
            text-decoration: underline;
            margin-bottom: 2px;
            font-size: 8pt;
        }
        .place-of-supply {
            border: 1px solid #6e6e6e;
            border-top: none;
            padding: 2px 5px 5px;
            font-size: 7.8pt;
            margin-bottom: 0px;
        }
.items-table {
    text-align: center;
    width: 100%;
    margin: 0 auto; /* center table */
    border-collapse: collapse;
    font-size: 7rem;
    table-layout: fixed; /* required for wrapping to work properly */
    box-sizing: border-box;
}
/*
        .items-table th,
        .items-table td {
            border: 1px solid #818181;
            padding: 2px 2px;
            text-align: center;
            vertical-align: center;
            height: 12px;
            line-height: 1.15;
        } */
        .items-table th,
.items-table td {
    border: 1px solid #818181;
    padding: 4px 8px;
    text-align: center;
    vertical-align: middle;
    white-space: nowrap; /* keep text on one line */
    overflow: visible; /* allow table to stretch */
}
        .items-table th {
            text-align: center;
            font-weight: bold;
            background-color: #ffffff;
            padding: 3px;
        }
        .items-table .col-sno {
            width: 3%;
            font-weight: bold;
        }
        .items-table .col-desc {
            width: 18%;
        }
        .items-table .col-hsn {
            width: 5%;
        }
        .items-table .col-qty {
            width: 4%;
        }
        .items-table .col-unit {
            width: 3%;
        }
        .items-table .col-rate {
            width: 4.3%;
        }
        .items-table .col-total-value {
            width: 6%;
        }
        .items-table .col-disc {
            width: 4%;
        }
        .items-table .col-taxable-value {
            width: 6%;
        }
        .items-table .col-tax-rate {
            width: 3.5%;
        }
        .items-table .col-tax-rs {
            width: 6%;
        }
        .items-table .col-igst-rs {
            width: 5.5%;
        }
        .items-table .col-total-rs {
            width: 6.5%;
        }
        .items-table .item-description {
            font-size: 7.5pt;
        }
        .total-row td {
            font-weight: bold;
            background-color: #fcfcfc;
            padding: 5px;
        }
        .total-row .col-label {
            text-align: right;
            border-right: none;
            font-weight: bold;
        }
        .empty-space-row {
            height: 0px;
        }
        .value-in-words-row,
        .reverse-charge-row {
            border: 1px solid #797979;
            border-top: none;
            padding: 2px;
            font-weight: bold;
            font-size: 7pt;
            margin-bottom: 0px;
        }
        .declaration-section {
            border: 1px solid #6d6d6d;
            padding: 3px;
            font-size: 8pt;
            min-height: 125px;
            margin-top: 0px;
            position: relative;
        }
        .declaration-section h5 {
            margin: 0 0 0px 0;
            font-weight: bold;
            font-size: 10pt;
            border-bottom: 2px solid #333333;
            padding-bottom: 2px;
            width: 85px;
        }
        .declaration-text {
            width:70%;
            float: left;
            line-height: 1.3;
         
        }
        .signature-box {
            width: 30%;
            float: right;
            text-align: center;
            padding-left: 10px;
            box-sizing: border-box;
            min-height: 95px;
            font-size: 8pt;
        }
        .signature-box .auth-sign {
            font-weight: bold;
            padding-top: 4px;
            display: block;
            margin-top: 50px;
        }
        .reg-address {
            position: absolute;
            bottom: 5px;
            left: 5px;
            right: 5px;
            font-size: 7.8pt;
            text-align: center;
            border-top: 1px solid #737373;
            padding-top: 8px;
            font-weight: bold;
        }
        .items-table,
.summary-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}
/* Define consistent column widths across both tables */
.items-table th:nth-child(6),
.items-table td:nth-child(6),
.summary-table td:nth-child(6) {
  width: 100%; /* 👈 Disc column */
}
.items-table th:nth-child(7),
.items-table td:nth-child(7),
.summary-table td:nth-child(7) {
  width: 12%; /* 👈 Amount column */
}
/* Style consistency */
.items-table th, .items-table td,
.summary-table td {
  border: 1px solid #ccc;
  text-align: center;
  padding: 6px;
}
        @media screen and (max-width: 768px) {
            body {
                padding: 10px;
                background-color: #fff;
            }
            .invoice-containerone {
                width: 100%;
                height: auto;
                padding: 15px;
                box-shadow: none;
            }
            .invoice-containertwo {
                font-size: 0.75em;
            }
            .header-section {
                flex-direction: column;
                align-items: center;
                text-align: center;
            }
            .header-logo {
                margin-bottom: 10px;
            }
            .header-title h4 {
                font-size: 12pt;
            }
            .consignee-section {
                flex-direction: column;
            }
            .consignee-col {
                width: 100%;
                border-right: none;
                border-bottom: 1px solid #ccc;
            }
            .consignee-col:last-child {
                border-bottom: none;
            }
            .state-gstin-row {
                flex-wrap: wrap;
            }
            .state-gstin-col {
                width: 50%;
                font-size: 7pt;
            }
            .items-table {
                font-size: 6.5pt;
                display: block;
                white-space: nowrap;
            }
            .value-in-words-row,
            .reverse-charge-row {
                font-size: 7pt;
                text-align: left;
                display: block;
          
            }
            .declaration-section {
                font-size: 7pt;
            }
            .declaration-text,
            .signature-box {
                width: 80%;
                float: none;
                text-align: center;
                margin-bottom: 10px;
            }
            .reg-address {
                font-size: 8pt;
                position: static;
                border-top: none;
                padding-top: 5px;
            }
        }
        .total-row.bold-row td {
            font-weight: 800 !important;
            font-size: 6.5pt;
        }
.items-table {
    width: 100%; /* always fits container */
    border-collapse: collapse;
    table-layout: auto; /* let columns adjust automatically */
    font-size: 7pt;
}
.items-table th,
.items-table td {
    border: 1px solid #818181;
    padding: 4px 6px;
    text-align: center;
    vertical-align: middle;
    word-wrap: break-word; /* allow wrapping of long words */
    white-space: normal !important; /* override nowrap */
}
.items-table .col-desc {
    text-align: left;
    max-width: 250px; /* limit description width */
    word-wrap: break-word;
}
.items-table .col-sno,
.items-table .col-hsn,
.items-table .col-qty,
.items-table .col-unit,
.items-table .col-rate,
.items-table .col-total-value,
.items-table .col-disc,
.items-table .col-taxable-value,
.items-table .col-tax-rate,
.items-table .col-tax-rs,
.items-table .col-igst-rs,
.items-table .col-total-rs {
    width: auto; /* flexible columns */
    white-space: nowrap; /* keep numbers in one line */
}
.invoice-table{
      border-collapse: collapse;
}
      @media screen and (min-width: 1025px) {
            body {
                background-color: #f0f0f0;
            }
            .invoice-containerone {
                width: 1022px;
                height: 794px;
                font-size: 0.9em;
                padding: 50px;
            }
            .items-table {
                font-size: 7pt;
            }
        }
        @media screen and (max-width: 600px){
            .declaration-text p{
                font-size: 1rem;
            }
        }
     @media print {
        .consignee-section {
            display: flex;
            border: 1px solid #696969;
            border-top: none;
            margin-bottom: -1px;
        }
        .consignee-col {
            width: 50%;
            border-right: 1px solid #7d7d7d;
            min-height: 110px;
            padding: 5px;
            box-sizing: border-box;
        }
            .consignee-col:first-child {
            width: 51.8%;
            border-right: 1px solid #7d7d7d;
            min-height: 110px;
            padding: 5px;
            box-sizing: border-box;
        }
        .consignee-col:last-child {
            width: 40%;
            border-right: none;
        }
        .consignee-col p {
            margin: 0 0 2px 0;
            font-size: 7.8pt;
            line-height: 1.2;
        }
        .consignee-col .title {
            font-weight: bold;
            margin-bottom: 5px;
            font-size: 8pt;
        }
        .consignee-section {
            display: flex;
            position: relative;
        }
        .consignee-section::after {
            content: "";
            position: absolute;
            top: 0;
            bottom: 0;
            left: 52.1%;
            width: 1px;
            background: #8e8e8e;
        }
        .consignee-col {
            width: 52%;
            border-right: none;
        }
}
    </style>
</head>
<body>
    <div class="invoice-containerone">
        <div class="invoice-containertwo">
            <div class="header-section">
                <div class="header-logo">
                    <img src="logo.png" style="width: 230px; height: 160px; margin-top: -50px; margin-bottom: -70px;"
                        alt="Logo" />
                </div>
                <div class="header-title">
                    <h4>TAX INVOICE</h4>
                    <h4>for Supply of Goods/Services</h4>
                    <small class="font-bold small">[Section 31 of the CGST Act, 2017 read with Rule 1 of Revised Invoice
                        Rules, 2017]</small>
                </div>
            </div>
            <div class="top-details-box">
                <div class="top-details-col" style="position: relative;top: 9px;">
                    <div class="detail-row">
                        <span class="detail-label font-bold"></br />GSTIN</span><span class="detail-value"style="position: relative; right: 30px;"><b></br />:
                                27AKUPY6544R1ZM</b></span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label font-bold">Name</span><span class="detail-value"style="position: relative; right: 30px;"><b>: Meraki
                                Expert</b></span>
                    </div>
                    <div class="detail-row" style="border-bottom: none; padding-bottom: 0;">
                        <span class="detail-label font-bold">PAN</span><span class="detail-value"style="position: relative; right: 30px;"><b>:
                                AKUPY6544R</b></span>
                    </div>
                    <span class="detail-small-text font-7pt"style="position: relative; right: 15px;">UDYAM-MH-20-0114278</span>
                </div>
                <div class="top-details-col" style="position: relative;left: 25px;">
                    <div class="header-original">Original for Recipient</div>
                    <div class="detail-row">
                        <span class="detail-label font-bold" style="font-weight: bold;">Invoice No.</span><span
                            class="detail-value"style="font-weight: 700;">: <b style="position: relative; left: 15px;"> ${invoiceData.invoice_number}</b></span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label font-bold">Invoice Date</span><span class="detail-value"style="font-weight: 700;">:<b style="position: relative; left: 15px;">
                                ${invoiceData.invoice_date}</b></span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label font-bold">Cust Order Date</span><span class="detail-value"style="font-weight: 700;">:
                           <span style="position: relative; left: 15px;"> ${invoiceData.expiry_date}</span></span>
                    </div>
                    <div class="detail-row" style="border-bottom: none;">
                        <span class="detail-label font-bold">PO Number</span><span class="detail-value" style="font-weight: 700;">:
                           <span style="position: relative; left: 15px;">${invoiceData.subject || "N/A"}</span> </span>
                    </div>
                </div>
            </div>
            <div class="consignee-section">
                <div class="consignee-col">
                    <p class="title font-bold">Details of Receiver (Billed to)</p>
                    <p><strong>Name:</strong> <b> ${customerObj.billing_recipient_name || customerObj.customer_name ||
                            "N/A"}</b></p>
                    <p><strong>Address :</strong> ${billingAddress}
                        ${customerObj.billing_city || ""}, ${customerObj.billing_state || ""} - ${customerObj.billing_pincode ||
                        ""}<br>
                        Pin Code - ${customerObj.billing_pincode || ""}, ${customerObj.billing_country || "India"}<br>
                    </p><br>
                    <p><strong>State Code:</strong> <b> ${customerObj.billing_state ? "27" : "N/A"}</b></p>
                    <p><strong>GSTIN:</strong> <b> ${customerObj.gst || "N/A"}</b></p>
                    <p style="margin: 0; "><b>Place of Supply/Service</b>: Maharashtra</p>
                </div>
                <div class="consignee-col">
                    <p class="title font-bold">Details of Consignee (Shipped to)</p>
                    <p><strong>Name: </strong> <b> ${customerObj.shipping_recipient_name || customerObj.customer_name ||
                            "N/A"}</b></p>
                    <p><strong>Address:</strong> ${shippingAddress}
                        ${customerObj.shipping_city || ""}, ${customerObj.shipping_state || ""} - ${customerObj.shipping_pincode
                        || ""}<br>
                        Pin Code - ${customerObj.shipping_pincode || ""}, ${customerObj.shipping_country || "India"}</p><br>
                    <p><strong>State Code: </strong> <b> ${customerObj.shipping_state ? "27" : "N/A"}</b></p>
                    <p><strong>GSTIN : </strong><b> ${customerObj.gst || "N/A"}</b></p>
                </div>
            </div>
            <table class="items-table invoice-table">
                <thead>
                    <tr class="tax-header-row" style="font-weight: bold;">
                        <th class="col-sno" rowspan="2">S.No.</th>
                        <th class="col-desc" rowspan="2" style="text-align: left;">Description of Goods</th>
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
                        <th colspan="1">Total</th>
                    </tr>
                    <tr class="tax-sub-header-row">
                        <th class="col-tax-rate">Rate (%)</th>
                        <th class="col-tax-rs">Rs</th>
                        <th class="col-tax-rate">Rate (%)</th>
                        <th class="col-tax-rs">Rs</th>
                        <th class="col-tax-rate">Rate (%)</th>
                        <th class="col-tax-rs">Rs</th>
                        <th class="col-tax-rs">Rs</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsRows}
                    <tr class="total-row bold-row">
                        <td colspan="8" class="col-label"></td>
                        <td class="col-taxable-value text-right">${sub_total.toFixed(2)}</td>
                        <td class="col-tax-rate"></td>
                        <td class="col-tax-rs text-right">${cgst_val.toFixed(2)}</td>
                        <td class="col-tax-rate"></td>
                        <td class="col-tax-rs text-right">${sgst_val.toFixed(2)}</td>
                        <td class="col-tax-rate"></td>
                        <td class="col-igst-rs text-right">0.00</td>
                        <td class="col-total-rs text-right">${grand_total.toFixed(2)}</td>
                    </tr>
                    <tr class="total-row bold-row">
                        <td colspan="8" class="col-label" style="border-right: 1px solid #6b6b6b;">Add: Freight</td>
                        <td class="col-taxable-value text-right">${freight_val.toFixed(2)}</td>
                        <td class="col-tax-rate"></td>
                        <td class="col-tax-rs text-right">0.00</td>
                        <td class="col-tax-rate"></td>
                        <td class="col-tax-rs text-right">0.00</td>
                        <td class="col-tax-rate"></td>
                        <td class="col-igst-rs text-right">0.00</td>
                        <td class="col-total-rs text-right">${freight_val.toFixed(2)}</td>
                    </tr>
                    <tr class="total-row bold-row">
                        <td colspan="8" class="col-label" style="border-right: 1px solid #777777;">Sub Total</td>
                        <td class="col-taxable-value text-right">${sub_total.toFixed(2)}</td>
                        <td class="col-tax-rate"></td>
                        <td class="col-tax-rs text-right">${cgst_val.toFixed(2)}</td>
                        <td class="col-tax-rate"></td>
                        <td class="col-tax-rs text-right">${sgst_val.toFixed(2)}</td>
                        <td class="col-tax-rate"></td>
                        <td class="col-igst-rs text-right">0.00</td>
                        <td class="col-total-rs text-right">${grand_total.toFixed(2)}</td>
                    </tr>
                  <tr class="total-row">
  <td colspan="8" class="col-label text-right">
    <b>Grand Total (Inclusive of GST)</b>
  </td>
  <td colspan="7" class="col-igst text-center">
    <b></b>
  </td>
  <td class="col-total-rs text-center">
    <b>₹${grand_total.toFixed(2)}</b>
  </td>
</tr>
 <tr class="total-row">
  <td colspan="8" class="col-label text-right">
    <b>Invoice Value (In words):</b>
  </td>
  <td colspan="8" class="col-igst text-center">
    <b>${numberToWords(grand_total)}</b>
  </td>
</tr>
 <tr class="total-row">
  <td colspan="8" class="col-label text-right">
    <b>Whether Tax is payable on Reverse Charge:</b>
  </td>
  <td colspan="8" class="col-igst text-center">
    <b>No</b>
  </td>
</tr>
                </tbody>
            </table>
        
         
            <div class="declaration-section clearfix">
                <h5>Declaration :</h5>
                <div class="declaration-text">
                    <p style="margin: 0; font-size: 8.5pt; ">Certified that the particulars given above are true and correct and the amount indicated represents </p>
                    <p style="margin: 0; font-size: 8.5pt; ">represents the Price actually charged and that thereis no f low of additional consideration directly</p>
                    <p style="margin: 0; font-size: 8.5pt; ">or indirectly from the Receiver [Buyer].</p>
                </div>
                <div class=" signature-box">
                    <p class="font-8pt text-right" style="margin: 0; padding-right: 100px;margin-top: -15px;"> <b>For
                            MERAKI
                            EXPERT</b></p>
                    <img src="new.png" style="width: 90px; height: 70px; margin-bottom: -60px;" alt="Logo" />
                    <span class="auth-sign">Authorized Signatory</span>
                </div>
                <div class="reg-address">
                    Registered Address: Prabhag No. 5, Ganesh Chowk, Deori, Dist.-Gondia. 441901 | www.merrakiexpert.in
                    | P: 7722001802; 9130801011
                </div>
            </div>
        </div>
    </div>
</body>
</html>
      `);
      printWindow.document.close();
      printWindow.print();
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };
  const fetchCustomerBillingStateCode = async (customerId) => {
    try {
 const response = await axios.get(`http://168.231.102.6:5000/api/customers/${customerId}`);
      const customer = response.data;
      setCustomerBillingStateCode(customer.billing_state_code || "");
    } catch (error) {
      console.error("Error fetching customer billing state code:", error);
      setCustomerBillingStateCode("");
    }
  };
  const updateRow = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = ["qty", "rate", "discount"].includes(field)
      ? parseFloat(value) || 0
      : value;
    updated[index].amount = calculateAmount(updated[index]);
    setRows(updated);
  };
  const calculateAmount = (row) => {
    const total = (row.qty || 0) * (row.rate || 0);
    return total - (row.discount || 0);
  };
  const addNewRow = () => {
    setRows([
      ...rows,
      { id: Date.now(), item: "", qty: 0, rate: 0, discount: 0, amount: 0, uom_amount: 0, uom_description: "" },
    ]);
  };
  const deleteRow = (index) => {
    const updated = [...rows];
    updated.splice(index, 1);
    setRows(updated);
  };
  const subtotal = rows.reduce((sum, row) => sum + calculateAmount(row), 0);
  const subtotalWithFreight = subtotal + parseFloat(freight || 0);
  // Conditional GST calculation based on customer billing state code
  let cgst = 0, sgst = 0, igst = 0, total = 0;
  console.log("NewInvoice - Customer billing state code:", customerBillingStateCode);
  console.log("NewInvoice - Subtotal with freight:", subtotalWithFreight);
  if (customerBillingStateCode === '27') {
    // Maharashtra - apply CGST and SGST
    cgst = subtotalWithFreight * 0.09;
    sgst = subtotalWithFreight * 0.09;
    total = subtotalWithFreight + cgst + sgst;
    console.log("NewInvoice - Using CGST/SGST - CGST:", cgst, "SGST:", sgst);
  } else {
    // Other states - apply IGST
    igst = subtotalWithFreight * 0.18;
    total = subtotalWithFreight + igst;
    console.log("NewInvoice - Using IGST:", igst);
  }
  const handleSubmit = async (saveAsDraft = false) => {
    // Validation checks
    const customerObj = customers.find((c) => c.id === selectedCustomer);
    if (!customerObj) {
      alert("Please select a customer");
      return;
    }
    if (!invoiceDate) {
      alert("Please select an invoice date");
      return;
    }
    if (rows.length === 0) {
      alert("Please add at least one item to the invoice");
      return;
    }
    // Validate that all rows have required fields
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!row.item || !row.qty || !row.rate) {
        alert(`Please fill in all required fields for item ${i + 1}`);
        return;
      }
    }
    setLoading(true);
    setError(null);
    const invoiceData = {
      customer_id: selectedCustomer,
      customer_name: customerObj.customer_name,
      invoice_date: invoiceDate,
      expiry_date: expiryDate,
      subject: subject,
      customer_notes: customerNotes,
      terms_and_conditions: termsAndConditions,
      freight: parseFloat(freight || 0),
      status: saveAsDraft ? "Draft" : status,
      sub_total: subtotal,
      cgst: cgst,
      sgst: sgst,
      igst: igst,
      grand_total: total,
      items: rows.map((row) => ({
        item_detail: row.item_name || row.item,
        quantity: row.qty,
        rate: row.rate,
        discount: row.discount,
        amount: calculateAmount(row),
        uom_amount: row.uom_amount || 0,
        uom_description: row.uom_description || "",
      })),
    };
    console.log("Submitting invoice data:", invoiceData);
    try {
      const response = await axios.post(
 "http://168.231.102.6:5000/api/invoice",
        {
          invoice: invoiceData,
          items: invoiceData.items,
        },
        {
          headers: { "Content-Type": "application/json" },
          timeout: 30000, // 30 second timeout
        }
      );
    
      console.log("Invoice saved successfully:", response.data);
      setLoading(false);
      navigate("/invoice-list");
    } catch (err) {
      setLoading(false);
      console.error("Error saving invoice:", err);
    
      let errorMessage = "Failed to save invoice. ";
    
      if (err.code === 'ECONNABORTED') {
        errorMessage += "Request timeout. Please check your internet connection.";
      } else if (err.response) {
        // Server responded with error status
        const status = err.response.status;
        const data = err.response.data;
      
        if (status === 400) {
          errorMessage += `Invalid data: ${data.message || 'Please check your input fields.'}`;
        } else if (status === 401) {
          errorMessage += "Authentication failed. Please login again.";
        } else if (status === 403) {
          errorMessage += "Access denied. You don't have permission to create invoices.";
        } else if (status === 404) {
          errorMessage += "Invoice endpoint not found. Please contact support.";
        } else if (status === 500) {
          errorMessage += "Server error. Please try again later or contact support.";
        } else {
          errorMessage += `Server error (${status}): ${data.message || 'Unknown error'}`;
        }
      } else if (err.request) {
        // Network error
        errorMessage += "Cannot connect to server. Please check if the backend server is running and accessible.";
      } else {
        // Other error
        errorMessage += err.message || "Unknown error occurred.";
      }
    
      setError(errorMessage);
      alert(errorMessage);
    }
  };
  return (
    <Box sx={{ display: "flex", backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      <Sidebar />
      <Box sx={{ flex: 1, p: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            mt: 1,
          }}
        >
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
            <Typography color="text.secondary" fontSize="14px">
              Invoice
            </Typography>
            <Typography color="text.primary" fontWeight={600} fontSize="14px">
              New Invoice
            </Typography>
          </Breadcrumbs>
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
              <UserMenu />
            </Box>
          </Box>
        </Box>
      
        {/* Loading Overlay */}
        {loading && (
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
            }}
          >
            <Paper
              sx={{
                p: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <CircularProgress />
              <Typography>Saving invoice...</Typography>
            </Paper>
          </Box>
        )}
      
        {/* Error Alert */}
        {error && (
          <Alert
            severity="error"
            onClose={() => setError(null)}
            sx={{ mb: 2 }}
          >
            {error}
          </Alert>
        )}
      
        <Paper sx={{ p: 1, borderRadius: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#111",
              mb: 2,
              borderBottom: "1px solid #eee",
              pb: 1,
            }}
          >
            New Invoice
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6} md={1}>
              <TextField
                required
                label="Invoice Number"
                placeholder="Enter invoice number (e.g., INV-2025-001)"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                helperText="You can edit this number as per your format"
                sx={{
                  width: 500,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "22px",
                    bgcolor: "#f9fafb",
                  },
                }}
              />
            </Grid>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth required>
                  <InputLabel>Customer Name</InputLabel>
                  <Select
                    value={selectedCustomer}
                    onChange={(e) => {
                      setSelectedCustomer(e.target.value);
                      if (e.target.value) {
                        fetchCustomerBillingStateCode(e.target.value);
                      }
                    }}
                    displayEmpty
                    sx={{
                      bgcolor: "#f9fafb",
                      borderRadius: "12px",
                      width: 300,
                    }}
                  >
                    {customers.length === 0 ? (
                      <MenuItem disabled>No result found</MenuItem>
                    ) : (
                      customers.map((customer) => (
                        <MenuItem key={customer.id} value={customer.id}>
                          {customer.customer_name}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
                <Box mt={1}>
                  <Button
                    size="small"
                    sx={{ textTransform: "none", color: "#3f51b5" }}
                    onClick={() => setCustomerModalOpen(true)}
                  >
                    + Add New Customer
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  fullWidth
                  required
                  label="Invoice Date"
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    sx: {
                      bgcolor: "#f9fafb",
                      borderRadius: "12px",
                      width: 300,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth required sx={{ mt: 2 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    sx={{ bgcolor: "#f9fafb", borderRadius: "12px", width: 200 }}
                  >
                    <MenuItem value="Draft">Draft</MenuItem>
                    <MenuItem value="Partial">Partial</MenuItem>
                    <MenuItem value="Paid">Paid</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  fullWidth
                  required
                  label="Due Date"
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    sx: {
                      bgcolor: "#f9fafb",
                      borderRadius: "12px",
                      width: 200,
                    },
                  }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Subject"
                  placeholder="Write what this invoice is about"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  InputProps={{
                    sx: {
                      bgcolor: "#f9fafb",
                      borderRadius: "12px",
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Box mt={5}>
            <Divider />
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              mb={2}
              sx={{ fontWeight: 600, fontSize: 18 }}
            >
              Item Table
            </Typography>
            <Box display="flex" justifyContent="flex-end" mt={1} gap={3}>
              <Button
                variant="text"
                sx={{ fontWeight: 500, color: "#1976d2" }}
                onClick={addNewRow}
              >
                + ADD NEW ROW
              </Button>
              <Button variant="text" sx={{ fontWeight: 500, color: "#1976d2" }}>
                + ADD ITEMS IN BULK
              </Button>
            </Box>
            <TableContainer component={Paper} sx={{ mt: 3, boxShadow: "none" }}>
              <Table size="small">
                <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableRow>
                    <TableCell>Item Details</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>UOM</TableCell>
                    <TableCell>Rate</TableCell>
                    <TableCell>Discount</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => (
                    <TableRow key={row.id}>
                      <TableCell>
                        <Select
                          fullWidth
                          value={row.item}
                          onChange={(e) => {
                            const selectedProductId = e.target.value;
                            const selectedProduct = products.find(p => p.id === selectedProductId);
                            updateRow(index, "item", selectedProductId);
                            updateRow(index, "item_name", selectedProduct ? selectedProduct.product_name : "");
 fetch(`http://168.231.102.6:5000/api/products/${selectedProductId}`)
                              .then((res) => res.json())
                              .then((product) => {
                                updateRow(index, "rate", product.sale_price || 0);
                                updateRow(index, "uom_description", product.unit || "");
                              })
                              .catch((err) => {
                                console.error("Error fetching product details:", err);
                              });
                          }}
                          size="small"
                          displayEmpty
                          sx={{ width: "100%" }}
                        >
                          <MenuItem value="">
                            <em>Select Item</em>
                          </MenuItem>
                          {products.map((product) => (
                            <MenuItem key={product.id} value={product.id}>
                              {product.product_name}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          type="number"
                          value={row.qty}
                          onChange={(e) => updateRow(index, "qty", e.target.value)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          fullWidth
                          value={row.uom_description}
                          onChange={(e) => updateRow(index, "uom_description", e.target.value)}
                          size="small"
                          displayEmpty
                        >
                          <MenuItem value="">
                            <em>Select Unit</em>
                          </MenuItem>
                          {units.map((unit) => (
                            <MenuItem key={unit.id} value={unit.unit_name}>
                              {unit.unit_name}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          type="number"
                          value={row.rate}
                          onChange={(e) => updateRow(index, "rate", e.target.value)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <FormControl fullWidth>
                          <Select
                            value={row.discount}
                            onChange={(e) => updateRow(index, "discount", e.target.value)}
                          >
                            <MenuItem value={0}>0%</MenuItem>
                            <MenuItem value={5}>5%</MenuItem>
                            <MenuItem value={10}>10%</MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          type="number"
                          value={calculateAmount(row).toFixed(2)}
                          InputProps={{ readOnly: true }}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => deleteRow(index)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Grid container spacing={2} mt={4}>
              <Grid item xs={12} sm={8}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <TextField
                    multiline
                    rows={1}
                    label="Customer Notes"
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    helperText="Will be displayed on the invoice"
                    sx={{ bgcolor: "#f9fafb", borderRadius: 1, width: 500 }}
                  />
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={4} sx={{ ml: 15 }}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    bgcolor: "#fafafa",
                    width: "200%",
                  }}
                >
                  {[
                    { label: "Sub Total", value: `₹${subtotal.toFixed(2)}` },
                    { label: "Freight", value: `₹${parseFloat(freight || 0).toFixed(2)}` },
                    ...(customerBillingStateCode === '27' ? [
                      { label: "CGST (9%)", value: `₹${cgst.toFixed(2)}` },
                      { label: "SGST (9%)", value: `₹${sgst.toFixed(2)}` },
                    ] : [
                      { label: "IGST (18%)", value: `₹${igst.toFixed(2)}` },
                    ])
                  ].map((item, i) => (
                    <Box
                      key={i}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={1}
                    >
                      <Typography fontSize={14}>{item.label}</Typography>
                      <Typography fontSize={14}>{item.value}</Typography>
                    </Box>
                  ))}
                  <Divider sx={{ my: 1 }} />
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography fontWeight="bold" fontSize="1rem">
                      Total (₹)
                    </Typography>
                    <Typography fontWeight="bold" fontSize="1rem">
                      ₹{total.toFixed(2)}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
          <Grid container spacing={2} mt={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Freight"
                type="number"
                value={freight}
                onChange={(e) => setFreight(e.target.value)}
                placeholder="Enter freight amount"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Terms & Conditions"
                value={termsAndConditions}
                onChange={(e) => setTermsAndConditions(e.target.value)}
              />
              <Box display="flex" alignItems="center" mt={1}>
                <Checkbox />
                <Typography variant="body2">Use this in future for all invoices</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ ml: 60 }}>
              <Typography>Attachment</Typography>
              <Button variant="outlined" startIcon={<CloudUploadIcon />} sx={{ mt: 1 }}>
                Upload File
              </Button>
              <Typography variant="caption" display="block" mt={1}>
                You can upload a maximum of 10 files, 10MB each
              </Typography>
            </Grid>
          </Grid>
          <Box mt={4} display="flex" justifyContent="space-between" flexWrap="wrap" gap={2}>
            <Box display="flex" justifyContent="flex-end" mb={2}>
              <Button
                startIcon={<VisibilityOutlinedIcon />}
                sx={{ color: "#002D72", textTransform: "none", fontWeight: "bold" }}
                onClick={handlePreview}
              >
                Preview Invoice
              </Button>
            </Box>
            <Box display="flex" gap={2}>
              <Button
                variant="outlined"
                color="inherit"
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                }}
                onClick={() => navigate("/invoice-list")}
              >
                Cancel
              </Button>
              <Button
                variant="outlined"
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  color: "#003366",
                  border: "1px solid #004085",
                }}
                onClick={() => handleSubmit(true)}
              >
                Save as Draft
              </Button>
              <Button
                variant="contained"
                onClick={() => handleSubmit(false)}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  bgcolor: "#004085",
                  "&:hover": { bgcolor: "#003366" },
                }}
              >
                Save & Send
              </Button>
            </Box>
          </Box>
          <Modal open={customerModalOpen} onClose={() => setCustomerModalOpen(false)}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 350,
                bgcolor: "background.paper",
                borderRadius: 2,
                boxShadow: 24,
                p: 3,
              }}
            >
              <TextField
                fullWidth
                placeholder="Search customer here..."
                InputProps={{
                  startAdornment: (
                    <SearchIcon />
                  ),
                }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Box textAlign="center" mt={3}>
                <Typography color="text.secondary">No result found</Typography>
              </Box>
              <Box mt={2} textAlign="center">
                <Button variant="text" size="small">
                  + Add New Customer
                </Button>
              </Box>
            </Box>
          </Modal>
          <Modal open={previewOpen} onClose={() => setPreviewOpen(false)}>
            <Box
              sx={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                bgcolor: "rgba(0,0,0,0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1300,
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  width: 480,
                  bgcolor: "#fff",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: 24,
                  px: 3,
                  py: 4,
                  position: "relative",
                }}
              >
                <Box sx={{ position: "absolute", top: 20, right: 20 }}>
                  <img src="https://cdn-icons-png.flaticon.com/512/8372/8372013.png" alt="logo" width={40} />
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Typography fontWeight="bold" fontSize={20}>
                    INVOICE
                  </Typography>
                  <Typography fontSize={12} color="text.secondary">
                    #{invoiceNumber}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                  <Box>
                    <Typography fontSize={12}>Issued</Typography>
                    <Typography fontSize={13} fontWeight={500}>
                      {invoiceDate || "N/A"}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography fontSize={12}>Due</Typography>
                    <Typography fontSize={13} fontWeight={500}>
                      {expiryDate || "N/A"}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                  <Box>
                    <Typography fontSize={12} fontWeight={500}>
                      Bill To
                    </Typography>
                    <Typography fontSize={13}>
                      {customers.find((c) => c.id === selectedCustomer)?.billing_recipient_name || customers.find((c) => c.id === selectedCustomer)?.customer_name || "N/A"}
                    </Typography>
                    <Typography fontSize={13}>
                      {customers.find((c) => c.id === selectedCustomer)?.billing_address1 || ""}{customers.find((c) => c.id === selectedCustomer)?.billing_address2 ? `, ${customers.find((c) => c.id === selectedCustomer)?.billing_address2}` : ""}
                    </Typography>
                    <Typography fontSize={13}>
                      {customers.find((c) => c.id === selectedCustomer)?.billing_city || ""}, {customers.find((c) => c.id === selectedCustomer)?.billing_state || ""} - {customers.find((c) => c.id === selectedCustomer)?.billing_pincode || ""}
                    </Typography>
                    <Typography fontSize={13}>
                      GSTIN: {customers.find((c) => c.id === selectedCustomer)?.gst || "N/A"}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography fontSize={12} fontWeight={500}>
                      From
                    </Typography>
                    <Typography fontSize={13}>Meraki Expert</Typography>
                    <Typography fontSize={13}>Nagpur, Maharashtra - 441104</Typography>
                    <Typography fontSize={13}>IN +91 83028-29003</Typography>
                    <Typography fontSize={13}>GSTIN: 27AKUPY6544R1ZM</Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    fontWeight: 600,
                    fontSize: 13,
                    borderBottom: "1px solid #ddd",
                    pb: 1,
                  }}
                >
                  <Box width="40%">Service</Box>
                  <Box width="15%">Qty</Box>
                  <Box width="20%">Rate</Box>
                  <Box width="25%" textAlign="right">
                    Line Total
                  </Box>
                </Box>
                {rows.map((row, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: "flex",
                      fontSize: 13,
                      py: 1,
                      borderBottom: "1px solid #f0f0f0",
                    }}
                  >
                    <Box width="40%">
                      {products.find((p) => p.id === row.item)?.product_name || row.item || "-"}
                    </Box>
                    <Box width="15%">{row.qty}</Box>
                    <Box width="20%">₹{row.rate.toFixed(2)}</Box>
                    <Box width="25%" textAlign="right">
                      ₹{calculateAmount(row).toFixed(2)}
                    </Box>
                  </Box>
                ))}
                <Box mt={2} mb={2} sx={{ textAlign: "right", fontSize: 13 }}>
                  <Typography>Subtotal: ₹{subtotal.toFixed(2)}</Typography>
                  <Typography>Freight: ₹{parseFloat(freight || 0).toFixed(2)}</Typography>
                  {customerBillingStateCode === '27' ? (
                    <>
                      <Typography>CGST (9%): ₹{cgst.toFixed(2)}</Typography>
                      <Typography>SGST (9%): ₹{sgst.toFixed(2)}</Typography>
                    </>
                  ) : (
                    <Typography>IGST (18%): ₹{igst.toFixed(2)}</Typography>
                  )}
                  <Typography fontWeight="bold" mt={1}>
                    Total: ₹{total.toFixed(2)}
                  </Typography>
                  <Typography color="primary" mt={1} fontWeight="bold">
                    Amount due: ₹{total.toFixed(2)}
                  </Typography>
                </Box>
                <Box mt={3} sx={{ borderTop: "1px solid #eee", pt: 2, fontSize: 12 }}>
                  <Typography>{customerNotes || "Thanks for your business!"}</Typography>
                  <Typography variant="caption" display="block" color="text.secondary">
                    This is a system generated invoice.
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ mt: 2 }}>
                <IconButton
                  onClick={() => setPreviewOpen(false)}
                  sx={{
                    bgcolor: "#fff",
                    borderRadius: "50%",
                    boxShadow: 3,
                    "&:hover": {
                      bgcolor: "#f5f5f5",
                    },
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
          </Modal>
        </Paper>
      </Box>
    </Box>
  );
};
export default NewInvoicePage;