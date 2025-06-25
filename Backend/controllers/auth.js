const User = require('../models/users');
const bcrypt = require('bcryptjs');

exports.register = (req, res) => {
  const { username, password, role } = req.body;

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ error: 'Hashing error' });

    User.createUser({ username, password: hashedPassword, role: role || 'admin' }, (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ message: 'User registered', id: result.insertId });
    });
  });
};

exports.login = (req, res) => {
  const { username, password } = req.body;

  User.findByUsername(username, (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ message: 'Invalid username' });
    }

    const user = results[0];
    bcrypt.compare(password, user.password, (err, match) => {
      if (!match) return res.status(401).json({ message: 'Incorrect password' });

      res.json({ message: 'Login successful', user: { id: user.id, username: user.username, role: user.role } });
    });
  });
};
