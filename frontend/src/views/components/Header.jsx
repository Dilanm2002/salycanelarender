import { Link, useNavigate } from 'react-router-dom';
import { authController } from '../../controllers/authController.js';

export default function Header({ carrito, onAbrirCarrito, onLogout }) {
  const navigate = useNavigate();
  const usuario = authController.getUsuario();
  const total = carrito.reduce((s, i) => s + i.cantidad, 0);

  const handleLogout = () => {
    authController.logout();
    onLogout();
    navigate('/');
  };

  return (
    <header className="header" role="banner">
      <Link to="/" className="header__logo" aria-label="Sal y Canela inicio">
        Sal <span>y</span> Canela
      </Link>

      <nav className="header__nav" aria-label="Navegación principal">
        <Link to="/">Menú</Link>
        {usuario && <Link to="/mis-pedidos">Mis pedidos</Link>}
        {authController.isAdmin() && <Link to="/admin">Admin</Link>}

        {usuario ? (
          <>
            <span style={{ color: 'rgba(255,255,255,.6)', fontSize: '.82rem' }}>
              Hola, {usuario.username}
            </span>
            <button className="btn btn--outline btn--sm"
              style={{ borderColor: 'rgba(255,255,255,.4)', color: '#fff' }}
              onClick={handleLogout}>
              Salir
            </button>
          </>
        ) : (
          <Link to="/login">
            <button className="btn btn--primary btn--sm">Iniciar sesión</button>
          </Link>
        )}

        <button
          className="btn btn--primary btn--sm"
          onClick={onAbrirCarrito}
          aria-label={`Carrito con ${total} productos`}
          style={{ position: 'relative' }}>
          🛒 {total > 0 && (
            <span style={{
              position: 'absolute', top: '-6px', right: '-6px',
              background: '#fff', color: 'var(--cinnamon)',
              borderRadius: '50%', width: '18px', height: '18px',
              fontSize: '.7rem', fontWeight: '700',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>{total}</span>
          )}
        </button>
      </nav>
    </header>
  );
}
