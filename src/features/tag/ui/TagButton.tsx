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
        'px-3.5 py-2.5 text-[13px] leading-none whitespace-pre border rounded-full transition-colors duration-300 focus-ring',
        {
          'font-medium text-foreground border-accent-violet/60 bg-accent-violet/15':
            isSelected,
          'text-muted border-line bg-glass hover:text-foreground hover:border-accent-violet/40':
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
