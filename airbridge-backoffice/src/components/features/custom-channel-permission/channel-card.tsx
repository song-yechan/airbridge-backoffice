import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2 } from "lucide-react";
import type { ChannelPermissionEntry, CampaignFilterType } from "@/types";
import { DataFilterRow } from "./data-filter-row";

interface ChannelCardProps {
  entry: ChannelPermissionEntry;
  index: number;
  onChannelNameChange: (index: number, name: string) => void;
  onAddFilter: (channelIndex: number) => void;
  onRemoveFilter: (channelIndex: number, filterIndex: number) => void;
  onFilterTypeChange: (channelIndex: number, filterIndex: number, type: CampaignFilterType) => void;
  onFilterValueChange: (channelIndex: number, filterIndex: number, value: string) => void;
  onRemoveChannel: (index: number) => void;
}

export function ChannelCard({
  entry,
  index,
  onChannelNameChange,
  onAddFilter,
  onRemoveFilter,
  onFilterTypeChange,
  onFilterValueChange,
  onRemoveChannel,
}: ChannelCardProps) {
  return (
    <div className="rounded-md border p-4 space-y-4">
      <div>
        <label className="text-sm font-medium">Custom Channel</label>
        <Input
          className="mt-1"
          placeholder="대행사에게 노출할 커스텀 채널명 (예: my_custom_channel)"
          value={entry.channel}
          onChange={(e) => onChannelNameChange(index, e.target.value)}
        />
      </div>

      <Separator />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Campaign Filters</label>
          <p className="text-xs text-muted-foreground">
            이 채널에서 대행사가 볼 수 있는 캠페인 범위를 제한합니다
          </p>
        </div>

        {entry.filters.length === 0 && (
          <p className="text-sm text-muted-foreground py-2">
            필터가 없습니다. 이 상태에서는 채널의 모든 캠페인이 대행사에게 노출됩니다.
          </p>
        )}

        {entry.filters.map((filter, fi) => (
          <DataFilterRow
            key={fi}
            type={filter.type}
            value={filter.value}
            onTypeChange={(t) => onFilterTypeChange(index, fi, t)}
            onValueChange={(v) => onFilterValueChange(index, fi, v)}
            onRemove={() => onRemoveFilter(index, fi)}
          />
        ))}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onAddFilter(index)}
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          Add Condition
        </Button>
      </div>

      <Separator />

      <Button
        variant="ghost"
        size="sm"
        className="text-destructive hover:text-destructive"
        onClick={() => onRemoveChannel(index)}
      >
        <Trash2 className="h-3.5 w-3.5 mr-1" />
        Delete Channel Permission
      </Button>
    </div>
  );
}
