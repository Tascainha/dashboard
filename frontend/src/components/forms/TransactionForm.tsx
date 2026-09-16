"use client";

import { FormEvent, useState } from "react";
import type { Account, Category, Transaction, TransactionType } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select } from "@/components/ui/Input";
import type { TransactionInput } from "@/lib/queries";
import { toIsoDate } from "@/lib/format";

export function TransactionForm({
  initial,
  accounts,
  categories,
  onSubmit,
  onCancel,
  isSubmitting,
}: {
  initial?: Transaction;
  accounts: Account[];
  categories: Category[];
  onSubmit: (input: TransactionInput) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}) {
  const [type, setType] = useState<TransactionType>(initial?.type ?? "EXPENSE");
  const [accountId, setAccountId] = useState(String(initial?.accountId ?? accounts[0]?.id ?? ""));
  const [categoryId, setCategoryId] = useState(String(initial?.categoryId ?? ""));
  const [description, setDescription] = useState(initial?.description ?? "");
  const [amount, setAmount] = useState(String(initial?.amount ?? ""));
  const [transactionDate, setTransactionDate] = useState(
    initial?.transactionDate ?? toIsoDate(new Date()),
  );

  const filteredCategories = categories.filter((c) => c.type === type);

  function handleTypeChange(next: TransactionType) {
    setType(next);
    const stillValid = categories.some((c) => c.id === Number(categoryId) && c.type === next);
    if (!stillValid) {
      setCategoryId(String(categories.find((c) => c.type === next)?.id ?? ""));
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit({
      accountId: Number(accountId),
      categoryId: Number(categoryId),
      description,
      amount: Number(amount),
      type,
      transactionDate,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => handleTypeChange("EXPENSE")}
          className={`rounded-lg border py-2 text-sm font-medium ${type === "EXPENSE" ? "border-series-2 bg-series-2/10 text-series-2" : "border-border-hairline text-text-secondary"}`}
        >
          Despesa
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange("INCOME")}
          className={`rounded-lg border py-2 text-sm font-medium ${type === "INCOME" ? "border-series-1 bg-series-1/10 text-series-1" : "border-border-hairline text-text-secondary"}`}
        >
          Receita
        </button>
      </div>

      <div>
        <Label htmlFor="description">Descrição</Label>
        <Input
          id="description"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="amount">Valor</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0.01"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="date">Data</Label>
          <Input
            id="date"
            type="date"
            required
            value={transactionDate}
            onChange={(e) => setTransactionDate(e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="account">Conta</Label>
        <Select id="account" required value={accountId} onChange={(e) => setAccountId(e.target.value)}>
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor="category">Categoria</Label>
        <Select
          id="category"
          required
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          {filteredCategories.length === 0 && <option value="">Nenhuma categoria disponível</option>}
          {filteredCategories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting || !accountId || !categoryId}>
          {isSubmitting ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </form>
  );
}
