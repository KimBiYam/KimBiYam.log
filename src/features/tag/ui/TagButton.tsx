import { memo, useCallback } from 'react';

import clsx from 'clsx';

interface TagButtonProps {
  tag: string;
  onTagClick: (tag: string) => void;
  registerChildRef: (instance: HTMLElement | null, tag: string) => void;
  isSelected: boolean;
}

const TagButton = ({
  isSelected,
  onTagClick,
  registerChildRef,
  tag,
}: TagButtonProps) => {
  const attachRef = useCallback(
    (element: HTMLButtonElement | null) => registerChildRef(element, tag),
    [registerChildRef, tag],
  );

  return (
    <button
      className={clsx(
        'px-4 py-1 mx-1 mb-2 text-xs whitespace-pre duration-300 rounded-xl md:text-sm transition-backgroundColor btn-hover',
        {
          'font-bold bg-slate-300 dark:bg-neutral-500': isSelected,
          'font-semibold text-neutral-400 bg-slate-200 dark:bg-neutral-700 dark:text-neutral-400':
            !isSelected,
        },
      )}
      ref={attachRef}
      type="button"
      onClick={() => onTagClick(tag)}
      aria-pressed={isSelected}
      aria-label={`Filter posts by ${tag} category`}
    >
      {tag.toUpperCase()}
    </button>
  );
};

export default memo(TagButton);
