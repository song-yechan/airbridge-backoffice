import { useState } from "react";
import { format, differenceInDays, addDays, isBefore, isAfter } from "date-fns";
import { ko } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { DateRange as AppDateRange } from "@/types";
import type { DateRange } from "react-day-picker";

const MAX_DAYS = 31;

interface DateRangePickerProps {
  value: AppDateRange;
  onChange: (range: AppDateRange) => void;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selected: DateRange | undefined =
    value.from && value.to
      ? { from: new Date(value.from), to: new Date(value.to) }
      : value.from
        ? { from: new Date(value.from), to: undefined }
        : undefined;

  const handleSelect = (range: DateRange | undefined) => {
    if (!range?.from) {
      onChange({ from: "", to: "" });
      return;
    }

    if (range.from && range.to) {
      const from = format(range.from, "yyyy-MM-dd");
      const to = format(range.to, "yyyy-MM-dd");
      onChange({ from, to });
      setIsOpen(false);
    } else {
      onChange({ from: format(range.from, "yyyy-MM-dd"), to: "" });
    }
  };

  const disabledMatcher = (date: Date) => {
    if (!selected?.from || selected?.to) return false;
    const start = selected.from;
    const maxEnd = addDays(start, MAX_DAYS);
    return isAfter(date, maxEnd) || isBefore(date, start);
  };

  const days = value.from && value.to
    ? differenceInDays(new Date(value.to), new Date(value.from)) + 1
    : 0;

  const label = value.from && value.to
    ? `${format(new Date(value.from), "yyyy.MM.dd")} – ${format(new Date(value.to), "yyyy.MM.dd")} (${days}일)`
    : value.from
      ? `${format(new Date(value.from), "yyyy.MM.dd")} – 종료일 선택`
      : "날짜 범위를 선택하세요";

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-[320px] justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span className={!value.from ? "text-muted-foreground" : ""}>
            {label}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3 pb-0 text-xs text-muted-foreground text-center">
          시작일과 종료일을 클릭하세요 (최대 {MAX_DAYS}일)
        </div>
        <Calendar
          mode="range"
          selected={selected}
          onSelect={handleSelect}
          disabled={disabledMatcher}
          numberOfMonths={2}
          locale={ko}
          defaultMonth={value.from ? new Date(value.from) : undefined}
        />
      </PopoverContent>
    </Popover>
  );
}
