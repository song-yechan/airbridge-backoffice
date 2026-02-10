import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import type { AppInfo, SearchType } from "@/types";

interface AppSearchSectionProps {
  onAppFound: (app: AppInfo) => void;
  searchApp: (query: string, type: SearchType) => Promise<AppInfo | AppInfo[] | null>;
  isLoading?: boolean;
}

export function AppSearchSection({
  onAppFound,
  searchApp,
  isLoading = false,
}: AppSearchSectionProps) {
  const [searchType, setSearchType] = useState<SearchType>("id");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<AppInfo[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<AppInfo | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("검색어를 입력해주세요");
      return;
    }

    setSearching(true);
    setError(null);
    setSearchResults([]);
    setSelectedApp(null);

    try {
      const result = await searchApp(searchQuery.trim(), searchType);

      if (!result) {
        setError(
          searchType === "id"
            ? "해당 App ID를 찾을 수 없습니다"
            : "검색 결과가 없습니다"
        );
        return;
      }

      if (Array.isArray(result)) {
        if (result.length === 0) {
          setError("검색 결과가 없습니다");
          return;
        }
        if (result.length === 1) {
          setSelectedApp(result[0]);
          onAppFound(result[0]);
        } else {
          setSearchResults(result);
        }
      } else {
        setSelectedApp(result);
        onAppFound(result);
      }
    } catch {
      setError("앱 검색 중 오류가 발생했습니다");
    } finally {
      setSearching(false);
    }
  };

  const handleSelectFromResults = (app: AppInfo) => {
    setSelectedApp(app);
    setSearchResults([]);
    onAppFound(app);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">App 검색</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-3">
          <div className="w-32">
            <Label htmlFor="search-type" className="sr-only">
              검색 타입
            </Label>
            <Select
              value={searchType}
              onValueChange={(v) => setSearchType(v as SearchType)}
            >
              <SelectTrigger id="search-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="id">App ID</SelectItem>
                <SelectItem value="name">App Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Label htmlFor="search-query" className="sr-only">
              검색어
            </Label>
            <Input
              id="search-query"
              placeholder={
                searchType === "id" ? "app_12345" : "앱 이름으로 검색..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={searching || isLoading}
            />
          </div>
          <Button
            onClick={handleSearch}
            disabled={searching || isLoading || !searchQuery.trim()}
          >
            {searching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            <span className="ml-2">검색</span>
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {searchResults.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {searchResults.length}개의 앱을 찾았습니다. 선택해주세요:
            </p>
            <div className="space-y-2">
              {searchResults.map((app) => (
                <button
                  key={app.id}
                  onClick={() => handleSelectFromResults(app)}
                  className="w-full text-left p-3 rounded-md border hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {app.iconUrl && (
                      <img
                        src={app.iconUrl}
                        alt=""
                        className="w-8 h-8 rounded"
                      />
                    )}
                    <div>
                      <p className="font-medium">{app.name}</p>
                      <p className="text-sm text-muted-foreground">{app.id}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
          </div>
        )}

        {selectedApp && !isLoading && (
          <div className="p-4 rounded-md bg-muted/50 border">
            <div className="flex items-center gap-3">
              {selectedApp.iconUrl && (
                <img
                  src={selectedApp.iconUrl}
                  alt=""
                  className="w-10 h-10 rounded"
                />
              )}
              <div className="flex-1">
                <p className="font-medium">{selectedApp.name}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedApp.id} · {selectedApp.timezone}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
