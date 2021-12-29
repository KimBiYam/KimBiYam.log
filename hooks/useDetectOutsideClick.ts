import { RefObject, useEffect, useState } from 'react';

const useDetectOutsideClick = (
  ref: RefObject<HTMLElement>,
  initialState = false,
) => {
  const [isOpen, setIsOpen] = useState(initialState);

  const onClick = (event: MouseEvent) => {
    if (ref.current !== null && !ref.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('click', onClick);
    }

    return () => {
      window.removeEventListener('click', onClick);
    };
  }, [isOpen, ref]);

  return [isOpen, setIsOpen] as const;
};

export default useDetectOutsideClick;
