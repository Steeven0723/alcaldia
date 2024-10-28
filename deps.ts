// deps.ts
export { Application, Router, Context } from "https://deno.land/x/oak@v12.1.0/mod.ts";
export type { Next } from "https://deno.land/x/oak@v17.1.0/mod.ts";
export * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
export { MongoClient, ObjectId } from "https://deno.land/x/mongo@v0.33.0/mod.ts"; // Para interactuar con MongoDB
export { validate, required, isEmail, minLength, maxLength } from "https://deno.land/x/validasaur@v0.15.0/mod.ts";
export { encode } from "https://deno.land/std@0.177.0/encoding/base32.ts";
export { create, verify, getNumericDate } from "https://deno.land/x/djwt@v3.0.2/mod.ts";
