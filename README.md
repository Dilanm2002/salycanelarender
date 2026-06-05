# Reto 2 — Sal y Canela | Plataforma Web Full Stack

Aplicación web MVC para el restaurante Sal y Canela. Desarrollada con React (frontend) y Node.js/Express (backend), base de datos PostgreSQL en Neon, ORM Prisma, y autenticación JWT.

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite + React Router |
| Backend | Node.js + Express 5 |
| Base de datos | PostgreSQL (Neon) |
| ORM | Prisma 6 |
| Auth | JWT + bcryptjs |
| Arquitectura | MVC |

## Estructura del proyecto

```
Reto2_Mena_Dilan/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # Modelos: Usuario, Producto, Pedido, PedidoDetalle
│   │   └── seed.js            # Datos iniciales (admin + productos)
│   ├── src/
│   │   ├── controllers/       # Lógica de negocio
│   │   ├── middleware/        # Auth JWT, manejo de errores
│   │   ├── models/            # Acceso a DB con Prisma
│   │   ├── routes/            # Definición de rutas
│   │   └── index.js           # Entry point del servidor
│   ├── .env.example           # Plantilla de variables de entorno
│   └── package.json
└── frontend/
    ├── src/
    │   ├── models/            # api.js (fetch), carritoModel (localStorage)
    │   ├── controllers/       # authController, carritoController
    │   ├── views/
    │   │   ├── pages/         # Catalogo, Login, Register, MisPedidos, Admin
    │   │   └── components/    # Header, Carrito
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

## Instalación y uso local

### Requisitos
- Node.js 18+
- Cuenta en [Neon](https://neon.tech) (PostgreSQL serverless)

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Editar .env con tu DATABASE_URL de Neon y un JWT_SECRET
npx prisma generate
npm run seed    # Carga datos iniciales
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Abre `http://localhost:5173`

## Credenciales de prueba (seed)

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Admin | admin@salycanela.com | admin123 |
| Usuario | user@salycanela.com | user123 |

## API Endpoints

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/auth/register` | No | Registro de usuario |
| POST | `/api/auth/login` | No | Login → devuelve JWT |
| GET | `/api/productos` | No | Listar productos activos |
| POST | `/api/productos` | Admin | Crear producto |
| PUT | `/api/productos/:id` | Admin | Editar producto |
| DELETE | `/api/productos/:id` | Admin | Eliminar producto |
| POST | `/api/pedidos` | User | Crear pedido |
| GET | `/api/pedidos/mis-pedidos` | User | Ver mis pedidos |
| GET | `/api/pedidos` | Admin | Ver todos los pedidos |
| PUT | `/api/pedidos/:id/estado` | Admin | Cambiar estado del pedido |

## Seguridad — OWASP Top 10

### Riesgo 1 — A07: Fallas de Identificación y Autenticación
**Amenaza:** Un atacante podría acceder con contraseñas débiles o credenciales robadas.  
**Mitigación:**
- Contraseñas hasheadas con `bcryptjs` (salt 10) — nunca se guarda texto plano.
- JWT firmado con `JWT_SECRET` de entorno, con expiración configurada (`JWT_EXPIRES_IN`).
- El login devuelve el mismo mensaje para email incorrecto y contraseña incorrecta ("Credenciales inválidas"), evitando enumerar usuarios.

### Riesgo 2 — A01: Control de Acceso Roto
**Amenaza:** Un usuario normal podría crear, editar o eliminar productos, o ver pedidos de otros.  
**Mitigación:**
- Middleware `verifyToken` en todas las rutas protegidas — sin JWT válido devuelve 401.
- Middleware `requireAdmin` en rutas de escritura de productos y vista global de pedidos — sin rol ADMIN devuelve 403.
- Cada usuario solo puede ver sus propios pedidos (`/mis-pedidos` filtra por `userId` del token).

### Riesgo 3 — A03: Inyección
**Amenaza:** Un atacante podría enviar inputs maliciosos en nombre, precio, email, etc.  
**Mitigación:**
- `express-validator` valida y sanitiza todos los campos del body en register, login, crear/editar producto y crear pedido.
- Prisma ORM usa queries parametrizadas internamente — no se construyen queries SQL con concatenación de strings.
- El middleware `errorHandler` centralizado captura errores y devuelve respuestas genéricas sin exponer stacktrace ni detalles internos.

## Autor

Dilan Mena — Desarrollo de Plataformas 2025
