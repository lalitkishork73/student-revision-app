import { Request, Response, NextFunction } from "express";
import * as AuthService from "../services/userAuth.service";

// Extend Express Request type to include user
declare module "express-serve-static-core" {
  interface Request {
    user?: any;
  }
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Invalid token format" });
    }

    // verifyToken should throw if invalid
    const decoded = AuthService.verifyToken(token);

    // Attach user info to request
    req.user = decoded;

    next();
  } catch (err: any) {
    return res.status(401).json({ error: err.message || "Unauthorized" });
  }
}
