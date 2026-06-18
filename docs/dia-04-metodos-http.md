# Día 4: Métodos HTTP

## Qué he hecho

- He creado rutas simuladas para usuarios.
- He probado `GET /api/users`.
- He probado `GET /api/users/:id`.
- He probado `POST /api/users` enviando JSON.
- He probado `PATCH /api/users/:id` enviando JSON.
- He probado `DELETE /api/users/:id`.
- He creado una colección de pruebas en Thunder Client o Postman.

## Endpoints trabajados

```http
GET /api/users
GET /api/users/:id
POST /api/users
PATCH /api/users/:id
DELETE /api/users/:id
```

## Explicación personal

GET sirve para obtener información.
POST sirve para crear información.
PATCH sirve para modificar parte de un recurso.
DELETE sirve para eliminar o desactivar un recurso.

## Pruebas realizadas

| Petición            | Método | Código esperado | Resultado obtenido              |
| ------------------- | ------ | --------------- | ------------------------------- |
| /api/users	      | GET    | 200             | Devuelve el listado de usuarios | 
| /api/users/1        | GET    | 200	         | Devuelve el usuario con id = 1  |
| /api/users          | POST   | 201             | Crea un usuario                 |
| /api/users/1        | PATCH  | 200             | Actualiza un usuario            |
| /api/users/1        | DELETE | 200             | Elimina o desactiva un usuario  |
| /api/users/me       | GET    | 200             | Devuelve el usuario logeado     |
| /api/users/1/status | POST   | 200             | Cambia el estado del usuario    |
| /api/users/1/role   | POST   | 200             | Cambia el rol del usuario       |

## Tabla de métodos HTTP

| Método   | ¿Para qué sirve?                              | Ejemplo en UserManager API  |
| -------- | --------------------------------------------- | --------------------------- |
| `GET`	   | Obtener datos del servidor                    | `GET` /api/users/1          |
| `POST`   | Añadir nuevos datos al servidor               | `POST` /api/users           |
| `PATCH`  | Modificar un recurso existente en el servidor | `PATCH` /api/users/1/status |
| `DELETE` | Eliminar un recurso del servidor              | `DELETE` /api/users/1       |
