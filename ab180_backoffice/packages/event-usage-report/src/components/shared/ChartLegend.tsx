import type { LegendItem } from '@/types';

interface ChartLegendProps {
  items: LegendItem[];
}

export function ChartLegend({ items }: ChartLegendProps) {
  return (
    <div className="flex flex-wrap gap-3.5 mt-3.5">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-1.5 text-xs text-muted-foreground"
        >
          <span
            className="w-2 h-2 rounded-sm flex-shrink-0"
            style={{ backgroundColor: item.color }}
          />
          {item.label}
        </div>
      ))}
    </div>
  );
}
