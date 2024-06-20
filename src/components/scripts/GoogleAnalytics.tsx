import Script from 'next/script';

import { GOOGLE_ANALYTICS_TRACKING_ID } from '@src/constants/foundation';

const GoogleAnalytics = () => (
  <>
    <Script
      strategy="afterInteractive"
      src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_TRACKING_ID}`}
    />
    <Script strategy="afterInteractive" id="google-analytics">{`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GOOGLE_ANALYTICS_TRACKING_ID}', {
page_path: window.location.pathname,
});
`}</Script>
  </>
);

export default GoogleAnalytics;
