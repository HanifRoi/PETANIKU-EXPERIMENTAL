// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// --- RUTE UNTUK REGISTRASI ---
// (Tidak ada perubahan di sini)
router.post('/register', async (req, res) => {
  try {
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) {
      return res.status(400).json({ message: 'Email sudah terdaftar.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
      nama: req.body.nama,
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role,
    });

    const savedUser = await user.save();
    res.status(201).json({ message: 'User berhasil dibuat!', userId: savedUser._id });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- RUTE UNTUK LOGIN ---
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: 'Email atau password salah.' });
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Email atau password salah.' });
    }

    // DIUBAH: Tambahkan 'nama: user.nama' ke dalam payload token
    const token = jwt.sign(
      { 
        _id: user._id, 
        role: user.role,
        nama: user.nama // <-- TAMBAHKAN INI
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.header('auth-token', token).json({ token });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
