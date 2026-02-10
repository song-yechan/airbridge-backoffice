import { useState, useCallback } from "react";
import type { AppInfo, EventChip, DateRange } from "@/types";
import { AVAILABLE_EVENTS } from "@/data/event-usage-mock";
import { toast } from "sonner";

export function useEventUsage() {
  const [appInfo, setAppInfo] = useState<AppInfo | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({ from: "2026-01-28", to: "2026-02-04" });
  const [selectedEvents, setSelectedEvents] = useState<EventChip[]>([]);
  const [results, setResults] = useState<string[]>([]);
  const [isQuerying, setIsQuerying] = useState(false);

  const handleAppSelect = useCallback((app: AppInfo) => {
    setAppInfo(app);
    setSelectedEvents([]);
    setResults([]);
  }, []);

  const handleAppClear = useCallback(() => {
    setAppInfo(null);
    setSelectedEvents([]);
    setResults([]);
  }, []);

  const handleRefresh = useCallback(() => {
    if (appInfo) {
      toast.success("데이터를 새로고침했습니다.");
    }
  }, [appInfo]);

  const handleDateRangeChange = useCallback((range: DateRange) => {
    if (range.from && range.to) {
      const diffMs = new Date(range.to).getTime() - new Date(range.from).getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
      if (diffDays > 31) {
        toast.error("최대 31일까지 선택할 수 있습니다.");
        return;
      }
      if (diffDays < 0) {
        toast.error("종료일이 시작일보다 앞설 수 없습니다.");
        return;
      }
    }
    setDateRange(range);
  }, []);

  const handleAddEvent = useCallback((chip: EventChip) => {
    setSelectedEvents((prev) => {
      if (prev.some((c) => c.id === chip.id)) return prev;
      return [...prev, chip];
    });
  }, []);

  const handleRemoveEvent = useCallback((chipId: string) => {
    setSelectedEvents((prev) => prev.filter((c) => c.id !== chipId));
  }, []);

  const handleClearEvents = useCallback(() => {
    setSelectedEvents([]);
  }, []);

  const handleRunQuery = useCallback(() => {
    if (selectedEvents.length === 0) {
      toast.error("이벤트를 하나 이상 선택해주세요.");
      return;
    }
    if (!dateRange.from || !dateRange.to) {
      toast.error("날짜 범위를 선택해주세요.");
      return;
    }

    setIsQuerying(true);
    setTimeout(() => {
      setResults(selectedEvents.map((c) => c.id));
      setIsQuerying(false);
      toast.success("쿼리 실행 완료");
    }, 800);
  }, [selectedEvents, dateRange]);

  return {
    appInfo,
    dateRange,
    selectedEvents,
    availableEvents: AVAILABLE_EVENTS,
    results,
    isQuerying,
    handleAppSelect,
    handleAppClear,
    handleRefresh,
    handleDateRangeChange,
    handleAddEvent,
    handleRemoveEvent,
    handleClearEvents,
    handleRunQuery,
  };
}
