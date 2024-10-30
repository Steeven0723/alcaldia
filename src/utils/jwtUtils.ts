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