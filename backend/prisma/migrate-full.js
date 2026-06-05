// Migración completa Supabase → Neon (solo lectura en Supabase)
// Reasigna IDs secuenciales para evitar overflow de INT4
const bcrypt = require('bcryptjs');

const SB_URL = 'https://aagcxtggeqkzfngzfqne.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhZ2N4dGdnZXFremZuZ3pmcW5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzNzIyMDYsImV4cCI6MjA5Mzk0ODIwNn0.Byyo-cRfRvZ4ww7dBNF1dPK51rYAFjjpw-JnEzg7-G8';
const h = { 'apikey': SB_KEY, 'Authorization': 'Bearer ' + SB_KEY };

const e = s => (s == null ? '' : String(s)).replace(/'/g, "''");
const q = s => s == null ? 'NULL' : `'${e(s)}'`;

async function get(t) {
  const r = await fetch(`${SB_URL}/rest/v1/${t}?select=*`, { headers: h });
  return r.json();
}

async function main() {
  const [usuarios, pedidos, menu_items, productos] = await Promise.all([
    get('usuarios'), get('pedidos'), get('menu_items'), get('productos')
  ]);

  const lines = [];
  lines.push('-- =====================================================');
  lines.push('-- MIGRACIÓN COMPLETA: Supabase → Neon');
  lines.push('-- Generado: ' + new Date().toISOString());
  lines.push('-- Usuarios: ' + usuarios.length + ' | Pedidos: ' + pedidos.length + ' | Productos: ' + menu_items.length);
  lines.push('-- =====================================================');
  lines.push('');
  lines.push('TRUNCATE "PedidoDetalle" RESTART IDENTITY CASCADE;');
  lines.push('TRUNCATE "Pedido" RESTART IDENTITY CASCADE;');
  lines.push('TRUNCATE "Producto" RESTART IDENTITY CASCADE;');
  lines.push('TRUNCATE "Usuario" RESTART IDENTITY CASCADE;');
  lines.push('');

  // ── USUARIOS: reasignar IDs 1..N ──
  const userOldToNew = {};  // oldId → newId
  const userRows = [];
  lines.push('-- Usuarios (IDs reasignados secuencialmente, contraseñas hasheadas)');
  lines.push('INSERT INTO "Usuario" (email, username, "passwordHash", role, "createdAt") VALUES');

  const mapRole = (rolId) => rolId === 1 ? 'ADMIN' : 'USER';

  for (let i = 0; i < usuarios.length; i++) {
    const u = usuarios[i];
    const newId = i + 1;
    userOldToNew[u.usu_id] = newId;
    // también mapear por username para pedidos que usan username como foreign key
    userOldToNew['usr:' + u.usu_usuario] = newId;
    const data = u.usu_data || {};
    const pass = data.password || '1234';
    const hash = await bcrypt.hash(String(pass), 10);
    const role = mapRole(u.usu_rol_id);
    userRows.push(`  ('${e(u.usu_email)}', '${e(u.usu_usuario)}', '${hash}', '${role}', '${u.usu_created_at}')`);
  }
  lines.push(userRows.join(',\n') + ';');
  lines.push('');

  // ── PRODUCTOS: usar IDs originales de menu_items (todos < 200, seguros) ──
  const prodOldToNew = {};
  const stockMap = {};
  for (const p of productos) stockMap[p.prod_nombre] = p.prod_stock;

  const prodRows = [];
  lines.push('-- Productos (IDs originales de Supabase, todos son enteros pequeños)');
  lines.push('INSERT INTO "Producto" (id, nombre, descripcion, precio, stock, imagen, categoria, activo, "createdAt") VALUES');

  for (const p of menu_items) {
    prodOldToNew[p.plat_id] = p.plat_id;
    const img = (p.plat_imagen || '').startsWith('data:') ? '' : e(p.plat_imagen || '');
    const stock = stockMap[p.plat_nombre] != null ? stockMap[p.plat_nombre] : 20;
    prodRows.push(`  (${p.plat_id}, ${q(p.plat_nombre)}, ${q(p.plat_descripcion)}, ${parseFloat(p.plat_precio)||0}, ${stock}, ${q(img)}, ${q(p.plat_categoria)}, ${p.plat_activo ? 'true' : 'false'}, ${q(p.plat_created_at)})`);
  }
  lines.push(prodRows.join(',\n') + ';');
  lines.push(`SELECT setval('"Producto_id_seq"', (SELECT MAX(id) FROM "Producto"));`);
  lines.push('');

  // ── PEDIDOS: reasignar IDs 1..N ──
  const mapEstado = s => {
    const sl = (s || '').toLowerCase();
    if (sl === 'cobrado') return 'COBRADO';
    if (sl === 'cancelado') return 'CANCELADO';
    return 'PENDIENTE';
  };

  // Resolver userId: ped_id_usuario puede ser username (string) o id (number)
  const resolveUser = (val) => {
    if (userOldToNew['usr:' + val] != null) return userOldToNew['usr:' + val];
    if (userOldToNew[val] != null) return userOldToNew[val];
    return null;
  };

  const pedidosValidos = pedidos.filter(p => resolveUser(p.ped_id_usuario) != null);
  const pedOldToNew = {};

  if (pedidosValidos.length > 0) {
    lines.push('-- Pedidos (IDs reasignados secuencialmente)');
    lines.push('INSERT INTO "Pedido" (id, "userId", total, estado, mesa, "createdAt") VALUES');
    const pedRows = pedidosValidos.map((p, i) => {
      const newId = i + 1;
      pedOldToNew[p.ped_id] = newId;
      const userId = resolveUser(p.ped_id_usuario);
      const estado = mapEstado(p.ped_estado);
      const mesa = p.ped_mesa != null ? p.ped_mesa : 'NULL';
      return `  (${newId}, ${userId}, ${parseFloat(p.ped_total)||0}, '${estado}', ${mesa}, '${p.ped_created_at}')`;
    });
    lines.push(pedRows.join(',\n') + ';');
    lines.push(`SELECT setval('"Pedido_id_seq"', ${pedidosValidos.length});`);
    lines.push('');

    // ── PEDIDO DETALLES ──
    const detRows = [];
    let detId = 1;

    for (const p of pedidosValidos) {
      const newPedId = pedOldToNew[p.ped_id];
      const items = Array.isArray(p.ped_items) ? p.ped_items : [];
      for (const item of items) {
        const productoId = item.id;
        if (!productoId || !prodOldToNew[productoId]) continue;
        detRows.push(`  (${detId++}, ${newPedId}, ${prodOldToNew[productoId]}, ${parseInt(item.cantidad)||1}, ${parseFloat(item.precio)||0})`);
      }
    }

    if (detRows.length > 0) {
      lines.push('-- Detalles de pedido');
      lines.push('INSERT INTO "PedidoDetalle" (id, "pedidoId", "productoId", cantidad, "precioUnitario") VALUES');
      lines.push(detRows.join(',\n') + ';');
      lines.push(`SELECT setval('"PedidoDetalle_id_seq"', ${detId});`);
    }
  }

  lines.push('');
  lines.push('-- Verificación final');
  lines.push('SELECT \'Usuarios\' as tabla, COUNT(*) as total FROM "Usuario"');
  lines.push('UNION ALL SELECT \'Productos\', COUNT(*) FROM "Producto"');
  lines.push('UNION ALL SELECT \'Pedidos\', COUNT(*) FROM "Pedido"');
  lines.push('UNION ALL SELECT \'Detalles\', COUNT(*) FROM "PedidoDetalle";');

  console.log(lines.join('\n'));
}

main().catch(console.error);
