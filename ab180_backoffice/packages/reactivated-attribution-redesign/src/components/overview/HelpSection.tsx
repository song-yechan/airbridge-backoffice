import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function HelpSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <path d="M12 17h.01" />
          </svg>
          이 기능은 무엇인가요?
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="what-is-reactivation">
            <AccordionTrigger>Reactivation이란?</AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">
                Reactivation은 일정 기간 동안 앱을 사용하지 않은 비활성 유저가 다시 앱을 사용하는 것을 의미합니다.
                이 기능을 통해 비활성 유저의 재활성화를 별도로 추적하고, 어떤 마케팅 채널이 재활성화에 효과적인지 분석할 수 있습니다.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="inactivity-window">
            <AccordionTrigger>Inactivity Window란?</AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">
                유저가 앱을 사용하지 않은 것으로 판단하는 기간입니다.
                예를 들어 7일로 설정하면, 7일 이상 앱을 사용하지 않은 유저가 다시 앱을 열면 "Reactivation"으로 인식됩니다.
              </p>
              <div className="mt-3 rounded-md bg-yellow-50 p-3 text-sm text-yellow-800">
                <strong>중요:</strong> Inactivity Window를 설정하지 않으면 Reactivation Tracking이 동작하지 않습니다.
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="lookback-window">
            <AccordionTrigger>Lookback Window란?</AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">
                Reactivation 이벤트 발생 시, 과거 터치포인트(광고 클릭/노출)를 얼마나 오래 전까지 찾아볼지 결정하는 기간입니다.
                채널별로 다르게 설정할 수 있으며, 4가지 매칭 방식별로 기간을 지정합니다:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                <li><strong>Click - Device Matching:</strong> 클릭 이벤트를 디바이스 ID로 매칭 (기본 7일)</li>
                <li><strong>Click - Probabilistic Modeling:</strong> 클릭 이벤트를 확률적 모델링으로 매칭 (기본 1일)</li>
                <li><strong>View - Device Matching:</strong> 노출 이벤트를 디바이스 ID로 매칭 (기본 1일)</li>
                <li><strong>View - Probabilistic Modeling:</strong> 노출 이벤트를 확률적 모델링으로 매칭 (기본 6시간)</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="attribution-window">
            <AccordionTrigger>Attribution Window란?</AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">
                Reactivation 이후 발생하는 후속 이벤트(인앱 구매, 회원가입 등)를 해당 Reactivation에 귀속시키는 기간입니다.
                예를 들어 7일로 설정하면, Reactivation 발생 후 7일 이내의 이벤트가 해당 Reactivation 성과로 집계됩니다.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="flow">
            <AccordionTrigger>동작 흐름</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Reactivated Attribution의 전체 동작 흐름입니다:
                </p>
                <div className="rounded-lg border bg-muted/50 p-4">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                        1
                      </div>
                      <div>
                        <p className="font-medium">Inactivity Window 설정</p>
                        <p className="text-sm text-muted-foreground">비활성 기준 기간 정의 (예: 7일)</p>
                      </div>
                    </div>
                    <div className="ml-4 h-4 w-px bg-border" />
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                        2
                      </div>
                      <div>
                        <p className="font-medium">유저 비활성 판단</p>
                        <p className="text-sm text-muted-foreground">마지막 활동 + Inactivity Window &lt; 현재 시간?</p>
                      </div>
                    </div>
                    <div className="ml-4 h-4 w-px bg-border" />
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                        3
                      </div>
                      <div>
                        <p className="font-medium">Reactivation 이벤트 발생</p>
                        <p className="text-sm text-muted-foreground">비활성 유저가 앱 실행/설치/딥링크 오픈</p>
                      </div>
                    </div>
                    <div className="ml-4 h-4 w-px bg-border" />
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                        4
                      </div>
                      <div>
                        <p className="font-medium">Lookback Window 적용</p>
                        <p className="text-sm text-muted-foreground">과거 터치포인트 매칭으로 채널 귀속</p>
                      </div>
                    </div>
                    <div className="ml-4 h-4 w-px bg-border" />
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                        5
                      </div>
                      <div>
                        <p className="font-medium">Attribution Window 적용</p>
                        <p className="text-sm text-muted-foreground">후속 이벤트를 Reactivation 성과로 귀속</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
