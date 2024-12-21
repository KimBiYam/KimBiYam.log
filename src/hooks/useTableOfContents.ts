import { useEffect, useState } from 'react';

import { POST_HEADING_TARGET_TAGS } from '@src/constants/posts';
import { findElementsByTags } from '@src/utils/elementUtils';

export interface TableOfContentHeading {
  id: string;
  title: string;
  nodeName: string;
  children?: TableOfContentHeading[];
}

const HEADING_TAGS_HIERARCHY = {
  H1: 0,
  H2: 1,
  H3: 2,
  H4: 3,
  H5: 4,
  H6: 5,
} as const;
const isHeadingTags = (
  nodeName: string,
): nodeName is keyof typeof HEADING_TAGS_HIERARCHY =>
  Object.keys(HEADING_TAGS_HIERARCHY).includes(nodeName);

const getTableOfContentHeadings = (headingElements: HTMLElement[]) =>
  Array.from(headingElements).reduce<TableOfContentHeading[]>(
    (acc, { innerText: title, id, nodeName }) => {
      if (!isHeadingTags(nodeName)) return acc;

      const prev = acc[acc.length - 1];
      const currentTagHierarchy = HEADING_TAGS_HIERARCHY[nodeName];
      const prevTagHierarchy =
        !!prev && isHeadingTags(prev.nodeName)
          ? HEADING_TAGS_HIERARCHY[prev.nodeName]
          : null;

      if (prevTagHierarchy !== null && prevTagHierarchy < currentTagHierarchy) {
        prev.children?.push({
          id,
          title,
          nodeName,
        });
      } else {
        acc.push({ id, title, nodeName, children: [] });
      }

      return acc;
    },
    [],
  );

const useTableOfContents = (targetElement: HTMLElement | null) => {
  const [headings, setHeadings] = useState<TableOfContentHeading[]>([]);

  useEffect(() => {
    if (!targetElement) return;

    const headingElements = findElementsByTags(
      targetElement,
      POST_HEADING_TARGET_TAGS,
    );
    const headings = getTableOfContentHeadings(headingElements);

    setHeadings(headings);
  }, [targetElement]);

  return headings;
};

export default useTableOfContents;
