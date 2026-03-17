import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { login } from "./api";
import { useAuthStore } from "../../store/authStore";

export function useLogin() {
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    return useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            setAuth({
                token: data.token,
                user: data.user,
                tenant: data.tenant
            });
            navigate("/");
        }
    });
}