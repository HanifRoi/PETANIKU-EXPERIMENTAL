// backend/index.js
require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('Berhasil terhubung ke MongoDB Atlas'))
  .catch((error) => console.error('Koneksi database gagal:', error));

// --- Menggunakan Rute-Rute API ---
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
const productRoutes = require('./routes/products');
app.use('/api/products', productRoutes);
const cartRoutes = require('./routes/cart');
app.use('/api/cart', cartRoutes);
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

// Tambahkan baris ini agar Vercel bisa menggunakan aplikasi Express Anda.
module.exports = app;
