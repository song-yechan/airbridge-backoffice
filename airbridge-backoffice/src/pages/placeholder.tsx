import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <>
      <PageHeader title={title} description={description} />
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">
            이 페이지는 아직 구현되지 않았습니다. Custom Deduplication부터 순차적으로 구현 예정입니다.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
