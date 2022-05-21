import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';

export const usePreserveScroll = () => {
  const router = useRouter();
  const url = router.asPath;

  const scrollPositionsRef = useRef<Record<string, number>>({});
  const isPopRef = useRef(false);

  const isPop = isPopRef.current;
  const currentScrollPosition = scrollPositionsRef.current[url] ?? 0;

  useEffect(() => {
    router.beforePopState(() => {
      isPopRef.current = true;
      return true;
    });

    const handleRouteChangeStart = () => {
      scrollPositionsRef.current[url] = window.scrollY;
    };

    const handleRouteChangeComplete = () => {
      isPopRef.current = false;
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router]);

  return { isPop, currentScrollPosition };
};
