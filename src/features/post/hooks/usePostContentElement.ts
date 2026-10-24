import { useEffect, useState } from 'react';

import { POST_CONTENT_ID } from '../constants';

const usePostContentElement = () => {
  const [contentElement, setContentElement] = useState<HTMLElement | null>(
    null,
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setContentElement(document.getElementById(POST_CONTENT_ID));
  }, []);

  return contentElement;
};

export default usePostContentElement;
