-- Consultas de demostracion de MyKitchen.
-- Solo leen: no modifican nada. Ejecutar de a una poniendo el cursor
-- adentro de la consulta y apretando Ctrl + Shift + Enter.

USE mykitchen;


-- 1) LOS USUARIOS REGISTRADOS
-- Muestra la tabla de usuarios, pero No trae la contrasena.
SELECT id, nombre, email, activo, fecha_registro, ultimo_acceso
FROM usuarios;


-- 2) CADA RECETA CON SU AUTOR  --  relacion UNO A MUCHOS
-- La receta esta en una tabla y el autor en otra. El JOIN las une
-- por autor_id. Un usuario escribe muchas recetas, cada receta
-- tiene un solo autor.
SELECT r.nombre AS receta, r.categoria, u.nombre AS autor
FROM recetas r
JOIN usuarios u ON r.autor_id = u.id
ORDER BY r.categoria;


-- 3) UNA RECETA COMPLETA DESDE TRES TABLAS
-- Cruza recetas, usuarios, ingredientes y pasos de una sola vez,
-- y cuenta cuantos tiene cada una. Esta es la que mejor muestra
-- por que los ingredientes y los pasos van en tablas separadas.
SELECT r.nombre AS receta,
       u.nombre AS autor,
       r.categoria,
       r.origen,
       COUNT(DISTINCT i.id) AS ingredientes,
       COUNT(DISTINCT p.id) AS pasos
FROM recetas r
JOIN usuarios u ON r.autor_id = u.id
LEFT JOIN ingredientes i ON i.receta_id = r.id
LEFT JOIN pasos p ON p.receta_id = r.id
GROUP BY r.id, r.nombre, u.nombre, r.categoria, r.origen;


-- 4) LOS INGREDIENTES DE UNA RECETA, EN ORDEN
-- La columna "orden" es la que garantiza que salgan en la secuencia
-- correcta: las filas de una tabla no tienen orden propio.
SELECT r.nombre AS receta, i.orden, i.texto AS ingrediente
FROM recetas r
JOIN ingredientes i ON i.receta_id = r.id
WHERE r.id = 1
ORDER BY i.orden;


-- 5) LOS PASOS DE ESA MISMA RECETA
SELECT r.nombre AS receta, p.orden, p.texto AS paso
FROM recetas r
JOIN pasos p ON p.receta_id = r.id
WHERE r.id = 1
ORDER BY p.orden;


-- 6) QUIEN GUARDO QUE  --  relacion MUCHOS A MUCHOS
-- Un usuario guarda muchas recetas y una receta la guardan muchos
-- usuarios. Eso no se puede resolver con una columna, hace falta una
-- tabla en el medio: favoritos. Por eso hay dos JOIN.
-- La columna "origen" muestra de donde salio cada receta: las que
-- dicen "local" o "api" se copiaron solas a la base al marcarlas.
SELECT u.nombre AS usuario, r.nombre AS receta_guardada, r.origen, f.fecha
FROM favoritos f
JOIN usuarios u ON f.usuario_id = u.id
JOIN recetas r ON f.receta_id = r.id
ORDER BY f.fecha DESC;


-- 7) CUANTAS VECES SE GUARDO CADA RECETA
-- LEFT JOIN para que aparezcan tambien las que nadie guardo, en 0.
SELECT r.nombre AS receta, COUNT(f.usuario_id) AS veces_guardada
FROM recetas r
LEFT JOIN favoritos f ON f.receta_id = r.id
GROUP BY r.id, r.nombre
ORDER BY veces_guardada DESC;


-- 8) CUANTAS RECETAS HAY POR CATEGORIA
SELECT categoria, COUNT(*) AS cantidad
FROM recetas
GROUP BY categoria;
