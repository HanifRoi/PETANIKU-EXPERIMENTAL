// backend/models/User.js
const mongoose = require('mongoose');

// Kita definisikan dulu struktur untuk satu item di dalam keranjang
const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId, // Ini akan merujuk ke ID dari sebuah Produk
    ref: 'Product', // Merujuk ke model 'Product'
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  // Kita bisa simpan info tambahan agar tidak perlu query berulang kali
  nama: String,
  harga: Number,
  gambar: String,
});

const userSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['pembeli', 'petani'],
    default: 'pembeli',
  },
  // DIUBAH: Tambahkan field 'cart'
  cart: [cartItemSchema], // 'cart' adalah sebuah array dari item-item
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);
