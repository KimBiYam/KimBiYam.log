import Link from 'next/link';
import { memo } from 'react';

export type HeaderMenuItemProps = {
  href: string;
  label: string;
  onClick: () => void;
};

const HeaderMenuItem = ({ href, label, onClick }: HeaderMenuItemProps) => (
  <li onClick={onClick}>
    <Link href={href}>
      <a className="flex px-1 py-2 my-1 text-sm font-bold transition-colors rounded-md hover:bg-white dark:hover:bg-gray-500">
        {label}
      </a>
    </Link>
  </li>
);

export default memo(HeaderMenuItem);
