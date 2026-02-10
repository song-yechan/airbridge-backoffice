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
import type { WindowPeriod, TimeUnit, LookbackWindowSettings } from '@/types';
import { formatPeriodShort, defaultLookbackSettings } from '@/data/mockData';
import { toast } from 'sonner';

interface ChannelData {
  channel: string;
  settings: LookbackWindowSettings;
}

interface EditableTableProps {
  data: ChannelData[];
  onUpdate: (index: number, updates: Partial<LookbackWindowSettings>) => void;
  onAdd: (channel: ChannelData) => void;
  onRemove: (index: number) => void;
}

export function EditableTable({ data, onUpdate, onAdd, onRemove }: EditableTableProps) {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editSettings, setEditSettings] = useState<LookbackWindowSettings | null>(null);

  // Add dialog state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newChannel, setNewChannel] = useState('');
  const [newSettings, setNewSettings] = useState<LookbackWindowSettings>({
    ...defaultLookbackSettings,
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
    setEditSettings({ ...data[index].settings });
  };

  const handleSave = () => {
    if (editingRow !== null && editSettings) {
      onUpdate(editingRow, editSettings);
      setEditingRow(null);
      setEditSettings(null);
      toast.success('설정이 업데이트되었습니다.');
    }
  };

  const handleCancel = () => {
    setEditingRow(null);
    setEditSettings(null);
  };

  const handleEditSettingChange = (
    field: keyof LookbackWindowSettings,
    value: number,
    unit: TimeUnit
  ) => {
    if (editSettings) {
      setEditSettings({
        ...editSettings,
        [field]: { value, unit },
      });
    }
  };

  const handleAddChannel = () => {
    const trimmedChannel = newChannel.trim() || 'Global';
    if (data.some((d) => d.channel.toLowerCase() === trimmedChannel.toLowerCase())) {
      toast.error('이미 존재하는 채널입니다.');
      return;
    }
    onAdd({
      channel: trimmedChannel,
      settings: { ...newSettings },
    });
    setNewChannel('');
    setNewSettings({ ...defaultLookbackSettings });
    setIsAddDialogOpen(false);
    toast.success(`${trimmedChannel} 채널이 추가되었습니다.`);
  };

  const handleNewSettingChange = (
    field: keyof LookbackWindowSettings,
    value: number,
    unit: TimeUnit
  ) => {
    setNewSettings((prev) => ({
      ...prev,
      [field]: { value, unit },
    }));
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
                새로운 채널에 대한 Lookback Window를 설정합니다.
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

              <WindowPeriodInput
                label="Click - Device Matching"
                value={newSettings.clickDeviceMatching}
                onChange={(v, u) => handleNewSettingChange('clickDeviceMatching', v, u)}
              />
              <WindowPeriodInput
                label="Click - Probabilistic Modeling"
                value={newSettings.clickProbabilisticModeling}
                onChange={(v, u) => handleNewSettingChange('clickProbabilisticModeling', v, u)}
              />
              <WindowPeriodInput
                label="View - Device Matching"
                value={newSettings.viewDeviceMatching}
                onChange={(v, u) => handleNewSettingChange('viewDeviceMatching', v, u)}
              />
              <WindowPeriodInput
                label="View - Probabilistic Modeling"
                value={newSettings.viewProbabilisticModeling}
                onChange={(v, u) => handleNewSettingChange('viewProbabilisticModeling', v, u)}
              />
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
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  설정된 채널이 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => {
                const isEditing = editingRow === index;

                if (isEditing && editSettings) {
                  return (
                    <TableRow key={row.channel} className="bg-muted/50">
                      <TableCell>
                        <Checkbox
                          checked={selectedRows.has(index)}
                          onChange={(e) => handleSelectRow(index, e.target.checked)}
                          aria-label={`Select ${row.channel}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{row.channel}</TableCell>
                      <TableCell>
                        <InlineInput
                          value={editSettings.clickDeviceMatching}
                          onChange={(v, u) => handleEditSettingChange('clickDeviceMatching', v, u)}
                        />
                      </TableCell>
                      <TableCell>
                        <InlineInput
                          value={editSettings.clickProbabilisticModeling}
                          onChange={(v, u) => handleEditSettingChange('clickProbabilisticModeling', v, u)}
                        />
                      </TableCell>
                      <TableCell>
                        <InlineInput
                          value={editSettings.viewDeviceMatching}
                          onChange={(v, u) => handleEditSettingChange('viewDeviceMatching', v, u)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <InlineInput
                            value={editSettings.viewProbabilisticModeling}
                            onChange={(v, u) => handleEditSettingChange('viewProbabilisticModeling', v, u)}
                          />
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
                    <TableCell>{formatPeriodShort(row.settings.clickDeviceMatching)}</TableCell>
                    <TableCell>{formatPeriodShort(row.settings.clickProbabilisticModeling)}</TableCell>
                    <TableCell>{formatPeriodShort(row.settings.viewDeviceMatching)}</TableCell>
                    <TableCell>{formatPeriodShort(row.settings.viewProbabilisticModeling)}</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground">
        <p>
          <strong>DM</strong> = Device Matching, <strong>PM</strong> = Probabilistic Modeling
        </p>
        <p>행을 클릭하여 전체 설정을 수정할 수 있습니다.</p>
      </div>
    </div>
  );
}

interface WindowPeriodInputProps {
  label: string;
  value: WindowPeriod;
  onChange: (value: number, unit: TimeUnit) => void;
}

function WindowPeriodInput({ label, value, onChange }: WindowPeriodInputProps) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <div className="mt-1 flex items-center gap-2">
        <Input
          type="number"
          min={1}
          value={value.value}
          onChange={(e) => {
            const num = parseInt(e.target.value, 10);
            if (!isNaN(num) && num > 0) {
              onChange(num, value.unit);
            }
          }}
          className="w-20"
        />
        <UnitSelect value={value.unit} onChange={(u) => onChange(value.value, u)} />
      </div>
    </div>
  );
}

interface InlineInputProps {
  value: WindowPeriod;
  onChange: (value: number, unit: TimeUnit) => void;
}

function InlineInput({ value, onChange }: InlineInputProps) {
  return (
    <div className="flex items-center gap-1">
      <Input
        type="number"
        min={1}
        value={value.value}
        onChange={(e) => {
          const num = parseInt(e.target.value, 10);
          if (!isNaN(num) && num > 0) {
            onChange(num, value.unit);
          }
        }}
        className="w-16 h-8"
        onClick={(e) => e.stopPropagation()}
      />
      <UnitSelect value={value.unit} onChange={(u) => onChange(value.value, u)} />
    </div>
  );
}
