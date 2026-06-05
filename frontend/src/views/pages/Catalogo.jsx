import { useEffect, useState } from 'react';
import { productoModel } from '../../models/api.js';
import { carritoController } from '../../controllers/carritoController.js';

const CATEGORIAS = ['Todos', 'Desayunos', 'Entradas', 'Almuerzos', 'Postres', 'Bocaditos', 'Bebidas Calientes', 'Bebidas Frías'];

const PLACEHOLDER = (
  <div className="producto-card__img"
    style={{ background: 'var(--cream-dk)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>
    🍽️
  </div>
);

function ProductImg({ imagen, nombre }) {
  const [err, setErr] = useState(false);
  if (!imagen || err) return PLACEHOLDER;
  return (
    <picture>
      <img className="producto-card__img" src={imagen} alt={`Foto de ${nombre}`}
        width="300" height="170" loading="lazy" decoding="async"
        onError={() => setErr(true)} />
    </picture>
  );
}

export default function Catalogo({ setCarrito }) {
  const [productos, setProductos] = useState([]);
  const [categoria, setCategoria] = useState('Todos');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    productoModel.getAll()
      .then(setProductos)
      .catch(e => setError(e.message))
      .finally(() => setCargando(false));
  }, []);

  const filtrados = categoria === 'Todos'
    ? productos
    : productos.filter(p => p.categoria === categoria);

  if (cargando) return <div className="empty">Cargando menú...</div>;
  if (error) return <div className="empty" role="alert">Error: {error}</div>;

  return (
    <main>
      <section aria-label="Filtros por categoría">
        <div className="filtros" role="group" aria-label="Categorías del menú">
          {CATEGORIAS.map(cat => (
            <button
              key={cat}
              className={`filtro-btn ${categoria === cat ? 'active' : ''}`}
              onClick={() => setCategoria(cat)}
              aria-pressed={categoria === cat}>
              {cat}
            </button>
          ))}
        </div>
      </section>

      <section aria-labelledby="menu-titulo">
        <div className="page-wrap">
          <h2 id="menu-titulo" className="section-title">
            {categoria === 'Todos' ? 'Nuestro Menú' : categoria}
          </h2>
        </div>
        <div className="productos-grid" role="list" aria-label="Productos disponibles" aria-live="polite">
          {!filtrados.length && (
            <p className="empty" style={{ gridColumn: '1/-1' }}>Sin productos en esta categoría.</p>
          )}
          {filtrados.map(p => (
            <article key={p.id} className="card producto-card" role="listitem" aria-label={p.nombre}>
              <ProductImg imagen={p.imagen} nombre={p.nombre} />
              <div className="producto-card__body">
                <h3 className="producto-card__nombre">{p.nombre}</h3>
                {p.descripcion && <p className="producto-card__desc">{p.descripcion}</p>}
                <p className="producto-card__precio">${Number(p.precio).toFixed(2)}</p>
              </div>
              <div className="producto-card__footer">
                <button
                  className="btn btn--primary"
                  style={{ width: '100%' }}
                  onClick={() => carritoController.agregar(p, setCarrito)}
                  disabled={p.stock <= 0}
                  aria-label={`Agregar ${p.nombre} al carrito`}>
                  {p.stock <= 0 ? 'Agotado' : '+ Agregar'}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
