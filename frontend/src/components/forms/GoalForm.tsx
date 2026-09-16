"use client";

import { FormEvent, useState } from "react";
import type { Category, Goal } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select } from "@/components/ui/Input";
import type { GoalInput } from "@/lib/queries";

export function GoalForm({
  initial,
  categories,
  year,
  month,
  onSubmit,
  onCancel,
  isSubmitting,
}: {
  initial?: Goal;
  categories: Category[];
  year: number;
  month: number;
  onSubmit: (input: GoalInput) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}) {
  const expenseCategories = categories.filter((c) => c.type === "EXPENSE");
  const [categoryId, setCategoryId] = useState(
    String(initial?.categoryId ?? expenseCategories[0]?.id ?? ""),
  );
  const [targetAmount, setTargetAmount] = useState(String(initial?.targetAmount ?? ""));

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit({
      categoryId: Number(categoryId),
      targetAmount: Number(targetAmount),
      refYear: initial?.refYear ?? year,
      refMonth: initial?.refMonth ?? month,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="category">Categoria de despesa</Label>
        <Select
          id="category"
          required
          disabled={!!initial}
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          {expenseCategories.length === 0 && <option value="">Nenhuma categoria de despesa</option>}
          {expenseCategories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label htmlFor="targetAmount">Limite mensal</Label>
        <Input
          id="targetAmount"
          type="number"
          step="0.01"
          min="0.01"
          required
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
        />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting || !categoryId}>
          {isSubmitting ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </form>
  );
}
