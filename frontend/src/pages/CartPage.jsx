// src/pages/CartPage.jsx
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

// Komponen Ikon Sampah
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, loading } = useCart();

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka || 0);
  };

  if (loading) {
    return <div className="text-center py-20">Memuat keranjang...</div>;
  }
  
  if (cartItems.length === 0) {
    return (
      <div className="bg-gray-50 py-12">
        <div className="px-6 text-center">
          <h1 className="text-3xl font-bold">Keranjang Belanja Anda Kosong</h1>
          <Link to="/products" className="mt-6 inline-block bg-green-600 text-white font-bold py-3 px-8 rounded-lg">Mulai Belanja</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="px-6">
        <div className="flex flex-col lg:flex-row gap-12">
          
          <div className="lg:w-2/3">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Keranjang Saya</h1>
            <div className="space-y-4">
              {cartItems.map(item => (
                // DIUBAH: Struktur Flexbox diperbaiki agar lebih kokoh
                <div key={item.productId} className="bg-white p-4 rounded-lg shadow-sm flex flex-col sm:flex-row sm:flex-nowrap justify-between items-center gap-4">
                  
                  {/* Bagian Kiri: Gambar & Teks (Bisa tumbuh dan menyusut) */}
                  <div className="flex items-center w-full sm:w-auto flex-grow min-w-0">
                    <img src={item.gambar} alt={item.nama} className="w-20 h-20 rounded-md object-cover flex-shrink-0" />
                    <div className="ml-4 min-w-0">
                      <h2 className="font-bold text-gray-900 truncate">{item.nama}</h2>
                      <p className="text-sm text-gray-500">{formatRupiah(item.harga)}</p>
                    </div>
                  </div>

                  {/* Bagian Kanan: Kontrol (Tidak akan menyusut) */}
                  <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value))}
                      className="w-14 p-1 border rounded-md text-center"
                      min="1"
                    />
                    <p className="w-24 text-right font-semibold text-gray-800">{formatRupiah(item.harga * item.quantity)}</p>
                    <button onClick={() => removeFromCart(item.productId)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors">
                      <TrashIcon />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Kolom Kanan: Ringkasan Pesanan */}
          <div className="lg:w-1/3">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
              <h2 className="text-xl font-bold border-b pb-4">Ringkasan Pesanan</h2>
              <div className="flex justify-between mt-4">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">{formatRupiah(cartTotal)}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-gray-600">Ongkos Kirim</span>
                <span className="font-semibold">Akan dihitung</span>
              </div>
              <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatRupiah(cartTotal)}</span>
              </div>
              <button className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition">
                Lanjut ke Pembayaran
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default CartPage;
