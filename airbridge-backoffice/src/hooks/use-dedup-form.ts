import { useState, useCallback } from "react";
import type { AppInfo, DedupFormState, DedupSetting, EventType, Platform } from "@/types";
import { DEFAULT_DEDUP_WINDOW, MOCK_DEDUP_SETTINGS } from "@/data/mock";
import { generateDedupKey } from "@/lib/dedup";
import { toast } from "sonner";

export function useDedupForm() {
  const [appInfo, setAppInfo] = useState<AppInfo | null>(null);
  const [currentSettings, setCurrentSettings] = useState<DedupSetting[]>([]);
  const [formState, setFormState] = useState<DedupFormState>({
    platforms: [],
    eventType: null,
    dedupWindow: DEFAULT_DEDUP_WINDOW,
  });
  const [isApplying, setIsApplying] = useState(false);

  const handleAppSelect = useCallback((app: AppInfo) => {
    setAppInfo(app);
    const appSettings = MOCK_DEDUP_SETTINGS.filter((s) => s.appId === app.id);
    setCurrentSettings(appSettings);
    setFormState({ platforms: [], eventType: null, dedupWindow: DEFAULT_DEDUP_WINDOW });
  }, []);

  const handleAppClear = useCallback(() => {
    setAppInfo(null);
    setCurrentSettings([]);
    setFormState({ platforms: [], eventType: null, dedupWindow: DEFAULT_DEDUP_WINDOW });
  }, []);

  const handleRefresh = useCallback(() => {
    if (appInfo) {
      const appSettings = MOCK_DEDUP_SETTINGS.filter((s) => s.appId === appInfo.id);
      setCurrentSettings(appSettings);
      toast.success("설정을 새로고침했습니다.");
    }
  }, [appInfo]);

  const handlePlatformsChange = useCallback((platforms: Platform[]) => {
    setFormState((prev) => ({ ...prev, platforms }));
  }, []);

  const handleEventTypeChange = useCallback((eventType: EventType | null) => {
    setFormState((prev) => ({ ...prev, eventType }));
  }, []);

  const handleDedupWindowChange = useCallback((dedupWindow: number) => {
    setFormState((prev) => ({ ...prev, dedupWindow }));
  }, []);

  const handleDeleteSetting = useCallback((id: string) => {
    setCurrentSettings((prev) => prev.filter((s) => s.id !== id));
    toast.success("설정이 삭제되었습니다.");
  }, []);

  const handleApply = useCallback(() => {
    if (!appInfo || formState.platforms.length === 0 || !formState.eventType) {
      toast.error("모든 필수 항목을 입력해주세요.");
      return;
    }

    setIsApplying(true);
    setTimeout(() => {
      const dedupKey = generateDedupKey(formState.platforms, formState.eventType!);
      const now = new Date().toISOString();
      const newSetting: DedupSetting = {
        id: Date.now().toString(),
        appId: appInfo.id,
        eventCategory:
          formState.platforms.length === 1 && formState.platforms[0] === "app"
            ? formState.eventType!.appEventCategory || ""
            : "",
        goalCategory: formState.eventType!.value,
        dedupKey,
        dedupWindow: formState.dedupWindow,
        status: "ON",
        createdAt: now,
        updatedAt: now,
      };

      setCurrentSettings((prev) => [...prev, newSetting]);
      toast.success("Dedup 설정이 적용되었습니다.");
      setFormState({ platforms: [], eventType: null, dedupWindow: DEFAULT_DEDUP_WINDOW });
      setIsApplying(false);
    }, 1000);
  }, [appInfo, formState]);

  const isFormValid = formState.platforms.length > 0 && formState.eventType !== null;

  return {
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
  };
}
