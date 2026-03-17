export interface AnalyticsEvent {
    id: string;
    tenantId: string;
    type: string;
    occurredAt: string;
    value: number;
    metadata?: Record<string, string | number | boolean>;
}