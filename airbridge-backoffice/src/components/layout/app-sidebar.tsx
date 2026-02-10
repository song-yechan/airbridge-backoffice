import { useLocation, Link } from "react-router-dom";
import {
  Users,
  Building2,
  Calculator,
  Link2,
  Settings,
  RotateCcw,
  Mail,
  Bug,
  ChevronRight,
  BarChart3,
  Copy,
  RefreshCw,
  Shield,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  items?: { title: string; url: string; icon?: React.ComponentType<{ className?: string }> }[];
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navigation: NavGroup[] = [
  {
    label: "Backoffice Management",
    items: [
      {
        title: "Backoffice Admin",
        url: "/admin",
        icon: Users,
        items: [
          { title: "Users", url: "/admin/users" },
          { title: "Service Accounts", url: "/admin/service-accounts" },
          { title: "Permissions", url: "/admin/permissions" },
          { title: "Groups", url: "/admin/groups" },
          { title: "Audit Logs", url: "/admin/audit-logs" },
        ],
      },
      {
        title: "Debugger",
        url: "/debugger",
        icon: Bug,
      },
    ],
  },
  {
    label: "Airbridge",
    items: [
      {
        title: "Org Management",
        url: "/organization-management",
        icon: Building2,
      },
      {
        title: "Calculated Metrics",
        url: "/calculated-metrics",
        icon: Calculator,
      },
      {
        title: "Custom Deduplication",
        url: "/custom-deduplication",
        icon: Copy,
      },
      {
        title: "Event Usage Report",
        url: "/event-usage-report",
        icon: BarChart3,
      },
      {
        title: "Reactivated Attribution",
        url: "/reactivated-attribution",
        icon: RefreshCw,
      },
      {
        title: "Custom Channel Permission",
        url: "/custom-channel-permission",
        icon: Shield,
      },
      {
        title: "Tracking Link Management",
        url: "/tracking-link",
        icon: Link2,
        items: [
          { title: "Tracking Links", url: "/tracking-link/list" },
          { title: "Bulk Create", url: "/tracking-link/bulk" },
        ],
      },
    ],
  },
  {
    label: "Airbridge Internal",
    items: [
      {
        title: "System Management",
        url: "/system-management",
        icon: Settings,
        items: [
          { title: "Report API Reset", url: "/system-management/report-reset", icon: RotateCcw },
        ],
      },
      {
        title: "Email Template",
        url: "/system-management/email-template",
        icon: Mail,
      },
    ],
  },
];

function NavItemComponent({ item }: { item: NavItem }) {
  const location = useLocation();
  const isActive = location.pathname === item.url || location.pathname.startsWith(item.url + "/");

  if (item.items) {
    return (
      <Collapsible asChild defaultOpen={isActive}>
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip={item.title}>
              <item.icon className="mr-2 h-4 w-4 shrink-0" />
              <span className="truncate">{item.title}</span>
              <ChevronRight className="ml-auto h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.items.map((subItem) => (
                <SidebarMenuSubItem key={subItem.url}>
                  <SidebarMenuSubButton
                    asChild
                    isActive={location.pathname === subItem.url}
                  >
                    <Link to={subItem.url}>
                      {subItem.icon && <subItem.icon className="h-3 w-3 mr-1" />}
                      <span>{subItem.title}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
        <Link to={item.url}>
          <item.icon className="mr-2 h-4 w-4 shrink-0" />
          <span className="truncate">{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex h-10 items-center px-2">
          <span className="text-sm font-semibold">AB180 Backoffice</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {navigation.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <NavItemComponent key={item.url} item={item} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
