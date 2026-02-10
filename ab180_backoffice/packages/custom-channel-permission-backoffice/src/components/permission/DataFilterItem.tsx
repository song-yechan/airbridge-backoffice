import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { DataFilter, FilterType } from "@/types";

interface DataFilterItemProps {
  filter: DataFilter;
  onDelete?: () => void;
  readonly?: boolean;
}

const filterTypeLabels: Record<FilterType, string> = {
  startswith: "시작",
  endswith: "끝",
  is: "일치",
  is_not: "불일치",
};

const filterTypeColors: Record<FilterType, "default" | "secondary" | "outline"> = {
  startswith: "default",
  endswith: "secondary",
  is: "outline",
  is_not: "outline",
};

export function DataFilterItem({
  filter,
  onDelete,
  readonly = false,
}: DataFilterItemProps) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50 border">
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant={filterTypeColors[filter.type]} className="shrink-0">
            {filterTypeLabels[filter.type]}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>필터 타입: {filter.type}</p>
        </TooltipContent>
      </Tooltip>

      <div className="flex-1 flex flex-wrap gap-1">
        {filter.values.map((value, index) => (
          <Badge key={index} variant="secondary" className="font-mono text-xs">
            {value}
          </Badge>
        ))}
      </div>

      {!readonly && onDelete && (
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
          onClick={onDelete}
        >
          <X className="h-3 w-3" />
          <span className="sr-only">필터 삭제</span>
        </Button>
      )}
    </div>
  );
}
