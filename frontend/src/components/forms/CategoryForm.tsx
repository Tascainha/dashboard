"use client";

import { FormEvent, useState } from "react";
import type { Category, TransactionType } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select } from "@/components/ui/Input";
import { ColorSwatchPicker, CATEGORY_PALETTE } from "@/components/ui/ColorSwatchPicker";
import type { CategoryInput } from "@/lib/queries";

export function CategoryForm({
  initial,
  onSubmit,
  onCancel,
  isSubmitting,
}: {
  initial?: Category;
  onSubmit: (input: CategoryInput) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [type, setType] = useState<TransactionType>(initial?.type ?? "EXPENSE");
  const [color, setColor] = useState(initial?.color ?? CATEGORY_PALETTE[0]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit({ name, type, color });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nome</Label>
        <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="type">Tipo</Label>
        <Select id="type" value={type} onChange={(e) => setType(e.target.value as TransactionType)}>
          <option value="EXPENSE">Despesa</option>
          <option value="INCOME">Receita</option>
        </Select>
      </div>
      <div>
        <Label>Cor</Label>
        <ColorSwatchPicker value={color} onChange={setColor} />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </form>
  );
}
