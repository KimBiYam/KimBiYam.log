import { useEffect, useRef } from 'react';

import { usePathname } from 'next/navigation';

import { pageView } from '@src/lib/googleAnalytics/googleAnalytics';

const useGoogleAnalyticsPageView = () => {
  const pathname = usePathname();
  const savedPathNameRef = useRef(pathname);

  useEffect(() => {
    const handleRouteChange = (url: URL) => {
      pageView(url);
    };

    if (savedPathNameRef.current !== pathname) {
      handleRouteChange(new URL(window.location.href));
      savedPathNameRef.current = pathname;
    }
  }, [pathname]);
};

export default useGoogleAnalyticsPageView;
