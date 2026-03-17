import { users } from "../data/users";
import { User } from "../domain/user";

export class UserRepository {
    findByEmail(email: string): User | undefined {
        return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
    }

    findById(userId: string): User | undefined {
        return users.find((user) => user.id === userId);
    }
}