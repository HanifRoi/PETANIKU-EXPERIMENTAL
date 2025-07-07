// backend/routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User'); // Diperlukan untuk .populate()
const verifyToken = require('../middleware/verifyToken');

// --- RUTE PUBLIK ---

// GET /api/products - Mengambil semua produk
router.get('/', async (req, res) => {
  try {
    // .populate('petani', 'nama') akan mengambil detail petani (hanya nama)
    // yang terhubung melalui ID, lalu menampilkannya di hasil.
    const products = await Product.find().populate('petani', 'nama').sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/products/:id - Mengambil detail SATU produk berdasarkan ID-nya
// Rute ini penting untuk halaman detail produk publik dan halaman edit.
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('petani', 'nama');
        if (!product) return res.status(404).json({ message: 'Produk tidak ditemukan.' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
});


// --- RUTE TERLINDUNGI (KHUSUS PETANI) ---

// GET /api/products/my-products - Mengambil produk HANYA milik petani yang login
router.get('/my-products', verifyToken, async (req, res) => {
  if (req.user.role !== 'petani') {
    return res.status(403).json({ message: 'Akses ditolak.' });
  }
  try {
    // Mencari produk berdasarkan ID petani dari token
    const myProducts = await Product.find({ petani: req.user._id }).sort({ createdAt: -1 });
    res.json(myProducts);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
});

// POST /api/products - Menambah produk baru
router.post('/', verifyToken, async (req, res) => {
  if (req.user.role !== 'petani') {
    return res.status(403).json({ message: 'Akses ditolak.' });
  }
  const product = new Product({
    nama: req.body.nama,
    harga: req.body.harga,
    satuan: req.body.satuan,
    deskripsi: req.body.deskripsi,
    gambar: req.body.gambar,
    // Menyimpan ID unik dari petani yang login (dari token)
    petani: req.user._id, 
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
        if (!product) {
            return res.status(404).json({ message: 'Produk tidak ditemukan.' });
        }
        // Cek kepemilikan berdasarkan ID, bukan nama lagi
        if (product.petani.toString() !== req.user._id) {
            return res.status(403).json({ message: 'Anda tidak punya izin untuk mengedit produk ini.' });
        }
        
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // Opsi ini mengembalikan dokumen yang sudah diperbarui
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
        if (!product) {
            return res.status(404).json({ message: 'Produk tidak ditemukan.' });
        }
        // Cek kepemilikan berdasarkan ID, bukan nama lagi
        if (product.petani.toString() !== req.user._id) {
            return res.status(403).json({ message: 'Anda tidak punya izin untuk menghapus produk ini.' });
        }

        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Produk berhasil dihapus.' });

    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
});

module.exports = router;
