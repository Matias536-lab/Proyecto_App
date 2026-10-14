DROP DATABASE IF EXISTS mykitchen;

CREATE DATABASE mykitchen
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE mykitchen;


CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(80) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  contrasena_hash VARCHAR(255) NOT NULL,
  foto VARCHAR(500) NULL,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ultimo_acceso DATETIME NULL
) ENGINE=InnoDB;


CREATE TABLE recetas (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  autor_id INT NOT NULL,
  nombre VARCHAR(150) NOT NULL,
  categoria VARCHAR(20) NOT NULL,
  tiempo VARCHAR(50) NULL,
  porciones VARCHAR(50) NULL,
  descripcion TEXT NULL,
  imagen VARCHAR(500) NULL,
  publica BOOLEAN NOT NULL DEFAULT TRUE,
  fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_recetas_autor
    FOREIGN KEY (autor_id) REFERENCES usuarios(id)
    ON DELETE CASCADE,

  CONSTRAINT chk_recetas_categoria
    CHECK (categoria IN ('Desayuno', 'Almuerzo', 'Merienda', 'Cena'))
) ENGINE=InnoDB;


CREATE TABLE ingredientes (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  receta_id BIGINT NOT NULL,
  texto VARCHAR(200) NOT NULL,
  orden INT NOT NULL,

  CONSTRAINT fk_ingredientes_receta
    FOREIGN KEY (receta_id) REFERENCES recetas(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;


CREATE TABLE pasos (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  receta_id BIGINT NOT NULL,
  texto TEXT NOT NULL,
  orden INT NOT NULL,

  CONSTRAINT fk_pasos_receta
    FOREIGN KEY (receta_id) REFERENCES recetas(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;


CREATE TABLE favoritos (
  usuario_id INT NOT NULL,
  receta_id BIGINT NOT NULL,
  fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (usuario_id, receta_id),

  CONSTRAINT fk_favoritos_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_favoritos_receta
    FOREIGN KEY (receta_id) REFERENCES recetas(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;


CREATE INDEX idx_recetas_autor ON recetas (autor_id);
CREATE INDEX idx_recetas_categoria ON recetas (categoria);
CREATE INDEX idx_ingredientes_receta ON ingredientes (receta_id);
CREATE INDEX idx_pasos_receta ON pasos (receta_id);


INSERT INTO usuarios (nombre, email, contrasena_hash) VALUES
  ('Matias Maldonado', 'matias@mykitchen.test', '$2b$10$EJEMPLO.NO.ES.UN.HASH.REAL.SOLO.PRUEBA'),
  ('Iago Craveli', 'iago@mykitchen.test', '$2b$10$EJEMPLO.NO.ES.UN.HASH.REAL.SOLO.PRUEBA'),
  ('Julian Acosta', 'julian@mykitchen.test', '$2b$10$EJEMPLO.NO.ES.UN.HASH.REAL.SOLO.PRUEBA');

INSERT INTO recetas (autor_id, nombre, categoria, tiempo, porciones, descripcion) VALUES
  (1, 'Milanesa con Pure de Papas', 'Almuerzo', '45 minutos', '4 porciones',
     'El plato mas emblematico de la mesa argentina.'),
  (2, 'Tostadas con Palta y Huevo', 'Desayuno', '10 minutos', '1 porcion',
     'Desayuno completo, rapido y saciante.'),
  (3, 'Mate con Bizcochitos', 'Merienda', '5 minutos', '1 porcion',
     'La merienda mas comun de la tarde argentina.');

INSERT INTO ingredientes (receta_id, texto, orden) VALUES
  (1, '4 bifes de nalga finos', 1),
  (1, '2 huevos', 2),
  (1, '300 g de pan rallado', 3),
  (1, '1 kg de papas', 4),
  (2, '2 rebanadas de pan integral', 1),
  (2, '1 palta madura', 2),
  (2, '2 huevos', 3);

INSERT INTO pasos (receta_id, texto, orden) VALUES
  (1, 'Batir los huevos con ajo, perejil, sal y pimienta.', 1),
  (1, 'Pasar cada bife por huevo y luego por pan rallado.', 2),
  (1, 'Freir 3 minutos de cada lado.', 3),
  (1, 'Hervir las papas 20 minutos y pisarlas con leche y manteca.', 4),
  (2, 'Tostar el pan.', 1),
  (2, 'Pisar la palta con sal y limon.', 2),
  (2, 'Cocinar los huevos y servirlos sobre la palta.', 3);

INSERT INTO favoritos (usuario_id, receta_id) VALUES
  (2, 1),
  (3, 1),
  (1, 2),
  (1, 3);