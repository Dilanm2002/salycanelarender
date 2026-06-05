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

## Autor

Dilan Mena — Desarrollo de Plataformas 2025
