import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
    token: string | null;
    user: {
        userId: string;
        tenantId: string;
        email: string;
        fullName: string;
        role: string;
    } | null;
    tenant: {
        id: string;
        name: string;
        industry: "ecommerce" | "saas";
    } | null;
    setAuth: (payload: {
        token: string;
        user: AuthState["user"];
        tenant: AuthState["tenant"];
    }) => void;
    logout: () => void;
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            tenant: null,
            setAuth: ({ token, user, tenant }) => set({ token, user, tenant }),
            logout: () => set({ token: null, user: null, tenant: null })
        }),
        {
            name: "orbitiq-auth"
        }
    )
);