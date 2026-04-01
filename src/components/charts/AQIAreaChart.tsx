"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DataPoint {
  date: string;
  aqi: number;
}

interface AQIAreaChartProps {
  data: DataPoint[];
}

function getGradientColor(aqi: number): string {
  if (aqi <= 50) return "#22C55E";
  if (aqi <= 100) return "#EAB308";
  if (aqi <= 150) return "#F97316";
  return "#EF4444";
}

export default function AQIAreaChart({ data }: AQIAreaChartProps) {
  const avgAqi = data.length > 0 ? data.reduce((s, d) => s + d.aqi, 0) / data.length : 50;
  const fillColor = getGradientColor(avgAqi);

  return (
    <div className="bg-surface rounded-2xl border border-border p-6">
      <h3 className="text-sm font-semibold text-text mb-4">
        Évolution AQI national — 30 derniers jours
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="aqiGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={fillColor} stopOpacity={0.3} />
              <stop offset="95%" stopColor={fillColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#64748B" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#64748B" }}
            tickLine={false}
            axisLine={false}
            domain={[0, "auto"]}
          />
          <Tooltip
            contentStyle={{
              background: "#fff",
              border: "1px solid #E2E8F0",
              borderRadius: 12,
              fontSize: 13,
            }}
          />
          <Area
            type="monotone"
            dataKey="aqi"
            stroke={fillColor}
            strokeWidth={2}
            fill="url(#aqiGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
