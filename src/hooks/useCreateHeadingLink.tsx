import React, { useCallback } from 'react';
import ReactDOM from 'react-dom/client';

import HeadingLink from '@src/components/posts/HeadingLink';

const TARGET_TAGS = ['h2', 'h3'];

const findHeadingElements = (element: HTMLElement): HTMLElement[] => {
  return Array.from(element.children).reduce<HTMLElement[]>(
    (results, child) => {
      if (!(child instanceof HTMLElement)) return results;

      const newResults = TARGET_TAGS.includes(child.tagName.toLowerCase())
        ? [...results, child]
        : results;

      return [...newResults, ...findHeadingElements(child)];
    },
    [],
  );
};

const useCreateHeadingLink = () => {
  const attachRef = useCallback((el: HTMLElement | null) => {
    if (!el) return;

    const headingElements = findHeadingElements(el);

    headingElements.forEach((headingEl) => {
      const { id, textContent } = headingEl;

      ReactDOM.createRoot(headingEl).render(
        <HeadingLink href={`#${id}`} text={textContent} />,
      );
    });
  }, []);

  return { attachRef };
};

export default useCreateHeadingLink;
