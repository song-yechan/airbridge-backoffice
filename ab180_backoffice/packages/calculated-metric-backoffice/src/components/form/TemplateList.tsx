import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { templates } from '@/data/mock';
import type { Template } from '@/types';

interface TemplateListProps {
  onSelect: (template: Template) => void;
  selectedTemplate?: string;
}

export function TemplateList({ onSelect, selectedTemplate }: TemplateListProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredTemplates = templates.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.formula.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (template: Template) => {
    onSelect(template);
    setIsOpen(false);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex items-center gap-2.5 mb-2">
        <CollapsibleTrigger asChild>
          <Button
            variant={isOpen ? 'default' : 'outline'}
            size="sm"
            className="gap-1.5"
          >
            📋 수식 템플릿 {isOpen ? '닫기' : '열기'}
            {isOpen ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </Button>
        </CollapsibleTrigger>
        {selectedTemplate && (
          <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
            ✓ "{selectedTemplate}" 적용됨
          </Badge>
        )}
      </div>

      <CollapsibleContent>
        <div className="border rounded-lg overflow-hidden mb-2">
          <div className="p-2 border-b bg-muted">
            <Input
              placeholder="템플릿 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-[30px] text-xs"
            />
          </div>
          <div className="max-h-[260px] overflow-y-auto">
            {filteredTemplates.length === 0 ? (
              <div className="py-4 text-center text-sm text-muted-foreground">
                검색 결과 없음
              </div>
            ) : (
              filteredTemplates.map((template) => (
                <button
                  key={template.name}
                  type="button"
                  onClick={() => handleSelect(template)}
                  className="w-full text-left px-4 py-2.5 border-b last:border-b-0 hover:bg-blue-50 flex justify-between items-center group transition-colors"
                >
                  <div>
                    <span className="text-[13px] font-medium">
                      {template.name}
                    </span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {template.formula}
                    </span>
                  </div>
                  <span className="text-xs text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    적용 →
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
