CS.Report.Event Usage Report 백오피스 동작 분석핵심 요약Event Usage Report는 airbridge-cs-streamlit 레포지토리에 구현된 Streamlit 기반 CS팀용 백오피스 도구로, 특정 앱의 이벤트 수집 현황, 리포트 쿼리 사용량, 포스트백 전송 상태를 확인할 수 있는 페이지입니다.
1. 기본 정보[오전 10:27]row: 7항목내용레포지토리
ab180/airbridge-cs-streamlit
메인 파일
src/pages/report/event_usage_report.py
접근 URL
https://app.airbridge.io/app/{subdomain}/internals/office/cs
기술 스택
Python, Streamlit, Plotly, Pandas, SQLAlchemy데이터 소스
Snowflake + Main RDBOwner
Juhong Jung권한
AuthorizedPage 상속 — ADMIN, WRITE, LIMITED_WRITE, READ, LIMITED_READ 모두 접근 가능
[오전 10:27]2. 페이지 구조 및 동작 흐름페이지는 크게 3개 섹션으로 구성됩니다.
섹션 1: App Info (앱 선택)
app_input 컴포넌트를 통해 AppID 또는 AppName(subdomain) 을 입력API 토큰으로 접근 시 static_app_id가 자동 설정되어 앱이 고정됨앱 정보(ID, Name, Timezone, 아이콘)를 좌우 2컬럼으로 표시섹션 2: Event Collection Status (이벤트 수집 현황)
데이터 소스: Snowflake — AIROFFICE.PUBLIC.DRUID_ACTUALS_REPORT_DAILY조건: 최근 30일, event_source ≠ 'tracking_link'집계: date_start × event_source × event_category 별 SUM(event_count)시각화: Plotly 라인차트 (각 event_source + event_category 조합이 개별 라인)부가 UI: Expander 내에 SQL 원문 + 피벗 테이블 제공sqlSELECT date_start as dt, event_source, event_category, SUM(event_count) AS events
FROM AIROFFICE.PUBLIC.DRUID_ACTUALS_REPORT_DAILY
WHERE app_id = {app_id}
  AND date_start >= CURRENT_DATE - INTERVAL '30 DAY'
  AND date_start < CURRENT_DATE
  AND event_source not in ('tracking_link')
GROUP BY 1, 2, 3
ORDER BY 1, 2, 3섹션 3: Event Usage (이벤트 사용량 상세)
이 섹션은 사용자 인터랙션 기반으로 동작합니다.① 이벤트 카테고리 목록 조회 (Snowflake)
먼저 최근 30일의 event_category 고유 목록을 Snowflake에서 가져옴이 목록을 st.multiselect 드롭다운의 선택지로 사용 (기본값: ["9161"])② 사용자 입력
날짜 범위: 기본 최근 7일, 최대 31일 제한이벤트 카테고리: 멀티셀렉트로 복수 선택 가능"Run Query" 버튼: 클릭 시 선택된 카테고리별로 아래 2개 쿼리 실행③ Report Usage (리포트 쿼리 사용량) — Main RDB
테이블: tbl_query_tasks로직: 해당 앱의 쿼리 태스크 중 query 필드에 선택한 event_category가 포함된 것(LIKE '%{event_category}%')을 집계집계: 날짜별 × API별 COUNT(*)시각화: Plotly 라인차트 + 피벗 테이블 + SQL 원문sqlSELECT CAST(created_at AS date) AS dt, api, COUNT(*) AS cnt
FROM tbl_query_tasks
WHERE app_id = {app_id}
  AND created_at >= '{date_start}' AND created_at < '{date_end}'
  AND query LIKE '%%{event_category}%%'
GROUP BY 1, 2
ORDER BY 1, 2④ Postback Sent Status (포스트백 전송 현황) — Snowflake
테이블: INTERNAL_POSTBACK_LOGS필터: Google Ads 제외 (google.adwords, google.adwords.crossnetwork — 모든 이벤트를 전송하므로 분석에서 제외)집계: 날짜별 × req_target × req_produced_by 별 COUNT(*)시각화: Plotly 라인차트 + SQL 원문 + 피벗 테이블sqlSELECT DATE_TRUNC(DAY, DATA__REQUEST__TIMESTAMP)::DATE AS dt,
       DATA__REQUEST__TARGET as req_target,
       DATA__REQUEST__PRODUCEDBY as req_produced_by,
       COUNT(*) AS sent_count
FROM INTERNAL_POSTBACK_LOGS
WHERE DATA__APPID = {app_id}
  AND DATA__REQUEST__TIMESTAMP >= '{date_start}' AND DATA__REQUEST__TIMESTAMP < '{date_end}'
  AND DATA__REQUEST__TARGET NOT IN ('google.adwords', 'google.adwords.crossnetwork')
  AND DATA__EVENTDATA__CATEGORY IN ('{event_category}')
GROUP BY 1, 2, 3
ORDER BY 1, 2, 33. 인증/권한 구조AuthorizedPage를 상속하며, 3가지 인증 방식을 순서대로 시도합니다:
[오전 10:27]row: 3순서방식설명1WebSocket 헤더
리버스 프록시가 주입하는 X-Authenticated-User, X-Page-Permission-Level 헤더
2API 토큰
api_token 쿼리 파라미터 → tbl_api_tokens 조회 → 사용자/앱 매핑
3DEV 모드
환경변수 STAGE=DEV일 때 자동 로그인
[오전 10:27]인증 실패 → "로그인이 필요합니다"인가 실패 → "페이지 권한이 없습니다"API 토큰 로그인 시 static_app_id가 설정되어 앱이 자동 고정됨4. 인프라 및 데이터 소스[오전 10:27]row: 3데이터 소스연결 방식용도Snowflake
SQLAlchemy Engine (private key 인증)DRUID_ACTUALS_REPORT_DAILY, INTERNAL_POSTBACK_LOGS 조회
Main RDB
SQLAlchemy Session (DB__MAIN__UDL__URL)
tbl_query_tasks 조회
Airoffice RDB
SQLAlchemy Session (DB__AIRBUCKET__AIROFFICE__URL)
생성자에 주입되나 이 페이지에서는 직접 사용 안 함
[오전 10:27]5. 관련 파일 전체 목록[오전 10:27]row: 8파일 경로 (in airbridge-cs-streamlit)
역할src/pages/report/event_usage_report.py
메인 페이지 클래스 (EventUsageReport)
.streamlit/pages_sections.toml
페이지 라우트/네비게이션 등록 (Report 섹션)src/components/authorized_page.py
인증/인가 베이스 클래스src/components/app_input.py
앱 선택 입력 컴포넌트src/infra/app_repo.py
TblApps 모델 및 AppRepo
src/infra/db.py
Database 클래스 (SQLAlchemy 엔진 래퍼)
src/infra/rdb.py
RDB 세션 팩토리 (Main, Airoffice)src/infra/snowflake.py
Snowflake 연결 (private key 인증)[오전 10:27]6. 운영 이슈 이력 (Slack 기반)[오전 10:27]row: 2일시내용출처2025-12-23Postback Sent Status 쿼리(INTERNAL_POSTBACK_LOGS)가 Snowflake RAW_DATA_EXPORT 웨어하우스에 부하를 줘 data export lag 발생. Warehouse 분리 검토 제안됨
#dev-backend-report 스레드
2025-12-19CSM이 고객사 이벤트 최적화 시 Event Usage Report 사용. 크롬에서 쿼리량 테이블 다운로드 불가(사파리 필요), 이벤트별로 하나하나 드롭다운 선택해야 하는 UX 불편 보고
#business-sqd-kr-gaming 스레드[오전 10:27]7. 전체 동작 플로우 다이어그램사용자 접근 (https://app.airbridge.io/app/{subdomain}/internals/office/cs)
    │
    ▼
[인증 체크] ── 실패 → "로그인이 필요합니다"
    │ 성공
    ▼
[앱 선택] ── AppID/AppName 입력 or static_app_id 자동 설정
    │
    ▼
[섹션 2: Event Collection Status]
    │  Snowflake: DRUID_ACTUALS_REPORT_DAILY (최근 30일)
    │  → event_source × event_category별 이벤트 수 라인차트
    │
    ▼
[섹션 3: Event Usage]
    │  Snowflake: DRUID_ACTUALS_REPORT_DAILY → event_category 목록 추출
    │
    ├─ 사용자 입력: 날짜 범위 (최대 31일) + 이벤트 카테고리 (멀티셀렉트)
    │
    ├─ [Run Query 클릭] ── 선택한 카테고리별 반복:
    │     │
    │     ├─ [Report Usage]
    │     │    Main RDB: tbl_query_tasks (LIKE 매칭)
    │     │    → 날짜별 × API별 쿼리 횟수 차트
    │     │
    │     └─ [Postback Sent Status]
    │          Snowflake: INTERNAL_POSTBACK_LOGS (Google Ads 제외)
    │          → 날짜별 × target × producedBy별 전송 건수 차트확신도: 위 분석은 실제 GitHub 소스코드(airbridge-cs-streamlit 레포)를 직접 읽고 검증한 결과이며, Slack 운영 이력과 교차 확인 완료했습니다. airbridge-api 레포에는 관련 코드가 없음을 확인했고, Notion의 CS.Report.Event Usage Report 페이지는 본문이 비어 있어 코드가 유일한 Source of Truth입니다.