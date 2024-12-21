import { memo, useCallback, useRef } from 'react';

import useActiveChildScroll from '@src/hooks/useActiveChildScroll';
import useActiveHeadingDetector from '@src/hooks/useActiveHeadingDetector';
import useDetectPageScrolling from '@src/hooks/useDetectPageScrolling';
import useTableOfContents from '@src/hooks/useTableOfContents';

import TableOfContentsList from './TableOfContentsList';

const MemoizedTableOfContentsList = memo(TableOfContentsList);

interface TableOfContentsProps {
  targetElement: HTMLElement | null;
}
const TableOfContents = ({ targetElement }: TableOfContentsProps) => {
  const headings = useTableOfContents(targetElement);
  const activeId = useActiveHeadingDetector();
  const pageScrolling = useDetectPageScrolling();
  const navRef = useRef<HTMLElement>(null);

  const registerChildRef = useActiveChildScroll({
    activeId,
    parentRef: navRef,
    pageScrolling,
  });

  const handleItemClick = useCallback((id: string) => {
    const heading = document.getElementById(id);
    heading?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <aside className="absolute left-full">
      <nav
        className="fixed flex flex-col w-56 pr-4 ml-12 overflow-y-auto 2xl:right-8 scrollbar-thin h-2/3 top-36 max-h-[480px]"
        ref={navRef}
      >
        <MemoizedTableOfContentsList
          activeId={activeId}
          headings={headings}
          onItemClick={handleItemClick}
          registerChildRef={registerChildRef}
        />
      </nav>
    </aside>
  );
};

export default TableOfContents;
