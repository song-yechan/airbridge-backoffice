import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import type { CampaignFilterType } from "@/types";
import { FILTER_TYPE_OPTIONS } from "@/data/custom-channel-permission-mock";

interface DataFilterRowProps {
  type: CampaignFilterType;
  value: string;
  onTypeChange: (type: CampaignFilterType) => void;
  onValueChange: (value: string) => void;
  onRemove: () => void;
}

export function DataFilterRow({
  type,
  value,
  onTypeChange,
  onValueChange,
  onRemove,
}: DataFilterRowProps) {
  return (
    <div className="flex items-center gap-2">
      <Select value={type} onValueChange={(v) => onTypeChange(v as CampaignFilterType)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {FILTER_TYPE_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        placeholder="캠페인명 또는 접두사/접미사 (예: summer_sale)"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className="flex-1"
      />
      <Button variant="ghost" size="icon" onClick={onRemove}>
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
}
