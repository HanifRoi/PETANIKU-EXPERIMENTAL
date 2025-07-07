// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import model User

// --- RUTE UNTUK REGISTRASI PENGGUNA BARU ---
// Endpoint: POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    // 1. Cek apakah email sudah ada di database
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) {
      // Jika sudah ada, kirim error 400 (Bad Request)
      return res.status(400).json({ message: 'Email sudah terdaftar.' });
    }

    // 2. Enkripsi (hash) password sebelum disimpan
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // 3. Buat instance pengguna baru
    const user = new User({
      nama: req.body.nama,
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role, // 'pembeli' atau 'petani'
    });

    // 4. Simpan pengguna baru ke database
    const savedUser = await user.save();
    res.status(201).json({ message: 'User berhasil dibuat!', userId: savedUser._id });

  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
});

// --- RUTE UNTUK LOGIN PENGGUNA ---
// Endpoint: POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    // 1. Cek apakah pengguna dengan email tersebut ada
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      // Jika tidak ada, kirim pesan error yang sama untuk alasan keamanan
      return res.status(400).json({ message: 'Email atau password salah.' });
    }

    // 2. Cek apakah password yang dimasukkan cocok dengan yang ada di database
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Email atau password salah.' });
    }

    // 3. Jika semua cocok, buat "Tiket Digital" (JWT Token)
    const token = jwt.sign(
      // Informasi (payload) yang ingin kita simpan di dalam token
      { 
        _id: user._id, 
        role: user.role,
        nama: user.nama,
        email: user.email // Email sudah ditambahkan di sini
      },
      // Kunci rahasia dari file .env
      process.env.JWT_SECRET,
      // Opsi tambahan, token akan kadaluarsa dalam 1 hari
      { expiresIn: '1d' }
    );

    // 4. Kirim token ke frontend
    res.header('auth-token', token).json({ token });

  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
});


module.exports = router;
