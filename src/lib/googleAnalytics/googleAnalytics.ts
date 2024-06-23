declare global {
  interface Gtag {
    (
      param1: 'event',
      param2: string,
      param3?: Record<string | number | symbol, unknown>,
    ): void;
  }

  interface Window {
    gtag?: Gtag;
  }
}

const GA_EVENT_KEYS = {
  darkModeOn: 'dark_mode_on',
  darkModeOff: 'dark_mode_off',
} as const;

export default class GA {
  static trackEvent(
    eventKey: (typeof GA_EVENT_KEYS)[keyof typeof GA_EVENT_KEYS],
    params?: Record<string | number | symbol, unknown>,
  ) {
    if (!window.gtag) return;
    window.gtag('event', eventKey, params);
  }
}
