'use client';

import { forwardRef } from 'react';

import { useActiveChildScroll } from '@src/shared/hooks';

import TagButton from './TagButton';
interface TagSelectorProps {
  selectedTag: string;
  tags: string[];
}

const TagSelector = forwardRef<HTMLDivElement, TagSelectorProps>(
  ({ selectedTag, tags }, ref) => {
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
              isSelected={tag === selectedTag}
              registerChildRef={registerChildRef}
            />
          ))}
        </div>
      </div>
    );
  },
);

TagSelector.displayName = 'TagSelector';

export default TagSelector;
