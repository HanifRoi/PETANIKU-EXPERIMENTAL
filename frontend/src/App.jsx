// src/App.jsx (Mode Aman untuk Tes)
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
// import Notification from './components/Notification'; // Dinonaktifkan sementara

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Outlet />
      </main>
      {/* <Notification /> */}
    </div>
  );
}

export default App;
