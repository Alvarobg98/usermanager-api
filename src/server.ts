import express, {Request, Response, NextFunction} from "express";
import { emit } from "node:cluster";
import { error, timeStamp } from "node:console";

const app = express();
const PORT = 3000;

type User = {
    id: number,
    name: string,
    email: string,
    role: "USER" | "ADMIN",
    isActive: boolean,
    createdAt: string,
    updatedAt: string
};

// Datos temporales en memoria, se sustituirán más adelante por una BBDD
const users: User[] = [
  {
    id: 1,
    name: "Ana García",
    email: "ana@email.com",
    role: "USER",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    name: "Carlos Pérez",
    email: "carlos@email.com",
    role: "ADMIN",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 3,
    name: "Laura Martínez",
    email: "laura@email.com",
    role: "USER",
    isActive: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 4,
    name: "Alvaro Barranco",
    email: "alvaro@email.com",
    role: "USER",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 5,
    name: "Elena Medina",
    email: "elena@email.com",
    role: "USER",
    isActive: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

class AppError extends Error {
    statusCode: number;
    details?: unknown;

    constructor(message: string, statusCode: number = 500, details?: unknown) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
    }
}

function isNonEmptyString(value: unknown): value is string {
    return typeof value === "string" && value.trim().length > 0;
}

function isBoolean(value: unknown): value is boolean {
    return typeof value === "boolean";
}

function normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
}

function isValidBasicEmail(value: string): boolean {
    return value.includes("@") && value.includes(".") && !value.startsWith("@") && !value.endsWith("@");
}

function isEmailTaken(email: string, userIdToIgnore?: number): boolean {
    const normalizedEmail = normalizeEmail(email);

    return users.some(
        (user) => user.email === normalizedEmail && user.id !== userIdToIgnore
    );
}

function isValidName(value: string): boolean {
    return value.length >= 2;
}

app.use(express.json());

// Endpoint raiz de la API
app.get("/", (req, res) => {
    res.json({
        "name": "UserManager API",
        "version": "1.0.0",
        "status": "running",
        "author": "Alvaro Barranco"
    });
});

// Endpoint temporal que devuelve informacion de la API
app.get("/api/info", (req, res) => {
    res.json({
        "project": "UserManager API",
        "description": "API REST para gestionar usuarios",
        "day": 2,
        "technologies": ["Node.js", "Express", "TypeScript"]
    });
});

// Endpoint para comprobar que la API está funcionando
app.get("/api/health", (req, res) => {
    res.status(200).json({
        "status": "ok",
        "message": "UserManager API funcionando",
        "timestamp": new Date().toISOString(),
        "version": "1.0.0",
        "environment": "development"
    });
});

// Endpoint para comprobar si el servidor responde rápidamente
app.get("/api/ping", (req, res) => {
    res.json({
        "massage": "pong"
    });
});

// Endpoint que devuelve el listado de usuarios
app.get("/api/users", (req, res) => {
    res.status(200).json({
        "message": "Listado de usuarios",
        "total": users.length,
        "data": users
    });
});

// Endpoint para simular busquedas
app.get("/api/users/search", (req, res) => {
    res.status(200).json({
        "message": "Busqueda de usuarios",
        "filters": req.query
    });
});

// Endpoint para buscar usuarios por su email
app.get("/api/users/search/email", (req, res, next) => {
    const {email} = req.query;
    const existingUser = users.find((user) => user.email === email);

    if (existingUser) {
        res.status(200).json({
            "message": "Usuario encontrado",
            "data": existingUser
        });
    } else {
        next( 
            new AppError("Usuario no encontrado", 404, {
                received: email
            })
        );
    }
});

// Endpoint que devuelve al usuario logeado
app.get("/api/users/me", (req, res) => {
    res.status(200).json({
        "id": 1,
        "name": "Usuario de prueba",
        "email": "usuario@email.com",
        "role": "USER",
        "isActive": true
    });
});

// Endpoint para cambiar la contraseña
app.patch("/api/users/me/password", (req, res) => {
    res.status(200).json({
        "message": "Solicitud de cambio de contraseña recibida"
    });
});

// Endpoint para contar el número de usuarios almacenados
app.get("/api/users/count", (req, res) => {
    res.status(200).json({
        "total": users.length
    });
});

// Endpoint que devuelve los usuarios activos
app.get("/api/users/active", (req, res, next) => {
    const activeUsers = users.filter((user) => user.isActive);

    if (activeUsers.length === 0) {
        next(
            new AppError("No hay usuarios activos", 404)
        );
    } else {
        res.status(200).json({
            "message": "Usuarios activos",
            "total": activeUsers.length,
            "activeUsers": activeUsers
        });
    }
})

// Endpoint que devuelve los usuarios inactivos
app.get("/api/users/inactive", (req, res, next) => {
    const inactiveUsers = users.filter((user) => !user.isActive);

    if (inactiveUsers.length === 0) {
        next(
            new AppError("No hay usuarios inactivos", 404)
        );
    } else {
        res.status(200).json({
            "message": "Usuarios inactivos",
            "total": inactiveUsers.length,
            "activeUsers": inactiveUsers
        });
    }
})

// Endpoint que devuelve un usuario por su id
app.get("/api/users/:id", (req, res, next) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        return next(
            new AppError("El ID debe ser numérico", 400, {
                received: req.params.id
            })
        );
    }

    const user = users.find((user) => user.id === id);

    if (!user) {
        return next(
            new AppError("Usuario no encontrado", 404, {
                id
            })
        );
    }

    res.status(200).json({
        "message": "Usuario encontrado",
        "data": user
    });
});

// Endpoint para crear un usuario
app.post("/api/users", (req, res, next) => {
    const {name, email, password} = req.body;

    if (!isNonEmptyString(name)) {
        return next(
            new AppError("El nombre debe ser un texto no vacío", 400, {
                received: name
            })
        );
    }

    if (!isNonEmptyString(email)) {
        return next(
            new AppError("El email debe ser un texto no vacío", 400, {
                received: email
            })
        );
    }

    if (!isNonEmptyString(password)) {
        return next(
            new AppError("La contraseña debe ser un texto no vacío", 400)
        );
    }

    const cleanName = name.trim();
    const cleanEmail = normalizeEmail(email);
    const cleanPass = password.trim();

    if (!isValidName(cleanName)) {
        return next(
            new AppError("El nombre debe tener al menos 2 caracteres", 400, {
                received: name
            })
        );
    }

    if (String(cleanPass).length < 6) {
        return next(
            new AppError("La contraseña debe tener al menos 6 caracteres", 400)
        );
    }

    if (!isValidBasicEmail(cleanEmail)) {
        return next(
            new AppError("El email debe tener un formato válido", 400, {
                received: email
            })
        );
    }

    if (isEmailTaken(cleanEmail)) {
        return next(
            new AppError("Ya existe un usuario con ese email", 409, {
                received: email
            })
        );
    }

    const newId = users.length > 0 ? Math.max(...users.map((user) => user.id)) + 1 : 1;

    const newUser : User = {
        id: newId,
        name: cleanName,
        email: cleanEmail,
        role: "USER",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    users.push(newUser);

    res.status(201).json({
        "message": "Usuario recibido para crear",
        "data": newUser
    });
});

// Endpoint para activar/desactivar un usuario por su id
app.patch("/api/users/:id/status", (req, res, next) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        return next(
            new AppError("El ID debe ser numérico", 400, {
                id: req.params.id
            })
        );
    }

    const existingUser = users.findIndex((user) => user.id === id);

    if (existingUser === -1) {
        return next(
            new AppError("Usuario no encontrado", 404, {
                id
            })
        );
    }

    const {isActive} = req.body;

    if (typeof isActive !== "boolean") {
        return next(
            new AppError("isActive debe ser true o false", 400, {
                received: isActive
            })
        );
    }

    users[existingUser].isActive = isActive;

    res.status(200).json({
        "message": "Estado de usuario recibido para actualizar",
        "id": id,
        "isActive": isActive
    });
});

// Endpoint para reactivar un usuario por su id
app.patch("/api/users/:id/reactivate", (req, res, next) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        return next(
            new AppError("El ID debe ser numérico", 400, {
                id: req.params.id
            })
        );
    }

    const existingUser = users.findIndex((user) => user.id === id);
    
    if (existingUser === -1) {
        return next(
            new AppError("Usuario no encontrado", 404, {
                id
            })
        );
    }

    const currentUser = users[existingUser];

    if (currentUser.isActive === true) {
        return res.status(200).json({
            "message": "El usuario ya estaba activado",
            "data": currentUser
        });
    }

    const updatedUser : User = {
        ...currentUser,
        isActive: true,
        updatedAt: new Date().toISOString()
    };

    users[existingUser] = updatedUser;

    res.status(200).json({
        "message": "Usuario reactivado correctamente",
        "data": updatedUser
    });
});

// Endpoint para actualizar los datos de un usuario por su id
app.patch("/api/users/:id", (req, res, next) => {
    const idParam = req.params.id;
    const idNorm = Number(idParam);

    if (Number.isNaN(idNorm)) {
        return next(
            new AppError("El ID debe ser numérico", 400, {
                idParam
            })
        );
    }

    const userIndex = users.findIndex((user) => user.id === idNorm);

    if (userIndex === -1) {
        return next(
            new AppError("Usuario no encontrado", 404, {
                idNorm
            })
        );
    }

    const {id, name, email, isActive, role} = req.body;

    if (id) {
        return next(
            new AppError("No se puede cambiar el ID", 400)
        );
    }

    if (role) {
        return next(
            new AppError("No se puede cambiar el rol desde esta ruta", 400)
        );
    }

    const hasChanges = name !== undefined || email !== undefined || isActive !== undefined;

    if (!hasChanges) {
        return next(
            new AppError("Debes completar al menos 1 campo", 400)
        );
    }

    let cleanEmail: string | undefined;

    if (email !== undefined) {
        if (!isNonEmptyString(email)) {
            return next(
                new AppError("El email debe ser un texto no vacío", 400, {
                    received: email
                })
            );
        }

        cleanEmail = normalizeEmail(email);

        if (!isValidBasicEmail(cleanEmail)) {
            return next(
                new AppError("El email no tiene un formato válido", 400, {
                    received: cleanEmail
                })
            );
        }

        if (isEmailTaken(cleanEmail, idNorm)) {
            return next(
                new AppError("El ya está registrado", 400, {
                    received: cleanEmail
                })
            );
        }
    }

    let cleanName: string | undefined;

    if (name !== undefined) {
        if (!isNonEmptyString(name)) {
            return next(
                new AppError("El nombre debe ser un texto no vacío", 400, {
                    received: name
                })
            );
        }

        cleanName = name.trim();

        if (!isValidName(cleanName)) {
            return next(
                new AppError("El nombre debe tener 2 caracteres mínimo", 400, {
                    received: cleanName
                })
            );
        }
    }

    if (isActive !== undefined && !isBoolean(isActive)) {
        return next(
                new AppError("isActive debe ser true o false", 400, {
                    received: isActive
                })
            );
    }

    const currentUser = users[userIndex];

    const updatedUser: User = {
        ...currentUser,
        name: cleanName ?? currentUser.name,
        email: cleanEmail ?? currentUser.email,
        isActive: isActive ?? currentUser.isActive,
        updatedAt: new Date().toISOString()
    };

    users[userIndex] = updatedUser;

    res.status(200).json({
        "message": "Usuario actualizado correctamente",
        "data": updatedUser
    });
});

// Endpoint para eliminar/desactivar un usuario por su id
app.delete("/api/users/:id", (req, res, next) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        return next(
            new AppError("El ID debe ser numérico", 400, {
                id: req.params.id
            })
        );
    }

    const existingUser = users.findIndex((user) => user.id === id);
    
    if (existingUser === -1) {
        return next(
            new AppError("Usuario no encontrado", 404, {
                id
            })
        );
    }

    const currentUser = users[existingUser];

    if (currentUser.isActive === false) {
        return res.status(200).json({
            "message": "El usuario ya estaba desactivado",
            "data": currentUser
        });
    }

    const updatedUser : User = {
        ...currentUser,
        isActive: false,
        updatedAt: new Date().toISOString()
    };

    users[existingUser] = updatedUser;

    res.status(200).json({
        "message": "Usuario desactivado correctamente",
        "data": updatedUser
    });
});

// Endpoint para cambiar el rol a un usuario por su id
app.patch("/api/users/:id/role", (req, res) => {
    const {id} = req.params;
    const role = req.body;

    res.status(200).json({
        "message": "Rol de usuario recibido para actualizar",
        "id": id,
        "role": role
    });
});

// Endpoint para probar body
app.post("/api/debug/body", (req, res) => {
    res.status(201).json({
        "message": "Body recibido correctamente",
        "body": req.body
    });
});

// Endpoint para probar params
app.get("/api/debug/params/:id", (req, res) => {
    res.status(200).json({
        "message": "Params recibidos correctamente",
        "params": req.params
    });
});

// Endpoint para probar query params
app.get("/api/debug/query", (req, res) => {
    res.status(200).json({
        "message": "Query params recibidos correctamente",
        "query": req.query
    });
});

// Endpoint para probar headers
app.get("/api/debug/headers", (req, res) => {
    res.status(200).json({
        "message": "Headers recibidos correctamente",
        "headers": req.headers
    });
});

// Endpoint para probar datos combinados
app.patch("/api/debug/users/:id", (req, res) => {
    const {id} = req.params;
    const {notify} = req.query;
    const authorization = req.headers;
    const changes = req.body;

    res.status(200).json({
        "message": "Datos combinados recibidos correctamente",
        id,
        notify,
        authorization,
        changes
    });
});

// Endpoint para leer un header personalizado
app.get("/api/debug/client", (req, res) => {
    res.status(200).json({
        "client": req.headers["x-client-name"]
    });
});

// Endpoint para comprobar todos los parámetros de una petición
app.post("/api/debug/request", (req, res) => {
    res.status(200).json({
        "message": "Información completa de la petición",
        "method": req.method,
        "path": req.path,
        "params": req.params,
        "query": req.query,
        "headers": req.headers,
        "body": req.body
    });
});

app.get("/api/debug/error", (req, res, next) => {
    next(new AppError("Error de prueba interno", 500))
});

function notFoundMiddleware(req: Request, res: Response, next: NextFunction) {
    const errorMessage = "No existe la ruta " + req.method + " " + req.originalUrl;

    next(
        new AppError(errorMessage, 404, {
            method: req.method,
            path: req.originalUrl
        })
    );
}

function errorMiddleware(err: AppError, req: Request, res: Response, _next: NextFunction) {
    const statusCode = err.statusCode || 500;

    const response = {
        error: err.message || "Error interno del servidor",
        statusCode,
        path: req.originalUrl,
        method: req.method,
        timeStamp: new Date().toISOString()
    }

    if (err.details) {
        details: err.details
    }

    return res.status(statusCode).json(response);
}

app.use(notFoundMiddleware);
app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});