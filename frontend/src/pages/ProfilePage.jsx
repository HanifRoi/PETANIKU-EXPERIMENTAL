// src/pages/ProfilePage.jsx
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

// Ikon sederhana untuk mempercantik
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const RoleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 100 4h4a2 2 0 100-4h-4z" /></svg>;

function ProfilePage() {
  const { user } = useAuth();

  // Jika karena suatu alasan data user belum ada, tampilkan pesan loading
  if (!user) {
    return <div className="text-center py-20">Memuat data pengguna...</div>;
  }

  return (
    <div className="bg-gray-50 py-12 px-6 min-h-screen">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Profil */}
        <div className="bg-white p-8 rounded-lg shadow-md flex items-center gap-6">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-5xl font-bold text-green-600">{user.nama ? user.nama.charAt(0).toUpperCase() : '?'}</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{user.nama}</h1>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>
        
        {/* Detail Akun */}
        <div className="mt-8 bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Detail Akun</h2>
          <div className="space-y-4 mb-6"> {/* Tambah mb-6 untuk spasi sebelum tombol */}
            <div className="flex items-center gap-4">
              <UserIcon className="text-gray-400" />
              <span className="text-gray-700">Nama: {user.nama}</span>
            </div>
            <div className="flex items-center gap-4">
              <MailIcon className="text-gray-400" />
              <span className="text-gray-700">Email: {user.email}</span>
            </div>
            <div className="flex items-center gap-4">
              <RoleIcon className="text-gray-400" />
              <span className="text-gray-700">Peran: <span className="font-semibold capitalize bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">{user.role}</span></span>
            </div>
          </div>
          {/* Perubahan di sini: Kelas CSS untuk tombol Edit Profil agar kecil seperti tombol Dashboard */}
          <Link 
            to="/profile/edit" 
            className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Edit Profil
          </Link>
        </div>

        {/* Bagian Khusus Berdasarkan Peran */}
        <div className="mt-8">
          {user.role === 'petani' ? (
            // Tampilan untuk Petani
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Aksi Petani</h2>
              <p className="text-gray-600 mb-6">Kelola produk dan lihat performa toko Anda.</p>
              <Link to="/dashboard" className="bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition">
                Pergi ke Dasbor
              </Link>
            </div>
          ) : (
            // Tampilan untuk Pembeli
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Riwayat Pesanan</h2>
              <p className="text-gray-600">Fitur untuk melihat riwayat pesanan Anda akan segera hadir di sini.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default ProfilePage;