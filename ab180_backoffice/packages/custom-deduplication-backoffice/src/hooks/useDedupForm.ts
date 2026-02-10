import { useState, useCallback } from "react";
import type { AppInfo, DedupFormState, DedupSetting, EventType, Platform } from "@/types";
import { DEFAULT_DEDUP_WINDOW, MOCK_DEDUP_SETTINGS, MOCK_APPS } from "@/data/mock";
import { generateDedupKey } from "@/lib/dedup";
import { toast } from "sonner";

// 기본 앱 (접속 시 미리 검색됨)
const DEFAULT_APP_ID = "12345";
const defaultApp = MOCK_APPS[DEFAULT_APP_ID];
const defaultAppSettings = MOCK_DEDUP_SETTINGS.filter((s) => s.appId === DEFAULT_APP_ID);

export function useDedupForm() {
  // App 정보 (기본 앱으로 초기화)
  const [appInfo, setAppInfo] = useState<AppInfo | null>(defaultApp);

  // 현재 설정 목록 (기본 앱 설정으로 초기화)
  const [currentSettings, setCurrentSettings] = useState<DedupSetting[]>(defaultAppSettings);

  // 폼 상태
  const [formState, setFormState] = useState<DedupFormState>({
    platforms: [],
    eventType: null,
    dedupWindow: DEFAULT_DEDUP_WINDOW,
  });

  // 로딩 상태
  const [isApplying, setIsApplying] = useState(false);

  // App 변경
  const handleAppChange = useCallback((app: AppInfo | null) => {
    setAppInfo(app);
    if (app) {
      // Mock: 해당 앱의 설정 로드
      const appSettings = MOCK_DEDUP_SETTINGS.filter((s) => s.appId === app.id);
      setCurrentSettings(appSettings);
    } else {
      setCurrentSettings([]);
    }
    // 폼 초기화
    setFormState({
      platforms: [],
      eventType: null,
      dedupWindow: DEFAULT_DEDUP_WINDOW,
    });
  }, []);

  // 설정 새로고침
  const handleRefresh = useCallback(() => {
    if (appInfo) {
      const appSettings = MOCK_DEDUP_SETTINGS.filter(
        (s) => s.appId === appInfo.id
      );
      setCurrentSettings(appSettings);
      toast.success("설정을 새로고침했습니다.");
    }
  }, [appInfo]);

  // Platform 변경
  const handlePlatformsChange = useCallback((platforms: Platform[]) => {
    setFormState((prev) => ({ ...prev, platforms }));
  }, []);

  // Event Type 변경
  const handleEventTypeChange = useCallback((eventType: EventType | null) => {
    setFormState((prev) => ({ ...prev, eventType }));
  }, []);

  // Dedup Window 변경
  const handleDedupWindowChange = useCallback((dedupWindow: number) => {
    setFormState((prev) => ({ ...prev, dedupWindow }));
  }, []);

  // 설정 삭제
  const handleDeleteSetting = useCallback((id: string) => {
    setCurrentSettings((prev) => prev.filter((s) => s.id !== id));
    toast.success("설정이 삭제되었습니다.");
  }, []);

  // 적용
  const handleApply = useCallback(() => {
    if (!appInfo || formState.platforms.length === 0 || !formState.eventType) {
      toast.error("모든 필수 항목을 입력해주세요.");
      return;
    }

    setIsApplying(true);

    // Mock API 호출 시뮬레이션
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

      // 폼 초기화
      setFormState({
        platforms: [],
        eventType: null,
        dedupWindow: DEFAULT_DEDUP_WINDOW,
      });

      setIsApplying(false);
    }, 1000);
  }, [appInfo, formState]);

  // 폼 유효성
  const isFormValid = formState.platforms.length > 0 && formState.eventType !== null;

  return {
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
  };
}
