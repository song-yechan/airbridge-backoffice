import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer } from "@/components/shared/chart-container";
import {
  COLLECTION_DATA,
  COLLECTION_EVENT_SOURCES,
  COLLECTION_SQL,
} from "@/data/event-usage-mock";

export function CollectionStatusSection() {
  return (
    <section>
      <div className="mb-4">
        <div className="flex items-center gap-2 text-base font-semibold mb-1">
          Event Collection Status
          <Badge variant="secondary" className="font-medium">
            최근 30일 고정
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          이 앱에서 수집되고 있는 전체 이벤트의 일별 추이입니다.
          이벤트 소스별로 수집량이 정상적인지 한눈에 확인할 수 있습니다.
        </p>
      </div>

      <Card>
        <CardContent className="p-5 px-6">
          <ChartContainer
            data={COLLECTION_DATA}
            series={COLLECTION_EVENT_SOURCES}
            sql={COLLECTION_SQL}
            tableDescription={{
              firstCol: "수집일",
              rest: "event_source별 이벤트 수집 건수",
            }}
          />
        </CardContent>
      </Card>
    </section>
  );
}
