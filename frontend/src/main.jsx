// src/main.jsx (Mode Aman untuk Tes)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Kita hanya akan import satu halaman untuk tes
import HomePage from './pages/HomePage.jsx';

// Router dibuat sangat sederhana
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      // Kita nonaktifkan semua rute lain untuk sementara
    ],
  },
]);

// Render aplikasi TANPA AuthProvider dan CartProvider
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
