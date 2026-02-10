import { Minus, Plus, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { EventType, Platform } from "@/types";
import { EVENT_TYPES, DEFAULT_DEDUP_WINDOW } from "@/data/mock";

interface ConditionSelectorProps {
  platforms: Platform[];
  eventType: EventType | null;
  dedupWindow: number;
  onPlatformsChange: (platforms: Platform[]) => void;
  onEventTypeChange: (eventType: EventType | null) => void;
  onDedupWindowChange: (window: number) => void;
  disabled?: boolean;
}

export function ConditionSelector({
  platforms,
  eventType,
  dedupWindow,
  onPlatformsChange,
  onEventTypeChange,
  onDedupWindowChange,
  disabled = false,
}: ConditionSelectorProps) {
  const handlePlatformToggle = (platform: Platform, checked: boolean) => {
    if (checked) {
      onPlatformsChange([...platforms, platform]);
    } else {
      onPlatformsChange(platforms.filter((p) => p !== platform));
    }
  };

  const handleEventTypeChange = (value: string) => {
    const selected = EVENT_TYPES.find((et) => et.value === value);
    onEventTypeChange(selected || null);
  };

  const handleWindowChange = (value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num > 0) {
      onDedupWindowChange(num);
    }
  };

  const adjustWindow = (delta: number) => {
    const newValue = Math.max(1, dedupWindow + delta);
    onDedupWindowChange(newValue);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">1. 중복 제거 조건 선택</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Platform Selection */}
        <div className="space-y-3">
          <Label>Platform</Label>
          <Alert variant="default" className="mb-3">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              적용 Platform을 선택해주세요. App, Web 동시 제거는 권장하지 않으니 웬만하면 따로 따로 적용해주세요.
            </AlertDescription>
          </Alert>
          <div className="flex gap-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="platform-app"
                checked={platforms.includes("app")}
                onCheckedChange={(checked) =>
                  handlePlatformToggle("app", checked as boolean)
                }
                disabled={disabled}
              />
              <Label
                htmlFor="platform-app"
                className="text-sm font-normal cursor-pointer"
              >
                App
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="platform-web"
                checked={platforms.includes("web")}
                onCheckedChange={(checked) =>
                  handlePlatformToggle("web", checked as boolean)
                }
                disabled={disabled}
              />
              <Label
                htmlFor="platform-web"
                className="text-sm font-normal cursor-pointer"
              >
                Web
              </Label>
            </div>
          </div>
        </div>

        {/* Event Type Selection */}
        <div className="space-y-3">
          <Label htmlFor="event-type">Event Type</Label>
          <Select
            value={eventType?.value || ""}
            onValueChange={handleEventTypeChange}
            disabled={disabled}
          >
            <SelectTrigger id="event-type">
              <SelectValue placeholder="이벤트 종류를 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {EVENT_TYPES.map((et) => (
                <SelectItem key={et.value} value={et.value}>
                  {et.label} ({et.value})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Dedup Window */}
        <div className="space-y-3">
          <Label htmlFor="dedup-window">
            Window (seconds){" "}
            <span className="text-muted-foreground font-normal">
              - 기본값: {DEFAULT_DEDUP_WINDOW}초 (24시간)
            </span>
          </Label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => adjustWindow(-3600)}
              disabled={disabled || dedupWindow <= 3600}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              id="dedup-window"
              type="number"
              min="1"
              value={dedupWindow}
              onChange={(e) => handleWindowChange(e.target.value)}
              className="w-32 text-center"
              disabled={disabled}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => adjustWindow(3600)}
              disabled={disabled}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              ({Math.floor(dedupWindow / 3600)}시간{" "}
              {Math.floor((dedupWindow % 3600) / 60)}분)
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
