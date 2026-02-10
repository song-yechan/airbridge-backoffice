import type { AppInfo, ReactivatedAttributionSettings, WindowPeriod, LookbackWindowSettings, AttributionWindowSettings } from '@/types';

export const mockAppInfo: AppInfo = {
  name: 'ablog',
  id: 619,
  timezone: 'Asia/Seoul',
};

export const defaultLookbackSettings: LookbackWindowSettings = {
  clickDeviceMatching: { value: 7, unit: 'days' },
  clickProbabilisticModeling: { value: 1, unit: 'days' },
  viewDeviceMatching: { value: 1, unit: 'days' },
  viewProbabilisticModeling: { value: 6, unit: 'hours' },
};

export const defaultAttributionSettings: AttributionWindowSettings = {
  attributionWindow: { value: 7, unit: 'days' },
};

export const mockSettings: ReactivatedAttributionSettings = {
  inactivityWindow: { value: 7, unit: 'days' },
  lookbackWindows: {
    reactivatedInstall: [
      {
        channel: 'Global',
        settings: { ...defaultLookbackSettings },
      },
      {
        channel: 'moloco',
        settings: {
          clickDeviceMatching: { value: 3, unit: 'days' },
          clickProbabilisticModeling: { value: 1, unit: 'days' },
          viewDeviceMatching: { value: 1, unit: 'days' },
          viewProbabilisticModeling: { value: 3, unit: 'hours' },
        },
      },
    ],
    reactivatedOpen: [
      {
        channel: 'Global',
        settings: { ...defaultLookbackSettings },
      },
    ],
  },
  attributionWindows: {
    reactivatedInstall: [
      {
        channel: 'Global',
        settings: { ...defaultAttributionSettings },
      },
      {
        channel: 'moloco',
        settings: {
          attributionWindow: { value: 14, unit: 'days' },
        },
      },
    ],
    reactivatedOpen: [
      {
        channel: 'Global',
        settings: { ...defaultAttributionSettings },
      },
    ],
    reactivatedDeeplinkOpen: [
      {
        channel: 'Global',
        settings: { ...defaultAttributionSettings },
      },
    ],
    reactivatedDeeplinkPageview: [
      {
        channel: 'Global',
        settings: { ...defaultAttributionSettings },
      },
    ],
  },
};

export const availableChannels = [
  'Global',
  'moloco',
  'applovin',
  'facebook',
  'google',
  'tiktok',
  'unity',
  'ironsource',
  'kakao',
  'naver',
];

export function formatPeriod(period: WindowPeriod): string {
  return `${period.value} ${period.unit}`;
}

export function formatPeriodShort(period: WindowPeriod): string {
  return `${period.value} ${period.unit}`;
}
