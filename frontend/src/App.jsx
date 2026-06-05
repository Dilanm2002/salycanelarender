import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { carritoModel } from './models/carritoModel.js';
import Header from './views/components/Header.jsx';
import Carrito from './views/components/Carrito.jsx';
import Catalogo from './views/pages/Catalogo.jsx';
import Login from './views/pages/Login.jsx';
import Register from './views/pages/Register.jsx';
import MisPedidos from './views/pages/MisPedidos.jsx';
import Admin from './views/pages/Admin.jsx';

export default function App() {
  const [carrito, setCarrito] = useState(carritoModel.leer());
  const [carritoOpen, setCarritoOpen] = useState(false);
  const [, forceUpdate] = useState(0);

  const handleLogin = () => forceUpdate(n => n + 1);
  const handleLogout = () => forceUpdate(n => n + 1);

  return (
    <>
      <Header
        carrito={carrito}
        onAbrirCarrito={() => setCarritoOpen(true)}
        onLogout={handleLogout}
      />
      <Carrito
        open={carritoOpen}
        onCerrar={() => setCarritoOpen(false)}
        carrito={carrito}
        setCarrito={setCarrito}
      />
      <Routes>
        <Route path="/"           element={<Catalogo setCarrito={setCarrito} />} />
        <Route path="/login"      element={<Login onLogin={handleLogin} />} />
        <Route path="/register"   element={<Register onLogin={handleLogin} />} />
        <Route path="/mis-pedidos" element={<MisPedidos />} />
        <Route path="/admin"      element={<Admin />} />
      </Routes>
    </>
  );
}
