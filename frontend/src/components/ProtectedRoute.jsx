// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Penjaga Pintu ini hanya memeriksa apakah pengguna sudah login.
// Tidak peduli apa perannya.
function ProtectedRoute() {
  const { isLoggedIn } = useAuth();

  // Jika belum login, lempar ke halaman login.
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Jika sudah login, izinkan akses.
  return <Outlet />;
}

export default ProtectedRoute;
