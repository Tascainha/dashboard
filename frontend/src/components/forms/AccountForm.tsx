"use client";

import { FormEvent, useState } from "react";
import type { Account, AccountType } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select } from "@/components/ui/Input";
import type { AccountInput } from "@/lib/queries";

export const ACCOUNT_TYPES: { value: AccountType; label: string }[] = [
  { value: "CHECKING", label: "Conta corrente" },
  { value: "SAVINGS", label: "Poupança" },
  { value: "CREDIT_CARD", label: "Cartão de crédito" },
  { value: "CASH", label: "Dinheiro" },
  { value: "INVESTMENT", label: "Investimento" },
];

export function AccountForm({
  initial,
  onSubmit,
  onCancel,
  isSubmitting,
}: {
  initial?: Account;
  onSubmit: (input: AccountInput) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [type, setType] = useState<AccountType>(initial?.type ?? "CHECKING");
  const [initialBalance, setInitialBalance] = useState(String(initial?.initialBalance ?? "0"));

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit({ name, type, initialBalance: Number(initialBalance) });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nome</Label>
        <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="type">Tipo</Label>
        <Select id="type" value={type} onChange={(e) => setType(e.target.value as AccountType)}>
          {ACCOUNT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label htmlFor="initialBalance">Saldo inicial</Label>
        <Input
          id="initialBalance"
          type="number"
          step="0.01"
          required
          value={initialBalance}
          onChange={(e) => setInitialBalance(e.target.value)}
        />
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
