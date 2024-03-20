import { useEffect, useState } from 'react';

export interface TableOfContentHeading {
  id: string;
  title: string;
  nodeName: string;
  children?: TableOfContentHeading[];
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
        total[total.length - 1].children?.push({
          id,
          title,
          nodeName,
        });
      } else {
        total.push({ id, title, nodeName, children: [] });
      }

      return total;
    },
    [],
  );

const useTableOfContents = () => {
  const [headings, setHeadings] = useState<TableOfContentHeading[]>([]);

  useEffect(() => {
    const headingElements = document.querySelectorAll<HTMLElement>('h2,h3');
    const headings = getTableOfContentHeadings(headingElements);

    setHeadings(headings);
  }, []);

  return headings;
};

export default useTableOfContents;
