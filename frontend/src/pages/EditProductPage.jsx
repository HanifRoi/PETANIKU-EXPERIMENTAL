// src/pages/EditProductPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function EditProductPage() {
  // State untuk menyimpan data form
  const [productData, setProductData] = useState({
    nama: '',
    harga: '',
    satuan: 'kg',
    deskripsi: '',
    gambar: '',
  });

  // State untuk UI feedback
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Mengambil hooks dan parameter yang dibutuhkan
  const { productId } = useParams(); // Mengambil ID produk dari URL
  const { token } = useAuth(); // Mengambil token untuk otorisasi
  const navigate = useNavigate(); // Untuk mengarahkan pengguna setelah selesai

  // 1. Ambil data produk yang akan diedit saat halaman pertama kali dimuat
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/products/${productId}`);
        if (!response.ok) {
          throw new Error('Produk tidak ditemukan atau gagal dimuat.');
        }
        const productToEdit = await response.json();
        setProductData(productToEdit); // Isi form dengan data yang ada
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]); // Efek ini berjalan setiap kali ID produk di URL berubah

  // Fungsi untuk menangani perubahan pada setiap input form
  const handleChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  // Fungsi untuk menangani pengiriman form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`http://localhost:3001/api/products/${productId}`, {
        method: 'PUT', // Gunakan metode PUT untuk memperbarui data
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token, // Sertakan token untuk otorisasi
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Gagal memperbarui produk.');

      setSuccess('Produk berhasil diperbarui! Anda akan diarahkan kembali ke dasbor.');
      // Arahkan kembali ke dasbor setelah 2 detik
      setTimeout(() => navigate('/dashboard'), 2000);

    } catch (err) {
      setError(err.message);
    }
  };
  
  // Tampilan saat data sedang dimuat
  if (loading) return <p className="text-center py-20">Memuat data produk...</p>;
  
  // Tampilan jika produk tidak ditemukan
  if (error && !productData.nama) return (
    <div className="text-center py-20">
      <p className="text-red-500">{error}</p>
      <Link to="/dashboard" className="text-green-600 hover:underline mt-4 inline-block">
        &larr; Kembali ke Dasbor
      </Link>
    </div>
  );

  return (
    <div className="bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Edit Produk</h1>
        
        {/* Tampilkan pesan error atau sukses */}
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
          <div className="mt-8 flex justify-end gap-4">
            <button type="button" onClick={() => navigate('/dashboard')} className="bg-gray-200 text-gray-800 font-bold py-3 px-8 rounded-lg hover:bg-gray-300 transition duration-300">
              Batal
            </button>
            <button type="submit" className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition duration-300">
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProductPage;
