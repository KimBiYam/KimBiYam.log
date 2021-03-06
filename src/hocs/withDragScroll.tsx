import React, { useEffect, useRef } from 'react';

const withDragScroll = <T,>(Component: React.ComponentType<T>) => {
  const DragScrollContainer = (props: T) => {
    const ref = useRef<HTMLElement>(null);
    let position = { top: 0, left: 0, x: 0, y: 0 };

    useEffect(() => {
      if (!ref.current) return;

      ref.current.style.overflow = 'auto';
      ref.current.addEventListener('mousedown', handleMouseDown);

      return () => {
        if (!ref.current) return;

        ref.current.removeEventListener('mousedown', handleMouseDown);
        ref.current.removeEventListener('mousemove', handleMouseMove);
        ref.current.removeEventListener('mouseup', handleMouseUp);
      };
    }, []);

    const handleMouseDown = (e: MouseEvent) => {
      if (!ref.current) return;

      position = {
        left: ref.current.scrollLeft,
        top: ref.current.scrollTop,
        x: e.clientX,
        y: e.clientY,
      };

      ref.current.addEventListener('mousemove', handleMouseMove);
      ref.current.addEventListener('mouseup', handleMouseUp);

      ref.current.style.userSelect = 'none';
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;

      const dx = e.clientX - position.x;
      const dy = e.clientY - position.y;

      ref.current.scrollTop = position.top - dy;
      ref.current.scrollLeft = position.left - dx;
    };

    const handleMouseUp = () => {
      if (!ref.current) return;

      ref.current.removeEventListener('mousemove', handleMouseMove);
      ref.current.removeEventListener('mouseup', handleMouseUp);

      ref.current.style.removeProperty('user-select');
    };

    return <Component {...props} ref={ref} />;
  };

  return DragScrollContainer;
};

export default withDragScroll;
