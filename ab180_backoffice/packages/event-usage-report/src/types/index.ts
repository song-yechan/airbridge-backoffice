// App Info
export interface AppInfo {
  id: number;
  name: string;
  timezone: string;
}

// Collection Status Data
export interface CollectionDataRow {
  date: string;
  [eventSource: string]: string | number;
}

export interface CollectionData {
  rows: CollectionDataRow[];
  eventSources: string[];
}

// Event Usage Data
export interface ReportUsageRow {
  date: string;
  [reportApi: string]: string | number;
}

export interface PostbackRow {
  date: string;
  [target: string]: string | number;
}

export interface EventUsageData {
  eventId: string;
  reportUsage: {
    rows: ReportUsageRow[];
    apis: string[];
    sql: string;
  };
  postback: {
    rows: PostbackRow[];
    targets: string[];
    sql: string;
  };
}

// Chart Data
export interface ChartDataPoint {
  date: string;
  [series: string]: string | number;
}

// Date Range
export interface DateRange {
  from: Date | null;
  to: Date | null;
}

// Event Chip
export interface EventChip {
  id: string;
  label: string;
}

// Legend Item
export interface LegendItem {
  label: string;
  color: string;
}

// Table Column
export interface TableColumn {
  key: string;
  header: string;
  align?: 'left' | 'right';
  description?: string;
}
