# Día 14 - Códigos de estado HTTP

## Qué he hecho

- He revisado los códigos HTTP utilizados en la API.
- He probado respuestas correctas con `200 OK`.
- He probado creación con `201 Created`.
- He probado errores de validación con `400 Bad Request`.
- He probado usuario inexistente con `404 Not Found`.
- He probado email duplicado con `409 Conflict`.
- He comprobado que el código HTTP coincide con el mensaje JSON.

## Tabla resumen

| Código | Significado | Cuándo lo uso                               |
| ------ | ----------- | ------------------------------------------- |
| 200    | OK          | Cuando la petición se procesa correctamente |
| 201    | Created     | Cuando se crea un usuario                   |
| 400    | Bad Request | Cuando la petición tiene datos incorrectos  |
| 404    | Not Found   | Cuando el usuario no existe                 |
| 409    | Conflict    | Cuando el email ya está registrado          |

## Casos probados

| Petición               | Caso                   | Código esperado | Código obtenido | ¿Correcto? |
| ---------------------- | ---------------------- | --------------- | --------------- | ---------- |
| `GET /api/health`      | Health                 | 200             | `200`           | OK         |
| `GET /api/users`       | Listado                | 200             | `200`           | OK         |
| `GET /api/users/1`     | Usuario existente      | 200             | `200`           | OK         |
| `GET /api/users/999`   | Usuario inexistente    | 404             | `404`           | OK         |
| `GET /api/users/abc`   | ID inválido            | 400             | `400`           | OK         |
| `POST /api/users`      | Creación correcta      | 201             | `201`           | OK         |
| `POST /api/users`      | Datos inválidos        | 400             | `400`           | OK         |
| `POST /api/users`      | Email duplicado        | 409             | `409`           | OK         |
| `PATCH /api/users/1`   | Actualización correcta | 200             | `200`           | OK         |
| `PATCH /api/users/999` | Usuario inexistente    | 404             | `404`           | OK         |
| `DELETE /api/users/1`  | Desactivación correcta | 200             | `200`           | OK         |

## Explicación personal

Los códigos de estado HTTP permiten que el cliente entienda rápidamente qué ha
pasado con una petición. No basta con devolver un JSON; el código HTTP también
debe ser coherente con el resultado.

## Cómo decido qué código usar

| Situación                         | Código que usaría | Motivo                               |
| --------------------------------- | ----------------- | ------------------------------------ |
| Usuario creado correctamente      | 201               | Recurso creado correctamente         |
| Usuario no encontrado             | 404               | Recurso inexistente                  |
| ID no numérico                    | 400               | Petición mal formulada               |
| Email duplicado                   | 409               | Conflicto con otro usuario existente |
| Falta un campo obligatorio        | 400               | Petición mal formulada               |
| Usuario actualizado correctamente | 200               | Petición realizada correctamente     |

## Diferencia entre 400, 404 y 409

- `400 Bad Request`: se usa cuando la petición está mal formulada, por ejemplo, falta un campo o un dato no tiene el formato correcto
- `404 Not Found`: se usa cuando el recurso al que se quiere acceder no existe
- `409 Conflict`: se usa cuando el recurso que queremos crear o actualizar entra en conflicto con otro registro ya existente en el sistema

## Códigos 401 y 403

- `401 Unauthorized`: se usa cuando no hay autenticación válida
- `403 Forbidden`: se usa cuando el usuario está autenticado pero no tiene permisos