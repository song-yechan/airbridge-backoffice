import { Loader2, Save, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
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

interface ActionButtonsProps {
  hasChanges: boolean;
  isSubmitting: boolean;
  onApply: () => void;
  onReset: () => void;
  disabled?: boolean;
}

export function ActionButtons({
  hasChanges,
  isSubmitting,
  onApply,
  onReset,
  disabled = false,
}: ActionButtonsProps) {
  return (
    <div className="flex items-center justify-end gap-3 p-4 bg-background border-t sticky bottom-0">
      <Button
        variant="outline"
        onClick={onReset}
        disabled={!hasChanges || isSubmitting || disabled}
      >
        <RotateCcw className="h-4 w-4 mr-2" />
        Reset
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button disabled={!hasChanges || isSubmitting || disabled}>
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Apply
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>변경사항을 적용하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              대행사의 커스텀 채널 권한이 업데이트됩니다. 변경 후 대행사는 새로운
              권한 설정에 따라 데이터에 접근하게 됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={onApply}>적용</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
