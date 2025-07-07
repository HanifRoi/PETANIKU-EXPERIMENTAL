// src/pages/LoginPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Kita butuh fungsi login dari context

function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // Ambil fungsi login

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // PERBAIKAN DI SINI: Mengubah URL API dari absolut ke relatif
      const response = await fetch('/api/auth/login', { // <-- INI PERUBAHANNYA!
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal untuk masuk.');
      }

      // Jika berhasil, panggil fungsi login dari context
      // untuk menyimpan token
      login(data.token);

      // Arahkan pengguna ke halaman utama
      navigate('/');

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-lg rounded-xl p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Selamat Datang Kembali</h2>
          <p className="text-center text-gray-500 mb-8">Masuk untuk melanjutkan belanja.</p>

          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition duration-300"
              >
                Masuk
              </button>
            </div>
          </form>
          <p className="text-center text-sm text-gray-600 mt-8">
            Belum punya akun? <Link to="/register" className="font-bold text-green-600 hover:underline">Daftar di sini</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
