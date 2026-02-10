import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { UnitSelect } from '@/components/common/UnitSelect';
import { InfoTooltip } from '@/components/common/InfoTooltip';
import { formatPeriod } from '@/data/mockData';
import type { WindowPeriod, TimeUnit } from '@/types';
import { toast } from 'sonner';

interface InactivityWindowProps {
  value: WindowPeriod | null;
  onSave: (period: WindowPeriod) => void;
  onDisable: () => void;
}

export function InactivityWindow({ value, onSave, onDisable }: InactivityWindowProps) {
  const [localValue, setLocalValue] = useState<number>(value?.value ?? 7);
  const [localUnit, setLocalUnit] = useState<TimeUnit>(value?.unit ?? 'days');
  const [isDirty, setIsDirty] = useState(false);

  const handleValueChange = (newValue: string) => {
    const num = parseInt(newValue, 10);
    if (!isNaN(num) && num > 0) {
      setLocalValue(num);
      setIsDirty(true);
    }
  };

  const handleUnitChange = (newUnit: TimeUnit) => {
    setLocalUnit(newUnit);
    setIsDirty(true);
  };

  const handleSave = () => {
    onSave({ value: localValue, unit: localUnit });
    setIsDirty(false);
    toast.success('Inactivity Window가 저장되었습니다.');
  };

  const handleDisable = () => {
    onDisable();
    toast.success('Inactivity Window가 비활성화되었습니다.');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
            1
          </span>
          Inactivity Window
          <span className="ml-1 rounded bg-red-100 px-1.5 py-0.5 text-xs font-medium text-red-700">
            필수
          </span>
          <InfoTooltip content="유저가 앱을 사용하지 않은 것으로 판단하는 기간입니다. 이 기간이 지난 후 앱을 사용하면 Reactivation으로 인식됩니다." />
        </CardTitle>
        <CardDescription>
          비활성 유저 판단 기준 기간을 설정하세요.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!value && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              Inactivity Window가 설정되지 않으면 Reactivation Tracking이 동작하지 않습니다.
            </AlertDescription>
          </Alert>
        )}

        <Accordion type="multiple" defaultValue={value ? ['current', 'edit'] : ['edit']} className="w-full">
          {/* 현재 세팅 */}
          <AccordionItem value="current">
            <AccordionTrigger className="text-sm font-medium">
              <span className="flex items-center gap-2">
                🔍 현재 세팅
              </span>
            </AccordionTrigger>
            <AccordionContent>
              {value ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-md border p-3">
                    <div>
                      <span className="text-sm text-muted-foreground">현재 설정값:</span>
                      <span className="ml-2 font-medium">{formatPeriod(value)}</span>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDisable}
                    >
                      비활성화
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    비활성화 시 Reactivation Tracking이 동작하지 않습니다.
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  현재 설정된 Inactivity Window가 없습니다.
                </p>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* 세팅 추가/변경 */}
          <AccordionItem value="edit">
            <AccordionTrigger className="text-sm font-medium">
              <span className="flex items-center gap-2">
                🔧 세팅 {value ? '변경' : '추가'}
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    min={1}
                    value={localValue}
                    onChange={(e) => handleValueChange(e.target.value)}
                    className="w-24"
                  />
                  <UnitSelect value={localUnit} onChange={handleUnitChange} />
                  <Button onClick={handleSave} disabled={!isDirty && value !== null}>
                    {value ? '변경' : '저장'}
                  </Button>
                  {isDirty && (
                    <span className="text-sm text-muted-foreground">변경사항이 있습니다</span>
                  )}
                </div>

                <div className="rounded-md bg-muted p-3 text-sm">
                  <p className="font-medium">기본값 안내</p>
                  <p className="text-muted-foreground">
                    일반적으로 7일을 권장합니다. 앱 특성에 따라 조정하세요.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
