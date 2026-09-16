import clsx from "clsx";

type Status = "good" | "warning" | "critical" | "neutral";

const statusClasses: Record<Status, string> = {
  good: "bg-status-good/10 text-status-good",
  warning: "bg-status-warning/15 text-[#8a5a00]",
  critical: "bg-status-critical/10 text-status-critical",
  neutral: "bg-surface-2 text-text-secondary",
};

export function Badge({ status, children }: { status: Status; children: React.ReactNode }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        statusClasses[status],
      )}
    >
      {children}
    </span>
  );
}
