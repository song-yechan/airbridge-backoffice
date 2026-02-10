import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { formatNumber } from "@/lib/formatters";
import { toast } from "sonner";
import type { TableColumn } from "@/types";

interface ChartDataTableProps {
  columns: TableColumn[];
  data: Record<string, unknown>[];
  descriptionRow?: {
    firstCol: string;
    rest: string;
  };
}

function exportToCsv(columns: TableColumn[], data: Record<string, unknown>[]) {
  const header = columns.map((c) => c.header).join(",");
  const rows = data.map((row) =>
    columns.map((col) => {
      const value = row[col.key];
      const str = String(value ?? "");
      return str.includes(",") ? `"${str}"` : str;
    }).join(",")
  );
  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `export-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success("CSV 다운로드 완료");
}

export function ChartDataTable({ columns, data, descriptionRow }: ChartDataTableProps) {
  return (
    <div className="border rounded-lg overflow-hidden mt-4">
      <div className="flex items-center justify-between px-3 py-1.5 bg-muted/30 border-b">
        <span className="text-xs text-muted-foreground">{data.length} rows</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs"
          onClick={() => exportToCsv(columns, data)}
        >
          <Download className="h-3.5 w-3.5 mr-1" />
          CSV
        </Button>
      </div>
      <div className="max-h-[280px] overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={`text-xs font-medium text-muted-foreground whitespace-nowrap ${
                    col.align === "right" ? "text-right" : "text-left"
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
                  const isNumber = typeof value === "number";
                  const displayValue = isNumber
                    ? formatNumber(value)
                    : String(value ?? "");

                  return (
                    <TableCell
                      key={col.key}
                      className={`font-mono text-xs whitespace-nowrap ${
                        col.align === "right" ? "text-right tabular-nums" : ""
                      } ${col.key === "date" ? "font-medium" : ""}`}
                    >
                      {displayValue}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
