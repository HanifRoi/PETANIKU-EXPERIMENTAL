// src/pages/AddProductPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AddProductPage() {
  const [productData, setProductData] = useState({
    nama: '',
    harga: '',
    satuan: 'kg',
    deskripsi: '',
    gambar: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { token } = useAuth(); // Kita butuh token untuk otorisasi
  const navigate = useNavigate();

  const handleChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // INI BAGIAN PENTING: Kirim token di header
          'auth-token': token, 
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal menambahkan produk.');
      }

      setSuccess('Produk berhasil ditambahkan! Anda akan diarahkan kembali ke dasbor.');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Tambah Produk Baru</h1>
        
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>}
        {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="nama" className="block text-sm font-medium text-gray-700">Nama Produk</label>
              <input type="text" name="nama" id="nama" value={productData.nama} onChange={handleChange} required className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"/>
            </div>
            <div>
              <label htmlFor="harga" className="block text-sm font-medium text-gray-700">Harga (Rp)</label>
              <input type="number" name="harga" id="harga" value={productData.harga} onChange={handleChange} required className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"/>
            </div>
            <div>
              <label htmlFor="satuan" className="block text-sm font-medium text-gray-700">Satuan</label>
              <select name="satuan" id="satuan" value={productData.satuan} onChange={handleChange} className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 bg-white">
                <option>kg</option>
                <option>gram</option>
                <option>ikat</option>
                <option>box</option>
                <option>buah</option>
              </select>
            </div>
             <div>
              <label htmlFor="gambar" className="block text-sm font-medium text-gray-700">URL Gambar Produk</label>
              <input type="text" name="gambar" id="gambar" value={productData.gambar} onChange={handleChange} required className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"/>
            </div>
          </div>
          <div className="mt-6">
            <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700">Deskripsi</label>
            <textarea name="deskripsi" id="deskripsi" rows="4" value={productData.deskripsi} onChange={handleChange} className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"></textarea>
          </div>
          <div className="mt-8 text-right">
            <button type="submit" className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition duration-300">
              Simpan Produk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProductPage;
