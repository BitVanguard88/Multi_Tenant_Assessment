const API_BASE_URL = "http://localhost:4000/api";

export async function apiClient<T>(
    path: string,
    options?: RequestInit,
    token?: string
): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options?.headers || {})
        }
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ message: "Request failed." }));
        throw new Error(errorBody.message || "Request failed.");
    }

    return response.json() as Promise<T>;
}