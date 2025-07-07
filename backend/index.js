// backend/index.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// require('dotenv').config(); // Tidak dibutuhkan di Vercel

const app = express();

app.use(cors());
app.use(express.json());

// Pastikan variabel DATABASE_URL sudah benar di pengaturan Vercel
mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('Berhasil terhubung ke MongoDB Atlas'))
  .catch((error) => console.error('Koneksi database gagal:', error));

// --- Rute API ---
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
const productRoutes = require('./routes/products');
app.use('/api/products', productRoutes);
const cartRoutes = require('./routes/cart');
app.use('/api/cart', cartRoutes);
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

// Rute Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend PETANIKU sehat!' });
});

module.exports = app;
