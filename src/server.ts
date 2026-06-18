import express from "express";
import { timeStamp } from "node:console";

const app = express();
const PORT = 3000;

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
        "data": []
    });
});

// Endpoint que devuelve un usuario por su id
app.get("/api/users/:id", (req, res) => {
    const {id} = req.params;

    res.status(200).json({
        "message": "Detalle del usuario",
        "id": id
    });
});

// Endpoint para crear un usuario
app.post("/api/users", (req, res) => {
    const userData = req.body;

    res.status(201).json({
        "message": "Usuario recibido para crear",
        "data": userData
    });
});

// Endpoint para actualizar los datos de un usuario por su id
app.patch("/api/users/:id", (req, res) => {
    const {id} = req.params;
    const dataChanges = req.body;

    res.status(200).json({
        "message:": "Usuario recibido para modificar",
        "id": id,
        "changes": dataChanges
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

// Endpoint para activar/desactivar un usuario por su id
app.patch("/api/users/:id/status", (req, res) => {
    const {id} = req.params;
    const isActive = req.body;

    res.status(200).json({
        "message": "Estado de usuario recibido para actualizar",
        "id": id,
        "isActive": isActive
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

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});