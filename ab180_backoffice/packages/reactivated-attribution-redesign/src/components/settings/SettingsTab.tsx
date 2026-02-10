import type { ReactivatedAttributionSettings, WindowPeriod, LookbackEventType, AttributionEventType, ChannelLookbackWindow, ChannelAttributionWindow, LookbackWindowSettings, AttributionWindowSettings } from '@/types';
import { InactivityWindow } from './InactivityWindow';
import { LookbackWindow } from './LookbackWindow';
import { AttributionWindow } from './AttributionWindow';

interface SettingsTabProps {
  settings: ReactivatedAttributionSettings;
  onUpdateInactivityWindow: (period: WindowPeriod) => void;
  onDisableInactivityWindow: () => void;
  onUpdateLookbackWindow: (
    eventType: LookbackEventType,
    channelIndex: number,
    updates: Partial<LookbackWindowSettings>
  ) => void;
  onAddLookbackWindowChannel: (eventType: LookbackEventType, channel: ChannelLookbackWindow) => void;
  onRemoveLookbackWindowChannel: (eventType: LookbackEventType, channelIndex: number) => void;
  onUpdateAttributionWindow: (
    eventType: AttributionEventType,
    channelIndex: number,
    updates: Partial<AttributionWindowSettings>
  ) => void;
  onAddAttributionWindowChannel: (eventType: AttributionEventType, channel: ChannelAttributionWindow) => void;
  onRemoveAttributionWindowChannel: (eventType: AttributionEventType, channelIndex: number) => void;
}

export function SettingsTab({
  settings,
  onUpdateInactivityWindow,
  onDisableInactivityWindow,
  onUpdateLookbackWindow,
  onAddLookbackWindowChannel,
  onRemoveLookbackWindowChannel,
  onUpdateAttributionWindow,
  onAddAttributionWindowChannel,
  onRemoveAttributionWindowChannel,
}: SettingsTabProps) {
  return (
    <div className="space-y-6">
      <InactivityWindow
        value={settings.inactivityWindow}
        onSave={onUpdateInactivityWindow}
        onDisable={onDisableInactivityWindow}
      />

      <LookbackWindow
        reactivatedInstall={settings.lookbackWindows.reactivatedInstall}
        reactivatedOpen={settings.lookbackWindows.reactivatedOpen}
        onUpdate={onUpdateLookbackWindow}
        onAdd={onAddLookbackWindowChannel}
        onRemove={onRemoveLookbackWindowChannel}
      />

      <AttributionWindow
        reactivatedInstall={settings.attributionWindows.reactivatedInstall}
        reactivatedOpen={settings.attributionWindows.reactivatedOpen}
        reactivatedDeeplinkOpen={settings.attributionWindows.reactivatedDeeplinkOpen}
        reactivatedDeeplinkPageview={settings.attributionWindows.reactivatedDeeplinkPageview}
        onUpdate={onUpdateAttributionWindow}
        onAdd={onAddAttributionWindowChannel}
        onRemove={onRemoveAttributionWindowChannel}
      />
    </div>
  );
}
