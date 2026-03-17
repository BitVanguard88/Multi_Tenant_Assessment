import { UserRepository } from "../repositories/userRepository";
import { tenants } from "../data/tenants";
import { signToken } from "../utils/jwt";
import { HttpError } from "../utils/httpError";

export class AuthService {
    constructor(private readonly userRepository: UserRepository) { }

    login(email: string, password: string) {
        const user = this.userRepository.findByEmail(email);

        if (!user || user.password !== password) {
            throw new HttpError(401, "Invalid email or password.");
        }

        const tenant = tenants.find((item) => item.id === user.tenantId);

        if (!tenant) {
            throw new HttpError(500, "Tenant configuration missing.");
        }

        const token = signToken({
            userId: user.id,
            tenantId: user.tenantId,
            email: user.email
        });

        return {
            token,
            user: {
                userId: user.id,
                tenantId: user.tenantId,
                email: user.email,
                fullName: user.fullName,
                role: user.role
            },
            tenant: {
                id: tenant.id,
                name: tenant.name,
                industry: tenant.industry
            }
        };
    }
}