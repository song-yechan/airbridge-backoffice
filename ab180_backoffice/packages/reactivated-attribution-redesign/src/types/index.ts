export type TimeUnit = 'minutes' | 'hours' | 'days' | 'months' | 'years';

export interface WindowPeriod {
  value: number;
  unit: TimeUnit;
}

export interface LookbackWindowSettings {
  clickDeviceMatching: WindowPeriod;
  clickProbabilisticModeling: WindowPeriod;
  viewDeviceMatching: WindowPeriod;
  viewProbabilisticModeling: WindowPeriod;
}

export interface ChannelLookbackWindow {
  channel: string;
  settings: LookbackWindowSettings;
}

export interface AttributionWindowSettings {
  attributionWindow: WindowPeriod;
}

export interface ChannelAttributionWindow {
  channel: string;
  settings: AttributionWindowSettings;
}

export type LookbackEventType = 'reactivatedInstall' | 'reactivatedOpen';
export type AttributionEventType =
  | 'reactivatedInstall'
  | 'reactivatedOpen'
  | 'reactivatedDeeplinkOpen'
  | 'reactivatedDeeplinkPageview';

export interface AppInfo {
  name: string;
  id: number;
  timezone: string;
}

export interface ReactivatedAttributionSettings {
  inactivityWindow: WindowPeriod | null;
  lookbackWindows: {
    reactivatedInstall: ChannelLookbackWindow[];
    reactivatedOpen: ChannelLookbackWindow[];
  };
  attributionWindows: {
    reactivatedInstall: ChannelAttributionWindow[];
    reactivatedOpen: ChannelAttributionWindow[];
    reactivatedDeeplinkOpen: ChannelAttributionWindow[];
    reactivatedDeeplinkPageview: ChannelAttributionWindow[];
  };
}
