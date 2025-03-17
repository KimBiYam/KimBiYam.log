'use client';

import React, { useCallback, useEffect, useRef } from 'react';

interface Position {
  top: number;
  left: number;
  x: number;
  y: number;
}

interface DragScrollContainerProps {
  children: React.ReactElement<{ ref: React.RefObject<HTMLElement | null> }>;
}

const DragScrollContainer = ({ children }: DragScrollContainerProps) => {
  const ref = useRef<HTMLElement>(null);
  const positionRef = useRef<Position>({ top: 0, left: 0, x: 0, y: 0 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!ref.current) return;

    const dx = e.clientX - positionRef.current.x;
    const dy = e.clientY - positionRef.current.y;

    ref.current.scrollTop = positionRef.current.top - dy;
    ref.current.scrollLeft = positionRef.current.left - dx;
  }, []);

  const handleMouseUp = useCallback(() => {
    if (!ref.current) return;

    ref.current.removeEventListener('mousemove', handleMouseMove);
    ref.current.removeEventListener('mouseup', handleMouseUp);

    ref.current.style.removeProperty('user-select');
  }, [handleMouseMove]);

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      if (!ref.current) return;

      positionRef.current = {
        left: ref.current.scrollLeft,
        top: ref.current.scrollTop,
        x: e.clientX,
        y: e.clientY,
      };

      ref.current.addEventListener('mousemove', handleMouseMove);
      ref.current.addEventListener('mouseup', handleMouseUp);

      ref.current.style.userSelect = 'none';
    },
    [handleMouseMove, handleMouseUp],
  );

  useEffect(() => {
    if (!ref.current) return;
    const copiedRef = ref.current;

    copiedRef.style.overflow = 'auto';
    copiedRef.addEventListener('mousedown', handleMouseDown);

    return () => {
      if (!copiedRef) return;

      copiedRef.removeEventListener('mousedown', handleMouseDown);
      copiedRef.removeEventListener('mousemove', handleMouseMove);
      copiedRef.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseDown, handleMouseMove, handleMouseUp]);

  // eslint-disable-next-line react-compiler/react-compiler
  return React.cloneElement(children, { ref });
};

export default DragScrollContainer;
