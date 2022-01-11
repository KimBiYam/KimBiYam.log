import { forwardRef } from 'react';
import withDragScroll from '../../hocs/withDragScroll';
import TagButton from './TagButton';

export type TagSelectorProps = {
  tags: string[];
  onTagClick: (tag: string) => void;
  selectedTag: string;
};

const TagSelector = (
  { tags, onTagClick, selectedTag }: TagSelectorProps,
  ref: React.Ref<HTMLDivElement>,
) => {
  return (
    <div
      className="pt-4 flex sticky top-12 z-40 overflow-auto scrollbar-hide main-container"
      ref={ref}
    >
      {tags.map((tag) => (
        <TagButton
          key={tag}
          tag={tag}
          onTagClick={onTagClick}
          isSelected={tag === selectedTag}
        />
      ))}
    </div>
  );
};

export default withDragScroll(forwardRef(TagSelector));
