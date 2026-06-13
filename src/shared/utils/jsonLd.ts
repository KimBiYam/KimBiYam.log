export const serializeJsonLd = (jsonLd: unknown) =>
  JSON.stringify(jsonLd).replace(/</g, '\\u003c');
