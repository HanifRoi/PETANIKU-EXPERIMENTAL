// backend/index.js
require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path'); // 1. Import 'path'

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('Berhasil terhubung ke MongoDB Atlas'))
  .catch((error) => console.error('Koneksi database gagal:', error));

// --- Menggunakan Rute-Rute API ---
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const userRoutes = require('./routes/users');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/users', userRoutes);

// --- PENYESUAIAN UNTUK VERCEL ---

// 2. Sajikan file statis dari build frontend
// Ini memberitahu Express untuk menyajikan file-file seperti gambar, css, js
// yang ada di dalam folder build frontend.
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// 3. Aturan "Catch-All"
// Ini adalah aturan paling penting. Artinya, untuk semua permintaan GET
// yang TIDAK cocok dengan rute API di atas, kirimkan saja file index.html
// dari frontend. Ini memungkinkan React Router untuk mengambil alih.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});


// Bagian app.listen tidak lagi dibutuhkan untuk Vercel
module.exports = app;
