import { useState, useCallback, useMemo } from "react";
import type { Permission, DataFilter } from "@/types";
import {
  deepClonePermission,
  arePermissionsEqual,
  addCustomChannel,
  removeCustomChannel,
  addDataFilter,
  removeDataFilter,
} from "@/lib/permission";

interface UsePermissionFormOptions {
  onSave?: (permission: Permission) => Promise<{ success: boolean; error?: string }>;
}

export function usePermissionForm(options: UsePermissionFormOptions = {}) {
  const [originalPermission, setOriginalPermission] = useState<Permission | null>(null);
  const [editedPermission, setEditedPermission] = useState<Permission | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasChanges = useMemo(() => {
    if (!originalPermission || !editedPermission) return false;
    return !arePermissionsEqual(originalPermission, editedPermission);
  }, [originalPermission, editedPermission]);

  const initializeForm = useCallback((permission: Permission) => {
    setOriginalPermission(deepClonePermission(permission));
    setEditedPermission(deepClonePermission(permission));
    setError(null);
  }, []);

  const resetForm = useCallback(() => {
    if (originalPermission) {
      setEditedPermission(deepClonePermission(originalPermission));
      setError(null);
    }
  }, [originalPermission]);

  const clearForm = useCallback(() => {
    setOriginalPermission(null);
    setEditedPermission(null);
    setError(null);
  }, []);

  const handleAddChannel = useCallback(
    (channelName: string) => {
      if (!editedPermission) return;
      setEditedPermission(addCustomChannel(editedPermission, channelName));
    },
    [editedPermission]
  );

  const handleDeleteChannel = useCallback(
    (channelName: string) => {
      if (!editedPermission) return;
      setEditedPermission(removeCustomChannel(editedPermission, channelName));
    },
    [editedPermission]
  );

  const handleAddFilter = useCallback(
    (channelName: string, filter: DataFilter) => {
      if (!editedPermission) return;
      setEditedPermission(addDataFilter(editedPermission, channelName, filter));
    },
    [editedPermission]
  );

  const handleDeleteFilter = useCallback(
    (channelName: string, filterIndex: number) => {
      if (!editedPermission) return;
      setEditedPermission(
        removeDataFilter(editedPermission, channelName, filterIndex)
      );
    },
    [editedPermission]
  );

  const handleSubmit = useCallback(async () => {
    if (!editedPermission || !options.onSave) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await options.onSave(editedPermission);

      if (result.success) {
        setOriginalPermission(deepClonePermission(editedPermission));
        return { success: true };
      } else {
        setError(result.error || "저장에 실패했습니다");
        return { success: false, error: result.error };
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "저장 중 오류가 발생했습니다";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  }, [editedPermission, options]);

  return {
    // State
    permission: editedPermission,
    originalPermission,
    hasChanges,
    isSubmitting,
    error,

    // Actions
    initializeForm,
    resetForm,
    clearForm,
    handleAddChannel,
    handleDeleteChannel,
    handleAddFilter,
    handleDeleteFilter,
    handleSubmit,
  };
}
