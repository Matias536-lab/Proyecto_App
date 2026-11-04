# Base de datos de MyKitchen

Los archivos estan numerados en el orden en que se ejecutan.

## Instalar de cero

    01-base-de-datos.sql    Crea la base y las 5 tablas
    02-usuario-mysql.sql    Crea el usuario que usa el backend

Con esos dos ya queda todo. El 01 incluye las columnas que agregaron
despues el 03 y el 04, asi que en una instalacion nueva no hacen falta.

## Si la base ya existe

Los numeros 03 y 04 son migraciones: agregan columnas sin borrar los datos.

    03-agregar-bio.sql      Agrega la columna bio a usuarios
    04-agregar-favoritos.sql  Agrega origen y origen_id a recetas

Se ejecutan una sola vez. Si se repiten, MySQL avisa "Duplicate column name"
y no pasa nada.

ATENCION: 01-base-de-datos.sql empieza con DROP DATABASE. Si la base ya tiene
datos cargados, ese archivo los borra. Por eso existen las migraciones.

## Para demostrar que funciona

    consultas.sql           Consultas con JOIN que cruzan las tablas

Solo leen, no modifican nada. Se pueden ejecutar las veces que haga falta.

## Otros

    extra-insert-manual.sql  Un INSERT suelto de una prueba vieja. No se usa.
