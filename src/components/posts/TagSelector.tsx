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
    const registerChildRef = useActiveChildScroll({
      activeId: selectedTag,
      parentRef: ref,
    });

    return (
      <div
        className={`sticky z-40 ${
          direction === ScrollDirection.up ? 'top-14' : 'top-0'
        }`}
      >
        <div
          className="flex pt-4 -mx-6 overflow-auto md:mx-0 scrollbar-hide main-container"
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
        <div className="absolute top-0 left-0 right-0 hidden h-full md:-mx-8 md:block -z-10 main-container" />
      </div>
    );
  },
);

export default withDragScroll(TagSelector);
