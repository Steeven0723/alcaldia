// utils/totpUtil.ts
import { encode } from "../../deps.ts";

export function generateTOTPSecret(): string {
    const randomBytes = crypto.getRandomValues(new Uint8Array(10));
    return encode(randomBytes).replace(/=/g, "");
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
    return (code % 1000000).toString().padStart(6, "0");
}

// Función para verificar un código TOTP
export async function verifyTOTP(secret: string, token: string): Promise<boolean> {
    for (let window = -1; window <= 1; window++) {
        if (token === await generateTOTP(secret, window)) {
            return true;
        }
    }
    return false;
}
