import { useState, useCallback } from "react";
import { toast } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/layout/PageHeader";
import { HomeNav } from "@/components/layout/HomeNav";
import { PermissionGuide } from "@/components/guide/PermissionGuide";
import { AppSearchSection } from "@/components/permission/AppSearchSection";
import { AgencySelector } from "@/components/permission/AgencySelector";
import { CurrentPermissionView } from "@/components/permission/CurrentPermissionView";
import { ChannelPermissionList } from "@/components/permission/ChannelPermissionList";
import { ActionButtons } from "@/components/permission/ActionButtons";
import { usePermissionForm } from "@/hooks/usePermissionForm";
import {
  searchAppById,
  searchAppByName,
  getAgenciesByAppId,
  getPermissionByAgencyId,
  updatePermission,
} from "@/data/mock";
import type { AppInfo, Agency, SearchType } from "@/types";

function App() {
  // App & Agency state
  const [selectedApp, setSelectedApp] = useState<AppInfo | null>(null);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [selectedAgencyId, setSelectedAgencyId] = useState<string | null>(null);

  // Loading states
  const [isLoadingAgencies, setIsLoadingAgencies] = useState(false);
  const [isLoadingPermission, setIsLoadingPermission] = useState(false);

  // Permission form
  const permissionForm = usePermissionForm({
    onSave: async (permission) => {
      if (!selectedAgencyId) {
        return { success: false, error: "대행사가 선택되지 않았습니다" };
      }
      return updatePermission(selectedAgencyId, permission);
    },
  });

  // Search app handler
  const handleSearchApp = useCallback(
    async (query: string, type: SearchType) => {
      if (type === "id") {
        return searchAppById(query);
      } else {
        return searchAppByName(query);
      }
    },
    []
  );

  // App found handler
  const handleAppFound = useCallback(async (app: AppInfo) => {
    setSelectedApp(app);
    setSelectedAgencyId(null);
    setAgencies([]);
    permissionForm.clearForm();

    setIsLoadingAgencies(true);
    try {
      const fetchedAgencies = await getAgenciesByAppId(app.id);
      setAgencies(fetchedAgencies);
    } catch {
      toast.error("대행사 목록을 불러오는데 실패했습니다");
    } finally {
      setIsLoadingAgencies(false);
    }
  }, [permissionForm]);

  // Agency select handler
  const handleSelectAgency = useCallback(
    async (agencyId: string) => {
      setSelectedAgencyId(agencyId);
      permissionForm.clearForm();

      setIsLoadingPermission(true);
      try {
        const permission = await getPermissionByAgencyId(agencyId);
        if (permission) {
          permissionForm.initializeForm(permission);
        } else {
          toast.error("권한 정보를 찾을 수 없습니다");
        }
      } catch {
        toast.error("권한 정보를 불러오는데 실패했습니다");
      } finally {
        setIsLoadingPermission(false);
      }
    },
    [permissionForm]
  );

  // Apply handler
  const handleApply = useCallback(async () => {
    const result = await permissionForm.handleSubmit();
    if (result?.success) {
      toast.success("권한이 성공적으로 업데이트되었습니다");
    } else {
      toast.error(result?.error || "권한 업데이트에 실패했습니다");
    }
  }, [permissionForm]);

  // Reset handler
  const handleReset = useCallback(() => {
    permissionForm.resetForm();
    toast.info("변경사항이 초기화되었습니다");
  }, [permissionForm]);

  const isFormReady = selectedApp && selectedAgencyId && permissionForm.permission;

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <div className="max-w-[920px] mx-auto px-6 py-8 pb-20">
          <HomeNav />
          <PageHeader />
          <div className="space-y-6">
            {/* Guide Section */}
            <PermissionGuide />

            <Separator />

            {/* App Search */}
            <AppSearchSection
              onAppFound={handleAppFound}
              searchApp={handleSearchApp}
              isLoading={isLoadingAgencies}
            />

            {/* Agency Selector */}
            {selectedApp && (
              <AgencySelector
                agencies={agencies}
                selectedAgencyId={selectedAgencyId}
                onSelectAgency={handleSelectAgency}
                isLoading={isLoadingAgencies}
              />
            )}

            {/* Current Permission View */}
            {selectedAgencyId && (
              <CurrentPermissionView
                permission={permissionForm.originalPermission}
                isLoading={isLoadingPermission}
              />
            )}

            {/* Channel Permission List */}
            {selectedAgencyId && (
              <ChannelPermissionList
                customChannels={
                  permissionForm.permission?.integration.customChannels || []
                }
                customChannelDataFilters={
                  permissionForm.permission?.integration.customChannelDataFilters || []
                }
                onAddChannel={permissionForm.handleAddChannel}
                onDeleteChannel={permissionForm.handleDeleteChannel}
                onAddFilter={permissionForm.handleAddFilter}
                onDeleteFilter={permissionForm.handleDeleteFilter}
                isLoading={isLoadingPermission}
                disabled={!isFormReady}
              />
            )}
          </div>

          {/* Action Buttons */}
          {isFormReady && (
            <ActionButtons
              hasChanges={permissionForm.hasChanges}
              isSubmitting={permissionForm.isSubmitting}
              onApply={handleApply}
              onReset={handleReset}
            />
          )}
        </div>
        <Toaster position="bottom-right" />
      </div>
    </TooltipProvider>
  );
}

export default App;
