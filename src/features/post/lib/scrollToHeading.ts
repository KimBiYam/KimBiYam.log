export const scrollToHeading = (id: string) => {
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;

  document.getElementById(id)?.scrollIntoView({
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
  });
};
