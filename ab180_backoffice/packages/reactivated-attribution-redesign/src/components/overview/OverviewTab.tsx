import type { ReactivatedAttributionSettings } from '@/types';
import { formatPeriod } from '@/data/mockData';
import { SettingSummaryCard } from './SettingSummaryCard';
import { HelpSection } from './HelpSection';

interface OverviewTabProps {
  settings: ReactivatedAttributionSettings;
  onNavigateToSettings?: () => void;
}

export function OverviewTab({ settings, onNavigateToSettings }: OverviewTabProps) {
  const inactivityStatus = settings.inactivityWindow ? 'configured' : 'not-configured';
  const inactivityValue = settings.inactivityWindow
    ? formatPeriod(settings.inactivityWindow)
    : '미설정';

  const lookbackChannelCount =
    settings.lookbackWindows.reactivatedInstall.length +
    settings.lookbackWindows.reactivatedOpen.length;
  const lookbackStatus = lookbackChannelCount > 0 ? 'configured' : 'not-configured';
  const lookbackValue = lookbackChannelCount > 0 ? `${lookbackChannelCount}개 설정` : '기본값';

  const attributionChannelCount =
    settings.attributionWindows.reactivatedInstall.length +
    settings.attributionWindows.reactivatedOpen.length +
    settings.attributionWindows.reactivatedDeeplinkOpen.length +
    settings.attributionWindows.reactivatedDeeplinkPageview.length;
  const attributionStatus = attributionChannelCount > 0 ? 'configured' : 'not-configured';
  const attributionValue = attributionChannelCount > 0 ? `${attributionChannelCount}개 설정` : '기본값';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">설정 요약</h2>
        <p className="text-sm text-muted-foreground">
          현재 Reactivated Attribution 설정 현황을 한눈에 확인하세요. 카드를 클릭하면 상세 설정으로 이동합니다.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <SettingSummaryCard
          title="Inactivity Window"
          status={inactivityStatus}
          value={inactivityValue}
          description={
            inactivityStatus === 'configured'
              ? '비활성 기준 기간이 설정되었습니다'
              : '필수 설정입니다. 설정하지 않으면 Reactivation이 동작하지 않습니다.'
          }
          onClick={onNavigateToSettings}
        />
        <SettingSummaryCard
          title="Lookback Window"
          status={lookbackStatus}
          value={lookbackValue}
          description="터치포인트 매칭 기간 설정"
          onClick={onNavigateToSettings}
        />
        <SettingSummaryCard
          title="Attribution Window"
          status={attributionStatus}
          value={attributionValue}
          description="후속 이벤트 어트리뷰션 기간 설정"
          onClick={onNavigateToSettings}
        />
      </div>

      <HelpSection />
    </div>
  );
}
