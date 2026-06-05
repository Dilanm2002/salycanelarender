-- =====================================================
-- MIGRACIÓN COMPLETA: Supabase → Neon
-- Generado: 2026-06-05T02:06:01.244Z
-- Usuarios: 10 | Pedidos: 59 | Productos: 30
-- =====================================================

TRUNCATE "PedidoDetalle" RESTART IDENTITY CASCADE;
TRUNCATE "Pedido" RESTART IDENTITY CASCADE;
TRUNCATE "Producto" RESTART IDENTITY CASCADE;
TRUNCATE "Usuario" RESTART IDENTITY CASCADE;

-- Usuarios (IDs reasignados secuencialmente, contraseñas hasheadas)
INSERT INTO "Usuario" (email, username, "passwordHash", role, "createdAt") VALUES
  ('caja@salycanela.ec', 'caja', '$2b$10$aupyxEwGiz1PgqUwn6ZR8OsTJMn2NExlwC0ZTUPXOUyvLdnovlmRC', 'USER', '2026-05-10T01:26:48.875197+00:00'),
  ('mesero@salycanela.ec', 'mesero', '$2b$10$6huvjyTvXn7mxRgXsISOleK7sUbP.kFMjoEch/OnsIQrNBYYn1o7O', 'USER', '2026-05-10T01:26:49.121549+00:00'),
  ('admin@salycanela.ec', 'admin', '$2b$10$uHaMJgfQPwUNKntHrtlKG.YcVSTYwBssDgZC.4jf5G3t.vBFTzMvC', 'ADMIN', '2026-05-10T05:19:22.137112+00:00'),
  ('menadilan2002@gmail.com', 'dnmna', '$2b$10$T3y7vRJp2rc4FLL14tQNJereB8Z8nB3xpJJdh.koRNXvRqPTK2PMO', 'USER', '2026-05-10T06:20:52.353245+00:00'),
  ('dnmena@puce.edu.ec', 'dnmena', '$2b$10$0r/D6zucQWHE6JR9bVYmWOo1eJ9WBd5bLEzySHEPIz/FBNNDXUWCa', 'USER', '2026-05-10T06:46:22.414388+00:00'),
  ('nickbart8@gmail.com', 'dilan123', '$2b$10$UskL7RGms5C.xqwfs/xQu.FBBAnXob9IKnwrWeHNUgcl1BhNeU9eG', 'USER', '2026-05-10T06:51:32.362087+00:00'),
  ('luiselomi@outlookkk.com', 'vrouqen', '$2b$10$u3eofuzFOA8UrJyZx36XWesodg.VFPEIWIvzXqUcajRSxXRrhLHPC', 'USER', '2026-05-13T02:05:08.960554+00:00'),
  ('ddj19875189@gmail.com', 'dianavera', '$2b$10$9LbejvDIbajs3uGkn6zXaObp/93lfwR4LkbQVVUo3GWOZhDoxEQSi', 'USER', '2026-05-15T01:21:57.520141+00:00'),
  ('menadilan22002@gmail.com', 'doki123', '$2b$10$yz9X1dQ0pqrKXiWvfwn5r.F4YB3dpka3ERE/gZpoXSTCBCoxCCDEq', 'USER', '2026-05-24T01:00:26.823587+00:00'),
  ('ddj198751869@gmail.com', 'disna5', '$2b$10$VFPkZZZ.hsNYy46VmMh.buWvkRXabNCAXl9ZuAjmusCOR1UqF8xRi', 'USER', '2026-05-24T01:24:05.973517+00:00');

-- Productos (IDs originales de Supabase, todos son enteros pequeños)
INSERT INTO "Producto" (id, nombre, descripcion, precio, stock, imagen, categoria, activo, "createdAt") VALUES
  (12, 'Almuerzo Ejecutivo #2', 'Sopa del día · Seco de carne con arroz · Ensalada fresca · Jugo natural.', 3.75, 0, 'imagenes comida/AlmuerzoEjecutivo3.jpg', 'Almuerzos', true, '2020-01-01T00:00:00+00:00'),
  (4, 'Desayuno de Humitasaaa', 'Dos humitas artesanales de maíz con queso + café o aromática.aaaaa', 2.17, 20, 'imagenes comida/DesayunoDeHumitas.jpg', 'Desayunos', true, '2020-01-01T00:00:00+00:00'),
  (3, 'Desayuno Completo', 'Huevos al gusto + bolón de verde + maduro frito + jugo + café o aromática.', 4, 20, 'imagenes comida/DesayunoCompleto.jpg', 'Desayunos', true, '2020-01-01T00:00:00+00:00'),
  (5, 'Yogur con Granola', 'Yogur natural con granola crujiente, miel de abeja y frutas frescas de temporada.', 2.25, 19, 'imagenes comida/YogurConGranola.jpg', 'Desayunos', true, '2020-01-01T00:00:00+00:00'),
  (6, 'Sánduche de Pollo', 'Pan artesanal con pechuga de pollo a la plancha, lechuga, tomate, aguacate y mayonesa casera.', 2.5, 19, 'imagenes comida/SanducheDePollo.jpg', 'Entradas', true, '2020-01-01T00:00:00+00:00'),
  (7, 'Bolón de Verde', 'Bolón de plátano verde relleno de chicharrón y queso, frito hasta dorar.', 1.75, 6, 'imagenes comida/BolonDeVerde.jpg', 'Entradas', true, '2020-01-01T00:00:00+00:00'),
  (8, 'Empanada de Viento', 'Empanada frita rellena de queso fresco, espolvoreada con azúcar. Receta de siempre.', 0.75, 19, 'imagenes comida/EmpanadaDeViento.jpg', 'Entradas', true, '2020-01-01T00:00:00+00:00'),
  (9, 'Ensalada de la Casa', 'Mix de lechugas, tomate cherry, aguacate, zanahoria y pepino con aderezo de limón casero.', 2, 19, 'imagenes comida/EnsaladaDeLaCasa.jpg', 'Entradas', true, '2020-01-01T00:00:00+00:00'),
  (1, 'Desayuno Continental', 'Jugo natural + café o aromática + pan tostado con mantequilla y mermelada.', 2.5, 19, 'imagenes comida/DesayunoContinental.jpg', 'Desayunos', true, '2020-01-01T00:00:00+00:00'),
  (10, 'Humitas', 'Tamal de maíz tierno con queso, cocinado en hoja de maíz al vapor.', 1.5, 19, 'imagenes comida/Humitas.jpg', 'Entradas', true, '2020-01-01T00:00:00+00:00'),
  (11, 'Almuerzo Ejecutivo #1', 'Sopa del día · Arroz con pollo guisado · Ensalada fresca · Jugo natural.', 3.25, 19, 'imagenes comida/AlmuerzoEjecutivo.jpg', 'Almuerzos', true, '2020-01-01T00:00:00+00:00'),
  (13, 'Almuerzo Ejecutivo #3', 'Sopa del día · Arroz con menestra · Maduro frito · Ensalada · Jugo natural.', 3.25, 19, 'imagenes comida/Almuerzoejecutivo2.jpg', 'Almuerzos', true, '2020-01-01T00:00:00+00:00'),
  (14, 'Tiramisú', 'Bizcochos empapados en espresso con crema de mascarpone y cacao en polvo.', 2.5, 19, 'imagenes comida/Tiramisú.jpg', 'Postres', true, '2020-01-01T00:00:00+00:00'),
  (15, 'Brownie de Chocolate', 'Brownie húmedo de chocolate oscuro, denso y tibio. Con azúcar en polvo.', 1.75, 19, 'imagenes comida/BrownieDeChocolate.jpg', 'Postres', true, '2020-01-01T00:00:00+00:00'),
  (16, 'Pie de Manzana', 'Pedazo de pie artesanal con manzana canelada y masa crocante dorada.', 2, 19, 'imagenes comida/PieDeManzana.jpg', 'Postres', true, '2020-01-01T00:00:00+00:00'),
  (17, 'Cheesecake de Maracuyá', 'Cheesecake cremoso con coulis de maracuyá y base de galleta de vainilla.', 2.5, 19, 'imagenes comida/CheesecakeDeMaracuya.jpg', 'Postres', true, '2020-01-01T00:00:00+00:00'),
  (18, 'Flan de Canela', 'Flan casero con canela y vainilla, bañado en caramelo dorado. Receta de la abuela.', 1.75, 19, 'imagenes comida/FlanDeCanela.jpg', 'Postres', true, '2020-01-01T00:00:00+00:00'),
  (19, 'Melbas', 'Porción de 6 melbas artesanales, crujientes y doradas. Perfectas con café.', 2.5, 19, 'imagenes comida/melba.jpg', 'Bocaditos', true, '2020-01-01T00:00:00+00:00'),
  (20, 'Oreja de Hojaldre', 'Hojaldre caramelizado en forma de oreja, crocante y dulce. Precio por unidad.', 0.6, 0, 'imagenes comida/OrejaDeHojaldre.jpg', 'Bocaditos', true, '2020-01-01T00:00:00+00:00'),
  (21, 'Mil Hojas', 'Pastel mil hojas con crema pastelera suave y capas de hojaldre crocante.', 2, 19, 'imagenes comida/PastelMilHojas.jpg', 'Bocaditos', true, '2020-01-01T00:00:00+00:00'),
  (22, 'Volcán de Chocolate', 'Bizcocho individual con interior de chocolate fundido. Servido tibio.', 2.25, 19, 'imagenes comida/VolcanDeChocolate.jpg', 'Bocaditos', true, '2020-01-01T00:00:00+00:00'),
  (101, 'Ponche Suizo', 'Tradicional bebida ambateña preparada a base de leche y especias, con una textura cremosa, espumosa y refrescante. Se sirve bien fría y destaca por su suave sabor dulce y aroma a canela y vainilla.', 2.5, 19, '', 'Postres', true, '2026-05-19T16:01:31.701+00:00'),
  (23, 'Café Americano', 'Café negro filtrado, suave y aromático. El clásico de cada mañana.', 1, 0, 'imagenes comida/cafeAmericano.jpg', 'Bebidas Calientes', true, '2020-01-01T00:00:00+00:00'),
  (24, 'Cappuccino', 'Espresso con leche vaporizada y espuma cremosa. Equilibrado y suave.', 1.5, 19, 'imagenes comida/Capuccino.jpg', 'Bebidas Calientes', true, '2020-01-01T00:00:00+00:00'),
  (25, 'Chocolate Caliente', 'Chocolate de taza espeso y cremoso con toque de canela. Receta artesanal.', 1.5, 19, 'imagenes comida/ChocolateCaliente.jpg', 'Bebidas Calientes', true, '2020-01-01T00:00:00+00:00'),
  (26, 'Aromática / Té', 'Infusión de manzanilla, menta, hierba luisa o canela. Relajante y natural.', 0.75, 19, 'imagenes comida/Aromatica.jpg', 'Bebidas Calientes', true, '2020-01-01T00:00:00+00:00'),
  (27, 'Jugo de Mora', 'Jugo natural de mora ecuatoriana, sin conservantes. Refrescante y nutritivo.', 1.25, 18, 'imagenes comida/JugoDeMora.jpg', 'Bebidas Frías', true, '2020-01-01T00:00:00+00:00'),
  (28, 'Jugo de Naranjilla', 'Jugo de naranjilla fresca, frutal y ácido. Sabor 100% ecuatoriano.', 1.25, 18, 'imagenes comida/JugoDeNaranjilla.jpg', 'Bebidas Frías', true, '2020-01-01T00:00:00+00:00'),
  (29, 'Batido de Frutas', 'Batido cremoso de frutas de temporada con leche y vainilla.', 1.75, 19, 'imagenes comida/BatidoDeFrutas.jpg', 'Bebidas Frías', true, '2020-01-01T00:00:00+00:00'),
  (30, 'Limonada con Hielo', 'Limonada natural con hielo y menta fresca. Ideal para el calor.', 1.25, 19, 'imagenes comida/LimonadaConHielo.jpg', 'Bebidas Frías', true, '2020-01-01T00:00:00+00:00');
SELECT setval('"Producto_id_seq"', (SELECT MAX(id) FROM "Producto"));

-- Pedidos (IDs reasignados secuencialmente)
INSERT INTO "Pedido" (id, "userId", total, estado, mesa, "createdAt") VALUES
  (1, 5, 5.25, 'PENDIENTE', 6, '2026-05-27T15:04:18.173602+00:00'),
  (2, 4, 0, 'COBRADO', 4, '2026-05-10T06:22:00.21702+00:00'),
  (3, 5, 0, 'COBRADO', 6, '2026-05-11T13:56:43.752033+00:00'),
  (4, 2, 0, 'COBRADO', 5, '2026-05-12T03:06:31.555083+00:00'),
  (5, 2, 0, 'COBRADO', 12, '2026-05-12T03:09:49.322827+00:00'),
  (6, 2, 0, 'COBRADO', 12, '2026-05-12T03:04:59.78477+00:00'),
  (7, 5, 0, 'COBRADO', 7, '2026-05-12T13:17:02.498385+00:00'),
  (8, 5, 0, 'COBRADO', 7, '2026-05-12T13:08:13.15344+00:00'),
  (9, 5, 3, 'COBRADO', 5, '2026-05-13T01:00:00.882951+00:00'),
  (10, 7, 37.5, 'COBRADO', 3, '2026-05-13T02:07:11.704186+00:00'),
  (11, 5, 120.6, 'COBRADO', 9, '2026-05-13T02:18:13.146795+00:00'),
  (12, 2, 140.26999999999998, 'COBRADO', 9, '2026-05-19T16:03:16.848504+00:00'),
  (13, 2, 18.42, 'COBRADO', 1, '2026-05-19T16:28:15.787731+00:00'),
  (14, 5, 5, 'COBRADO', 6, '2026-05-19T14:36:13.728477+00:00'),
  (15, 5, 120.6, 'COBRADO', 8, '2026-05-24T15:24:22.123488+00:00');
SELECT setval('"Pedido_id_seq"', 15);

-- Detalles de pedido
INSERT INTO "PedidoDetalle" (id, "pedidoId", "productoId", cantidad, "precioUnitario") VALUES
  (1, 1, 7, 3, 1.75),
  (2, 9, 24, 2, 1.5),
  (3, 10, 19, 15, 2.5),
  (4, 11, 23, 63, 1),
  (5, 11, 20, 96, 0.6),
  (6, 12, 101, 6, 2.5),
  (7, 12, 5, 1, 2.25),
  (8, 12, 1, 1, 2.5),
  (9, 12, 3, 1, 4),
  (10, 12, 4, 1, 2.17),
  (11, 12, 13, 1, 3.25),
  (12, 12, 11, 1, 3.25),
  (13, 12, 12, 19, 3.75),
  (14, 12, 6, 1, 2.5),
  (15, 12, 7, 1, 1.75),
  (16, 12, 8, 1, 0.75),
  (17, 12, 9, 1, 2),
  (18, 12, 10, 1, 1.5),
  (19, 12, 14, 1, 2.5),
  (20, 12, 15, 1, 1.75),
  (21, 12, 16, 1, 2),
  (22, 12, 17, 1, 2.5),
  (23, 12, 18, 1, 1.75),
  (24, 12, 19, 1, 2.5),
  (25, 12, 20, 1, 0.6),
  (26, 12, 21, 1, 2),
  (27, 12, 22, 1, 2.25),
  (28, 12, 23, 1, 1),
  (29, 12, 24, 1, 1.5),
  (30, 12, 25, 1, 1.5),
  (31, 12, 26, 1, 0.75),
  (32, 12, 27, 1, 1.25),
  (33, 12, 28, 1, 1.25),
  (34, 12, 29, 1, 1.75),
  (35, 12, 30, 1, 1.25),
  (36, 13, 12, 1, 3.75),
  (37, 13, 1, 2, 2.5),
  (38, 13, 4, 1, 2.17),
  (39, 13, 13, 1, 3.25),
  (40, 13, 6, 1, 2.5),
  (41, 13, 7, 1, 1.75),
  (42, 14, 12, 1, 3.75),
  (43, 14, 28, 1, 1.25),
  (44, 15, 23, 63, 1),
  (45, 15, 20, 96, 0.6);
SELECT setval('"PedidoDetalle_id_seq"', 46);

-- Verificación final
SELECT 'Usuarios' as tabla, COUNT(*) as total FROM "Usuario"
UNION ALL SELECT 'Productos', COUNT(*) FROM "Producto"
UNION ALL SELECT 'Pedidos', COUNT(*) FROM "Pedido"
UNION ALL SELECT 'Detalles', COUNT(*) FROM "PedidoDetalle";
