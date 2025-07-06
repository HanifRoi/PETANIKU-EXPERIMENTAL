// backend/models/Product.js
const mongoose = require('mongoose');

// Ini adalah "formulir" atau "cetakan" untuk setiap produk
const productSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: true // Artinya, nama produk tidak boleh kosong
  },
  harga: {
    type: Number,
    required: true
  },
  satuan: {
    type: String,
    required: true,
    default: 'kg' // Nilai default jika tidak diisi
  },
  deskripsi: {
    type: String
  },
  gambar: {
    type: String,
    required: true
  },
  petani: {
    type: String, // Nanti ini akan kita ubah menjadi ID Petani
    required: true
  },
  // Kita bisa tambahkan tanggal produk dibuat secara otomatis
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 'Product' adalah nama model kita. Mongoose akan secara otomatis membuat
// sebuah collection di database bernama 'products' (jamak dan huruf kecil).
module.exports = mongoose.model('Product', productSchema);
