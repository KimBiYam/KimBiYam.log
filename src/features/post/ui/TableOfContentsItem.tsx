import { useCallback } from 'react';

import clsx from 'clsx';
import { domAnimation, LazyMotion } from 'motion/react';
import * as m from 'motion/react-m';

import type { TableOfContentHeading } from '../hooks/useTableOfContents';

interface TableOfContentsItemProps {
  heading: TableOfContentHeading;
  onClick: (id: string) => void;
  children?: React.ReactNode;
  isActive: boolean;
  level: number;
  registerChildRef: (instance: HTMLElement | null, id: string) => void;
}

const TableOfContentsItem = ({
  heading,
  onClick,
  children,
  isActive,
  level,
  registerChildRef,
}: TableOfContentsItemProps) => {
  const { id, title } = heading;

  const attachRef = useCallback(
    (element: HTMLButtonElement | null) => registerChildRef(element, id),
    [id, registerChildRef],
  );

  return (
    <LazyMotion features={domAnimation} strict>
      <m.li
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
              'opacity-100 font-bold': isActive,
              'opacity-60': !isActive,
            },
          )}
        >
          {title}
        </button>
        {children}
      </m.li>
    </LazyMotion>
  );
};

export default TableOfContentsItem;
