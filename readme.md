# Blog Api

## Descripcion del proyecto

Este proyecto es una API de un blog que permitirá a los usuarios resgistrarse,
iniciar sesión, comentar post,ver post,subir post, se podrá subir imagenes, ir al perfil de un usuario.
La aplicacion esta construida utilizando, nodejs, express y utiliza postgresSQL para al macrenar la información.

## Caracteristicas principales

1. Crear post
2. Subir imagenes,
3. Registrar usuarios
4. Logearse con un usuario
5. Utiliza websockets para cuando se cree un post se emita ese post creado a todos los clientes
6. Comentar post
7. Eliminar post
8. Actualizar post

## Tecnologías utilizadas

1. Express: es el framework web más popular de Node, y es la librería subyacente para un gran número de otros frameworks web de Node populares.

2. Express-rate-limit: para evitar la sobrecarga de nuestros sistemas y mantener su estabilidad y seguridad.

3. Firebase: permite almacenar y sincronizar datos entre tus usuarios en tiempo real.

4. PostgreSQL: permite crear, gestionar y consultar bases de datos relacionales de gran tamaño

5. Sequelize: permite manipular varias bases de datos SQL de una manera bastante sencilla

6.jsonwebtoken: JSON Web Token (JWT) es un estándar para transmitir información de forma segura en internet, por medio de archivos en formato JSON, que es un tipo de archivo de texto plano con el cual se pueden crear parámetros y asignarles un valor.

7. socket.io: permite la comunicación bidireccional en tiempo real, basada en eventos, entre clientes (navegadores / clientes Node. js) y servidores web

## Requisitos previos para utilizar el proyecto

1. Tener node instaldo en el equipos

2. Tener postgreSQL instalado

3. Tener creada una base de datos es postgreSQL

4. Tener una instancia de firabase creada con almacenamiento en firestore

## como ejecutar el proyecto

1. Clonar el repositorio

2. Ejecutar npm install

3. Crearse la base de datos global con postgreSQL

4. Crearse una app de firebase e inicializar firestore en ella

5. Clonar el .env.template y renombrar a .env

6. Llenar las variables de entorno

7. levantar el modo de desarrollo utilizando el comando:

```
npm run start:dev
```
