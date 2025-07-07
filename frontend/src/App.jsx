// src/App.jsx
import { Outlet } from 'react-router-dom';
// PASTIKAN NAMA FILE DAN IMPORT-NYA SAMA PERSIS
// Jika nama file Anda 'navbar.jsx', gunakan huruf kecil di sini.
// Jika nama file Anda 'Navbar.jsx', gunakan huruf besar.
import Navbar from './components/Navbar.jsx'; 
import Notification from './components/Notification.jsx';

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Notification />
    </div>
  );
}

export default App;