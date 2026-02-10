import { useState, useRef, useEffect } from "react";
import { X, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { EventChip } from "@/types";

interface EventChipsInputProps {
  chips: EventChip[];
  availableEvents: EventChip[];
  onAdd: (chip: EventChip) => void;
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
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedIds = new Set(chips.map((c) => c.id));
  const filtered = availableEvents.filter(
    (e) =>
      !selectedIds.has(e.id) &&
      (e.id.toLowerCase().includes(query.toLowerCase()) ||
        e.label.toLowerCase().includes(query.toLowerCase()))
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (chip: EventChip) => {
    onAdd(chip);
    setQuery("");
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && query === "" && chips.length > 0) {
      onRemove(chips[chips.length - 1].id);
      return;
    }

    if (!isOpen || filtered.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(filtered[activeIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <div
        className="flex items-center flex-wrap gap-1.5 px-3 py-2 border rounded-lg min-h-[40px] cursor-text focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
        onClick={() => inputRef.current?.focus()}
      >
        {chips.map((chip) => (
          <Badge
            key={chip.id}
            variant="secondary"
            className="gap-1 pl-2 pr-1 py-0.5 font-mono text-xs"
          >
            {chip.label}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(chip.id);
              }}
              className="ml-0.5 hover:bg-muted-foreground/20 rounded-sm p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <div className="flex items-center gap-1 flex-1 min-w-[120px]">
          <Search className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 border-none outline-none text-sm bg-transparent placeholder:text-muted-foreground"
            placeholder="이벤트 ID 검색 후 추가..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
              setActiveIndex(-1);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
          />
        </div>
        {chips.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="text-muted-foreground hover:text-foreground transition-colors p-0.5"
            title="전체 삭제"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && filtered.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-lg">
          <div className="max-h-[200px] overflow-y-auto py-1">
            {filtered.map((event, index) => (
              <button
                key={event.id}
                type="button"
                onClick={() => handleSelect(event)}
                onMouseEnter={() => setActiveIndex(index)}
                className={`w-full text-left px-3 py-2 text-sm font-mono transition-colors ${
                  index === activeIndex ? "bg-accent" : "hover:bg-accent/50"
                }`}
              >
                {event.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
