# Reactivated Attribution 설정 페이지 명세서

## 1. 페이지 개요

### 목적
Reactivated Attribution 페이지는 **비활성 유저의 재활성화를 추적하고, 마케팅 채널별 성과를 측정**하기 위한 설정을 관리합니다.

### 주요 기능
- **Inactivity Window 설정**: 유저를 비활성으로 판단하는 기준 기간 정의
- **Lookback Window 설정**: Reactivation 이벤트 발생 시 과거 터치포인트 매칭 기간 설정
- **Attribution Window 설정**: Reactivation 이후 후속 이벤트 귀속 기간 설정
- **채널별 커스터마이징**: 각 설정을 마케팅 채널별로 다르게 구성 가능

### 타겟 사용자
- **마케팅 매니저**: 채널별 Reactivation 성과 분석을 위한 설정 관리
- **데이터 분석가**: 정확한 어트리뷰션을 위한 윈도우 기간 최적화
- **앱 운영자**: 비활성 유저 정의 및 재활성화 전략 수립

### 접근 권한

| 항목 | 규칙 |
|------|------|
| 접근 경로 | 백오피스 내부 페이지 (HomeNav 드롭다운으로 진입) |
| 인증 | 백오피스 공통 인증 (별도 페이지 레벨 권한 없음) |
| 권한 범위 | 인증된 사용자는 모든 App의 Reactivation 설정 변경 가능 |
| 감사 로그 | 현재 미구현 (향후 설정 변경 이력 추적 필요) |

---

## 2. 정책 사항

### 입력 제한 및 유효성 검사

#### TimeUnit (시간 단위)
| 단위 | 값 | 설명 |
|------|-----|------|
| minutes | `'minutes'` | 분 단위 |
| hours | `'hours'` | 시간 단위 |
| days | `'days'` | 일 단위 |
| months | `'months'` | 월 단위 |
| years | `'years'` | 년 단위 |

#### WindowPeriod (기간 값)
| 항목 | 규칙 |
|------|------|
| value | 1 이상의 양의 정수 |
| unit | TimeUnit 중 하나 선택 |
| 검증 시점 | 저장/변경/추가 버튼 클릭 시 (제출 시점) |

```typescript
interface WindowPeriod {
  value: number;  // 양의 정수 (1 이상)
  unit: TimeUnit;
}
```

#### 채널명
| 항목 | 규칙 |
|------|------|
| 중복 검사 | 중복된 채널명 추가 불가 (대소문자 구분 없음) |
| 빈 입력 | 빈 채널명 입력 시 자동으로 `'Global'`로 설정 |
| 특수문자 | 제한 없음 |
| 검증 시점 | Dialog에서 [추가] 버튼 클릭 시 |

### 비즈니스 로직 규칙

#### Inactivity Window
| 항목 | 규칙 |
|------|------|
| 필수 여부 | **필수** - 미설정 시 Reactivation Tracking 비활성화 |
| 기본값 | 7일 권장 |
| 비활성화 가능 | 가능 (null로 설정) |
| 채널별 설정 | 불가 (전역 단일 값) |

#### Lookback Window
| 항목 | 규칙 |
|------|------|
| 이벤트 타입 | reactivatedInstall, reactivatedOpen |
| 기본값 | Click-DM: 7일, Click-PM: 1일, View-DM: 1일, View-PM: 6시간 |
| Global 채널 | 기본으로 포함되며, 채널별 설정이 없으면 Global 값 적용 |
| 채널별 설정 | 가능 |

#### Attribution Window
| 항목 | 규칙 |
|------|------|
| 이벤트 타입 | reactivatedInstall, reactivatedOpen, reactivatedDeeplinkOpen, reactivatedDeeplinkPageview |
| 기본값 | 모든 이벤트 타입에서 7일 |
| Global 채널 | 기본으로 포함되며, 채널별 설정이 없으면 Global 값 적용 |
| 채널별 설정 | 가능 |

### 에러 처리 정책

| 상황 | 처리 방식 | 메시지 | 발생 시점 |
|------|-----------|--------|-----------|
| 중복 채널 추가 시도 | Toast 에러 | "이미 존재하는 채널입니다." | Dialog에서 [추가] 클릭 시 |
| 설정 저장 성공 | Toast 성공 | "설정이 업데이트되었습니다." | API 응답 성공 시 |
| 채널 추가 성공 | Toast 성공 | "{채널명} 채널이 추가되었습니다." | API 응답 성공 시 |
| 채널 삭제 성공 | Toast 성공 | "선택한 설정이 삭제되었습니다." | API 응답 성공 시 |
| Inactivity Window 저장 | Toast 성공 | "Inactivity Window가 저장되었습니다." | API 응답 성공 시 |
| Inactivity Window 비활성화 | Toast 성공 | "Inactivity Window가 비활성화되었습니다." | [비활성화] 클릭 후 API 응답 성공 시 |
| API 네트워크 에러 | Toast 에러 | "서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요." | API 호출 실패 시 |
| API 서버 에러 (5xx) | Toast 에러 | "서버 오류가 발생했습니다. 관리자에게 문의해주세요." | API 응답 시 |

---

## 3. 화면 구조 (ASCII Wireframe)

### 전체 레이아웃

```
+------------------------------------------------------------------+
| [Home] [Select: Reactivated Attribution ▼]                        |
+------------------------------------------------------------------+
| +----------------------------------------------------------+     |
| |  [Icon] Reactivated Attribution                          |     |
| |  비활성 유저 재활성화 어트리뷰션 설정                      |     |
| |                                                          |     |
| |  [App: ablog] [ID: 619] [Timezone: Asia/Seoul]           |     |
| +----------------------------------------------------------+     |
|                                                                  |
|  +------------------------------------------------------------+  |
|  |                                                            |  |
|  |  +-- 1. Inactivity Window [필수] -------------------------+|  |
|  |  |   비활성 유저 판단 기준 기간을 설정하세요.              ||  |
|  |  |   ...                                                   ||  |
|  |  +--------------------------------------------------------+|  |
|  |                                                            |  |
|  |  +-- 2. Lookback Window ----------------------------------+|  |
|  |  |   Reactivation Target Event에 대한 터치포인트 매칭      ||  |
|  |  |   기간을 채널별로 설정합니다.                           ||  |
|  |  +--------------------------------------------------------+|  |
|  |                                                            |  |
|  |  +-- 3. Attribution Window -------------------------------+|  |
|  |  |   Reactivation 이후 후속 이벤트 어트리뷰션 기간을       ||  |
|  |  |   채널별로 설정합니다.                                  ||  |
|  |  +--------------------------------------------------------+|  |
|  |                                                            |  |
|  +------------------------------------------------------------+  |
+------------------------------------------------------------------+
```

**레이아웃 제약**
- 콘텐츠 최대 너비: `920px`, 중앙 정렬
- 좌우 패딩: `24px`

### Header 구조

```
+------------------------------------------------------------------+
|  +------+                                                        |
|  |[Icon]|  Reactivated Attribution                               |
|  |  ↻   |  비활성 유저 재활성화 어트리뷰션 설정                    |
|  +------+                                                        |
|                                                                  |
|                    +------------+ +----------+ +------------------+
|                    | App: ablog | | ID: 619  | | TZ: Asia/Seoul   |
|                    +------------+ +----------+ +------------------+
+------------------------------------------------------------------+
```

### Inactivity Window 설정 카드

```
+------------------------------------------------------------------+
| (1) Inactivity Window  [필수]  [?]                               |
|     비활성 유저 판단 기준 기간을 설정하세요.                       |
+------------------------------------------------------------------+
|                                                                  |
|  ⚠️ Alert (Inactivity Window 미설정 시에만 표시):                 |
|  +------------------------------------------------------------+  |
|  | Inactivity Window가 설정되지 않으면 Reactivation Tracking   |  |
|  | 이 동작하지 않습니다.                                       |  |
|  +------------------------------------------------------------+  |
|                                                                  |
|  ▼ 🔍 현재 세팅                                                  |
|  +------------------------------------------------------------+  |
|  |  현재 설정값: [7 days]                    [비활성화] (red)   |  |
|  |  비활성화 시 Reactivation Tracking이 동작하지 않습니다.      |  |
|  +------------------------------------------------------------+  |
|                                                                  |
|  ▼ 🔧 세팅 변경                                                  |
|  +------------------------------------------------------------+  |
|  |  [  7  ] [days    ▼]  [변경]                                |  |
|  |                                                            |  |
|  |  +------------------------------------------------------+  |  |
|  |  | 기본값 안내                                          |  |  |
|  |  | 일반적으로 7일을 권장합니다. 앱 특성에 따라 조정하세요. |  |  |
|  |  +------------------------------------------------------+  |  |
|  +------------------------------------------------------------+  |
+------------------------------------------------------------------+
```

### Lookback Window 설정 카드

```
+------------------------------------------------------------------+
| (2) Lookback Window  [?]                                         |
|     Reactivation Target Event에 대한 터치포인트 매칭 기간을        |
|     채널별로 설정합니다.                                          |
+------------------------------------------------------------------+
|                                                                  |
|  +---------------------------+---------------------------+       |
|  | Reactivated Install      | Reactivated Open          |       |
|  +---------------------------+---------------------------+       |
|                                                                  |
|  [+ 채널 추가]  [선택 삭제 (2)] (선택 시에만 표시)                 |
|                                                                  |
|  +--------------------------------------------------------------+|
|  | [☐] | Channel | Click-DM  | Click-PM | View-DM  | View-PM   ||
|  +--------------------------------------------------------------+|
|  | [☐] | Global  | 7 days    | 1 days   | 1 days   | 6 hours   ||
|  | [☐] | moloco  | 3 days    | 1 days   | 1 days   | 3 hours   ||
|  +--------------------------------------------------------------+|
|                                                                  |
|  DM = Device Matching, PM = Probabilistic Modeling               |
|  행을 클릭하여 전체 설정을 수정할 수 있습니다.                     |
|                                                                  |
|  +------------------------------------------------------+        |
|  | 기본값 안내                                          |        |
|  | • Click - Device Matching: 7일                       |        |
|  | • Click - Probabilistic Modeling: 1일                |        |
|  | • View - Device Matching: 1일                        |        |
|  | • View - Probabilistic Modeling: 6시간               |        |
|  +------------------------------------------------------+        |
+------------------------------------------------------------------+
```

### Lookback Window 테이블 - 편집 모드

```
+--------------------------------------------------------------+
| [☐] | Channel | Click-DM  | Click-PM | View-DM  | View-PM   |
+--------------------------------------------------------------+
| [☑] | moloco  | [ 3 ][days▼] | [ 1 ][days▼] | [ 1 ][days▼] |
|     |         | [6][hours▼] [저장] [취소]                   |
+--------------------------------------------------------------+
```

### 채널 추가 다이얼로그 (Lookback Window)

```
+------------------------------------------+
|  채널 추가                           [X] |
+------------------------------------------+
|  새로운 채널에 대한 Lookback Window를     |
|  설정합니다.                             |
+------------------------------------------+
|                                          |
|  Channel                                 |
|  +------------------------------------+  |
|  | 비워두면 Global                    |  |
|  +------------------------------------+  |
|                                          |
|  Click - Device Matching                 |
|  +--------+ +------------+               |
|  |   7    | | days    ▼ |               |
|  +--------+ +------------+               |
|                                          |
|  Click - Probabilistic Modeling          |
|  +--------+ +------------+               |
|  |   1    | | days    ▼ |               |
|  +--------+ +------------+               |
|                                          |
|  View - Device Matching                  |
|  +--------+ +------------+               |
|  |   1    | | days    ▼ |               |
|  +--------+ +------------+               |
|                                          |
|  View - Probabilistic Modeling           |
|  +--------+ +------------+               |
|  |   6    | | hours   ▼ |               |
|  +--------+ +------------+               |
|                                          |
|          [취소]        [추가]            |
+------------------------------------------+
```

### Attribution Window 설정 카드

```
+------------------------------------------------------------------+
| (3) Attribution Window  [?]                                      |
|     Reactivation 이후 후속 이벤트 어트리뷰션 기간을 채널별로        |
|     설정합니다.                                                   |
+------------------------------------------------------------------+
|                                                                  |
|  +-------------+------------+-------------------+-----------------+
|  | Reactivated | Reactivated| Reactivated       | Reactivated     |
|  | Install     | Open       | Deeplink Open     | Deeplink PV     |
|  +-------------+------------+-------------------+-----------------+
|                                                                  |
|  [+ 채널 추가]  [선택 삭제 (1)] (선택 시에만 표시)                 |
|                                                                  |
|  +--------------------------------------------------------------+|
|  | [☐] | Channel        | Attribution Window                    ||
|  +--------------------------------------------------------------+|
|  | [☐] | Global         | 7 days                                ||
|  | [☐] | moloco         | 14 days                               ||
|  +--------------------------------------------------------------+|
|                                                                  |
|  행을 클릭하여 설정을 수정할 수 있습니다.                         |
|                                                                  |
|  +------------------------------------------------------+        |
|  | 기본값 안내                                          |        |
|  | 모든 이벤트 타입의 Attribution Window 기본값은 7일입니다.|        |
|  +------------------------------------------------------+        |
+------------------------------------------------------------------+
```

### Attribution Window 테이블 - 편집 모드

```
+--------------------------------------------------------------+
| [☐] | Channel        | Attribution Window                    |
+--------------------------------------------------------------+
| [☑] | moloco         | [ 14 ][days▼] [저장] [취소]           |
+--------------------------------------------------------------+
```

### 채널 추가 다이얼로그 (Attribution Window)

```
+------------------------------------------+
|  채널 추가                           [X] |
+------------------------------------------+
|  새로운 채널에 대한 Attribution Window를  |
|  설정합니다.                             |
+------------------------------------------+
|                                          |
|  Channel                                 |
|  +------------------------------------+  |
|  | 비워두면 Global                    |  |
|  +------------------------------------+  |
|                                          |
|  Attribution Window                      |
|  +--------+ +------------+               |
|  |   7    | | days    ▼ |               |
|  +--------+ +------------+               |
|                                          |
|          [취소]        [추가]            |
+------------------------------------------+
```

### 상태별 화면 변화

#### Inactivity Window 미설정 상태
```
+------------------------------------------------------------------+
| (1) Inactivity Window  [필수]  [?]                               |
+------------------------------------------------------------------+
|  ⚠️ 경고 알림 (빨간 배경)                                         |
|  +------------------------------------------------------------+  |
|  | Inactivity Window가 설정되지 않으면 Reactivation Tracking   |  |
|  | 이 동작하지 않습니다.                                       |  |
|  +------------------------------------------------------------+  |
|                                                                  |
|  ▼ 🔍 현재 세팅                                                  |
|     현재 설정된 Inactivity Window가 없습니다.                     |
|                                                                  |
|  ▼ 🔧 세팅 추가                                                  |
|     [  7  ] [days    ▼]  [저장]                                  |
+------------------------------------------------------------------+
```

#### 테이블 빈 상태
```
+--------------------------------------------------------------+
| [☐] | Channel        | Attribution Window                    |
+--------------------------------------------------------------+
|            설정된 채널이 없습니다.                            |
+--------------------------------------------------------------+
```

#### 선택된 행 존재 시
```
[+ 채널 추가]  [선택 삭제 (2)]  ← 빨간 버튼 표시
```

#### 로딩 상태
- 저장/변경/비활성화 버튼 클릭 시: 해당 버튼 비활성화 + 스피너 표시
- 채널 추가 Dialog [추가] 클릭 시: 버튼 비활성화 + 스피너 표시
- 선택 삭제 클릭 시: 버튼 비활성화 + 스피너 표시
- 인라인 편집 [저장] 클릭 시: 저장/취소 버튼 비활성화 + 스피너 표시

#### 성공 상태
- 설정 저장 성공: Toast 성공 (5초 후 자동 사라짐) + Accordion 현재 세팅 값 갱신
- 채널 추가 성공: Toast 성공 (5초 후 자동 사라짐) + Dialog 닫힘 + 테이블 행 추가
- 채널 삭제 성공: Toast 성공 (5초 후 자동 사라짐) + 테이블에서 행 제거 + 체크박스 선택 초기화
- 인라인 편집 저장 성공: Toast 성공 (5초 후 자동 사라짐) + 편집 모드 종료 + 테이블 값 갱신
- Inactivity Window 비활성화 성공: Toast 성공 (5초 후 자동 사라짐) + 경고 알림 표시 + 현재 세팅 "미설정" 표시

---

## 4. 인터랙션 상세

### 버튼별 동작 정의

| 버튼/액션 | 위치 | 트리거 | 동작 | 완료 후 |
|-----------|------|--------|------|---------|
| Inactivity Window [저장] | 세팅 추가 영역 | 클릭 | 값+단위 유효성 검사 → API 호출 | 성공 시 현재 세팅 갱신 + Toast |
| Inactivity Window [변경] | 세팅 변경 영역 | 클릭 | 값+단위 유효성 검사 → API 호출 | 성공 시 현재 세팅 갱신 + Toast |
| Inactivity Window [비활성화] | 현재 세팅 영역 | 클릭 | API 호출 (null 전송) | 성공 시 경고 알림 표시 + Toast |
| Lookback [+ 채널 추가] | Lookback 카드 상단 | 클릭 | 채널 추가 Dialog 열기 | — |
| Attribution [+ 채널 추가] | Attribution 카드 상단 | 클릭 | 채널 추가 Dialog 열기 | — |
| [선택 삭제 (N)] | 테이블 상단 (선택 시 표시) | 클릭 | 선택된 행 일괄 삭제 → API 호출 | 성공 시 행 제거 + 선택 초기화 + Toast |
| 테이블 행 클릭 | 테이블 내 행 | 클릭 | 해당 행 인라인 편집 모드 활성화 | — |
| 인라인 [저장] | 편집 모드 행 내부 | 클릭 | 변경된 값 유효성 검사 → API 호출 | 성공 시 편집 모드 종료 + 값 갱신 + Toast |
| 인라인 [취소] | 편집 모드 행 내부 | 클릭 | 원래 값으로 복원 | 편집 모드 종료 |
| Dialog [추가] | 채널 추가 Dialog 하단 | 클릭 | 채널명 중복 검사 → 값 유효성 → API 호출 | 성공 시 Dialog 닫힘 + 테이블 행 추가 + Toast |
| Dialog [취소] | 채널 추가 Dialog 하단 | 클릭 | Dialog 닫기 | 입력값 초기화 |
| Dialog [X] | 채널 추가 Dialog 우상단 | 클릭 | Dialog 닫기 | 입력값 초기화 |

### 인터랙션 타이밍

| 인터랙션 | 방식 | 값 |
|----------|------|-----|
| Toast 자동 닫힘 | 표시 후 | 5초 |
| 버튼 로딩 상태 | API 호출 중 | 호출 시작~응답까지 비활성화 + 스피너 |
| Dialog 열기/닫기 | 클릭 | Dialog 기본 애니메이션 |
| Accordion 열기/닫기 | 클릭 토글 | 애니메이션 200ms |
| 탭 전환 (Lookback/Attribution) | 클릭 | 즉시 전환 (데이터 유지 — 탭 간 상태 독립) |
| 인라인 편집 전환 | 행 클릭 | 즉시 반영 (편집 필드 노출) |

### 키보드 접근성

| 키 | 동작 |
|----|------|
| Tab | 폼 필드 간 포커스 이동 (입력 필드 → 단위 선택 → 버튼) |
| Enter | 포커스된 버튼 실행 (저장, 변경, 추가 등) |
| Escape | Dialog 닫기, 인라인 편집 취소 |
| Space | 체크박스 토글 (테이블 행 선택/해제) |

---

## 5. 컴포넌트 상세

### 계층 구조

```
App.tsx
├── HomeNav                          # 페이지 네비게이션
├── Header                           # 앱 정보 헤더
│   └── Badge (x3)                   # App, ID, Timezone 배지
├── SettingsTab                      # 설정 탭 컨테이너
│   ├── InactivityWindow             # Inactivity Window 카드
│   │   ├── Accordion                # 현재 세팅 / 세팅 변경
│   │   ├── UnitSelect               # 시간 단위 선택
│   │   └── InfoTooltip              # 도움말 툴팁
│   ├── LookbackWindow               # Lookback Window 카드
│   │   ├── Tabs                     # Install/Open 탭
│   │   ├── EditableTable            # 채널별 설정 테이블
│   │   │   ├── Dialog               # 채널 추가 모달
│   │   │   ├── Checkbox             # 행 선택
│   │   │   ├── InlineInput          # 인라인 편집
│   │   │   └── UnitSelect           # 시간 단위 선택
│   │   └── InfoTooltip              # 도움말 툴팁
│   └── AttributionWindow            # Attribution Window 카드
│       ├── Tabs                     # 4개 이벤트 타입 탭
│       ├── AttributionTable         # 채널별 설정 테이블
│       │   ├── Dialog               # 채널 추가 모달
│       │   ├── Checkbox             # 행 선택
│       │   └── UnitSelect           # 시간 단위 선택
│       └── InfoTooltip              # 도움말 툴팁
└── Toaster                          # Toast 알림
```

### 주요 컴포넌트 Props

#### Header
```typescript
interface HeaderProps {
  appInfo: AppInfo;
}

interface AppInfo {
  name: string;      // 앱 이름
  id: number;        // 앱 ID
  timezone: string;  // 타임존 (IANA 형식)
}
```

#### SettingsTab
```typescript
interface SettingsTabProps {
  settings: ReactivatedAttributionSettings;
  onUpdateInactivityWindow: (period: WindowPeriod) => void;
  onDisableInactivityWindow: () => void;
  onUpdateLookbackWindow: (
    eventType: LookbackEventType,
    channelIndex: number,
    updates: Partial<LookbackWindowSettings>
  ) => void;
  onAddLookbackWindowChannel: (eventType: LookbackEventType, channel: ChannelLookbackWindow) => void;
  onRemoveLookbackWindowChannel: (eventType: LookbackEventType, channelIndex: number) => void;
  onUpdateAttributionWindow: (
    eventType: AttributionEventType,
    channelIndex: number,
    updates: Partial<AttributionWindowSettings>
  ) => void;
  onAddAttributionWindowChannel: (eventType: AttributionEventType, channel: ChannelAttributionWindow) => void;
  onRemoveAttributionWindowChannel: (eventType: AttributionEventType, channelIndex: number) => void;
}
```

#### InactivityWindow
```typescript
interface InactivityWindowProps {
  value: WindowPeriod | null;  // null이면 미설정 상태
  onSave: (period: WindowPeriod) => void;
  onDisable: () => void;
}
```

#### LookbackWindow
```typescript
interface LookbackWindowProps {
  reactivatedInstall: ChannelLookbackWindow[];
  reactivatedOpen: ChannelLookbackWindow[];
  onUpdate: (
    eventType: LookbackEventType,
    channelIndex: number,
    updates: Partial<LookbackWindowSettings>
  ) => void;
  onAdd: (eventType: LookbackEventType, channel: ChannelLookbackWindow) => void;
  onRemove: (eventType: LookbackEventType, channelIndex: number) => void;
}
```

#### AttributionWindow
```typescript
interface AttributionWindowProps {
  reactivatedInstall: ChannelAttributionWindow[];
  reactivatedOpen: ChannelAttributionWindow[];
  reactivatedDeeplinkOpen: ChannelAttributionWindow[];
  reactivatedDeeplinkPageview: ChannelAttributionWindow[];
  onUpdate: (
    eventType: AttributionEventType,
    channelIndex: number,
    updates: Partial<AttributionWindowSettings>
  ) => void;
  onAdd: (eventType: AttributionEventType, channel: ChannelAttributionWindow) => void;
  onRemove: (eventType: AttributionEventType, channelIndex: number) => void;
}
```

#### EditableTable (Lookback Window용)
```typescript
interface EditableTableProps {
  data: ChannelLookbackWindow[];
  onUpdate: (index: number, updates: Partial<LookbackWindowSettings>) => void;
  onAdd: (channel: ChannelLookbackWindow) => void;
  onRemove: (index: number) => void;
}
```

#### AttributionTable
```typescript
interface AttributionTableProps {
  data: ChannelAttributionWindow[];
  onUpdate: (index: number, updates: Partial<AttributionWindowSettings>) => void;
  onAdd: (channel: ChannelAttributionWindow) => void;
  onRemove: (index: number) => void;
}
```

### 상태 관리 (useSettings Hook)

```typescript
interface useSettingsReturn {
  // 현재 설정값
  settings: ReactivatedAttributionSettings;

  // Inactivity Window 조작
  updateInactivityWindow: (period: WindowPeriod) => void;
  disableInactivityWindow: () => void;

  // Lookback Window 조작
  updateLookbackWindow: (
    eventType: LookbackEventType,
    channelIndex: number,
    updates: Partial<LookbackWindowSettings>
  ) => void;
  addLookbackWindowChannel: (eventType: LookbackEventType, channel: ChannelLookbackWindow) => void;
  removeLookbackWindowChannel: (eventType: LookbackEventType, channelIndex: number) => void;

  // Attribution Window 조작
  updateAttributionWindow: (
    eventType: AttributionEventType,
    channelIndex: number,
    updates: Partial<AttributionWindowSettings>
  ) => void;
  addAttributionWindowChannel: (eventType: AttributionEventType, channel: ChannelAttributionWindow) => void;
  removeAttributionWindowChannel: (eventType: AttributionEventType, channelIndex: number) => void;
}
```

---

## 6. 사용자 플로우

### Inactivity Window 설정 플로우

```
[시작] ──→ Inactivity Window 카드 확인
            │
            ▼
    ┌───────────────────┐
    │ 현재 설정 있음?    │
    └───────────────────┘
            │
     Yes ←──┴──→ No
      │           │
      ▼           ▼
┌─────────┐  ┌──────────────┐
│ 세팅    │  │ 경고 알림     │
│ 변경    │  │ 표시됨       │
└─────────┘  └──────────────┘
      │           │
      ▼           ▼
┌─────────────────────────┐
│ "🔧 세팅 변경/추가" 열기  │
└─────────────────────────┘
            │
            ▼
┌─────────────────────────┐
│ 값 입력 + 단위 선택      │
│ (숫자 + TimeUnit)        │
└─────────────────────────┘
            │
            ▼
┌─────────────────────────┐
│ [저장/변경] 버튼 클릭    │
└─────────────────────────┘
            │
            ▼
┌─────────────────────────┐
│ Toast: "저장되었습니다"  │
└─────────────────────────┘
            │
            ▼
         [완료]
```

### Inactivity Window 비활성화 플로우

```
[시작] ──→ "🔍 현재 세팅" 섹션 열기
            │
            ▼
┌─────────────────────────┐
│ [비활성화] 버튼 클릭     │
│ (빨간색 버튼)            │
└─────────────────────────┘
            │
            ▼
┌─────────────────────────┐
│ 설정값 null로 변경       │
│ 경고 알림 표시           │
└─────────────────────────┘
            │
            ▼
┌─────────────────────────┐
│ Toast: "비활성화됨"      │
└─────────────────────────┘
            │
            ▼
         [완료]
```

### 채널 추가 플로우 (Lookback/Attribution)

```
[시작] ──→ 해당 이벤트 타입 탭 선택
            │
            ▼
┌─────────────────────────┐
│ [+ 채널 추가] 버튼 클릭  │
└─────────────────────────┘
            │
            ▼
┌─────────────────────────┐
│ 다이얼로그 열림          │
│ - 채널명 입력            │
│ - 기간 설정              │
└─────────────────────────┘
            │
            ▼
    ┌───────────────────┐
    │ 채널명 중복?       │
    └───────────────────┘
            │
     Yes ←──┴──→ No
      │           │
      ▼           ▼
┌──────────┐ ┌────────────┐
│ 에러     │ │ 채널 추가  │
│ Toast    │ │ 성공       │
└──────────┘ └────────────┘
      │           │
      ▼           ▼
[다이얼로그    [다이얼로그
 유지]         닫힘]
```

### 채널 설정 수정 플로우

```
[시작] ──→ 테이블에서 행 클릭
            │
            ▼
┌─────────────────────────┐
│ 해당 행 편집 모드 활성화 │
│ - 인라인 입력 필드 표시  │
│ - [저장] [취소] 버튼     │
└─────────────────────────┘
            │
            ▼
    ┌───────────────────┐
    │ 값 수정 후        │
    └───────────────────┘
            │
┌────────┴────────┐
▼                 ▼
[저장]            [취소]
  │                 │
  ▼                 ▼
┌──────────┐   ┌──────────┐
│ 설정     │   │ 원래     │
│ 업데이트 │   │ 값 복원  │
└──────────┘   └──────────┘
      │             │
      ▼             ▼
┌──────────────────────┐
│ 편집 모드 종료        │
└──────────────────────┘
```

### 채널 일괄 삭제 플로우

```
[시작] ──→ 테이블에서 체크박스로 행 선택
            │
            ▼
┌─────────────────────────┐
│ [선택 삭제 (N)] 버튼    │
│ 활성화 (빨간색)          │
└─────────────────────────┘
            │
            ▼
┌─────────────────────────┐
│ 버튼 클릭               │
└─────────────────────────┘
            │
            ▼
┌─────────────────────────┐
│ 선택된 모든 행 삭제      │
│ (인덱스 역순으로 처리)   │
└─────────────────────────┘
            │
            ▼
┌─────────────────────────┐
│ Toast: "삭제되었습니다"  │
└─────────────────────────┘
            │
            ▼
         [완료]
```

---

## 7. API 명세

### 데이터 모델

#### TimeUnit / WindowPeriod
```typescript
export type TimeUnit = 'minutes' | 'hours' | 'days' | 'months' | 'years';

export interface WindowPeriod {
  value: number;
  unit: TimeUnit;
}
```

#### LookbackWindowSettings / ChannelLookbackWindow
```typescript
export interface LookbackWindowSettings {
  clickDeviceMatching: WindowPeriod;
  clickProbabilisticModeling: WindowPeriod;
  viewDeviceMatching: WindowPeriod;
  viewProbabilisticModeling: WindowPeriod;
}

export interface ChannelLookbackWindow {
  channel: string;
  settings: LookbackWindowSettings;
}
```

#### AttributionWindowSettings / ChannelAttributionWindow
```typescript
export interface AttributionWindowSettings {
  attributionWindow: WindowPeriod;
}

export interface ChannelAttributionWindow {
  channel: string;
  settings: AttributionWindowSettings;
}
```

#### 이벤트 타입
```typescript
export type LookbackEventType = 'reactivatedInstall' | 'reactivatedOpen';

export type AttributionEventType =
  | 'reactivatedInstall'
  | 'reactivatedOpen'
  | 'reactivatedDeeplinkOpen'
  | 'reactivatedDeeplinkPageview';
```

#### AppInfo
```typescript
export interface AppInfo {
  name: string;
  id: number;
  timezone: string;
}
```

#### ReactivatedAttributionSettings (전체 설정)
```typescript
export interface ReactivatedAttributionSettings {
  inactivityWindow: WindowPeriod | null;
  lookbackWindows: {
    reactivatedInstall: ChannelLookbackWindow[];
    reactivatedOpen: ChannelLookbackWindow[];
  };
  attributionWindows: {
    reactivatedInstall: ChannelAttributionWindow[];
    reactivatedOpen: ChannelAttributionWindow[];
    reactivatedDeeplinkOpen: ChannelAttributionWindow[];
    reactivatedDeeplinkPageview: ChannelAttributionWindow[];
  };
}
```

### API 엔드포인트

#### 설정 조회

```
GET /api/apps/{appId}/reactivation-settings
```

| 항목 | 내용 |
|------|------|
| Path Param | appId: number (App ID) |
| 호출 시점 | 페이지 진입 시 (초기 데이터 로드) |

**Response 200**
```json
{
  "data": {
    "inactivityWindow": { "value": 7, "unit": "days" },
    "lookbackWindows": {
      "reactivatedInstall": [
        {
          "channel": "Global",
          "settings": {
            "clickDeviceMatching": { "value": 7, "unit": "days" },
            "clickProbabilisticModeling": { "value": 1, "unit": "days" },
            "viewDeviceMatching": { "value": 1, "unit": "days" },
            "viewProbabilisticModeling": { "value": 6, "unit": "hours" }
          }
        }
      ],
      "reactivatedOpen": [
        {
          "channel": "Global",
          "settings": { "..." : "..." }
        }
      ]
    },
    "attributionWindows": {
      "reactivatedInstall": [
        { "channel": "Global", "settings": { "attributionWindow": { "value": 7, "unit": "days" } } }
      ],
      "reactivatedOpen": [ "..." ],
      "reactivatedDeeplinkOpen": [ "..." ],
      "reactivatedDeeplinkPageview": [ "..." ]
    }
  }
}
```

**Response 404** -- 존재하지 않는 App
```json
{
  "error": {
    "code": "APP_NOT_FOUND",
    "message": "App not found"
  }
}
```

---

#### Inactivity Window 업데이트

```
PATCH /api/apps/{appId}/reactivation-settings/inactivity-window
```

| 항목 | 내용 |
|------|------|
| Path Param | appId: number |
| 호출 시점 | Inactivity Window [저장]/[변경]/[비활성화] 클릭 시 |

**Request Body -- 값 설정**
```json
{
  "inactivityWindow": { "value": 7, "unit": "days" }
}
```

**Request Body -- 비활성화**
```json
{
  "inactivityWindow": null
}
```

**Response 200** -- 업데이트 성공
```json
{
  "data": {
    "inactivityWindow": { "value": 7, "unit": "days" }
  }
}
```

**Response 400** -- 유효성 에러
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "value must be a positive integer"
  }
}
```

---

#### Lookback Window 업데이트

```
PATCH /api/apps/{appId}/reactivation-settings/lookback-windows/{eventType}
```

| 항목 | 내용 |
|------|------|
| Path Param | appId: number, eventType: `reactivatedInstall` 또는 `reactivatedOpen` |
| 호출 시점 | 채널 추가, 인라인 편집 저장, 선택 삭제 시 |

**Request Body**
```json
{
  "channels": [
    {
      "channel": "Global",
      "settings": {
        "clickDeviceMatching": { "value": 7, "unit": "days" },
        "clickProbabilisticModeling": { "value": 1, "unit": "days" },
        "viewDeviceMatching": { "value": 1, "unit": "days" },
        "viewProbabilisticModeling": { "value": 6, "unit": "hours" }
      }
    },
    {
      "channel": "moloco",
      "settings": {
        "clickDeviceMatching": { "value": 3, "unit": "days" },
        "clickProbabilisticModeling": { "value": 1, "unit": "days" },
        "viewDeviceMatching": { "value": 1, "unit": "days" },
        "viewProbabilisticModeling": { "value": 3, "unit": "hours" }
      }
    }
  ]
}
```

**Response 200** -- 업데이트 성공
```json
{
  "data": {
    "channels": [ "..." ]
  }
}
```

**Response 400** -- 유효성 에러
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Duplicate channel name: moloco"
  }
}
```

---

#### Attribution Window 업데이트

```
PATCH /api/apps/{appId}/reactivation-settings/attribution-windows/{eventType}
```

| 항목 | 내용 |
|------|------|
| Path Param | appId: number, eventType: `reactivatedInstall`, `reactivatedOpen`, `reactivatedDeeplinkOpen`, `reactivatedDeeplinkPageview` 중 하나 |
| 호출 시점 | 채널 추가, 인라인 편집 저장, 선택 삭제 시 |

**Request Body**
```json
{
  "channels": [
    { "channel": "Global", "settings": { "attributionWindow": { "value": 7, "unit": "days" } } },
    { "channel": "moloco", "settings": { "attributionWindow": { "value": 14, "unit": "days" } } }
  ]
}
```

**Response 200** -- 업데이트 성공
```json
{
  "data": {
    "channels": [ "..." ]
  }
}
```

**Response 400** -- 유효성 에러
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Duplicate channel name: moloco"
  }
}
```

---

### API 에러 공통 처리

| HTTP 상태 | 클라이언트 처리 |
|-----------|----------------|
| 400 | 에러 메시지 Toast 표시 |
| 404 (App) | "존재하지 않는 App입니다." Toast 표시 |
| 409 | 서버 메시지 그대로 Toast 표시 (채널 중복 등) |
| 500 | "서버 오류가 발생했습니다. 관리자에게 문의해주세요." Toast 표시 |
| Network Error | "서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요." Toast 표시 |
| Timeout (30초) | "요청 시간이 초과되었습니다. 잠시 후 다시 시도해주세요." Toast 표시 |

### Mock vs 실제 API 전환

| 기능 | 현재 구현 (Mock) | 실제 API 전환 시 변경 사항 |
|------|-----------------|--------------------------|
| 설정 조회 | mockSettings 객체 반환 | GET API 호출 + 로딩/에러 상태 처리 |
| Inactivity Window 업데이트 | 로컬 상태 변경 + Toast | PATCH API 호출 + 응답 검증 |
| Lookback Window 업데이트 | 로컬 상태 변경 + Toast | PATCH API 호출 + 응답 검증 |
| Attribution Window 업데이트 | 로컬 상태 변경 + Toast | PATCH API 호출 + 응답 검증 |
| 채널 중복 검사 | 클라이언트 로컬 검사 | 클라이언트 검증 유지 + 서버 2차 검증 (409 응답) |
| appId 처리 | mockAppInfo 하드코딩 | URL 파라미터 또는 Context에서 동적 취득 |

---

## 8. 디자인/개발 체크리스트

### 디자이너 체크리스트

#### 컴포넌트 디자인
- [ ] Card 컴포넌트 스타일 정의 (padding, border-radius, shadow)
- [ ] Accordion 열림/닫힘 애니메이션
- [ ] 테이블 hover 상태 스타일
- [ ] 편집 모드 강조 스타일 (bg-muted/50)
- [ ] Toast 알림 위치 및 스타일

#### 색상 체계
- [ ] 필수 태그: 빨간 배경 (`bg-red-100`, `text-red-700`)
- [ ] 성공 상태: 초록색 아이콘
- [ ] 경고/미설정: 빨간색 아이콘
- [ ] 비활성화 버튼: destructive variant

#### 인터랙션
- [ ] 버튼 hover/active 상태
- [ ] 입력 필드 focus 스타일
- [ ] Dialog 오버레이 및 애니메이션
- [ ] Tooltip 지연 시간 및 위치
- [ ] 버튼 로딩(스피너) 상태

#### 반응형 고려사항
- [ ] 4개 탭 (Attribution Window) 모바일 처리
- [ ] 테이블 가로 스크롤 또는 카드 변환
- [ ] Dialog 모바일 최적화
- [ ] 반응형 레이아웃 (최대 너비 920px)

### 개발자 체크리스트

#### 기능 구현
- [ ] Inactivity Window CRUD
- [ ] Lookback Window CRUD (2개 이벤트 타입)
- [ ] Attribution Window CRUD (4개 이벤트 타입)
- [ ] 채널 추가/삭제/수정
- [ ] 중복 채널 validation
- [ ] Toast 알림

#### 상태 관리
- [ ] Immutable 상태 업데이트 (spread operator)
- [ ] 선택된 행 상태 관리 (Set 사용)
- [ ] 편집 모드 로컬 상태
- [ ] Dialog 열림/닫힘 상태

#### API 연동
- [ ] API 에러 응답별 Toast 메시지 매핑
- [ ] 네트워크 에러/타임아웃 처리
- [ ] 버튼 로딩(스피너) 상태
- [ ] 낙관적 업데이트 (Optimistic Update) 구현

#### 접근성 (Accessibility)
- [ ] 체크박스 aria-label
- [ ] 버튼 키보드 접근성
- [ ] Dialog focus trap
- [ ] 색상 대비 확인

#### 테스트
- [ ] 각 컴포넌트 단위 테스트
- [ ] useSettings Hook 테스트
- [ ] 중복 채널 validation 테스트
- [ ] 삭제 시 인덱스 역순 처리 테스트

#### 성능
- [ ] 불필요한 리렌더링 방지 (useCallback)
- [ ] 큰 테이블 가상화 고려
- [ ] Dialog lazy loading

---

## 부록 A. 타입 정의 전체

```typescript
// 시간 단위
export type TimeUnit = 'minutes' | 'hours' | 'days' | 'months' | 'years';

// 기간 값
export interface WindowPeriod {
  value: number;
  unit: TimeUnit;
}

// Lookback Window 설정 (4가지 매칭 방식)
export interface LookbackWindowSettings {
  clickDeviceMatching: WindowPeriod;
  clickProbabilisticModeling: WindowPeriod;
  viewDeviceMatching: WindowPeriod;
  viewProbabilisticModeling: WindowPeriod;
}

// 채널별 Lookback Window
export interface ChannelLookbackWindow {
  channel: string;
  settings: LookbackWindowSettings;
}

// Attribution Window 설정
export interface AttributionWindowSettings {
  attributionWindow: WindowPeriod;
}

// 채널별 Attribution Window
export interface ChannelAttributionWindow {
  channel: string;
  settings: AttributionWindowSettings;
}

// Lookback 이벤트 타입
export type LookbackEventType = 'reactivatedInstall' | 'reactivatedOpen';

// Attribution 이벤트 타입
export type AttributionEventType =
  | 'reactivatedInstall'
  | 'reactivatedOpen'
  | 'reactivatedDeeplinkOpen'
  | 'reactivatedDeeplinkPageview';

// 앱 정보
export interface AppInfo {
  name: string;
  id: number;
  timezone: string;
}

// 전체 설정
export interface ReactivatedAttributionSettings {
  inactivityWindow: WindowPeriod | null;
  lookbackWindows: {
    reactivatedInstall: ChannelLookbackWindow[];
    reactivatedOpen: ChannelLookbackWindow[];
  };
  attributionWindows: {
    reactivatedInstall: ChannelAttributionWindow[];
    reactivatedOpen: ChannelAttributionWindow[];
    reactivatedDeeplinkOpen: ChannelAttributionWindow[];
    reactivatedDeeplinkPageview: ChannelAttributionWindow[];
  };
}
```

---

## 부록 B. 파일 구조

```
src/
├── App.tsx                              # 메인 앱 컴포넌트
├── main.tsx                             # 앱 엔트리포인트
├── index.css                            # 전역 스타일
├── types/
│   └── index.ts                         # 타입 정의
├── hooks/
│   └── useSettings.ts                   # 설정 상태 관리 Hook
├── data/
│   └── mockData.ts                      # Mock 데이터 및 유틸
├── lib/
│   └── utils.ts                         # 유틸리티 함수 (cn)
├── components/
│   ├── common/
│   │   ├── InfoTooltip.tsx              # 도움말 툴팁
│   │   └── UnitSelect.tsx               # 시간 단위 선택
│   ├── layout/
│   │   ├── Header.tsx                   # 앱 정보 헤더
│   │   ├── HomeNav.tsx                  # 페이지 네비게이션
│   │   └── PageTabs.tsx                 # 개요/설정 탭 (미사용)
│   ├── overview/
│   │   ├── OverviewTab.tsx              # 개요 탭 (미사용)
│   │   ├── SettingSummaryCard.tsx       # 요약 카드 (미사용)
│   │   └── HelpSection.tsx              # 도움말 섹션 (미사용)
│   ├── settings/
│   │   ├── SettingsTab.tsx              # 설정 탭 컨테이너
│   │   ├── InactivityWindow.tsx         # Inactivity Window 카드
│   │   ├── LookbackWindow.tsx           # Lookback Window 카드
│   │   ├── AttributionWindow.tsx        # Attribution Window 카드
│   │   ├── EditableTable.tsx            # Lookback용 편집 테이블
│   │   └── AttributionTable.tsx         # Attribution용 편집 테이블
│   └── ui/                              # shadcn/ui 컴포넌트
│       ├── accordion.tsx
│       ├── alert.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── checkbox.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── select.tsx
│       ├── sonner.tsx
│       ├── table.tsx
│       ├── tabs.tsx
│       └── tooltip.tsx
```
