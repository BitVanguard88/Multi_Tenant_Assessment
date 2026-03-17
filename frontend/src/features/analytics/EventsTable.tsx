import type { AnalyticsEvent } from "../../types/api";

interface EventsTableProps {
    events: AnalyticsEvent[];
}

export function EventsTable({ events }: EventsTableProps) {
    if (!events.length) {
        return <div className="empty-state">No events found for this tenant.</div>;
    }

    return (
        <div className="panel table-panel">
            <div className="panel-header">
                <h2>Recent tenant events</h2>
                <p>Strictly scoped to the authenticated tenant</p>
            </div>

            <div className="table-scroll">
                <table>
                    <thead>
                        <tr>
                            <th>Event Type</th>
                            <th>Occurred At</th>
                            <th>Value</th>
                        </tr>
                    </thead>

                    <tbody>
                        {events.map((event) => (
                            <tr key={event.id}>
                                <td>
                                    <span className="event-type">{event.type}</span>
                                </td>
                                <td>{new Date(event.occurredAt).toLocaleString()}</td>
                                <td>{event.value}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}