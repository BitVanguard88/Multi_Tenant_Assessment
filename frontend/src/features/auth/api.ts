import { apiClient } from "../../lib/apiClient";
import type { LoginResponse } from "../../types/api";

export function login(payload: { email: string; password: string }) {
    return apiClient<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(payload)
    });
}