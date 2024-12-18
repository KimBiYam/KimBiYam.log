import React, { useCallback, useEffect, useState } from 'react';
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
  const [el, setEl] = useState<HTMLElement | null>(null);

  const attachRef = useCallback(setEl, [setEl]);

  useEffect(() => {
    if (!el) return;

    const headingElements = findHeadingElements(el);

    headingElements.forEach((headingEl) => {
      const { id, textContent } = headingEl;

      ReactDOM.createRoot(headingEl).render(
        <HeadingLink href={`#${id}`} text={textContent} />,
      );
    });
  }, [el]);

  return { attachRef };
};

export default useCreateHeadingLink;
