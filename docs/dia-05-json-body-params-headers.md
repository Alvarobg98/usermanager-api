# Día 5: JSON, body, params y headers

## Qué he hecho

- He repasado qué es JSON.
- He aprendido para qué sirve el body.
- He probado route params.
- He probado query params.
- He probado headers.
- He creado rutas temporales de debug.
- He creado una colección de pruebas en Thunder Client o Postman.

## Rutas trabajadas

```http
POST /api/debug/body
GET /api/debug/params/:id
GET /api/debug/query
GET /api/debug/headers
PATCH /api/debug/users/:id
```

## Explicación personal

El body sirve para enviar datos principales al servidor.
Los params sirven para identificar recursos concretos en la ruta.
Los query params sirven para enviar filtros u opciones en la URL.
Los headers sirven para enviar información adicional de la petición.

## Pruebas realizadas

| Petición                                        | Dato probado | Código esperado | Resultado obtenido |
| ----------------------------------------------- | ------------ | --------------- | ------------------ |
| `POST /api/debug/body`	                      | Body         | 201             | Devuelve el contenido del body de la peticion                                                   | 
| `GET /api/debug/params/25`                      | Params       | 200	           | Devuelve el contenido de params, en este caso `"id": "25"`                                      |
| `GET /api/debug/query?role=ADMIN&isActive=true` | Query params | 200             | Devuelve el contenido de los query params, en este caso `"role": "ADMIN"`y `"isActive": "true"` |
| `GET /api/debug/headers`                        | Headers      | 200             | Devuelve el contenido de los headers de la peticion                                             |
| `PATCH /api/debug/users/7?notify=true`          | Combinado    | 200             | Devuelve el contenido del body, de params, de query params y de los headers de la petición      |

## Dónde viaja cada dato

| Dato	            | ¿Dónde viajaría? | Ejemplo                       |
| ----------------- | ---------------- | ----------------------------- |
| ID de usuario	    | Route params     | `GET /api/users/25`           |
| Email de registro | Body	           | `"email": "alvaro@email.com"` |
| Filtro por rol	| Query params     | `GET /api/users?role=ADMIN`   |
| Token JWT.        | Headers	       | `Authorization: Bearer token` |
| Nueva contraseña  | Body	           | `"newPassword": "123456"`     |