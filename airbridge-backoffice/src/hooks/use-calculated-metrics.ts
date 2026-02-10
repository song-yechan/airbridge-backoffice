import { useState, useCallback, useMemo } from "react";
import type { CalculatedMetric, SearchTarget } from "@/types";
import { MOCK_METRICS, validateKey, validateExpression } from "@/data/calculated-metrics-mock";
import { toast } from "sonner";

export function useCalculatedMetrics() {
  const [orgId, setOrgId] = useState("");
  const [metrics, setMetrics] = useState<CalculatedMetric[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTarget, setSearchTarget] = useState<SearchTarget>("all");
  const [selectedMetricId, setSelectedMetricId] = useState<number | null>(null);

  // Create form
  const [createKey, setCreateKey] = useState("");
  const [createDisplayName, setCreateDisplayName] = useState("");
  const [createExpression, setCreateExpression] = useState("");

  // Edit form
  const [editDisplayName, setEditDisplayName] = useState("");
  const [editExpression, setEditExpression] = useState("");

  const filteredMetrics = useMemo(() => {
    if (!searchQuery.trim()) return metrics;
    const q = searchQuery.toLowerCase();
    return metrics.filter((m) => {
      if (searchTarget === "key") return m.key.toLowerCase().includes(q);
      if (searchTarget === "displayName") return m.displayName.toLowerCase().includes(q);
      return m.key.toLowerCase().includes(q) || m.displayName.toLowerCase().includes(q);
    });
  }, [metrics, searchQuery, searchTarget]);

  const selectedMetric = useMemo(
    () => metrics.find((m) => m.id === selectedMetricId) ?? null,
    [metrics, selectedMetricId]
  );

  const handleLoadMetrics = useCallback(() => {
    if (!orgId.trim()) {
      toast.error("Organization ID를 입력해주세요.");
      return;
    }
    const data = MOCK_METRICS[orgId.trim()] ?? [];
    setMetrics(data);
    setIsLoaded(true);
    setSelectedMetricId(null);
    setSearchQuery("");
    toast.success(`${data.length}개의 메트릭을 불러왔습니다.`);
  }, [orgId]);

  const handleSelectMetric = useCallback((id: number) => {
    setSelectedMetricId(id);
    const metric = metrics.find((m) => m.id === id);
    if (metric) {
      setEditDisplayName(metric.displayName);
      try {
        setEditExpression(JSON.stringify(JSON.parse(metric.expression), null, 2));
      } catch {
        setEditExpression(metric.expression);
      }
    }
  }, [metrics]);

  const handleDeselectMetric = useCallback(() => {
    setSelectedMetricId(null);
  }, []);

  // === Create ===

  const handleCreate = useCallback(() => {
    const keyError = validateKey(createKey);
    if (keyError) { toast.error(keyError); return; }
    if (!createDisplayName.trim()) { toast.error("Display Name을 입력해주세요."); return; }
    const exprError = validateExpression(createExpression);
    if (exprError) { toast.error(exprError); return; }

    const duplicate = metrics.find((m) => m.key === createKey.trim());
    if (duplicate) { toast.error("이미 존재하는 Key입니다."); return; }

    const newMetric: CalculatedMetric = {
      id: Date.now(),
      key: createKey.trim(),
      displayName: createDisplayName.trim(),
      expression: createExpression.trim(),
    };
    setMetrics((prev) => [...prev, newMetric]);
    setCreateKey("");
    setCreateDisplayName("");
    setCreateExpression("");
    toast.success("메트릭이 생성되었습니다.");
  }, [createKey, createDisplayName, createExpression, metrics]);

  // === Edit ===

  const handleEdit = useCallback(() => {
    if (selectedMetricId === null) return;
    if (!editDisplayName.trim()) { toast.error("Display Name을 입력해주세요."); return; }
    const exprError = validateExpression(editExpression);
    if (exprError) { toast.error(exprError); return; }

    setMetrics((prev) =>
      prev.map((m) =>
        m.id === selectedMetricId
          ? { ...m, displayName: editDisplayName.trim(), expression: editExpression.trim() }
          : m
      )
    );
    toast.success("메트릭이 수정되었습니다.");
  }, [selectedMetricId, editDisplayName, editExpression]);

  // === Delete ===

  const handleDelete = useCallback(() => {
    if (selectedMetricId === null) return;
    setMetrics((prev) => prev.filter((m) => m.id !== selectedMetricId));
    setSelectedMetricId(null);
    toast.success("메트릭이 삭제되었습니다.");
  }, [selectedMetricId]);

  return {
    orgId,
    setOrgId,
    metrics,
    isLoaded,
    filteredMetrics,
    searchQuery,
    setSearchQuery,
    searchTarget,
    setSearchTarget,
    selectedMetric,
    handleLoadMetrics,
    handleSelectMetric,
    handleDeselectMetric,
    createKey,
    setCreateKey,
    createDisplayName,
    setCreateDisplayName,
    createExpression,
    setCreateExpression,
    handleCreate,
    editDisplayName,
    setEditDisplayName,
    editExpression,
    setEditExpression,
    handleEdit,
    handleDelete,
  };
}
