import { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

export function GuideAccordion() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-6">
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
              defaultValue={['what-is', 'schema']}
              className="space-y-0"
            >
              {/* 1. 개요 */}
              <AccordionItem value="what-is" className="border-b">
                <AccordionTrigger className="py-3 text-sm hover:no-underline">
                  Calculated Metric이란?
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-sm text-muted-foreground leading-relaxed">
                  기존 Airbridge 메트릭을 사칙연산(+, -, *, /)으로 조합하여
                  만드는 커스텀 계산 메트릭입니다. 생성된 메트릭은 해당 조직의
                  Actuals / Trends 리포트에서 사용 가능하며, 모든 역할의 사용자가
                  접근할 수 있습니다.
                </AccordionContent>
              </AccordionItem>

              {/* 2. 사용 방법 */}
              <AccordionItem value="usage" className="border-b">
                <AccordionTrigger className="py-3 text-sm hover:no-underline">
                  사용 방법
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-sm text-muted-foreground space-y-2">
                  <div className="flex gap-2 items-start">
                    <Badge variant="outline" className="flex-shrink-0 text-xs">
                      생성
                    </Badge>
                    <span>조직 ID, Key, 표시 이름, 수식(JSON)을 입력하여 새 메트릭 생성</span>
                  </div>
                  <div className="flex gap-2 items-start">
                    <Badge variant="outline" className="flex-shrink-0 text-xs">
                      조회
                    </Badge>
                    <span>기존 메트릭을 검색하고, 행 클릭 시 수정/삭제 UI 표시</span>
                  </div>
                  <div className="flex gap-2 items-start">
                    <Badge variant="outline" className="flex-shrink-0 text-xs">
                      템플릿
                    </Badge>
                    <span>CPI, CPP, CTR 등 자주 쓰는 수식을 클릭으로 적용</span>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* 3. Schema 정의 */}
              <AccordionItem value="schema" className="border-b">
                <AccordionTrigger className="py-3 text-sm hover:no-underline">
                  Schema 정의 방법
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-sm text-muted-foreground space-y-3">
                  <p>Expression은 Type을 정의하는 것으로 출발합니다. 아래 3가지 Type을 중첩하여 수식을 구성합니다.</p>

                  <div className="space-y-2">
                    <TypeCard
                      name="arithmetic"
                      desc="계산식"
                      fields={[
                        { code: 'fn', desc: '+, -, *, / 중 하나' },
                        { code: 'fields', desc: '피연산자 목록 (중첩 가능)' },
                      ]}
                    />
                    <TypeCard
                      name="constant"
                      desc="상수"
                      fields={[{ code: 'value', desc: '정수 또는 소수 (음수 허용)' }]}
                    />
                    <TypeCard
                      name="fieldAccess"
                      desc="메트릭 참조"
                      fields={[{ code: 'metric', desc: '사용할 metric key (Calculated Metric 참조 불가)' }]}
                    />
                  </div>

                  <Alert className="mt-3">
                    <AlertDescription className="text-xs">
                      <strong>Metric Key 찾기:</strong> Service Spec 시트 또는 Actuals 리포트의 설정값 복사 기능 이용
                    </AlertDescription>
                  </Alert>
                </AccordionContent>
              </AccordionItem>

              {/* 4. 주의사항 */}
              <AccordionItem value="caution" className="border-b">
                <AccordionTrigger className="py-3 text-sm hover:no-underline">
                  주의사항
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-sm text-muted-foreground">
                  <ul className="list-disc pl-4 space-y-1">
                    <li>고객사 적용 전 <strong>ablog (Org ID: 1872465354)</strong>에서 먼저 테스트</li>
                    <li>Key는 영어 소문자 + 언더스코어(_)만 사용</li>
                    <li>수식 내에서 다른 Calculated Metric 참조 불가</li>
                    <li>삭제 시 Saved Report에서 자동 제거 (동일 Key 재생성 시 복구)</li>
                    <li>0.005 미만의 값은 리포트에서 0으로 표시</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              {/* 5. 참고 */}
              <AccordionItem value="tips" className="border-0">
                <AccordionTrigger className="py-3 text-sm hover:no-underline">
                  참고 사항
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-sm text-muted-foreground space-y-2">
                  <p>
                    <strong>수식 검증:</strong> Ctrl+Enter 또는 포커스 해제 시 JSON 포맷 검증.
                    메트릭 유효성은 생성/수정 버튼 클릭 후 검증.
                  </p>
                  <p>
                    <strong>수정/삭제:</strong> 조회 탭에서 메트릭 행을 클릭하여 선택하면
                    하단에 수정/삭제 UI가 나타납니다.
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

interface TypeCardProps {
  name: string;
  desc: string;
  fields: { code: string; desc: string }[];
}

function TypeCard({ name, desc, fields }: TypeCardProps) {
  return (
    <div className="rounded-md border p-3 bg-muted/30">
      <div className="flex items-center gap-2 mb-2">
        <code className="text-xs font-semibold bg-primary/10 px-2 py-0.5 rounded">
          {name}
        </code>
        <span className="text-xs text-muted-foreground">{desc}</span>
      </div>
      <div className="space-y-1">
        {fields.map((field) => (
          <div key={field.code} className="flex gap-2 text-xs pl-2">
            <code className="bg-muted px-1.5 py-0.5 rounded font-mono flex-shrink-0">
              {field.code}
            </code>
            <span className="text-muted-foreground">{field.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
