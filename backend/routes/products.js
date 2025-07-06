// backend/routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const verifyToken = require('../middleware/verifyToken');

// --- RUTE PUBLIK ---

// GET /api/products - Mengambil semua produk
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// --- RUTE TERLINDUNGI (KHUSUS PETANI) ---

// GET /api/products/my-products - Mengambil produk milik petani yang login
// DIUBAH: Rute ini dipindahkan ke atas agar tidak tertimpa oleh /:id
router.get('/my-products', verifyToken, async (req, res) => {
  if (req.user.role !== 'petani') {
    return res.status(403).json({ message: 'Akses ditolak.' });
  }
  try {
    const myProducts = await Product.find({ petani: req.user.nama }).sort({ createdAt: -1 });
    res.json(myProducts);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
});

// --- RUTE PUBLIK (LANJUTAN) ---

// GET /api/products/:id - Mengambil detail SATU produk
// Rute dinamis ini sekarang ada di bawah rute yang lebih spesifik
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Produk tidak ditemukan.' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
});


// --- RUTE TERLINDUNGI (LANJUTAN) ---

// POST /api/products - Menambah produk baru
router.post('/', verifyToken, async (req, res) => {
  if (req.user.role !== 'petani') {
    return res.status(403).json({ message: 'Akses ditolak. Hanya untuk petani.' });
  }
  const product = new Product({
    nama: req.body.nama,
    harga: req.body.harga,
    satuan: req.body.satuan,
    deskripsi: req.body.deskripsi,
    gambar: req.body.gambar,
    petani: req.user.nama, 
  });
  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: 'Gagal menyimpan produk.', error: error.message });
  }
});

// PUT /api/products/:id - Memperbarui produk
router.put('/:id', verifyToken, async (req, res) => {
  if (req.user.role !== 'petani') {
    return res.status(403).json({ message: 'Akses ditolak.' });
  }
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produk tidak ditemukan.' });
    if (product.petani !== req.user.nama) {
      return res.status(403).json({ message: 'Anda tidak punya izin untuk mengedit produk ini.' });
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.json({ message: 'Produk berhasil diperbarui.', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
});

// DELETE /api/products/:id - Menghapus produk
router.delete('/:id', verifyToken, async (req, res) => {
  if (req.user.role !== 'petani') {
    return res.status(403).json({ message: 'Akses ditolak.' });
  }
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produk tidak ditemukan.' });
    if (product.petani !== req.user.nama) {
      return res.status(403).json({ message: 'Anda tidak punya izin untuk menghapus produk ini.' });
    }
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Produk berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
});

module.exports = router;
