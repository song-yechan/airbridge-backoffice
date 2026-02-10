import { useMemo } from 'react';

interface SqlCodeBlockProps {
  sql: string;
}

// SQL 구문 하이라이팅
function highlightSQL(sql: string): React.ReactNode[] {
  const keywords = [
    'SELECT',
    'FROM',
    'WHERE',
    'AND',
    'OR',
    'AS',
    'IN',
    'NOT',
    'GROUP BY',
    'ORDER BY',
    'LIKE',
    'INTERVAL',
  ];
  const functions = [
    'SUM',
    'COUNT',
    'AVG',
    'MAX',
    'MIN',
    'DATE_TRUNC',
    'CAST',
  ];

  const lines = sql.split('\n');
  const result: React.ReactNode[] = [];

  lines.forEach((line, lineIndex) => {
    if (lineIndex > 0) {
      result.push('\n');
    }

    // Comment check
    if (line.trim().startsWith('--')) {
      result.push(
        <span key={`comment-${lineIndex}`} className="text-[#6A9955] italic">
          {line}
        </span>
      );
      return;
    }

    // Tokenize and highlight
    let remaining = line;
    let charIndex = 0;

    while (remaining.length > 0) {
      let matched = false;

      // Check for strings (single quotes)
      if (remaining.startsWith("'")) {
        const endIndex = remaining.indexOf("'", 1);
        if (endIndex !== -1) {
          const str = remaining.substring(0, endIndex + 1);
          result.push(
            <span
              key={`str-${lineIndex}-${charIndex}`}
              className="text-[#CE9178]"
            >
              {str}
            </span>
          );
          remaining = remaining.substring(endIndex + 1);
          charIndex += endIndex + 1;
          matched = true;
        }
      }

      // Check for keywords
      if (!matched) {
        for (const kw of keywords) {
          const pattern = new RegExp(`^(${kw})\\b`, 'i');
          const match = remaining.match(pattern);
          if (match) {
            result.push(
              <span
                key={`kw-${lineIndex}-${charIndex}`}
                className="text-[#569CD6]"
              >
                {match[0]}
              </span>
            );
            remaining = remaining.substring(match[0].length);
            charIndex += match[0].length;
            matched = true;
            break;
          }
        }
      }

      // Check for functions
      if (!matched) {
        for (const fn of functions) {
          const pattern = new RegExp(`^(${fn})\\(`, 'i');
          const match = remaining.match(pattern);
          if (match) {
            result.push(
              <span
                key={`fn-${lineIndex}-${charIndex}`}
                className="text-[#DCDCAA]"
              >
                {fn}
              </span>
            );
            remaining = remaining.substring(fn.length);
            charIndex += fn.length;
            matched = true;
            break;
          }
        }
      }

      // Check for numbers
      if (!matched) {
        const numMatch = remaining.match(/^(\d+)/);
        if (numMatch) {
          result.push(
            <span
              key={`num-${lineIndex}-${charIndex}`}
              className="text-[#B5CEA8]"
            >
              {numMatch[0]}
            </span>
          );
          remaining = remaining.substring(numMatch[0].length);
          charIndex += numMatch[0].length;
          matched = true;
        }
      }

      // Default: take one character
      if (!matched && remaining.length > 0) {
        result.push(remaining[0]);
        remaining = remaining.substring(1);
        charIndex += 1;
      }
    }
  });

  return result;
}

export function SqlCodeBlock({ sql }: SqlCodeBlockProps) {
  const highlighted = useMemo(() => highlightSQL(sql), [sql]);

  return (
    <pre className="bg-[#1E1E1E] rounded-lg p-4 px-5 font-mono text-xs leading-7 text-[#D4D4D4] overflow-x-auto whitespace-pre">
      {highlighted}
    </pre>
  );
}
