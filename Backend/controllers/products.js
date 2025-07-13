const Product = require('../models/products');

exports.getAll = (req, res) => {
  Product.getAll((err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
};



exports.create = (req, res) => {
  const { sku } = req.body;

  Product.findBySKU(sku, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length > 0) {
      return res.status(400).json({ error: 'Product with same SKU already exists' });
    }

    // Proceed to create product
    Product.create(req.body, (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ message: 'Product created', id: result.insertId });
    });
  });
};


exports.getOne = (req, res) => {
  Product.getById(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (!result) return res.status(404).json({ message: 'Product not found' });
    res.json(result);
  });
};




exports.update = (req, res) => {
  Product.update(req.params.id, req.body, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Product updated' });
  });
};

exports.remove = (req, res) => {
  Product.remove(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Product deleted' });
  });
};
