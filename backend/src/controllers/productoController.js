const prisma = require('../models/prisma');
const { validationResult } = require('express-validator');

async function getAll(req, res, next) {
  try {
    const productos = await prisma.producto.findMany({
      where: { activo: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(productos);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const producto = await prisma.producto.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(producto);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { nombre, descripcion, precio, stock, imagen, categoria } = req.body;
    const producto = await prisma.producto.create({
      data: { nombre, descripcion, precio: parseFloat(precio), stock: parseInt(stock) || 0, imagen, categoria }
    });
    res.status(201).json(producto);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { nombre, descripcion, precio, stock, imagen, categoria, activo } = req.body;
    const producto = await prisma.producto.update({
      where: { id: parseInt(req.params.id) },
      data: {
        ...(nombre !== undefined && { nombre }),
        ...(descripcion !== undefined && { descripcion }),
        ...(precio !== undefined && { precio: parseFloat(precio) }),
        ...(stock !== undefined && { stock: parseInt(stock) }),
        ...(imagen !== undefined && { imagen }),
        ...(categoria !== undefined && { categoria }),
        ...(activo !== undefined && { activo })
      }
    });
    res.json(producto);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await prisma.producto.update({
      where: { id: parseInt(req.params.id) },
      data: { activo: false }
    });
    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getById, create, update, remove };
