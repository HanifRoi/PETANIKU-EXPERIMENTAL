// backend/index.js

// Memuat variabel lingkungan dari file .env di paling atas
require('dotenv').config(); 

// Mengimpor paket-paket yang dibutuhkan
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Inisialisasi aplikasi Express
const app = express();
const port = 3001; // Port untuk server backend

// --- Middleware ---
// Mengizinkan permintaan dari domain lain (frontend kita)
app.use(cors());
// Memungkinkan server untuk membaca body request dalam format JSON
app.use(express.json());


// --- Koneksi ke Database MongoDB Atlas ---
mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('Berhasil terhubung ke MongoDB Atlas'))
  .catch((error) => console.error('Koneksi database gagal:', error));
// -----------------------------------------


// === Menggunakan Rute-Rute API ===

// 1. Rute untuk Otentikasi (Register & Login)
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);


// 2. Rute untuk Produk
const productRoutes = require('./routes/products');
app.use('/api/products', productRoutes);


// 3. Rute untuk Keranjang Belanja
const cartRoutes = require('./routes/cart');
app.use('/api/cart', cartRoutes);


// 4. Rute untuk Pengguna (Profil)
// Semua rute yang dimulai dengan /api/users akan ditangani oleh file users.js
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);


// --- Menjalankan Server ---
app.listen(port, () => {
  console.log(`Server backend berjalan di http://localhost:${port}`);
});
