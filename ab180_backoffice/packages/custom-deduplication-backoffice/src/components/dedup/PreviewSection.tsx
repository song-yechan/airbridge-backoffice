import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { EventType, Platform } from "@/types";
import { generateDedupKey } from "@/lib/dedup";

interface PreviewSectionProps {
  appId: string;
  platforms: Platform[];
  eventType: EventType | null;
  dedupWindow: number;
}

export function PreviewSection({
  appId,
  platforms,
  eventType,
  dedupWindow,
}: PreviewSectionProps) {
  const isValid = platforms.length > 0 && eventType !== null;
  const dedupKey = isValid ? generateDedupKey(platforms, eventType!) : null;

  const previewText = isValid
    ? `App ID: ${appId}\nDedup Key: ${dedupKey}\nDedup Window: ${dedupWindow} seconds`
    : null;

  const handleCopy = () => {
    if (previewText) {
      navigator.clipboard.writeText(previewText);
      toast.success("설정 정보가 클립보드에 복사되었습니다.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Eye className="h-5 w-5" />
          2. 확인
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isValid ? (
          <p className="text-sm text-muted-foreground">
            Platform과 Event Type을 선택하면 생성될 설정이 표시됩니다.
          </p>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">생성될 설정:</span>
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                <Copy className="h-4 w-4 mr-1" />
                복사
              </Button>
            </div>
            <div className="p-4 bg-muted rounded-lg font-mono text-sm space-y-1">
              <div>
                <span className="text-muted-foreground">App ID:</span>{" "}
                <span className="font-semibold">{appId}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Dedup Key:</span>{" "}
                <span className="font-semibold break-all">{dedupKey}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Dedup Window:</span>{" "}
                <span className="font-semibold">{dedupWindow} seconds</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
