import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronDown, Copy } from "lucide-react";
import type { PermissionData } from "@/types";
import { toast } from "sonner";

interface CurrentPermissionViewerProps {
  permission: PermissionData;
}

export function CurrentPermissionViewer({ permission }: CurrentPermissionViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const jsonStr = JSON.stringify(permission.integration, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonStr);
    toast.success("JSON이 클립보드에 복사되었습니다.");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Current Permission</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleCopy}>
              <Copy className="h-3.5 w-3.5 mr-1" />
              복사
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded((p) => !p)}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 mr-1" />
              ) : (
                <ChevronRight className="h-4 w-4 mr-1" />
              )}
              {isExpanded ? "접기" : "펼치기"}
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          이 대행사에 현재 저장된 채널 권한 원본 데이터입니다. 아래 Channel Permission 섹션에서 수정한 내용이 이 JSON에 반영됩니다.
        </p>
      </CardHeader>
      {isExpanded && (
        <CardContent>
          <pre className="rounded-md bg-muted p-4 text-xs overflow-x-auto max-h-80 overflow-y-auto">
            <code>{jsonStr}</code>
          </pre>
        </CardContent>
      )}
    </Card>
  );
}
