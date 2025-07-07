// backend/routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const verifyToken = require('../middleware/verifyToken');

// Rute untuk mengambil detail pengguna yang sedang login
router.get('/me', verifyToken, async (req, res) => {
  try {
    // Cari user berdasarkan ID dari token, tapi jangan kirim passwordnya
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan.' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Rute untuk mengupdate nama dan email
router.put('/me', verifyToken, async (req, res) => {
  const { nama, email } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { nama, email },
      { new: true }
    ).select('-password');
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Rute untuk mengubah password
router.put('/change-password', verifyToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user._id);
    
    // Verifikasi password saat ini
    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Password saat ini salah.' });
    }

    // Enkripsi password baru
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedNewPassword;
    await user.save();

    res.json({ message: 'Password berhasil diubah.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;