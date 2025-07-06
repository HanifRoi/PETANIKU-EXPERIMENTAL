// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Kita butuh library untuk "membaca" isi token

// 1. Buat Context
const AuthContext = createContext();

// 2. Buat Custom Hook
export function useAuth() {
  return useContext(AuthContext);
}

// 3. Buat Provider
export function AuthProvider({ children }) {
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  // Gunakan useEffect untuk "membaca" token saat aplikasi pertama kali dimuat
  useEffect(() => {
    if (authToken) {
      try {
        const decodedUser = jwtDecode(authToken);
        setUser(decodedUser);
      } catch (error) {
        // Jika token tidak valid, hapus dari localStorage
        console.error("Token tidak valid:", error);
        localStorage.removeItem('token');
        setAuthToken(null);
        setUser(null);
      }
    }
  }, [authToken]);

  // Fungsi untuk Login
  const login = (token) => {
    localStorage.setItem('token', token);
    setAuthToken(token);
    const decodedUser = jwtDecode(token);
    setUser(decodedUser);
  };

  // Fungsi untuk Logout
  const logout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setUser(null);
  };

  // Nilai yang akan dibagikan
  const value = {
    user,
    token: authToken,
    isLoggedIn: !!authToken, // true jika ada token, false jika tidak
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
