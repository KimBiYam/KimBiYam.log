import { forwardRef } from 'react';

import { TableOfContentHeading } from '../../hooks/useTableOfContents';

interface TableOfContentsItemProps {
  heading: TableOfContentHeading;
  onClick: (id: string) => void;
  children?: React.ReactNode;
  activeId: string | null;
}

const TableOfContentsItem = forwardRef<
  HTMLButtonElement,
  TableOfContentsItemProps
>(({ heading, onClick, children, activeId }, ref) => {
  const { id, title } = heading;

  return (
    <li className="my-1 text-sm text-left">
      <button
        type="button"
        ref={ref}
        onClick={() => onClick(id)}
        className={`text-left w-full overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer hover:opacity-100 transition-opacity duration-300 ${
          activeId === id ? 'opacity-100 font-bold' : 'opacity-60'
        }`}
      >
        {title}
      </button>
      {children}
    </li>
  );
});

TableOfContentsItem.displayName = 'TableOfContentsItem';

export default TableOfContentsItem;
