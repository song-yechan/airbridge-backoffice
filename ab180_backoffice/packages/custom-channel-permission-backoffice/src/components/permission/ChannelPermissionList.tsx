import { Layers, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { ChannelPermissionCard } from "./ChannelPermissionCard";
import { AddChannelDialog } from "./AddChannelDialog";
import type { CustomChannelDataFilter, DataFilter } from "@/types";

interface ChannelPermissionListProps {
  customChannels: string[];
  customChannelDataFilters: CustomChannelDataFilter[];
  onAddChannel: (channelName: string) => void;
  onDeleteChannel: (channelName: string) => void;
  onAddFilter: (channelName: string, filter: DataFilter) => void;
  onDeleteFilter: (channelName: string, filterIndex: number) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function ChannelPermissionList({
  customChannels,
  customChannelDataFilters,
  onAddChannel,
  onDeleteChannel,
  onAddFilter,
  onDeleteFilter,
  isLoading = false,
  disabled = false,
}: ChannelPermissionListProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Custom Channel 권한
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Custom Channel 권한
          </CardTitle>
          <AddChannelDialog
            existingChannels={customChannels}
            onAdd={onAddChannel}
          />
        </div>
      </CardHeader>
      <CardContent>
        {disabled && (
          <Alert className="mb-4">
            <Info className="h-4 w-4" />
            <AlertDescription>
              앱과 대행사를 선택하면 권한을 수정할 수 있습니다.
            </AlertDescription>
          </Alert>
        )}

        {customChannels.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Layers className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium">커스텀 채널이 없습니다</p>
            <p className="text-sm mt-1">
              "채널 추가" 버튼을 클릭하여 새로운 채널을 만들어보세요
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {customChannels.map((channelName) => (
              <ChannelPermissionCard
                key={channelName}
                channelName={channelName}
                filters={customChannelDataFilters}
                onDeleteChannel={() => onDeleteChannel(channelName)}
                onAddFilter={(filter) => onAddFilter(channelName, filter)}
                onDeleteFilter={(filterIndex) =>
                  onDeleteFilter(channelName, filterIndex)
                }
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
