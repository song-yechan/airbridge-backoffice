import type { CalculatedMetric } from "@/types";

export const MOCK_METRICS: Record<string, CalculatedMetric[]> = {
  "1872465354": [
    { id: 1, key: "0409", displayName: "1st CPP", expression: '{"type":"arithmetic","fn":"/","fields":[{"metric":"cost_channel","type":"fieldAccess"},{"metric":"app_first_order_complete","type":"fieldAccess"}]}' },
    { id: 2, key: "1", displayName: "CPA (Web)", expression: '{"type":"arithmetic","fn":"*","fields":[{"type":"arithmetic","fn":"/","fields":[{"metric":"cost_channel","type":"fieldAccess"},{"metric":"web_sign_up","type":"fieldAccess"}]},{"type":"constant","value":1}]}' },
    { id: 3, key: "10026", displayName: "CLICK (TOTAL)", expression: '{"type":"arithmetic","fn":"+","fields":[{"metric":"clicks","type":"fieldAccess"},{"metric":"clicks_web","type":"fieldAccess"}]}' },
    { id: 4, key: "10342", displayName: "CTR (Channel)", expression: '{"type":"arithmetic","fn":"*","fields":[{"type":"arithmetic","fn":"/","fields":[{"metric":"clicks","type":"fieldAccess"},{"metric":"impressions","type":"fieldAccess"}]},{"type":"constant","value":100}]}' },
    { id: 5, key: "1087", displayName: "Cost Per Install - CPI (App)", expression: '{"type":"arithmetic","fn":"/","fields":[{"metric":"cost_channel","type":"fieldAccess"},{"metric":"app_install","type":"fieldAccess"}]}' },
    { id: 6, key: "13609", displayName: "CPI", expression: '{"type":"arithmetic","fn":"/","fields":[{"metric":"cost_channel","type":"fieldAccess"},{"metric":"app_install","type":"fieldAccess"}]}' },
    { id: 7, key: "13891", displayName: "ARPU (App)", expression: '{"type":"arithmetic","fn":"/","fields":[{"metric":"app_revenue","type":"fieldAccess"},{"metric":"app_open","type":"fieldAccess"}]}' },
    { id: 8, key: "13892", displayName: "ARPPU (App)", expression: '{"type":"arithmetic","fn":"/","fields":[{"metric":"app_revenue","type":"fieldAccess"},{"metric":"app_order_complete","type":"fieldAccess"}]}' },
    { id: 9, key: "1413212", displayName: "CPA (App)_juryeol", expression: '{"type":"arithmetic","fn":"/","fields":[{"metric":"cost_channel","type":"fieldAccess"},{"metric":"app_sign_up","type":"fieldAccess"}]}' },
    { id: 10, key: "17153", displayName: "wonkyun_test", expression: '{"type":"arithmetic","fn":"*","fields":[{"type":"arithmetic","fn":"/","fields":[{"metric":"clicks","type":"fieldAccess"},{"metric":"impressions","type":"fieldAccess"}]},{"type":"constant","value":100}]}' },
  ],
  "12345": [
    { id: 101, key: "cpi_total", displayName: "CPI (Total)", expression: '{"type":"arithmetic","fn":"/","fields":[{"metric":"cost_channel","type":"fieldAccess"},{"metric":"app_install","type":"fieldAccess"}]}' },
  ],
};

export const EXPRESSION_TEMPLATES: { label: string; expression: string }[] = [
  { label: "CPI (Cost Per Install)", expression: '{\n  "type": "arithmetic",\n  "fn": "/",\n  "fields": [\n    { "metric": "cost_channel", "type": "fieldAccess" },\n    { "metric": "app_install", "type": "fieldAccess" }\n  ]\n}' },
  { label: "CTR (Click Through Rate)", expression: '{\n  "type": "arithmetic",\n  "fn": "*",\n  "fields": [\n    {\n      "type": "arithmetic",\n      "fn": "/",\n      "fields": [\n        { "metric": "clicks", "type": "fieldAccess" },\n        { "metric": "impressions", "type": "fieldAccess" }\n      ]\n    },\n    { "type": "constant", "value": 100 }\n  ]\n}' },
  { label: "ARPU (Average Revenue Per User)", expression: '{\n  "type": "arithmetic",\n  "fn": "/",\n  "fields": [\n    { "metric": "app_revenue", "type": "fieldAccess" },\n    { "metric": "app_open", "type": "fieldAccess" }\n  ]\n}' },
  { label: "CPM (Cost Per Mille)", expression: '{\n  "type": "arithmetic",\n  "fn": "*",\n  "fields": [\n    {\n      "type": "arithmetic",\n      "fn": "/",\n      "fields": [\n        { "metric": "cost_channel", "type": "fieldAccess" },\n        { "metric": "impressions", "type": "fieldAccess" }\n      ]\n    },\n    { "type": "constant", "value": 1000 }\n  ]\n}' },
];

export function validateKey(key: string): string | null {
  if (!key.trim()) return "Key를 입력해주세요.";
  if (!/^[a-z0-9_]+$/.test(key)) return "Key는 영어 소문자, 숫자, 언더스코어만 사용 가능합니다.";
  return null;
}

export function validateExpression(expression: string): string | null {
  if (!expression.trim()) return "Expression을 입력해주세요.";
  try {
    const parsed = JSON.parse(expression);
    if (!parsed.type) return 'Expression에 "type" 필드가 필요합니다.';
    if (parsed.type === "arithmetic" && !parsed.fn) return 'arithmetic 타입에 "fn" 필드가 필요합니다.';
    return null;
  } catch {
    return "유효한 JSON 형식이 아닙니다.";
  }
}

export function formatExpressionShort(expression: string): string {
  try {
    const parsed = JSON.parse(expression);
    return JSON.stringify(parsed).slice(0, 60) + (JSON.stringify(parsed).length > 60 ? "..." : "");
  } catch {
    return expression.slice(0, 60);
  }
}
