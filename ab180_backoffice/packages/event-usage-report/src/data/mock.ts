import type { AppInfo, EventChip } from '@/types';

export const mockApp: AppInfo = {
  id: 24160,
  name: 'doctornow',
  timezone: 'Asia/Seoul',
};

// Collection Status 데이터
export const collectionEventSources = [
  'app 9160',
  'app 9161',
  'app 9162',
  'app 9167',
  'app 9269',
];

export const collectionData = [
  { date: '2026-02-03', 'app 9160': 58496, 'app 9161': 5861, 'app 9162': 8408, 'app 9167': 0, 'app 9269': 0 },
  { date: '2026-02-02', 'app 9160': 64420, 'app 9161': 6316, 'app 9162': 9350, 'app 9167': 0, 'app 9269': 0 },
  { date: '2026-02-01', 'app 9160': 39780, 'app 9161': 5325, 'app 9162': 4560, 'app 9167': 0, 'app 9269': 0 },
  { date: '2026-01-31', 'app 9160': 45257, 'app 9161': 5026, 'app 9162': 6635, 'app 9167': 0, 'app 9269': 0 },
  { date: '2026-01-30', 'app 9160': 51764, 'app 9161': 5065, 'app 9162': 7515, 'app 9167': 1, 'app 9269': 0 },
  { date: '2026-01-29', 'app 9160': 52766, 'app 9161': 5412, 'app 9162': 7671, 'app 9167': 0, 'app 9269': 0 },
  { date: '2026-01-28', 'app 9160': 52945, 'app 9161': 5946, 'app 9162': 8045, 'app 9167': 0, 'app 9269': 1 },
];

export const collectionSql = `SELECT
    date_start AS dt,
    event_source,
    event_category,
    SUM(event_count) AS events
FROM AIROFFICE.PUBLIC.DRUID_ACTUALS_REPORT_DAILY
WHERE app_id = 24160
AND date_start >= CURRENT_DATE - INTERVAL '30 DAY'
AND date_start < CURRENT_DATE
AND event_source NOT IN ('tracking_link')
GROUP BY 1, 2, 3
ORDER BY 1, 2, 3`;

// 사용 가능한 이벤트 목록 (검색용)
export const availableEvents: EventChip[] = [
  { id: '9161', label: '9161' },
  { id: '9360$ad_banner_click', label: '9360$ad_banner_click' },
  { id: '9360$add_family_doctor', label: '9360$add_family_doctor' },
  { id: '9160', label: '9160' },
  { id: '9162', label: '9162' },
  { id: '9167', label: '9167' },
  { id: '9269', label: '9269' },
  { id: '9360$purchase', label: '9360$purchase' },
  { id: '9360$signup', label: '9360$signup' },
];

// Event Usage 데이터 (9161)
export const reportUsageApis = [
  'actuals_v5_1',
  'funnel_v1_2',
  'retention_v5',
  'revenue_v4',
  'trend_v3_2',
];

export const reportUsageData = [
  { date: '2026-02-04', actuals_v5_1: 10, funnel_v1_2: 0, retention_v5: 0, revenue_v4: 0, trend_v3_2: 0 },
  { date: '2026-02-03', actuals_v5_1: 235, funnel_v1_2: 0, retention_v5: 0, revenue_v4: 0, trend_v3_2: 0 },
  { date: '2026-02-02', actuals_v5_1: 348, funnel_v1_2: 0, retention_v5: 0, revenue_v4: 1, trend_v3_2: 1 },
  { date: '2026-02-01', actuals_v5_1: 10, funnel_v1_2: 0, retention_v5: 0, revenue_v4: 0, trend_v3_2: 0 },
  { date: '2026-01-31', actuals_v5_1: 10, funnel_v1_2: 0, retention_v5: 0, revenue_v4: 0, trend_v3_2: 0 },
  { date: '2026-01-30', actuals_v5_1: 88, funnel_v1_2: 5, retention_v5: 0, revenue_v4: 0, trend_v3_2: 0 },
  { date: '2026-01-29', actuals_v5_1: 152, funnel_v1_2: 5, retention_v5: 2, revenue_v4: 0, trend_v3_2: 0 },
  { date: '2026-01-28', actuals_v5_1: 101, funnel_v1_2: 0, retention_v5: 0, revenue_v4: 0, trend_v3_2: 1 },
];

export const reportUsageSql = `SELECT
    CAST(created_at AS date) AS dt, api,
    COUNT(*) AS cnt
FROM tbl_query_tasks
WHERE app_id = 24160
AND created_at >= '2026-01-28'
AND created_at < '2026-02-05'
AND query LIKE '%%9161%%'
GROUP BY 1, 2 ORDER BY 1, 2`;

// Postback 데이터 (9161)
export const postbackTargets = [
  'appier',
  'fb.biz',
  'fb.audit',
  'google.adw',
  'ga4',
  'moloco',
  'tiktok',
  'toss',
];

export const postbackData = [
  { date: '2026-02-04', appier: 318, 'fb.biz': 11, 'fb.audit': 0, 'google.adw': 0, ga4: 0, moloco: 0, tiktok: 0, toss: 0 },
  { date: '2026-02-03', appier: 5352, 'fb.biz': 344, 'fb.audit': 0, 'google.adw': 0, ga4: 0, moloco: 0, tiktok: 0, toss: 0 },
  { date: '2026-02-02', appier: 5755, 'fb.biz': 327, 'fb.audit': 0, 'google.adw': 0, ga4: 0, moloco: 0, tiktok: 0, toss: 0 },
  { date: '2026-02-01', appier: 4880, 'fb.biz': 336, 'fb.audit': 0, 'google.adw': 0, ga4: 0, moloco: 0, tiktok: 0, toss: 0 },
  { date: '2026-01-31', appier: 4618, 'fb.biz': 264, 'fb.audit': 0, 'google.adw': 0, ga4: 0, moloco: 0, tiktok: 0, toss: 0 },
  { date: '2026-01-30', appier: 4643, 'fb.biz': 256, 'fb.audit': 0, 'google.adw': 0, ga4: 0, moloco: 0, tiktok: 0, toss: 0 },
  { date: '2026-01-29', appier: 4909, 'fb.biz': 289, 'fb.audit': 0, 'google.adw': 0, ga4: 0, moloco: 0, tiktok: 0, toss: 0 },
  { date: '2026-01-28', appier: 5411, 'fb.biz': 338, 'fb.audit': 0, 'google.adw': 0, ga4: 0, moloco: 0, tiktok: 0, toss: 0 },
];

export const postbackSql = `SELECT
    DATE_TRUNC(DAY, DATA__REQUEST__TIMESTAMP)::DATE AS dt,
    DATA__REQUEST__TARGET AS req_target,
    DATA__REQUEST__PRODUCEDBY AS req_produced_by,
    COUNT(*) AS sent_count
FROM INTERNAL_POSTBACK_LOGS
WHERE DATA__APPID = 24160
AND DATA__REQUEST__TIMESTAMP >= '2026-01-28'
AND DATA__REQUEST__TIMESTAMP < '2026-02-05'
-- google ads sends all events, exclude them
AND DATA__REQUEST__TARGET NOT IN ('google.adwords', 'google.adwords.crossnetwork')
AND DATA__EVENTDATA__CATEGORY IN ('9161')
GROUP BY 1, 2, 3 ORDER BY 1, 2, 3`;
