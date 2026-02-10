import type {
  ReactivatedAttributionSettings,
  LookbackWindowSettings,
  AttributionWindowSettings,
  WindowPeriod,
} from "@/types";

export const DEFAULT_LOOKBACK: LookbackWindowSettings = {
  clickDeviceMatching: { value: 7, unit: "days" },
  clickProbabilisticModeling: { value: 1, unit: "days" },
  viewDeviceMatching: { value: 1, unit: "days" },
  viewProbabilisticModeling: { value: 6, unit: "hours" },
};

export const DEFAULT_ATTRIBUTION: AttributionWindowSettings = {
  attributionWindow: { value: 7, unit: "days" },
};

export const MOCK_REACTIVATED_SETTINGS: ReactivatedAttributionSettings = {
  inactivityWindow: { value: 7, unit: "days" },
  lookbackWindows: {
    reactivatedInstall: [
      { channel: "Global", settings: { ...DEFAULT_LOOKBACK } },
      {
        channel: "moloco",
        settings: {
          clickDeviceMatching: { value: 3, unit: "days" },
          clickProbabilisticModeling: { value: 1, unit: "days" },
          viewDeviceMatching: { value: 1, unit: "days" },
          viewProbabilisticModeling: { value: 3, unit: "hours" },
        },
      },
    ],
    reactivatedOpen: [
      { channel: "Global", settings: { ...DEFAULT_LOOKBACK } },
    ],
  },
  attributionWindows: {
    reactivatedInstall: [
      { channel: "Global", settings: { ...DEFAULT_ATTRIBUTION } },
      { channel: "moloco", settings: { attributionWindow: { value: 14, unit: "days" } } },
    ],
    reactivatedOpen: [
      { channel: "Global", settings: { ...DEFAULT_ATTRIBUTION } },
    ],
    reactivatedDeeplinkOpen: [
      { channel: "Global", settings: { ...DEFAULT_ATTRIBUTION } },
    ],
    reactivatedDeeplinkPageview: [
      { channel: "Global", settings: { ...DEFAULT_ATTRIBUTION } },
    ],
  },
};

export function formatPeriod(period: WindowPeriod): string {
  return `${period.value} ${period.unit}`;
}

export function formatPeriodShort(period: WindowPeriod): string {
  const unitMap: Record<string, string> = {
    minutes: "m",
    hours: "h",
    days: "d",
    months: "mo",
    years: "y",
  };
  return `${period.value}${unitMap[period.unit] ?? period.unit}`;
}
