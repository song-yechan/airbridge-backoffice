import { format } from 'date-fns';

export function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

export function formatDateRange(from: Date | null, to: Date | null): string {
  if (!from) return 'Select date range';
  if (!to) return `${formatDate(from)} – ...`;
  return `${formatDate(from)} – ${formatDate(to)}`;
}
