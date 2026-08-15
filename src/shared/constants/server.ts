export const DOMAIN_URL =
  process.env.NEXT_PUBLIC_DOMAIN_URL ?? 'https://kimbiyam.me';

export const DEPLOYMENT_URL =
  process.env.VERCEL_ENV === 'preview' && process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : DOMAIN_URL;
