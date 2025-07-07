// src/App.jsx
import { Outlet } from 'react-router-dom';
// PASTIKAN SEMUA IMPORT MENGGUNAKAN HURUF BESAR DI AWAL
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
