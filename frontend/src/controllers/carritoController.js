import { carritoModel } from '../models/carritoModel.js';
import { pedidoModel } from '../models/api.js';

export const carritoController = {
  agregar: (producto, setCarrito) => {
    const items = carritoModel.agregar(producto);
    setCarrito([...items]);
  },
  quitar: (id, setCarrito) => {
    const items = carritoModel.quitar(id);
    setCarrito([...items]);
  },
  cambiarCantidad: (id, cantidad, setCarrito) => {
    const items = carritoModel.cambiarCantidad(id, cantidad);
    setCarrito([...items]);
  },
  vaciar: (setCarrito) => {
    carritoModel.vaciar();
    setCarrito([]);
  },
  confirmarPedido: async (items, mesa, setCarrito) => {
    await pedidoModel.crear(items, mesa);
    carritoModel.vaciar();
    setCarrito([]);
  }
};
