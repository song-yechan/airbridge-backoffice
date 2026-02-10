import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { formatNumber } from '@/lib/formatters';
import type { TableColumn } from '@/types';

interface DataTableProps<T extends Record<string, unknown>> {
  columns: TableColumn[];
  data: T[];
  descriptionRow?: {
    firstCol: string;
    rest: string;
  };
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  descriptionRow,
}: DataTableProps<T>) {
  return (
    <div className="border rounded-lg overflow-hidden mt-4">
      <ScrollArea className="max-h-[280px]">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={`text-xs font-medium text-muted-foreground whitespace-nowrap ${
                    col.align === 'right' ? 'text-right' : 'text-left'
                  }`}
                >
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {descriptionRow && (
              <TableRow className="bg-zinc-50">
                <TableCell className="text-[11px] text-muted-foreground italic py-1.5">
                  {descriptionRow.firstCol}
                </TableCell>
                <TableCell
                  colSpan={columns.length - 1}
                  className="text-[11px] text-muted-foreground italic py-1.5 text-center"
                >
                  {descriptionRow.rest}
                </TableCell>
              </TableRow>
            )}
            {data.map((row, rowIndex) => (
              <TableRow key={rowIndex} className="hover:bg-muted/50">
                {columns.map((col) => {
                  const value = row[col.key];
                  const isNumber = typeof value === 'number';
                  const displayValue = isNumber
                    ? formatNumber(value)
                    : String(value ?? '');

                  return (
                    <TableCell
                      key={col.key}
                      className={`font-mono text-xs whitespace-nowrap ${
                        col.align === 'right' ? 'text-right tabular-nums' : ''
                      } ${col.key === 'date' ? 'font-medium' : ''}`}
                    >
                      {displayValue}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
