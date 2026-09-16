import clsx from "clsx";
import { Card } from "./Card";
import { formatCurrency } from "@/lib/format";

interface StatTileProps {
  label: string;
  value: number;
  tone?: "neutral" | "signed";
}

export function StatTile({ label, value, tone = "neutral" }: StatTileProps) {
  const signed = tone === "signed";
  const colorClass = signed
    ? value >= 0
      ? "text-delta-good"
      : "text-delta-bad"
    : "text-text-primary";

  return (
    <Card>
      <p className="text-xs font-medium uppercase tracking-wide text-text-muted">{label}</p>
      <p className={clsx("mt-2 text-2xl font-semibold", colorClass)}>
        {formatCurrency(value)}
      </p>
    </Card>
  );
}
