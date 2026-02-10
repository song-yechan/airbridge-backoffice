import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";

interface ActionButtonsProps {
  onApply: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function ActionButtons({
  onApply,
  isLoading = false,
  disabled = false,
}: ActionButtonsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">3. 적용</CardTitle>
      </CardHeader>
      <CardContent>
        <Button
          onClick={onApply}
          disabled={disabled || isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              적용 중...
            </>
          ) : (
            <>
              <Check className="h-4 w-4 mr-2" />
              Apply
            </>
          )}
        </Button>
        {disabled && !isLoading && (
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Platform과 Event Type을 선택해주세요.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
