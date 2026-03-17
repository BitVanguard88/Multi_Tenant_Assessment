import dotenv from "dotenv";

dotenv.config();

export const env = {
    port: Number(process.env.PORT || 4000),
    jwtSecret: process.env.JWT_SECRET || "super-secret-dev-key",
    clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173"
};