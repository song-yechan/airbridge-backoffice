import { TimeSeriesChart } from './TimeSeriesChart';
import { ChartLegend } from '@/components/shared/ChartLegend';
import { DataTable } from '@/components/shared/DataTable';
import { CollapsibleSql } from '@/components/shared/CollapsibleSql';
import { getChartColor } from '@/lib/chart-colors';
import type { TableColumn, LegendItem } from '@/types';

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
  // Generate legend items
  const legendItems: LegendItem[] = series.map((s, index) => ({
    label: s,
    color: getChartColor(index),
  }));

  // Generate table columns
  const columns: TableColumn[] = [
    { key: 'date', header: 'Date', align: 'left' },
    ...series.map((s) => ({
      key: s,
      header: s,
      align: 'right' as const,
    })),
  ];

  return (
    <div>
      <TimeSeriesChart
        data={data}
        series={series}
        height={chartHeight}
      />
      <ChartLegend items={legendItems} />
      <DataTable
        columns={columns}
        data={data}
        descriptionRow={tableDescription}
      />
      <CollapsibleSql sql={sql} />
    </div>
  );
}
