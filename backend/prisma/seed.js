const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  // Admin por defecto
  const adminHash = await bcrypt.hash('admin123', 10);
  await prisma.usuario.upsert({
    where: { email: 'admin@salycanela.com' },
    update: {},
    create: {
      email: 'admin@salycanela.com',
      username: 'admin',
      passwordHash: adminHash,
      role: 'ADMIN'
    }
  });

  // Usuario de prueba
  const userHash = await bcrypt.hash('user123', 10);
  await prisma.usuario.upsert({
    where: { email: 'user@salycanela.com' },
    update: {},
    create: {
      email: 'user@salycanela.com',
      username: 'cliente',
      passwordHash: userHash,
      role: 'USER'
    }
  });

  // Productos basados en los del menú original de Sal y Canela
  const productos = [
    { nombre: 'Desayuno Completo', descripcion: 'Huevos, jugo, pan y café', precio: 4.50, stock: 20, categoria: 'Desayunos' },
    { nombre: 'Caldo de Pollo', descripcion: 'Caldo tradicional con papas y arroz', precio: 3.50, stock: 15, categoria: 'Almuerzos' },
    { nombre: 'Seco de Pollo', descripcion: 'Guiso de pollo con arroz y ensalada', precio: 5.00, stock: 20, categoria: 'Almuerzos' },
    { nombre: 'Ensalada de la Casa', descripcion: 'Lechuga, tomate, pepino y aliño', precio: 2.50, stock: 25, categoria: 'Entradas' },
    { nombre: 'Flan de Caramelo', descripcion: 'Postre casero de vainilla', precio: 2.00, stock: 15, categoria: 'Postres' },
    { nombre: 'Café Americano', descripcion: 'Café negro recién preparado', precio: 1.50, stock: 50, categoria: 'Bebidas Calientes' },
    { nombre: 'Jugo Natural', descripcion: 'Jugo de fruta del día', precio: 1.75, stock: 30, categoria: 'Bebidas Frías' },
    { nombre: 'Empanadas x3', descripcion: 'Empanadas de viento rellenas de queso', precio: 2.25, stock: 20, categoria: 'Bocaditos' },
  ];

  for (const p of productos) {
    await prisma.producto.upsert({
      where: { id: productos.indexOf(p) + 1 },
      update: {},
      create: p
    });
  }

  console.log('Seed completado — admin@salycanela.com / admin123');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
