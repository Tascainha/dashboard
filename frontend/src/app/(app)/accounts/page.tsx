"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useAccounts, useDeleteAccount, useSaveAccount, type AccountInput } from "@/lib/queries";
import type { Account } from "@/lib/types";
import { formatCurrency } from "@/lib/format";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { AccountForm, ACCOUNT_TYPES } from "@/components/forms/AccountForm";

export default function AccountsPage() {
  const { data: accounts, isLoading } = useAccounts();
  const saveAccount = useSaveAccount();
  const deleteAccount = useDeleteAccount();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Account | null>(null);

  function openCreate() {
    setEditing(null);
    setIsModalOpen(true);
  }

  function openEdit(account: Account) {
    setEditing(account);
    setIsModalOpen(true);
  }

  function handleSubmit(input: AccountInput) {
    saveAccount.mutate(
      { id: editing?.id, input },
      { onSuccess: () => setIsModalOpen(false) },
    );
  }

  function handleDelete(id: number) {
    if (confirm("Excluir esta conta? Transações vinculadas impedem a exclusão.")) {
      deleteAccount.mutate(id);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Contas</h1>
          <p className="text-sm text-text-muted">Contas correntes, cartões e investimentos</p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={16} /> Nova conta
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-text-muted">Carregando...</p>
      ) : accounts && accounts.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {accounts.map((account) => (
            <Card key={account.id}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-text-primary">{account.name}</p>
                  <p className="text-xs text-text-muted">
                    {ACCOUNT_TYPES.find((t) => t.value === account.type)?.label}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEdit(account)}
                    className="rounded-md p-1.5 text-text-muted hover:bg-surface-2"
                    aria-label="Editar"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(account.id)}
                    className="rounded-md p-1.5 text-text-muted hover:bg-surface-2 hover:text-status-critical"
                    aria-label="Excluir"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              <p className="mt-4 text-2xl font-semibold text-text-primary">
                {formatCurrency(account.currentBalance)}
              </p>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center text-sm text-text-muted">
          Nenhuma conta cadastrada ainda.
        </Card>
      )}

      <Modal
        title={editing ? "Editar conta" : "Nova conta"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <AccountForm
          initial={editing ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          isSubmitting={saveAccount.isPending}
        />
      </Modal>
    </div>
  );
}
