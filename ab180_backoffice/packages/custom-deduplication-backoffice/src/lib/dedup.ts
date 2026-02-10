import type { EventType, Platform } from "@/types";
import { DEDUP_FIELDS } from "@/data/mock";

/**
 * Platform과 Event Type에 따른 Dedup Key 생성
 *
 * 규칙:
 * 1. App만: {eventCategory}$${goalCategory}$${{ ... }}
 * 2. Web만: {goalCategory}$${{ ... }}
 * 3. App+Web: {goalCategory}$${{ ... }}
 */
export function generateDedupKey(
  platforms: Platform[],
  eventType: EventType
): string {
  const dedupField = DEDUP_FIELDS[eventType.value] || "transactionID";
  const liquidPart = `{{ data.eventData.goal.semanticAttributes.${dedupField} | assert_not_empty }}`;

  if (platforms.length === 1 && platforms[0] === "app" && eventType.appEventCategory) {
    // App만: eventCategory 포함
    return `${eventType.appEventCategory}$$${eventType.value}$$${liquidPart}`;
  }
  // Web만 또는 App+Web: goalCategory만
  return `${eventType.value}$$${liquidPart}`;
}

/**
 * 초를 사람이 읽기 쉬운 형식으로 변환
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}초`;
  }
  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}분`;
  }
  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    return `${hours}시간`;
  }
  const days = Math.floor(seconds / 86400);
  return `${days}일`;
}
