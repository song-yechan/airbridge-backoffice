import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, AlertTriangle, BookOpen, Lightbulb } from "lucide-react";

export function PermissionGuide() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BookOpen className="h-5 w-5" />
          사용 가이드
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="w-full">
          <AccordionItem value="what-is-this">
            <AccordionTrigger>
              <span className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                이 도구는 무엇인가요?
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 text-muted-foreground">
                <p>
                  대행사의 커스텀 채널 캠페인 권한을 설정하는 도구입니다.
                </p>
                <p>
                  특정 캠페인 데이터에만 접근할 수 있도록 필터 조건을 설정하여,
                  대행사가 자신의 캠페인만 볼 수 있게 제한합니다.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="how-to-use">
            <AccordionTrigger>
              <span className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                사용 방법
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <ol className="space-y-2 text-muted-foreground list-decimal list-inside">
                <li>App ID 또는 Name으로 앱을 검색합니다</li>
                <li>권한을 설정할 대행사를 선택합니다</li>
                <li>현재 권한 설정을 확인합니다</li>
                <li>커스텀 채널을 추가하거나 수정합니다</li>
                <li>Data Filter 조건을 설정합니다</li>
                <li>
                  <strong>Apply</strong> 버튼을 클릭하여 저장합니다
                </li>
              </ol>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="filter-types">
            <AccordionTrigger>
              <span className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                필터 타입 설명
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 pr-4">타입</th>
                        <th className="text-left py-2 pr-4">설명</th>
                        <th className="text-left py-2">예시</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b">
                        <td className="py-2 pr-4">
                          <Badge variant="secondary">startswith</Badge>
                        </td>
                        <td className="py-2 pr-4">
                          캠페인명이 특정 문자열로 시작
                        </td>
                        <td className="py-2">
                          <code className="text-xs bg-muted px-1 rounded">
                            summer_
                          </code>{" "}
                          → summer_sale, summer_event
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 pr-4">
                          <Badge variant="secondary">endswith</Badge>
                        </td>
                        <td className="py-2 pr-4">
                          캠페인명이 특정 문자열로 끝남
                        </td>
                        <td className="py-2">
                          <code className="text-xs bg-muted px-1 rounded">
                            _2024
                          </code>{" "}
                          → spring_2024, fall_2024
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 pr-4">
                          <Badge variant="secondary">is</Badge>
                        </td>
                        <td className="py-2 pr-4">정확히 일치</td>
                        <td className="py-2">
                          <code className="text-xs bg-muted px-1 rounded">
                            main_campaign
                          </code>{" "}
                          → 정확히 main_campaign만
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4">
                          <Badge variant="secondary">is_not</Badge>
                        </td>
                        <td className="py-2 pr-4">일치하지 않음</td>
                        <td className="py-2">
                          <code className="text-xs bg-muted px-1 rounded">
                            test
                          </code>{" "}
                          → test 제외 모든 캠페인
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="cautions">
            <AccordionTrigger>
              <span className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                주의사항
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                <li>
                  <strong>Apply</strong> 버튼을 클릭하기 전까지 변경사항이
                  저장되지 않습니다
                </li>
                <li>
                  대시보드에서 대행사 권한을 한 번 이상 수정해야 백오피스로 권한
                  설정이 가능합니다
                </li>
                <li>
                  문제 발생 시{" "}
                  <code className="text-xs bg-muted px-1 rounded">
                    #qna-iam-access-management
                  </code>
                  에 문의해 주세요
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
