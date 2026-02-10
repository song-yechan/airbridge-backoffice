import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { UnitSelect } from '@/components/common/UnitSelect';
import type { WindowPeriod, TimeUnit, AttributionWindowSettings } from '@/types';
import { formatPeriodShort, defaultAttributionSettings } from '@/data/mockData';
import { toast } from 'sonner';

interface ChannelData {
  channel: string;
  settings: AttributionWindowSettings;
}

interface AttributionTableProps {
  data: ChannelData[];
  onUpdate: (index: number, updates: Partial<AttributionWindowSettings>) => void;
  onAdd: (channel: ChannelData) => void;
  onRemove: (index: number) => void;
}

export function AttributionTable({ data, onUpdate, onAdd, onRemove }: AttributionTableProps) {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<number>(0);
  const [editUnit, setEditUnit] = useState<TimeUnit>('days');

  // Add dialog state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newChannel, setNewChannel] = useState('');
  const [newWindow, setNewWindow] = useState<WindowPeriod>({
    ...defaultAttributionSettings.attributionWindow,
  });

  const handleSelectRow = (index: number, checked: boolean) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(index);
      } else {
        next.delete(index);
      }
      return next;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(data.map((_, idx) => idx)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleDeleteSelected = () => {
    const sortedIndexes = Array.from(selectedRows).sort((a, b) => b - a);
    sortedIndexes.forEach((index) => {
      onRemove(index);
    });
    setSelectedRows(new Set());
    toast.success('선택한 설정이 삭제되었습니다.');
  };

  const handleRowClick = (index: number) => {
    if (editingRow === index) return;
    setEditingRow(index);
    setEditValue(data[index].settings.attributionWindow.value);
    setEditUnit(data[index].settings.attributionWindow.unit);
  };

  const handleSave = () => {
    if (editingRow !== null) {
      onUpdate(editingRow, {
        attributionWindow: { value: editValue, unit: editUnit },
      });
      setEditingRow(null);
      toast.success('설정이 업데이트되었습니다.');
    }
  };

  const handleCancel = () => {
    setEditingRow(null);
  };

  const handleAddChannel = () => {
    const trimmedChannel = newChannel.trim() || 'Global';
    if (data.some((d) => d.channel.toLowerCase() === trimmedChannel.toLowerCase())) {
      toast.error('이미 존재하는 채널입니다.');
      return;
    }
    onAdd({
      channel: trimmedChannel,
      settings: { attributionWindow: { ...newWindow } },
    });
    setNewChannel('');
    setNewWindow({ ...defaultAttributionSettings.attributionWindow });
    setIsAddDialogOpen(false);
    toast.success(`${trimmedChannel} 채널이 추가되었습니다.`);
  };

  const allSelected = data.length > 0 && selectedRows.size === data.length;

  return (
    <div className="space-y-4">
      {/* Actions */}
      <div className="flex items-center gap-2">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              + 채널 추가
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>채널 추가</DialogTitle>
              <DialogDescription>
                새로운 채널에 대한 Attribution Window를 설정합니다.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium">Channel</label>
                <Input
                  className="mt-1"
                  placeholder="비워두면 Global"
                  value={newChannel}
                  onChange={(e) => setNewChannel(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Attribution Window</label>
                <div className="mt-1 flex items-center gap-2">
                  <Input
                    type="number"
                    min={1}
                    value={newWindow.value}
                    onChange={(e) => {
                      const num = parseInt(e.target.value, 10);
                      if (!isNaN(num) && num > 0) {
                        setNewWindow((prev) => ({ ...prev, value: num }));
                      }
                    }}
                    className="w-20"
                  />
                  <UnitSelect
                    value={newWindow.unit}
                    onChange={(u) => setNewWindow((prev) => ({ ...prev, unit: u }))}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                취소
              </Button>
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

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={allSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead className="w-[150px]">Channel</TableHead>
              <TableHead>Attribution Window</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  설정된 채널이 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => {
                const isEditing = editingRow === index;

                if (isEditing) {
                  return (
                    <TableRow key={row.channel} className="bg-muted/50">
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedRows.has(index)}
                          onChange={(e) => handleSelectRow(index, e.target.checked)}
                          aria-label={`Select ${row.channel}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{row.channel}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min={1}
                            value={editValue}
                            onChange={(e) => setEditValue(parseInt(e.target.value, 10) || 1)}
                            className="w-20 h-8"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <UnitSelect value={editUnit} onChange={setEditUnit} />
                          <Button size="sm" onClick={handleSave}>
                            저장
                          </Button>
                          <Button size="sm" variant="ghost" onClick={handleCancel}>
                            취소
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                }

                return (
                  <TableRow
                    key={row.channel}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleRowClick(index)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedRows.has(index)}
                        onChange={(e) => handleSelectRow(index, e.target.checked)}
                        aria-label={`Select ${row.channel}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{row.channel}</TableCell>
                    <TableCell>{formatPeriodShort(row.settings.attributionWindow)}</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground">
        <p>행을 클릭하여 설정을 수정할 수 있습니다.</p>
      </div>
    </div>
  );
}
