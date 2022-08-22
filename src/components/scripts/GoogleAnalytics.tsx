import { GOOGLE_ANALYTICS_TRACKING_ID } from '../../constants';

const GoogleAnalytics = () => (
  <>
    <script
      async
      src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_TRACKING_ID}`}
    />
    <script
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GOOGLE_ANALYTICS_TRACKING_ID}', {
page_path: window.location.pathname,
});
`,
      }}
    />
  </>
);

export default GoogleAnalytics;
