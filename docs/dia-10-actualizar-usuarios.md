# Día 10: Actualizar usuarios en memoria

## Qué he hecho

- He actualizado el endpoint `PATCH /api/users/:id`.
- He leído el ID desde `req.params`.
- He leído los cambios desde `req.body`.
- He validado que el ID sea numérico.
- He comprobado si el usuario existe.
- He validado que el body no esté vacío.
- He validado `name`, `email` e `isActive`.
- He comprobado email duplicado al actualizar.
- He actualizado `updatedAt`.
- He sustituido el usuario dentro del array.

## Endpoint trabajado

```http
PATCH /api/users/:id
```

## Body de ejemplo

```json
{
  "name": "Ana Martínez"
}
```

## Casos probados

| Caso                   | Código esperado | Resultado                             |
| ---------------------- | --------------- | ------------------------------------- |
| Actualización correcta | 200             | Se actualiza el usuario               |
| ID no válido           | 400             | Error: ID no válido                   |
| Usuario inexistente    | 404             | Error: El usuario no existe           |
| Body vacío             | 400             | Error: Debes enviar al menos 1 campo  |
| Nombre vacío           | 400             | Error: El nombre no puede estar vacío |
| Email inválido         | 400             | Error: Formato de email inválido      |
| Email duplicado        | 409             |  Error: El email ya está registrado   |
| `isActive` incorrecto  | 400             | Error: isActive debe ser true o false |

## Explicación personal

Para actualizar un usuario se lee el ID desde `req.params`, se busca el usuario
en el array, se leen los cambios desde `req.body` y se sustituyen solo los
campos que han llegado en la petición.

## PATCH

Patch es un método HTTP que permite actualizar parcialmente un recurso, es decir, no cambia por completo todos los campos del recurso.

Si enviamos solo el campo `name` el resto de campos del usuario no se actualizan.

Desde una ruta de acceso general como es `Patch /api/users/:id` no se debe permitir cambiar campos sensibles como `id` o `role`, estos campos requieren unas reglas distintas.