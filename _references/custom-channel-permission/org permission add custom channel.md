Organization.Permission.Add Custom Channel Campaign Permission 백오피스 동작 분석 요약Add Custom Channel Campaign Permission 백오피스 기능은 특정 사용자에게 커스텀 채널의 캠페인 데이터에 대한 세분화된 접근 권한을 부여하는 기능입니다. 이 권한은 tbl_iam_permission_dashboard_settings 테이블의 permission JSON 필드에 저장됩니다.
 아키텍처 구조확신도: 확실함 (소스코드 기반 검증 완료)
[오전 11:07]row: 6구성요소레포지토리파일 경로백오피스 UI
airbridge-platform-streamlitpages/Add_Custom_Channel_Campaign_Permission.py
Permission DTO
airbridge-apiapi-utils/airbridge_api/module/user_groups/dto/permission.py
DB 모델 (Python)
airbridge-apiapi-utils/airbridge_api/models/db_models/iam/template_group.py
DB 모델 (Kotlin)
airbridge-platform-apiauth-api/src/main/kotlin/io/airbridge/auth/entity/TblIamPermissionDashboardSettings.kt
Repository
airbridge-apiapi-utils/airbridge_api/module/user_groups/repositories/permission.py
DDL
airbridge-test-envmysql/dump/udl/ddl/tbl_iam_permission_dashboard_settings.sql
[오전 11:07] 데이터베이스 스키마tbl_iam_permission_dashboard_settings 테이블
sqlCREATE TABLE `tbl_iam_permission_dashboard_settings` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_group_id` bigint NOT NULL,           -- tbl_iam_user_groups.id 참조
  `permission` json DEFAULT NULL,             -- 권한 JSON (IntegrationPermission 포함)
  `modified_user` varchar(128),               -- 수정자 이메일
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `need_default_resource_filter` tinyint DEFAULT '1',
  PRIMARY KEY (`id`)
); Permission JSON 구조permission 컬럼에 저장되는 JSON 구조 (IntegrationPermission 기반):
json{
  "integration": {
    "integratedChannels": ["google", "facebook"],
    "integratedChannelDataFilters": [],
    "customChannels": ["custom_channel_1", "custom_channel_2"],
    "customChannelDataFilters": [
      {
        "name": "custom_channel_1",
        "filter": {
          "type": "startswith",
          "values": ["campaign_prefix_"],
          "field": "campaign"
        }
      }
    ],
    "unattributedChannel": false,
    "unattributedFilter": null
  },
  "dataRestriction": {
    "eventCategories": []
  }
} 동작 흐름┌─────────────────────────────────────────────────────────────────────────┐
│              Add Custom Channel Campaign Permission 백오피스              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. 입력 필드                                                            │
│     ├── App ID (앱 식별)                                                 │
│     ├── Channel (커스텀 채널명)                                          │
│     └── Campaign Filter (캠페인 필터 조건)                                │
│         ├── filter_type: startswith / endswith / is / is_not            │
│         └── values: 필터 값 배열                                         │
│                                                                         │
│  2. 권한 조회                                                            │
│     └── user_group_id로 기존 permission 조회                             │
│         (IAMAirbridgePermissionRepository.get_data_permission_setting)  │
│                                                                         │
│  3. 권한 업데이트                                                         │
│     ├── 기존 permission JSON 파싱                                        │
│     ├── customChannels 배열에 채널 추가                                   │
│     ├── customChannelDataFilters에 필터 조건 추가                         │
│     └── DB 업데이트                                                      │
│         (IAMAirbridgePermissionRepository.update_data_permission_setting)│
│                                                                         │
│  4. 결과                                                                 │
│     └── tbl_iam_permission_dashboard_settings.permission JSON 업데이트   │
└─────────────────────────────────────────────────────────────────────────┘ 핵심 코드1. Permission 모델 (IntegrationPermission)
파일: api-utils/airbridge_api/module/user_groups/dto/permission.py
pythonclass IntegrationPermission(BaseModel):
    integrated_channels: list[str] = Field([], alias="integratedChannels")
    integrated_channel_data_filters: list[DataFilter] = Field([], alias="integratedChannelDataFilters")
    custom_channels: list[str] = Field([], alias="customChannels")  # 커스텀 채널 목록
    custom_channel_data_filters: list[DataFilter] = Field([], alias="customChannelDataFilters")  # 캠페인 필터
    unattributed_channel: bool = Field(False, alias="unattributedChannel")
    unattributed_filter: Optional[Union[Filter, AttributionFilter]] = Field(None, alias="unattributedFilter")2. DataFilter 모델
pythonclass DataFilter(BaseModel):
    name: str                                    # 채널명 또는 "*" (전체)
    filter: Union[Filter, AttributionFilter]    # 필터 조건

class AttributionFilter(BaseModel):
    type: AttributionFilterType   # startswith, endswith, is, is_not
    values: list                  # 필터 값 배열
    field: str                    # 필터 대상 필드 (예: "campaign")3. Repository 메서드
파일: api-utils/airbridge_api/module/user_groups/repositories/permission.py
pythonclass IAMAirbridgePermissionRepository(Repository):
    def get_data_permission_setting_by_user_group_id(self, *, user_group_id: int):
        # user_group_id로 기존 권한 설정 조회
        
    def update_data_permission_setting(self, *, request_user_email: str, 
                                        data_permission_id: int, permission: dict):
        # permission JSON 업데이트 실제 사용 예시시나리오: "custom_channel_abc" 채널의 "summer_" 로 시작하는 캠페인에만 접근 권한 부여
저장되는 permission JSON:
json{
  "integration": {
    "customChannels": ["custom_channel_abc"],
    "customChannelDataFilters": [
      {
        "name": "custom_channel_abc",
        "filter": {
          "type": "startswith",
          "values": ["summer_"],
          "field": "campaign"
        }
      }
    ]
  }
} 주의사항권한 적용 범위: 이 권한은 user_group_id에 연결되므로, 해당 User Group에 속한 모든 사용자에게 적용됩니다.필터 타입:startswith: 캠페인명이 특정 문자열로 시작endswith: 캠페인명이 특정 문자열로 끝남is: 정확히 일치is_not: 일치하지 않음와일드카드: name: "*"로 설정하면 해당 앱의 모든 커스텀 채널에 필터가 적용됩니다. 크로스 체크 완료[오전 11:07]row: 4검증 항목출처확인 결과DB 테이블명DDL 파일tbl_iam_permission_dashboard_settings ✓
JSON 구조DTO 파일IntegrationPermission with customChannels, customChannelDataFilters ✓
Repository 메서드Python 파일get_data_permission_setting_by_user_group_id, update_data_permission_setting ✓
Kotlin EntityKotlin 파일TblIamPermissionDashboardSetting ✓