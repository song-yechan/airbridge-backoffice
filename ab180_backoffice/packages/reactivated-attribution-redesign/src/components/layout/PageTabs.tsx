import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { ReactNode } from 'react';

interface PageTabsProps {
  overviewContent: ReactNode;
  settingsContent: ReactNode;
  defaultTab?: 'overview' | 'settings';
}

export function PageTabs({ overviewContent, settingsContent, defaultTab = 'overview' }: PageTabsProps) {
  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="w-full justify-start border-b bg-transparent p-0">
        <TabsTrigger
          value="overview"
          className="rounded-none border-b-2 border-transparent px-6 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
          개요
        </TabsTrigger>
        <TabsTrigger
          value="settings"
          className="rounded-none border-b-2 border-transparent px-6 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
          상세 설정
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="mt-6">
        {overviewContent}
      </TabsContent>
      <TabsContent value="settings" className="mt-6">
        {settingsContent}
      </TabsContent>
    </Tabs>
  );
}
