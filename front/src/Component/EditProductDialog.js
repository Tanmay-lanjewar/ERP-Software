import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  MenuItem,
} from "@mui/material";
import axios from "axios";

const statusOptions = ["Active", "Inactive"];
const unitOptions = ["kg", "cm", "pcs", "litre"];
const typeOptions = ["Product", "Service"];
const discountTypes = ["%", "Flat"];

export default function EditProductDialog({ open, onClose, product, onSave }) {
  const [formData, setFormData] = useState({});
  const [taxList, setTaxList] = useState([]);
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/vendors")
      .then((res) => {
        console.log("Vendors loaded:", res.data);
        setVendors(res.data || []);
      })
      .catch((err) => {
        console.error("Error fetching vendors:", err);
        setVendors([]);
      });
  }, []);

  useEffect(() => {
    if (open) {
      console.log("Product data:", product);
      setFormData(product || {});
      axios
        .get("http://localhost:5000/api/taxes")
        .then((res) => {
          const activeTaxes = res.data.filter((tax) => tax.status === "Active");
          setTaxList(activeTaxes);
        })
        .catch((err) => console.error("Error fetching taxes:", err));
    }
  }, [open, product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Product / Service</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Product Name"
              name="product_name"
              value={formData.product_name || ""}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="SKU"
              name="sku"
              disabled
              value={formData.sku || ""}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Type"
              name="type"
              select
              value={formData.type || ""}
              onChange={handleChange}
            >
              {typeOptions.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Category"
              name="category"
              value={formData.category || ""}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Unit"
              name="unit"
              select
              value={formData.unit || ""}
              onChange={handleChange}
            >
              {unitOptions.map((unit) => (
                <MenuItem key={unit} value={unit}>
                  {unit}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Status"
              name="status"
              select
              value={formData.status || ""}
              onChange={handleChange}
            >
              {statusOptions.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* ✅ Tax Applicable */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Tax Applicable"
              name="tax_applicable"
              value={formData.tax_applicable || ""}
              onChange={handleChange}
              style={{ width: "200px" }}
            >
              <MenuItem value="None">None</MenuItem>
              {taxList.map((tax) => (
                <MenuItem key={tax.id} value={tax.id}>
                  {tax.tax_name} {tax.tax_rate}%
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Sale Price"
              name="sale_price"
              type="number"
              value={formData.sale_price || ""}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Sale Discount"
              name="sale_discount"
              type="number"
              value={formData.sale_discount || ""}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Sale Discount Type"
              name="sale_discount_type"
              select
              value={formData.sale_discount_type || ""}
              onChange={handleChange}
            >
              {discountTypes.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Sale Description"
              name="sale_description"
              value={formData.sale_description || ""}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Purchase Price"
              name="purchase_price"
              type="number"
              value={formData.purchase_price || ""}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Purchase Discount"
              name="purchase_discount"
              type="number"
              value={formData.purchase_discount || ""}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Purchase Discount Type"
              name="purchase_discount_type"
              select
              value={formData.purchase_discount_type || ""}
              onChange={handleChange}
            >
              {discountTypes.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Purchase Description"
              name="purchase_description"
              value={formData.purchase_description || ""}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Preferred Vendor"
              name="preferred_vendor"
              value={formData.preferred_vendor || ""}
              onChange={handleChange}
              helperText={vendors.length === 0 ? "Loading vendors..." : ""}
            >
              <MenuItem value="">None</MenuItem>
              {vendors.length > 0 ? (
                vendors.map((vendor) => (
                  <MenuItem key={vendor.id || vendor.vendor_name} value={vendor.vendor_name}>
                    {vendor.vendor_name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No vendors available</MenuItem>
              )}
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
