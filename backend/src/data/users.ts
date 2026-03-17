import { User } from "../domain/user";

export const users: User[] = [
    {
        id: "u101",
        tenantId: "tenant_brightmarket",
        email: "allen@brightmarket.com",
        password: "Password123!",
        fullName: "Allen Chen",
        role: "admin"
    },
    {
        id: "u102",
        tenantId: "tenant_brightmarket",
        email: "david@brightmarket.com",
        password: "Password123!",
        fullName: "David Ross",
        role: "analyst"
    },
    {
        id: "u201",
        tenantId: "tenant_cloudsync",
        email: "mike@cloudsync.io",
        password: "Password123!",
        fullName: "Mike Patel",
        role: "admin"
    },
    {
        id: "u202",
        tenantId: "tenant_cloudsync",
        email: "lisa@cloudsync.io",
        password: "Password123!",
        fullName: "Lisa Chen",
        role: "analyst"
    }
];