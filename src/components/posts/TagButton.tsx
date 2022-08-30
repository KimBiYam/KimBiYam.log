import { forwardRef, memo } from 'react';

interface TagButtonProps {
  tag: string;
  onTagClick: (tag: string) => void;
  isSelected: boolean;
}

const TagButton = forwardRef<HTMLButtonElement, TagButtonProps>(
  ({ tag, onTagClick, isSelected }, ref) => (
    <button
      className={`px-4 py-1 mx-1 mb-2 rounded-xl text-xs md:text-sm whitespace-pre main-font-color primary-button-hover
    ${
      isSelected
        ? 'font-bold bg-slate-300 dark:bg-neutral-500'
        : 'font-semibold bg-slate-200 dark:bg-neutral-700'
    }`}
      ref={ref}
      type="button"
      onClick={() => onTagClick(tag)}
    >
      {tag.toUpperCase()}
    </button>
  ),
);

export default memo(TagButton);
