import { forwardRef } from 'react';

import withDragScroll from '../../hocs/withDragScroll';
import useActiveHeadingDetector from '../../hooks/useActiveHeadingDetector';
import useTableOfContents from '../../hooks/useTableOfContents';
import TableOfContentsItem from './TableOfContentsItem';

const TableOfContents = forwardRef<HTMLElement>((_: unknown, ref) => {
  const headings = useTableOfContents();
  const activeId = useActiveHeadingDetector();

  const handleItemClick = (id: string) => {
    const heading = document.getElementById(id);
    heading?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <aside className="absolute left-full">
      <nav
        className="fixed flex flex-col w-56 pr-4 ml-12 overflow-y-auto 2xl:right-8 scrollbar-thin h-2/3 top-36"
        ref={ref}
      >
        <ul>
          {headings.map((heading) => (
            <TableOfContentsItem
              key={heading.id}
              heading={heading}
              onClick={handleItemClick}
              activeId={activeId}
            >
              {Array.isArray(heading.items) && heading.items?.length > 0 && (
                <ul className="ml-3">
                  {heading.items?.map((item) => (
                    <TableOfContentsItem
                      key={item.id}
                      heading={item}
                      onClick={handleItemClick}
                      activeId={activeId}
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
});

export default withDragScroll(TableOfContents);
