const GoogleAnalytics = () => (
  <script
    async
    src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING_ID}`}
  />
);

export default GoogleAnalytics;
