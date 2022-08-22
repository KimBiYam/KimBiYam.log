import { GOOGLE_ANALYTICS_TRACKING_ID } from '../../constants';

declare global {
  type GoogleAnalyticsEvents = 'dark_mode_on' | 'dark_mode_off';

  interface Gtag {
    (param1: string, param2: string, param3: object): void;
  }

  interface Gtag {
    (param1: 'event', param2: GoogleAnalyticsEvents, param3: object): void;
  }

  interface Window {
    gtag: Gtag;
  }
}

export const pageView = (url: URL) => {
  if (!GOOGLE_ANALYTICS_TRACKING_ID) return;

  window.gtag('config', GOOGLE_ANALYTICS_TRACKING_ID, {
    page_path: url,
  });
};

export const darkModeOn = () => {
  window.gtag('event', 'dark_mode_on', {});
};

export const darkModeOff = () => {
  window.gtag('event', 'dark_mode_off', {});
};
