import clsx from 'clsx';

import { TableOfContentHeading } from '../hooks/useTableOfContents';

interface TableOfContentsItemProps {
  heading: TableOfContentHeading;
  onClick: (id: string) => void;
  children?: React.ReactNode;
  isActive: boolean;
  registerChildRef?: (instance: HTMLElement | null, id: string) => void;
}

const TableOfContentsItem = ({
  heading,
  onClick,
  children,
  isActive,
  registerChildRef,
}: TableOfContentsItemProps) => {
  const { id, title } = heading;

  const attachRef = (element: HTMLButtonElement | null) =>
    registerChildRef?.(element, id);

  return (
    <li className="text-sm animate-fade-in">
      <button
        type="button"
        ref={attachRef}
        onClick={() => onClick(id)}
        aria-current={isActive ? 'location' : undefined}
        className={clsx(
          'w-full min-h-11 xl:min-h-9 px-3 py-2 text-left font-medium break-keep cursor-pointer rounded-[10px] transition-colors duration-300 focus-ring',
          isActive
            ? 'bg-accent-violet/15 text-foreground'
            : 'text-muted hover:bg-accent-violet/10 hover:text-foreground',
        )}
      >
        {title}
      </button>
      {children}
    </li>
  );
};

export default TableOfContentsItem;
