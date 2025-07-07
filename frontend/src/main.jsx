// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// 1. Import dari React Router
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// 2. Import semua komponen Halaman (Pages) Anda
import HomePage from './pages/HomePage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import CartPage from './pages/CartPage.jsx'; 
import ContactPage from './pages/ContactPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import AddProductPage from './pages/AddProductPage.jsx';
import EditProductPage from './pages/EditProductPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import EditProfilePage from './pages/EditProfilePage.jsx'; // Import halaman Edit Profil

// 3. Import kedua komponen "Penjaga Pintu"
import ProtectedRoute from './components/ProtectedRoute.jsx'; 
import PetaniRoute from './components/PetaniRoute.jsx';

// 4. Import semua Provider Context
import { CartProvider } from './context/CartContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

// 5. Buat konfigurasi router yang lengkap
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // App.jsx sebagai layout utama
    children: [
      // Rute-rute yang bisa diakses semua orang (Publik)
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: '/products',
        element: <ProductsPage />,
      },
      {
        path: '/products/:productId',
        element: <ProductDetailPage />,
      },
      {
        path: '/about',
        element: <AboutPage />,
      },
      {
        path: '/contact',
        element: <ContactPage />,
      },
      {
        path: '/cart',
        element: <CartPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },

      // Grup rute untuk SEMUA PENGGUNA YANG LOGIN (Pembeli & Petani)
      {
        element: <ProtectedRoute />, // Dijaga oleh Penjaga Pintu Umum
        children: [
          {
            path: '/profile',
            element: <ProfilePage />,
          },
          {
            path: '/profile/edit', // Rute untuk halaman edit profil
            element: <EditProfilePage />,
          },
        ]
      },

      // Grup rute KHUSUS UNTUK PETANI
      {
        element: <PetaniRoute />, // Dijaga oleh Penjaga Pintu Khusus Petani
        children: [
          {
            path: '/dashboard',
            element: <DashboardPage />,
          },
          {
            path: '/dashboard/add-product',
            element: <AddProductPage />,
          },
          {
            path: '/dashboard/edit-product/:productId',
            element: <EditProductPage />,
          },
        ]
      }
    ],
  },
]);

// 6. Render aplikasi Anda
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);
