import { X } from 'lucide-react';
import { EventChip } from '@/components/shared/EventChip';
import { EventSearchCommand } from './EventSearchCommand';
import type { EventChip as EventChipType } from '@/types';

interface EventChipsInputProps {
  chips: EventChipType[];
  availableEvents: EventChipType[];
  onAdd: (chip: EventChipType) => void;
  onRemove: (chipId: string) => void;
  onClear: () => void;
}

export function EventChipsInput({
  chips,
  availableEvents,
  onAdd,
  onRemove,
  onClear,
}: EventChipsInputProps) {
  const selectedIds = chips.map((c) => c.id);

  return (
    <div className="flex items-center flex-wrap gap-1.5 px-3 py-2 border rounded-lg min-h-[40px] cursor-text focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
      {chips.map((chip) => (
        <EventChip
          key={chip.id}
          label={chip.label}
          onRemove={() => onRemove(chip.id)}
        />
      ))}
      <EventSearchCommand
        availableEvents={availableEvents}
        selectedIds={selectedIds}
        onSelect={onAdd}
      />
      {chips.length > 0 && (
        <button
          type="button"
          onClick={onClear}
          className="text-muted-foreground hover:text-foreground transition-colors p-0.5 ml-1"
          title="전체 삭제"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
