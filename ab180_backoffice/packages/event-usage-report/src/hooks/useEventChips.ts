import { useState, useCallback } from 'react';
import type { EventChip } from '@/types';

export function useEventChips(initialChips: EventChip[] = []) {
  const [chips, setChips] = useState<EventChip[]>(initialChips);

  const addChip = useCallback((chip: EventChip) => {
    setChips((prev) => {
      // 중복 체크
      if (prev.some((c) => c.id === chip.id)) {
        return prev;
      }
      return [...prev, chip];
    });
  }, []);

  const removeChip = useCallback((chipId: string) => {
    setChips((prev) => prev.filter((c) => c.id !== chipId));
  }, []);

  const clearChips = useCallback(() => {
    setChips([]);
  }, []);

  return {
    chips,
    addChip,
    removeChip,
    clearChips,
  };
}
