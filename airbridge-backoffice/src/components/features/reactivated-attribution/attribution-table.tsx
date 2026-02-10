import { useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { UnitSelect } from "@/components/shared/unit-select";
import type { WindowPeriod, TimeUnit, AttributionWindowSettings, ChannelAttributionWindow } from "@/types";
import { formatPeriodShort, DEFAULT_ATTRIBUTION } from "@/data/reactivated-attribution-mock";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

interface AttributionTableProps {
  data: ChannelAttributionWindow[];
  onUpdate: (index: number, updates: Partial<AttributionWindowSettings>) => void;
  onAdd: (channel: ChannelAttributionWindow) => void;
  onRemove: (index: number) => void;
}

export function AttributionTable({ data, onUpdate, onAdd, onRemove }: AttributionTableProps) {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<number>(0);
  const [editUnit, setEditUnit] = useState<TimeUnit>("days");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newChannel, setNewChannel] = useState("");
  const [newWindow, setNewWindow] = useState<WindowPeriod>({ ...DEFAULT_ATTRIBUTION.attributionWindow });

  const handleSelectRow = (index: number, checked: boolean) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      checked ? next.add(index) : next.delete(index);
      return next;
    });
  };

  const handleDeleteSelected = () => {
    Array.from(selectedRows).sort((a, b) => b - a).forEach((i) => onRemove(i));
    setSelectedRows(new Set());
    toast.success("선택한 설정이 삭제되었습니다.");
  };

  const handleRowClick = (index: number) => {
    if (editingRow === index) return;
    setEditingRow(index);
    setEditValue(data[index].settings.attributionWindow.value);
    setEditUnit(data[index].settings.attributionWindow.unit);
  };

  const handleSave = () => {
    if (editingRow !== null) {
      onUpdate(editingRow, { attributionWindow: { value: editValue, unit: editUnit } });
      setEditingRow(null);
    }
  };

  const handleAddChannel = () => {
    const ch = newChannel.trim() || "Global";
    if (data.some((d) => d.channel.toLowerCase() === ch.toLowerCase())) {
      toast.error("이미 존재하는 채널입니다.");
      return;
    }
    onAdd({ channel: ch, settings: { attributionWindow: { ...newWindow } } });
    setNewChannel("");
    setNewWindow({ ...DEFAULT_ATTRIBUTION.attributionWindow });
    setIsAddOpen(false);
    toast.success(`${ch} 채널이 추가되었습니다.`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">+ 채널 추가</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>채널 추가</DialogTitle>
              <DialogDescription>새로운 채널에 대한 Attribution Window를 설정합니다.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium">Channel</label>
                <Input className="mt-1" placeholder="채널명을 입력하세요" value={newChannel} onChange={(e) => setNewChannel(e.target.value)} />
                <p className="mt-1 text-xs text-muted-foreground">비워두고 생성하면 Global로 자동 생성됩니다.</p>
              </div>
              <div>
                <label className="text-sm font-medium">Attribution Window</label>
                <div className="mt-1 flex items-center gap-2">
                  <Input type="number" min={1} value={newWindow.value} onChange={(e) => { const n = parseInt(e.target.value, 10); if (!isNaN(n) && n > 0) setNewWindow((p) => ({ ...p, value: n })); }} className="w-20" />
                  <UnitSelect value={newWindow.unit} onChange={(u) => setNewWindow((p) => ({ ...p, unit: u }))} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>취소</Button>
              <Button onClick={handleAddChannel}>추가</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {selectedRows.size > 0 && (
          <Button variant="destructive" size="sm" onClick={handleDeleteSelected}>
            선택 삭제 ({selectedRows.size})
          </Button>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]" />
              <TableHead className="w-[150px]">Channel</TableHead>
              <TableHead>Attribution Window</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">설정된 채널이 없습니다.</TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => {
                const isEditing = editingRow === index;
                if (isEditing) {
                  return (
                    <TableRow key={row.channel} className="bg-muted/50">
                      <TableCell><Checkbox checked={selectedRows.has(index)} onCheckedChange={(c) => handleSelectRow(index, c as boolean)} /></TableCell>
                      <TableCell className="font-medium">{row.channel}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Input type="number" min={1} value={editValue} onChange={(e) => setEditValue(parseInt(e.target.value, 10) || 1)} className="w-20 h-8" onClick={(e) => e.stopPropagation()} />
                          <UnitSelect value={editUnit} onChange={setEditUnit} />
                          <Button size="sm" onClick={handleSave}>저장</Button>
                          <Button size="sm" variant="ghost" onClick={() => setEditingRow(null)}>취소</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                }
                return (
                  <TableRow key={row.channel} className="group cursor-pointer hover:bg-muted/50" onClick={() => handleRowClick(index)}>
                    <TableCell onClick={(e) => e.stopPropagation()}><Checkbox checked={selectedRows.has(index)} onCheckedChange={(c) => handleSelectRow(index, c as boolean)} /></TableCell>
                    <TableCell className="font-medium">{row.channel}</TableCell>
                    <TableCell className="text-sm">
                      <div className="flex items-center justify-between">
                        {formatPeriodShort(row.settings.attributionWindow)}
                        <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
