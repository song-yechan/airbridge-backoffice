import { Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
import { CustomDeduplicationPage } from "@/pages/custom-deduplication";
import { EventUsageReportPage } from "@/pages/event-usage-report";
import { ReactivatedAttributionPage } from "@/pages/reactivated-attribution";
import { CustomChannelPermissionPage } from "@/pages/custom-channel-permission";
import { CalculatedMetricsPage } from "@/pages/calculated-metrics";
import { PlaceholderPage } from "@/pages/placeholder";

export function App() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <span className="text-sm text-muted-foreground">AB180 Backoffice</span>
        </header>
        <div className="flex-1 overflow-auto">
          <div className="max-w-[960px] mx-auto px-6 py-8 pb-20">
            <Routes>
              <Route path="/" element={<Navigate to="/custom-deduplication" replace />} />
              <Route path="/custom-deduplication" element={<CustomDeduplicationPage />} />
              <Route path="/event-usage-report" element={<EventUsageReportPage />} />
              <Route path="/reactivated-attribution" element={<ReactivatedAttributionPage />} />
              <Route path="/custom-channel-permission" element={<CustomChannelPermissionPage />} />
              <Route path="/calculated-metrics" element={<CalculatedMetricsPage />} />
              <Route path="/organization-management" element={<PlaceholderPage title="Org Management" description="조직 관리" />} />
              <Route path="/tracking-link/*" element={<PlaceholderPage title="Tracking Link Management" description="트래킹 링크 관리" />} />
              <Route path="/admin/*" element={<PlaceholderPage title="Backoffice Admin" description="관리자 설정" />} />
              <Route path="/debugger" element={<PlaceholderPage title="Debugger" description="디버거" />} />
              <Route path="/system-management/*" element={<PlaceholderPage title="System Management" description="시스템 관리" />} />
              <Route path="*" element={<PlaceholderPage title="404" description="페이지를 찾을 수 없습니다." />} />
            </Routes>
          </div>
        </div>
      </SidebarInset>
      <Toaster position="top-right" />
    </SidebarProvider>
  );
}
