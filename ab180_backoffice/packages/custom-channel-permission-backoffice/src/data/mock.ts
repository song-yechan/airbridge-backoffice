import type {
  AppInfo,
  Agency,
  Permission,
} from "@/types";

export const mockApps: AppInfo[] = [
  {
    id: "app_12345",
    name: "E-Commerce App",
    timezone: "Asia/Seoul",
    iconUrl: "https://via.placeholder.com/40",
  },
  {
    id: "app_67890",
    name: "Travel Booking App",
    timezone: "Asia/Seoul",
    iconUrl: "https://via.placeholder.com/40",
  },
  {
    id: "app_11111",
    name: "Finance App",
    timezone: "America/New_York",
    iconUrl: "https://via.placeholder.com/40",
  },
];

export const mockAgencies: Record<string, Agency[]> = {
  app_12345: [
    { id: "agency_1", name: "Digital Marketing Agency", userGroupId: 101 },
    { id: "agency_2", name: "Performance Partners", userGroupId: 102 },
    { id: "agency_3", name: "Growth Hackers Inc", userGroupId: 103 },
  ],
  app_67890: [
    { id: "agency_4", name: "Travel Media Group", userGroupId: 104 },
    { id: "agency_5", name: "Tourism Marketing Co", userGroupId: 105 },
  ],
  app_11111: [
    { id: "agency_6", name: "Finance Ads Agency", userGroupId: 106 },
  ],
};

export const mockPermissions: Record<string, Permission> = {
  agency_1: {
    integration: {
      integratedChannels: ["Google Ads", "Facebook Ads", "Kakao"],
      integratedChannelDataFilters: [],
      customChannels: ["Naver_Brand", "Kakao_Performance"],
      customChannelDataFilters: [
        {
          name: "Naver_Brand",
          filter: {
            type: "startswith",
            values: ["naver_brand_", "naver_br_"],
            field: "campaign",
          },
        },
        {
          name: "Kakao_Performance",
          filter: {
            type: "is",
            values: ["kakao_main_campaign_2024", "kakao_retargeting_q1"],
            field: "campaign",
          },
        },
      ],
      unattributedChannel: false,
      unattributedFilter: null,
    },
    dataRestriction: {
      eventCategories: ["purchase", "signup", "view_item"],
    },
  },
  agency_2: {
    integration: {
      integratedChannels: ["Google Ads"],
      integratedChannelDataFilters: [
        {
          type: "startswith",
          values: ["perf_"],
          field: "campaign",
        },
      ],
      customChannels: [],
      customChannelDataFilters: [],
      unattributedChannel: true,
      unattributedFilter: null,
    },
  },
  agency_3: {
    integration: {
      integratedChannels: [],
      integratedChannelDataFilters: [],
      customChannels: ["TikTok_Growth"],
      customChannelDataFilters: [
        {
          name: "TikTok_Growth",
          filter: {
            type: "endswith",
            values: ["_growth", "_viral"],
            field: "campaign",
          },
        },
      ],
      unattributedChannel: false,
      unattributedFilter: null,
    },
  },
  agency_4: {
    integration: {
      integratedChannels: ["Google Ads", "Facebook Ads"],
      integratedChannelDataFilters: [],
      customChannels: ["Naver_Travel"],
      customChannelDataFilters: [
        {
          name: "Naver_Travel",
          filter: {
            type: "is_not",
            values: ["test_campaign", "internal_test"],
            field: "campaign",
          },
        },
      ],
      unattributedChannel: true,
      unattributedFilter: {
        type: "startswith",
        values: ["organic_"],
        field: "campaign",
      },
    },
  },
  agency_5: {
    integration: {
      integratedChannels: ["Facebook Ads"],
      integratedChannelDataFilters: [],
      customChannels: [],
      customChannelDataFilters: [],
      unattributedChannel: false,
      unattributedFilter: null,
    },
  },
  agency_6: {
    integration: {
      integratedChannels: ["Google Ads", "Kakao"],
      integratedChannelDataFilters: [],
      customChannels: ["Finance_Custom"],
      customChannelDataFilters: [
        {
          name: "Finance_Custom",
          filter: {
            type: "startswith",
            values: ["fin_", "finance_"],
            field: "campaign",
          },
        },
      ],
      unattributedChannel: false,
      unattributedFilter: null,
    },
  },
};

// Mock API Functions
export const searchAppById = async (id: string): Promise<AppInfo | null> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockApps.find((app) => app.id === id) || null;
};

export const searchAppByName = async (name: string): Promise<AppInfo[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockApps.filter((app) =>
    app.name.toLowerCase().includes(name.toLowerCase())
  );
};

export const getAgenciesByAppId = async (appId: string): Promise<Agency[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockAgencies[appId] || [];
};

export const getPermissionByAgencyId = async (
  agencyId: string
): Promise<Permission | null> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockPermissions[agencyId] || null;
};

export const updatePermission = async (
  _agencyId: string,
  _permission: Permission
): Promise<{ success: boolean; error?: string }> => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  // Simulate 90% success rate
  if (Math.random() > 0.1) {
    return { success: true };
  }
  return { success: false, error: "Failed to update permission. Please try again." };
};
