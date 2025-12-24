
import useActiveChildScroll from '@src/features/post/hooks/useActiveChildScroll';

import TagButton from './TagButton';
import { useSelectedTag } from '../hooks';
import { useSetTag } from '../hooks/useTag';

interface TagSelectorProps {
  tags: string[];
  ref?: React.RefObject<HTMLDivElement | null>;
}

export default function TagSelector({ tags, ref }: TagSelectorProps) {
  const selectedTag = useSelectedTag();
  const setTag = useSetTag();
  const registerChildRef = useActiveChildScroll({
    activeId: selectedTag,
    parentRef: ref,
  });

  return (
    <div className="sticky z-40 top-14">
      <div
        className="flex pt-4 -mx-6 overflow-auto md:mx-0 scrollbar-hide main-container"
        ref={ref}
      >
        {tags.map((tag) => (
          <TagButton
            key={tag}
            tag={tag}
            onTagClick={setTag}
            isSelected={tag === selectedTag}
            registerChildRef={registerChildRef}
          />
        ))}
      </div>
    </div>
  );
}
