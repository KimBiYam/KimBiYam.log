import { RefObject, useEffect } from 'react';

const useScrollObserver = ({
  targetRef,
  enabled,
  onIntersect,
  root,
  threshold = 1.0,
  rootMargin,
}: {
  targetRef: RefObject<HTMLElement | null>;
  enabled: boolean | undefined;
  onIntersect: () => void;
  root?: Element | Document | null | undefined;
  threshold?: number | number[] | undefined;
  rootMargin?: string;
}) => {
  useEffect(() => {
    if (!enabled) return;

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => entry.isIntersecting && onIntersect()),
      { root, threshold, rootMargin },
    );

    const element = targetRef && targetRef.current;

    if (!element) return;

    observer.observe(element);

    return () => {
      if (observer) observer.unobserve(element);
    };
  }, [enabled, root, threshold, rootMargin, targetRef, onIntersect]);
};

export default useScrollObserver;
