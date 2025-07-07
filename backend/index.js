// backend/index.js

// DIHAPUS: Baris ini tidak lagi dibutuhkan di Vercel
// require('dotenv').config(); 

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

app.use(cors());
app.use(express.json());

// --- Koneksi ke Database ---
// Pastikan variabel DATABASE_URL sudah benar di pengaturan Vercel
mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('Berhasil terhubung ke MongoDB Atlas'))
  .catch((error) => console.error('Koneksi database gagal:', error));

// --- RUTE "PEMERIKSAAN KESEHATAN" ---
// Ini untuk kita tes apakah backend berjalan
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend PETANIKU sehat!' });
});

// --- Menggunakan Rute-Rute API ---
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
const productRoutes = require('./routes/products');
app.use('/api/products', productRoutes);
const cartRoutes = require('./routes/cart');
app.use('/api/cart', cartRoutes);
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

module.exports = app;
