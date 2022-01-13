import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { IS_PRODUCTION } from '../constants';
import * as googleAnalytics from '../lib/googleAnalytics';

const useGoogleAnalyticsPageView = () => {
  const router = useRouter();

  useEffect(() => {
    if (!IS_PRODUCTION) {
      return;
    }

    const handleRouteChange = (url: URL) => {
      googleAnalytics.pageView(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);
};

export default useGoogleAnalyticsPageView;
