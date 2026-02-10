# Backoffice Restructure Plan

> Status: Draft (방향성 확정, 첫 번째 기능 구현 준비)
> Created: 2026-02-10
> References: `_references/` 정리 완료

---

## 0. 목적

### 배경
- 기존 5개 기능은 airbridge-cs-streamlit(Python/Streamlit) 기반 내부 백오피스에 존재
- 별도 React 앱으로 프로토타입 테스트 진행 완료
- 이번 작업: **최종 프로토타입 제작 → AB180 Backoffice(LNB 시스템) 통합 입주**

### 목표 (우선순위 순)
1. **LNB 통합 입주**: 기존 AB180 Backoffice 플랫폼에 5개 기능을 통합
2. **CSM 친화적 사용성**: CSM이 처음 써도 가이드 없이 사용 가능한 수준
3. **AI 친화적 코드 구조**: 일관된 컴포넌트 패턴 + 예측 가능한 파일 구조 → AI(Claude 등)가 코드를 읽고 수정/확장하기 쉬운 구조. 프론트 개발자 없이도 기능 개선/확장 가능

### 타겟 사용자
- **CSM (Customer Success Manager)** — 해당 기능을 일상적으로 사용
- 기술적 배경 없이도 첫 사용 시 워크플로우를 따라갈 수 있어야 함

### 진행 전략
- **단순한 기능부터** 패턴 확립 → 나머지 기능은 패턴을 따라감
- 순서: Custom Deduplication(1st) → 나머지 4개 순차 적용

---

## 1. 방향성

### 1-1. 가이드 없는 사용성
- CSM이 처음 사용해도 워크플로우를 따라갈 수 있어야 한다
- UI 자체가 작업 순서를 안내하는 구조
- 현재: 각 기능이 독립 앱으로 분리되어 있어 진입점과 맥락이 끊김

### 1-2. API 유연성
- PM이 초기 기획에 참여 → 사용성을 위해 API 스펙 변경 가능
- UI가 기존 API에 맞추는 것이 아니라, 최적의 UX를 먼저 설계하고 API가 따라가는 구조

### 1-3. AI 친화적 코드 구조
- 일관된 선언적 컴포넌트 패턴
- 예측 가능한 파일/폴더 구조
- AI가 "이 패턴대로 새 필드/기능을 추가하면 된다"를 바로 파악 가능한 수준

---

## 2. 구조

### 2-1. LNB (Left Navigation Bar)

기존 AB180 Backoffice의 LNB 구조를 따른다. 5개 기능 모두 **Airbridge** 섹션 하위에 배치.

```
AB180 Backoffice
├── Backoffice Management
│   ├── Backoffice Admin ▸ (Users, Service Accounts, Permissions, Groups, Audit Logs, JWKS)
│   └── Debugger
├── Airbridge                          ← 5개 기능이 여기에 위치
│   ├── Event Usage Report
│   ├── Custom Deduplication
│   ├── Reactivated Attribution
│   ├── Custom Channel Permission
│   ├── Calculated Metrics
│   └── (기존: Org Management, Tracking Link Management 등)
└── Airbridge Internal
    ├── System Management ▸
    ├── Report API Reset
    └── Email Template
```

### 2-2. App/Org 컨텍스트

- **전역 선택 아님** — 기능별로 진입 시 선택
- **모든 5개 기능이 App/Org 선택 필요**
- App/Org 선택은 각 기능 페이지의 **첫 번째 액션**

| 기능 | 컨텍스트 | 초기 액션 | 근거 (레퍼런스 확인) |
|------|----------|-----------|------|
| Event Usage Report | App | App 선택 (ID/Name) → 이벤트 현황 조회 | App ID 기반, Snowflake/RDB 쿼리 |
| Custom Deduplication | App | App 선택 → 현재 설정 확인 → 규칙 관리 | App ID 기반, Dedup Key에 app_id 포함 |
| Reactivated Attribution | App | App 선택 → Window 설정 | App ID 기반, tbl_app_attribution_settings |
| Custom Channel Permission | App → Agency | App 선택 (ID/Name) → Agency 선택 → 권한 관리 | App 먼저 선택 후 해당 앱의 Agency 목록에서 선택 |
| Calculated Metrics | Org | Org ID 입력 → 메트릭 CRUD | Organization ID 기반, 조직 단위로 메트릭 관리 |

---

## 3. 기능별 작업 프로세스 (위계 분리)

각 기능의 실제 워크플로우를 기반으로 위계를 분리한다.

### 3-1. Event Usage Report
> 목적: 앱의 이벤트 수집/사용 현황 모니터링

```
[App 선택 (AppID or AppName)]
  └─ App info 표시                — App ID, App Name, Timezone, 아이콘
  └─ Event collection status     — 최근 30일 이벤트 수집 추이 (자동 표시)
  │    ├─ 라인차트               — event_source × event_category별
  │    └─ Query & Table (접기)   — SQL 원문 + 피벗 테이블
  └─ Event usage                 — 사용자 조건 설정 후 조회
       ├─ Date (날짜 범위 선택, 캘린더 피커, 최대 31일)
       ├─ Events (멀티셀렉트, event_category 목록)
       ├─ Run Query 버튼
       └─ 이벤트별 접기 섹션     — 선택한 카테고리별 반복
            ├─ Report Usage      — 리포트 쿼리 사용량 (Main RDB)
            └─ Postback Sent     — 포스트백 전송 현황 (Snowflake)
```

**핵심 UX 포인트:**
- Event collection status는 App 선택 시 자동 표시
- Event usage는 날짜 + 이벤트 선택 후 Run Query로 명시적 실행
- 이벤트 카테고리는 멀티셀렉트 지원 (현재 구현됨)
- 각 이벤트별 결과는 접기(expander) 형태로 표시

### 3-2. Custom Deduplication
> 목적: 앱별 커스텀 이벤트 중복 제거 규칙 관리

```
[App 선택]
  └─ 현재 설정 확인
  │    ├─ App 정보               — App ID, App Name, Timezone
  │    ├─ Refresh 버튼
  │    └─ 테이블                 — App ID, Event Category, Goal Category, Dedup Key
  └─ 1. 중복 제거 조건 선택
  │    ├─ A. Platform 선택       — App / Web (체크박스, 동시 선택 비권장)
  │    ├─ B. 이벤트 종류 선택    — 드롭다운 (회원가입, 로그인, 구매완료, 구매취소 등)
  │    └─ C. 중복 제거 윈도우    — seconds 단위 숫자 입력 (예: 86400)
  └─ 2. 확인
  │    ├─ App ID
  │    ├─ Dedup Key             — 자동 생성됨 (event_category$$goal$$dedup_field)
  │    └─ Dedup Window          — seconds
  └─ 3. 적용                    — 적용 버튼
```

**핵심 UX 포인트:**
- 현재 설정 테이블을 먼저 보여줌 (전체 목록, 여러 앱의 규칙 혼재 가능)
- 3단계 위계: 조건 선택 → 확인(Preview) → 적용
- App/Web 동시 제거 비권장 안내 포함
- Dedup Key는 조건 선택 시 자동 생성
- 백오피스에서 지원하지 않는 이벤트는 백엔드에 직접 요청 필요 (안내 포함)

### 3-3. Reactivated Attribution
> 목적: 비활성 유저 재활성화 어트리뷰션 Window 설정

```
[App 선택]
  └─ App 정보 표시               — App ID, App Name, Timezone
  └─ FAQ (접기)                  — Inactivity/Lookback/Attribution 설명
  └─ Inactivity Window 설정      — 필수, 미설정 시 Reactivation Tracking 비활성
  └─ Lookback Window             — 탭 구조
  │    ├─ [Reactivated Install]
  │    │    ├─ 현재 세팅 (테이블) — Channel, Click-DM, Click-PM, View-DM, View-PM
  │    │    └─ 세팅 추가/변경    — Channel(비우면 Global) + 4개 Window값 + Unit + 적용
  │    └─ [Reactivated Open]     — 동일 구조
  └─ Attribution Window          — 탭 구조
       ├─ [Reactivated Install]
       ├─ [Reactivated Open]
       ├─ [Reactivated Deeplink Open]
       └─ [Reactivated Deeplink Page-view]
            ├─ 현재 세팅 (테이블) — Channel, Attribution Window (채널별 설정 가능)
            └─ 세팅 추가/변경    — Channel(비우면 Global) + Window값 + Unit + 적용
```

**핵심 UX 포인트:**
- Inactivity Window 필수 → 미설정 시 전체 기능 비활성
- Lookback/Attribution 모두 **탭 구조** (이벤트 타입별 분리)
- 각 탭 내부는 **현재 세팅 조회 + 세팅 추가/변경** 의 접기(accordion) 패턴
- Channel 비우면 앱 Global 설정, 채널명 입력 시 채널별 설정
- Lookback: 4개 매칭 타입별 값+단위 / Attribution: 단일 Window값+단위

### 3-4. Custom Channel Permission
> 목적: 에이전시에 커스텀 채널 캠페인 접근 권한 부여

```
[App 선택 (AppID or AppName)]
  └─ App 정보 표시               — App ID, App Name, Timezone, 아이콘
  └─ Agency 선택                 — 해당 앱에 연결된 에이전시 목록 (드롭다운)
  └─ Current Permission 조회     — 현재 integration permission JSON 표시
  └─ Channel Permission 관리     — 채널별 반복 섹션
  │    ├─ Custom Channel 입력
  │    ├─ Data Filters
  │    │    ├─ Add Condition     — filter type(startswith/endswith) + value
  │    │    └─ Remove
  │    └─ Delete Channel Permission
  └─ Add Custom Channel Permission  — 새 채널 권한 추가
  └─ Apply                       — 전체 변경사항 적용
```

**핵심 UX 포인트:**
- App 선택 → Agency 선택의 2단계 컨텍스트 설정
- 현재 permission JSON을 먼저 보여준 뒤 수정 진입
- 하나의 Agency에 여러 Channel Permission을 가질 수 있음 (반복 섹션)
- Filter 조건은 startswith/endswith 2가지 (스크린샷 확인)

### 3-5. Calculated Metrics
> 목적: Actuals/Trends Report용 조직별 계산 메트릭 관리

```
[Organization ID 입력]
  └─ Calculated Metrics 생성
  │    ├─ Organization ID
  │    ├─ Key                    — 영어 소문자 + 언더스코어만 허용, 조직 내 유일
  │    ├─ Display Name           — 리포트에서 표시되는 이름, 조직 내 유일
  │    ├─ Expression (JSON)      — 수식 정의 (arithmetic + fieldAccess/constant)
  │    │    └─ 포맷 자동 검증    — Ctrl+Enter 또는 포커스 해제 시
  │    └─ Submit
  └─ Calculated Metrics 조회
  │    ├─ 조회할 Organization ID
  │    ├─ 검색 (key/displayName)  — 검색 대상 필터 (전체/key/displayName)
  │    └─ 테이블                  — 선택, Key, Display Name, Expression
  └─ Calculated Metric 수정 및 삭제  — 테이블에서 메트릭 선택 시 활성화
       ├─ Key (변경 불가)
       ├─ Display Name (수정 가능)
       ├─ Expression (수정 가능)  — 파싱된 JSON 트리 + 스키마 가이드
       ├─ Edit 버튼
       └─ Delete 버튼            — 확인 다이얼로그 포함
```

**핵심 UX 포인트:**
- **Organization ID** 기반 (App이 아님)
- Expression은 JSON Schema로 작성 (arithmetic type + fn(+,-,*,/) + fields)
- fieldAccess: 기존 metric key 참조 / constant: 상수값 / Calculated Metric은 참조 불가
- Key 제약조건: 영어 소문자 + 언더스코어만 가능
- 삭제 시 Saved Report에 영향 → 사용자 안내 필요
- Expression Template 제공 (CPI, CPP, CTR, ARPU, ARPPU, CPM, eCPM, AOV 등)

---

## 4. 공통 UX 원칙

| 원칙 | 설명 |
|------|------|
| **조회 우선** | 각 기능 진입 시 현재 상태를 먼저 보여준다 |
| **초기 액션 = 컨텍스트 선택** | App 또는 Org 선택이 모든 기능의 첫 단계 |
| **위계 = 프로세스 순서** | 섹션 배치가 곧 작업 순서를 의미 |
| **변경은 명시적** | 조회와 수정의 진입점이 분리되어야 함 |
| **실수 방지** | 변경 적용 전 Preview/확인 단계 |

---

## 5. 아키텍처 결정 사항

### 5-1. 프로젝트 구조
- **새 프로젝트**: `airbridge-backoffice/` (기존 모노레포와 분리)
- **기존 프로토타입**: `ab180_backoffice/packages/` 에 그대로 유지 (레퍼런스용)
- **통합 방식**: 별도 개발 후 AB180 Backoffice 플랫폼에 이식

### 5-2. 기술 스택
- React 19 + TypeScript + Vite 7
- Tailwind CSS 3 + shadcn/ui (Radix UI)
- React Router v7 (SPA 라우팅)
- shadcn Sidebar 컴포넌트 (LNB)
- Lucide React (아이콘)

### 5-3. 파일 구조 규칙
```
airbridge-backoffice/
├── src/
│   ├── components/
│   │   ├── layout/          # 전역 레이아웃 (sidebar, header)
│   │   ├── features/        # 기능별 컴포넌트 (custom-deduplication/, ...)
│   │   └── ui/              # shadcn/ui 공통 컴포넌트
│   ├── hooks/               # 기능별 상태 훅
│   ├── pages/               # 라우트 진입점
│   ├── types/               # TypeScript 타입
│   ├── data/                # Mock 데이터 (향후 API 교체)
│   └── lib/                 # 유틸리티, 비즈니스 로직
```

### 5-4. 컴포넌트 패턴 (AI 친화적)
- **페이지 = 조합만**: PageHeader + 기능 컴포넌트 조합, 로직 없음
- **기능 컴포넌트 = Props 기반**: 상태를 Props로 받고, 콜백으로 올림
- **상태 관리 = Custom Hook**: 기능별 단일 Hook (useDedupForm, useAttribution 등)
- **데이터 = Mock → API**: data/ 폴더의 Mock을 나중에 API 호출로 교체
- **UI = shadcn/ui**: 새 UI 컴포넌트 추가 시 `components/ui/` 에 추가

---

## 6. 진행 상황

- [x] Custom Deduplication (완료)
- [x] Event Usage Report (완료)
- [x] Reactivated Attribution (완료)
- [x] Custom Channel Permission (완료)
- [x] Calculated Metrics (완료)
- [ ] API 연동 (Mock → 실제)
- [ ] AB180 Backoffice 플랫폼 이식

---

## Appendix: Raw Input

```
- 가이드 없이 사용한다 = 사용성이 더 좋아야 한다
- PM이 붙어서 초기 기획을 쳐준다 = API도 필요하다면 사용성에 맞추어 바꿀 수 있어야 한다
- App/Org 설정은 상위 메뉴구조를 따라가게 될 것
  - 기능별로 앱/조직 설정이 필요 없을 수 있음
  - 필요하다면 초기 액션 중 하나여야 할 것
- 각 동작과 섹션에 대한 위계 분리가 필요함
  - 작업 프로세스(목적)에 따라서 위계를 분리
- 5개 기능 모두 App/Org 선택 필요 (기능별, 전역 아님)
- 상위 카테고리 묶기 없음 — Airbridge 섹션에 flat 배치
- LNB 구조는 기존 AB180 Backoffice를 따름
```
