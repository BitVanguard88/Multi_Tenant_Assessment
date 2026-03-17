import { apiClient } from "../../lib/apiClient";
import type {
    AnalyticsEventsResponse,
    AnalyticsSummaryResponse
} from "../../types/api";

export function fetchAnalyticsSummary(token: string) {
    return apiClient<AnalyticsSummaryResponse>("/analytics/summary", undefined, token);
}

export function fetchAnalyticsEvents(token: string) {
    return apiClient<AnalyticsEventsResponse>("/analytics/events", undefined, token);
}