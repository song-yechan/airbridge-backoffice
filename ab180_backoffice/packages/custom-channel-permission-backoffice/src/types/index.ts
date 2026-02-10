// Filter Types
export type FilterType = "startswith" | "endswith" | "is" | "is_not";

export interface DataFilter {
  type: FilterType;
  values: string[];
  field: "campaign";
}

export interface CustomChannelDataFilter {
  name: string;
  filter: DataFilter;
}

export interface IntegrationPermission {
  integratedChannels: string[];
  integratedChannelDataFilters: DataFilter[];
  customChannels: string[];
  customChannelDataFilters: CustomChannelDataFilter[];
  unattributedChannel: boolean;
  unattributedFilter: DataFilter | null;
}

export interface Permission {
  integration: IntegrationPermission;
  dataRestriction?: {
    eventCategories: string[];
  };
}

// App & Agency
export interface AppInfo {
  id: string;
  name: string;
  timezone: string;
  iconUrl?: string;
}

export interface Agency {
  id: string;
  name: string;
  userGroupId: number;
}

// Form State
export interface PermissionFormState {
  customChannels: string[];
  customChannelDataFilters: CustomChannelDataFilter[];
}

// Search Types
export type SearchType = "id" | "name";

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
