import { memo } from 'react';

interface TagButtonProps {
  tag: string;
  onTagClick: (tag: string) => void;
  isSelected: boolean;
}

const TagButton = ({ tag, onTagClick, isSelected }: TagButtonProps) => (
  <button
    className={`px-4 py-1 mx-1 mb-2 border-2 rounded-xl text-xs md:text-sm whitespace-pre main-font-color
       ${
         isSelected
           ? 'font-bold border-black dark:border-slate-600'
           : 'font-semibold'
       }`}
    key={tag}
    type="button"
    onClick={() => onTagClick(tag)}
  >
    {tag.toUpperCase()}
  </button>
);

export default memo(TagButton);
