// Platform Types
export type Platform = "app" | "web";

// Event Types (드롭다운 옵션)
export interface EventType {
  label: string;           // 한글명: "회원 가입"
  value: string;           // Goal Category: "airbridge.user.signup"
  appEventCategory?: string; // App Event Category (9320, 9360 등)
}

// Dedup Setting (현재 설정)
export interface DedupSetting {
  id: string;
  appId: string;
  eventCategory: string;   // 9320, 9360, or empty
  goalCategory: string;    // airbridge.user.signup
  dedupKey: string;        // Liquid 템플릿
  dedupWindow: number;     // seconds (기본 86400)
  status: 'ON' | 'OFF';    // 활성화 상태
  createdAt: string;       // ISO 날짜 문자열
  updatedAt: string;       // ISO 날짜 문자열
}

// App Info
export interface AppInfo {
  id: string;
  name: string;
  timezone: string;
  iconUrl?: string;
}

// Form State
export interface DedupFormState {
  platforms: Platform[];   // ["app"], ["web"], or ["app", "web"]
  eventType: EventType | null;
  dedupWindow: number;     // seconds
}
