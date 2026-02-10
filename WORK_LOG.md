# Backoffice Restructure - Work Log

## 프로젝트 목적
5개 독립 내부 백오피스 툴(Streamlit 기반)을 하나의 통합 React 앱(`airbridge-backoffice/`)으로 재구성.
- **LNB 통합**: AB180 Backoffice 플랫폼의 Sidebar 구조에 맞는 페이지
- **CSM 친화적**: 가이드 없이 처음 사용 가능한 UX
- **AI 친화적 코드**: 일관된 패턴으로 AI가 읽고/수정/확장하기 쉬운 구조

## 기술 스택
React 19 + TypeScript 5.9 + Vite 7 + Tailwind CSS 3 + shadcn/ui (Radix UI)

## 프로젝트 경로
- 통합 앱: `/Users/ab180-yechan-mbp/backoffice/airbridge-backoffice/`
- 레퍼런스: `/Users/ab180-yechan-mbp/backoffice/_references/` (기능별 기획문서, 스크린샷)
- 기존 프로토타입: `/Users/ab180-yechan-mbp/backoffice/ab180_backoffice/packages/`

## 파일 구조 패턴
```
src/
├── components/
│   ├── layout/          # AppSidebar, PageHeader
│   ├── features/{name}/ # 기능별 컴포넌트
│   ├── shared/          # 공유 컴포넌트 (ChartContainer, UnitSelect 등)
│   └── ui/              # shadcn/ui 기본 컴포넌트
├── hooks/               # 기능별 커스텀 훅 (상태 관리)
├── pages/               # 페이지 (컴포지션만, 로직 없음)
├── types/index.ts       # 중앙 타입 정의
├── data/                # Mock 데이터 (→ 추후 API 연동)
└── lib/                 # 유틸리티 (formatters, chart-colors)
```

## 구현 순서 & 상태

### 1. Custom Deduplication ✅ 완료
- 레퍼런스: `_references/Custom Deduplication/`
- App 검색 → Platform/Event/Window 선택 → 적용
- 주요 수정: 3개 Card를 1개로 통합, 빈 상태 가이드 추가
- AppSearchSection은 다른 기능에서도 재사용됨

### 2. Event Usage Report ✅ 완료
- 레퍼런스: `_references/Event Usage Report/`
- App 검색 → Collection Status 자동 표시 → 이벤트 선택/날짜 범위 → 차트+테이블
- 주요 수정: 31일 날짜 제한, CSV export, 한국어 라벨, 워크플로우 설명

### 3. Reactivated Attribution ✅ 완료
- 레퍼런스: `_references/reactivated-attribution/`
- App 검색 → Inactivity Window → Lookback Window (2탭) → Attribution Window (4탭)
- 주요 수정: 행 편집 연필 아이콘 상시 표시, Global 안내 명확화, 기본값 안내 위치 이동

### 4. Custom Channel Permission ✅ 완료
- 레퍼런스: `_references/custom-channel-permission/`
- 기능: 대행사 커스텀 채널 캠페인 접근 권한 관리
- 흐름: App 검색 → Agency 선택(검색 가능 드롭다운) → Current Permission JSON 조회(펼치기/접기) → Channel Permission CRUD + Data Filter CRUD → Apply
- 데이터 모델: `tbl_iam_permission_dashboard_settings.permission` JSON
  - `customChannels`: 채널명 배열
  - `customChannelDataFilters`: 채널별 캠페인 필터 (type: startswith/endswith/is/is_not, values, field)
- 주의사항 안내 포함: 대시보드 권한 1회 수정 필요, Apply 전 미반영, 초기화 방법
- 생성 파일:
  - `src/types/index.ts` (타입 추가)
  - `src/data/custom-channel-permission-mock.ts`
  - `src/components/ui/select.tsx` (Radix Select)
  - `src/components/features/custom-channel-permission/agency-select.tsx`
  - `src/components/features/custom-channel-permission/current-permission-viewer.tsx`
  - `src/components/features/custom-channel-permission/data-filter-row.tsx`
  - `src/components/features/custom-channel-permission/channel-card.tsx`
  - `src/components/features/custom-channel-permission/channel-permission-editor.tsx`
  - `src/pages/custom-channel-permission.tsx`
  - `src/hooks/use-custom-channel-permission.ts`

### 5. Calculated Metrics ✅ 완료
- 레퍼런스: `_references/Calculated metric/`
- 기능: Actuals/Trends Report용 조직별 계산 메트릭 CRUD
- 흐름: Org ID 입력 → 조회 → Create (key + displayName + expression JSON) / Edit (displayName + expression) / Delete (확인 다이얼로그)
- Expression JSON Schema: arithmetic (fn: +,-,*,/ + fields), constant (value), fieldAccess (metric key)
- Expression Editor: JSON textarea + Schema 가이드 패널 + 검증 + 포맷팅 + 템플릿 (CPI/CTR/ARPU/CPM)
- 검색: key/displayName/전체 필터링, 테이블 체크박스 선택
- 생성 파일:
  - `src/types/index.ts` (SearchTarget, CalculatedMetric, CalculatedMetricFormState 추가)
  - `src/data/calculated-metrics-mock.ts`
  - `src/hooks/use-calculated-metrics.ts`
  - `src/components/features/calculated-metrics/org-id-input.tsx`
  - `src/components/features/calculated-metrics/metric-create-form.tsx`
  - `src/components/features/calculated-metrics/expression-editor.tsx`
  - `src/components/features/calculated-metrics/metric-table.tsx`
  - `src/components/features/calculated-metrics/metric-edit-form.tsx`
  - `src/pages/calculated-metrics.tsx`

## 공통 패턴
- **AppSearchSection**: 모든 기능의 진입점. App ID/Name autocomplete → 선택 후 데이터 로드
- **빈 상태**: "먼저 App ID 또는 App Name으로 앱을 검색하여 선택하세요."
- **상태 관리**: 기능별 `use-{feature}.ts` 커스텀 훅
- **Mock → API**: `data/` 폴더의 mock 데이터, 추후 API 교체 예정
- **불변성**: 항상 spread operator로 새 객체 생성
- **Dev 서버**: 작업 후 항상 즉시 띄우기

## UX 원칙 (피드백 반영)
- 섹션을 불필요하게 나누지 않기 (1개 Card로 통합)
- placeholder에 명확한 행동 지시 ("App ID 또는 App Name을 입력하세요")
- 편집 가능한 요소는 항상 시각적으로 인지 가능하게 (연필 아이콘 등)
- Global 같은 암묵적 동작은 명시적 텍스트로 안내
- 기본값 안내는 눈에 잘 보이는 위치에 배치
