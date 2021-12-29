import { useRouter } from 'next/router';
import { useEffect } from 'react';
import * as googleAnalytics from '../lib/googleAnalytics';

const useGoogleAnalyticsPageView = () => {
  const router = useRouter();

  useEffect(() => {
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
