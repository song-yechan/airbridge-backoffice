import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { DedupSetting } from "@/types";
import { formatDuration } from "@/lib/dedup";

interface CurrentSettingsTableProps {
  settings: DedupSetting[];
  onDelete?: (id: string) => void;
}

export function CurrentSettingsTable({
  settings,
  onDelete,
}: CurrentSettingsTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<DedupSetting | null>(null);

  const handleDeleteClick = (setting: DedupSetting) => {
    setDeleteTarget(setting);
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget && onDelete) {
      onDelete(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteTarget(null);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="h-5 w-5" />
            현재 설정
          </CardTitle>
        </CardHeader>
        <CardContent>
          {settings.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              등록된 중복 제거 설정이 없습니다.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">Event Category</TableHead>
                    <TableHead className="whitespace-nowrap">Goal Category</TableHead>
                    <TableHead className="whitespace-nowrap min-w-[400px]">Dedup Key</TableHead>
                    <TableHead className="whitespace-nowrap">Dedup Window (sec)</TableHead>
                    <TableHead className="whitespace-nowrap">Status</TableHead>
                    <TableHead className="whitespace-nowrap">Created At</TableHead>
                    <TableHead className="whitespace-nowrap">Updated At</TableHead>
                    {onDelete && <TableHead className="w-[60px]"></TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {settings.map((setting) => (
                    <TableRow key={setting.id}>
                      <TableCell>
                        {setting.eventCategory ? (
                          <Badge variant="secondary">{setting.eventCategory}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-1.5 py-0.5 rounded whitespace-nowrap">
                          {setting.goalCategory}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div className="overflow-x-auto max-w-[400px]">
                          <code className="text-xs bg-muted px-1.5 py-0.5 rounded whitespace-nowrap block">
                            {setting.dedupKey}
                          </code>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="whitespace-nowrap">
                          {setting.dedupWindow} ({formatDuration(setting.dedupWindow)})
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={setting.status === "ON" ? "default" : "secondary"}>
                          {setting.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(setting.createdAt).toLocaleString("ko-KR")}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(setting.updatedAt).toLocaleString("ko-KR")}
                      </TableCell>
                      {onDelete && (
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(setting)}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 삭제 확인 모달 */}
      <Dialog open={deleteTarget !== null} onOpenChange={(open) => !open && handleDeleteCancel()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>설정 삭제</DialogTitle>
            <DialogDescription>
              이 중복 제거 설정을 삭제하시겠습니까? 삭제 후에는 해당 이벤트에 대한 중복 제거가 더 이상 적용되지 않습니다.
            </DialogDescription>
          </DialogHeader>
          {deleteTarget && (
            <div className="space-y-2 p-4 bg-muted rounded-lg text-sm">
              <div>
                <span className="text-muted-foreground">Goal Category:</span>{" "}
                <code className="text-xs">{deleteTarget.goalCategory}</code>
              </div>
              <div>
                <span className="text-muted-foreground">Dedup Key:</span>
                <code className="block text-xs break-all mt-1">{deleteTarget.dedupKey}</code>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={handleDeleteCancel}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
