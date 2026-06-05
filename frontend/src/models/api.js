const BASE = (import.meta.env.VITE_API_URL || '') + '/api';

function getToken() {
  return localStorage.getItem('token');
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`
  };
}

async function request(url, options = {}) {
  const res = await fetch(BASE + url, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error en la solicitud');
  return data;
}

// Auth
export const authModel = {
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    }),
  register: (email, username, password) =>
    request('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password })
    })
};

// Productos
export const productoModel = {
  getAll: () => request('/productos'),
  getById: (id) => request(`/productos/${id}`),
  create: (data) =>
    request('/productos', { method: 'POST', headers: authHeaders(), body: JSON.stringify(data) }),
  update: (id, data) =>
    request(`/productos/${id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(data) }),
  delete: (id) =>
    request(`/productos/${id}`, { method: 'DELETE', headers: authHeaders() })
};

// Pedidos
export const pedidoModel = {
  crear: (items, mesa) =>
    request('/pedidos', { method: 'POST', headers: authHeaders(), body: JSON.stringify({ items, mesa }) }),
  misPedidos: () =>
    request('/pedidos/mis-pedidos', { headers: authHeaders() }),
  todos: () =>
    request('/pedidos', { headers: authHeaders() }),
  actualizarEstado: (id, estado) =>
    request(`/pedidos/${id}/estado`, { method: 'PATCH', headers: authHeaders(), body: JSON.stringify({ estado }) })
};
