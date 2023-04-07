import { useCallback, useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { Tag } from '../constants';

interface UseTagOptions {
  onChanged?: () => void;
}

const useTag = ({ onChanged }: UseTagOptions = {}) => {
  const router = useRouter();
  const [selectedTag, setSelectedTag] = useState<string>(Tag.all);

  const handleTagClick = useCallback(
    (tag: string) => {
      const path = tag === Tag.all ? '/' : `/?tag=${tag}`;
      router.push(path, undefined, { shallow: true, scroll: true });
      onChanged?.();
    },
    [onChanged, router],
  );

  useEffect(() => {
    if (typeof router.query.tag === 'string') {
      setSelectedTag(router.query.tag);
    } else {
      setSelectedTag(Tag.all);
    }
  }, [setSelectedTag, router.query]);

  return { selectedTag, handleTagClick };
};

export default useTag;
