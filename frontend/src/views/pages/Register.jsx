import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authController } from '../../controllers/authController.js';

export default function Register({ onLogin }) {
  const [form, setForm] = useState({ email: '', username: '', password: '', password2: '' });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (form.password !== form.password2) {
      setError('Las contraseñas no coinciden');
      return;
    }
    setCargando(true);
    try {
      const usuario = await authController.register(form.email, form.username, form.password);
      onLogin(usuario);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <main>
      <div className="form-box" role="main">
        <h2>Crear cuenta</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input id="email" name="email" type="email"
              value={form.email} onChange={handleChange}
              placeholder="tucorreo@email.com" autoComplete="email" required />
          </div>
          <div className="form-group">
            <label htmlFor="username">Usuario</label>
            <input id="username" name="username" type="text"
              value={form.username} onChange={handleChange}
              placeholder="Ej: maria_123" autoComplete="username" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input id="password" name="password" type="password"
              value={form.password} onChange={handleChange}
              placeholder="Mínimo 6 caracteres" autoComplete="new-password" required />
          </div>
          <div className="form-group">
            <label htmlFor="password2">Confirmar contraseña</label>
            <input id="password2" name="password2" type="password"
              value={form.password2} onChange={handleChange}
              placeholder="Repite la contraseña" autoComplete="new-password" required />
          </div>
          {error && <p className="error-msg" role="alert" aria-live="polite">{error}</p>}
          <button className="btn btn--primary" style={{ width: '100%' }}
            type="submit" disabled={cargando}>
            {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>
        <p style={{ marginTop: '1rem', fontSize: '.88rem', color: 'var(--muted)', textAlign: 'center' }}>
          ¿Ya tienes cuenta? <Link to="/login" style={{ color: 'var(--cinnamon)' }}>Inicia sesión</Link>
        </p>
      </div>
    </main>
  );
}
