"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  Tags,
  Target,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Visão geral", icon: LayoutDashboard },
  { href: "/transactions", label: "Transações", icon: ArrowLeftRight },
  { href: "/accounts", label: "Contas", icon: Wallet },
  { href: "/categories", label: "Categorias", icon: Tags },
  { href: "/goals", label: "Metas", icon: Target },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-border-hairline bg-surface-1">
      <div className="px-5 py-6">
        <p className="text-lg font-semibold text-text-primary">Finance Dashboard</p>
        <p className="text-xs text-text-muted">Controle financeiro pessoal</p>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-series-1/10 text-series-1"
                  : "text-text-secondary hover:bg-surface-2 hover:text-text-primary",
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border-hairline px-5 py-4">
        <p className="truncate text-sm font-medium text-text-primary">{user?.name}</p>
        <p className="truncate text-xs text-text-muted">{user?.email}</p>
        <button
          onClick={logout}
          className="mt-3 flex items-center gap-2 text-sm text-text-secondary hover:text-status-critical"
        >
          <LogOut size={16} />
          Sair
        </button>
      </div>
    </aside>
  );
}
