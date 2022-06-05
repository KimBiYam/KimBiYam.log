import { forwardRef } from 'react';
import withDragScroll from '../../hocs/withDragScroll';
import useActiveChildScroll from '../../hooks/useActiveChildScroll';
import useTableHeadingObserver from '../../hooks/useTableHeadingObserver';
import useTableOfContents from '../../hooks/useTableOfContents';
import TableOfContentsList from './TableOfContentsList';

const TableOfContents = forwardRef<HTMLElement>((_: unknown, ref) => {
  const headings = useTableOfContents();
  const activeId = useTableHeadingObserver();

  const { registerChildRef } = useActiveChildScroll({
    activeId,
    parentRef: ref,
  });

  return (
    <nav
      className="fixed flex flex-col pb-2 overflow-y-auto scrollbar-hide h-2/3 w-60 right-8 top-24"
      ref={ref}
    >
      <TableOfContentsList
        activeId={activeId}
        headings={headings}
        registerChildRef={registerChildRef}
      />
    </nav>
  );
});

export default withDragScroll(TableOfContents);
