import { Layout } from "../components/Layout";
import { SummaryCards } from "../features/analytics/SummaryCards";
import { EngagementTrendChart } from "../features/analytics/EngagementTrendChart";
import { EventsTable } from "../features/analytics/EventsTable";
import { useAnalyticsSummary } from "../features/analytics/useAnalyticsSummary";
import { useAnalyticsEvents } from "../features/analytics/useAnalyticsEvents";

export function DashboardPage() {
    const summaryQuery = useAnalyticsSummary();
    const eventsQuery = useAnalyticsEvents();

    if (summaryQuery.isLoading || eventsQuery.isLoading) {
        return (
            <Layout>
                <div className="panel">Loading analytics...</div>
            </Layout>
        );
    }

    if (summaryQuery.isError) {
        return (
            <Layout>
                <div className="panel error-message">{(summaryQuery.error as Error).message}</div>
            </Layout>
        );
    }

    if (eventsQuery.isError) {
        return (
            <Layout>
                <div className="panel error-message">{(eventsQuery.error as Error).message}</div>
            </Layout>
        );
    }

    return (
        <Layout>
            <SummaryCards data={summaryQuery.data!} />

            <div className="dashboard-grid">
                <EngagementTrendChart data={eventsQuery.data!.trend} />
                <EventsTable events={eventsQuery.data!.events} />
            </div>
        </Layout>
    );
}