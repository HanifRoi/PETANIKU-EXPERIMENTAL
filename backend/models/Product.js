// backend/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  harga: { type: Number, required: true },
  satuan: { type: String, required: true, default: 'kg' },
  deskripsi: { type: String },
  gambar: { type: String, required: true },
  
  // INI KUNCINYA: Field ini sekarang menyimpan ID unik dari si petani
  petani: {
    type: mongoose.Schema.Types.ObjectId, // Tipe data untuk ID MongoDB
    ref: 'User', // Ini memberitahu Mongoose bahwa field ini merujuk ke model 'User'
    required: true
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
