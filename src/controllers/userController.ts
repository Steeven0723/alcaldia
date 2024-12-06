// //controllers/userController.ts
import { bcrypt, Context, getNumericDate, ObjectId } from "../../deps.ts";
import { User } from "../models/userModel.ts";
import { connectToMongoDB } from "../config/db.ts";
import { _JWT_SECRET } from "../utils/jwtUtils.ts";
import { generateTOTPSecret } from "../utils/totpUtil.ts";
import { createJWT } from "../utils/jwtUtils.ts";
import { verifyTOTP } from "../utils/totpUtil.ts";

import { RegistroLogin } from "../models/registroLoginModel.ts";
import { Trazabilidad } from "../models/trazabilidadModel.ts";

export const registerUser = async (ctx: Context) => {
  const db = await connectToMongoDB();
  const usersCollection = db.collection<User>("users");

  // Obtener los datos del cuerpo de la solicitud
  const { value } = await ctx.request.body(); // 'value' contiene el cuerpo de la solicitud en formato JSON
  const userData = await value;

  console.log(userData);

  // Validar que las contraseñas coinciden
  if (userData.password !== userData["confirm-password"]) {
    ctx.response.status = 400;
    ctx.response.body = { message: "Las contraseñas no coinciden." };
    return;
  }

  // Verificar si el correo ya está en uso
  const existingUser = await usersCollection.findOne({
    email: userData.email,
  });
  if (existingUser) {
    ctx.response.status = 400;
    ctx.response.body = {
      message: "El correo electrónico ya está en uso.",
    };
    return;
  }

  // Cifrar la contraseña antes de guardarla
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password, salt);
  const totpSecret = generateTOTPSecret();

  const newUser: User = {
    name: userData.name,
    email: userData.email,
    password: hashedPassword,
    totp_secret: totpSecret,
    role: userData.role,
  };

  try {
    // Insertar el nuevo usuario en la base de datos
    await usersCollection.insertOne(newUser);
    console.log("Usuario registrado:", newUser);

    ctx.response.status = 201; // Código de estado para "creado"
    ctx.response.body = {
      success: true,
      message: "Usuario registrado con éxito",
      totpSecret,
      otpAuthUrl: `otpauth://totp/Alcaldia:${newUser.email}?secret=${totpSecret}&issuer=Alcaldia`,
    };
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    ctx.response.status = 500;
    ctx.response.body = { message: "Error al registrar el usuario" };
  }
};

// export const loginUser = async (ctx: Context) => {
//     try {
//         const db = await connectToMongoDB();
//         const usersCollection = db.collection<User>("users");

//         const { email, password, totpCode } = await ctx.request.body().value;

//         const user = await usersCollection.findOne({ email });
//         if (!user) {
//             ctx.response.status = 401;
//             ctx.response.body = { message: "Usuario no encontrado" };
//             return;
//         }

//         const passwordMatch = await bcrypt.compare(password, user.password);
//         if (!passwordMatch) {
//             ctx.response.status = 401;
//             ctx.response.body = { message: "Contraseña incorrecta" };
//             return;
//         }

//         if (!(await verifyTOTP(user.totp_secret, totpCode))) {
//             ctx.response.status = 401;
//             ctx.response.body = { message: "Código TOTP inválido" };
//             return;
//         }

//         const token = await createJWT({
//             id: user._id.toString(),
//             email: user.email,
//             role: user.role, // Asegúrate de que `user.role` esté definido
//             exp: getNumericDate(60 * 60),
//         });

//         ctx.response.status = 200;
//         ctx.response.body = {
//             message: "Inicio de sesión exitoso",
//             token,
//             role: user.role // Asegúrate de incluir el rol aquí
//         };

//         ctx.response.headers.set("Authorization", `Bearer ${token}`);

//     } catch (error) {
//         console.error("Error en loginUser:", error);
//         ctx.response.status = 500;
//         ctx.response.body = { message: "Error interno del servidor" };
//     }
// };

export const loginUser = async (ctx: Context) => {
  try {
    const db = await connectToMongoDB();
    const usersCollection = db.collection<User>("users");
    const registroLoginCollection = db.collection<RegistroLogin>("registro_login");
    const trazabilidadCollection = db.collection<Trazabilidad>("trazabilidad");

    const { email, password, totpCode } = await ctx.request.body().value;
    const user = await usersCollection.findOne({ email });
    if (!user) {
      ctx.response.status = 401;
      ctx.response.body = { message: "Usuario no encontrado" };
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      ctx.response.status = 401;
      ctx.response.body = { message: "Contraseña incorrecta" };
      return;
    }

    if (!(await verifyTOTP(user.totp_secret, totpCode))) {
      ctx.response.status = 401;
      ctx.response.body = { message: "Código TOTP inválido" };
      return;
    }

    const token = await createJWT({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      exp: getNumericDate(60 * 60),
    });

    // Registrar inicio de sesión
    const fecha = new Date().toISOString().split("T")[0];
    const hora = new Date().toLocaleTimeString("es-ES");
    const newRegistro: RegistroLogin = {
      id_user: user._id.toString(),
      fecha,
      hora,
      text_trazabilidad: null,
    };
    const registro = await registroLoginCollection.insertOne(newRegistro);

    // Registrar trazabilidad inicial
    const newTrazabilidad: Trazabilidad = {
      id_registro: registro.toString(),
      text: "Inicio de sesión, /official/dashboard.html",
      status: true,
    };

    await trazabilidadCollection.insertOne(newTrazabilidad);

    ctx.response.status = 200;
    ctx.response.body = {
      message: "Inicio de sesión exitoso",
      token,
      role: user.role,
      id_registro: registro.toString(),
    };

    ctx.response.headers.set("Authorization", `Bearer ${token}`);
  } catch (error) {
    console.error("Error en loginUser:", error);
    ctx.response.status = 500;
    ctx.response.body = { message: "Error interno del servidor" };
  }
};

export const logoutUser = async (ctx: Context) => {
  const db = await connectToMongoDB();
  const trazabilidadCollection = db.collection<Trazabilidad>("trazabilidad");
  const registroLoginCollection = db.collection<RegistroLogin>("registro_login");

  try {
    const { id_registro } = await ctx.request.body().value;
    console.log("ID de registro recibido:", id_registro);

    if (!id_registro) {
      throw new Error("ID de registro no proporcionado");
    }

    const trazabilidad = await trazabilidadCollection.findOne({
      id_registro,
      status: true,
    });

    console.log("Trazabilidad encontrada:", trazabilidad);

    if (trazabilidad) {
      // Guardar el texto de trazabilidad en registro_login
      const updateResult = await registroLoginCollection.updateOne(
        { _id: new ObjectId(id_registro) },
        { $set: { text_trazabilidad: trazabilidad.text } }
      );

      console.log("Resultado de la actualización de registro_login:", updateResult);

      if (updateResult.modifiedCount === 0) {
        console.warn("No se actualizó ningún documento en registro_login");
      }

      // Actualizar trazabilidad
      const trazabilidadUpdateResult = await trazabilidadCollection.updateOne(
        { _id: trazabilidad._id },
        { $set: { text: "null", status: false } }
      );

      console.log("Resultado de la actualización de trazabilidad:", trazabilidadUpdateResult);
    } else {
      console.warn("No se encontró un registro de trazabilidad activo");
    }

    ctx.response.status = 200;
    ctx.response.body = { message: "Cierre de sesión exitoso" };
  } catch (error) {
    console.error("Error en logoutUser:", error);
    ctx.response.status = 500;
    ctx.response.body = { message: "Error interno del servidor", error: error.message };
  }
};
export const updateTrazabilidad = async (ctx: Context) => {
  const db = await connectToMongoDB();
  const trazabilidadCollection = db.collection<Trazabilidad>("trazabilidad");

  try {
    const { id_registro, pagina } = await ctx.request.body().value;

    const trazabilidad = await trazabilidadCollection.findOne({ id_registro });
    if (trazabilidad) {
      const newText = `${trazabilidad.text}, ${pagina}`;
      await trazabilidadCollection.updateOne(
        { id_registro },
        { $set: { text: newText } }
      );

      ctx.response.status = 200;
      ctx.response.body = { message: "Trazabilidad actualizada" };
    } else {
      ctx.response.status = 404;
      ctx.response.body = { message: "Registro de trazabilidad no encontrado" };
    }
  } catch (error) {
    console.error("Error en updateTrazabilidad:", error);
    ctx.response.status = 500;
    ctx.response.body = { message: "Error interno del servidor" };
  }
};