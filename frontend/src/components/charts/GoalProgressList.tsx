import clsx from "clsx";
import type { Goal } from "@/lib/types";
import { formatCurrency } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";

function statusFor(percent: number) {
  if (percent >= 100) return { status: "critical" as const, label: "Estourou" };
  if (percent >= 80) return { status: "warning" as const, label: "Atenção" };
  return { status: "good" as const, label: "Em dia" };
}

const barColor = {
  good: "bg-status-good",
  warning: "bg-status-warning",
  critical: "bg-status-critical",
};

export function GoalProgressList({ goals }: { goals: Goal[] }) {
  if (goals.length === 0) {
    return <p className="text-sm text-text-muted">Nenhuma meta definida para este mês.</p>;
  }

  return (
    <ul className="space-y-4">
      {goals.map((goal) => {
        const { status, label } = statusFor(goal.progressPercent);
        return (
          <li key={goal.id}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 font-medium text-text-primary">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: goal.categoryColor }}
                />
                {goal.categoryName}
              </span>
              <Badge status={status}>{label}</Badge>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2">
              <div
                className={clsx("h-full rounded-full", barColor[status])}
                style={{ width: `${Math.min(goal.progressPercent, 100)}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-text-muted">
              {formatCurrency(goal.spentAmount)} de {formatCurrency(goal.targetAmount)} (
              {goal.progressPercent.toFixed(0)}%)
            </p>
          </li>
        );
      })}
    </ul>
  );
}
