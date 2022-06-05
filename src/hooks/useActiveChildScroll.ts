import React, { useCallback, useEffect, useRef } from 'react';

interface UseActiveItemScrollProps<P> {
  activeId: string;
  parentRef: React.Ref<P>;
}

const useActiveChildScroll = <P extends HTMLElement, C extends HTMLElement>({
  activeId,
  parentRef,
}: UseActiveItemScrollProps<P>) => {
  const itemRefs = useRef<Record<string, C | null>>({});

  useEffect(() => {
    if (!parentRef || typeof parentRef === 'function' || !parentRef.current) {
      return;
    }

    const activeItem = itemRefs.current[activeId];
    parentRef.current.scrollTo({
      top: activeItem?.offsetTop,
      left: activeItem?.offsetLeft,
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
