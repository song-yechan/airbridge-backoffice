import type { AppInfo } from '@/types';

interface AppBarProps {
  app: AppInfo;
}

export function AppBar({ app }: AppBarProps) {
  const initial = app.name.charAt(0).toUpperCase();

  return (
    <div className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-muted border rounded-lg mb-6">
      <div
        className="w-[30px] h-[30px] rounded-[7px] flex items-center justify-center text-white font-bold text-[13px] flex-shrink-0"
        style={{
          background: 'linear-gradient(135deg, #F97316, #FB923C)',
        }}
      >
        {initial}
      </div>
      <div>
        <div className="text-sm font-semibold">{app.name}</div>
        <div className="text-xs text-muted-foreground font-mono">
          ID: {app.id} · {app.timezone}
        </div>
      </div>
    </div>
  );
}
