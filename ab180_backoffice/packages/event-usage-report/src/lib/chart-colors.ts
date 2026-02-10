export const CHART_COLORS = {
  blue: '#2563EB',
  purple: '#A855F7',
  red: '#F87171',
  yellow: '#EAB308',
  green: '#22C55E',
  orange: '#F97316',
  cyan: '#06B6D4',
  pink: '#EC4899',
} as const;

export const CHART_COLOR_ARRAY = [
  CHART_COLORS.blue,
  CHART_COLORS.purple,
  CHART_COLORS.red,
  CHART_COLORS.yellow,
  CHART_COLORS.green,
  CHART_COLORS.orange,
  CHART_COLORS.cyan,
  CHART_COLORS.pink,
];

export function getChartColor(index: number): string {
  return CHART_COLOR_ARRAY[index % CHART_COLOR_ARRAY.length];
}
