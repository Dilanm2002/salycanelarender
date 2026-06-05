// Solo lectura — no modifica nada en Supabase
const URL = 'https://aagcxtggeqkzfngzfqne.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhZ2N4dGdnZXFremZuZ3pmcW5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzNzIyMDYsImV4cCI6MjA5Mzk0ODIwNn0.Byyo-cRfRvZ4ww7dBNF1dPK51rYAFjjpw-JnEzg7-G8';
const h = { 'apikey': KEY, 'Authorization': 'Bearer ' + KEY };

async function get(t) {
  const r = await fetch(`${URL}/rest/v1/${t}?select=*`, { headers: h });
  const data = await r.json();
  return data;
}

async function main() {
  const [usuarios, roles, pedidos, menu_items, productos] = await Promise.all([
    get('usuarios'), get('roles'), get('pedidos'), get('menu_items'), get('productos')
  ]);

  console.log('=== USUARIOS (' + usuarios.length + ') ===');
  if (usuarios[0]) console.log('Estructura:', JSON.stringify(usuarios[0], null, 2));

  console.log('\n=== ROLES (' + roles.length + ') ===');
  console.log(JSON.stringify(roles, null, 2));

  console.log('\n=== PEDIDOS (' + pedidos.length + ') ===');
  if (pedidos[0]) console.log('Primero:', JSON.stringify(pedidos[0], null, 2));

  console.log('\n=== PRODUCTOS (' + productos.length + ') ===');
  if (productos[0]) console.log('Primero:', JSON.stringify(productos[0], null, 2));

  console.log('\n=== MENU_ITEMS (' + menu_items.length + ') ===');
}

main().catch(console.error);
