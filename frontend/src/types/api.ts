export interface LoginResponse {
    token: string;
    user: {
        userId: string;
        tenantId: string;
        email: string;
        fullName: string;
        role: string;
    };
    tenant: {
        id: string;
        name: string;
        industry: "ecommerce" | "saas";
    };
}

export interface AnalyticsSummaryResponse {
    tenant: {
        id: string;
        name: string;
        industry: "ecommerce" | "saas";
    };
    metrics: {
        totalEvents: number;
        primaryCount: number;
        conversionCount: number;
        conversionRate: number;
    };
}

export interface AnalyticsEvent {
    id: string;
    tenantId: string;
    type: string;
    occurredAt: string;
    value: number;
}

export interface AnalyticsEventsResponse {
    tenant: {
        id: string;
        name: string;
        industry: "ecommerce" | "saas";
    };
    trend: Array<{
        date: string;
        total: number;
    }>;
    events: AnalyticsEvent[];
}