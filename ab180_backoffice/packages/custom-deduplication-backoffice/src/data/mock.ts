import type { AppInfo, DedupSetting, EventType } from "@/types";

// 이벤트 타입 옵션
export const EVENT_TYPES: EventType[] = [
  { label: "회원 가입", value: "airbridge.user.signup", appEventCategory: "9360" },
  { label: "로그인", value: "airbridge.user.signin", appEventCategory: "9360" },
  { label: "구매 완료", value: "airbridge.ecommerce.order.completed", appEventCategory: "9360" },
  { label: "구매 취소", value: "airbridge.ecommerce.order.canceled", appEventCategory: "9360" },
];

// 이벤트별 Dedup 필드 매핑
export const DEDUP_FIELDS: Record<string, string> = {
  "airbridge.user.signup": "externalUserIDHashed",
  "airbridge.user.signin": "externalUserIDHashed",
  "airbridge.ecommerce.order.completed": "transactionID",
  "airbridge.ecommerce.order.canceled": "transactionID",
};

// 목업 앱 정보
export const MOCK_APPS: Record<string, AppInfo> = {
  "12345": {
    id: "12345",
    name: "Sample E-commerce App",
    timezone: "Asia/Seoul",
    iconUrl: "https://via.placeholder.com/40",
  },
  "67890": {
    id: "67890",
    name: "Travel Booking App",
    timezone: "Asia/Tokyo",
    iconUrl: "https://via.placeholder.com/40",
  },
};

// 목업 현재 설정
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

// 기본 Dedup Window (24시간 = 86400초)
export const DEFAULT_DEDUP_WINDOW = 86400;
