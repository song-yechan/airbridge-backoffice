import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Info, Code, HelpCircle } from "lucide-react";

export function DeduplicationGuide() {
  return (
    <div className="mb-8 space-y-4">
      {/* 문제 발생 시 안내 */}
      <Alert className="bg-yellow-50 border-yellow-200">
        <HelpCircle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800">
          사용 중 문제가 있으신가요?{" "}
          <a
            href="https://teamab180.slack.com/archives/C9B1D5N7N"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline"
          >
            #all-backend
          </a>
          에 <code className="bg-yellow-100 px-1 rounded">!worker-support</code>를 태그해서 질문해주세요!
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Info className="h-4 w-4" />
            기능 설명
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>
            중복으로 이벤트를 보냈을 때, <code className="bg-muted px-1.5 py-0.5 rounded">Unique Key</code>를 통해{" "}
            <strong>최대 24시간</strong> 안의 이벤트를 중복 제거하는 기능입니다.
          </p>
          <p className="text-muted-foreground">
            서버단에서 이벤트가 버려지므로 raw_data에도 남지 않습니다.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            주의사항
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <Alert variant="destructive" className="bg-red-50 border-red-200">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-red-800">
              <strong>Install, Deeplink Open</strong> 등 Target Event를 대상으로 한 중복 제거는 권장하지 않습니다.
            </AlertDescription>
          </Alert>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>
              백오피스에서 지원하지 않는 커스텀 이벤트 적용은{" "}
              <a
                href="https://teamab180.slack.com/archives/CU20C69NF"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline"
              >
                #csm-x-backend-req
              </a>
              에 요청해주세요.
            </li>
            <li>
              App, Web 동시 제거는 권장하지 않습니다. 웬만하면 따로 따로 적용해주세요.
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Code className="h-4 w-4" />
            Dedup Key 문법 (Liquid)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-4 font-medium">함수</th>
                  <th className="text-left py-2 font-medium">설명</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 pr-4">
                    <code className="bg-muted px-1.5 py-0.5 rounded text-xs">assert_not_empty</code>
                  </td>
                  <td className="py-2 text-muted-foreground">
                    값이 있음을 보장. 없으면 중복 제거 없이 처리됨
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">
                    <code className="bg-muted px-1.5 py-0.5 rounded text-xs">assert_valid_uuid4</code>
                  </td>
                  <td className="py-2 text-muted-foreground">
                    유효한 UUID4 포맷을 보장. 아니면 중복 제거 없이 처리됨
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="space-y-2">
            <p className="font-medium">Dedup Key 예시:</p>
            <div className="space-y-2 text-xs">
              <div className="p-2 bg-muted rounded">
                <p className="text-muted-foreground mb-1">App만 (eventCategory 포함):</p>
                <code className="break-all">
                  9360$$airbridge.ecommerce.order.completed$${"{{ data.eventData.goal.semanticAttributes.transactionID | assert_not_empty }}"}
                </code>
              </div>
              <div className="p-2 bg-muted rounded">
                <p className="text-muted-foreground mb-1">Web 또는 App+Web:</p>
                <code className="break-all">
                  airbridge.ecommerce.order.completed$${"{{ data.eventData.goal.semanticAttributes.transactionID | assert_not_empty }}"}
                </code>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
