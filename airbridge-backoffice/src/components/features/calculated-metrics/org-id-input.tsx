import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface OrgIdInputProps {
  orgId: string;
  onOrgIdChange: (id: string) => void;
  onLoad: () => void;
}

export function OrgIdInput({ orgId, onOrgIdChange, onLoad }: OrgIdInputProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Organization ID</CardTitle>
        <p className="text-sm text-muted-foreground">
          Calculated Metric은 App이 아닌 Organization(조직) 단위로 관리됩니다. 조직에 속한 모든 앱의 리포트에서 공통으로 사용할 수 있습니다.
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Organization ID를 입력하세요"
            value={orgId}
            onChange={(e) => onOrgIdChange(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") onLoad(); }}
          />
          <Button onClick={onLoad}>
            <Search className="h-4 w-4 mr-1" />
            조회
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
