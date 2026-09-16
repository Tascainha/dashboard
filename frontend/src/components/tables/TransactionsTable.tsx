"use client";

import { Pencil, Trash2 } from "lucide-react";
import type { Transaction } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/format";

export function TransactionsTable({
  transactions,
  onEdit,
  onDelete,
}: {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: number) => void;
}) {
  if (transactions.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-text-muted">
        Nenhuma transação neste período.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border-hairline text-left text-xs uppercase tracking-wide text-text-muted">
            <th className="py-2 pr-4 font-medium">Data</th>
            <th className="py-2 pr-4 font-medium">Descrição</th>
            <th className="py-2 pr-4 font-medium">Categoria</th>
            <th className="py-2 pr-4 font-medium">Conta</th>
            <th className="py-2 pr-4 text-right font-medium">Valor</th>
            <th className="py-2 pr-0 text-right font-medium">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-hairline">
          {transactions.map((t) => (
            <tr key={t.id}>
              <td className="whitespace-nowrap py-3 pr-4 text-text-secondary">
                {formatDate(t.transactionDate)}
              </td>
              <td className="py-3 pr-4 font-medium text-text-primary">{t.description}</td>
              <td className="py-3 pr-4">
                <span className="inline-flex items-center gap-1.5 text-text-secondary">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: t.categoryColor }}
                  />
                  {t.categoryName}
                </span>
              </td>
              <td className="py-3 pr-4 text-text-secondary">{t.accountName}</td>
              <td
                className={`py-3 pr-4 text-right font-medium tabular-nums ${
                  t.type === "INCOME" ? "text-delta-good" : "text-text-primary"
                }`}
              >
                {t.type === "INCOME" ? "+" : "-"}
                {formatCurrency(t.amount)}
              </td>
              <td className="py-3 pr-0 text-right">
                <div className="flex justify-end gap-1">
                  <button
                    onClick={() => onEdit(t)}
                    className="rounded-md p-1.5 text-text-muted hover:bg-surface-2"
                    aria-label="Editar"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => onDelete(t.id)}
                    className="rounded-md p-1.5 text-text-muted hover:bg-surface-2 hover:text-status-critical"
                    aria-label="Excluir"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
