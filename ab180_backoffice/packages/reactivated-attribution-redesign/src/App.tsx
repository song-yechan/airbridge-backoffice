import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { HomeNav } from '@/components/layout/HomeNav';
import { PageHeader } from '@/components/layout/PageHeader';
import { AppInfoBar } from '@/components/layout/AppInfoBar';
import { SettingsTab } from '@/components/settings/SettingsTab';
import { useSettings } from '@/hooks/useSettings';
import { mockAppInfo } from '@/data/mockData';

function App() {
  const {
    settings,
    updateInactivityWindow,
    disableInactivityWindow,
    updateLookbackWindow,
    addLookbackWindowChannel,
    removeLookbackWindowChannel,
    updateAttributionWindow,
    addAttributionWindowChannel,
    removeAttributionWindowChannel,
  } = useSettings();

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <div className="max-w-[920px] mx-auto px-6 py-8 pb-20">
          <HomeNav />
          <PageHeader />
          <AppInfoBar appInfo={mockAppInfo} />
          <SettingsTab
            settings={settings}
            onUpdateInactivityWindow={updateInactivityWindow}
            onDisableInactivityWindow={disableInactivityWindow}
            onUpdateLookbackWindow={updateLookbackWindow}
            onAddLookbackWindowChannel={addLookbackWindowChannel}
            onRemoveLookbackWindowChannel={removeLookbackWindowChannel}
            onUpdateAttributionWindow={updateAttributionWindow}
            onAddAttributionWindowChannel={addAttributionWindowChannel}
            onRemoveAttributionWindowChannel={removeAttributionWindowChannel}
          />
        </div>
        <Toaster position="bottom-right" />
      </div>
    </TooltipProvider>
  );
}

export default App;
