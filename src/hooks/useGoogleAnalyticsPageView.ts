import { useEffect, useRef } from 'react';

import { usePathname } from 'next/navigation';

import * as googleAnalytics from '@src/lib/googleAnalytics';

const useGoogleAnalyticsPageView = () => {
  const pathname = usePathname();
  const savedPathNameRef = useRef(pathname);

  useEffect(() => {
    const handleRouteChange = (url: URL) => {
      googleAnalytics.pageView(url);
    };

    if (savedPathNameRef.current !== pathname) {
      handleRouteChange(new URL(window.location.href));
      savedPathNameRef.current = pathname;
    }
  }, [pathname]);
};

export default useGoogleAnalyticsPageView;
