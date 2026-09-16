"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import {
  useAccounts,
  useCategories,
  useDeleteTransaction,
  useSaveTransaction,
  useTransactions,
  type TransactionInput,
} from "@/lib/queries";
import type { Transaction } from "@/lib/types";
import { formatMonthYear } from "@/lib/format";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { TransactionForm } from "@/components/forms/TransactionForm";
import { TransactionsTable } from "@/components/tables/TransactionsTable";

function monthRange(year: number, month: number) {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0);
  return { start: start.toISOString().slice(0, 10), end: end.toISOString().slice(0, 10) };
}

export default function TransactionsPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const { start, end } = monthRange(year, month);

  const { data: transactions, isLoading } = useTransactions(start, end);
  const { data: accounts } = useAccounts();
  const { data: categories } = useCategories();
  const saveTransaction = useSaveTransaction();
  const deleteTransaction = useDeleteTransaction();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);

  function shiftMonth(delta: number) {
    const date = new Date(year, month - 1 + delta, 1);
    setYear(date.getFullYear());
    setMonth(date.getMonth() + 1);
  }

  function openCreate() {
    setEditing(null);
    setIsModalOpen(true);
  }

  function openEdit(transaction: Transaction) {
    setEditing(transaction);
    setIsModalOpen(true);
  }

  function handleSubmit(input: TransactionInput) {
    saveTransaction.mutate(
      { id: editing?.id, input },
      { onSuccess: () => setIsModalOpen(false) },
    );
  }

  function handleDelete(id: number) {
    if (confirm("Excluir esta transação?")) {
      deleteTransaction.mutate(id);
    }
  }

  const hasSetupData = (accounts?.length ?? 0) > 0 && (categories?.length ?? 0) > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Transações</h1>
          <p className="text-sm text-text-muted">Lançamentos de receitas e despesas</p>
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
          <Button onClick={openCreate} disabled={!hasSetupData}>
            <Plus size={16} /> Nova transação
          </Button>
        </div>
      </div>

      {!hasSetupData && !isLoading && (
        <Card className="text-sm text-text-muted">
          Cadastre ao menos uma conta e uma categoria antes de lançar transações.
        </Card>
      )}

      <Card>
        {isLoading ? (
          <p className="py-6 text-center text-sm text-text-muted">Carregando...</p>
        ) : (
          <TransactionsTable
            transactions={transactions ?? []}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        )}
      </Card>

      <Modal
        title={editing ? "Editar transação" : "Nova transação"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <TransactionForm
          initial={editing ?? undefined}
          accounts={accounts ?? []}
          categories={categories ?? []}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          isSubmitting={saveTransaction.isPending}
        />
      </Modal>
    </div>
  );
}
