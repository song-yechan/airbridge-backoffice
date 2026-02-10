import { Toaster } from '@/components/ui/sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { PageHeader } from '@/components/layout/PageHeader';
import { HomeNav } from '@/components/layout/HomeNav';
import { GuideAccordion } from '@/components/guide/GuideAccordion';
import { CreateTab } from '@/components/form/CreateTab';
import { ListTab } from '@/components/list/ListTab';

function App() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[920px] mx-auto px-6 py-8 pb-20">
        <HomeNav />
        <PageHeader />
        <Separator className="my-6" />
        <GuideAccordion />

        <Card>
          <Tabs defaultValue="create">
            <TabsList className="w-full justify-start rounded-none border-b bg-card h-auto p-0">
              <TabsTrigger
                value="create"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:shadow-none px-5 py-3"
              >
                생성
              </TabsTrigger>
              <TabsTrigger
                value="list"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:shadow-none px-5 py-3"
              >
                조회/수정
              </TabsTrigger>
            </TabsList>
            <CardContent className="p-6">
              <TabsContent value="create" className="mt-0">
                <CreateTab />
              </TabsContent>
              <TabsContent value="list" className="mt-0">
                <ListTab />
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;
