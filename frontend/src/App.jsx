// src/App.jsx
import { Outlet } from 'react-router-dom';
import Navbar from './components/navbar';
// 1. Import komponen Notifikasi
import Notification from './components/Notification';

function App() {
  return (
    // Div terluar ini membungkus seluruh aplikasi.
    // 'min-h-screen' memastikan latar belakang memenuhi seluruh tinggi layar.
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* Outlet adalah tempat di mana semua halaman Anda (HomePage, ProductsPage, dll.) akan ditampilkan */}
        <Outlet />
      </main>
      
      {/* 2. Letakkan komponen Notifikasi di sini */}
      {/* Posisinya di luar <main> agar bisa "melayang" di atas segalanya */}
      {/* dengan posisi 'fixed' yang kita atur di dalam komponennya. */}
      <Notification />
    </div>
  );
}

export default App;
