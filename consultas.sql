USE mykitchen;


SELECT r.nombre AS receta, r.categoria, u.nombre AS autor
FROM recetas r
JOIN usuarios u ON r.autor_id = u.id
ORDER BY r.categoria;


SELECT r.nombre AS receta, i.orden, i.texto AS ingrediente
FROM recetas r
JOIN ingredientes i ON i.receta_id = r.id
WHERE r.id = 1
ORDER BY i.orden;


SELECT r.nombre AS receta, p.orden, p.texto AS paso
FROM recetas r
JOIN pasos p ON p.receta_id = r.id
WHERE r.id = 1
ORDER BY p.orden;


SELECT r.nombre AS receta, COUNT(f.usuario_id) AS veces_guardada
FROM recetas r
LEFT JOIN favoritos f ON f.receta_id = r.id
GROUP BY r.id, r.nombre
ORDER BY veces_guardada DESC;


SELECT u.nombre AS usuario, r.nombre AS receta_guardada, f.fecha
FROM favoritos f
JOIN usuarios u ON f.usuario_id = u.id
JOIN recetas r ON f.receta_id = r.id
WHERE u.email = 'matias@mykitchen.test';


SELECT categoria, COUNT(*) AS cantidad
FROM recetas
GROUP BY categoria;


SELECT id, nombre, email, activo, fecha_registro, ultimo_acceso
FROM usuarios;