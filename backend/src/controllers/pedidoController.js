const prisma = require('../models/prisma');

async function crear(req, res, next) {
  try {
    const { items, mesa } = req.body;
    if (!items || !items.length) {
      return res.status(400).json({ error: 'El carrito está vacío' });
    }

    const total = items.reduce((sum, i) => sum + i.precio * i.cantidad, 0);

    const pedido = await prisma.pedido.create({
      data: {
        userId: req.user.id,
        total,
        mesa: mesa || null,
        detalles: {
          create: items.map(i => ({
            productoId: i.id,
            cantidad: i.cantidad,
            precioUnitario: i.precio
          }))
        }
      },
      include: { detalles: { include: { producto: true } } }
    });

    res.status(201).json(pedido);
  } catch (err) {
    next(err);
  }
}

async function misPedidos(req, res, next) {
  try {
    const pedidos = await prisma.pedido.findMany({
      where: { userId: req.user.id },
      include: { detalles: { include: { producto: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(pedidos);
  } catch (err) {
    next(err);
  }
}

async function todos(req, res, next) {
  try {
    const pedidos = await prisma.pedido.findMany({
      include: {
        usuario: { select: { id: true, username: true, email: true } },
        detalles: { include: { producto: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(pedidos);
  } catch (err) {
    next(err);
  }
}

async function actualizarEstado(req, res, next) {
  try {
    const { estado } = req.body;
    const pedido = await prisma.pedido.update({
      where: { id: parseInt(req.params.id) },
      data: { estado }
    });
    res.json(pedido);
  } catch (err) {
    next(err);
  }
}

module.exports = { crear, misPedidos, todos, actualizarEstado };
