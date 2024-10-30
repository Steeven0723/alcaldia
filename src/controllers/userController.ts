// //controllers/userController.ts
import { bcrypt, Context, getNumericDate } from "../../deps.ts";
import { User } from "../models/userModel.ts";
import { connectToMongoDB } from "../config/db.ts";
import { _JWT_SECRET } from "../utils/jwtUtils.ts";
import { generateTOTPSecret } from "../utils/totpUtil.ts";
import { createJWT } from "../utils/jwtUtils.ts";
import { verifyTOTP } from "../utils/totpUtil.ts";



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
            otpAuthUrl:
                `otpauth://totp/Alcaldia:${newUser.email}?secret=${totpSecret}&issuer=Alcaldia`,
        };
    } catch (error) {
        console.error("Error al registrar el usuario:", error);
        ctx.response.status = 500;
        ctx.response.body = { message: "Error al registrar el usuario" };
    }
};

export const loginUser = async (ctx: Context) => {
    try {
        const db = await connectToMongoDB();
        const usersCollection = db.collection<User>("users");

        // Extrae los datos de la solicitud
        const { email, password, totpCode } = await ctx.request.body().value;

        // Verifica si el usuario existe
        const user = await usersCollection.findOne({ email });
        if (!user) {
            ctx.response.status = 401;
            ctx.response.body = { message: "Usuario no encontrado" };
            return;
        }

        // Verifica la contraseña
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

        // Genera el token JWT
        const token = await createJWT({
            id: user._id.toString(),
            email: user.email,
            exp: getNumericDate(60 * 60),
        });

        // Envía el token y el mensaje de éxito
        ctx.response.status = 200;
        ctx.response.body = { message: "Inicio de sesión exitoso", token };

        // Opcional: Configura el encabezado de autorización (si usas uno)
        ctx.response.headers.set("Authorization", `Bearer ${token}`);

    } catch (error) {
        console.error("Error en loginUser:", error);
        ctx.response.status = 500;
        ctx.response.body = { message: "Error interno del servidor" };
    }
};

