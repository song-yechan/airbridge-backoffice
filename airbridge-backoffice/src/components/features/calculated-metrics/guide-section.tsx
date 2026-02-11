import { useState } from "react";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function GuideSection() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="border rounded-lg bg-card overflow-hidden">
        <CollapsibleTrigger asChild>
          <button className="flex items-center justify-between w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-sm">사용 가이드</span>
            </div>
            <Button variant="ghost" size="sm" className="h-7 text-xs">
              {isOpen ? (
                <>접기 <ChevronUp className="h-3 w-3 ml-1" /></>
              ) : (
                <>펼치기 <ChevronDown className="h-3 w-3 ml-1" /></>
              )}
            </Button>
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-4 pb-4 border-t">
            <Accordion
              type="multiple"
              defaultValue={["caution"]}
              className="space-y-0"
            >
              {/* 사용 방법 */}
              <AccordionItem value="usage">
                <AccordionTrigger className="py-3 text-sm hover:no-underline">
                  사용 방법
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground space-y-2">
                  <div className="flex gap-2 items-start">
                    <Badge variant="outline" className="flex-shrink-0 text-xs">생성</Badge>
                    <span>조직 ID, Key, 표시 이름, 수식(JSON)을 입력하여 새 메트릭 생성</span>
                  </div>
                  <div className="flex gap-2 items-start">
                    <Badge variant="outline" className="flex-shrink-0 text-xs">조회</Badge>
                    <span>기존 메트릭을 검색하고, 행 클릭 시 수정/삭제 UI 표시</span>
                  </div>
                  <div className="flex gap-2 items-start">
                    <Badge variant="outline" className="flex-shrink-0 text-xs">템플릿</Badge>
                    <span>CPI, CPP, CTR 등 자주 쓰는 수식을 클릭으로 적용</span>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* 수식 작성 */}
              <AccordionItem value="expression">
                <AccordionTrigger className="py-3 text-sm hover:no-underline">
                  수식 작성 팁
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground space-y-2">
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Metric Key는 <strong>Service Spec 시트의 G열(metric_key)</strong> 또는 Actuals 리포트의 <strong>설정값 복사</strong> 기능으로 확인</li>
                    <li>Custom Metric, Cohort Metric, Self-serve 메트릭도 수식에 사용 가능 (단, 해당 메트릭이 실제로 존재해야 리포트에서 에러 없음)</li>
                    <li><strong>Calculated Metric은 수식에 사용 불가</strong> — 필요 시 해당 Calculated Metric의 수식을 복사해서 사용</li>
                    <li>field 내 순서대로 계산되므로, 괄호가 필요한 경우 arithmetic 중첩으로 순서 조절</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              {/* 주의사항 */}
              <AccordionItem value="caution">
                <AccordionTrigger className="py-3 text-sm hover:no-underline">
                  주의사항
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  <ul className="list-disc pl-4 space-y-1">
                    <li>고객사 적용 전 <strong>ablog (Org ID: 1872465354)</strong>에서 먼저 테스트</li>
                    <li>Key는 <strong>영어 소문자 + 언더스코어(_)</strong>만 사용 — 대문자, 하이픈, 공백 포함 시 생성 실패</li>
                    <li>Key, Display Name은 한 조직 내에서 중복 불가</li>
                    <li>생성 후 Actuals 리포트에서 계산 확인 권장 (툴팁에 수식 표시됨, 원본 메트릭과 함께 불러오면 편리)</li>
                    <li>0.005 미만의 값은 리포트에서 0으로 표시</li>
                    <li>생성된 Calculated Metric은 <strong>Marketer, Agency, Media Partner</strong> 모두 사용 가능</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              {/* 수정/삭제 */}
              <AccordionItem value="edit-delete">
                <AccordionTrigger className="py-3 text-sm hover:no-underline">
                  수정/삭제 시 주의
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  <ul className="list-disc pl-4 space-y-1">
                    <li><strong>Organization ID나 Key를 함부로 수정하면</strong> 기존에 해당 메트릭을 사용하던 고객이 사용 불가 — 신중하게 수정</li>
                    <li>삭제 후 동일한 Display Name + 수식으로 재생성해도 Saved Report에서 사용 불가 (메트릭별 고유 ID가 다름)</li>
                    <li>단, <strong>동일한 Key로 재생성하면</strong> 기존 Saved Report에서 다시 사용 가능</li>
                    <li>삭제된 메트릭이 Saved Report에 포함된 경우, 리포트 최초 진입 시 에러 발생 후 자동 제거됨 → <strong>고객사 사전 안내 필요</strong></li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              {/* 문의 */}
              <AccordionItem value="contact" className="border-b-0">
                <AccordionTrigger className="py-3 text-sm hover:no-underline">
                  문의
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  <p>
                    사용 중 문제가 있거나 값이 이상한 경우 <strong>#all-backend</strong>에 <strong>@abr-backend-report</strong>를 태그해서 질문해주세요.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
