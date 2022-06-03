import { forwardRef } from 'react';
import withDragScroll from '../../hocs/withDragScroll';
import useTableHeadingObserver from '../../hooks/useTableHeadingObserver';
import useTableOfContents from '../../hooks/useTableOfContents';
import TableOfContentsItem from './TableOfContentsItem';

const TableOfContents = (_: unknown, ref: React.Ref<HTMLElement>) => {
  const headings = useTableOfContents();
  const activeId = useTableHeadingObserver();

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
          >
            {Array.isArray(heading.items) && heading.items?.length > 0 && (
              <ul className="ml-3">
                {heading.items?.map((item) => (
                  <TableOfContentsItem
                    key={item.id}
                    heading={item}
                    activeId={activeId}
                  />
                ))}
              </ul>
            )}
          </TableOfContentsItem>
        ))}
      </ul>
    </nav>
  );
};

export default withDragScroll(forwardRef(TableOfContents));
