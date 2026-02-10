import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Nudge } from '@/components/shared/Nudge';
import { ChartContainer } from '@/components/charts/ChartContainer';
import {
  collectionData,
  collectionEventSources,
  collectionSql,
} from '@/data/mock';

export function CollectionStatusSection() {
  return (
    <section className="mb-9">
      <div className="mb-4">
        <div className="flex items-center gap-2 text-base font-semibold mb-1">
          Event Collection Status
          <Badge variant="secondary" className="font-medium">
            최근 30일 고정
          </Badge>
        </div>
        <p className="text-[13px] text-muted-foreground">
          이 앱에서 수집되고 있는 전체 이벤트의 일별 추이입니다. 이벤트 소스별로
          수집량이 정상적인지 한눈에 확인할 수 있습니다.
        </p>
      </div>

      <Card>
        <CardContent className="p-5 px-6">
          <ChartContainer
            data={collectionData}
            series={collectionEventSources}
            sql={collectionSql}
            tableDescription={{
              firstCol: '수집일',
              rest: 'event_source별 이벤트 수집 건수',
            }}
          />
          <Nudge variant="info" className="mt-3">
            <span>
              각 선은 <strong>이벤트 소스(event_source)</strong>별 수집량입니다.
              특정 소스의 수치가 갑자기 0이 되거나 급감하면 해당 소스에서 이벤트
              수집에 문제가 있을 수 있습니다.
            </span>
          </Nudge>
        </CardContent>
      </Card>
    </section>
  );
}
