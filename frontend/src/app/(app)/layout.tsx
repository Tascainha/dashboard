import type { ReactNode } from "react";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { Sidebar } from "@/components/layout/Sidebar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>
    </AuthGuard>
  );
}
