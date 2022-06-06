import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';

export const usePreserveScroll = () => {
  const router = useRouter();
  const url = router.asPath;

  const scrollPositionsRef = useRef<Record<string, number>>({});
  const isPopRef = useRef(false);

  useEffect(() => {
    router.beforePopState(() => {
      isPopRef.current = true;
      return true;
    });

    const handleRouteChangeStart = () => {
      scrollPositionsRef.current[url] = window.scrollY;
    };

    const handleRouteChangeComplete = (currentUrl: string) => {
      const currentScrollPosition = scrollPositionsRef.current[currentUrl];
      const shouldScrollRestore =
        isPopRef.current && currentScrollPosition !== 0;

      // HACK: race condition 이슈로 scroll이 실행되지 않는 경우가 생겨 setTimeout 적용
      // Reference : https://stackoverflow.com/a/779785
      if (shouldScrollRestore) {
        setTimeout(() => window.scrollTo({ top: currentScrollPosition }), 0);
      } else {
        setTimeout(() => window.scrollTo({ top: 0 }), 0);
      }

      isPopRef.current = false;
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router]);
};
