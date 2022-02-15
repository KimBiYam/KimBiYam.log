const GoogleAnalytics = () => (
  <>
    <script
      async
      src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING_ID}`}
    />
    <script
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING_ID}', {
page_path: window.location.pathname,
});
`,
      }}
    />
  </>
);

export default GoogleAnalytics;
