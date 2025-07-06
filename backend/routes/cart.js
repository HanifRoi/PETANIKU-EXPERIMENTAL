// backend/routes/cart.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const verifyToken = require('../middleware/verifyToken');

// --- RUTE-RUTE INI SEMUANYA TERLINDUNGI ---
// Hanya pengguna yang sudah login yang bisa mengakses keranjangnya

// GET /api/cart - Mengambil isi keranjang pengguna yang login
router.get('/', verifyToken, async (req, res) => {
  try {
    // Cari pengguna berdasarkan ID dari token, lalu ambil data keranjangnya
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan.' });

    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
});

// POST /api/cart/add - Menambah produk ke keranjang
router.post('/add', verifyToken, async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const user = await User.findById(req.user._id);
    const product = await Product.findById(productId);

    if (!product) return res.status(404).json({ message: 'Produk tidak ditemukan.' });

    // Cek apakah produk sudah ada di keranjang
    const itemIndex = user.cart.findIndex(item => item.productId == productId);

    if (itemIndex > -1) {
      // Jika sudah ada, update quantity-nya
      user.cart[itemIndex].quantity += quantity;
    } else {
      // Jika belum ada, tambahkan item baru ke keranjang
      user.cart.push({ 
        productId, 
        quantity,
        nama: product.nama,
        harga: product.harga,
        gambar: product.gambar
      });
    }

    await user.save();
    res.status(200).json(user.cart);

  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
});

// DELETE /api/cart/remove/:productId - Menghapus item dari keranjang
router.delete('/remove/:productId', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        
        // Hapus item dari array cart
        user.cart = user.cart.filter(item => item.productId != req.params.productId);

        await user.save();
        res.status(200).json(user.cart);

    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
});

// PUT /api/cart/update - Mengubah kuantitas item
router.put('/update', verifyToken, async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        const user = await User.findById(req.user._id);
        const itemIndex = user.cart.findIndex(item => item.productId == productId);

        if (itemIndex > -1) {
            if (quantity <= 0) {
                // Jika kuantitas 0 atau kurang, hapus item
                user.cart.splice(itemIndex, 1);
            } else {
                // Jika tidak, update kuantitasnya
                user.cart[itemIndex].quantity = quantity;
            }
            await user.save();
            res.status(200).json(user.cart);
        } else {
            res.status(404).json({ message: "Item tidak ditemukan di keranjang." });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
});


module.exports = router;
