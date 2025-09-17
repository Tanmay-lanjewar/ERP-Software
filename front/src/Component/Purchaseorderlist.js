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
  const [vendors, setVendors] = useState([]);

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
    axios.get("http://localhost:5000/api/vendors")
      .then((res) => {
        setVendors(res.data);
        console.log('Vendors loaded:', res.data);
      })
      .catch((error) => {
        console.error('Failed to fetch vendors:', error);
        setVendors([]);
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
      const loadScript = (src) =>
        new Promise((resolve, reject) => {
          const existing = document.querySelector(`script[src="${src}"]`);
          if (existing) {
            if (existing.onload) { existing.onload(); }
            resolve();
            return;
          }
          const script = document.createElement('script');
          script.src = src;
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load script ' + src));
          document.body.appendChild(script);
        });

      // Try to fetch full purchase order with items and vendor if we have an ID
      let purchase_order = {};
      let vendor = {};
      let items = [];
      const id = order.id;
      if (id) {
        try {
          const poResponse = await axios.get(`http://localhost:5000/api/purchase/${id}`);
          const data = poResponse.data || {};
          purchase_order = data.purchase_order || {};
          vendor = data.vendor || {}; // Vendor from the PO details API
          items = Array.isArray(purchase_order.items) ? purchase_order.items : [];
        } catch (fetchErr) {
          console.warn('Failed to fetch full PO details, falling back to row data:', fetchErr);
        }
      }
      // Fallbacks if API not available or ID missing
      if (!items.length && Array.isArray(order.items)) items = order.items;

      // Find the detailed vendor information from the main vendors list
      const foundVendor = vendors.find(v => v.vendor_id === order.vendor_id || v.vendor_name === order.vendor_name);
      if (foundVendor) {
        // Merge vendor data, prioritizing the more detailed foundVendor
        vendor = { ...vendor, ...foundVendor };
      }

      const normalizeAddress = (s) => {
        if (!s) return '';
        return s
          .split(',')
          .map((t) => t.trim())
          .filter((t) => t && t.toLowerCase() !== 'n/a')
          .join(', ');
      };

      const safeOrderData = {
        purchase_order_no: purchase_order.purchase_order_no || order.purchase_order_no || '',
        purchase_order_date: (purchase_order.purchase_order_date || order.purchase_order_date || '').slice?.(0, 10) || '',
        os_id: purchase_order.os_id || order.os_id || '',
        subtotal: typeof purchase_order.sub_total !== 'undefined' ? purchase_order.sub_total : (order.sub_total || 0),
        cgst: typeof purchase_order.cgst !== 'undefined' ? purchase_order.cgst : (order.cgst || 0),
        sgst: typeof purchase_order.sgst !== 'undefined' ? purchase_order.sgst : (order.sgst || 0),
        igst: typeof purchase_order.igst !== 'undefined' ? purchase_order.igst : (order.igst || 0),
        freight: typeof purchase_order.freight !== 'undefined' ? purchase_order.freight : (order.freight || 0),
        total: typeof purchase_order.total !== 'undefined' ? purchase_order.total : (order.total || 0),
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
        billing_address: normalizeAddress(vendor.billing_address?.address_line1 + ', ' + vendor.billing_address?.address_line2 + ', ' + vendor.billing_address?.city + ', ' + vendor.billing_address?.state + ', ' + vendor.billing_address?.pincode) || normalizeAddress(order.billing_address || ''),
        shipping_address: normalizeAddress(vendor.shipping_address?.address_line1 + ', ' + vendor.shipping_address?.address_line2 + ', ' + vendor.shipping_address?.city + ', ' + vendor.shipping_address?.state + ', ' + vendor.shipping_address?.pincode) || normalizeAddress(order.shipping_address || order.billing_address || ''),
        gst: vendor.gst || order.gst || '',
        contact_name: vendor.contact_name || order.contact_name || '',
        mobile_no: vendor.mobile_no || vendor.phone || order.mobile_no || order.phone || '',
        email: vendor.email || order.email || '',
      };

      const dateLabel = safeOrderData.purchase_order_date
        ? new Date(safeOrderData.purchase_order_date).toLocaleDateString()
        : 'N/A';

      const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Purchase Order - ${safeOrderData.purchase_order_no || 'N/A'}</title>
  <style>
    * { box-sizing: border-box; }
  </style>
</head>
<body style="font-family: Arial, sans-serif; font-size: 10px; margin: 0; padding: 20px;">
    <div style="border: 2px solid #000; padding: 10px; width: 600px; margin: auto;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #000; padding-bottom: 5px;">
            <div style="display: flex; align-items: center;">
                <img src="/static/media/ui.405d9b691b910181ce2e.png" alt="Merraki Expert Logo" style="width: 200px; height: auto; margin-top: -70px; margin-bottom: -70px;">
            </div>
            <div style="text-align: right;">
                <div style="margin-bottom: 2px;"><strong>PO No:</strong> ${safeOrderData.purchase_order_no || 'N/A'}</div>
          <div style="margin-bottom: 2px; margin-right: 9px;"><strong>Date:</strong> ${dateLabel}</div>
          <div style="margin-right: 17px;"><strong>OS ID:</strong> ${safeOrderData.os_id || 'N/A'}</div>
        </div>
        </div>

        <div style="display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 2px solid #000;">
        <div style="font-size: 10px;"><strong>GSTIN:</strong> ${safeOrderData.gstin}</div>
        <div style="font-size: 10px;"><strong>${safeOrderData.udyam}</strong></div>
        </div>

        <div style="border-bottom: 2px solid #000; padding: 5px 0;">
            <div style="display: flex;">
                <div style="width: 100px; font-weight: bold;">Billing Address:</div>
          <div>${safeVendorDetails.billing_address || 'N/A'}</div>
            </div>
            <div style="display: flex;">
                <div style="width: 100px; font-weight: bold;">Shipping Address:</div>
          <div>${safeVendorDetails.shipping_address || 'N/A'}</div>
        </div>
        </div>

        <div style="text-align: center; font-weight: bold; padding: 5px 0; border-bottom: 2px solid #000;">
            Purchase Order
        </div>

        <table style="width: 100%; border-collapse: collapse;">
            <tbody>
                <tr>
                    <td style="width: 25%; border: 1px solid #000; padding: 3px; background-color: #f2f2f2; font-weight: bold;">Vendor:</td>
            <td style="width: 25%; border: 1px solid #000; padding: 3px;">${vendor.company_name || vendor.vendor_name || safeVendorDetails.vendor_name || 'N/A'}</td>
                    <td style="width: 25%; border: 1px solid #000; padding: 3px; background-color: #f2f2f2; font-weight: bold;">GSTIN</td>
            <td style="width: 25%; border: 1px solid #000; padding: 3px;">${safeVendorDetails.gst || 'N/A'}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #000; padding: 3px; background-color: #f2f2f2; font-weight: bold;">Address:</td>
            <td style="border: 1px solid #000; padding: 3px;">${safeVendorDetails.billing_address || 'N/A'}</td>
                    <td style="border: 1px solid #000; padding: 3px; background-color: #f2f2f2; font-weight: bold;">Kind Attn.</td>
            <td style="width: 25%; border: 1px solid #000; padding: 3px;">${safeVendorDetails.contact_name || 'N/A'}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #000; padding: 3px; background-color: #f2f2f2; font-weight: bold;">Mobile No.</td>
            <td style="width: 25%; border: 1px solid #000; padding: 3px;">${safeVendorDetails.mobile_no || 'N/A'}</td>
                    <td style="width: 25%; border: 1px solid #000; padding: 3px; background-color: #f2f2f2; font-weight: bold;">Email</td>
            <td style="width: 25%; border: 1px solid #000; padding: 3px; color: #00f;"><a href="mailto:${safeVendorDetails.email}">${safeVendorDetails.email || 'N/A'}</a></td>
                </tr>
            </tbody>
        </table>

        <div style="border: 1px solid #000; padding: 3px; margin-top: 5px;">
            This is reference to our requirement,
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
          ${items.map((item, idx) => `
            <tr>
              <td>${item.sr_no ?? idx + 1}</td>
              <td>${item.description || ''}</td>
              <td>${item.hsn_code || ''}</td>
              <td>${item.quantity || ''}</td>
              <td>${item.uom || ''}</td>
<td>₹${item.rate || 0}</td>
<td>₹${item.amount || 0}</td>
            </tr>
          `).join('')}
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
                <td colspan="2" style="border: 1px solid #000; padding: 3px; text-align: right;">₹${safeOrderData.subtotal || 0}</td>
                        </tr>
                        <tr>
                <td colspan="4" style="border: 1px solid #000; padding: 3px; font-weight: bold; text-align: right;">CGST @${(Number(safeOrderData.cgst) && Number(safeOrderData.subtotal) ? (safeOrderData.cgst / (safeOrderData.subtotal || 1) * 100).toFixed(2) : '0.00')}%</td>
                            <td colspan="2" style="border: 1px solid #000; padding: 3px; text-align: right;">₹${safeOrderData.cgst || 0}</td>
                        </tr>
                        <tr>
                <td colspan="4" style="border: 1px solid #000; padding: 3px; font-weight: bold; text-align: right;">SGST @${(Number(safeOrderData.sgst) && Number(safeOrderData.subtotal) ? (safeOrderData.sgst / (safeOrderData.subtotal || 1) * 100).toFixed(2) : '0.00')}%</td>
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
          <div style="height: 50px; display: flex; align-items: center; justify-content: center;"></div>
                <div>(Authorized Signatory)</div>
            </div>
        </div>
    </div>
</body>
</html>`;

      // Create hidden container for html2pdf
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.left = '-10000px';
      container.style.top = '0';
      container.innerHTML = htmlContent;
      document.body.appendChild(container);

      // Load html2pdf.js (bundled with html2canvas + jsPDF)
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.3/html2pdf.bundle.min.js');

      const filename = `PO_${safeOrderData.purchase_order_no || id || 'PO'}.pdf`;
      const opt = {
        filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'] }
      };

      await window.html2pdf().set(opt).from(container).save();

      // Cleanup
      document.body.removeChild(container);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      console.error('Error details:', error.response?.data || error.message);
      alert('Failed to download PDF. Please check console for details.');
    }
  };

  const handlePrintOrder = async (order) => {
    try {
      const loadScript = (src) =>
        new Promise((resolve, reject) => {
          const existing = document.querySelector(`script[src="${src}"]`);
          if (existing) {
            if (existing.onload) { existing.onload(); }
            resolve();
            return;
          }
          const script = document.createElement('script');
          script.src = src;
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load script ' + src));
          document.body.appendChild(script);
        });

      let purchase_order = {};
      let vendor = {};
      let items = [];
      const id = order.id;
      if (id) {
        try {
          const poResponse = await axios.get(`http://localhost:5000/api/purchase/${id}`);
          const data = poResponse.data || {};
          purchase_order = data.purchase_order || {};
          vendor = data.vendor || {};
          items = Array.isArray(purchase_order.items) ? purchase_order.items : [];
        } catch (fetchErr) {
          console.warn('Failed to fetch full PO details for print, falling back to row data:', fetchErr);
        }
      }
      if (!items.length && Array.isArray(order.items)) items = order.items;

      const foundVendor = vendors.find(v => v.vendor_id === order.vendor_id || v.vendor_name === order.vendor_name);
      if (foundVendor) {
        vendor = { ...vendor, ...foundVendor };
      }

      const normalizeAddress = (s) => {
        if (!s) return '';
        return s
          .split(',')
          .map((t) => t.trim())
          .filter((t) => t && t.toLowerCase() !== 'n/a')
          .join(', ');
      };

      const safeOrderData = {
        purchase_order_no: purchase_order.purchase_order_no || order.purchase_order_no || '',
        purchase_order_date: (purchase_order.purchase_order_date || order.purchase_order_date || '').slice?.(0, 10) || '',
        os_id: purchase_order.os_id || order.os_id || '',
        subtotal: typeof purchase_order.sub_total !== 'undefined' ? purchase_order.sub_total : (order.sub_total || 0),
        cgst: typeof purchase_order.cgst !== 'undefined' ? purchase_order.cgst : (order.cgst || 0),
        sgst: typeof purchase_order.sgst !== 'undefined' ? purchase_order.sgst : (order.sgst || 0),
        igst: typeof purchase_order.igst !== 'undefined' ? purchase_order.igst : (order.igst || 0),
        freight: typeof purchase_order.freight !== 'undefined' ? purchase_order.freight : (order.freight || 0),
        total: typeof purchase_order.total !== 'undefined' ? purchase_order.total : (order.total || 0),
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
        billing_address: normalizeAddress(vendor.billing_address?.address_line1 + ', ' + vendor.billing_address?.address_line2 + ', ' + vendor.billing_address?.city + ', ' + vendor.billing_address?.state + ', ' + vendor.billing_address?.pincode) || normalizeAddress(order.billing_address || ''),
        shipping_address: normalizeAddress(vendor.shipping_address?.address_line1 + ', ' + vendor.shipping_address?.address_line2 + ', ' + vendor.shipping_address?.city + ', ' + vendor.shipping_address?.state + ', ' + vendor.shipping_address?.pincode) || normalizeAddress(order.shipping_address || order.billing_address || ''),
        gst: vendor.gst || order.gst || '',
        contact_name: vendor.contact_name || order.contact_name || '',
        mobile_no: vendor.mobile_no || vendor.phone || order.mobile_no || order.phone || '',
        email: vendor.email || order.email || '',
      };

      const dateLabel = safeOrderData.purchase_order_date
        ? new Date(safeOrderData.purchase_order_date).toLocaleDateString()
        : 'N/A';

      const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Purchase Order - ${safeOrderData.purchase_order_no || 'N/A'}</title>
  <style>
    * { box-sizing: border-box; }
  </style>
</head>
<body style="font-family: Arial, sans-serif; font-size: 10px; margin: 0; padding: 20px;">
    <div style="border: 2px solid #000; padding: 10px; width: 600px; margin: auto;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #000; padding-bottom: 5px;">
            <div style="display: flex; align-items: center;">
                <img src="/static/media/ui.405d9b691b910181ce2e.png" alt="Merraki Expert Logo" style="width: 200px; height: auto; margin-top: -70px; margin-bottom: -70px;">
            </div>
            <div style="text-align: right;">
                <div style="margin-bottom: 2px;"><strong>PO No:</strong> ${safeOrderData.purchase_order_no || 'N/A'}</div>
          <div style="margin-bottom: 2px; margin-right: 9px;"><strong>Date:</strong> ${dateLabel}</div>
          <div style="margin-right: 17px;"><strong>OS ID:</strong> ${safeOrderData.os_id || 'N/A'}</div>
        </div>
        </div>

        <div style="display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 2px solid #000;">
        <div style="font-size: 10px;"><strong>GSTIN:</strong> ${safeOrderData.gstin}</div>
        <div style="font-size: 10px;"><strong>${safeOrderData.udyam}</strong></div>
        </div>

        <div style="border-bottom: 2px solid #000; padding: 5px 0;">
            <div style="display: flex;">
                <div style="width: 100px; font-weight: bold;">Billing Address:</div>
          <div>${safeVendorDetails.billing_address || 'N/A'}</div>
            </div>
            <div style="display: flex;">
                <div style="width: 100px; font-weight: bold;">Shipping Address:</div>
          <div>${safeVendorDetails.shipping_address || 'N/A'}</div>
        </div>
        </div>

        <div style="text-align: center; font-weight: bold; padding: 5px 0; border-bottom: 2px solid #000;">
            Purchase Order
        </div>

        <table style="width: 100%; border-collapse: collapse;">
            <tbody>
                <tr>
                    <td style="width: 25%; border: 1px solid #000; padding: 3px; background-color: #f2f2f2; font-weight: bold;">Vendor:</td>
            <td style="width: 25%; border: 1px solid #000; padding: 3px;">${vendor.company_name || vendor.vendor_name || safeVendorDetails.vendor_name || 'N/A'}</td>
                    <td style="width: 25%; border: 1px solid #000; padding: 3px; background-color: #f2f2f2; font-weight: bold;">GSTIN</td>
            <td style="width: 25%; border: 1px solid #000; padding: 3px;">${safeVendorDetails.gst || 'N/A'}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #000; padding: 3px; background-color: #f2f2f2; font-weight: bold;">Address:</td>
            <td style="border: 1px solid #000; padding: 3px;">${safeVendorDetails.billing_address || 'N/A'}</td>
                    <td style="border: 1px solid #000; padding: 3px; background-color: #f2f2f2; font-weight: bold;">Kind Attn.</td>
            <td style="border: 1px solid #000; padding: 3px;">${safeVendorDetails.contact_name || 'N/A'}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #000; padding: 3px; background-color: #f2f2f2; font-weight: bold;">Mobile No.</td>
            <td style="border: 1px solid #000; padding: 3px;">${safeVendorDetails.mobile_no || 'N/A'}</td>
                    <td style="border: 1px solid #000; padding: 3px; background-color: #f2f2f2; font-weight: bold;">Email</td>
            <td style="border: 1px solid #000; padding: 3px; color: #00f;"><a href="mailto:${safeVendorDetails.email}">${safeVendorDetails.email || 'N/A'}</a></td>
                </tr>
            </tbody>
        </table>

        <div style="border: 1px solid #000; padding: 3px; margin-top: 5px;">
            This is reference to our requirement,
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
          ${items.map((item, idx) => `
            <tr>
              <td>${item.sr_no ?? idx + 1}</td>
              <td>${item.description || ''}</td>
              <td>${item.hsn_code || ''}</td>
              <td>${item.quantity || ''}</td>
              <td>${item.uom || ''}</td>
<td>₹${item.rate || 0}</td>
<td>₹${item.amount || 0}</td>
            </tr>
          `).join('')}
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
                <td colspan="2" style="border: 1px solid #000; padding: 3px; text-align: right;">₹${safeOrderData.subtotal || 0}</td>
                        </tr>
                        <tr>
                <td colspan="4" style="border: 1px solid #000; padding: 3px; font-weight: bold; text-align: right;">CGST @${(Number(safeOrderData.cgst) && Number(safeOrderData.subtotal) ? (safeOrderData.cgst / (safeOrderData.subtotal || 1) * 100).toFixed(2) : '0.00')}%</td>
                            <td colspan="2" style="border: 1px solid #000; padding: 3px; text-align: right;">₹${safeOrderData.cgst || 0}</td>
                        </tr>
                        <tr>
                <td colspan="4" style="border: 1px solid #000; padding: 3px; font-weight: bold; text-align: right;">SGST @${(Number(safeOrderData.sgst) && Number(safeOrderData.subtotal) ? (safeOrderData.sgst / (safeOrderData.subtotal || 1) * 100).toFixed(2) : '0.00')}%</td>
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
          <div style="height: 50px; display: flex; align-items: center; justify-content: center;"></div>
                <div>(Authorized Signatory)</div>
            </div>
        </div>
    </div>
</body>
</html>`;

      const printWindow = window.open('', '_blank');
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
      };
    } catch (error) {
      console.error('Error printing PDF:', error);
      alert('Failed to print PDF. Please check console for details.');
    }
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
                    <TableCell>Company Name</TableCell>
                    <TableCell>Vendor Email</TableCell>
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
                      <TableCell>{row.vendor?.company_name || "N/A"}</TableCell>
                      <TableCell>{row.vendor?.email || "N/A"}</TableCell>
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

export default PurchaseOrderActions;;