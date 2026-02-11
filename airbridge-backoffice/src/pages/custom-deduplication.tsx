import { PageHeader } from "@/components/layout/page-header";
import { Separator } from "@/components/ui/separator";
import { DedupGuideSection } from "@/components/features/custom-deduplication/dedup-guide-section";
import { AppSearchSection } from "@/components/features/custom-deduplication/app-search-section";
import { CurrentSettingsTable } from "@/components/features/custom-deduplication/current-settings-table";
import { ConditionSelector } from "@/components/features/custom-deduplication/condition-selector";
import { useDedupForm } from "@/hooks/use-dedup-form";

export function CustomDeduplicationPage() {
  const {
    appInfo,
    currentSettings,
    formState,
    isApplying,
    isFormValid,
    handleAppSelect,
    handleAppClear,
    handleRefresh,
    handlePlatformsChange,
    handleEventTypeChange,
    handleDedupWindowChange,
    handleDeleteSetting,
    handleApply,
  } = useDedupForm();

  return (
    <>
      <PageHeader
        title="Custom Deduplication"
        description="같은 유저의 동일 이벤트가 짧은 시간 내에 여러 번 발생할 때, 중복으로 간주하여 한 번만 집계되도록 설정합니다. Platform과 이벤트 종류별로 중복 제거 기간(Window)을 지정할 수 있습니다."
      />

      <DedupGuideSection />

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
            <CurrentSettingsTable
              settings={currentSettings}
              onDelete={handleDeleteSetting}
            />

            <Separator className="my-8" />

            <ConditionSelector
              appId={appInfo.id}
              platforms={formState.platforms}
              eventType={formState.eventType}
              dedupWindow={formState.dedupWindow}
              isApplying={isApplying}
              isFormValid={isFormValid}
              onPlatformsChange={handlePlatformsChange}
              onEventTypeChange={handleEventTypeChange}
              onDedupWindowChange={handleDedupWindowChange}
              onApply={handleApply}
            />
          </>
        )}
      </div>
    </>
  );
}
