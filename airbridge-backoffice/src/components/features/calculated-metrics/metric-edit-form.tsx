import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ExpressionEditor } from "./expression-editor";
import type { CalculatedMetric } from "@/types";

interface MetricEditFormProps {
  metric: CalculatedMetric;
  displayName: string;
  expression: string;
  onDisplayNameChange: (v: string) => void;
  onExpressionChange: (v: string) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function MetricEditForm({
  metric,
  displayName,
  expression,
  onDisplayNameChange,
  onExpressionChange,
  onEdit,
  onDelete,
}: MetricEditFormProps) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleDelete = () => {
    onDelete();
    setIsDeleteOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          Calculated Metric 수정 및 삭제
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          현재 선택된 메트릭: <span className="font-mono font-medium text-foreground">{metric.key}</span>
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Key (변경 불가)</label>
          <Input className="mt-1 bg-muted" value={metric.key} disabled />
        </div>
        <div>
          <label className="text-sm font-medium">Display Name</label>
          <Input
            className="mt-1"
            value={displayName}
            onChange={(e) => onDisplayNameChange(e.target.value)}
          />
        </div>

        <ExpressionEditor value={expression} onChange={onExpressionChange} />

        <div className="grid grid-cols-2 gap-4">
          <Button onClick={onEdit}>Edit</Button>
          <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">Delete</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>메트릭 삭제</DialogTitle>
                <DialogDescription>
                  <strong>{metric.key}</strong> ({metric.displayName}) 메트릭을 삭제하시겠습니까?
                  삭제 시 해당 메트릭을 사용하는 Saved Report에 영향을 줄 수 있습니다.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                  취소
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  삭제
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
