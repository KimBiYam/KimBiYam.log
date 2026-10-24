'use client';

import { useRef, useState } from 'react';

import TableOfContentsList from './TableOfContentsList';
import usePostContentElement from '../hooks/usePostContentElement';
import useTableOfContents from '../hooks/useTableOfContents';
import { scrollToHeading } from '../lib/scrollToHeading';

// Collapsible table of contents shown above the body below the xl breakpoint.
// The parent renders it only for posts that have headings, so the closed
// summary is part of the server markup and the body never shifts. The list is
// only mounted while open (headings are read from the rendered DOM), so a
// closed (or xl-hidden) panel adds no nodes to the page.
const MobileTableOfContents = () => {
  const contentElement = usePostContentElement();
  const headings = useTableOfContents(contentElement);
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleItemClick = (id: string) => {
    if (detailsRef.current) detailsRef.current.open = false;
    scrollToHeading(id);
  };

  return (
    <details
      ref={detailsRef}
      onToggle={(event) => setIsOpen(event.currentTarget.open)}
      className="mb-8 border rounded-2xl border-line bg-glass xl:hidden group"
    >
      <summary className="flex items-center justify-between px-5 font-mono text-xs cursor-pointer min-h-[52px] tracking-[0.04em] text-muted rounded-2xl focus-ring list-none [&::-webkit-details-marker]:hidden">
        ON THIS PAGE
        <span
          aria-hidden="true"
          className="transition-transform duration-200 group-open:rotate-180"
        >
          ▾
        </span>
      </summary>
      {isOpen && headings && (
        <nav aria-label="목차" className="px-3 pb-3">
          <TableOfContentsList
            activeId={null}
            headings={headings}
            onItemClick={handleItemClick}
          />
        </nav>
      )}
    </details>
  );
};

export default MobileTableOfContents;
