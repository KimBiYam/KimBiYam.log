import { forwardRef } from 'react';
import { useRecoilValue } from 'recoil';
import headerVisibleState from '../../atoms/headerVisibleState';
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
  const isHeaderVisible = useRecoilValue(headerVisibleState);

  return (
    <div
      className={`sticky z-40 flex pt-4 overflow-auto scrollbar-hide main-container ${
        isHeaderVisible ? 'top-14' : 'top-0'
      }`}
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
