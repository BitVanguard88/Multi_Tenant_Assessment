export interface User {
    id: string;
    tenantId: string;
    email: string;
    password: string;
    fullName: string;
    role: "admin" | "analyst";
}