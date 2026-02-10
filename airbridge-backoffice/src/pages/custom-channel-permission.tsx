import { PageHeader } from "@/components/layout/page-header";
import { AppSearchSection } from "@/components/features/custom-deduplication/app-search-section";
import { AgencySelect } from "@/components/features/custom-channel-permission/agency-select";
import { CurrentPermissionViewer } from "@/components/features/custom-channel-permission/current-permission-viewer";
import { ChannelPermissionEditor } from "@/components/features/custom-channel-permission/channel-permission-editor";
import { useCustomChannelPermission } from "@/hooks/use-custom-channel-permission";

export function CustomChannelPermissionPage() {
  const {
    appInfo,
    agencies,
    selectedAgency,
    permission,
    channels,
    isDirty,
    handleAppSelect,
    handleAppClear,
    handleRefresh,
    handleAgencySelect,
    handleAgencyClear,
    addChannel,
    removeChannel,
    updateChannelName,
    addFilter,
    removeFilter,
    updateFilterType,
    updateFilterValue,
    handleApply,
  } = useCustomChannelPermission();

  return (
    <>
      <PageHeader
        title="Custom Channel Permission"
        description="대행사가 대시보드에서 볼 수 있는 커스텀 채널과 캠페인 범위를 설정합니다. App → Agency 선택 후, 채널별로 접근 가능한 캠페인 조건을 지정할 수 있습니다."
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
          <AgencySelect
            agencies={agencies}
            selected={selectedAgency}
            onSelect={handleAgencySelect}
            onClear={handleAgencyClear}
          />
        )}

        {appInfo && !selectedAgency && agencies.length > 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            대행사를 선택하면 현재 권한을 조회하고 수정할 수 있습니다.
          </p>
        )}

        {permission && (
          <div className="space-y-6">
            <CurrentPermissionViewer permission={permission} />

            <ChannelPermissionEditor
              channels={channels}
              isDirty={isDirty}
              onAddChannel={addChannel}
              onRemoveChannel={removeChannel}
              onChannelNameChange={updateChannelName}
              onAddFilter={addFilter}
              onRemoveFilter={removeFilter}
              onFilterTypeChange={updateFilterType}
              onFilterValueChange={updateFilterValue}
              onApply={handleApply}
            />
          </div>
        )}
      </div>
    </>
  );
}
