import { PageHeader } from "@/components/layout/PageHeader";
import { HomeNav } from "@/components/layout/HomeNav";
import { DeduplicationGuide } from "@/components/guide/DeduplicationGuide";
import { AppSearchSection } from "@/components/dedup/AppSearchSection";
import { CurrentSettingsTable } from "@/components/dedup/CurrentSettingsTable";
import { ConditionSelector } from "@/components/dedup/ConditionSelector";
import { PreviewSection } from "@/components/dedup/PreviewSection";
import { ActionButtons } from "@/components/dedup/ActionButtons";
import { Toaster } from "@/components/ui/sonner";
import { Separator } from "@/components/ui/separator";
import { useDedupForm } from "@/hooks/useDedupForm";

function App() {
  const {
    appInfo,
    currentSettings,
    formState,
    isApplying,
    isFormValid,
    handleAppChange,
    handleRefresh,
    handlePlatformsChange,
    handleEventTypeChange,
    handleDedupWindowChange,
    handleDeleteSetting,
    handleApply,
  } = useDedupForm();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[920px] mx-auto px-6 py-8 pb-20">
        <HomeNav />
        <PageHeader />

        <DeduplicationGuide />

        <div className="space-y-6">
          {/* App 검색 */}
          <AppSearchSection
            appInfo={appInfo}
            onAppChange={handleAppChange}
            onRefresh={handleRefresh}
          />

          {appInfo && (
            <>
              {/* 현재 설정 */}
              <CurrentSettingsTable
                settings={currentSettings}
                onDelete={handleDeleteSetting}
              />

              <Separator className="my-8" />

              {/* 새 설정 추가 */}
              <div className="space-y-6">
                <ConditionSelector
                  platforms={formState.platforms}
                  eventType={formState.eventType}
                  dedupWindow={formState.dedupWindow}
                  onPlatformsChange={handlePlatformsChange}
                  onEventTypeChange={handleEventTypeChange}
                  onDedupWindowChange={handleDedupWindowChange}
                />

                <PreviewSection
                  appId={appInfo.id}
                  platforms={formState.platforms}
                  eventType={formState.eventType}
                  dedupWindow={formState.dedupWindow}
                />

                <ActionButtons
                  onApply={handleApply}
                  isLoading={isApplying}
                  disabled={!isFormValid}
                />
              </div>
            </>
          )}
        </div>
      </div>

      <Toaster position="top-right" />
    </div>
  );
}

export default App;
