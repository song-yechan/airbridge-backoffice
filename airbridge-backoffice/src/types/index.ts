// === Common ===

export type AppStatus = "NORMAL" | "SUSPENDED" | "DEMO";

export interface AppInfo {
  id: string;
  name: string;
  timezone: string;
  status: AppStatus;
  plan?: string;
  iconUrl?: string;
}

// === Custom Deduplication ===

export type Platform = "app" | "web";

export interface EventType {
  label: string;
  value: string;
  appEventCategory?: string;
}

export interface DedupSetting {
  id: string;
  appId: string;
  eventCategory: string;
  goalCategory: string;
  dedupKey: string;
  dedupWindow: number;
  status: "ON" | "OFF";
  createdAt: string;
  updatedAt: string;
}

export interface DedupFormState {
  platforms: Platform[];
  eventType: EventType | null;
  dedupWindow: number;
}

// === Event Usage Report ===

export interface EventChip {
  id: string;
  label: string;
}

export interface DateRange {
  from: string; // yyyy-MM-dd
  to: string;   // yyyy-MM-dd
}

export interface TableColumn {
  key: string;
  header: string;
  align?: "left" | "right";
}

export interface LegendItem {
  label: string;
  color: string;
}

// === Reactivated Attribution ===

export type TimeUnit = "minutes" | "hours" | "days" | "months" | "years";

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

export type LookbackEventType = "reactivatedInstall" | "reactivatedOpen";
export type AttributionEventType =
  | "reactivatedInstall"
  | "reactivatedOpen"
  | "reactivatedDeeplinkOpen"
  | "reactivatedDeeplinkPageview";

export interface ReactivatedAttributionSettings {
  inactivityWindow: WindowPeriod | null;
  lookbackWindows: Record<LookbackEventType, ChannelLookbackWindow[]>;
  attributionWindows: Record<AttributionEventType, ChannelAttributionWindow[]>;
}

// === Custom Channel Permission ===

export interface AgencyInfo {
  id: number;
  name: string;
  userGroupId: number;
}

export type CampaignFilterType = "startswith" | "endswith" | "is" | "is_not";

export interface CampaignFilter {
  type: CampaignFilterType;
  values: string[];
  field: string;
}

export interface CustomChannelDataFilter {
  name: string; // 채널명 또는 "*" (전체)
  filter: CampaignFilter;
}

export interface IntegrationPermission {
  integratedChannels: string[];
  integratedChannelDataFilters: CustomChannelDataFilter[];
  customChannels: string[];
  customChannelDataFilters: CustomChannelDataFilter[];
  unattributedChannel: boolean;
  unattributedFilter: CampaignFilter | null;
}

export interface PermissionData {
  integration: IntegrationPermission;
  dataRestriction: {
    eventCategories: string[];
  };
}

export interface ChannelPermissionEntry {
  channel: string;
  filters: { type: CampaignFilterType; value: string }[];
}

// === Calculated Metrics ===

export type SearchTarget = "all" | "key" | "displayName";

export interface CalculatedMetric {
  id: number;
  key: string;
  displayName: string;
  expression: string; // JSON string
}

export interface CalculatedMetricFormState {
  organizationId: string;
  key: string;
  displayName: string;
  expression: string;
}
