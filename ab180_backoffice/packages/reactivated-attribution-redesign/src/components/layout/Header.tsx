import type { AppInfo } from '@/types';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  appInfo: AppInfo;
}

export function Header({ appInfo }: HeaderProps) {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
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
              >
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M8 16H3v5" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold">Reactivated Attribution</h1>
              <p className="text-sm text-muted-foreground">비활성 유저 재활성화 어트리뷰션 설정</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
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
        </div>
      </div>
    </header>
  );
}
