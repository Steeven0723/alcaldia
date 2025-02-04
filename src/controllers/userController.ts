// //controllers/userController.ts
import { bcrypt, Context } from "../../deps.ts";
import { Usuarios } from "../models/userModel.ts";
import { connectToPostgres } from "../config/db.ts";
import { _JWT_SECRET } from "../utils/jwtUtils.ts";
import { generateTOTPSecret } from "../utils/totpUtil.ts";

export const registerUser = async (ctx: Context) => {
  const db = await connectToPostgres();

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
    const existingUser = await db.queryObject<Usuarios>(
      `SELECT * FROM usuarios WHERE email = $1`,
      [userData.email]
    );

    if (existingUser.rows.length > 0) {
      ctx.response.status = 400;
      ctx.response.body = {
        message: "El correo electrónico ya está en uso.",
      };
      return;
    }

    // Verificar si el correo ya está en uso
    const existingCC = await db.queryObject<Usuarios>(
      `SELECT * FROM usuarios WHERE cedula = $1`,
      [userData.cedula]
    );

    if (existingCC.rows.length > 0) {
      ctx.response.status = 400;
      ctx.response.body = {
        message: "La cedula ya está en uso.",
      };
      return;
    }

    // Cifrar la contraseña antes de guardarla
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    const totpSecret = generateTOTPSecret();

    try {
    // Insertar el nuevo usuario en la base de datos
    const query = `
      INSERT INTO usuarios (nombre, email, password, totp_secret, cedula, telefono, id_dependencia, role)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;

    const newUserResult = await db.queryObject<Usuarios>(query, [
      userData.name,
      userData.email,
      hashedPassword,
      totpSecret,
      userData.cedula,
      userData.telefono,
      userData.id_dependencia,
      userData.role,
    ]);

    const newUser = newUserResult.rows[0];

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
  } finally {
    db.release();
  }
};


export const listUsers = async (ctx: Context) => {
  const db = await connectToPostgres();

  try {
    // Consultar todos los usuarios en la base de datos
    // const query = `
    //   SELECT id_usuario, nombre, email, cedula, telefono, id_dependencia, role, estado, created_at
    //   FROM usuarios
    //   ORDER BY created_at ASC;
    // `;

    const query = `
  SELECT 
    u.id_usuario,
    u.nombre,
    u.email,
    u.cedula,
    u.telefono,
    u.id_dependencia,
    d.nombre_dependencia,
    u.role,
    u.estado,
    u.totp_secret,
    u.created_at
  FROM usuarios u
  LEFT JOIN dependencias d ON u.id_dependencia = d.id_dependencia -- Unir con la tabla de dependencias
  ORDER BY u.id_usuario DESC;
`;
    // const result = await db.queryObject<Usuarios>(
    //   `SELECT * FROM usuarios ORDER BY id_usuario ASC` // Ordenar por ID ascendente
    // );

    const result = await db.queryObject<Usuarios>(query);
    const users = result.rows;

    ctx.response.status = 200; // Código de éxito
    ctx.response.body = {
      success: true,
      data: users,
    };
  } catch (error) {
    console.error("Error al listar usuarios:", error);
    ctx.response.status = 500; // Error interno del servidor
    ctx.response.body = {
      success: false,
      message: "Error al listar usuarios",
    };
  } finally {
    db.release();
  }
};

export const getUser = async (ctx: Context) => {
  const db = await connectToPostgres();
  const userId = ctx.params.id; // Get the ID from the URL parameter
  

  try {
    const result = await db.queryObject<Usuarios>(
      `SELECT * FROM usuarios WHERE id_usuario = $1`,
      [userId]
    );

    if (result.rows.length > 0) {
      ctx.response.body = { success: true, data: result.rows[0] };
    } else {
      ctx.response.status = 404;
      ctx.response.body = { success: false, message: "Usuario no encontrado" };
    }
  } catch (error) {
    console.error("Error al recuperar el usuario:", error);
    ctx.response.status = 500;
    ctx.response.body = { success: false, message: "Error al recuperar el usuario" };
  } finally {
    db.release();
  }
};

export const updateUser = async (ctx: Context) => {
  const db = await connectToPostgres();
  const userId = ctx.params.id; // Obtener el ID del usuario a actualizar
  const { value } = await ctx.request.body();
  const userData = await value;

  // Validación de datos
  if (!userData.cedula) {
    ctx.response.status = 400;
    ctx.response.body = { success: false, message: 'Faltan datos requeridos.' };
    return;
  }

  try {
    const query = `
      UPDATE usuarios SET
        nombre = $1,
        email = $2,
        cedula = $3,
        telefono = $4,
        id_dependencia = $5,
        role = $6,
        estado = $7
      WHERE id_usuario = $8
      RETURNING *
    `;
    const result = await db.queryObject<Usuarios>(query, [
      userData.nombre,
      userData.email,
      userData.cedula,
      userData.telefono,
      userData.id_dependencia,
      userData.role,
      userData.estado,
      userId
    ]);

    if (result.rows.length > 0) {
      ctx.response.body = { success: true, data: result.rows[0] };
    } else {
      ctx.response.status = 404;
      ctx.response.body = { 
        success: false, 
        message: 'Usuario no encontrado' };
    }
  } catch (error) {
    console.error('Error al actualizar Faltan :', error);
    ctx.response.status = 500;
    ctx.response.body = { success: false, message: 'Error revisar los campos' };
  } finally {
    db.release();
  }
};

export const updatepass = async (ctx: Context) => {
  const db = await connectToPostgres();
  const { value } = await ctx.request.body();
  const { email, newPassword } = await value;

  if (!email || !newPassword) {
    ctx.response.status = 400;
    ctx.response.body = { success: false, message: 'Correo y nueva contraseña son requeridos' };
    return;
  }

  try {
    // Verificar si el usuario existe
    const checkUserQuery = `SELECT id_usuario FROM usuarios WHERE email = $1`;
    const userResult = await db.queryObject<{ id_usuario: number }>(checkUserQuery, [email]);

    if (userResult.rows.length === 0) {
      ctx.response.status = 404;
      ctx.response.body = { success: false, message: 'Usuario no encontrado' };
      return;
    }

    const userId = userResult.rows[0].id_usuario;

    const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(userData.password, salt);

    // Hashear la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword,salt);

    // Actualizar la contraseña en la base de datos
    const updateQuery = `
      UPDATE usuarios SET password = $1 WHERE id_usuario = $2 RETURNING email;
    `;

    const result = await db.queryObject(updateQuery, [hashedPassword, userId]);

    if (result.rows.length > 0) {
      ctx.response.body = { success: true, message: 'Contraseña actualizada correctamente' };
    } else {
      ctx.response.status = 500;
      ctx.response.body = { success: false, message: 'No se pudo actualizar la contraseña' };
    }
  } catch (error) {
    console.error('Error al actualizar contraseña:', error);
    ctx.response.status = 500;
    ctx.response.body = { success: false, message: 'Error al actualizar contraseña' };
  } finally {
    db.release();
  }
};

// Función para registrar la inactivos
export async function registerInactivos(ctx: Context) {
  const { id_usuario } = await ctx.request.body().value;
  const db = await connectToPostgres();


  try {
    const query = `
      INSERT INTO inactivos (id_usuario)
      VALUES ($1)
      RETURNING *;
    `;

    const result = await db.queryObject(query, [id_usuario]);
    
      ctx.response.status = 200;
      ctx.response.body = {
        success: true,
        message: "Inactivacion registrada correctamente",
        data: result.rows[0],
      };
  } catch (error) {
    console.error("Error al registrar la inactivacion:", error);
    ctx.response.status = 500;
    ctx.response.body = {
      success: false,
      message: "Error al registrar la inactivacion: " + error,
    };
  } finally {
    db.release();
  }
}
