# Día 12 - Validación manual básica

## Qué he hecho

- He revisado las validaciones existentes.
- He creado funciones auxiliares de validación.
- He validado strings no vacíos.
- He validado tipos de datos.
- He limpiado `name` y `email` con `trim`.
- He normalizado `email` a minúsculas.
- He mejorado la validación de creación de usuarios.
- He mejorado la validación de actualización de usuarios.
- He probado errores `400 Bad Request`.

## Funciones creadas

```ts
function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}
```

## Casos probados

| Caso                            | Código esperado | Resultado                                       |
| ------------------------------- | --------------- | ----------------------------------------------- |
| Nombre vacío                    | 400             | Error: el nombre debe ser un texto no vacío     |
| Nombre con solo espacios        | 400             | Error: el nombre debe ser un texto no vacío     |
| Email no string                 | 400             | Error: el email debe ser un texto no vacío      |
| Password no string              | 400             | Error: la contraseña debe ser un texto no vacío |
| Email con mayúsculas y espacios | 201             | Usuario creado correctamente                    |
| isActive incorrecto en PATCH    | 400             | Error: isActive debe ser true o false           |

## Explicación personal

Validar datos significa comprobar que lo que llega a la API tiene el formato
esperado antes de usarlo. Si los datos son incorrectos, la API debe responder
con un error claro y no continuar con la operación.

## Errores de validación

| Error                 | Cuándo ocurre            | Código |
| --------------------- | ------------------------ | ------ |
| Nombre vacío          | `name: ""` o `name: " "` | 400    |
| Email no válido       | no incluye `@` ni        | 400    |
| Password corta        | menos de 6 caracteres    | 400    |
| `isActive` incorrecto | no es true o false       | 400    |

## ¿Por qué no debemos confiar en el cliente?

Una API actúa de frontera entre frontend y backend. Por eso, aunque en el frontend se validen los datos, tenemos que asegurarnos al 100% de que son correctos antes de que pasen al backend.