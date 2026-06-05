import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authController } from '../../controllers/authController.js';

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      const usuario = await authController.login(form.email, form.password);
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
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input id="email" name="email" type="email"
              value={form.email} onChange={handleChange}
              placeholder="tucorreo@email.com"
              autoComplete="email" required aria-required="true" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input id="password" name="password" type="password"
              value={form.password} onChange={handleChange}
              placeholder="••••••" autoComplete="current-password"
              required aria-required="true" />
          </div>
          {error && <p className="error-msg" role="alert" aria-live="polite">{error}</p>}
          <button className="btn btn--primary" style={{ width: '100%' }}
            type="submit" disabled={cargando}>
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
        <p style={{ marginTop: '1rem', fontSize: '.88rem', color: 'var(--muted)', textAlign: 'center' }}>
          ¿No tienes cuenta? <Link to="/register" style={{ color: 'var(--cinnamon)' }}>Regístrate</Link>
        </p>
      </div>
    </main>
  );
}
