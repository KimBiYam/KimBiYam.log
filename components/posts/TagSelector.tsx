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
) => (
  <div
    className="sticky z-40 flex pt-4 overflow-auto top-12 scrollbar-hide main-container"
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

export default withDragScroll(forwardRef(TagSelector));
