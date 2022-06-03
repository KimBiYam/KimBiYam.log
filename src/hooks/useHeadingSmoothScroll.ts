import { useRouter } from 'next/router';
import React, { useCallback } from 'react';

const useHeadingSmoothScroll = () => {
  const router = useRouter();

  const handleClick = useCallback(
    (e: MouseEvent | React.MouseEvent, id: string) => {
      e.preventDefault();

      document
        .querySelector(`#${CSS.escape(id)}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      router.replace(`#${id}`);
    },
    [router],
  );

  return handleClick;
};

export default useHeadingSmoothScroll;
