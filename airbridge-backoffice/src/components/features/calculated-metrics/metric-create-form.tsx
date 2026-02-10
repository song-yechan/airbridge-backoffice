import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ExpressionEditor } from "./expression-editor";

interface MetricCreateFormProps {
  orgId: string;
  keyValue: string;
  displayName: string;
  expression: string;
  onKeyChange: (v: string) => void;
  onDisplayNameChange: (v: string) => void;
  onExpressionChange: (v: string) => void;
  onSubmit: () => void;
}

export function MetricCreateForm({
  orgId,
  keyValue,
  displayName,
  expression,
  onKeyChange,
  onDisplayNameChange,
  onExpressionChange,
  onSubmit,
}: MetricCreateFormProps) {
  const [isExpressionValid, setIsExpressionValid] = useState(false);

  const isSubmitEnabled = keyValue.trim() !== "" && displayName.trim() !== "" && isExpressionValid;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Calculated Metrics 생성</CardTitle>
        <p className="text-sm text-muted-foreground">
          기존 메트릭(install, revenue 등)을 사칙연산으로 조합하여 새로운 지표를 만듭니다. 예를 들어 CPI = cost / install, CTR = click / impression 등을 정의할 수 있습니다.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Organization ID</label>
          <Input className="mt-1" value={orgId} disabled />
        </div>
        <div>
          <label className="text-sm font-medium">Key</label>
          <Input
            className="mt-1"
            placeholder="영어 소문자, 숫자, 언더스코어만 허용 (예: cost_per_install)"
            value={keyValue}
            onChange={(e) => onKeyChange(e.target.value)}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            조직 내에서 유일해야 합니다. 생성 후 변경할 수 없습니다.
          </p>
        </div>
        <div>
          <label className="text-sm font-medium">Display Name</label>
          <Input
            className="mt-1"
            placeholder="리포트에서 표시되는 이름 (예: CPI)"
            value={displayName}
            onChange={(e) => onDisplayNameChange(e.target.value)}
          />
        </div>

        <ExpressionEditor
          value={expression}
          onChange={onExpressionChange}
          onValidationChange={setIsExpressionValid}
        />

        <Separator />

        <Button className="w-full" onClick={onSubmit} disabled={!isSubmitEnabled}>
          Submit
        </Button>
        {!isSubmitEnabled && (
          <p className="text-xs text-muted-foreground text-center">
            Key, Display Name을 입력하고 Expression 검증을 통과해야 제출할 수 있습니다.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
