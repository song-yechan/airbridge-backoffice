import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AddChannelDialogProps {
  existingChannels: string[];
  onAdd: (channelName: string) => void;
  trigger?: React.ReactNode;
}

export function AddChannelDialog({
  existingChannels,
  onAdd,
  trigger,
}: AddChannelDialogProps) {
  const [open, setOpen] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    const trimmed = channelName.trim();

    if (!trimmed) {
      setError("채널 이름을 입력해주세요");
      return;
    }

    if (existingChannels.includes(trimmed)) {
      setError("이미 존재하는 채널 이름입니다");
      return;
    }

    // Channel naming validation (alphanumeric, underscore, hyphen only)
    if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
      setError("채널 이름은 영문, 숫자, 밑줄(_), 하이픈(-)만 사용할 수 있습니다");
      return;
    }

    onAdd(trimmed);
    setChannelName("");
    setError(null);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setChannelName("");
      setError(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            채널 추가
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Custom Channel 추가</DialogTitle>
          <DialogDescription>
            새로운 커스텀 채널을 추가합니다. 채널을 추가한 후 Data Filter를
            설정해주세요.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="channel-name">채널 이름</Label>
            <Input
              id="channel-name"
              placeholder="예: Naver_Brand, Kakao_Performance"
              value={channelName}
              onChange={(e) => {
                setChannelName(e.target.value);
                setError(null);
              }}
              onKeyDown={handleKeyDown}
            />
            <p className="text-xs text-muted-foreground">
              영문, 숫자, 밑줄(_), 하이픈(-)만 사용 가능합니다
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            취소
          </Button>
          <Button onClick={handleSubmit} disabled={!channelName.trim()}>
            추가
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
