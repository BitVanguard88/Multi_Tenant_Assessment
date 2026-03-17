import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";

interface EngagementTrendChartProps {
    data: Array<{
        date: string;
        total: number;
    }>;
}

export function EngagementTrendChart({ data }: EngagementTrendChartProps) {
    return (
        <div className="panel chart-panel">
            <div className="panel-header">
                <h2>Engagement trend</h2>
                <p>Aggregated engagement volume per day</p>
            </div>
            <ResponsiveContainer width="100%" height={320}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="total" stroke="#4f46e5" strokeWidth={3} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}