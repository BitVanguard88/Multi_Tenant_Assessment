import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import analyticsRoutes from "./routes/analyticsRoutes";
import { env } from "./config/env";
import { requestLogger } from "./middleware/requestLogger";
import { errorHandler } from "./middleware/errorHandler";

export function createApp() {
    const app = express();

    app.use(cors({ origin: env.clientOrigin }));
    app.use(express.json());
    app.use(requestLogger);

    app.get("/health", (_req, res) => {
        res.status(200).json({ status: "ok" });
    });

    app.use("/api/auth", authRoutes);
    app.use("/api/analytics", analyticsRoutes);

    app.use(errorHandler);

    return app;
}