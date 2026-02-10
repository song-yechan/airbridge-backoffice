import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function GuideSection() {
  return (
    <div className="mb-6">
      <p className="text-sm text-muted-foreground mb-4">
        아래 두 영역으로 구성되어 있습니다.
      </p>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="text-xs font-semibold text-muted-foreground">
                영역
              </TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground">
                설명
              </TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground">
                데이터 흐름
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium whitespace-nowrap">
                Event Collection Status
              </TableCell>
              <TableCell className="text-sm">
                전체 이벤트 수집 현황 (최근 30일 고정, 자동 표시)
              </TableCell>
              <TableCell className="text-xs text-muted-foreground font-mono">
                수집 (In)
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium whitespace-nowrap">
                Event Usage
              </TableCell>
              <TableCell className="text-sm">
                특정 이벤트의 리포트 조회 횟수 + 포스트백 발송 현황 (최대 31일,
                이벤트 선택)
              </TableCell>
              <TableCell className="text-xs text-muted-foreground font-mono">
                사용 (Query) → 발송 (Out)
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
