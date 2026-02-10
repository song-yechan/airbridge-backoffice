import { PageHeader } from "@/components/layout/page-header";
import { OrgIdInput } from "@/components/features/calculated-metrics/org-id-input";
import { MetricCreateForm } from "@/components/features/calculated-metrics/metric-create-form";
import { MetricTable } from "@/components/features/calculated-metrics/metric-table";
import { MetricEditForm } from "@/components/features/calculated-metrics/metric-edit-form";
import { useCalculatedMetrics } from "@/hooks/use-calculated-metrics";

export function CalculatedMetricsPage() {
  const {
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
  } = useCalculatedMetrics();

  return (
    <>
      <PageHeader
        title="Calculated Metrics"
        description="Actuals/Trends Report에서 사용할 커스텀 계산 메트릭을 조직 단위로 관리합니다. 기존 메트릭을 조합하여 CPI, CTR, ARPU 등 비즈니스에 필요한 지표를 직접 정의할 수 있습니다."
      />

      <div className="space-y-6">
        <OrgIdInput
          orgId={orgId}
          onOrgIdChange={setOrgId}
          onLoad={handleLoadMetrics}
        />

        {!isLoaded && (
          <p className="text-sm text-muted-foreground text-center py-8">
            Organization ID를 입력하고 조회 버튼을 클릭하세요.
          </p>
        )}

        {isLoaded && (
          <>
            <MetricCreateForm
              orgId={orgId}
              keyValue={createKey}
              displayName={createDisplayName}
              expression={createExpression}
              onKeyChange={setCreateKey}
              onDisplayNameChange={setCreateDisplayName}
              onExpressionChange={setCreateExpression}
              onSubmit={handleCreate}
            />

            <MetricTable
              metrics={filteredMetrics}
              totalCount={metrics.length}
              searchQuery={searchQuery}
              searchTarget={searchTarget}
              selectedMetricId={selectedMetric?.id ?? null}
              onSearchQueryChange={setSearchQuery}
              onSearchTargetChange={setSearchTarget}
              onSelect={handleSelectMetric}
            />

            {selectedMetric ? (
              <MetricEditForm
                metric={selectedMetric}
                displayName={editDisplayName}
                expression={editExpression}
                onDisplayNameChange={setEditDisplayName}
                onExpressionChange={setEditExpression}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                테이블에서 calculated metric을 선택하세요.
              </p>
            )}
          </>
        )}
      </div>
    </>
  );
}
