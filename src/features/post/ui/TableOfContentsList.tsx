import { memo } from 'react';

import TableOfContentsItem from './TableOfContentsItem';
import type { TableOfContentHeading } from '../hooks/useTableOfContents';

interface TableOfContentsListProps {
  headings: TableOfContentHeading[];
  onItemClick: (id: string) => void;
  activeId: string | null;
  registerChildRef: (instance: HTMLElement | null, id: string) => void;
  level?: number;
}

export default memo(function TableOfContentsList({
  activeId,
  headings,
  onItemClick,
  registerChildRef,
  level = 0,
}: TableOfContentsListProps) {
  return (
    <ul style={{ marginLeft: level ? `${level * 0.75}rem` : 0 }}>
      {headings.map((heading) => (
        <TableOfContentsItem
          key={heading.id}
          heading={heading}
          onClick={onItemClick}
          registerChildRef={registerChildRef}
          isActive={activeId === heading.id}
          level={level}
        >
          {Array.isArray(heading.children) && heading.children.length > 0 && (
            <TableOfContentsList
              activeId={activeId}
              headings={heading.children}
              onItemClick={onItemClick}
              registerChildRef={registerChildRef}
              level={level + 1}
            />
          )}
        </TableOfContentsItem>
      ))}
    </ul>
  );
});
