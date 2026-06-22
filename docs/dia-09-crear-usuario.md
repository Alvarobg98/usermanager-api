# Día 9: Crear usuarios en memoria

## Qué he hecho

- He actualizado el endpoint `POST /api/users`.
- He leído datos desde `req.body`.
- He validado campos obligatorios.
- He validado longitud mínima de contraseña.
- He comprobado email duplicado.
- He generado un nuevo ID.
- He creado un objeto `User`.
- He añadido el usuario al array con `push`.
- He devuelto `201 Created` cuando el usuario se crea correctamente.

## Endpoint trabajado

```http
POST /api/users
```

## Body de ejemplo

```json
{
  "name": "María López",
  "email": "maria@email.com",
  "password": "123456"
}
```

## Casos probados

| Caso             | Código esperado | Resultado                                   |
| ---------------- | --------------- | ------------------------------------------- |
| Usuario correcto | 201             | Se crea el usuario                          |
| Faltan campos    | 400             | Error `400` y aviso de que faltan campos    |
| Password corta   | 400             | Error `400` y aviso de contraseña corta     |
| Email duplicado  | 409             | Error `409` y aviso de usuario ya existente |

## Explicación personal

Para crear un usuario se leen los datos desde `req.body`, se validan, se
comprueba que el email no esté repetido, se genera un nuevo id y se añade el
usuario al array con `push`.

## Datos sensibles

La contraseña no debe devolverse en la respuesta de una petición ni en texto plano ni cifrada, ya que rompe el principio de confidencialidad y expone los credenciales a varios vectores de ataque.

El servidor solo debe devolver un código de estado (como `200`o `201`), y en todo caso, un token de sesión o un identificador del usuario.