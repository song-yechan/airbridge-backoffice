import { useState, useCallback } from "react";
import type {
  AppInfo,
  AgencyInfo,
  PermissionData,
  ChannelPermissionEntry,
  CampaignFilterType,
} from "@/types";
import {
  MOCK_AGENCIES,
  MOCK_PERMISSIONS,
  EMPTY_PERMISSION,
} from "@/data/custom-channel-permission-mock";
import { toast } from "sonner";

export function useCustomChannelPermission() {
  const [appInfo, setAppInfo] = useState<AppInfo | null>(null);
  const [agencies, setAgencies] = useState<AgencyInfo[]>([]);
  const [selectedAgency, setSelectedAgency] = useState<AgencyInfo | null>(null);
  const [permission, setPermission] = useState<PermissionData | null>(null);
  const [channels, setChannels] = useState<ChannelPermissionEntry[]>([]);
  const [isDirty, setIsDirty] = useState(false);

  const loadPermission = useCallback((agencyInfo: AgencyInfo) => {
    const perm = MOCK_PERMISSIONS[agencyInfo.userGroupId] ?? { ...EMPTY_PERMISSION };
    setPermission(perm);

    // permission JSON → 편집용 ChannelPermissionEntry 변환
    const entries: ChannelPermissionEntry[] = perm.integration.customChannels.map((ch) => {
      const dataFilter = perm.integration.customChannelDataFilters.find((f) => f.name === ch);
      return {
        channel: ch,
        filters: dataFilter
          ? dataFilter.filter.values.map((v) => ({ type: dataFilter.filter.type, value: v }))
          : [],
      };
    });
    setChannels(entries);
    setIsDirty(false);
  }, []);

  const handleAppSelect = useCallback((app: AppInfo) => {
    setAppInfo(app);
    setSelectedAgency(null);
    setPermission(null);
    setChannels([]);
    setIsDirty(false);
    const agencyList = MOCK_AGENCIES[app.id] ?? [];
    setAgencies(agencyList);
  }, []);

  const handleAppClear = useCallback(() => {
    setAppInfo(null);
    setAgencies([]);
    setSelectedAgency(null);
    setPermission(null);
    setChannels([]);
    setIsDirty(false);
  }, []);

  const handleRefresh = useCallback(() => {
    if (selectedAgency) {
      loadPermission(selectedAgency);
      toast.success("권한 정보를 새로고침했습니다.");
    }
  }, [selectedAgency, loadPermission]);

  const handleAgencySelect = useCallback((agency: AgencyInfo) => {
    setSelectedAgency(agency);
    loadPermission(agency);
  }, [loadPermission]);

  const handleAgencyClear = useCallback(() => {
    setSelectedAgency(null);
    setPermission(null);
    setChannels([]);
    setIsDirty(false);
  }, []);

  // === Channel CRUD ===

  const addChannel = useCallback(() => {
    setChannels((prev) => [...prev, { channel: "", filters: [] }]);
    setIsDirty(true);
  }, []);

  const removeChannel = useCallback((index: number) => {
    setChannels((prev) => prev.filter((_, i) => i !== index));
    setIsDirty(true);
  }, []);

  const updateChannelName = useCallback((index: number, name: string) => {
    setChannels((prev) => prev.map((ch, i) => (i === index ? { ...ch, channel: name } : ch)));
    setIsDirty(true);
  }, []);

  // === Filter CRUD ===

  const addFilter = useCallback((channelIndex: number) => {
    setChannels((prev) =>
      prev.map((ch, i) =>
        i === channelIndex
          ? { ...ch, filters: [...ch.filters, { type: "startswith" as CampaignFilterType, value: "" }] }
          : ch
      )
    );
    setIsDirty(true);
  }, []);

  const removeFilter = useCallback((channelIndex: number, filterIndex: number) => {
    setChannels((prev) =>
      prev.map((ch, i) =>
        i === channelIndex
          ? { ...ch, filters: ch.filters.filter((_, fi) => fi !== filterIndex) }
          : ch
      )
    );
    setIsDirty(true);
  }, []);

  const updateFilterType = useCallback((channelIndex: number, filterIndex: number, type: CampaignFilterType) => {
    setChannels((prev) =>
      prev.map((ch, i) =>
        i === channelIndex
          ? {
              ...ch,
              filters: ch.filters.map((f, fi) => (fi === filterIndex ? { ...f, type } : f)),
            }
          : ch
      )
    );
    setIsDirty(true);
  }, []);

  const updateFilterValue = useCallback((channelIndex: number, filterIndex: number, value: string) => {
    setChannels((prev) =>
      prev.map((ch, i) =>
        i === channelIndex
          ? {
              ...ch,
              filters: ch.filters.map((f, fi) => (fi === filterIndex ? { ...f, value } : f)),
            }
          : ch
      )
    );
    setIsDirty(true);
  }, []);

  // === Apply ===

  const handleApply = useCallback(() => {
    // 빈 채널명 검증
    const emptyChannel = channels.find((ch) => !ch.channel.trim());
    if (emptyChannel) {
      toast.error("채널명을 입력해주세요.");
      return;
    }

    // 중복 채널명 검증
    const names = channels.map((ch) => ch.channel.trim().toLowerCase());
    const hasDuplicate = names.some((n, i) => names.indexOf(n) !== i);
    if (hasDuplicate) {
      toast.error("중복된 채널명이 있습니다.");
      return;
    }

    // 빈 필터 값 검증
    const emptyFilter = channels.some((ch) => ch.filters.some((f) => !f.value.trim()));
    if (emptyFilter) {
      toast.error("필터 값을 입력해주세요.");
      return;
    }

    toast.success("권한이 성공적으로 적용되었습니다.");
    setIsDirty(false);
  }, [channels]);

  return {
    appInfo,
    agencies,
    selectedAgency,
    permission,
    channels,
    isDirty,
    handleAppSelect,
    handleAppClear,
    handleRefresh,
    handleAgencySelect,
    handleAgencyClear,
    addChannel,
    removeChannel,
    updateChannelName,
    addFilter,
    removeFilter,
    updateFilterType,
    updateFilterValue,
    handleApply,
  };
}
