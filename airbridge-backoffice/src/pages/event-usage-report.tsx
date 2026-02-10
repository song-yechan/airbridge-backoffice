import { PageHeader } from "@/components/layout/page-header";
import { Separator } from "@/components/ui/separator";
import { AppSearchSection } from "@/components/features/custom-deduplication/app-search-section";
import { CollectionStatusSection } from "@/components/features/event-usage-report/collection-status-section";
import { EventUsageSection } from "@/components/features/event-usage-report/event-usage-section";
import { useEventUsage } from "@/hooks/use-event-usage";

export function EventUsageReportPage() {
  const {
    appInfo,
    dateRange,
    selectedEvents,
    availableEvents,
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
  } = useEventUsage();

  return (
    <>
      <PageHeader
        title="Event Usage Report"
        description="앱별 이벤트 수집/사용 현황 모니터링"
      />

      <div className="space-y-6">
        <AppSearchSection
          appInfo={appInfo}
          onSelect={handleAppSelect}
          onClear={handleAppClear}
          onRefresh={handleRefresh}
        />

        {!appInfo && (
          <p className="text-sm text-muted-foreground text-center py-8">
            먼저 App ID 또는 App Name으로 앱을 검색하여 선택하세요.
          </p>
        )}

        {appInfo && (
          <>
            <CollectionStatusSection />

            <Separator className="my-8" />

            <EventUsageSection
              dateRange={dateRange}
              selectedEvents={selectedEvents}
              availableEvents={availableEvents}
              results={results}
              isQuerying={isQuerying}
              onDateRangeChange={handleDateRangeChange}
              onAddEvent={handleAddEvent}
              onRemoveEvent={handleRemoveEvent}
              onClearEvents={handleClearEvents}
              onRunQuery={handleRunQuery}
            />
          </>
        )}
      </div>
    </>
  );
}
