import { forwardRef, useEffect, useRef } from 'react';
import withDragScroll from '../../hocs/withDragScroll';
import useTableHeadingObserver from '../../hooks/useTableHeadingObserver';
import useTableOfContents from '../../hooks/useTableOfContents';
import TableOfContentsItem from './TableOfContentsItem';

const TableOfContents = forwardRef<HTMLElement>((_: unknown, ref) => {
  const headings = useTableOfContents();
  const activeId = useTableHeadingObserver();

  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({});

  useEffect(() => {
    if (!ref || typeof ref === 'function' || !ref.current) return;

    const activeItem = itemRefs.current[activeId];
    ref.current.scrollTo({ top: activeItem?.offsetTop, behavior: 'smooth' });
  }, [activeId]);

  return (
    <nav
      className="fixed flex-col hidden pb-2 overflow-y-auto scrollbar-hide h-2/3 w-60 right-8 xl:flex top-24"
      ref={ref}
    >
      <ul>
        {headings.map((heading) => (
          <TableOfContentsItem
            key={heading.id}
            heading={heading}
            activeId={activeId}
            ref={(instance) => {
              itemRefs.current[heading.id] = instance;
            }}
          >
            {Array.isArray(heading.items) && heading.items?.length > 0 && (
              <ul className="ml-3">
                {heading.items?.map((item) => (
                  <TableOfContentsItem
                    key={item.id}
                    heading={item}
                    activeId={activeId}
                    ref={(instance) => {
                      itemRefs.current[item.id] = instance;
                    }}
                  />
                ))}
              </ul>
            )}
          </TableOfContentsItem>
        ))}
      </ul>
    </nav>
  );
});

export default withDragScroll(TableOfContents);
