import { useState, useCallback } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TemplateList } from './TemplateList';
import { ExpressionPreview } from './ExpressionPreview';
import {
  validateKey,
  validateJson,
  formatJson,
  expressionToFormula,
} from '@/lib/expression';
import { cn } from '@/lib/utils';
import type { Template } from '@/types';
import { toast } from 'sonner';

export function CreateTab() {
  const [orgId, setOrgId] = useState('');
  const [key, setKey] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [expression, setExpression] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>();

  const [keyError, setKeyError] = useState<string>();
  const [exprValidation, setExprValidation] = useState<{
    valid: boolean;
    error?: string;
  }>();

  const formula = expression ? expressionToFormula(expression) : '';

  const handleKeyChange = (value: string) => {
    setKey(value);
    if (value) {
      const result = validateKey(value);
      setKeyError(result.valid ? undefined : result.error);
    } else {
      setKeyError(undefined);
    }
  };

  const handleExpressionValidate = useCallback(() => {
    if (!expression.trim()) {
      setExprValidation(undefined);
      return;
    }
    const result = validateJson(expression);
    setExprValidation(result);
    if (result.valid) {
      setExpression(formatJson(expression));
    }
  }, [expression]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleExpressionValidate();
    }
  };

  const handleTemplateSelect = (template: Template) => {
    setExpression(formatJson(template.expression));
    setSelectedTemplate(template.name);
    setExprValidation({ valid: true });
  };

  const handleCreate = () => {
    if (!orgId) {
      toast.error('Organization ID를 입력해주세요.');
      return;
    }
    if (!key || keyError) {
      toast.error('유효한 Key를 입력해주세요.');
      return;
    }
    if (!displayName) {
      toast.error('Display Name을 입력해주세요.');
      return;
    }
    if (!expression || !exprValidation?.valid) {
      toast.error('유효한 Expression을 입력해주세요.');
      return;
    }
    toast.success('메트릭이 생성되었습니다. (데모)');
  };

  return (
    <div className="space-y-5">
      {/* Organization ID */}
      <div className="space-y-2">
        <Label>Organization ID</Label>
        <Input
          placeholder="숫자로 입력 (예: 1872465354)"
          value={orgId}
          onChange={(e) => setOrgId(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          테스트:{' '}
          <button
            type="button"
            className="text-primary underline hover:no-underline"
            onClick={() => setOrgId('1872465354')}
          >
            ablog (1872465354) 자동 입력
          </button>
        </p>
      </div>

      {/* Key */}
      <div className="space-y-2">
        <Label>Key</Label>
        <Input
          placeholder="영어 소문자와 _ 만 (예: cost_per_install)"
          value={key}
          onChange={(e) => handleKeyChange(e.target.value)}
          className={cn(keyError && 'border-destructive focus-visible:ring-destructive')}
        />
        {keyError ? (
          <p className="text-xs text-destructive flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {keyError}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            예: <code className="bg-muted px-1 rounded">cost_per_install</code>
          </p>
        )}
      </div>

      {/* Display Name */}
      <div className="space-y-2">
        <Label>Display Name</Label>
        <Input
          placeholder="예: Cost Per Purchase - CPP (App)"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          리포트 메트릭 드롭다운에 표시됩니다.
        </p>
      </div>

      {/* Expression */}
      <div className="space-y-2">
        <Label>Expression (수식)</Label>
        <p className="text-xs text-muted-foreground">
          JSON 형식 계산 수식. 직접 작성하거나 템플릿에서 적용하세요.
        </p>

        <TemplateList
          onSelect={handleTemplateSelect}
          selectedTemplate={selectedTemplate}
        />

        <Textarea
          placeholder='{"fn":"/","type":"arithmetic","fields":[...]}'
          value={expression}
          onChange={(e) => {
            setExpression(e.target.value);
            setSelectedTemplate(undefined);
            setExprValidation(undefined);
          }}
          onBlur={handleExpressionValidate}
          onKeyDown={handleKeyDown}
          rows={8}
          className={cn(
            'font-mono text-xs',
            exprValidation?.valid === true && 'border-green-500 focus-visible:ring-green-500',
            exprValidation?.valid === false && 'border-destructive focus-visible:ring-destructive'
          )}
        />

        {exprValidation?.valid === true && (
          <p className="text-xs text-green-600 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            유효한 JSON 형식입니다
          </p>
        )}
        {exprValidation?.valid === false && (
          <p className="text-xs text-destructive flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {exprValidation.error}
          </p>
        )}
        {!exprValidation && (
          <p className="text-xs text-muted-foreground">
            Ctrl+Enter 또는 포커스 해제 시 JSON 검증
          </p>
        )}

        {formula && <ExpressionPreview formula={formula} />}
      </div>

      {/* Create Button */}
      <Button className="w-full" onClick={handleCreate}>
        생성하기
      </Button>

      {/* Warning */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="text-xs">
          <strong>생성 전 확인</strong>
          <ul className="mt-1 pl-4 list-disc space-y-0.5">
            <li>반드시 ablog에서 먼저 테스트</li>
            <li>Key, Display Name 조직 내 중복 불가</li>
            <li>생성 후 Actuals 리포트에서 수식 확인</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
}
