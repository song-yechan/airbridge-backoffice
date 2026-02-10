import { useState, useCallback } from "react";
import type {
  AppInfo,
  WindowPeriod,
  LookbackEventType,
  AttributionEventType,
  LookbackWindowSettings,
  ChannelLookbackWindow,
  AttributionWindowSettings,
  ChannelAttributionWindow,
  ReactivatedAttributionSettings,
} from "@/types";
import { MOCK_REACTIVATED_SETTINGS } from "@/data/reactivated-attribution-mock";
import { toast } from "sonner";

const EMPTY_SETTINGS: ReactivatedAttributionSettings = {
  inactivityWindow: null,
  lookbackWindows: { reactivatedInstall: [], reactivatedOpen: [] },
  attributionWindows: {
    reactivatedInstall: [],
    reactivatedOpen: [],
    reactivatedDeeplinkOpen: [],
    reactivatedDeeplinkPageview: [],
  },
};

export function useReactivatedAttribution() {
  const [appInfo, setAppInfo] = useState<AppInfo | null>(null);
  const [settings, setSettings] = useState<ReactivatedAttributionSettings>(EMPTY_SETTINGS);

  const handleAppSelect = useCallback((app: AppInfo) => {
    setAppInfo(app);
    // Mock: 특정 앱은 설정이 있고 나머지는 빈 설정
    setSettings(app.id === "12345" ? { ...MOCK_REACTIVATED_SETTINGS } : { ...EMPTY_SETTINGS });
  }, []);

  const handleAppClear = useCallback(() => {
    setAppInfo(null);
    setSettings(EMPTY_SETTINGS);
  }, []);

  const handleRefresh = useCallback(() => {
    if (appInfo) {
      toast.success("설정을 새로고침했습니다.");
    }
  }, [appInfo]);

  // Inactivity Window
  const updateInactivityWindow = useCallback((period: WindowPeriod) => {
    setSettings((prev) => ({ ...prev, inactivityWindow: period }));
    toast.success("Inactivity Window가 저장되었습니다.");
  }, []);

  const disableInactivityWindow = useCallback(() => {
    setSettings((prev) => ({ ...prev, inactivityWindow: null }));
    toast.success("Inactivity Window가 비활성화되었습니다.");
  }, []);

  // Lookback Window
  const updateLookbackWindow = useCallback(
    (eventType: LookbackEventType, channelIndex: number, updates: Partial<LookbackWindowSettings>) => {
      setSettings((prev) => ({
        ...prev,
        lookbackWindows: {
          ...prev.lookbackWindows,
          [eventType]: prev.lookbackWindows[eventType].map((item, idx) =>
            idx === channelIndex ? { ...item, settings: { ...item.settings, ...updates } } : item
          ),
        },
      }));
      toast.success("설정이 업데이트되었습니다.");
    },
    []
  );

  const addLookbackWindowChannel = useCallback(
    (eventType: LookbackEventType, channel: ChannelLookbackWindow) => {
      setSettings((prev) => ({
        ...prev,
        lookbackWindows: {
          ...prev.lookbackWindows,
          [eventType]: [...prev.lookbackWindows[eventType], channel],
        },
      }));
    },
    []
  );

  const removeLookbackWindowChannel = useCallback(
    (eventType: LookbackEventType, channelIndex: number) => {
      setSettings((prev) => ({
        ...prev,
        lookbackWindows: {
          ...prev.lookbackWindows,
          [eventType]: prev.lookbackWindows[eventType].filter((_, idx) => idx !== channelIndex),
        },
      }));
    },
    []
  );

  // Attribution Window
  const updateAttributionWindow = useCallback(
    (eventType: AttributionEventType, channelIndex: number, updates: Partial<AttributionWindowSettings>) => {
      setSettings((prev) => ({
        ...prev,
        attributionWindows: {
          ...prev.attributionWindows,
          [eventType]: prev.attributionWindows[eventType].map((item, idx) =>
            idx === channelIndex ? { ...item, settings: { ...item.settings, ...updates } } : item
          ),
        },
      }));
      toast.success("설정이 업데이트되었습니다.");
    },
    []
  );

  const addAttributionWindowChannel = useCallback(
    (eventType: AttributionEventType, channel: ChannelAttributionWindow) => {
      setSettings((prev) => ({
        ...prev,
        attributionWindows: {
          ...prev.attributionWindows,
          [eventType]: [...prev.attributionWindows[eventType], channel],
        },
      }));
    },
    []
  );

  const removeAttributionWindowChannel = useCallback(
    (eventType: AttributionEventType, channelIndex: number) => {
      setSettings((prev) => ({
        ...prev,
        attributionWindows: {
          ...prev.attributionWindows,
          [eventType]: prev.attributionWindows[eventType].filter((_, idx) => idx !== channelIndex),
        },
      }));
    },
    []
  );

  return {
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
  };
}
