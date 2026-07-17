import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const rawSecret = process.env["JWT_SECRET"];
if (!rawSecret) {
  throw new Error("JWT_SECRET environment variable is required");
}
const JWT_SECRET: string = rawSecret;

export interface AuthPayload {
  sub: string;
  email: string;
}

// Extend Express Request to carry userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

/**
 * Middleware that verifies the JWT from the "token" cookie.
 * On success, attaches `userId` to the request object.
 * On failure, responds with 401.
 */
export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const token: string | undefined = req.cookies?.["token"];

  if (!token) {
    res.status(401).json({ error: "No autenticado" });
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as unknown as AuthPayload;
    req.userId = payload.sub;
    next();
  } catch {
    res.status(401).json({ error: "Token inválido o expirado" });
  }
}
