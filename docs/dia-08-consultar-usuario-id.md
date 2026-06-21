# Día 8: Consultar usuario por ID

## Qué he hecho

- He actualizado el endpoint `GET /api/users/:id`.
- He leído el ID desde `req.params`.
- He convertido el ID de string a number.
- He validado si el ID es numérico.
- He buscado usuarios con `find`.
- He devuelto `404` cuando el usuario no existe.
- He probado diferentes casos desde Thunder Client o Postman.

## Endpoint trabajado

```http
GET /api/users/:id
```

## Casos probados

| Petición             | Código esperado | Resultado                                                              |
| -------------------- | --------------- | ---------------------------------------------------------------------- |
| `GET /api/users/1`   | 200             | Devuelve el usuario con `"id": "1"`                                    |
| `GET /api/users/2`   | 200             | Devuelve el usuario con `"id": "2"`                                    |
| `GET /api/users/999` | 404             | Status code `404` y un mensaje avisando de que el no existe            |
| `GET /api/users/abc` | 400             | Status code `404` y un mensaje avisando de que el ID debe ser numérico |

## Explicación personal

El parámetro `:id` se recibe desde `req.params`. Como llega en formato string,
hay que convertirlo a number antes de compararlo con los id de los usuarios.

## Orden de rutas en Express

Rutas como:

```text
/api/users/count
/api/users/active
````

Deben ir antes que `/api/users/:id` dentro de `server.ts` ya que las primeras son rutas específicas y la última es una ruta dinámica. Esto implica que cuando llamamos por ejemplo a `/api/users/count` estando colocada antes `/api/users/:id` esta última ruta interprete `count` como un parámetro de ruta y considere que `"id": "count"`. Por este motivo las rutas específicas deben ir siempre antes que las dinámicas. 