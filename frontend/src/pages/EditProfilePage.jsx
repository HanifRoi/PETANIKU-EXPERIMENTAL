// src/pages/EditProfilePage.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function EditProfilePage() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState({ nama: '', email: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/users/me', {
          headers: { 'auth-token': token },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        setUserData({ nama: data.nama, email: data.email });
      } catch (err) {
        setError(err.message);
      }
    };
    if (token) fetchUserData();
  }, [token]);

  const handleUserChange = (e) => setUserData({ ...userData, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      const response = await fetch('http://localhost:3001/api/users/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'auth-token': token },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setSuccess('Profil berhasil diperbarui. Silakan login kembali untuk melihat perubahan.');
      setTimeout(logout, 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      const response = await fetch('http://localhost:3001/api/users/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'auth-token': token },
        body: JSON.stringify(passwordData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setSuccess('Password berhasil diubah! Anda akan logout.');
      setTimeout(logout, 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Form Edit Profil */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Profil</h1>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          {success && <div className="text-green-500 mb-4">{success}</div>}
          <form onSubmit={handleUpdateProfile}>
            <div className="space-y-4">
              <div>
                <label htmlFor="nama" className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                <input type="text" name="nama" id="nama" value={userData.nama} onChange={handleUserChange} className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"/>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" name="email" id="email" value={userData.email} onChange={handleUserChange} className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"/>
              </div>
            </div>
            <div className="mt-6 text-right">
              <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700">Simpan Perubahan Profil</button>
            </div>
          </form>
        </div>

        {/* Form Ganti Password */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Ubah Password</h2>
          <form onSubmit={handleChangePassword}>
            <div className="space-y-4">
              <div>
                <label htmlFor="currentPassword">Password Saat Ini</label>
                <input type="password" name="currentPassword" id="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"/>
              </div>
              <div>
                <label htmlFor="newPassword">Password Baru</label>
                <input type="password" name="newPassword" id="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"/>
              </div>
            </div>
            <div className="mt-6 text-right">
              <button type="submit" className="bg-gray-700 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-800">Ubah Password</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProfilePage;
