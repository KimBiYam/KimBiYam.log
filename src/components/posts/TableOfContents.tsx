import { useEffect, useState } from 'react';
import TableOfContentsItem from './TableOfContentsItem';

export interface TableOfContentHeading {
  id: string;
  title: string;
  nodeName: string;
  items?: TableOfContentHeading[];
}

const getTableOfContentHeadings = (headingElements: NodeListOf<HTMLElement>) =>
  Array.from(headingElements).reduce<TableOfContentHeading[]>(
    (total, heading) => {
      const { innerText: title, id, nodeName } = heading;

      if (
        nodeName === 'H3' &&
        total.length > 0 &&
        total[total.length - 1].nodeName === 'H2'
      ) {
        total[total.length - 1].items?.push({
          id,
          title,
          nodeName,
        });
      } else {
        total.push({ id, title, nodeName, items: [] });
      }

      return total;
    },
    [],
  );

const TableOfContents = () => {
  const [headings, setHeadings] = useState<TableOfContentHeading[]>([]);

  useEffect(() => {
    const headingElements = document.querySelectorAll<HTMLElement>('h2,h3');
    const headings = getTableOfContentHeadings(headingElements);

    setHeadings(headings);
  }, []);

  return (
    <nav className="fixed right-0 flex-col hidden mr-8 w-52 lg:flex top-52">
      <ul>
        {headings.map((heading) => (
          <TableOfContentsItem key={heading.id} heading={heading}>
            {Array.isArray(heading.items) && heading.items?.length > 0 && (
              <ul className="ml-3">
                {heading.items?.map((item) => (
                  <TableOfContentsItem key={item.id} heading={item} />
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
