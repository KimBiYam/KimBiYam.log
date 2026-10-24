'use client';

import { forwardRef } from 'react';

import { useActiveChildScroll } from '@src/shared/hooks';

import TagButton from './TagButton';
interface TagSelectorProps {
  onTagSelect: (tag: string) => void;
  selectedTag: string;
  tags: string[];
}

const TagSelector = forwardRef<HTMLDivElement, TagSelectorProps>(
  ({ onTagSelect, selectedTag, tags }, ref) => {
    const registerChildRef = useActiveChildScroll({
      activeId: selectedTag,
      parentRef: ref,
    });

    return (
      <div
        aria-label="태그 필터"
        className="flex gap-2 px-6 pt-2 pb-8 -mx-6 overflow-auto md:mx-0 md:px-0 scrollbar-hide"
        ref={ref}
        role="group"
      >
        {tags.map((tag) => (
          <TagButton
            key={tag}
            tag={tag}
            isSelected={tag === selectedTag}
            onTagSelect={onTagSelect}
            registerChildRef={registerChildRef}
          />
        ))}
      </div>
    );
  },
);

TagSelector.displayName = 'TagSelector';

export default TagSelector;
