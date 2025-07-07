// src/App.jsx
import { Outlet } from 'react-router-dom';
// DIUBAH: Nama impor disesuaikan persis dengan nama file Anda
import Navbar from './components/navbar.jsx'; 
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
