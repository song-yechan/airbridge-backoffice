Worker.Attribution.Reactivated Attribution 백오피스 동작 분석 요약Reactivated Attribution은 비활성 유저가 다시 앱을 사용할 때 이를 "재활성화(Reactivation)"로 인식하고, 해당 이벤트에 대해 별도의 어트리뷰션을 수행하는 기능입니다. 백오피스에서는 이 기능의 핵심 설정값인 Inactivity Window, Lookback Window, Attribution Window를 앱별로 관리합니다.
1. 백오피스 UI 구성백오피스 페이지는 3개의 주요 설정 섹션으로 구성됩니다:[오후 1:26]row: 3섹션설명Inactivity Window
Reactivation 판단 기준이 되는 비활성 기간Lookback Window
Reactivation Target Event에 대한 터치포인트 매칭 기간Attribution Window
Reactivation 이후 후속 이벤트 어트리뷰션 기간[오후 1:26]출처: backoffice-dashboard/src/pages/attribution/reactivated_attribution/page.py
2. 핵심 설정값 상세2.1 Inactivity Window (필수)
정의: 유저가 앱을 사용하지 않은 기간. 이 기간이 지난 후 앱을 사용하면 Reactivation으로 인식저장 위치: tbl_app_attribution_settings 테이블, setting_category = 'reactivated_attribution'저장 형식: {"inactivityWindow": "P7D"} (ISO 8601 Duration 형식)중요: Inactivity Window를 설정하지 않으면 Reactivation Tracking이 동작하지 않음python# 저장 로직 (attribution_setting_repo.py)
CATEGORY_REACTIVATED_ATTRIBUTION = "reactivated_attribution"

def save_reactivated_attribution_setting(self, app_id: int, setting_json: str):
    setting = TblAppAttributionSetting(
        app_id=app_id,
        setting_category=CATEGORY_REACTIVATED_ATTRIBUTION,
        setting_json=setting_json,  # {"inactivityWindow": "P7D"}
    )
    self.session.merge(setting)출처: backoffice-dashboard/src/infra/attribution_setting_repo.py
2.2 Lookback Window
대상 이벤트: Reactivated Install, Reactivated Open설정 항목 (각각 채널별 설정 가능):Click - Device Matching (기본값: 7일)Click - Probabilistic Modeling Matching (기본값: 1일)View - Device Matching (기본값: 1일)View - Probabilistic Modeling Matching (기본값: 6시간)저장 위치: tbl_app_lookback_windows_v20200916 테이블Key Prefix:reactivated__install__ (Reactivated Install용)reactivated__open__ (Reactivated Open용)python# Lookback Window Key 매핑 (lookback_window_service.py)
LOOKBACK_WINDOW_KEY_PREFIXES_FOR_TARGET_EVENT = {
    (9160, True): "reactivated__open__",           # Open + Reactivated
    (9161, True): "reactivated__install__",        # Install + Reactivated
    (9162, True): "reactivated__deeplink__touchpoint",  # Deeplink Open + Reactivated
    (9164, True): "reactivated__deeplink__touchpoint",  # Deeplink Pageview + Reactivated
}출처: event-worker/app/services/lookback_window_service.py
2.3 Attribution Window
대상 이벤트: Reactivation 이후 발생하는 후속 이벤트(Goal)설정 탭:Reactivated Install → reactivated__goal__installReactivated Open → reactivated__goal__openReactivated Deeplink Open → reactivated__goal__deeplinkReactivated Deeplink Page-view → reactivated__goal__deeplink_pageview기본값: 7일python# Attribution Window Key 매핑 (lookback_window_service.py)
LOOKBACK_WINDOW_KEYS_FOR_SUBSEQUENT_EVENT = {
    (9160, True): "reactivated__goal__open",
    (9161, True): "reactivated__goal__install",
    (9162, True): "reactivated__goal__deeplink",
    (9164, True): "reactivated__goal__deeplink_pageview",
}3. Reactivation 판단 로직 (Event Worker)실제 Reactivation 여부는 event-worker에서 실시간으로 판단됩니다:
python# reactivation_resolution.py
class ReactivationResolution(EventServiceResolution):
    @classmethod
    async def create(cls, event_records_repository, fmt, setting):
        # 1. 대상 이벤트 확인 (9160=Open, 9161=Install, 9162=Deeplink Open, 9164=Deeplink Pageview)
        if fmt.event_category not in [9160, 9161, 9162, 9164] or setting is None:
            return DUMMY_RESOLUTION

        # 2. Inactivity Window 가져오기
        inactivity_w = setting.inactivity_window
        
        # 3. 디바이스의 마지막 활동 시간 조회
        last_activity_ts = await event_records_repository.get_last_activity_ts(fmt.device_pk)
        
        # 4. Reactivation 여부 판단
        # (마지막 활동 시간 + Inactivity Window) < 현재 이벤트 시간 → Reactivation!
        is_reactivated = (
            last_activity_ts + inactivity_w < fmt.event_timestamp
            if last_activity_ts
            else False
        )
        
        return cls(is_reactivated=is_reactivated, device_last_activity_ts=last_activity_ts)출처: event-worker/app/services/event_service/resolutions/reactivation_resolution.py
4. Target Event 판단 로직Reactivation은 Target Event 판단에 영향을 미칩니다:
python# event_category_util.py
def is_target_event(event_category: int, is_reactivated: bool = False) -> bool:
    return event_category in (9161, 9162, 9164) or (
        event_category == 9160 and is_reactivated  # Open은 Reactivated일 때만 Target Event
    )[오후 1:26]row: 4Event Category이벤트기본 Target Event 여부Reactivated일 때9160App Open❌ No✅ Yes9161App Install✅ Yes✅ Yes9162Deeplink Open✅ Yes✅ Yes9164Deeplink Pageview✅ Yes✅ Yes[오후 1:26]출처: event-worker/app/utilities/event_category_util.py
5. 데이터 저장 구조5.1 tbl_app_attribution_settings (Inactivity Window)
[오후 1:26]row: 3컬럼설명app_id
앱 IDsetting_category
'reactivated_attribution'
setting_json
{"inactivityWindow": "P7D"}
[오후 1:26]5.2 tbl_app_lookback_windows_v20200916 (Lookback/Attribution Window)
[오후 1:26]row: 3컬럼설명app_id
앱 IDchannel
채널명 (NULL이면 Global 설정)setting_json
각 Window 설정 JSON[오후 1:26]setting_json 예시:
json{
  "reactivated__install__click__device_matching": {"period": "P7D", "lastChanged": "..."},
  "reactivated__install__click__fingerprinting": {"period": "P1D", "lastChanged": "..."},
  "reactivated__install__view__device_matching": {"period": "P1D", "lastChanged": "..."},
  "reactivated__install__view__fingerprinting": {"period": "PT6H", "lastChanged": "..."},
  "reactivated__goal__install": {"period": "P7D", "lastChanged": "..."}
}6. 동작 흐름 요약1. [백오피스] Inactivity Window 설정 (예: 7일)
     ↓
2. [Event Worker] 이벤트 수신 (9160/9161/9162/9164)
     ↓
3. [Event Worker] 디바이스의 마지막 활동 시간 조회
     ↓
4. [Event Worker] Reactivation 판단
   - (마지막 활동 + Inactivity Window) < 현재 이벤트 시간?
     ↓
5. [Event Worker] is_reactivated = True인 경우:
   - Target Event로 마킹 (9160 Open도 Target Event가 됨)
   - Reactivated용 Lookback Window 적용
   - 후속 이벤트에 Reactivated용 Attribution Window 적용7. FAQ (백오피스 문서 기반)[오후 1:26]row: 3질문답변Inactivity Window란?유저가 앱을 사용하지 않은 기간. 이 기간 이후 앱 사용 시 Reactivation으로 인식Lookback/Attribution Window 미설정 시?기본값 적용 (Lookback: Click DM 7일, Click PM 1일, View DM 1일, View PM 6시간 / Attribution: 7일)Inactivity Window 미설정 시?Reactivation Tracking이 동작하지 않음
[오후 1:26] 참조 문서Reactivation Tracking 유저 가이드백오피스 노션 가이드 GitHub 소스 코드[오후 1:26]row: 7파일역할backoffice-dashboard/src/pages/attribution/reactivated_attribution/page.py
백오피스 UI 페이지backoffice-dashboard/src/infra/attribution_setting_repo.py
Inactivity Window 저장소backoffice-dashboard/src/infra/lookback_window_repo.py
Lookback/Attribution Window 저장소event-worker/app/services/event_service/resolutions/reactivation_resolution.py
Reactivation 판단 로직event-worker/app/utilities/event_category_util.py
Target Event 판단 로직event-worker/app/services/lookback_window_service.py
Lookback Window Key 매핑 및 적용 로직event-worker/app/domain/attribution/setting_models/reactivated_attribution_setting.py