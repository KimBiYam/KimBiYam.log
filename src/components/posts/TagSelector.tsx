'use client';

import { forwardRef } from 'react';

import useActiveChildScroll from '@src/hooks/useActiveChildScroll';
import { useTag } from '@src/hooks/useTag';

import TagButton from './TagButton';

interface TagSelectorProps {
  tags: string[];
}

const TagSelector = forwardRef<HTMLDivElement, TagSelectorProps>(
  ({ tags }, ref) => {
    const { handleTagClick, selectedTag } = useTag();
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
              onTagClick={handleTagClick}
              isSelected={tag === selectedTag}
              ref={(instance) => {
                registerChildRef(instance, tag);
              }}
            />
          ))}
        </div>
      </div>
    );
  },
);

TagSelector.displayName = 'TagSelector';

export default TagSelector;
