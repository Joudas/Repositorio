import { type Request, type Response, type NextFunction } from "express";
import { type ZodType, ZodError } from "zod";

export function validate(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      res.status(400).json({ error: "Datos inválidos", details: errors });
      return;
    }
    req.body = result.data;
    next();
  };
}
