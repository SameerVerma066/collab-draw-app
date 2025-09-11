import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

export function middleware(req: Request, res: Response, next: NextFunction) {
  try {
    const auth = (req.headers["authorization"] as string) || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : auth; // extract token
    if (!token) return res.status(401).json({ message: "unauthorized" });

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.userId = decoded.userId;
    return next();
  } catch {
    return res.status(401).json({ message: "unauthorized" });
  }
}