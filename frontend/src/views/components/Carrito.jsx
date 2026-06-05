import { useState } from 'react';
import { carritoController } from '../../controllers/carritoController.js';
import { authController } from '../../controllers/authController.js';
import { useNavigate } from 'react-router-dom';

export default function Carrito({ open, onCerrar, carrito, setCarrito }) {
  const [mesa, setMesa] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const total = carrito.reduce((s, i) => s + i.precio * i.cantidad, 0);

  const handleConfirmar = async () => {
    if (!authController.isLoggedIn()) {
      onCerrar();
      navigate('/login');
      return;
    }
    try {
      setCargando(true);
      setError('');
      await carritoController.confirmarPedido(carrito, mesa ? parseInt(mesa) : null, setCarrito);
      onCerrar();
      navigate('/mis-pedidos');
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
      {open && <div className="overlay" onClick={onCerrar} aria-hidden="true" />}
      <aside
        className={`carrito-panel ${open ? 'open' : ''}`}
        role="dialog" aria-modal="true" aria-label="Carrito de compras"
        aria-hidden={!open}>
        <div className="carrito-panel__head">
          <h2 style={{ fontSize: '1rem' }}>Mi orden ({carrito.length})</h2>
          <button onClick={onCerrar} aria-label="Cerrar carrito"
            style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.3rem', cursor: 'pointer' }}>
            ✕
          </button>
        </div>

        <div className="carrito-panel__items" role="list">
          {!carrito.length && (
            <div className="empty">Tu orden está vacía</div>
          )}
          {carrito.map(item => (
            <div key={item.id} className="carrito-item" role="listitem">
              {item.imagen && (
                <img className="carrito-item__img" src={item.imagen} alt={item.nombre} width="52" height="52" />
              )}
              <div className="carrito-item__info">
                <p className="carrito-item__nombre">{item.nombre}</p>
                <p className="carrito-item__precio">${(item.precio * item.cantidad).toFixed(2)}</p>
              </div>
              <div className="qty-ctrl" role="group" aria-label={`Cantidad ${item.nombre}`}>
                <button onClick={() => carritoController.cambiarCantidad(item.id, item.cantidad - 1, setCarrito)}
                  aria-label="Reducir cantidad">−</button>
                <span>{item.cantidad}</span>
                <button onClick={() => carritoController.cambiarCantidad(item.id, item.cantidad + 1, setCarrito)}
                  aria-label="Aumentar cantidad">+</button>
              </div>
            </div>
          ))}
        </div>

        <div className="carrito-panel__foot">
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700' }}>
            <span>Total</span>
            <span style={{ color: 'var(--cinnamon)' }}>${total.toFixed(2)}</span>
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label htmlFor="mesa-input">Número de mesa (opcional)</label>
            <input id="mesa-input" type="number" min="1" max="20"
              value={mesa} onChange={e => setMesa(e.target.value)}
              placeholder="Ej: 5" />
          </div>
          {error && <p className="error-msg" role="alert">{error}</p>}
          <button className="btn btn--primary"
            onClick={handleConfirmar}
            disabled={!carrito.length || cargando}>
            {cargando ? 'Enviando...' : '✓ Confirmar pedido'}
          </button>
          <button className="btn btn--outline btn--sm"
            onClick={() => carritoController.vaciar(setCarrito)}>
            Vaciar
          </button>
        </div>
      </aside>
    </>
  );
}
