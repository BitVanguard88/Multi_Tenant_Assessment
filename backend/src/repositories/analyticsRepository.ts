import { events } from "../data/events";
import { tenants } from "../data/tenants";

export class AnalyticsRepository {
    findTenantById(tenantId: string) {
        return tenants.find((tenant) => tenant.id === tenantId);
    }

    findEventsByTenantId(tenantId: string) {
        return events
            .filter((event) => event.tenantId === tenantId)
            .sort((a, b) => new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime());
    }
}