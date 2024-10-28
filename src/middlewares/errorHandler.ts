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
