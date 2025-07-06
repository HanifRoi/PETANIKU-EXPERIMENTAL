// src/context/CartContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token, isLoggedIn } = useAuth();

  // DIKEMBALIKAN: State untuk mengelola notifikasi
  const [notification, setNotification] = useState({ message: '', show: false, type: 'success' });

  // DIKEMBALIKAN: Fungsi untuk menampilkan notifikasi
  const showNotification = (message, type = 'success') => {
    setNotification({ message, show: true, type });
    setTimeout(() => {
      setNotification({ message: '', show: false, type: 'success' });
    }, 3000);
  };

  useEffect(() => {
    const fetchCart = async () => {
      if (isLoggedIn && token) {
        setLoading(true);
        try {
          const response = await fetch('http://localhost:3001/api/cart', {
            headers: { 'auth-token': token },
          });
          const data = await response.json();
          setCartItems(data || []);
        } catch (error) {
          console.error("Gagal mengambil keranjang:", error);
          setCartItems([]);
        } finally {
          setLoading(false);
        }
      } else {
        setCartItems([]);
      }
    };
    fetchCart();
  }, [isLoggedIn, token]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      const response = await fetch('http://localhost:3001/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token,
        },
        body: JSON.stringify({ productId, quantity }),
      });
      const updatedCart = await response.json();
      setCartItems(updatedCart);
      // Panggil notifikasi setelah berhasil
      showNotification('Produk berhasil ditambahkan!', 'success');
    } catch (error) {
      console.error("Gagal menambah ke keranjang:", error);
      showNotification('Gagal menambah produk.', 'error');
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/cart/remove/${productId}`, {
        method: 'DELETE',
        headers: { 'auth-token': token },
      });
      const updatedCart = await response.json();
      setCartItems(updatedCart);
      showNotification('Produk dihapus dari keranjang.', 'error');
    } catch (error) {
      console.error("Gagal menghapus dari keranjang:", error);
      showNotification('Gagal menghapus produk.', 'error');
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const response = await fetch('http://localhost:3001/api/cart/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token,
        },
        body: JSON.stringify({ productId, quantity }),
      });
      const updatedCart = await response.json();
      setCartItems(updatedCart);
    } catch (error) {
      console.error("Gagal mengubah kuantitas:", error);
    }
  };

  const value = {
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    cartItemCount: cartItems.reduce((total, item) => total + item.quantity, 0),
    cartTotal: cartItems.reduce((total, item) => total + (item.harga * item.quantity), 0),
    notification, // DIKEMBALIKAN: Bagikan state notifikasi
    showNotification, // Kita juga bisa bagikan fungsinya jika perlu
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
