import { Minus, Plus, AlertTriangle, Check, Loader2, Copy, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import type { EventType, Platform } from "@/types";
import { EVENT_TYPES, DEFAULT_DEDUP_WINDOW } from "@/data/mock";
import { generateDedupKey } from "@/lib/dedup";

interface ConditionSelectorProps {
  appId: string;
  platforms: Platform[];
  eventType: EventType | null;
  dedupWindow: number;
  isApplying: boolean;
  isFormValid: boolean;
  onPlatformsChange: (platforms: Platform[]) => void;
  onEventTypeChange: (eventType: EventType | null) => void;
  onDedupWindowChange: (window: number) => void;
  onApply: () => void;
}

export function ConditionSelector({
  appId,
  platforms,
  eventType,
  dedupWindow,
  isApplying,
  isFormValid,
  onPlatformsChange,
  onEventTypeChange,
  onDedupWindowChange,
  onApply,
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
    onEventTypeChange(selected ?? null);
  };

  const handleWindowChange = (value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num > 0) {
      onDedupWindowChange(num);
    }
  };

  const dedupKey = isFormValid ? generateDedupKey(platforms, eventType!) : null;

  const handleCopy = () => {
    if (dedupKey) {
      navigator.clipboard.writeText(
        `App ID: ${appId}\nDedup Key: ${dedupKey}\nDedup Window: ${dedupWindow} seconds`
      );
      toast.success("설정 정보가 클립보드에 복사되었습니다.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">새 중복 제거 설정</CardTitle>
        <p className="text-sm text-muted-foreground">
          Platform → Event Type → Window 순서로 선택하면 하단에 생성될 설정이 미리보기로 표시됩니다. 확인 후 Apply를 클릭하세요.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Platform */}
        <div className="space-y-3">
          <Label>Platform</Label>
          <Alert variant="default" className="mb-3">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              App, Web 동시 제거는 권장하지 않습니다. 웬만하면 따로 적용해주세요.
            </AlertDescription>
          </Alert>
          <div className="flex gap-6">
            {(["app", "web"] as const).map((platform) => (
              <div key={platform} className="flex items-center space-x-2">
                <Checkbox
                  id={`platform-${platform}`}
                  checked={platforms.includes(platform)}
                  onCheckedChange={(checked) => handlePlatformToggle(platform, checked as boolean)}
                />
                <Label htmlFor={`platform-${platform}`} className="text-sm font-normal cursor-pointer">
                  {platform === "app" ? "App" : "Web"}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Event Type */}
        <div className="space-y-3">
          <Label htmlFor="event-type">Event Type</Label>
          <Select value={eventType?.value || ""} onValueChange={handleEventTypeChange}>
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
              — 기본값: {DEFAULT_DEDUP_WINDOW}초 (24시간)
            </span>
          </Label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onDedupWindowChange(Math.max(1, dedupWindow - 3600))}
              disabled={dedupWindow <= 3600}
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
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => onDedupWindowChange(dedupWindow + 3600)}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              ({Math.floor(dedupWindow / 3600)}시간 {Math.floor((dedupWindow % 3600) / 60)}분)
            </span>
          </div>
        </div>

        {/* Preview */}
        {isFormValid && dedupKey && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  생성될 설정
                </Label>
                <Button variant="ghost" size="sm" onClick={handleCopy}>
                  <Copy className="h-4 w-4 mr-1" />
                  복사
                </Button>
              </div>
              <div className="p-4 bg-muted rounded-lg font-mono text-sm space-y-1">
                <div>
                  <span className="text-muted-foreground">App ID:</span>{" "}
                  <span className="font-semibold">{appId}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Dedup Key:</span>{" "}
                  <span className="font-semibold break-all">{dedupKey}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Dedup Window:</span>{" "}
                  <span className="font-semibold">{dedupWindow} seconds</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Apply */}
        <Separator />
        <Button onClick={onApply} disabled={!isFormValid || isApplying} className="w-full" size="lg">
          {isApplying ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              적용 중...
            </>
          ) : (
            <>
              <Check className="h-4 w-4 mr-2" />
              Apply
            </>
          )}
        </Button>
        {!isFormValid && !isApplying && (
          <p className="text-sm text-muted-foreground text-center">
            Platform과 Event Type을 선택해주세요.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
