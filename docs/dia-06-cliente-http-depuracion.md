# Día 6: Cliente HTTP y depuración

## Qué he hecho

- He organizado una colección de pruebas de la API.
- He probado rutas básicas.
- He probado peticiones con body.
- He probado peticiones con params, query params y headers.
- He creado una ruta temporal de depuración.
- He provocado errores controlados para entender qué ocurre.
- He revisado respuestas y códigos de estado.

## Colección creada

Nombre de la colección:

```text
UserManager API
```

## Ruta temporal de depuración

```http
POST /api/debug/request
```

## Explicación personal

Un cliente HTTP sirve para enviar peticiones a una API y analizar las
respuestas. Es útil porque permite probar métodos, headers, body, params y
códigos de estado de una forma más completa que el navegador.

## Pruebas realizadas

| Petición                                 | Qué prueba        | Código esperado | Código obtenido | Observaciones                                                |
|------------------------------------------|-------------------|-----------------|-----------------|--------------------------------------------------------------|
| `GET /api/health`                        | Health endpoint   | 200             | 200             | Devuelve inormacion y estado de la API                       |
| `GET /api/users`                         | Listado simulado  | 200             | 200             | Devuelve listado vacio                                       |
| `POST /api/users`                        | Body JSON         | 201             | 201             | Devuelve los datos enviados                                  |
| `PATCH /api/users/1`                     | Params + body     | 200             | 200             | Devuelve `"id": "1"` y los datos enviados                    |
| `POST /api/debug/request?source=thunder` | Request completa  | 200             | 200             | Devuelve metodo, ruta, params, body y headers de la pericion |
| `GET /api/ruta-inventada`                | Ruta inexistente  | 404             | 404             | No puede acceder a la ruta                                   |
| `POST /api/health`                       | Método incorrecto | 404             | 404             | No puede usar el metodo Post con la ruta especificada        |

## Petición con header personalizado

Petición a:
`POST /api/debug/request``

Header personalizado:
`x-student-name: alvaro`

Body JSON con información de prueba:
```json
{ 
    "example": "probando headers personalizados" 
}
```

El header `x-student-name` aparece dentro de la propiedad `headers` de la respuesta.

## Prueba de actualización completa

Petición a:
`PATCH /api/users/5`

Body de la petición:
```json
{ 
    "name": "Alvaro Barranco Garcia",
    "email": "alvaro.barranco@email.com",
    "isActive": true
}
```

| Dato                        | Donde viaja                         |
|-----------------------------|-------------------------------------|
| `5`                         | En params dentro de `req.params.id` |
| `name`, `email`, `isActive` | En body dentro de `req.body`        |

La petición devuelve el `id`del usuario junto con la información que se va a cambiar:
```json
{
    "message:": "Usuario recibido para modificar",
    "id": "5",
    "changes": {
        "name": "Alvaro Barranco Garcia",
        "email": "alvaro.barranco@email.com",
        "isActive": true
    }
}
```

## Guía de depuración

1. Comprobar que el servidor está arrancado.
2. Revisar el método HTTP.
3. Revisar la URL.
4. Revisar el body.
5. Revisar los headers.
6. Mirar el status code.
7. Mirar la terminal.

## Comparación entre navegador y cliente HTTP

| Herramienta            | Ventajas                                                                                                                                                     | Limitaciones                                                                                                                           |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------|
| Navegador              | No requiere configurar nada y se  pueden probar peticiones `GET` sencillas                                                                                   | Es mas complejo para peticiones `PATCH`, `POST` y `DELETE` en las que haya que enviar información en el body o headers  personalizados |
| Thunder CLient/Postman | Se puede guardar colecciones de peticiones,  probar diferentes tipos de metodos, crear headers  personalizados, enviar body JSON y comprobar el  status code | Las peticiones se crean y configuran manualmente                                                                                       |