import React, { useCallback, useEffect, useRef } from 'react';

interface UseActiveItemScrollProps<P> {
  activeId: string | null;
  parentRef?: React.Ref<P>;
  pageScrolling?: boolean;
}

const isRefObject = <T>(ref?: React.Ref<T>): ref is React.RefObject<T | null> =>
  !!ref && typeof ref !== 'function';

const useActiveChildScroll = <P extends HTMLElement, C extends HTMLElement>({
  activeId,
  parentRef,
  pageScrolling,
}: UseActiveItemScrollProps<P>) => {
  const itemRefs = useRef<Record<string, C | null>>({});

  useEffect(() => {
    const activeChildNode = activeId ? itemRefs.current[activeId] : null;
    const parentNodeExists = isRefObject(parentRef) && !!parentRef.current;

    if (!parentNodeExists || !activeChildNode || pageScrolling) {
      return;
    }

    const getScrollPosition = () => {
      const { offsetTop, offsetLeft, offsetHeight, offsetWidth, offsetParent } =
        activeChildNode;

      if (!offsetParent) return null;

      const remainingHeight = offsetParent.clientHeight - offsetHeight;
      const remainingWidth = offsetParent.clientWidth - offsetWidth;
      const topForCenterScroll = offsetTop - remainingHeight / 2;
      const leftForCenterScroll = offsetLeft - remainingWidth / 2;

      return {
        top: topForCenterScroll,
        left: leftForCenterScroll,
      };
    };

    const scrollPosition = getScrollPosition();
    if (!scrollPosition) return;

    const { top, left } = scrollPosition;
    parentRef.current?.scroll({ top, left, behavior: 'smooth' });
  }, [activeId, pageScrolling, parentRef]);

  const registerChildRef = useCallback(
    (instance: C | null, id: string) => {
      itemRefs.current[id] = instance;
    },
    [itemRefs],
  );

  return registerChildRef;
};

export default useActiveChildScroll;
