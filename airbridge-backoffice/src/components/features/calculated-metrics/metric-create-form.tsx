import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ExpressionEditor } from "./expression-editor";
import { toast } from "sonner";

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

interface FieldErrors {
  key: boolean;
  displayName: boolean;
  expression: boolean;
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
  const [errors, setErrors] = useState<FieldErrors>({ key: false, displayName: false, expression: false });
  const [isExpressionValidated, setIsExpressionValidated] = useState(false);

  const handleExpressionValidation = (isValid: boolean) => {
    setIsExpressionValidated(isValid);
    if (isValid && errors.expression) setErrors((prev) => ({ ...prev, expression: false }));
  };

  const handleSubmit = () => {
    const newErrors: FieldErrors = {
      key: keyValue.trim() === "",
      displayName: displayName.trim() === "",
      expression: !isExpressionValidated,
    };
    setErrors(newErrors);

    if (newErrors.key) {
      toast.error("Key를 입력해주세요.");
      return;
    }
    if (newErrors.displayName) {
      toast.error("Display Name을 입력해주세요.");
      return;
    }
    if (newErrors.expression) {
      toast.error("Expression 검증 버튼을 클릭하여 검증을 통과해주세요.");
      return;
    }

    onSubmit();
    setErrors({ key: false, displayName: false, expression: false });
    setIsExpressionValidated(false);
  };

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
          <label className={`text-sm font-medium ${errors.key ? "text-destructive" : ""}`}>
            Key {errors.key && <span className="font-normal">— 필수 입력</span>}
          </label>
          <Input
            className={`mt-1 ${errors.key ? "border-destructive" : ""}`}
            placeholder="영어 소문자, 숫자, 언더스코어만 허용 (예: cost_per_install)"
            value={keyValue}
            onChange={(e) => {
              onKeyChange(e.target.value);
              if (errors.key) setErrors((prev) => ({ ...prev, key: false }));
            }}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            조직 내에서 유일해야 합니다. 생성 후 변경할 수 없습니다.
          </p>
        </div>
        <div>
          <label className={`text-sm font-medium ${errors.displayName ? "text-destructive" : ""}`}>
            Display Name {errors.displayName && <span className="font-normal">— 필수 입력</span>}
          </label>
          <Input
            className={`mt-1 ${errors.displayName ? "border-destructive" : ""}`}
            placeholder="리포트에서 표시되는 이름 (예: CPI)"
            value={displayName}
            onChange={(e) => {
              onDisplayNameChange(e.target.value);
              if (errors.displayName) setErrors((prev) => ({ ...prev, displayName: false }));
            }}
          />
        </div>

        <ExpressionEditor
          value={expression}
          onChange={(v) => {
            onExpressionChange(v);
            setIsExpressionValidated(false);
            if (errors.expression) setErrors((prev) => ({ ...prev, expression: false }));
          }}
          onValidationChange={handleExpressionValidation}
          hasError={errors.expression}
        />

        <Separator />

        <Button className="w-full" onClick={handleSubmit}>
          Submit
        </Button>
      </CardContent>
    </Card>
  );
}
