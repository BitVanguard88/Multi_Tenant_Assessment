import { AnalyticsEvent } from "../domain/event";

export const events: AnalyticsEvent[] = [
    { id: "bm-1", tenantId: "tenant_brightmarket", type: "product_view", occurredAt: "2026-03-10T09:00:00Z", value: 140 },
    { id: "bm-2", tenantId: "tenant_brightmarket", type: "product_view", occurredAt: "2026-03-10T12:00:00Z", value: 165 },
    { id: "bm-3", tenantId: "tenant_brightmarket", type: "add_to_cart", occurredAt: "2026-03-11T10:00:00Z", value: 45 },
    { id: "bm-4", tenantId: "tenant_brightmarket", type: "checkout_started", occurredAt: "2026-03-11T14:00:00Z", value: 28 },
    { id: "bm-5", tenantId: "tenant_brightmarket", type: "purchase", occurredAt: "2026-03-12T11:00:00Z", value: 18 },
    { id: "bm-6", tenantId: "tenant_brightmarket", type: "product_view", occurredAt: "2026-03-13T09:30:00Z", value: 180 },
    { id: "bm-7", tenantId: "tenant_brightmarket", type: "add_to_cart", occurredAt: "2026-03-13T13:30:00Z", value: 52 },
    { id: "bm-8", tenantId: "tenant_brightmarket", type: "purchase", occurredAt: "2026-03-14T16:00:00Z", value: 22 },

    { id: "cs-1", tenantId: "tenant_cloudsync", type: "user_signup", occurredAt: "2026-03-10T08:30:00Z", value: 34 },
    { id: "cs-2", tenantId: "tenant_cloudsync", type: "workspace_created", occurredAt: "2026-03-10T11:30:00Z", value: 19 },
    { id: "cs-3", tenantId: "tenant_cloudsync", type: "feature_used", occurredAt: "2026-03-11T15:00:00Z", value: 96 },
    { id: "cs-4", tenantId: "tenant_cloudsync", type: "invite_sent", occurredAt: "2026-03-12T09:45:00Z", value: 41 },
    { id: "cs-5", tenantId: "tenant_cloudsync", type: "subscription_upgrade", occurredAt: "2026-03-12T17:00:00Z", value: 9 },
    { id: "cs-6", tenantId: "tenant_cloudsync", type: "feature_used", occurredAt: "2026-03-13T10:15:00Z", value: 120 },
    { id: "cs-7", tenantId: "tenant_cloudsync", type: "invite_sent", occurredAt: "2026-03-14T14:20:00Z", value: 48 },
    { id: "cs-8", tenantId: "tenant_cloudsync", type: "subscription_upgrade", occurredAt: "2026-03-14T18:10:00Z", value: 11 }
];