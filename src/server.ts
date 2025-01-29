// src/server.ts
import { Application, } from "../deps.ts";
import Routes from "./routes/routes.ts";
import { errorHandler } from "./middlewares/errorHandler.ts";
import { connectToPostgres } from "./config/db.ts";
import { cors } from "./middlewares/cors.ts"; // Importar el middleware CORS

const app = new Application();

// Usar el middleware
app.use(cors);
app.use(errorHandler);

  // Conectar a MongoDB y manejar posibles errores
try {
    // deno-lint-ignore no-unused-vars
    const db = await connectToPostgres();
    // Si necesitas usar la base de datos, puedes pasarlo a las rutas
    // Routes.setDatabase(db); // Implementa esto en tu archivo de rutas si es necesario
  // deno-lint-ignore no-unused-vars
  } catch (error) {
    console.error("No se pudo conectar a MongoDB. El servidor no se iniciará.");
    Deno.exit(1); // Salir del proceso si no se puede conectar a la base de datos
  }

// Usar rutas
app.use(Routes.routes());
app.use(Routes.allowedMethods());

console.log(`Server running on http://localhost:8000`);
await app.listen({ port: 8000 });
