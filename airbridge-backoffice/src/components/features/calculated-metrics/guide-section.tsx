import { useState } from "react";
import { MessageCircle, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const SLACK_URL = "https://teamab180.slack.com/archives/C9B1D5N7N";

export function GuideSection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* Slack 문의 */}
      <Alert>
        <MessageCircle className="h-4 w-4" />
        <AlertDescription>
          문제가 있거나 값이 이상한 경우{" "}
          <a
            href={SLACK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4 hover:no-underline"
          >
            #all-backend
          </a>
          에서 <strong>@abr-backend-report</strong>를 태그해 질문해주세요.
        </AlertDescription>
      </Alert>

      {/* 운영 가이드 */}
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  운영 가이드
                </CardTitle>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Calculated Metric 생성·수정·삭제 전 반드시 확인해주세요.
              </p>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4 text-sm">
          {/* 생성 */}
          <div className="space-y-2">
            <Badge variant="outline">생성</Badge>
            <ul className="text-muted-foreground space-y-1 pl-4 list-disc">
              <li>
                고객사 적용 전 <strong>ablog (Org ID: 1872465354)</strong>에서
                먼저 테스트
              </li>
              <li>
                Key는 <strong>영어 소문자 + 언더스코어(_)</strong>만 가능
              </li>
              <li>Key, Display Name은 조직 내 중복 불가</li>
              <li>
                Metric Key는 Service Spec 시트 G열 또는 Actuals 리포트의 설정값
                복사로 확인
              </li>
              <li>
                Custom / Cohort / Self-serve 메트릭 사용 가능 (실제 존재해야 함)
              </li>
              <li>
                생성 후 Actuals 리포트에서 계산 확인 권장 — 툴팁에 수식이
                표시되므로 원본 메트릭과 함께 불러오면 편리
              </li>
            </ul>
          </div>

          {/* 수정 */}
          <div className="space-y-2">
            <Badge variant="outline">수정</Badge>
            <ul className="text-muted-foreground space-y-1 pl-4 list-disc">
              <li>
                <strong>Org ID나 Key 수정 시</strong> 기존 사용 고객이 메트릭을
                사용할 수 없게 됨 — 신중하게 수정
              </li>
            </ul>
          </div>

          {/* 삭제 */}
          <div className="space-y-2">
            <Badge variant="outline">삭제</Badge>
            <ul className="text-muted-foreground space-y-1 pl-4 list-disc">
              <li>
                동일 Display Name + 수식으로 재생성해도 Saved Report에서{" "}
                <strong>사용 불가</strong> (메트릭별 고유 ID가 다름)
              </li>
              <li>
                단, <strong>동일 Key로 재생성하면</strong> 기존 Saved Report에서
                다시 사용 가능
              </li>
              <li>
                삭제된 메트릭이 Saved Report에 포함된 경우, 리포트 최초 진입 시
                에러 후 자동 제거 →{" "}
                <strong>고객사 사전 안내 필요</strong>
              </li>
            </ul>
          </div>

          {/* 참고 */}
          <div className="space-y-2">
            <Badge variant="secondary">참고</Badge>
            <ul className="text-muted-foreground space-y-1 pl-4 list-disc">
              <li>0.005 미만의 값은 리포트에서 0으로 표시</li>
              <li>
                생성된 Calculated Metric은 Marketer, Agency, Media Partner 모두
                사용 가능
              </li>
            </ul>
          </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
}
