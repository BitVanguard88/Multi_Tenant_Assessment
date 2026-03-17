import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Missing or invalid authorization header." });
    }

    const token = authHeader.replace("Bearer ", "").trim();

    try {
        const payload = verifyToken(token);
        req.userId = payload.userId;
        req.tenantId = payload.tenantId;
        req.userEmail = payload.email;
        next();
    } catch {
        return res.status(401).json({ message: "Invalid or expired token." });
    }
}