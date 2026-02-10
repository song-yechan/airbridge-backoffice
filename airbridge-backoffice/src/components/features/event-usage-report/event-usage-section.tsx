import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { EventChipsInput } from "./event-chips-input";
import { EventUsageResult } from "./event-usage-result";
import type { EventChip, DateRange } from "@/types";

interface EventUsageSectionProps {
  dateRange: DateRange;
  selectedEvents: EventChip[];
  availableEvents: EventChip[];
  results: string[];
  isQuerying: boolean;
  onDateRangeChange: (range: DateRange) => void;
  onAddEvent: (chip: EventChip) => void;
  onRemoveEvent: (chipId: string) => void;
  onClearEvents: () => void;
  onRunQuery: () => void;
}

export function EventUsageSection({
  dateRange,
  selectedEvents,
  availableEvents,
  results,
  isQuerying,
  onDateRangeChange,
  onAddEvent,
  onRemoveEvent,
  onClearEvents,
  onRunQuery,
}: EventUsageSectionProps) {
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-base font-semibold mb-1">Event Usage</h2>
        <p className="text-sm text-muted-foreground">
          특정 이벤트가 리포트에서 조회된 횟수(Report Usage)와
          외부 매체로 발송된 횟수(Postback)를 확인할 수 있습니다.
          아래에서 조회 기간을 설정하고 이벤트를 추가한 뒤 Run Query를 눌러주세요.
        </p>
      </div>

      <Card className="mb-4">
        <CardContent className="p-5 space-y-4">
          {/* Date Range */}
          <div className="flex gap-3 items-end flex-wrap">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium">
                Date <span className="font-normal text-muted-foreground">(최대 31일)</span>
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => onDateRangeChange({ ...dateRange, from: e.target.value })}
                  className="w-[160px] font-mono text-sm"
                />
                <span className="text-muted-foreground">–</span>
                <Input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => onDateRangeChange({ ...dateRange, to: e.target.value })}
                  className="w-[160px] font-mono text-sm"
                />
              </div>
            </div>
            <Button onClick={onRunQuery} disabled={isQuerying}>
              {isQuerying ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Querying...
                </>
              ) : (
                "Run Query"
              )}
            </Button>
          </div>

          {/* Event Chips */}
          <div>
            <Label className="text-sm font-medium mb-2 block">
              조회할 이벤트 <span className="font-normal text-muted-foreground">(검색 후 클릭하여 추가)</span>
            </Label>
            <EventChipsInput
              chips={selectedEvents}
              availableEvents={availableEvents}
              onAdd={onAddEvent}
              onRemove={onRemoveEvent}
              onClear={onClearEvents}
            />
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-2">
          {results.map((eventId, index) => (
            <EventUsageResult
              key={eventId}
              eventId={eventId}
              defaultOpen={index === 0}
            />
          ))}
        </div>
      )}
    </section>
  );
}
