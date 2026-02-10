// Expression Types
export type ExpressionType = 'arithmetic' | 'constant' | 'fieldAccess';
export type ArithmeticFn = '+' | '-' | '*' | '/';

export interface ArithmeticExpression {
  type: 'arithmetic';
  fn: ArithmeticFn;
  fields: Expression[];
}

export interface ConstantExpression {
  type: 'constant';
  value: number;
}

export interface FieldAccessExpression {
  type: 'fieldAccess';
  metric: string;
}

export type Expression = ArithmeticExpression | ConstantExpression | FieldAccessExpression;

// Calculated Metric
export interface CalculatedMetric {
  id: number;
  key: string;
  displayName: string;
  expression: string;
  createdAt: string;
}

// Template
export interface Template {
  name: string;
  formula: string;
  expression: string;
}

// Form State
export interface CreateFormState {
  orgId: string;
  key: string;
  displayName: string;
  expression: string;
}

export interface EditFormState {
  key: string;
  displayName: string;
  expression: string;
}
