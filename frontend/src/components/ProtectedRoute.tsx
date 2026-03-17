import { Navigate } from "react-router-dom";
import type { PropsWithChildren } from "react";
import { useAuthStore } from "../store/authStore";

export function ProtectedRoute({ children }: PropsWithChildren) {
    const token = useAuthStore((state) => state.token);

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}