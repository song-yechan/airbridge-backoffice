import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LookbackTable } from "./lookback-table";
import type { ChannelLookbackWindow, LookbackEventType, LookbackWindowSettings } from "@/types";

interface LookbackWindowProps {
  reactivatedInstall: ChannelLookbackWindow[];
  reactivatedOpen: ChannelLookbackWindow[];
  onUpdate: (eventType: LookbackEventType, channelIndex: number, updates: Partial<LookbackWindowSettings>) => void;
  onAdd: (eventType: LookbackEventType, channel: ChannelLookbackWindow) => void;
  onRemove: (eventType: LookbackEventType, channelIndex: number) => void;
}

export function LookbackWindow({ reactivatedInstall, reactivatedOpen, onUpdate, onAdd, onRemove }: LookbackWindowProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Lookback Window</CardTitle>
        <p className="text-sm text-muted-foreground">
          Reactivation 이벤트 발생 시, 과거 터치포인트(광고 클릭/노출)를 얼마나 오래 전까지 찾아볼지 결정하는 기간입니다.
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="reactivatedInstall" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="reactivatedInstall">Reactivated Install</TabsTrigger>
            <TabsTrigger value="reactivatedOpen">Reactivated Open</TabsTrigger>
          </TabsList>
          <TabsContent value="reactivatedInstall" className="mt-4">
            <LookbackTable
              data={reactivatedInstall}
              onUpdate={(i, u) => onUpdate("reactivatedInstall", i, u)}
              onAdd={(c) => onAdd("reactivatedInstall", c)}
              onRemove={(i) => onRemove("reactivatedInstall", i)}
            />
          </TabsContent>
          <TabsContent value="reactivatedOpen" className="mt-4">
            <LookbackTable
              data={reactivatedOpen}
              onUpdate={(i, u) => onUpdate("reactivatedOpen", i, u)}
              onAdd={(c) => onAdd("reactivatedOpen", c)}
              onRemove={(i) => onRemove("reactivatedOpen", i)}
            />
          </TabsContent>
        </Tabs>

      </CardContent>
    </Card>
  );
}
