import { memo, useCallback, useEffect, useRef, useState } from 'react';

import { useDetectPageScrolling } from '@src/shared';

import TableOfContentsList from './TableOfContentsList';
import useActiveChildScroll from '../hooks/useActiveChildScroll';
import useActiveHeadingDetector from '../hooks/useActiveHeadingDetector';
import useTableOfContents from '../hooks/useTableOfContents';

interface TableOfContentsProps {
  contentId: string;
}
const TableOfContents = ({ contentId }: TableOfContentsProps) => {
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (contentId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTargetElement(document.getElementById(contentId));
    }
  }, [contentId]);

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
