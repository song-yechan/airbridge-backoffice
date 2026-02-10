import { useState } from "react";
import { Button } from "@/components/ui/button";
import { validateExpression } from "@/data/calculated-metrics-mock";
import { EXPRESSION_TEMPLATES } from "@/data/calculated-metrics-mock";
import { Check, X } from "lucide-react";

interface ExpressionEditorProps {
  value: string;
  onChange: (v: string) => void;
}

export function ExpressionEditor({ value, onChange }: ExpressionEditorProps) {
  const [validationResult, setValidationResult] = useState<string | null | "valid">(null);

  const handleValidate = () => {
    const error = validateExpression(value);
    setValidationResult(error ?? "valid");
  };

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(value);
      onChange(JSON.stringify(parsed, null, 2));
      setValidationResult("valid");
    } catch {
      setValidationResult("유효한 JSON 형식이 아닙니다.");
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Expression</label>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={handleFormat}>
            Format
          </Button>
          <Button variant="ghost" size="sm" onClick={handleValidate}>
            검증
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_1fr] gap-4">
        <textarea
          className="min-h-[200px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm font-mono shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y"
          placeholder='{\n  "type": "arithmetic",\n  "fn": "/",\n  "fields": [...]\n}'
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setValidationResult(null);
          }}
          onBlur={handleValidate}
        />
        <div className="rounded-md bg-muted p-3 text-xs space-y-3 overflow-y-auto max-h-[240px]">
          <div>
            <p className="font-medium text-sm">Expression 작성 가이드</p>
            <p className="text-muted-foreground mt-1">JSON으로 수식을 정의합니다. 최상위에 <code className="bg-background px-1 rounded">type</code>을 지정하는 것으로 시작합니다.</p>
          </div>
          <div className="space-y-2 text-muted-foreground">
            <div>
              <p><strong>arithmetic</strong> — 사칙연산 (두 값을 계산)</p>
              <ul className="list-inside list-disc ml-2">
                <li><strong>fn</strong>: 연산자 (+, -, *, /)</li>
                <li><strong>fields</strong>: 피연산자 2개 (각각 arithmetic, constant, fieldAccess 중 하나)</li>
              </ul>
              <p className="mt-0.5 ml-2 text-muted-foreground/70">예: CPI = cost / install → <code className="bg-background px-1 rounded">{"{"}"type":"arithmetic", "fn":"/", "fields":[cost, install]{"}"}</code></p>
            </div>
            <div>
              <p><strong>fieldAccess</strong> — 기존 메트릭 참조</p>
              <ul className="list-inside list-disc ml-2">
                <li><strong>metric</strong>: 참조할 메트릭 key (예: cost, install, click)</li>
              </ul>
              <p className="mt-0.5 ml-2 text-muted-foreground/70">Calculated Metric은 참조 불가 — 기본 메트릭만 사용</p>
            </div>
            <div>
              <p><strong>constant</strong> — 고정 숫자값</p>
              <ul className="list-inside list-disc ml-2">
                <li><strong>value</strong>: 정수 또는 소수 (예: 1000, 0.01)</li>
              </ul>
              <p className="mt-0.5 ml-2 text-muted-foreground/70">CPM처럼 1000을 곱할 때 사용</p>
            </div>
          </div>
          <div className="border-t pt-2 text-muted-foreground">
            <p><strong>Tip:</strong> 아래 템플릿 버튼을 클릭하면 대표적인 수식이 자동 입력됩니다. 이를 수정하여 사용하세요.</p>
          </div>
        </div>
      </div>

      {validationResult !== null && (
        <div className={`flex items-center gap-1 text-sm ${validationResult === "valid" ? "text-green-600" : "text-destructive"}`}>
          {validationResult === "valid" ? (
            <><Check className="h-4 w-4" /> 유효한 JSON 형식입니다</>
          ) : (
            <><X className="h-4 w-4" /> {validationResult}</>
          )}
        </div>
      )}

      <div>
        <p className="text-xs font-medium text-muted-foreground mb-1">템플릿</p>
        <div className="flex flex-wrap gap-1">
          {EXPRESSION_TEMPLATES.map((t) => (
            <Button
              key={t.label}
              variant="outline"
              size="sm"
              className="text-xs h-7"
              onClick={() => {
                onChange(t.expression);
                setValidationResult(null);
              }}
            >
              {t.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
