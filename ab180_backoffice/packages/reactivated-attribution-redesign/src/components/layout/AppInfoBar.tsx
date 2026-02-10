import type { AppInfo } from '@/types';
import { Badge } from '@/components/ui/badge';

interface AppInfoBarProps {
  appInfo: AppInfo;
}

export function AppInfoBar({ appInfo }: AppInfoBarProps) {
  return (
    <div className="flex items-center gap-2 mb-6">
      <Badge variant="secondary" className="gap-1.5">
        <span className="font-medium">App:</span> {appInfo.name}
      </Badge>
      <Badge variant="outline" className="gap-1.5">
        <span className="font-medium">ID:</span> {appInfo.id}
      </Badge>
      <Badge variant="outline" className="gap-1.5">
        <span className="font-medium">Timezone:</span> {appInfo.timezone}
      </Badge>
    </div>
  );
}
