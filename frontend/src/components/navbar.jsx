// src/components/Navbar.jsx
import { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

// --- Kumpulan Ikon SVG ---
const ShoppingCartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
);
const HamburgerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
);
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
);


function Navbar() {
  const { cartItemCount } = useCart();
  const { isLoggedIn, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // State baru untuk mengontrol dropdown profil
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef(null);

  // Fungsi untuk menutup dropdown jika klik di luar area
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileMenuRef]);


  const baseLinkClass = "px-3 py-2 rounded-md text-sm font-medium";
  const activeLinkClass = "text-green-600 font-bold bg-green-50";
  const inactiveLinkClass = "text-gray-700 hover:text-green-600";

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-green-600">PETANIKU</Link>
          </div>

          {/* Menu untuk Desktop */}
          <div className="hidden md:flex items-center">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink to="/" className={({ isActive }) => `${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}>Beranda</NavLink>
              <NavLink to="/products" className={({ isActive }) => `${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}>Produk</NavLink>
              <NavLink to="/about" className={({ isActive }) => `${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}>Tentang Kami</NavLink>
              <NavLink to="/contact" className={({ isActive }) => `${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}>Kontak</NavLink>
            </div>
            <div className="ml-4 flex items-center space-x-4">
              <NavLink to="/cart" className={({ isActive }) => `relative p-2 rounded-full ${isActive ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:text-green-600'}`}>
                <ShoppingCartIcon />
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">{cartItemCount}</span>
                )}
              </NavLink>
              
              {isLoggedIn ? (
                // DIUBAH: Menjadi menu dropdown
                <div className="relative" ref={profileMenuRef}>
                  <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center font-medium text-gray-700 focus:outline-none">
                    Halo, {user && user.nama ? user.nama.split(' ')[0] : 'Pengguna'}
                    <svg className="h-5 w-5 ml-1 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                  </button>
                  {isProfileOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                      {user && user.role === 'petani' && (
                        <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsProfileOpen(false)}>Dashboard Petani</Link>
                      )}
                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsProfileOpen(false)}>Profil Saya</Link>
                      <button onClick={() => { logout(); setIsProfileOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/login" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium">Masuk</Link>
                  <Link to="/register" className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700">Daftar</Link>
                </div>
              )}
            </div>
          </div>

          {/* Tombol Hamburger untuk Mobile */}
          <div className="md:hidden flex items-center">
             <NavLink to="/cart" className={({ isActive }) => `relative p-2 rounded-full mr-2 ${isActive ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:text-green-600'}`}>
                <ShoppingCartIcon />
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">{cartItemCount}</span>
                )}
              </NavLink>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-green-600 focus:outline-none"
            >
              {isMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Panel Menu Mobile */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink to="/" className={({ isActive }) => `block ${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`} onClick={() => setIsMenuOpen(false)}>Beranda</NavLink>
            <NavLink to="/products" className={({ isActive }) => `block ${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`} onClick={() => setIsMenuOpen(false)}>Produk</NavLink>
            <NavLink to="/about" className={({ isActive }) => `block ${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`} onClick={() => setIsMenuOpen(false)}>Tentang Kami</NavLink>
            <NavLink to="/contact" className={({ isActive }) => `block ${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`} onClick={() => setIsMenuOpen(false)}>Kontak</NavLink>
            
            {!isLoggedIn && (
              <div className="pt-4 pb-2 border-t border-gray-200">
                <Link to="/login" className="block w-full text-left text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>Masuk</Link>
                <Link to="/register" className="mt-1 block w-full text-left bg-green-600 text-white px-3 py-2 rounded-md text-base font-medium hover:bg-green-700" onClick={() => setIsMenuOpen(false)}>Daftar</Link>
              </div>
            )}
            {isLoggedIn && (
               <div className="pt-4 pb-2 border-t border-gray-200">
                 <span className="block px-3 py-2 text-base font-medium text-gray-500">
                   Masuk sebagai {user ? user.nama : ''}
                 </span>
                 {user && user.role === 'petani' && (
                    <Link to="/dashboard" className="block w-full text-left text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>Dashboard Petani</Link>
                 )}
                 <Link to="/profile" className="block w-full text-left text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>Profil Saya</Link>
                 <button onClick={() => { logout(); setIsMenuOpen(false); }} className="mt-1 block w-full text-left text-red-600 px-3 py-2 rounded-md text-base font-medium">Logout</button>
               </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
export default Navbar;
