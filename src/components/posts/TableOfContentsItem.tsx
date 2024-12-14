import { forwardRef } from 'react';

import clsx from 'clsx';
import { motion } from 'motion/react';

import { TableOfContentHeading } from '@src/hooks/useTableOfContents';

interface TableOfContentsItemProps {
  heading: TableOfContentHeading;
  onClick: (id: string) => void;
  children?: React.ReactNode;
  activeId: string | null;
  level: number;
}

const TableOfContentsItem = forwardRef<
  HTMLButtonElement,
  TableOfContentsItemProps
>(({ heading, onClick, children, activeId, level }, ref) => {
  const { id, title } = heading;

  return (
    <motion.li
      className="text-sm"
      initial={{ x: -15, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: level * 0.15 }}
    >
      <button
        type="button"
        ref={ref}
        onClick={() => onClick(id)}
        className={clsx(
          'text-left w-full cursor-pointer hover:opacity-100 transition-opacity duration-300 btn-hover p-1 rounded-md',
          {
            'opacity-100 font-bold': activeId === id,
            'opacity-60': activeId !== id,
          },
        )}
      >
        {title}
      </button>
      {children}
    </motion.li>
  );
});

TableOfContentsItem.displayName = 'TableOfContentsItem';

export default TableOfContentsItem;
