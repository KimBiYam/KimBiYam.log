import { forwardRef } from "react";
import withDragScroll from "../../hocs/withDragScroll";
import TagButton from "./TagButton";

export type TagSelectorProps = {
  tags: string[];
  onTagClick: (tag: string) => void;
  selectedTag: string;
};

const TagSelector = (
  { tags, onTagClick, selectedTag }: TagSelectorProps,
  ref: React.Ref<HTMLDivElement>
) => {
  return (
    <div
      className="w-full pt-4 flex sticky top-12 main-container z-40 overflow-auto scrollbar-hide"
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
