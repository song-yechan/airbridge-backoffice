import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { UnitSelect } from "@/components/shared/unit-select";
import { formatPeriod } from "@/data/reactivated-attribution-mock";
import type { WindowPeriod, TimeUnit } from "@/types";

interface InactivityWindowProps {
  value: WindowPeriod | null;
  onSave: (period: WindowPeriod) => void;
  onDisable: () => void;
}

export function InactivityWindow({ value, onSave, onDisable }: InactivityWindowProps) {
  const [localValue, setLocalValue] = useState<number>(value?.value ?? 7);
  const [localUnit, setLocalUnit] = useState<TimeUnit>(value?.unit ?? "days");

  const handleValueChange = (newValue: string) => {
    const num = parseInt(newValue, 10);
    if (!isNaN(num) && num > 0) {
      setLocalValue(num);
    }
  };

  const handleSave = () => {
    onSave({ value: localValue, unit: localUnit });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          Inactivity Window
          <Badge variant="destructive" className="text-xs">필수</Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          유저가 앱을 사용하지 않은 것으로 판단하는 기간입니다.
          이 기간이 지난 후 앱을 사용하면 Reactivation으로 인식됩니다.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {!value && (
          <Alert variant="destructive">
            <AlertDescription>
              Inactivity Window가 설정되지 않으면 Reactivation Tracking이 동작하지 않습니다.
            </AlertDescription>
          </Alert>
        )}

        {/* 현재 설정 */}
        {value && (
          <div className="flex items-center justify-between rounded-md border p-3">
            <div>
              <span className="text-sm text-muted-foreground">현재 설정값:</span>
              <span className="ml-2 font-medium">{formatPeriod(value)}</span>
            </div>
            <Button variant="destructive" size="sm" onClick={onDisable}>
              비활성화
            </Button>
          </div>
        )}

        {/* 설정 변경 */}
        <div className="space-y-3">
          <p className="text-sm font-medium">{value ? "설정 변경" : "설정 추가"}</p>
          <div className="flex items-center gap-3">
            <Input
              type="number"
              min={1}
              value={localValue}
              onChange={(e) => handleValueChange(e.target.value)}
              className="w-24"
            />
            <UnitSelect value={localUnit} onChange={setLocalUnit} />
            <Button onClick={handleSave}>
              {value ? "변경" : "저장"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            일반적으로 7일을 권장합니다. 앱 특성에 따라 조정하세요.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
