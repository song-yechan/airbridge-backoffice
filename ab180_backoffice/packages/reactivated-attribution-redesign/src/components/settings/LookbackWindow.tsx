import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InfoTooltip } from '@/components/common/InfoTooltip';
import { EditableTable } from './EditableTable';
import type { ChannelLookbackWindow, LookbackEventType, LookbackWindowSettings } from '@/types';

interface LookbackWindowProps {
  reactivatedInstall: ChannelLookbackWindow[];
  reactivatedOpen: ChannelLookbackWindow[];
  onUpdate: (
    eventType: LookbackEventType,
    channelIndex: number,
    updates: Partial<LookbackWindowSettings>
  ) => void;
  onAdd: (eventType: LookbackEventType, channel: ChannelLookbackWindow) => void;
  onRemove: (eventType: LookbackEventType, channelIndex: number) => void;
}

export function LookbackWindow({
  reactivatedInstall,
  reactivatedOpen,
  onUpdate,
  onAdd,
  onRemove,
}: LookbackWindowProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
            2
          </span>
          Lookback Window
          <InfoTooltip content="Reactivation 이벤트 발생 시, 과거 터치포인트(광고 클릭/노출)를 얼마나 오래 전까지 찾아볼지 결정하는 기간입니다." />
        </CardTitle>
        <CardDescription>
          Reactivation Target Event에 대한 터치포인트 매칭 기간을 채널별로 설정합니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="reactivatedInstall" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="reactivatedInstall">Reactivated Install</TabsTrigger>
            <TabsTrigger value="reactivatedOpen">Reactivated Open</TabsTrigger>
          </TabsList>
          <TabsContent value="reactivatedInstall" className="mt-4">
            <EditableTable
              data={reactivatedInstall}
              onUpdate={(index, updates) => onUpdate('reactivatedInstall', index, updates)}
              onAdd={(channel) => onAdd('reactivatedInstall', channel)}
              onRemove={(index) => onRemove('reactivatedInstall', index)}
            />
          </TabsContent>
          <TabsContent value="reactivatedOpen" className="mt-4">
            <EditableTable
              data={reactivatedOpen}
              onUpdate={(index, updates) => onUpdate('reactivatedOpen', index, updates)}
              onAdd={(channel) => onAdd('reactivatedOpen', channel)}
              onRemove={(index) => onRemove('reactivatedOpen', index)}
            />
          </TabsContent>
        </Tabs>

        <div className="mt-4 rounded-md bg-muted p-3 text-sm">
          <p className="font-medium">기본값 안내</p>
          <ul className="mt-1 list-inside list-disc text-muted-foreground">
            <li>Click - Device Matching: 7일</li>
            <li>Click - Probabilistic Modeling: 1일</li>
            <li>View - Device Matching: 1일</li>
            <li>View - Probabilistic Modeling: 6시간</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
