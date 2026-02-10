import { useState, useRef, useEffect } from "react";
import { Search, RefreshCw, X, AppWindow } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AppInfo, AppStatus } from "@/types";
import { searchApps } from "@/data/mock";

interface AppSearchSectionProps {
  appInfo: AppInfo | null;
  onSelect: (app: AppInfo) => void;
  onClear: () => void;
  onRefresh: () => void;
}

const STATUS_STYLE: Record<AppStatus, string> = {
  NORMAL: "bg-green-500 text-white hover:bg-green-500",
  SUSPENDED: "bg-red-500 text-white hover:bg-red-500",
  DEMO: "bg-yellow-500 text-white hover:bg-yellow-500",
};

export function AppSearchSection({ appInfo, onSelect, onClear, onRefresh }: AppSearchSectionProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AppInfo[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 검색어 변경 시 결과 업데이트
  useEffect(() => {
    if (query.trim()) {
      setResults(searchApps(query));
      setIsOpen(true);
      setActiveIndex(-1);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (app: AppInfo) => {
    onSelect(app);
    setQuery("");
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(results[activeIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    onClear();
    setQuery("");
    inputRef.current?.focus();
  };

  // 선택된 앱이 있으면 선택된 상태 표시
  if (appInfo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="h-5 w-5" />
            App 검색
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{appInfo.name}</span>
                <Badge className={STATUS_STYLE[appInfo.status]}>{appInfo.status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                ID: {appInfo.id}{appInfo.plan && ` | Plan: ${appInfo.plan}`}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onRefresh}>
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
              <Button variant="ghost" size="sm" onClick={handleClear}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // 검색 모드
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Search className="h-5 w-5" />
          App 검색
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={containerRef} className="relative">
          {/* 검색 입력 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              placeholder="App ID 또는 App Name을 입력하세요"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.trim() && setIsOpen(true)}
              onKeyDown={handleKeyDown}
              className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          {/* 검색 결과 드롭다운 */}
          {isOpen && (
            <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-lg">
              {results.length === 0 ? (
                <div className="p-4 text-sm text-muted-foreground text-center">
                  검색 결과가 없습니다.
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 px-3 py-2 border-b text-xs text-muted-foreground">
                    <AppWindow className="h-3.5 w-3.5" />
                    Apps ({results.length})
                  </div>
                  <div className="max-h-[300px] overflow-y-auto py-1">
                    {results.map((app, index) => (
                      <button
                        key={app.id}
                        type="button"
                        onClick={() => handleSelect(app)}
                        onMouseEnter={() => setActiveIndex(index)}
                        className={`w-full text-left px-3 py-2.5 text-sm transition-colors ${
                          index === activeIndex ? "bg-accent" : "hover:bg-accent/50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{app.name}</span>
                          <Badge className={`text-[10px] px-1.5 py-0 ${STATUS_STYLE[app.status]}`}>
                            {app.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          ID: {app.id}{app.plan && ` | Plan: ${app.plan}`}
                        </p>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
