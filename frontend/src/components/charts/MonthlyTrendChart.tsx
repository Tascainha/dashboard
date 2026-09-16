"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MonthlyTrendItem } from "@/lib/types";
import { formatCurrency, formatMonthShort } from "@/lib/format";

export function MonthlyTrendChart({ data }: { data: MonthlyTrendItem[] }) {
  const chartData = data.map((item) => ({
    label: formatMonthShort(item.year, item.month),
    Receitas: item.income,
    Despesas: item.expense,
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-hairline)" vertical={false} />
        <XAxis
          dataKey="label"
          stroke="var(--text-muted)"
          tickLine={false}
          axisLine={{ stroke: "var(--border-strong)" }}
          fontSize={12}
        />
        <YAxis
          stroke="var(--text-muted)"
          tickLine={false}
          axisLine={false}
          fontSize={12}
          tickFormatter={(v: number) => formatCurrency(v).replace(/ /g, " ")}
          width={90}
        />
        <Tooltip
          formatter={(value) => formatCurrency(Number(value))}
          contentStyle={{
            background: "var(--surface-1)",
            border: "1px solid var(--border-hairline)",
            borderRadius: 8,
            fontSize: 12,
          }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line
          type="monotone"
          dataKey="Receitas"
          stroke="var(--series-1)"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
        <Line
          type="monotone"
          dataKey="Despesas"
          stroke="var(--series-2)"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
