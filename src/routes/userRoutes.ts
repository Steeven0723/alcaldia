

// // Middleware para validación de entrada
// const validateInput = (schema: any) => {
//     return async (ctx: Context, next: () => Promise<unknown>) => {
//         const body = await ctx.request.body().value;
//         const [passes, errors] = await validate(body, schema);
  
//       if (!passes) {
//         ctx.response.status = 400;
//         ctx.response.body = { success: false, message: "Datos de entrada inválidos", errors };
//         return;
//       }
  
//       await next();
//     };
//   };





// // Crear una ruta para el registro de usuario
// router.post('/register', validateInput(registerSchema), async (ctx) => {
//     const { name, email, password } = await body().value; // Desestructurar los datos

//     // Conectar a la base de datos
//     const db = await connectToMongoDB(); 
//     const usersCollection = db.collection('users'); // Asegúrate de tener una colección 'users'

//     // Validar si el usuario ya existe
//     const existingUser = await usersCollection.findOne({ email });
//     if (existingUser) {
//         ctx.response.status = 400;
//         ctx.response.body = { message: "El correo electrónico ya está en uso." };
//         return;
//     };

//     // Hashear la contraseña antes de guardarla
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt)

//     // Crear un nuevo usuario
//     const newUser = {
//         name,
//         email,
//         password: hashedPassword, // Almacena la contraseña hasheada
//     };

//     await usersCollection.insertOne(newUser); // Guardar el nuevo usuario en la colección
//     ctx.response.status = 201; // Estado de creación exitosa
//     ctx.response.body = { message: "Usuario registrado exitosamente." };
// });

// export default router;

// routes/userRoutes.ts
import { Router } from "../../deps.ts";
import { registerUser, loginUser,  } from "../controllers/userController.ts";

const router = new Router();
router.post("/register", registerUser);
router.post("/login", loginUser);


export default router;
