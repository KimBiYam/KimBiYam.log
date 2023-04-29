import { forwardRef, memo } from 'react';

import clsx from 'clsx';

interface TagButtonProps {
  tag: string;
  onTagClick: (tag: string) => void;
  isSelected: boolean;
}

const TagButton = forwardRef<HTMLButtonElement, TagButtonProps>(
  ({ tag, onTagClick, isSelected }, ref) => (
    <button
      className={clsx(
        'px-4 py-1 mx-1 mb-2 text-xs whitespace-pre duration-300 rounded-xl md:text-sm transition-backgroundColor hover:bg-slate-300 dark:hover:bg-neutral-500',
        {
          'font-bold bg-slate-300 dark:bg-neutral-500': isSelected,
          'font-semibold text-neutral-400 bg-slate-200 dark:bg-neutral-700 dark:text-neutral-400':
            !isSelected,
        },
      )}
      ref={ref}
      type="button"
      onClick={() => onTagClick(tag)}
    >
      {tag.toUpperCase()}
    </button>
  ),
);

TagButton.displayName = 'TagButton';

export default memo(TagButton);
