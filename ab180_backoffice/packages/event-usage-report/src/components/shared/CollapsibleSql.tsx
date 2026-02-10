import { useState } from 'react';
import { ChevronRight, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { SqlCodeBlock } from './SqlCodeBlock';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface CollapsibleSqlProps {
  sql: string;
}

export function CollapsibleSql({ sql }: CollapsibleSqlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(sql);
    setCopied(true);
    toast.success('SQL copied to clipboard');
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mt-4">
      <CollapsibleTrigger asChild>
        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium font-mono text-muted-foreground bg-muted border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors">
          <ChevronRight
            className={cn(
              'h-3 w-3 transition-transform duration-200',
              isOpen && 'rotate-90'
            )}
          />
          SQL Query
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2">
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 h-7 px-2.5 text-xs bg-white/10 border border-white/15 text-zinc-400 hover:bg-white/15 hover:text-white"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 mr-1" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-3 w-3 mr-1" />
                Copy
              </>
            )}
          </Button>
          <SqlCodeBlock sql={sql} />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
