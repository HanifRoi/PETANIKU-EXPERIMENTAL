// src/pages/ProductDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function ProductDetailPage() {
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { productId } = useParams();
  
  const [product, setProduct] = useState(null); // Nilai awal adalah null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) {
          throw new Error('Produk tidak ditemukan.');
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    if (product) {
      addToCart(product._id, 1);
      // Kita bisa gunakan notifikasi dari context jika sudah diperbaiki
      // Untuk sekarang, alert sederhana sudah cukup
      alert(`"${product.nama}" telah ditambahkan ke keranjang!`);
    }
  };

  // --- INI SOLUSINYA ---
  // "Penjaga" yang akan ditampilkan saat data belum siap

  // 1. Tampilkan pesan loading saat sedang mengambil data
  if (loading) {
    return <div className="text-center py-20">Memuat produk...</div>;
  }

  // 2. Tampilkan pesan error jika terjadi masalah
  if (error) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-red-500">{error}</h1>
        <Link to="/products" className="text-green-600 hover:underline mt-4 inline-block">
          &larr; Kembali ke semua produk
        </Link>
      </div>
    );
  }
  
  // 3. Tampilkan pesan jika karena alasan lain produk tidak ada
  if (!product) {
    return <div className="text-center py-20">Produk tidak tersedia.</div>;
  }
  
  // -------------------------

  // Tampilan ini hanya akan dirender JIKA data produk sudah siap
  return (
    <div className="bg-white py-12">
      <div className="px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <img 
              src={product.gambar} 
              alt={product.nama}
              className="w-full h-auto max-h-[500px] object-cover rounded-lg shadow-lg"
            />
          </div>
          <div className="lg:w-1/2">
            <h1 className="text-4xl font-bold text-gray-800">{product.nama}</h1>
            <p className="text-lg text-gray-500 mt-2">oleh {product.petani}</p>
            <p className="text-3xl font-bold text-green-600 my-6">
              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(product.harga)} / {product.satuan}
            </p>
            <p className="text-gray-700 leading-relaxed">
              {product.deskripsi || 'Deskripsi untuk produk ini belum tersedia.'}
            </p>
            <button 
              onClick={handleAddToCart}
              className="mt-8 w-full lg:w-auto bg-green-600 text-white font-bold py-3 px-10 rounded-lg hover:bg-green-700 transition-colors"
            >
              + Tambah ke Keranjang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
