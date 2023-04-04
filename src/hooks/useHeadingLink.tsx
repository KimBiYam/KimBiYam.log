import { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';

import LinkIcon from '../assets/svgs/link_icon.svg';

const useHeadingLink = (ref: React.RefObject<HTMLElement>) => {
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const headingElements = ref.current?.querySelectorAll('h2,h3');
    if (!headingElements) return;

    [...headingElements]?.forEach((headingEl) => {
      const id = headingEl.id;
      const text = headingEl.innerHTML;

      ReactDOM.createRoot(headingEl).render(
        <a
          href={`#${id}`}
          className="flex items-center no-underline hover:underline group"
        >
          {text}
          <LinkIcon className="hidden w-4 h-4 ml-1 group-hover:block opacity-60" />
        </a>,
      );
    });
  }, [ref]);
};

export default useHeadingLink;
