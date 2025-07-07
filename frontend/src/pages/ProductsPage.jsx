// src/pages/ProductsPage.jsx
import { useState, useEffect } from 'react'; // 1. Import useState dan useEffect
// import { dummyProducts } from '../data'; // 2. Hapus atau komentari import data dummy
import ProductCard from '../components/ProductCard';

function ProductsPage() {
  // 3. Buat state untuk menyimpan data produk dari backend
  const [products, setProducts] = useState([]);

  // 4. Gunakan useEffect untuk mengambil data saat komponen pertama kali dimuat
  useEffect(() => {
    // Fungsi untuk mengambil data dari API
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data); // Simpan data dari API ke dalam state
      } catch (error) {
        console.error("Gagal mengambil data produk:", error);
      }
    };

    fetchProducts();
  }, []); // Array kosong berarti efek ini hanya berjalan sekali

  return (
    <div className="bg-gray-50 py-12">
      <div className="px-6">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Semua Produk</h1>
          <p className="text-gray-600">Temukan hasil panen segar terbaik dari para petani lokal.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {/* 5. Gunakan state 'products' untuk me-render kartu */}
          {products.map(produk => (
            <ProductCard key={produk.id} product={produk} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;
