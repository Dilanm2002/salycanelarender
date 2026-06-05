const KEY = 'sc_carrito';

export const carritoModel = {
  leer: () => {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch { return []; }
  },
  guardar: (items) => localStorage.setItem(KEY, JSON.stringify(items)),
  agregar: (producto) => {
    const items = carritoModel.leer();
    const existe = items.find(i => i.id === producto.id);
    if (existe) {
      existe.cantidad += 1;
    } else {
      items.push({ ...producto, cantidad: 1 });
    }
    carritoModel.guardar(items);
    return items;
  },
  quitar: (id) => {
    const items = carritoModel.leer().filter(i => i.id !== id);
    carritoModel.guardar(items);
    return items;
  },
  cambiarCantidad: (id, cantidad) => {
    const items = carritoModel.leer().map(i =>
      i.id === id ? { ...i, cantidad } : i
    ).filter(i => i.cantidad > 0);
    carritoModel.guardar(items);
    return items;
  },
  vaciar: () => {
    localStorage.removeItem(KEY);
    return [];
  },
  calcularTotal: (items) => items.reduce((s, i) => s + i.precio * i.cantidad, 0)
};
