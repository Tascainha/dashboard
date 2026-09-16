"use client";

import { useState } from "react";
import clsx from "clsx";
import { ChevronLeft, ChevronRight, Pencil, Plus, Trash2 } from "lucide-react";
import { useCategories, useDeleteGoal, useGoals, useSaveGoal, type GoalInput } from "@/lib/queries";
import type { Goal } from "@/lib/types";
import { formatCurrency, formatMonthYear } from "@/lib/format";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { GoalForm } from "@/components/forms/GoalForm";

function statusFor(percent: number) {
  if (percent >= 100) return { status: "critical" as const, label: "Estourou", bar: "bg-status-critical" };
  if (percent >= 80) return { status: "warning" as const, label: "Atenção", bar: "bg-status-warning" };
  return { status: "good" as const, label: "Em dia", bar: "bg-status-good" };
}

export default function GoalsPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const { data: goals, isLoading } = useGoals(year, month);
  const { data: categories } = useCategories();
  const saveGoal = useSaveGoal();
  const deleteGoal = useDeleteGoal();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Goal | null>(null);

  function shiftMonth(delta: number) {
    const date = new Date(year, month - 1 + delta, 1);
    setYear(date.getFullYear());
    setMonth(date.getMonth() + 1);
  }

  function openCreate() {
    setEditing(null);
    setIsModalOpen(true);
  }

  function openEdit(goal: Goal) {
    setEditing(goal);
    setIsModalOpen(true);
  }

  function handleSubmit(input: GoalInput) {
    saveGoal.mutate({ id: editing?.id, input }, { onSuccess: () => setIsModalOpen(false) });
  }

  function handleDelete(id: number) {
    if (confirm("Excluir esta meta?")) {
      deleteGoal.mutate(id);
    }
  }

  const expenseCategoriesAvailable = (categories ?? []).some((c) => c.type === "EXPENSE");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Metas</h1>
          <p className="text-sm text-text-muted">Limites mensais de gastos por categoria</p>
        </div>
        <div className="flex items-center gap-3">
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
          <Button onClick={openCreate} disabled={!expenseCategoriesAvailable}>
            <Plus size={16} /> Nova meta
          </Button>
        </div>
      </div>

      {!expenseCategoriesAvailable && !isLoading && (
        <Card className="text-sm text-text-muted">
          Cadastre ao menos uma categoria de despesa antes de criar metas.
        </Card>
      )}

      {isLoading ? (
        <p className="text-sm text-text-muted">Carregando...</p>
      ) : goals && goals.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {goals.map((goal) => {
            const { status, label, bar } = statusFor(goal.progressPercent);
            return (
              <Card key={goal.id}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: goal.categoryColor }}
                    />
                    <span className="font-medium text-text-primary">{goal.categoryName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge status={status}>{label}</Badge>
                    <button
                      onClick={() => openEdit(goal)}
                      className="rounded-md p-1.5 text-text-muted hover:bg-surface-2"
                      aria-label="Editar"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(goal.id)}
                      className="rounded-md p-1.5 text-text-muted hover:bg-surface-2 hover:text-status-critical"
                      aria-label="Excluir"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-surface-2">
                  <div
                    className={clsx("h-full rounded-full", bar)}
                    style={{ width: `${Math.min(goal.progressPercent, 100)}%` }}
                  />
                </div>
                <p className="mt-2 text-sm text-text-secondary">
                  {formatCurrency(goal.spentAmount)} de {formatCurrency(goal.targetAmount)}{" "}
                  <span className="text-text-muted">({goal.progressPercent.toFixed(0)}%)</span>
                </p>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="text-center text-sm text-text-muted">
          Nenhuma meta definida para {formatMonthYear(year, month)}.
        </Card>
      )}

      <Modal
        title={editing ? "Editar meta" : "Nova meta"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <GoalForm
          initial={editing ?? undefined}
          categories={categories ?? []}
          year={year}
          month={month}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          isSubmitting={saveGoal.isPending}
        />
      </Modal>
    </div>
  );
}
