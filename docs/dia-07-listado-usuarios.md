# Día 7: Listado de usuarios en memoria

## Qué he hecho

- He creado un tipo User en TypeScript.
- He creado un array de usuarios en memoria.
- He actualizado el endpoint GET /api/users.
- He devuelto un listado de usuarios en formato JSON.
- He añadido el total de usuarios en la respuesta.
- He comprobado que no se devuelven contraseñas.

## Endpoint trabajado

```http
GET /api/users
```

## Respuesta obtenida

```json
{
  "message": "Listado de usuarios",
  "total": 3,
  "data": [
    {
      "id": 1,
      "name": "Ana García",
      "email": "ana@email.com",
      "role": "USER",
      "isActive": true
    }
  ]
}
```

## Explicación personal

Trabajar en memoria significa que los datos están guardados temporalmente
mientras el servidor está encendido. Si reinicio el servidor, los datos vuelven
al estado inicial.

## Tabla de comprobación

| Comprobación                        | Resultados |
|-------------------------------------|------------|
| La ruta `GET /api/users` responde   | Correcto   |
| El status code es `200`             | Correcto   |
| La respuesta contiene `message`     | Correcto   |
| La respuesta contiene `total`       | Correcto   |
| La respuesta contiene `data`        | Correcto   |
| `data` es un array                  | Correcto   |
| Los usuarios no incluyen contraseña | Correcto   |

## Memoria vs Base de datos

Guardar datos en memoria significa que los datos viven mientras el servidor esté encendido. Una vez se este se apague los cambios realizados se borran, de manera que cuando se vuelva a iniciar el servidor los datos se generan de nuevo.

Por esto más adelante será necesario usar una BBDD para almacenar información. Los datos y los cambios que hagamos sobre estos persistirán independientemente de si el servidor está encendido o no.