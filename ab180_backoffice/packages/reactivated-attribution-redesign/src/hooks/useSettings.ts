import { useState, useCallback } from 'react';
import type {
  ReactivatedAttributionSettings,
  WindowPeriod,
  LookbackEventType,
  AttributionEventType,
  ChannelLookbackWindow,
  ChannelAttributionWindow,
} from '@/types';
import { mockSettings } from '@/data/mockData';

export function useSettings() {
  const [settings, setSettings] = useState<ReactivatedAttributionSettings>(mockSettings);

  const updateInactivityWindow = useCallback((period: WindowPeriod) => {
    setSettings((prev) => ({
      ...prev,
      inactivityWindow: period,
    }));
  }, []);

  const disableInactivityWindow = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      inactivityWindow: null,
    }));
  }, []);

  const updateLookbackWindow = useCallback(
    (
      eventType: LookbackEventType,
      channelIndex: number,
      updates: Partial<ChannelLookbackWindow['settings']>
    ) => {
      setSettings((prev) => ({
        ...prev,
        lookbackWindows: {
          ...prev.lookbackWindows,
          [eventType]: prev.lookbackWindows[eventType].map((item, idx) =>
            idx === channelIndex
              ? { ...item, settings: { ...item.settings, ...updates } }
              : item
          ),
        },
      }));
    },
    []
  );

  const addLookbackWindowChannel = useCallback(
    (eventType: LookbackEventType, channel: ChannelLookbackWindow) => {
      setSettings((prev) => ({
        ...prev,
        lookbackWindows: {
          ...prev.lookbackWindows,
          [eventType]: [...prev.lookbackWindows[eventType], channel],
        },
      }));
    },
    []
  );

  const removeLookbackWindowChannel = useCallback(
    (eventType: LookbackEventType, channelIndex: number) => {
      setSettings((prev) => ({
        ...prev,
        lookbackWindows: {
          ...prev.lookbackWindows,
          [eventType]: prev.lookbackWindows[eventType].filter(
            (_, idx) => idx !== channelIndex
          ),
        },
      }));
    },
    []
  );

  const updateAttributionWindow = useCallback(
    (
      eventType: AttributionEventType,
      channelIndex: number,
      updates: Partial<ChannelAttributionWindow['settings']>
    ) => {
      setSettings((prev) => ({
        ...prev,
        attributionWindows: {
          ...prev.attributionWindows,
          [eventType]: prev.attributionWindows[eventType].map((item, idx) =>
            idx === channelIndex
              ? { ...item, settings: { ...item.settings, ...updates } }
              : item
          ),
        },
      }));
    },
    []
  );

  const addAttributionWindowChannel = useCallback(
    (eventType: AttributionEventType, channel: ChannelAttributionWindow) => {
      setSettings((prev) => ({
        ...prev,
        attributionWindows: {
          ...prev.attributionWindows,
          [eventType]: [...prev.attributionWindows[eventType], channel],
        },
      }));
    },
    []
  );

  const removeAttributionWindowChannel = useCallback(
    (eventType: AttributionEventType, channelIndex: number) => {
      setSettings((prev) => ({
        ...prev,
        attributionWindows: {
          ...prev.attributionWindows,
          [eventType]: prev.attributionWindows[eventType].filter(
            (_, idx) => idx !== channelIndex
          ),
        },
      }));
    },
    []
  );

  return {
    settings,
    updateInactivityWindow,
    disableInactivityWindow,
    updateLookbackWindow,
    addLookbackWindowChannel,
    removeLookbackWindowChannel,
    updateAttributionWindow,
    addAttributionWindowChannel,
    removeAttributionWindowChannel,
  };
}
