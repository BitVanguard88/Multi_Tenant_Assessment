import { useQuery } from "@tanstack/react-query";
import { fetchAnalyticsEvents } from "./api";
import { useAuthStore } from "../../store/authStore";

export function useAnalyticsEvents() {
    const token = useAuthStore((state) => state.token);

    return useQuery({
        queryKey: ["analytics-events"],
        queryFn: () => fetchAnalyticsEvents(token!),
        enabled: Boolean(token)
    });
}