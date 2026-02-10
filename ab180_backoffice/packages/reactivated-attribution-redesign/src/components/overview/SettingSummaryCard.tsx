import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SettingSummaryCardProps {
  title: string;
  status: 'configured' | 'not-configured' | 'partial';
  value: string;
  description: string;
  onClick?: () => void;
}

export function SettingSummaryCard({
  title,
  status,
  value,
  description,
  onClick,
}: SettingSummaryCardProps) {
  const statusConfig = {
    configured: {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-green-600"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    'not-configured': {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-red-600"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
    partial: {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-yellow-600"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
    },
  };

  const config = statusConfig[status];

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:shadow-md',
        config.bgColor,
        config.borderColor
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-medium text-foreground">{title}</h3>
            <p className="mt-1 text-2xl font-semibold">{value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
          <div className="ml-4">{config.icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}
