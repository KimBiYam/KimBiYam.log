import React, { useCallback } from 'react';
import ReactDOM from 'react-dom/client';

import HeadingLink from '@src/components/posts/HeadingLink';
import { POST_HEADING_TARGET_TAGS } from '@src/constants/posts';
import { findElementsByTags } from '@src/utils/elementUtils';

const useCreateHeadingLink = () => {
  const attachRef = useCallback(<T extends HTMLElement>(el: T | null) => {
    if (!el) return;

    const headingElements = findElementsByTags(el, POST_HEADING_TARGET_TAGS);

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
