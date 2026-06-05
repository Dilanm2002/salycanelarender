import { authModel } from '../models/api.js';

export const authController = {
  login: async (email, password) => {
    const data = await authModel.login(email, password);
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));
    return data.usuario;
  },
  register: async (email, username, password) => {
    const data = await authModel.register(email, username, password);
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));
    return data.usuario;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  },
  getUsuario: () => {
    try { return JSON.parse(localStorage.getItem('usuario')); }
    catch { return null; }
  },
  isLoggedIn: () => !!localStorage.getItem('token'),
  isAdmin: () => {
    const u = authController.getUsuario();
    return u?.role === 'ADMIN';
  }
};
