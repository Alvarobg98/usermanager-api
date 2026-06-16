# Día 2: Preparación del proyecto

## Qué he hecho

- He inicializado el proyecto Node.js.
- He instalado Express.
- He configurado TypeScript.
- He creado la carpeta src.
- He creado el archivo src/server.ts.
- He arrancado el servidor en local.
- He probado la respuesta desde navegador o Thunder Client.

## Comando para arrancar el proyecto

```bash
npm run dev
```

## URL de prueba

```text
http://localhost:3000
```

## Respuesta obtenida

```json
{
  "message": "UserManager API"
}
```

## Explicación personal
El archivo `src/server.ts` es el punto de partida de esta API, donde se crea la aplicación Express y se configuran las distintas rutas de acceso.

`app.listen` levanta el servidor en el puerto especificado (3000 en este caso) y ejecuta una función cuando este está en funcionamiento.

`app.get` define una ruta para obtener peticiones HTTP de tipo GET.

`express.json` es una función que recoje los cuerpos de las peticiones HTTP en formato JSON y permite utilizarlos dentro de la propia API.

## Error investigado

He comprobado qué ocurre al escribir mal una ruta.

Error:

```text
Intentar acceder a la ruta http://localhost:3000/api/informacion
```

Resultado esperado:

```text
Cannot GET /api/informacion
````

Este error está indicando que la ruta especificada no existe, por tanto, hay que asegurarse de que la ruta esté corréctamente creada dentro de `server.ts` y/o estemos especificando el nombre correcto de la ruta para acceder a ella.