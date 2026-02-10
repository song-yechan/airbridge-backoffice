import { useState } from "react";
import { ChevronDown, ChevronRight, FileJson } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import type { Permission } from "@/types";

interface CurrentPermissionViewProps {
  permission: Permission | null;
  isLoading?: boolean;
}

export function CurrentPermissionView({
  permission,
  isLoading = false,
}: CurrentPermissionViewProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileJson className="h-5 w-5" />
            현재 권한 설정
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!permission) {
    return null;
  }

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileJson className="h-5 w-5" />
              현재 권한 설정
            </CardTitle>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                {isOpen ? (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    접기
                  </>
                ) : (
                  <>
                    <ChevronRight className="h-4 w-4 mr-1" />
                    펼치기
                  </>
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent>
            <ScrollArea className="h-[300px] w-full rounded-md border">
              <pre className="p-4 text-xs font-mono">
                {JSON.stringify(permission, null, 2)}
              </pre>
            </ScrollArea>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
