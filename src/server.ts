import express from "express";
import { timeStamp } from "node:console";

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
    isActive: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    name: "Carlos Pérez",
    email: "carlos@email.com",
    role: "ADMIN",
    isActive: false,
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
    isActive: false,
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
app.get("/api/users/active", (req, res) => {
    const activeUsers = users.filter((user) => user.isActive);

    if (activeUsers.length === 0) {
        res.status(404).json({
            "error": "No hay usuarios activos"
        });
    } else {
        res.status(200).json({
            "message": "Usuarios activos",
            "total": activeUsers.length,
            "activeUsers": activeUsers
        });
    }
})

// Endpoint que devuelve un usuario por su id
app.get("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).json({
            "message": "El ID debe ser un número",
            "received": req.params.id
        });
    }

    const user = users.find((user) => user.id === id);

    if (!user) {
        return res.status(404).json({
            "error": "Usuario no encontrado",
            id
        });
    }

    res.status(200).json({
        "message": "Usuario encontrado",
        "data": user
    });
});

// Endpoint para crear un usuario
app.post("/api/users", (req, res) => {
    const {name, email, password} = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            "error": "name, email y password son obligatorios"
        });
    }

    if (String(password).length < 6) {
        return res.status(400).json({
            "error": "la contraseña debe tener 6 caracteres mínimo"
        });
    }

    const cleanName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = users.find((user) => user.email === normalizedEmail);

    if (!normalizedEmail.includes("@")) {
        return res.status(400).json({
            "error": "El email no tiene un formato válido"
        });
    }

    if (existingUser) {
        return res.status(409).json({
            "error": "ya existe un usuario con ese email"
        });
    }

    const newId = users.length > 0 ? Math.max(...users.map((user) => user.id)) + 1 : 1;

    const newUser : User = {
        id: newId,
        name: cleanName,
        email: normalizedEmail,
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
app.patch("/api/users/:id/status", (req, res) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).json({
            "error": "El ID debe ser numérico"
        });
    }

    const existingUser = users.findIndex((user) => user.id === id);

    if (existingUser === -1) {
        return res.status(400).json({
            "error": "El usuario no existe",
            id
        });
    }

    const {isActive} = req.body;

    if (typeof isActive !== "boolean") {
        return res.status(400).json({
            "error": "isActive debe ser true o false"
        });
    }

    users[existingUser].isActive = isActive;

    res.status(200).json({
        "message": "Estado de usuario recibido para actualizar",
        "id": id,
        "isActive": isActive
    });
});

// Endpoint para actualizar los datos de un usuario por su id
app.patch("/api/users/:id", (req, res) => {
    const idParam = req.params.id;
    const idNorm = Number(idParam);

    if (Number.isNaN(idNorm)) {
        return res.status(400).json({
            "error": "El ID debe ser numérico"
        });
    }

    const userIndex = users.findIndex((user) => user.id === idNorm);

    if (userIndex === -1) {
        return res.status(404).json({
            "error": "Usuario no encontrado",
            idNorm
        });
    }

    const {id, name, email, isActive, role} = req.body;

    if (id) {
        return res.status(400).json({
            "error": "No se puede cambiar el ID"
        });
    }

    if (role) {
        return res.status(400).json({
            "error": "No se puede cambiar el rol desde esta ruta"
        });
    }

    const hasChanges = name !== undefined || email !== undefined || isActive !== undefined;

    if (!hasChanges) {
        res.status(400).json({
            "error": "Debes completar al menos 1 campo para actualizar"
        });
    }

    let cleanEmail: string | undefined;

    if (email !== undefined) {
        cleanEmail = String(email).trim().toLowerCase();

        if (!cleanEmail.includes("@")) {
            return res.status(400).json({
                "error": "El email no tiene un formato válido"
            });
        }

        const existingEmail = users.find((user) => user.email === cleanEmail && user.id !== idNorm);

        if (existingEmail) {
            return res.status(409).json({
                "error": "El email ya está registrado"
            });
        }
    }

    let cleanName: string | undefined;

    if (name !== undefined) {
        cleanName = String(name).trim();

        if (cleanName.length === 0) {
            return res.status(400).json({
                "error": "El nombre no puede estar vacío"
            });
        }
    }

    if (isActive !== undefined && typeof isActive !== "boolean") {
        return res.status(400).json({
            "error": "isActive debe ser true o false"
        });
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
app.delete("/api/users/:id", (req, res) => {
    const {id} = req.params;
    
    res.status(200).json({
        "message": "Usuario recibido para eliminar o desactivar",
        "id": id
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

app.post("/api/debug/request", (req, res) => {
    res.status(200).json({
        "message": "Información completa de la petición",
        "method": req.method,
        "path": req.path,
        "params": req.params,
        "query": req.query,
        "headers": req.headers,
        "body": req.body
    })
})

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});