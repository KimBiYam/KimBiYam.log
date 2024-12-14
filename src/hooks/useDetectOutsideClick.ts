import { RefObject, useCallback, useEffect, useState } from 'react';

const useDetectOutsideClick = (
  ref: RefObject<HTMLElement | null>,
  initialState = false,
) => {
  const [isOpen, setIsOpen] = useState(initialState);

  const onClick = useCallback(
    (event: MouseEvent) => {
      if (ref.current !== null && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    },
    [ref],
  );

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('click', onClick);
    }

    return () => {
      window.removeEventListener('click', onClick);
    };
  }, [isOpen, onClick, ref]);

  return [isOpen, setIsOpen] as const;
};

export default useDetectOutsideClick;
