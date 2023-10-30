import { useRef } from 'react';

import useActiveChildScroll from '@src/hooks/useActiveChildScroll';
import useActiveHeadingDetector from '@src/hooks/useActiveHeadingDetector';
import useDetectPageScrolling from '@src/hooks/useDetectPageScrolling';
import useTableOfContents from '@src/hooks/useTableOfContents';

import TableOfContentsItem from './TableOfContentsItem';

const TableOfContents = () => {
  const headings = useTableOfContents();
  const activeId = useActiveHeadingDetector();
  const pageScrolling = useDetectPageScrolling();
  const navRef = useRef<HTMLElement>(null);

  const registerChildRef = useActiveChildScroll({
    activeId,
    parentRef: navRef,
    pageScrolling,
  });

  const handleItemClick = (id: string) => {
    const heading = document.getElementById(id);
    heading?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <aside className="absolute left-full">
      <nav
        className="fixed flex flex-col w-56 pr-4 ml-12 overflow-y-auto 2xl:right-8 scrollbar-thin h-2/3 top-36 max-h-[480px]"
        ref={navRef}
      >
        <ul>
          {headings.map((heading) => (
            <TableOfContentsItem
              key={heading.id}
              heading={heading}
              onClick={handleItemClick}
              activeId={activeId}
              ref={(instance) => registerChildRef(instance, heading.id)}
            >
              {Array.isArray(heading.items) && heading.items?.length > 0 && (
                <ul className="ml-3">
                  {heading.items?.map((item) => (
                    <TableOfContentsItem
                      key={item.id}
                      heading={item}
                      onClick={handleItemClick}
                      activeId={activeId}
                      ref={(instance) => registerChildRef(instance, item.id)}
                    />
                  ))}
                </ul>
              )}
            </TableOfContentsItem>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default TableOfContents;
