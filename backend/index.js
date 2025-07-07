// backend/index.js (Mode Aman untuk Tes)

const express = require('express');
const cors = require('cors');
// const mongoose = require('mongoose'); // Kita matikan sementara

const app = express();

app.use(cors());
app.use(express.json());

// --- KONEKSI DATABASE DIMATIKAN SEMENTARA ---
console.log('MENJALANKAN DALAM MODE AMAN (TANPA DATABASE)');
// mongoose.connect(process.env.DATABASE_URL)
//   .then(() => console.log('Berhasil terhubung ke MongoDB Atlas'))
//   .catch((error) => console.error('Koneksi database gagal:', error));


// --- RUTE API DIBUAT MENGEMBALIKAN DATA PALSU ---

// Rute Login palsu
app.post('/api/auth/login', (req, res) => {
  console.log('API Login Palsu dipanggil');
  // Memberikan token palsu agar frontend bisa lanjut
  res.json({ token: 'ini-token-palsu-untuk-tes' });
});

// Rute Produk palsu
app.get('/api/products', (req, res) => {
  console.log('API Produk Palsu dipanggil');
  res.json([
    { _id: '1', nama: 'Produk Tes 1', harga: 10000, gambar: 'https://placehold.co/600x400/green/white?text=Produk+1' },
    { _id: '2', nama: 'Produk Tes 2', harga: 20000, gambar: 'https://placehold.co/600x400/blue/white?text=Produk+2' }
  ]);
});

// Rute Keranjang palsu
app.get('/api/cart', (req, res) => {
  console.log('API Keranjang Palsu dipanggil');
  res.json([]); // Mengembalikan keranjang kosong
});

// Rute Health Check (tetap ada)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend PETANIKU sehat!' });
});


module.exports = app;
