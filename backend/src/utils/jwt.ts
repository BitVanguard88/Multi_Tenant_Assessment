import jwt from "jsonwebtoken";
import { env } from "../config/env";

interface TokenPayload {
    userId: string;
    tenantId: string;
    email: string;
}

export function signToken(payload: TokenPayload): string {
    return jwt.sign(payload, env.jwtSecret, { expiresIn: "1h" });
}

export function verifyToken(token: string): TokenPayload {
    return jwt.verify(token, env.jwtSecret) as TokenPayload;
}