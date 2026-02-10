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
import type { WindowPeriod, TimeUnit, LookbackWindowSettings, ChannelLookbackWindow } from "@/types";
import { formatPeriodShort, DEFAULT_LOOKBACK } from "@/data/reactivated-attribution-mock";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

interface LookbackTableProps {
  data: ChannelLookbackWindow[];
  onUpdate: (index: number, updates: Partial<LookbackWindowSettings>) => void;
  onAdd: (channel: ChannelLookbackWindow) => void;
  onRemove: (index: number) => void;
}

export function LookbackTable({ data, onUpdate, onAdd, onRemove }: LookbackTableProps) {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editSettings, setEditSettings] = useState<LookbackWindowSettings | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newChannel, setNewChannel] = useState("");
  const [newSettings, setNewSettings] = useState<LookbackWindowSettings>({ ...DEFAULT_LOOKBACK });

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
    setEditSettings({ ...data[index].settings });
  };

  const handleSave = () => {
    if (editingRow !== null && editSettings) {
      onUpdate(editingRow, editSettings);
      setEditingRow(null);
      setEditSettings(null);
    }
  };

  const handleCancel = () => {
    setEditingRow(null);
    setEditSettings(null);
  };

  const handleEditField = (field: keyof LookbackWindowSettings, value: number, unit: TimeUnit) => {
    if (editSettings) {
      setEditSettings({ ...editSettings, [field]: { value, unit } });
    }
  };

  const handleAddChannel = () => {
    const ch = newChannel.trim() || "Global";
    if (data.some((d) => d.channel.toLowerCase() === ch.toLowerCase())) {
      toast.error("이미 존재하는 채널입니다.");
      return;
    }
    onAdd({ channel: ch, settings: { ...newSettings } });
    setNewChannel("");
    setNewSettings({ ...DEFAULT_LOOKBACK });
    setIsAddOpen(false);
    toast.success(`${ch} 채널이 추가되었습니다.`);
  };

  const handleNewField = (field: keyof LookbackWindowSettings, value: number, unit: TimeUnit) => {
    setNewSettings((prev) => ({ ...prev, [field]: { value, unit } }));
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
              <DialogDescription>새로운 채널에 대한 Lookback Window를 설정합니다.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium">Channel</label>
                <Input className="mt-1" placeholder="채널명을 입력하세요" value={newChannel} onChange={(e) => setNewChannel(e.target.value)} />
                <p className="mt-1 text-xs text-muted-foreground">비워두고 생성하면 Global로 자동 생성됩니다.</p>
              </div>
              <PeriodInput label="Click - Device Matching" value={newSettings.clickDeviceMatching} onChange={(v, u) => handleNewField("clickDeviceMatching", v, u)} />
              <PeriodInput label="Click - Probabilistic Modeling" value={newSettings.clickProbabilisticModeling} onChange={(v, u) => handleNewField("clickProbabilisticModeling", v, u)} />
              <PeriodInput label="View - Device Matching" value={newSettings.viewDeviceMatching} onChange={(v, u) => handleNewField("viewDeviceMatching", v, u)} />
              <PeriodInput label="View - Probabilistic Modeling" value={newSettings.viewProbabilisticModeling} onChange={(v, u) => handleNewField("viewProbabilisticModeling", v, u)} />
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

      <div className="rounded-md bg-muted p-3 text-sm">
        <p className="font-medium">기본값 안내</p>
        <ul className="mt-1 list-inside list-disc text-muted-foreground">
          <li>Click - Device Matching (Click-DM): 7일</li>
          <li>Click - Probabilistic Modeling (Click-PM): 1일</li>
          <li>View - Device Matching (View-DM): 1일</li>
          <li>View - Probabilistic Modeling (View-PM): 6시간</li>
        </ul>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]" />
              <TableHead className="w-[120px]">Channel</TableHead>
              <TableHead>Click-DM</TableHead>
              <TableHead>Click-PM</TableHead>
              <TableHead>View-DM</TableHead>
              <TableHead>View-PM</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">설정된 채널이 없습니다.</TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => {
                const isEditing = editingRow === index;
                if (isEditing && editSettings) {
                  return (
                    <TableRow key={row.channel} className="bg-muted/50">
                      <TableCell><Checkbox checked={selectedRows.has(index)} onCheckedChange={(c) => handleSelectRow(index, c as boolean)} /></TableCell>
                      <TableCell className="font-medium">{row.channel}</TableCell>
                      <TableCell><InlineInput value={editSettings.clickDeviceMatching} onChange={(v, u) => handleEditField("clickDeviceMatching", v, u)} /></TableCell>
                      <TableCell><InlineInput value={editSettings.clickProbabilisticModeling} onChange={(v, u) => handleEditField("clickProbabilisticModeling", v, u)} /></TableCell>
                      <TableCell><InlineInput value={editSettings.viewDeviceMatching} onChange={(v, u) => handleEditField("viewDeviceMatching", v, u)} /></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <InlineInput value={editSettings.viewProbabilisticModeling} onChange={(v, u) => handleEditField("viewProbabilisticModeling", v, u)} />
                          <Button size="sm" onClick={handleSave}>저장</Button>
                          <Button size="sm" variant="ghost" onClick={handleCancel}>취소</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                }
                return (
                  <TableRow key={row.channel} className="group cursor-pointer hover:bg-muted/50" onClick={() => handleRowClick(index)}>
                    <TableCell onClick={(e) => e.stopPropagation()}><Checkbox checked={selectedRows.has(index)} onCheckedChange={(c) => handleSelectRow(index, c as boolean)} /></TableCell>
                    <TableCell className="font-medium">{row.channel}</TableCell>
                    <TableCell className="text-sm">{formatPeriodShort(row.settings.clickDeviceMatching)}</TableCell>
                    <TableCell className="text-sm">{formatPeriodShort(row.settings.clickProbabilisticModeling)}</TableCell>
                    <TableCell className="text-sm">{formatPeriodShort(row.settings.viewDeviceMatching)}</TableCell>
                    <TableCell className="text-sm">
                      <div className="flex items-center justify-between">
                        {formatPeriodShort(row.settings.viewProbabilisticModeling)}
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

function PeriodInput({ label, value, onChange }: { label: string; value: WindowPeriod; onChange: (v: number, u: TimeUnit) => void }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <div className="mt-1 flex items-center gap-2">
        <Input type="number" min={1} value={value.value} onChange={(e) => { const n = parseInt(e.target.value, 10); if (!isNaN(n) && n > 0) onChange(n, value.unit); }} className="w-20" />
        <UnitSelect value={value.unit} onChange={(u) => onChange(value.value, u)} />
      </div>
    </div>
  );
}

function InlineInput({ value, onChange }: { value: WindowPeriod; onChange: (v: number, u: TimeUnit) => void }) {
  return (
    <div className="flex items-center gap-1">
      <Input type="number" min={1} value={value.value} onChange={(e) => { const n = parseInt(e.target.value, 10); if (!isNaN(n) && n > 0) onChange(n, value.unit); }} className="w-16 h-8" onClick={(e) => e.stopPropagation()} />
      <UnitSelect value={value.unit} onChange={(u) => onChange(value.value, u)} />
    </div>
  );
}
