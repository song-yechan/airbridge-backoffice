import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Nudge } from '@/components/shared/Nudge';
import { DateRangePicker } from '@/components/date-picker/DateRangePicker';
import { EventChipsInput } from '@/components/event-input/EventChipsInput';
import { EventUsageResult } from './EventUsageResult';
import { useEventChips } from '@/hooks/useEventChips';
import { availableEvents } from '@/data/mock';
import type { DateRange, EventChip } from '@/types';

// 초기 날짜 범위
const initialDateRange: DateRange = {
  from: new Date(2026, 0, 28), // 2026-01-28
  to: new Date(2026, 1, 4), // 2026-02-04
};

// 초기 선택된 이벤트
const initialChips: EventChip[] = [
  { id: '9161', label: '9161' },
  { id: '9360$ad_banner_click', label: '9360$ad_banner_click' },
  { id: '9360$add_family_doctor', label: '9360$add_family_doctor' },
];

export function EventUsageSection() {
  const [dateRange, setDateRange] = useState<DateRange>(initialDateRange);
  const { chips, addChip, removeChip, clearChips } =
    useEventChips(initialChips);
  const [results, setResults] = useState<string[]>(['9161']);

  const handleRunQuery = () => {
    // 선택된 이벤트 ID들을 결과로 설정
    setResults(chips.map((c) => c.id));
  };

  return (
    <section className="mb-9">
      <div className="mb-4">
        <h2 className="text-base font-semibold mb-1">Event Usage</h2>
        <p className="text-[13px] text-muted-foreground">
          특정 이벤트를 선택하면, 해당 이벤트가 리포트에서 조회된 횟수(Report
          Usage)와 외부 매체로 발송된 횟수(Postback)를 함께 확인할 수 있습니다.
        </p>
      </div>

      <Nudge variant="tip" className="mb-4">
        <div>
          <strong>사용 방법</strong> — 아래에서 조회 기간을 선택하고, 확인할
          이벤트를 추가한 뒤 <strong>Run Query</strong>를 누르세요. 선택한
          이벤트별로 결과가 펼침 목록으로 표시됩니다.
        </div>
      </Nudge>

      {/* Controls */}
      <div className="flex gap-3 items-end flex-wrap mb-4">
        <div className="flex flex-col gap-1.5">
          <Label className="text-[13px] font-medium">
            Date <span className="font-normal text-muted-foreground">(최대 31일)</span>
          </Label>
          <DateRangePicker value={dateRange} onChange={setDateRange} />
        </div>
        <Button onClick={handleRunQuery}>Run Query</Button>
      </div>

      {/* Event Chips Input */}
      <div className="mb-5">
        <Label className="text-[13px] font-medium mb-2 block">
          Events want to check usage:
        </Label>
        <EventChipsInput
          chips={chips}
          availableEvents={availableEvents}
          onAdd={addChip}
          onRemove={removeChip}
          onClear={clearChips}
        />
      </div>

      {/* Results */}
      <div>
        {results.map((eventId, index) => (
          <EventUsageResult
            key={eventId}
            eventId={eventId}
            defaultOpen={index === 0}
          />
        ))}
      </div>
    </section>
  );
}
