import { memo, useCallback, useRef } from 'react';

import { useDetectPageScrolling } from '@src/shared';

import TableOfContentsList from './TableOfContentsList';
import useActiveChildScroll from '../hooks/useActiveChildScroll';
import useActiveHeadingDetector from '../hooks/useActiveHeadingDetector';
import useTableOfContents from '../hooks/useTableOfContents';

interface TableOfContentsProps {
  targetElement: HTMLElement | null;
}
const TableOfContents = ({ targetElement }: TableOfContentsProps) => {
  const headings = useTableOfContents(targetElement);
  const activeId = useActiveHeadingDetector(targetElement);
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
        <TableOfContentsList
          activeId={activeId}
          headings={headings}
          onItemClick={handleItemClick}
          registerChildRef={registerChildRef}
        />
      </nav>
    </aside>
  );
};

export default memo(TableOfContents);
