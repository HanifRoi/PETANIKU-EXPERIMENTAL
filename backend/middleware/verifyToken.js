// backend/middleware/verifyToken.js
const jwt = require('jsonwebtoken');

// Ini adalah middleware kita
function auth(req, res, next) {
  // 1. Cek apakah ada token di header permintaan
  const token = req.header('auth-token');
  if (!token) return res.status(401).json({ message: 'Akses ditolak. Tidak ada token.' });

  try {
    // 2. Verifikasi token menggunakan kunci rahasia
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    // 3. Simpan data user dari token ke dalam object request
    req.user = verified;
    next(); // Lanjutkan ke rute selanjutnya jika token valid
  } catch (error) {
    res.status(400).json({ message: 'Token tidak valid.' });
  }
}

module.exports = auth;
