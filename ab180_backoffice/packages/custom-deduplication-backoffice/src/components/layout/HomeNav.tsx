import { Home } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PAGES = [
  { name: "Calculated Metric", path: "/ab180_backoffice/calculated-metric-backoffice/" },
  { name: "Custom Channel Permission", path: "/ab180_backoffice/custom-channel-permission-backoffice/" },
  { name: "Custom Deduplication", path: "/ab180_backoffice/custom-deduplication-backoffice/" },
  { name: "Event Usage Report", path: "/ab180_backoffice/event-usage-report/" },
  { name: "Reactivated Attribution", path: "/ab180_backoffice/reactivated-attribution-redesign/" },
];

const CURRENT_PAGE = "Custom Deduplication";

export function HomeNav() {
  const handleNavigate = (pageName: string) => {
    const page = PAGES.find((p) => p.name === pageName);
    if (page && page.name !== CURRENT_PAGE) {
      window.location.href = page.path;
    }
  };

  return (
    <div className="mb-4 flex items-center gap-2">
      <Home className="h-4 w-4 text-muted-foreground" />
      <Select value={CURRENT_PAGE} onValueChange={handleNavigate}>
        <SelectTrigger className="w-[240px] h-8 text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PAGES.map((page) => (
            <SelectItem key={page.path} value={page.name}>
              {page.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
