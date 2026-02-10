import { cn } from '@/lib/utils';

interface NudgeProps {
  variant: 'tip' | 'info';
  children: React.ReactNode;
  className?: string;
}

export function Nudge({ variant, children, className }: NudgeProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-2.5 px-4 py-3 rounded-lg text-[13px] leading-relaxed',
        variant === 'tip' &&
          'bg-amber-50 border border-amber-200 text-foreground',
        variant === 'info' && 'bg-muted border text-foreground',
        className
      )}
    >
      <span
        className={cn(
          'flex-shrink-0 w-[18px] h-[18px] flex items-center justify-center rounded-full text-[11px] font-bold mt-0.5',
          variant === 'tip' && 'bg-amber-200 text-amber-700',
          variant === 'info' && 'bg-border text-muted-foreground'
        )}
      >
        {variant === 'tip' ? '!' : '?'}
      </span>
      <div>{children}</div>
    </div>
  );
}
