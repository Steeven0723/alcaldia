// config/db.ts
import { Pool } from "../../deps.ts";
import "https://deno.land/x/dotenv@v3.2.2/load.ts"; // Carga las variables de entorno

// Configuración del pool
const postgresURI = Deno.env.get("DATABASE_URL") ;

// Define el número máximo de conexiones en el pool
const POOL_CONNECTIONS = 10; 

const pool = new Pool(postgresURI, POOL_CONNECTIONS, true);

export const connectToPostgres = async () => {
  try {
    const client = await pool.connect(); // Obtiene un cliente del pool
    console.log("Conexión exitosa a PostgreSQL");
    return client;
  } catch (err) {
    console.error("Error al conectar a PostgreSQL:", err);
    throw err;
  }
};
