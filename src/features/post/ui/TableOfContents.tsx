'use client';

import { useRef } from 'react';
import { useMediaQuery } from 'react-responsive';

import {
  useActiveChildScroll,
  useDetectPageScrolling,
  useMounted,
} from '@src/shared/hooks';
import breakPoints from '@src/shared/styles/breakPoints.json';

import TableOfContentsList from './TableOfContentsList';
import useActiveHeadingDetector from '../hooks/useActiveHeadingDetector';
import usePostContentElement from '../hooks/usePostContentElement';
import useTableOfContents from '../hooks/useTableOfContents';
import { scrollToHeading } from '../lib/scrollToHeading';

// Desktop table of contents. The <aside> is always rendered and hidden by CSS
// below xl so the grid column is reserved on first paint; the panel itself is
// mounted only at xl and up (after mount, to match the server markup), which
// also gates the scroll tracking.
const TableOfContents = () => {
  const contentElement = usePostContentElement();
  const mounted = useMounted();
  const isUpExtraLargeScreen =
    useMediaQuery({ minWidth: breakPoints.xl }) && mounted;
  const headings = useTableOfContents(contentElement);
  const activeId = useActiveHeadingDetector(
    isUpExtraLargeScreen ? contentElement : null,
  );
  const pageScrolling = useDetectPageScrolling();
  const navRef = useRef<HTMLElement>(null);

  const registerChildRef = useActiveChildScroll({
    activeId,
    parentRef: navRef,
    pageScrolling,
  });

  return (
    <aside className="hidden xl:block">
      {isUpExtraLargeScreen && headings && headings.length > 0 && (
        <div className="sticky flex flex-col gap-3.5 p-[22px] border top-24 rounded-[20px] border-line bg-glass max-h-[calc(100vh-8rem)] animate-fade-in">
          <span className="font-mono text-xs tracking-[0.04em] text-muted">
            ON THIS PAGE
          </span>
          <nav
            aria-label="목차"
            className="relative flex-1 min-h-0 -mx-2 overflow-y-auto scrollbar-thin"
            ref={navRef}
          >
            <TableOfContentsList
              activeId={activeId}
              headings={headings}
              onItemClick={scrollToHeading}
              registerChildRef={registerChildRef}
            />
          </nav>
        </div>
      )}
    </aside>
  );
};

export default TableOfContents;
