import { useState } from "react";
import { ChevronDown, ChevronUp, MessageCircle, AlertTriangle, Trash2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const SLACK_URL = "https://teamab180.slack.com/archives/C9B1D5N7N";

function GuideGroup({
  icon,
  title,
  variant,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  variant: "warn" | "danger" | "info";
  children: React.ReactNode;
}) {
  const styles = {
    warn: "border-l-amber-400 bg-amber-50/50 dark:bg-amber-950/20",
    danger: "border-l-red-400 bg-red-50/50 dark:bg-red-950/20",
    info: "border-l-blue-400 bg-blue-50/50 dark:bg-blue-950/20",
  };

  return (
    <div className={`border-l-[3px] rounded-r-md px-4 py-3 ${styles[variant]}`}>
      <div className="flex items-center gap-2 font-medium text-sm mb-2">
        {icon}
        {title}
      </div>
      <ul className="text-sm text-muted-foreground space-y-1.5 list-disc pl-4">
        {children}
      </ul>
    </div>
  );
}

export function GuideSection() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="space-y-3">
      {/* Slack 문의 배너 — 항상 노출 */}
      <a
        href={SLACK_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30 px-4 py-2.5 text-sm text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors"
      >
        <MessageCircle className="h-4 w-4 flex-shrink-0" />
        <span>
          문제가 있거나 값이 이상한 경우 <strong>#all-backend</strong>에서 <strong>@abr-backend-report</strong>를 태그해 질문해주세요
        </span>
      </a>

      {/* 가이드 본문 — 접기/펼치기 */}
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="border rounded-lg bg-card overflow-hidden">
          <CollapsibleTrigger asChild>
            <button className="flex items-center justify-between w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-sm">사용 가이드</span>
              </div>
              <Button variant="ghost" size="sm" className="h-7 text-xs pointer-events-none">
                {isOpen ? (
                  <>접기 <ChevronUp className="h-3 w-3 ml-1" /></>
                ) : (
                  <>펼치기 <ChevronDown className="h-3 w-3 ml-1" /></>
                )}
              </Button>
            </button>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <div className="px-4 pb-4 pt-1 space-y-3 border-t">
              {/* 생성 시 주의 */}
              <GuideGroup
                icon={<AlertTriangle className="h-4 w-4 text-amber-600" />}
                title="생성 시 주의"
                variant="warn"
              >
                <li>고객사 적용 전 <strong>ablog (Org ID: 1872465354)</strong>에서 먼저 테스트</li>
                <li>Key는 <strong>영어 소문자 + 언더스코어(_)</strong>만 가능 — 대문자, 하이픈, 공백 포함 시 생성 실패</li>
                <li>Key, Display Name은 한 조직 내에서 <strong>중복 불가</strong></li>
                <li>Metric Key는 <strong>Service Spec 시트 G열</strong> 또는 Actuals 리포트의 <strong>설정값 복사</strong>로 확인</li>
                <li>Custom / Cohort / Self-serve 메트릭도 수식에 사용 가능 (실제 존재하는 메트릭이어야 함)</li>
                <li>생성 후 <strong>Actuals 리포트에서 계산 확인</strong> 권장 — 툴팁에 수식이 표시되므로 원본 메트릭과 함께 불러오면 편리</li>
              </GuideGroup>

              {/* 수정·삭제 시 주의 */}
              <GuideGroup
                icon={<Trash2 className="h-4 w-4 text-red-500" />}
                title="수정·삭제 시 주의"
                variant="danger"
              >
                <li><strong>Org ID나 Key 수정 시</strong> 기존 사용 고객이 메트릭을 사용할 수 없게 됨 — 신중하게 수정</li>
                <li>삭제 후 동일 Display Name + 수식으로 재생성해도 Saved Report에서 <strong>사용 불가</strong> (메트릭별 고유 ID가 다름)</li>
                <li>단, <strong>동일 Key로 재생성하면</strong> 기존 Saved Report에서 다시 사용 가능</li>
                <li>삭제된 메트릭이 Saved Report에 포함된 경우, 리포트 최초 진입 시 에러 후 자동 제거 → <strong>고객사 사전 안내 필요</strong></li>
              </GuideGroup>

              {/* 참고 */}
              <div className="text-xs text-muted-foreground px-4 space-y-0.5">
                <p>· 0.005 미만의 값은 리포트에서 0으로 표시됩니다.</p>
                <p>· 생성된 Calculated Metric은 Marketer, Agency, Media Partner 모두 사용 가능합니다.</p>
              </div>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    </div>
  );
}
