import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { FilterType, DataFilter } from "@/types";

interface AddFilterDialogProps {
  channelName: string;
  onAdd: (filter: DataFilter) => void;
  trigger?: React.ReactNode;
}

const filterTypeOptions: { value: FilterType; label: string; description: string }[] = [
  {
    value: "startswith",
    label: "startswith",
    description: "캠페인명이 특정 문자열로 시작",
  },
  {
    value: "endswith",
    label: "endswith",
    description: "캠페인명이 특정 문자열로 끝남",
  },
  {
    value: "is",
    label: "is",
    description: "캠페인명이 정확히 일치",
  },
  {
    value: "is_not",
    label: "is_not",
    description: "캠페인명이 일치하지 않음",
  },
];

export function AddFilterDialog({
  channelName,
  onAdd,
  trigger,
}: AddFilterDialogProps) {
  const [open, setOpen] = useState(false);
  const [filterType, setFilterType] = useState<FilterType>("startswith");
  const [currentValue, setCurrentValue] = useState("");
  const [values, setValues] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleAddValue = () => {
    const trimmed = currentValue.trim();
    if (!trimmed) {
      setError("값을 입력해주세요");
      return;
    }
    if (values.includes(trimmed)) {
      setError("이미 추가된 값입니다");
      return;
    }
    setValues([...values, trimmed]);
    setCurrentValue("");
    setError(null);
  };

  const handleRemoveValue = (index: number) => {
    setValues(values.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddValue();
    }
  };

  const handleSubmit = () => {
    if (values.length === 0) {
      setError("최소 하나의 값을 추가해주세요");
      return;
    }

    onAdd({
      type: filterType,
      values: values,
      field: "campaign",
    });

    // Reset
    setFilterType("startswith");
    setCurrentValue("");
    setValues([]);
    setError(null);
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset on close
      setFilterType("startswith");
      setCurrentValue("");
      setValues([]);
      setError(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-1" />
            필터 추가
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Data Filter 추가</DialogTitle>
          <DialogDescription>
            <Badge variant="secondary">{channelName}</Badge> 채널에 캠페인 필터를
            추가합니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="filter-type">필터 타입</Label>
            <Select
              value={filterType}
              onValueChange={(v) => setFilterType(v as FilterType)}
            >
              <SelectTrigger id="filter-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {filterTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex flex-col">
                      <span className="font-mono">{option.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {option.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="filter-value">필터 값</Label>
            <div className="flex gap-2">
              <Input
                id="filter-value"
                placeholder="값을 입력하고 Enter 또는 추가 버튼"
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddValue}
                disabled={!currentValue.trim()}
              >
                추가
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              여러 개의 값을 추가할 수 있습니다. OR 조건으로 적용됩니다.
            </p>
          </div>

          {values.length > 0 && (
            <div className="space-y-2">
              <Label>추가된 값</Label>
              <div className="flex flex-wrap gap-2">
                {values.map((value, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="font-mono text-xs pr-1"
                  >
                    {value}
                    <button
                      type="button"
                      onClick={() => handleRemoveValue(index)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            취소
          </Button>
          <Button onClick={handleSubmit} disabled={values.length === 0}>
            추가
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
