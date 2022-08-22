import { GOOGLE_ANALYTICS_TRACKING_ID, IS_PRODUCTION } from '../../constants';

declare global {
  type GoogleAnalyticsEvents = 'dark_mode_on' | 'dark_mode_off';

  interface Gtag {
    (param1: string, param2: string, param3: object): void;
  }

  interface Gtag {
    (param1: 'event', param2: GoogleAnalyticsEvents, param3: object): void;
  }

  interface Window {
    gtag?: Gtag;
  }
}

export const pageView = (url: URL) => {
  if (!GOOGLE_ANALYTICS_TRACKING_ID || !window.gtag) return;

  const options: Record<string, unknown> = { page_path: url };

  if (!IS_PRODUCTION) {
    options.debug_mode = true;
  }

  window.gtag('config', GOOGLE_ANALYTICS_TRACKING_ID, options);
};

export const darkModeOn = () => {
  if (!window.gtag) return;
  window.gtag('event', 'dark_mode_on', {});
};

export const darkModeOff = () => {
  if (!window.gtag) return;
  window.gtag('event', 'dark_mode_off', {});
};
