# Custom Channel Permission Backoffice

대행사의 커스텀 채널 캠페인 권한을 관리하는 백오피스 도구입니다.

## 기능

- **App 검색**: App ID 또는 Name으로 앱 정보 조회
- **Agency 선택**: 앱에 연결된 대행사 드롭다운 선택
- **권한 조회**: 현재 Permission JSON 표시 (Collapsible)
- **채널 관리**: Custom Channel 추가/삭제
- **필터 관리**: Data Filter (startswith/endswith/is/is_not) CRUD
- **변경 적용**: Apply 버튼으로 저장, 변경 감지

## 기술 스택

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **배포**: GitHub Pages

## 개발

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프리뷰
npm run preview
```

## 배포

main 브랜치에 push하면 GitHub Actions를 통해 자동으로 GitHub Pages에 배포됩니다.

배포 URL: https://ab180frontend.github.io/custom-channel-permission-backoffice/

## 프로젝트 구조

```
src/
├── App.tsx                     # 메인 레이아웃
├── main.tsx                    # 엔트리 포인트
├── index.css                   # Tailwind CSS
├── components/
│   ├── ui/                     # shadcn/ui 컴포넌트
│   ├── layout/
│   │   └── PageHeader.tsx      # 페이지 헤더
│   ├── guide/
│   │   └── PermissionGuide.tsx # 상세 가이드 (Accordion)
│   └── permission/
│       ├── AppSearchSection.tsx    # App 검색 + 정보 표시
│       ├── AgencySelector.tsx      # Agency 드롭다운
│       ├── CurrentPermissionView.tsx # 현재 권한 JSON
│       ├── ChannelPermissionList.tsx # 채널 권한 목록
│       ├── ChannelPermissionCard.tsx # 개별 채널 카드
│       ├── DataFilterItem.tsx      # 개별 필터 아이템
│       ├── AddChannelDialog.tsx    # 채널 추가 다이얼로그
│       ├── AddFilterDialog.tsx     # 필터 추가 다이얼로그
│       └── ActionButtons.tsx       # Apply/Reset 버튼
├── types/
│   └── index.ts                # 모든 타입 정의
├── data/
│   └── mock.ts                 # 목업 데이터
├── lib/
│   ├── utils.ts                # cn() 유틸리티
│   └── permission.ts           # 권한 관련 유틸리티
└── hooks/
    └── usePermissionForm.ts    # 폼 상태 관리 훅
```

## 필터 타입

| 타입 | 설명 | 예시 |
|-----|------|-----|
| startswith | 캠페인명이 특정 문자열로 시작 | `summer_` → `summer_sale`, `summer_event` |
| endswith | 캠페인명이 특정 문자열로 끝남 | `_2024` → `spring_2024`, `fall_2024` |
| is | 정확히 일치 | `main_campaign` → 정확히 `main_campaign`만 |
| is_not | 일치하지 않음 | `test` → `test` 제외 모든 캠페인 |
