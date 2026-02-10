import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AttributionTable } from "./attribution-table";
import type { ChannelAttributionWindow, AttributionEventType, AttributionWindowSettings } from "@/types";

interface AttributionWindowProps {
  reactivatedInstall: ChannelAttributionWindow[];
  reactivatedOpen: ChannelAttributionWindow[];
  reactivatedDeeplinkOpen: ChannelAttributionWindow[];
  reactivatedDeeplinkPageview: ChannelAttributionWindow[];
  onUpdate: (eventType: AttributionEventType, channelIndex: number, updates: Partial<AttributionWindowSettings>) => void;
  onAdd: (eventType: AttributionEventType, channel: ChannelAttributionWindow) => void;
  onRemove: (eventType: AttributionEventType, channelIndex: number) => void;
}

const TABS: { value: AttributionEventType; label: string }[] = [
  { value: "reactivatedInstall", label: "Reactivated Install" },
  { value: "reactivatedOpen", label: "Reactivated Open" },
  { value: "reactivatedDeeplinkOpen", label: "Deeplink Open" },
  { value: "reactivatedDeeplinkPageview", label: "Deeplink Pageview" },
];

export function AttributionWindow({
  reactivatedInstall,
  reactivatedOpen,
  reactivatedDeeplinkOpen,
  reactivatedDeeplinkPageview,
  onUpdate,
  onAdd,
  onRemove,
}: AttributionWindowProps) {
  const dataMap: Record<AttributionEventType, ChannelAttributionWindow[]> = {
    reactivatedInstall,
    reactivatedOpen,
    reactivatedDeeplinkOpen,
    reactivatedDeeplinkPageview,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Attribution Window</CardTitle>
        <p className="text-sm text-muted-foreground">
          Reactivation 이후 발생하는 후속 이벤트를 해당 Reactivation에 귀속시키는 기간입니다.
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="reactivatedInstall" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            {TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="text-xs">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {TABS.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="mt-4">
              <AttributionTable
                data={dataMap[tab.value]}
                onUpdate={(i, u) => onUpdate(tab.value, i, u)}
                onAdd={(c) => onAdd(tab.value, c)}
                onRemove={(i) => onRemove(tab.value, i)}
              />
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-4 rounded-md bg-muted p-3 text-sm">
          <p className="font-medium">기본값 안내</p>
          <p className="text-muted-foreground">
            모든 이벤트 타입의 Attribution Window 기본값은 7일입니다.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
