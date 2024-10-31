<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Iniciar Sesión - Mi Sitio</title>
    <link rel="stylesheet" href="./css/styles.css">
</head>
<body>
    <header>
        <h1>Iniciar Sesión</h1>
        <nav>
            <ul>
                <li><a href="/">Inicio</a></li>
                <li><a href="/login.html">Iniciar Sesión</a></li>
                <li><a href="/register.html">Registrarse</a></li>
            </ul>
        </nav>
    </header>
    <main>
        <form id="login-form">
            <label for="email">Correo electrónico:</label>
            <input type="email" id="email" name="email" required>
            
            <label for="password">Contraseña:</label>
            <input type="password" id="password" name="password" required>
            
            <label for="totpCode">Código :</label>
            <input type="text" id="totpCode" name="totpCode" required minlength="6" maxlength="6">
            
            <button type="submit">Iniciar Sesión</button>
        </form>
    </main>

    <script src="./js/login.js"></script> <!-- Archivo JS externo -->

</body>
</html>


  <!DOCTYPE html>
  <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Dashboard</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          background-color: #f0f0f0;
        }
        .container {
          background-color: white;
          padding: 20px;
          border-radius: 5px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Bienvenido al Dashboard</h1>
        <p>Has iniciado sesión correctamente.</p>
        <a href="/" id="logout">Cerrar sesión</a>
      </div>
  
      <script src="./js/dashboard.js"></script> <!-- Archivo JS externo -->

    </body>
  </html>


// deno-lint-ignore-file no-window
// js/login.js
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Imprimir el token antes de iniciar sesión
  const existingToken = localStorage.getItem("token");
  console.log("Token antes de iniciar sesión:", existingToken);

  const formData = new FormData(e.target);

  const response = await fetch("/login", {
    method: "POST",
    body: JSON.stringify(Object.fromEntries(formData)),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  alert(data.message);
  if (response.ok) {
    console.log("Token después de iniciar sesión:", data.token);
    localStorage.setItem('token', data.token); // Suponiendo que 'response.data.token' tiene el token
    window.location.href = "/dashboard.html";
  } else {
    alert(data.message); // Muestra el mensaje de error
  }
});



// js/dashboard.js
// deno-lint-ignore-file no-window
// Obtén el token del localStorage
const token = localStorage.getItem("token");

// Imprimir el token antes de la verificación
console.log("Token en el dashboard:", token);

if (!token) {
    // Si no hay token, redirige al login
    window.location.href = "/login.html";
} else {
    fetch("http://localhost:8000/dashboard.html", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('No autorizado');
        }
        return response.text();
    })
    .then(data => {
        document.querySelector(".container").innerHTML += `<p>${data}</p>`;
    })
    .catch(error => {
        console.error("Error:", error);
        localStorage.removeItem("token"); // Borra el token si hay un error
        window.location.href = "/login.html";
    });
}

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

// middlewares/authMiddleware.ts
import { verifyJWT, _JWT_SECRET } from "../utils/jwtUtils.ts";

// Middleware para verificar el token JWT
export async function authMiddleware(ctx: any, next: any) {
    const authorizationHeader = ctx.request.headers.get("Authorization");

    if (!authorizationHeader) {
        ctx.response.status = 401;
        ctx.response.body = { message: "No autorizado. Inicia sesión para acceder." };
        return;
    }
    
    const token = authorizationHeader.replace("Bearer ", "");
    try {
        const payload = await verifyJWT(token, _JWT_SECRET, "HS256");
        ctx.state.user = payload;
        await next();
    } catch (error) {
        console.error("Error al verificar el token:", error);
        ctx.response.status = 401;
        ctx.response.body = { message: "Token inválido o expirado. Inicia sesión nuevamente." };
    }
    
  }
  
// middlewares/cors.ts
import { Context, Next } from "../../deps.ts";

export const cors = async (ctx: Context, next: Next) => {
    ctx.response.headers.set("Access-Control-Allow-Origin", "*"); // Permitir solicitudes de cualquier origen
    ctx.response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS"); // Métodos permitidos
    ctx.response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Encabezados permitidos

    // Si la solicitud es de tipo OPTIONS, responder con No Content (204)
    if (ctx.request.method === "OPTIONS") {
        ctx.response.status = 204; // No Content
        return;
    }

    await next(); // Pasar al siguiente middleware o ruta
};

// middlewares/errorHandler.ts
import { Context, Next } from "../../deps.ts";

export const errorHandler = async (ctx: Context, next: Next) => {
  try {
    await next();
  // deno-lint-ignore no-explicit-any
  } catch (error: any) {
    console.error("Error:", error);
    ctx.response.status = error.status || 500;
    ctx.response.body = {
      success: false,
      message: error.message || "Error interno del servidor",
    };
  }
};

// routes/routes.ts
import { Router, verify } from "../../deps.ts";
import userRouter from "./userRoutes.ts"; // Importa las rutas de usuario
import { authMiddleware } from "../middlewares/authMiddleware.ts"; // Middleware de autenticación

const router = new Router();

router.use(userRouter.routes());
router.use(userRouter.allowedMethods());

// Ruta para la página de inicio
router.get("/", async (ctx) => {
  try {
    await ctx.send({
      root: `${Deno.cwd()}/public`,
      index: "index.html",
    });
  } catch (error) {
    console.error("Error al enviar el archivo:", error);
    ctx.response.status = 404;
    ctx.response.body = { message: "Archivo no encontrado" };
  }
});

// Ruta para el registro (register.html)
router.get("/register.html", async (ctx) => {
  try {
    await ctx.send({
      root: `${Deno.cwd()}/public`,
      index: "register.html",
    });
  } catch (error) {
    console.error("Error al enviar el archivo:", error);
    ctx.response.status = 404;
    ctx.response.body = { message: "Archivo no encontrado" };
  }
});

// Ruta para el login (login.html)
router.get("/login.html", async (ctx) => {
  try {
    await ctx.send({
      root: `${Deno.cwd()}/public`,
      index: "login.html",
    });
  } catch (error) {
    console.error("Error al enviar el archivo:", error);
    ctx.response.status = 404;
    ctx.response.body = { message: "Archivo no encontrado" };
  }
});


// Rutas para el dashboard
router.get("/dashboard.html", authMiddleware, async (ctx) => {
  try {
    await ctx.send({
      root: `${Deno.cwd()}/public`,
      index: "dashboard.html",
    });
  } catch (error) {
    console.error("Error al enviar el archivo:", error);
    ctx.response.status = 404;
    ctx.response.body = { message: "Archivo no encontrado" };
  }
});


// Rutas para CSS y JS
router.get("/css/:file", async (ctx) => {
  const file = ctx.params.file;
  try {
    await ctx.send({
      root: `${Deno.cwd()}/public/`,
      index: file,
    });
  } catch (error) {
    console.error("Error al enviar el archivo CSS:", error);
    ctx.response.status = 404;
    ctx.response.body = { message: "Archivo CSS no encontrado" };
  }
});

router.get("/js/:file", async (ctx) => {
  const file = ctx.params.file;
  try {
    await ctx.send({
      root: `${Deno.cwd()}/public/`,
      index: file,
    });
  } catch (error) {
    console.error("Error al enviar el archivo JS:", error);
    ctx.response.status = 404;
    ctx.response.body = { message: "Archivo JS no encontrado" };
  }
});

// Puedes agregar más rutas aquí

export default router;

// routes/userRoutes.ts
import { Router } from "../../deps.ts";
import { registerUser, loginUser,  } from "../controllers/userController.ts";
import { authMiddleware } from "../middlewares/authMiddleware.ts"; // Middleware de autenticación


const router = new Router();
router.post("/register", registerUser);
router.post("/login", loginUser);

// Ruta protegida del dashboard
router.get("/dashboard.html", authMiddleware, (ctx) => {
    ctx.response.status = 200;
    ctx.response.body = "Bienvenido al Dashboard"; // O el contenido JSON del dashboard
});

export default router;

// utils/jwtUtils.ts
import { create,  verify } from "../../deps.ts";

export const _JWT_SECRET = "8f2bbf88c5af2494e71d8990b394e2f8cd9f8c58fca4e7569c37376870a12a1cy";

export async function createJWT(payload: object): Promise<string> {
  const secretKey = await importJwtSecret(_JWT_SECRET);
  return await create({ alg: "HS512", typ: "JWT" }, payload, secretKey);
}

export async function verifyJWT(token: string): Promise<object | null> {
  try {
    const secretKey = await importJwtSecret(_JWT_SECRET);
    return await verify(token, secretKey, "HS512");
  } catch {
    return null;
  }
}

// Importar clave JWT en formato CryptoKey
export async function importJwtSecret(secret: string) {
  return await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign", "verify"],
  );
}
// utils/totpUtil.ts
import { encode } from "../../deps.ts";


export function generateTOTPSecret(): string {
    const randomBytes = crypto.getRandomValues(new Uint8Array(10));
    return encode(randomBytes).replace(/[^A-Z2-7]/g, "");
}

// Función para convertir base32 a ArrayBuffer
export function base32ToBuffer(base32: string): ArrayBuffer {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    let bits = 0;
    let value = 0;
    let index = 0;
    const output = new Uint8Array(Math.ceil(base32.length * 5 / 8));

    for (let i = 0; i < base32.length; i++) {
        value = (value << 5) | alphabet.indexOf(base32[i].toUpperCase());
        bits += 5;
        if (bits >= 8) {
            output[index++] = (value >>> (bits - 8)) & 255;
            bits -= 8;
        }
    }

    return output.buffer;
}

// Función para generar un código TOTP
export async function generateTOTP(secret: string, window = 0): Promise<string> {
    const step = 30;
    const t = Math.floor(Date.now() / 1000 / step) + window;
    const msg = new Uint8Array(8);
    new DataView(msg.buffer).setBigUint64(0, BigInt(t));

    const key = await crypto.subtle.importKey(
        "raw",
        base32ToBuffer(secret),
        { name: "HMAC", hash: "SHA-1" },
        false,
        ["sign"],
    );

    const hmac = await crypto.subtle.sign("HMAC", key, msg);
    const hmacResult = new Uint8Array(hmac);
    const offset = hmacResult[19] & 0xf;
    const code = ((hmacResult[offset] & 0x7f) << 24) |
        ((hmacResult[offset + 1] & 0xff) << 16) |
        ((hmacResult[offset + 2] & 0xff) << 8) |
        (hmacResult[offset + 3] & 0xff);
    return (code % 10 ** 6).toString().padStart(6, "0");
}

export async function verifyTOTP(secret: string, totpCode: string): Promise<boolean> {
    const generatedTOTP = await generateTOTP(secret);
    return generatedTOTP === totpCode; // Comparación exacta
}

// src/server.ts
import { Application, } from "../deps.ts";
import Routes from "./routes/routes.ts";
import { errorHandler } from "./middlewares/errorHandler.ts";
import { connectToMongoDB } from "./config/db.ts";
import { cors } from "./middlewares/cors.ts"; // Importar el middleware CORS

const app = new Application();

// Usar el middleware
app.use(cors);
app.use(errorHandler);

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