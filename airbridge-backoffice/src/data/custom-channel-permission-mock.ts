import type { AgencyInfo, PermissionData } from "@/types";

export const MOCK_AGENCIES: Record<string, AgencyInfo[]> = {
  "619": [
    { id: 1, name: "이노애드", userGroupId: 101 },
    { id: 2, name: "153커뮤니케이션", userGroupId: 102 },
    { id: 3, name: "골드넥스", userGroupId: 103 },
    { id: 4, name: "광룡", userGroupId: 104 },
    { id: 5, name: "그레이월드와이드코리아", userGroupId: 105 },
  ],
  "12345": [
    { id: 10, name: "미디어렙코리아", userGroupId: 201 },
    { id: 11, name: "디지털마케팅랩", userGroupId: 202 },
  ],
};

export const MOCK_PERMISSIONS: Record<number, PermissionData> = {
  101: {
    integration: {
      integratedChannels: ["google", "facebook"],
      integratedChannelDataFilters: [],
      customChannels: ["custom_channel_abc", "custom_channel_xyz"],
      customChannelDataFilters: [
        {
          name: "custom_channel_abc",
          filter: { type: "startswith", values: ["summer_"], field: "campaign" },
        },
      ],
      unattributedChannel: false,
      unattributedFilter: null,
    },
    dataRestriction: { eventCategories: [] },
  },
  102: {
    integration: {
      integratedChannels: [],
      integratedChannelDataFilters: [],
      customChannels: [],
      customChannelDataFilters: [],
      unattributedChannel: false,
      unattributedFilter: null,
    },
    dataRestriction: { eventCategories: [] },
  },
};

export const EMPTY_PERMISSION: PermissionData = {
  integration: {
    integratedChannels: [],
    integratedChannelDataFilters: [],
    customChannels: [],
    customChannelDataFilters: [],
    unattributedChannel: false,
    unattributedFilter: null,
  },
  dataRestriction: { eventCategories: [] },
};

export const FILTER_TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: "startswith", label: "Starts with" },
  { value: "endswith", label: "Ends with" },
  { value: "is", label: "Is (정확히 일치)" },
  { value: "is_not", label: "Is not (불일치)" },
];
