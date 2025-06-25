require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
require('./config/db'); 
const productUnitRoutes = require('./routes/product_units');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

//product units routes : /api/units
app.use('/api/units', productUnitRoutes);

// Authentication routes: for /api/register and /api/login
const authRoutes = require('./routes/auth');
app.use('/api', authRoutes);


app.get('/', (req, res) => {
  res.send('✅ Server is running and MySQL should be connected');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
