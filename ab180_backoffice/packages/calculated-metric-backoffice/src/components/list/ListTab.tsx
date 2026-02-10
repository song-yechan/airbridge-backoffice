import { useState, useMemo } from 'react';
import { X, AlertCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ExpressionPreview } from '@/components/form/ExpressionPreview';
import { mockMetrics } from '@/data/mock';
import {
  validateJson,
  formatJson,
  expressionToFormula,
} from '@/lib/expression';
import { cn } from '@/lib/utils';
import type { CalculatedMetric } from '@/types';
import { toast } from 'sonner';

export function ListTab() {
  const [orgId, setOrgId] = useState('1872465354');
  const [search, setSearch] = useState('');
  const [filterField, setFilterField] = useState('all');
  const [selectedMetric, setSelectedMetric] = useState<CalculatedMetric | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [editDisplayName, setEditDisplayName] = useState('');
  const [editExpression, setEditExpression] = useState('');
  const [exprValidation, setExprValidation] = useState<{
    valid: boolean;
    error?: string;
  }>();

  const filteredMetrics = useMemo(() => {
    const q = search.toLowerCase();
    return mockMetrics.filter((m) => {
      if (!q) return true;
      if (filterField === 'key') return m.key.includes(q);
      if (filterField === 'dn') return m.displayName.toLowerCase().includes(q);
      return m.key.includes(q) || m.displayName.toLowerCase().includes(q) || m.expression.includes(q);
    });
  }, [search, filterField]);

  const formula = editExpression ? expressionToFormula(editExpression) : '';

  const handleSelectMetric = (metric: CalculatedMetric) => {
    setSelectedMetric(metric);
    setEditDisplayName(metric.displayName);
    setEditExpression(formatJson(metric.expression));
    setExprValidation({ valid: true });
  };

  const handleDeselect = () => {
    setSelectedMetric(null);
    setEditDisplayName('');
    setEditExpression('');
    setExprValidation(undefined);
  };

  const handleExpressionValidate = () => {
    if (!editExpression.trim()) {
      setExprValidation(undefined);
      return;
    }
    const result = validateJson(editExpression);
    setExprValidation(result);
    if (result.valid) {
      setEditExpression(formatJson(editExpression));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleExpressionValidate();
    }
  };

  const handleEdit = () => {
    if (!editDisplayName) {
      toast.error('Display Name을 입력해주세요.');
      return;
    }
    if (!editExpression || !exprValidation?.valid) {
      toast.error('유효한 Expression을 입력해주세요.');
      return;
    }
    toast.success('메트릭이 수정되었습니다. (데모)');
  };

  const handleDelete = () => {
    toast.success('메트릭이 삭제되었습니다. (데모)');
    setDeleteModalOpen(false);
    handleDeselect();
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="space-y-2">
        <Label>Organization ID</Label>
        <div className="flex gap-2">
          <Input
            value={orgId}
            onChange={(e) => setOrgId(e.target.value)}
            className="flex-1"
          />
          <Button>조회</Button>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant="secondary">{filteredMetrics.length}개 메트릭</Badge>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterField} onValueChange={setFilterField}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="key">Key</SelectItem>
              <SelectItem value="dn">Display Name</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-10"></TableHead>
                <TableHead className="w-[100px]">Key</TableHead>
                <TableHead>Display Name</TableHead>
                <TableHead className="w-[90px]">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMetrics.map((metric) => (
                <TableRow
                  key={metric.id}
                  className={cn(
                    'cursor-pointer',
                    selectedMetric?.id === metric.id && 'bg-muted'
                  )}
                  onClick={() => handleSelectMetric(metric)}
                >
                  <TableCell>
                    <div
                      className={cn(
                        'w-4 h-4 rounded-full border-2 flex items-center justify-center',
                        selectedMetric?.id === metric.id ? 'border-primary' : 'border-muted-foreground/30'
                      )}
                    >
                      {selectedMetric?.id === metric.id && (
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {metric.key}
                  </TableCell>
                  <TableCell className="font-medium text-sm">{metric.displayName}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{metric.createdAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Selection Hint */}
        {!selectedMetric && (
          <p className="text-xs text-muted-foreground text-center py-2">
            테이블에서 메트릭을 클릭하여 수정/삭제
          </p>
        )}

        {/* Edit Panel */}
        {selectedMetric && (
          <div className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">메트릭 수정</span>
                <Badge variant="outline">ID: {selectedMetric.id}</Badge>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleDeselect}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid md:grid-cols-[1fr,240px] gap-4">
              {/* Form */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Key (변경 불가)</Label>
                  <Input value={selectedMetric.key} disabled />
                </div>

                <div className="space-y-2">
                  <Label>Display Name</Label>
                  <Input
                    value={editDisplayName}
                    onChange={(e) => setEditDisplayName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Expression</Label>
                  <Textarea
                    value={editExpression}
                    onChange={(e) => {
                      setEditExpression(e.target.value);
                      setExprValidation(undefined);
                    }}
                    onBlur={handleExpressionValidate}
                    onKeyDown={handleKeyDown}
                    rows={5}
                    className={cn(
                      'font-mono text-xs',
                      exprValidation?.valid === true && 'border-green-500',
                      exprValidation?.valid === false && 'border-destructive'
                    )}
                  />
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1" onClick={handleEdit}>
                    수정
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => setDeleteModalOpen(true)}
                  >
                    삭제
                  </Button>
                </div>
              </div>

              {/* Preview */}
              <div className="space-y-3">
                {formula && <ExpressionPreview formula={formula} />}
                <div className="border rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground mb-2">파싱된 JSON</p>
                  <pre className="text-[11px] font-mono text-muted-foreground whitespace-pre-wrap max-h-[180px] overflow-auto">
                    {formatJson(editExpression)}
                  </pre>
                </div>
              </div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Key 변경 필요 시 삭제 후 재생성하세요. 동일 Key로 재생성하면 Saved Report 사용 가능합니다.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>메트릭 삭제</DialogTitle>
            <DialogDescription>
              <span className="font-medium text-foreground">{selectedMetric?.displayName}</span>
              <br />
              <span className="font-mono text-xs">key: {selectedMetric?.key}</span>
            </DialogDescription>
          </DialogHeader>

          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              삭제하면 되돌릴 수 없습니다. Saved Report에서 자동 제거됩니다.
            </AlertDescription>
          </Alert>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
