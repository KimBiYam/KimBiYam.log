import clsx from 'clsx';
import Link from 'next/link';

import type { MouseEvent } from 'react';

interface TagButtonProps {
  tag: string;
  onTagSelect: (tag: string) => void;
  registerChildRef: (instance: HTMLElement | null, tag: string) => void;
  isSelected: boolean;
}

const TagButton = ({
  isSelected,
  onTagSelect,
  registerChildRef,
  tag,
}: TagButtonProps) => {
  const attachRef = (element: HTMLAnchorElement | null) =>
    registerChildRef(element, tag);
  const href = tag === 'all' ? '/' : `/tags/${encodeURIComponent(tag)}`;
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    onTagSelect(tag);
  };

  return (
    <Link
      className={clsx(
        'px-4 py-1 mx-1 mb-2 text-xs whitespace-pre duration-300 rounded-xl md:text-sm transition-backgroundColor btn-hover',
        {
          'font-bold bg-slate-300 dark:bg-neutral-500': isSelected,
          'font-semibold text-neutral-400 bg-slate-200 dark:bg-neutral-700 dark:text-neutral-400':
            !isSelected,
        },
      )}
      href={href}
      onClick={handleClick}
      ref={attachRef}
      aria-current={isSelected ? 'page' : undefined}
    >
      {tag.toUpperCase()}
    </Link>
  );
};

export default TagButton;
