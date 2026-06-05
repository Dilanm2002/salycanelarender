import { useEffect, useState } from 'react';
import { productoModel, pedidoModel } from '../../models/api.js';
import { authController } from '../../controllers/authController.js';
import { useNavigate } from 'react-router-dom';

const FORM_VACIO = { nombre: '', descripcion: '', precio: '', stock: '', categoria: 'Desayunos', imagen: '' };
const CATS = ['Desayunos', 'Entradas', 'Almuerzos', 'Postres', 'Bocaditos', 'Bebidas Calientes', 'Bebidas Frías'];

export default function Admin() {
  const [tab, setTab] = useState('productos');
  const [productos, setProductos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [form, setForm] = useState(FORM_VACIO);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!authController.isAdmin()) { navigate('/'); return; }
    cargarProductos();
    cargarPedidos();
  }, []);

  const cargarProductos = () => productoModel.getAll().then(setProductos).catch(() => {});
  const cargarPedidos  = () => pedidoModel.todos().then(setPedidos).catch(() => {});

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleGuardar = async e => {
    e.preventDefault();
    try {
      if (editId) {
        await productoModel.update(editId, form);
        setMsg('Producto actualizado ✓');
      } else {
        await productoModel.create(form);
        setMsg('Producto creado ✓');
      }
      setForm(FORM_VACIO);
      setEditId(null);
      cargarProductos();
    } catch (err) {
      setMsg('Error: ' + err.message);
    }
    setTimeout(() => setMsg(''), 3000);
  };

  const handleEditar = p => {
    setEditId(p.id);
    setForm({ nombre: p.nombre, descripcion: p.descripcion || '', precio: p.precio,
               stock: p.stock, categoria: p.categoria || 'Desayunos', imagen: p.imagen || '' });
    setTab('productos');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEliminar = async id => {
    if (!confirm('¿Eliminar este producto?')) return;
    await productoModel.delete(id);
    cargarProductos();
  };

  const handleEstado = async (id, estado) => {
    await pedidoModel.actualizarEstado(id, estado);
    cargarPedidos();
  };

  return (
    <main>
      <div className="admin-wrap">
        <h2>Panel de Administración</h2>

        <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1.5rem' }}>
          <button className={`btn ${tab === 'productos' ? 'btn--primary' : 'btn--outline'}`}
            onClick={() => setTab('productos')}>Productos</button>
          <button className={`btn ${tab === 'pedidos' ? 'btn--primary' : 'btn--outline'}`}
            onClick={() => setTab('pedidos')}>Pedidos</button>
        </div>

        {tab === 'productos' && (
          <>
            <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>{editId ? 'Editar producto' : 'Agregar producto'}</h3>
              <form onSubmit={handleGuardar}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label htmlFor="nombre">Nombre *</label>
                    <input id="nombre" name="nombre" value={form.nombre} onChange={handleChange} required />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label htmlFor="categoria">Categoría</label>
                    <select id="categoria" name="categoria" value={form.categoria} onChange={handleChange}>
                      {CATS.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label htmlFor="precio">Precio *</label>
                    <input id="precio" name="precio" type="number" step="0.01" min="0.01" value={form.precio} onChange={handleChange} required />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label htmlFor="stock">Stock</label>
                    <input id="stock" name="stock" type="number" min="0" value={form.stock} onChange={handleChange} />
                  </div>
                  <div className="form-group" style={{ margin: 0, gridColumn: '1/-1' }}>
                    <label htmlFor="descripcion">Descripción</label>
                    <input id="descripcion" name="descripcion" value={form.descripcion} onChange={handleChange} />
                  </div>
                  <div className="form-group" style={{ margin: 0, gridColumn: '1/-1' }}>
                    <label htmlFor="imagen">URL de imagen</label>
                    <input id="imagen" name="imagen" value={form.imagen} onChange={handleChange} placeholder="https://..." />
                  </div>
                </div>
                {msg && <p style={{ marginTop: '.75rem', color: msg.startsWith('Error') ? '#dc2626' : '#16a34a', fontWeight: '600' }}
                  role="alert">{msg}</p>}
                <div style={{ display: 'flex', gap: '.5rem', marginTop: '1rem' }}>
                  <button className="btn btn--primary" type="submit">{editId ? 'Guardar cambios' : 'Agregar'}</button>
                  {editId && <button className="btn btn--outline" type="button"
                    onClick={() => { setEditId(null); setForm(FORM_VACIO); }}>Cancelar</button>}
                </div>
              </form>
            </div>

            <table className="tabla" aria-label="Lista de productos">
              <thead>
                <tr><th>ID</th><th>Imagen</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr>
              </thead>
              <tbody>
                {productos.map(p => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.imagen ? <img src={p.imagen} alt={p.nombre} /> : '—'}</td>
                    <td>{p.nombre}</td>
                    <td>{p.categoria}</td>
                    <td>${Number(p.precio).toFixed(2)}</td>
                    <td>{p.stock}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '.4rem' }}>
                        <button className="btn btn--outline btn--sm" onClick={() => handleEditar(p)}>✏️ Editar</button>
                        <button className="btn btn--danger btn--sm" onClick={() => handleEliminar(p.id)}>🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {tab === 'pedidos' && (
          <table className="tabla" aria-label="Todos los pedidos">
            <thead>
              <tr><th>ID</th><th>Usuario</th><th>Mesa</th><th>Total</th><th>Estado</th><th>Fecha</th><th>Acción</th></tr>
            </thead>
            <tbody>
              {pedidos.map(p => (
                <tr key={p.id}>
                  <td>#{p.id}</td>
                  <td>{p.usuario?.username}</td>
                  <td>{p.mesa || '—'}</td>
                  <td>${Number(p.total).toFixed(2)}</td>
                  <td>{p.estado}</td>
                  <td>{new Date(p.createdAt).toLocaleString('es-EC')}</td>
                  <td>
                    {p.estado === 'PENDIENTE' && (
                      <button className="btn btn--primary btn--sm"
                        onClick={() => handleEstado(p.id, 'COBRADO')}>Cobrar</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
