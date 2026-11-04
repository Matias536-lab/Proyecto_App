# API de MyKitchen

Backend que conecta la app con MySQL. La app no puede hablarle a MySQL
directamente, asi que le hace pedidos web a esta API y la API consulta la base.

Hecho con Express y mysql2, escucha en el puerto 3000.

## Archivos

    server.js          Todo el backend: conexion a MySQL y rutas
    config.js          Datos de conexion. NO se sube al repositorio
    config.ejemplo.js  Plantilla de config.js, esta si se sube

## Que hay que hacer la primera vez

1. Tener MySQL andando y haber ejecutado sql/01-base-de-datos.sql.

2. Crear el usuario de MySQL que usa la API. En Workbench, pestania de consulta
   nueva, reemplazando la clave por la que te paso el equipo:

       CREATE USER IF NOT EXISTS 'mykitchen_app'@'localhost' IDENTIFIED BY 'la_clave';
       GRANT SELECT, INSERT, UPDATE, DELETE ON mykitchen.* TO 'mykitchen_app'@'localhost';

3. Copiar config.ejemplo.js como config.js y poner ahi la misma clave.
   Revisar tambien el puerto: 3306 o 3307 segun la instalacion de cada uno.

4. Instalar las dependencias:

       cd api
       npm install

## Para levantarla

    node server.js

Tienen que aparecer dos mensajes:

    Conectado a mysql
    Server corriendo en puerto 3000

Si falta el primero, MySQL esta apagado o la clave de config.js esta mal.
Se corta con Ctrl + C. Si se cambia config.js hay que reiniciarla.

## Rutas

    GET   /ping           Probar que la API llega a MySQL
    POST  /registro       Crear un usuario (nombre, email, contrasena)
    POST  /login          Iniciar sesion (email, contrasena)
    GET   /usuarios/:id   Datos del perfil y cantidad de recetas

Prueba rapida desde el navegador: http://localhost:3000/ping

## Para conectarla con la app

En my-app/apiUsuarios.js hay una constante IP_DE_LA_NOTEBOOK. Va la direccion
IPv4 de la maquina donde corre esta API, la que da el comando ipconfig.
No sirve localhost: para el celular, localhost es el celular.

## Notas

Las consultas usan parametros con ? en vez de pegar el texto del usuario
dentro del SQL. Eso es lo que impide una inyeccion SQL.

Las contrasenias se guardan tal como las escribe el usuario. Antes estaban
hasheadas con bcrypt y se puede volver a eso: el paquete bcryptjs sigue
instalado.

config.js y node_modules no van al repositorio.
