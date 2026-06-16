import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        "name": "UserManager API",
        "version": "1.0.0",
        "status": "running",
        "author": "Alvaro Barranco"
    });
});

app.get("/api/info", (req, res) => {
    res.json({
        "project": "UserManager API",
        "description": "API REST para gestionar usuarios",
        "day": 2,
        "technologies": ["Node.js", "Express", "TypeScript"]
    })
})

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});