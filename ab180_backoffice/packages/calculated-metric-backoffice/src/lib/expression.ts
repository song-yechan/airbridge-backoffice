import type { Expression } from '@/types';

// Expression을 사람이 읽을 수 있는 수식으로 변환
export function parseExpression(expr: Expression): string {
  if (!expr) return '';

  if (expr.type === 'constant') {
    return String(expr.value);
  }

  if (expr.type === 'fieldAccess') {
    return expr.metric;
  }

  if (expr.type === 'arithmetic' && Array.isArray(expr.fields)) {
    return expr.fields
      .map((field, index) => {
        const result = parseExpression(field);
        // 중첩된 arithmetic의 경우 괄호로 감싸기
        if (index > 0 && field.type === 'arithmetic') {
          return `(${result})`;
        }
        return result;
      })
      .join(` ${expr.fn} `);
  }

  return '?';
}

// JSON 문자열을 파싱하여 수식 문자열 반환
export function expressionToFormula(jsonStr: string): string {
  try {
    const expr = JSON.parse(jsonStr) as Expression;
    return parseExpression(expr);
  } catch {
    return '';
  }
}

// JSON 유효성 검증
export function validateJson(jsonStr: string): { valid: boolean; error?: string } {
  if (!jsonStr.trim()) {
    return { valid: false, error: 'Expression is required' };
  }

  try {
    const parsed = JSON.parse(jsonStr);

    // 기본 구조 확인
    if (!parsed.type) {
      return { valid: false, error: 'Missing "type" field' };
    }

    if (!['arithmetic', 'constant', 'fieldAccess'].includes(parsed.type)) {
      return { valid: false, error: 'Invalid type. Must be arithmetic, constant, or fieldAccess' };
    }

    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid JSON format. Check braces, commas, and quotes.' };
  }
}

// Key 유효성 검증 (영어 소문자 + 언더스코어만)
export function validateKey(key: string): { valid: boolean; error?: string } {
  if (!key) {
    return { valid: false, error: 'Key is required' };
  }

  if (!/^[a-z_]+$/.test(key)) {
    return { valid: false, error: 'Only lowercase letters and underscores (_) are allowed' };
  }

  return { valid: true };
}

// JSON을 보기 좋게 포맷팅
export function formatJson(jsonStr: string): string {
  try {
    return JSON.stringify(JSON.parse(jsonStr), null, 2);
  } catch {
    return jsonStr;
  }
}
