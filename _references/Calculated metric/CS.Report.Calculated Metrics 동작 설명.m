CS.Report.Calculated Metrics 백오피스 동작 분석확신도: 추정 (Notion 문서 기반, GitHub 코드 직접 확인 불가) 참고: GitHub private 레포지토리 접근이 제한되어 있어 소스코드를 직접 확인하지 못했습니다. 아래 내용은 Notion 문서 기반으로 작성되었습니다.1. 시스템 개요Calculated Metrics는 Actuals Report에서 사용자가 직접 수식(formula)을 정의하여 계산되는 메트릭을 관리하는 백오피스 기능입니다.
┌─────────────────────────────────────────────────────────────┐
│                    시스템 아키텍처                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Advertiser (광고주)                                        │
│        │                                                    │
│        └──► ReportTemplate (리포트 템플릿)                    │
│                  │                                          │
│                  ├──► MetricCategory (메트릭 카테고리)        │
│                  │         │                                │
│                  │         └──► CalculatedMetric (계산 메트릭)│
│                  │                    │                     │
│                  │                    └──► CalculatedMetricValue │
│                  │                                          │
│                  └──► ReportConfig (리포트 설정)             │
│                                                             │
└─────────────────────────────────────────────────────────────┘2. 핵심 엔티티2.1 CalculatedMetric (계산 메트릭)
[오전 10:47]row: 9필드명타입설명id
Long고유 식별자 (PK)metric_category_id
LongMetricCategory FKreport_template_id
LongReportTemplate FKname
String메트릭 이름 (max 100)formula
String계산식 (max 1000)formula_variables
JSON계산식 변수budget_plan_type
EnumTARGET/FORECAST/ACTUALdisplay_order
Integer표시 순서is_active
Boolean활성화 여부[오전 10:47]2.2 Metric 타입 구분
[오전 10:47]row: 3Metric Type설명standard
Report Template의 기본 metriccustom
category와 무관하게 동적 생성 가능한 metriccalculated
formula 기반으로 계산되는 metric
[오전 10:47]2.3 BudgetPlanType (예산 계획 타입)
[오전 10:47]row: 4타입설명TARGET
목표값 (예산 계획)FORECAST
예측값 (추정치)ACTUAL
실적값 (실제 발생)VARIANCE
차이값 (목표 vs 실적)[오전 10:47]3. Formula 규칙Calculated Metric의 핵심인 formula(수식) 작성 규칙:
┌─────────────────────────────────────────────────────────────┐
│                    Formula 규칙                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  • 변수 형식: {metricId}                                    │
│    예: {1} + {2}  (metric ID 1과 2의 합)                    │
│                                                             │
│  • 지원 연산자: +, -, *, /, (, )                           │
│                                                             │
│  • 상수 사용 가능                                           │
│    예: {1} * 1.1  (10% 증가)                               │
│                                                             │
│  • 중첩 계산 지원                                           │
│    (calculated metric이 다른 calculated metric 참조 가능)   │
│                                                             │
└─────────────────────────────────────────────────────────────┘formula_variables JSON 예시:
json{
  "revenue": {"sourceType": "DIRECT", "metricId": 101},
  "cost": {"sourceType": "CALCULATED", "metricId": 102},
  "margin": {"sourceType": "FORMULA", "expression": "revenue - cost"}
}4. API 엔드포인트4.1 Custom Metric CRUD API
[오전 10:47]row: 6MethodEndpoint설명POST
/calculated-metric
메트릭 생성GET
/calculated-metric
목록 조회GET
/calculated-metric/{id}
단일 조회PUT
/calculated-metric/{id}
수정DELETE
/calculated-metric/{id}
삭제POST
/calculated-metric/validate
formula 검증[오전 10:47]4.2 일괄 저장 API
[오전 10:47]row: 1MethodEndpoint설명PUT
/api/v1/calculated-metrics
전체 수정사항 일괄 저장[오전 10:47]Request Body 구조:
json{
  "reportTemplate": {
    "id": 1,
    "description": "Standard Monthly Report",
    "dateRangeType": "MONTHLY",
    "metricsOrder": [
      {"id": 101, "name": "Impressions", "order": 1},
      {"id": 102, "name": "Clicks", "order": 2}
    ]
  },
  "metricCategories": [
    {"id": 301, "name": "Revenue", "order": 1}
  ],
  "calculatedMetrics": [
    {
      "id": 401,
      "categoryId": 301,
      "budgetPlanType": "TARGET",
      "formulaVariables": {...},
      "order": 1
    }
  ]
}4.3 메트릭 복사 API
[오전 10:47]row: 2MethodEndpoint설명GET
/report-metric
metric 목록 조회POST
/report-metric/copy
metric 복사 실행[오전 10:47]복사 로직:
Source Report의 category와 metric을 Target Report로 복사기존 Target Report의 category/metric은 삭제 후 새로 생성Calculated Metric의 formula 내 metric ID도 새로운 ID로 자동 매핑 변환5. 생성 시 입력 필드[오전 10:47]row: 5필드필수 여부설명report_id
✅ 필수소속 Report IDcategory_id
선택소속 카테고리 IDname
✅ 필수메트릭 이름formula
✅ 필수계산식row_order
선택표시 순서[오전 10:47]6. 데이터 정합성 주의사항2025-05-07 이슈에서 발견된 주의사항:[오전 10:47]row: 3항목설명쿼리 필터
반드시 dateRangeType 필터 적용 필요
캐시 키
캐시 키에 날짜 범위 정보 포함 필수마이그레이션
데이터 마이그레이션 시 스키마 호환성 검증 필요[오전 10:47]수정된 쿼리 패턴:sqlSELECT * FROM calculated_metric_values cmv
JOIN report_configs rc ON cmv.report_config_id = rc.id
WHERE rc.date_range_type = :dateRangeType
  AND cmv.budget_plan_type IN ('ACTUAL', 'VARIANCE')7. 전체 동작 플로우┌─────────────────────────────────────────────────────────────┐
│                 Calculated Metrics 동작 플로우               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1️⃣ 템플릿 생성                                             │
│     └─► Advertiser별로 ReportTemplate 생성                  │
│                                                             │
│  2️⃣ 카테고리 구성                                           │
│     └─► 템플릿 내에 MetricCategory 구성                     │
│         (Revenue, Traffic, Engagement 등)                   │
│                                                             │
│  3️⃣ 메트릭 정의                                             │
│     └─► 각 카테고리에 CalculatedMetric 정의                 │
│         - name, formula, formula_variables 설정             │
│         - 예: CTR = {clicks} / {impressions} * 100         │
│                                                             │
│  4️⃣ 리포트 설정                                             │
│     └─► ReportConfig로 기간, 범위 설정                      │
│         (MONTHLY, QUARTERLY, YEARLY, CUSTOM)                │
│                                                             │
│  5️⃣ 값 저장                                                 │
│     └─► CalculatedMetricValue에 값 저장                     │
│         - TARGET (목표), FORECAST (예측), ACTUAL (실적)     │
│                                                             │
│  6️⃣ API 호출                                                │
│     └─► PUT /api/v1/calculated-metrics                     │
│         전체 수정사항 일괄 저장 (트랜잭션 처리)               │
│                                                             │
└─────────────────────────────────────────────────────────────┘