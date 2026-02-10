import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { getChartColor } from '@/lib/chart-colors';
import { formatNumber } from '@/lib/formatters';

interface TimeSeriesChartProps {
  data: Record<string, unknown>[];
  series: string[];
  xKey?: string;
  height?: number;
}

export function TimeSeriesChart({
  data,
  series,
  xKey = 'date',
  height = 220,
}: TimeSeriesChartProps) {
  // 데이터를 날짜 순으로 정렬 (오름차순)
  const sortedData = [...data].sort((a, b) => {
    const dateA = String(a[xKey]);
    const dateB = String(b[xKey]);
    return dateA.localeCompare(dateB);
  });

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={sortedData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" />
          <XAxis
            dataKey={xKey}
            tick={{ fontSize: 11, fill: '#71717A' }}
            tickFormatter={(value: string) => value.slice(5)} // MM-DD 형식
            axisLine={{ stroke: '#E4E4E7' }}
            tickLine={{ stroke: '#E4E4E7' }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#71717A' }}
            tickFormatter={(value: number) => formatNumber(value)}
            axisLine={{ stroke: '#E4E4E7' }}
            tickLine={{ stroke: '#E4E4E7' }}
            width={60}
          />
          <Tooltip
            contentStyle={{
              fontSize: 12,
              borderRadius: 8,
              border: '1px solid #E4E4E7',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
            formatter={(value) => [formatNumber(Number(value)), '']}
            labelFormatter={(label) => `Date: ${String(label)}`}
          />
          {series.map((s, index) => (
            <Line
              key={s}
              type="monotone"
              dataKey={s}
              stroke={getChartColor(index)}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
