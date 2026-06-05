import { useEffect, useState } from 'react';
import { pedidoModel } from '../../models/api.js';
import { useNavigate } from 'react-router-dom';
import { authController } from '../../controllers/authController.js';

export default function MisPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authController.isLoggedIn()) { navigate('/login'); return; }
    pedidoModel.misPedidos()
      .then(setPedidos)
      .catch(() => {})
      .finally(() => setCargando(false));
  }, []);

  const estadoColor = { PENDIENTE: '#d97706', COBRADO: '#16a34a', CANCELADO: '#dc2626' };

  if (cargando) return <div className="empty">Cargando...</div>;

  return (
    <main>
      <div className="page-wrap">
        <h2 className="section-title">Mis pedidos</h2>
        {!pedidos.length && <div className="empty">Aún no tienes pedidos.</div>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {pedidos.map(p => (
            <div key={p.id} className="card" style={{ padding: '1rem 1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.5rem' }}>
                <span style={{ fontWeight: '700' }}>Pedido #{p.id}</span>
                <span style={{
                  padding: '.2rem .6rem', borderRadius: '999px', fontSize: '.75rem',
                  fontWeight: '700', background: estadoColor[p.estado] + '22',
                  color: estadoColor[p.estado]
                }}>{p.estado}</span>
              </div>
              <p style={{ fontSize: '.82rem', color: 'var(--muted)', marginBottom: '.5rem' }}>
                {new Date(p.createdAt).toLocaleString('es-EC')}
                {p.mesa && ` · Mesa ${p.mesa}`}
              </p>
              <ul style={{ fontSize: '.85rem', listStyle: 'none', marginBottom: '.5rem' }}>
                {p.detalles.map(d => (
                  <li key={d.id}>
                    {d.cantidad}× {d.producto?.nombre} — ${(d.cantidad * d.precioUnitario).toFixed(2)}
                  </li>
                ))}
              </ul>
              <p style={{ fontWeight: '700', color: 'var(--cinnamon)' }}>Total: ${Number(p.total).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
