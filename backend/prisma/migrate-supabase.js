// Script de migración: extrae menu_items de Supabase y genera SQL para Neon
// Uso: node prisma/migrate-supabase.js

const SUPABASE_URL = 'https://aagcxtggeqkzfngzfqne.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhZ2N4dGdnZXFremZuZ3pmcW5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzNzIyMDYsImV4cCI6MjA5Mzk0ODIwNn0.Byyo-cRfRvZ4ww7dBNF1dPK51rYAFjjpw-JnEzg7-G8';

async function main() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/menu_items?select=*&plat_activo=eq.true&order=plat_categoria.asc`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    }
  });

  if (!res.ok) {
    console.error('Error al consultar Supabase:', res.status, await res.text());
    process.exit(1);
  }

  const items = await res.json();
  console.error(`Obtenidos ${items.length} productos de Supabase\n`);

  const escape = (s) => s ? s.replace(/'/g, "''") : '';

  const values = items.map(p => {
    const nombre      = escape(p.plat_nombre || '');
    const descripcion = escape(p.plat_descripcion || '');
    const precio      = parseFloat(p.plat_precio) || 0;
    const imagen      = escape(p.plat_imagen || '');
    const categoria   = escape(p.plat_categoria || 'General');
    const activo      = p.plat_activo ? 'true' : 'false';
    return `  ('${nombre}', '${descripcion}', ${precio}, 20, '${imagen}', '${categoria}', ${activo}, NOW())`;
  });

  const sql = `-- Productos migrados desde Supabase → pegar en Neon SQL Editor
-- ${new Date().toISOString()}
-- Total: ${items.length} productos

TRUNCATE "Producto" RESTART IDENTITY CASCADE;

INSERT INTO "Producto" (nombre, descripcion, precio, stock, imagen, categoria, activo, "createdAt") VALUES
${values.join(',\n')};

SELECT COUNT(*) as total FROM "Producto";`;

  console.log(sql);
}

main().catch(e => { console.error(e); process.exit(1); });
