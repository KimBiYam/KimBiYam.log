export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const IS_BROWSER = typeof window !== 'undefined';
export const GOOGLE_ANALYTICS_TRACKING_ID =
  process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING_ID;
