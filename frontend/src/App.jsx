// src/App.jsx
import { Outlet } from 'react-router-dom';
// PASTIKAN NAMA FILE DAN IMPORT-NYA SAMA PERSIS (misal: huruf kecil semua)
import Navbar from './components/navbar.jsx'; 
import Notification from './components/notification.jsx';

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