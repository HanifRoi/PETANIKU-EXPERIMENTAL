// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Setiap email harus unik, tidak boleh ada yang sama
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['pembeli', 'petani'], // Pilihan role hanya boleh 'pembeli' atau 'petani'
    default: 'pembeli',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);
