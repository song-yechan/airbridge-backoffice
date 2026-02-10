import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import type { ChannelPermissionEntry, CampaignFilterType } from "@/types";
import { ChannelCard } from "./channel-card";

interface ChannelPermissionEditorProps {
  channels: ChannelPermissionEntry[];
  isDirty: boolean;
  onAddChannel: () => void;
  onRemoveChannel: (index: number) => void;
  onChannelNameChange: (index: number, name: string) => void;
  onAddFilter: (channelIndex: number) => void;
  onRemoveFilter: (channelIndex: number, filterIndex: number) => void;
  onFilterTypeChange: (channelIndex: number, filterIndex: number, type: CampaignFilterType) => void;
  onFilterValueChange: (channelIndex: number, filterIndex: number, value: string) => void;
  onApply: () => void;
}

export function ChannelPermissionEditor({
  channels,
  isDirty,
  onAddChannel,
  onRemoveChannel,
  onChannelNameChange,
  onAddFilter,
  onRemoveFilter,
  onFilterTypeChange,
  onFilterValueChange,
  onApply,
}: ChannelPermissionEditorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Channel Permission</CardTitle>
        <p className="text-sm text-muted-foreground">
          대행사가 대시보드에서 조회할 수 있는 커스텀 채널을 추가하고, 각 채널에서 볼 수 있는 캠페인 범위를 필터로 제한합니다.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md bg-muted p-3 text-sm space-y-3">
          <div>
            <p className="font-medium">사용 방법</p>
            <ol className="mt-1 list-inside list-decimal text-muted-foreground space-y-0.5">
              <li><strong>채널 추가</strong> — 대행사가 접근할 수 있는 커스텀 채널명을 입력합니다.</li>
              <li><strong>필터 조건 추가 (선택)</strong> — 해당 채널 내 특정 캠페인만 보이도록 조건을 설정합니다. 필터가 없으면 채널의 모든 캠페인이 노출됩니다.</li>
              <li><strong>Apply</strong> — 모든 변경을 완료한 뒤 Apply 버튼을 클릭하면 반영됩니다.</li>
            </ol>
          </div>
          <div>
            <p className="font-medium">필터 조건 설명</p>
            <ul className="mt-1 list-inside list-disc text-muted-foreground space-y-0.5">
              <li><strong>starts with</strong> — 캠페인명이 입력값으로 시작 (예: <code className="text-xs bg-background px-1 rounded">summer_</code> → summer_sale, summer_event)</li>
              <li><strong>ends with</strong> — 캠페인명이 입력값으로 끝남 (예: <code className="text-xs bg-background px-1 rounded">_kr</code> → brand_kr, perf_kr)</li>
              <li><strong>is</strong> — 캠페인명이 정확히 일치</li>
              <li><strong>is not</strong> — 해당 캠페인명을 제외</li>
            </ul>
          </div>
          <div className="border-t pt-2 text-muted-foreground">
            <p><strong>주의:</strong> 대시보드에서 대행사 권한을 한 번 이상 수정한 적이 있어야 이 백오피스에서 설정할 수 있습니다. 수정 중 초기화하려면 대행사를 다시 선택하세요.</p>
          </div>
        </div>

        {channels.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            설정된 커스텀 채널 권한이 없습니다. 아래 버튼으로 추가하세요.
          </p>
        )}

        {channels.map((entry, index) => (
          <ChannelCard
            key={index}
            entry={entry}
            index={index}
            onChannelNameChange={onChannelNameChange}
            onAddFilter={onAddFilter}
            onRemoveFilter={onRemoveFilter}
            onFilterTypeChange={onFilterTypeChange}
            onFilterValueChange={onFilterValueChange}
            onRemoveChannel={onRemoveChannel}
          />
        ))}

        <Button variant="outline" onClick={onAddChannel}>
          <Plus className="h-4 w-4 mr-1" />
          Add Custom Channel Permission
        </Button>

        <Separator />

        <Button className="w-full" onClick={onApply} disabled={!isDirty}>
          Apply
        </Button>
      </CardContent>
    </Card>
  );
}
