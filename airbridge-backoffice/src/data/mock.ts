import type { AppInfo, DedupSetting, EventType } from "@/types";

// === Custom Deduplication Mock Data ===

export const EVENT_TYPES: EventType[] = [
  { label: "회원 가입", value: "airbridge.user.signup", appEventCategory: "9360" },
  { label: "로그인", value: "airbridge.user.signin", appEventCategory: "9360" },
  { label: "구매 완료", value: "airbridge.ecommerce.order.completed", appEventCategory: "9360" },
  { label: "구매 취소", value: "airbridge.ecommerce.order.canceled", appEventCategory: "9360" },
];

export const DEDUP_FIELDS: Record<string, string> = {
  "airbridge.user.signup": "externalUserIDHashed",
  "airbridge.user.signin": "externalUserIDHashed",
  "airbridge.ecommerce.order.completed": "transactionID",
  "airbridge.ecommerce.order.canceled": "transactionID",
};

export const MOCK_APPS_LIST: AppInfo[] = [
  { id: "12345", name: "sample_ecommerce", timezone: "Asia/Seoul", status: "NORMAL", plan: "ABR_STANDARD" },
  { id: "67890", name: "travel_booking", timezone: "Asia/Tokyo", status: "NORMAL", plan: "ABR_FREE_TRIAL" },
  { id: "11123", name: "game_123_studio", timezone: "Asia/Seoul", status: "NORMAL", plan: "ABR_FREE_TRIAL" },
  { id: "12300", name: "health_app_123", timezone: "America/New_York", status: "NORMAL", plan: "ABR_STANDARD" },
  { id: "99123", name: "fintech_123go", timezone: "Asia/Seoul", status: "SUSPENDED", plan: "ABR_FREE_TRIAL" },
  { id: "45678", name: "media_stream", timezone: "Asia/Seoul", status: "NORMAL", plan: "ABR_ENTERPRISE" },
  { id: "55555", name: "food_delivery", timezone: "Asia/Seoul", status: "DEMO", plan: "ABR_FREE_TRIAL" },
  { id: "78901", name: "social_network", timezone: "US/Pacific", status: "NORMAL", plan: "ABR_STANDARD" },
];

/** ID 또는 이름으로 앱 검색 (부분 일치) */
export function searchApps(query: string): AppInfo[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return MOCK_APPS_LIST.filter(
    (app) => app.id.includes(q) || app.name.toLowerCase().includes(q)
  );
}

/** ID로 정확히 찾기 */
export function findAppById(id: string): AppInfo | undefined {
  return MOCK_APPS_LIST.find((app) => app.id === id);
}

export const MOCK_DEDUP_SETTINGS: DedupSetting[] = [
  {
    id: "1",
    appId: "12345",
    eventCategory: "9360",
    goalCategory: "airbridge.user.signup",
    dedupKey: "9360$$airbridge.user.signup$${{ data.eventData.goal.semanticAttributes.externalUserIDHashed | assert_not_empty }}",
    dedupWindow: 86400,
    status: "ON",
    createdAt: "2023-11-29T11:21:59.000",
    updatedAt: "2023-11-29T11:21:59.000",
  },
  {
    id: "2",
    appId: "12345",
    eventCategory: "",
    goalCategory: "airbridge.ecommerce.order.completed",
    dedupKey: "airbridge.ecommerce.order.completed$${{ data.eventData.goal.semanticAttributes.transactionID | assert_not_empty }}",
    dedupWindow: 86400,
    status: "ON",
    createdAt: "2023-11-29T11:21:59.000",
    updatedAt: "2023-11-29T11:21:59.000",
  },
];

export const DEFAULT_DEDUP_WINDOW = 86400;
