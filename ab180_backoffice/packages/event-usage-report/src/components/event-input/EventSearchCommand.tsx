import { useState } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import type { EventChip } from '@/types';

interface EventSearchCommandProps {
  availableEvents: EventChip[];
  selectedIds: string[];
  onSelect: (event: EventChip) => void;
  placeholder?: string;
}

export function EventSearchCommand({
  availableEvents,
  selectedIds,
  onSelect,
  placeholder = '이벤트 ID 검색 후 추가...',
}: EventSearchCommandProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  // 선택되지 않은 이벤트만 필터링
  const filteredEvents = availableEvents.filter(
    (event) =>
      !selectedIds.includes(event.id) &&
      (event.id.toLowerCase().includes(search.toLowerCase()) ||
        event.label.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSelect = (event: EventChip) => {
    onSelect(event);
    setSearch('');
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <input
          type="text"
          className="flex-1 min-w-[100px] border-none outline-none text-[13px] bg-transparent placeholder:text-muted-foreground"
          placeholder={placeholder}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (!open) setOpen(true);
          }}
          onFocus={() => setOpen(true)}
        />
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Search events..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>No events found.</CommandEmpty>
            <CommandGroup>
              {filteredEvents.slice(0, 10).map((event) => (
                <CommandItem
                  key={event.id}
                  value={event.id}
                  onSelect={() => handleSelect(event)}
                  className="cursor-pointer"
                >
                  <span className="font-mono text-sm">{event.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
