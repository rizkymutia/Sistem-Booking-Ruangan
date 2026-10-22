"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

type ChartData = {
  name: string;
  bookings: number;
};

export default function AnalyticsChart({ data }: { data: ChartData[] }) {
  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke="#CBD5E1" />
          <YAxis stroke="#CBD5E1" />
          <Tooltip />
          <Bar dataKey="bookings" fill="#06B6D4" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
