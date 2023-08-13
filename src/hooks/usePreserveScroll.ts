import { useEffect, useRef } from 'react';

import { usePathname } from 'next/navigation';

export const usePreserveScroll = () => {
  const pathname = usePathname();

  const scrollPositionsRef = useRef<Record<string, number>>({});
  const isPopRef = useRef(false);

  useEffect(() => {
    const handleRouteChangeStart = () => {
      isPopRef.current = true;
      scrollPositionsRef.current[pathname] = window.scrollY;
    };

    const handleRouteChangeComplete = (currentUrl: string) => {
      const currentScrollPosition = scrollPositionsRef.current[currentUrl];
      const shouldScrollRestore = currentScrollPosition !== 0;

      if (shouldScrollRestore) {
        window.scrollTo({ top: currentScrollPosition });
      } else {
        window.scrollTo({ top: 0 });
      }

      isPopRef.current = false;
    };

    handleRouteChangeStart();

    return () => {
      handleRouteChangeComplete(pathname);
    };
  }, [pathname]);
};
