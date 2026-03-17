import { AnalyticsRepository } from "../repositories/analyticsRepository";
import { HttpError } from "../utils/httpError";

export class AnalyticsService {
    constructor(private readonly analyticsRepository: AnalyticsRepository) { }

    getSummary(tenantId: string) {
        const tenant = this.analyticsRepository.findTenantById(tenantId);
        const tenantEvents = this.analyticsRepository.findEventsByTenantId(tenantId);

        if (!tenant) {
            throw new HttpError(404, "Tenant not found.");
        }

        const totalEvents = tenantEvents.reduce((sum, event) => sum + event.value, 0);

        const getTotalByType = (type: string) =>
            tenantEvents
                .filter((event) => event.type === type)
                .reduce((sum, event) => sum + event.value, 0);

        const primaryCount = tenant.industry === "ecommerce"
            ? getTotalByType("product_view")
            : getTotalByType("user_signup");

        const conversionCount = tenant.industry === "ecommerce"
            ? getTotalByType("purchase")
            : getTotalByType("subscription_upgrade");

        const conversionRate = primaryCount === 0
            ? 0
            : Number(((conversionCount / primaryCount) * 100).toFixed(1));

        return {
            tenant: {
                id: tenant.id,
                name: tenant.name,
                industry: tenant.industry
            },
            metrics: {
                totalEvents,
                primaryCount,
                conversionCount,
                conversionRate
            }
        };
    }

    getEvents(tenantId: string) {
        const tenant = this.analyticsRepository.findTenantById(tenantId);
        const tenantEvents = this.analyticsRepository.findEventsByTenantId(tenantId);

        if (!tenant) {
            throw new HttpError(404, "Tenant not found.");
        }

        const trendMap = new Map<string, number>();

        tenantEvents.forEach((event) => {
            const dateKey = event.occurredAt.slice(0, 10);
            trendMap.set(dateKey, (trendMap.get(dateKey) || 0) + event.value);
        });

        const trend = Array.from(trendMap.entries()).map(([date, total]) => ({
            date,
            total
        }));

        return {
            tenant: {
                id: tenant.id,
                name: tenant.name,
                industry: tenant.industry
            },
            trend,
            events: tenantEvents
        };
    }
}