"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useCategories, useDeleteCategory, useSaveCategory, type CategoryInput } from "@/lib/queries";
import type { Category } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { CategoryForm } from "@/components/forms/CategoryForm";

export default function CategoriesPage() {
  const { data: categories, isLoading } = useCategories();
  const saveCategory = useSaveCategory();
  const deleteCategory = useDeleteCategory();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);

  function openCreate() {
    setEditing(null);
    setIsModalOpen(true);
  }

  function openEdit(category: Category) {
    setEditing(category);
    setIsModalOpen(true);
  }

  function handleSubmit(input: CategoryInput) {
    saveCategory.mutate(
      { id: editing?.id, input },
      { onSuccess: () => setIsModalOpen(false) },
    );
  }

  function handleDelete(id: number) {
    if (confirm("Excluir esta categoria? Transações e metas vinculadas impedem a exclusão.")) {
      deleteCategory.mutate(id);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Categorias</h1>
          <p className="text-sm text-text-muted">Organize receitas e despesas por categoria</p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={16} /> Nova categoria
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-text-muted">Carregando...</p>
      ) : categories && categories.length > 0 ? (
        <Card className="p-0">
          <ul className="divide-y divide-border-hairline">
            {categories.map((category) => (
              <li key={category.id} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm font-medium text-text-primary">{category.name}</span>
                  <Badge status={category.type === "INCOME" ? "good" : "neutral"}>
                    {category.type === "INCOME" ? "Receita" : "Despesa"}
                  </Badge>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEdit(category)}
                    className="rounded-md p-1.5 text-text-muted hover:bg-surface-2"
                    aria-label="Editar"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="rounded-md p-1.5 text-text-muted hover:bg-surface-2 hover:text-status-critical"
                    aria-label="Excluir"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      ) : (
        <Card className="text-center text-sm text-text-muted">
          Nenhuma categoria cadastrada ainda.
        </Card>
      )}

      <Modal
        title={editing ? "Editar categoria" : "Nova categoria"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <CategoryForm
          initial={editing ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          isSubmitting={saveCategory.isPending}
        />
      </Modal>
    </div>
  );
}
