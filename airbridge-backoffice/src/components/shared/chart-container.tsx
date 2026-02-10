import { TimeSeriesChart } from "./time-series-chart";
import { ChartLegend } from "./chart-legend";
import { ChartDataTable } from "./chart-data-table";
import { CollapsibleSql } from "./collapsible-sql";
import { getChartColor } from "@/lib/chart-colors";
import type { TableColumn, LegendItem } from "@/types";

interface ChartContainerProps {
  data: Record<string, unknown>[];
  series: string[];
  sql: string;
  chartHeight?: number;
  tableDescription?: {
    firstCol: string;
    rest: string;
  };
}

export function ChartContainer({
  data,
  series,
  sql,
  chartHeight = 220,
  tableDescription,
}: ChartContainerProps) {
  const legendItems: LegendItem[] = series.map((s, index) => ({
    label: s,
    color: getChartColor(index),
  }));

  const columns: TableColumn[] = [
    { key: "date", header: "Date", align: "left" },
    ...series.map((s) => ({
      key: s,
      header: s,
      align: "right" as const,
    })),
  ];

  return (
    <div>
      <TimeSeriesChart data={data} series={series} height={chartHeight} />
      <ChartLegend items={legendItems} />
      <ChartDataTable columns={columns} data={data} descriptionRow={tableDescription} />
      <CollapsibleSql sql={sql} />
    </div>
  );
}
