// src/server.ts
import { Application, } from "../deps.ts";
import Routes from "./routes/routes.ts";
import { errorHandler } from "./middlewares/errorHandler.ts";
import { connectToMongoDB } from "./config/db.ts";
import { cors } from "./middlewares/cors.ts"; // Importar el middleware CORS
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";


const app = new Application();

// Usar el middleware
app.use(cors);
app.use(errorHandler);


app.use(oakCors({
  origin: "*", // Ajusta según los requisitos de tu entorno
  methods: ["GET", "POST", "OPTIONS"],
}));

  // Conectar a MongoDB y manejar posibles errores
try {
    // deno-lint-ignore no-unused-vars
    const db = await connectToMongoDB();
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
