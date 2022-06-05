import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';

export const usePreserveScroll = () => {
  const router = useRouter();
  const url = router.asPath;

  const scrollPositions = useRef<Record<string, number>>({});
  const isPop = useRef(false);

  useEffect(() => {
    router.beforePopState(() => {
      isPop.current = true;
      return true;
    });

    const handleRouteChangeStart = () => {
      scrollPositions.current[url] = window.scrollY;
    };

    const handleRouteChangeComplete = (currentUrl: string) => {
      const currentScrollPosition = scrollPositions.current[currentUrl];
      const shouldScrollRestore = isPop.current && currentScrollPosition !== 0;

      // HACK: race condition 이슈로 scroll이 실행되지 않는 경우가 생겨 setTimeout 적용
      // Reference : https://stackoverflow.com/a/779785
      if (shouldScrollRestore) {
        setTimeout(() => window.scrollTo({ top: currentScrollPosition }), 0);
      } else {
        setTimeout(() => window.scrollTo({ top: 0 }), 0);
      }

      isPop.current = false;
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router]);
};
