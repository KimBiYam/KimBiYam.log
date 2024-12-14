import { useCallback } from 'react';

import clsx from 'clsx';
import { motion } from 'motion/react';

import { TableOfContentHeading } from '@src/hooks/useTableOfContents';

interface TableOfContentsItemProps {
  heading: TableOfContentHeading;
  onClick: (id: string) => void;
  children?: React.ReactNode;
  activeId: string | null;
  level: number;
  registerChildRef: (instance: HTMLElement | null, id: string) => void;
}

const TableOfContentsItem = ({
  heading,
  onClick,
  children,
  activeId,
  level,
  registerChildRef,
}: TableOfContentsItemProps) => {
  const { id, title } = heading;

  const attachRef = useCallback(
    (element: HTMLButtonElement | null) => registerChildRef(element, id),
    [id, registerChildRef],
  );

  return (
    <motion.li
      className="text-sm"
      initial={{ x: -15, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: level * 0.15 }}
    >
      <button
        type="button"
        ref={attachRef}
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
};

export default TableOfContentsItem;
