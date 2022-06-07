import React, { useCallback, useEffect, useRef } from 'react';

interface UseActiveItemScrollProps<P> {
  activeId: string | null;
  parentRef: React.Ref<P>;
}

const useActiveChildScroll = <P extends HTMLElement, C extends HTMLElement>({
  activeId,
  parentRef,
}: UseActiveItemScrollProps<P>) => {
  const itemRefs = useRef<Record<string, C | null>>({});

  const isRefObject =
    parentRef && typeof parentRef !== 'function' && parentRef.current;

  useEffect(() => {
    if (!isRefObject || !activeId) return;

    const activeItem = itemRefs.current[activeId];

    if (!activeItem) return;

    const { offsetTop, offsetLeft, offsetHeight, offsetWidth } = activeItem;

    parentRef.current.scrollTo({
      top: offsetTop - offsetHeight,
      left: offsetLeft - offsetWidth,
      behavior: 'smooth',
    });
  }, [activeId]);

  const registerChildRef = useCallback(
    (instance: C | null, id: string) => {
      itemRefs.current[id] = instance;
    },
    [itemRefs],
  );

  return { registerChildRef };
};

export default useActiveChildScroll;
