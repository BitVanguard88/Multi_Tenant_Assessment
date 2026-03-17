import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { AuthService } from "../services/authService";
import { UserRepository } from "../repositories/userRepository";

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1)
});

const authService = new AuthService(new UserRepository());

export function loginController(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password } = loginSchema.parse(req.body);
        const result = authService.login(email, password);
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}