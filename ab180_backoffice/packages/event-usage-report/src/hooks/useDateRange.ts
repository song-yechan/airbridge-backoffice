import { useState, useCallback } from 'react';
import { differenceInDays } from 'date-fns';
import type { DateRange } from '@/types';

type Phase = 'picking-start' | 'picking-end' | 'done';

const MAX_DAYS = 31;

export function useDateRange(initialRange?: DateRange) {
  const [range, setRange] = useState<DateRange>(
    initialRange ?? { from: null, to: null }
  );
  const [phase, setPhase] = useState<Phase>(
    initialRange?.from && initialRange?.to ? 'done' : 'picking-start'
  );

  const pickDate = useCallback(
    (date: Date) => {
      if (phase === 'done' || phase === 'picking-start') {
        // 새로운 시작일 설정
        setRange({ from: date, to: null });
        setPhase('picking-end');
        return;
      }

      if (phase === 'picking-end' && range.from) {
        // 시작일 이전이거나 같은 날 → 새 시작일로
        if (date <= range.from) {
          setRange({ from: date, to: null });
          return;
        }

        // 31일 초과 → 무시
        const diff = differenceInDays(date, range.from);
        if (diff > MAX_DAYS) {
          return;
        }

        // 유효한 종료일
        setRange((prev) => ({ ...prev, to: date }));
        setPhase('done');
      }
    },
    [phase, range.from]
  );

  const reset = useCallback(() => {
    setRange({ from: null, to: null });
    setPhase('picking-start');
  }, []);

  const isDateDisabled = useCallback(
    (date: Date): boolean => {
      if (phase !== 'picking-end' || !range.from) {
        return false;
      }

      // 시작일 이전이면 disabled
      if (date < range.from) {
        return true;
      }

      // 같은 날이면 disabled
      if (date.getTime() === range.from.getTime()) {
        return true;
      }

      // 31일 초과면 disabled
      const diff = differenceInDays(date, range.from);
      if (diff > MAX_DAYS) {
        return true;
      }

      return false;
    },
    [phase, range.from]
  );

  const isComplete = phase === 'done' && range.from !== null && range.to !== null;

  const dayCount =
    range.from && range.to ? differenceInDays(range.to, range.from) : 0;

  return {
    range,
    phase,
    pickDate,
    reset,
    isDateDisabled,
    isComplete,
    dayCount,
  };
}
