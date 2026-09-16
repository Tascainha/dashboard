"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useDashboardSummary } from "@/lib/queries";
import { formatMonthYear } from "@/lib/format";
import { Card, CardTitle } from "@/components/ui/Card";
import { StatTile } from "@/components/ui/StatTile";
import { MonthlyTrendChart } from "@/components/charts/MonthlyTrendChart";
import { CategoryBreakdownChart } from "@/components/charts/CategoryBreakdownChart";
import { GoalProgressList } from "@/components/charts/GoalProgressList";

export default function DashboardPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const { data, isLoading } = useDashboardSummary(year, month);

  function shiftMonth(delta: number) {
    const date = new Date(year, month - 1 + delta, 1);
    setYear(date.getFullYear());
    setMonth(date.getMonth() + 1);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Visão geral</h1>
          <p className="text-sm text-text-muted">Resumo financeiro do mês</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border-hairline bg-surface-1 px-2 py-1">
          <button
            onClick={() => shiftMonth(-1)}
            className="rounded-md p-1 text-text-secondary hover:bg-surface-2"
            aria-label="Mês anterior"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="min-w-[140px] text-center text-sm font-medium text-text-primary">
            {formatMonthYear(year, month)}
          </span>
          <button
            onClick={() => shiftMonth(1)}
            className="rounded-md p-1 text-text-secondary hover:bg-surface-2"
            aria-label="Próximo mês"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {isLoading || !data ? (
        <p className="text-sm text-text-muted">Carregando...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatTile label="Receitas" value={data.totalIncome} />
            <StatTile label="Despesas" value={data.totalExpense} />
            <StatTile label="Saldo do mês" value={data.balance} tone="signed" />
            <StatTile label="Patrimônio líquido" value={data.netWorth} tone="signed" />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardTitle>Receitas x Despesas (6 meses)</CardTitle>
              <div className="mt-4">
                <MonthlyTrendChart data={data.monthlyTrend} />
              </div>
            </Card>

            <Card>
              <CardTitle>Metas do mês</CardTitle>
              <div className="mt-4">
                <GoalProgressList goals={data.goals} />
              </div>
            </Card>
          </div>

          <Card>
            <CardTitle>Despesas por categoria</CardTitle>
            <div className="mt-4">
              <CategoryBreakdownChart data={data.expenseByCategory} />
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
