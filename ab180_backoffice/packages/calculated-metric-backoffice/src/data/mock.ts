import type { CalculatedMetric, Template } from '@/types';

export const mockMetrics: CalculatedMetric[] = [
  {
    id: 1772,
    key: 'cpp_app',
    displayName: 'Cost Per Purchase - CPP (App)',
    expression: '{"fn":"/","type":"arithmetic","fields":[{"type":"fieldAccess","metric":"cost_channel"},{"type":"fieldAccess","metric":"app_order_complete"}]}',
    createdAt: '2022-08-15',
  },
  {
    id: 1789,
    key: 'cpi',
    displayName: 'Cost Per Install',
    expression: '{"fn":"/","type":"arithmetic","fields":[{"type":"fieldAccess","metric":"cost_channel"},{"type":"fieldAccess","metric":"app_installs"}]}',
    createdAt: '2022-09-01',
  },
  {
    id: 20782,
    key: 'cpm_app',
    displayName: 'CPM (App)',
    expression: '{"fn":"*","type":"arithmetic","fields":[{"fn":"/","type":"arithmetic","fields":[{"type":"fieldAccess","metric":"cost_channel"},{"type":"fieldAccess","metric":"app_ad_impression"}]},{"type":"constant","value":1000}]}',
    createdAt: '2023-03-10',
  },
  {
    id: 20783,
    key: 'ecpm_app',
    displayName: 'eCPM (App)',
    expression: '{"fn":"*","type":"arithmetic","fields":[{"fn":"/","type":"arithmetic","fields":[{"type":"fieldAccess","metric":"app_ad_impression_revenue"},{"type":"fieldAccess","metric":"app_ad_impression"}]},{"type":"constant","value":1000}]}',
    createdAt: '2023-03-10',
  },
  {
    id: 21718,
    key: 'profit_pct',
    displayName: 'Profit %',
    expression: '{"fn":"*","type":"arithmetic","fields":[{"fn":"/","type":"arithmetic","fields":[{"type":"fieldAccess","metric":"cost_channel"},{"type":"fieldAccess","metric":"app_ad_revenue"}]},{"type":"constant","value":100}]}',
    createdAt: '2023-05-20',
  },
  {
    id: 21719,
    key: 'profit_loss',
    displayName: 'Profit/Loss (Revenue - Cost)',
    expression: '{"fn":"-","type":"arithmetic","fields":[{"type":"fieldAccess","metric":"app_ad_revenue"},{"type":"fieldAccess","metric":"cost_channel"}]}',
    createdAt: '2023-05-20',
  },
];

export const templates: Template[] = [
  {
    name: 'CPI',
    formula: 'Cost / Install',
    expression: '{"fn":"/","type":"arithmetic","fields":[{"type":"fieldAccess","metric":"cost_channel"},{"type":"fieldAccess","metric":"app_installs"}]}',
  },
  {
    name: 'CPP (App)',
    formula: 'Cost / Order Complete',
    expression: '{"fn":"/","type":"arithmetic","fields":[{"type":"fieldAccess","metric":"cost_channel"},{"type":"fieldAccess","metric":"app_order_complete"}]}',
  },
  {
    name: 'CTR',
    formula: '(Click / Impressions) × 100',
    expression: '{"fn":"*","type":"arithmetic","fields":[{"fn":"/","type":"arithmetic","fields":[{"type":"fieldAccess","metric":"clicks"},{"type":"fieldAccess","metric":"impressions"}]},{"type":"constant","value":100}]}',
  },
  {
    name: 'CPM (App)',
    formula: '(Cost / Ad Imp) × 1000',
    expression: '{"fn":"*","type":"arithmetic","fields":[{"fn":"/","type":"arithmetic","fields":[{"type":"fieldAccess","metric":"cost_channel"},{"type":"fieldAccess","metric":"app_ad_impression"}]},{"type":"constant","value":1000}]}',
  },
  {
    name: 'ARPU (App)',
    formula: 'Revenue / Unique Users',
    expression: '{"fn":"/","type":"arithmetic","fields":[{"type":"fieldAccess","metric":"app_revenue"},{"type":"fieldAccess","metric":"app_unique_users"}]}',
  },
  {
    name: 'ARPPU (App)',
    formula: 'Revenue / Order Users',
    expression: '{"fn":"/","type":"arithmetic","fields":[{"type":"fieldAccess","metric":"app_revenue"},{"type":"fieldAccess","metric":"app_order_complete_users"}]}',
  },
  {
    name: 'ROI (App)',
    formula: 'Revenue / Cost',
    expression: '{"fn":"/","type":"arithmetic","fields":[{"type":"fieldAccess","metric":"app_revenue"},{"type":"fieldAccess","metric":"cost_channel"}]}',
  },
  {
    name: 'AOV (App)',
    formula: 'Revenue / Order Complete',
    expression: '{"fn":"/","type":"arithmetic","fields":[{"type":"fieldAccess","metric":"app_revenue"},{"type":"fieldAccess","metric":"app_order_complete"}]}',
  },
  {
    name: 'eCPM (App)',
    formula: '(Ad Rev / Imp) × 1000',
    expression: '{"fn":"*","type":"arithmetic","fields":[{"fn":"/","type":"arithmetic","fields":[{"type":"fieldAccess","metric":"app_ad_impression_revenue"},{"type":"fieldAccess","metric":"app_ad_impression"}]},{"type":"constant","value":1000}]}',
  },
  {
    name: 'Click-to-Install',
    formula: '(Installs / Clicks) × 100',
    expression: '{"fn":"*","type":"arithmetic","fields":[{"fn":"/","type":"arithmetic","fields":[{"type":"fieldAccess","metric":"app_installs"},{"type":"fieldAccess","metric":"clicks"}]},{"type":"constant","value":100}]}',
  },
  {
    name: 'Profit/Loss (App)',
    formula: 'Ad Revenue − Cost',
    expression: '{"fn":"-","type":"arithmetic","fields":[{"type":"fieldAccess","metric":"app_ad_revenue"},{"type":"fieldAccess","metric":"cost_channel"}]}',
  },
  {
    name: '실 구매액 (App)',
    formula: 'Revenue − Refund',
    expression: '{"fn":"-","type":"arithmetic","fields":[{"type":"fieldAccess","metric":"app_revenue"},{"type":"fieldAccess","metric":"app_refund_amount"}]}',
  },
];
