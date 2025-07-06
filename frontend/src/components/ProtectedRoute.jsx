// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Komponen ini akan memeriksa apakah pengguna adalah 'petani'
// Jika tidak, ia akan "melempar" pengguna ke halaman lain.
function ProtectedRoute() {
  const { user, isLoggedIn } = useAuth();

  // Jika belum login, lempar ke halaman login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Jika sudah login TAPI perannya BUKAN 'petani',
  // kita bisa lempar ke halaman utama atau halaman "tidak diizinkan".
  // Untuk sekarang, kita lempar ke halaman utama.
  if (user.role !== 'petani') {
    return <Navigate to="/" replace />;
  }

  // Jika semuanya aman (sudah login DAN seorang petani),
  // tampilkan halaman yang seharusnya (menggunakan Outlet).
  return <Outlet />;
}

export default ProtectedRoute;
