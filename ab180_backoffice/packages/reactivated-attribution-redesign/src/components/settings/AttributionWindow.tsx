import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InfoTooltip } from '@/components/common/InfoTooltip';
import { AttributionTable } from './AttributionTable';
import type { ChannelAttributionWindow, AttributionEventType, AttributionWindowSettings } from '@/types';

interface AttributionWindowProps {
  reactivatedInstall: ChannelAttributionWindow[];
  reactivatedOpen: ChannelAttributionWindow[];
  reactivatedDeeplinkOpen: ChannelAttributionWindow[];
  reactivatedDeeplinkPageview: ChannelAttributionWindow[];
  onUpdate: (
    eventType: AttributionEventType,
    channelIndex: number,
    updates: Partial<AttributionWindowSettings>
  ) => void;
  onAdd: (eventType: AttributionEventType, channel: ChannelAttributionWindow) => void;
  onRemove: (eventType: AttributionEventType, channelIndex: number) => void;
}

export function AttributionWindow({
  reactivatedInstall,
  reactivatedOpen,
  reactivatedDeeplinkOpen,
  reactivatedDeeplinkPageview,
  onUpdate,
  onAdd,
  onRemove,
}: AttributionWindowProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
            3
          </span>
          Attribution Window
          <InfoTooltip content="Reactivation 이후 발생하는 후속 이벤트를 해당 Reactivation에 귀속시키는 기간입니다." />
        </CardTitle>
        <CardDescription>
          Reactivation 이후 후속 이벤트 어트리뷰션 기간을 채널별로 설정합니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="reactivatedInstall" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="reactivatedInstall" className="text-xs">
              Reactivated Install
            </TabsTrigger>
            <TabsTrigger value="reactivatedOpen" className="text-xs">
              Reactivated Open
            </TabsTrigger>
            <TabsTrigger value="reactivatedDeeplinkOpen" className="text-xs">
              Reactivated Deeplink Open
            </TabsTrigger>
            <TabsTrigger value="reactivatedDeeplinkPageview" className="text-xs">
              Reactivated Deeplink Pageview
            </TabsTrigger>
          </TabsList>
          <TabsContent value="reactivatedInstall" className="mt-4">
            <AttributionTable
              data={reactivatedInstall}
              onUpdate={(index, updates) => onUpdate('reactivatedInstall', index, updates)}
              onAdd={(channel) => onAdd('reactivatedInstall', channel)}
              onRemove={(index) => onRemove('reactivatedInstall', index)}
            />
          </TabsContent>
          <TabsContent value="reactivatedOpen" className="mt-4">
            <AttributionTable
              data={reactivatedOpen}
              onUpdate={(index, updates) => onUpdate('reactivatedOpen', index, updates)}
              onAdd={(channel) => onAdd('reactivatedOpen', channel)}
              onRemove={(index) => onRemove('reactivatedOpen', index)}
            />
          </TabsContent>
          <TabsContent value="reactivatedDeeplinkOpen" className="mt-4">
            <AttributionTable
              data={reactivatedDeeplinkOpen}
              onUpdate={(index, updates) => onUpdate('reactivatedDeeplinkOpen', index, updates)}
              onAdd={(channel) => onAdd('reactivatedDeeplinkOpen', channel)}
              onRemove={(index) => onRemove('reactivatedDeeplinkOpen', index)}
            />
          </TabsContent>
          <TabsContent value="reactivatedDeeplinkPageview" className="mt-4">
            <AttributionTable
              data={reactivatedDeeplinkPageview}
              onUpdate={(index, updates) => onUpdate('reactivatedDeeplinkPageview', index, updates)}
              onAdd={(channel) => onAdd('reactivatedDeeplinkPageview', channel)}
              onRemove={(index) => onRemove('reactivatedDeeplinkPageview', index)}
            />
          </TabsContent>
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
