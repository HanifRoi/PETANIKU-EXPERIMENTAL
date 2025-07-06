// src/pages/DashboardPage.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function DashboardPage() {
  const { user, token } = useAuth();
  const [myProducts, setMyProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // State untuk dialog konfirmasi hapus
  const [showConfirm, setShowConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  
  // Fungsi untuk mengambil data produk milik petani dari backend
  const fetchMyProducts = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/products/my-products', {
        headers: { 'auth-token': token },
      });
      if (!response.ok) throw new Error('Gagal memuat produk.');
      const data = await response.json();
      
      // --- CCTV 6: Data apa yang diterima frontend? ---
      console.log('--- DATA DITERIMA DI DASBOR FRONTEND ---');
      console.log(data);
      // -----------------------------------------------

      setMyProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  // Gunakan useEffect untuk mengambil data saat komponen pertama kali dimuat
  useEffect(() => {
    fetchMyProducts();
  }, [token]); // Efek ini akan berjalan kembali jika token berubah

  // Fungsi untuk membuka dialog konfirmasi
  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowConfirm(true);
  };

  // Fungsi untuk menjalankan penghapusan setelah dikonfirmasi
  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      const response = await fetch(`http://localhost:3001/api/products/${productToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'auth-token': token,
        },
      });

      if (!response.ok) {
        throw new Error('Gagal menghapus produk.');
      }

      // Panggil ulang fetchMyProducts untuk mendapatkan daftar terbaru dari server.
      // Ini menjamin data selalu sinkron.
      fetchMyProducts(); 
      alert(`"${productToDelete.nama}" berhasil dihapus.`);

    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      // Tutup dialog
      setShowConfirm(false);
      setProductToDelete(null);
    }
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka || 0);
  };

  return (
    <div className="bg-gray-50 py-12 px-6 min-h-screen">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">
          Dasbor Petani
        </h1>
        <p className="text-gray-600 mt-2">
          Selamat Datang, {user?.nama}!
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold">Produk Saya</h2>
            <Link 
              to="/dashboard/add-product"
              className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
            >
              + Tambah Produk Baru
            </Link>
          </div>
          
          {/* Tabel untuk menampilkan produk */}
          {loading ? (
            <p className="text-center text-gray-500 py-10">Memuat produk Anda...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Gambar</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Nama Produk</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Harga</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {myProducts.length > 0 ? (
                    myProducts.map((product) => (
                      <tr key={product._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <img src={product.gambar} alt={product.nama} className="h-16 w-16 object-cover rounded-md" />
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-800">{product.nama}</td>
                        <td className="py-3 px-4 text-gray-600">{formatRupiah(product.harga)} / {product.satuan}</td>
                        <td className="py-3 px-4">
                          <Link to={`/dashboard/edit-product/${product._id}`} className="text-blue-500 hover:underline mr-4 text-sm">Edit</Link>
                          <button onClick={() => handleDeleteClick(product)} className="text-red-500 hover:underline text-sm">Hapus</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    // Tampilan jika tidak ada produk
                    <tr>
                      <td colSpan="4" className="text-center py-10 text-gray-500">
                        Anda belum memiliki produk. Silakan tambah produk baru.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Dialog Konfirmasi Hapus */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-sm mx-4">
            <h3 className="text-xl font-bold mb-4">Anda Yakin?</h3>
            <p className="text-gray-600 mb-6">
              Produk <span className="font-bold">"{productToDelete?.nama}"</span> akan dihapus secara permanen.
            </p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setShowConfirm(false)} className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">Batal</button>
              <button onClick={confirmDelete} className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
