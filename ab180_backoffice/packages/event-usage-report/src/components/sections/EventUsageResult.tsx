import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ChartContainer } from '@/components/charts/ChartContainer';
import { CHART_COLORS } from '@/lib/chart-colors';
import {
  reportUsageData,
  reportUsageApis,
  reportUsageSql,
  postbackData,
  postbackTargets,
  postbackSql,
} from '@/data/mock';

interface EventUsageResultProps {
  eventId: string;
  defaultOpen?: boolean;
}

export function EventUsageResult({
  eventId,
  defaultOpen = false,
}: EventUsageResultProps) {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={defaultOpen ? eventId : undefined}
    >
      <AccordionItem value={eventId} className="border rounded-lg mb-2">
        <AccordionTrigger className="px-5 py-3.5 text-sm font-medium hover:bg-muted/50 hover:no-underline">
          {eventId} usage status
        </AccordionTrigger>
        <AccordionContent className="border-t">
          {/* Report Usage Section */}
          <div className="p-5 px-6 border-b">
            <div className="flex items-center gap-1.5 text-[13px] font-semibold mb-1">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: CHART_COLORS.blue }}
              />
              Report Usage
            </div>
            <p className="text-xs text-muted-foreground mb-3.5 leading-relaxed">
              이 이벤트({eventId})가 Airbridge 리포트에서 조회된 횟수입니다. 어떤
              리포트 유형(actuals, funnel, retention 등)에서 사용되었는지 확인할
              수 있습니다. 수치가 높을수록 고객이 이 이벤트를 리포트에서 활발히
              조회하고 있다는 뜻입니다.
            </p>
            <ChartContainer
              data={reportUsageData}
              series={reportUsageApis}
              sql={reportUsageSql}
              chartHeight={180}
              tableDescription={{
                firstCol: '조회일',
                rest: '리포트 API별 조회 횟수',
              }}
            />
          </div>

          {/* Postback Sent Status Section */}
          <div className="p-5 px-6">
            <div className="flex items-center gap-1.5 text-[13px] font-semibold mb-1">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: CHART_COLORS.orange }}
              />
              Postback Sent Status
            </div>
            <p className="text-xs text-muted-foreground mb-3.5 leading-relaxed">
              이 이벤트({eventId})가 외부 광고 매체(Facebook, Google, Appier
              등)로 발송된 포스트백 횟수입니다. 특정 매체의 수치가 0이면 포스트백
              설정이나 발송에 문제가 있을 수 있습니다. google.adwords 계열은 전체
              이벤트를 전송하므로 이 차트에서 제외됩니다.
            </p>
            <ChartContainer
              data={postbackData}
              series={postbackTargets}
              sql={postbackSql}
              chartHeight={180}
              tableDescription={{
                firstCol: '발송일',
                rest: '매체별 포스트백 발송 횟수',
              }}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
