// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Import semua halaman
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
import EditProfilePage from './pages/EditProfilePage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx'; 
import PetaniRoute from './components/PetaniRoute.jsx';


// Import semua komponen keamanan dan context
import ProtectedRoute from './components/ProtectedRoute.jsx'; 
import PetaniRoute from './components/PetaniRoute.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';

// Konfigurasi router lengkap
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      // Rute Publik
      { index: true, element: <HomePage /> },
      { path: '/products', element: <ProductsPage /> },
      { path: '/products/:productId', element: <ProductDetailPage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/contact', element: <ContactPage /> },
      { path: '/cart', element: <CartPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/login', element: <LoginPage /> },
      // Rute Terlindungi untuk semua user login
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/profile', element: <ProfilePage /> },
          { path: '/profile/edit', element: <EditProfilePage /> },
        ]
      },
      // Rute Terlindungi khusus petani
      {
        element: <PetaniRoute />,
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/dashboard/add-product', element: <AddProductPage /> },
          { path: '/dashboard/edit-product/:productId', element: <EditProductPage /> },
        ]
      }
    ],
  },
]);

// Render aplikasi dengan semua provider
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);
