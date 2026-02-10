import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isSameDay,
  isSameMonth,
  isWithinInterval,
  addMonths,
  subMonths,
} from 'date-fns';
import { cn } from '@/lib/utils';
import type { DateRange } from '@/types';

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

interface DateRangeCalendarProps {
  range: DateRange;
  phase: 'picking-start' | 'picking-end' | 'done';
  onDateSelect: (date: Date) => void;
  onReset: () => void;
  onApply: () => void;
  isDateDisabled: (date: Date) => boolean;
  isComplete: boolean;
  dayCount: number;
}

export function DateRangeCalendar({
  range,
  phase,
  onDateSelect,
  onReset,
  onApply,
  isDateDisabled,
  isComplete,
  dayCount,
}: DateRangeCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(
    range.from ?? new Date()
  );

  const today = new Date();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDay = getDay(monthStart);

  // 이전 달 날짜들 (빈 칸 채우기)
  const prevMonthDays: (Date | null)[] = Array(startDay).fill(null);

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const isInRange = (date: Date): boolean => {
    if (!range.from || !range.to) return false;
    return isWithinInterval(date, { start: range.from, end: range.to });
  };

  const isSelected = (date: Date): boolean => {
    return (
      (range.from !== null && isSameDay(date, range.from)) ||
      (range.to !== null && isSameDay(date, range.to))
    );
  };

  // 상태 메시지
  const getStateMessage = () => {
    if (phase === 'picking-start') {
      return { text: '시작일을 선택하세요', variant: 'start' as const };
    }
    if (phase === 'picking-end' && range.from) {
      return {
        text: `시작일: ${format(range.from, 'yyyy-MM-dd')} — 종료일을 선택하세요`,
        variant: 'end' as const,
      };
    }
    if (phase === 'done' && range.from && range.to) {
      return {
        text: `선택 완료: ${format(range.from, 'yyyy-MM-dd')} – ${format(range.to, 'yyyy-MM-dd')} (${dayCount}일)`,
        variant: 'done' as const,
      };
    }
    return { text: '시작일을 선택하세요', variant: 'start' as const };
  };

  const stateMsg = getStateMessage();

  return (
    <div className="p-4 w-[300px]">
      {/* 상태 표시 */}
      <div
        className={cn(
          'text-[11px] mb-2.5 py-1.5 px-2.5 rounded-md text-center',
          stateMsg.variant === 'start' &&
            'bg-blue-50 text-blue-600 border border-blue-100',
          stateMsg.variant === 'end' &&
            'bg-amber-50 text-amber-700 border border-amber-200',
          stateMsg.variant === 'done' &&
            'bg-green-50 text-green-600 border border-green-200'
        )}
      >
        {stateMsg.text}
      </div>

      {/* 헤더 */}
      <div className="flex items-center justify-between mb-3">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={handlePrevMonth}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-semibold">
          {format(currentMonth, 'MMMM yyyy')}
        </span>
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={handleNextMonth}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-0.5 text-center mb-1">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-[11px] font-medium text-muted-foreground py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-0.5">
        {/* 이전 달 빈 칸 */}
        {prevMonthDays.map((_, index) => (
          <div key={`prev-${index}`} className="py-1.5" />
        ))}

        {/* 현재 달 날짜 */}
        {daysInMonth.map((date) => {
          const disabled = isDateDisabled(date);
          const selected = isSelected(date);
          const inRange = isInRange(date) && !selected;
          const isToday = isSameDay(date, today);
          const isOtherMonth = !isSameMonth(date, currentMonth);

          return (
            <button
              key={date.toISOString()}
              type="button"
              disabled={disabled || isOtherMonth}
              onClick={() => onDateSelect(date)}
              className={cn(
                'text-[13px] py-1.5 rounded-md transition-colors',
                'hover:bg-muted',
                disabled && 'opacity-20 cursor-not-allowed pointer-events-none',
                isOtherMonth && 'text-muted-foreground opacity-30 pointer-events-none',
                selected && 'bg-primary text-primary-foreground font-semibold hover:bg-primary',
                inRange && 'bg-blue-50 text-blue-600',
                isToday && !selected && 'border font-semibold'
              )}
            >
              {format(date, 'd')}
            </button>
          );
        })}
      </div>

      {/* 푸터 */}
      <div className="mt-3 pt-3 border-t flex justify-between items-center">
        <span className="text-[11px] text-muted-foreground">
          {phase === 'picking-end'
            ? '시작일로부터 최대 31일까지 선택 가능합니다'
            : phase === 'done'
              ? '다른 기간을 선택하려면 날짜를 다시 클릭하세요'
              : ''}
        </span>
        <div className="flex gap-1.5">
          <Button variant="outline" size="sm" className="h-7" onClick={onReset}>
            초기화
          </Button>
          <Button
            size="sm"
            className="h-7"
            onClick={onApply}
            disabled={!isComplete}
          >
            적용
          </Button>
        </div>
      </div>
    </div>
  );
}
