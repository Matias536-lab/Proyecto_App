-- Agrega la columna bio a una base que ya existe, sin borrar nada.
-- Ejecutar una sola vez en Workbench.

ALTER TABLE mykitchen.usuarios ADD COLUMN bio VARCHAR(300) NULL AFTER foto;

-- Descripciones de ejemplo para los usuarios de prueba
UPDATE mykitchen.usuarios SET bio = 'Me gusta cocinar para los mios y probar recetas nuevas los domingos.' WHERE id = 1;

SELECT id, nombre, email, bio FROM mykitchen.usuarios;
