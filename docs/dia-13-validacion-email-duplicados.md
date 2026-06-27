# Día 13 - Validación de email y control de duplicados

## Qué he hecho

- He creado una función para normalizar emails.
- He creado una función para validar emails de forma básica.
- He creado una función para comprobar si un email ya está registrado.
- He mejorado la creación de usuarios.
- He mejorado la actualización de usuarios.
- He comprobado duplicados en `POST /api/users`.
- He comprobado duplicados en `PATCH /api/users/:id`.
- He probado errores `400` y `409`.

## Funciones creadas

```ts
function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function isValidBasicEmail(value: string): boolean {
  return value.includes("@") && value.includes(".");
}

function isEmailTaken(email: string, userIdToIgnore?: number): boolean {
  const normalizedEmail = normalizeEmail(email);

  return users.some(
    (user) => user.email === normalizedEmail && user.id !== userIdToIgnore
  );
}
```

## Casos probados

| Caso                                         | Código esperado | Resultado                                  |
| -------------------------------------------- | --------------- | ------------------------------------------ |
| Crear usuario con email normalizado          | 201             | Usuario creado correctamente               |
| Crear usuario con email duplicado            | 409             | Error: ya existe un usuario con ese email  |
| Crear usuario con email sin @                | 400             | Error: el email no tiene formato un válido |
| Crear usuario con email sin punto            | 400             | Error: el email no tiene formato un válido |
| Actualizar usuario con su mismo email        | 200             | Usuario actualizado correctamente          |
| Actualizar usuario con email de otro usuario | 409             | Error: ya existe un usuario con ese email  |

## Explicación personal

Normalizar un email significa limpiarlo antes de guardarlo o compararlo. En este
proyecto usamos `trim` y `toLowerCase` para evitar duplicados provocados por
espacios o mayúsculas.

## 409 Conflict

El error `HTTP 409` significa que la solicitud no pudo procesarse porque entra en conflicto con el estado actual del recurso en el servidor.

Lo usamos cuando el email ya está registrado para evitar usuarios duplicados, es decir, que el usuario nuevo a registrar entre en conflicto con un usuario existente en el servidor.

No sería tan adecuado usar el código de error `400` porque el problema no es que la petición esté mal formulada o el email no sea válido, si no estuviera ya registrado se podría crear o actualizar el usuario correctamente.

## Normalización de datos

Normalizar un email consiste en estandarizar el formato que deben tener todos los emails que se van a registrar. De este modo evitamos que se creen o actualicen usuarios con emails vacíos o con un formato inválido.

Si se guardasen los emails tal como llegan se corre el riesgo de crear usuarios duplicados, usuarios con emails vacíos,...
