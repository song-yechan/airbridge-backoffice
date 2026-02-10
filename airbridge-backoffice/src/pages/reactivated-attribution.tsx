import { PageHeader } from "@/components/layout/page-header";
import { AppSearchSection } from "@/components/features/custom-deduplication/app-search-section";
import { InactivityWindow } from "@/components/features/reactivated-attribution/inactivity-window";
import { LookbackWindow } from "@/components/features/reactivated-attribution/lookback-window";
import { AttributionWindow } from "@/components/features/reactivated-attribution/attribution-window";
import { useReactivatedAttribution } from "@/hooks/use-reactivated-attribution";

export function ReactivatedAttributionPage() {
  const {
    appInfo,
    settings,
    handleAppSelect,
    handleAppClear,
    handleRefresh,
    updateInactivityWindow,
    disableInactivityWindow,
    updateLookbackWindow,
    addLookbackWindowChannel,
    removeLookbackWindowChannel,
    updateAttributionWindow,
    addAttributionWindowChannel,
    removeAttributionWindowChannel,
  } = useReactivatedAttribution();

  return (
    <>
      <PageHeader
        title="Reactivated Attribution"
        description="비활성 유저 재활성화 어트리뷰션 Window 설정"
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
          <div className="space-y-6">
            <InactivityWindow
              value={settings.inactivityWindow}
              onSave={updateInactivityWindow}
              onDisable={disableInactivityWindow}
            />

            <LookbackWindow
              reactivatedInstall={settings.lookbackWindows.reactivatedInstall}
              reactivatedOpen={settings.lookbackWindows.reactivatedOpen}
              onUpdate={updateLookbackWindow}
              onAdd={addLookbackWindowChannel}
              onRemove={removeLookbackWindowChannel}
            />

            <AttributionWindow
              reactivatedInstall={settings.attributionWindows.reactivatedInstall}
              reactivatedOpen={settings.attributionWindows.reactivatedOpen}
              reactivatedDeeplinkOpen={settings.attributionWindows.reactivatedDeeplinkOpen}
              reactivatedDeeplinkPageview={settings.attributionWindows.reactivatedDeeplinkPageview}
              onUpdate={updateAttributionWindow}
              onAdd={addAttributionWindowChannel}
              onRemove={removeAttributionWindowChannel}
            />
          </div>
        )}
      </div>
    </>
  );
}
