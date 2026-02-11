import { useState } from "react";
import { AlertTriangle, ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function ReactivatedGuideSection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-4 mb-6">
      {/* 리포트 자동 노출 경고 */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          규칙 적용이 완료되면 <strong>Reactivated 관련 메트릭이 리포트에 자동으로 노출</strong>됩니다.
        </AlertDescription>
      </Alert>

      {/* FAQ */}
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  FAQ
                </CardTitle>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                자주 묻는 질문과 Window 기본값을 확인하세요.
              </p>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4 text-sm">
              {/* Q1 */}
              <div>
                <p className="font-medium">Q. Inactivity Window란?</p>
                <p className="text-muted-foreground mt-1">
                  유저가 앱을 사용하지 않은 기간입니다. 이 기간이 지난 후 다시 앱을 사용하면 Reactivation으로 인식됩니다.
                  <strong> 미설정 시 Reactivation Tracking이 동작하지 않습니다.</strong>
                </p>
              </div>

              {/* Q2 */}
              <div>
                <p className="font-medium">Q. Lookback Window를 설정하지 않으면?</p>
                <p className="text-muted-foreground mt-1 mb-2">
                  아래 기본값이 적용됩니다.
                </p>
                <div className="rounded-md border overflow-hidden">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-muted">
                        <th className="text-left px-3 py-1.5 font-medium">매칭 타입</th>
                        <th className="text-left px-3 py-1.5 font-medium">기본값</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-t"><td className="px-3 py-1.5">Click — Device Matching</td><td className="px-3 py-1.5">7일</td></tr>
                      <tr className="border-t"><td className="px-3 py-1.5">Click — Probabilistic Modeling</td><td className="px-3 py-1.5">1일</td></tr>
                      <tr className="border-t"><td className="px-3 py-1.5">View — Device Matching</td><td className="px-3 py-1.5">1일</td></tr>
                      <tr className="border-t"><td className="px-3 py-1.5">View — Probabilistic Modeling</td><td className="px-3 py-1.5">6시간</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Q3 */}
              <div>
                <p className="font-medium">Q. Attribution Window를 설정하지 않으면?</p>
                <p className="text-muted-foreground mt-1">
                  모든 이벤트 타입의 Attribution Window 기본값인 <strong>7일</strong>이 적용됩니다.
                </p>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
}
