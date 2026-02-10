import { cn } from '@/lib/utils';

interface ExpressionPreviewProps {
  formula: string;
  className?: string;
}

export function ExpressionPreview({ formula, className }: ExpressionPreviewProps) {
  if (!formula) return null;

  return (
    <div
      className={cn(
        'border border-green-200 rounded-lg bg-green-50 px-4 py-3 mt-2',
        className
      )}
    >
      <div className="text-xs text-green-700 font-medium mb-1">
        📐 수식 미리보기
      </div>
      <div className="text-sm font-mono font-semibold text-green-900">
        {formula}
      </div>
    </div>
  );
}
