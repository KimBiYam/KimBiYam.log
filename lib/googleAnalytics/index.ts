declare global {
  interface Window {
    gtag: (param1: string, param2: string, param3: object) => void;
  }
}

export const pageView = (url: URL) => {
  if (!process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS) return;

  window.gtag("config", process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
    page_path: url,
  });
};
