import { forwardRef } from 'react';
import withDragScroll from '../../hocs/withDragScroll';
import useActiveChildScroll from '../../hooks/useActiveChildScroll';
import useActiveHeadingDetector from '../../hooks/useActiveHeadingDetector';
import useTableOfContents from '../../hooks/useTableOfContents';
import TableOfContentsItem from './TableOfContentsItem';

const TableOfContents = forwardRef<HTMLElement>((_: unknown, ref) => {
  const headings = useTableOfContents();
  const activeId = useActiveHeadingDetector();

  const { registerChildRef } = useActiveChildScroll({
    activeId,
    parentRef: ref,
  });

  return (
    <nav
      className="fixed flex flex-col pr-4 overflow-y-auto scrollbar-thin h-2/3 w-60 right-8 top-24"
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
