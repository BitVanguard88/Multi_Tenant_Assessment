import { useQuery } from "@tanstack/react-query";
import { fetchAnalyticsSummary } from "./api";
import { useAuthStore } from "../../store/authStore";

export function useAnalyticsSummary() {
    const token = useAuthStore((state) => state.token);

    return useQuery({
        queryKey: ["analytics-summary"],
        queryFn: () => fetchAnalyticsSummary(token!),
        enabled: Boolean(token)
    });
}