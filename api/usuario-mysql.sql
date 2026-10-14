CREATE USER IF NOT EXISTS 'mykitchen_app'@'localhost' IDENTIFIED BY 'CLAVE';

GRANT SELECT, INSERT, UPDATE, DELETE ON mykitchen.* TO 'mykitchen_app'@'localhost';

FLUSH PRIVILEGES;