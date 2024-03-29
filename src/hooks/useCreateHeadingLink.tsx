import { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';

import HeadingLink from '@src/components/posts/HeadingLink';

const TARGET_TAGS = ['h2', 'h3'];

const useCreateHeadingLink = (ref: React.Ref<HTMLElement>) => {
  const initializedRef = useRef(false);

  useEffect(() => {
    if (typeof ref === 'function' || !ref) return;
    if (initializedRef.current) return;
    initializedRef.current = true;

    const headingElements = ref.current?.querySelectorAll(
      TARGET_TAGS.join(','),
    );
    if (!headingElements) return;

    headingElements?.forEach((headingEl) => {
      const { id, textContent } = headingEl;

      ReactDOM.createRoot(headingEl).render(
        <HeadingLink href={`#${id}`} text={textContent} />,
      );
    });
  }, [ref]);
};

export default useCreateHeadingLink;
