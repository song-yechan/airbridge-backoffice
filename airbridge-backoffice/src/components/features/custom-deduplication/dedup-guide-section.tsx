import { useState } from "react";
import { AlertTriangle, ChevronDown, ChevronUp, Code } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function DedupGuideSection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-4 mb-6">
      {/* Target Event 경고 */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Install, Deeplink Open 등 Target Event</strong>를 대상으로 한 중복 제거는 권장하지 않습니다.
        </AlertDescription>
      </Alert>

      {/* Dedup Key 가이드 */}
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  Dedup Key 가이드
                </CardTitle>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Dedup Key의 Liquid 문법과 작성 규칙을 확인하세요.
              </p>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4 text-sm">
              {/* Liquid 문법 */}
              <div className="space-y-2">
                <Badge variant="outline">Liquid 문법</Badge>
                <ul className="text-muted-foreground space-y-1 pl-4 list-disc">
                  <li>Dedup Key는 Postback과 동일한 <strong>Liquid 문법</strong>을 사용</li>
                  <li>
                    <code className="text-xs bg-muted px-1 rounded">assert_not_empty</code> — 값이 있음을 보장.
                    조건 미충족 시 중복 제거 없이 이벤트가 그대로 처리됨
                  </li>
                  <li>
                    <code className="text-xs bg-muted px-1 rounded">assert_valid_uuid4</code> — 유효한 UUID4 포맷을 보장.
                    마찬가지로 미충족 시 중복 제거 미적용
                  </li>
                </ul>
              </div>

              {/* Category prefix */}
              <div className="space-y-2">
                <Badge variant="destructive">필수 규칙</Badge>
                <div className="text-muted-foreground pl-4">
                  <p>
                    식별자를 포함하지 않는 Dedup Key는 반드시 앞에{" "}
                    <code className="text-xs bg-muted px-1 rounded">
                      {"{{ data.eventData.category }}$$"}
                    </code>
                    를 추가해야 합니다.
                  </p>
                  <p className="mt-1 text-destructive">
                    누락 시 서로 다른 이벤트간 Dedup Key가 공유되어 후속 이벤트가 버려지는 사고가 발생할 수 있습니다.
                  </p>
                </div>
              </div>

              {/* 예시 */}
              <div className="space-y-2">
                <Badge variant="outline">예시</Badge>
                <div className="space-y-3 text-muted-foreground">
                  <div>
                    <p className="font-medium text-foreground text-xs mb-1">예시 1: 앱/웹 구분하여 중복 제거</p>
                    <pre className="bg-muted rounded p-2 text-xs overflow-x-auto">
{`9360$$airbridge.ecommerce.order.completed$${{ transactionID | assert_not_empty }}`}
                    </pre>
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-xs mb-1">예시 2: 앱/웹 관계 없이 중복 제거</p>
                    <pre className="bg-muted rounded p-2 text-xs overflow-x-auto">
{`airbridge.ecommerce.order.completed$${{ transactionID | assert_not_empty }}`}
                    </pre>
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-xs mb-1">예시 3: 특정 디바이스에서 앱/웹 구분</p>
                    <pre className="bg-muted rounded p-2 text-xs overflow-x-auto">
{`9360$$airbridge.ecommerce.order.completed$${{ deviceUUID | assert_valid_uuid4 }}$${{ transactionID | assert_not_empty }}`}
                    </pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
}
