
'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';

interface ExpandableTextProps {
  text: string;
  maxLength?: number;
  className?: string;
}

export function ExpandableText({ text, maxLength = 100, className }: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const isTruncatable = useMemo(() => text.length > maxLength, [text, maxLength]);

  const displayText = useMemo(() => {
    if (!isTruncatable || isExpanded) {
      return text;
    }
    return `${text.substring(0, maxLength)}...`;
  }, [text, maxLength, isExpanded, isTruncatable]);

  const toggleExpanded = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent link navigation if inside an <a> tag
    e.stopPropagation(); // Stop event bubbling
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={className}>
      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{displayText}</p>
      {isTruncatable && (
        <Button
          variant="link"
          onClick={toggleExpanded}
          className="p-0 h-auto text-xs mt-1"
        >
          {isExpanded ? 'Show less' : 'Read more'}
        </Button>
      )}
    </div>
  );
}
