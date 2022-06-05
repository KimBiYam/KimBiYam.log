import { forwardRef } from 'react';
import withDragScroll from '../../hocs/withDragScroll';
import useActiveChildScroll from '../../hooks/useActiveChildScroll';
import useTableHeadingObserver from '../../hooks/useTableHeadingObserver';
import useTableOfContents from '../../hooks/useTableOfContents';
import TableOfContentsItem from './TableOfContentsItem';

const TableOfContents = forwardRef<HTMLElement>((_: unknown, ref) => {
  const headings = useTableOfContents();
  const activeId = useTableHeadingObserver();

  const { registerChildRef } = useActiveChildScroll({
    activeId,
    parentRef: ref,
  });

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
            ref={(instance) => registerChildRef(instance, heading.id)}
          >
            {Array.isArray(heading.items) && heading.items?.length > 0 && (
              <ul className="ml-3">
                {heading.items?.map((item) => (
                  <TableOfContentsItem
                    key={item.id}
                    heading={item}
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
  );
});

export default withDragScroll(TableOfContents);
