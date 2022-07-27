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

  const activeChildNode = activeId ? itemRefs.current[activeId] : null;

  useEffect(() => {
    if (!isRefObject || !activeId || !activeChildNode) return;

    const getScrollPosition = () => {
      const { offsetTop, offsetLeft, offsetHeight, offsetWidth, offsetParent } =
        activeChildNode;

      if (!offsetParent) return { top: 0, left: 0 };

      const remainingHeight = offsetParent.clientHeight - offsetHeight;
      const remainingWidth = offsetParent.clientWidth - offsetWidth;
      const topForCenterScroll = offsetTop - remainingHeight / 2;
      const leftForCenterScroll = offsetLeft - remainingWidth / 2;

      return {
        top: topForCenterScroll,
        left: leftForCenterScroll,
      };
    };

    const { top, left } = getScrollPosition();

    parentRef.current.scrollTo({ top, left, behavior: 'smooth' });
  }, [activeId]);

  const registerChildRef = useCallback(
    (instance: C | null, id: string) => {
      itemRefs.current[id] = instance;
    },
    [itemRefs],
  );

  return registerChildRef;
};

export default useActiveChildScroll;
