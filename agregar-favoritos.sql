-- Prepara la tabla recetas para poder guardar favoritos de cualquier receta,
-- no solo de las que crean los usuarios.
--
-- Ejecutar una sola vez en Workbench. No borra nada.

USE mykitchen;

-- De donde vino la receta: 'usuario' si la escribio alguien en la app,
-- 'local' si es una de las nuestras, 'api' si vino de TheMealDB.
ALTER TABLE recetas ADD COLUMN origen VARCHAR(20) NOT NULL DEFAULT 'usuario' AFTER autor_id;

-- El identificador que esa receta tenia en su lugar de origen.
-- Sirve para no importar dos veces la misma.
ALTER TABLE recetas ADD COLUMN origen_id VARCHAR(60) NULL AFTER origen;

-- Impide duplicados. Las recetas propias tienen origen_id NULL, y MySQL
-- permite repetir NULL en un indice unico, asi que no molesta.
CREATE UNIQUE INDEX idx_recetas_origen ON recetas (origen, origen_id);

-- Las recetas de internet no siempre caen en una de las cuatro comidas,
-- asi que la regla se amplia en vez de inventarles una categoria.
ALTER TABLE recetas DROP CHECK chk_recetas_categoria;

ALTER TABLE recetas ADD CONSTRAINT chk_recetas_categoria
  CHECK (categoria IN ('Desayuno', 'Almuerzo', 'Merienda', 'Cena', 'De internet'));

SELECT id, nombre, categoria, origen, origen_id FROM recetas;
