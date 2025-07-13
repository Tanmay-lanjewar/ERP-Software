require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
require('./config/db'); 
const productUnitRoutes = require('./routes/product_units');
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');


app.use(cors()); // ✅ This allows all origins (like localhost:3000)


app.use(bodyParser.json());

//product units routes : /api/units
app.use('/api/units', productUnitRoutes);

// Authentication routes: for /api/register and /api/login
const authRoutes = require('./routes/auth');
app.use('/api', authRoutes);

// Tax routes: for /api/taxes
const taxRoutes = require('./routes/taxes');
app.use('/api/taxes', taxRoutes);

// Product routes: for /api/categories
const categoryRoutes = require('./routes/categories');
app.use('/api/categories', categoryRoutes);

// Product routes: for /api/vendors
const vendorRoutes = require('./routes/vendors');
app.use('/api/vendors', vendorRoutes);

// Product routes: for /api/customers
const customerRoutes = require('./routes/customers');
app.use('/api/customers', customerRoutes);

// Product routes: for /api/products
const productRoutes = require('./routes/products');
app.use('/api/products', productRoutes);


// Financial Year routes: for /api/financial-year
const financialYearRoutes = require('./routes/financialYear');
app.use('/api/financialYear', financialYearRoutes);

app.get('/', (req, res) => {
  res.send('✅ Server is running and MySQL should be connected');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
