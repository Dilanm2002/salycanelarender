const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../models/prisma');
const { validationResult } = require('express-validator');

async function register(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, username, password } = req.body;

    const existe = await prisma.usuario.findFirst({
      where: { OR: [{ email }, { username }] }
    });
    if (existe) {
      return res.status(409).json({ error: 'Email o usuario ya registrado' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const usuario = await prisma.usuario.create({
      data: { email, username, passwordHash }
    });

    const token = jwt.sign(
      { id: usuario.id, username: usuario.username, role: usuario.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      token,
      usuario: { id: usuario.id, email: usuario.email, username: usuario.username, role: usuario.role }
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const valida = await bcrypt.compare(password, usuario.passwordHash);
    if (!valida) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: usuario.id, username: usuario.username, role: usuario.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      token,
      usuario: { id: usuario.id, email: usuario.email, username: usuario.username, role: usuario.role }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login };
