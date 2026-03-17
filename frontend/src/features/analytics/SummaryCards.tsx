import type { AnalyticsSummaryResponse } from "../../types/api";

interface SummaryCardsProps {
    data: AnalyticsSummaryResponse;
}

export function SummaryCards({ data }: SummaryCardsProps) {
    const isEcommerce = data.tenant.industry === "ecommerce";

    return (
        <div className="summary-grid">
            <div className="metric-card">
                <span className="metric-label">Total Events</span>
                <strong className="metric-value">{data.metrics.totalEvents.toLocaleString()}</strong>
                <div className="metric-subtle">All tracked engagement activity</div>
            </div>

            <div className="metric-card">
                <span className="metric-label">{isEcommerce ? "Product Views" : "New Signups"}</span>
                <strong className="metric-value">{data.metrics.primaryCount.toLocaleString()}</strong>
                <div className="metric-subtle">
                    {isEcommerce ? "Top-of-funnel customer interest" : "New accounts entering the product"}
                </div>
            </div>

            <div className="metric-card">
                <span className="metric-label">
                    {isEcommerce ? "Purchases" : "Subscription Upgrades"}
                </span>
                <strong className="metric-value">{data.metrics.conversionCount.toLocaleString()}</strong>
                <div className="metric-subtle">
                    {isEcommerce ? "Completed buying actions" : "Users moving to paid conversion"}
                </div>
            </div>

            <div className="metric-card">
                <span className="metric-label">Conversion Rate</span>
                <strong className="metric-value">{data.metrics.conversionRate}%</strong>
                <div className="metric-subtle">Primary conversion efficiency</div>
            </div>
        </div>
    );
}