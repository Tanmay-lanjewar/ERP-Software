import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Paper, Typography, MenuItem, FormControl, InputLabel, Select, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, IconButton } from '@mui/material';
import Sidebar from './Sidebar';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';

export default function EditPurchaseOrderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    purchase_order_number: '',
    vendor_name: '',
    created_date: '',
    delivery_date: '',
    status: '',
    bill_amount: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [vendors, setVendors] = useState([]);
  const [items, setItems] = useState([]); // State for purchase order items
  const [products, setProducts] = useState([]); // State for products list

  // Fetch PO
  useEffect(() => {
    const fetchPurchaseOrder = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/purchase/${id}`);
        const po = res.data.purchase_order;
        setFormData({
          purchase_order_number: po.purchase_order_no || '',
          vendor_name: po.vendor_name || '',
          created_date: po.purchase_order_date ? po.purchase_order_date.slice(0, 10) : '',
          delivery_date: po.delivery_date ? po.delivery_date.slice(0, 10) : '',
          status: po.status || 'Draft',
          bill_amount: po.total || 0,
        });
        setItems(Array.isArray(po.items) && po.items.length > 0 ? po.items.map(item => ({
          id: item.id || Date.now(), // Ensure each item has a unique ID for React keys
          item: item.item_id || '',
          item_name: item.description || '',
          qty: item.quantity || 0,
          rate: item.rate || 0,
          discount: item.discount || 0,
          amount: item.amount || 0,
          uom_amount: item.uom_amount || 0,
          uom_description: item.uom_description || "",
        })) : [{ id: Date.now(), item: "", item_name: "", qty: 0, rate: 0, discount: 0, amount: 0, uom_amount: 0, uom_description: "" }]);
      } catch (err) {
        setError('Failed to fetch purchase order');
      } finally {
        setLoading(false);
      }
    };
    fetchPurchaseOrder();
  }, [id]);

  // Fetch vendor list and products
  useEffect(() => {
    axios.get('http://localhost:5000/api/vendors')
      .then(res => setVendors(res.data))
      .catch(() => setVendors([]));

    fetch("http://localhost:5000/api/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setProducts([]);
      });
  }, []);

  const updateRow = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = ["qty", "rate", "discount"].includes(field)
      ? parseFloat(value) || 0
      : value;
    updated[index].amount = calculateAmount(updated[index]);
    setItems(updated);
  };

  const calculateAmount = (row) => {
    const total = (row.qty || 0) * (row.rate || 0);
    return total - (row.discount || 0);
  };

  const addNewRow = () => {
    setItems([
      ...items,
      { id: Date.now(), item: "", item_name: "", qty: 0, rate: 0, discount: 0, amount: 0, uom_amount: 0, uom_description: "" },
    ]);
  };

  const deleteRow = (index) => {
    const updated = [...items];
    updated.splice(index, 1);
    if (updated.length === 0) {
      updated.push({
        id: Date.now(),
        item: "",
        qty: 0,
        rate: 0,
        discount: 0,
        amount: 0,
        uom_amount: 0,
        uom_description: "",
      });
    }
    setItems(updated);
  };

  const subtotal = items.reduce((sum, item) => sum + calculateAmount(item), 0);
  const gst = subtotal * 0.09;
  const total = subtotal + gst * 2;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.put(`http://localhost:5000/api/purchase/${id}`, {
        vendor_name: formData.vendor_name,
        created_date: formData.created_date,
        delivery_date: formData.delivery_date,
        status: formData.status,
        items: items.map(item => ({
          item_name: item.item_name,
          qty: item.qty,
          rate: item.rate,
          discount: item.discount,
          amount: item.amount,
          uom_amount: item.uom_amount || 0,
          uom_description: item.uom_description || "",
        })),
      });
      alert('Purchase order updated successfully!');
      navigate('/purchase-order-list');
    } catch (err) {
      setError('Failed to update purchase order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5, width: '100%' }}>
        <Paper sx={{ width: 600, p: 4, borderRadius: 3 }}>
          <Typography variant="h5" fontWeight={600} mb={3} textAlign="center">
            Edit Purchase Order
          </Typography>
          {error && <Typography color="error" mb={2}>{error}</Typography>}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              name="purchase_order_number"
              label="PO Number"
              value={formData.purchase_order_number}
              margin="normal"
              disabled
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Vendor</InputLabel>
              <Select
                name="vendor_name"
                value={formData.vendor_name || ''}
                label="Vendor"
                onChange={handleChange}
              >
                {vendors.map(vendor => (
                  <MenuItem key={vendor.vendor_id} value={vendor.vendor_name}>
                    {vendor.vendor_name}
                  </MenuItem>
                ))}
                {formData.vendor_name && !vendors.some(v => v.vendor_name === formData.vendor_name) && (
                  <MenuItem value={formData.vendor_name}>{formData.vendor_name}</MenuItem>
                )}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              name="created_date"
              label="Created Date"
              type="date"
              value={formData.created_date ? formData.created_date.slice(0, 10) : ''}
              onChange={handleChange}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              name="delivery_date"
              label="Delivery Date"
              type="date"
              value={formData.delivery_date ? formData.delivery_date.slice(0, 10) : ''}
              onChange={handleChange}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                label="Status"
                onChange={handleChange}
              >
                <MenuItem value="Draft">Draft</MenuItem>
                <MenuItem value="Sent">Sent</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              name="bill_amount"
              label="Bill Amount"
              value={formData.bill_amount}
              margin="normal"
              disabled
            />
            {/* Item Table */}
            <Box mt={3}>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                mb={1}
                sx={{ fontWeight: 600, fontSize: 18 }}
              >
                Item Table
              </Typography>
              <Box display="flex" justifyContent="flex-end">
                <Button
                  variant="text"
                  sx={{ fontWeight: 500, color: "#1976d2" }}
                  onClick={addNewRow}
                >
                  + ADD NEW ROW
                </Button>
              </Box>
              <TableContainer
                component={Paper}
                sx={{ mt: 3, boxShadow: "none" }}
              >
                <Table size="small">
                  <TableHead sx={{ backgroundColor: "#f9fafb" }}>
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
                    {items.map((row, index) => (
                      <TableRow key={row.id}>
                        <TableCell>
                          <Select
                            fullWidth
                            value={row.item}
                            onChange={(e) => {
                              const selectedProductId = e.target.value;
                              const product = products.find(p => p.id === selectedProductId);
                              updateRow(index, "item", selectedProductId);
                              updateRow(index, "item_name", product ? product.product_name : '');
                              updateRow(index, "rate", product ? product.sale_price || 0 : 0);
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
                            onChange={(e) =>
                              updateRow(index, "qty", e.target.value)
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            value={row.uom_description || ""}
                            onChange={(e) =>
                              updateRow(index, "uom_description", e.target.value)
                            }
                            size="small"
                            placeholder="Unit"
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            type="number"
                            value={row.rate}
                            onChange={(e) =>
                              updateRow(index, "rate", e.target.value)
                            }
                            size="small"
                          />
                        </TableCell>

                        <TableCell>
                          <FormControl fullWidth>
                            <Select
                              value={row.discount}
                              onChange={(e) =>
                                updateRow(index, "discount", e.target.value)
                              }
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
                          <IconButton
                            onClick={() => deleteRow(index)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box mt={2} mb={2} sx={{ textAlign: "right", fontSize: 13 }}>
                <Typography>Subtotal: ₹{subtotal.toFixed(2)}</Typography>
                <Typography>CGST (9%): ₹{gst.toFixed(2)}</Typography>
                <Typography>SGST (9%): ₹{gst.toFixed(2)}</Typography>
                <Typography fontWeight="bold" mt={1}>
                  Total: ₹{total.toFixed(2)}
                </Typography>
              </Box>
            </Box>
            <Box display="flex" justifyContent="space-between" mt={3}>
              <Button variant="outlined" color="secondary" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button variant="contained" type="submit" disabled={loading}>
                Save Changes
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Box>
  );
}
