import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CalculatedMetric, SearchTarget } from "@/types";
import { formatExpressionShort } from "@/data/calculated-metrics-mock";

interface MetricTableProps {
  metrics: CalculatedMetric[];
  totalCount: number;
  searchQuery: string;
  searchTarget: SearchTarget;
  selectedMetricId: number | null;
  onSearchQueryChange: (q: string) => void;
  onSearchTargetChange: (t: SearchTarget) => void;
  onSelect: (id: number) => void;
}

export function MetricTable({
  metrics,
  totalCount,
  searchQuery,
  searchTarget,
  selectedMetricId,
  onSearchQueryChange,
  onSearchTargetChange,
  onSelect,
}: MetricTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Calculated Metrics 조회</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-green-600">
          {metrics.length}개의 결과 (전체 {totalCount}개)
        </p>

        <div className="grid grid-cols-[1fr_180px] gap-4">
          <div>
            <label className="text-sm font-medium">검색</label>
            <Input
              className="mt-1"
              placeholder="key 또는 displayName으로 검색..."
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">검색 대상</label>
            <Select value={searchTarget} onValueChange={(v) => onSearchTargetChange(v as SearchTarget)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="key">key</SelectItem>
                <SelectItem value="displayName">displayName</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border max-h-[400px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">선택</TableHead>
                <TableHead className="w-[120px]">Key</TableHead>
                <TableHead className="w-[200px]">Display Name</TableHead>
                <TableHead>Expression</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metrics.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    메트릭이 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                metrics.map((m) => (
                  <TableRow
                    key={m.id}
                    className={`cursor-pointer hover:bg-muted/50 ${selectedMetricId === m.id ? "bg-muted" : ""}`}
                    onClick={() => onSelect(m.id)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedMetricId === m.id}
                        onCheckedChange={() => onSelect(m.id)}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-xs">{m.key}</TableCell>
                    <TableCell className="text-sm">{m.displayName}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {formatExpressionShort(m.expression)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
