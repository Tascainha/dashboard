import clsx from "clsx";

export const CATEGORY_PALETTE = [
  "#2a78d6",
  "#eb6834",
  "#1baf7a",
  "#eda100",
  "#e87ba4",
  "#008300",
  "#4a3aa7",
  "#e34948",
];

export function ColorSwatchPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (color: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORY_PALETTE.map((color) => (
        <button
          key={color}
          type="button"
          aria-label={color}
          onClick={() => onChange(color)}
          className={clsx(
            "h-7 w-7 rounded-full ring-offset-2 ring-offset-surface-1 transition-shadow",
            value === color ? "ring-2 ring-text-primary" : "hover:ring-2 hover:ring-border-strong",
          )}
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
}
