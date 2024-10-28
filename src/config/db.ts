//config/db.ts
import { MongoClient } from "../../deps.ts"; // Ajusta la ruta según la estructura de tu proyecto

export const connectToMongoDB = async () => {
  const client = new MongoClient();
  try {
    await client.connect("mongodb://127.0.0.1:27017"); // Asegúrate de que esta URL es correcta
    console.log("Conexión exitosa a MongoDB local");
    return client.database("dbAlcaldia"); // Devuelve la base de datos que deseas utilizar
  } catch (err) {
    console.error("Error al conectar a MongoDB local:", err); // Manejo de errores
    throw err;
  }
};