import { Trash2, Filter, Hash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DataFilterItem } from "./DataFilterItem";
import { AddFilterDialog } from "./AddFilterDialog";
import type { CustomChannelDataFilter, DataFilter } from "@/types";

interface ChannelPermissionCardProps {
  channelName: string;
  filters: CustomChannelDataFilter[];
  onDeleteChannel: () => void;
  onAddFilter: (filter: DataFilter) => void;
  onDeleteFilter: (filterIndex: number) => void;
}

export function ChannelPermissionCard({
  channelName,
  filters,
  onDeleteChannel,
  onAddFilter,
  onDeleteFilter,
}: ChannelPermissionCardProps) {
  const channelFilters = filters.filter((f) => f.name === channelName);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Hash className="h-4 w-4 text-muted-foreground" />
            <Badge variant="outline" className="font-mono">
              {channelName}
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <AddFilterDialog channelName={channelName} onAdd={onAddFilter} />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">채널 삭제</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>채널을 삭제하시겠습니까?</AlertDialogTitle>
                  <AlertDialogDescription>
                    <Badge variant="secondary" className="font-mono">
                      {channelName}
                    </Badge>{" "}
                    채널과 연결된 모든 필터가 삭제됩니다. 이 작업은 Apply
                    버튼을 클릭해야 최종 적용됩니다.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onDeleteChannel}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    삭제
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {channelFilters.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            <Filter className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">필터가 없습니다</p>
            <p className="text-xs">
              필터를 추가하면 특정 캠페인만 볼 수 있도록 제한됩니다
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {channelFilters.map((channelFilter, index) => (
              <DataFilterItem
                key={index}
                filter={channelFilter.filter}
                onDelete={() => onDeleteFilter(index)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
