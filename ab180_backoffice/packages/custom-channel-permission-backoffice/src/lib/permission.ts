import type { Permission, CustomChannelDataFilter, DataFilter } from "@/types";

export function deepClonePermission(permission: Permission): Permission {
  return JSON.parse(JSON.stringify(permission));
}

export function arePermissionsEqual(a: Permission, b: Permission): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function addCustomChannel(
  permission: Permission,
  channelName: string
): Permission {
  const newPermission = deepClonePermission(permission);

  if (!newPermission.integration.customChannels.includes(channelName)) {
    newPermission.integration.customChannels.push(channelName);
  }

  return newPermission;
}

export function removeCustomChannel(
  permission: Permission,
  channelName: string
): Permission {
  const newPermission = deepClonePermission(permission);

  newPermission.integration.customChannels =
    newPermission.integration.customChannels.filter((c) => c !== channelName);

  newPermission.integration.customChannelDataFilters =
    newPermission.integration.customChannelDataFilters.filter(
      (f) => f.name !== channelName
    );

  return newPermission;
}

export function addDataFilter(
  permission: Permission,
  channelName: string,
  filter: DataFilter
): Permission {
  const newPermission = deepClonePermission(permission);

  const channelFilter: CustomChannelDataFilter = {
    name: channelName,
    filter: filter,
  };

  newPermission.integration.customChannelDataFilters.push(channelFilter);

  return newPermission;
}

export function removeDataFilter(
  permission: Permission,
  channelName: string,
  filterIndex: number
): Permission {
  const newPermission = deepClonePermission(permission);

  // Find all filters for this channel
  const channelFilters = newPermission.integration.customChannelDataFilters.filter(
    (f) => f.name === channelName
  );

  if (filterIndex >= 0 && filterIndex < channelFilters.length) {
    // Find the actual index in the full array
    let count = 0;
    const actualIndex = newPermission.integration.customChannelDataFilters.findIndex(
      (f) => {
        if (f.name === channelName) {
          if (count === filterIndex) {
            return true;
          }
          count++;
        }
        return false;
      }
    );

    if (actualIndex !== -1) {
      newPermission.integration.customChannelDataFilters.splice(actualIndex, 1);
    }
  }

  return newPermission;
}

export function createEmptyPermission(): Permission {
  return {
    integration: {
      integratedChannels: [],
      integratedChannelDataFilters: [],
      customChannels: [],
      customChannelDataFilters: [],
      unattributedChannel: false,
      unattributedFilter: null,
    },
  };
}
