import { useState } from "react";
import { Button } from "@/components/ui/button";
import { validateExpression } from "@/data/calculated-metrics-mock";
import { EXPRESSION_TEMPLATES } from "@/data/calculated-metrics-mock";
import { Check, X, ShieldCheck } from "lucide-react";

interface ExpressionEditorProps {
  value: string;
  onChange: (v: string) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export function ExpressionEditor({ value, onChange, onValidationChange }: ExpressionEditorProps) {
  const [validationResult, setValidationResult] = useState<string | null | "valid">(null);

  const handleValidate = () => {
    const error = validateExpression(value);
    const result = error ?? "valid";
    setValidationResult(result);
    onValidationChange?.(result === "valid");
  };

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(value);
      onChange(JSON.stringify(parsed, null, 2));
    } catch {
      setValidationResult("유효한 JSON 형식이 아닙니다.");
      onValidationChange?.(false);
    }
  };

  const handleChange = (v: string) => {
    onChange(v);
    setValidationResult(null);
    onValidationChange?.(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Expression</label>
        <Button variant="ghost" size="sm" onClick={handleFormat}>
          Format
        </Button>
      </div>

      <div className="grid grid-cols-[1fr_1fr] gap-4">
        <textarea
          className="min-h-[200px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm font-mono shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y"
          placeholder='{\n  "type": "arithmetic",\n  "fn": "/",\n  "fields": [...]\n}'
          value={value}
          onChange={(e) => handleChange(e.target.value)}
        />
        <div className="rounded-md bg-muted p-3 text-xs overflow-y-auto max-h-[240px]">
          <p className="font-medium text-sm mb-2">Expression 작성 가이드</p>
          <table className="w-full text-muted-foreground">
            <thead>
              <tr className="border-b">
                <th className="text-left py-1 pr-2 font-medium">type</th>
                <th className="text-left py-1 pr-2 font-medium">필드</th>
                <th className="text-left py-1 font-medium">설명</th>
              </tr>
            </thead>
            <tbody className="align-top">
              <tr className="border-b">
                <td className="py-1.5 pr-2 font-mono whitespace-nowrap">arithmetic</td>
                <td className="py-1.5 pr-2">
                  <code className="bg-background px-1 rounded">fn</code>,{" "}
                  <code className="bg-background px-1 rounded">fields</code>
                </td>
                <td className="py-1.5">
                  사칙연산. fn은 +, -, *, / 중 하나. fields에 피연산자 2개.
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-1.5 pr-2 font-mono whitespace-nowrap">fieldAccess</td>
                <td className="py-1.5 pr-2">
                  <code className="bg-background px-1 rounded">metric</code>
                </td>
                <td className="py-1.5">
                  기존 메트릭 참조 (예: cost, install, click). Calculated Metric은 참조 불가.
                </td>
              </tr>
              <tr>
                <td className="py-1.5 pr-2 font-mono whitespace-nowrap">constant</td>
                <td className="py-1.5 pr-2">
                  <code className="bg-background px-1 rounded">value</code>
                </td>
                <td className="py-1.5">
                  고정 숫자값 (예: CPM에서 1000 곱할 때).
                </td>
              </tr>
            </tbody>
          </table>
          <div className="mt-2 pt-2 border-t text-muted-foreground">
            <p><strong>예시:</strong> CPI = cost / install</p>
            <pre className="mt-1 bg-background rounded p-1.5 text-[10px] leading-relaxed">{`{
  "type": "arithmetic",
  "fn": "/",
  "fields": [
    { "type": "fieldAccess", "metric": "cost" },
    { "type": "fieldAccess", "metric": "install" }
  ]
}`}</pre>
          </div>
        </div>
      </div>

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
                handleChange(t.expression);
              }}
            >
              {t.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 pt-1">
        <Button variant="outline" onClick={handleValidate}>
          <ShieldCheck className="h-4 w-4 mr-1" />
          Expression 검증
        </Button>
        {validationResult !== null && (
          <span className={`flex items-center gap-1 text-sm ${validationResult === "valid" ? "text-green-600" : "text-destructive"}`}>
            {validationResult === "valid" ? (
              <><Check className="h-4 w-4" /> 유효한 Expression입니다</>
            ) : (
              <><X className="h-4 w-4" /> {validationResult}</>
            )}
          </span>
        )}
      </div>
    </div>
  );
}
