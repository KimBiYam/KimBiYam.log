import Script from 'next/script';

const GTag = () => (
  <Script
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
);

export default GTag;
