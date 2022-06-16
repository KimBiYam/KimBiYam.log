import { useAtomValue } from 'jotai';
import { forwardRef } from 'react';
import scrollAtom from '../../atoms/scrollAtom';
import { ScrollDirection } from '../../constants';
import withDragScroll from '../../hocs/withDragScroll';
import useActiveChildScroll from '../../hooks/useActiveChildScroll';
import TagButton from './TagButton';

interface TagSelectorProps {
  tags: string[];
  onTagClick: (tag: string) => void;
  selectedTag: string;
}

const TagSelector = forwardRef<HTMLDivElement, TagSelectorProps>(
  ({ tags, onTagClick, selectedTag }, ref) => {
    const { direction } = useAtomValue(scrollAtom);
    const { registerChildRef } = useActiveChildScroll({
      activeId: selectedTag,
      parentRef: ref,
    });

    return (
      <div
        className={`sticky z-40 flex pt-4 -mx-6 md:mx-0 overflow-auto scrollbar-hide main-container ${
          direction === ScrollDirection.up ? 'top-14' : 'top-0'
        }`}
        ref={ref}
      >
        {tags.map((tag) => (
          <TagButton
            key={tag}
            tag={tag}
            onTagClick={onTagClick}
            isSelected={tag === selectedTag}
            ref={(instance) => registerChildRef(instance, tag)}
          />
        ))}
      </div>
    );
  },
);

export default withDragScroll(TagSelector);
