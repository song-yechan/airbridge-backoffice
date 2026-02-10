import { useState } from 'react';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { DateRangeCalendar } from './DateRangeCalendar';
import { useDateRange } from '@/hooks/useDateRange';
import { formatDateRange } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import type { DateRange } from '@/types';

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const { range, phase, pickDate, reset, isDateDisabled, isComplete, dayCount } =
    useDateRange(value);

  const handleApply = () => {
    if (isComplete) {
      onChange(range);
      setOpen(false);
    }
  };

  const handleReset = () => {
    reset();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'h-9 min-w-[270px] justify-start font-mono text-[13px] gap-2',
            !value.from && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          {formatDateRange(value.from, value.to)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <DateRangeCalendar
          range={range}
          phase={phase}
          onDateSelect={pickDate}
          onReset={handleReset}
          onApply={handleApply}
          isDateDisabled={isDateDisabled}
          isComplete={isComplete}
          dayCount={dayCount}
        />
      </PopoverContent>
    </Popover>
  );
}
