# Día 18 - Diseño del modelo persistente User

## Qué he hecho

- He analizado qué datos necesita guardar un usuario.
- He diferenciado entre usuario en memoria y usuario persistente.
- He definido los campos principales del modelo User.
- He identificado qué campos son obligatorios.
- He identificado qué campos deben ser únicos.
- He marcado passwordHash como dato sensible.
- He definido las reglas de role e isActive.
- He preparado el diseño para convertirlo más adelante en un modelo Prisma.

## Campos del modelo User

| Campo          | Tipo conceptual  | Obligatorio | Único | Valor por defecto | Se devuelve al cliente |
| -------------- | ---------------- | ----------- | ----- | ----------------- | ---------------------- |
| `id`           | número           | sí          | sí    | automático        | sí                     |
| `name`         | texto            | sí          | no    | no                | sí                     |
| `email`        | texto            | sí          | sí    | no                | sí                     |
| `passwordHash` | texto            | sí          | no    | no                | no                     |
| `role`         | `USER` / `ADMIN` | sí          | no    | `USER`            | sí                     |
| `isActive`     | booleano         | sí          | no    | `true`            | sí                     |
| `createdAt`    | fecha            | sí          | no    | automático        | sí                     |
| `updatedAt`    | fecha            | sí          | no    | automático        | sí                     |

## Reglas del modelo

- El email no se puede repetir.
- El email debe guardarse normalizado.
- La contraseña nunca se guarda en texto plano.
- `passwordHash` nunca se devuelve al cliente.
- Todo usuario tiene un rol.
- El rol por defecto es `USER`.
- Todo usuario se crea activo.
- Un usuario desactivado no puede iniciar sesión.
- `createdAt` se genera al crear el usuario.
- `updatedAt` cambia cuando el usuario se modifica.

## Entrada, persistencia y salida

| Representación | Qué significa                    | Contiene password | Contiene passwordHash |
| -------------- | -------------------------------- | ----------------- | --------------------- |
| Entrada        | Datos que envía el cliente       | sí                | no                    |
| Persistencia   | Datos guardados en base de datos | no                | sí                    |
| Salida         | Datos que devuelve la API        | no                | no                    |

### Ejemplo de entrada

```json
{
  "name": "Ana García",
  "email": "ana@email.com",
  "password": "123456"
}
```

### Ejemplo de salida

```json
{
  "id": 1,
  "name": "Ana García",
  "email": "ana@email.com",
  "role": "USER",
  "isActive": true,
  "createdAt": "...",
  "updatedAt": "..."
}
```

## Posible modelo Prisma futuro

```prisma
model User {
  id           Int      @id @default(autoincrement())
  name         String
  email        String   @unique
  passwordHash String
  role         Role     @default(USER)
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

enum Role {
  USER
  ADMIN
}
```

Este modelo todavía no se implementa hoy. Servirá como referencia para los próximos días.

## Diagrama del flujo

![Diagrama de flujo](./flujo_general.png)

La contraseña llega desde el cliente solo durante el registro o login. Después se transforma en un hash y se guarda como passwordHash. La API nunca debe devolver password ni passwordHash.

## Campos opcionales

| Nombre del campo | Tipo   | Uso                        | Devolver al usuario |
| ---------------- | -----  | -------------------------- | ------------------- |
| `last_login_at`  | fecha  | Guardar último login       | Si                  |
| `phone`          | número | Guardar número de teléfono | Si                  |

## Por qué guardamos passwordHash y no password

Las contraseñas deben guardarse ya cifradas para dar más seguridad a la aplicación, evitando que en caso de que se filtren datos de usuarios las contraseñas en texto plano queden al descubierto. 

## Permisos por rol

| Acción                    | USER | ADMIN |
| ------------------------- | ---- | ----- |
| Ver su perfil	            | sí   | sí    |
| Listar todos los usuarios | no   | sí    |
| Cambiar su nombre         | sí   | sí    |
| Cambiar su rol            | no   | sí    |
| Desactivar usuarios       | no   | sí    |
| Cambiar su contraseña     | sí   | sí    |

## Ciclo de vida de un usuario

![Ciclo de vida usuario](./ciclo_vida_usuario.png)

## Dudas para elegir herramienta de acceso a datos

### ¿Qué herramienta se usa más con TypeScript?

- Prisma domina el ecosistema TS por su enfoque moderno y tipado automático.
- TypeORM sigue presente en proyectos legacy.
- Sequelize es más popular en JS que en TS.
- SQL directo se usa mucho, pero no como “framework”: es simplemente escribir SQL.

En proyectos modernos de TypeScript, Prisma es la opción más usada y recomendada.

### ¿Cuál permite definir modelos de forma más clara?

- Prisma: modelos declarativos, limpios, consistentes.
- TypeORM: modelos con decoradores, más verbosos.
- Sequelize: modelos menos estrictos y más complejos.
- SQL directo: no hay modelos; tú defines tablas y relaciones en SQL y las estructuras en código por tu cuenta.

El más claro es Prisma, por mucha diferencia.

### ¿Cuál es más fácil de aprender?

- Prisma: curva suave, excelente DX, tipado automático.
- Sequelize: relativamente fácil, pero menos robusto.
- TypeORM: más complejo por decoradores y configuración.
- SQL directo: fácil para CRUD básico, pero difícil para mantener en proyectos grandes.

El más fácil para empezar y escalar es Prisma.