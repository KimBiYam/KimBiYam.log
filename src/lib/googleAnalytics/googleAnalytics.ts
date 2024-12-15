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

export type GaEventKeys = 'dark_mode_on' | 'dark_mode_off';

export default class GA {
  static trackEvent(
    eventKey: GaEventKeys,
    params?: Record<string | number | symbol, unknown>,
  ) {
    if (!window.gtag) return;
    window.gtag('event', eventKey, params);
  }
}
