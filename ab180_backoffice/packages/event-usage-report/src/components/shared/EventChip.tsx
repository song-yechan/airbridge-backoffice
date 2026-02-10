import { X } from 'lucide-react';

interface EventChipProps {
  label: string;
  onRemove: () => void;
}

export function EventChip({ label, onRemove }: EventChipProps) {
  // 레이블이 길면 truncate
  const displayLabel = label.length > 15 ? `${label.slice(0, 12)}...` : label;

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 pl-2.5 text-xs font-medium bg-destructive text-white rounded-md">
      {displayLabel}
      <button
        onClick={onRemove}
        className="text-white/70 hover:text-white transition-colors p-0.5"
        aria-label={`Remove ${label}`}
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}
