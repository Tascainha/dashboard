"use client";

import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { CategoryBreakdownItem } from "@/lib/types";
import { formatCurrency } from "@/lib/format";

export function CategoryBreakdownChart({ data }: { data: CategoryBreakdownItem[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-[220px] items-center justify-center text-sm text-text-muted">
        Sem lançamentos neste período.
      </div>
    );
  }

  const chartData = [...data]
    .sort((a, b) => b.total - a.total)
    .slice(0, 8)
    .map((item) => ({ name: item.categoryName, total: item.total, color: item.color }));

  return (
    <ResponsiveContainer width="100%" height={Math.max(180, chartData.length * 34)}>
      <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 24, left: 0, bottom: 0 }}>
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="name"
          width={110}
          stroke="var(--text-secondary)"
          tickLine={false}
          axisLine={false}
          fontSize={12}
        />
        <Tooltip
          formatter={(value) => formatCurrency(Number(value))}
          cursor={{ fill: "var(--surface-2)" }}
          contentStyle={{
            background: "var(--surface-1)",
            border: "1px solid var(--border-hairline)",
            borderRadius: 8,
            fontSize: 12,
          }}
        />
        <Bar
          dataKey="total"
          radius={[0, 4, 4, 0]}
          barSize={16}
          label={{
            position: "right",
            fontSize: 12,
            fill: "var(--text-secondary)",
            formatter: (v: unknown) => formatCurrency(Number(v)),
          }}
        >
          {chartData.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
