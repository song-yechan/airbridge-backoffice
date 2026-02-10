import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Building2, AlertCircle } from "lucide-react";
import type { Agency } from "@/types";

interface AgencySelectorProps {
  agencies: Agency[];
  selectedAgencyId: string | null;
  onSelectAgency: (agencyId: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function AgencySelector({
  agencies,
  selectedAgencyId,
  onSelectAgency,
  isLoading = false,
  disabled = false,
}: AgencySelectorProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            대행사 선택
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (agencies.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            대행사 선택
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              이 앱에 연결된 대행사가 없습니다. 먼저 대시보드에서 대행사를
              추가해주세요.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          대행사 선택
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="agency-select">권한을 설정할 대행사</Label>
          <Select
            value={selectedAgencyId || ""}
            onValueChange={onSelectAgency}
            disabled={disabled}
          >
            <SelectTrigger id="agency-select">
              <SelectValue placeholder="대행사를 선택해주세요" />
            </SelectTrigger>
            <SelectContent>
              {agencies.map((agency) => (
                <SelectItem key={agency.id} value={agency.id}>
                  <div className="flex flex-col">
                    <span>{agency.name}</span>
                    <span className="text-xs text-muted-foreground">
                      User Group ID: {agency.userGroupId}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
