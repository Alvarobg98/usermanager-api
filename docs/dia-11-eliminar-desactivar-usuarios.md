# Día 11 - Eliminar o desactivar usuarios en memoria

## Qué he hecho

- He actualizado el endpoint `DELETE /api/users/:id`.
- He leído el ID desde `req.params`.
- He validado que el ID sea numérico.
- He comprobado si el usuario existe.
- He aplicado borrado lógico usando `isActive = false`.
- He actualizado `updatedAt`.
- He comprobado que el usuario sigue existiendo en el listado.
- He probado casos de error.

## Endpoint trabajado

```http
DELETE /api/users/:id
```

## Casos probados

| Caso                                    | Código esperado | Resultado                                         |
| --------------------------------------- | --------------- | ------------------------------------------------- |
| Desactivar usuario existente            | 200             | Se desactiva el usuario correctamente             |
| ID no válido                            | 400             | Error: el ID debe ser numérico                    |
| Usuario inexistente                     | 404             | Error: el usuario no existe                       |
| Consultar usuario desactivado           | 200             | El usuario está desactivado `"isActive": false`   |
| Consultar listado después de desactivar | 200             | El usuario aparece en la lista y está desactivado |

## Explicación personal

En este proyecto `DELETE` no borra físicamente el usuario. En lugar de
eliminarlo del array, lo marcamos como inactivo cambiando `isActive` a `false`.
Esto se llama borrado lógico.

## Borrado físico vs borrado lógico

El borrado físico implica eliminar por completo del sistema un registro. Por ejemplo, el borrado físico de un usuario eliminaría todos los datos almacenados sobre ese usuario siendo casi imposible volver a recuperarlos.

El borrado lógico, en cambio, en vez de eliminar lo que hace es desactivar un registro. Volviendo al ejemplo de un usuario, todos los datos almacenados del usuario siguen estando disponibles a nivel interno pero para los clientes esos datos no están disponibles.

Para este proyecto usamos `isActive = false`, es decir, usamos borrado lógico para hacer que un usuario se quede desactivado. De este modo podemos hacer que cuando un usuario desactivado quiera iniciar sesión el sistema lo reconozca y se lo impida.

El borrado lógico tiene varias ventajas como por ejemplo:

    - Los datos no se pierden
    - La información se puede recuperar fácilmente
    - Evita problemas con otros datos relacionados
    - Facilita auditorías o registros históricos
