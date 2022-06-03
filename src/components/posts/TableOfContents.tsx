import useTableHeadingObserver from '../../hooks/useTableHeadingObserver';
import useTableOfContents from '../../hooks/useTableOfContents';
import TableOfContentsItem from './TableOfContentsItem';

const TableOfContents = () => {
  const headings = useTableOfContents();
  const activeId = useTableHeadingObserver();

  return (
    <nav className="fixed right-0 flex-col hidden mr-8 w-52 lg:flex top-52">
      <ul>
        {headings.map((heading) => (
          <TableOfContentsItem
            key={heading.id}
            heading={heading}
            activeId={activeId}
          >
            {Array.isArray(heading.items) && heading.items?.length > 0 && (
              <ul className="ml-3 text-sm">
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

export default TableOfContents;
