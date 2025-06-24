require('dotenv').config();
const express = require('express');
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  db.query('SELECT 1', (err, results) => {
    if (err) return res.status(500).send('DB Connection Failed');
    res.send('✅ MySQL Connected Successfully');
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
