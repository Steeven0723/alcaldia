//config/db.ts
// import { MongoClient } from "../../deps.ts"; // Ajusta la ruta según la estructura de tu proyecto

// export const connectToMongoDB = async () => {
//   const client = new MongoClient();
//   try {
//     await client.connect("mongodb://admin:1234@127.0.0.1:27017/?authSource=admin"); // Asegúrate de que esta URL es correcta
//     console.log("Conexión exitosa a MongoDB local");
//     return client.database("dbAlcaldia"); // Devuelve la base de datos que deseas utilizar
//   } catch (err) {
//     console.error("Error al conectar a MongoDB local:", err); // Manejo de errores
//     throw err;
//   }
// };

// config/db.ts
import { MongoClient } from "../../deps.ts";
// import "https://deno.land/x/dotenv@v3.2.2/load.ts"; // Carga las variables de entorno

export const connectToMongoDB = async () => {
  const mongoURI = Deno.env.get("MONGO_URI") || "mongodb://127.0.0.1:27017/dbAlcaldia";
  const client = new MongoClient();

  try {
    await client.connect(mongoURI);
    console.log("Conexión exitosa a MongoDB");
    return client.database("dbAlcaldia");
  } catch (err) {
    console.error("Error al conectar a MongoDB:", err);
    throw err;
  }
};
