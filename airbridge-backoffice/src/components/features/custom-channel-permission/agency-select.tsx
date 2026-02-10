import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { AgencyInfo } from "@/types";

interface AgencySelectProps {
  agencies: AgencyInfo[];
  selected: AgencyInfo | null;
  onSelect: (agency: AgencyInfo) => void;
  onClear: () => void;
}

export function AgencySelect({ agencies, selected, onSelect, onClear }: AgencySelectProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filtered = agencies.filter((a) =>
    a.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (agency: AgencyInfo) => {
    onSelect(agency);
    setQuery("");
    setIsOpen(false);
  };

  if (selected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Select Agency</CardTitle>
          <p className="text-sm text-muted-foreground">
            이 앱에 연결된 대행사 중 권한을 설정할 대행사를 선택하세요. 선택하면 해당 대행사의 현재 채널 권한 설정을 조회합니다.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2">
            <div>
              <p className="text-sm font-medium">{selected.name}</p>
              <p className="text-xs text-muted-foreground">
                User Group ID: {selected.userGroupId}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClear}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Select Agency</CardTitle>
        <p className="text-sm text-muted-foreground">
          이 앱에 연결된 대행사 중 권한을 설정할 대행사를 선택하세요. 선택하면 해당 대행사의 현재 채널 권한 설정을 조회합니다.
        </p>
      </CardHeader>
      <CardContent>
        {agencies.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            해당 앱에 연결된 대행사가 없습니다.
          </p>
        ) : (
          <div className="relative">
            <Input
              placeholder="대행사명을 검색하세요"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
            />
            {isOpen && (
              <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover shadow-md max-h-60 overflow-y-auto">
                {filtered.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    검색 결과가 없습니다.
                  </div>
                ) : (
                  filtered.map((agency) => (
                    <button
                      key={agency.id}
                      type="button"
                      className="w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors"
                      onClick={() => handleSelect(agency)}
                    >
                      {agency.name}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
